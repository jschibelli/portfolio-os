/**
 * Enhanced Slash Command Menu
 * Hashnode-style slash command interface with search, categories, and quick actions
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Code, Image, Video, Quote, List, Table, Link, Type, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { blockRegistry, getBlocksByCategory, BLOCK_CATEGORIES } from '@/lib/blocks/registry';

interface SlashCommand {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  shortcut?: string;
  action: () => void;
}

interface EnhancedSlashCommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (command: string, blockType?: string) => void;
  position: { x: number; y: number };
  editorRef?: React.RefObject<HTMLDivElement>;
}

export function EnhancedSlashCommandMenu({
  isOpen,
  onClose,
  onSelect,
  position,
  editorRef
}: EnhancedSlashCommandMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState<SlashCommand[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate commands from block registry
  const generateCommands = (): SlashCommand[] => {
    const commands: SlashCommand[] = [];

    // Add block commands
    Object.entries(blockRegistry).forEach(([key, block]) => {
      commands.push({
        id: `block-${key}`,
        title: block.name,
        description: block.description,
        icon: block.icon,
        category: block.category,
        action: () => onSelect('insert-block', key)
      });
    });

    // Add formatting commands
    const formattingCommands: SlashCommand[] = [
      {
        id: 'heading-1',
        title: 'Heading 1',
        description: 'Large heading',
        icon: Type,
        category: 'Text',
        shortcut: '#',
        action: () => onSelect('format', 'heading1')
      },
      {
        id: 'heading-2',
        title: 'Heading 2',
        description: 'Medium heading',
        icon: Type,
        category: 'Text',
        shortcut: '##',
        action: () => onSelect('format', 'heading2')
      },
      {
        id: 'heading-3',
        title: 'Heading 3',
        description: 'Small heading',
        icon: Type,
        category: 'Text',
        shortcut: '###',
        action: () => onSelect('format', 'heading3')
      },
      {
        id: 'bullet-list',
        title: 'Bullet List',
        description: 'Create a bulleted list',
        icon: List,
        category: 'Text',
        shortcut: '-',
        action: () => onSelect('format', 'bulletList')
      },
      {
        id: 'numbered-list',
        title: 'Numbered List',
        description: 'Create a numbered list',
        icon: List,
        category: 'Text',
        shortcut: '1.',
        action: () => onSelect('format', 'orderedList')
      },
      {
        id: 'quote',
        title: 'Quote',
        description: 'Add a quote block',
        icon: Quote,
        category: 'Text',
        shortcut: '>',
        action: () => onSelect('format', 'quote')
      },
      {
        id: 'code-block',
        title: 'Code Block',
        description: 'Add a code block',
        icon: Code,
        category: 'Code',
        shortcut: '```',
        action: () => onSelect('format', 'codeBlock')
      },
      {
        id: 'table',
        title: 'Table',
        description: 'Insert a table',
        icon: Table,
        category: 'Layout',
        action: () => onSelect('format', 'table')
      },
      {
        id: 'link',
        title: 'Link',
        description: 'Add a link',
        icon: Link,
        category: 'Text',
        shortcut: 'Ctrl+K',
        action: () => onSelect('format', 'link')
      },
      {
        id: 'image',
        title: 'Image',
        description: 'Insert an image',
        icon: Image,
        category: 'Media',
        shortcut: 'Ctrl+Shift+I',
        action: () => onSelect('format', 'image')
      },
      {
        id: 'video',
        title: 'Video',
        description: 'Embed a video',
        icon: Video,
        category: 'Media',
        action: () => onSelect('format', 'video')
      }
    ];

    return [...commands, ...formattingCommands];
  };

  const allCommands = generateCommands();

  // Filter commands based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCommands(allCommands);
    } else {
      const filtered = allCommands.filter(command =>
        command.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        command.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        command.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCommands(filtered);
    }
    setSelectedIndex(0);
  }, [searchQuery, allCommands]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Focus input when menu opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, SlashCommand[]>);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg"
      style={{
        left: position.x,
        top: position.y,
        maxHeight: '400px'
      }}
    >
      {/* Search Input */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commands..."
            className="pl-10 border-0 focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Commands List */}
      <ScrollArea className="max-h-80">
        <div className="p-2">
          {Object.entries(groupedCommands).map(([category, commands]) => (
            <div key={category} className="mb-4">
              <div className="flex items-center gap-2 px-2 py-1 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
                <span className="text-xs text-gray-500">
                  {commands.length} command{commands.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-1">
                {commands.map((command, index) => {
                  const globalIndex = filteredCommands.findIndex(c => c.id === command.id);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <Button
                      key={command.id}
                      variant={isSelected ? "default" : "ghost"}
                      className={`w-full justify-start h-auto p-3 ${
                        isSelected ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => {
                        command.action();
                        onClose();
                      }}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <command.icon className="h-4 w-4 mt-0.5 text-gray-600" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{command.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {command.description}
                          </div>
                          {command.shortcut && (
                            <div className="text-xs text-gray-400 mt-1">
                              Shortcut: {command.shortcut}
                            </div>
                          )}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>Enter Select</span>
            <span>Esc Close</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>Enhanced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
