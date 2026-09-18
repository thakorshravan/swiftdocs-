import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import { readFileAsArrayBuffer } from './pdfEngine';

// Ensure PDF.js worker is set
if (typeof window !== 'undefined' && 'Worker' in window && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Extract all text lines from PDF using pdfjs-dist
 */
export async function extractPdfText(file, onProgress = () => {}) {
  onProgress(20, 'Reading PDF structure...');
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const pagesText = [];

  for (let i = 1; i <= numPages; i++) {
    onProgress(20 + Math.round((i / numPages) * 50), `Extracting text from page ${i} of ${numPages}...`);
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Group text items by vertical line position (approximate lines)
    const lines = [];
    let currentLine = '';
    let lastY = null;

    for (const item of textContent.items) {
      const y = item.transform[5]; // Y coordinate
      if (lastY !== null && Math.abs(y - lastY) > 5) {
        if (currentLine.trim()) {
          lines.push(currentLine.trim());
        }
        currentLine = item.str;
      } else {
        currentLine += (currentLine ? ' ' : '') + item.str;
      }
      lastY = y;
    }
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    pagesText.push({
      pageNumber: i,
      lines: lines.length > 0 ? lines : ['[Page ' + i + ' Content]']
    });
  }

  return pagesText;
}

/**
 * Generate a 100% valid Microsoft Word OpenXML (.docx) file from PDF
 */
export async function createValidDocxFromPdf(file, onProgress = () => {}) {
  const pages = await extractPdfText(file, onProgress);
  onProgress(75, 'Constructing genuine Word (.docx) document...');

  const zip = new JSZip();

  // 1. [Content_Types].xml
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;
  zip.file('[Content_Types].xml', contentTypesXml);

  // 2. _rels/.rels
  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
  zip.folder('_rels').file('.rels', rootRelsXml);

  // 3. word/_rels/document.xml.rels
  const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
  zip.folder('word').folder('_rels').file('document.xml.rels', wordRelsXml);

  // 4. word/styles.xml
  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="22"/>
        <w:szCs w:val="22"/>
        <w:color w:val="222222"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="160" w:line="240" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
</w:styles>`;
  zip.folder('word').file('styles.xml', stylesXml);

  // 5. word/document.xml
  let paragraphsXml = '';

  for (let pIdx = 0; pIdx < pages.length; pIdx++) {
    const page = pages[pIdx];

    // Page break before subsequent pages
    if (pIdx > 0) {
      paragraphsXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
    }

    for (const line of page.lines) {
      const cleanLine = escapeXml(line);
      paragraphsXml += `<w:p><w:r><w:t xml:space="preserve">${cleanLine}</w:t></w:r></w:p>`;
    }
  }

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${paragraphsXml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;
  zip.folder('word').file('document.xml', documentXml);

  onProgress(90, 'Packaging Word (.docx) package...');
  const docxBlob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  onProgress(100, 'Word conversion complete!');
  const filename = file.name.replace(/\.[^/.]+$/, '') + '.docx';
  return { blob: docxBlob, filename };
}
