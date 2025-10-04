/**
 * Content Block Component for TipTap Node View
 * Renders content blocks within the TipTap editor
 */

import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { NodeViewProps } from '@tiptap/core';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Settings, 
  GripVertical, 
  Trash2, 
  Copy, 
  Eye,
  EyeOff 
} from 'lucide-react';
import { blockRegistry } from '@/lib/blocks/registry';
import { ContentBlock } from '@/lib/blocks/types';

interface ContentBlockComponentProps extends NodeViewProps {
  node: ProseMirrorNode;
  updateAttributes: (attrs: Record<string, any>) => void;
  deleteNode: () => void;
}

export function ContentBlockComponent({ 
  node, 
  updateAttributes, 
  deleteNode,
  selected,
  editor 
}: ContentBlockComponentProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const { blockType, blockData, blockId } = node.attrs;

  // Convert TipTap node to ContentBlock format
  const contentBlock: ContentBlock = {
    id: blockId,
    type: blockType,
    data: blockData,
    position: 0
  };

  const blockConfig = blockRegistry[blockType];
  if (!blockConfig) {
    return (
      <NodeViewWrapper className="content-block-node">
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-red-600">Unknown block type: {blockType}</p>
        </Card>
      </NodeViewWrapper>
    );
  }

  const BlockComponent = blockConfig.component;
  const SettingsComponent = blockConfig.settings;

  const handleUpdate = (newData: Partial<ContentBlock['data']>) => {
    updateAttributes({
      blockData: { ...blockData, ...newData }
    });
  };

  const handleDuplicate = () => {
    const newBlockId = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    editor.commands.insertContent({
      type: 'contentBlock',
      attrs: {
        blockType,
        blockData: { ...blockData },
        blockId: newBlockId,
      },
    });
  };

  const handleDelete = () => {
    deleteNode();
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  const handlePreviewToggle = () => {
    setIsPreview(!isPreview);
  };

  return (
    <NodeViewWrapper 
      className={`content-block-node ${selected ? 'ring-2 ring-blue-500' : ''}`}
      data-drag-handle
    >
      <Card className="relative">
        {/* Block Controls */}
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviewToggle}
            className="h-8 w-8 p-0 bg-white shadow-sm"
          >
            {isPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSettingsToggle}
            className="h-8 w-8 p-0 bg-white shadow-sm"
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDuplicate}
            className="h-8 w-8 p-0 bg-white shadow-sm"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 bg-white shadow-sm text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Drag Handle */}
        <div className="absolute left-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-8 w-8 flex items-center justify-center bg-gray-100 rounded cursor-move">
            <GripVertical className="h-4 w-4 text-gray-600" />
          </div>
        </div>

        {/* Block Content */}
        <div className="p-4">
          <BlockComponent
            block={contentBlock}
            isEditable={!isPreview}
            onUpdate={handleUpdate}
          />
        </div>

        {/* Settings Panel */}
        {showSettings && SettingsComponent && (
          <div className="border-t p-4 bg-gray-50">
            <div className="mb-3">
              <h4 className="font-medium text-gray-900">
                {blockConfig.name} Settings
              </h4>
              <p className="text-sm text-gray-600">
                {blockConfig.description}
              </p>
            </div>
            
            <SettingsComponent
              block={contentBlock}
              onUpdate={handleUpdate}
            />
          </div>
        )}
      </Card>
    </NodeViewWrapper>
  );
}


