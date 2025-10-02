/**
 * Divider Block Component
 * Renders visual separators between content sections
 */

import React from 'react';
import { DividerBlock as DividerBlockType } from '@/lib/blocks/types';

interface DividerBlockProps {
  block: DividerBlockType;
  isEditable?: boolean;
  onUpdate?: (data: Partial<DividerBlockType['data']>) => void;
}

export function DividerBlock({ block, isEditable = false, onUpdate }: DividerBlockProps) {
  const { style, color, thickness, width } = block.data;

  const getWidthClass = (dividerWidth: string) => {
    switch (dividerWidth) {
      case 'full':
        return 'w-full';
      case 'half':
        return 'w-1/2 mx-auto';
      case 'quarter':
        return 'w-1/4 mx-auto';
      default:
        return 'w-full';
    }
  };

  const getBorderStyle = (dividerStyle: string) => {
    switch (dividerStyle) {
      case 'solid':
        return 'border-solid';
      case 'dashed':
        return 'border-dashed';
      case 'dotted':
        return 'border-dotted';
      case 'gradient':
        return '';
      default:
        return 'border-solid';
    }
  };

  const renderDivider = () => {
    if (style === 'gradient') {
      return (
        <div 
          className={`h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent ${getWidthClass(width)}`}
          style={{ height: `${thickness}px` }}
        />
      );
    }

    return (
      <hr
        className={`border-t ${getBorderStyle(style)} ${getWidthClass(width)}`}
        style={{
          borderColor: color || '#e5e7eb',
          borderWidth: `${thickness}px 0 0 0`
        }}
      />
    );
  };

  if (isEditable) {
    return (
      <div className="py-4 space-y-3">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Style
            </label>
            <select
              value={style}
              onChange={(e) => onUpdate?.({ style: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="gradient">Gradient</option>
            </select>
          </div>

          {style !== 'gradient' && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => onUpdate?.({ color: e.target.value })}
                className="w-full h-10 px-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 cursor-pointer"
              />
            </div>
          )}

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thickness ({thickness}px)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={thickness}
              onChange={(e) => onUpdate?.({ thickness: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Width
            </label>
            <select
              value={width}
              onChange={(e) => onUpdate?.({ width: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="full">Full</option>
              <option value="half">Half</option>
              <option value="quarter">Quarter</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview:</div>
          {renderDivider()}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {renderDivider()}
    </div>
  );
}
