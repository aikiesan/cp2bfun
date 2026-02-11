# 🚀 Quick Start Guide - CP2B Admin Dashboard

Get the complete admin system running in **5 minutes**!

---

## 📋 **Prerequisites**

- ✅ Node.js 20+ installed
- ✅ PostgreSQL installed and running
- ✅ Database created: `cp2b`

---

## ⚡ **Fast Setup (3 Steps)**

### **1. Setup Database**

**Option A: If PostgreSQL is already running**
```bash
# Create database (run in psql or pgAdmin)
createdb cp2b

# Or in psql:
psql -U postgres
CREATE DATABASE cp2b;
CREATE USER cp2b WITH PASSWORD 'cp2b';
GRANT ALL PRIVILEGES ON DATABASE cp2b TO cp2b;
\q
```

**Option B: If using Docker**
```bash
# Start PostgreSQL with Docker
docker run --name cp2b-postgres \
  -e POSTGRES_USER=cp2b \
  -e POSTGRES_PASSWORD=cp2b \
  -e POSTGRES_DB=cp2b \
  -p 5432:5432 \
  -d postgres:15

# Check it's running
docker ps
```

### **2. Initialize Backend**

```bash
cd cp2b_web/backend

# Install dependencies (if not done)
npm install

# Initialize database (creates tables + seed data)
npm run db:init

# Start backend server
npm start
```

**Expected output:**
```
🔄 Initializing database...
📋 Creating tables from schema.sql...
✅ Schema created successfully
📦 Found 2 migration(s)
🔄 Running migration: 003_add_partners_publications_events.sql
✅ Migration 003_add_partners_publications_events.sql completed
🔄 Running migration: 004_seed_partners_data.sql
✅ Migration 004_seed_partners_data.sql completed
🎉 Database initialization complete!
✨ All done!

CP2B Backend running on port 3001
```

### **3. Start Frontend**

```bash
cd cp2b_web

# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

**Expected output:**
```
VITE v5.4.21 ready in 269 ms
➜ Local:   http://localhost:5175/
```

---

## 🎯 **Test Everything**

### **1. Test Backend API**

Open browser or use curl:
```bash
# Check health
curl http://localhost:3001/api/health

# Get partners
curl http://localhost:3001/api/partners

# Get publications
curl http://localhost:3001/api/publications

# Get events
curl http://localhost:3001/api/events
```

### **2. Test Frontend**

1. **Public Site:** http://localhost:5175/
2. **Admin Dashboard:** http://localhost:5175/admin
3. **Partners Page:** http://localhost:5175/sobre/parceiros
4. **Partners Editor:** http://localhost:5175/admin/partners

### **3. Test PartnersEditor (Full CRUD)**

1. Navigate to http://localhost:5175/admin/partners
2. You should see **4 tabs** with 15 partners from seed data
3. **Try creating** a new partner:
   - Click "Novo Parceiro"
   - Fill in name_pt (required)
   - Select category
   - Click "Criar Parceiro"
   - ✅ See success toast!
4. **Try editing** a partner:
   - Click ✏️ on any partner
   - Change some fields
   - Click "Atualizar Parceiro"
   - ✅ See success toast!
5. **Try deleting** a partner:
   - Click 🗑️ on any partner
   - Confirm deletion
   - ✅ See success toast!

---

## 🔧 **Troubleshooting**

### **Problem: "ECONNREFUSED" or "Connection refused"**

**Cause:** PostgreSQL is not running

**Fix:**
```bash
# Check if PostgreSQL is running
pg_isready

# If not running (Windows):
# Start via Services or:
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start

# If using Docker:
docker start cp2b-postgres
```

### **Problem: "database 'cp2b' does not exist"**

**Fix:**
```bash
createdb cp2b

