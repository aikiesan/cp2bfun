#!/usr/bin/env python3
"""
Extração dos dados estratégicos do CP2b a partir da planilha da Luciana
("Planejamento_Estrategico_CP2B_Integrado_projetos_pesquisadores_labs_v2.xlsx")
para os arquivos consumidos pelo site (src/data/generated/*.js).

NÃO faz parte do build do site — é uma ferramenta de autoria, rodada
manualmente por quem tiver a planilha-fonte mais recente, sempre que a
Luciana enviar uma nova versão (v3, v4, ...). Requer `pip install openpyxl`.

Uso:
    python scripts/extract-strategic-data.py <caminho-para-o-xlsx>
    python scripts/extract-strategic-data.py --labs-only <caminho-para-o-xlsx>

O modo --labs-only lê só a aba 'Laboratórios' e regrava só laboratories.js —
para planilhas que trazem apenas essa aba (ex.: a versão
"Planejamento_Estrategico_CP2B_laboratórios_atualizado.xlsx").

Particularidade da planilha: as abas usam blocos "esparsos" — como se
células tivessem sido mescladas e depois desmescladas sem repetir o valor.
Um novo bloco (pessoa/laboratório) começa quando a primeira coluna não é
vazia; as colunas seguintes (Eixo, Instituição, Cargo) devem ser
"preenchidas para baixo" (forward-fill) dentro do bloco. Colunas de
conteúdo (Área, Competência, Descrição) são um registro por linha.

Este script é idempotente: rodá-lo duas vezes sobre a mesma planilha produz
exatamente a mesma saída (chaves ordenadas, sem timestamps).
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

VALID_AXES = {'1', '2', '3', '4', '5', '6', '7', '8'}


def norm(v):
    if v is None:
        return None
    if isinstance(v, str):
        v = v.strip()
        return v or None
    return v


# Titulos que a planilha as vezes carrega e o site quase sempre carrega, e
# que nao fazem parte do nome da pessoa.
_TITLES = re.compile(r'^(prof[ao]?\.?\s*|dr[ao]?\.?\s*|me\.?\s*|msc\.?\s*|phd\.?\s*)+', re.I)
_STOPWORDS = {'da', 'de', 'do', 'dos', 'das', 'e'}


def name_key(name):
    """Chave estavel para a mesma pessoa escrita de formas diferentes.

    Ignora acento, caixa, pontuacao, titulo academico e nomes do meio: a
    planilha traz 'Dante Pezzin' onde o site traz 'Dante Chiavareto Pezzin',
    e 'Mauro Donizetti Berni' onde o site traz 'Mauro Donizeti Berni'.
    Compara pelo primeiro e pelo ultimo nome, que e o que sobrevive as duas
    grafias.
    """
    if not name:
        return ''
    text = unicodedata.normalize('NFKD', str(name))
    text = ''.join(c for c in text if not unicodedata.combining(c))
    text = _TITLES.sub('', text.strip())
    text = re.sub(r'[^A-Za-z ]', ' ', text)
    parts = [w for w in text.lower().split() if w and w not in _STOPWORDS]
    if not parts:
        return ''
    return f'{parts[0]}|{parts[-1]}'


def parse_axis_list(raw):
    """'2, 3 e 5' -> ['2','3','5']; 2 -> ['2']; '?' / '2?' -> []."""
    if raw is None:
        return []
    text = str(raw)
    ids = re.findall(r'\d+', text)
    return [i for i in ids if i in VALID_AXES]


def rows_of(ws):
    return [r for r in ws.iter_rows(values_only=True) if any(c not in (None, '') for c in r)][1:]


def blocks_of(rows):
    """Agrupa linhas em blocos por pessoa/laboratório (coluna 0 não-vazia inicia bloco)."""
    blocks = []
    current = None
    for row in rows:
        if norm(row[0]) is not None:
            current = [row]
            blocks.append(current)
        elif current is not None:
            current.append(row)
    return blocks


def forward_fill_block(block, cols):
    """Preenche para baixo as colunas em `cols` dentro de um bloco, in-place."""
    filled = list(block)
    last = {}
    for i, row in enumerate(filled):
        row = list(row)
        for c in cols:
            v = norm(row[c])
            if v is not None:
                last[c] = v
            elif c in last:
                row[c] = last[c]
        filled[i] = row
    return filled


def extract_competencias(ws):
    """Aba 'Coord Eixos' -> { axis_id: [ {person, institution, role, area, competency, definition} ] }."""
    blocks = blocks_of(rows_of(ws))
    by_axis = {}
    for block in blocks:
        filled = forward_fill_block(block, cols=[1, 2, 3])  # Eixo, Instituição, Cargo
        person = norm(filled[0][0])
        for row in filled:
            axis = parse_axis_list(row[1])
            area, desc, comp, definition = norm(row[4]), norm(row[5]), norm(row[6]), norm(row[7])
            if not axis or not (area or comp):
                continue
            for axis_id in axis:
                if axis_id not in VALID_AXES:
                    continue
                entry = {
                    'person': person,
                    'institution': norm(row[2]),
                    'role': norm(row[3]),
                    'area': area,
                    'competency': comp,
                    'definition': definition,
                    'description': desc,
                }
                by_axis.setdefault(axis_id, []).append(entry)
    return by_axis


def extract_projetos(ws):
    """Aba 'Projetos Coord Eixos' -> { axis_id: [ {person, title, description, period, ...} ] }."""
    blocks = blocks_of(rows_of(ws))
    by_axis = {}
    for block in blocks:
        filled = forward_fill_block(block, cols=[1, 2, 3])  # Eixo, Instituição, Cargo
        person = norm(filled[0][0])
        for row in filled:
            axis = parse_axis_list(row[1])
            title = norm(row[6])
            if not axis or not title:
                continue
            start, end = norm(row[4]), norm(row[5])
            period = ' – '.join(str(x) for x in [start, end] if x is not None) or None
            for axis_id in axis:
                if axis_id not in VALID_AXES:
                    continue
                entry = {
                    'person': person,
                    'institution': norm(row[2]),
                    'title': title,
                    'description': norm(row[7]),
                    'period': period,
                    'trl': norm(row[10]),
                    'partners': norm(row[31]) if len(row) > 31 else None,
                }
                by_axis.setdefault(axis_id, []).append(entry)
    return by_axis


def extract_equipe(ws):
    """Aba 'Pesquisadores' -> { axis_id: [ {person, institution, level, area, title} ] }, um registro por pessoa."""
    blocks = blocks_of(rows_of(ws))
    by_axis = {}
    for block in blocks:
        filled = forward_fill_block(block, cols=[1, 2, 3])  # Eixo, Instituição, Nível
        first = filled[0]
        person = norm(first[0])
        raw_axis = '' if first[1] is None else str(first[1])
        axis = [i for i in re.findall(r'\d+', raw_axis) if i in VALID_AXES or i == '0']
        if not axis or not person:
            continue
        primary_area = next((norm(r[5]) for r in filled if norm(r[5])), None)
        entry = {
            'person': person,
            'institution': norm(first[2]),
            'level': norm(first[3]),
            'title': norm(first[4]),
            'area': primary_area,
        }
        for axis_id in axis:
            by_axis.setdefault(axis_id, []).append(entry)
    return by_axis


# Células que a planilha preenche com "Não se aplica" contam como vazias.
_NA = {'nao se aplica', 'não se aplica', 'n/a', '-', '—'}


def norm_na(v):
    v = norm(v)
    if isinstance(v, str) and v.strip().rstrip('.').lower() in _NA:
        return None
    return v


def paragraphs_of(text):
    if not text:
        return []
    return [p.strip() for p in re.split(r'\n+', str(text)) if p.strip()]


def slug_of(acronym):
    """'CEMARA (UNIFAL)' -> 'cemara'; 'CP2b Lab' -> 'cp2b-lab'."""
    text = re.sub(r'\(.*?\)', '', str(acronym or ''))
    text = unicodedata.normalize('NFKD', text)
    text = ''.join(c for c in text if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


_LEAD_ROLE = re.compile(r'^(.*?)\s*\(((?:vice-)?coordenador[a]?)\)\s*$', re.I)
_CRITERIA = re.compile(r'^(Valor para o cliente|Dificuldade de imitação|Acesso a mercados)\s*:\s*(.+)$', re.I)
_TRL_LEVEL = re.compile(r'^TRL\s*(\d)\s*\(([^)]+)\)\s*:\s*(.+)$')
_POINT = re.compile(r'^([^:]{3,90}):\s+(.+)$')


def split_equipment(raw):
    """'Reatores, equipamentos de caracterização...' -> ['Reatores', 'Equipamentos de ...']."""
    raw = norm_na(raw)
    if not raw:
        return []
    items = [i.strip() for i in re.split(r'[;,]', str(raw)) if i.strip()]
    return [i[0].upper() + i[1:] for i in items]


def parse_competency(raw):
    """Parágrafos de abertura + os três critérios de competência essencial."""
    intro, criteria, criteria_intro = [], [], None
    for p in paragraphs_of(norm_na(raw)):
        m = _CRITERIA.match(p)
        if m:
            criteria.append({'title': m.group(1), 'text': m.group(2).strip()})
        elif p.endswith(':'):
            criteria_intro = p[:-1].strip()
        else:
            intro.append(p)
    return intro, criteria_intro, criteria


def parse_approach(raw):
    """Coluna de serviços: só o texto antes de 'Serviços Ofertados'. A lista
    de serviços em si vem de extract_servicos, que já tem as traduções."""
    raw = norm_na(raw)
    if not raw:
        return None
    head = re.split(r'Servi[çc]os Ofertados\s*:', str(raw), maxsplit=1)[0]
    head = ' '.join(paragraphs_of(head))
    return head or None


def parse_trl(suggested, informed, justification):
    """Faixa (min, max), foco e a justificativa por nível."""
    levels = []
    for p in paragraphs_of(norm_na(justification)):
        m = _TRL_LEVEL.match(p)
        if m:
            levels.append({'level': int(m.group(1)), 'name': m.group(2).strip(), 'text': m.group(3).strip()})
    nums = [int(n) for n in re.findall(r'TRL\s*(\d)', str(suggested or ''))]
    if not nums:
        return None
    lo, hi = min(nums), max(nums)
    focus = None
    m = re.search(r'centro de gravidade[^\d]*TRL\s*(\d)', str(suggested), re.I)
    if m:
        focus = int(m.group(1))
    if focus is None:
        for lv in levels:
            if re.search(r'ponto forte|foco principal', lv['text'], re.I):
                focus = lv['level']
                break
    if focus is None:
        inf = [int(n) for n in re.findall(r'\d', str(informed or ''))]
        if len(inf) == 1 and lo <= inf[0] <= hi:
            focus = inf[0]
    if focus is None:
        focus = round((lo + hi) / 2)
    return {'min': lo, 'max': hi, 'focus': focus, 'levels': levels}


def parse_mission(raw):
    """Missão estratégica: os tópicos 'Título: texto'. A frase de abertura de
    cada célula é análise interna ('Mudar o perfil de TRL...') e fica de fora."""
    paras = paragraphs_of(norm_na(raw))
    points = []
    for p in paras:
        m = _POINT.match(p)
        if m:
            points.append({'title': m.group(1).strip(), 'text': m.group(2).strip()})
    if points:
        return {'statement': None, 'points': points}
    return {'statement': ' '.join(paras), 'points': []} if paras else None


def extract_laboratorios(ws):
    """Aba 'Laboratórios' -> lista de labs com axes: [ids], mais um índice { axis_id: [lab,...] }.

    Colunas: 0 sigla, 1 nome, 2 instituição, 3 responsável, 4 eixos,
    5 infraestrutura, 6 equipamentos, 7 competência essencial, 8 serviços,
    9 TRL informado, 10 TRL sugerido, 11 justificativa do TRL, 12 missão.
    """
    labs = []
    for row in rows_of(ws):
        row = list(row) + [None] * (14 - len(row))
        acronym, name, institution = norm(row[0]), norm_na(row[1]), norm(row[2])
        # Linhas de observação ('EIXO 1 | NÃO SE APLICA') não são laboratórios.
        if not name or not acronym or re.match(r'^eixo\s*\d', str(acronym), re.I):
            continue
        lead, lead_role = norm(row[3]), None
        m = _LEAD_ROLE.match(lead or '')
        if m:
            lead, lead_role = m.group(1).strip(), m.group(2).lower()
        axes = parse_axis_list(row[4])
        comp_intro, criteria_intro, criteria = parse_competency(row[7])
        trl = parse_trl(norm_na(row[10]), norm_na(row[9]), row[11])
        labs.append({
            'slug': slug_of(acronym),
            'acronym': acronym,
            'name': name,
            'institution': institution,
            'lead': lead,
            'leadRole': lead_role,
            'axes': axes,
            'group': 'bioprocessos' if trl else 'sociedade',
            'infrastructure': norm_na(row[5]),
            'equipment': split_equipment(row[6]),
            'competency': norm_na(row[7]),
            'competencyIntro': comp_intro,
            'criteriaIntro': criteria_intro,
            'criteria': criteria,
            'approach': parse_approach(row[8]),
            'trlInformed': norm_na(row[9]),
            'trlSuggested': norm_na(row[10]),
            'trl': trl,
            'mission': parse_mission(row[12]),
        })
    by_axis = {}
    for lab in labs:
        for axis_id in lab['axes']:
            if axis_id in VALID_AXES:
                by_axis.setdefault(axis_id, []).append(lab)
    return labs, by_axis


def write_laboratories(out_dir, labs):
    labs_js = f"""// GERADO — não editar à mão.
