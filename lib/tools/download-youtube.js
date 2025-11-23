import ytdl from 'ytdl-core';

// process function to download YouTube video
export async function process ( files, options = {} ) {
    if ( !files || files.length === 0 )
    {
        throw new Error( 'download-youtube: no files provided' );
    }

    const file = files[ 0 ];
    const url = file.url;

    if ( !url || !ytdl.validateURL( url ) )
    {
        throw new Error( 'download-youtube: invalid YouTube URL' );
    }

    try
    {
        const videoStream = ytdl( url, { quality: 'highestvideo' } );

        const chunks = [];
        for await ( const chunk of videoStream )
        {
            chunks.push( chunk );
        }
        const buffer = Buffer.concat( chunks );

        return {
            download: true,
            filename: 'video.mp4',
            buffer: buffer,
            contentType: 'video/mp4',
        };
    } catch ( error )
    {
        throw new Error( 'download-youtube: download failed' );
    }
}
