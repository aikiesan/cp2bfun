#!/usr/bin/env bash
# Envio mensal das estatísticas do site do CP2b por e-mail: o relatório do mês
# anterior no corpo, e em anexo o CSV do mês e o histórico inteiro. Serve de
# cópia de segurança fora da VM e para acompanhar a evolução do site.
#
# Só contagens: nada de log bruto, que traz o IP de quem visita (dado pessoal)
# e fica só 30 dias na VM.
#
# Uso, na VM (root, porque o CSV é root:adm 640):
#   bash stats-monthly.sh                # mês anterior (o cron roda no dia 1)
#   bash stats-monthly.sh 2026-11        # um mês escolhido
#   bash stats-monthly.sh --dry-run      # monta o e-mail e mostra, sem enviar
#
# Os destinatários ficam na VM, fora do repositório, em /etc/default/cp2b-stats:
#   STATS_EMAIL_TO="a@cp2b.unicamp.br,b@unicamp.br"
# O e-mail sai pela conta SMTP do backend (backend/.env), com o remetente do
# SMTP_FROM, como as confirmações da newsletter.

set -euo pipefail
export LC_ALL=C

SCRIPTS=$(cd "$(dirname "$0")" && pwd)
CONF="${CONF:-/etc/default/cp2b-stats}"
if [ -r "$CONF" ]; then . "$CONF"; fi
CSV="${CSV:-/var/lib/cp2b-stats/daily.csv}"
BACKEND="${BACKEND:-$SCRIPTS/../backend}"

DRY=0
MES=""
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY=1 ;;
    [0-9][0-9][0-9][0-9]-[0-9][0-9]) MES="$arg" ;;
    -h|--help) sed -n '2,18p' "$0"; exit 0 ;;
    *) echo "Argumento desconhecido: $arg (use AAAA-MM ou --dry-run)" >&2; exit 2 ;;
  esac
done
MES="${MES:-$(date -d "$(date +%Y-%m-01) -1 day" +%Y-%m)}"

if [ -z "${STATS_EMAIL_TO:-}" ]; then
  echo "Sem destinatários: defina STATS_EMAIL_TO em $CONF." >&2
  exit 1
fi
if [ ! -r "$CSV" ]; then
  echo "Não consigo ler $CSV (não existe ainda, ou falta sudo)." >&2
  exit 1
fi

# O cron do root não tem o PATH de quem instalou o Node: procura nos lugares
# de costume. NODE=/caminho/do/node no $CONF resolve qualquer outro caso.
if [ -z "${NODE:-}" ]; then
  NODE=$(command -v node 2>/dev/null || true)
  for n in /usr/bin/node /usr/local/bin/node $(ls -d /home/*/.nvm/versions/node/*/bin/node 2>/dev/null | sort -V | tail -1); do
    if [ -z "$NODE" ] && [ -x "$n" ]; then NODE="$n"; fi
  done
fi
if [ -z "$NODE" ]; then
  echo "Node não encontrado: defina NODE=/caminho/do/node em $CONF." >&2
  exit 1
fi

if ! grep -q "^$MES-" "$CSV"; then
  echo "O CSV não tem nenhum dia de $MES: nada a enviar."
  exit 0
fi

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
bash "$SCRIPTS/stats-report.sh" "$MES" > "$TMP/relatorio.txt"
{ head -1 "$CSV"; grep "^$MES-" "$CSV"; } > "$TMP/cp2b-estatisticas-$MES.csv"
cp "$CSV" "$TMP/cp2b-estatisticas-historico.csv"

MES="$MES" TO="$STATS_EMAIL_TO" BACKEND="$BACKEND" DRY="$DRY" \
RELATORIO="$TMP/relatorio.txt" \
ANEXOS="$TMP/cp2b-estatisticas-$MES.csv:$TMP/cp2b-estatisticas-historico.csv" \
  "$NODE" "$SCRIPTS/stats-monthly-email.mjs"
