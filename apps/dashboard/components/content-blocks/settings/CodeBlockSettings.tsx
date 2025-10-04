/**
 * Code Block Settings Component
 * Configuration panel for code blocks
 */

import React from 'react';
import { CodeBlock } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CodeBlockSettingsProps {
  block: CodeBlock;
  onUpdate: (data: Partial<CodeBlock['data']>) => void;
}

const PROGRAMMING_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'php',
  'ruby', 'go', 'rust', 'swift', 'kotlin', 'dart', 'r', 'sql',
  'html', 'css', 'scss', 'sass', 'less', 'json', 'yaml', 'xml',
  'bash', 'powershell', 'dockerfile', 'markdown', 'plaintext'
];

export function CodeBlockSettings({ block, onUpdate }: CodeBlockSettingsProps) {
  const { code, language, filename, showLineNumbers, highlightLines } = block.data;

  const handleLanguageChange = (newLanguage: string) => {
    onUpdate({ language: newLanguage });
  };

  const handleFilenameChange = (newFilename: string) => {
    onUpdate({ filename: newFilename });
  };

  const handleShowLineNumbersChange = (checked: boolean) => {
    onUpdate({ showLineNumbers: checked });
  };

  const handleHighlightLinesChange = (value: string) => {
    const lines = value.split(',').map(line => parseInt(line.trim())).filter(line => !isNaN(line));
    onUpdate({ highlightLines: lines });
  };

  return (
    <div className="space-y-4">
      {/* Language Selection */}
      <div>
        <Label htmlFor="language">Programming Language</Label>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {PROGRAMMING_LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filename */}
      <div>
        <Label htmlFor="filename">Filename (optional)</Label>
        <Input
          id="filename"
          value={filename || ''}
          onChange={(e) => handleFilenameChange(e.target.value)}
          placeholder="e.g., app.js, styles.css"
        />
      </div>

      {/* Show Line Numbers */}
      <div className="flex items-center space-x-2">
        <Switch
          id="showLineNumbers"
          checked={showLineNumbers}
          onCheckedChange={handleShowLineNumbersChange}
        />
        <Label htmlFor="showLineNumbers">Show line numbers</Label>
      </div>

      {/* Highlight Lines */}
      <div>
        <Label htmlFor="highlightLines">Highlight lines (comma-separated)</Label>
        <Input
          id="highlightLines"
          value={highlightLines?.join(', ') || ''}
          onChange={(e) => handleHighlightLinesChange(e.target.value)}
          placeholder="e.g., 1, 3, 5-8"
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter line numbers to highlight (e.g., 1, 3, 5-8)
        </p>
      </div>

      {/* Code Preview */}
      <div>
        <Label>Code Preview</Label>
        <div className="mt-2 p-3 bg-gray-900 rounded-lg font-mono text-sm text-gray-100 max-h-32 overflow-y-auto">
          <pre className="whitespace-pre-wrap">{code || '// No code provided'}</pre>
        </div>
      </div>
    </div>
  );
}


