'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Type, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4,
  Heading5,
  Heading6,
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
  MoreHorizontal,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Calendar,
  BarChart3,
  Zap,
  Globe,
  Hash,
  MessageSquare,
  BookOpen,
  Layers,
  Grid3X3,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface SlashCommandMenuProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (command: string, blockType?: string) => void
  position: { x: number; y: number }
}

interface CommandItem {
  icon: any
  label: string
  description: string
  command: string
  blockType: string
  category?: string
  keywords?: string[]
}

export function SlashCommandMenu({ isOpen, onClose, onSelect, position }: SlashCommandMenuProps) {
  const [activeTab, setActiveTab] = useState<'Basic' | 'Advanced' | 'Media' | 'Interactive' | 'Custom' | 'AI' | 'Embeds'>('Basic')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Focus search input when menu opens
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isOpen])

  // Adjust position if menu would be cut off by viewport
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menu = menuRef.current
      const rect = menu.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      
      // Check if menu extends beyond viewport
      if (rect.top < 20) {
        // Menu is too high, adjust position
        const newTop = Math.max(20, position.y + 50)
        menu.style.top = `${newTop}px`
      }
      
      if (rect.right > viewportWidth - 20) {
        // Menu extends beyond right edge
        menu.style.left = `${viewportWidth - rect.width - 20}px`
      }
      
      if (rect.left < 20) {
        // Menu extends beyond left edge
        menu.style.left = '20px'
      }
    }
  }, [isOpen, position])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      const commands = getFilteredCommands()
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % commands.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + commands.length) % commands.length)
          break
        case 'Enter':
          e.preventDefault()
          if (commands[selectedIndex]) {
            console.log('Keyboard Enter pressed:', { command: commands[selectedIndex].command, blockType: commands[selectedIndex].blockType })
            handleCommandSelect(commands[selectedIndex].command, commands[selectedIndex].blockType)
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex])

  // Early return moved after all hooks to prevent hooks order issues

  // Enhanced command definitions with all block types
  const basicCommands: CommandItem[] = [
    { icon: Type, label: 'Text', description: 'Start writing with plain text', command: 'text', blockType: 'text', keywords: ['text', 'paragraph', 'write'] },
    { icon: Heading1, label: 'Heading 1', description: 'Big heading', command: 'h1', blockType: 'heading1', keywords: ['h1', 'title', 'main'] },
    { icon: Heading2, label: 'Heading 2', description: 'Medium heading', command: 'h2', blockType: 'heading2', keywords: ['h2', 'subtitle', 'section'] },
    { icon: Heading3, label: 'Heading 3', description: 'Small heading', command: 'h3', blockType: 'heading3', keywords: ['h3', 'subsection'] },
    { icon: Heading4, label: 'Heading 4', description: 'Smaller heading', command: 'h4', blockType: 'heading4', keywords: ['h4'] },
    { icon: Heading5, label: 'Heading 5', description: 'Tiny heading', command: 'h5', blockType: 'heading5', keywords: ['h5'] },
    { icon: Heading6, label: 'Heading 6', description: 'Smallest heading', command: 'h6', blockType: 'heading6', keywords: ['h6'] },
    { icon: List, label: 'Bullet List', description: 'Create a simple bullet list', command: 'bulletList', blockType: 'bulletList', keywords: ['bullet', 'list', 'ul'] },
    { icon: ListOrdered, label: 'Numbered List', description: 'Create a simple numbered list', command: 'orderedList', blockType: 'orderedList', keywords: ['numbered', 'ol', 'ordered'] },
    { icon: CheckSquare, label: 'Task List', description: 'Create a task list with checkboxes', command: 'taskList', blockType: 'taskList', keywords: ['task', 'todo', 'checkbox', 'checklist'] },
  ]

  const advancedCommands: CommandItem[] = [
    { icon: Code, label: 'Code Block', description: 'Add a code block with syntax highlighting', command: 'codeBlock', blockType: 'code', keywords: ['code', 'syntax', 'programming'] },
    { icon: Quote, label: 'Quote', description: 'Add a blockquote', command: 'blockquote', blockType: 'quote', keywords: ['quote', 'citation', 'blockquote'] },
    { icon: Minus, label: 'Divider', description: 'Add a horizontal divider', command: 'horizontalRule', blockType: 'horizontalRule', keywords: ['divider', 'line', 'separator'] },
    { icon: FileText, label: 'Details/Summary', description: 'Add a collapsible details block', command: 'details', blockType: 'details', keywords: ['details', 'summary', 'collapsible', 'expandable'] },
  ]

  const calloutCommands: CommandItem[] = [
    { icon: Info, label: 'Info Callout', description: 'Add an informational callout', command: 'calloutInfo', blockType: 'callout', keywords: ['info', 'information', 'note'] },
    { icon: AlertTriangle, label: 'Warning Callout', description: 'Add a warning callout', command: 'calloutWarning', blockType: 'callout', keywords: ['warning', 'alert', 'caution'] },
    { icon: CheckCircle, label: 'Success Callout', description: 'Add a success callout', command: 'calloutSuccess', blockType: 'callout', keywords: ['success', 'check', 'done'] },
    { icon: XCircle, label: 'Error Callout', description: 'Add an error callout', command: 'calloutError', blockType: 'callout', keywords: ['error', 'danger', 'fail'] },
  ]

  const mediaCommands: CommandItem[] = [
    { icon: Image, label: 'Image', description: 'Upload an image', command: 'image', blockType: 'image', keywords: ['image', 'photo', 'picture', 'upload'] },
    { icon: Type, label: 'Mention', description: 'Mention someone in this article', command: 'mention', blockType: 'mention', keywords: ['mention', 'user', 'person'] },
  ]

  const interactiveCommands: CommandItem[] = [
    { icon: Table, label: 'Table', description: 'Add a table with rows and columns', command: 'table', blockType: 'table', keywords: ['table', 'grid', 'data'] },
    { icon: FileText, label: 'Details/Summary', description: 'Add a collapsible details block', command: 'details', blockType: 'details', keywords: ['details', 'summary', 'collapsible'] },
    { icon: MoreHorizontal, label: 'Widget', description: 'Add a Hashnode widget', command: 'widget', blockType: 'widget', keywords: ['widget', 'component', 'custom'] },
  ]

  const customCommands: CommandItem[] = [
    { icon: Layers, label: 'React Component', description: 'Add a custom React component', command: 'reactComponent', blockType: 'reactComponent', keywords: ['react', 'component', 'custom'] },
    { icon: BarChart3, label: 'InfoCard', description: 'Add an information card', command: 'infoCard', blockType: 'infoCard', keywords: ['card', 'info', 'statistics'] },
    { icon: Hash, label: 'StatBadge', description: 'Add a statistics badge', command: 'statBadge', blockType: 'statBadge', keywords: ['badge', 'stat', 'metric'] },
  ]

  const aiCommands: CommandItem[] = [
    { icon: FileText, label: 'Generate Article Outline', description: 'Create a general article outline with Hashnode AI', command: 'aiOutline', blockType: 'text', keywords: ['ai', 'outline', 'structure'] },
    { icon: List, label: 'Summarize Article', description: 'Summarize this article with Hashnode AI', command: 'aiSummarize', blockType: 'text', keywords: ['ai', 'summary', 'summarize'] },
    { icon: Code, label: 'Generate Code', description: 'Generate a code block with Hashnode AI', command: 'aiCode', blockType: 'code', keywords: ['ai', 'code', 'generate'] },
    { icon: Sparkles, label: 'AI Writing Assistant', description: 'Get AI help with writing', command: 'aiWriting', blockType: 'text', keywords: ['ai', 'writing', 'assistant', 'help'] },
  ]

  const embedCommands: CommandItem[] = [
    { icon: Youtube, label: 'YouTube', description: 'Embed YouTube video', command: 'youtube', blockType: 'youtube', keywords: ['youtube', 'video', 'embed'] },
    { icon: Twitter, label: 'Twitter / X', description: 'Embed Twitter/X post', command: 'twitter', blockType: 'twitter', keywords: ['twitter', 'x', 'tweet', 'post'] },
    { icon: Github, label: 'GitHub Gist', description: 'Embed GitHub gist', command: 'githubGist', blockType: 'githubGist', keywords: ['github', 'gist', 'code'] },
    { icon: Code, label: 'CodePen', description: 'Embed CodePen', command: 'codepen', blockType: 'codepen', keywords: ['codepen', 'pen', 'demo'] },
    { icon: Code, label: 'CodeSandbox', description: 'Embed CodeSandbox', command: 'codesandbox', blockType: 'codesandbox', keywords: ['codesandbox', 'sandbox', 'demo'] },
    { icon: Globe, label: 'Generic Embed', description: 'Embed any iframe link', command: 'embedLink', blockType: 'embed', keywords: ['embed', 'iframe', 'link'] },
  ]

  const getCommands = () => {
    switch (activeTab) {
      case 'Basic': return basicCommands
      case 'Advanced': return [...advancedCommands, ...calloutCommands]
      case 'Media': return mediaCommands
      case 'Interactive': return interactiveCommands
      case 'Custom': return customCommands
      case 'AI': return aiCommands
      case 'Embeds': return embedCommands
      default: return basicCommands
    }
  }

  // Search functionality
  const getFilteredCommands = () => {
    const commands = getCommands()
    if (!searchQuery.trim()) return commands
    
    const query = searchQuery.toLowerCase()
    return commands.filter(cmd => 
      cmd.label.toLowerCase().includes(query) ||
      cmd.description.toLowerCase().includes(query) ||
      cmd.keywords?.some(keyword => keyword.toLowerCase().includes(query))
    )
  }

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery, activeTab])

  const handleCommandSelect = (command: string, blockType?: string) => {
    console.log('SlashCommandMenu: handleCommandSelect called', { command, blockType })
    onSelect(command, blockType)
    onClose()
  }

  const filteredCommands = getFilteredCommands()

  if (!isOpen) return null

  return (
    <div 
      ref={menuRef}
      className="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-md w-80"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translateY(-100%)',
        // Ensure menu is always visible within viewport
        maxHeight: 'calc(100vh - 20px)',
        overflow: 'hidden'
      }}
    >
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-800 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 overflow-x-auto">
        {(['Basic', 'Advanced', 'Media', 'Interactive', 'Custom', 'AI', 'Embeds'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'text-white bg-gray-700 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Commands */}
      <div className="p-2 max-h-80 overflow-y-auto">
        {filteredCommands.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No commands found for "{searchQuery}"
          </div>
        ) : (
          filteredCommands.map((cmd, index) => (
            <button
              key={`${cmd.command}-${index}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Button clicked:', { command: cmd.command, blockType: cmd.blockType })
                handleCommandSelect(cmd.command, cmd.blockType)
              }}
              className={`w-full flex items-center gap-3 p-2 rounded transition-colors text-left ${
                index === selectedIndex
                  ? 'bg-blue-600 border border-blue-500'
                  : 'hover:bg-gray-700'
              }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded ${
                index === selectedIndex ? 'bg-blue-500' : 'bg-gray-600'
              }`}>
                <cmd.icon className={`w-4 h-4 ${
                  index === selectedIndex ? 'text-white' : 'text-gray-300'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${
                  index === selectedIndex ? 'text-white' : 'text-white'
                }`}>
                  {cmd.label}
                </div>
                <div className={`text-sm ${
                  index === selectedIndex ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {cmd.description}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer with keyboard shortcuts */}
      <div className="px-3 py-2 bg-gray-700 border-t border-gray-600 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>↑↓ Navigate</span>
          <span>Enter Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  )
}
