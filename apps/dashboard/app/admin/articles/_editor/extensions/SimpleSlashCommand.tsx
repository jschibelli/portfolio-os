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
        } else {
          alert('Invalid YouTube URL. Please try again.')
        }
      }
    },
  },
  {
    title: 'Tweet',
    description: 'Embed a Twitter/X post',
    icon: '🐦',
    command: (editor) => {
      const url = window.prompt('Enter Twitter/X post URL:')
      if (url) {
        const tweetId = extractTweetId(url)
        if (tweetId) {
          editor.chain().focus().insertContent({
            type: 'embed',
            attrs: { provider: 'tweet', url, id: tweetId }
          }).run()
        } else {
          alert('Invalid Twitter URL. Please try again.')
        }
      }
    },
  },
  {
    title: 'GitHub Gist',
    description: 'Embed a GitHub Gist',
    icon: '💻',
    command: (editor) => {
      const url = window.prompt('Enter GitHub Gist URL:')
      if (url) {
        const gistData = extractGitHubGistId(url)
        if (gistData) {
          editor.chain().focus().insertContent({
            type: 'embed',
            attrs: { 
              provider: 'github-gist', 
              url, 
              id: gistData.id,
              file: gistData.file 
            }
          }).run()
        } else {
          alert('Invalid GitHub Gist URL. Please try again.')
        }
      }
    },
  },
  {
    title: 'CodePen',
    description: 'Embed a CodePen demo',
    icon: '🖊️',
    command: (editor) => {
      const url = window.prompt('Enter CodePen URL:')
      if (url) {
        const penData = extractCodePenId(url)
        if (penData) {
          editor.chain().focus().insertContent({
            type: 'embed',
            attrs: { 
              provider: 'codepen', 
              url, 
              id: penData.id,
              user: penData.user,
              tab: penData.tab 
            }
          }).run()
        } else {
          alert('Invalid CodePen URL. Please try again.')
        }
      }
    },
  },
  {
    title: 'CodeSandbox',
    description: 'Embed a CodeSandbox project',
    icon: '📦',
    command: (editor) => {
      const url = window.prompt('Enter CodeSandbox URL:')
      if (url) {
        const sandboxId = extractCodeSandboxId(url)
        if (sandboxId) {
          editor.chain().focus().insertContent({
            type: 'embed',
            attrs: { provider: 'codesandbox', url, id: sandboxId }
          }).run()
        } else {
          alert('Invalid CodeSandbox URL. Please try again.')
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

/**
 * URL Extraction Utilities - Shared with Embed extension
 */

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function extractTweetId(url: string): string | null {
  const patterns = [
    /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
    /^(\d+)$/
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function extractGitHubGistId(url: string): { id: string; file?: string } | null {
  const fullPattern = /gist\.github\.com\/[\w-]+\/([a-f0-9]+)(?:#file-(.+))?/
  const fullMatch = url.match(fullPattern)
  if (fullMatch) {
    return { id: fullMatch[1], file: fullMatch[2] }
  }
  
  const idPattern = /^([a-f0-9]{32}|[a-f0-9]{20})$/
  const idMatch = url.match(idPattern)
  if (idMatch) {
    return { id: idMatch[1] }
  }
  return null
}

function extractCodePenId(url: string): { id: string; user?: string; tab?: string } | null {
  const fullPattern = /codepen\.io\/([\w-]+)\/(?:pen|embed)\/([a-zA-Z]{6,10})(?:\?default-tab=([^&]+))?/
  const fullMatch = url.match(fullPattern)
  if (fullMatch) {
    return { user: fullMatch[1], id: fullMatch[2], tab: fullMatch[3] || 'result' }
  }
  
  const idPattern = /^([a-zA-Z]{6,10})$/
  const idMatch = url.match(idPattern)
  if (idMatch) {
    return { id: idMatch[1], tab: 'result' }
  }
  return null
}

function extractCodeSandboxId(url: string): string | null {
  const patterns = [
    /codesandbox\.io\/(?:s|embed)\/([a-z0-9-]+)/,
    /^([a-z0-9-]+)$/
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}
