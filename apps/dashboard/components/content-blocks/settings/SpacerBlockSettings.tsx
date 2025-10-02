/**
 * Spacer Block Settings Component
 */

import React from 'react';
import { SpacerBlock } from '@/lib/blocks/types';

interface SpacerBlockSettingsProps {
  data: SpacerBlock['data'];
  onUpdate: (data: Partial<SpacerBlock['data']>) => void;
}

export function SpacerBlockSettings({ data, onUpdate }: SpacerBlockSettingsProps) {
  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Height
        </label>
        <input
          type="number"
          value={data.height}
          onChange={(e) => onUpdate({ height: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
          max="500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Unit
        </label>
        <select
          value={data.unit}
          onChange={(e) => onUpdate({ unit: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="px">px</option>
          <option value="rem">rem</option>
          <option value="em">em</option>
        </select>
      </div>
    </div>
  );
}
