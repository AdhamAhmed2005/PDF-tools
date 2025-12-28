// tiktok-download.js
// Delegates TikTok downloads to the shared download service.

import { env as processEnv } from 'node:process';
import axios from 'axios';

const DEFAULT_API_BASE = 'http://localhost:8000';
const REMOTE_API_BASE =
  (processEnv?.TIKTOK_API_BASE_URL || processEnv?.YOUTUBE_API_BASE_URL || DEFAULT_API_BASE).replace(/\/$/, '');

export async function process(files) {
  if (!files || files.length === 0) {
    throw new Error('No URL provided');
  }

  const urlData = files[0];
  if (!urlData.url) {
    throw new Error('No URL provided');
  }

  if (!isValidTikTokUrl(urlData.url)) {
    throw new Error('Please provide a valid TikTok URL');
  }

  try {
    const endpoint = `${REMOTE_API_BASE}/tiktok/download`;
    const response = await axios.post(
      endpoint,
      null,
      {
        params: { url: urlData.url },
        timeout: 30000,
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const payload = response.data;
    if (!payload || !payload.process_id) {
      throw new Error(payload?.message || 'Download server did not return a process ID');
    }

    const jobId = payload.process_id;
    const message = payload.message || 'Download queued, preparing video...';

    return {
      message,
      requiresPolling: true,
      jobType: 'tiktok-download',
      job: {
        id: jobId,
        status: payload.status || 'pending',
        statusUrl: `/api/download-jobs/${jobId}`,
        fileUrl: `/api/download-jobs/${jobId}/file`,
        suggestedFilename: payload.suggested_name || payload.filename,
        raw: payload,
      },
    };
  } catch (error) {
    console.error('TikTok download error:', error);

    if (error.code === 'ECONNABORTED') {
      throw new Error('Download timeout - video may be too large or the server took too long to respond');
    }

    if (error.response) {
      const status = error.response.status;
      const message =
        parseRemoteError(error.response.data) ||
        error.response.statusText ||
        'Remote download service error';

      if (status === 422) {
        throw new Error('Validation failed: please check that the TikTok URL is correct and accessible.');
      }

      if (status === 404) {
        throw new Error('Download service unavailable - please try again later.');
      }

      throw new Error(message);
    }

    throw new Error(error.message || 'Failed to initiate TikTok download');
  }
}

function parseRemoteError(data) {
  if (!data) return null;
  if (typeof data === 'string') return data;
  if (typeof data === 'object') {
    return data.detail || data.message || data.error || null;
  }
  return null;
}

function isValidTikTokUrl(url) {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname.endsWith('tiktok.com') ||
      urlObj.hostname.endsWith('vm.tiktok.com') ||
      urlObj.hostname.endsWith('vt.tiktok.com')
    );
  } catch {
    return false;
  }
}
