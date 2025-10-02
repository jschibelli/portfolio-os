/**
 * Modular Block Editor
 * Enhanced block editor with drag-and-drop, slash commands, and modular content blocks
 */

'use client';

import React, { useState, useRef } from 'react';
import { ContentBlock } from '@/lib/blocks/types';
import { blockRegistry, getBlock, getAllBlocks, getBlocksByCategory } from '@/lib/blocks/registry';
import { Button } from '@/components/ui/button';
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Settings as SettingsIcon,
  Copy,
  ChevronDown,
  Search
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ModularBlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export function ModularBlockEditor({ blocks, onChange }: ModularBlockEditorProps) {
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [dragOverBlock, setDragOverBlock] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showSettings, setShowSettings] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [insertPosition, setInsertPosition] = useState<number | null>(null);

  // Add a new block
  const addBlock = (type: string, position?: number) => {
    const blockDef = getBlock(type);
    if (!blockDef) return;

    const newBlock: ContentBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type as any,
      data: { ...blockDef.defaultData },
      position: position ?? blocks.length
    };

    const newBlocks = [...blocks];
    if (position !== undefined) {
      newBlocks.splice(position, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }

    onChange(newBlocks);
    setShowBlockMenu(false);
    setSearchQuery('');
  };

  // Update a block's data
  const updateBlock = (id: string, data: Partial<ContentBlock['data']>) => {
    const newBlocks = blocks.map(block =>
      block.id === id ? { ...block, data: { ...block.data, ...data } } : block
    );
    onChange(newBlocks);
  };

  // Delete a block
  const deleteBlock = (id: string) => {
    const newBlocks = blocks.filter(block => block.id !== id);
    onChange(newBlocks);
    if (selectedBlock === id) {
      setSelectedBlock(null);
    }
  };

  // Duplicate a block
  const duplicateBlock = (id: string) => {
    const block = blocks.find(b => b.id === id);
    if (!block) return;

    const newBlock: ContentBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const index = blocks.findIndex(b => b.id === id);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onChange(newBlocks);
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlock(blockId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', blockId);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedBlock !== blockId) {
      setDragOverBlock(blockId);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    
    if (!draggedBlock || draggedBlock === targetBlockId) {
      setDraggedBlock(null);
      setDragOverBlock(null);
      return;
    }

    const draggedIndex = blocks.findIndex(b => b.id === draggedBlock);
    const targetIndex = blocks.findIndex(b => b.id === targetBlockId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, removed);

    onChange(newBlocks);
    setDraggedBlock(null);
    setDragOverBlock(null);
  };

  // Render a block
  const renderBlock = (block: ContentBlock) => {
    const blockDef = getBlock(block.type);
    if (!blockDef) return null;

    const BlockComponent = blockDef.component;
    const SettingsComponent = blockDef.settings;

    return (
      <div
        key={block.id}
        draggable
        onDragStart={(e) => handleDragStart(e, block.id)}
        onDragOver={(e) => handleDragOver(e, block.id)}
        onDrop={(e) => handleDrop(e, block.id)}
        className={`group relative border rounded-lg transition-all ${
          selectedBlock === block.id
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        } ${
          dragOverBlock === block.id && draggedBlock !== block.id
            ? 'border-t-4 border-t-blue-500'
            : ''
        }`}
        onClick={() => setSelectedBlock(block.id)}
      >
        {/* Block Toolbar */}
        <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-grab active:cursor-grabbing bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              const index = blocks.findIndex(b => b.id === block.id);
              setInsertPosition(index + 1);
              setShowBlockMenu(true);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Block Actions */}
        <div className="absolute -right-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
          {SettingsComponent && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(block.id);
              }}
            >
              <SettingsIcon className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              duplicateBlock(block.id);
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={(e) => {
              e.stopPropagation();
              deleteBlock(block.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Block Content */}
        <div className="p-4">
          <BlockComponent
            block={block}
            isEditable={true}
            onUpdate={(data) => updateBlock(block.id, data)}
          />
        </div>

        {/* Settings Dialog */}
        {SettingsComponent && showSettings === block.id && (
          <Dialog open={true} onOpenChange={() => setShowSettings(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{blockDef.name} Settings</DialogTitle>
                <DialogDescription>
                  Customize the appearance and behavior of this block
                </DialogDescription>
              </DialogHeader>
              <SettingsComponent
                data={block.data}
                onUpdate={(data) => updateBlock(block.id, data)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  };

  // Filter blocks based on search query
  const filteredBlocks = getAllBlocks().filter(({ key, name, description }) => {
    const query = searchQuery.toLowerCase();
    return (
      name.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query) ||
      key.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Block List */}
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No blocks yet. Click the button below to add your first block.
            </p>
            <Button onClick={() => setShowBlockMenu(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Block
            </Button>
          </div>
        ) : (
          blocks.map(renderBlock)
        )}
      </div>

      {/* Add Block Button */}
      {blocks.length > 0 && (
        <div className="mt-8 text-center">
          <Button
            onClick={() => {
              setInsertPosition(null);
              setShowBlockMenu(true);
            }}
            variant="outline"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Block
          </Button>
        </div>
      )}

      {/* Block Menu Dialog */}
      <Dialog open={showBlockMenu} onOpenChange={setShowBlockMenu}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Content Block</DialogTitle>
            <DialogDescription>
              Choose a block type to add to your content
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search blocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Block Grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredBlocks.map(({ key, name, description, icon: Icon, category }) => (
              <button
                key={key}
                onClick={() => addBlock(key, insertPosition ?? undefined)}
                className="flex flex-col items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all text-left group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {name}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </p>
                <span className="mt-2 text-xs text-gray-500 dark:text-gray-500 capitalize">
                  {category}
                </span>
              </button>
            ))}
          </div>

          {filteredBlocks.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No blocks found matching "{searchQuery}"
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
