#!/usr/bin/env bash
# Resumo diário de visitas do site do CP2b, a partir dos logs do Apache.
# Uma linha por página por dia, acrescentada a um CSV que guarda o histórico
# para sempre (o Debian apaga os logs depois de 14 dias).
#
# Uso, na VM, como root (a pasta de logs só abre para root e adm):
#   sudo bash stats-daily.sh               # todo dia completo que ainda não está no CSV
#   sudo bash stats-daily.sh 2026-11-20    # só esse dia
#   sudo bash stats-daily.sh --dry-run     # mostra as linhas, sem gravar
#
# Sem argumento, ele preenche todo dia que os logs ainda guardam e o CSV não
# tem: na primeira vez faz o backfill dos 14 dias; depois, toda noite, só o
# dia de ontem; e se a VM ficou desligada uma noite, recupera o dia perdido.
# Dia que já está no CSV nunca é gravado de novo, então rodar duas vezes é
# seguro. O dia de hoje nunca entra: ainda não acabou.
#
# Como as visitas aparecem no log (o site é uma SPA):
#   - o HTML de uma página (GET /equipe) só é pedido quando a pessoa chega de
#     fora: Google, link compartilhado, endereço digitado. É a "chegada", e o
#     referer, o fbclid ou o utm dizem de onde ela veio;
#   - quem navega por dentro do site não pede o HTML de novo, só os dados à
#     API. Uma chamada conta como visualização de uma página só quando aquela
#     página é a única que a faz (tabela em api_page, abaixo).
#   Páginas sem chamada exclusiva (estáticas) só podem ser contadas pelas
#   chegadas: nelas a coluna views fica vazia, e counted_by diz "html".
#
# Colunas do CSV (o significado de uma coluna nunca muda depois que há dados):
#   date         dia, AAAA-MM-DD, no fuso do servidor (o mesmo do log)
#   page_type    home, pagina (rota fixa), noticia, microscopio, entrevista,
#                oportunidade, evento, album
#   page         caminho da página, ex. /equipe ou /microscopio/<slug>
#   counted_by   api: views conta as chamadas exclusivas da página
#                html: a página não tem chamada exclusiva; views fica vazia
#   arrivals     pedidos do HTML da página (chegadas de fora, e abas novas)
#                feitos por um navegador que rodou o site: o mesmo IP + user
#                agent chamou a API no mesmo dia (toda página do site chama
#                /api/page-settings ao abrir). Varreduras que só baixam o HTML,
#                muitas com user agent de Chrome antigo, ficam de fora
#   views        chamadas exclusivas da API (inclui as chegadas, que também
#                chamam a API); vazio quando counted_by = html
#   browsers     navegadores distintos (IP + user agent) na base da contagem
#                (views se api, arrivals se html). Todo pedido chega pelo
#                proxy da Unicamp com o mesmo IP: é uma estimativa por baixo
#   src_*        origem das chegadas; a soma das src_* é igual a arrivals
#                direct: sem referer (link salvo, e-mail, WhatsApp no celular)
#                google: busca do Google (referer, gclid, app do Google)
#                instagram, facebook, linkedin: app ou site da rede; links
#                  com fbclid sem o app à vista contam como facebook
#                whatsapp: utm_source=whatsapp ou referer do WhatsApp Web
#                internal: aba nova aberta de dentro do próprio site
#                other: qualquer outro site ou utm_source
#   mobile, desktop  divisão da base da contagem (views se api, arrivals se html)
#
# Ficam de fora: tudo que não é GET com 200/304, robôs, pedidos do HTML de
# quem não rodou o site (ver arrivals), o próprio servidor
# (127.0.0.1: o gerador do sitemap chama a API), /admin e /api/auth (e as
# chamadas da API feitas de dentro do /admin), arquivos estáticos, os outros
# apps (/pilar2b, /arqueia, ABIOVE) e as sondas de teste da Microsoft
# (referer *.afd.team). As três primeiras regras vêm de microscopio-stats.sh.

