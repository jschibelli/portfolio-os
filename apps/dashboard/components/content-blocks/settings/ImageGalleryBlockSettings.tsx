/**
 * Image Gallery Block Settings Component
 * Configuration panel for image gallery blocks
 */

import React from 'react';
import { ImageGalleryBlock } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface ImageGalleryBlockSettingsProps {
  block: ImageGalleryBlock;
  onUpdate: (data: Partial<ImageGalleryBlock['data']>) => void;
}

const LAYOUT_OPTIONS = [
  { value: 'grid', label: 'Grid' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'masonry', label: 'Masonry' }
];

const SPACING_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' }
];

export function ImageGalleryBlockSettings({ block, onUpdate }: ImageGalleryBlockSettingsProps) {
  const { layout, columns, spacing, showCaptions } = block.data;

  const handleLayoutChange = (newLayout: string) => {
    onUpdate({ layout: newLayout });
  };

  const handleColumnsChange = (newColumns: number[]) => {
    onUpdate({ columns: newColumns[0] });
  };

  const handleSpacingChange = (newSpacing: string) => {
    onUpdate({ spacing: newSpacing });
  };

  const handleShowCaptionsChange = (checked: boolean) => {
    onUpdate({ showCaptions: checked });
  };

  return (
    <div className="space-y-4">
      {/* Layout */}
      <div>
        <Label htmlFor="layout">Layout</Label>
        <Select value={layout} onValueChange={handleLayoutChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            {LAYOUT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Columns (only for grid layout) */}
      {layout === 'grid' && (
        <div>
          <Label htmlFor="columns">Columns: {columns}</Label>
          <Slider
            id="columns"
            min={1}
            max={6}
            step={1}
            value={[columns]}
            onValueChange={handleColumnsChange}
            className="mt-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Number of columns in the grid layout
          </p>
        </div>
      )}

      {/* Spacing */}
      <div>
        <Label htmlFor="spacing">Spacing</Label>
        <Select value={spacing} onValueChange={handleSpacingChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select spacing" />
          </SelectTrigger>
          <SelectContent>
            {SPACING_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Show Captions */}
      <div className="flex items-center space-x-2">
        <Switch
          id="showCaptions"
          checked={showCaptions}
          onCheckedChange={handleShowCaptionsChange}
        />
        <Label htmlFor="showCaptions">Show captions</Label>
      </div>

      {/* Image Count */}
      <div>
        <Label>Images</Label>
        <p className="text-sm text-gray-600 mt-1">
          {block.data.images?.length || 0} images in gallery
        </p>
      </div>
    </div>
  );
}


