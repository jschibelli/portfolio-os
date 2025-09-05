// /lib/types/article.ts
// TypeScript types for article editor and API DTOs

import { JSONContent } from '@tiptap/core'

export interface ArticleDraft {
  id?: string
  title: string
  slug: string
  tags: string[]
  coverUrl?: string
  content_json: JSONContent
  content_mdx: string
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED'
  scheduledAt?: Date
}

export interface SaveDraftRequest {
  id?: string
  title: string
  slug: string
  tags: string[]
  coverUrl?: string
  content_json: JSONContent
  content_mdx: string
}

export interface SaveDraftResponse {
  id: string
  slug: string
}

export interface PublishRequest {
  id: string
  publishAt?: Date
}

export interface PublishResponse {
  id: string
  slug: string
  url: string
  publishedAt: Date
}

export interface UploadResponse {
  url: string
  width?: number
  height?: number
}

// Editor-specific types
export interface EditorState {
  title: string
  slug: string
  tags: string[]
  coverUrl?: string
  content: JSONContent
  isPreview: boolean
  isSaving: boolean
  lastSaved?: Date
}

// Component registry types
export interface ComponentProps {
  [key: string]: unknown
}

export interface ComponentDefinition {
  name: string
  props: ComponentProps
}

// Slash command types
export interface SlashCommand {
  title: string
  description: string
  icon: string
  command: (editor: any) => void
  keywords?: string[]
}

// Callout variant types
export type CalloutVariant = 'info' | 'warn' | 'success' | 'error'

// Embed provider types
export type EmbedProvider = 'youtube' | 'tweet'

export interface EmbedData {
  provider: EmbedProvider
  url: string
  id: string
}


