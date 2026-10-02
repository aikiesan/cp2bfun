#!/usr/bin/env python3
"""
Extração dos identificadores de pesquisador (ORCID, Lattes, Google Scholar,
Scopus, Web of Science, BV FAPESP e perfil institucional) a partir da planilha
"CP2B_Equipe_2026_identificadores_final.xlsx" para o arquivo consumido pelo
site (src/data/generated/researcherProfiles.js).

NÃO faz parte do build do site — é uma ferramenta de autoria, rodada
manualmente sempre que chegar uma versão nova da planilha de identificadores.
Requer `pip install openpyxl`.

Uso:
    python scripts/extract-researcher-profiles.py <caminho-para-o-xlsx>

A planilha traz uma linha por pessoa-e-grupo, então quem atua em mais de um
eixo (a direção, por exemplo) aparece repetida com os mesmos identificadores.
As linhas repetidas são fundidas por `name_key`, preferindo o primeiro valor
não vazio de cada coluna.

Células com "NÃO LOCALIZADO" significam "procuramos e não existe/não achamos",
e viram ausência (`null`) no arquivo gerado — nunca a string, que apareceria
como um link quebrado na interface.

Biografias não vêm desta planilha: `bioPt`/`bioEn` são redigidas no admin e
ficam no banco. O módulo gerado só declara os identificadores.

Este script é idempotente: rodá-lo duas vezes sobre a mesma planilha produz
exatamente a mesma saída (chaves ordenadas, sem timestamps além da data de
origem informada no cabeçalho).
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

try:
    import openpyxl
except ImportError:
    sys.exit("Este script requer openpyxl: pip install openpyxl")

SHEET_NAME = 'Equipe CP2B 2026'
NOT_FOUND = 'NÃO LOCALIZADO'

# Coluna da planilha -> campo do objeto gerado.
COLUMNS = {
    'ORCID': 'orcid',
    'Lattes': 'lattes',
    'Google Scholar': 'scholar',
    'Scopus Author ID': 'scopus',
    'Web of Science ResearcherID': 'wos',
    'BV FAPESP': 'bvFapesp',
    'Perfil Institucional': 'institutional',
}

# Mesma regra de nameKey() em src/utils/nameKey.js e de name_key() em
# scripts/extract-strategic-data.py — se mudar uma, mude as três.
_TITLES = re.compile(r'^(prof[ao]?\.?\s*|dr[ao]?\.?\s*|me\.?\s*|msc\.?\s*|phd\.?\s*)+', re.I)
_STOPWORDS = {'da', 'de', 'do', 'dos', 'das', 'e'}


def name_key(name):
    """Chave estavel para a mesma pessoa escrita de formas diferentes."""
    if not name:
        return ''
    stripped = unicodedata.normalize('NFKD', str(name))
    stripped = ''.join(c for c in stripped if not unicodedata.combining(c))
    stripped = _TITLES.sub('', stripped.strip())
    stripped = re.sub(r'[^A-Za-z ]', ' ', stripped)
    parts = [w for w in stripped.lower().split() if w and w not in _STOPWORDS]
    if not parts:
        return ''
    return f'{parts[0]}|{parts[-1]}'


def link(value):
    """Normaliza uma celula de identificador: URL, ou None."""
    if value is None:
        return None
    text = str(value).strip()
    if not text or text.upper() == NOT_FOUND.upper():
        return None
    if not text.lower().startswith(('http://', 'https://')):
        # A planilha registra tudo como URL completa. Um valor solto seria um
        # dado novo que ninguem sabe como montar em link -- melhor avisar do
        # que gerar um href quebrado.
        print(f'  AVISO: valor sem esquema http, ignorado: {text!r}', file=sys.stderr)
        return None
    return text


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)

    xlsx = Path(sys.argv[1])
    if not xlsx.exists():
        sys.exit(f'Planilha nao encontrada: {xlsx}')

    workbook = openpyxl.load_workbook(xlsx, data_only=True)
    if SHEET_NAME not in workbook.sheetnames:
        sys.exit(f"Aba '{SHEET_NAME}' nao encontrada em {xlsx.name}")

    rows = list(workbook[SHEET_NAME].iter_rows(values_only=True))
    header = [str(h).strip() if h is not None else '' for h in rows[0]]
    for column in COLUMNS:
        if column not in header:
            sys.exit(f"Coluna '{column}' nao encontrada na aba '{SHEET_NAME}'")
    if 'Nome' not in header:
        sys.exit(f"Coluna 'Nome' nao encontrada na aba '{SHEET_NAME}'")

    profiles = {}
    names = {}
    for raw in rows[1:]:
        record = dict(zip(header, raw))
        key = name_key(record.get('Nome'))
        if not key:
            continue
        names.setdefault(key, str(record['Nome']).strip())
        entry = profiles.setdefault(key, {})
        for column, field in COLUMNS.items():
            # Primeiro valor nao vazio ganha: as linhas repetidas da mesma
            # pessoa carregam os mesmos identificadores.
            if entry.get(field) is None:
                entry[field] = link(record.get(column))

    # Descarta quem a planilha lista sem nenhum identificador: a ausencia e o
    # padrao do modulo gerado, e uma entrada toda nula nao informa nada.
    populated = {
        key: {field: value for field, value in sorted(entry.items()) if value}
        for key, entry in profiles.items()
    }
    populated = {key: entry for key, entry in populated.items() if entry}

    body = ',\n'.join(
        f'  // {names[key]}\n  {json.dumps(key, ensure_ascii=False)}: '
        + json.dumps(populated[key], ensure_ascii=False, indent=2).replace('\n', '\n  ')
        for key in sorted(populated)
    )

    counts = {
        field: sum(1 for entry in populated.values() if entry.get(field))
        for field in COLUMNS.values()
    }
    coverage = ' · '.join(f'{field} {counts[field]}' for field in COLUMNS.values())

    output = f'''// GERADO — não editar à mão.
// Gerado por scripts/extract-researcher-profiles.py a partir da aba
// '{SHEET_NAME}' de "{xlsx.name}".
//
// Identificadores públicos de pesquisador, indexados por nameKey() (primeiro +
// último nome), a mesma chave usada por teamPhotos e teamByAxis. É o que
// permite a /equipe abrir o currículo de cada pessoa.
//
// Cobertura de {len(populated)} pessoas: {coverage}.
// Quem não tem nenhum identificador não aparece aqui — a ausência é o padrão,
// e o modal de perfil é desenhado para ela.
//
// Células "{NOT_FOUND}" da planilha viram ausência, nunca a string: um
// href com esse texto seria um link quebrado na página.
//
// Biografias não vêm desta planilha: bioPt/bioEn são redigidas no admin e
// vivem no banco (team_members.bio_pt / bio_en).
import {{ nameKey }} from '../../utils/nameKey';

export const researcherProfiles = {{
{body},
}};

// Forma completa do perfil, para o consumidor não precisar testar cada campo.
const EMPTY_PROFILE = {{
  orcid: null,
  lattes: null,
  scholar: null,
  scopus: null,
  wos: null,
  bvFapesp: null,
  institutional: null,
  bioPt: null,
  bioEn: null,
}};

/**
 * Perfil de uma pessoa pelo nome, espelhando getTeamPhoto: mapa explícito por
 * nameKey, sem casamento difuso. Sempre devolve a forma completa, com null
 * para o que a planilha não trouxe.
 */
export function getResearcherProfile(name) {{
  const key = nameKey(name);
  if (!key) return {{ ...EMPTY_PROFILE }};
  return {{ ...EMPTY_PROFILE, ...(researcherProfiles[key] || {{}}) }};
}}

export default researcherProfiles;
'''

    target = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'generated' / 'researcherProfiles.js'
    target.write_text(output, encoding='utf-8')
    print(f'{target.relative_to(Path.cwd()) if target.is_relative_to(Path.cwd()) else target}: '
          f'{len(populated)} pessoas com identificador')
    print(f'  {coverage}')


if __name__ == '__main__':
    main()
