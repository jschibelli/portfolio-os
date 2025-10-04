/**
 * Block Preview Component
 * Provides preview functionality for content blocks
 */

import React, { useState, useEffect } from 'react';
import { ContentBlock } from '@/lib/blocks/types';
import { blockRegistry } from '@/lib/blocks/registry';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  Code, 
  Smartphone, 
  Tablet, 
  Monitor,
  Download,
  Copy,
  Share
} from 'lucide-react';
import { blocksToHTML, blocksToMarkdown, serializeBlocks } from '@/lib/blocks/serialization';

interface BlockPreviewProps {
  blocks: ContentBlock[];
  className?: string;
  onExport?: (format: string, content: string) => void;
}

type PreviewMode = 'desktop' | 'tablet' | 'mobile';
type PreviewFormat = 'preview' | 'html' | 'markdown' | 'json';

export function BlockPreview({ blocks, className = '', onExport }: BlockPreviewProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [previewFormat, setPreviewFormat] = useState<PreviewFormat>('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      case 'desktop': return 'max-w-4xl';
      default: return 'max-w-4xl';
    }
  };

  const getPreviewHeight = () => {
    if (isFullscreen) return 'h-screen';
    switch (previewMode) {
      case 'mobile': return 'max-h-96';
      case 'tablet': return 'max-h-[600px]';
      case 'desktop': return 'max-h-[800px]';
      default: return 'max-h-[800px]';
    }
  };

  const renderPreview = () => {
    if (blocks.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No blocks to preview</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`${getPreviewWidth()} mx-auto bg-white border rounded-lg shadow-sm overflow-auto ${getPreviewHeight()}`}>
        <div className="p-6 space-y-6">
          {blocks.map((block) => {
            const blockConfig = blockRegistry[block.type];
            if (!blockConfig) {
              return (
                <div key={block.id} className="p-4 border border-red-200 bg-red-50 rounded">
                  <p className="text-red-600">Unknown block type: {block.type}</p>
                </div>
              );
            }

            const BlockComponent = blockConfig.component;
            return (
              <div key={block.id} className="block-preview-item">
                <BlockComponent
                  block={block}
                  isEditable={false}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHTML = () => {
    const html = blocksToHTML(blocks);
    return (
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
        <pre className="text-sm">
          <code>{html}</code>
        </pre>
      </div>
    );
  };

  const renderMarkdown = () => {
    const markdown = blocksToMarkdown(blocks);
    return (
      <div className="bg-white border rounded-lg p-4 overflow-auto">
        <pre className="text-sm whitespace-pre-wrap">
          {markdown}
        </pre>
      </div>
    );
  };

  const renderJSON = () => {
    const serialized = serializeBlocks(blocks);
    return (
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
        <pre className="text-sm">
          <code>{JSON.stringify(serialized, null, 2)}</code>
        </pre>
      </div>
    );
  };

  const handleExport = (format: string) => {
    let content = '';
    
    switch (format) {
      case 'html':
        content = blocksToHTML(blocks);
        break;
      case 'markdown':
        content = blocksToMarkdown(blocks);
        break;
      case 'json':
        content = JSON.stringify(serializeBlocks(blocks), null, 2);
        break;
      default:
        return;
    }

    if (onExport) {
      onExport(format, content);
    } else {
      // Default export behavior
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `content.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleCopy = (format: string) => {
    let content = '';
    
    switch (format) {
      case 'html':
        content = blocksToHTML(blocks);
        break;
      case 'markdown':
        content = blocksToMarkdown(blocks);
        break;
      case 'json':
        content = JSON.stringify(serializeBlocks(blocks), null, 2);
        break;
      default:
        return;
    }

    navigator.clipboard.writeText(content);
  };

  const renderContent = () => {
    switch (previewFormat) {
      case 'preview':
        return renderPreview();
      case 'html':
        return renderHTML();
      case 'markdown':
        return renderMarkdown();
      case 'json':
        return renderJSON();
      default:
        return renderPreview();
    }
  };

  return (
    <div className={`block-preview ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Preview Controls */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 border-b">
        <div className="flex items-center space-x-4">
          {/* Format Tabs */}
          <Tabs value={previewFormat} onValueChange={(value) => setPreviewFormat(value as PreviewFormat)}>
            <TabsList>
              <TabsTrigger value="preview" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
              <TabsTrigger value="html" className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span>HTML</span>
              </TabsTrigger>
              <TabsTrigger value="markdown" className="flex items-center space-x-2">
                <span>MD</span>
              </TabsTrigger>
              <TabsTrigger value="json" className="flex items-center space-x-2">
                <span>JSON</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Device Preview Controls (only for preview format) */}
          {previewFormat === 'preview' && (
            <div className="flex items-center space-x-2">
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {previewFormat !== 'preview' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(previewFormat)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          )}
          
          {previewFormat !== 'preview' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport(previewFormat)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>

      {/* Block Count */}
      <div className="p-4 bg-gray-50 border-t text-sm text-gray-600">
        {blocks.length} block{blocks.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}


