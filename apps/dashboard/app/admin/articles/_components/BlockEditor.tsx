'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Type, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote,
  Code,
  Image,
  Link,
  Plus,
  Trash2,
  GripVertical
} from 'lucide-react'

interface Block {
  id: string
  type: 'text' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'orderedList' | 'quote' | 'code' | 'image' | 'callout'
  content: string
  placeholder?: string
}

interface BlockEditorProps {
  blocks: Array<{
    id: string
    type: 'text' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'orderedList' | 'quote' | 'code' | 'image' | 'callout'
    content: string
    placeholder?: string
  }>
  onChange: (blocks: Array<{
    id: string
    type: 'text' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'orderedList' | 'quote' | 'code' | 'image' | 'callout'
    content: string
    placeholder?: string
  }>) => void
  onSlashCommand: () => void
}

export function BlockEditor({ blocks, onChange, onSlashCommand }: BlockEditorProps) {
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null)
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const addBlock = (type: Block['type'], afterId?: string) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: '',
      placeholder: getPlaceholder(type)
    }

    if (afterId) {
      const index = blocks.findIndex(b => b.id === afterId)
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      onChange(newBlocks)
    } else {
      onChange([...blocks, newBlock])
    }

    // Focus the new block
    setTimeout(() => {
      const newBlockElement = blockRefs.current[newBlock.id]
      if (newBlockElement) {
        const input = newBlockElement.querySelector('input, textarea') as HTMLInputElement
        if (input) {
          input.focus()
        }
      }
    }, 0)
  }

  const updateBlock = (id: string, content: string) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? { ...block, content } : block
    )
    onChange(newBlocks)
  }

  const deleteBlock = (id: string) => {
    const newBlocks = blocks.filter(block => block.id !== id)
    onChange(newBlocks)
  }

  const getPlaceholder = (type: Block['type']): string => {
    switch (type) {
      case 'text': return 'Start writing with plain text...'
      case 'heading1': return 'Heading 1'
      case 'heading2': return 'Heading 2'
      case 'heading3': return 'Heading 3'
      case 'bulletList': return 'List item'
      case 'orderedList': return 'List item'
      case 'quote': return 'Quote'
      case 'code': return 'Enter code...'
      case 'image': return 'Image URL'
      case 'callout': return 'Callout text'
      default: return 'Type something...'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addBlock('text', blockId)
    } else if (e.key === 'Backspace' && blocks.length > 1) {
      const block = blocks.find(b => b.id === blockId)
      if (block && block.content === '') {
        e.preventDefault()
        deleteBlock(blockId)
      }
    } else if (e.key === '/') {
      e.preventDefault()
      onSlashCommand()
    }
  }

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'heading1':
        return (
          <input
            type="text"
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, block.id)}
            placeholder={block.placeholder}
            className="w-full text-3xl font-bold bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 resize-none"
          />
        )
      case 'heading2':
        return (
          <input
            type="text"
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, block.id)}
            placeholder={block.placeholder}
            className="w-full text-2xl font-semibold bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 resize-none"
          />
        )
      case 'heading3':
        return (
          <input
            type="text"
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, block.id)}
            placeholder={block.placeholder}
            className="w-full text-xl font-medium bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 resize-none"
          />
        )
      case 'quote':
        return (
          <div className="border-l-4 border-gray-300 pl-4">
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              placeholder={block.placeholder}
              className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 resize-none italic"
              rows={2}
            />
          </div>
        )
      case 'code':
        return (
          <div className="bg-gray-100 rounded-lg p-4">
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              placeholder={block.placeholder}
              className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 resize-none font-mono text-sm"
              rows={4}
            />
          </div>
        )
      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              placeholder={block.placeholder}
              className="w-full bg-transparent border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-400"
            />
            {block.content && (
              <img 
                src={block.content} 
                alt="Block content" 
                className="max-w-full h-auto rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
          </div>
        )
      case 'callout':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <div className="text-blue-600 font-bold">💡</div>
              <textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                placeholder={block.placeholder}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 resize-none"
                rows={2}
              />
            </div>
          </div>
        )
      default:
        return (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, block.id)}
            placeholder={block.placeholder}
            className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 resize-none"
            rows={1}
          />
        )
    }
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const isFocused = focusedBlockId === block.id
        return (
        <div
          key={block.id}
          ref={(el) => { blockRefs.current[block.id] = el }}
          className={`group relative p-2 rounded-lg transition-colors ${
            isFocused ? 'bg-gray-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => setFocusedBlockId(block.id)}
        >
          {/* Block Controls */}
          <div className="absolute left-0 top-0 -translate-x-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-gray-200"
                onClick={() => addBlock('text', block.id)}
              >
                <Plus className="w-3 h-3" />
              </Button>
              {blocks.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 hover:bg-red-200 text-red-600"
                  onClick={() => deleteBlock(block.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Block Content */}
          {renderBlock(block)}
        </div>
        )
      })}

      {/* Add First Block */}
      {blocks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">Start writing your article...</div>
          <Button
            variant="outline"
            onClick={() => addBlock('text')}
            className="text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add your first block
          </Button>
        </div>
      )}
    </div>
  )
}
