// /app/(admin)/admin/articles/_editor/extensions/ReactComponentBlock.tsx
// React Component Block extension for custom components

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ComponentProps } from '@/lib/types/article'

export interface ReactComponentOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    reactComponent: {
      setReactComponent: (attributes: { name: string; props: ComponentProps }) => ReturnType
    }
  }
}

export const ReactComponentBlock = Node.create<ReactComponentOptions>({
  name: 'reactComponent',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: 'block',

  content: 'block*',

  addAttributes() {
    return {
      name: {
        default: '',
        parseHTML: element => element.getAttribute('data-name'),
        renderHTML: attributes => {
          if (!attributes.name) {
            return {}
          }
          return {
            'data-name': attributes.name,
          }
        },
      },
      props: {
        default: {},
        parseHTML: element => {
          const propsAttr = element.getAttribute('data-props')
          return propsAttr ? JSON.parse(propsAttr) : {}
        },
        renderHTML: attributes => {
          if (!attributes.props || Object.keys(attributes.props).length === 0) {
            return {}
          }
          return {
            'data-props': JSON.stringify(attributes.props),
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="react-component"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'react-component' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ReactComponentNodeView)
  },

  addCommands() {
    return {
      setReactComponent:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Component content here...' }]
              }
            ]
          })
        },
    }
  },
})

// React Component Node View Component
import React, { useState } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { COMPONENT_REGISTRY, ComponentName, getComponentNames, getComponentProps } from '../components/registry'

interface ReactComponentNodeViewProps {
  node: {
    attrs: {
      name?: string
      props?: ComponentProps
    }
  }
  updateAttributes: (attrs: any) => void
  deleteNode: () => void
}

function ReactComponentNodeView({ node, updateAttributes, deleteNode }: ReactComponentNodeViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [componentName, setComponentName] = useState(node.attrs.name || 'InfoCard')
  const [props, setProps] = useState<ComponentProps>(node.attrs.props || {})

  const handleSave = () => {
    updateAttributes({ name: componentName, props })
    setIsEditing(false)
  }

  const handlePropChange = (key: string, value: string) => {
    setProps(prev => ({ ...prev, [key]: value }))
  }

  const renderComponent = () => {
    if (!componentName || !COMPONENT_REGISTRY[componentName as ComponentName]) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">
            Unknown component: {componentName}
          </p>
        </div>
      )
    }

    try {
      const Component = COMPONENT_REGISTRY[componentName as ComponentName]
      const defaultProps = {
        title: 'Untitled',
        label: 'Label',
        value: 'Value',
        ...props
      }
      return <Component {...defaultProps} />
    } catch (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">
            Error rendering component: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      )
    }
  }

  const availableComponents = getComponentNames()
  const componentProps = componentName ? getComponentProps(componentName as ComponentName) : []

  return (
    <NodeViewWrapper className="my-4">
      <div className="border border-stone-200 rounded-lg p-4 bg-stone-50">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Component
              </label>
              <select
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
              >
                <option value="">Select a component...</option>
                {availableComponents.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {componentName && componentProps.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Properties
                </label>
                <div className="space-y-2">
                  {componentProps.map(prop => (
                    <div key={prop}>
                      <label className="block text-xs text-stone-600 mb-1">
                        {prop}
                      </label>
                      <input
                        type="text"
                        value={props[prop] as string || ''}
                        onChange={(e) => handlePropChange(prop, e.target.value)}
                        className="w-full px-2 py-1 border border-stone-300 rounded text-sm"
                        placeholder={`Enter ${prop}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSave}
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
                  ⚛️ {node.attrs.name}
                </span>
                {node.attrs.props && Object.keys(node.attrs.props).length > 0 && (
                  <span className="text-xs text-stone-500">
                    {Object.entries(node.attrs.props).map(([key, value]) => `${key}: ${value}`).join(', ')}
                  </span>
                )}
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
            
            <div className="border border-stone-200 rounded-lg p-4 bg-white">
              {renderComponent()}
            </div>
            
            <div className="mt-2 text-xs text-stone-500">
              <div data-content-editable="true" />
            </div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}
