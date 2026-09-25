// Identidade visual de cada eixo temático: um ícone e uma cor de acento.
//
// Serve para o leitor reconhecer os eixos de relance — antes, os oito cards
// eram idênticos e só o título os distinguia. A paleta é terrosa e derivada
// da marca (petróleo, verdes, âmbar), não um arco-íris, e cada cor passa no
// contraste AA como texto sobre branco. A mesma cor acompanha o eixo da figura
// do topo de /eixos até o painel de detalhamento, ligando um ao outro.
export const AXIS_THEME = {
  1: { color: '#1E3E4C', icon: 'bi-map' }, // Inventário de resíduos e mapeamento
  2: { color: '#00573A', icon: 'bi-eyedropper' }, // Ciência e tecnologia de base
  3: { color: '#1F7A6D', icon: 'bi-gear-wide-connected' }, // Engenharia de processos
  4: { color: '#467F25', icon: 'bi-bar-chart-line' }, // Avaliação integrada
  5: { color: '#66781A', icon: 'bi-lightbulb' }, // Inovação em bioprodutos
  6: { color: '#A95C00', icon: 'bi-mortarboard' }, // Educação e capacitação
  7: { color: '#9C4A2E', icon: 'bi-megaphone' }, // Difusão científica
  8: { color: '#3B5876', icon: 'bi-bank' }, // Políticas públicas
};

const FALLBACK = { color: '#00573A', icon: 'bi-diagram-3' };

export const axisTheme = (id) => AXIS_THEME[String(id)] || FALLBACK;
