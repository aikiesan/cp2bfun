/**
 * Guarda contra a deriva entre as rotas do painel e as duas tabelas que
 * precisam acompanhá-las: o menu lateral (AdminLayout) e os rótulos da trilha
 * (Breadcrumbs).
 *
 * As duas ficaram para trás na prática. `/admin/newsletter` existia como rota,
 * o Dashboard e o Guia de Uso mandavam o usuário para lá, mas o menu não tinha
 * o item — só dava para chegar digitando a URL. E `newsletter`, `page-status`,
 * `settings` e outros nove segmentos apareciam crus na trilha ("Dashboard >
 * settings") porque ninguém os acrescentou ao labelMap.
 *
 * Os três arquivos são lidos como texto em vez de importados: o que interessa
 * é o que está declarado na fonte, e montar o AdminLayout exigiria o contexto
 * de rota, a API e os contadores de badge — ruído para a pergunta aqui.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (p) => fs.readFileSync(path.resolve(here, p), 'utf8');

const adminApp = read('../../../AdminApp.jsx');
const adminLayout = read('../AdminLayout.jsx');
const breadcrumbs = read('../../../components/admin/Breadcrumbs.jsx');

/** Caminhos declarados em `<Route path="...">` dentro do AdminApp. */
const routePaths = [...adminApp.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);

/**
 * Rotas que de propósito não viram item de menu: um formulário de criação e um
 * de edição se alcançam pelo botão da listagem correspondente, não pelo menu.
 *
 * `gallery/upload` é a mesma ideia com outro nome — o botão "Enviar Fotos" da
 * listagem da Galeria, do Dashboard e do Guia de Uso levam até ela. Acrescente
 * aqui apenas rotas com um caminho de acesso verificado; a ausência no menu foi
 * um bug de verdade no caso da Newsletter.
 */
const SEM_MENU_POR_DESIGN = ['gallery/upload'];
const isFormRoute = (p) =>
  p.endsWith('/new') || p.includes(':') || SEM_MENU_POR_DESIGN.includes(p);

describe('navegação do painel administrativo', () => {
  it('encontra as rotas declaradas no AdminApp', () => {
    // Se este número despencar, o regex acima parou de casar e os testes
    // abaixo estariam passando por vacuidade.
    expect(routePaths.length).toBeGreaterThan(40);
  });

  it('tem item de menu para cada rota que não é formulário', () => {
    const semMenu = routePaths
      .filter((p) => !isFormRoute(p))
      .filter((p) => !adminLayout.includes(`/admin/${p}`));

    expect(semMenu).toEqual([]);
  });

  it('tem rótulo de trilha para cada segmento estático das rotas', () => {
    const segmentos = new Set(
      routePaths
        .flatMap((p) => p.split('/'))
        .filter((s) => s && !s.startsWith(':'))
    );

    const semRotulo = [...segmentos].filter(
      (s) => !new RegExp(`(^|\\s)'?${s}'?:`, 'm').test(breadcrumbs)
    );

    expect(semRotulo).toEqual([]);
  });

  it('chama as entrevistas pelo mesmo nome no menu e na trilha', () => {
    // O conteúdo mora em /admin/projects mas é publicado em /entrevistas. O
    // Dashboard chamava a mesma coisa de "Projetos", então a equipe via uma
    // contagem que não achava no menu.
    expect(adminLayout).toContain("label: 'Entrevistas'");
    expect(breadcrumbs).toContain("projects: 'Entrevistas'");
    expect(read('../Dashboard.jsx')).toContain("title: 'Entrevistas'");
  });
});
