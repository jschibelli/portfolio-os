// /app/(admin)/admin/articles/_editor/extensions/Callout.tsx
// Callout extension for Tiptap editor with React node view

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { CalloutVariant } from '@/lib/types/article'

export interface CalloutOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attributes: { variant?: CalloutVariant; title?: string }) => ReturnType
    }
  }
}

export const Callout = Node.create<CalloutOptions>({
  name: 'callout',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: 'block',

  content: 'block+',

  addAttributes() {
    return {
      variant: {
        default: 'info',
        parseHTML: element => element.getAttribute('data-variant'),
        renderHTML: attributes => {
          if (!attributes.variant) {
            return {}
          }
          return {
            'data-variant': attributes.variant,
          }
        },
      },
      title: {
        default: null,
        parseHTML: element => element.getAttribute('data-title'),
        renderHTML: attributes => {
          if (!attributes.title) {
            return {}
          }
          return {
            'data-title': attributes.title,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'callout' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutNodeView)
  },

  addCommands() {
    return {
      setCallout:
        (attributes) =>
        ({ commands }) => {
          return commands.wrapIn(this.name, attributes)
        },
    }
  },
})

// Callout Node View Component
import React, { useState } from 'react'
import { NodeViewWrapper } from '@tiptap/react'

interface CalloutNodeViewProps {
  node: {
    attrs: {
      variant: CalloutVariant
      title?: string
    }
  }
  updateAttributes: (attrs: any) => void
  deleteNode: () => void
}

function CalloutNodeView({ node, updateAttributes, deleteNode }: CalloutNodeViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(node.attrs.title || '')

  const variants = {
    info: {
      icon: 'ℹ️',
      className: 'border-blue-200 bg-blue-50',
      iconClassName: 'text-blue-600'
    },
    warn: {
      icon: '⚠️',
      className: 'border-yellow-200 bg-yellow-50',
      iconClassName: 'text-yellow-600'
    },
    success: {
      icon: '✅',
      className: 'border-green-200 bg-green-50',
      iconClassName: 'text-green-600'
    },
    error: {
      icon: '❌',
      className: 'border-red-200 bg-red-50',
      iconClassName: 'text-red-600'
    }
  }

  const config = variants[node.attrs.variant]

  const handleTitleSave = () => {
    updateAttributes({ title })
    setIsEditing(false)
  }

  const handleVariantChange = (variant: CalloutVariant) => {
    updateAttributes({ variant })
  }

  return (
    <NodeViewWrapper className="my-4">
      <div className={`rounded-lg border p-4 ${config.className}`}>
        <div className="flex items-start gap-3">
          <span className={`text-lg ${config.iconClassName}`}>
            {config.icon}
          </span>
          <div className="flex-1">
            {isEditing ? (
              <div className="mb-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTitleSave()
                    }
                  }}
                  className="w-full px-2 py-1 border border-stone-300 rounded text-sm font-semibold"
                  placeholder="Callout title..."
                  // autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                {node.attrs.title && (
                  <h4 className="font-semibold text-stone-900">{node.attrs.title}</h4>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-stone-500 hover:text-stone-700"
                >
                  {node.attrs.title ? 'Edit' : 'Add title'}
                </button>
              </div>
            )}
            
            <div className="prose prose-sm max-w-none">
              <div data-content-editable="true" />
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-stone-500">Variant:</span>
              {Object.entries(variants).map(([variant, config]) => (
                <button
                  key={variant}
                  onClick={() => handleVariantChange(variant as CalloutVariant)}
                  className={`px-2 py-1 rounded text-xs ${
                    node.attrs.variant === variant
                      ? 'bg-stone-200 text-stone-900'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {config.icon} {variant}
                </button>
              ))}
              <button
                onClick={deleteNode}
                className="text-red-500 hover:text-red-700 ml-auto"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  )
}
