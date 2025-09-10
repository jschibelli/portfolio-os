"use client";

import React from 'react';
import { Badge } from '../../ui/badge';
import { cn } from '@/lib/utils';

/**
 * ProjectMeta interface for badge data structure
 * Represents metadata about a project that can be displayed as badges
 */
export interface ProjectMeta {
  /** The label/text to display on the badge */
  label: string;
  /** The type/category of the badge (stack, role, status, year, etc.) */
  type: 'stack' | 'role' | 'status' | 'year' | 'category' | 'technology';
  /** Optional variant for styling */
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  /** Optional custom className for additional styling */
  className?: string;
}

interface QuickStatsProps {
  /** Array of ProjectMeta objects to render as badges */
  items: ProjectMeta[];
  /** Optional className for the container */
  className?: string;
  /** Optional aria-label for accessibility */
  'aria-label'?: string;
}

/**
 * QuickStats component renders a compact list of badges describing project metadata.
 * Features semantic list markup and accessibility compliance.
 */
export default function QuickStats({ 
  items, 
  className,
  'aria-label': ariaLabel = "Project metadata badges"
}: QuickStatsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ul 
      className={cn(
        "flex flex-wrap gap-2 list-none p-0 m-0",
        className
      )}
      role="list"
      aria-label={ariaLabel}
    >
      {items.map((item, index) => (
        <li key={`${item.type}-${item.label}-${index}`} className="list-none">
          <Badge
            variant={item.variant || getDefaultVariant(item.type)}
            className={cn(
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "hover:scale-105 hover:shadow-md",
              "cursor-default",
              item.className
            )}
            tabIndex={0}
            role="listitem"
            aria-label={`${item.type}: ${item.label}`}
          >
            {item.label}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

/**
 * Get default badge variant based on the type
 */
function getDefaultVariant(type: ProjectMeta['type']): ProjectMeta['variant'] {
  switch (type) {
    case 'stack':
    case 'technology':
      return 'default';
    case 'role':
      return 'secondary';
    case 'status':
      return 'outline';
    case 'year':
      return 'outline';
    case 'category':
      return 'secondary';
    default:
      return 'default';
  }
}

/**
 * Utility function to create ProjectMeta from project data
 */
export function createProjectMeta(
  tags: string[], 
  type: ProjectMeta['type'] = 'stack'
): ProjectMeta[] {
  return tags.map(tag => ({
    label: tag,
    type,
    variant: getDefaultVariant(type)
  }));
}

/**
 * Utility function to create ProjectMeta with mixed types
 */
export function createMixedProjectMeta(
  stack: string[] = [],
  role: string[] = [],
  status: string[] = [],
  year: string[] = []
): ProjectMeta[] {
  return [
    ...createProjectMeta(stack, 'stack'),
    ...createProjectMeta(role, 'role'),
    ...createProjectMeta(status, 'status'),
    ...createProjectMeta(year, 'year')
  ];
}
