'use client'

import React, { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function MarkdownEditor({ content, onChange, placeholder = "Start writing markdown..." }: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [localContent, setLocalContent] = useState(content)

  useEffect(() => {
    setLocalContent(content)
  }, [content])

  const handleChange = (value: string) => {
    setLocalContent(value)
    onChange(value)
  }

  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = localContent.substring(start, end) || placeholder
    
    const newText = localContent.substring(0, start) + before + selectedText + after + localContent.substring(end)
    handleChange(newText)
    
    // Set cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      textarea.focus()
    }, 0)
  }

  const markdownShortcuts = [
    { label: 'Bold', shortcut: '**text**', action: () => insertMarkdown('**', '**', 'bold text') },
    { label: 'Italic', shortcut: '*text*', action: () => insertMarkdown('*', '*', 'italic text') },
    { label: 'Code', shortcut: '`code`', action: () => insertMarkdown('`', '`', 'code') },
    { label: 'Link', shortcut: '[text](url)', action: () => insertMarkdown('[', '](url)', 'link text') },
    { label: 'Image', shortcut: '![alt](url)', action: () => insertMarkdown('![', '](url)', 'alt text') },
    { label: 'H1', shortcut: '# Heading', action: () => insertMarkdown('# ', '', 'Heading 1') },
    { label: 'H2', shortcut: '## Heading', action: () => insertMarkdown('## ', '', 'Heading 2') },
    { label: 'H3', shortcut: '### Heading', action: () => insertMarkdown('### ', '', 'Heading 3') },
    { label: 'Quote', shortcut: '> Quote', action: () => insertMarkdown('> ', '', 'Quote text') },
    { label: 'List', shortcut: '- Item', action: () => insertMarkdown('- ', '', 'List item') },
  ]

  return (
    <div className="space-y-4">
      {/* Markdown Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-800 border border-gray-700 rounded-lg">
        <div className="text-xs text-gray-400 font-medium mr-2">Markdown Shortcuts:</div>
        {markdownShortcuts.map((shortcut, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={shortcut.action}
            className="text-gray-300 hover:text-white hover:bg-gray-700 text-xs"
          >
            {shortcut.label}
          </Button>
        ))}
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          {isPreview ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
          {isPreview ? 'Edit' : 'Preview'}
        </Button>
      </div>

      {/* Editor/Preview */}
      {isPreview ? (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 min-h-[500px] overflow-auto">
          <div className="prose prose-invert max-w-none">
            <SyntaxHighlighter
              language="markdown"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: 0,
                background: 'transparent',
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}
              wrapLines={true}
              wrapLongLines={true}
            >
              {localContent || placeholder}
            </SyntaxHighlighter>
          </div>
        </div>
      ) : (
        <div className="relative">
          <Textarea
            value={localContent}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 min-h-[500px] font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            spellCheck={false}
          />
          {/* Character count */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {localContent.length} characters
          </div>
        </div>
      )}
    </div>
  )
}

