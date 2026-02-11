# Quick Test Guide - Admin Content Reorganization

## Access the Admin Panel

1. **Open Browser:** Navigate to `http://localhost:5175/admin`
2. **Login:** Use your admin credentials

---

## Test 1: New Sidebar Navigation ✅

### Check the New Category
1. Look for **"CONTEÚDO DE PÁGINAS"** in the left sidebar
2. Click the category header to expand/collapse
3. Verify 4 menu items appear:
   - 🏠 **Página Inicial**
   - ℹ️ **Página Sobre**
   - 📊 **Governança**
   - 👁️ **Transparência**

### Verify Category Reorganization
**SOBRE & EQUIPE** should now have:
- 👤 Membros da Equipe
- 📐 Eixos de Pesquisa
- 🏢 Parceiros *(moved from ENGAJAMENTO)*

**ENGAJAMENTO** should now only have:
- ✉️ Mensagens

---

## Test 2: Home Content Editor (Página Inicial)

1. **Navigate:** Click sidebar → CONTEÚDO DE PÁGINAS → Página Inicial
   - Or go directly to: `http://localhost:5175/admin/content/home`

2. **Verify Page Title:** "Página Inicial (Fórum)"

3. **Test Language Tabs:**
   - Click **🇧🇷 Português** tab
   - Click **🇺🇸 English** tab
   - Both should switch content

4. **Fill Form (Português):**
   ```
   Badge: NOVIDADE
   Subtítulo: Centro de Pesquisa
   Título Principal: *Bem-vindo ao CP2B
   Descrição: *Centro Paulista de Estudos em Biogás e Bioprodutos
   Texto do Botão: Saiba Mais
   Link do Botão: /sobre
   ```
   *(Fields with * are required)*

5. **Save:**
   - Click **"Salvar Alterações"**
   - ✅ Green toast should appear: "Conteúdo salvo com sucesso!"

6. **Verify Persistence:**
   - Refresh the page (F5)
   - All data should still be there

---

## Test 3: About Content Editor (Página Sobre)

1. **Navigate:** `http://localhost:5175/admin/content/about`

2. **Fill Required Fields (Português):**
   ```
   Resumo: *O CP2B é um centro de pesquisa dedicado ao estudo de biogás
   Objetivos: *Promover pesquisa e desenvolvimento em biogás
   Resultados Esperados: *Avanços científicos e tecnológicos na área
   ```

3. **Switch to English Tab:**
   - Fill same fields in English

4. **Save and Verify:** Green toast should appear

---

## Test 4: Research Axes with Images (Eixos de Pesquisa)

1. **Navigate:** Sidebar → SOBRE & EQUIPE → Eixos de Pesquisa
   - Or: `http://localhost:5175/admin/axes`

2. **Open Axis 1:**
   - Click "Eixo 1" accordion to expand

3. **Fill Coordinator Info:**
   ```
   Coordenador(es): Prof. Dr. João Silva
   ```

4. **Upload Coordinator Photo:**
   - Find the **"Foto do Coordenador"** field
   - Click **"Escolher Imagem"**
   - Select a square image (200x200px or larger)
   - ✅ Preview should appear below

5. **Add Sub-Coordinator (Optional):**
   ```
   Sub-Coordenador(es): Profa. Dra. Maria Santos
   ```
   - Upload photo for sub-coordinator too

6. **Save:**
   - Scroll down and click **"Salvar Eixo 1"**
   - ✅ Green toast: "Eixo 1 atualizado com sucesso!"

7. **Verify Images Persist:**
   - Refresh page
   - Images should still be visible

---

## Test 5: Governance & Transparency

### Governance (`/admin/content/governance`)
1. Navigate to page
2. Fill section titles and content (all optional)
3. Save and verify success toast

### Transparency (`/admin/content/transparency`)
1. Navigate to page
2. Fill FAPESP information:
   ```
   Número do Processo FAPESP: 2020/12345-6
   Link FAPESP: https://bv.fapesp.br/...
   ```
