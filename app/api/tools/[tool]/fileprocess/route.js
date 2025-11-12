export const runtime = 'nodejs';

import { processFilesForTool } from '@/lib/tools/processor';
import { canUse, incrementUsage, remaining } from '@/lib/server/usage-db';
import { getClientInfo } from '@/actions/getClientInfo';

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

  // Identify client by IP + token using shared helper
  const { ip, token } = getClientInfo(request, form);
  const LIMIT = 5;
  const allowed = await canUse(ip, token, LIMIT);
  const remainingBefore = await remaining(ip, token, LIMIT);
    if (!allowed) {
      return new Response(JSON.stringify({ success: false, message: `Usage limit exceeded (${LIMIT}).` , remaining: 0 }), { status: 429 });
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

        // Increment usage now that processing succeeded
        try {
          const rec = await incrementUsage(ip, token);
          // expose remaining uses in header when possible
          const rem = Math.max(0, LIMIT - (rec.count || 0));
          // attach as `X-Usage-Remaining` header below where applicable
          // (for JSON responses we'll include it in the body; for binary downloads
          // we attach a response header)
          result.usage = { remaining: rem, limit: LIMIT };
        } catch (e) {
          console.error('usage-db error', e);
        }

        // If the processor returned a direct download buffer for a single file,
        // instead of streaming immediately, persist temporarily and return a JSON downloadUrl
        if (payload && payload.download && payload.buffer) {
          try {
            const { writeFile, mkdir } = await import('node:fs/promises');
            const path = await import('node:path');
            const crypto = await import('node:crypto');

            const filename = payload.filename || 'output';
            const contentType = payload.contentType || 'application/octet-stream';

            // Create tmp dir under uploads/tmp
            const cwd = process.cwd();
            const tmpDir = path.join(cwd, 'uploads', 'tmp');
            await mkdir(tmpDir, { recursive: true });

            // Generate random id and store binary + metadata
            const id = crypto.randomBytes(12).toString('hex');
            const binPath = path.join(tmpDir, `${id}.bin`);
            const metaPath = path.join(tmpDir, `${id}.json`);

            const buf = Buffer.isBuffer(payload.buffer) ? payload.buffer : Buffer.from(payload.buffer);
            await writeFile(binPath, buf);
            await writeFile(metaPath, JSON.stringify({ filename, contentType, size: buf.length, createdAt: Date.now() }));

            const downloadUrl = `/api/download/${id}`;

            return new Response(
              JSON.stringify({
                success: true,
                message: result.message || 'Processing completed',
                result: { downloadUrl, filename, contentType, size: buf.length },
                usage: result?.usage || { remaining: remainingBefore, limit: LIMIT },
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
          } catch (persistErr) {
            console.error('Error persisting temp download file', persistErr);
            // Fallback to previous behavior (stream) if persistence fails
            const filename = payload.filename || 'output';
            const contentType = payload.contentType || 'application/octet-stream';
            const headers = {
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="${filename}"`,
              'X-Usage-Limit': String(LIMIT),
              'X-Usage-Remaining': String(result?.usage?.remaining ?? remainingBefore),
            };
            const data = Buffer.isBuffer(payload.buffer) ? payload.buffer : Buffer.from(payload.buffer);
            return new Response(data, { status: 200, headers });
          }
        }

        // JSON response: include remaining uses
        return new Response(JSON.stringify({ success: true, message: result.message || 'Processing completed', result: payload, usage: result?.usage || { remaining: remainingBefore, limit: LIMIT } }), { status: 200 });
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
