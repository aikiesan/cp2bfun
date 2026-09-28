# Publicação na VM da Unicamp — segunda, 28/09/2026

Roteiro para levar ao ar a versão com a página de Capacitação, o logo do CP2b
no centro dos eixos e o pacote de segurança e SEO preparado em 26/09. O
`deployment/GO_LIVE_CHECKLIST.md` é o resumo de bolso; aqui está o caminho
inteiro: o que resolver ainda hoje, o ensaio de domingo, a publicação, a
conferência e como voltar atrás.

| | |
|---|---|
| Máquina | `cp2b-web` (10.100.0.104), Debian |
| Código | `/var/www/cp2b/repo` (o site é o `cp2b_web/`) |
| Site | `cp2b_web/dist/`, servido pelo vhost `/etc/apache2/sites-available/cp2b.unicamp.br.conf`. Como ele usa `AllowOverride All`, as regras do site vêm do `dist/.htaccess` |
| API | pm2 `cp2b-backend`, porta 3001, configuração em `cp2b_web/backend/.env` |
| Banco | `cp2b_db`, usuário `cp2b_user` |
| Vizinhos na VM | PILAR-2b (`/pilar2b`), Arqueia (`/arqueia`) e ABIOVE |
| TLS | termina no proxy da Unicamp, antes do Apache |

> ⚠️ O banco chamado só `cp2b` é do PILAR-2b. Nenhum comando deste roteiro
> aponta para ele, e nenhum deve.
>
> ⚠️ Não copie `deployment/apache2/cp2b.conf` para o Apache. Ele está defasado,
> e o vhost de verdade atende também as outras aplicações da VM.

---

## 1. Hoje, com o site atual no ar

Duas coisas do site que está em produção não dá para deixar até segunda.

### 1.1 Leituras da API abertas sem login

O backend em produção tem dois furos, corrigidos nesta versão:

- O filtro do painel diferencia maiúsculas; o Express, não. `/api/Contact`,
  com C maiúsculo, entrega as mensagens do formulário de contato sem senha. O
  mesmo vale para os inscritos da newsletter, os participantes do Fórum e os
  pedidos de meetup.
- Algumas leituras nem estavam na lista do filtro. `/api/participants/search`
  devolve nome, instituição e **e-mail** dos participantes do Fórum para
  qualquer um, e `/api/meetup-requests/my` também abre sem login. As listas
  `/all` de boletins, podcast e press kit (com os rascunhos) idem, mas ali o
  estrago é adiantar texto que ia ser publicado de qualquer jeito.

Até a publicação, dá para fechar a parte de dados pessoais no Apache, sem
mexer no código. Dentro do `<VirtualHost>` de `cp2b.unicamp.br.conf`:

```apache
# Provisório (26/09/2026): fecha as leituras com dado pessoal que o backend
# antigo deixa abertas. Pode sair depois da publicação de 28/09.
<LocationMatch "^/api/(?=.*[A-Z])(?i:contact|newsletter/subscribers|participants|meetup-requests)">
    Require all denied
</LocationMatch>
<LocationMatch "(?i)^/api/(participants/search|meetup-requests/my)">
    Require all denied
</LocationMatch>
```

A primeira regra só pega os caminhos com maiúscula, então o painel (que usa
tudo em minúscula, com senha) segue funcionando. A segunda fecha duas rotas
que o site não usa mais desde o fim das inscrições do Fórum.

```bash
sudo apachectl configtest && sudo systemctl reload apache2
curl -s -o /dev/null -w '%{http_code}\n' https://cp2b.unicamp.br/api/Contact                   # 403
curl -s -o /dev/null -w '%{http_code}\n' 'https://cp2b.unicamp.br/api/participants/search?q=a'  # 403
curl -s -o /dev/null -w '%{http_code}\n' https://cp2b.unicamp.br/api/contact                   # 401
```

Depois, veja nos logs se alguém já passou por ali (os de acesso rotacionados
entram também, o `zgrep` lê os `.gz`):

```bash
sudo zgrep -hE '"(GET|HEAD) /api/[^ ?]*[A-Z]|"GET /api/(participants/search|meetup-requests/my)' \
  /var/log/apache2/*access*.log* | grep -vE '" (401|403|404) ' | head -50
```

