#!/bin/bash
# deploy.sh - Script de deploy para o servidor CP2B
# Uso: bash deploy.sh
# Executar de qualquer diretório no servidor

set -e  # Interrompe se qualquer comando falhar

REPO_DIR="/var/www/cp2b/repo"
WEB_DIR="$REPO_DIR/cp2b_web"

echo "==> Iniciando deploy CP2B..."

echo "==> [1/6] Atualizando repositório..."
cd "$REPO_DIR"
git pull origin main

echo "==> [2/6] Instalando dependências..."
cd "$WEB_DIR"
npm install

echo "==> [3/6] Gerando build de produção..."
npm run build

echo "==> [4/6] Aplicando migrações do banco de dados..."
# Idempotente: usa CREATE TABLE / ADD COLUMN "IF NOT EXISTS" e ignora
# objetos já existentes. Cria/atualiza tabelas novas (ex.: eventos,
# configurações do site) sem apagar dados. Roda a partir de backend/
# para que o dotenv leia o DATABASE_URL do backend/.env.
cd "$WEB_DIR/backend"
node src/db/init.js

echo "==> [5/6] Reiniciando backend..."
# Kill any orphan process holding port 3001 before restarting
sudo kill -9 $(sudo lsof -t -i :3001) 2>/dev/null || true
pm2 restart cp2b-backend
pm2 save

echo "==> [6/6] Verificando serviço..."
sleep 2
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)

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
