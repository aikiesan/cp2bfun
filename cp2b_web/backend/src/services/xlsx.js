import zlib from 'zlib';
import { zonedParts } from '../utils/zonedTime.js';

// Planilha .xlsx de uma aba só, sem dependência externa.
//
// O exceljs traria 78 pacotes (36 MB) e dois alertas do npm audit para gerar
// uma tabela de quatro colunas. Um .xlsx é um zip com meia dúzia de XMLs;
// aqui vai o mínimo que o Excel, o LibreOffice e o Google Planilhas abrem:
// cabeçalho em negrito e congelado, filtro, larguras de coluna e datas como
// datas de verdade (ordenáveis), não como texto.
//
// Textos entram como "inlineStr": um nome cadastrado como "=HYPERLINK(...)"
// continua sendo texto e nunca vira fórmula, ao contrário de um CSV.

// ---------- zip (deflate) ----------

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// Data fixa (01/01/1980, a menor do formato) para o arquivo sair igual a cada geração.
const DOS_TIME = 0;
const DOS_DATE = (0 << 9) | (1 << 5) | 1;

function zip(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;

  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, 'utf8');
    const compressed = zlib.deflateRawSync(data);
    const crc = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);         // versão necessária
    local.writeUInt16LE(0x0800, 6);     // nomes em UTF-8
    local.writeUInt16LE(8, 8);          // deflate
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBuf, compressed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);       // versão de origem
    central.writeUInt16LE(20, 6);       // versão necessária
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(DOS_TIME, 12);
    central.writeUInt16LE(DOS_DATE, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    // extra, comentário, disco, atributos internos e externos: zero
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBuf);

    offset += local.length + nameBuf.length + compressed.length;
  }

  const centralDir = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDir.length, 12);
  end.writeUInt32LE(offset, 16);

  return Buffer.concat([...locals, centralDir, end]);
}

// ---------- SpreadsheetML ----------

// Caracteres de controle são proibidos em XML 1.0; um nome colado com um
// deles corromperia o arquivo inteiro.
const INVALID_XML = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g;

const escXml = (value) => String(value)
  .replace(INVALID_XML, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function columnLetter(index) {
  let n = index + 1;
  let letters = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return letters;
}

// Número de série do Excel (dias desde 30/12/1899) para a hora de parede no fuso.
function excelSerial(date, timeZone) {
  const p = zonedParts(date, timeZone);
  const wallClockMs = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return wallClockMs / 86400000 + 25569;
}

const STYLE = { header: 1, date: 2 };

function cellXml(ref, value, timeZone) {
  if (value === null || value === undefined || value === '') return '';
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return '';
    return `<c r="${ref}" s="${STYLE.date}"><v>${excelSerial(value, timeZone)}</v></c>`;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `<c r="${ref}"><v>${value}</v></c>`;
  }
  return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escXml(value)}</t></is></c>`;
}

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

const WORKBOOK_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;

// cellXfs: 0 = padrão, 1 = cabeçalho (negrito), 2 = data/hora.
const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="dd/mm/yyyy hh:mm"/></numFmts><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;

/**
 * Gera um .xlsx com uma aba.
 * @param {object}   opts
 * @param {string}   opts.sheetName  nome da aba (até 31 caracteres)
 * @param {{header: string, width?: number}[]} opts.columns
 * @param {Array<Array<string|number|Date|null>>} opts.rows
 * @param {string}   [opts.timeZone] fuso das células de data
 * @returns {Buffer}
 */
export function buildXlsx({ sheetName, columns, rows, timeZone = 'America/Sao_Paulo' }) {
  const lastCol = columnLetter(columns.length - 1);
  const lastRow = rows.length + 1;

  const headerCells = columns
    .map((col, i) => `<c r="${columnLetter(i)}1" t="inlineStr" s="${STYLE.header}"><is><t>${escXml(col.header)}</t></is></c>`)
    .join('');
  const bodyRows = rows
    .map((row, r) => {
      const cells = columns.map((_, c) => cellXml(`${columnLetter(c)}${r + 2}`, row[c], timeZone)).join('');
      return `<row r="${r + 2}">${cells}</row>`;
    })
    .join('');
  const cols = columns
    .map((col, i) => `<col min="${i + 1}" max="${i + 1}" width="${col.width || 18}" customWidth="1"/>`)
    .join('');

  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:${lastCol}${lastRow}"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${cols}</cols><sheetData><row r="1">${headerCells}</row>${bodyRows}</sheetData><autoFilter ref="A1:${lastCol}${lastRow}"/></worksheet>`;

  // Excel recusa nome de aba com estes caracteres ou com mais de 31.
  const safeSheetName = escXml(String(sheetName).replace(/[\\/?*[\]:]/g, ' ').slice(0, 31));
  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${safeSheetName}" sheetId="1" r:id="rId1"/></sheets></workbook>`;

  return zip([
    { name: '[Content_Types].xml', data: Buffer.from(CONTENT_TYPES) },
    { name: '_rels/.rels', data: Buffer.from(ROOT_RELS) },
    { name: 'xl/workbook.xml', data: Buffer.from(workbook) },
    { name: 'xl/_rels/workbook.xml.rels', data: Buffer.from(WORKBOOK_RELS) },
    { name: 'xl/styles.xml', data: Buffer.from(STYLES) },
    { name: 'xl/worksheets/sheet1.xml', data: Buffer.from(sheet) },
  ]);
}