Se aparecer resposta 200 para endereço que não é da equipe, converse com o
encarregado de dados da Unicamp: a LGPD (art. 48) pede comunicação à ANPD e
aos titulares quando um incidente pode causar risco ou dano relevante.

### 1.2 Parceiros de governo durante o defeso

O defeso eleitoral vai de 04/07 a 25/10/2026 (Lei 9.504/1997, art. 73, VI, b;
Ofício Circular GR 01/2026), e a página de parceiros mostra hoje logos e nomes
de órgãos públicos. Em `/admin` → Parceiros, desative os parceiros da seção
pública. A partir de segunda o código também esconde essa seção até 25/10
(`src/utils/defeso.js`), mas até lá só o painel resolve.

---

## 2. Domingo, 27/09: revisão e ensaio

### 2.1 No computador de desenvolvimento

- [ ] PR revisado e mergeado no `main`, com o CI verde (lint, testes, build,
      auditoria de SEO do `dist/` e testes do backend).
- [ ] Homologação local, com o mesmo Apache da VM (ver `homolog/httpd.conf`):

```bash
cd cp2b_web
npm run homolog                                   # build + Apache em http://localhost:8080
node scripts/seo-audit.mjs --url http://localhost:8080   # esperado: 0 erros
MSYS_NO_PATHCONV=1 npm run lighthouse             # SEO 100, acessibilidade 90 ou mais
npm run homolog:down
```

> O `MSYS_NO_PATHCONV=1` é só para o Git Bash do Windows, que troca
> argumentos começando com `/` por caminhos do Windows. O Lighthouse roda num
> contêiner de propósito: o antivírus da máquina injeta script nas páginas
> HTTP e bagunça a nota de desempenho.

### 2.2 Na VM (só leitura: nada aqui muda o site)

```bash
cd /var/www/cp2b/repo
git status --short             # vazio: ninguém editou arquivo direto na VM
git log -1 --oneline           # a versão no ar, anote
git fetch origin
git log --oneline HEAD..origin/main                                   # o que vai entrar
git diff --stat HEAD origin/main -- cp2b_web/backend/src/db/migrations/  # migrações novas
node -v                        # 20 ou mais (o backend exige)
pm2 status                     # cp2b-backend online
df -h /var/www                 # espaço para o backup e o node_modules
grep -c '^ADMIN_PASSWORD=..' cp2b_web/backend/.env     # 1 (confere sem mostrar a senha)
grep -E '^(NODE_ENV|TRUST_PROXY)=' cp2b_web/backend/.env
sudo apache2ctl -M 2>/dev/null | grep -E 'rewrite|headers|mime|deflate|proxy_http'
bash deployment/backup.sh && ls -lh /var/www/cp2b/backups | tail -4   # ensaio do backup
```

Anote também como estão PILAR-2b, Arqueia e ABIOVE (abrir no navegador
basta), para comparar depois.

### 2.3 `NODE_ENV` e `TRUST_PROXY` no `.env` do backend

- **`NODE_ENV=production`**. Com ele, se um dia o `ADMIN_PASSWORD` sumir do
  `.env`, o painel tranca (503) em vez de abrir para todo mundo, e o Express
  para de mostrar pilha de erro. Vai **só** no `backend/.env`. Nunca
  `export NODE_ENV=production` no terminal antes do `bash deploy.sh`: o npm
  deixaria de instalar as dependências de desenvolvimento, e o build do site
  (o Vite é uma delas) quebraria.
- **`TRUST_PROXY=loopback,<IP do proxy da Unicamp>`**. Sem o proxy nessa
  lista, o backend vê todo visitante com o mesmo IP, e os limites por IP (10
  envios públicos e 5 tentativas de login a cada 15 minutos) valem para o site
  inteiro de uma vez: uma pessoa insistente trava o formulário de contato de
  todos. Peça à TI o IP (ou a faixa) do proxy reverso e confirme que ele envia
  `X-Forwarded-For`. Uma pista, nos logs:

  ```bash
  sudo awk '{print $1}' /var/log/apache2/*access.log | sort | uniq -c | sort -rn | head -3
  ```

  Se um IP responde por quase tudo, é o proxy. Confirme com a TI antes de
  colocá-lo no arquivo; sem a confirmação, deixe `loopback`, que é o
  comportamento de hoje. Detalhes em `backend/src/middleware/trustProxy.js`.