# Or:
psql -U postgres
CREATE DATABASE cp2b;
\q
```

### **Problem: "role 'cp2b' does not exist"**

**Fix:**
```bash
psql -U postgres
CREATE USER cp2b WITH PASSWORD 'cp2b';
GRANT ALL PRIVILEGES ON DATABASE cp2b TO cp2b;
\q
```

### **Problem: "relation 'partners' does not exist"**

**Cause:** Migrations haven't run

**Fix:**
```bash
cd cp2b_web/backend
npm run db:init
```

### **Problem: Backend starts but shows "Backend indisponível" in admin**

**Cause:** CORS issue or backend not accessible from frontend

**Check:**
1. Backend is running on port 3001: `curl http://localhost:3001/api/health`
2. `.env` has correct `FRONTEND_URL=http://localhost:5173`
3. Frontend is accessing correct backend URL

**Fix:**
```bash
# In cp2b_web/backend/.env
FRONTEND_URL=http://localhost:5173  # or 5175 if that's your port
```

### **Problem: "port 3001 already in use"**

**Fix:**
```bash
# Find and kill process using port 3001 (Windows)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change port in .env
PORT=3002
```

---

## 📊 **What You Should See**

### **Admin Dashboard**
- 7 stat cards showing counts
- Publications, Events, Partners show **NEW** badges
- Quick actions grid
- Professional layout

### **Partners Editor**
- 4 category tabs with icons
- Count badges on each tab
- Table showing 15 seeded partners
- Functional Create/Edit/Delete
- Toast notifications
- Empty states (if you delete all in a category)

### **Public Partners Page**
- Partners organized by category
- Data fetched from database
- Bilingual support

---

## 🎓 **Next Steps After Setup**

1. **Explore the Admin:**
   - Click through all sidebar categories
   - Test collapsible navigation
   - Try breadcrumbs
   - View enhanced Dashboard

2. **Test All Features:**
   - Create, edit, delete partners
   - Switch between tabs
   - Toggle active/inactive
   - Change sort order
   - View toast notifications
   - See loading states (refresh page)
   - View empty states (delete all in a category)

3. **Read Documentation:**
   - `ADMIN_COMPONENTS_GUIDE.md` - How to use shared components
   - `PARTNERS_EDITOR_FEATURES.md` - PartnersEditor details
   - `IMPLEMENTATION_SUMMARY.md` - Overall project summary

4. **Build More Pages:**
   - Copy PartnersEditor pattern
   - Implement PublicationsEditor
   - Implement EventsEditor
   - Customize to your needs

---

## 🎉 **Success Checklist**

- [ ] PostgreSQL running
- [ ] Database `cp2b` created
- [ ] Backend dependencies installed (`npm install`)
- [ ] Database initialized (`npm run db:init`)
- [ ] Backend running on port 3001
- [ ] Frontend dependencies installed
- [ ] Frontend running on port 5173/5175
- [ ] Can access http://localhost:5175/admin
- [ ] Can see Dashboard with 7 stat cards
- [ ] Can access PartnersEditor at /admin/partners
- [ ] Can see 15 partners in tabs
- [ ] Can create a new partner
- [ ] Can edit an existing partner
- [ ] Can delete a partner
- [ ] Can see toast notifications
- [ ] Public partners page shows data from DB

**If all checked ✅ - You're ready to go!** 🚀

---

## 💡 **Tips**

1. **Keep both terminals open** - One for backend, one for frontend
2. **Use the dev script** - `npm run dev` has hot reload
3. **Check console for errors** - Browser DevTools + Terminal
4. **Database persistence** - Data survives server restarts
5. **Reset database** - `npm run db:init` (drops and recreates)

---

## 🆘 **Need Help?**

1. Check the error message in terminal
2. Look at browser console (F12)
3. Check this troubleshooting section
4. Read the component guides
5. Check database connection: `psql -U cp2b -d cp2b`

---

## 📚 **Additional Resources**

- **Database Schema:** `cp2b_web/backend/src/db/schema.sql`
- **Migrations:** `cp2b_web/backend/src/db/migrations/`
- **API Routes:** `cp2b_web/backend/src/routes/`
- **Admin Components:** `cp2b_web/src/components/admin/`
- **Admin Pages:** `cp2b_web/src/pages/admin/`

**Enjoy your new admin system!** 🎊
