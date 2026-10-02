import test from 'node:test';
import assert from 'node:assert/strict';
import zlib from 'zlib';
import { buildXlsx } from './xlsx.js';

// Leitor mínimo de zip: percorre o diretório central e descomprime cada
// entrada, conferindo o CRC — o mesmo caminho que o Excel faz ao abrir.
function unzip(buf) {
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  assert.ok(eocd >= 0, 'fim do diretório central ausente');
  const count = buf.readUInt16LE(eocd + 10);
  let ptr = buf.readUInt32LE(eocd + 16);
  const files = {};
  for (let i = 0; i < count; i++) {
    assert.equal(buf.readUInt32LE(ptr), 0x02014b50);
    const method = buf.readUInt16LE(ptr + 10);
    const crc = buf.readUInt32LE(ptr + 16);
    const csize = buf.readUInt32LE(ptr + 20);
    const usize = buf.readUInt32LE(ptr + 24);
    const nameLen = buf.readUInt16LE(ptr + 28);
    const extraLen = buf.readUInt16LE(ptr + 30);
    const commentLen = buf.readUInt16LE(ptr + 32);
    const localOffset = buf.readUInt32LE(ptr + 42);
    const name = buf.toString('utf8', ptr + 46, ptr + 46 + nameLen);

    assert.equal(buf.readUInt32LE(localOffset), 0x04034b50);
    const localNameLen = buf.readUInt16LE(localOffset + 26);
    const localExtraLen = buf.readUInt16LE(localOffset + 28);
    const start = localOffset + 30 + localNameLen + localExtraLen;
    assert.equal(method, 8);
    const data = zlib.inflateRawSync(buf.subarray(start, start + csize));
    assert.equal(data.length, usize, `${name}: tamanho`);
    assert.equal(zlib.crc32 ? zlib.crc32(data) : crc, crc, `${name}: CRC`);

    files[name] = data.toString('utf8');
    ptr += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

const columns = [{ header: 'Nome', width: 30 }, { header: 'E-mail' }, { header: 'Quando' }, { header: 'N' }];

test('gera um zip com as partes que o Excel exige', () => {
  const files = unzip(buildXlsx({ sheetName: 'Inscritos', columns, rows: [] }));
  assert.deepEqual(Object.keys(files).sort(), [
    '[Content_Types].xml',
    '_rels/.rels',
    'xl/_rels/workbook.xml.rels',
    'xl/styles.xml',
    'xl/workbook.xml',
    'xl/worksheets/sheet1.xml',
  ]);
  assert.match(files['xl/workbook.xml'], /<sheet name="Inscritos" sheetId="1" r:id="rId1"\/>/);
  // Planilha vazia: só o cabeçalho, com filtro nele.
  assert.match(files['xl/worksheets/sheet1.xml'], /<autoFilter ref="A1:D1"\/>/);
});

test('escreve cabeçalho, textos, números e datas', () => {
  const files = unzip(buildXlsx({
    sheetName: 'Inscritos',
    columns,
    rows: [['Ana', 'ana@exemplo.com', new Date('2026-10-05T11:30:00Z'), 7]],
  }));
  const sheet = files['xl/worksheets/sheet1.xml'];
  assert.match(sheet, /<c r="A1" t="inlineStr" s="1"><is><t>Nome<\/t><\/is><\/c>/);
  assert.match(sheet, /<c r="A2" t="inlineStr"><is><t xml:space="preserve">Ana<\/t><\/is><\/c>/);
  assert.match(sheet, /<c r="D2"><v>7<\/v><\/c>/);
  // 11:30 UTC = 08:30 em Brasília; 05/10/2026 é o dia 46300 do Excel.
  const serial = Number(sheet.match(/<c r="C2" s="2"><v>([\d.]+)<\/v>/)[1]);
  assert.equal(Math.floor(serial), 46300);
  assert.ok(Math.abs((serial % 1) * 24 - 8.5) < 1e-6, 'hora de Brasília');
  assert.match(sheet, /<autoFilter ref="A1:D2"\/>/);
  assert.match(sheet, /<col min="1" max="1" width="30" customWidth="1"\/>/);
});

test('texto que parece fórmula continua texto, e XML é escapado', () => {
  const files = unzip(buildXlsx({
    sheetName: 'Inscritos',
    columns,
    rows: [['=HYPERLINK("http://x")', '<b>&"\u0007', null, '']],
  }));
  const sheet = files['xl/worksheets/sheet1.xml'];
  assert.match(sheet, /<c r="A2" t="inlineStr"><is><t xml:space="preserve">=HYPERLINK\(&quot;http:\/\/x&quot;\)<\/t>/);
  assert.match(sheet, /<t xml:space="preserve">&lt;b&gt;&amp;&quot;<\/t>/);
  assert.doesNotMatch(sheet, /<f>/);
  assert.doesNotMatch(sheet, /\u0007/);
  // Células vazias não são escritas.
  assert.doesNotMatch(sheet, /r="C2"|r="D2"/);
});

test('nome de aba inválido para o Excel é ajustado', () => {
  const files = unzip(buildXlsx({ sheetName: 'Inscritos/2026: lista completa da newsletter', columns, rows: [] }));
  const name = files['xl/workbook.xml'].match(/<sheet name="([^"]*)"/)[1];
  assert.ok(name.length <= 31);
  assert.doesNotMatch(name, /[\\/?*[\]:]/);
});
