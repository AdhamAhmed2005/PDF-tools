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
    const clientSecret = '300ca2ccf2940f799ea61deb76217606';


    const tokenResponse = await axios.post(
        'https://api.aspose.cloud/connect/token',
        new URLSearchParams( {
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret
        } ),
        {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
    );
    const accessToken = tokenResponse.data.access_token;

    // رفع الملف إلى التخزين الافتراضي
    await axios.put(
        `https://api.aspose.cloud/v3.0/pdf/storage/file/${ encodeURIComponent( originalName ) }`,
        file.buffer,
        {
            headers: {
                Authorization: `Bearer ${ accessToken }`,
                'Content-Type': 'application/pdf'
            }
        }
    );

    // اسم ملف التحويل النهائي داخل التخزين
    const outputName = 'converted/' + originalName.replace( /\.pdf$/i, '.docx' );

    // نفذ التحويل في Aspose (العملية نفسها تحفظ الملف الناتج على التخزين في هذا المسار)
    await axios.put(
        `https://api.aspose.cloud/v3.0/pdf/${ encodeURIComponent( originalName ) }/convert/doc?outPath=${ encodeURIComponent( outputName ) }&format=DocX`,
        null,
        {
            headers: {
                Authorization: `Bearer ${ accessToken }`
            }
        }
    );

    // تحميل الملف الناتج كما هو من التخزين (بنفس طريقة التنزيل من Dashboard)
    const downloadResponse = await axios.get(
        `https://api.aspose.cloud/v3.0/pdf/storage/file/${ encodeURIComponent( outputName ) }`,
        {
            headers: {
                Authorization: `Bearer ${ accessToken }`
            },
            responseType: 'arraybuffer'
        }
    );

    // أعد الملف الصحيح كما يظهر من لوحة التحكم
    return {
        download: true,
        filename: originalName.replace( /\.pdf$/i, '' ) + '-converted.docx',
        buffer: Buffer.from( downloadResponse.data ),
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
}
