# 🚀 CP2B Website - START HERE

**Your complete deployment is ready! Follow these steps to go live.**

---

## 📋 What You Have Now

✅ **Complete codebase** with all features (news, publications, projects, admin panel)
✅ **Production deployment infrastructure** (Apache2, systemd, PostgreSQL)
✅ **Automated deployment scripts** (deploy, backup, rollback)
✅ **Comprehensive documentation** (3 detailed guides)
✅ **Branch ready to merge** (88 commits ahead of main)

---

## 🎯 Quick Start: 3 Simple Steps

### Step 1: Merge Pull Request

1. Open this link in your browser:
   ```
   https://github.com/aikiesan/cp2bfun/pull/new/claude/add-publications-events-projects-systems
   ```

2. Click **"Create pull request"**

3. Use this title:
   ```
   Fix UI issues, API error handling, and add deployment docs
   ```

4. Copy this description into the PR:
   ```markdown
   ## Summary
   This PR includes bug fixes and improvements for production readiness:

   ### Bug Fixes
   - Fixed missing `projectsItems` export causing runtime errors on Projects page
   - Enhanced text visibility on homepage featured cards (100% readable on all backgrounds)
   - Suppressed expected API fetch errors when backend is not running

   ### Improvements
   - Darker gradient overlays on featured cards (85% opacity)
   - Stronger multi-layer text shadows for better contrast
   - Cleaner console output during development

   ### Production Deployment
   - Complete Apache2/systemd deployment infrastructure
   - Automated deployment scripts (deploy.sh, backup.sh, rollback.sh)
   - Health monitoring system
   - Comprehensive VM setup guide
   - SSH deployment quick start guide

   ### Documentation
   - Added comprehensive setup guides (QUICK_START.md, DEPLOY_SSH_GUIDE.md)
   - Added implementation summaries for admin features
   - Added Windows automated setup script

   ### Testing
   - ✅ Projects page loads without errors
   - ✅ Featured content cards have 100% text visibility
   - ✅ Console is clean when API server is not running
   - ✅ Bilingual support (PT/EN) works correctly

   ## Files Changed
   - `cp2b_web/src/data/content.js` - Added projectsItems export
   - `cp2b_web/src/index.css` - Enhanced text visibility
   - `cp2b_web/src/services/api.js` - Improved error handling
   - `deployment/*` - Complete production deployment infrastructure
   - Documentation and setup files

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   ```

5. Click **"Create pull request"** again

6. Review the changes, then click **"Merge pull request"**

7. Click **"Confirm merge"**

8. ✅ Done! Your main branch now has all the latest code.

---

### Step 2: Connect to Your VM

**You need:**
- VM IP address (e.g., `192.168.1.100`)
- SSH username (e.g., `admin` or `root`)
- SSH password or key

**Connect from your computer:**

```bash
ssh username@your-vm-ip-address
```

**Example:**
```bash
ssh admin@192.168.1.100
```

**First time?** Type `yes` when asked about fingerprint.

---

### Step 3: Deploy the Website

**Follow the step-by-step guide:**

📖 **Open and follow:** [DEPLOY_SSH_GUIDE.md](./DEPLOY_SSH_GUIDE.md)

**Quick overview:**

1. **Update system** (5 min)
   ```bash
   sudo apt-get update && sudo apt-get upgrade -y
   ```

2. **Install software** (10 min)
   ```bash
   # Node.js, PostgreSQL, Apache2, Git
   # See DEPLOY_SSH_GUIDE.md for exact commands
   ```

3. **Clone repository** (2 min)
   ```bash
   sudo mkdir -p /var/www/cp2b
   cd /var/www/cp2b
   git clone https://github.com/aikiesan/cp2bfun.git repo
   ```

4. **Set up database** (3 min)
   ```bash
   cd /var/www/cp2b/repo/deployment/db
   chmod +x setup-postgres.sh
   sudo ./setup-postgres.sh
   # SAVE THE PASSWORD IT GENERATES!
   ```

5. **Configure backend** (5 min)
   ```bash
   # Edit .env file with database password
   # See DEPLOY_SSH_GUIDE.md Section 7
   ```

6. **Deploy everything** (5 min)
   ```bash
   cd /var/www/cp2b/repo/deployment
   chmod +x deploy.sh
   sudo ./deploy.sh
   ```

7. **Open in browser**
   ```
   http://your-vm-ip-address
   ```

**Total time: ~30 minutes**

---

## 📚 Documentation Guide

### Which Guide Should I Read?

**1. For SSH deployment RIGHT NOW:**
→ 📘 **[DEPLOY_SSH_GUIDE.md](./DEPLOY_SSH_GUIDE.md)** ⭐ **START HERE!**
- Step-by-step SSH connection
- Copy-paste commands
- First-time setup
- Troubleshooting

**2. For detailed production setup:**
→ 📗 **[deployment/VM_SETUP_GUIDE.md](./deployment/VM_SETUP_GUIDE.md)**
- Comprehensive 50-page guide
- All configuration options
- Security setup
- SSL/HTTPS configuration
- Advanced troubleshooting

**3. For local development:**
→ 📕 **[QUICK_START.md](./QUICK_START.md)**
- Run on your laptop
- Test locally before deploying
- Development workflow

**4. For deployment overview:**
→ 📙 **[DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md)**
- What's included
- Checklists
- Success criteria

---

## ⚡ Future Updates (After Initial Setup)

**It's super easy!** Just 3 commands:

```bash
# 1. SSH into your VM
ssh username@your-vm-ip-address

# 2. Navigate to deployment directory
cd /var/www/cp2b/repo/deployment

# 3. Deploy updates
sudo ./deploy.sh
```

**That's it!** The script automatically:
- ✅ Creates backup
- ✅ Pulls latest code from GitHub
- ✅ Builds frontend
- ✅ Updates backend
- ✅ Restarts services
- ✅ Runs health checks
- ✅ Rolls back if anything fails

**Total time: 2-5 minutes per deployment**

---

## 🆘 Need Help?

### During Setup

**Check the guides:**
1. [DEPLOY_SSH_GUIDE.md](./DEPLOY_SSH_GUIDE.md) - Has troubleshooting section
2. [deployment/VM_SETUP_GUIDE.md](./deployment/VM_SETUP_GUIDE.md) - Advanced troubleshooting

**Common issues:**

| Issue | Quick Fix |
|-------|-----------|
| SSH connection refused | Check VM is running, firewall allows port 22 |
| Backend won't start | Check logs: `sudo journalctl -u cp2b-backend -n 50` |
| Website not loading | Check Apache: `sudo systemctl status apache2` |
| 502 Bad Gateway | Backend not running: `sudo systemctl restart cp2b-backend` |
| Database error | Check DATABASE_URL in `/var/www/cp2b/backend/.env` |

### After Deployment

**Health check:**
```bash
sudo /var/www/cp2b/repo/deployment/health-check.sh
```

**View logs:**
```bash
# Backend logs
sudo journalctl -u cp2b-backend -f

# Apache logs
sudo tail -f /var/log/apache2/cp2b-error.log
```

---

## ✅ Deployment Checklist

**Before you start:**
- [ ] VM is running (Debian 12 x64)
- [ ] You can SSH into the VM
- [ ] VM has internet access
- [ ] You have sudo privileges
- [ ] Pull Request is merged to main

**During setup:**
- [ ] System updated
- [ ] Node.js 20, PostgreSQL 15, Apache2 installed
- [ ] Repository cloned
- [ ] Database initialized (password saved!)
- [ ] Backend .env configured
- [ ] Frontend built
- [ ] Apache2 configured
- [ ] Firewall configured
- [ ] All services running

**After setup:**
- [ ] Website accessible in browser
- [ ] Admin panel works (`/admin`)
- [ ] Health check passes
- [ ] Default admin password changed
- [ ] Automated backups scheduled
- [ ] SSL/HTTPS configured (if using domain)

---

## 🎯 Quick Reference

### Key Files

```
DEPLOY_SSH_GUIDE.md              ← Start here for SSH deployment
deployment/VM_SETUP_GUIDE.md     ← Detailed production guide
deployment/deploy.sh             ← Automated deployment
deployment/backup.sh             ← Backup script
deployment/rollback.sh           ← Rollback script
deployment/health-check.sh       ← System health check
```

### Key Commands

```bash
# Deploy updates
sudo /var/www/cp2b/repo/deployment/deploy.sh

# Health check
sudo /var/www/cp2b/repo/deployment/health-check.sh

# Backup
sudo /var/www/cp2b/repo/deployment/backup.sh

# Rollback
sudo /var/www/cp2b/repo/deployment/rollback.sh

# View logs
sudo journalctl -u cp2b-backend -f

# Restart backend
sudo systemctl restart cp2b-backend

# Restart Apache
sudo systemctl reload apache2
```

### Key Locations

```
/var/www/cp2b/repo/              ← Git repository
/var/www/cp2b/frontend/dist/     ← Website files
/var/www/cp2b/backend/           ← Backend API
/var/www/cp2b/backups/           ← Automated backups
/var/www/cp2b/db-credentials.txt ← Database password
```

---

## 🎉 You're Ready!

Everything is prepared for deployment:

✅ Code is ready (88 commits, fully tested)
✅ Deployment scripts are automated
✅ Documentation is comprehensive
✅ Backup/rollback is ready
✅ Health monitoring is configured

**Next action:** Follow [DEPLOY_SSH_GUIDE.md](./DEPLOY_SSH_GUIDE.md) step-by-step.

**Time to deployment:** ~30 minutes for first-time setup

**Time for future updates:** 2-5 minutes (automated)

---

## 📞 Support

**Documentation:**
- [DEPLOY_SSH_GUIDE.md](./DEPLOY_SSH_GUIDE.md) - SSH deployment guide
- [deployment/VM_SETUP_GUIDE.md](./deployment/VM_SETUP_GUIDE.md) - Complete production guide
- [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md) - Deployment summary
- [README.md](./README.md) - Project overview

**GitHub:**
- Repository: https://github.com/aikiesan/cp2bfun
- Issues: https://github.com/aikiesan/cp2bfun/issues

---

**Good luck with your deployment! 🚀**

The CP2B website is production-ready with complete automation, monitoring, and documentation.
