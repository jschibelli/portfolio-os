/**
 * Divider Block Settings Component
 * Configuration panel for divider blocks
 */

import React from 'react';
import { DividerBlock } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface DividerBlockSettingsProps {
  block: DividerBlock;
  onUpdate: (data: Partial<DividerBlock['data']>) => void;
}

const DIVIDER_STYLES = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'gradient', label: 'Gradient' }
];

const WIDTH_OPTIONS = [
  { value: 'full', label: 'Full Width' },
  { value: 'half', label: 'Half Width' },
  { value: 'quarter', label: 'Quarter Width' }
];

export function DividerBlockSettings({ block, onUpdate }: DividerBlockSettingsProps) {
  const { style, color, thickness, width } = block.data;

  const handleStyleChange = (newStyle: string) => {
    onUpdate({ style: newStyle });
  };

  const handleColorChange = (newColor: string) => {
    onUpdate({ color: newColor });
  };

  const handleThicknessChange = (newThickness: number[]) => {
    onUpdate({ thickness: newThickness[0] });
  };

  const handleWidthChange = (newWidth: string) => {
    onUpdate({ width: newWidth });
  };

  return (
    <div className="space-y-4">
      {/* Style */}
      <div>
        <Label htmlFor="style">Divider Style</Label>
        <Select value={style} onValueChange={handleStyleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select divider style" />
          </SelectTrigger>
          <SelectContent>
            {DIVIDER_STYLES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color */}
      <div>
        <Label htmlFor="color">Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="color"
            type="color"
            value={color || '#e5e7eb'}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-12 h-10 p-1 border rounded"
          />
          <Input
            type="text"
            value={color || '#e5e7eb'}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#e5e7eb"
            className="flex-1"
          />
        </div>
      </div>

      {/* Thickness */}
      <div>
        <Label htmlFor="thickness">Thickness: {thickness}px</Label>
        <Slider
          id="thickness"
          min={1}
          max={10}
          step={1}
          value={[thickness]}
          onValueChange={handleThicknessChange}
          className="mt-2"
        />
      </div>

      {/* Width */}
      <div>
        <Label htmlFor="width">Width</Label>
        <Select value={width} onValueChange={handleWidthChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select width" />
          </SelectTrigger>
          <SelectContent>
            {WIDTH_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}


