// /app/(admin)/admin/articles/_components/DualModeEditor.tsx
// Dual mode editor that toggles between WYSIWYG (TipTap) and Markdown modes

'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileCode, Eye, AlertCircle } from 'lucide-react'
import { CompleteTipTapEditor } from './CompleteTipTapEditor'
import { MarkdownEditor } from './MarkdownEditor'
import { tiptapToMarkdown, markdownToTiptap } from '@/lib/editor/markdownConverter'

export type EditorMode = 'wysiwyg' | 'markdown'

interface DualModeEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  onImageUpload?: (file: File) => Promise<string>
  initialMode?: EditorMode
}

export function DualModeEditor({
  content = '',
  onChange,
  placeholder = 'Start writing...',
  className = '',
  onImageUpload,
  initialMode = 'wysiwyg'
}: DualModeEditorProps) {
  const [mode, setMode] = useState<EditorMode>(initialMode)
  const [wysiwygContent, setWysiwygContent] = useState(content)
  const [markdownContent, setMarkdownContent] = useState('')
  const [isSwitching, setIsSwitching] = useState(false)

  // Initialize markdown content from HTML on mount
  useEffect(() => {
    if (content) {
      setWysiwygContent(content)
      setMarkdownContent(tiptapToMarkdown(content))
    }
  }, [])

  // Handle mode switching
  const handleModeSwitch = async () => {
    setIsSwitching(true)
    
    try {
      if (mode === 'wysiwyg') {
        // Switching to Markdown mode
        const markdown = tiptapToMarkdown(wysiwygContent)
        setMarkdownContent(markdown)
        setMode('markdown')
        if (onChange) {
          onChange(wysiwygContent) // Keep HTML format for storage
        }
      } else {
        // Switching to WYSIWYG mode
        const html = markdownToTiptap(markdownContent)
        setWysiwygContent(html)
        setMode('wysiwyg')
        if (onChange) {
          onChange(html) // Store as HTML
        }
      }
    } catch (error) {
      console.error('Error switching modes:', error)
      alert('There was an error switching editor modes. Please try again.')
    } finally {
      // Small delay to ensure smooth transition
      setTimeout(() => setIsSwitching(false), 300)
    }
  }

  // Handle content changes
  const handleWysiwygChange = (newContent: string) => {
    setWysiwygContent(newContent)
    if (onChange) {
      onChange(newContent)
    }
  }

  const handleMarkdownChange = (newContent: string) => {
    setMarkdownContent(newContent)
    if (onChange) {
      // Convert markdown to HTML for storage
      const html = markdownToTiptap(newContent)
      onChange(html)
    }
  }

  return (
    <div className={`dual-mode-editor ${className}`}>
      {/* Editor Header with Mode Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border border-b-0 border-gray-200 rounded-t-lg">
        <div className="flex items-center gap-3">
          {/* Mode Indicator */}
          <Badge 
            variant={mode === 'wysiwyg' ? 'default' : 'secondary'}
            className="text-xs font-medium"
          >
            {mode === 'wysiwyg' ? (
              <><Eye className="w-3 h-3 mr-1" /> WYSIWYG Mode</>
            ) : (
              <><FileCode className="w-3 h-3 mr-1" /> Markdown Mode</>
            )}
          </Badge>

          {/* Info text */}
          <span className="text-xs text-gray-600">
            {mode === 'wysiwyg' 
              ? 'Visual editor with rich formatting' 
              : 'Pure markdown with syntax highlighting'}
          </span>
        </div>

        {/* Mode Toggle Button */}
        <div className="flex items-center gap-2">
          {isSwitching && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Converting...
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleModeSwitch}
            disabled={isSwitching}
            className="text-xs"
          >
            {mode === 'wysiwyg' ? (
              <>
                <FileCode className="w-4 h-4 mr-1" />
                Switch to Markdown
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-1" />
                Switch to WYSIWYG
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="editor-content">
        {isSwitching ? (
          <div className="flex items-center justify-center p-12 bg-white border border-gray-200 rounded-b-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Converting content...</p>
            </div>
          </div>
        ) : mode === 'wysiwyg' ? (
          <div className="border-t-0 rounded-t-none">
            <CompleteTipTapEditor
              content={wysiwygContent}
              onChange={handleWysiwygChange}
              placeholder={placeholder}
              className={className}
              onImageUpload={onImageUpload}
            />
          </div>
        ) : (
          <div className="border-t-0 rounded-t-none">
            <MarkdownEditor
              content={markdownContent}
              onChange={handleMarkdownChange}
              placeholder={placeholder}
            />
          </div>
        )}
      </div>

      {/* Editor Footer with Tips */}
      <div className="p-2 bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg">
        <div className="text-xs text-gray-500">
          {mode === 'wysiwyg' ? (
            <span>
              💡 Tip: Use keyboard shortcuts like <kbd className="px-1 bg-gray-200 rounded">Ctrl+B</kbd> for bold, 
              <kbd className="px-1 bg-gray-200 rounded ml-1">Ctrl+I</kbd> for italic
            </span>
          ) : (
            <span>
              💡 Tip: Use markdown syntax like <code className="px-1 bg-gray-200 rounded">**bold**</code>, 
              <code className="px-1 bg-gray-200 rounded ml-1">*italic*</code>, 
              <code className="px-1 bg-gray-200 rounded ml-1">## heading</code>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default DualModeEditor
