/**
 * Enhanced Editor Component
 * Main editor component with Hashnode-style features
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Eye, 
  EyeOff, 
  Library, 
  Keyboard, 
  Smartphone, 
  Maximize2,
  Minimize2,
  Save,
  Send,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import enhanced components
import { EnhancedSlashCommandMenu } from './EnhancedSlashCommandMenu';
import { ComponentLibrarySidebar } from './ComponentLibrarySidebar';
import { LivePreview } from './LivePreview';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { MobileEditor } from './MobileEditor';

// Import existing components
import { BlockEditor } from '../content-blocks/BlockEditor';
import { blockRegistry } from '@/lib/blocks/registry';
import { ContentBlock } from '@/lib/blocks/types';

interface EnhancedEditorProps {
  blocks: ContentBlock[];
  onBlocksChange: (blocks: ContentBlock[]) => void;
  onSave: () => void;
  onPublish: () => void;
  className?: string;
}

export function EnhancedEditor({
  blocks,
  onBlocksChange,
  onSave,
  onPublish,
  className
}: EnhancedEditorProps) {
  // State management
  const [isPreview, setIsPreview] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slashCommandOpen, setSlashCommandOpen] = useState(false);
  const [slashCommandPosition, setSlashCommandPosition] = useState({ x: 0, y: 0 });
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'enhanced' | 'classic' | 'mobile'>('enhanced');

  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const slashCommandRef = useRef<HTMLDivElement>(null);

  // Handle slash command
  const handleSlashCommand = useCallback(() => {
    if (slashCommandRef.current) {
      const rect = slashCommandRef.current.getBoundingClientRect();
      setSlashCommandPosition({
        x: rect.left,
        y: rect.bottom + 8
      });
    }
    setSlashCommandOpen(true);
  }, []);

  // Handle block insertion
  const handleInsertBlock = useCallback((blockType: string) => {
    const blockConfig = blockRegistry[blockType];
    if (!blockConfig) return;

    const newBlock: ContentBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: blockType as any,
      data: { ...blockConfig.defaultData } as any,
      position: blocks.length
    };

    const updatedBlocks = [...blocks, newBlock].map((block, index) => ({
      ...block,
      position: index
    }));

    onBlocksChange(updatedBlocks);
    setSelectedBlockId(newBlock.id);
  }, [blocks, onBlocksChange]);

  // Handle template insertion
  const handleInsertTemplate = useCallback((templateId: string) => {
    // This would insert a pre-configured set of blocks
    console.log('Inserting template:', templateId);
    // Implementation would depend on template system
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when modals are open
      if (isLibraryOpen || isShortcutsOpen || slashCommandOpen) return;

      const { key, ctrlKey, metaKey, shiftKey, altKey } = e;
      const isCtrl = ctrlKey || metaKey;

      // Slash command
      if (key === '/' && !isCtrl && !shiftKey && !altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
          e.preventDefault();
          handleSlashCommand();
        }
      }

      // Toggle preview
      if (isCtrl && shiftKey && key === 'P') {
        e.preventDefault();
        setIsPreview(!isPreview);
      }

      // Toggle library
      if (isCtrl && shiftKey && key === 'L') {
        e.preventDefault();
        setIsLibraryOpen(!isLibraryOpen);
      }

      // Toggle shortcuts
      if (isCtrl && shiftKey && key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(!isShortcutsOpen);
      }

      // Save
      if (isCtrl && key === 's') {
        e.preventDefault();
        onSave();
      }

      // Publish
      if (isCtrl && key === 'Enter') {
        e.preventDefault();
        onPublish();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPreview, isLibraryOpen, isShortcutsOpen, slashCommandOpen, handleSlashCommand, onSave, onPublish]);

  // Handle slash command selection
  const handleSlashCommandSelect = useCallback((command: string, blockType?: string) => {
    if (command === 'insert-block' && blockType) {
      handleInsertBlock(blockType);
    } else if (command === 'format' && blockType) {
      // Handle formatting commands
      console.log('Format command:', blockType);
    }
    setSlashCommandOpen(false);
  }, [handleInsertBlock]);

  // Get editor container classes
  const getEditorClasses = () => {
    let classes = 'enhanced-editor';
    
    if (isFullscreen) {
      classes += ' fixed inset-0 z-50 bg-white';
    }
    
    if (isMobileMode) {
      classes += ' mobile-mode';
    }
    
    return classes;
  };

  return (
    <div className={getEditorClasses()}>
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Enhanced Editor</h2>
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Hashnode Style
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Editor Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={editorMode === 'enhanced' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setEditorMode('enhanced')}
                className="h-8 px-3"
              >
                Enhanced
              </Button>
              <Button
                variant={editorMode === 'classic' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setEditorMode('classic')}
                className="h-8 px-3"
              >
                Classic
              </Button>
              <Button
                variant={editorMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setEditorMode('mobile')}
                className="h-8 px-3"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLibraryOpen(!isLibraryOpen)}
              className="h-8"
            >
              <Library className="h-4 w-4 mr-2" />
              Library
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsShortcutsOpen(!isShortcutsOpen)}
              className="h-8"
            >
              <Keyboard className="h-4 w-4 mr-2" />
              Shortcuts
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
              className="h-8"
            >
              {isPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {isPreview ? 'Edit' : 'Preview'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize2 className="h-4 w-4 mr-2" />}
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              className="h-8"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            <Button
              size="sm"
              onClick={onPublish}
              className="h-8"
            >
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        {editorMode === 'mobile' ? (
          <MobileEditor
            blocks={blocks}
            onBlocksChange={onBlocksChange}
            onInsertBlock={handleInsertBlock}
            onFormat={(format) => console.log('Format:', format)}
          />
        ) : (
          <div className="flex h-full">
            {/* Main Editor */}
            <div className={`flex-1 ${isPreview ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
              <div ref={editorRef} className="h-full p-6">
                <BlockEditor
                  blocks={blocks}
                  onBlocksChange={onBlocksChange}
                  selectedBlockId={selectedBlockId || undefined}
                  onBlockSelect={(id) => setSelectedBlockId(id || null)}
                  isPreview={false}
                  onPreviewToggle={setIsPreview}
                />
              </div>
            </div>

            {/* Live Preview */}
            {isPreview && (
              <div className="w-1/2 border-l border-gray-200">
                <LivePreview
                  blocks={blocks}
                  isVisible={isPreview}
                  onToggle={() => setIsPreview(false)}
                  className="h-full"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Slash Command Menu */}
      <EnhancedSlashCommandMenu
        isOpen={slashCommandOpen}
        onClose={() => setSlashCommandOpen(false)}
        onSelect={handleSlashCommandSelect}
        position={slashCommandPosition}
        editorRef={slashCommandRef}
      />

      {/* Component Library Sidebar */}
      <ComponentLibrarySidebar
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onInsertBlock={handleInsertBlock}
        onInsertTemplate={handleInsertTemplate}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onSlashCommand={handleSlashCommand}
        onInsertBlock={handleInsertBlock}
        onTogglePreview={() => setIsPreview(!isPreview)}
        onToggleLibrary={() => setIsLibraryOpen(!isLibraryOpen)}
        onSave={onSave}
        onPublish={onPublish}
      />

      {/* Slash Command Trigger */}
      <div
        ref={slashCommandRef}
        className="fixed bottom-6 right-6 z-40"
        style={{ display: 'none' }}
      />
    </div>
  );
}
