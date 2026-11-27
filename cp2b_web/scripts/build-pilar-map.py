#!/usr/bin/env python3
"""Gera public/assets/pilar2b/sp-map.json, o mapa da faixa do PILAR-2b.

É o mesmo mapa do vídeo institucional v3 (cp2b-institucional-scene.jsx no
design system do PILAR-2b): malha municipal do IBGE em Mercator, potencial de
cada município em 5 faixas por quantil, linhas de transmissão, gasodutos,
subestações e plantas de biogás. Aqui as formas saem já projetadas e
simplificadas, em caminhos SVG prontos, para o site não precisar de d3 nem
baixar 1 MB de GeoJSON.

Só Python padrão. Rodar de novo quando os dados do PILAR-2b mudarem:

    python scripts/build-pilar-map.py "A:/Pilar-2b/PILAR-2b Design System/data"

Argumentos: <pasta de dados> [saída] [tolerância em px, padrão 0.7]
"""
import json
import math
import os
import sys

DATA = sys.argv[1] if len(sys.argv) > 1 else None
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(
    os.path.dirname(__file__), '..', 'public', 'assets', 'pilar2b', 'sp-map.json')
TOL = float(sys.argv[3]) if len(sys.argv) > 3 else 0.7
W, H = 1000, 720  # mesmo quadro do vídeo

if not DATA:
    sys.exit(__doc__)


def load(name):
    with open(os.path.join(DATA, name), encoding='utf-8') as f:
        return json.load(f)


geo = load('sp-municipalities-ibge.geojson')
pot = load('sp-municipal-potential.json')
infra = load('sp-energy-infrastructure.geojson')
plants = load('sp-biogas-plants.json')


def merc(lon, lat):
    return math.radians(lon), -math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


def rings(g):
    if g['type'] == 'Polygon':
        return g['coordinates']
    if g['type'] == 'MultiPolygon':
        return [r for p in g['coordinates'] for r in p]
    return []


feats = [f for f in geo['features'] if f.get('geometry')]

# Ajuste do Mercator ao quadro, como o fitSize do d3.
pts = [merc(*c[:2]) for f in feats for r in rings(f['geometry']) for c in r]
x0, x1 = min(p[0] for p in pts), max(p[0] for p in pts)
y0, y1 = min(p[1] for p in pts), max(p[1] for p in pts)
k = min(W / (x1 - x0), H / (y1 - y0))
ox, oy = (W - k * (x1 - x0)) / 2, (H - k * (y1 - y0)) / 2


def proj(lon, lat):
    x, y = merc(lon, lat)
    return ox + k * (x - x0), oy + k * (y - y0)


def simplify(points, tol):
    """Douglas-Peucker sobre a linha já projetada (em px)."""
    if len(points) < 3:
        return points
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        a, b = stack.pop()
        (ax, ay), (bx, by) = points[a], points[b]
        dx, dy = bx - ax, by - ay
        n = math.hypot(dx, dy) or 1e-9
        best, idx = -1.0, None
        for i in range(a + 1, b):
            px, py = points[i]
            d = abs(dy * px - dx * py + bx * ay - by * ax) / n
            if d > best:
                best, idx = d, i
        if idx is not None and best > tol:
            keep[idx] = True
            stack += [(a, idx), (idx, b)]
    return [p for p, kp in zip(points, keep) if kp]


def num(v):
    s = f'{v:.1f}'
    return s[:-2] if s.endswith('.0') else s


def path_d(lines, closed):
    out = []
    for line in lines:
        p = [proj(*c[:2]) for c in line]
        if closed and len(p) > 4:
            # Um anel começa e termina no mesmo ponto: a corda tem
            # comprimento zero e o Douglas-Peucker apagaria tudo. Metade a metade.
            mid = len(p) // 2
            p = simplify(p[:mid + 1], TOL)[:-1] + simplify(p[mid:], TOL)
        else:
            p = simplify(p, TOL)
        if len(p) < (3 if closed else 2):
            continue
        out.append('M' + 'L'.join(f'{num(x)} {num(y)}' for x, y in p) + ('Z' if closed else ''))
    return ''.join(out)


# Faixas por quantil (20/40/60/80 %), como no vídeo.
by_code = {r[0]: r for r in pot['rows']}
vals = sorted(r[1] for r in pot['rows'])
cuts = [vals[math.floor(q * (len(vals) - 1))] for q in (0.2, 0.4, 0.6, 0.8)]

munis = []
for f in feats:
    code = f['properties']['codarea']
    row = by_code.get(code)
    lons = [c[0] for r in rings(f['geometry']) for c in r]
    munis.append({
        'd': path_d(rings(f['geometry']), True),
        't': sum((row[1] if row else 0) > c for c in cuts),
        'x': proj((min(lons) + max(lons)) / 2, 0)[0],
    })
mx0, mx1 = min(m['x'] for m in munis), max(m['x'] for m in munis)
for m in munis:
    # k: posição de oeste (0) a leste (1), que dá a ordem do preenchimento.
    m['k'] = round((m.pop('x') - mx0) / (mx1 - mx0), 3)

transmission, gas, substations = [], [], []
for f in infra['features']:
    layer, g = f['properties'].get('layer'), f.get('geometry')
    if not g:
        continue
    segs = {'LineString': [g['coordinates']], 'MultiLineString': g['coordinates']}.get(g['type'], [])
    if layer == 'transmission_lines':
        transmission.append(path_d(segs, False))
    elif layer in ('distribution_gas_pipelines', 'transport_gas_pipelines'):
        gas.append(path_d(segs, False))
    elif layer == 'substations' and g['type'] == 'Point':
        substations.append([round(v, 1) for v in proj(*g['coordinates'][:2])])

result = {
    'w': W,
    'h': H,
    'source': 'PILAR-2b (CP2b/NIPE-Unicamp): malha IBGE, potencial municipal, infraestrutura de energia, '
              + plants.get('source', 'plantas de biogás'),
    'munis': munis,
    'transmission': ''.join(transmission),
    'gas': ''.join(gas),
    'substations': substations,
    'plants': [[round(v, 1) for v in proj(r[2], r[1])] for r in plants['rows']],
}

os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, separators=(',', ':'))
print(f'{OUT}: {len(munis)} municípios, {len(substations)} subestações, {len(result["plants"])} plantas')
