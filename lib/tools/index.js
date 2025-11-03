// Static registry of available tool processors.
// Import processors here so the bundler / runtime can statically analyze imports.
// Next/Turbopack/Next.js requires static imports in server code so the bundler can
// analyze modules at build time. Avoid dynamic filesystem imports which cause
// "expression is too dynamic" bundler errors.

import * as compressPdfModule from './compress-pdf.js';
import * as rotatePdfModule from './rotate-pdf.js';

export const compressPdfProcessor = compressPdfModule;
export const rotatePdfProcessor = rotatePdfModule;

// Map simple tool keys to their modules (each module should export `process(files, options)`)
const registry = {
  'compress-pdf': compressPdfProcessor,
  'rotate-pdf': rotatePdfProcessor,
};

export default registry;

// Named convenience exports for direct imports: `import { compressPdf } from '@/lib/tools'`
export const compressPdf = compressPdfProcessor;
export const rotatePdf = rotatePdfProcessor;
