/**
 * Block Editor Component
 * Main editor for managing content blocks with drag-and-drop
 */

import React, { useState, useCallback } from 'react';
import { ContentBlock, EditorState, BlockOperations } from '@/lib/blocks/types';
import { blockRegistry } from '@/lib/blocks/registry';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Plus, 
  GripVertical, 
  Copy, 
  Trash2, 
  MoveUp, 
  MoveDown,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface BlockEditorProps {
  blocks: ContentBlock[];
  onBlocksChange: (blocks: ContentBlock[]) => void;
  selectedBlockId?: string;
  onBlockSelect?: (blockId: string | undefined) => void;
  isPreview?: boolean;
  onPreviewToggle?: (preview: boolean) => void;
}

export function BlockEditor({
  blocks,
  onBlocksChange,
  selectedBlockId,
  onBlockSelect,
  isPreview = false,
  onPreviewToggle
}: BlockEditorProps) {
  const [showBlockPalette, setShowBlockPalette] = useState(false);

  // Generate unique ID for new blocks
  const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Add new block
  const addBlock = useCallback((blockType: string, position?: number) => {
    const blockConfig = blockRegistry[blockType];
    if (!blockConfig) return;

    const newBlock: ContentBlock = {
      id: generateId(),
      type: blockType,
      data: { ...blockConfig.defaultData },
      position: position ?? blocks.length
    };

    const newBlocks = [...blocks];
    if (position !== undefined) {
      newBlocks.splice(position, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }

    // Update positions
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      position: index
    }));

    onBlocksChange(updatedBlocks);
    onBlockSelect?.(newBlock.id);
    setShowBlockPalette(false);
  }, [blocks, onBlocksChange, onBlockSelect]);

  // Update block data
  const updateBlock = useCallback((blockId: string, data: Partial<ContentBlock['data']>) => {
    const updatedBlocks = blocks.map(block =>
      block.id === blockId
        ? { ...block, data: { ...block.data, ...data } }
        : block
    );
    onBlocksChange(updatedBlocks);
  }, [blocks, onBlocksChange]);

  // Delete block
  const deleteBlock = useCallback((blockId: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== blockId);
    onBlocksChange(updatedBlocks);
    if (selectedBlockId === blockId) {
      onBlockSelect?.(undefined);
    }
  }, [blocks, onBlocksChange, selectedBlockId, onBlockSelect]);

  // Duplicate block
  const duplicateBlock = useCallback((blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const duplicatedBlock: ContentBlock = {
      ...block,
      id: generateId(),
      position: block.position! + 1
    };

    const newBlocks = [...blocks];
    const insertIndex = block.position! + 1;
    newBlocks.splice(insertIndex, 0, duplicatedBlock);

    // Update positions
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      position: index
    }));

    onBlocksChange(updatedBlocks);
    onBlockSelect?.(duplicatedBlock.id);
  }, [blocks, onBlocksChange, onBlockSelect]);

  // Move block
  const moveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;

    const newIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(blockIndex, 1);
    newBlocks.splice(newIndex, 0, movedBlock);

    // Update positions
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      position: index
    }));

    onBlocksChange(updatedBlocks);
  }, [blocks, onBlocksChange]);

  // Handle drag and drop
  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(sourceIndex, 1);
    newBlocks.splice(destinationIndex, 0, movedBlock);

    // Update positions
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      position: index
    }));

    onBlocksChange(updatedBlocks);
  }, [blocks, onBlocksChange]);

  // Render block component
  const renderBlock = (block: ContentBlock) => {
    const blockConfig = blockRegistry[block.type];
    if (!blockConfig) return null;

    const BlockComponent = blockConfig.component;
    const isSelected = selectedBlockId === block.id;

    return (
      <div
        className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={() => onBlockSelect?.(block.id)}
      >
        {/* Block Controls */}
        {!isPreview && (
          <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  moveBlock(block.id, 'up');
                }}
                disabled={block.position === 0}
              >
                <MoveUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  moveBlock(block.id, 'down');
                }}
                disabled={block.position === blocks.length - 1}
              >
                <MoveDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Block Content */}
        <div className="min-h-[100px]">
          <BlockComponent
            block={block}
            isEditable={!isPreview}
            onUpdate={(data) => updateBlock(block.id, data)}
          />
        </div>

        {/* Block Actions */}
        {!isPreview && isSelected && (
          <div className="absolute -top-8 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                duplicateBlock(block.id);
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                deleteBlock(block.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Editor Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setShowBlockPalette(!showBlockPalette)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Block
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onPreviewToggle?.(!isPreview)}
            className="flex items-center gap-2"
          >
            {isPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          {blocks.length} block{blocks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Block Palette */}
      {showBlockPalette && (
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-4">Choose a Block</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(blockRegistry).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <Button
                  key={key}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto p-4"
                  onClick={() => addBlock(key)}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{config.name}</span>
                  <span className="text-xs text-gray-500 text-center">{config.description}</span>
                </Button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Blocks Container */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4"
            >
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
                    >
                      {!isPreview && (
                        <div
                          {...provided.dragHandleProps}
                          className="flex items-center gap-2 mb-2 text-gray-400 hover:text-gray-600 cursor-move"
                        >
                          <GripVertical className="h-4 w-4" />
                          <span className="text-sm">Drag to reorder</span>
                        </div>
                      )}
                      {renderBlock(block)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Empty State */}
      {blocks.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-500">
            <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No blocks yet</h3>
            <p className="mb-4">Start building your content by adding blocks</p>
            <Button onClick={() => setShowBlockPalette(true)}>
              Add Your First Block
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
