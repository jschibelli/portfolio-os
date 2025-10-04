/**
 * Button Block Settings Component
 * Configuration panel for button blocks
 */

import React from 'react';
import { ButtonBlock } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ButtonBlockSettingsProps {
  block: ButtonBlock;
  onUpdate: (data: Partial<ButtonBlock['data']>) => void;
}

const BUTTON_STYLES = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'outline', label: 'Outline' },
  { value: 'ghost', label: 'Ghost' }
];

const BUTTON_SIZES = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' }
];

const ALIGNMENT_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' }
];

const TARGET_OPTIONS = [
  { value: '_self', label: 'Same window' },
  { value: '_blank', label: 'New window' }
];

export function ButtonBlockSettings({ block, onUpdate }: ButtonBlockSettingsProps) {
  const { text, url, style, size, alignment, target } = block.data;

  const handleTextChange = (newText: string) => {
    onUpdate({ text: newText });
  };

  const handleUrlChange = (newUrl: string) => {
    onUpdate({ url: newUrl });
  };

  const handleStyleChange = (newStyle: string) => {
    onUpdate({ style: newStyle });
  };

  const handleSizeChange = (newSize: string) => {
    onUpdate({ size: newSize });
  };

  const handleAlignmentChange = (newAlignment: string) => {
    onUpdate({ alignment: newAlignment });
  };

  const handleTargetChange = (newTarget: string) => {
    onUpdate({ target: newTarget });
  };

  return (
    <div className="space-y-4">
      {/* Button Text */}
      <div>
        <Label htmlFor="text">Button Text</Label>
        <Input
          id="text"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Enter button text"
        />
      </div>

      {/* Button URL */}
      <div>
        <Label htmlFor="url">Button URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      {/* Button Style */}
      <div>
        <Label htmlFor="style">Button Style</Label>
        <Select value={style} onValueChange={handleStyleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select button style" />
          </SelectTrigger>
          <SelectContent>
            {BUTTON_STYLES.map((styleOption) => (
              <SelectItem key={styleOption.value} value={styleOption.value}>
                {styleOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Button Size */}
      <div>
        <Label htmlFor="size">Button Size</Label>
        <Select value={size} onValueChange={handleSizeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select button size" />
          </SelectTrigger>
          <SelectContent>
            {BUTTON_SIZES.map((sizeOption) => (
              <SelectItem key={sizeOption.value} value={sizeOption.value}>
                {sizeOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Alignment */}
      <div>
        <Label htmlFor="alignment">Alignment</Label>
        <Select value={alignment} onValueChange={handleAlignmentChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select alignment" />
          </SelectTrigger>
          <SelectContent>
            {ALIGNMENT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Target */}
      <div>
        <Label htmlFor="target">Link Target</Label>
        <Select value={target || '_self'} onValueChange={handleTargetChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select link target" />
          </SelectTrigger>
          <SelectContent>
            {TARGET_OPTIONS.map((option) => (
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


