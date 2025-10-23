'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Users, 
  Hash, 
  Edit3, 
  X, 
  Plus,
  Search,
  Upload,
  Image as ImageIcon,
  BookOpen,
  Mail,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'
import Image from 'next/image'

interface Author {
  id: string
  name: string
  email: string
  image?: string
  role: 'owner' | 'admin' | 'writer'
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface DraftSettingsData {
  author: Author
  coAuthors: Author[]
  tableOfContents: boolean
  sendToNewsletter: boolean
  articleSlug: string
  tags: Tag[]
  customOGImage?: string
  visibility: 'public' | 'unlisted' | 'private'
  allowComments: boolean
  allowReactions: boolean
}

interface DraftSettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  data: DraftSettingsData
  onChange: (data: DraftSettingsData) => void
  onSave?: () => void
}

export function DraftSettingsPanel({ 
  isOpen, 
  onClose, 
  data, 
  onChange, 
  onSave 
}: DraftSettingsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [availableAuthors, setAvailableAuthors] = useState<Author[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(false)
  const [isLoadingTags, setIsLoadingTags] = useState(false)
  const [showTagSearch, setShowTagSearch] = useState(false)

  // Load available authors
  useEffect(() => {
    const loadAuthors = async () => {
      setIsLoadingAuthors(true)
      try {
        const response = await fetch('/api/admin/authors')
        if (response.ok) {
          const result = await response.json()
          setAvailableAuthors(result.authors || [])
        }
      } catch (error) {
        console.error('Failed to load authors:', error)
      } finally {
        setIsLoadingAuthors(false)
      }
    }

    if (isOpen) {
      loadAuthors()
    }
  }, [isOpen])

  // Load available tags
  useEffect(() => {
    const loadTags = async () => {
      setIsLoadingTags(true)
      try {
        const response = await fetch('/api/admin/tags')
        if (response.ok) {
          const result = await response.json()
          setAvailableTags(result.tags || [])
        }
      } catch (error) {
        console.error('Failed to load tags:', error)
      } finally {
        setIsLoadingTags(false)
      }
    }

    if (isOpen && showTagSearch) {
      loadTags()
    }
  }, [isOpen, showTagSearch])

  // Handle author change
  const handleAuthorChange = (authorId: string) => {
    const author = availableAuthors.find(a => a.id === authorId)
    if (author) {
      onChange({ ...data, author })
    }
  }

  // Handle co-author addition
  const handleAddCoAuthor = (authorId: string) => {
    const author = availableAuthors.find(a => a.id === authorId)
    if (author && !data.coAuthors.find(ca => ca.id === authorId)) {
      onChange({ ...data, coAuthors: [...data.coAuthors, author] })
    }
  }

  // Handle co-author removal
  const handleRemoveCoAuthor = (authorId: string) => {
    onChange({ 
      ...data, 
      coAuthors: data.coAuthors.filter(ca => ca.id !== authorId) 
    })
  }

  // Handle tag addition
  const handleAddTag = (tagId: string) => {
    const tag = availableTags.find(t => t.id === tagId)
    if (tag && !data.tags.find(t => t.id === tagId)) {
      onChange({ ...data, tags: [...data.tags, tag] })
    }
  }

  // Handle tag removal
  const handleRemoveTag = (tagId: string) => {
    onChange({ 
      ...data, 
      tags: data.tags.filter(t => t.id !== tagId) 
    })
  }

  // Handle custom OG image upload
  const handleOGImageUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        onChange({ ...data, customOGImage: result.url })
      }
    } catch (error) {
      console.error('Failed to upload OG image:', error)
    }
  }

  // Filter authors and tags based on search
  const filteredAuthors = availableAuthors.filter(author =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            Draft settings
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

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto space-y-6">

          {/* Author Section */}
          <div>
            <Label className="block text-sm font-medium text-gray-200 mb-2">
              Author
            </Label>
            <div className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg">
              {data.author.image ? (
                <Image
                  src={data.author.image}
                  alt={data.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">
                    {data.author.name}
                  </span>
                  <Badge variant="secondary" className="text-xs text-white bg-gray-700 border-gray-600">
                    {data.author.role === 'owner' ? 'Owner' : 'Admin'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">
                  {data.author.email}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Open author selection modal
                  console.log('Change author clicked')
                }}
                className="border-gray-600 hover:bg-gray-800 hover:text-white text-white bg-transparent"
              >
                Change Author
              </Button>
            </div>
          </div>

          {/* Co-authors Section */}
          <div>
            <Label className="block text-sm font-medium text-gray-200 mb-2">
              Co-authors
            </Label>
            <div className="space-y-2">
              {data.coAuthors.map((coAuthor) => (
                <div key={coAuthor.id} className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg">
                  {coAuthor.image ? (
                    <Image
                      src={coAuthor.image}
                      alt={coAuthor.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <span className="font-medium text-white">
                      {coAuthor.name}
                    </span>
                    <p className="text-sm text-gray-400">
                      {coAuthor.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCoAuthor(coAuthor.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Open co-author selection
                  console.log('Add co-author clicked')
                }}
                className="w-full border-gray-600 hover:bg-gray-800 hover:text-white text-white bg-transparent"
              >
                <Users className="w-4 h-4 mr-2 text-white" />
                Add co-authors
              </Button>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-gray-200">
                Table of contents
              </Label>
              <p className="text-sm text-gray-400">
                Generate table of contents for your article
              </p>
            </div>
            <Switch
              checked={data.tableOfContents}
              onCheckedChange={(checked) => onChange({ ...data, tableOfContents: checked })}
            />
          </div>

          {/* Newsletter */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-gray-200">
                Send as newsletter
              </Label>
              <p className="text-sm text-gray-400">
                Send article to newsletter subscribers
              </p>
            </div>
            <Switch
              checked={data.sendToNewsletter}
              onCheckedChange={(checked) => onChange({ ...data, sendToNewsletter: checked })}
            />
          </div>

          {/* Article Slug */}
          <div>
            <Label className="block text-sm font-medium text-gray-200 mb-2">
              Article slug
            </Label>
            <div className="flex items-center gap-2">
              <Input
                value={data.articleSlug}
                onChange={(e) => onChange({ ...data, articleSlug: e.target.value })}
                placeholder="/"
                className="flex-1 bg-gray-800 border-gray-600 text-white"
              />
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200 hover:bg-gray-800">
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="block text-sm font-medium text-gray-200 mb-2">
              Select tags
            </Label>
            <div className="space-y-2">
              {/* Selected Tags */}
              {data.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="flex items-center gap-1 text-white bg-gray-700 border-gray-600">
                      <Hash className="w-3 h-3 text-white" />
                      <span className="text-white">{tag.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTag(tag.id)}
                        className="h-4 w-4 p-0 hover:bg-red-900 text-white hover:text-white"
                      >
                        <X className="w-3 h-3 text-white" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Tag Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Start typing to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowTagSearch(true)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
                
                {/* Tag Suggestions */}
                {showTagSearch && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {isLoadingTags ? (
                      <div className="p-3 text-center text-gray-400">
                        Loading tags...
                      </div>
                    ) : filteredTags.length > 0 ? (
                      filteredTags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => {
                            handleAddTag(tag.id)
                            setSearchQuery('')
                          }}
                          className="w-full px-3 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Hash className="w-4 h-4 text-gray-400" />
                          {tag.name}
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-400">
                        No tags found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Custom OG Image */}
          <div>
            <Label className="block text-sm font-medium text-gray-200 mb-2">
              Custom OG Image
            </Label>
            <p className="text-sm text-gray-400 mb-3">
              Upload an image to show when your article appears online or on social media. If there's no image, the cover image will be used instead.
            </p>
            
            {data.customOGImage ? (
              <div className="space-y-2">
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-700">
                  <Image
                    src={data.customOGImage}
                    alt="Custom OG image"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    value={data.customOGImage}
                    onChange={(e) => onChange({ ...data, customOGImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChange({ ...data, customOGImage: undefined })}
                    className="border-gray-600 hover:bg-gray-800 hover:text-white text-white bg-transparent"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 mb-2">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-400">
                    Recommended dimension: 1200 x 630 px
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleOGImageUpload(file)
                  }}
                  className="hidden"
                  id="og-image-upload"
                />
                <label htmlFor="og-image-upload">
                  <Button variant="outline" size="sm" className="w-full border-gray-600 hover:bg-gray-800 hover:text-white text-white bg-transparent" type="button">
                    <Upload className="w-4 h-4 mr-2 text-white" />
                    Upload Image
                  </Button>
                </label>
              </div>
            )}
          </div>

          {/* Add to Series */}
          <div>
            <Label className="block text-sm font-medium text-gray-200 mb-2">
              Add to a series
            </Label>
            <Select>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select a series" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="none" className="text-white hover:bg-gray-700">No series</SelectItem>
                {/* Series options would be loaded from API */}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <Button variant="outline" onClick={onClose} className="border-gray-600 hover:bg-gray-800 hover:text-white text-white bg-transparent">
            Cancel
          </Button>
          <Button onClick={onSave || onClose} className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
