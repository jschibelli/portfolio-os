// /app/(admin)/admin/articles/_components/EditorToolbar.tsx
// Enhanced toolbar component with all formatting options matching Hashnode's editor toolbar

'use client'

import React, { useState } from 'react'
import { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  CheckSquare,
  Link,
  Code,
  Code2,
  Quote,
  Minus,
  Undo,
  Redo,
  Image as ImageIcon,
  Table,
  Type,
  MoreHorizontal
} from 'lucide-react'

interface EditorToolbarProps {
  editor: Editor
  onImageUpload: () => void
}

export function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState('')

  if (!editor) {
    return null
  }

  const setLink = () => {
    try {
      if (linkUrl && linkUrl.trim()) {
        // Validate URL format
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
        if (!urlPattern.test(linkUrl)) {
          console.warn('Invalid URL format:', linkUrl)
          return
        }
        editor.chain().focus().setLink({ href: linkUrl }).run()
        setLinkUrl('')
      }
    } catch (error) {
      console.error('Error setting link:', error)
    }
  }

  const insertTable = () => {
    try {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    } catch (error) {
      console.error('Error inserting table:', error)
    }
  }

  // Helper function to safely execute editor commands
  const safeEditorCommand = (command: () => void, actionName: string) => {
    try {
      command()
    } catch (error) {
      console.error(`Error in ${actionName}:`, error)
      // Additional error handling for better detection
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack)
      }
    }
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    tooltip,
    shortcut 
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    tooltip: string
    shortcut?: string
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className="h-8 w-8 p-0"
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
          {shortcut && <p className="text-xs text-muted-foreground">{shortcut}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="border-b border-stone-200 bg-white p-2">
      <div className="flex flex-wrap items-center gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => safeEditorCommand(() => editor.chain().focus().toggleBold().run(), 'toggle bold')}
            isActive={editor.isActive('bold')}
            tooltip="Bold"
            shortcut="Ctrl+B"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => safeEditorCommand(() => editor.chain().focus().toggleItalic().run(), 'toggle italic')}
            isActive={editor.isActive('italic')}
            tooltip="Italic"
            shortcut="Ctrl+I"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => safeEditorCommand(() => editor.chain().focus().toggleUnderline().run(), 'toggle underline')}
            isActive={editor.isActive('underline')}
            tooltip="Underline"
            shortcut="Ctrl+U"
          >
            <Underline className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => safeEditorCommand(() => editor.chain().focus().toggleStrike().run(), 'toggle strikethrough')}
            isActive={editor.isActive('strike')}
            tooltip="Strikethrough"
            shortcut="Ctrl+Shift+S"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <Select
            value={editor.isActive('heading', { level: 1 }) ? 'h1' : 
                   editor.isActive('heading', { level: 2 }) ? 'h2' : 
                   editor.isActive('heading', { level: 3 }) ? 'h3' : 
                   editor.isActive('heading', { level: 4 }) ? 'h4' : 
                   editor.isActive('heading', { level: 5 }) ? 'h5' : 
                   editor.isActive('heading', { level: 6 }) ? 'h6' : 'paragraph'}
            onValueChange={(value) => {
              if (value === 'paragraph') {
                editor.chain().focus().setParagraph().run()
              } else {
                const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6
                editor.chain().focus().toggleHeading({ level }).run()
              }
            }}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue placeholder="H1" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">P</SelectItem>
              <SelectItem value="h1">H1</SelectItem>
              <SelectItem value="h2">H2</SelectItem>
              <SelectItem value="h3">H3</SelectItem>
              <SelectItem value="h4">H4</SelectItem>
              <SelectItem value="h5">H5</SelectItem>
              <SelectItem value="h6">H6</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => safeEditorCommand(() => editor.chain().focus().toggleBulletList().run(), 'toggle bullet list')}
            isActive={editor.isActive('bulletList')}
            tooltip="Bullet List"
            shortcut="Ctrl+Shift+8"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => safeEditorCommand(() => editor.chain().focus().toggleOrderedList().run(), 'toggle ordered list')}
            isActive={editor.isActive('orderedList')}
            tooltip="Numbered List"
            shortcut="Ctrl+Shift+7"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => safeEditorCommand(() => editor.chain().focus().toggleTaskList().run(), 'toggle task list')}
            isActive={editor.isActive('taskList')}
            tooltip="Task List"
            shortcut="Ctrl+Shift+9"
          >
            <CheckSquare className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Links and Code */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => {
              try {
                const url = window.prompt('Enter URL:')
                if (url && url.trim()) {
                  // Validate URL format
                  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
                  if (!urlPattern.test(url)) {
                    alert('Please enter a valid URL')
                    return
                  }
                  editor.chain().focus().setLink({ href: url }).run()
                }
              } catch (error) {
                console.error('Error adding link:', error)
                alert('Error adding link. Please try again.')
              }
            }}
            isActive={editor.isActive('link')}
            tooltip="Add Link"
            shortcut="Ctrl+K"
          >
            <Link className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => safeEditorCommand(() => editor.chain().focus().toggleCode().run(), 'toggle inline code')}
            isActive={editor.isActive('code')}
            tooltip="Inline Code"
            shortcut="Ctrl+E"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => safeEditorCommand(() => editor.chain().focus().toggleCodeBlock().run(), 'toggle code block')}
            isActive={editor.isActive('codeBlock')}
            tooltip="Code Block"
            shortcut="Ctrl+Alt+C"
          >
            <Code2 className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Block Elements */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => safeEditorCommand(() => editor.chain().focus().toggleBlockquote().run(), 'toggle blockquote')}
            isActive={editor.isActive('blockquote')}
            tooltip="Quote"
            shortcut="Ctrl+Shift+Q"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => safeEditorCommand(() => editor.chain().focus().setHorizontalRule().run(), 'insert horizontal rule')}
            tooltip="Horizontal Rule"
            shortcut="Ctrl+Shift+H"
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={insertTable}
            tooltip="Insert Table"
          >
            <Table className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Media and Actions */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={onImageUpload}
            tooltip="Insert Image"
            shortcut="Ctrl+Shift+I"
          >
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => safeEditorCommand(() => editor.chain().focus().undo().run(), 'undo')}
            disabled={!editor.can().undo()}
            tooltip="Undo"
            shortcut="Ctrl+Z"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => safeEditorCommand(() => editor.chain().focus().redo().run(), 'redo')}
            disabled={!editor.can().redo()}
            tooltip="Redo"
            shortcut="Ctrl+Y"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Clear Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => safeEditorCommand(() => editor.chain().focus().clearNodes().unsetAllMarks().run(), 'clear formatting')}
            tooltip="Clear Formatting"
            shortcut="Ctrl+\\"
          >
            <Type className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Mobile/Tablet Responsive Design */}
      <div className="mt-2 flex flex-wrap items-center gap-1 md:hidden">
        <ToolbarButton
          onClick={() => safeEditorCommand(() => editor.chain().focus().toggleBold().run(), 'toggle bold (mobile)')}
          isActive={editor.isActive('bold')}
          tooltip="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => safeEditorCommand(() => editor.chain().focus().toggleItalic().run(), 'toggle italic (mobile)')}
          isActive={editor.isActive('italic')}
          tooltip="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => safeEditorCommand(() => editor.chain().focus().toggleBulletList().run(), 'toggle bullet list (mobile)')}
          isActive={editor.isActive('bulletList')}
          tooltip="List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={onImageUpload}
          tooltip="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}