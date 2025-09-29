// /app/(admin)/admin/articles/_components/EditorToolbar.tsx  
// Enhanced toolbar component with keyboard shortcuts and better UX

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Editor } from '@tiptap/react'
import { Button } from '@mindware-blog/ui/button'
import { Separator } from '@mindware-blog/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@mindware-blog/ui/tooltip'
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ChevronDown,
  Table,
  Minus,
  Type,
  Undo,
  Redo,
  X,
  Square
} from 'lucide-react'

interface EditorToolbarProps {
  editor: Editor
  onImageUpload: () => void
}

export function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  const [isHeadingDropdownOpen, setIsHeadingDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsHeadingDropdownOpen(false)
      }
    }

    if (isHeadingDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isHeadingDropdownOpen])
  
  if (!editor) return null

  const setLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run()
  }

  const getActiveHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return 'H1'
    if (editor.isActive('heading', { level: 2 })) return 'H2'
    if (editor.isActive('heading', { level: 3 })) return 'H3'
    if (editor.isActive('heading', { level: 4 })) return 'H4'
    if (editor.isActive('heading', { level: 5 })) return 'H5'
    if (editor.isActive('heading', { level: 6 })) return 'H6'
    return 'Normal'
  }

  const headingOptions = [
    { label: 'Normal', command: () => editor.chain().focus().setParagraph().run(), icon: Type },
    { label: 'H1', command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), icon: Heading1 },
    { label: 'H2', command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), icon: Heading2 },
    { label: 'H3', command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), icon: Heading3 },
    { label: 'H4', command: () => editor.chain().focus().toggleHeading({ level: 4 }).run(), icon: Heading4 },
    { label: 'H5', command: () => editor.chain().focus().toggleHeading({ level: 5 }).run(), icon: Heading5 },
    { label: 'H6', command: () => editor.chain().focus().toggleHeading({ level: 6 }).run(), icon: Heading6 },
  ]

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
      <div className="text-xs text-gray-300 font-medium mr-3 px-2 py-1 bg-gray-700 rounded">✍️ Rich Text Editor</div>
      
      {/* Undo/Redo */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Formatting */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Bold (Ctrl+B)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Italic (Ctrl+I)</TooltipContent>
      </Tooltip>


      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('strike') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Strikethrough</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('code') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Inline Code</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-6" />

      {/* Heading Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHeadingDropdownOpen(!isHeadingDropdownOpen)}
              className="flex items-center gap-1"
            >
              <span className="text-xs font-medium">{getActiveHeading()}</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading Options</TooltipContent>
        </Tooltip>
        
        {isHeadingDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 min-w-[120px]">
            {headingOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <button
                  key={option.label}
                  onClick={() => {
                    option.command()
                    setIsHeadingDropdownOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white first:rounded-t-lg last:rounded-b-lg"
                >
                  <IconComponent className="w-4 h-4" />
                  {option.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Bullet List</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Numbered List</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('taskList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <Square className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Task List</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-6" />

      {/* Block Elements */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Quote</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            {'</>'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Code Block</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Horizontal Rule</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-6" />

      {/* Media and Links */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('link') ? 'default' : 'ghost'}
            size="sm"
            onClick={setLink}
          >
            <LinkIcon className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add Link (Ctrl+K)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onImageUpload}
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Upload Image</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={insertTable}
          >
            <Table className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Insert Table</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-6" />

      {/* Additional Formatting */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('paragraph') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            <Type className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Normal Text</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFormatting}
          >
            <X className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Clear Formatting</TooltipContent>
      </Tooltip>
    </div>
  )
}