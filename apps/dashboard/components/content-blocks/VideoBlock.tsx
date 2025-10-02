/**
 * Video Block Component
 * Renders videos from YouTube, Vimeo, or direct URLs
 */

import React from 'react';
import { VideoBlock as VideoBlockType } from '@/lib/blocks/types';
import { Play } from 'lucide-react';

interface VideoBlockProps {
  block: VideoBlockType;
  isEditable?: boolean;
  onUpdate?: (data: Partial<VideoBlockType['data']>) => void;
}

export function VideoBlock({ block, isEditable = false, onUpdate }: VideoBlockProps) {
  const { url, title, description, thumbnail, autoplay, controls, loop, muted, platform } = block.data;

  const handleUrlChange = (newUrl: string) => {
    if (onUpdate) {
      // Auto-detect platform from URL
      let detectedPlatform: 'youtube' | 'vimeo' | 'direct' = 'direct';
      if (newUrl.includes('youtube.com') || newUrl.includes('youtu.be')) {
        detectedPlatform = 'youtube';
      } else if (newUrl.includes('vimeo.com')) {
        detectedPlatform = 'vimeo';
      }
      onUpdate({ url: newUrl, platform: detectedPlatform });
    }
  };

  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle });
    }
  };

  const handleDescriptionChange = (newDescription: string) => {
    if (onUpdate) {
      onUpdate({ description: newDescription });
    }
  };

  const getYouTubeVideoId = (videoUrl: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = videoUrl.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getVimeoVideoId = (videoUrl: string): string | null => {
    const match = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? match[1] : null;
  };

  const getEmbedUrl = () => {
    if (!url) return '';

    switch (platform) {
      case 'youtube': {
        const videoId = getYouTubeVideoId(url);
        if (!videoId) return '';
        const params = new URLSearchParams();
        if (autoplay) params.append('autoplay', '1');
        if (!controls) params.append('controls', '0');
        if (loop) {
          params.append('loop', '1');
          params.append('playlist', videoId);
        }
        if (muted) params.append('mute', '1');
        return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
      }
      case 'vimeo': {
        const videoId = getVimeoVideoId(url);
        if (!videoId) return '';
        const params = new URLSearchParams();
        if (autoplay) params.append('autoplay', '1');
        if (!controls) params.append('controls', '0');
        if (loop) params.append('loop', '1');
        if (muted) params.append('muted', '1');
        return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
      }
      default:
        return url;
    }
  };

  const renderVideo = () => {
    const embedUrl = getEmbedUrl();
    
    if (!embedUrl) {
      return (
        <div className="aspect-video rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Play className="h-16 w-16 mx-auto mb-2" />
            <p>No video URL provided</p>
          </div>
        </div>
      );
    }

    if (platform === 'direct') {
      return (
        <video
          src={embedUrl}
          controls={controls}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          className="w-full aspect-video rounded-lg"
          poster={thumbnail}
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
        <iframe
          src={embedUrl}
          title={title || 'Video player'}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
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
            placeholder="Video URL (YouTube, Vimeo, or direct link)..."
          />
          <input
            type="text"
            value={title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Video title (optional)..."
          />
          <textarea
            value={description || ''}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Video description (optional)..."
            rows={2}
          />
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Platform:</span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              {platform}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {title && !isEditable && (
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        )}
        
        {renderVideo()}
        
        {description && !isEditable && (
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
