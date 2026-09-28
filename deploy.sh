#!/bin/bash
# deploy.sh - Script de deploy para o servidor CP2B
# Uso: bash deploy.sh
# Executar de qualquer diretório no servidor

set -e  # Interrompe se qualquer comando falhar

REPO_DIR="/var/www/cp2b/repo"
WEB_DIR="$REPO_DIR/cp2b_web"

# O bash lê o roteiro enquanto executa, e o git pull lá embaixo troca este
# arquivo por outro: quem rodava era sempre a versão que já estava no disco,
# a de antes da publicação. Então ele pega a do main e recomeça por ela.
if [ -z "${CP2B_DEPLOY_DO_MAIN:-}" ]; then
    git -C "$REPO_DIR" fetch origin main
    ROTEIRO=$(mktemp)
    git -C "$REPO_DIR" show origin/main:deploy.sh > "$ROTEIRO"
    CP2B_DEPLOY_DO_MAIN=1 exec bash "$ROTEIRO" "$@"
fi

echo "==> Iniciando deploy CP2B..."

cd "$REPO_DIR"
# Commit em produção antes do deploy: é para ele que o rollback volta
# (procedimento em cp2b_web/docs/PUBLICACAO_VM.md).
PREV_COMMIT=$(git rev-parse HEAD)
echo "    Versão atual: $PREV_COMMIT"
echo "$PREV_COMMIT" > "$REPO_DIR/.deploy-anterior"

echo "==> [1/7] Atualizando repositório..."
git pull origin main

echo "==> [2/7] Backup do banco, dos uploads e do .env..."
# Depois do pull, para usar o backup.sh desta versão (o de antes apontava
# para caminhos do layout antigo), e antes de qualquer mudança no banco.
# Pular só de propósito: SKIP_BACKUP=1 bash deploy.sh
if [ "${SKIP_BACKUP:-0}" = "1" ]; then
    echo "    SKIP_BACKUP=1 — backup pulado."
else
    bash "$REPO_DIR/deployment/backup.sh"
fi

echo "==> [3/7] Instalando dependências..."
cd "$WEB_DIR"
npm install
# O backend também: sem isto, as atualizações de segurança das dependências
# dele (nodemailer, express...) só chegavam à VM se alguém instalasse à mão.
(cd "$WEB_DIR/backend" && npm ci --omit=dev)

echo "==> [4/7] Gerando build de produção..."
# O pós-build lê notícias, colunas, entrevistas, eventos e oportunidades da
# API para montar o sitemap e as páginas pré-renderizadas. Sem esta variável
# essas páginas ficavam de fora — e, antes, entravam amostras inventadas no
# lugar delas. Neste passo o backend em execução ainda é o da versão anterior,
# o que basta para a leitura.
export SEO_API_URL="${SEO_API_URL:-http://localhost:3001/api}"
npm run build

echo "==> [5/7] Aplicando migrações do banco de dados..."
# Idempotente: usa CREATE TABLE / ADD COLUMN "IF NOT EXISTS" e ignora
# objetos já existentes. Cria/atualiza tabelas novas (ex.: eventos,
# configurações do site) sem apagar dados. Roda a partir de backend/
# para que o dotenv leia o DATABASE_URL do backend/.env.
cd "$WEB_DIR/backend"
# env -u: limpa variaveis de banco herdadas da sessao. Um `set -a; . ./.env`
# de outro projeto no mesmo shell fazia este passo rodar contra o banco
# daquele projeto, nao contra o do site.
env -u DATABASE_URL -u PGDATABASE -u PGUSER -u PGPASSWORD -u PGHOST -u PGPORT node src/db/init.js

echo "==> [6/7] Reiniciando backend..."
# Mata só quem ESCUTA na 3001 (um node órfão fora do pm2). Sem o
# -sTCP:LISTEN, o lsof listava também as conexões do Apache com o backend, e
# o kill -9 derrubava workers do Apache que atendem PILAR-2b, ABIOVE e Arqueia.
sudo kill -9 $(sudo lsof -t -iTCP:3001 -sTCP:LISTEN) 2>/dev/null || true
pm2 restart cp2b-backend
pm2 save

echo "==> [7/7] Verificando serviço..."
sleep 2
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)

# O painel tem de exigir senha. {"required":false} aqui significa painel
# aberto (ADMIN_PASSWORD ausente do backend/.env).
if ! curl -s http://localhost:3001/api/auth/status | grep -q '"required":true'; then
    echo ""
    echo "ATENÇÃO: /api/auth/status não exige senha — confira ADMIN_PASSWORD em $WEB_DIR/backend/.env"
    exit 1
fi

if [ "$HTTP_STATUS" = "200" ]; then
    echo ""
    echo "Deploy concluído com sucesso! HTTP $HTTP_STATUS ✓"
    echo "Site disponível em: http://10.100.0.104"
else
    echo ""
    echo "ATENÇÃO: curl retornou HTTP $HTTP_STATUS — verifique os logs:"
    echo "  pm2 logs cp2b-backend"
    echo "  sudo tail -n 50 /var/log/apache2/cp2b-error.log"
    exit 1
fi
