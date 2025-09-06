"use client";

import { useState, useCallback } from "react";
import NextImage from "next/image";
import { Upload, Image, File, Video, Music, Archive, X, Eye, Download, Trash2, Search, Filter, FolderOpen } from "lucide-react";

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'archive';
  size: number;
  url: string;
  thumbnail?: string;
  uploadedAt: string;
  uploadedBy: string;
  tags: string[];
  description?: string;
}

const mockMediaFiles: MediaFile[] = [
  {
    id: "1",
    name: "hero-image.jpg",
    type: "image",
    size: 2048576,
    url: "/media/hero-image.jpg",
    thumbnail: "/media/thumbnails/hero-image.jpg",
    uploadedAt: "2024-01-20",
    uploadedBy: "Sarah Johnson",
    tags: ["hero", "landing", "main"],
    description: "Main hero image for homepage"
  },
  {
    id: "2",
    name: "product-demo.mp4",
    type: "video",
    size: 15728640,
    url: "/media/product-demo.mp4",
    thumbnail: "/media/thumbnails/product-demo.jpg",
    uploadedAt: "2024-01-19",
    uploadedBy: "Mike Chen",
    tags: ["demo", "product", "video"],
    description: "Product demonstration video"
  },
  {
    id: "3",
    name: "whitepaper.pdf",
    type: "document",
    size: 5242880,
    url: "/media/whitepaper.pdf",
    uploadedAt: "2024-01-18",
    uploadedBy: "Emma Davis",
    tags: ["whitepaper", "document", "pdf"],
    description: "Company whitepaper document"
  }
];

export default function MediaUploadPage() {
  const [files, setFiles] = useState<MediaFile[]>(mockMediaFiles);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-8 h-8 text-blue-500" />;
      case 'video': return <Video className="w-8 h-8 text-purple-500" />;
      case 'audio': return <Music className="w-8 h-8 text-green-500" />;
      case 'document': return <File className="w-8 h-8 text-orange-500" />;
      case 'archive': return <Archive className="w-8 h-8 text-red-500" />;
      default: return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'video': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'audio': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'document': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'archive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    // Simulate file upload
    const newFiles: MediaFile[] = uploadedFiles.map((file, index) => ({
      id: Date.now().toString() + index,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 
            file.type.startsWith('audio/') ? 'audio' : 
            file.type.includes('pdf') || file.type.includes('document') ? 'document' : 'archive',
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: "Current User",
      tags: [],
      description: ""
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setUploadedFiles([]);
    setShowUploadModal(false);
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || file.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDeleteFile = (id: string) => {
    if (confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
      setFiles(files.filter(file => file.id !== id));
    }
  };

  const handleUpdateFile = (id: string, fileData: Partial<MediaFile>) => {
    setFiles(files.map(file => 
      file.id === id ? { ...file, ...fileData } : file
    ));
    setEditingFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Media Upload</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Upload and manage your media files
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </button>
      </div>

      {/* Upload Area */}
      <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
        <div
          className={`text-center transition-all duration-200 ${
            isDragOver ? 'scale-105' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-lg font-medium text-slate-900 dark:text-slate-100">
                Drop files here or click to upload
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                multiple
                className="sr-only"
                onChange={handleFileSelect}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
              />
            </label>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Supports images, videos, audio, documents, and archives up to 100MB
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Image className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Files</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{files.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">I</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Images</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {files.filter(f => f.type === 'image').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">V</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Videos</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {files.filter(f => f.type === 'video').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Size</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
            <option value="archive">Archives</option>
          </select>
          <button className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFiles.map((file) => (
          <div key={file.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-slate-100 dark:bg-slate-700 flex items-center justify-center relative group">
              {file.thumbnail ? (
                <NextImage
                  src={file.thumbnail}
                  alt={file.name}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                getFileIcon(file.type)
              )}
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingFile(file)}
                    className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    <File className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-2 bg-white dark:bg-slate-800 rounded-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {file.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getFileTypeColor(file.type)}`}>
                  {file.type}
                </span>
              </div>
              
              {file.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                  {file.description}
                </p>
              )}
              
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{file.uploadedAt}</span>
                <span>{file.uploadedBy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Upload Files</h3>
            
            {uploadedFiles.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type.startsWith('image/') ? 'image' : 
                                   file.type.startsWith('video/') ? 'video' : 
                                   file.type.startsWith('audio/') ? 'audio' : 
                                   file.type.includes('pdf') || file.type.includes('document') ? 'document' : 'archive')}
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{file.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeUploadedFile(index)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-slate-100 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                  >
                    Upload {uploadedFiles.length} File{uploadedFiles.length !== 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Upload className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
                <p className="text-slate-600 dark:text-slate-400">No files selected for upload</p>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="mt-4 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit File Modal */}
      {editingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Edit File Details</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const fileData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(t => t)
              };
              
              handleUpdateFile(editingFile.id, fileData);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    File Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingFile.name}
                    required
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingFile.description || ''}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={editingFile.tags.join(', ')}
                    placeholder="hero, landing, main"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingFile(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-slate-100 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

