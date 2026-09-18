import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import { readFileAsArrayBuffer } from './pdfEngine';
import { PPTX_BASE64_TEMPLATE } from './pptxTemplate';

// Ensure PDF.js worker is set
if (typeof window !== 'undefined' && 'Worker' in window && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

/**
 * Generate a 100% valid Microsoft PowerPoint OpenXML (.pptx) file from PDF
 */
export async function createValidPptxFromPdf(file, onProgress = () => {}) {
  onProgress(10, 'Loading PowerPoint engine...');
  const zip = await JSZip.loadAsync(PPTX_BASE64_TEMPLATE, { base64: true });

  onProgress(20, 'Reading PDF structure...');
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  let contentTypesXml = await zip.file('[Content_Types].xml').async('string');
  let presentationXml = await zip.file('ppt/presentation.xml').async('string');
  let presentationRelsXml = await zip.file('ppt/_rels/presentation.xml.rels').async('string');
  const slide1Xml = await zip.file('ppt/slides/slide1.xml').async('string');

  let extraContentTypes = '';
  let extraSlideIds = '';
  let extraPresentationRels = '';

  for (let i = 1; i <= numPages; i++) {
    const pct = 20 + Math.round((i / numPages) * 65);
    onProgress(pct, `Converting page ${i} of ${numPages} to PowerPoint slide...`);

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;

    const dataUrl = canvas.toDataURL('image/png');
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

    // Write page image
    zip.file(`ppt/media/image${i}.png`, base64Data, { base64: true });

    if (i > 1) {
      extraContentTypes += `<Override PartName="/ppt/slides/slide${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
      extraSlideIds += `<p:sldId id="${256 + i - 1}" r:id="rId${10 + i}"/>`;
      extraPresentationRels += `<Relationship Id="rId${10 + i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i}.xml"/>`;

      zip.file(`ppt/slides/slide${i}.xml`, slide1Xml);

      const slideRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout7.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${i}.png"/>
</Relationships>`;
      zip.file(`ppt/slides/_rels/slide${i}.xml.rels`, slideRels);
    }
  }

  if (numPages > 1) {
    contentTypesXml = contentTypesXml.replace('</Types>', `${extraContentTypes}</Types>`);
    presentationXml = presentationXml.replace('</p:sldIdLst>', `${extraSlideIds}</p:sldIdLst>`);
    presentationRelsXml = presentationRelsXml.replace('</Relationships>', `${extraPresentationRels}</Relationships>`);

    zip.file('[Content_Types].xml', contentTypesXml);
    zip.file('ppt/presentation.xml', presentationXml);
    zip.file('ppt/_rels/presentation.xml.rels', presentationRelsXml);
  }

  onProgress(90, 'Packaging genuine PowerPoint (.pptx) file...');
  const pptxBlob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  onProgress(100, 'PowerPoint presentation ready!');
  const filename = file.name.replace(/\.[^/.]+$/, '') + '.pptx';
  return { blob: pptxBlob, filename, isSimulated: false };
}
