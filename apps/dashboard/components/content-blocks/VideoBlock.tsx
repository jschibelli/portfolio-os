/**
 * Video Block Component
 * Renders videos from YouTube, Vimeo, or direct uploads
 */

import React, { useState } from 'react';
import { VideoBlock as VideoBlockType } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';

interface VideoBlockProps {
  block: VideoBlockType;
  isEditable?: boolean;
  onUpdate?: (data: Partial<VideoBlockType['data']>) => void;
}

export function VideoBlock({ block, isEditable = false, onUpdate }: VideoBlockProps) {
  const { url, title, description, thumbnail, autoplay, controls, loop, muted, platform } = block.data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);

  const getYouTubeEmbedUrl = (videoUrl: string) => {
    const videoId = extractYouTubeId(videoUrl);
    if (!videoId) return null;
    
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      controls: controls ? '1' : '0',
      loop: loop ? '1' : '0',
      mute: isMuted ? '1' : '0',
      rel: '0'
    });
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  const getVimeoEmbedUrl = (videoUrl: string) => {
    const videoId = extractVimeoId(videoUrl);
    if (!videoId) return null;
    
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      controls: controls ? 'true' : 'false',
      loop: loop ? 'true' : 'false',
      muted: isMuted ? '1' : '0'
    });
    
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  };

  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const extractVimeoId = (url: string): string | null => {
    const regex = /vimeo\.com\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getEmbedUrl = () => {
    if (!url) return null;
    
    switch (platform) {
      case 'youtube':
        return getYouTubeEmbedUrl(url);
      case 'vimeo':
        return getVimeoEmbedUrl(url);
      case 'direct':
        return url;
      default:
        return getYouTubeEmbedUrl(url);
    }
  };

  const handleUrlChange = () => {
    if (!onUpdate) return;
    
    const newUrl = window.prompt('Enter video URL:', url);
    if (newUrl !== null) {
      let detectedPlatform = platform;
      
      // Auto-detect platform
      if (newUrl.includes('youtube.com') || newUrl.includes('youtu.be')) {
        detectedPlatform = 'youtube';
      } else if (newUrl.includes('vimeo.com')) {
        detectedPlatform = 'vimeo';
      } else {
        detectedPlatform = 'direct';
      }
      
      onUpdate({
        url: newUrl,
        platform: detectedPlatform
      });
    }
  };

  const renderEmbed = () => {
    const embedUrl = getEmbedUrl();
    if (!embedUrl) return null;

    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedUrl}
          title={title || 'Video'}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };

  const renderDirectVideo = () => {
    return (
      <video
        className="w-full h-auto rounded-lg"
        controls={controls}
        autoPlay={autoplay}
        loop={loop}
        muted={isMuted}
        poster={thumbnail}
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  };

  const renderPreview = () => {
    if (!url) {
      return (
        <Card className="p-12 text-center border-dashed border-2">
          <div className="text-gray-500">
            <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No video added</h3>
            <p className="mb-4">Add a video URL to get started</p>
            {isEditable && (
              <Button onClick={handleUrlChange} variant="outline">
                Add Video
              </Button>
            )}
          </div>
        </Card>
      );
    }

    if (platform === 'direct') {
      return renderDirectVideo();
    }

    return renderEmbed();
  };

  return (
    <div className="w-full">
      {/* Video Content */}
      <div className="relative">
        {renderPreview()}
        
        {isEditable && url && (
          <div className="absolute top-2 right-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleUrlChange}
              className="bg-black bg-opacity-50 text-white hover:bg-opacity-75"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Video Info */}
      {(title || description) && (
        <div className="mt-4 space-y-2">
          {title && (
            <h3 className="text-lg font-semibold">
              {isEditable ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onUpdate?.({ title: e.target.value })}
                  className="w-full bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                  placeholder="Video title..."
                />
              ) : (
                title
              )}
            </h3>
          )}
          
          {description && (
            <p className="text-gray-600">
              {isEditable ? (
                <textarea
                  value={description}
                  onChange={(e) => onUpdate?.({ description: e.target.value })}
                  className="w-full bg-transparent border-0 p-0 focus:outline-none focus:ring-0 resize-none"
                  placeholder="Video description..."
                  rows={3}
                />
              ) : (
                description
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}


