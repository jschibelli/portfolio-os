'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { 
  Type, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  CheckSquare,
  Quote,
  Code,
  Image,
  Link,
  Youtube,
  Twitter,
  Github,
  PenTool,
  Sparkles,
  FileText,
  Table,
  Minus,
  MoreHorizontal
} from 'lucide-react'

interface SlashCommandMenuProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (command: string, blockType?: string) => void
  position: { x: number; y: number }
}

export function SlashCommandMenu({ isOpen, onClose, onSelect, position }: SlashCommandMenuProps) {
  const [activeTab, setActiveTab] = useState<'Basic' | 'Advanced' | 'Media' | 'AI' | 'Embeds'>('Basic')
  const [menuPosition, setMenuPosition] = useState({ top: position.y, left: position.x })

  // Update position when position prop changes or window resizes
  useEffect(() => {
    if (isOpen) {
      const updatePosition = () => {
        const optimalPos = getOptimalPosition()
        setMenuPosition(optimalPos)
      }
      
      updatePosition()
      
      // Listen for window resize
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition)
      
      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition)
      }
    }
  }, [isOpen, position])

  if (!isOpen) return null

  // Calculate optimal positioning to avoid viewport cutoff
  const getOptimalPosition = () => {
    const menuHeight = 400 // Approximate menu height
    const menuWidth = 400 // Approximate menu width
    
    // Fallback for SSR or when window is not available
    if (typeof window === 'undefined') {
      return { top: position.y - menuHeight, left: position.x }
    }
    
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    
    let top = position.y
    let left = position.x
    
    // Check if menu would be cut off at the top
    if (position.y - menuHeight < 0) {
      // Position below the cursor instead
      top = position.y + 20
    } else {
      // Position above the cursor
      top = position.y - menuHeight
    }
    
    // Check if menu would be cut off at the bottom
    if (top + menuHeight > viewportHeight) {
      top = viewportHeight - menuHeight - 10
    }
    
    // Check if menu would be cut off at the right
    if (left + menuWidth > viewportWidth) {
      left = viewportWidth - menuWidth - 10
    }
    
    // Ensure menu doesn't go off the left edge
    if (left < 10) {
      left = 10
    }
    
    return { top, left }
  }

  const basicCommands = [
    { icon: Type, label: 'Text', description: 'Start writing with plain text', command: 'text', blockType: 'text' },
    { icon: Heading1, label: 'Heading 1', description: 'Big heading', command: 'h1', blockType: 'heading1' },
    { icon: Heading2, label: 'Heading 2', description: 'Medium heading', command: 'h2', blockType: 'heading2' },
    { icon: Heading3, label: 'Heading 3', description: 'Small heading', command: 'h3', blockType: 'heading3' },
    { icon: List, label: 'Bullet List', description: 'Create a simple bullet list', command: 'bulletList', blockType: 'bulletList' },
    { icon: ListOrdered, label: 'Numbered List', description: 'Create a simple numbered list', command: 'orderedList', blockType: 'orderedList' },
  ]

  const advancedCommands = [
    { icon: Code, label: 'Code', description: 'Add a code block', command: 'codeBlock', blockType: 'code' },
    { icon: Quote, label: 'Quote', description: 'Add a quote', command: 'blockquote', blockType: 'quote' },
    { icon: FileText, label: 'Details', description: 'Add a details summary block', command: 'details', blockType: 'text' },
    { icon: PenTool, label: 'Callout', description: 'Add a callout block', command: 'callout', blockType: 'callout' },
    { icon: MoreHorizontal, label: 'Widget', description: 'Add a Hashnode widget', command: 'widget', blockType: 'text' },
    { icon: Table, label: 'Table', description: 'Add a table content', command: 'table', blockType: 'text' },
  ]

  const mediaCommands = [
    { icon: Image, label: 'Image', description: 'Upload an image', command: 'image', blockType: 'image' },
    { icon: Type, label: 'Mention', description: 'Mention someone in this article', command: 'mention', blockType: 'text' },
  ]

  const aiCommands = [
    { icon: FileText, label: 'Generate article outline', description: 'Create a general article outline with Hashnode AI', command: 'aiOutline' },
    { icon: List, label: 'Summarize article', description: 'Summarize this article with Hashnode AI', command: 'aiSummarize' },
    { icon: Code, label: 'Generate Code', description: 'Generate a code block with Hashnode AI', command: 'aiCode' },
  ]

  const embedCommands = [
    { icon: Youtube, label: 'Embed a link', description: 'Embed a media of iFrame link', command: 'embedLink' },
    { icon: Youtube, label: 'YouTube', description: 'Embed YouTube video', command: 'youtube' },
    { icon: Twitter, label: 'Twitter / X', description: 'Embed post', command: 'twitter' },
    { icon: Github, label: 'GitHub Gist', description: 'Embed GitHub gist', command: 'githubGist' },
    { icon: Code, label: 'CodePen', description: 'Embed CodePen', command: 'codepen' },
    { icon: Code, label: 'CodeSandbox', description: 'Embed CodeSandbox', command: 'codesandbox' },
  ]

  const getCommands = () => {
    switch (activeTab) {
      case 'Basic': return basicCommands
      case 'Advanced': return advancedCommands
      case 'Media': return mediaCommands
      case 'AI': return aiCommands
      case 'Embeds': return embedCommands
      default: return basicCommands
    }
  }

  const handleCommandSelect = (command: string, blockType?: string) => {
    onSelect(command, blockType)
    onClose()
  }

  const menuContent = (
    <div 
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl max-w-md"
      style={{ 
        left: menuPosition.left, 
        top: menuPosition.top
      }}
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['Basic', 'Advanced', 'Media', 'AI', 'Embeds'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-gray-900 bg-gray-50 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Commands */}
      <div className="p-2 max-h-80 overflow-y-auto">
        {getCommands().map((cmd, index) => (
          <button
            key={index}
            onClick={() => handleCommandSelect(cmd.command, cmd.blockType)}
            className="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
              <cmd.icon className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="text-gray-900 font-medium">{cmd.label}</div>
              <div className="text-gray-600 text-sm">{cmd.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  // Use portal to render at document body level to avoid z-index issues
  if (typeof window !== 'undefined') {
    return createPortal(menuContent, document.body)
  }
  
  return menuContent
}
