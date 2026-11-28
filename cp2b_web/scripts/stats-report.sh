#!/usr/bin/env bash
# Relatório de visitas do site do CP2b, lido do CSV diário (stats-daily.sh).
# Só lê. Uso, na VM:
#   bash stats-report.sh                      # mês corrente
#   bash stats-report.sh 2026-11              # um mês (AAAA-MM)
#   bash stats-report.sh 2026                 # um ano (AAAA)
#   bash stats-report.sh 2026-11 /microscopio # e a série dia a dia de uma página
#   bash stats-report.sh 2026-11 --csv nov.csv  # também grava o total por página
#                                             # num CSV para abrir no Sheets
#
# "Aberturas" é a melhor contagem que cada página tem: as visualizações pela
# API quando a página tem chamada exclusiva (base api), ou as chegadas pelo
# HTML quando não tem (base html). Na base html, quem chegou navegando por
# dentro do site não aparece: a contagem fica por baixo.

set -euo pipefail
export LC_ALL=C

CSV="${CSV:-/var/lib/cp2b-stats/daily.csv}"
PERIODO=""
PAGINA=""
SAIDA=""
while [ $# -gt 0 ]; do
  case "$1" in
    --csv) SAIDA="${2:?--csv precisa do nome do arquivo}"; shift ;;
    [0-9][0-9][0-9][0-9]|[0-9][0-9][0-9][0-9]-[0-9][0-9]) PERIODO="$1" ;;
    /*) PAGINA="${1%/}"; [ -n "$PAGINA" ] || PAGINA="/" ;;
    -h|--help) sed -n '2,15p' "$0"; exit 0 ;;
    *) echo "Argumento desconhecido: $1" >&2; exit 2 ;;
  esac
  shift
done
PERIODO="${PERIODO:-$(date +%Y-%m)}"

if [ ! -r "$CSV" ]; then
  echo "Não consigo ler $CSV (não existe ainda, ou falta sudo)." >&2
  exit 1
fi

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT
# Colunas: 1 date 2 page_type 3 page 4 counted_by 5 arrivals 6 views
# 7 browsers 8-15 src_direct..src_other 16 mobile 17 desktop
awk -F, -v per="$PERIODO" 'NR > 1 && substr($1, 1, length(per)) == per' "$CSV" > "$TMP"
if [ ! -s "$TMP" ]; then
  echo "Nenhum dia de $PERIODO no CSV."
  exit 0
fi

echo "== Período $PERIODO: $(cut -d, -f1 "$TMP" | sort -u | sed -n '1p') a $(cut -d, -f1 "$TMP" | sort -u | sed -n '$p'), $(cut -d, -f1 "$TMP" | sort -u | wc -l | tr -d ' ') dias com dados"

echo
echo "== 1. Por tipo de página"
printf '   %-14s %8s %10s %10s %10s\n' "tipo" "páginas" "aberturas" "chegadas" "via API"
awk -F, '
  { t = $2; ab = ($4 == "api") ? $6 : $5
    if (!(($2 FS $3) in vista)) { vista[$2 FS $3] = 1; np[t]++ }
    a[t] += ab; c[t] += $5; if ($4 == "api") v[t] += $6
    A += ab; C += $5; V += ($4 == "api") ? $6 : 0 }
  END {
    for (t in a) printf "   %-14s %8d %10d %10d %10d\n", t, np[t], a[t], c[t], v[t]
    printf "   %-14s %8s %10d %10d %10d\n", "TOTAL", "", A, C, V
  }' "$TMP" | sort -k1,1 | awk '/TOTAL/ { t = $0; next } { print } END { print t }'

echo
echo "== 2. Páginas mais abertas (aberturas | chegadas | base | página)"
awk -F, '{ k = $2 FS $3 FS $4; a[k] += ($4 == "api") ? $6 : $5; c[k] += $5 }
  END { for (k in a) { split(k, p, FS); printf "%8d %8d  %-4s  %s\n", a[k], c[k], p[3], p[2] } }' "$TMP" \
  | sort -k1,1nr -k4 | head -30

echo
echo "== 3. De onde vêm as chegadas (todas as páginas)"
awk -F, '
  { for (i = 8; i <= 15; i++) s[i] += $i; T += $5 }
  END {
    split("direto (link salvo, e-mail, WhatsApp no celular)|Google|Instagram|Facebook|LinkedIn|WhatsApp (utm ou WhatsApp Web)|aba nova de dentro do site|outros sites", nome, "|")
    for (i = 8; i <= 15; i++) printf "%8d  %5.1f%%  %s\n", s[i], (T ? 100 * s[i] / T : 0), nome[i - 7]
  }' "$TMP" | sort -k1,1nr
awk -F, '{ T += $5 } END { printf "%8d          total de chegadas\n", T }' "$TMP"

echo
echo "== 4. Celular x computador (sobre as aberturas)"
awk -F, '{ m += $16; d += $17 }
  END { t = m + d; printf "   celular     %8d  %5.1f%%\n   computador  %8d  %5.1f%%\n", m, (t ? 100 * m / t : 0), d, (t ? 100 * d / t : 0) }' "$TMP"

echo
if [ -n "$PAGINA" ]; then
  echo "== 5. Dia a dia de $PAGINA (dia | aberturas | chegadas | navegadores)"
  awk -F, -v pg="$PAGINA" '$3 == pg { printf "   %s %8d %8d %8d\n", $1, ($4 == "api") ? $6 : $5, $5, $7; achou = 1 }
    END { if (!achou) print "   Essa página não aparece no período." }' "$TMP"
  BASE=$(awk -F, -v pg="$PAGINA" '$3 == pg { print $4; exit }' "$TMP")
  [ "$BASE" = "html" ] && echo "   (página sem chamada exclusiva da API: conta só as chegadas de fora)"
else
  echo "== 5. Dia a dia, todas as páginas (dia | aberturas | chegadas)"
  awk -F, '{ a[$1] += ($4 == "api") ? $6 : $5; c[$1] += $5 }
    END { for (d in a) printf "   %s %8d %8d\n", d, a[d], c[d] }' "$TMP" | sort
  echo "   Para uma página só: bash stats-report.sh $PERIODO /caminho"
fi

echo
echo "Aberturas: visualizações pela API (base api) ou chegadas pelo HTML (base html)."
echo "Navegadores: IP do visitante + user agent distintos. Até 27/11/2026 o log só"
echo "tinha o IP do proxy da Unicamp, e nesses dias é uma estimativa por baixo."

if [ -n "$SAIDA" ]; then
  awk -F, -v OFS=, '
    BEGIN { print "page_type,page,counted_by,aberturas,arrivals,views,mobile,desktop,src_direct,src_google,src_instagram,src_facebook,src_linkedin,src_whatsapp,src_internal,src_other" }
    { k = $2 FS $3 FS $4; o[k] = 1; a[k] += ($4 == "api") ? $6 : $5; c[k] += $5; v[k] += $6; m[k] += $16; d[k] += $17
      for (i = 8; i <= 15; i++) s[k, i] += $i }
    END { for (k in o) { split(k, p, FS); line = p[1] OFS p[2] OFS p[3] OFS a[k] OFS c[k] OFS ((p[3] == "api") ? v[k] : "") OFS m[k] OFS d[k]
            for (i = 8; i <= 15; i++) line = line OFS s[k, i]
            print line } }' "$TMP" > "$SAIDA.tmp"
  { head -1 "$SAIDA.tmp"; tail -n +2 "$SAIDA.tmp" | sort -t, -k4,4nr; } > "$SAIDA"
  rm -f "$SAIDA.tmp"
  echo
  echo "Total por página gravado em $SAIDA"
fi
