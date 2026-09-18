import JSZip from 'jszip';
import { readFileAsArrayBuffer } from './pdfEngine';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
if (typeof window !== 'undefined' && 'Worker' in window) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

/**
 * Convert PDF pages to JPG images
 * Returns { blob, filename, count }
 */
export async function pdfToJpg(file, quality = 0.92, onProgress = () => {}) {
  onProgress(10, 'Loading PDF for rendering...');
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  if (numPages === 0) {
    throw new Error('This PDF has no pages.');
  }

  const baseName = file.name.replace(/\.[^/.]+$/, '');

  // If only 1 page, return direct JPG
  if (numPages === 1) {
    onProgress(50, 'Rendering page to JPG...');
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for sharp output

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    const jpgBlob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
    });

    onProgress(100, 'Done!');
    return {
      blob: jpgBlob,
      filename: `${baseName}_page_1.jpg`,
      count: 1,
    };
  }

  // Multi-page PDF -> Render each and package into ZIP
  const zip = new JSZip();
  for (let i = 1; i <= numPages; i++) {
    onProgress(15 + Math.round((i / numPages) * 75), `Rendering page ${i} of ${numPages} to high-res JPG...`);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    const pageJpgBlob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
    });

    zip.file(`${baseName}_page_${i}.jpg`, pageJpgBlob);
  }

  onProgress(92, 'Packaging JPG images into ZIP...');
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  onProgress(100, 'Done!');

  return {
    blob: zipBlob,
    filename: `${baseName}_jpg_images.zip`,
    count: numPages,
  };
}
