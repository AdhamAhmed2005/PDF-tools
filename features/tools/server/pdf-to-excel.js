import axios from 'axios';

export async function process ( files, options = {} ) {
    if ( !files || files.length === 0 )
    {
        throw new Error( 'No files provided' );
    }

    const file = files[ 0 ];
    const originalName = file.name || 'input.pdf';

    // Validate if the file is a PDF
    if ( !/\.pdf$/i.test( originalName ) && !( file.type && file.type.includes( 'pdf' ) ) )
    {
        throw new Error( 'Only PDF files are supported' );
    }

    // Credentials for Aspose Cloud API
    const clientId = 'f8913c2f-7f0a-4e96-b357-56c4202c77e5';
    const clientSecret = 'b805b103f7443350a1fd072da38cdc81';

    // Get OAuth2 access token to authenticate API calls
    const tokenResponse = await axios.post(
        'https://api.aspose.cloud/connect/token',
        new URLSearchParams( {
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            scope: 'https://api.aspose.cloud/.default',
        } ),
        {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
    );

    const accessToken = tokenResponse.data.access_token;

    // Upload PDF file to Aspose Cloud storage (default storage)
    await axios.put(
        `https://api.aspose.cloud/v3.0/pdf/storage/file/${ encodeURIComponent( originalName ) }`,
        file.buffer,
        {
            headers: {
                Authorization: `Bearer ${ accessToken }`,
                'Content-Type': 'application/pdf',
            },
        }
    );

    // Convert uploaded PDF to Excel (XLSX) - the API saves converted file to storage
    const outputName = 'converted/' + originalName.replace( /\.pdf$/i, '.xlsx' );

    await axios.put(
        `https://api.aspose.cloud/v3.0/pdf/${ encodeURIComponent( originalName ) }/convert/xlsx?outPath=${ encodeURIComponent(
            outputName
        ) }`,
        null,
        {
            headers: {
                Authorization: `Bearer ${ accessToken }`,
            },
        }
    );

    const downloadResponse = await axios.get(
        `https://api.aspose.cloud/v3.0/pdf/storage/file/${ encodeURIComponent( outputName ) }`,
        {
            headers: {
                Authorization: `Bearer ${ accessToken }`,
            },
            responseType: 'arraybuffer',
        }
    );

    // Return buffer and metadata for download
    return {
        download: true,
        filename: originalName.replace( /\.pdf$/i, '' ) + '-converted.xlsx',
        buffer: Buffer.from( downloadResponse.data ),
        contentType: downloadResponse.headers?.[ 'content-type' ] ||
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
}
