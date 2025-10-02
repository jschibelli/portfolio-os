/**
 * Spacer Block Component
 * Adds vertical spacing between content sections
 */

import React from 'react';
import { SpacerBlock as SpacerBlockType } from '@/lib/blocks/types';

interface SpacerBlockProps {
  block: SpacerBlockType;
  isEditable?: boolean;
  onUpdate?: (data: Partial<SpacerBlockType['data']>) => void;
}

export function SpacerBlock({ block, isEditable = false, onUpdate }: SpacerBlockProps) {
  const { height, unit, background } = block.data;

  const getHeightStyle = () => {
    return `${height}${unit}`;
  };

  if (isEditable) {
    return (
      <div className="py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <div className="px-4 space-y-3">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Spacer Settings
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Height
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => onUpdate?.({ height: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="500"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => onUpdate?.({ unit: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="px">px</option>
                <option value="rem">rem</option>
                <option value="em">em</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Background (optional)
              </label>
              <input
                type="color"
                value={background || '#ffffff'}
                onChange={(e) => onUpdate?.({ background: e.target.value })}
                className="w-full h-10 px-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Preview: {height}{unit} spacing
            </div>
            <div 
              className="w-full border border-gray-300 dark:border-gray-600 rounded"
              style={{ 
                height: getHeightStyle(),
                backgroundColor: background || 'transparent'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        height: getHeightStyle(),
        backgroundColor: background || 'transparent'
      }}
      aria-hidden="true"
    />
  );
}
