// /app/(admin)/admin/articles/_editor/extensions/Embed.tsx
// Comprehensive Embed extension for all major platforms (Phase 1: Developer Embeds)
// Supports: YouTube, Twitter, GitHub Gist, CodePen, CodeSandbox, and generic oEmbed

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { EmbedProvider } from '@/lib/types/article'

export interface EmbedOptions {
  HTMLAttributes: Record<string, any>
}

/**
 * Supported embed providers for Phase 1
 * - youtube: YouTube videos
 * - twitter: Twitter/X posts
 * - github-gist: GitHub Gists with syntax highlighting
 * - codepen: CodePen demos
 * - codesandbox: CodeSandbox projects
 * - generic: Generic oEmbed protocol support
 */
export type ExtendedEmbedProvider = 
  | 'youtube' 
  | 'twitter' 
  | 'github-gist' 
  | 'codepen' 
  | 'codesandbox' 
  | 'generic'

/**
 * Constants for URL validation
 */
const GIST_ID_LENGTH_SHORT = 20 // Shortened Gist IDs
const GIST_ID_LENGTH_LONG = 32 // Full-length Gist IDs
const OEMBED_FETCH_TIMEOUT = 10000 // 10 seconds timeout for oEmbed requests

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
import React, { useState, useEffect, useRef } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import DOMPurify from 'dompurify'

interface EmbedNodeViewProps {
  node: {
    attrs: {
      provider?: EmbedProvider
      url?: string
      id?: string
    }
  }
  updateAttributes: (attrs: any) => void
  deleteNode: () => void
}

