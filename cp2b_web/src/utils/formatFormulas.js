// A planilha estratégica traz fórmulas em notação LaTeX ("$CH_4$", "$H_2S$",
// "$\text{CO}_2$"); no site elas viram texto com subscrito Unicode: CH₄, H₂S.
const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
const toSubscript = (digits) => [...digits].map((c) => SUB[c]).join('');

export const formatFormulas = (text) => String(text || '').replace(
  /\$([^$]+)\$/g,
  (_, formula) => formula
    .replace(/\text\{([^}]*)\}/g, '$1')
    .replace(/_\{?(\d+)\}?/g, (m, digits) => toSubscript(digits))
    .replace(/[{}\\s]/g, ''),
);
