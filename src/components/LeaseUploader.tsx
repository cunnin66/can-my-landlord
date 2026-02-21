"use client";

import { useState, useRef, useCallback } from "react";
import type { UploadResponse } from "@/types";

interface Props {
  onUploaded: (documentId: string, filename: string) => void;
  onRemoved: () => void;
  uploadedFilename: string | null;
}

export default function LeaseUploader({
  onUploaded,
  onRemoved,
  uploadedFilename,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File too large. Maximum size is 10MB.");
        return;
      }

      setError(null);
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Upload failed");
        }

        const data: UploadResponse = await response.json();
        setPageCount(data.pageCount);
        onUploaded(data.documentId, data.filename);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [onUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPageCount(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onRemoved();
  };

  if (uploadedFilename) {
    return (
      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
        <span className="text-green-600 text-lg">✓</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-green-800 truncate">
            {uploadedFilename}
          </p>
          {pageCount && (
            <p className="text-green-600 text-xs">{pageCount} pages</p>
          )}
        </div>
        <button
          onClick={handleRemove}
          className="text-green-600 hover:text-red-600 text-xs font-medium transition-colors"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-indigo-400 bg-indigo-50"
            : "border-gray-300 hover:border-indigo-300 hover:bg-gray-50"
        } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleInputChange}
          className="hidden"
        />
        {isUploading ? (
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Uploading and analyzing...</span>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm">
              <span className="font-medium text-indigo-600">
                Drop your lease PDF here
              </span>{" "}
              or click to browse
            </p>
            <p className="text-gray-400 text-xs mt-1">PDF files up to 10MB</p>
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
