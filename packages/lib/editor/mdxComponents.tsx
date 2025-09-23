// /lib/editor/mdxComponents.tsx
// MDX components for preview rendering
// These components are used when rendering MDX in the preview pane

import React from 'react'
import { CalloutVariant } from '@/lib/types/article'

interface CalloutProps {
  variant?: CalloutVariant
  title?: string
  children: React.ReactNode
}

export function Callout({ variant = 'info', title, children }: CalloutProps) {
  const variants = {
    info: {
      icon: 'ℹ️',
      className: 'border-blue-200 bg-blue-50 text-blue-900',
      iconClassName: 'text-blue-600'
    },
    warn: {
      icon: '⚠️',
      className: 'border-yellow-200 bg-yellow-50 text-yellow-900',
      iconClassName: 'text-yellow-600'
    },
    success: {
      icon: '✅',
      className: 'border-green-200 bg-green-50 text-green-900',
      iconClassName: 'text-green-600'
    },
    error: {
      icon: '❌',
      className: 'border-red-200 bg-red-50 text-red-900',
      iconClassName: 'text-red-600'
    }
  }

  const config = variants[variant]

  return (
    <div className={`rounded-lg border p-4 ${config.className}`}>
      <div className="flex items-start gap-3">
        <span className={`text-lg ${config.iconClassName}`}>
          {config.icon}
        </span>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-2">{title}</h4>
          )}
          <div className="prose prose-sm max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

interface YouTubeProps {
  id: string
}

export function YouTube({ id }: YouTubeProps) {
  return (
    <div className="relative w-full h-0 pb-[56.25%] my-6">
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

interface TweetProps {
  id: string
}

export function Tweet({ id }: TweetProps) {
  return (
    <div className="my-6 flex justify-center">
      <blockquote className="twitter-tweet">
        <a href={`https://twitter.com/x/status/${id}`}>
          Loading tweet...
        </a>
      </blockquote>
    </div>
  )
}

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

// Export all components for MDX rendering
export const mdxComponents = {
  Callout,
  YouTube,
  Tweet,
  InfoCard,
  StatBadge,
}

