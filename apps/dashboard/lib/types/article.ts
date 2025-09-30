// Article types for API requests and responses

export interface SaveDraftRequest {
  id?: string
  title: string
  subtitle?: string
  slug: string
  tags: string[]
  coverUrl?: string
  content_json: any
  content_mdx: string
  excerpt?: string
  // SEO fields
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  noindex?: boolean
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: 'summary' | 'summary_large_image'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  focusKeyword?: string
  seoScore?: number
}

export interface SaveDraftResponse {
  success: boolean
  id: string
  slug: string
}

export interface PublishRequest {
  id: string
}

export interface PublishResponse {
  success: boolean
  id: string
  publishedAt: string
}

export interface UploadResponse {
  success: boolean
  url: string
  filename: string
  size: number
  type: string
}
