/**
 * Quote Block Settings Component
 */

import React from 'react';
import { QuoteBlock } from '@/lib/blocks/types';

interface QuoteBlockSettingsProps {
  data: QuoteBlock['data'];
  onUpdate: (data: Partial<QuoteBlock['data']>) => void;
}

export function QuoteBlockSettings({ data, onUpdate }: QuoteBlockSettingsProps) {
  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Style
        </label>
        <select
          value={data.style}
          onChange={(e) => onUpdate({ style: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Default</option>
          <option value="highlighted">Highlighted</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Alignment
        </label>
        <select
          value={data.alignment}
          onChange={(e) => onUpdate({ alignment: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );
}
