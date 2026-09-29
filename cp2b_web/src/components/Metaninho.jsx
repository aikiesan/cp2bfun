import './Metaninho.css';

/**
 * Metaninho, o mascote do CP2b: uma molécula de metano (CH₄) de papel
 * recortado — o carbono em azul-petróleo, os quatro hidrogênios em lima.
 *
 * É sempre enfeite: o texto ao lado dele diz o que importa (a página não
 * existe, a busca veio vazia, a mensagem foi enviada). Por isso fica fora da
 * árvore de acessibilidade, com alt vazio e aria-hidden.
 *
 * Ao aparecer ele dá um pulinho, uma vez só (Metaninho.css); com movimento
 * reduzido, só aparece.
 */

// Largura × altura de cada arquivo em public/assets/metaninho/ (todos com
// 360 px de altura), para a imagem reservar o espaço certo antes de carregar.
const POSES = {
  neutro: [262, 360],
  feliz: [273, 360],
  curioso: [308, 360],
  'em-pe': [258, 360],
  tranquilo: [290, 360],
  surpreso: [268, 360],
};

const Metaninho = ({ pose = 'neutro', size = 120, className }) => {
  const name = POSES[pose] ? pose : 'neutro';
  const [w, h] = POSES[name];
  return (
    <img
      src={`/assets/metaninho/metaninho-${name}.webp`}
      alt=""
      aria-hidden="true"
      width={Math.round((w / h) * size)}
      height={size}
      loading="lazy"
      decoding="async"
      data-pose={name}
      className={className ? `metaninho ${className}` : 'metaninho'}
    />
  );
};

export default Metaninho;
