/**
 * Quote Block Settings Component
 * Configuration panel for quote blocks
 */

import React from 'react';
import { QuoteBlock } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuoteBlockSettingsProps {
  block: QuoteBlock;
  onUpdate: (data: Partial<QuoteBlock['data']>) => void;
}

const QUOTE_STYLES = [
  { value: 'default', label: 'Default' },
  { value: 'highlighted', label: 'Highlighted' },
  { value: 'minimal', label: 'Minimal' }
];

const ALIGNMENT_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' }
];

export function QuoteBlockSettings({ block, onUpdate }: QuoteBlockSettingsProps) {
  const { text, author, source, style, alignment } = block.data;

  const handleTextChange = (newText: string) => {
    onUpdate({ text: newText });
  };

  const handleAuthorChange = (newAuthor: string) => {
    onUpdate({ author: newAuthor });
  };

  const handleSourceChange = (newSource: string) => {
    onUpdate({ source: newSource });
  };

  const handleStyleChange = (newStyle: string) => {
    onUpdate({ style: newStyle });
  };

  const handleAlignmentChange = (newAlignment: string) => {
    onUpdate({ alignment: newAlignment });
  };

  return (
    <div className="space-y-4">
      {/* Quote Text */}
      <div>
        <Label htmlFor="text">Quote Text</Label>
        <Textarea
          id="text"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Enter quote text"
          rows={4}
        />
      </div>

      {/* Author */}
      <div>
        <Label htmlFor="author">Author (optional)</Label>
        <Input
          id="author"
          value={author || ''}
          onChange={(e) => handleAuthorChange(e.target.value)}
          placeholder="Enter author name"
        />
      </div>

      {/* Source */}
      <div>
        <Label htmlFor="source">Source (optional)</Label>
        <Input
          id="source"
          value={source || ''}
          onChange={(e) => handleSourceChange(e.target.value)}
          placeholder="Enter source (e.g., book, article, website)"
        />
      </div>

      {/* Style */}
      <div>
        <Label htmlFor="style">Quote Style</Label>
        <Select value={style} onValueChange={handleStyleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select quote style" />
          </SelectTrigger>
          <SelectContent>
            {QUOTE_STYLES.map((styleOption) => (
              <SelectItem key={styleOption.value} value={styleOption.value}>
                {styleOption.label}
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
    </div>
  );
}


