// /app/(admin)/admin/articles/_components/ArticleEditor.tsx
// Main article editor component with Tiptap, toolbar, and preview

'use client'

import React, { useState, useEffect, useCallback } from 'react'

// Simple Slash Command Extension - temporarily disabled
// const SlashCommandExtension = Extension.create({
//   name: 'slashCommand',
//   addKeyboardShortcuts() {
//     return {
//       '/': () => {
//         const { editor } = this
//         const { state, dispatch } = editor.view
//         const { selection } = state
//         const { $from } = selection
//         const tr = state.tr.insertText('/')
//         dispatch(tr)
//         return true
//       },
//     }
//   },
// })

// Table extensions will be added when dependencies are available
// import { Table } from '@tiptap/extension-table'
// import { TableRow } from '@tiptap/extension-table-row'
// import { TableHeader } from '@tiptap/extension-table-header'
// import { TableCell } from '@tiptap/extension-table-cell'
// import { HorizontalRule } from '@tiptap/extension-horizontal-rule'

// Custom extensions
// import { SimpleSlashCommandExtension, simpleSlashCommands } from '../_editor/extensions/SimpleSlashCommand'
// import { Callout } from '../_editor/extensions/Callout'
// import { Embed } from '../_editor/extensions/Embed'
// import { ReactComponentBlock } from '../_editor/extensions/ReactComponentBlock'

// Utilities
// import { pmToMdx } from '@/lib/editor/pmToMdx' // Not needed for block editor
// import { RenderMdx } from '@/lib/editor/renderMdx' // Temporarily disabled for debugging
import { generateSlugFromTitle } from '@/lib/slugify'
import { SaveDraftRequest, SaveDraftResponse, PublishRequest, PublishResponse, UploadResponse } from '@/lib/types/article'

// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AIAssistant } from './AIAssistant'
import { SlashCommandMenu } from './SlashCommandMenu'
import { MarkdownEditor } from './MarkdownEditor'
import { BlockEditor } from './BlockEditor'
import { SEOPanel, SEOData } from './SEOPanel'
import { CompleteTipTapEditor } from './CompleteTipTapEditor'
import { DualModeEditor } from './DualModeEditor'
import { PublishingPanel } from './PublishingPanel'
import { CoverImageModal } from './CoverImageModal'
import { DraftSettingsPanel } from './DraftSettingsPanel'
import { 
  Save,
  Eye,
  EyeOff,
  Send,
  Clock,
  Type,
  ImageIcon,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Search as SearchIcon,
  Send as SendIcon,
  Settings
} from 'lucide-react'

interface ArticleEditorProps {
  initialData?: {
    id?: string
    title?: string
    subtitle?: string
    slug?: string
    tags?: string[]
    coverUrl?: string
    content?: any
    // SEO fields
    metaTitle?: string
    metaDescription?: string
    canonicalUrl?: string
    noindex?: boolean
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    twitterCard?: 'summary' | 'summary_large_image'
    twitterTitle?: string
    twitterDescription?: string
    twitterImage?: string
    focusKeyword?: string
    seoScore?: number
  }
}

// TipTap is handled by CompleteTipTapEditor when TipTap mode is enabled

