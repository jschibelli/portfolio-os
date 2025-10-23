'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Cloud,
  Search,
  ExternalLink,
  Download
} from 'lucide-react'
import Image from 'next/image'

interface CoverImageModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (imageUrl: string) => void
  currentImage?: string
}

interface UnsplashImage {
  id: string
  urls: {
    regular: string
    full: string
  }
  alt_description: string
  user: {
    name: string
    username: string
  }
  links: {
    download: string
  }
}

export function CoverImageModal({ isOpen, onClose, onSelect, currentImage }: CoverImageModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'unsplash'>('upload')
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [unsplashQuery, setUnsplashQuery] = useState('')
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([])
  const [isLoadingUnsplash, setIsLoadingUnsplash] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // Max 10MB
      alert('Image must be less than 10MB')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        // Use WebP URL if available, otherwise original URL
        const imageUrl = result.webp?.url || result.original?.url || result.url
        onSelect(imageUrl)
        onClose()
      } else {
        console.error('Upload failed:', response.status, response.statusText)
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  // Search Unsplash images
  const searchUnsplash = async (query: string) => {
    if (!query.trim()) return

    setIsLoadingUnsplash(true)
    try {
      // Note: In production, you'd need to use Unsplash API with proper authentication
      // For now, we'll simulate with placeholder images
      const mockImages: UnsplashImage[] = [
        {
          id: '1',
          urls: {
            regular: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600'
          },
          alt_description: 'Mountain landscape',
          user: { name: 'John Doe', username: 'johndoe' },
          links: { download: 'https://unsplash.com/photos/abc123/download' }
        },
        {
          id: '2',
          urls: {
            regular: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
            full: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600'
          },
          alt_description: 'Forest path',
          user: { name: 'Jane Smith', username: 'janesmith' },
          links: { download: 'https://unsplash.com/photos/def456/download' }
        },
        {
          id: '3',
          urls: {
            regular: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600'
          },
          alt_description: 'Ocean waves',
          user: { name: 'Bob Wilson', username: 'bobwilson' },
          links: { download: 'https://unsplash.com/photos/ghi789/download' }
        }
      ]
      
      setUnsplashImages(mockImages)
    } catch (error) {
      console.error('Failed to search Unsplash:', error)
    } finally {
      setIsLoadingUnsplash(false)
    }
  }

  // Handle Unsplash image selection
  const handleUnsplashSelect = (image: UnsplashImage) => {
    onSelect(image.urls.full)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            Add Cover
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'upload'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Upload
          </button>
          <button
            onClick={() => setActiveTab('unsplash')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'unsplash'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Unsplash
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {/* Current Image Preview */}
              {currentImage && (
                <div className="mb-4">
                  <Label className="block text-sm font-medium text-gray-200 mb-2">
                    Current Cover
                  </Label>
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <Image
                      src={currentImage}
                      alt="Current cover"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {isDragging ? 'Drop your image here' : 'Upload Image'}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Recommended dimension is 1600 × 840
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="mb-2 text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>

              {/* URL Input Alternative */}
              <div className="space-y-2">
                <Label className="block text-sm font-medium text-gray-200">
                  Or paste image URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const url = e.currentTarget.value
                        if (url) {
                          onSelect(url)
                          onClose()
                        }
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="example.com"]') as HTMLInputElement
                      if (input?.value) {
                        onSelect(input.value)
                        onClose()
                      }
                    }}
                    className="text-white border-gray-600 hover:bg-gray-800 hover:text-white"
                  >
                    Use URL
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'unsplash' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search for images..."
                    value={unsplashQuery}
                    onChange={(e) => setUnsplashQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        searchUnsplash(unsplashQuery)
                      }
                    }}
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <Button
                  onClick={() => searchUnsplash(unsplashQuery)}
                  disabled={!unsplashQuery.trim() || isLoadingUnsplash}
                  className="text-white bg-blue-600 hover:bg-blue-700"
                >
                  {isLoadingUnsplash ? 'Searching...' : 'Search'}
                </Button>
              </div>

              {/* Images Grid */}
              {unsplashImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {unsplashImages.map((image) => (
                    <div
                      key={image.id}
                      className="group cursor-pointer rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
                      onClick={() => handleUnsplashSelect(image)}
                    >
                      <div className="relative aspect-video">
                        <Image
                          src={image.urls.regular}
                          alt={image.alt_description}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                          <Button
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Use Image
                          </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-gray-400 truncate">
                          by {image.user.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {unsplashImages.length === 0 && !isLoadingUnsplash && (
                <div className="text-center py-8">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Search for images to get started
                  </p>
                </div>
              )}

              {isLoadingUnsplash && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-400 mt-2">
                    Searching images...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="text-white border-gray-600 hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
