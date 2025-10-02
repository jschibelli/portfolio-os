/**
 * Embed Block Settings Component
 */

import React from 'react';
import { EmbedBlock } from '@/lib/blocks/types';

interface EmbedBlockSettingsProps {
  data: EmbedBlock['data'];
  onUpdate: (data: Partial<EmbedBlock['data']>) => void;
}

export function EmbedBlockSettings({ data, onUpdate }: EmbedBlockSettingsProps) {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="responsive"
          checked={data.responsive}
          onChange={(e) => onUpdate({ responsive: e.target.checked })}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="responsive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Responsive
        </label>
      </div>

      {!data.responsive && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Width (px)
            </label>
            <input
              type="number"
              value={data.width}
              onChange={(e) => onUpdate({ width: parseInt(e.target.value) || 560 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="200"
              max="1920"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Height (px)
            </label>
            <input
              type="number"
              value={data.height}
              onChange={(e) => onUpdate({ height: parseInt(e.target.value) || 315 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="200"
              max="1080"
            />
          </div>
        </>
      )}
    </div>
  );
}