export function ArticleEditor({ initialData }: ArticleEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || '')
  const [newTag, setNewTag] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // TipTap editor is managed by CompleteTipTapEditor in TipTap mode
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [isMarkdownMode, setIsMarkdownMode] = useState(false)
  const [isTipTapMode, setIsTipTapMode] = useState(false)
  const [isDualMode, setIsDualMode] = useState(false)
  const [slashCommandOpen, setSlashCommandOpen] = useState(false)
  const [slashCommandPosition, setSlashCommandPosition] = useState({ x: 0, y: 0 })
  const [markdownContent, setMarkdownContent] = useState('')
  const [showCoverModal, setShowCoverModal] = useState(false)
  const [showDraftSettings, setShowDraftSettings] = useState(false)
  
  const [draftSettings, setDraftSettings] = useState({
    author: {
      id: '1',
      name: 'John Schibelli',
      email: 'john@example.com',
      image: '',
      role: 'owner' as const
    },
    coAuthors: [],
    tableOfContents: false,
    sendToNewsletter: true,
    articleSlug: '',
    tags: [],
    customOGImage: undefined as string | undefined,
    visibility: 'public' as const,
    allowComments: true,
    allowReactions: true
  })
  const [seoExpanded, setSeoExpanded] = useState(false)
  const [tiptapContent, setTiptapContent] = useState('')
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const coverInputRef = React.useRef<HTMLInputElement>(null)

  const [blocks, setBlocks] = useState<Array<{
    id: string
    type: 'text' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'heading6' | 'bulletList' | 'orderedList' | 'taskList' | 'quote' | 'code' | 'image' | 'callout' | 'calloutInfo' | 'calloutWarning' | 'calloutSuccess' | 'calloutError' | 'horizontalRule' | 'details' | 'table' | 'mention' | 'widget' | 'reactComponent' | 'infoCard' | 'statBadge' | 'youtube' | 'twitter' | 'githubGist' | 'codepen' | 'codesandbox' | 'embed'
    content: string
    placeholder?: string
    calloutType?: 'info' | 'warning' | 'success' | 'error'
  }>>([
    {
      id: '1',
      type: 'text',
      content: '',
      placeholder: 'Type "/" for commands...'
    }
  ])
  
  // SEO data state
  const [seoData, setSeoData] = useState<SEOData>({
    metaTitle: initialData?.metaTitle,
    metaDescription: initialData?.metaDescription,
    canonicalUrl: initialData?.canonicalUrl,
    noindex: initialData?.noindex,
    ogTitle: initialData?.ogTitle,
    ogDescription: initialData?.ogDescription,
    ogImage: initialData?.ogImage,
    twitterCard: initialData?.twitterCard,
    twitterTitle: initialData?.twitterTitle,
    twitterDescription: initialData?.twitterDescription,
    twitterImage: initialData?.twitterImage,
    focusKeyword: initialData?.focusKeyword,
    seoScore: initialData?.seoScore,
  })

  // Publishing panel state with proper TypeScript types
  interface PublishingOptions {
    status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'
    visibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' | 'MEMBERS_ONLY'
    scheduledAt?: Date | null
    featured: boolean
    allowComments: boolean
    allowReactions: boolean
    paywalled: boolean
    readingMinutes: number
    seriesId?: string | null
    seriesPosition?: number | null
    crossPlatformPublishing: {
      hashnode: boolean
      dev: boolean
      medium: boolean
    }
  }

  const [publishingExpanded, setPublishingExpanded] = useState(false)
  const [publishingOptions, setPublishingOptions] = useState<PublishingOptions>({
    status: 'DRAFT',
    visibility: 'PUBLIC',
    scheduledAt: null, // Changed from undefined to null for better type safety
    featured: false,
    allowComments: true,
    allowReactions: true,
    paywalled: false,
    readingMinutes: 0,
    seriesId: null,
    seriesPosition: null,
    crossPlatformPublishing: {
      hashnode: false,
      dev: false,
      medium: false
    }
  })
  
  // Article data state for the new structure
  const [articleData, setArticleData] = useState({
    title: initialData?.title ?? '',
    subtitle: initialData?.subtitle ?? '',
    content: initialData?.content ?? '',
    slug: initialData?.slug ?? '',
    tags: initialData?.tags ?? [],
    coverUrl: initialData?.coverUrl ?? ''
  })

  // Block editor doesn't need TipTap editor instance in this component

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !initialData?.slug) {
      const generatedSlug = generateSlugFromTitle(title)
      setSlug(generatedSlug)
    }
  }, [title, initialData?.slug])

  // Debounced save function for blocks
  const debouncedSave = useCallback(
    debounce(() => {
      saveDraft()
    }, 5000), // Save every 5 seconds
    [blocks] // Save when blocks change
  )

  // Auto-save when blocks change
  useEffect(() => {
    if (blocks.length > 0) {
      debouncedSave()
    }
  }, [blocks, debouncedSave])

  const saveDraft = async () => {
    if (!articleData.title.trim()) return

    setIsSaving(true)
    try {
      // Convert blocks to JSON for storage
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

      const payload: SaveDraftRequest = {
        id: initialData?.id,
        title: articleData.title.trim(),
        slug: articleData.slug.trim(),
        tags: articleData.tags,
        coverUrl: articleData.coverUrl.trim() || undefined,
        contentJson,
        contentMdx,
        // SEO fields
        metaTitle: seoData.metaTitle,
        metaDescription: seoData.metaDescription,
        canonicalUrl: seoData.canonicalUrl,
        noindex: seoData.noindex,
        ogTitle: seoData.ogTitle,
        ogDescription: seoData.ogDescription,
        ogImage: seoData.ogImage,
        twitterCard: seoData.twitterCard,
        twitterTitle: seoData.twitterTitle,
        twitterDescription: seoData.twitterDescription,
        twitterImage: seoData.twitterImage,
        focusKeyword: seoData.focusKeyword,
        seoScore: seoData.seoScore,
      }

      const response = await fetch('/api/articles/save-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const result: SaveDraftResponse = await response.json()
        setLastSaved(new Date())
        console.log('Draft saved:', result)
      } else {
        console.error('Failed to save draft')
      }
    } catch (error) {
      console.error('Error saving draft:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const publishArticle = async () => {
    if (!articleData.title.trim()) return

    setIsSaving(true)
    try {
      // Convert blocks to JSON for storage
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

      // First save the draft
      const savePayload: SaveDraftRequest = {
        id: initialData?.id,
        title: articleData.title.trim(),
        slug: articleData.slug.trim(),
        tags: articleData.tags,
        coverUrl: articleData.coverUrl.trim() || undefined,
        contentJson,
        contentMdx,
        // SEO fields
        metaTitle: seoData.metaTitle,
        metaDescription: seoData.metaDescription,
        canonicalUrl: seoData.canonicalUrl,
        noindex: seoData.noindex,
        ogTitle: seoData.ogTitle,
        ogDescription: seoData.ogDescription,
        ogImage: seoData.ogImage,
        twitterCard: seoData.twitterCard,
        twitterTitle: seoData.twitterTitle,
        twitterDescription: seoData.twitterDescription,
        twitterImage: seoData.twitterImage,
        focusKeyword: seoData.focusKeyword,
        seoScore: seoData.seoScore,
      }

      const saveResponse = await fetch('/api/articles/save-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(savePayload),
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save draft before publishing')
      }

      const saveResult: SaveDraftResponse = await saveResponse.json()

      // Then publish
      const publishPayload: PublishRequest = {
        id: saveResult.id,
      }

      const publishResponse = await fetch('/api/articles/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publishPayload),
      })

      if (publishResponse.ok) {
        const result: PublishResponse = await publishResponse.json()
        console.log('Article published:', result)
        // Redirect to published article or show success message
      } else {
        console.error('Failed to publish article')
      }
    } catch (error) {
      console.error('Error publishing article:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        return result.url
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    setIsUploadingCover(true)
    try {
      const url = await uploadImage(file)
      setCoverUrl(url)
      setArticleData({ ...articleData, coverUrl: url })
    } catch (error) {
      console.error('Failed to upload cover image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploadingCover(false)
      // Reset input so the same file can be selected again if needed
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  // Image upload is now handled by the block editor
  // const handleImageUpload = async () => { ... }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Link functionality is now handled by the block editor
  // const setLink = () => { ... }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        saveDraft()
      }
      // Link shortcut is now handled by the block editor
      // if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      //   e.preventDefault()
      //   setLink()
      // }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const getBlockPlaceholder = (blockType: string): string => {
    switch (blockType) {
      case 'text': return 'Start writing with plain text...'
      case 'heading1': return 'Heading 1'
      case 'heading2': return 'Heading 2'
      case 'heading3': return 'Heading 3'
      case 'heading4': return 'Heading 4'
      case 'heading5': return 'Heading 5'
      case 'heading6': return 'Heading 6'
      case 'bulletList': return 'List item'
      case 'orderedList': return 'List item'
      case 'taskList': return 'Task item'
      case 'quote': return 'Quote'
      case 'code': return 'Enter code...'
      case 'image': return 'Image URL'
      case 'callout': return 'Callout text'
      case 'calloutInfo': return 'Info callout text'
      case 'calloutWarning': return 'Warning callout text'
      case 'calloutSuccess': return 'Success callout text'
      case 'calloutError': return 'Error callout text'
      case 'horizontalRule': return '---'
      case 'details': return 'Details content...'
      case 'table': return 'Table content'
      case 'mention': return '@username'
      case 'widget': return 'Widget content'
      case 'reactComponent': return 'React component'
      case 'infoCard': return 'Info card content'
      case 'statBadge': return 'Statistics badge'
      case 'youtube': return 'YouTube URL'
      case 'twitter': return 'Twitter/X URL'
      case 'githubGist': return 'GitHub Gist URL'
      case 'codepen': return 'CodePen URL'
      case 'codesandbox': return 'CodeSandbox URL'
      case 'embed': return 'Embed URL'
      default: return 'Type something...'
    }
  }

  // Block editor doesn't need loading check
  // if (!editor) {
  //   return <div>Loading editor...</div>
  // }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
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
              {isSaving && (
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Editor Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={!isMarkdownMode && !isTipTapMode && !isDualMode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setIsMarkdownMode(false)
                    setIsTipTapMode(false)
                    setIsDualMode(false)
                  }}
                  className={!isMarkdownMode && !isTipTapMode && !isDualMode ? "bg-gray-700 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"}
                >
                  Block Editor
                </Button>
                <Button
                  variant={isDualMode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setIsDualMode(true)
                    setIsTipTapMode(false)
                    setIsMarkdownMode(false)
                  }}
                  className={isDualMode ? "bg-gray-700 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"}
                >
                  Dual Mode
                </Button>
                <Button
                  variant={isTipTapMode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setIsTipTapMode(true)
                    setIsMarkdownMode(false)
                    setIsDualMode(false)
                  }}
                  className={isTipTapMode ? "bg-gray-700 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"}
                >
                  TipTap Editor
                </Button>
                <Button
                  variant={isMarkdownMode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setIsMarkdownMode(true)
                    setIsTipTapMode(false)
                    setIsDualMode(false)
                  }}
                  className={isMarkdownMode ? "bg-gray-700 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"}
                >
                  Markdown
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAIAssistantOpen(true)}
                className="text-gray-300 border-gray-600 hover:bg-gray-800"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
                className="text-gray-300 border-gray-600 hover:bg-gray-800"
              >
                {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={saveDraft}
                disabled={isSaving}
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={publishArticle}
                disabled={isSaving || !articleData.title.trim()}
              >
                <Send className="w-4 h-4" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className={`grid gap-6 ${isPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {/* Editor */}
            <div className="space-y-6 bg-gray-800 p-6 rounded-lg">
              {/* Title */}
              <div>
                <Input
                  value={title ?? ''}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Write a great title..."
                  className="text-2xl font-bold border-none shadow-none p-0 focus-visible:ring-0"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Slug
                </label>
                <Input
                  value={slug ?? ''}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-slug"
                  className="font-mono border-gray-600 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag ?? ''}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    className="border-gray-600 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button size="sm" onClick={addTag}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Hidden file input for cover upload */}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
              />

              {/* Article Title and Subtitle */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-200 border-gray-600 hover:bg-gray-800 hover:text-white border"
                    onClick={() => setShowCoverModal(true)}
                    disabled={isUploadingCover}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {isUploadingCover ? 'Uploading...' : 'Add Cover'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-gray-200 border-gray-600 hover:bg-gray-800 hover:text-white border"
                    onClick={() => {
                      // Focus subtitle input
                      const subtitleInput = document.querySelector('input[placeholder*="Article Subtitle"]') as HTMLInputElement
                      if (subtitleInput) {
                        subtitleInput.focus()
                      }
                    }}
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Add Subtitle
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-gray-200 border-gray-600 hover:bg-gray-800 hover:text-white border"
                    onClick={() => setShowDraftSettings(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Draft Settings
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Article Subtitle..."
                    value={articleData.subtitle ?? ''}
                    onChange={(e) => setArticleData({ ...articleData, subtitle: e.target.value })}
                    className="w-full text-xl bg-transparent border-none outline-none text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <Separator />


              <Separator />

              {/* Editor Content */}
              {isDualMode ? (
                <DualModeEditor
                  content={tiptapContent}
                  onChange={(content) => {
                    setTiptapContent(content)
                    setArticleData({ ...articleData, content })
                  }}
                  placeholder="Start writing..."
                  onImageUpload={uploadImage}
                  initialMode="wysiwyg"
                />
              ) : isMarkdownMode ? (
                <MarkdownEditor
                  content={markdownContent}
                  onChange={setMarkdownContent}
                  placeholder="Start writing markdown..."
                />
              ) : isTipTapMode ? (
                <div className="space-y-4">
                  <CompleteTipTapEditor
                    content={tiptapContent}
                    onChange={setTiptapContent}
                    placeholder="Start writing with rich text..."
                    onImageUpload={uploadImage}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cover Image at Top of Article */}
                  {coverUrl && (
                    <div className="relative group mb-8">
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
                          className="bg-gray-700 text-white hover:bg-gray-600 border"
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Change Image
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCoverUrl('')
                            setArticleData({ ...articleData, coverUrl: '' })
                          }}
                          className="bg-red-600 text-white hover:bg-red-700 border-red-600 border"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                  
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
              )}

              <Separator className="my-8" />

              {/* SEO Panel */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setSeoExpanded(!seoExpanded)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <SearchIcon className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        SEO Settings
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Optimize your article for search engines and social media
                        {seoData.seoScore !== undefined && (
                          <span className="ml-2 text-blue-600 font-medium">
                            • Score: {seoData.seoScore}/100
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {seoExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {seoExpanded && (
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <SEOPanel
                      data={seoData}
                      articleTitle={title}
                      articleSlug={slug}
                      onChange={setSeoData}
                    />
                  </div>
                )}
              </div>

              {/* Publishing Panel */}
              <div className="border border-gray-200 rounded-lg mt-6">
                <button
                  onClick={() => setPublishingExpanded(!publishingExpanded)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <SendIcon className="w-5 h-5 text-green-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Publishing Settings
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Control how and when your article is published
                        <span className="ml-2 text-green-600 font-medium">
                          • Status: {publishingOptions.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  {publishingExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {publishingExpanded && (
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <PublishingPanel
                      articleId={initialData?.id}
                      initialData={publishingOptions}
                      articleTitle={title}
                      articleSlug={slug}
                      articleContent={markdownContent || tiptapContent || JSON.stringify(blocks)}
                      onSave={async (options) => {
                        try {
                          // Validate inputs before saving
                          if (options.status === 'SCHEDULED' && !options.scheduledAt) {
                            throw new Error('Scheduled articles must have a publish date')
                          }
                          
                          if (options.seriesId && !options.seriesPosition) {
                            throw new Error('Articles in a series must have a position')
                          }

                          setPublishingOptions({...publishingOptions, ...options})
                          
                          // Save to API if article exists
                          if (initialData?.id) {
                            const response = await fetch('/api/articles/publishing-options', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                articleId: initialData.id,
                                ...options
                              })
                            })

                            if (!response.ok) {
                              const error = await response.json()
                              throw new Error(error.error || 'Failed to save publishing options')
                            }

                            // Success feedback could be shown here
                            console.log('Publishing options saved successfully')
                          }
                        } catch (error) {
                          console.error('Error saving publishing options:', error)
                          // In a real app, show user-friendly error message via toast/notification
                          alert(error instanceof Error ? error.message : 'Failed to save publishing options')
                        }
                      }}
                      series={[]} // Series loaded dynamically in PublishingPanel via API
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            {isPreview && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-stone-900">Preview</h2>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 min-h-[500px]">
                  <p>Preview functionality temporarily disabled for debugging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* AI Assistant Modal */}
      <AIAssistant 
        isOpen={isAIAssistantOpen} 
        onClose={() => setIsAIAssistantOpen(false)} 
      />
      
      {/* Slash Command Menu */}
      <SlashCommandMenu
        isOpen={slashCommandOpen}
        onClose={() => setSlashCommandOpen(false)}
        onSelect={(command, blockType) => {
          console.log('Slash command selected:', { command, blockType, editorMode: isTipTapMode ? 'TipTap' : 'Block' })
          
          if (blockType) {
            // Handle based on editor mode
            if (isTipTapMode) {
              // TipTap editor - handle advanced blocks
              console.log('TipTap editor selected - advanced blocks not yet implemented')
              alert(`Advanced block "${blockType}" is not yet implemented in TipTap editor. This feature is coming soon!`)
            } else {
              // BlockEditor - now supports details blocks!
              const basicSupportedTypes = ['text', 'heading1', 'heading2', 'heading3', 'bulletList', 'orderedList', 'quote', 'code', 'image', 'callout', 'details']
              
              // Map block types to supported ones
              let mappedType: any = blockType
              
              // Map advanced callout types to basic callout
              if (blockType === 'calloutInfo' || blockType === 'calloutWarning' || blockType === 'calloutSuccess' || blockType === 'calloutError') {
                mappedType = 'callout'
              }
              // Map heading shortcuts
              if (blockType === 'heading4') mappedType = 'heading3'
              if (blockType === 'heading5') mappedType = 'heading3'
              if (blockType === 'heading6') mappedType = 'heading3'
              
              // Map unsupported block types to supported alternatives
              if (blockType === 'taskList') {
                mappedType = 'bulletList' // Task list not supported, use bullet list instead
              }
              if (blockType === 'horizontalRule') {
                mappedType = 'text' // Horizontal rule not supported, use text instead
              }
              
              if (basicSupportedTypes.includes(mappedType)) {
                const newBlock = {
                  id: Math.random().toString(36).substr(2, 9),
                  type: mappedType,
                  content: '',
                  placeholder: getBlockPlaceholder(mappedType)
                }
                console.log('Creating new block:', newBlock)
                setBlocks(prev => {
                  const newBlocks = [...prev, newBlock]
                  console.log('Updated blocks:', newBlocks)
                  return newBlocks
                })
              } else {
                // For unsupported block types, create a text block with a note
                console.log(`Block type "${blockType}" is not yet supported in Block Editor. Creating text block instead.`)
                const fallbackBlock = {
                  id: Math.random().toString(36).substr(2, 9),
                  type: 'text' as const,
                  content: `[${blockType} block - not supported in basic editor]`,
                  placeholder: `This ${blockType} block is not supported in the basic editor. Switch to TipTap editor for advanced blocks.`
                }
                setBlocks(prev => [...prev, fallbackBlock])
              }
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
          setArticleData({ ...articleData, coverUrl: imageUrl })
          setShowCoverModal(false)
        }}
        currentImage={coverUrl}
      />

      {/* Draft Settings Panel */}
      <DraftSettingsPanel
        isOpen={showDraftSettings}
        onClose={() => setShowDraftSettings(false)}
        data={draftSettings}
        onChange={setDraftSettings}
        onSave={() => {
          // Save draft settings
          console.log('Saving draft settings:', draftSettings)
          setShowDraftSettings(false)
        }}
      />
    </TooltipProvider>
  )
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
