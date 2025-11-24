// tiktok-download.js
// TikTok video downloader using tikwm.com API

import axios from 'axios';

export async function process(files, options = {}) {
    if (!files || files.length === 0) {
        throw new Error('No URL provided');
    }

    const urlData = files[0];
    if (!urlData.url) {
        throw new Error('No URL provided');
    }

    const tiktokUrl = urlData.url;

    // Validate TikTok URL
    if (!isValidTikTokUrl(tiktokUrl)) {
        throw new Error('Please provide a valid TikTok URL');
    }

    try {
        // Call tikwm.com API to get video info
        const apiResponse = await axios.post('https://www.tikwm.com/api/', {
            url: tiktokUrl
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000 // 30 second timeout
        });

        const data = apiResponse.data;

        if (!data || data.code !== 0) {
            throw new Error(data?.msg || 'Failed to process TikTok URL');
        }

        const videoInfo = data.data;
        
        if (!videoInfo || !videoInfo.play) {
            throw new Error('No video found at this URL');
        }

        // Get the no-watermark video URL (preferred) or watermark version as fallback
        const videoUrl = videoInfo.hdplay || videoInfo.play;
        
        if (!videoUrl) {
            throw new Error('No downloadable video found');
        }

        // Download the video file
        const videoResponse = await axios.get(videoUrl, {
            responseType: 'arraybuffer',
            timeout: 120000, // 2 minute timeout for large videos
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // Generate filename from video title or use default
        const title = videoInfo.title ? sanitizeFilename(videoInfo.title) : 'tiktok_video';
        const author = videoInfo.author ? sanitizeFilename(videoInfo.author.nickname) : 'unknown';
        const filename = `${author}_${title}.mp4`;

        return {
            download: true,
            filename: filename,
            buffer: Buffer.from(videoResponse.data),
            contentType: 'video/mp4',
        };

    } catch (error) {
        console.error('TikTok download error:', error);
        
        if (error.code === 'ECONNABORTED') {
            throw new Error('Download timeout - video may be too large');
        }
        
        if (error.response?.status === 404) {
            throw new Error('Video not found - URL may be invalid or private');
        }
        
        if (error.response?.status === 429) {
            throw new Error('Rate limit exceeded - please try again later');
        }

        throw new Error(error.message || 'Failed to download TikTok video');
    }
}

function isValidTikTokUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.includes('tiktok.com') || 
               urlObj.hostname.includes('vm.tiktok.com') ||
               urlObj.hostname.includes('vt.tiktok.com');
    } catch {
        return false;
    }
}

function sanitizeFilename(name) {
    return name
        .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/_+/g, '_') // Replace multiple underscores with single
        .substring(0, 50) // Limit length
        .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
}