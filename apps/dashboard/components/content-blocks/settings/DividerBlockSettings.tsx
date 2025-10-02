/**
 * Divider Block Settings Component
 */

import React from 'react';
import { DividerBlock } from '@/lib/blocks/types';

interface DividerBlockSettingsProps {
  data: DividerBlock['data'];
  onUpdate: (data: Partial<DividerBlock['data']>) => void;
}

export function DividerBlockSettings({ data, onUpdate }: DividerBlockSettingsProps) {
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
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
          <option value="gradient">Gradient</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Width
        </label>
        <select
          value={data.width}
          onChange={(e) => onUpdate({ width: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="full">Full</option>
          <option value="half">Half</option>
          <option value="quarter">Quarter</option>
        </select>
      </div>
    </div>
  );
}
