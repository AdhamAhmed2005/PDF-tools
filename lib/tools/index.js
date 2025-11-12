// Static registry of available tool processors.
// Import processors here so the bundler / runtime can statically analyze imports.
// Next/Turbopack/Next.js requires static imports in server code so the bundler can
// analyze modules at build time. Avoid dynamic filesystem imports which cause
// "expression is too dynamic" bundler errors.

import * as compressPdfModule from './compress-pdf.js';
import * as rotatePdfModule from './rotate-pdf.js';
import * as compressPdfToWordModule from './compress-pdf-to-word.js';
import * as compressPdfToExcelModule from './compress-pdf-to-excel.js';

export const compressPdfProcessor = compressPdfModule;
export const rotatePdfProcessor = rotatePdfModule;

// Map simple tool keys to their modules (each module should export `process(files, options)`)
const registry = {
  'compress-pdf': compressPdfProcessor,
  'rotate-pdf': rotatePdfProcessor,
  'pdf-to-word': compressPdfToWordModule,  // Add mapping for URL route
  'pdf-to-excel': compressPdfToExcelModule,
};

export default registry;

// Named convenience exports for direct imports: `import { compressPdf } from '@/lib/tools'`
export const compressPdf = compressPdfProcessor;
export const rotatePdf = rotatePdfProcessor;
export const compressPdfToWord = compressPdfToWordModule;
export const compressPdfToExcel = compressPdfToExcelModule;