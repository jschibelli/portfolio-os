// /app/(admin)/admin/articles/_editor/components/registry.tsx
// Component registry for React components in the editor

import React from 'react'
import { InfoCard } from './InfoCard'
import { StatBadge } from './StatBadge'
import { ComponentProps } from '@/lib/types/article'

export const COMPONENT_REGISTRY = {
  InfoCard,
  StatBadge,
} as const

export type ComponentName = keyof typeof COMPONENT_REGISTRY

export function renderComponent(
  name: ComponentName,
  props: ComponentProps
): React.ReactElement {
  const Component = COMPONENT_REGISTRY[name]
  if (!Component) {
    return <div className="text-red-500">Unknown component: {name}</div>
  }
  
  // Provide default props for components that require them
  const defaultProps = {
    title: 'Untitled',
    label: 'Label',
    value: 'Value',
    ...props
  }
  
  return <Component {...defaultProps} />
}

export function getComponentNames(): ComponentName[] {
  return Object.keys(COMPONENT_REGISTRY) as ComponentName[]
}

export function getComponentProps(name: ComponentName): string[] {
  // This would ideally be generated from TypeScript types
  // For now, we'll hardcode the known props
  switch (name) {
    case 'InfoCard':
      return ['title', 'children']
    case 'StatBadge':
      return ['label', 'value']
    default:
      return []
  }
}
