# Registro de Conformidade com o Defeso Eleitoral 2026 e Guia de Restauração

**Projeto:** CP2B — Centro Paulista de Estudos em Biogás e Bioprodutos (UNICAMP)  
**Período de Restrição Eleitoral:** 04 de julho de 2026 a 25 de outubro de 2026 (data do 2º turno)  
**Data Autorizada para Restauração:** **26 de outubro de 2026**  
**Documento de Referência:** Lei nº 9.504/1997, Resoluções do TSE e Ofício Circular GR 01/2026 (Reitoria da UNICAMP)

---

## 1. Contexto e Diretrizes Jurídico-Institucionais

Durante o período de defeso eleitoral (três meses antes do pleito até a conclusão das eleições), a legislação brasileira (art. 73, VI, "b" da Lei 9.504/1997) proíbe a realização ou manutenção de **publicidade institucional** de atos, programas, obras, serviços e campanhas dos órgãos públicos e governos.

### Critérios Adotados no CP2B:
* **🟢 Manter (Preservação Científica e Territorial):** A delimitação geográfica da pesquisa ("Estado de São Paulo", "Campinas", "Piracicaba"), resultados de estudos, dashboards, mapas, equipe acadêmica, identidade UNICAMP / NIPE e atribuição a agências de fomento à pesquisa (FAPESP, CNPq).
* **🔴 Ocultar Temporariamente (Conformidade Eleitoral):** Logotipos e assinaturas do Governo do Estado de São Paulo, brasões e marcas de prefeituras municipais, nomes de secretarias de governo em áreas promocionais/de parceiros, e identificação de cargos públicos em comissão/autoridades em mesas de abertura de eventos.

---

## 2. Inventário de Elementos Ocultados e Modificados

