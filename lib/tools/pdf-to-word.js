import axios from 'axios';


export async function process ( files, options = {} ) {
    if ( !files || files.length === 0 )
    {
        throw new Error( 'No files provided' );
    }


    const file = files[ 0 ];
    const originalName = file.name || 'input.pdf';
    if ( !/\.pdf$/i.test( originalName ) && !( file.type && file.type.includes( 'pdf' ) ) )
    {
        throw new Error( 'Only PDF files are supported' );
    }


    const clientId = 'f8913c2f-7f0a-4e96-b357-56c4202c77e5';
    const clientSecret = 'b805b103f7443350a1fd072da38cdc81';


    const tokenResponse = await axios.post(
        'https://api.aspose.cloud/connect/token',
        new URLSearchParams( {
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            scope: 'https://api.aspose.cloud/.default',
        } )
    );
    const accessToken = tokenResponse.data.access_token;


    await axios.put(
        'https://api.aspose.cloud/v3.0/pdf/storage/file/input.pdf',
        file.buffer,
        {
            headers: {
                Authorization: `Bearer ${ accessToken }`,
                'Content-Type': 'application/pdf',
            }
        }
    );


    const convertResponse = await axios.post(
        'https://api.aspose.cloud/v3.0/pdf/input.pdf/convert/docx',
        null,
        {
            headers: {
                Authorization: `Bearer ${ accessToken }`
            },
            responseType: 'arraybuffer'
        }
    );


    return {
        download: true,
        filename: originalName.replace( /\.pdf$/i, '' ) + '-converted.docx',
        buffer: Buffer.from( convertResponse.data ),
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
}

// Static registry of available tool processors.
// Import processors here so the bundler / runtime can statically analyze imports.
import * as exampleModule from './example.js';
import * as rotatePdfModule from './rotate-pdf.js';


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
};


export default registry;


// Also export named keys for `import * as tools from '@/lib/tools'` convenience
// Named convenience exports (avoid reusing the imported binding names)
// Named convenience exports (avoid using hyphens in export names)
// Convenience named exports for direct imports: `import { example } from '@/lib/tools'`
export const example = exampleProcessor;
export const rotatePdf = rotatePdfProcessor;