set -euo pipefail
export LC_ALL=C

CSV="${CSV:-/var/lib/cp2b-stats/daily.csv}"
LOGDIR="${LOGDIR:-/var/log/apache2}"
HEADER="date,page_type,page,counted_by,arrivals,views,browsers,src_direct,src_google,src_instagram,src_facebook,src_linkedin,src_whatsapp,src_internal,src_other,mobile,desktop"

DRY=0
DIA=""
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY=1 ;;
    [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]) DIA="$arg" ;;
    -h|--help) sed -n '2,15p' "$0"; exit 0 ;;
    *) echo "Argumento desconhecido: $arg (use AAAA-MM-DD ou --dry-run)" >&2; exit 2 ;;
  esac
done

# Só o log do site do CP2b: o pilar2b.cp2b.unicamp.br tem o seu, à parte.
# Para testar com outros arquivos: LOGS="a.log b.log.2.gz" bash stats-daily.sh
LOGS="${LOGS:-$(ls "$LOGDIR"/cp2b-access.log* 2>/dev/null || true)}"
if [ -z "$LOGS" ]; then
  echo "Nenhum log em $LOGDIR/cp2b-access.log* (falta sudo?)" >&2
  exit 1
fi
for f in $LOGS; do
  [ -r "$f" ] || { echo "Sem permissão para ler $f: rode com sudo." >&2; exit 1; }
done

HOJE="${HOJE:-$(date +%F)}"

# Os dias que os logs guardam. O log de "ontem" (.log.1) pode trazer o
# começo de hoje, e o de hoje o fim de ontem, conforme a hora da rotação:
# por isso cada dia é filtrado pela data da linha, lendo todos os arquivos.
dias_nos_logs() {
  zcat -f $LOGS | awk '
    BEGIN { split("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec", m, " ")
            for (i = 1; i <= 12; i++) num[m[i]] = sprintf("%02d", i) }
    match($0, /\[[0-9]+\/[A-Za-z]+\/[0-9]+:/) {
      split(substr($0, RSTART + 1, RLENGTH - 2), d, "/")
      print d[3] "-" num[d[2]] "-" d[1]
    }' | sort -u
}

if [ "$DRY" -eq 0 ]; then
  # Pasta e CSV legíveis pelo grupo adm (quem já lê os logs), só root grava.
  DIR=$(dirname "$CSV")
  mkdir -p "$DIR"
  if [ ! -s "$CSV" ]; then echo "$HEADER" > "$CSV"; fi
  if getent group adm >/dev/null 2>&1; then chgrp adm "$DIR" "$CSV"; fi
  chmod 750 "$DIR"; chmod 640 "$CSV"
  # Duas execuções ao mesmo tempo (cron + manual) gravariam o mesmo dia duas vezes.
  exec 9>"$CSV.lock"
  flock -n 9 || { echo "Outra execução está gravando o CSV; tente de novo." >&2; exit 1; }
fi

TODOS=$(dias_nos_logs)
if [ -n "$DIA" ]; then
  if [ "$DIA" \> "$HOJE" ] || [ "$DIA" = "$HOJE" ]; then
    echo "$DIA ainda não acabou: só dias anteriores a $HOJE." >&2; exit 2
  fi
  if ! printf '%s\n' "$TODOS" | grep -qx "$DIA"; then
    echo "Os logs não têm linhas de $DIA (guardam de $(printf '%s\n' "$TODOS" | sed -n '1p') a $(printf '%s\n' "$TODOS" | sed -n '$p'))." >&2
    exit 1
  fi
  CANDIDATOS="$DIA"
else
  CANDIDATOS=$(printf '%s\n' "$TODOS" | awk -v hoje="$HOJE" 'NF && $0 < hoje')
fi

ALVO=""
for d in $CANDIDATOS; do
  if [ "$DRY" -eq 0 ] && grep -q "^$d," "$CSV"; then
    echo "$d já está no CSV: pulado."
    continue
  fi
  ALVO="$ALVO $d"
done
if [ -z "${ALVO// /}" ]; then
  echo "Nada a gravar."
  exit 0
fi

# O dia mais antigo dos logs perde os minutos antes da rotação, que estavam
# num arquivo já apagado.
MAIS_ANTIGO=$(printf '%s\n' "$TODOS" | sed -n '1p')
case " $ALVO " in
  *" $MAIS_ANTIGO "*) echo "Aviso: $MAIS_ANTIGO é o dia mais antigo dos logs e pode faltar o começo da madrugada." >&2 ;;
