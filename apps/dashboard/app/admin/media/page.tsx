"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Upload, 
  Search, 
  Grid3X3, 
  List, 
  Trash2, 
  Copy, 
  Eye,
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  Archive,
  Loader2
} from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  blurData: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminMedia() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch media from API
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
      router.push("/login");
      return;
    }

    fetchMedia();
  }, [session, status, router, searchTerm]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/admin/media?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }
      
      const data = await response.json();
      setMedia(data.mediaItems || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload files one by one
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('generateVariants', 'true');
        formData.append('generateBlur', 'true');

        setUploadProgress(Math.floor(((i + 0.5) / files.length) * 100));

        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        setUploadProgress(Math.floor(((i + 1) / files.length) * 100));
      }

      toast.success(`Successfully uploaded ${files.length} file(s)`);
      fetchMedia(); // Reload media list
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload some files');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      try {
        const response = await fetch(`/api/admin/media/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete media');
        }
        
        toast.success('Media deleted successfully');
        fetchMedia();
      } catch (error) {
        console.error('Error deleting media:', error);
        toast.error('Failed to delete media');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedItems.length} files?`)) {
      try {
        await Promise.all(
          selectedItems.map(id =>
            fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
          )
        );
        toast.success('Media files deleted successfully');
        setSelectedItems([]);
        fetchMedia();
      } catch (error) {
        console.error('Error deleting media:', error);
        toast.error('Failed to delete some files');
      }
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'Unknown';
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
    router.push("/login");
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Media Library</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Manage your images, documents, and media files
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Files</span>
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            Drop files here or click to upload
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Support for images, documents, videos, and audio files
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
          >
            Choose Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          />
        </div>
        
        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Uploading...</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-slate-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search media files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="document">Documents</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="archive">Archives</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {selectedItems.length} file(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Media Grid/List */}
      {media.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No media files found</p>
          <p className="text-slate-400 mt-2">Upload your first file to get started</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {media.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors hover:shadow-md">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, item.id]);
                      } else {
                        setSelectedItems(selectedItems.filter(id => id !== item.id));
                      }
                    }}
                    className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                  />
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => copyToClipboard(item.url)}
                      className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-center mb-3">
                  <img 
                    src={item.url} 
                    alt={item.alt || 'Media item'}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    loading="lazy"
                  />
                  
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {item.alt || getFileName(item.url)}
                  </h3>
                </div>
                
                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-500">
                  {item.width && item.height && (
                    <div className="flex justify-between">
                      <span>Dimensions:</span>
                      <span>{item.width}×{item.height}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span>{formatDate(item.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === media.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(media.map(item => item.id));
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                      className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {media.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.id));
                          }
                        }}
                        className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.url} 
                          alt={item.alt || 'Media item'}
                          className="w-10 h-10 object-cover rounded"
                          loading="lazy"
                        />
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {item.alt || getFileName(item.url)}
                          </div>
                          {item.width && item.height && (
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {item.width}×{item.height}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize text-sm text-slate-900 dark:text-slate-100">
                        Image
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(item.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => window.open(item.url, '_blank')}
                          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(item.url)}
                          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                          title="Copy URL"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
