/**
 * Mobile Editor Component
 * Touch-friendly editor interface optimized for mobile devices
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Menu, 
  Plus, 
  Type, 
  Image, 
  Video, 
  Code, 
  Quote,
  List,
  Link,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { blockRegistry } from '@/lib/blocks/registry';

interface MobileEditorProps {
  blocks: any[];
  onBlocksChange: (blocks: any[]) => void;
  onInsertBlock: (blockType: string) => void;
  onFormat: (format: string) => void;
  className?: string;
}

export function MobileEditor({
  blocks,
  onBlocksChange,
  onInsertBlock,
  onFormat,
  className
}: MobileEditorProps) {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [activeTab, setActiveTab] = useState<'blocks' | 'format' | 'insert'>('blocks');
  const [showToolbar, setShowToolbar] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Touch-friendly block actions
  const blockActions = [
    { id: 'text', icon: Type, label: 'Text', action: () => onInsertBlock('text') },
    { id: 'heading', icon: Type, label: 'Heading', action: () => onInsertBlock('heading1') },
    { id: 'image', icon: Image, label: 'Image', action: () => onInsertBlock('image') },
    { id: 'video', icon: Video, label: 'Video', action: () => onInsertBlock('video') },
    { id: 'code', icon: Code, label: 'Code', action: () => onInsertBlock('code') },
    { id: 'quote', icon: Quote, label: 'Quote', action: () => onInsertBlock('quote') },
    { id: 'list', icon: List, label: 'List', action: () => onInsertBlock('bulletList') },
    { id: 'link', icon: Link, label: 'Link', action: () => onInsertBlock('link') }
  ];

  // Formatting options
  const formattingOptions = [
    { id: 'bold', icon: Bold, label: 'Bold', action: () => onFormat('bold') },
    { id: 'italic', icon: Italic, label: 'Italic', action: () => onFormat('italic') },
    { id: 'underline', icon: Underline, label: 'Underline', action: () => onFormat('underline') },
    { id: 'align-left', icon: AlignLeft, label: 'Align Left', action: () => onFormat('alignLeft') },
    { id: 'align-center', icon: AlignCenter, label: 'Center', action: () => onFormat('alignCenter') },
    { id: 'align-right', icon: AlignRight, label: 'Right', action: () => onFormat('alignRight') }
  ];

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent, blockId: string) => {
    setSelectedBlock(blockId);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Handle block selection or editing
    if (selectedBlock) {
      // Could open block editor or show context menu
      console.log('Selected block:', selectedBlock);
    }
  };

  // Get device-specific classes
  const getDeviceClasses = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div className={`mobile-editor ${className}`}>
      {/* Device Mode Selector */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Preview Mode:</span>
          <div className="flex items-center gap-1 bg-white rounded-lg p-1">
            <Button
              variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceMode('mobile')}
              className="h-8 w-8 p-0"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceMode('tablet')}
              className="h-8 w-8 p-0"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceMode('desktop')}
              className="h-8 w-8 p-0"
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowToolbar(!showToolbar)}
          className="h-8 w-8 p-0"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Toolbar */}
      {showToolbar && (
        <div className="bg-white border-b border-gray-200 p-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="blocks" className="data-[state=active]:bg-white">Blocks</TabsTrigger>
              <TabsTrigger value="format" className="data-[state=active]:bg-white">Format</TabsTrigger>
              <TabsTrigger value="insert" className="data-[state=active]:bg-white">Insert</TabsTrigger>
            </TabsList>

            <TabsContent value="blocks" className="mt-4">
              <ScrollArea className="h-32">
                <div className="grid grid-cols-4 gap-3">
                  {blockActions.map(action => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={action.action}
                      className="h-16 flex flex-col items-center gap-2"
                    >
                      <action.icon className="h-5 w-5" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="format" className="mt-4">
              <ScrollArea className="h-32">
                <div className="grid grid-cols-4 gap-3">
                  {formattingOptions.map(option => (
                    <Button
                      key={option.id}
                      variant="outline"
                      size="sm"
                      onClick={option.action}
                      className="h-16 flex flex-col items-center gap-2"
                    >
                      <option.icon className="h-5 w-5" />
                      <span className="text-xs">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="insert" className="mt-4">
              <ScrollArea className="h-32">
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(blockRegistry).slice(0, 8).map(([key, block]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => onInsertBlock(key)}
                      className="h-16 flex flex-col items-center gap-2"
                    >
                      <block.icon className="h-5 w-5" />
                      <span className="text-xs">{block.name}</span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Editor Content */}
      <div className="p-4">
        <div className={`${getDeviceClasses()} bg-white border border-gray-200 rounded-lg shadow-sm`}>
          <ScrollArea className="h-96">
            <div className="p-6 space-y-4">
              {blocks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Start creating</h3>
                  <p className="text-sm">Tap the + button to add your first block</p>
                </div>
              ) : (
                blocks.map((block, index) => (
                  <div
                    key={block.id || index}
                    className={`p-4 border border-gray-200 rounded-lg touch-manipulation ${
                      selectedBlock === block.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onTouchStart={(e) => handleTouchStart(e, block.id)}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {block.type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-sm text-gray-700">
                      {block.content || block.data?.text || 'Empty block'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => onInsertBlock('text')}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Touch Gestures Help */}
      <div className="p-4 bg-blue-50 border-t border-blue-200">
        <div className="text-xs text-blue-700">
          <strong>Touch Gestures:</strong> Tap to select • Long press to edit • Swipe to reorder
        </div>
      </div>
    </div>
  );
}
