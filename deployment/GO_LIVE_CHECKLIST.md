# 🚀 Colocar o site no ar — Checklist de Go-Live

Guia rápido para publicar a versão nova do site do CP2b no servidor da Unicamp.
Escrito para ser seguido passo a passo, **sem precisar de conhecimento técnico**.

Você vai precisar de:
- Acesso SSH ao servidor (a mesma máquina Debian onde o site já roda hoje).
- ~15 minutos.

Todo o código já está aprovado e no `main` do GitHub. Este checklist só
**publica** o que já está pronto.

> O roteiro completo da publicação de 28/09/2026 (testes antes, backup,
> conferências depois e como voltar atrás) está em
> `cp2b_web/docs/PUBLICACAO_VM.md`. Este checklist é o resumo.

---

## Parte 1 — Uma única vez (primeira publicação desta versão)

Estes três passos só precisam ser feitos **uma vez**. Nas próximas atualizações,
pule direto para a Parte 2.

### 1.1 Definir a senha do painel administrativo

O painel `/admin` agora é protegido por senha. Escolha uma frase secreta longa
e coloque no arquivo de configuração do backend, no servidor:

```bash
# No servidor, edite o arquivo .env do backend:
nano /var/www/cp2b/repo/cp2b_web/backend/.env

# Adicione (ou edite) esta linha, com a SUA senha:
ADMIN_PASSWORD=escolha-uma-frase-secreta-longa-aqui
```

> Guarde essa senha em local seguro. Quem tiver essa senha pode editar o site.
> Trocá-la depois desconecta todos os navegadores — basta repetir este passo.

### 1.2 Não copie o `cp2b.conf` do repositório para o Apache

O `deployment/apache2/cp2b.conf` está **defasado** (ver o cabeçalho dele). O
vhost que está no ar é `/etc/apache2/sites-available/cp2b.unicamp.br.conf`, e
ele também atende PILAR-2b, ABIOVE e Arqueia: trocá-lo pelo arquivo do
repositório derruba essas aplicações. As regras do site (páginas
pré-renderizadas, cache, cabeçalhos) vêm do `.htaccess` que vai dentro do
build, porque o vhost usa `AllowOverride All`. Nada a fazer aqui.

### 1.3 Mapa do site com as notícias e os eventos de verdade

O `deploy.sh` já faz isso: define `SEO_API_URL=http://localhost:3001/api`
antes do build, e o sitemap sai com os itens reais do banco. Nada a fazer.

---

## Parte 2 — Publicar (toda vez que quiser atualizar o site)

Um único comando, no servidor:

```bash
cd /var/www/cp2b/repo
bash deploy.sh
```

> **Na publicação de 28/09, e só nela:** o `deploy.sh` que está na VM ainda é
> o antigo, e é ele que rodaria. Use o do `main`:
>
> ```bash
> cd /var/www/cp2b/repo
> git fetch origin main
> git show origin/main:deploy.sh > /tmp/deploy-cp2b.sh
> bash /tmp/deploy-cp2b.sh
> ```
>
> Daí em diante o próprio `deploy.sh` busca a versão do `main` antes de
> começar.

O script faz tudo sozinho: guarda o commit atual (para voltar, se precisar),
baixa o código novo, faz o **backup** do banco, dos uploads e do `.env`,
instala as dependências do site e do backend, gera o build, **aplica as
atualizações do banco de dados**, reinicia o backend e confere se o site
respondeu e se o painel exige senha.

> Se a sua máquina usa o script de `deployment/deploy.sh` (com backup
> automático e systemd) em vez do `deploy.sh` da raiz, pode usar esse — os dois
> aplicam as migrações do banco. Use **o mesmo que você já usava antes**.

---

## Parte 3 — Conferir se deu tudo certo (2 minutos)

### 3.1 Teste automático (recomendado)

Roda sozinho e verifica as páginas principais, a API e o mapa do site:

```bash
cd /var/www/cp2b/repo/cp2b_web
SMOKE_URL=https://cp2b.unicamp.br npm run smoke
```

Tudo verde = site no ar e saudável. Qualquer vermelho aponta exatamente o que
conferir.

Depois, a auditoria de SEO contra o site no ar (só leitura):

```bash
node scripts/seo-audit.mjs --url https://cp2b.unicamp.br
```

Zero erros = sitemap, páginas e respostas HTTP em ordem.

### 3.2 Teste manual rápido

- Abra **https://cp2b.unicamp.br** — a página inicial carrega normalmente.
- Abra **https://cp2b.unicamp.br/admin** — deve pedir a senha (a que você
  definiu no passo 1.1). Entre e confirme que o **Dashboard** aparece.
- No painel, abra **Eventos** e **Configurações do Site** — devem abrir sem erro
  (isso confirma que as tabelas novas foram criadas).
- Abra o **Guia de Uso** dentro do painel — é o manual para a equipe.

---

## Se algo der errado

| Sintoma | O que fazer |
|---|---|
| `/admin` não pede senha | O `ADMIN_PASSWORD` não está no `.env` do backend, ou o backend não foi reiniciado. Refaça 1.1 e rode `bash deploy.sh` de novo. |
| Página **Eventos** ou **Configurações** dá erro | As migrações não rodaram. No servidor: `cd /var/www/cp2b/repo/cp2b_web/backend && node src/db/init.js`, depois reinicie o backend. |
| "Backend indisponível" no painel | O backend caiu. `pm2 restart cp2b-backend` (ou `sudo systemctl restart cp2b-backend`). |
| Precisa voltar a versão anterior | Siga o rollback de `cp2b_web/docs/PUBLICACAO_VM.md` (o commit anterior fica em `/var/www/cp2b/repo/.deploy-anterior`). **Não use** `deployment/rollback.sh`: é do layout antigo. |

O banco de dados tem backup automático (`deployment/backup.sh`). Nada que você
faça pelo painel apaga dados sem confirmação.

---

**Resumo de 30 segundos:** defina `ADMIN_PASSWORD` no `.env` do backend (uma vez)
→ `bash deploy.sh` → `SMOKE_URL=https://cp2b.unicamp.br npm run smoke` → abra
`/admin` e entre com a senha. Pronto, no ar. ✅
