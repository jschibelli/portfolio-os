// /app/(admin)/admin/articles/_editor/extensions/SlashCommand.tsx
// Slash command extension for Tiptap editor
// Provides a floating command menu when user types "/"

import { Extension } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import Suggestion from '@tiptap/suggestion'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { SlashCommand } from '@/lib/types/article'
import tippy from 'tippy.js'

interface CommandItemProps {
  title: string
  description: string
  icon: string
  command: () => void
}

const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(
  ({ title, description, icon, command }, ref) => {
    return (
      <div
        ref={ref}
        className="flex items-center gap-3 px-3 py-2 hover:bg-stone-100 cursor-pointer rounded"
        onClick={command}
      >
        <span className="text-lg">{icon}</span>
        <div>
          <div className="font-medium text-stone-900">{title}</div>
          <div className="text-sm text-stone-500">{description}</div>
        </div>
      </div>
    )
  }
)

CommandItem.displayName = 'CommandItem'

interface SlashCommandListProps {
  items: SlashCommand[]
  command: (item: SlashCommand) => void
}

const SlashCommandList = forwardRef<HTMLDivElement, SlashCommandListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index: number) => {
      const item = items[index]
      if (item) {
        command(item)
      }
    }

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length)
    }

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length)
    }

    const enterHandler = () => {
      selectItem(selectedIndex)
    }

    useEffect(() => setSelectedIndex(0), [items])

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    }

    return (
      <div 
        ref={ref}
        className="bg-white border border-stone-200 rounded-lg shadow-lg p-2 max-h-80 overflow-y-auto"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {items.length ? (
          items.map((item, index) => (
            <CommandItem
              key={index}
              title={item.title}
              description={item.description}
              icon={item.icon}
              command={() => selectItem(index)}
            />
          ))
        ) : (
          <div className="px-3 py-2 text-stone-500">No result</div>
        )}
      </div>
    )
  }
)

SlashCommandList.displayName = 'SlashCommandList'

export const SlashCommandExtension = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})

export const slashCommands: SlashCommand[] = [
  {
    title: 'Heading 1',
    description: 'Big section heading',
    icon: 'H1',
    command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: 'H2',
    command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: 'H3',
    command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: 'Paragraph',
    description: 'Regular text paragraph',
    icon: 'P',
    command: (editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    title: 'Bullet List',
    description: 'Create a bullet list',
    icon: '•',
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    icon: '1.',
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: 'Task List',
    description: 'Create a task list',
    icon: '☐',
    command: (editor) => editor.chain().focus().toggleTaskList().run(),
  },
  {
    title: 'Quote',
    description: 'Create a blockquote',
    icon: '"',
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: 'Code Block',
    description: 'Create a code block',
    icon: '</>',
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: 'Image',
    description: 'Insert an image',
    icon: '🖼️',
    command: (editor) => {
      const url = window.prompt('Enter image URL:')
      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    },
  },
  {
    title: 'Callout',
    description: 'Create a callout box',
    icon: '💡',
    command: (editor) => editor.chain().focus().insertContent({
      type: 'callout',
      attrs: { variant: 'info', title: 'Callout' },
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Your callout content here...' }] }]
    }).run(),
  },
  {
    title: 'Table',
    description: 'Create a table',
    icon: '⊞',
    command: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    title: 'Divider',
    description: 'Insert a horizontal rule',
    icon: '—',
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    title: 'YouTube',
    description: 'Embed a YouTube video',
    icon: '📺',
    command: (editor) => {
      const url = window.prompt('Enter YouTube URL:')
      if (url) {
        const videoId = extractYouTubeId(url)
        if (videoId) {
          editor.chain().focus().insertContent({
            type: 'embed',
            attrs: { provider: 'youtube', url, id: videoId }
          }).run()
        }
      }
    },
  },
  {
    title: 'Tweet',
    description: 'Embed a Twitter post',
    icon: '🐦',
    command: (editor) => {
      const url = window.prompt('Enter Tweet URL:')
      if (url) {
        const tweetId = extractTweetId(url)
        if (tweetId) {
          editor.chain().focus().insertContent({
            type: 'embed',
            attrs: { provider: 'tweet', url, id: tweetId }
          }).run()
        }
      }
    },
  },
  {
    title: 'React Component',
    description: 'Insert a React component',
    icon: '⚛️',
    command: (editor) => editor.chain().focus().insertContent({
      type: 'component',
      attrs: { name: 'InfoCard', props: { title: 'Component Title' } },
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Component content here...' }] }]
    }).run(),
  },
]

function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

function extractTweetId(url: string): string | null {
  const regex = /twitter\.com\/\w+\/status\/(\d+)/
  const match = url.match(regex)
  return match ? match[1] : null
}
