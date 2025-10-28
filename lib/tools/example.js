// Example tool processor. This is a minimal stub showing the expected shape.
// Export an async `process(files)` function. `files` is an array of { name, type, buffer }.
export async function process(files) {
  // Do not write to disk here unless your tool specifically needs to.
  // You can perform in-memory conversions, call external services, or enqueue a job.
  // For demo purposes we just return a summary.
  const summary = files.map((f) => ({ name: f.name, size: f.buffer.length, type: f.type }));

  return {
    message: `Example processor handled ${files.length} file(s)`,
    files: summary,
  };
}