| Componente / Arquivo | Elemento Original | Ação Aplicada no Defeso | Status de Reversibilidade |
| :--- | :--- | :--- | :--- |
| **Imagem de Parceiros**<br>[`cp2b_web/public/assets/parceiros.png`](file:///c:/Users/Lucas/Documents/cp2b_website/cp2b_web/public/assets/parceiros.png) e [`public/assets/parceiros.png`](file:///c:/Users/Lucas/Documents/cp2b_website/public/assets/parceiros.png) | Continha logotipos do **Governo de SP / Secretaria de Agricultura** e **Prefeitura de Campinas / SECLIMAS**. | • Backup criado como `parceiros_original.png`.<br>• Removidos os 2 blocos de logotipos governamentais na imagem ativa. | ✅ Arquivo original salvo com 100% de fidelidade em `parceiros_original.png`. |
| **Página de Parceiros & Dados**<br>[`cp2b_web/src/data/content.js`](file:///c:/Users/Lucas/Documents/cp2b_website/cp2b_web/src/data/content.js#L173)<br>[`src/data/content.js`](file:///c:/Users/Lucas/Documents/cp2b_website/src/data/content.js#L126) | `public: [ { name: 'Secretaria Estadual de Agricultura...', location: 'São Paulo, SP' }, { name: 'Secretaria Municipal do Verde... Campinas', location: 'Campinas, SP' } ]` | Definido temporariamente como `public: []` com o bloco original comentado e marcado com tag de restauração. A seção não é renderizada no layout. | ✅ Basta descomentar o bloco em `content.js`. |
| **Cronograma do Fórum**<br>[`CronogramaEvento.jsx`](file:///c:/Users/Lucas/Documents/cp2b_website/cp2b_web/src/pages/CronogramaEvento.jsx#L34) | Mesa de abertura com cargos e inst: `Governo de SP`, `Prefeitura de Campinas`, `SEMIL-SP`, `Secretaria de Agricultura`. | Cargos e siglas neutralizados para "Convidado Institucional", "Setor Agroenergético", "Sustentabilidade" e "Setor Energético", com código original em comentários. | ✅ Basta descomentar o bloco original em `CronogramaEvento.jsx`. |
| **Painel 2 do Fórum**<br>[`CronogramaEvento.jsx`](file:///c:/Users/Lucas/Documents/cp2b_website/cp2b_web/src/pages/CronogramaEvento.jsx#L136) | Lais Palazzo Almada com filiação `inst: 'SEMIL-SP'`. | Filiação neutralizada para `inst: 'Setor de P&G'`. | ✅ Basta descomentar a linha original. |
| **Mapa de Pesquisa**<br>[`src/components/ResearchMap.jsx`](file:///c:/Users/Lucas/Documents/cp2b_website/src/components/ResearchMap.jsx#L18) | Rótulo `'Governo'` e marcador de localização da Secretaria de Agricultura (SAASP). | Rótulo ajustado para `'Instituições Parceiras'` e pin da SAASP comentado. | ✅ Basta descomentar o pin e restaurar o rótulo. |

---

## 3. Passo a Passo para Reativação Pós-Eleições (A partir de 26/10/2026)

Após o término do período eleitoral em **26 de outubro de 2026**, execute as etapas a seguir para restaurar integralmente a exibição de todos os parceiros e registros:

### Etapa 1: Restaurar a Imagem Original de Parceiros
Basta copiar o arquivo de backup de volta para `parceiros.png`:

**No PowerShell (Windows):**
```powershell
Copy-Item cp2b_web/public/assets/parceiros_original.png cp2b_web/public/assets/parceiros.png -Force
Copy-Item public/assets/parceiros_original.png public/assets/parceiros.png -Force
```

**No Bash (Linux/macOS):**
```bash
cp cp2b_web/public/assets/parceiros_original.png cp2b_web/public/assets/parceiros.png
cp public/assets/parceiros_original.png public/assets/parceiros.png
```

---

### Etapa 2: Reativar Parceiros Públicos no `content.js`

1. Abra [`cp2b_web/src/data/content.js`](file:///c:/Users/Lucas/Documents/cp2b_website/cp2b_web/src/data/content.js#L173) e [`src/data/content.js`](file:///c:/Users/Lucas/Documents/cp2b_website/src/data/content.js#L126).
2. Localize o bloco `export const partners`:
3. Substitua `public: [],` por:
```javascript
  public: [
    { name: 'Secretaria Estadual de Agricultura e Abastecimento de São Paulo (SAASP)', location: 'São Paulo, SP' },
    { name: 'Secretaria Municipal do Verde, Meio Ambiente e Desenvolvimento Sustentável de Campinas (SMVMADS/PMC)', location: 'Campinas, SP' }
  ],
```

---

### Etapa 3: Restaurar Mesa de Abertura em `CronogramaEvento.jsx`

1. Abra [`cp2b_web/src/pages/CronogramaEvento.jsx`](file:///c:/Users/Lucas/Documents/cp2b_website/cp2b_web/src/pages/CronogramaEvento.jsx#L34).
2. Na sessão `'abertura'`, descomente a listagem original com os cargos e instituições oficiais:
```javascript
        speakers: [
          { name: 'Rosângela', role: { pt: 'Anfitriã / Boas-vindas', en: 'Host / Welcome' }, inst: 'NIPE', isModerator: false },
          { name: 'Ana Maria Frattini Fileti', role: { pt: 'Pró-Reitora de Pesquisa', en: 'Vice-Rector for Research' }, inst: 'UNICAMP', isModerator: false },
          { name: 'Ricardo Rosário', role: { pt: 'Assessor Especial de Gabinete da Secretaria de Agricultura', en: 'Special Cabinet Advisor, Secretary of Agriculture' }, inst: 'Governo de SP', isModerator: false },
          { name: 'Braz dos Santos Adegas Júnior', role: { pt: 'Secretário de Clima e Sustentabilidade', en: 'Secretary of Climate & Sustainability' }, inst: 'Prefeitura de Campinas', isModerator: false },
          { name: 'Marisa Maia de Barros', role: { pt: 'Subsecretária de Energia e Mineração', en: 'Under-Secretary for Energy & Mining' }, inst: 'SEMIL-SP', isModerator: false },
          { name: 'Bruna de Souza Moraes', role: { pt: 'Diretora do CP2b', en: 'CP2b Director' }, inst: 'CP2b / UNICAMP', isModerator: false },
        ],
```
3. No Painel 2 (`sessionId: 'painel2'`), restabeleça a vinculação de Lais Palazzo Almada:
```javascript
          { name: 'Lais Palazzo Almada', role: { pt: 'Diretora de P&G e Biocombustíveis', en: 'Oil, Gas & Biofuels Director' }, inst: 'SEMIL-SP', isModerator: false },
```

---

### Etapa 4: Restaurar Filtro e Marcador em `ResearchMap.jsx`

1. Abra [`src/components/ResearchMap.jsx`](file:///c:/Users/Lucas/Documents/cp2b_website/src/components/ResearchMap.jsx).
2. Restaure o rótulo `public: 'Governo'` (pt) e `public: 'Government'` (en).
3. Descomente o item de localização da SAASP:
```javascript
    {
      id: 7,
      name: 'SAASP',
      city: 'São Paulo, SP',
      category: 'public',
      description: language === 'pt' ? 'Secretaria de Agricultura e Abastecimento' : 'Agriculture and Supply Secretary',
      x: 66, y: 71
    },
```

---

### Etapa 5: Validação e Publicação
Após realizar os passos acima, execute:
```bash
cd cp2b_web
npm run test:run
npm run build
```
E realize o commit e push para o repositório principal:
```bash
git add .
git commit -m "chore: restauração de parceiros institucionais e eventos pós-defeso eleitoral 2026"
git push origin main
```
