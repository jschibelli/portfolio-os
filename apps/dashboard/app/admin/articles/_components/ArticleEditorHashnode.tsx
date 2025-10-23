'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Save, 
  Eye, 
  EyeOff, 
  Settings, 
  Image as ImageIcon, 
  Type,
  Plus,
  X,
  Clock,
  Users,
  Hash,
  Search,
  Globe,
  Calendar,
  MessageSquare,
  MessageSquareOff,
  Link,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { BlockEditor } from './BlockEditor'
import { SlashCommandMenu } from './SlashCommandMenu'
import { SEOPanel, SEOData } from './SEOPanel'
import { PublishingPanel } from './PublishingPanel'
import { CoverImageModal } from './CoverImageModal'
import { DraftSettingsPanel } from './DraftSettingsPanel'

interface ArticleEditorProps {
  initialData?: {
    id?: string
    title?: string
    slug?: string
    content?: string
    contentMdx?: string
    contentJson?: any
    tags?: string[]
    coverUrl?: string
    subtitle?: string
    status?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'
    visibility?: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' | 'MEMBERS_ONLY'
    featured?: boolean
    allowComments?: boolean
    allowReactions?: boolean
    publishedAt?: string
    seoData?: SEOData
  }
  onSave?: (data: any) => void
  onPublish?: (data: any) => void
}

