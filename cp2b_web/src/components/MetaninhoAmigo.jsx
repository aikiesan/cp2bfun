import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Metaninho from './Metaninho';

/**
 * Easter egg: o Metaninho que responde ao clique. Cada clique faz ele dar um
 * pulinho e dizer uma frase num balão de papel; as frases se revezam e o
 * balão some sozinho depois de alguns segundos.
 *
 * Aqui ele deixa de ser só enfeite: é um botão com nome ("Metaninho, o
 * mascote do CP2b"), e o balão é uma região role="status", que o leitor de
 * tela anuncia quando a frase aparece. O balão existe o tempo todo (vazio
 * quando fechado) para o anúncio funcionar já no primeiro clique.
 *
 * Com movimento reduzido não há pulinho (Metaninho.css); o balão aparece
 * sem animação.
 */

const LINES = {
  pt: [
    'Oi! Eu sou o Metaninho: um carbono e quatro hidrogênios.',
    'No biogás, eu sou a parte que vira energia.',
    'Resíduo bem cuidado vira biogás. Pode contar comigo!',
  ],
  en: [
    "Hi! I'm Metaninho: one carbon and four hydrogens.",
    "In biogas, I'm the part that becomes energy.",
    'Well-managed waste becomes biogas. Count on me!',
  ],
};

const LABEL = {
  pt: 'Metaninho, o mascote do CP2b',
  en: "Metaninho, CP2b's mascot",
};

// Quanto tempo o balão fica aberto depois do último clique.
const BUBBLE_MS = 4000;

const MetaninhoAmigo = ({ pose = 'feliz', size = 120, lines, bubble = 'left', className }) => {
  const { language } = useLanguage();
  const list = (lines && (lines[language] || lines.pt)) || LINES[language] || LINES.pt;
  const [clicks, setClicks] = useState(0);
  const [open, setOpen] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const speak = () => {
    setClicks((n) => n + 1);
    setOpen(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), BUBBLE_MS);
  };

  const line = open && clicks > 0 ? list[(clicks - 1) % list.length] : '';
  const classes = ['metaninho-amigo', `metaninho-amigo--bubble-${bubble}`, className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      <button type="button" className="metaninho-amigo__btn" aria-label={LABEL[language] || LABEL.pt} onClick={speak}>
        {/* A chave nova remonta a figura, e a animação do pulinho recomeça. */}
        <Metaninho key={clicks} pose={pose} size={size} className={clicks > 0 ? 'metaninho--hop' : undefined} />
      </button>
      <span className="metaninho-amigo__bubble" role="status" data-open={line ? 'true' : undefined}>
        {line}
      </span>
    </span>
  );
};

export default MetaninhoAmigo;
