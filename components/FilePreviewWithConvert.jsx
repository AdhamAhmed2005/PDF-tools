"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from './ProgressBar';

// Component to preview uploaded file and handle conversion
export default function FilePreviewWithConvert({ filename, base64Data, tool, contentType, sessionId }) {
  const [convertState, setConvertState] = useState('idle'); // 'idle' | 'converting' | 'complete' | 'error'
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load data from sessionStorage if sessionId is provided
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      if (sessionId && typeof window !== 'undefined') {
        try {
          const storedData = sessionStorage.getItem(sessionId);
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setFileData(parsedData);
          } else {
            setErrorMessage('Upload session not found. Please upload again.');
          }
        } catch (error) {
          console.error('Error loading session data:', error);
          setErrorMessage('Error loading upload data. Please upload again.');
        }
      } else if (filename && base64Data && tool) {
        // Direct props approach (fallback)
        setFileData({
          filename: filename,
          data: base64Data,
          tool: tool,
          contentType: contentType || 'application/pdf'
        });
      } else {
        setErrorMessage('No upload data found. Please upload again.');
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [sessionId, filename, base64Data, tool, contentType]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Loading upload data...</p>
        </div>
      </div>
    );
  }

  if (!fileData || errorMessage) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">
            {errorMessage || 'Upload data not found.'}
          </p>
          <button
            onClick={() => router.push('/tools')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Tools
          </button>
        </div>
      </div>
    );
  }

  const handleConvert = async () => {
    try {
      setConvertState('converting');
      setProgress(0);
      setErrorMessage('');

      // Convert base64 back to file for processing
      const binaryString = atob(fileData.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: fileData.contentType });
      const file = new File([blob], fileData.filename, { type: fileData.contentType });

      const formData = new FormData();
      formData.append('files', file);
      formData.append('tool', fileData.tool);

      // Make conversion request
      const response = await fetch(`/api/tools/${fileData.tool}/fileprocess`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success && result.result?.downloadUrl) {
        setConvertState('complete');
        setProgress(100);
        
        // Redirect to success page after brief delay
        setTimeout(() => {
          const params = new URLSearchParams({
            status: 'success',
            filename: fileData.filename,
            url: result.result.downloadUrl
          });
          router.push(`/result?${params.toString()}`);
        }, 1000);
      } else {
        throw new Error(result.message || 'Conversion failed');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setConvertState('error');
      setErrorMessage(error.message || 'Conversion failed. Please try again.');
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Preview & Convert
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Review your file and start conversion
          </p>
        </div>
        <button
          onClick={goBack}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to upload
        </button>
      </div>

      {/* File preview section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: File info */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">File Details</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Name:</dt>
                <dd className="text-sm font-medium text-gray-900">{fileData.filename}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Type:</dt>
                <dd className="text-sm font-medium text-gray-900">{fileData.contentType}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Tool:</dt>
                <dd className="text-sm font-medium text-gray-900 capitalize">{fileData.tool.replace('-', ' ')}</dd>
              </div>
            </dl>
          </div>

          {/* Conversion controls */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ready to Convert</h3>
            
            {convertState !== 'idle' && (
              <div className="mb-6">
                <ProgressBar 
                  state={convertState}
                  progress={progress}
                  fileName={fileData.filename}
                  message={errorMessage}
                />
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={handleConvert}
                disabled={convertState === 'converting'}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {convertState === 'converting' ? 'Converting...' : `Convert with ${fileData.tool.replace('-', ' ')}`}
              </button>
              
              {convertState === 'error' && (
                <button
                  onClick={() => setConvertState('idle')}
                  className="px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: File preview */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
          
          {fileData.contentType === 'application/pdf' ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-600">PDF Preview</p>
              <p className="text-sm text-gray-500 mt-2">{fileData.filename}</p>
              
              {/* Option to view PDF in new tab */}
              <button
                onClick={() => {
                  const dataUrl = `data:${fileData.contentType};base64,${fileData.data}`;
                  window.open(dataUrl, '_blank');
                }}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Open in new tab
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">📎</div>
              <p className="text-gray-600">File Ready</p>
              <p className="text-sm text-gray-500 mt-2">{fileData.filename}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}