// Gerado por scripts/extract-strategic-data.py a partir da aba
// 'Laboratórios' da planilha estratégica do CP2b. Textos em português, como
// na planilha; a página /infraestrutura avisa isso na versão em inglês.
export const laboratories = {to_js(labs)};
"""
    (out_dir / 'laboratories.js').write_text(labs_js, encoding='utf-8')


def extract_coord_people(ws):
    """Aba 'Coord Eixos' -> [ {person, axes, institution, roles} ], por pessoa.

    Existe em paralelo a extract_competencias porque aquela descarta o eixo
    '0' (nao e um eixo tematico, logo nao entra em axisDetails) -- e o '0' e
    justamente o que marca a direcao do centro. Aqui ele e preservado.
    """
    out = []
    for block in blocks_of(rows_of(ws)):
        filled = forward_fill_block(block, cols=[1, 2, 3])  # Eixo, Instituicao, Cargo
        person = norm(filled[0][0])
        if not person:
            continue
        axes, roles, institution = [], [], None
        for row in filled:
            # Nao usa parse_axis_list: ela filtra por VALID_AXES, que exclui
            # o '0'. Aqui o '0' e exatamente o que queremos preservar.
            # `row[1] or ''` seria uma armadilha: o eixo 0 chega como o
            # inteiro 0, que e falsy, e viraria string vazia.
            raw_axis = '' if row[1] is None else str(row[1])
            for axis_id in re.findall(r'\d+', raw_axis):
                if axis_id in VALID_AXES or axis_id == '0':
                    if axis_id not in axes:
                        axes.append(axis_id)
            institution = institution or norm(row[2])
            role = norm(row[3])
            if role and role not in roles:
                roles.append(role)
        out.append({
            'person': person,
            'axes': axes,
            'institution': institution,
            'roles': roles,
        })
    return out


def build_team_by_axis(coord_people, equipe):
    """Uma entrada por pessoa, com todos os eixos em que ela aparece.

    Junta as duas abas que trazem gente: 'Coord Eixos' (coordenadores, com
    cargo) e 'Pesquisadores' (estudantes, pos-docs e professores, com nivel
    academico). A planilha repete a mesma pessoa em varias linhas e, no caso
    dos coordenadores, em varios eixos -- por isso a chave e o nome
    normalizado e os eixos viram uma lista ordenada.

    O eixo '0' nao e um eixo tematico: marca a direcao do centro. Bruna e
    Renata aparecem como '0, 6, 7' -- dirigem o CP2b inteiro e ainda atuam
    nos eixos 6 e 7. Guardamos isso como `direction: True` alem dos eixos
    tematicos, para /equipe poder abrir com a direcao e mesmo assim
    mostra-las nos seus eixos.

    Cargos: a planilha lista varios por pessoa ("Coordenadora Associada do
    NIPE" numa linha, "Diretora do CP2b" na seguinte). Preferimos sempre o
    que fala do CP2b, que e o que importa nesta pagina.
    """
    people = {}

    def upsert(name, axis_ids, institution, role, level):
        if not name:
            return
        key = name_key(name)
        entry = people.setdefault(key, {
            'name': name,
            'axes': set(),
            'direction': False,
            'roles': [],
            'institution': None,
            'level': None,
        })
        # Mantem o nome mais completo visto para a mesma pessoa: a planilha
        # tem "Dante Pezzin" numa aba e "Dante Chiavareto Pezzin" noutra.
        if len(name) > len(entry['name']):
            entry['name'] = name
        for axis_id in axis_ids:
            if axis_id == '0':
                entry['direction'] = True
            elif axis_id in VALID_AXES:
                entry['axes'].add(axis_id)
        if role and role not in entry['roles']:
            entry['roles'].append(role)
        entry['institution'] = entry['institution'] or institution or None
        entry['level'] = entry['level'] or level or None

    for it in coord_people:
        # Os cargos vem em lista; passamos um por vez para preservar todos.
        for role in (it['roles'] or [None]):
            upsert(it['person'], it['axes'], it.get('institution'), role, None)

    for axis_id, items in equipe.items():
        for it in items:
            upsert(it['person'], [axis_id], it.get('institution'), None, it.get('level'))

    def best_role(roles):
        if not roles:
            return None
        for r in roles:
            if 'cp2b' in r.lower():
                return r
        return roles[0]

    out = []
    for entry in people.values():
        out.append({
            'name': entry['name'],
            'axes': sorted(entry['axes'], key=int),
            'direction': entry['direction'],
            'institution': entry['institution'],
            'role': best_role(entry['roles']),
            'level': entry['level'],
        })
    out.sort(key=lambda e: name_key(e['name']))
    return out


def build_axis_details(competencias, projetos, equipe, labs_by_axis):
    axes = {}
    for axis_id in sorted(VALID_AXES, key=int):
        activities = []
        if competencias.get(axis_id):
            activities.append({'id': 'competencias', 'items': competencias[axis_id]})
        if projetos.get(axis_id):
            activities.append({'id': 'projetos', 'items': projetos[axis_id]})
        if equipe.get(axis_id):
            activities.append({'id': 'equipe', 'items': equipe[axis_id]})
        if labs_by_axis.get(axis_id):
            activities.append({'id': 'infra', 'items': [
                {'acronym': l['acronym'], 'name': l['name'], 'institution': l['institution'], 'lead': l['lead'], 'trl': l['trlSuggested']}
                for l in labs_by_axis[axis_id]
            ]})
        if activities:
            axes[axis_id] = activities
    return axes


def to_js(value, indent=0):
    return json.dumps(value, ensure_ascii=False, indent=2)


def extract_servicos(ws):
    """Aba 'Laboratórios' -> lista de 15 serviços técnicos estruturados com TRL e traduções."""
    # Mapeamento de traduções e metadados por serviço
    service_translations = {
        'Identificação e Caracterização Molecular de Microrganismos': {
            'en_title': 'Molecular Identification and Characterization of Microorganisms',
            'en_desc': 'Sequencing, PCR, and tracking of bacteria, fungi, or microbial consortia of industrial interest.',
            'trl': 'TRL 2 a 4',
            'trlMin': 2,
            'trlMax': 4,
        },
        'Quantificação de Compostos de Alto Valor por HPLC': {
            'en_title': 'Quantification of High-Value Compounds by HPLC',
            'en_desc': 'Detailed quantitative and qualitative analysis of sugars, organic acids, proteins, vitamins, and secondary metabolites in bioprocesses.',
            'trl': 'TRL 2 a 4',
            'trlMin': 2,
            'trlMax': 4,
        },
        'Desenvolvimento e Triagem de Bioprocessos (Screening)': {
            'en_title': 'Bioprocess Development and Screening',
            'en_desc': 'Bench-scale parameter screening (pH, temperature, carbon sources) to determine optimal fermentation conditions.',
            'trl': 'TRL 2 a 4',
            'trlMin': 2,
            'trlMax': 4,
        },
        'Análises Físico-Químicas de Controle de Qualidade': {
            'en_title': 'Physicochemical Quality Control Analyses',
            'en_desc': 'Determination of purity, stability, and composition of raw materials and bioproducts.',
            'trl': 'TRL 2 a 4',
            'trlMin': 2,
            'trlMax': 4,
        },
        'Elucidação de Vias Metabólicas': {
            'en_title': 'Elucidation of Metabolic Pathways',
            'en_desc': 'Detailed mapping of microbial substrate assimilation to guide genetic and process optimization.',
            'trl': 'TRL 2 a 4',
            'trlMin': 2,
            'trlMax': 4,
        },
        'Caracterização Profunda de Biomassa': {
            'en_title': 'In-Depth Biomass Characterization',
            'en_desc': 'Chemical composition profiling (lignin, cellulose, hemicellulose, ash) of agricultural, forestry, or industrial residues.',
            'trl': 'TRL 3 a 4',
            'trlMin': 3,
            'trlMax': 4,
        },
        'Provas de Conceito em Biorreatores de Bancada': {
            'en_title': 'Proof-of-Concept in Bench-Scale Bioreactors',
            'en_desc': 'Controlled 1 to 10 L reactor trials for fermentation, anaerobic digestion, or enzymatic processes evaluating kinetics and yield.',
            'trl': 'TRL 3 a 4',
            'trlMin': 3,
            'trlMax': 4,
        },
        'Triagem e Seleção de Microrganismos': {
            'en_title': 'Microorganism Screening and Selection',
            'en_desc': 'Isolation and cultivation of microbial strains with high productive or degradative performance.',
            'trl': 'TRL 3 a 4',
            'trlMin': 3,
            'trlMax': 4,
        },
        'Análise Quantitativa de Bioprodutos (Cromatografia)': {
            'en_title': 'Quantitative Bioproduct Analysis via Chromatography',
            'en_desc': 'HPLC/GC analysis coupled to reactor sampling for real-time monitoring of product yields and substrate uptake.',
            'trl': 'TRL 3 a 4',
            'trlMin': 3,
            'trlMax': 4,
        },
        'Otimização de Parâmetros de Processo': {
            'en_title': 'Process Parameter Optimization',
            'en_desc': 'Fine-tuning of variables (temperature, pH, agitation, aeration) to maximize bioprocess efficiency.',
            'trl': 'TRL 3 a 4',
            'trlMin': 3,
            'trlMax': 4,
        },
        'Ensaios de Potencial Bioquímico de Metano (BMP)': {
            'en_title': 'Biochemical Methane Potential (BMP) Assays',
            'en_desc': 'Precise quantification of biogas and biomethane potential from dedicated feedstocks and residues.',
            'trl': 'TRL 4 a 6',
            'trlMin': 4,
            'trlMax': 6,
        },
        'Testes de Escalonamento (Scale-up)': {
            'en_title': 'Scale-Up Testing',
            'en_desc': 'Pilot-plant scale validation of bench findings focusing on hydrodynamics and mass transfer.',
            'trl': 'TRL 4 a 6',
            'trlMin': 4,
            'trlMax': 6,
        },
        'Perfil de Bioprodutos e Pureza (Cromatografia - HPLC/GC)': {
            'en_title': 'Bioproduct Profiling and Purity Analysis',
            'en_desc': 'Comprehensive identification of biogas composition (CH4, CO2, H2S) and volatile organic byproducts.',
            'trl': 'TRL 4 a 6',
            'trlMin': 4,
            'trlMax': 6,
        },
        'Otimização e Estabilização de Processos': {
            'en_title': 'Process Optimization and Stabilization',
            'en_desc': 'Biological health diagnostic and stabilization for industrial plants facing acidification or reduced output.',
            'trl': 'TRL 4 a 6',
            'trlMin': 4,
            'trlMax': 6,
        },
        'P&D de Novos Catalisadores/Inóculos': {
            'en_title': 'R&D of Novel Catalysts and Inocula',
            'en_desc': 'Development and trial of microbial consortia and bio-additives to enhance degradation kinetics.',
            'trl': 'TRL 4 a 6',
            'trlMin': 4,
            'trlMax': 6,
        },
    }

    services = []
    service_id = 1
    for row in rows_of(ws):
        acronym, name, institution, lead = norm(row[0]), norm(row[1]), norm(row[2]), norm(row[3])
        if not name:
            continue
        raw_services = norm(row[8])
        if not raw_services:
            continue

        text = raw_services.replace('\r\n', '\n').replace('\r', '\n')
        if 'Serviços Ofertados:' in text:
            text = text.split('Serviços Ofertados:')[1].strip()
        elif 'Servi\u00e7os Ofertados:' in text:
            text = text.split('Servi\u00e7os Ofertados:')[1].strip()

        # Normaliza quebras de linha em items concatenados
        text = re.sub(r'\.([A-ZÁÉÍÓÚÂÊÔÃÕÇ][^:\n]+?:)', r'.\n\1', text)
        lines = [p.strip() for p in text.split('\n') if p.strip()]

        for line in lines:
            if ':' not in line:
                continue
            parts = line.split(':', 1)
            title_pt = parts[0].strip().lstrip('0123456789. -')
            desc_pt = parts[1].strip()

            meta = service_translations.get(title_pt, {})
            services.append({
                'id': service_id,
                'labAcronym': acronym,
                'labName': name,
                'institution': institution,
                'trl': meta.get('trl', 'TRL 2 a 6'),
                'trlMin': meta.get('trlMin', 2),
                'trlMax': meta.get('trlMax', 6),
                'pt': {
                    'title': title_pt,
                    'description': desc_pt,
                },
                'en': {
                    'title': meta.get('en_title', title_pt),
                    'description': meta.get('en_desc', desc_pt),
                }
            })
            service_id += 1

    return services


def main():
    args = sys.argv[1:]
    labs_only = '--labs-only' in args
    args = [a for a in args if a != '--labs-only']
    if len(args) != 1:
        sys.exit(__doc__)
    src = Path(args[0])
    wb = openpyxl.load_workbook(src, read_only=True, data_only=True)
    out_dir = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'generated'
    out_dir.mkdir(parents=True, exist_ok=True)

    if labs_only:
        labs, _ = extract_laboratorios(wb['Laboratórios'])
        write_laboratories(out_dir, labs)
        print(f"laboratories.js: {len(labs)} laboratories (--labs-only: demais arquivos intocados)")
        return

    competencias = extract_competencias(wb['Coord Eixos'])
    projetos = extract_projetos(wb['Projetos Coord Eixos'])
    equipe = extract_equipe(wb['Pesquisadores'])
    labs, labs_by_axis = extract_laboratorios(wb['Laboratórios'])
    servicos = extract_servicos(wb['Laboratórios'])

    axis_details = build_axis_details(competencias, projetos, equipe, labs_by_axis)
    coord_people = extract_coord_people(wb['Coord Eixos'])
    team_by_axis = build_team_by_axis(coord_people, equipe)

    axis_details_js = f"""// GERADO — não editar à mão.
// Gerado por scripts/extract-strategic-data.py a partir da planilha
// estratégica do CP2b (Coord Eixos, Projetos Coord Eixos, Pesquisadores,
// Laboratórios). Todos os textos estão em português (source-only); a
// tradução para inglês é feita depois, pelo admin.
export const axisDetails = {to_js(axis_details)};
"""
    (out_dir / 'axisDetails.js').write_text(axis_details_js, encoding='utf-8')

    write_laboratories(out_dir, labs)

    services_js = f"""// GERADO — não editar à mão.
// Gerado por scripts/extract-strategic-data.py a partir da aba
// 'Laboratórios' da planilha estratégica do CP2b.
export const technicalServices = {to_js(servicos)};
"""
    (out_dir / 'services.js').write_text(services_js, encoding='utf-8')

    team_js = f"""// GERADO — não editar à mão.
// Gerado por scripts/extract-strategic-data.py a partir das abas
// 'Coord Eixos' e 'Pesquisadores' da planilha estratégica do CP2b.
//
// Uma entrada por pessoa, com todos os eixos em que ela aparece. É a
// fonte do vínculo pessoa→eixo usado em /equipe; os nomes e instituições
// vêm da planilha da Luciana, não digitados à mão.
export const teamByAxis = {to_js(team_by_axis)};
"""
    (out_dir / 'teamByAxis.js').write_text(team_js, encoding='utf-8')

    print(f"axisDetails.js: {sum(len(v) for v in axis_details.values())} activity groups across {len(axis_details)} axes")
    print(f"teamByAxis.js: {len(team_by_axis)} people, {sum(1 for p in team_by_axis if p['axes'])} with at least one axis")
    print(f"laboratories.js: {len(labs)} laboratories")
    print(f"services.js: {len(servicos)} technical services")


if __name__ == '__main__':
    main()

