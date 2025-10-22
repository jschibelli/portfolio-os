/**
 * Article API Types
 * Type definitions for article-related API requests and responses
 * @module article-types
 */

/**
 * Block content structure for the block editor
 * Represents a single content block with type and content
 */
export interface BlockContent {
  id: string
  type: 'text' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'heading6' | 'bulletList' | 'orderedList' | 'taskList' | 'quote' | 'code' | 'image' | 'callout' | 'calloutInfo' | 'calloutWarning' | 'calloutSuccess' | 'calloutError' | 'horizontalRule' | 'details' | 'table' | 'mention' | 'widget' | 'reactComponent' | 'infoCard' | 'statBadge' | 'youtube' | 'twitter' | 'githubGist' | 'codepen' | 'codesandbox' | 'embed' | string
  content: string
  placeholder?: string
  calloutType?: 'info' | 'warning' | 'success' | 'error'
}

/**
 * Article content JSON structure
 * Structured representation of article content
 */
export interface ArticleContentJson {
  blocks: BlockContent[]
}

/**
 * Request payload for saving article drafts
 * Contains all article data including content and SEO metadata
 */
export interface SaveDraftRequest {
  /** Existing article ID for updates, omit for new articles */
  id?: string
  
  /** Article title (required, 1-200 characters) */
  title: string
  
  /** Article subtitle (optional, max 300 characters) */
  subtitle?: string
  
  /** URL-safe slug (required, lowercase, hyphens only) */
  slug: string
  
  /** Array of tag IDs associated with the article */
  tags?: string[]
  
  /** Cover image URL (optional, must be valid URL) */
  coverUrl?: string
  
  /** Structured article content (block editor format) */
  contentJson?: ArticleContentJson | any
  
  /** Markdown/MDX representation of content */
  contentMdx?: string
  
  /** Article excerpt/summary (optional, max 500 characters) */
  excerpt?: string
  
  // SEO Fields
  /** SEO meta title (optional, recommended 50-60 characters) */
  metaTitle?: string
  
  /** SEO meta description (optional, recommended 150-160 characters) */
  metaDescription?: string
  
  /** Canonical URL to prevent duplicate content issues */
  canonicalUrl?: string
  
  /** Prevent search engine indexing when true */
  noindex?: boolean
  
  /** Open Graph title override (optional, max 60 characters) */
  ogTitle?: string
  
  /** Open Graph description override (optional, max 200 characters) */
  ogDescription?: string
  
  /** Open Graph image URL (recommended 1200x630px) */
  ogImage?: string
  
  /** Twitter Card type */
  twitterCard?: 'summary' | 'summary_large_image'
  
  /** Twitter title override (optional, max 70 characters) */
  twitterTitle?: string
  
  /** Twitter description override (optional, max 200 characters) */
  twitterDescription?: string
  
  /** Twitter image URL (recommended 1200x675px) */
  twitterImage?: string
  
  /** Primary SEO keyword for the article */
  focusKeyword?: string
  
  /** Calculated SEO score (0-100) */
  seoScore?: number
}

/**
 * Response from save draft API endpoint
 * Returns article ID and slug on success
 */
export interface SaveDraftResponse {
  /** Operation success status */
  success: boolean
  
  /** Article unique identifier */
  id: string
  
  /** Article URL slug */
  slug: string
}

/**
 * Request payload for publishing articles
 * Simple payload containing only the article ID
 */
export interface PublishRequest {
  /** Article ID to publish (required) */
  id: string
}

/**
 * Response from publish API endpoint
 * Returns publication status and timestamp
 */
export interface PublishResponse {
  /** Operation success status */
  success: boolean
  
  /** Published article ID */
  id: string
  
  /** ISO 8601 publication timestamp */
  publishedAt: string
}

/**
 * Response from media upload API endpoint
 * Returns uploaded file details and URL
 */
export interface UploadResponse {
  /** Upload success status */
  success: boolean
  
  /** Public URL of uploaded file */
  url: string
  
  /** Server-side filename */
  filename: string
  
  /** File size in bytes */
  size: number
  
  /** MIME type of uploaded file */
  type: string
}

/**
 * Standard error response structure
 * Used across all API endpoints for consistent error handling
 */
export interface ApiErrorResponse {
  /** Error status (always false) */
  success: false
  
  /** Human-readable error message */
  error: string
  
  /** HTTP status code */
  statusCode: number
  
  /** Optional validation errors */
  validationErrors?: Array<{
    field: string
    message: string
  }>
}
