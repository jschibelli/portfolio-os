// /app/(admin)/admin/articles/_components/EditorToolbar.tsx  
// Enhanced toolbar component with keyboard shortcuts and better UX

'use client'

import React from 'react'
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
  Table,
  Minus,
  Type,
  ChevronDown,
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

      {/* Headings */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 1</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 2</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 3</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('heading', { level: 4 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          >
            <Heading4 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 4</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('heading', { level: 5 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          >
            <Heading5 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 5</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor.isActive('heading', { level: 6 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          >
            <Heading6 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 6</TooltipContent>
      </Tooltip>

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