3. Save and verify

---

## Test 6: Mobile Menu (Responsive)

1. **Resize Browser:** Make window narrow (<768px) or use mobile view
2. **Open Menu:** Click hamburger icon (☰) in top-left
3. **Verify:** Offcanvas sidebar should slide in from left
4. **Check Items:** All new menu items should be visible
5. **Navigate:** Click any item - menu should close and navigate

---

## Test 7: Verify Old Route is Gone

1. **Navigate:** Try to go to `http://localhost:5175/admin/content`
   - Should redirect or show 404/not found
   - This confirms the old ContentEditor is removed

---

## Expected Results Summary

✅ **Sidebar Navigation:**
- New "CONTEÚDO DE PÁGINAS" category visible
- 4 individual content page links work
- Category collapse/expand functions
- Mobile Offcanvas shows all items
- Partners moved to SOBRE & EQUIPE

✅ **Content Editors:**
- Each page loads at correct URL
- Page titles display correctly
- Language tabs switch properly
- Forms validate required fields
- Save operations succeed with green toast
- Data persists after refresh

✅ **Research Axes:**
- Coordinator name field works
- Coordinator image upload works
- Image preview displays
- Sub-coordinator fields present (optional)
- Save includes all new fields

✅ **No Errors:**
- No console errors in browser DevTools
- No 404s in Network tab
- All API calls succeed (200 status)
- No broken links in navigation

---

## Troubleshooting

### Issue: Page Not Loading
**Solution:** Check dev server is running on port 5175
```bash
# Check running containers
docker ps
# Should see: cp2b_web-dev-1, cp2b_web-backend-1, cp2b_web-db-1
```

### Issue: "Erro ao carregar conteúdo"
**Solution:** Check backend is running and database is accessible
```bash
# Check backend logs
docker logs cp2b_web-backend-1 --tail 50
```

### Issue: Image Upload Not Working
**Solution:** Verify upload endpoint is configured
- Check browser Network tab for `/api/upload` request
- Should return JSON with `url` field

### Issue: Old ContentEditor Still Showing
**Solution:** Clear browser cache and refresh
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## Database Verification (Optional)

If you want to verify the database migration:

```bash
# Check research_axes table structure
docker exec cp2b_web-db-1 psql -U cp2b -d cp2b -c "\d research_axes"

# Should show these columns:
# - coordinator_image (character varying 500)
# - sub_coordinator (character varying 255)
# - sub_coordinator_image (character varying 500)

# Check saved coordinator data
docker exec cp2b_web-db-1 psql -U cp2b -d cp2b -c "SELECT axis_number, coordinator, coordinator_image FROM research_axes LIMIT 3;"
```

---

## Quick Visual Checklist

Open admin panel (`http://localhost:5175/admin`) and verify:

- [ ] Dashboard loads
- [ ] Sidebar shows "CONTEÚDO DE PÁGINAS" category
- [ ] Click category - expands to show 4 items
- [ ] Click "Página Inicial" - opens home content editor
- [ ] Switch PT/EN tabs - both work
- [ ] Fill form and save - green toast appears
- [ ] Refresh page - data persists
- [ ] Navigate to "Eixos de Pesquisa"
- [ ] Open any axis accordion
- [ ] See "Foto do Coordenador" field with image upload
- [ ] Upload test image - preview appears
- [ ] Save axis - green toast appears
- [ ] Resize to mobile - hamburger menu appears
- [ ] Click hamburger - offcanvas opens with all items

---

## Success!

If all tests pass, the reorganization is working correctly! 🎉

**Next Steps:**
1. Test with real content data
2. Upload actual coordinator photos
3. Train content managers on new interface
4. Monitor for any issues in production use

**Documentation:**
- Full implementation details: `ADMIN_CONTENT_REORGANIZATION.md`
- Admin components guide: `ADMIN_COMPONENTS_GUIDE.md`

---

**Dev Server:** http://localhost:5175/admin
**Test Date:** 2026-02-09
**Status:** Ready for Testing ✅
