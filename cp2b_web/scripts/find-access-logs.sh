#!/usr/bin/env bash
# Procura, na VM, todo lugar que pode guardar visitas ao site e conta quantas
# linhas de cada um falam do Microscópio. Só lê: não muda nada.
# Uso: bash find-access-logs.sh

echo "== 1. Pasta de logs do Apache (dono e permissão)"
sudo ls -la /var/log/apache2/ 2>&1 | head -40

echo
echo "== 2. Onde cada site grava (CustomLog / ErrorLog / LogFormat)"
sudo grep -rnHiE '^\s*(CustomLog|ErrorLog|LogFormat|TransferLog)' /etc/apache2/ 2>/dev/null
echo "   APACHE_LOG_DIR = $(sudo grep -h APACHE_LOG_DIR= /etc/apache2/envvars 2>/dev/null)"

echo
echo "== 3. Sites ativos e o nome de cada um"
sudo apache2ctl -S 2>&1 | head -30

echo
echo "== 4. Logs de acesso em qualquer lugar de /var/log, /var/www e /home (últimos 120 dias)"
sudo find /var/log /var/www /home /opt -xdev -type f \
  \( -iname '*access*' -o -iname '*.log' -o -iname '*.log.[0-9]*' -o -iname '*.log.*.gz' \) \
  -mtime -120 -size +0 2>/dev/null \
  | grep -viE 'node_modules|/\.npm/|journal' | sort > /tmp/logs-candidatos.txt
wc -l < /tmp/logs-candidatos.txt

echo
echo "== 5. Quais deles citam o Microscópio (linhas | arquivo)"
while read -r f; do
  n=$(sudo zcat -f "$f" 2>/dev/null | grep -c 'microscopio')
  [ "$n" -gt 0 ] && printf '%8d  %s\n' "$n" "$f"
done < /tmp/logs-candidatos.txt | sort -rn | head -30

echo
echo "== 6. Primeira e última linha do Microscópio no arquivo com mais ocorrências"
TOP=$(while read -r f; do
  n=$(sudo zcat -f "$f" 2>/dev/null | grep -c 'microscopio'); echo "$n $f"
done < /tmp/logs-candidatos.txt | sort -rn | head -1 | cut -d' ' -f2-)
if [ -n "$TOP" ]; then
  echo "   $TOP"
  sudo zcat -f "$TOP" | grep 'microscopio' | sed -n '1p;$p'
fi

echo
echo "== 7. Logs do backend no pm2 (também registram /api/microscopio?)"
ls -la ~/.pm2/logs/ 2>/dev/null | grep -i cp2b
grep -c 'microscopio' ~/.pm2/logs/cp2b-backend-out*.log 2>/dev/null
grep 'microscopio' ~/.pm2/logs/cp2b-backend-out*.log 2>/dev/null | tail -2

echo
echo "== 8. Rotação dos logs do Apache (quantos dias ficam guardados)"
grep -E 'daily|weekly|rotate' /etc/logrotate.d/apache2 2>/dev/null