---

## 3. Segunda, 28/09: publicação

Cedo, antes do expediente. Durante o `npm run build` (1 a 2 minutos) o
`dist/` é esvaziado e regravado, e quem abrir o site nesse intervalo pode
encontrar erro.

Desta vez, **não** rode o `bash deploy.sh` que está na VM. O bash lê o
roteiro enquanto executa e o `git pull` troca o arquivo no meio do caminho,
então quem rodaria é o `deploy.sh` antigo: sem backup, sem `SEO_API_URL` e
com o `kill` que derruba workers do Apache dos vizinhos. Rode o do `main`:

```bash
cd /var/www/cp2b/repo
git fetch origin main
git show origin/main:deploy.sh > /tmp/deploy-cp2b.sh
bash /tmp/deploy-cp2b.sh
```

Das próximas vezes, `bash deploy.sh` basta: o roteiro novo busca sozinho a
versão do `main` antes de começar.

O que ele faz, na ordem:

| Passo | O quê |
|---|---|
| — | grava o commit atual em `.deploy-anterior` (é para ele que o rollback volta) |
| 1/7 | `git pull origin main` |
| 2/7 | backup do banco, dos uploads e do `.env` em `/var/www/cp2b/backups`, já com o `backup.sh` desta versão (`SKIP_BACKUP=1` pula, só de propósito) |
| 3/7 | dependências do site (`npm install`) e do backend (`npm ci --omit=dev`) |
| 4/7 | build com `SEO_API_URL=http://localhost:3001/api`: o sitemap e as páginas pré-renderizadas saem com as notícias, eventos e oportunidades reais |
| 5/7 | migrações do banco (nesta versão: `051`, que registra `/capacitacao` no controle de páginas, e `052`, que separa título, autores e periódico de três publicações) |
| 6/7 | reinicia o `cp2b-backend` |
| 7/7 | confere HTTP 200 e que `/api/auth/status` responde `"required":true` |

Se parar no meio, o `set -e` interrompe no primeiro erro. Parou no passo 4?
O `dist/` pode ter ficado pela metade: corrija e rode de novo, ou siga o
rollback (seção 5).

---

## 4. Conferência (uns 15 minutos)

```bash
curl -s https://cp2b.unicamp.br/api/auth/status      # {"required":true}
for p in /api/Contact /api/contact '/api/participants/search?q=a' /api/newsletter/Subscribers /api/boletins/all; do
  printf '%-32s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "https://cp2b.unicamp.br$p"
done                                                  # todos 401 ou 403
curl -sI https://cp2b.unicamp.br/ | grep -iE 'x-content-type|x-frame|referrer-policy|permissions-policy|cache-control'
cd /var/www/cp2b/repo/cp2b_web && node scripts/seo-audit.mjs --url https://cp2b.unicamp.br   # 0 erros
```

A auditoria pode listar avisos (título comprido, o cabeçalho `Server` com a
versão do Apache enquanto a TI não mexer nele); o que importa é zero erro. O
teste de fumaça usa o Playwright, então rode do computador de
desenvolvimento: `SMOKE_URL=https://cp2b.unicamp.br npm run smoke`.

No navegador, no celular e no computador:

- [ ] `/capacitacao`: o template baixa (arquivo `.docx`, não a página de
      "não encontrada") e o curso de 16h aparece inteiro.
- [ ] `/eixos`: o logo do CP2b no centro da figura.
- [ ] `/sobre/parceiros`: sem a seção de órgãos públicos.
- [ ] `/admin`: pede a senha; Dashboard, Eventos, Configurações e Parceiros
      abrem.
- [ ] PILAR-2b, Arqueia e ABIOVE: como estavam no domingo.

No Search Console (propriedade `cp2b.unicamp.br`):

