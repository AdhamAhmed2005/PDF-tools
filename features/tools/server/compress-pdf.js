// compress-pdf.js
// Processor that compresses a PDF using Ghostscript (gs).
// Exports an async `process(files, options)` function that accepts an array of
// prepared files: { name, type, buffer } and returns either a JSON payload or
// a download payload { download: true, filename, buffer, contentType }.
//
// Notes:
// - This implementation requires Ghostscript (`gs`) to be installed and on PATH.
// - All runtime checks and external calls happen inside `process()` to avoid
//   throwing at module import time (important for Next/Turbopack).

import { PDFDocument } from 'pdf-lib';

// compress-pdf using pdf-lib
// This implementation rewrites the PDF into a new document and saves it with
// object-streams and compression enabled. This gives a modest size reduction
// without external binaries. It does NOT perform image downsampling — for
// stronger compression you'd need to extract and re-encode images (future work).

export async function process(files, options = {}) { 
  if (!files || files.length === 0) {
    throw new Error('compress-pdf: no files provided');
  }

  const file = files[0];
  const originalName = file.name || 'input.pdf';
  if (!/\.pdf$/i.test(originalName) && !(file.type && file.type.includes('pdf'))) {
    throw new Error('compress-pdf: only PDF files are supported');
  }

  // Load the incoming PDF
  const inputBytes = file.buffer;
  // pdf-lib may throw for corrupted PDFs; let that bubble up to the caller
  const srcDoc = await PDFDocument.load(inputBytes, { throwOnInvalidObject: false });

  // Create a new PDF and copy pages over. By creating a fresh document we avoid
  // copying potentially large metadata, unused objects, and can enable
  // compression options on save.
  const outDoc = await PDFDocument.create();
  const pageIndices = srcDoc.getPageIndices();
  const copiedPages = await outDoc.copyPages(srcDoc, pageIndices);
  copiedPages.forEach((p) => outDoc.addPage(p));

  // Optionally: remove embedded JavaScript, metadata, or other optional objects
  // For now we keep the pages only (outDoc doesn't inherit srcDoc metadata).

  // Save with compression options. pdf-lib supports `useObjectStreams` and
  // `useCompression` which can reduce size without re-encoding images.
  const saveOptions = {
    useObjectStreams: true,
    useCompression: true,
  };

  const outBytes = await outDoc.save(saveOptions);

  return {
    download: true,
    filename: originalName.replace(/\.pdf$/i, '') + '-compressed.pdf',
    buffer: Buffer.from(outBytes),
    contentType: 'application/pdf',
  };
}
