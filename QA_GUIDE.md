# CP2B Website — QA Guide
> Two-page quality assurance reference for the graduate student.

---

## Page 1 — What to Test & How to Run Tests

### 1.1 Automated Test Suite

The project uses **Vitest** (unit/component tests) located in `cp2b_web/src/pages/__tests__/`.

```bash
cd cp2b_web

# Run all tests once
npm test -- --run

# Run tests in watch mode (re-runs on file save)
npm test

# Run a single test file
npm test -- --run src/pages/__tests__/News.test.jsx
```

Current test files and what they cover:

| File | Covers |
|---|---|
| `News.test.jsx` | News list renders, fallback content, language switching |
| `Contact.test.jsx` | Form validation, submit behavior |
| `Research.test.jsx` | Research axes render correctly |
| `ForumPaulista.test.jsx` | Forum page content and structure |
| `NotFound.test.jsx` | 404 page renders |

> When you add a new page or component, add a corresponding test file.

---

### 1.2 Linter (Zero Warnings Policy)

```bash
cd cp2b_web
npm run lint
```

The CI pipeline blocks merges if any ESLint warning or error is present. Always run this before opening a PR. Common issues to watch for:
- Unused variables or imports
- Missing `key` prop in list renders
- Direct DOM manipulation instead of React state

---

### 1.3 Build Check

The production build must compile without errors before any release:

```bash
cd cp2b_web
npm run build
# Should complete with no errors and output a /dist folder
```

---

### 1.4 Manual QA Checklist — Public Pages

For each page below, open it in the browser and run through the checks.

#### Every page
- [ ] Page loads without a white screen or console errors
- [ ] Language toggle (PT ↔ EN) switches all visible text
- [ ] Font size controls (A+ / A-) in the top header apply correctly
- [ ] High-contrast toggle changes the visual theme
- [ ] Page is responsive: check at 1280px, 768px, and 375px (mobile)
- [ ] Back-to-top button in the Footer scrolls to top

#### Home (`/`)
- [ ] Hero carousel advances and shows correct slides
- [ ] Featured content section shows 3 items (A, B, C)
- [ ] News section shows cards; clicking one opens the article
- [ ] Videos section plays embedded video

#### News (`/noticias`)
- [ ] Cards grid renders with images, badge, title, date
- [ ] Clicking a card navigates to `/noticias/:slug`
- [ ] Article page shows full content and Back button works

#### Publications (`/publicacoes`)
- [ ] Publications list renders (or shows "Nenhuma publicação encontrada" if empty)
- [ ] Year filter narrows down the list
- [ ] Type filter (article, thesis, etc.) narrows down the list
- [ ] Search field filters by title/author in real time
- [ ] DOI / PDF / Link buttons open a new tab

#### Projects (`/projetos`)
- [ ] Featured project shown as large card at top
- [ ] Grid of remaining projects renders below
- [ ] Clicking a project navigates to `/projetos/:slug`

#### Events (`/eventos`)
- [ ] Upcoming events section shows cards (or "Nenhum evento" message)
- [ ] Past events section is collapsed by default; "Mostrar" expands it
- [ ] Date, location, and organizer are displayed on each card
- [ ] "Inscrever-se" button (if present) opens the registration URL

#### Team (`/equipe`)
- [ ] All member categories are shown
- [ ] Member photos load (or graceful placeholder if missing)

#### Contact (`/contato`)
- [ ] Form submits correctly; success message appears
- [ ] Required fields show validation errors if left empty

---

## Page 2 — QA Process & Bug Reporting

### 2.1 QA Workflow

Follow this flow every time a new feature or fix is ready for review:

```
1. Pull the feature branch
   git fetch origin
   git checkout feature/branch-name

2. Run the automated suite
   cd cp2b_web
   npm run lint           ← must pass (0 warnings)
   npm test -- --run      ← must pass (0 failures)
   npm run build          ← must complete without errors

3. Start the local dev server
   docker-compose up dev  ← http://localhost:5173

4. Execute the manual checklist (Page 1, Section 1.4)
   Focus on the pages touched by this feature/fix.

5. Test both languages
   Toggle PT ↔ EN on every page you checked.

6. Test on mobile screen size
   Open DevTools → Toggle device toolbar → iPhone SE or similar.

7. Document results
   Pass → Approve the PR.
   Fail → Open a GitHub Issue (see Section 2.2).
```

---

### 2.2 How to File a Bug Report

Open a GitHub Issue at **https://github.com/aikiesan/cp2bfun/issues/new** and fill in:

```
**Title:** [Page] Short description of the problem
Example: [Events] Past events collapse does not open on mobile

**Environment:**
- Browser: Chrome 121 / Firefox 122 / Safari 17
- Screen size: 375px / 768px / 1280px
- Language: PT / EN

**Steps to reproduce:**
1. Go to /eventos
2. Tap "Mostrar (3)" button
3. Nothing happens

**Expected:** Past events expand below the button.
**Actual:** Section stays collapsed; no console error.

**Screenshot / Video:** (attach if possible)
```

---

### 2.3 Common Issues & Where to Look

| Symptom | Likely cause | Where to check |
|---|---|---|
| Page shows spinner indefinitely | API is unreachable | Check backend is running on port 3001; check `VITE_API_URL` |
| Text not translating | Missing key in `menuLabels` or content export | `src/data/content.js` |
| 404 on direct URL visit (e.g. `/eventos`) | SPA rewrite not configured | `vercel.json` rewrites; or Nginx `try_files` config |
| Image not loading | Wrong path or file not in `public/assets/` | Confirm file exists at `cp2b_web/public/assets/filename.ext` |
| ESLint error on CI | Unused import, missing key prop | Run `npm run lint` locally and fix before pushing |
| Build fails | Import path typo, missing dependency | Read the Vite error output; check `npm install` was run |
| Form submits but no email | SMTP env vars not set in backend | `docker-compose.yml` → `SMTP_USER` / `SMTP_PASS` |

---

### 2.4 PR Review Checklist (for Reviewer)

Before approving any pull request, verify:

- [ ] `npm run lint` passes (CI enforces this, but verify locally too)
- [ ] `npm test -- --run` passes
- [ ] `npm run build` completes without errors
- [ ] New text has both `pt` and `en` keys in `content.js`
- [ ] No hardcoded Portuguese/English strings inside JSX (use `content.js`)
- [ ] New routes are registered in `App.jsx`
- [ ] New backend routes are registered in `backend/src/index.js`
- [ ] No `console.log` left in production code
- [ ] Images added to `public/assets/` are reasonably sized (< 500 KB each)
- [ ] The branch is up to date with `main` before merging

---

### 2.5 Running Tests in CI / Before Merging

The project enforces the following checks on every pull request:

```bash
npm run lint       # 0 warnings, 0 errors
npm test -- --run  # 0 test failures
npm run build      # build succeeds
```

If any of these fail, the PR cannot be merged. Fix all issues locally before pushing.
