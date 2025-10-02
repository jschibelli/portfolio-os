/**
 * Embed Block Component
 * Embeds external content like tweets, posts, or widgets
 */

import React from 'react';
import { EmbedBlock as EmbedBlockType } from '@/lib/blocks/types';
import { ExternalLink } from 'lucide-react';

interface EmbedBlockProps {
  block: EmbedBlockType;
  isEditable?: boolean;
  onUpdate?: (data: Partial<EmbedBlockType['data']>) => void;
}

export function EmbedBlock({ block, isEditable = false, onUpdate }: EmbedBlockProps) {
  const { url, title, width, height, responsive } = block.data;

  const handleUrlChange = (newUrl: string) => {
    if (onUpdate) {
      onUpdate({ url: newUrl });
    }
  };

  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle });
    }
  };

  const getEmbedType = (embedUrl: string): string => {
    if (embedUrl.includes('twitter.com') || embedUrl.includes('x.com')) return 'twitter';
    if (embedUrl.includes('instagram.com')) return 'instagram';
    if (embedUrl.includes('codepen.io')) return 'codepen';
    if (embedUrl.includes('codesandbox.io')) return 'codesandbox';
    if (embedUrl.includes('figma.com')) return 'figma';
    if (embedUrl.includes('spotify.com')) return 'spotify';
    return 'generic';
  };

  const renderEmbed = () => {
    if (!url) {
      return (
        <div className="aspect-video rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-center text-gray-400">
            <ExternalLink className="h-16 w-16 mx-auto mb-2" />
            <p>Enter an embed URL to display content</p>
          </div>
        </div>
      );
    }

    const embedType = getEmbedType(url);
    const containerClass = responsive 
      ? 'relative w-full' 
      : '';

    const iframeClass = responsive
      ? 'absolute inset-0 w-full h-full'
      : '';

    const style = responsive
      ? { paddingBottom: `${(height! / width!) * 100}%` }
      : { width: `${width}px`, height: `${height}px` };

    // Special handling for different embed types
    switch (embedType) {
      case 'twitter':
      case 'instagram':
        return (
          <div className="max-w-xl mx-auto">
            <blockquote className="twitter-tweet" data-lang="en">
              <a href={url}>View on {embedType}</a>
            </blockquote>
            <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
          </div>
        );

      case 'codepen':
      case 'codesandbox':
      case 'figma':
      case 'spotify':
      default:
        return (
          <div className={containerClass} style={responsive ? style : undefined}>
            <iframe
              src={url}
              title={title || 'Embedded content'}
              className={`${iframeClass} rounded-lg border-0`}
              style={!responsive ? style : undefined}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
    }
  };

  return (
    <div className="py-4">
      {isEditable && (
        <div className="mb-4 space-y-3">
          <input
            type="url"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Embed URL (Twitter, CodePen, Figma, etc.)..."
          />
          <input
            type="text"
            value={title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title (optional)..."
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => onUpdate?.({ width: parseInt(e.target.value) || 560 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="200"
                max="1920"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => onUpdate?.({ height: parseInt(e.target.value) || 315 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="200"
                max="1080"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={responsive}
                  onChange={(e) => onUpdate?.({ responsive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Responsive
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {title && !isEditable && (
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        )}
        {renderEmbed()}
      </div>
    </div>
  );
}
