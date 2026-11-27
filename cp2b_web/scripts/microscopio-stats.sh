#!/usr/bin/env bash
# Leituras do Microscópio de Ideias a partir dos logs do Apache da VM.
# Só lê: não muda nada no servidor. Uso, na VM:
#   bash microscopio-stats.sh            # todo o período que os logs guardam
#   bash microscopio-stats.sh 2026-11    # só um mês (AAAA-MM)
#
# O site não tem ferramenta de analytics: os logs são a única fonte. Como o
# site é uma SPA, quem navega por dentro dele não pede o HTML de novo, mas
# pede os dados à API. Por isso a contagem usa as chamadas da API, uma por
# visualização, venha a pessoa de fora ou de outra página do site:
#   GET /api/content/microscopio     -> a página /microscopio foi aberta
#   GET /api/microscopio/<slug>      -> o artigo <slug> foi aberto
# O GET /api/microscopio (lista) não entra: o artigo também o chama, para os
# relacionados. As cargas diretas do HTML (/microscopio/<slug>) aparecem à
# parte: são as visitas que chegaram de fora (Google, redes, e-mail).
#
# Robôs, o próprio servidor (127.0.0.1, o gerador do sitemap) e respostas
# que não são 200/304 ficam de fora. "Visitantes" é IP + navegador: uma
# estimativa. Se o Apache só enxerga o IP do proxy da Unicamp, ela fica
# baixa demais; a seção 0 mostra se é o caso.

set -euo pipefail
MES="${1:-}"
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

# A pasta de logs do Apache só abre para o root: a lista sai com sudo também.
# Para outro lugar: LOGS="/caminho/a.log /caminho/a.log.1" bash microscopio-stats.sh
LOGS="${LOGS:-$(sudo sh -c 'ls /var/log/apache2/*access*.log* 2>/dev/null' || true)}"
if [ -z "$LOGS" ]; then
  echo "Nenhum log de acesso em /var/log/apache2. Onde o vhost grava:"
  sudo grep -rhiE '^\s*CustomLog' /etc/apache2/sites-enabled/ /etc/apache2/apache2.conf 2>/dev/null | sort -u
  exit 1
fi

sudo zcat -f $LOGS | awk -F'"' -v mes="$MES" '
  BEGIN {
    split("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec", m, " ")
    for (i = 1; i <= 12; i++) num[m[i]] = sprintf("%02d", i)
  }
  {
    n = split($1, a, " "); ip = (a[1] ~ /:[0-9]+$/) ? a[2] : a[1]
    if (!match($1, /\[[0-9]+\/[A-Za-z]+\/[0-9]+/)) next
    split(substr($1, RSTART + 1, RLENGTH - 1), d, "/")
    dia = d[3] "-" num[d[2]] "-" d[1]
    if (mes != "" && substr(dia, 1, 7) != mes) next
    split($2, r, " "); if (r[1] != "GET") next
    path = r[2]; q = ""
    if (index(path, "?")) q = substr(path, index(path, "?"))
    sub(/\?.*/, "", path); sub(/\/$/, "", path)
    split($3, s, " "); if (s[1] != "200" && s[1] != "304") next
    if (ip == "127.0.0.1" || ip == "::1") next
    ua = $6; lua = tolower(ua)
    if (lua ~ /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|preview|curl|wget|python|headless|lighthouse|monitor|uptime/) next
    # Origem: o navegador embutido do app, o fbclid/utm do link, ou o referer
    # reduzido ao domínio.
    ref = $4; sub(/^https?:\/\//, "", ref); sub(/\/.*/, "", ref)
    if (ref == "-" || ref == "") ref = "(direto: link salvo, e-mail, WhatsApp)"
    if (lua ~ /instagram/) ref = "Instagram (app)"
    else if (lua ~ /fban|fbav|fb_iab/) ref = "Facebook (app)"
    else if (lua ~ /linkedinapp/) ref = "LinkedIn (app)"
    else if (q ~ /utm_source=/) { ref = q; sub(/.*utm_source=/, "", ref); sub(/&.*/, "", ref); ref = "utm_source: " ref }
    else if (q ~ /fbclid=/) ref = "Facebook/Instagram (link)"
    if (path == "/api/content/microscopio")            tipo = "lista"
    else if (path ~ /^\/api\/microscopio\/[^\/]+$/)    { tipo = "artigo"; sub(/^\/api\/microscopio\//, "", path) }
    else if (path ~ /^\/microscopio\/[^\/.]+$/)        { tipo = "entrada"; sub(/^\/microscopio\//, "", path) }
    else if (path == "/microscopio")                   { tipo = "entrada"; path = "(lista)" }
    else next
    printf "%s\t%s\t%s\t%s\t%s\t%s\n", tipo, path, ip, dia, ua, ref
  }' > "$TMP"

if [ ! -s "$TMP" ]; then echo "Nenhuma leitura do Microscópio no período."; exit 0; fi

echo "== Período coberto pelos logs"
cut -f4 "$TMP" | sort | sed -n '1p;$p' | paste -sd' ' | sed 's/ / até /'
echo "   (o Debian guarda uns 14 dias de log; para um histórico, rode isto toda semana)"

echo
echo "== 0. IPs distintos no período"
NIP=$(cut -f3 "$TMP" | sort -u | wc -l); echo "   $NIP"
if [ "$NIP" -le 2 ]; then
  echo "   O Apache só vê o proxy da Unicamp. \"Visitantes\" abaixo = navegadores"
  echo "   distintos: estimativa por baixo (dois iPhones com o mesmo Safari = um)."
fi

echo
echo "== 1. Resumo"
awk -F'\t' '
  $1=="lista"  { l++; lv[$3 FS $5]=1 }
  $1=="artigo" { a++; av[$3 FS $5]=1 }
  END {
    nl=0; for (k in lv) nl++; na=0; for (k in av) na++
    printf "   Página /microscopio aberta: %d vezes, %d visitantes\n", l, nl
    printf "   Artigos abertos:            %d vezes, %d visitantes\n", a, na
  }' "$TMP"

echo
echo "== 2. Por artigo (aberturas | visitantes | slug)"
awk -F'\t' '$1=="artigo" { v[$2]++; if (!seen[$2 FS $3 FS $5]++) u[$2]++ }
  END { for (k in v) printf "%6d %6d  %s\n", v[k], u[k], k }' "$TMP" | sort -rn

echo
echo "== 3. Por dia (aberturas de artigo)"
awk -F'\t' '$1=="artigo" { print $4 }' "$TMP" | sort | uniq -c | awk '{ printf "   %s %5d\n", $2, $1 }'

echo
echo "== 4. Chegadas de fora do site (HTML pedido direto), por página"
awk -F'\t' '$1=="entrada" { print $2 }' "$TMP" | sort | uniq -c | sort -rn | head -20

echo
echo "== 5. De onde vêm essas chegadas (referer, fora o próprio site)"
awk -F'\t' '$1=="entrada" { print $6 }' "$TMP" \
  | grep -v '^cp2b\.unicamp\.br$' | sort | uniq -c | sort -rn | head -15

echo
echo "== 5b. Origem por artigo (chegadas | origem | artigo)"
awk -F'\t' '$1=="entrada" && $6!="cp2b.unicamp.br" { print $6 "\t" $2 }' "$TMP" \
  | sort | uniq -c | sort -rn | head -25

echo
echo "== 6. Celular x computador (aberturas de artigo)"
awk -F'\t' '$1=="artigo" { print (tolower($5) ~ /mobile|android|iphone/) ? "celular" : "computador" }' "$TMP" | sort | uniq -c
