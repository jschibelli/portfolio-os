/**
 * Embed Block Settings Component
 * Configuration panel for embed blocks
 */

import React from 'react';
import { EmbedBlock } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface EmbedBlockSettingsProps {
  block: EmbedBlock;
  onUpdate: (data: Partial<EmbedBlock['data']>) => void;
}

const EMBED_PLATFORMS = [
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'vimeo', label: 'Vimeo' },
  { value: 'codepen', label: 'CodePen' },
  { value: 'jsfiddle', label: 'JSFiddle' },
  { value: 'other', label: 'Other' }
];

export function EmbedBlockSettings({ block, onUpdate }: EmbedBlockSettingsProps) {
  const { url, title, width, height, responsive } = block.data;

  const handleUrlChange = (newUrl: string) => {
    onUpdate({ url: newUrl });
  };

  const handleTitleChange = (newTitle: string) => {
    onUpdate({ title: newTitle });
  };

  const handleWidthChange = (newWidth: number[]) => {
    onUpdate({ width: newWidth[0] });
  };

  const handleHeightChange = (newHeight: number[]) => {
    onUpdate({ height: newHeight[0] });
  };

  const handleResponsiveChange = (checked: boolean) => {
    onUpdate({ responsive: checked });
  };

  const detectPlatform = (url: string) => {
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    if (url.includes('codepen.io')) return 'codepen';
    if (url.includes('jsfiddle.net')) return 'jsfiddle';
    return 'other';
  };

  const platform = detectPlatform(url);

  return (
    <div className="space-y-4">
      {/* Platform */}
      <div>
        <Label htmlFor="platform">Platform</Label>
        <Select value={platform} disabled>
          <SelectTrigger>
            <SelectValue placeholder="Platform will be auto-detected" />
          </SelectTrigger>
          <SelectContent>
            {EMBED_PLATFORMS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 mt-1">
          Platform is automatically detected from the URL
        </p>
      </div>

      {/* URL */}
      <div>
        <Label htmlFor="url">Embed URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://twitter.com/username/status/1234567890"
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter the URL of the content you want to embed
        </p>
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="title">Title (optional)</Label>
        <Input
          id="title"
          value={title || ''}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter embed title"
        />
      </div>

      {/* Responsive */}
      <div className="flex items-center space-x-2">
        <Switch
          id="responsive"
          checked={responsive}
          onCheckedChange={handleResponsiveChange}
        />
        <Label htmlFor="responsive">Responsive</Label>
      </div>
      <p className="text-sm text-gray-500">
        When enabled, the embed will automatically adjust to container width
      </p>

      {/* Dimensions (only when not responsive) */}
      {!responsive && (
        <>
          <div>
            <Label htmlFor="width">Width: {width}px</Label>
            <Slider
              id="width"
              min={200}
              max={1200}
              step={10}
              value={[width]}
              onValueChange={handleWidthChange}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="height">Height: {height}px</Label>
            <Slider
              id="height"
              min={200}
              max={800}
              step={10}
              value={[height]}
              onValueChange={handleHeightChange}
              className="mt-2"
            />
          </div>
        </>
      )}

      {/* Platform-specific help */}
      {platform && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            {EMBED_PLATFORMS.find(p => p.value === platform)?.label} Embed
          </h4>
          <p className="text-sm text-blue-700">
            {platform === 'twitter' && 'Paste a Twitter/X post URL to embed it'}
            {platform === 'instagram' && 'Paste an Instagram post URL to embed it'}
            {platform === 'tiktok' && 'Paste a TikTok video URL to embed it'}
            {platform === 'youtube' && 'Paste a YouTube video URL to embed it'}
            {platform === 'vimeo' && 'Paste a Vimeo video URL to embed it'}
            {platform === 'codepen' && 'Paste a CodePen URL to embed it'}
            {platform === 'jsfiddle' && 'Paste a JSFiddle URL to embed it'}
            {platform === 'other' && 'This URL will be embedded as an iframe'}
          </p>
        </div>
      )}
    </div>
  );
}


