# 🚀 Colocar o site no ar — Checklist de Go-Live

Guia rápido para publicar a versão nova do site do CP2b no servidor da Unicamp.
Escrito para ser seguido passo a passo, **sem precisar de conhecimento técnico**.

Você vai precisar de:
- Acesso SSH ao servidor (a mesma máquina Debian onde o site já roda hoje).
- ~15 minutos.

Todo o código já está aprovado e no `main` do GitHub. Este checklist só
**publica** o que já está pronto.

---

## Parte 1 — Uma única vez (primeira publicação desta versão)

Estes três passos só precisam ser feitos **uma vez**. Nas próximas atualizações,
pule direto para a Parte 2.

### 1.1 Definir a senha do painel administrativo

O painel `/admin` agora é protegido por senha. Escolha uma frase secreta longa
e coloque no arquivo de configuração do backend, no servidor:

```bash
# No servidor, edite o arquivo .env do backend:
nano /var/www/cp2b/backend/.env       # (ou o caminho do seu backend/.env)

# Adicione (ou edite) esta linha, com a SUA senha:
ADMIN_PASSWORD=escolha-uma-frase-secreta-longa-aqui
```

> Guarde essa senha em local seguro. Quem tiver essa senha pode editar o site.
> Trocá-la depois desconecta todos os navegadores — basta repetir este passo.

### 1.2 Atualizar a configuração do Apache (páginas para o Google)

A versão nova serve páginas pré-renderizadas para o Google/redes sociais.
Se ainda não fez isso, copie a configuração atualizada e recarregue o Apache:

```bash
sudo cp /var/www/cp2b/repo/deployment/apache2/cp2b.conf /etc/apache2/sites-available/cp2b.conf
sudo apache2ctl configtest        # deve responder "Syntax OK"
sudo systemctl reload apache2
```

### 1.3 (Recomendado) Gerar o mapa do site com os links dinâmicos

Para o Google indexar notícias e eventos, o build precisa conseguir falar com a
API. No servidor, defina esta variável antes de buildar (a Parte 2 já builda):

```bash
export SEO_API_URL=http://localhost:3001/api
```

Coloque essa linha no `.env` do frontend ou no seu script de deploy para valer
sempre.

---

## Parte 2 — Publicar (toda vez que quiser atualizar o site)

Um único comando, no servidor:

```bash
cd /var/www/cp2b/repo
bash deploy.sh
```

O script faz tudo sozinho: baixa o código novo, instala dependências, gera o
build, **aplica as atualizações do banco de dados** (tabelas de eventos e
configurações), reinicia o backend e confere se o site respondeu.

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
| Precisa voltar a versão anterior | Use `deployment/rollback.sh` (se usa o deploy com backup) ou faça `git checkout <commit-anterior>` e rode o deploy de novo. |

O banco de dados tem backup automático (`deployment/backup.sh`). Nada que você
faça pelo painel apaga dados sem confirmação.

---

**Resumo de 30 segundos:** defina `ADMIN_PASSWORD` no `.env` do backend (uma vez)
→ `bash deploy.sh` → `SMOKE_URL=https://cp2b.unicamp.br npm run smoke` → abra
`/admin` e entre com a senha. Pronto, no ar. ✅