- [ ] Sitemaps → reenviar `https://cp2b.unicamp.br/sitemap.xml`.
- [ ] Inspeção de URL → `https://cp2b.unicamp.br/capacitacao` → Solicitar
      indexação.
- Nas próximas semanas, as 14 URLs de exemplo que o sitemap antigo publicava
  vão aparecer como "não encontrada" ou "soft 404". É o esperado: saíram do
  sitemap porque nunca existiram. Não precisa fazer nada.

---

## 5. Voltar atrás

Quando: o site não abre, o painel não abre, ou algo importante quebrou e não
tem conserto rápido.

```bash
cd /var/www/cp2b/repo
ANTERIOR=$(cat .deploy-anterior)
git checkout -- cp2b_web/package-lock.json 2>/dev/null   # o npm install pode ter mexido nele
git checkout "$ANTERIOR"
cd cp2b_web
npm install
SEO_API_URL=http://localhost:3001/api npm run build
(cd backend && npm ci --omit=dev)
pm2 restart cp2b-backend
curl -s -o /dev/null -w '%{http_code}\n' http://localhost    # 200
```

O repositório fica "solto" no commit anterior. Quando a correção estiver no
`main`: `git checkout main && bash deploy.sh`.

**O banco fica como está.** A `051` só acrescenta uma linha no controle de
páginas e a `052` só preenche título, autores e periódico de três
publicações; a versão anterior convive com as duas. Restaurar o banco é só
para dado corrompido, o que esta publicação não deve causar. Se precisar,
sem apagar nada:

```bash
pm2 stop cp2b-backend
sudo -u postgres psql -c 'ALTER DATABASE cp2b_db RENAME TO cp2b_db_antes_do_restore'
sudo -u postgres createdb -O cp2b_user cp2b_db
gunzip -c /var/www/cp2b/backups/database_AAAAMMDD_HHMMSS.sql.gz | sudo -u postgres psql -v ON_ERROR_STOP=1 cp2b_db
pm2 start cp2b-backend
```

O banco renomeado fica guardado até alguém apagá-lo de propósito. O
`deployment/rollback.sh` é do layout antigo (`/var/www/cp2b-website`) e se
recusa a rodar sem `LEGACY_LAYOUT=1`; não use.

---

## 6. Segurança

### O que esta versão já traz

- O filtro do painel não diferencia maiúsculas, e cada leitura com dado
  pessoal ou rascunho exige login na própria rota (`requireAdmin`), sem
  depender só da lista.
- As rotas de inscrição do Fórum de 2026 (participantes, meetups, foto)
  deixaram de aceitar envio anônimo. O site não as usa desde o fim do evento.
- Em produção, sem `ADMIN_PASSWORD`, o painel tranca (503).
- Entradas com tipo conferido: um número no lugar de texto derrubava a API.
  Uma promessa rejeitada fora de `try` também não encerra mais o processo.
- Nomes escapados nos e-mails de notificação.
- Uploads: extensão e tipo conferidos por inteiro, e a exclusão só aceita
  nome de arquivo simples (nada de `../`).
- Links vindos do banco passam por `safeHref` (`javascript:` não vira link).
  No HTML dos editores, iframe só do YouTube, Vimeo e Spotify, e `data:` só em
  imagem.
- O service worker não guarda respostas do painel, e o aviso de cookies não
  guarda e-mail no navegador.
