# Patch do vhost para publicar a Arqueia em `/arqueia`

Alvo: **`/etc/apache2/sites-available/cp2b.unicamp.br.conf`** na VM `cp2b-web`.

Não é `deployment/apache2/cp2b.conf` deste repositório — aquele arquivo está
defasado e não é o que está no ar (ver o cabeçalho dele).

Estado verificado na VM em 11/09/2026:

- `ProxyPreserveHost On` já está declarado no topo do vhost, convivendo com
  `/pilar2b`, `/abiove` e `/api/`. **Não mexer nele** — a checagem anti-CSRF do
  BFF da Arqueia depende dessa diretiva; sem ela todo login responde 403.
- O `<Directory>` da SPA usa `AllowOverride All`, então as regras de rewrite
  efetivas vêm do `.htaccess` publicado em `dist/`. A exclusão de `/arqueia`
  já está no `cp2b_web/public/.htaccess` e chega em produção pelo build normal
  do site. A alteração no vhost abaixo é redundância defensiva.
- `arqueia-api`, `arqueia-web` e `arqueia-worker` já rodam no pm2. O `web`
  escuta em `127.0.0.1:4002`.

## 1. Bloco a inserir

Depois do bloco `── PILAR-2b SSR ──` e antes do `<Directory /var/www/cp2b/repo/cp2b_web/dist>`:

```apache
    # ── Arqueia — gestão laboratorial (Next.js/BFF em 127.0.0.1:4002) ──
    # O Next atende também /arqueia/api/* como BFF; a API NestJS (4001)
    # permanece privada em loopback e nunca é publicada pelo Apache.
    ProxyPass        /arqueia http://127.0.0.1:4002/arqueia
    ProxyPassReverse /arqueia http://127.0.0.1:4002/arqueia

    <Location /arqueia>
        RequestHeader set X-Forwarded-Proto "https"
        RequestHeader set X-Forwarded-Host "cp2b.unicamp.br"
        RequestHeader set X-Forwarded-Prefix "/arqueia"
    </Location>
```

## 2. Exclusão no fallback da SPA

Dentro do `<Directory /var/www/cp2b/repo/cp2b_web/dist>`, logo abaixo da linha
`RewriteCond %{REQUEST_URI} !^/abiove`:

```apache
        RewriteCond %{REQUEST_URI} !^/arqueia
```

## 3. Aplicar

```bash
sudo cp /etc/apache2/sites-available/cp2b.unicamp.br.conf \
        /etc/apache2/sites-available/cp2b.unicamp.br.conf.bak-$(date +%Y%m%d-%H%M%S)
sudoedit /etc/apache2/sites-available/cp2b.unicamp.br.conf
sudo /usr/sbin/apache2ctl configtest
sudo systemctl reload apache2
```

## 4. Antes de expor: rebuildar a Arqueia com o prefixo

O build que está rodando no pm2 é anterior às correções de base path — sob
`/arqueia` a navegação sai do app. Em `/data/arqueia/repo`:

```bash
git pull origin main
npm ci
set -a; . ./.env; set +a
NEXT_PUBLIC_BASE_PATH=/arqueia npm run build
pm2 startOrReload infrastructure/pm2/ecosystem.config.js --update-env
pm2 save
```

`NEXT_PUBLIC_BASE_PATH` precisa estar igual no `.env`, no build e no
`ecosystem.config.js`. Divergência entre build e runtime faz o login parecer
bem-sucedido e voltar para a tela de login, porque o cookie é gravado com
`path` diferente do que o app lê.

## 5. Verificar

```bash
curl -I http://127.0.0.1:4002/arqueia/login
curl -I https://cp2b.unicamp.br/arqueia/login

# A checagem de origem só falha em mutação; o GET acima não a exercita.
curl -s -o /dev/null -w '%{http_code}\n' -X POST \
  -H 'Origin: https://cp2b.unicamp.br' -H 'Content-Type: application/json' \
  -d '{"email":"invalido@unicamp.br","password":"senha-invalida-proposital"}' \
  https://cp2b.unicamp.br/arqueia/api/session/login

# Regressão: as rotas vizinhas não podem quebrar.
curl -s -o /dev/null -w 'pilar2b:%{http_code}\n' https://cp2b.unicamp.br/pilar2b/pt-BR
curl -s -o /dev/null -w 'abiove:%{http_code}\n'  https://cp2b.unicamp.br/abiove/
curl -s -o /dev/null -w 'spa:%{http_code}\n'     https://cp2b.unicamp.br/sobre
```

O POST deve responder **401** (credencial inválida). Se responder **403**,
`ProxyPreserveHost On` saiu do vhost.

No browser, em `https://cp2b.unicamp.br/arqueia`: nenhum link da navegação sai
de `/arqueia`, os logos carregam, `DevTools → Application → Manifest` reporta
`scope: /arqueia/` sem erro de escopo, e o service worker instala sem
`SecurityError`.

## Pendência conhecida

O banco em uso na VM é `arqueia_homolog`. Definir se a exposição pública em
`https://cp2b.unicamp.br/arqueia` aponta para ele ou para um banco `arqueia`
de produção separado — o runbook em `docs/deployment/VM-DEPLOYMENT.md` do
repositório da Arqueia descreve o segundo caso.
