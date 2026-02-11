# ⚡ RUN IT NOW - Complete Setup in 3 Minutes

Everything you need to get the CP2B Admin Dashboard running **right now**.

---

## 🎯 **The Fastest Way (Windows)**

### **Option 1: Automated Script (Recommended)**

```bash
# Just double-click this file:
setup-windows.bat

# Or run from command prompt:
.\setup-windows.bat
```

**What it does:**
1. ✅ Checks Node.js and PostgreSQL
2. ✅ Installs all dependencies
3. ✅ Initializes database with schema + seed data
4. ✅ Starts backend server

**Then in a NEW terminal:**
```bash
cd cp2b_web
npm run dev
```

**Done!** Open http://localhost:5175/admin/partners

---

## 🐳 **The Docker Way (If You Don't Have PostgreSQL)**

### **1. Start PostgreSQL with Docker**

```bash
docker run --name cp2b-postgres ^
  -e POSTGRES_USER=cp2b ^
  -e POSTGRES_PASSWORD=cp2b ^
  -e POSTGRES_DB=cp2b ^
  -p 5432:5432 ^
  -d postgres:15
```

**Verify it's running:**
```bash
docker ps
# Should show cp2b-postgres running
```

### **2. Setup Backend**

```bash
cd cp2b_web\backend
npm install
npm run db:init
npm start
```

### **3. Setup Frontend (NEW TERMINAL)**

```bash
cd cp2b_web
npm install
npm run dev
```

**Done!** Open http://localhost:5175/admin/partners

---

## 🔧 **Manual Setup (Step by Step)**

### **Step 1: Create Database**

**Open Command Prompt and run:**

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql prompt:
CREATE DATABASE cp2b;
CREATE USER cp2b WITH PASSWORD 'cp2b';
GRANT ALL PRIVILEGES ON DATABASE cp2b TO cp2b;
\q
```

### **Step 2: Initialize Backend**

```bash
# Navigate to backend
cd C:\Users\Lucas\Documents\cp2b_website\cp2b_web\backend

# Install dependencies
npm install

# Initialize database (creates all tables + adds 15 partners)
npm run db:init

# You should see:
# 🔄 Initializing database...
# ✅ Schema created successfully
# ✅ Migration 003_add_partners_publications_events.sql completed
# ✅ Migration 004_seed_partners_data.sql completed
# 🎉 Database initialization complete!
```

### **Step 3: Start Backend**

```bash
# In the same terminal
npm start

# You should see:
# CP2B Backend running on port 3001
```

**Keep this terminal open!**

### **Step 4: Test Backend (Optional)**

Open a NEW terminal:
```bash
cd cp2b_web\backend
npm test

# You should see:
# ✅ Health Check
# ✅ Get Partners (15 items)
# ✅ Get Publications (0 items)
# ✅ Get Events (0 items)
# ... etc
# 🎉 All tests passed!
```

### **Step 5: Start Frontend**

Open a NEW terminal:
```bash
cd C:\Users\Lucas\Documents\cp2b_website\cp2b_web

# Install dependencies (if not already done)
npm install

# Start dev server
npm run dev

# You should see:
# ➜  Local:   http://localhost:5175/
```

### **Step 6: Open and Test**

**Open these URLs:**

1. **Admin Dashboard:** http://localhost:5175/admin
   - Should show 7 stat cards
   - Partners card should show "15" with NEW badge

2. **Partners Editor:** http://localhost:5175/admin/partners
   - Should show 4 tabs
   - Should have 15 partners distributed across tabs
   - Try creating a new partner!

3. **Public Partners Page:** http://localhost:5175/sobre/parceiros
   - Should show partners organized by category
   - Data comes from database (not hardcoded!)

---

## ✅ **Quick Validation Checklist**

Run these checks to ensure everything works:

### **Backend Checks**
```bash
# Is PostgreSQL running?
pg_isready
# Should say: accepting connections

# Can you connect to the database?
psql -U cp2b -d cp2b
\dt  # Should list 8+ tables
\q

# Is backend responding?
curl http://localhost:3001/api/health
# Should return: {"status":"ok","timestamp":"..."}

