import { uploadFile } from '@/actions/uploadFile';
import fs from 'fs';
import path from 'path';

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
      const result = await uploadFile(files, tool);
      if (!result.success) {
        return new Response(JSON.stringify({ success: false, message: result.message }), { status: 500 });
      }
      return new Response(JSON.stringify({ success: true, message: result.message, files: files.map((f) => f.name) }), { status: 200 });
    } catch (err) {
      // Fallback: write into public/uploads/<tool>
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', tool);
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = file.name || `file-${Date.now()}`;
        fs.writeFileSync(path.join(uploadDir, filename), buffer);
      }

      return new Response(JSON.stringify({ success: true, message: `${files.length} file(s) uploaded to ${tool}`, files: files.map((f) => f.name) }), { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), { status: 500 });
  }
}
