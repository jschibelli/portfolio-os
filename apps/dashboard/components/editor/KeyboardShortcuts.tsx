/**
 * Keyboard Shortcuts System
 * Hashnode-style keyboard shortcuts with help modal and customization
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Command, Keyboard, X, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Shortcut {
  id: string;
  key: string;
  description: string;
  category: string;
  action: () => void;
  global?: boolean;
}

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
  onSlashCommand: () => void;
  onInsertBlock: (blockType: string) => void;
  onTogglePreview: () => void;
  onToggleLibrary: () => void;
  onSave: () => void;
  onPublish: () => void;
}

export function KeyboardShortcuts({
  isOpen,
  onClose,
  onSlashCommand,
  onInsertBlock,
  onTogglePreview,
  onToggleLibrary,
  onSave,
  onPublish
}: KeyboardShortcutsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Define all available shortcuts
  const shortcuts: Shortcut[] = [
    // Editor Commands
    {
      id: 'slash-command',
      key: '/',
      description: 'Open slash command menu',
      category: 'Editor',
      action: onSlashCommand
    },
    {
      id: 'toggle-preview',
      key: 'Ctrl+Shift+P',
      description: 'Toggle live preview',
      category: 'Editor',
      action: onTogglePreview
    },
    {
      id: 'toggle-library',
      key: 'Ctrl+Shift+L',
      description: 'Toggle component library',
      category: 'Editor',
      action: onToggleLibrary
    },
    
    // Formatting
    {
      id: 'bold',
      key: 'Ctrl+B',
      description: 'Toggle bold',
      category: 'Formatting',
      action: () => {}
    },
    {
      id: 'italic',
      key: 'Ctrl+I',
      description: 'Toggle italic',
      category: 'Formatting',
      action: () => {}
    },
    {
      id: 'underline',
      key: 'Ctrl+U',
      description: 'Toggle underline',
      category: 'Formatting',
      action: () => {}
    },
    {
      id: 'strikethrough',
      key: 'Ctrl+Shift+S',
      description: 'Toggle strikethrough',
      category: 'Formatting',
      action: () => {}
    },
    {
      id: 'code',
      key: 'Ctrl+E',
      description: 'Toggle inline code',
      category: 'Formatting',
      action: () => {}
    },
    {
      id: 'link',
      key: 'Ctrl+K',
      description: 'Add/edit link',
      category: 'Formatting',
      action: () => {}
    },
    
    // Headings
    {
      id: 'heading-1',
      key: 'Ctrl+Alt+1',
      description: 'Heading 1',
      category: 'Headings',
      action: () => onInsertBlock('heading1')
    },
    {
      id: 'heading-2',
      key: 'Ctrl+Alt+2',
      description: 'Heading 2',
      category: 'Headings',
      action: () => onInsertBlock('heading2')
    },
    {
      id: 'heading-3',
      key: 'Ctrl+Alt+3',
      description: 'Heading 3',
      category: 'Headings',
      action: () => onInsertBlock('heading3')
    },
    
    // Lists
    {
      id: 'bullet-list',
      key: 'Ctrl+Shift+8',
      description: 'Bullet list',
      category: 'Lists',
      action: () => onInsertBlock('bulletList')
    },
    {
      id: 'numbered-list',
      key: 'Ctrl+Shift+7',
      description: 'Numbered list',
      category: 'Lists',
      action: () => onInsertBlock('orderedList')
    },
    {
      id: 'task-list',
      key: 'Ctrl+Shift+9',
      description: 'Task list',
      category: 'Lists',
      action: () => onInsertBlock('taskList')
    },
    
    // Blocks
    {
      id: 'quote',
      key: 'Ctrl+Shift+Q',
      description: 'Insert quote block',
      category: 'Blocks',
      action: () => onInsertBlock('quote')
    },
    {
      id: 'code-block',
      key: 'Ctrl+Alt+C',
      description: 'Insert code block',
      category: 'Blocks',
      action: () => onInsertBlock('code')
    },
    {
      id: 'image',
      key: 'Ctrl+Shift+I',
      description: 'Insert image',
      category: 'Blocks',
      action: () => onInsertBlock('image')
    },
    {
      id: 'video',
      key: 'Ctrl+Shift+V',
      description: 'Insert video',
      category: 'Blocks',
      action: () => onInsertBlock('video')
    },
    {
      id: 'table',
      key: 'Ctrl+Shift+T',
      description: 'Insert table',
      category: 'Blocks',
      action: () => onInsertBlock('table')
    },
    {
      id: 'divider',
      key: 'Ctrl+Shift+H',
      description: 'Insert horizontal rule',
      category: 'Blocks',
      action: () => onInsertBlock('divider')
    },
    
    // Actions
    {
      id: 'save',
      key: 'Ctrl+S',
      description: 'Save draft',
      category: 'Actions',
      action: onSave
    },
    {
      id: 'publish',
      key: 'Ctrl+Enter',
      description: 'Publish article',
      category: 'Actions',
      action: onPublish
    },
    {
      id: 'undo',
      key: 'Ctrl+Z',
      description: 'Undo',
      category: 'Actions',
      action: () => {}
    },
    {
      id: 'redo',
      key: 'Ctrl+Y',
      description: 'Redo',
      category: 'Actions',
      action: () => {}
    },
    {
      id: 'clear-formatting',
      key: 'Ctrl+\\',
      description: 'Clear formatting',
      category: 'Actions',
      action: () => {}
    }
  ];

  // Filter shortcuts based on search and category
  const filteredShortcuts = shortcuts.filter(shortcut => {
    const matchesSearch = searchQuery === '' || 
      shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.key.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || shortcut.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group shortcuts by category
  const groupedShortcuts = filteredShortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  // Get all categories
  const categories = ['all', ...Array.from(new Set(shortcuts.map(s => s.category)))];

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when modal is open
      if (isOpen) return;

      // Check for slash command
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
          e.preventDefault();
          onSlashCommand();
        }
      }

      // Check for other shortcuts
      const key = e.key;
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;

      // Build shortcut string
      let shortcutString = '';
      if (ctrl) shortcutString += 'Ctrl+';
      if (alt) shortcutString += 'Alt+';
      if (shift) shortcutString += 'Shift+';
      shortcutString += key;

      // Find matching shortcut
      const matchingShortcut = shortcuts.find(s => s.key === shortcutString);
      if (matchingShortcut) {
        e.preventDefault();
        matchingShortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, shortcuts, onSlashCommand]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shortcuts..."
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All' : category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Shortcuts List */}
          <ScrollArea className="h-96">
            <div className="space-y-6">
              {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{category}</h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map(shortcut => (
                      <div
                        key={shortcut.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                            <Zap className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {shortcut.description}
                            </div>
                            {shortcut.global && (
                              <div className="text-xs text-gray-500">Global shortcut</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <kbd className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border">
                            {shortcut.key}
                          </kbd>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={shortcut.action}
                            className="h-8 w-8 p-0"
                          >
                            <Command className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {filteredShortcuts.length} shortcut{filteredShortcuts.length !== 1 ? 's' : ''} found
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Press any key to test shortcuts</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
