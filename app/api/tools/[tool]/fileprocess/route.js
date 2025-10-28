export const runtime = 'nodejs';

import { processFilesForTool } from '@/lib/tools/processor';

// This route no longer writes uploaded files to disk.
// It delegates handling to the per-tool processor under lib/tools/<tool>.js
// The processor may perform synchronous processing, enqueue a job, or return a 202-style acceptance response.
export async function POST(request, { params }) {
  try {
    const form = await request.formData();
    const files = form.getAll('files');
    // prefer explicit form field if present, otherwise use route param
    const toolFromForm = form.get('tool');
    const tool = toolFromForm || params?.tool || 'unknown';

    if (!files || !files.length) {
      return new Response(JSON.stringify({ success: false, message: 'No files uploaded' }), { status: 400 });
    }

    try {
      let options = {};
      const angleField = form.get('angle');
      const optionsField = form.get('options');
      if (optionsField) {
        try {
          options = JSON.parse(String(optionsField));
        } catch (e) {
        }
      }
      if (angleField && !options.angle) options.angle = Number(angleField);

      const result = await processFilesForTool(tool, files, options);
      // If the processor handled the work, return its result
      if (result && result.success) {
        const payload = result.result;

        // If the processor returned a direct download buffer for a single file, stream it back
        if (payload && payload.download && payload.buffer) {
          const filename = payload.filename || 'output';
          const contentType = payload.contentType || 'application/octet-stream';
          const headers = {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${filename}"`,
          };
          // payload.buffer should be a Node Buffer or Uint8Array
          return new Response(payload.buffer, { status: 200, headers });
        }

        return new Response(JSON.stringify({ success: true, message: result.message || 'Processing completed', result: payload }), { status: 200 });
      }

      // If no processor was found or it chose not to process synchronously, return 202 Accepted with explanation
      return new Response(JSON.stringify({ success: false, message: result?.message || 'No processor for this tool; processing not performed' }), { status: 202 });
    } catch (err) {
      console.error('Processor error:', err);
      return new Response(JSON.stringify({ success: false, message: 'Processor error', error: String(err) }), { status: 500 });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), { status: 500 });
  }
}
