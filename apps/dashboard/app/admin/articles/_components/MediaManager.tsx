'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { 
  Upload, 
  X, 
  Search, 
  Grid3x3, 
  List, 
  Trash2, 
  Download,
  Image as ImageIcon,
  Check,
  Loader2,
  ZoomIn,
  Tag,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * Advanced Media Manager Component
 * Comprehensive media management with upload, optimization, and organization
 * 
 * Features:
 * - Drag-and-drop upload with progress tracking
 * - Automatic image optimization (WebP conversion, compression)
 * - Blur data URL generation for lazy loading
 * - Multiple size variants (thumbnail, medium, large)
 * - Media library with search and filtering
 * - Bulk operations (delete, tag)
 * - Grid and list view modes
 */

interface MediaItem {
  id: string
  url: string
  webpUrl?: string
  thumbnailUrl?: string
  blurDataURL?: string
  alt?: string
  width: number
  height: number
  size: number
  format: string
  uploadedAt: string
  uploadedBy: string
  tags: string[]
}

interface MediaManagerProps {
  onSelectImage?: (url: string, metadata: MediaItem) => void
  maxSelection?: number
  className?: string
}

export function MediaManager({ onSelectImage, maxSelection = 1, className }: MediaManagerProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewImage, setPreviewImage] = useState<MediaItem | null>(null)
  const [tagFilter, setTagFilter] = useState<string>('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Load media on mount
  useEffect(() => {
    loadMedia()
  }, [])

  // Filter media based on search and tags
  useEffect(() => {
    let filtered = media

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (tagFilter) {
      filtered = filtered.filter(item => item.tags.includes(tagFilter))
    }

    setFilteredMedia(filtered)
  }, [media, searchTerm, tagFilter])

  /**
   * Load media from API
   */
  const loadMedia = async () => {
    try {
      const response = await fetch('/api/admin/media')
      if (response.ok) {
        const data = await response.json()
        // Transform API data to MediaItem format
        const items: MediaItem[] = data.map((item: any) => ({
          id: item.id,
          url: item.url,
          alt: item.alt,
          width: item.width || 0,
          height: item.height || 0,
          size: 0,
          format: 'image',
          uploadedAt: item.createdAt,
          uploadedBy: 'User',
          tags: []
        }))
        setMedia(items)
      }
    } catch (error) {
      console.error('Failed to load media:', error)
    }
  }

  /**
   * Handle drag and drop events
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      await uploadFiles(files)
    }
  }, [])

  /**
   * Handle file selection via input
   */
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files))
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  /**
   * Upload files with optimization
   */
  const uploadFiles = async (files: File[]) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const totalFiles = files.length
      let completed = 0

      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('generateVariants', 'true')
        formData.append('generateBlur', 'true')

        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          
          // Add to media library
          const newItem: MediaItem = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
            url: data.original.url,
            webpUrl: data.webp?.url,
            thumbnailUrl: data.thumbnail?.url,
            blurDataURL: data.blurDataURL,
            width: data.metadata.width,
            height: data.metadata.height,
            size: data.metadata.size,
            format: data.metadata.format,
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'Current User',
            tags: []
          }

          setMedia(prev => [newItem, ...prev])
        }

        completed++
        setUploadProgress(Math.round((completed / totalFiles) * 100))
      }

      console.log(`[MediaManager] Uploaded ${completed} files successfully`)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload one or more files')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  /**
   * Handle item selection
   */
  const toggleSelection = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (maxSelection === 1) {
          next.clear()
        }
        if (next.size < maxSelection) {
          next.add(id)
        }
      }
      return next
    })
  }

  /**
   * Bulk delete selected items
   */
  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return
    
    if (!confirm(`Delete ${selectedItems.size} selected item(s)?`)) return

    try {
      // TODO: Implement actual delete API
      setMedia(prev => prev.filter(item => !selectedItems.has(item.id)))
      setSelectedItems(new Set())
      console.log(`[MediaManager] Deleted ${selectedItems.size} items`)
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete items')
    }
  }

  /**
   * Select image and return to caller
   */
  const handleSelectForUse = (item: MediaItem) => {
    if (onSelectImage) {
      onSelectImage(item.webpUrl || item.url, item)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Media Library</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {media.length} items • {selectedItems.size} selected
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
          </Button>
          {selectedItems.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete ({selectedItems.size})
            </Button>
          )}
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search media by alt text or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm"
        >
          <option value="">All Tags</option>
          {Array.from(new Set(media.flatMap(m => m.tags))).map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-colors text-center",
          isDragOver 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
            : "border-gray-300 dark:border-gray-700",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="space-y-3">
            <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">
              Uploading and optimizing images...
            </p>
            <div className="w-full max-w-xs mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{uploadProgress}%</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Drag and drop images here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse • Automatic WebP conversion • Blur data URLs generated
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Media Grid/List */}
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          : "space-y-2"
      )}>
        {filteredMedia.map((item) => (
          <Card
            key={item.id}
            className={cn(
              "cursor-pointer hover:shadow-lg transition-shadow relative group",
              selectedItems.has(item.id) && "ring-2 ring-blue-500"
            )}
            onClick={() => handleSelectForUse(item)}
          >
            <CardContent className="p-0">
              {viewMode === 'grid' ? (
                <div className="relative aspect-square">
                  {/* Blur placeholder */}
                  {item.blurDataURL && (
                    <div
                      className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110"
                      style={{ backgroundImage: `url(${item.blurDataURL})` }}
                    />
                  )}
                  
                  {/* Actual image */}
                  <img
                    src={item.thumbnailUrl || item.webpUrl || item.url}
                    alt={item.alt || 'Media item'}
                    className="relative w-full h-full object-cover rounded-t-lg"
                    loading="lazy"
                  />
                  
                  {/* Selection checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSelection(item.id)
                    }}
                    className={cn(
                      "absolute top-2 left-2 w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
                      selectedItems.has(item.id)
                        ? "bg-blue-600 border-blue-600"
                        : "bg-white border-gray-300 opacity-0 group-hover:opacity-100"
                    )}
                  >
                    {selectedItems.has(item.id) && <Check className="w-4 h-4 text-white" />}
                  </button>
                  
                  {/* Quick actions */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between text-white text-xs">
                      <span className="truncate">{item.width}×{item.height}</span>
                      <span>{(item.size / 1024).toFixed(0)}KB</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4">
                  <img
                    src={item.thumbnailUrl || item.webpUrl || item.url}
                    alt={item.alt || 'Media item'}
                    className="w-16 h-16 object-cover rounded"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.alt || 'Untitled'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.width}×{item.height} • {(item.size / 1024).toFixed(0)}KB
                    </p>
                    {item.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSelection(item.id)
                    }}
                  >
                    {selectedItems.has(item.id) ? (
                      <Check className="w-4 h-4 text-blue-600" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMedia.length === 0 && !isUploading && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || tagFilter ? 'No media found matching your filters' : 'No media uploaded yet'}
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Your First Image
          </Button>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={previewImage.url}
              alt={previewImage.alt || 'Preview'}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-white text-center">
              <p className="font-medium">{previewImage.alt || 'Untitled'}</p>
              <p className="text-sm text-gray-300">
                {previewImage.width}×{previewImage.height} • {previewImage.format}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

