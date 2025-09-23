// /app/(admin)/admin/articles/_editor/components/StatBadge.tsx
// Example React component for the editor component registry

import React from 'react'

interface StatBadgeProps {
  label: string
  value: string
}

export function StatBadge({ label, value }: StatBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-full px-4 py-2 my-2">
      <span className="text-sm font-medium text-stone-600">{label}:</span>
      <span className="text-sm font-bold text-stone-900">{value}</span>
    </div>
  )
}
