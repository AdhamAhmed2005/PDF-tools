// youtube-download.js
// YouTube video downloader using ytdl-core

import ytdl from 'ytdl-core';

/**
 * files: [{ url: 'https://www.youtube.com/...' }]
 * options: { quality?: 'highest' | 'lowest' | 'audio' | 'itagNumber' }
 */
export async function process ( files, options = {} ) {
    if ( !files || files.length === 0 )
    {
        throw new Error( 'No URL provided' );
    }

    const urlData = files[ 0 ];
    if ( !urlData.url )
    {
        throw new Error( 'No URL provided' );
    }

    const youtubeUrl = urlData.url;

    // Validate YouTube URL
    if ( !isValidYouTubeUrl( youtubeUrl ) )
    {
        throw new Error( 'Please provide a valid YouTube URL' );
    }

    const quality = options.quality || 'highest'; // 'highest', 'lowest', 'highestaudio', itag, ...

    try
    {
        // Get video info
        const info = await ytdl.getInfo( youtubeUrl );

        if ( !info || !info.videoDetails )
        {
            throw new Error( 'No video info found for this URL' );
        }

        const details = info.videoDetails;

        // Choose format
        let format;
        if ( quality === 'audio' )
        {
            format = ytdl.chooseFormat( info.formats, { quality: 'highestaudio' } );
        } else if ( typeof quality === 'number' )
        {
            format = ytdl.chooseFormat( info.formats, { quality } );
        } else
        {
            // 'highest' | 'lowest' | 'highestaudio' | 'lowestaudio' | 'highestvideo' | ...
            format = ytdl.chooseFormat( info.formats, { quality } );
        }

        if ( !format || !format.url )
        {
            throw new Error( 'No downloadable format found for this video' );
        }

        // Download the selected format into a buffer
        const chunks = [];
        await new Promise( ( resolve, reject ) => {
            const stream = ytdl.downloadFromInfo( info, { format } );

            stream.on( 'data', ( chunk ) => chunks.push( chunk ) );
            stream.on( 'end', resolve );
            stream.on( 'error', reject );
        } );

        const buffer = Buffer.concat( chunks );

        // Build filename: author_title.mp4 / .mp3
        const rawTitle = details.title || 'youtube_video';
        const rawAuthor = details.author?.name || 'unknown';

        const title = sanitizeFilename( rawTitle );
        const author = sanitizeFilename( rawAuthor );

        const isAudioOnly = format.hasVideo === false && format.hasAudio === true;
        const ext = isAudioOnly ? 'mp3' : 'mp4';

        const filename = `${ author }_${ title }.${ ext }`;

        return {
            download: true,
            filename,
            buffer,
            contentType: isAudioOnly ? 'audio/mpeg' : 'video/mp4',
        };
    } catch ( error )
    {
        console.error( 'YouTube download error:', error );

        if ( error.message?.includes( 'This video is unavailable' ) )
        {
            throw new Error( 'Video not available - it may be private or removed' );
        }

        if ( error.message?.includes( 'Too many requests' ) )
        {
            throw new Error( 'Rate limit exceeded - please try again later' );
        }

        throw new Error( error.message || 'Failed to download YouTube video' );
    }
}

function isValidYouTubeUrl ( url ) {
    try
    {
        const urlObj = new URL( url );
        const host = urlObj.hostname.toLowerCase();

        if (
            !(
                host.includes( 'youtube.com' ) ||
                host.includes( 'youtu.be' )
            )
        )
        {
            return false;
        }

        return ytdl.validateURL( url );
    } catch
    {
        return false;
    }
}

function sanitizeFilename ( name ) {
    return name
        .replace( /[^\w\s-]/g, '' ) // Remove special characters except spaces and hyphens
        .replace( /\s+/g, '_' ) // Replace spaces with underscores
        .replace( /_+/g, '_' ) // Replace multiple underscores with single
        .substring( 0, 80 ) // Limit length
        .replace( /^_+|_+$/g, '' ); // Remove leading/trailing underscores
}
