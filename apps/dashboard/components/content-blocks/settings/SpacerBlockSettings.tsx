/**
 * Spacer Block Settings Component
 * Configuration panel for spacer blocks
 */

import React from 'react';
import { SpacerBlock } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface SpacerBlockSettingsProps {
  block: SpacerBlock;
  onUpdate: (data: Partial<SpacerBlock['data']>) => void;
}

const UNIT_OPTIONS = [
  { value: 'px', label: 'Pixels (px)' },
  { value: 'rem', label: 'Rem (rem)' },
  { value: 'em', label: 'Em (em)' }
];

export function SpacerBlockSettings({ block, onUpdate }: SpacerBlockSettingsProps) {
  const { height, unit, background } = block.data;

  const handleHeightChange = (newHeight: number[]) => {
    onUpdate({ height: newHeight[0] });
  };

  const handleUnitChange = (newUnit: string) => {
    onUpdate({ unit: newUnit });
  };

  const handleBackgroundChange = (newBackground: string) => {
    onUpdate({ background: newBackground });
  };

  const getMaxHeight = () => {
    switch (unit) {
      case 'px': return 200;
      case 'rem': return 12;
      case 'em': return 12;
      default: return 200;
    }
  };

  const getStep = () => {
    switch (unit) {
      case 'px': return 1;
      case 'rem': return 0.1;
      case 'em': return 0.1;
      default: return 1;
    }
  };

  return (
    <div className="space-y-4">
      {/* Height */}
      <div>
        <Label htmlFor="height">Height: {height}{unit}</Label>
        <Slider
          id="height"
          min={0}
          max={getMaxHeight()}
          step={getStep()}
          value={[height]}
          onValueChange={handleHeightChange}
          className="mt-2"
        />
      </div>

      {/* Unit */}
      <div>
        <Label htmlFor="unit">Unit</Label>
        <Select value={unit} onValueChange={handleUnitChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            {UNIT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Background Color */}
      <div>
        <Label htmlFor="background">Background Color (optional)</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="background"
            type="color"
            value={background || '#ffffff'}
            onChange={(e) => handleBackgroundChange(e.target.value)}
            className="w-12 h-10 p-1 border rounded"
          />
          <Input
            type="text"
            value={background || ''}
            onChange={(e) => handleBackgroundChange(e.target.value)}
            placeholder="Leave empty for transparent"
            className="flex-1"
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Leave empty for transparent spacer
        </p>
      </div>
    </div>
  );
}