# Do we have partners data?
curl http://localhost:3001/api/partners
# Should return JSON array with 15 partners
```

### **Frontend Checks**
- [ ] http://localhost:5175 loads (homepage)
- [ ] http://localhost:5175/admin loads (dashboard)
- [ ] http://localhost:5175/admin/partners loads (partners editor)
- [ ] Can see 4 tabs in partners editor
- [ ] Tabs show count badges (1, 2, 8, 4)
- [ ] Can click "Novo Parceiro" button
- [ ] Modal opens with form
- [ ] Can see breadcrumbs at top

---

## 🎮 **Try These Actions**

Once everything is running, test the features:

### **1. Create a Partner**
1. Go to http://localhost:5175/admin/partners
2. Click "Novo Parceiro"
3. Fill in:
   - Nome (PT): `Teste Parceiro`
   - Categoria: Select any
4. Click "Criar Parceiro"
5. ✅ See green toast: "Parceiro criado com sucesso!"
6. ✅ See new partner in table

### **2. Edit a Partner**
1. Click ✏️ on any partner
2. Change the name
3. Click "Atualizar Parceiro"
4. ✅ See green toast: "Parceiro atualizado com sucesso!"

### **3. Delete a Partner**
1. Click 🗑️ on any partner
2. Confirmation dialog appears
3. Click "Excluir"
4. ✅ See green toast: "Parceiro excluído com sucesso!"

### **4. Test All Tabs**
1. Click each tab: Sede, Públicas, Pesquisa, Empresas
2. ✅ See different partners in each
3. ✅ Count badges update
4. Click "Adicionar [Category]" in each tab
5. ✅ Form opens with correct category pre-selected

### **5. Test Empty State**
1. Delete all partners in one category
2. ✅ See beautiful empty state with icon
3. ✅ "Adicionar Parceiro" button appears
4. Click it
5. ✅ Form opens

### **6. Test Loading State**
1. Refresh the page
2. ✅ See skeleton loading animation briefly
3. ✅ Then real data appears

---

## 🐛 **Common Issues & Fixes**

### **Issue: "port 5432 already in use"**
```bash
# PostgreSQL is already running (that's good!)
# Just make sure database 'cp2b' exists:
psql -U postgres -c "CREATE DATABASE cp2b;"
```

### **Issue: "ECONNREFUSED ::1:5432"**
PostgreSQL not running.

**Fix (Windows):**
```bash
# Check PostgreSQL service
services.msc
# Find "PostgreSQL" service and start it

# Or use Docker:
docker start cp2b-postgres
```

### **Issue: "relation 'partners' does not exist"**
Migrations didn't run.

**Fix:**
```bash
cd cp2b_web\backend
npm run db:init
```

### **Issue: "Backend indisponível" in admin**
Backend not accessible.

**Check:**
```bash
# Is backend running?
curl http://localhost:3001/api/health

# Check backend terminal for errors
```

### **Issue: "Cannot GET /admin/partners"**
Frontend routing issue.

**Fix:** Refresh the page (Vite dev server should handle routing)

### **Issue: Empty tables (no seed data)**
Migration 004 didn't run.

**Fix:**
```bash
cd cp2b_web\backend

# Manually run seed migration
psql -U cp2b -d cp2b -f src/db/migrations/004_seed_partners_data.sql

# Or re-run init
npm run db:init
```

---

## 📊 **Expected Data After Setup**

After running `npm run db:init`, you should have:

**Partners Table:**
- 1 Host institution (NIPE/UNICAMP)
- 2 Public entities (SAASP, SMVMADS)
- 8 Research institutions (UNIFAL, IAC, EMBRAPII, IZ, EP/USP, UCA, TUDELFT, LNEG)
- 4 Companies (COMGAS, Amplum, SABESP, COPERCANA)

**Total: 15 partners**

**Other Tables:**
- News (from existing data)
- Team Members (from existing data)
- Research Axes (from existing data)
- Publications (empty - ready for you to add)
- Events (empty - ready for you to add)

---

## 🎯 **What You Get**

✅ **Enhanced Admin Dashboard**
- 7 stat cards with real-time counts
- Quick actions grid
- Collapsible sidebar navigation
- Mobile responsive

✅ **Complete Partners CRUD**
- 4 category tabs
- Full create/edit/delete functionality
- Form validation
- Toast notifications
- Loading & empty states
- Logo preview
- Bilingual support

✅ **All Shared Components**
- Breadcrumbs
- Help tooltips
- Empty states
- Confirm dialogs
- Loading skeletons
- Toast system

✅ **Database-Backed**
- PostgreSQL database
- Proper migrations
- Seed data
- RESTful API

✅ **Production-Ready Code**
- Error handling
- Loading states
- Validation
- Responsive design
- Clean architecture

---

## 🚀 **Next Steps**

After verifying everything works:

1. **Read the guides:**
   - `ADMIN_COMPONENTS_GUIDE.md` - How to use shared components
   - `PARTNERS_EDITOR_FEATURES.md` - Partners editor details

2. **Build more pages:**
   - Copy PartnersEditor for Publications
   - Copy PartnersEditor for Events
   - Customize as needed

3. **Customize:**
   - Add more fields
   - Change validation rules
   - Update styling
   - Add features

**You have a complete, working foundation!** 🎉

---

## 💡 **Pro Tips**

1. **Keep both terminals open** (backend + frontend)
2. **Use browser DevTools** (F12) to see network requests
3. **Check backend terminal** for API logs
4. **Database persists** between restarts (no data loss)
5. **Hot reload works** in both frontend and backend (with `--watch`)

---

## 🆘 **Still Having Issues?**

1. **Check all terminals** for error messages
2. **Verify PostgreSQL** is running: `pg_isready`
3. **Test backend API** directly: `npm test` in backend folder
4. **Check database** manually: `psql -U cp2b -d cp2b`
5. **Look at browser console** (F12 → Console tab)
6. **Restart everything:**
   ```bash
   # Stop both servers (Ctrl+C)
   # Close terminals
   # Open fresh terminals
   # Run setup-windows.bat again
   ```

**You got this!** 💪
