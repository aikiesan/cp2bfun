#!/usr/bin/env python3
"""
Limpeza e estruturacao das publicacoes do CP2b a partir do seed inicial
(backend/src/db/migrations/026_publications_seed.sql).

Gera a migration `backend/src/db/migrations/028_publications_cleanup.sql`
com instrucoes UPDATE idempotentes.

Citacoes com formatacao ambigua ou incompleta sao preservadas intactas
e sinalizadas para revisao manual no admin (/admin/publications).

Uso:
    python scripts/extract-publications.py [caminho-para-026_publications_seed.sql]
"""
import re
import sys
from pathlib import Path


def escape_sql(value):
    if value is None:
        return "NULL"
    escaped = str(value).replace("'", "''")
    return f"'{escaped}'"


def extract_doi_from_text(text):
    match = re.search(
        r'(?:https?://(?:dx\.)?doi\.org/|DOI:\s*|10\.)(10\.\d{4,9}/[-._;()/:A-Za-z0-9]+)',
        text,
        re.IGNORECASE
    )
    if match:
        return match.group(1).rstrip('.) ')
    return None


def clean_url_suffix(text):
    """Remove URLs, DOIs e sufixos de citacao do fim da string."""
    t = text.strip()
    t = re.sub(r'\s*\(?\s*Citações:\s*\d+[^)]*\)?', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\s*(?:-\s*DOI:\s*10\.\S+|\(https?://\S+\)|https?://\S+)\.?$', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\s*\(?https?://(?:dx\.)?doi\.org/[^)]+\)?\.?$', '', t, flags=re.IGNORECASE)
    return t.strip().rstrip(' .')


def is_author_token(part):
    """Verifica se um segmento parece um autor 'Sobrenome, Iniciais'."""
    p = part.strip()
    if not p:
        return False
    if re.match(r'^[A-Za-zÀ-ÿ\-\'\s]+,\s*[A-Za-zÀ-ÿ\.\s\-]+$', p):
        words = p.split()
        return len(words) <= 5
    return False


def parse_citation(raw_text, seed_doi, seed_year):
    """
    Tenta analisar a citacao em (authors, title, journal, year, doi).
    Retorna (parsed_dict, confidence_bool, reason_str).
    """
    text = raw_text.strip()
    doi = seed_doi or extract_doi_from_text(text)

    # ----------------------------------------------------
    # Caso 1: Padrao APA com ano em parenteses: "Autores (YYYY). Titulo. Periodico, ..."
    # ----------------------------------------------------
    apa_year_match = re.search(r'\((19\d\d|20\d\d)\)', text)
    if apa_year_match and not text.startswith('DIAS,') and ';' not in text[:80]:
        year = int(apa_year_match.group(1))
        idx_year = apa_year_match.start()
        authors_part = text[:idx_year].strip().rstrip(', ')
        rest = text[apa_year_match.end():].strip().lstrip('. ')

        rest_cleaned = clean_url_suffix(rest)
        parts = re.split(r'\.\s+', rest_cleaned)
        if len(parts) >= 2 and len(authors_part) > 3:
            title = parts[0].strip()
            journal_raw = parts[1].strip()
            journal = journal_raw.split(',')[0].strip()
            if ' - QUALIS' in journal_raw:
                journal = journal_raw.split(' - QUALIS')[0].strip() + ' - QUALIS B1'

            if len(title) > 10 and len(journal) > 2:
                return {
                    'authors': authors_part,
                    'title_pt': title,
                    'journal': journal,
                    'year': year,
                    'doi': doi,
                    'pattern': 'APA'
                }, True, 'Padrao APA reconhecido'

    # ----------------------------------------------------
    # Caso 2: Padrao ABNT com ponto-e-virgula nos autores
    # Ex: "SOBRENOME, NOME; SOBRENOME2, NOME2. Titulo. PERIODICO, v. X, p. Y, YYYY."
    # ----------------------------------------------------
    if ';' in text:
        # Detecta duplicacao/corrupcao textual (ex: SOLDERA repetindo titulo no final)
        if text.count('Mathematical modeling to size anaerobic stabilization ponds') > 1:
            return None, False, 'Citacao corrompida com repeticao de titulo (preservada para revisao manual)'

        semi_parts = text.split(';')
        last_semi = semi_parts[-1].strip()

        # Encontra o ponto que separa o ultimo autor (em CAIXA ALTA) do titulo (Title Case)
        # Ex: "DE OLIVEIRA CRUZ, LUANA MATTOS. Aeration..." ou "MATTOS DE OLIVEIRA CRUZ, LUANA . What..."
        split_match = re.match(
            r'^(?P<author>[A-ZÁÉÍÓÚÂÊÔÃÕÇ\s,.-]+?)\s*\.\s*(?P<rest>[A-Z][a-z0-9].+)$',
            last_semi
        )
        if not split_match:
            # Fallback para autor com inicial única ex: BATURINA, L. The...
            split_match = re.match(
                r'^(?P<author>[A-ZÁÉÍÓÚÂÊÔÃÕÇ\s,.-]+?\b[A-Z]\.?)\s*\.\s*(?P<rest>[A-Z].+)$',
                last_semi
            )

        if split_match:
            last_author = split_match.group('author').strip().rstrip(', ')
            if re.search(r'\b[A-Z]$', last_author):
                last_author += '.'
            rest_after_author = split_match.group('rest').strip()
        else:
            last_author = None
            rest_after_author = None

        if last_author and rest_after_author:
            authors = "; ".join([p.strip() for p in semi_parts[:-1]] + [last_author])
            remaining_text = clean_url_suffix(rest_after_author)

            j_match = re.search(
                r',\s*(?:v\.\s*\d+|v\s*\d+|\(\d+\)|\d+\s*,\s*\d+)',
                remaining_text,
                flags=re.IGNORECASE
            )
            if j_match:
                before_vol = remaining_text[:j_match.start()].strip()
                b_parts = re.split(r'\.\s+', before_vol)
                if len(b_parts) >= 2:
                    title = ". ".join(b_parts[:-1]).strip()
                    journal = b_parts[-1].strip()
                    after_vol = remaining_text[j_match.start():]
                    y_match = re.search(r'\b(202\d|201\d)\b', after_vol)
                    year = int(y_match.group(1)) if y_match else (seed_year or 2025)

                    if len(authors) > 5 and len(title) > 10 and len(journal) > 2:
                        return {
                            'authors': authors,
                            'title_pt': title,
                            'journal': journal,
                            'year': year,
                            'doi': doi,
                            'pattern': 'ABNT'
                        }, True, 'Padrao ABNT com multiplos autores reconhecido'

    # ----------------------------------------------------
    # Caso 2b: Padrao ABNT autor individual (ex: DIAS, R. B.)
    # ----------------------------------------------------
    if text.startswith('DIAS, R. B.'):
        rest = text[len('DIAS, R. B.'):].strip()
        m = re.match(
            r'^(?P<title>.+?)\.\s+(?P<journal>Revista [^,]+),\s*v\.\s*\d+,\s*p\.\s*[^,]+,\s*(?P<year>\d{4})',
            rest
        )
        if m:
            return {
                'authors': 'DIAS, R. B.',
                'title_pt': m.group('title').strip(),
                'journal': m.group('journal').strip(),
                'year': int(m.group('year')),
                'doi': doi,
                'pattern': 'ABNT (autor individual)'
            }, True, 'Padrao ABNT com autor individual reconhecido'

    # ----------------------------------------------------
    # Caso 3: Padrao Fuess (Autores separados por virgula + Titulo + (https://doi.org/...))
    # ----------------------------------------------------
    fuess_doi_match = re.search(r'\((?:https?://)?(?:dx\.)?doi\.org/([^)]+)\)$', text)
    if fuess_doi_match and ';' not in text and not re.search(r'\((19\d\d|20\d\d)\)', text):
        doi_val = fuess_doi_match.group(1).strip()
        before_doi = text[:fuess_doi_match.start()].strip().rstrip(', ')

        raw_parts = [p.strip() for p in before_doi.split(',') if p.strip()]
        authors_list = []
        i = 0
        while i < len(raw_parts) - 1:
            candidate = f"{raw_parts[i]}, {raw_parts[i+1]}"
            if is_author_token(candidate):
                authors_list.append(candidate)
                i += 2
            else:
                break

        if len(authors_list) >= 2 and i < len(raw_parts):
            title = ", ".join(raw_parts[i:]).strip()
            authors_str = ", ".join(authors_list)
            if len(title) > 10:
                return {
                    'authors': authors_str,
                    'title_pt': title,
                    'journal': None,
                    'year': seed_year or 2025,
                    'doi': doi_val,
                    'pattern': 'Fuess (sem periodico no texto original)'
                }, True, 'Padrao autores/titulo com DOI terminal reconhecido'

    return None, False, 'Estrutura nao-padronizada / ambigua (preservada para revisao manual)'


def parse_seed_file(seed_path):
    content = seed_path.read_text(encoding='utf-8')
    entries = []

    pattern = re.compile(
        r"INSERT INTO publications\s*\([^)]+\)\s*SELECT\s+'(?P<title_pt>(?:''|[^'])*)',\s*'(?P<authors>(?:''|[^'])*)',\s*(?P<year>\d+),\s*(?P<doi>'[^']*'|NULL),\s*'(?P<pub_type>[^']*)'",
        re.MULTILINE
    )

    for match in pattern.finditer(content):
        title_pt = match.group('title_pt').replace("''", "'")
        authors = match.group('authors').replace("''", "'")
        year = int(match.group('year'))
        doi_raw = match.group('doi')
        doi = doi_raw.strip("'") if doi_raw != 'NULL' else None
        pub_type = match.group('pub_type')

        entries.append({
            'raw_citation': title_pt,
            'authors': authors,
            'year': year,
            'doi': doi,
            'pub_type': pub_type
        })

    return entries


def generate_cleanup_migration(entries, output_path):
    parsed_count = 0
    manual_count = 0
    results = []

    sql_statements = [
        "-- Migration: 028_publications_cleanup.sql",
        "-- Description: Limpeza e estruturação dos dados das publicações da migration 026.",
        "-- Gerado automaticamente por scripts/extract-publications.py.",
        "-- Citações ambíguas foram mantidas como estão para revisão manual.",
        "",
        "BEGIN;",
        ""
    ]

    for idx, entry in enumerate(entries, 1):
        parsed, success, reason = parse_citation(
            entry['raw_citation'],
            entry['doi'],
            entry['year']
        )

        results.append({
            'index': idx,
            'raw': entry['raw_citation'],
            'doi': entry['doi'],
            'success': success,
            'reason': reason,
            'parsed': parsed
        })

        if success and parsed:
            parsed_count += 1
            sql_statements.append(f"-- [{idx:02d}/25] OK ({parsed['pattern']})")
            if parsed['doi']:
                stmt = (
                    f"UPDATE publications SET\n"
                    f"  title_pt = {escape_sql(parsed['title_pt'])},\n"
                    f"  authors = {escape_sql(parsed['authors'])},\n"
                    f"  journal = {escape_sql(parsed['journal'])},\n"
                    f"  year = {parsed['year']}\n"
                    f"WHERE doi = {escape_sql(parsed['doi'])};"
                )
            else:
                stmt = (
                    f"UPDATE publications SET\n"
                    f"  title_pt = {escape_sql(parsed['title_pt'])},\n"
                    f"  authors = {escape_sql(parsed['authors'])},\n"
                    f"  journal = {escape_sql(parsed['journal'])},\n"
                    f"  year = {parsed['year']}\n"
                    f"WHERE title_pt = {escape_sql(entry['raw_citation'])};"
                )
            sql_statements.append(stmt)
            sql_statements.append("")
        else:
            manual_count += 1
            sql_statements.append(f"-- [{idx:02d}/25] REVISÃO MANUAL: {reason}")
            sql_statements.append(f"-- Citação original: {entry['raw_citation']}")
            sql_statements.append("")

    sql_statements.append("COMMIT;")
    sql_statements.append("")

    output_path.write_text("\n".join(sql_statements), encoding='utf-8')
    return parsed_count, manual_count, results


def main():
    root_dir = Path(__file__).resolve().parent.parent
    default_seed = root_dir / "backend" / "src" / "db" / "migrations" / "026_publications_seed.sql"
    seed_path = Path(sys.argv[1]) if len(sys.argv) > 1 else default_seed

    if not seed_path.exists():
        sys.exit(f"Arquivo nao encontrado: {seed_path}")

    out_migration = root_dir / "backend" / "src" / "db" / "migrations" / "028_publications_cleanup.sql"

    entries = parse_seed_file(seed_path)
    if len(entries) != 25:
        print(f"Aviso: esperadas 25 publicacoes no seed, encontradas {len(entries)}.")

    parsed_count, manual_count, results = generate_cleanup_migration(entries, out_migration)

    print(f"\n=======================================================")
    print(f"RELATORIO DE PARSING DE PUBLICACOES (scripts/extract-publications.py)")
    print(f"=======================================================")
    print(f"Total de publicacoes processadas: {len(entries)}")
    print(f"Parseadas com alta confianca:     {parsed_count} ({parsed_count/len(entries)*100:.1f}%)")
    print(f"Mantidas para revisao manual:     {manual_count} ({manual_count/len(entries)*100:.1f}%)")
    print(f"Migration gerada em:              {out_migration}")
    print(f"=======================================================\n")

    for r in results:
        status = "[OK]      " if r['success'] else "[REVISAO] "
        print(f"[{r['index']:02d}] {status} | {r['reason']}")
        if r['success']:
            p = r['parsed']
            print(f"     Autores: {p['authors']}")
            print(f"     Titulo:  {p['title_pt']}")
            print(f"     Revista: {p['journal']}")
            print(f"     Ano:     {p['year']} | DOI: {p['doi']}")
        else:
            print(f"     Texto:   {r['raw'][:80]}...")
        print()


if __name__ == "__main__":
    main()
