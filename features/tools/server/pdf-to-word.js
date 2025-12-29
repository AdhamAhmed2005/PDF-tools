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

    const convertTo = options.convertTo || 'word';
    const extension = convertTo === 'excel' ? 'xlsx' : 'docx';

    const processResponse = await axios.post(
        'http://localhost:8000/pdf-convert',
        {
            filename: originalName,
            file: file.buffer,
            contentType: file.type || 'application/pdf',
            convertTo: convertTo
        },
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );

    const processId = processResponse.data.processId;

    let jobStatus;
    while ( true )
    {
        const statusResponse = await axios.get(
            `http://localhost:8000/pdf-convert/${ processId }`
        );
        jobStatus = statusResponse.data.job;

        if ( jobStatus.downloadReady || jobStatus.error )
        {
            break;
        }

        await new Promise( resolve => setTimeout( resolve, 1000 ) );
    }

    if ( jobStatus.error )
    {
        throw new Error( jobStatus.message || 'Conversion failed' );
    }

    return {
        success: true,
        processId: processId,
        filename: originalName.replace( /\.pdf$/i, '' ) + `-converted.${ extension }`,
        convertTo: convertTo,
        status: jobStatus.status,
        message: jobStatus.message
    };
}
