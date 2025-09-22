// /app/(admin)/admin/articles/_editor/extensions/Embed.tsx
// Embed extension for YouTube and Twitter embeds

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { EmbedProvider } from '@/lib/types/article'

export interface EmbedOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embed: {
      setEmbed: (attributes: { provider: EmbedProvider; url: string; id: string }) => ReturnType
    }
  }
}

export const Embed = Node.create<EmbedOptions>({
  name: 'embed',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      provider: {
        default: 'youtube',
        parseHTML: element => element.getAttribute('data-provider'),
        renderHTML: attributes => {
          if (!attributes.provider) {
            return {}
          }
          return {
            'data-provider': attributes.provider,
          }
        },
      },
      url: {
        default: '',
        parseHTML: element => element.getAttribute('data-url'),
        renderHTML: attributes => {
          if (!attributes.url) {
            return {}
          }
          return {
            'data-url': attributes.url,
          }
        },
      },
      id: {
        default: '',
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {}
          }
          return {
            'data-id': attributes.id,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="embed"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'embed' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedNodeView)
  },

  addCommands() {
    return {
      setEmbed:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          })
        },
    }
  },
})

// Embed Node View Component
import React, { useState } from 'react'
import { NodeViewWrapper } from '@tiptap/react'

interface EmbedNodeViewProps {
  node: {
    attrs: {
      provider: EmbedProvider
      url: string
      id: string
    }
  }
  updateAttributes: (attrs: any) => void
  deleteNode: () => void
}

function EmbedNodeView({ node, updateAttributes, deleteNode }: EmbedNodeViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [url, setUrl] = useState(node.attrs.url)

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    
    // Extract ID based on provider
    let newId = ''
    if (node.attrs.provider === 'youtube') {
      const videoId = extractYouTubeId(newUrl)
      if (videoId) {
        newId = videoId
      }
    } else if (node.attrs.provider === 'tweet') {
      const tweetId = extractTweetId(newUrl)
      if (tweetId) {
        newId = tweetId
      }
    }
    
    updateAttributes({ url: newUrl, id: newId })
  }

  const handleProviderChange = (provider: EmbedProvider) => {
    updateAttributes({ provider })
  }

  const renderEmbed = () => {
    switch (node.attrs.provider) {
      case 'youtube':
        return (
          <div className="relative w-full h-0 pb-[56.25%] my-6">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${node.attrs.id}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )
      case 'tweet':
        return (
          <div className="my-6 flex justify-center">
            <blockquote className="twitter-tweet">
              <a href={`https://twitter.com/x/status/${node.attrs.id}`}>
                Loading tweet...
              </a>
            </blockquote>
          </div>
        )
      default:
        return (
          <div className="bg-stone-100 border border-stone-200 rounded-lg p-4 my-6">
            <p className="text-stone-600">Unknown embed type: {node.attrs.provider}</p>
          </div>
        )
    }
  }

  return (
    <NodeViewWrapper className="my-4">
      <div className="border border-stone-200 rounded-lg p-4 bg-stone-50">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Provider
              </label>
              <select
                value={node.attrs.provider}
                onChange={(e) => handleProviderChange(e.target.value as EmbedProvider)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
              >
                <option value="youtube">YouTube</option>
                <option value="tweet">Twitter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={() => {
                  handleUrlChange(url)
                  setIsEditing(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlChange(url)
                    setIsEditing(false)
                  }
                }}
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
                placeholder={`Enter ${node.attrs.provider} URL...`}
                // autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleUrlChange(url)
                  setIsEditing(false)
                }}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-stone-300 text-stone-700 text-sm rounded hover:bg-stone-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-stone-700">
                  {node.attrs.provider === 'youtube' ? '📺' : '🐦'} {node.attrs.provider.toUpperCase()}
                </span>
                <span className="text-xs text-stone-500">
                  {node.attrs.id}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-stone-500 hover:text-stone-700 px-2 py-1 rounded hover:bg-stone-200"
                >
                  Edit
                </button>
                <button
                  onClick={deleteNode}
                  className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
            {node.attrs.id ? renderEmbed() : (
              <div className="bg-stone-100 border border-stone-200 rounded-lg p-4">
                <p className="text-stone-600 text-sm">
                  Invalid {node.attrs.provider} URL. Click Edit to fix.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

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