function EmbedNodeView({ node, updateAttributes, deleteNode }: EmbedNodeViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [url, setUrl] = useState(node.attrs.url || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [oembedData, setOembedData] = useState<any>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const twitterScriptLoadedRef = useRef(false)

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    
    // Extract ID based on provider with comprehensive platform support
    let newId = ''
    let metadata: any = {}
    
    switch (node.attrs.provider) {
      case 'youtube': {
        const videoId = extractYouTubeId(newUrl)
        if (videoId) newId = videoId
        break
      }
      case 'tweet': {
        const tweetId = extractTweetId(newUrl)
        if (tweetId) newId = tweetId
        break
      }
      case 'github-gist': {
        const gistData = extractGitHubGistId(newUrl)
        if (gistData) {
          newId = gistData.id
          if (gistData.file) metadata.file = gistData.file
        }
        break
      }
      case 'codepen': {
        const codepenData = extractCodePenId(newUrl)
        if (codepenData) {
          newId = codepenData.id
          if (codepenData.user) metadata.user = codepenData.user
          if (codepenData.tab) metadata.tab = codepenData.tab
        }
        break
      }
      case 'codesandbox': {
        const sandboxId = extractCodeSandboxId(newUrl)
        if (sandboxId) newId = sandboxId
        break
      }
      case 'generic': {
        // For generic embeds, use the full URL as ID
        newId = newUrl
        break
      }
    }
    
    updateAttributes({ url: newUrl, id: newId, ...metadata })
  }

  const handleProviderChange = (provider: EmbedProvider) => {
    updateAttributes({ provider })
    // Reset oEmbed data when provider changes
    setOembedData(null)
    setError(null)
  }

  /**
   * Fetch oEmbed data for generic embeds
   * Automatically loads preview when URL is set and provider is generic
   * Includes timeout handling and proper cleanup
   */
  useEffect(() => {
    if (node.attrs.provider === 'generic' && node.attrs.url && !isEditing) {
      // Abort any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      const fetchOEmbed = async () => {
        setIsLoading(true)
        setError(null)
        
        // Create AbortController for timeout
        const controller = new AbortController()
        abortControllerRef.current = controller
        
        const timeoutId = setTimeout(() => {
          controller.abort()
        }, OEMBED_FETCH_TIMEOUT)
        
        try {
          const response = await fetch(
            `/api/embed/oembed?url=${encodeURIComponent(node.attrs.url)}`,
            { signal: controller.signal }
          )
          const data = await response.json()
          
          if (data.success) {
            setOembedData(data.data)
          } else {
            setError(data.error || 'Failed to load embed')
          }
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') {
            setError('Request timed out. The embed service may be slow or unavailable.')
          } else {
            setError('Network error while loading embed')
          }
          console.error('oEmbed fetch error:', err)
        } finally {
          clearTimeout(timeoutId)
          setIsLoading(false)
        }
      }
      
      fetchOEmbed()
      
      // Cleanup on unmount
      return () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
      }
    }
  }, [node.attrs.provider, node.attrs.url, isEditing])

  /**
   * Render embed based on provider
   * Comprehensive renderer for all supported platforms with responsive design
   */
  const renderEmbed = () => {
    const provider = node.attrs.provider || 'youtube'
    const attrs = node.attrs
    
    switch (provider) {
      case 'youtube':
        return (
          <div className="relative w-full h-0 pb-[56.25%] my-6 bg-black rounded-lg overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${attrs.id}?rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )
        
      case 'tweet':
        // Load Twitter widget script only once
        if (!twitterScriptLoadedRef.current && typeof window !== 'undefined') {
          const script = document.createElement('script')
          script.src = 'https://platform.twitter.com/widgets.js'
          script.async = true
          script.charset = 'utf-8'
          
          // Check if script already exists
          if (!document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')) {
            document.body.appendChild(script)
            twitterScriptLoadedRef.current = true
          }
        }
        
        return (
          <div className="my-6 flex justify-center">
            <blockquote className="twitter-tweet" data-theme="light">
              <a href={`https://twitter.com/x/status/${attrs.id}`}>
                Loading tweet...
              </a>
            </blockquote>
          </div>
        )
        
      case 'github-gist':
        return (
          <div className="my-6">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <script src={`https://gist.github.com/${attrs.id}.js${attrs.file ? `?file=${attrs.file}` : ''}`}></script>
              <noscript>
                <div className="p-4 bg-gray-50">
                  <a 
                    href={`https://gist.github.com/${attrs.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View this gist on GitHub
                  </a>
                </div>
              </noscript>
            </div>
          </div>
        )
        
      case 'codepen':
        return (
          <div className="my-6">
            <div className="relative w-full h-0 pb-[60%] bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                scrolling="no"
                title="CodePen Embed"
                src={`https://codepen.io/${attrs.user || 'team'}/embed/${attrs.id}?default-tab=${attrs.tab || 'result'}&theme-id=dark`}
                frameBorder="0"
                loading="lazy"
                allowFullScreen
              />
            </div>
            <div className="text-center mt-2">
              <a 
                href={`https://codepen.io/${attrs.user || 'team'}/pen/${attrs.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                See the Pen on CodePen
              </a>
            </div>
          </div>
        )
        
      case 'codesandbox':
        return (
          <div className="my-6">
            <div className="relative w-full h-0 pb-[75%] bg-black rounded-lg overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://codesandbox.io/embed/${attrs.id}?fontsize=14&hidenavigation=1&theme=dark&view=preview`}
                title="CodeSandbox Embed"
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                loading="lazy"
              />
            </div>
            <div className="text-center mt-2">
              <a 
                href={`https://codesandbox.io/s/${attrs.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Open in CodeSandbox
              </a>
            </div>
          </div>
        )
        
      case 'generic':
        // Render oEmbed content if available
        if (isLoading) {
          return (
            <div className="my-6 p-8 border border-gray-300 rounded-lg bg-white flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-600">Loading embed preview...</span>
              </div>
            </div>
          )
        }
        
        if (error) {
          return (
            <div className="my-6 p-4 border border-red-300 rounded-lg bg-red-50">
              <p className="text-sm text-red-700 font-medium">Failed to load embed</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
              <a 
                href={attrs.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm break-all mt-2 block"
              >
                {attrs.url}
              </a>
            </div>
          )
        }
        
        if (oembedData?.html) {
          // Sanitize oEmbed HTML to prevent XSS attacks
          const sanitizedHtml = DOMPurify.sanitize(oembedData.html, {
            ALLOWED_TAGS: ['iframe', 'blockquote', 'a', 'p', 'div', 'span', 'img'],
            ALLOWED_ATTR: ['src', 'href', 'title', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'class', 'id', 'data-*'],
            ALLOW_DATA_ATTR: true
          })
          
          return (
            <div className="my-6">
              <div 
                className="border border-gray-300 rounded-lg overflow-hidden"
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
              {oembedData.title && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {oembedData.title}
                  {oembedData.author && ` by ${oembedData.author}`}
                </p>
              )}
            </div>
          )
        }
        
        return (
          <div className="my-6">
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-700 mb-2 font-medium">🌐 Generic Embed</p>
              <a 
                href={attrs.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm break-all"
              >
                {attrs.url}
              </a>
              <p className="text-xs text-gray-500 mt-2">
                oEmbed preview will load when published
              </p>
            </div>
          </div>
        )
        
      default:
        return (
          <div className="bg-stone-100 border border-stone-200 rounded-lg p-4 my-6">
            <p className="text-stone-600">Unknown embed type: {provider}</p>
            <p className="text-xs text-stone-500 mt-1">URL: {attrs.url}</p>
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
                value={node.attrs.provider || 'youtube'}
                onChange={(e) => handleProviderChange(e.target.value as EmbedProvider)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
              >
                <option value="youtube">📺 YouTube</option>
                <option value="tweet">🐦 Twitter/X</option>
                <option value="github-gist">💻 GitHub Gist</option>
                <option value="codepen">🖊️ CodePen</option>
                <option value="codesandbox">📦 CodeSandbox</option>
                <option value="generic">🌐 Generic (oEmbed)</option>
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
                placeholder={`Enter ${node.attrs.provider || 'youtube'} URL...`}
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
                  {(node.attrs.provider || 'youtube') === 'youtube' ? '📺' : '🐦'} {(node.attrs.provider || 'youtube').toUpperCase()}
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
                  Invalid {node.attrs.provider || 'youtube'} URL. Click Edit to fix.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

/**
 * URL Extraction Utilities
 * Robust extractors for each embed platform with comprehensive pattern matching
 */

/**
 * Extract YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, etc.
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct ID
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Extract Twitter/X post ID from URL
 * Supports: twitter.com and x.com URLs
 */
function extractTweetId(url: string): string | null {
  const patterns = [
    /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
    /^(\d+)$/ // Direct ID
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Extract GitHub Gist ID and optional file from URL
 * Supports: gist.github.com/username/gist-id, gist-id only
 * Returns: { id: string, file?: string }
 */
function extractGitHubGistId(url: string): { id: string; file?: string } | null {
  // Full URL: https://gist.github.com/username/abc123def456#file-example-js
  const fullPattern = /gist\.github\.com\/[\w-]+\/([a-f0-9]+)(?:#file-(.+))?/
  const fullMatch = url.match(fullPattern)
  if (fullMatch) {
    return {
      id: fullMatch[1],
      file: fullMatch[2]
    }
  }
  
  // Just ID: abc123def456
  const idPattern = new RegExp(`^([a-f0-9]{${GIST_ID_LENGTH_LONG}}|[a-f0-9]{${GIST_ID_LENGTH_SHORT}})$`)
  const idMatch = url.match(idPattern)
  if (idMatch) {
    return { id: idMatch[1] }
  }
  
  return null
}

/**
 * Extract CodePen ID and optional tab from URL
 * Supports: codepen.io/username/pen/ID, ID only
 */
function extractCodePenId(url: string): { id: string; user?: string; tab?: string } | null {
  // Full URL: https://codepen.io/username/pen/abcDEF?default-tab=html,result
  const fullPattern = /codepen\.io\/([\w-]+)\/(?:pen|embed)\/([a-zA-Z]{6,10})(?:\?default-tab=([^&]+))?/
  const fullMatch = url.match(fullPattern)
  if (fullMatch) {
    return {
      user: fullMatch[1],
      id: fullMatch[2],
      tab: fullMatch[3] || 'result'
    }
  }
  
  // Just ID
  const idPattern = /^([a-zA-Z]{6,10})$/
  const idMatch = url.match(idPattern)
  if (idMatch) {
    return { id: idMatch[1], tab: 'result' }
  }
  
  return null
}

/**
 * Extract CodeSandbox ID from URL
 * Supports: codesandbox.io/s/ID, codesandbox.io/embed/ID
 */
function extractCodeSandboxId(url: string): string | null {
  const patterns = [
    /codesandbox\.io\/(?:s|embed)\/([a-z0-9-]+)/,
    /^([a-z0-9-]+)$/ // Direct ID
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}
