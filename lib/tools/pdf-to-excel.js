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



    const accessToken = tokenResponse.data.access_token;


    await axios.put(
        'https://api.aspose.cloud/v3.0/pdf/storage/file/input.pdf',
        file.buffer,
        {
            headers: {
                Authorization: `Bearer ${ accessToken }`,
                'Content-Type': 'application/pdf',
            },
        }
    );


    const convertResponse = await axios.post(
        'https://api.aspose.cloud/v3.0/pdf/input.pdf/convert/xlsx',
        null,
        {
            headers: {
                Authorization: `Bearer ${ accessToken }`,
            },
            responseType: 'arraybuffer',
        }
    );


    return {
        download: true,
        filename: originalName.replace( /\.pdf$/i, '' ) + '-converted.xlsx',
        buffer: Buffer.from( convertResponse.data ),
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

