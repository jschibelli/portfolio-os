/**
 * Video Block Settings Component
 * Configuration panel for video blocks
 */

import React from 'react';
import { VideoBlock } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface VideoBlockSettingsProps {
  block: VideoBlock;
  onUpdate: (data: Partial<VideoBlock['data']>) => void;
}

const PLATFORM_OPTIONS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'vimeo', label: 'Vimeo' },
  { value: 'direct', label: 'Direct Upload' }
];

export function VideoBlockSettings({ block, onUpdate }: VideoBlockSettingsProps) {
  const { url, title, description, thumbnail, autoplay, controls, loop, muted, platform } = block.data;

  const handleUrlChange = (newUrl: string) => {
    onUpdate({ url: newUrl });
  };

  const handleTitleChange = (newTitle: string) => {
    onUpdate({ title: newTitle });
  };

  const handleDescriptionChange = (newDescription: string) => {
    onUpdate({ description: newDescription });
  };

  const handleThumbnailChange = (newThumbnail: string) => {
    onUpdate({ thumbnail: newThumbnail });
  };

  const handlePlatformChange = (newPlatform: string) => {
    onUpdate({ platform: newPlatform });
  };

  const handleAutoplayChange = (checked: boolean) => {
    onUpdate({ autoplay: checked });
  };

  const handleControlsChange = (checked: boolean) => {
    onUpdate({ controls: checked });
  };

  const handleLoopChange = (checked: boolean) => {
    onUpdate({ loop: checked });
  };

  const handleMutedChange = (checked: boolean) => {
    onUpdate({ muted: checked });
  };

  return (
    <div className="space-y-4">
      {/* Platform */}
      <div>
        <Label htmlFor="platform">Platform</Label>
        <Select value={platform} onValueChange={handlePlatformChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            {PLATFORM_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Video URL */}
      <div>
        <Label htmlFor="url">Video URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
        <p className="text-sm text-gray-500 mt-1">
          {platform === 'youtube' && 'Enter a YouTube video URL'}
          {platform === 'vimeo' && 'Enter a Vimeo video URL'}
          {platform === 'direct' && 'Enter the direct video file URL'}
        </p>
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="title">Title (optional)</Label>
        <Input
          id="title"
          value={title || ''}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter video title"
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description || ''}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Enter video description"
          rows={3}
        />
      </div>

      {/* Thumbnail (for direct videos) */}
      {platform === 'direct' && (
        <div>
          <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
          <Input
            id="thumbnail"
            value={thumbnail || ''}
            onChange={(e) => handleThumbnailChange(e.target.value)}
            placeholder="https://example.com/thumbnail.jpg"
          />
        </div>
      )}

      {/* Video Settings */}
      <div className="space-y-3">
        <Label>Video Settings</Label>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="autoplay"
            checked={autoplay}
            onCheckedChange={handleAutoplayChange}
          />
          <Label htmlFor="autoplay">Autoplay</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="controls"
            checked={controls}
            onCheckedChange={handleControlsChange}
          />
          <Label htmlFor="controls">Show controls</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="loop"
            checked={loop}
            onCheckedChange={handleLoopChange}
          />
          <Label htmlFor="loop">Loop video</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="muted"
            checked={muted}
            onCheckedChange={handleMutedChange}
          />
          <Label htmlFor="muted">Muted by default</Label>
        </div>
      </div>
    </div>
  );
}


