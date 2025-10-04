/**
 * Live Preview Component
 * Real-time preview of content blocks with component rendering
 */

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { blockRegistry } from '@/lib/blocks/registry';
import { ContentBlock } from '@/lib/blocks/types';

interface LivePreviewProps {
  blocks: ContentBlock[];
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

export function LivePreview({ blocks, isVisible, onToggle, className }: LivePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Update timestamp when blocks change
  useEffect(() => {
    setLastUpdated(new Date());
  }, [blocks]);

  // Render a single block
  const renderBlock = (block: ContentBlock) => {
    const blockConfig = blockRegistry[block.type];
    if (!blockConfig) {
      return (
        <div key={block.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <div className="text-red-600 text-sm">
            Unknown block type: {block.type}
          </div>
        </div>
      );
    }

    const BlockComponent = blockConfig.component;
    
    return (
      <div key={block.id} className="relative group">
        {/* Block Type Badge */}
        <div className="absolute -top-2 -left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant="secondary" className="text-xs">
            {blockConfig.name}
          </Badge>
        </div>
        
        {/* Block Content */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <BlockComponent
            block={block}
            isEditable={false}
            onUpdate={() => {}} // Preview mode - no updates
          />
        </div>
      </div>
    );
  };

  // Get preview container classes based on mode
  const getPreviewContainerClasses = () => {
    const baseClasses = "bg-white border border-gray-200 rounded-lg shadow-sm";
    
    if (isFullscreen) {
      return `${baseClasses} fixed inset-0 z-50`;
    }
    
    switch (previewMode) {
      case 'mobile':
        return `${baseClasses} max-w-sm mx-auto`;
      case 'tablet':
        return `${baseClasses} max-w-2xl mx-auto`;
      case 'desktop':
      default:
        return `${baseClasses} w-full`;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-900">Live Preview</span>
            <Badge variant="outline" className="text-xs">
              {blocks.length} block{blocks.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <RefreshCw className="h-3 w-3" />
            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Mode Selector */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
              className="h-6 px-2 text-xs"
            >
              Desktop
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
              className="h-6 px-2 text-xs"
            >
              Tablet
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
              className="h-6 px-2 text-xs"
            >
              Mobile
            </Button>
          </div>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8 p-0"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-4">
        <div className={getPreviewContainerClasses()}>
          <ScrollArea className="h-full max-h-96">
            <div className="p-6 space-y-6">
              {blocks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No content to preview</h3>
                  <p className="text-sm">Add some blocks to see the live preview</p>
                </div>
              ) : (
                blocks.map(renderBlock)
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>Real-time preview</span>
            <span>Auto-updates on changes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
