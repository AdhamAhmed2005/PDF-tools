export const runtime = 'nodejs';

import { processFilesForTool } from '@/lib/tools/processor';
import { getConnection } from '@/lib/database';
import sql from 'mssql';

export async function POST ( request, { params } ) {
  try
  {
    const form = await request.formData();
    const files = form.getAll( 'files' );
    const toolFromForm = form.get( 'tool' );
    const tool = toolFromForm || params?.tool || 'unknown';
    const userId = form.get( 'user_id' );
    if ( !files || !files.length )
    {
      return new Response( JSON.stringify( { success: false, message: 'No files uploaded' } ), { status: 400 } );
    }
    try
    {
      let options = {};
      const angleField = form.get( 'angle' );
      const optionsField = form.get( 'options' );
      if ( optionsField )
      {
        try { options = JSON.parse( String( optionsField ) ); } catch ( e ) { }
      }
      if ( angleField && !options.angle ) options.angle = Number( angleField );

      const result = await processFilesForTool( tool, files, options );

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

      try
      {
        const pool = await getConnection();
        await pool.request()
          .input( 'userId', sql.Int, userId ? Number( userId ) : null )
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

      if ( result && result.success )
      {
        const payload = result.result;
        if ( payload && payload.download && payload.buffer )
        {
          const filename = payload.filename || 'output';
          const contentType = payload.contentType || 'application/octet-stream';
          const headers = {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${ filename }"`,
          };
          return new Response( payload.buffer, { status: 200, headers } );
        }
        return new Response( JSON.stringify( { success: true, message: result.message || 'Processing completed', result: payload } ), { status: 200 } );
      }

      return new Response( JSON.stringify( { success: false, message: result?.message || 'No processor for this tool; processing not performed' } ), { status: 202 } );
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