export function ArticleEditorHashnode({ initialData, onSave, onPublish }: ArticleEditorProps) {
  // Core content state
  const [title, setTitle] = useState(initialData?.title || '')
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '')
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || '')
  const [blocks, setBlocks] = useState<Array<{
    id: string
    type: string
    content: string
    placeholder?: string
  }>>([])

  // Metadata state
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [newTag, setNewTag] = useState('')

  // UI state
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showCoverModal, setShowCoverModal] = useState(false)
  const [showDraftSettings, setShowDraftSettings] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  // Slash command state
  const [slashCommandOpen, setSlashCommandOpen] = useState(false)
  const [slashCommandPosition, setSlashCommandPosition] = useState({ x: 0, y: 0 })

  // SEO and Publishing state
  const [seoData, setSeoData] = useState<SEOData>(initialData?.seoData || {
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    isRepublishing: false,
    originalUrl: '',
    scheduledPublishDate: '',
    backdatePublishDate: '',
    disableComments: false
  })

  const [publishingData, setPublishingData] = useState({
    status: initialData?.status || 'DRAFT',
    visibility: initialData?.visibility || 'PUBLIC',
    featured: initialData?.featured || false,
    allowComments: initialData?.allowComments ?? true,
    allowReactions: initialData?.allowReactions ?? true,
    readingMinutes: 0,
    series: '',
    seriesOrder: 0
  })

  const coverInputRef = useRef<HTMLInputElement>(null)

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setSlug(generatedSlug)
    }
  }, [title, slug])

  const saveDraft = useCallback(async () => {
    if (!title.trim()) return

    setIsSaving(true)
    try {
      const contentJson = { blocks }
      const contentMdx = blocks.map(block => {
        switch (block.type) {
          case 'heading1': return `# ${block.content}`
          case 'heading2': return `## ${block.content}`
          case 'heading3': return `### ${block.content}`
          case 'quote': return `> ${block.content}`
          case 'code': return `\`\`\`\n${block.content}\n\`\`\``
          case 'image': return `![Image](${block.content})`
          case 'callout': return `> 💡 ${block.content}`
          default: return block.content
        }
      }).join('\n\n')

      const payload = {
        id: initialData?.id,
        title: title.trim(),
        slug: slug.trim(),
        subtitle: subtitle.trim(),
        content: contentMdx,
        contentMdx,
        contentJson,
        tags,
        coverUrl: coverUrl.trim() || undefined,
        status: 'DRAFT',
        visibility: 'PUBLIC',
        seoData,
        publishingData
      }

      const response = await fetch('/api/articles/save-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setLastSaved(new Date())
      }
    } catch (error) {
      console.error('Error saving draft:', error)
    } finally {
      setIsSaving(false)
    }
  }, [title, blocks, subtitle, coverUrl, tags, slug, seoData, publishingData, initialData?.id, isSaving])

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title.trim() && !isSaving) {
        saveDraft()
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [saveDraft, title, isSaving])

  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    setIsUploadingCover(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        const imageUrl = result.webp?.url || result.original?.url || result.url
        setCoverUrl(imageUrl)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Failed to upload cover image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploadingCover(false)
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-white">
              {initialData?.id ? 'Edit Article' : 'New Article'}
            </h1>
            {lastSaved && (
              <div className="flex items-center gap-1 text-sm text-gray-300">
                <Clock className="w-3 h-3" />
                Saved {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCoverModal(true)}
              disabled={isUploadingCover}
              className="text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              {isUploadingCover ? 'Uploading...' : 'Add Cover'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDraftSettings(true)}
              className="text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
              className="text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white"
            >
              {isPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isPreview ? 'Edit' : 'Preview'}
            </Button>

            <Button
              onClick={saveDraft}
              disabled={isSaving || !title.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>

            <Button
              onClick={() => {
                // Publish logic here
                console.log('Publish clicked')
              }}
              disabled={!title.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Title */}
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write a great title..."
              className="text-3xl font-bold border-none shadow-none p-0 focus-visible:ring-0 bg-transparent text-white placeholder-gray-400"
            />
          </div>

          {/* Subtitle */}
          <div>
            <input
              type="text"
              placeholder="Add a subtitle..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full text-xl bg-transparent border-none outline-none text-gray-300 placeholder-gray-500"
            />
          </div>

          {/* Hidden file input for cover upload */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverImageUpload}
            className="hidden"
          />

          {/* Cover Image */}
          {coverUrl && (
            <div className="relative group">
              <img 
                src={coverUrl} 
                alt="Article cover" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isUploadingCover}
                  className="bg-gray-700 text-white hover:bg-gray-600"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Change Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCoverUrl('')}
                  className="bg-red-600 text-white hover:bg-red-700 border-red-600"
                >
                  Remove
                </Button>
              </div>
            </div>
          )}

          {/* Editor Content */}
          <div className="space-y-4">
            <BlockEditor
              blocks={blocks}
              onChange={setBlocks}
              onSlashCommand={() => {
                // Position slash command menu near the editor, accounting for browser UI
                const editorElement = document.querySelector('.block-editor-container')
                if (editorElement) {
                  const rect = editorElement.getBoundingClientRect()
                  // Add extra padding to account for browser URL bar and ensure menu is fully visible
                  const safeTop = Math.max(120, rect.top + 50) // Increased minimum from 100 to 120
                  setSlashCommandPosition({ 
                    x: Math.max(50, rect.left + 50), 
                    y: Math.min(window.innerHeight - 450, safeTop) // Increased bottom margin
                  })
                } else {
                  // Fallback to center of screen with better positioning
                  setSlashCommandPosition({ 
                    x: window.innerWidth / 2 - 160, 
                    y: Math.max(150, window.innerHeight / 2 - 200) // Increased minimum from 100 to 150
                  })
                }
                setSlashCommandOpen(true)
              }}
            />
          </div>
        </div>
      </div>

      {/* Slash Command Menu */}
      <SlashCommandMenu
        isOpen={slashCommandOpen}
        onClose={() => setSlashCommandOpen(false)}
        onSelect={(command, blockType) => {
          if (blockType) {
            let mappedType: any = blockType
            if (blockType === 'calloutInfo' || blockType === 'calloutWarning' || blockType === 'calloutSuccess' || blockType === 'calloutError') {
              mappedType = 'callout'
            }
            if (blockType === 'heading4') mappedType = 'heading3'
            if (blockType === 'heading5') mappedType = 'heading3'
            if (blockType === 'heading6') mappedType = 'heading3'

            const basicSupportedTypes = ['text', 'heading1', 'heading2', 'heading3', 'bulletList', 'orderedList', 'quote', 'code', 'image', 'callout']

            if (basicSupportedTypes.includes(mappedType)) {
              const newBlock = {
                id: Math.random().toString(36).substr(2, 9),
                type: mappedType,
                content: '',
                placeholder: getBlockPlaceholder(blockType)
              }
              setBlocks(prev => [...prev, newBlock])
            } else {
              console.log(`Block type "${blockType}" is not yet supported in Block Editor. Try using TipTap Editor instead.`)
            }
          }
          setSlashCommandOpen(false)
        }}
        position={slashCommandPosition}
      />

      {/* Cover Image Modal */}
      <CoverImageModal
        isOpen={showCoverModal}
        onClose={() => setShowCoverModal(false)}
        onSelect={(imageUrl) => {
          setCoverUrl(imageUrl)
          setShowCoverModal(false)
        }}
        currentImage={coverUrl}
      />

      {/* Draft Settings Panel */}
      <DraftSettingsPanel
        isOpen={showDraftSettings}
        onClose={() => setShowDraftSettings(false)}
        data={{
          author: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            image: 'https://via.placeholder.com/40'
          },
          coAuthors: [],
          tableOfContents: true,
          newsletter: true,
          slug: slug,
          tags: tags,
          customOgImage: ''
        }}
        onChange={(data) => {
          setSlug(data.slug)
          setTags(data.tags)
        }}
        onSave={() => {
          setShowDraftSettings(false)
        }}
      />

      {/* SEO Panel - Only render when needed */}
      {/* <SEOPanel
        isOpen={false}
        onClose={() => {}}
        data={seoData}
        onChange={setSeoData}
        onSave={() => {}}
      /> */}

      {/* Publishing Panel - Only render when needed */}
      {/* <PublishingPanel
        isOpen={false}
        onClose={() => {}}
        data={publishingData}
        onChange={setPublishingData}
        onSave={() => {}}
      /> */}
    </div>
  )
}

function getBlockPlaceholder(blockType: string): string {
  switch (blockType) {
    case 'heading1': return 'Heading 1'
    case 'heading2': return 'Heading 2'
    case 'heading3': return 'Heading 3'
    case 'quote': return 'Quote'
    case 'code': return 'Code block'
    case 'image': return 'Image URL'
    case 'callout': return 'Callout text'
    default: return 'Start typing...'
  }
}
