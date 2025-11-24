export const runtime = 'nodejs';

import { processFilesForTool } from '@/lib/tools/processor';
import { canUse, incrementUsage, remaining } from '@/lib/server/usage-db';
import { getClientInfo } from '@/actions/getClientInfo';
import { getConnection } from '@/lib/database';
import sql from 'mssql';

export async function POST ( request, { params } ) {
  try
  {
    const contentType = request.headers.get('content-type');
    let tool, files, options = {}, userId;
    
    if (contentType?.includes('application/json')) {
      // Handle URL-based tools (JSON payload)
      const body = await request.json();
      tool = body.tool || params?.tool || 'unknown';
      userId = body.user_id;
      
      if (!body.url) {
        return new Response( JSON.stringify( { success: false, message: 'No URL provided' } ), { status: 400 } );
      }
      
      // For URL tools, we pass the URL as the "file" data
      files = [{ url: body.url, name: 'url_input' }];
      options = body.options || {};
    } else {
      // Handle file-based tools (FormData)
      const form = await request.formData();
      files = form.getAll( 'files' );
      const toolFromForm = form.get( 'tool' );
      tool = toolFromForm || params?.tool || 'unknown';
      userId = form.get( 'user_id' );
      
      if ( !files || !files.length )
      {
        return new Response( JSON.stringify( { success: false, message: 'No files uploaded' } ), { status: 400 } );
      }
      
      const angleField = form.get( 'angle' );
      const optionsField = form.get( 'options' );
      if ( optionsField )
      {
        try { options = JSON.parse( String( optionsField ) ); } catch ( e ) { }
      }
      if ( angleField && !options.angle ) options.angle = Number( angleField );
    }

  // Identify client by IP + token using shared helper
  const { ip, token } = getClientInfo(request, null);
  const LIMIT = 5;
  const allowed = await canUse(ip, token, LIMIT);
  const remainingBefore = await remaining(ip, token, LIMIT);
    if (!allowed) {
      return new Response(JSON.stringify({ success: false, message: `Usage limit exceeded (${LIMIT}).` , remaining: 0 }), { status: 429 });
    }

    try {
      const result = await processFilesForTool( tool, files, options );
  const payload = result?.result;

      let toolId = null;
      try
      {
        const pool = await getConnection();
        const toolResult = await pool.request()
          .input( 'toolName', sql.NVarChar, tool )
          .query( 'SELECT id FROM Tools WHERE name = @toolName' );
        toolId = toolResult.recordset[ 0 ]?.id || null;
      } catch ( err )
      {
        toolId = null;
      }

      // Log user action only if we have a valid user_id and tool_id
      if (userId && toolId) {
        try
        {
          const pool = await getConnection();
          await pool.request()
            .input( 'userId', sql.Int, Number( userId ) )
            .input( 'toolId', sql.Int, toolId )
            .input( 'timestamp', sql.DateTime, new Date() )
            .input( 'status', sql.NVarChar, result?.success ? 'completed' : 'failed' )
            .query( `
              INSERT INTO User_Actions (user_id, tool_id, timestamp, status)
              VALUES (@userId, @toolId, @timestamp, @status)
            `);
        } catch ( dbErr )
        {
          console.error( 'User_Actions insert error:', dbErr );
        }
      }
      // Only proceed if processing succeeded
      if (result && result.success) {
        // Increment usage now that processing succeeded
        try {
          const rec = await incrementUsage(ip, token);
          const rem = Math.max(0, LIMIT - (rec.count || 0));
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

            const cwd = process.cwd();
            const tmpDir = path.join(cwd, 'uploads', 'tmp');
            await mkdir(tmpDir, { recursive: true });

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
        return new Response(
          JSON.stringify({
            success: true,
            message: result.message || 'Processing completed',
            result: payload,
            usage: result?.usage || { remaining: remainingBefore, limit: LIMIT },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // If no processor was found or it failed
      return new Response(
        JSON.stringify({ success: false, message: result?.message || 'No processor for this tool; processing not performed' }),
        { status: 202 }
      );
    } catch ( err )
    {
      console.error( 'Processor error:', err );
      return new Response( JSON.stringify( { success: false, message: 'Processor error', error: String( err ) } ), { status: 500 } );
    }
  } catch ( err )
  {
    console.error( err );
    return new Response( JSON.stringify( { success: false, message: 'Server error' } ), { status: 500 } );
  }
}
