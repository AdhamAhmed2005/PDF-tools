"use client";

import React, { useState, useRef, useEffect } from "react";
// Uploads are handled by the server API at /api/tools/[tool]

export default function ToolRunner({ tool }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  // Convert FileList to array and reset message
  const handleFiles = (fileList) => {
    const arr = Array.from(fileList || []);
    setFiles(arr);
    setMessage("");
    // auto-preview first selected file
    if (arr.length) setPreviewFromFile(arr[0]);
  };

  const onChange = (e) => handleFiles(e.target.files);

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => e.preventDefault();

  const clear = () => {
    setFiles([]);
    if (inputRef.current) inputRef.current.value = null;
    setMessage("");
    clearPreview();
  };

  // Preview state
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewName, setPreviewName] = useState(null);
  const [previewType, setPreviewType] = useState(null);

  const clearPreview = () => {
    if (previewUrl) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch (e) {}
    }
    setPreviewUrl(null);
    setPreviewName(null);
    setPreviewType(null);
  };

  const setPreviewFromFile = (file) => {
    if (!file) return clearPreview();
    clearPreview();
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewName(file.name);
    setPreviewType(file.type || getFileExtension(file.name));
  };

  const getFileExtension = (name) => {
    const m = name.match(/\.([^.]+)$/);
    return m ? m[1].toLowerCase() : '';
  };

  // cleanup preview URL on unmount
  useEffect(() => {
    return () => clearPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upload = async () => {
    if (!files.length) {
      setMessage("Please select at least one file to upload.");
      return;
    }

    setUploading(true);
    setMessage("Uploading...");

    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('files', f, f.name));

      // POST to the new fileprocess endpoint and include tool in the form data
      fd.append('tool', tool);

      const res = await fetch(`/api/tools/${encodeURIComponent(tool)}/fileprocess`, {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Upload failed: ${res.status}`);
      }

      const body = await res.json();
      setMessage(body.message || `Uploaded ${body.files?.length || files.length} file(s) to ${tool}.`);
      if (body.success) {
        setFiles([]);
        if (inputRef.current) inputRef.current.value = null;
      }
    } catch (err) {
      console.error(err);
      setMessage(err?.message || 'Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tool Info */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tool</h2>
        <p className="mt-1 text-sm text-gray-600">
          You are using: <span className="font-medium text-teal-600">{tool}</span>
        </p>
      </div>

      {/* Drag & Drop */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-white hover:border-teal-300"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={onChange}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">

          <div className="mx-auto max-w-[380px]">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              ></path>
            </svg>
            <p className="mt-3 text-sm text-gray-600">
              Drag & drop files here, or{" "}
              <span className="text-teal-600 underline">click to select</span>
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Files will be sent to the <span className="font-medium">{tool}</span> tool for processing.
            </p>
          </div>
        </label>
      </div>

      {/* File List */}
      <div className="mt-4">
        {files.length ? (
          <div className="bg-gray-50 border border-gray-100 rounded-md p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Selected files ({files.length})</p>
              <button onClick={clear} className="text-sm text-gray-500 hover:text-gray-700">
                Clear
              </button>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {files.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between cursor-pointer hover:bg-white/50 p-2 rounded"
                  onClick={() => setPreviewFromFile(f)}
                  title="Click to preview"
                >
                  <span className="truncate">{f.name}</span>
                  <span className="text-xs text-gray-400">{(f.size / 1024).toFixed(1)} KB</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <button
                onClick={upload}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded bg-teal-600 px-3 py-2 text-sm text-white hover:bg-teal-700 disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload files"}
              </button>
              <button
                onClick={clear}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded border px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2 text-sm text-gray-500">No files selected.</div>
        )}
      </div>

      {/* Preview Pane */}
      {previewUrl && (
        <div className="mt-6 border rounded-md p-4 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Preview: {previewName}</p>
              <p className="text-xs text-gray-500">{previewType}</p>
            </div>
            <div>
              <button onClick={clearPreview} className="text-sm text-gray-500 hover:text-gray-700">Close preview</button>
            </div>
          </div>

          <div className="mt-4">
            {previewType && previewType.startsWith('image') ? (
              <img src={previewUrl} alt={previewName} className="mx-auto max-h-[480px] w-auto object-contain" />
            ) : previewType === 'application/pdf' || previewName?.toLowerCase().endsWith('.pdf') ? (
              <iframe src={previewUrl} className="w-full h-[600px] border" title={previewName}></iframe>
            ) : (
              <div className="text-sm text-gray-600">No preview available for this file type.</div>
            )}
          </div>
        </div>
      )}

      {/* Feedback Message */}
      {message && <div className="mt-4 text-sm text-gray-700">{message}</div>}
    </div>
  );
}
