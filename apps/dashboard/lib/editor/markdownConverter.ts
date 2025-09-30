// /lib/editor/markdownConverter.ts
// Utilities to convert between TipTap HTML and Markdown

import TurndownService from 'turndown'
import DOMPurify from 'dompurify'

// Initialize Turndown service for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---'
})

// Add custom rules for better conversion
turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  replacement: (content: string) => `~~${content}~~`
})

turndownService.addRule('taskList', {
  filter: (node: HTMLElement) => {
    return (
      node.nodeName === 'LI' &&
      node.parentNode &&
      node.parentNode.nodeName === 'UL' &&
      node.getAttribute('data-type') === 'taskItem'
    )
  },
  replacement: (content: string, node: HTMLElement) => {
    const isChecked = node.getAttribute('data-checked') === 'true'
    return `${isChecked ? '- [x]' : '- [ ]'} ${content}`
  }
})

/**
 * Convert TipTap HTML to Markdown
 * @param html - HTML content from TipTap editor
 * @returns Markdown string
 */
export function tiptapToMarkdown(html: string): string {
  try {
    // Sanitize HTML before conversion
    const sanitizedHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'del', 's', 'strike', 'code', 'pre', 
                     'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 
                     'a', 'img', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'data-type', 'data-checked']
    })
    return turndownService.turndown(sanitizedHtml)
  } catch (error) {
    console.error('Error converting HTML to Markdown:', error)
    return html
  }
}

/**
 * Convert headers from markdown to HTML
 * @param text - Text containing markdown headers
 * @returns Text with HTML headers
 */
function convertHeaders(text: string): string {
  let result = text
  result = result.replace(/^###### (.*$)/gim, '<h6>$1</h6>')
  result = result.replace(/^##### (.*$)/gim, '<h5>$1</h5>')
  result = result.replace(/^#### (.*$)/gim, '<h4>$1</h4>')
  result = result.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  result = result.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  result = result.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  return result
}

/**
 * Convert inline formatting (bold, italic, strikethrough, code)
 * @param text - Text with markdown formatting
 * @returns Text with HTML formatting
 */
function convertInlineFormatting(text: string): string {
  let result = text
  // Bold (must come before italic to handle ** correctly)
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // Strikethrough
  result = result.replace(/~~(.+?)~~/g, '<del>$1</del>')
  // Inline code
  result = result.replace(/`(.+?)`/g, '<code>$1</code>')
  return result
}

/**
 * Convert code blocks from markdown to HTML
 * @param text - Text containing markdown code blocks
 * @returns Text with HTML code blocks
 */
function convertCodeBlocks(text: string): string {
  return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const sanitizedCode = code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return `<pre><code${lang ? ` class="language-${lang}"` : ''}>${sanitizedCode}</code></pre>`
  })
}

/**
 * Convert links and images from markdown to HTML
 * @param text - Text containing markdown links/images
 * @returns Text with HTML links/images
 */
function convertLinksAndImages(text: string): string {
  let result = text
  // Images (must come before links)
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    // Basic URL validation
    if (!src.match(/^(https?:\/\/|\/)/)) {
      return match // Return original if invalid URL
    }
    return `<img src="${src}" alt="${alt}" />`
  })
  // Links
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, href) => {
    // Basic URL validation
    if (!href.match(/^(https?:\/\/|\/|#)/)) {
      return match // Return original if invalid URL
    }
    return `<a href="${href}">${text}</a>`
  })
  return result
}

/**
 * Convert lists (ordered, unordered, task lists) from markdown to HTML
 * @param text - Text containing markdown lists
 * @returns Text with HTML lists
 */
function convertLists(text: string): string {
  let result = text
  
  // Task lists
  result = result.replace(/^- \[([ x])\] (.+$)/gim, (match, checked, content) => {
    return `<li data-type="taskItem" data-checked="${checked === 'x'}">${content}</li>`
  })
  
  // Unordered lists
  result = result.replace(/^\- (.+$)/gim, '<li>$1</li>')
  result = result.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  
  // Ordered lists
  result = result.replace(/^\d+\. (.+$)/gim, '<li>$1</li>')
  
  return result
}

/**
 * Convert blockquotes and horizontal rules
 * @param text - Text containing markdown blockquotes/rules
 * @returns Text with HTML blockquotes/rules
 */
function convertBlockElements(text: string): string {
  let result = text
  result = result.replace(/^> (.+$)/gim, '<blockquote>$1</blockquote>')
  result = result.replace(/^---$/gim, '<hr />')
  return result
}

/**
 * Wrap text in paragraphs
 * @param text - Text to process
 * @returns Text with paragraph tags
 */
function wrapParagraphs(text: string): string {
  return text.split('\n\n').map(p => {
    if (!p.trim()) return ''
    if (p.startsWith('<')) return p
    return `<p>${p}</p>`
  }).join('\n')
}

/**
 * Convert Markdown to TipTap-compatible HTML
 * @param markdown - Markdown string to convert
 * @returns Sanitized HTML string
 */
export function markdownToTiptap(markdown: string): string {
  try {
    if (!markdown || typeof markdown !== 'string') {
      return ''
    }

    let html = markdown

    // Apply conversions in order
    html = convertCodeBlocks(html)  // First, to protect code from other conversions
    html = convertHeaders(html)
    html = convertInlineFormatting(html)
    html = convertLinksAndImages(html)
    html = convertLists(html)
    html = convertBlockElements(html)
    html = wrapParagraphs(html)

    // Sanitize the generated HTML to prevent XSS
    const sanitizedHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'del', 's', 'strike', 'code', 'pre', 
                     'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 
                     'a', 'img', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'data-type', 'data-checked']
    })

    return sanitizedHtml
  } catch (error) {
    console.error('Error converting Markdown to HTML:', error)
    return ''
  }
}

/**
 * Sanitize markdown content to prevent XSS attacks
 * @param markdown - Raw markdown string
 * @returns Sanitized markdown string
 */
export function sanitizeMarkdown(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return ''
  }

  // Remove potentially dangerous patterns
  let sanitized = markdown.trim()
  
  // Remove script tags and event handlers
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/javascript:/gi, '')
  
  // Remove potentially dangerous HTML entities
  sanitized = sanitized.replace(/&lt;script/gi, '')
  sanitized = sanitized.replace(/&lt;iframe/gi, '')
  
  return sanitized
}

/**
 * Validate if a string is safe markdown
 * @param markdown - Markdown string to validate
 * @returns True if safe, false otherwise
 */
export function isMarkdownSafe(markdown: string): boolean {
  if (!markdown || typeof markdown !== 'string') {
    return true
  }

  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /eval\(/i,
    /expression\(/i
  ]

  return !dangerousPatterns.some(pattern => pattern.test(markdown))
}