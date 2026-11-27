// Páginas que levam a ambientação do CP2b: as moléculas de CH4 subindo no
// fundo (MoleculeField) e o Metaninho sentado no rodapé (Footer). São a Home
// e as páginas de Comunicação. Só as listagens: dentro de uma notícia, uma
// entrevista ou um álbum o fundo fica quieto para não disputar com a leitura.
export const COMMUNICATION_ROUTES = [
  '/noticias',
  '/microscopio',
  '/entrevistas',
  '/podcast',
  '/boletins',
  '/galeria',
  '/press-kit',
  '/metaninho',
  '/newsletter',
];

const AMBIENT_ROUTES = new Set(['/', ...COMMUNICATION_ROUTES]);

export const isAmbientRoute = (pathname = '/') => {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return AMBIENT_ROUTES.has(path || '/');
};
