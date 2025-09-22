"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Upload, Image, File, Trash2, Download } from "lucide-react";

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  contentType: string;
  size: number;
  createdAt: string;
}

export default function MediaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
      router.push("/login");
      return;
    }

    fetchMediaFiles();
  }, [session, status, router]);

  const fetchMediaFiles = async () => {
    try {
      setIsLoading(true);
      // For now, we'll use mock data since the upload API is a stub
      const mockFiles: MediaFile[] = [
        {
          id: "1",
          filename: "hero-image.jpg",
          url: "https://via.placeholder.com/800x400",
          contentType: "image/jpeg",
          size: 245760,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          filename: "blog-post-cover.png",
          url: "https://via.placeholder.com/1200x630",
          contentType: "image/png",
          size: 512000,
          createdAt: new Date().toISOString(),
        },
      ];
      
      setMediaFiles(mockFiles);
    } catch (error) {
      console.error("Failed to fetch media files:", error);
      setError("Failed to load media files");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Refresh media files
      fetchMediaFiles();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      // Remove from local state for now
      setMediaFiles(mediaFiles.filter(file => file.id !== id));
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert("Failed to delete file");
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
    });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading media...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-2">
            Manage your images, documents, and other media files
          </p>
        </div>
        
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Media
          </div>
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {mediaFiles.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Image className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">No media files found</p>
          <p className="text-gray-400 mt-2">Upload your first image or document to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaFiles.map((file) => (
            <div key={file.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {file.contentType.startsWith('image/') ? (
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <File className="w-16 h-16 text-gray-400" />
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate" title={file.filename}>
                  {file.filename}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatFileSize(file.size)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(file.createdAt)}
                </p>
                
                <div className="flex items-center gap-2 mt-3">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
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

