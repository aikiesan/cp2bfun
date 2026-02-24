# LAN Deployment — Sharing the Dev Site on the Same Network

## The Problem

Vite bakes `VITE_API_URL` into the JavaScript bundle **at build time**. The current value is `http://localhost:3001/api`, which means the student's browser would try to reach **their own machine** on port 3001 — not yours.

There are two clean solutions. **Option A is recommended** because it requires no code changes to the frontend.

---

## Option A — Add an Nginx Proxy (Recommended for Production Mode)

This makes Nginx route `/api/...` requests to the backend container. Both frontend and API traffic go through **port 80 on your IP**, so the student only needs one URL.

### Step 1 — Update `nginx.conf`

Add a proxy block inside the `server { }` section, before the `location /` block:

```nginx
# Proxy API calls to the backend container
location /api/ {
    proxy_pass         http://backend:3001;
    proxy_http_version 1.1;
    proxy_set_header   Host $host;
    proxy_set_header   X-Real-IP $remote_addr;
}
```

### Step 2 — Update `docker-compose.yml`

Change two values in the `backend` service environment:

```yaml
backend:
  environment:
    - FRONTEND_URL=http://143.106.212.67   # ← your ethernet IP, port 80
```

And add `VITE_API_URL` to the `prod` service environment so it builds with a relative path:

```yaml
prod:
  build:
    context: .
    dockerfile: Dockerfile
    args:
      - VITE_API_URL=/api        # ← relative: browser resolves to same host
  ports:
    - "80:80"
```

Then update the `Dockerfile` to accept that build arg:

```dockerfile
# After WORKDIR /app
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
```

### Step 3 — Rebuild and start

```bash
cd cp2b_web
docker-compose down
docker-compose up -d prod
```

### Step 4 — Share the URL

Tell the student to open:
```
http://143.106.212.67
```

That is your machine's ethernet IP. Both the frontend and API go through Nginx on port 80.

---

## Option B — Dev Mode with Host IP (Quickest, No Rebuild)

If you just want the student to access the **dev server** for testing, use this.

### Step 1 — Update `docker-compose.yml`

Change the `dev` service `VITE_API_URL` to your real IP:

```yaml
dev:
  environment:
    - VITE_API_URL=http://143.106.212.67:3001/api
    - FRONTEND_URL=http://143.106.212.67:5173
```

Also update the `backend` service:
```yaml
backend:
  environment:
    - FRONTEND_URL=http://143.106.212.67:5173   # ← allow CORS from student's browser
```

### Step 2 — Start dev mode

```bash
cd cp2b_web
docker-compose up dev
```

### Step 3 — Share the URL

```
http://143.106.212.67:5173
```

> **Note:** The dev server has hot-module reload, so any file you save will refresh in the student's browser in real time. Useful for collaborative review but not suitable for performance testing.

---

## Firewall Check (Windows)

If the student cannot reach your IP, Windows Firewall may be blocking it. Run this in PowerShell as Administrator to open the required ports:

```powershell
# Production (port 80)
New-NetFirewallRule -DisplayName "CP2B Prod" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow

# Dev server (port 5173) — only if using Option B
New-NetFirewallRule -DisplayName "CP2B Dev" -Direction Inbound -Protocol TCP -LocalPort 5173 -Action Allow

# Backend API (port 3001) — only if using Option B
New-NetFirewallRule -DisplayName "CP2B API" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
```

---

## Quick Reference

| Mode | Command | Student URL |
|---|---|---|
| Production (Option A) | `docker-compose up -d prod` | `http://143.106.212.67` |
| Development (Option B) | `docker-compose up dev` | `http://143.106.212.67:5173` |

Your ethernet IP: **143.106.212.67**
