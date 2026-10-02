// Stable key for the same person written different ways.
//
// The team list and the strategic spreadsheet disagree about names all the
// time: the site carries academic titles the spreadsheet doesn't, and middle
// names come and go — "Dante Pezzin" vs "Dante Chiavareto Pezzin",
// "Mauro Donizetti Berni" vs "Mauro Donizeti Berni", "Marcelo Pereira Cunha"
// vs "Marcelo Pereira da Cunha".
//
// Comparing on first + last name is what survives both spellings. This is
// deliberately the same rule as name_key() in
// scripts/extract-strategic-data.py — if you change one, change the other.

const TITLES = /^(prof[ao]?\.?\s*|dr[ao]?\.?\s*|me\.?\s*|msc\.?\s*|phd\.?\s*)+/i;
const STOPWORDS = new Set(['da', 'de', 'do', 'dos', 'das', 'e']);

export function nameKey(name) {
  if (!name) return '';

  const stripped = String(name)
    .normalize('NFKD')
    // Drop combining accent marks so "Ângela" and "Angela" agree.
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .replace(TITLES, '')
    .replace(/[^A-Za-z ]/g, ' ');

  const parts = stripped
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w));

  if (parts.length === 0) return '';
  return `${parts[0]}|${parts[parts.length - 1]}`;
}

export default nameKey;
