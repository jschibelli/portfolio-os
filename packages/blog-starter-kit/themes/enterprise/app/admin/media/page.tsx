"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface MediaFile {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export default function AdminMedia() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      // Add new file to media library
      const newFile: MediaFile = {
        id: Date.now().toString(),
        url: result.url,
        filename: result.filename,
        size: result.size,
        type: result.type,
        uploadedAt: new Date().toISOString(),
      };

      setMediaFiles(prev => [newFile, ...prev]);
      setUploadProgress(100);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Media Library</h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2">
            Upload and manage your media files
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-stone-600 text-white px-4 py-2 rounded-md hover:bg-stone-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

             {/* Upload Progress */}
       {isUploading && (
         <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-4 transition-colors">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Uploading...</span>
             <span className="text-sm text-stone-500 dark:text-stone-400">{uploadProgress}%</span>
           </div>
           <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
             <div
               className="bg-stone-600 dark:bg-stone-400 h-2 rounded-full transition-all duration-300"
               style={{ width: `${uploadProgress}%` }}
             ></div>
           </div>
         </div>
       )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Media Grid */}
      {mediaFiles.length === 0 ? (
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6 transition-colors">
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-stone-400 dark:text-stone-500" />
            <h3 className="mt-2 text-sm font-medium text-stone-900 dark:text-stone-100">No media files</h3>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              Get started by uploading your first image.
            </p>
            <div className="mt-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-stone-300 dark:border-stone-600 shadow-sm text-sm font-medium rounded-md text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-700 hover:bg-stone-50 dark:hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Media
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaFiles.map((file) => (
            <div key={file.id} className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden transition-colors">
              <div className="aspect-square bg-stone-100 dark:bg-stone-700 flex items-center justify-center">
                <img
                  src={file.url}
                  alt={file.filename}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate" title={file.filename}>
                  {file.filename.split('/').pop()}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span>{formatFileSize(file.size)}</span>
                  <span>{formatDate(file.uploadedAt)}</span>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(file.url);
                      // You could add a toast notification here
                    }}
                    className="flex-1 px-2 py-1 text-xs bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded hover:bg-stone-50 dark:hover:bg-stone-600 transition-colors"
                  >
                    Copy URL
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this file?')) {
                        setMediaFiles(prev => prev.filter(f => f.id !== file.id));
                      }
                    }}
                    className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
