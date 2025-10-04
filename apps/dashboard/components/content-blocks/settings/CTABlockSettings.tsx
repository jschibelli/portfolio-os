/**
 * CTA Block Settings Component
 * Configuration panel for CTA blocks
 */

import React from 'react';
import { CTABlock } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CTABlockSettingsProps {
  block: CTABlock;
  onUpdate: (data: Partial<CTABlock['data']>) => void;
}

const BUTTON_STYLES = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'outline', label: 'Outline' }
];

const ALIGNMENT_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' }
];

const BACKGROUND_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'solid', label: 'Solid' },
  { value: 'pattern', label: 'Pattern' }
];

export function CTABlockSettings({ block, onUpdate }: CTABlockSettingsProps) {
  const { title, description, buttonText, buttonUrl, buttonStyle, alignment, background } = block.data;

  const handleTitleChange = (newTitle: string) => {
    onUpdate({ title: newTitle });
  };

  const handleDescriptionChange = (newDescription: string) => {
    onUpdate({ description: newDescription });
  };

  const handleButtonTextChange = (newButtonText: string) => {
    onUpdate({ buttonText: newButtonText });
  };

  const handleButtonUrlChange = (newButtonUrl: string) => {
    onUpdate({ buttonUrl: newButtonUrl });
  };

  const handleButtonStyleChange = (newButtonStyle: string) => {
    onUpdate({ buttonStyle: newButtonStyle });
  };

  const handleAlignmentChange = (newAlignment: string) => {
    onUpdate({ alignment: newAlignment });
  };

  const handleBackgroundChange = (newBackground: string) => {
    onUpdate({ background: newBackground });
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter CTA title"
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description || ''}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Enter CTA description"
          rows={3}
        />
      </div>

      {/* Button Text */}
      <div>
        <Label htmlFor="buttonText">Button Text</Label>
        <Input
          id="buttonText"
          value={buttonText}
          onChange={(e) => handleButtonTextChange(e.target.value)}
          placeholder="Enter button text"
        />
      </div>

      {/* Button URL */}
      <div>
        <Label htmlFor="buttonUrl">Button URL</Label>
        <Input
          id="buttonUrl"
          value={buttonUrl}
          onChange={(e) => handleButtonUrlChange(e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      {/* Button Style */}
      <div>
        <Label htmlFor="buttonStyle">Button Style</Label>
        <Select value={buttonStyle} onValueChange={handleButtonStyleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select button style" />
          </SelectTrigger>
          <SelectContent>
            {BUTTON_STYLES.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
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

      {/* Background */}
      <div>
        <Label htmlFor="background">Background</Label>
        <Select value={background || ''} onValueChange={handleBackgroundChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select background" />
          </SelectTrigger>
          <SelectContent>
            {BACKGROUND_OPTIONS.map((option) => (
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


