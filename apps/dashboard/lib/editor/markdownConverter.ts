// /lib/editor/markdownConverter.ts
// Utilities to convert between TipTap HTML and Markdown

import TurndownService from 'turndown'

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
 */
export function tiptapToMarkdown(html: string): string {
  try {
    return turndownService.turndown(html)
  } catch (error) {
    console.error('Error converting HTML to Markdown:', error)
    return html
  }
}

/**
 * Convert Markdown to TipTap-compatible HTML
 * This is a simple implementation - TipTap can handle markdown directly
 * through its extensions, but we provide basic conversion here
 */
export function markdownToTiptap(markdown: string): string {
  // TipTap can parse markdown directly when using StarterKit
  // For now, we'll do basic conversions for common patterns
  
  let html = markdown
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  
  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')
  
  // Inline code
  html = html.replace(/`(.+?)`/g, '<code>$1</code>')
  
  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code${lang ? ` class="language-${lang}"` : ''}>${code.trim()}</code></pre>`
  })
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
  
  // Blockquotes
  html = html.replace(/^> (.+$)/gim, '<blockquote>$1</blockquote>')
  
  // Unordered lists
  html = html.replace(/^\- (.+$)/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  
  // Ordered lists
  html = html.replace(/^\d+\. (.+$)/gim, '<li>$1</li>')
  
  // Task lists
  html = html.replace(/^- \[([ x])\] (.+$)/gim, (match, checked, content) => {
    return `<li data-type="taskItem" data-checked="${checked === 'x'}">${content}</li>`
  })
  
  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr />')
  
  // Paragraphs
  html = html.split('\n\n').map(p => {
    if (!p.trim()) return ''
    if (p.startsWith('<')) return p
    return `<p>${p}</p>`
  }).join('\n')
  
  return html
}

/**
 * Sanitize markdown content
 */
export function sanitizeMarkdown(markdown: string): string {
  return markdown.trim()
}
