// /app/(admin)/admin/articles/_components/ArticleEditor.tsx
// Main article editor component with Tiptap, toolbar, and preview

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { HorizontalRule } from '@tiptap/extension-horizontal-rule'
import { createLowlight, common } from 'lowlight'

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
import { EditorToolbar } from './EditorToolbar'
import { AIAssistant } from './AIAssistant'
import { SlashCommandMenu } from './SlashCommandMenu'
import { MarkdownEditor } from './MarkdownEditor'
import { BlockEditor } from './BlockEditor'
import { 
  Save,
  Eye,
  EyeOff,
  Send,
  Clock,
  Type,
  ImageIcon,
  MessageSquare
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
  }
}

// Create lowlight instance for code highlighting with common languages
const lowlight = createLowlight(common)

export function ArticleEditor({ initialData }: ArticleEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || '')
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // TipTap editor configuration
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      HorizontalRule,
    ],
    content: initialData?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-stone max-w-none min-h-[400px] focus:outline-none p-4',
      },
    },
    onUpdate: ({ editor }) => {
      // Handle content updates
      const content = editor.getJSON()
      // You can add auto-save logic here
    },
  })
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [isMarkdownMode, setIsMarkdownMode] = useState(false)
  const [slashCommandOpen, setSlashCommandOpen] = useState(false)
  const [slashCommandPosition, setSlashCommandPosition] = useState({ x: 0, y: 0 })
  const [markdownContent, setMarkdownContent] = useState('')
  const [blocks, setBlocks] = useState<Array<{
    id: string
    type: 'text' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'orderedList' | 'quote' | 'code' | 'image' | 'callout'
    content: string
    placeholder?: string
  }>>([
    {
      id: '1',
      type: 'text',
      content: '',
      placeholder: 'Type "/" for commands...'
    }
  ])
  
  // Article data state for the new structure
  const [articleData, setArticleData] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    content: initialData?.content || '',
    slug: initialData?.slug || '',
    tags: initialData?.tags || [],
    coverUrl: initialData?.coverUrl || ''
  })

  // Block editor doesn't need Tiptap editor
  // const editor = useEditor({...})

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
        content_json: contentJson,
        content_mdx: contentMdx,
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
        content_json: contentJson,
        content_mdx: contentMdx,
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
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result: UploadResponse = await response.json()
        return result.url
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
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
      case 'bulletList': return 'List item'
      case 'orderedList': return 'List item'
      case 'quote': return 'Quote'
      case 'code': return 'Enter code...'
      case 'image': return 'Image URL'
      case 'callout': return 'Callout text'
      default: return 'Type something...'
    }
  }

  // Block editor doesn't need loading check
  // if (!editor) {
  //   return <div>Loading editor...</div>
  // }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {initialData?.id ? 'Edit Article' : 'New Article'}
              </h1>
              {lastSaved && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
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
              {/* Markdown Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={!isMarkdownMode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setIsMarkdownMode(false)}
                  className={!isMarkdownMode ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}
                >
                  Rich Text
                </Button>
                <Button
                  variant={isMarkdownMode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setIsMarkdownMode(true)}
                  className={isMarkdownMode ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}
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
            <div className="space-y-6 bg-white p-6 rounded-lg">
              {/* Title */}
              <div>
                <Input
                  value={title}
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
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-slug"
                  className="font-mono"
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
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
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

              {/* Article Title and Subtitle */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" className="text-gray-400 border-gray-600 hover:bg-gray-800">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Add Cover
                  </Button>
                  <Button variant="outline" size="sm" className="text-gray-400 border-gray-600 hover:bg-gray-800">
                    <Type className="w-4 h-4 mr-2" />
                    Add Subtitle
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Article Title..."
                    value={articleData.title}
                    onChange={(e) => setArticleData({ ...articleData, title: e.target.value })}
                    className="w-full text-4xl font-bold bg-transparent border-none outline-none text-gray-100 placeholder-gray-500"
                  />
                  <input
                    type="text"
                    placeholder="Article Subtitle..."
                    value={articleData.subtitle || ''}
                    onChange={(e) => setArticleData({ ...articleData, subtitle: e.target.value })}
                    className="w-full text-xl bg-transparent border-none outline-none text-gray-300 placeholder-gray-500"
                  />
                </div>
              </div>

              <Separator />

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Cover Image URL
                </label>
                <Input
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-800 border-gray-600 text-gray-100"
                />
              </div>

              <Separator />

              {/* Editor Content */}
              {isMarkdownMode ? (
                <MarkdownEditor
                  content={markdownContent}
                  onChange={setMarkdownContent}
                  placeholder="Start writing markdown..."
                />
              ) : (
                <div className="space-y-4">
                  {/* TipTap Editor with Toolbar */}
                  <div className="border border-stone-200 rounded-lg overflow-hidden bg-white">
                    {editor && (
                      <EditorToolbar 
                        editor={editor} 
                        onImageUpload={() => {
                          // Handle image upload
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = 'image/*'
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (e) => {
                                const result = e.target?.result as string
                                editor.chain().focus().setImage({ src: result }).run()
                              }
                              reader.readAsDataURL(file)
                            }
                          }
                          input.click()
                        }} 
                      />
                    )}
                    <EditorContent editor={editor} />
                  </div>
                  
                  {/* Fallback Block Editor */}
                  <div className="text-sm text-gray-600 mb-4">
                    🎯 Alternative Block Editor - Type &quot;/&quot; for commands or press Enter to add blocks
                  </div>
                  <BlockEditor
                    blocks={blocks}
                    onChange={setBlocks}
                    onSlashCommand={() => {
                      setSlashCommandOpen(true)
                      setSlashCommandPosition({ x: 300, y: 300 })
                    }}
                  />
                </div>
              )}
            </div>

            {/* Preview */}
            {isPreview && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-stone-900">Preview</h2>
                <div className="bg-white border border-stone-200 rounded-lg p-6 min-h-[500px]">
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
          if (blockType) {
            const newBlock = {
              id: Math.random().toString(36).substr(2, 9),
              type: blockType as any,
              content: '',
              placeholder: getBlockPlaceholder(blockType)
            }
            setBlocks(prev => [...prev, newBlock])
          }
        }}
        position={slashCommandPosition}
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
