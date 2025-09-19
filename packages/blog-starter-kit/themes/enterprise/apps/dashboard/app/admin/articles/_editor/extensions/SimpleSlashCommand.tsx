// /app/(admin)/admin/articles/_editor/extensions/SimpleSlashCommand.tsx
// Simplified slash command extension for Tiptap editor

import { Extension } from '@tiptap/core'
import { SlashCommand } from '@/lib/types/article'

export const SimpleSlashCommandExtension = Extension.create({
  name: 'simpleSlashCommand',

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

  addKeyboardShortcuts() {
    return {
      '/': () => {
        // Simple implementation - just insert a placeholder for now
        this.editor.commands.insertContent('/')
        return true
      },
    }
  },
})

export const simpleSlashCommands: SlashCommand[] = [
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
  // Table and Horizontal Rule commands will be added when extensions are available
  // {
  //   title: 'Table',
  //   description: 'Create a table',
  //   icon: '⊞',
  //   command: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  // },
  // {
  //   title: 'Divider',
  //   description: 'Insert a horizontal rule',
  //   icon: '—',
  //   command: (editor) => editor.chain().focus().setHorizontalRule().run(),
  // },
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
