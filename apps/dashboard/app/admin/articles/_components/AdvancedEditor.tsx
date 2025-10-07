// /app/(admin)/admin/articles/_components/AdvancedEditor.tsx
// Complete TipTap editor implementation with all extensions

// 'use client' directive: Required for Next.js 13+ App Router
// This marks the component as a Client Component, enabling React hooks,
// browser APIs, and third-party libraries like TipTap that require DOM access
'use client'

// React hooks used in this component:
// - useEffect: Syncs editor content with props and manages keyboard shortcuts
// Note: useCallback was intentionally removed as it added overhead without benefit
// The useEditor hook from TipTap already optimizes re-renders effectively
import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { HorizontalRule } from '@tiptap/extension-horizontal-rule'
// import { createLowlight } from 'lowlight'
// import { common } from 'lowlight'

// Create lowlight instance for syntax highlighting
// const lowlight = createLowlight(common)

interface AdvancedEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
}

export function AdvancedEditor({ 
  content = '', 
  onChange, 
  placeholder = 'Start writing...',
  className = ''
}: AdvancedEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure StarterKit extensions
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        listItem: {
          HTMLAttributes: {
            class: 'list-item',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-100 rounded p-2 font-mono text-sm',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'bg-gray-100 rounded px-1 py-0.5 font-mono text-sm',
          },
        },
        hardBreak: {
          HTMLAttributes: {
            class: 'break-words',
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'border-t border-gray-300 my-4',
          },
        },
        // Enable all StarterKit features
        // bold: true,
        // italic: true,
        // strike: true,
        // underline: true,
        // history: true,
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'task-item',
        },
        nested: true,
      }),
      // CodeBlockLowlight.configure({
      //   lowlight,
      //   HTMLAttributes: {
      //     class: 'bg-gray-900 text-gray-100 rounded p-4 font-mono text-sm overflow-x-auto',
      //     },
      // }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 w-full',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border border-gray-300',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 bg-gray-100 font-semibold p-2',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2',
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'border-t border-gray-300 my-6',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none ${className}`,
      },
    },
  })

  // Sync editor with prop changes and handle keyboard shortcuts
  // Note: useCallback not needed here as the editor instance is stable
  // and doesn't trigger unnecessary re-renders. The useEditor hook already
  // optimizes re-renders, and memoization would add overhead without benefit.
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Bold: Ctrl/Cmd + B
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault()
        editor.chain().focus().toggleBold().run()
      }
      
      // Italic: Ctrl/Cmd + I
      if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
        event.preventDefault()
        editor.chain().focus().toggleItalic().run()
      }
      
      // Underline: Ctrl/Cmd + U
      if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
        event.preventDefault()
        editor.chain().focus().toggleUnderline().run()
      }
      
      // Strike: Ctrl/Cmd + Shift + X
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'X') {
        event.preventDefault()
        editor.chain().focus().toggleStrike().run()
      }
      
      // Link: Ctrl/Cmd + K
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        const url = window.prompt('Enter URL:')
        if (url) {
          editor.chain().focus().setLink({ href: url }).run()
        }
      }
      
      // Code: Ctrl/Cmd + E
      if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault()
        editor.chain().focus().toggleCode().run()
      }
      
      // Heading 1: Ctrl/Cmd + Alt + 1
      if ((event.ctrlKey || event.metaKey) && event.altKey && event.key === '1') {
        event.preventDefault()
        editor.chain().focus().toggleHeading({ level: 1 }).run()
      }
      
      // Heading 2: Ctrl/Cmd + Alt + 2
      if ((event.ctrlKey || event.metaKey) && event.altKey && event.key === '2') {
        event.preventDefault()
        editor.chain().focus().toggleHeading({ level: 2 }).run()
      }
      
      // Heading 3: Ctrl/Cmd + Alt + 3
      if ((event.ctrlKey || event.metaKey) && event.altKey && event.key === '3') {
        event.preventDefault()
        editor.chain().focus().toggleHeading({ level: 3 }).run()
      }
      
      // Bullet List: Ctrl/Cmd + Shift + 8
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === '8') {
        event.preventDefault()
        editor.chain().focus().toggleBulletList().run()
      }
      
      // Ordered List: Ctrl/Cmd + Shift + 7
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === '7') {
        event.preventDefault()
        editor.chain().focus().toggleOrderedList().run()
      }
      
      // Task List: Ctrl/Cmd + Shift + 9
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === '9') {
        event.preventDefault()
        editor.chain().focus().toggleTaskList().run()
      }
      
      // Blockquote: Ctrl/Cmd + Shift + B
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'B') {
        event.preventDefault()
        editor.chain().focus().toggleBlockquote().run()
      }
      
      // Code Block: Ctrl/Cmd + Alt + C
      if ((event.ctrlKey || event.metaKey) && event.altKey && event.key === 'c') {
        event.preventDefault()
        editor.chain().focus().toggleCodeBlock().run()
      }
      
      // Horizontal Rule: Ctrl/Cmd + Shift + H
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'H') {
        event.preventDefault()
        editor.chain().focus().setHorizontalRule().run()
      }
      
      // Undo: Ctrl/Cmd + Z
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault()
        editor.chain().focus().undo().run()
      }
      
      // Redo: Ctrl/Cmd + Shift + Z
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Z') {
        event.preventDefault()
        editor.chain().focus().redo().run()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor])

  // Focus editor on mount
  useEffect(() => {
    if (editor) {
      editor.commands.focus()
    }
  }, [editor])

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">Loading editor...</span>
      </div>
    )
  }

  return (
    <div className="advanced-editor">
      <EditorContent 
        editor={editor} 
        className="min-h-[400px] border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
      />
    </div>
  )
}

export default AdvancedEditor
