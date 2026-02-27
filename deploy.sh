#!/bin/bash
# deploy.sh - Script de deploy para o servidor CP2B
# Uso: bash deploy.sh
# Executar de qualquer diretório no servidor

set -e  # Interrompe se qualquer comando falhar

REPO_DIR="/var/www/cp2b/repo"
WEB_DIR="$REPO_DIR/cp2b_web"

echo "==> Iniciando deploy CP2B..."

echo "==> [1/5] Atualizando repositório..."
cd "$REPO_DIR"
git pull origin main

echo "==> [2/5] Instalando dependências..."
cd "$WEB_DIR"
npm install

echo "==> [3/5] Gerando build de produção..."
npm run build

echo "==> [4/5] Reiniciando backend..."
pm2 restart cp2b-backend
pm2 save

echo "==> [5/5] Verificando serviço..."
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
