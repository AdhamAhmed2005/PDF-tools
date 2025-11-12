// Static registry of available tool processors.
// Import processors here so the bundler / runtime can statically analyze imports.
import * as exampleModule from './example.js';
import * as rotatePdfModule from './rotate-pdf.js';
import * as pdfToWordModule from './pdf-to-word.js';
import * as pdfToExcelModule from './pdf-to-excel.js';

export const exampleProcessor = exampleModule;
export const rotatePdfProcessor = rotatePdfModule;


// Map simple tool keys to their modules (each module should export `process(files)`)
// lib/tools/index.js
// -------------------
// Static registry that explicitly imports and re-exports available tool processors.
// Why: Next/Turbopack requires static imports so the bundler can analyze modules at
// build time. Avoid dynamic filesystem imports which cause "expression is too dynamic"
// bundler errors. To add a new tool, create `lib/tools/<tool>.js` and import it here.

const registry = {
  example: exampleProcessor,
  'rotate-pdf': rotatePdfProcessor,
  'pdf-to-word': pdfToWordModule,
  'pdf-to-excel': pdfToExcelModule,
};

export default registry;

// Also export named keys for `import * as tools from '@/lib/tools'` convenience
// Named convenience exports (avoid reusing the imported binding names)
// Named convenience exports (avoid using hyphens in export names)
// Convenience named exports for direct imports: `import { example } from '@/lib/tools'`
export const example = exampleProcessor;
export const rotatePdf = rotatePdfProcessor;
export const pdfToWord = pdfToWordModule;
export const pdfToExcel = pdfToExcelModule;