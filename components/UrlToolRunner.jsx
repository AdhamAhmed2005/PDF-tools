"use client";

import React, { useState } from "react";
import { LinkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function UrlToolRunner({ tool }) {
  const [url, setUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setMessage("Please enter a valid URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setMessage("Please enter a valid URL");
      return;
    }

    setProcessing(true);
    setMessage("");

    try {
      const response = await fetch(`/api/tools/${tool}/fileprocess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool,
          url: url.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      // Check if response is JSON or binary
      const contentType = response.headers.get("content-type");
      
      if (contentType?.includes("application/json")) {
        // JSON response with success/error info
        const data = await response.json();
        if (data.success) {
          // Check if there's a download URL
          if (data.result?.downloadUrl) {
            // Trigger download from the provided URL
            const link = document.createElement("a");
            link.href = data.result.downloadUrl;
            link.download = data.result.filename || "download";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setMessage("✓ Download started!");
          } else {
            setMessage("✓ Processing completed successfully!");
          }
        } else {
          setMessage(`Error: ${data.message || "Processing failed"}`);
        }
      } else {
        // Binary response - download file
        const blob = await response.blob();
        const contentDisposition = response.headers.get("content-disposition");
        let filename = "download";
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        // Create download link
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        setMessage("✓ Download started!");
      }
    } catch (error) {
      console.error("Processing error:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    setUrl("");
    setMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors">
          <LinkIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          
          <div className="space-y-4">
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700">
              Enter URL
            </label>
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@username/video/1234567890"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={processing}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={processing || !url.trim()}
            className="flex-1 bg-teal-600 text-white py-3 px-6 rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={processing}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`p-4 rounded-md ${
            message.startsWith("✓") 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {message}
          </div>
        )}
      </form>

      {/* Help Text */}
      <div className="mt-8 text-sm text-gray-500 text-center">
        <p>Supported platforms: TikTok</p>
        <p>Downloads videos without watermarks when available</p>
      </div>
    </div>
  );
}