- `.htaccess`: `nosniff`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`; cache de um ano para arquivos com hash no nome e
  `no-cache` para HTML, `sw.js` e manifest.
- `deploy.sh`: roda sempre a versão do `main`, faz backup antes de mexer no
  banco, instala as dependências do backend, dá `kill` só em quem escuta na
  3001 (antes derrubava workers do Apache dos vizinhos) e confere se o painel
  pede senha.
- `TRUST_PROXY` configurável (2.3).

### Com a TI da Unicamp (não bloqueia a publicação)

| Item | Por quê |
|---|---|
| IP do proxy reverso e confirmação do `X-Forwarded-For` | para o `TRUST_PROXY` (2.3) |
| `ServerTokens Prod` e `ServerSignature Off` em `/etc/apache2/conf-enabled/security.conf` | o cabeçalho `Server` conta a versão do Apache; vale para a VM toda, sem efeito nas aplicações |
| HSTS no proxy que termina o TLS | só quem fala HTTPS com o visitante pode mandar |
| Firewall fechando 3001 (API) e 5432 (Postgres) para fora da VM | `sudo ss -ltnp \| grep -E ':3001\|:5432'` mostra se estão abertas para a rede |
| Usuário de sistema próprio para o backend | não rodar como root nem como usuário pessoal |
| Cópia dos backups fora da VM | hoje o backup mora no mesmo disco que o original |

### Para os próximos PRs

- **multer 1.x → 2.x.** A linha 1.x foi descontinuada por vulnerabilidades
  (negação de serviço no parser de upload). Nesta versão só quem está logado
  chega ao multer, porque o filtro barra antes, então dá para fazer com calma
  e com testes.
- **react-quill → react-quill-new.** O quill 1.3.7 tem um XSS moderado
  (`npm audit`). Só o editor do painel o usa, e o HTML publicado passa pelo
  DOMPurify.
- Confirmação por e-mail na inscrição da newsletter.
- Os tokens do painel valem 7 dias e só caem todos juntos, trocando o
  `ADMIN_PASSWORD`.
- CSP, começando em `Report-Only`.
- Build numa pasta ao lado e troca do `dist/` de uma vez, o que acaba com o
  minuto de site instável durante a publicação.

`npm audit --omit=dev` em 26/09: backend 0 vulnerabilidades; site, só o
quill acima.

---

## 7. Defeso eleitoral

- [ ] Hoje: desativar os parceiros da seção pública no painel (1.2).
- [ ] Na publicação: o código passa a esconder a seção de 04/07 a 25/10/2026
      (`src/utils/defeso.js`, com teste).
- [ ] Antes de divulgar a Capacitação: conferir que a página não traz logo,
      nome ou slogan de governo além da identificação institucional. Na
      dúvida, o Ofício Circular GR 01/2026 ou a assessoria da Reitoria.
- [ ] **26/10:** reativar os parceiros no painel. O código já libera a seção
      sozinho a partir de 26/10, 00h (Brasília), mas o que foi desativado à mão
      volta à mão.

---

## 8. LGPD

- O site guarda dados pessoais em quatro lugares: mensagens de contato,
  inscritos da newsletter e participantes e pedidos de meetup do Fórum 2026.
- Esta versão fecha a leitura anônima de todos eles (1.1 e 6).
- Os backups têm esses dados: saem legíveis só pelo dono (`umask 077`) e são
  apagados depois de 7 dias.
- A decidir com a coordenação: por quanto tempo guardar os dados do Fórum
  2026 (a finalidade acabou com o evento) e quem responde pelo site junto ao
  encarregado de dados da Unicamp.

---

## 9. SEO e acessibilidade: onde estamos

- **Produção antes da publicação:** a auditoria (`seo-audit --url`) achou 16
  erros e 14 avisos, entre eles um sitemap com 14 URLs inventadas e sem as
  reais, e nenhum cabeçalho de cache ou de segurança.
- **Homologação (Docker, Apache igual ao da VM):** 0 erros. Lighthouse no
  celular: SEO 100, boas práticas 79 (só por ser HTTP local), acessibilidade
  91 a 95 antes da última rodada de contraste, ordem de títulos, `alt` e
  rótulos de formulário.
- **Desempenho:** 70 a 77 no celular. Próximos passos: CSS crítico (o CSS
  ainda bloqueia a primeira pintura), `loading="lazy"` na imagem de parceiros
  da home e um guia de tamanho para as imagens enviadas pelo painel.

---

## 10. Primeira semana

- `pm2 logs cp2b-backend --lines 100`: erros 500, rejeições não tratadas.
- `sudo tail -n 100 /var/log/apache2/cp2b-error.log`.
- Search Console: páginas indexadas, `/capacitacao` entre elas, e o sitemap
  lido sem erro.
- Tirar a regra provisória da seção 1.1 do vhost, quando quiser. Depois da
  publicação ela não faz mais diferença.