esac

LINHAS=$(zcat -f $LOGS | awk -F'"' -v dias="$ALVO" '
  BEGIN {
    split("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec", m, " ")
    for (i = 1; i <= 12; i++) num[m[i]] = sprintf("%02d", i)
    n = split(dias, ds, " "); for (i = 1; i <= n; i++) quer[ds[i]] = 1
    # Rotas fixas do site (App.jsx e ROUTES de scripts/generate-seo.mjs).
    split("/sobre /sobre/governanca /sobre/indicadores /sobre/transparencia /sobre/parceiros /eixos /solucoes /capacitacao /equipe /noticias /oportunidades /publicacoes /microscopio /eventos /galeria /entrevistas /press-kit /podcast /boletins /metaninho /newsletter /forum-paulista /contato /outros /confirmar-meetup", r, " ")
    for (i in r) ROTA[r[i]] = 1
    # Rotas fixas que têm uma chamada exclusiva da API (ver api_page).
    split("/sobre /sobre/governanca /sobre/transparencia /sobre/parceiros /eixos /microscopio /publicacoes /eventos /podcast /press-kit /boletins", r, " ")
    for (i in r) COMAPI[r[i]] = 1
  }

  # HTML pedido -> página (T = tipo, P = caminho). 0 se não é página do site.
  function html_page(p) {
    if (p == "" || p == "/index.html") { T = "home"; P = "/"; return 1 }
    if (p in ROTA) { T = "pagina"; P = p; return 1 }
    if (p ~ /^\/noticias\/[^\/.]+$/)      { T = "noticia";      P = p; return 1 }
    if (p ~ /^\/microscopio\/[^\/.]+$/)   { T = "microscopio";  P = p; return 1 }
    if (p ~ /^\/entrevistas\/[^\/.]+$/)   { T = "entrevista";   P = p; return 1 }
    if (p ~ /^\/oportunidades\/[^\/.]+$/) { T = "oportunidade"; P = p; return 1 }
    if (p ~ /^\/eventos\/[^\/.]+$/)       { T = "evento";       P = p; return 1 }
    if (p ~ /^\/(galeria|gallery)\/[^\/.]+$/) { T = "album"; P = p; sub(/^\/gallery\//, "/galeria/", P); return 1 }
    return 0
  }

  # Chamada da API -> página que é a única a fazê-la (src/services/api.js e
  # src/pages/). Chamadas compartilhadas não contam: /api/news (Home, lista e
  # notícia), /api/microscopio (lista e relacionados do artigo), /api/projects,
  # /api/opportunities, /api/gallery, /api/team/grouped, /api/settings.
  function api_page(p, q,    s) {
    if (p == "/api/featured")          { T = "home";   P = "/"; return 1 }
    if (p == "/api/content/about")     { T = "pagina"; P = "/sobre"; return 1 }
    if (p == "/api/content/governance")   { T = "pagina"; P = "/sobre/governanca"; return 1 }
    if (p == "/api/content/transparency") { T = "pagina"; P = "/sobre/transparencia"; return 1 }
    if (p == "/api/content/microscopio")  { T = "pagina"; P = "/microscopio"; return 1 }
    if (p == "/api/partners/grouped")  { T = "pagina"; P = "/sobre/parceiros"; return 1 }
    if (p == "/api/axes")              { T = "pagina"; P = "/eixos"; return 1 }
    # Cada filtro de /publicacoes refaz a chamada com parâmetros: só a
    # primeira, sem filtro, é a abertura da página.
    if (p == "/api/publications" && (q == "" || q == "?")) { T = "pagina"; P = "/publicacoes"; return 1 }
    if (p == "/api/events")            { T = "pagina"; P = "/eventos"; return 1 }
    if (p == "/api/podcast")           { T = "pagina"; P = "/podcast"; return 1 }
    if (p == "/api/press-kit")         { T = "pagina"; P = "/press-kit"; return 1 }
    if (p == "/api/boletins")          { T = "pagina"; P = "/boletins"; return 1 }
    if (p ~ /^\/api\/[a-z]+\/[^\/]+$/) {
      s = p; sub(/^\/api\/[a-z]+\//, "", s)
      if (p ~ /^\/api\/news\//          && s != "featured") { T = "noticia";      P = "/noticias/" s;      return 1 }
      if (p ~ /^\/api\/microscopio\//)                      { T = "microscopio";  P = "/microscopio/" s;   return 1 }
      if (p ~ /^\/api\/projects\//      && s != "featured") { T = "entrevista";   P = "/entrevistas/" s;   return 1 }
      if (p ~ /^\/api\/opportunities\//)                    { T = "oportunidade"; P = "/oportunidades/" s; return 1 }
      if (p ~ /^\/api\/events\//)                           { T = "evento";       P = "/eventos/" s;       return 1 }
    }
    return 0
  }

  function tem_api(t, p) { return (t == "pagina") ? (p in COMAPI) : (t != "album") }

  # Origem de uma chegada: o app pelo user agent, depois o utm/fbclid/gclid
  # do link, depois o domínio do referer.
  function origem(lua, q, ref,    u, d) {
    if (lua ~ /instagram/) return "instagram"
    if (lua ~ /fban|fbav|fb_iab/) return "facebook"
    if (lua ~ /linkedinapp/) return "linkedin"
    if (q ~ /[?&]utm_source=/) {
      u = q; sub(/.*[?&]utm_source=/, "", u); sub(/&.*/, "", u); u = tolower(u)
      if (u ~ /^google/) return "google"
      if (u == "instagram" || u == "ig") return "instagram"
      if (u == "facebook" || u == "fb") return "facebook"
      if (u == "linkedin") return "linkedin"
      if (u == "whatsapp" || u == "wa") return "whatsapp"
      return "other"
    }
    if (q ~ /[?&]fbclid=/) return "facebook"
    if (q ~ /[?&]gclid=/) return "google"
    if (ref == "-" || ref == "") return "direct"
    # Apps Android mandam android-app://<pacote>/ como referer.
    if (ref ~ /^android-app:\/\//) {
      d = ref; sub(/^android-app:\/\//, "", d); sub(/\/.*/, "", d)
      if (d == "com.google.android.gm") return "direct"   # Gmail: é e-mail
      if (d ~ /googlequicksearchbox/) return "google"
      if (d ~ /instagram/) return "instagram"
      if (d ~ /facebook/) return "facebook"
      if (d ~ /linkedin/) return "linkedin"
      if (d ~ /whatsapp/) return "whatsapp"
      return "other"
    }
    d = tolower(ref); sub(/^[a-z]+:\/\//, "", d); sub(/[\/:?].*/, "", d)
    if (d == "cp2b.unicamp.br" || d ~ /\.cp2b\.unicamp\.br$/) return "internal"
    if (d ~ /(^|\.)google\.[a-z.]+$/) return "google"
    if (d ~ /(^|\.)instagram\.com$/) return "instagram"
    if (d ~ /(^|\.)(facebook\.com|fb\.com|fb\.me)$/) return "facebook"
    if (d ~ /(^|\.)(linkedin\.com|lnkd\.in)$/) return "linkedin"
    if (d ~ /(^|\.)whatsapp\.(com|net)$/) return "whatsapp"
    return "other"
  }

  function conta_base(k, ip, ua, lua) {
    if (!((k SUBSEP ip SUBSEP ua) in viu)) { viu[k SUBSEP ip SUBSEP ua] = 1; nav[k]++ }
    if (lua ~ /mobile|android|iphone|ipad/) cel[k]++; else pc[k]++
  }

  {
    if (!match($1, /\[[0-9]+\/[A-Za-z]+\/[0-9]+:/)) next
    split(substr($1, RSTART + 1, RLENGTH - 2), d, "/")
    dia = d[3] "-" num[d[2]] "-" d[1]
    if (!(dia in quer)) next
    n = split($1, a, " "); ip = (a[1] ~ /:[0-9]+$/) ? a[2] : a[1]
    if (ip == "127.0.0.1" || ip == "::1") next
    split($2, r, " "); if (r[1] != "GET") next
    split($3, s, " "); if (s[1] != "200" && s[1] != "304") next
    ua = $6; lua = tolower(ua)
    if (lua ~ /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|preview|curl|wget|python|headless|lighthouse|monitor|uptime/) next
    ref = $4
    if (ref ~ /afd\.team/) next
    path = r[2]; q = ""
    if (index(path, "?")) { q = substr(path, index(path, "?")); path = substr(path, 1, index(path, "?") - 1) }
    sub(/\/$/, "", path)

    if (path ~ /^\/api\//) {
      # O painel /admin usa as mesmas rotas públicas para editar: não é visita.
      if (ref ~ /^https?:\/\/[^\/]+\/admin/) next
      js[dia SUBSEP ip SUBSEP ua] = 1   # este navegador rodou o site hoje
      if (!api_page(path, q)) next
      k = dia SUBSEP T SUBSEP P
      tipo[k] = T; pag[k] = P; vis[k]++
      if (tem_api(T, P)) conta_base(k, ip, ua, lua)
    } else {
      if (!html_page(path)) next
      # Só conta no fim, quando já se sabe se este navegador chamou a API.
      n_ch++
      ch_dia[n_ch] = dia; ch_t[n_ch] = T; ch_p[n_ch] = P; ch_ip[n_ch] = ip
      ch_ua[n_ch] = ua; ch_src[n_ch] = origem(lua, q, ref)
    }
  }

  END {
    for (i = 1; i <= n_ch; i++) {
      if (!((ch_dia[i] SUBSEP ch_ip[i] SUBSEP ch_ua[i]) in js)) continue
      T = ch_t[i]; P = ch_p[i]
      k = ch_dia[i] SUBSEP T SUBSEP P
      tipo[k] = T; pag[k] = P; che[k]++
      src[k SUBSEP ch_src[i]]++
      if (!tem_api(T, P)) conta_base(k, ch_ip[i], ch_ua[i], tolower(ch_ua[i]))
    }
    for (k in tipo) {
      split(k, kk, SUBSEP)
      p = pag[k]; gsub(/[,"]/, "_", p)
      api = tem_api(tipo[k], pag[k])
      printf "%s,%s,%s,%s,%d,%s,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d\n", \
        kk[1], tipo[k], p, (api ? "api" : "html"), che[k], (api ? sprintf("%d", vis[k]) : ""), nav[k], \
        src[k SUBSEP "direct"], src[k SUBSEP "google"], src[k SUBSEP "instagram"], \
        src[k SUBSEP "facebook"], src[k SUBSEP "linkedin"], src[k SUBSEP "whatsapp"], \
        src[k SUBSEP "internal"], src[k SUBSEP "other"], cel[k], pc[k]
    }
  }' | sort -t, -k1,1 -k2,2 -k3,3)

if [ -z "$LINHAS" ]; then
  echo "Nenhuma visita contável em:$ALVO"
  exit 0
fi

if [ "$DRY" -eq 1 ]; then
  echo "$HEADER"
  echo "$LINHAS"
  exit 0
fi

echo "$LINHAS" >> "$CSV"
for d in $ALVO; do
  printf '%s: %s páginas gravadas\n' "$d" "$(printf '%s\n' "$LINHAS" | grep -c "^$d,")"
done
