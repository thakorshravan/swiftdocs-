import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import { readFileAsArrayBuffer } from './pdfEngine';
import { XLSX_BASE64_TEMPLATE } from './xlsxTemplate';

// Ensure PDF.js worker is set
if (typeof window !== 'undefined' && 'Worker' in window && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getColLetter(colIdx) {
  let temp = colIdx + 1;
  let letter = '';
  while (temp > 0) {
    const mod = (temp - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    temp = Math.floor((temp - mod) / 26);
  }
  return letter;
}

/**
 * Generate a 100% valid Microsoft Excel OpenXML (.xlsx) file from PDF
 */
export async function createValidXlsxFromPdf(file, onProgress = () => {}) {
  onProgress(10, 'Loading Excel engine...');
  const zip = await JSZip.loadAsync(XLSX_BASE64_TEMPLATE, { base64: true });

  onProgress(20, 'Reading PDF structure...');
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  let rowNum = 1;
  let rowsXml = '';

  // Add header row
  rowsXml += `<row r="${rowNum}"><c r="A${rowNum}" t="inlineStr"><is><t>SwiftDocs PDF to Excel Converter - ${escapeXml(file.name)}</t></is></c></row>`;
  rowNum++;

  for (let i = 1; i <= numPages; i++) {
    const pct = 20 + Math.round((i / numPages) * 60);
    onProgress(pct, `Extracting data from page ${i} of ${numPages}...`);

    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    // Group items by vertical position (Y)
    const lineMap = new Map();
    for (const item of textContent.items) {
      const y = Math.round(item.transform[5]);
      if (!lineMap.has(y)) {
        lineMap.set(y, []);
      }
      lineMap.get(y).push(item);
    }

    // Sort lines from top to bottom (descending Y)
    const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a);

    for (const y of sortedY) {
      const items = lineMap.get(y).sort((a, b) => a.transform[4] - b.transform[4]);
      const fullText = items.map(it => it.str).join(' ').trim();
      if (!fullText) continue;

      // Try split by tabs, multiple spaces, or commas
      let cols = [];
      if (fullText.includes('\t')) {
        cols = fullText.split('\t');
      } else if (/\s{2,}/.test(fullText)) {
        cols = fullText.split(/\s{2,}/);
      } else if (fullText.includes(',')) {
        cols = fullText.split(',');
      } else {
        cols = [fullText];
      }

      let cellsXml = '';
      for (let cIdx = 0; cIdx < cols.length; cIdx++) {
        const val = cols[cIdx].trim();
        const cellRef = `${getColLetter(cIdx)}${rowNum}`;
        cellsXml += `<c r="${cellRef}" t="inlineStr"><is><t>${escapeXml(val)}</t></is></c>`;
      }

      rowsXml += `<row r="${rowNum}">${cellsXml}</row>`;
      rowNum++;
    }

    // Empty separator row between PDF pages
    if (i < numPages) {
      rowNum++;
    }
  }

  // Inject rows into xl/worksheets/sheet1.xml
  let sheet1Xml = await zip.file('xl/worksheets/sheet1.xml').async('string');
  if (sheet1Xml.includes('<sheetData></sheetData>')) {
    sheet1Xml = sheet1Xml.replace('<sheetData></sheetData>', `<sheetData>${rowsXml}</sheetData>`);
  } else if (sheet1Xml.includes('<sheetData/>')) {
    sheet1Xml = sheet1Xml.replace('<sheetData/>', `<sheetData>${rowsXml}</sheetData>`);
  } else {
    sheet1Xml = sheet1Xml.replace('</worksheet>', `<sheetData>${rowsXml}</sheetData></worksheet>`);
  }
  zip.file('xl/worksheets/sheet1.xml', sheet1Xml);

  onProgress(90, 'Packaging Excel (.xlsx) workbook...');
  const xlsxBlob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  onProgress(100, 'Excel spreadsheet ready!');
  const filename = file.name.replace(/\.[^/.]+$/, '') + '.xlsx';
  return { blob: xlsxBlob, filename, isSimulated: false };
}
