/**
 * Embed Block Component
 * Embeds external content like tweets, posts, or widgets
 */

import React, { useState, useEffect } from 'react';
import { EmbedBlock as EmbedBlockType } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, AlertCircle } from 'lucide-react';

interface EmbedBlockProps {
  block: EmbedBlockType;
  isEditable?: boolean;
  onUpdate?: (data: Partial<EmbedBlockType['data']>) => void;
}

export function EmbedBlock({ block, isEditable = false, onUpdate }: EmbedBlockProps) {
  const { url, title, width, height, responsive } = block.data;
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const getEmbedUrl = () => {
    if (!url) return null;

    // Twitter/X embeds
    if (url.includes('twitter.com') || url.includes('x.com')) {
      return `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
    }

    // Instagram embeds
    if (url.includes('instagram.com')) {
      return `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`;
    }

    // TikTok embeds
    if (url.includes('tiktok.com')) {
      return `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    }

    // Generic iframe embed
    return url;
  };

  const handleUrlChange = () => {
    if (!onUpdate) return;
    
    const newUrl = window.prompt('Enter embed URL:', url);
    if (newUrl !== null) {
      onUpdate({ url: newUrl });
      setHasError(false);
      setIsLoading(true);
    }
  };

  const renderTwitterEmbed = () => {
    return (
      <div className="twitter-embed">
        <blockquote className="twitter-tweet">
          <a href={url}></a>
        </blockquote>
        <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
      </div>
    );
  };

  const renderInstagramEmbed = () => {
    return (
      <div className="instagram-embed">
        <blockquote 
          className="instagram-media" 
          data-instgrm-permalink={url}
          data-instgrm-version="14"
        >
        </blockquote>
        <script async src="//www.instagram.com/embed.js"></script>
      </div>
    );
  };

  const renderTikTokEmbed = () => {
    const videoId = extractTikTokId(url);
    if (!videoId) return null;

    return (
      <div className="tiktok-embed">
        <blockquote 
          className="tiktok-embed" 
          cite={url}
          data-video-id={videoId}
        >
        </blockquote>
        <script async src="https://www.tiktok.com/embed.js"></script>
      </div>
    );
  };

  const renderIframeEmbed = () => {
    const embedStyle: React.CSSProperties = {
      width: responsive ? '100%' : `${width}px`,
      height: responsive ? 'auto' : `${height}px`,
      minHeight: responsive ? '400px' : undefined,
    };

    return (
      <iframe
        src={url}
        title={title || 'Embedded content'}
        style={embedStyle}
        className={`${responsive ? 'w-full aspect-video' : ''} rounded-lg border-0`}
        loading="lazy"
        onLoad={() => {
          setIsLoading(false);
          setHasError(false);
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    );
  };

  const extractTikTokId = (url: string): string | null => {
    const regex = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getEmbedType = () => {
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('tiktok.com')) return 'tiktok';
    return 'iframe';
  };

  const renderEmbed = () => {
    const embedType = getEmbedType();

    switch (embedType) {
      case 'twitter':
        return renderTwitterEmbed();
      case 'instagram':
        return renderInstagramEmbed();
      case 'tiktok':
        return renderTikTokEmbed();
      default:
        return renderIframeEmbed();
    }
  };

  useEffect(() => {
    // Reset loading state when URL changes
    setIsLoading(true);
    setHasError(false);
  }, [url]);

  if (!url) {
    return (
      <Card className="p-12 text-center border-dashed border-2">
        <div className="text-gray-500">
          <ExternalLink className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No embed added</h3>
          <p className="mb-4">Add a URL to embed external content</p>
          {isEditable && (
            <Button onClick={handleUrlChange} variant="outline">
              Add Embed
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full">
      {/* Embed Content */}
      <div className="relative">
        {isLoading && (
          <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-600">Loading embed...</span>
          </div>
        )}
        
        {hasError && (
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2 text-red-700">Embed failed to load</h3>
            <p className="text-gray-600 mb-4">The content could not be embedded. Please check the URL.</p>
            {isEditable && (
              <Button onClick={handleUrlChange} variant="outline">
                Update URL
              </Button>
            )}
          </Card>
        )}
        
        {!hasError && (
          <div className={`${isLoading ? 'hidden' : ''}`}>
            {renderEmbed()}
          </div>
        )}
        
        {isEditable && url && (
          <div className="absolute top-2 right-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleUrlChange}
              className="bg-black bg-opacity-50 text-white hover:bg-opacity-75"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Embed Title */}
      {title && (
        <div className="mt-2">
          {isEditable ? (
            <input
              type="text"
              value={title}
              onChange={(e) => onUpdate?.({ title: e.target.value })}
              className="w-full bg-transparent border-0 p-0 text-sm font-medium focus:outline-none focus:ring-0"
              placeholder="Embed title..."
            />
          ) : (
            <p className="text-sm font-medium text-gray-700">{title}</p>
          )}
        </div>
      )}
    </div>
  );
}


