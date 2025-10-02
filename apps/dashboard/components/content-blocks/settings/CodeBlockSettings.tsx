/**
 * Code Block Settings Component
 */

import React from 'react';
import { CodeBlock } from '@/lib/blocks/types';

interface CodeBlockSettingsProps {
  data: CodeBlock['data'];
  onUpdate: (data: Partial<CodeBlock['data']>) => void;
}

export function CodeBlockSettings({ data, onUpdate }: CodeBlockSettingsProps) {
  const languages = [
    'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'c',
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala',
    'html', 'css', 'scss', 'json', 'yaml', 'markdown',
    'bash', 'shell', 'sql', 'graphql', 'dockerfile'
  ];

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Language
        </label>
        <select
          value={data.language}
          onChange={(e) => onUpdate({ language: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Filename (optional)
        </label>
        <input
          type="text"
          value={data.filename || ''}
          onChange={(e) => onUpdate({ filename: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., index.js"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="showLineNumbers"
          checked={data.showLineNumbers}
          onChange={(e) => onUpdate({ showLineNumbers: e.target.checked })}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="showLineNumbers" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Show line numbers
        </label>
      </div>
    </div>
  );
}
