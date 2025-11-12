"use client";
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from './ProgressBar';

// Enhanced file upload component with progress tracking
// Props:
// - tool: string (tool name like 'rotate-pdf')
// - onComplete?: function called when processing is done
// - accept?: string (file types to accept)
// - multiple?: boolean (allow multiple files)
export default function FileUploadWithProgress({ 
  tool, 
  onComplete, 
  accept = '.pdf', 
  multiple = false 
}) {
  const [state, setState] = useState('idle'); // 'idle' | 'uploading' | 'converting' | 'complete' | 'error'
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    
    setSelectedFiles(files);
    setFileName(files.length === 1 ? files[0].name : `${files.length} files`);
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setState('uploading');
      setProgress(0);
      setMessage('');

      const formData = new FormData();
      selectedFiles.forEach(file => formData.append('files', file));
      formData.append('tool', tool);

      // Create XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const uploadProgress = Math.round((event.loaded / event.total) * 100);
          setProgress(uploadProgress);
        }
      });

      // Handle response
      const responsePromise = new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              reject(new Error('Invalid response format'));
            }
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });
      });

      // Start upload
      xhr.open('POST', `/api/tools/${tool}/fileprocess`);
      xhr.send(formData);

      // Wait for upload to complete
      setState('converting');
      setProgress(0);
      
      const result = await responsePromise;
      
      if (result.success) {
        setState('complete');
        setProgress(100);
        setMessage('Processing complete!');
        
        // Redirect to result page after a brief delay
        setTimeout(() => {
          if (result.result?.downloadUrl) {
            const params = new URLSearchParams({
              status: 'success',
              filename: fileName,
              url: result.result.downloadUrl
            });
            router.push(`/result?${params.toString()}`);
          } else {
            onComplete?.(result);
          }
        }, 1500);
      } else {
        throw new Error(result.message || 'Processing failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setState('error');
      setMessage(error.message || 'Upload failed. Please try again.');
    }
  };

  const reset = () => {
    setState('idle');
    setProgress(0);
    setFileName('');
    setMessage('');
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* File input area */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={state === 'uploading' || state === 'converting'}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            state === 'uploading' || state === 'converting'
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : selectedFiles.length > 0
              ? 'border-green-400 bg-green-50 hover:bg-green-100'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              {selectedFiles.length > 0 ? (
                <span className="font-medium text-green-600">
                  {fileName} selected
                </span>
              ) : (
                <>
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </>
              )}
            </p>
            <p className="text-xs text-gray-500">PDF files only</p>
          </div>
        </label>
      </div>

      {/* Progress bar */}
      <ProgressBar 
        state={state}
        progress={progress}
        fileName={fileName}
        message={message}
      />

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={uploadFiles}
          disabled={selectedFiles.length === 0 || state === 'uploading' || state === 'converting'}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {state === 'uploading' ? 'Uploading...' : 
           state === 'converting' ? 'Converting...' : 
           'Start Processing'}
        </button>
        
        {(state === 'error' || state === 'complete') && (
          <button
            onClick={reset}
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Upload Another
          </button>
        )}
      </div>
    </div>
  );
}