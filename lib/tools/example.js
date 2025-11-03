// Deprecated example processor. The project now provides concrete processors
// (rotate-pdf, compress-pdf, etc.). This file is left as a harmless stub so
// that any accidental direct imports will get a clear runtime message.

export async function process() {
  throw new Error(
    'The example processor has been removed. Use a concrete processor (e.g. "rotate-pdf" or "compress-pdf").'
  );
}
