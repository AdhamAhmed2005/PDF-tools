// Static registry of available tool processors.
// Import processors here so the bundler / runtime can statically analyze imports.
// Next/Turbopack/Next.js requires static imports in server code so the bundler can
// analyze modules at build time. Avoid dynamic filesystem imports which cause
// "expression is too dynamic" bundler errors.

import * as compressPdfModule from './compress-pdf.js';
import * as rotatePdfModule from './rotate-pdf.js';

import * as pdfToWordModule from './pdf-to-word.js';
import * as pdfToExcelModule from './pdf-to-excel.js';




export const compressPdfProcessor = compressPdfModule;
export const rotatePdfProcessor = rotatePdfModule;



// Map simple tool keys to their modules (each module should export `process(files)`)
// lib/tools/index.js
// -------------------
// Static registry that explicitly imports and re-exports available tool processors.
// Why: Next/Turbopack requires static imports so the bundler can analyze modules at
// build time. Avoid dynamic filesystem imports which cause "expression is too dynamic"
// bundler errors. To add a new tool, create `lib/tools/<tool>.js` and import it here.


// Map simple tool keys to their modules (each module should export `process(files, options)`)

const registry = {
  'compress-pdf': compressPdfProcessor,
  'rotate-pdf': rotatePdfProcessor,

  'pdf-to-word': pdfToWordModule,
  'pdf-to-excel': pdfToExcelModule,

export default registry;

// Named convenience exports for direct imports: `import { compressPdf } from '@/lib/tools'`
export const compressPdf = compressPdfProcessor;
export const rotatePdf = rotatePdfProcessor;

export const pdfToWord = pdfToWordModule;
export const pdfToExcel = pdfToExcelModule;

