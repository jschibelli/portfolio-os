// /app/(admin)/admin/articles/_editor/components/InfoCard.tsx
// Example React component for the editor component registry

import React from 'react'

interface InfoCardProps {
  title: string
  children?: React.ReactNode
}

export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 my-6">
      <h3 className="text-lg font-semibold text-stone-900 mb-3">{title}</h3>
      {children && (
        <div className="text-stone-700">
          {children}
        </div>
      )}
    </div>
  )
}
