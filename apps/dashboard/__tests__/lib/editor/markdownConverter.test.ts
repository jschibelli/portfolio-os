// /lib/editor/__tests__/markdownConverter.test.ts
// Unit tests for markdown conversion utilities

import { describe, it, expect } from '@jest/globals'
import { 
  tiptapToMarkdown, 
  markdownToTiptap, 
  sanitizeMarkdown,
  isMarkdownSafe 
} from '../../../lib/editor/markdownConverter'

describe('markdownConverter', () => {
  describe('tiptapToMarkdown', () => {
    it('should convert bold text correctly', () => {
      const html = '<p><strong>bold text</strong></p>'
      const result = tiptapToMarkdown(html)
      expect(result).toContain('**bold text**')
    })

    it('should convert italic text correctly', () => {
      const html = '<p><em>italic text</em></p>'
      const result = tiptapToMarkdown(html)
      expect(result).toContain('_italic text_') // Turndown uses underscores for italic
    })

    it('should convert headers correctly', () => {
      const html = '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>'
      const result = tiptapToMarkdown(html)
      expect(result).toContain('# Heading 1')
      expect(result).toContain('## Heading 2')
      expect(result).toContain('### Heading 3')
    })

    it('should convert links correctly', () => {
      const html = '<p><a href="https://example.com">link text</a></p>'
      const result = tiptapToMarkdown(html)
      expect(result).toContain('[link text](https://example.com)')
    })

    it('should convert code blocks correctly', () => {
      const html = '<pre><code class="language-javascript">const x = 1;</code></pre>'
      const result = tiptapToMarkdown(html)
      expect(result).toContain('```')
      expect(result).toContain('const x = 1;')
    })

    it('should handle empty input', () => {
      expect(tiptapToMarkdown('')).toBe('')
    })

    it('should sanitize malicious HTML', () => {
      const maliciousHtml = '<p>text</p><script>alert("xss")</script>'
      const result = tiptapToMarkdown(maliciousHtml)
      expect(result).not.toContain('script')
      expect(result).not.toContain('alert')
    })

    it('should handle nested formatting', () => {
      const html = '<p><strong><em>bold and italic</em></strong></p>'
      const result = tiptapToMarkdown(html)
      expect(result).toContain('**_') // Turndown uses **_ for bold+italic
      expect(result).toContain('_**')
    })

    it('should convert unordered lists', () => {
      const html = '<ul><li>item 1</li><li>item 2</li></ul>'
      const result = tiptapToMarkdown(html)
      expect(result).toContain('- ') // Turndown uses hyphens for lists
      expect(result).toContain('item 1')
      expect(result).toContain('item 2')
    })

    it('should convert ordered lists', () => {
      const html = '<ol><li>first</li><li>second</li></ol>'
      const result = tiptapToMarkdown(html)
      expect(result).toContain('1.') // Turndown adds spaces
      expect(result).toContain('first')
      expect(result).toContain('2.')
      expect(result).toContain('second')
    })

    it('should convert blockquotes', () => {
      const html = '<blockquote>quoted text</blockquote>'
      const result = tiptapToMarkdown(html)
      expect(result).toContain('> quoted text')
    })

    it('should handle task lists', () => {
      const html = '<ul><li data-type="taskItem" data-checked="true">completed task</li></ul>'
      const result = tiptapToMarkdown(html)
      expect(result).toContain('- [x] completed task')
    })
  })

  describe('markdownToTiptap', () => {
    it('should convert headers correctly', () => {
      const markdown = '# H1\n## H2\n### H3'
      const result = markdownToTiptap(markdown)
      expect(result).toContain('<h1>H1</h1>')
      expect(result).toContain('<h2>H2</h2>')
      expect(result).toContain('<h3>H3</h3>')
    })

    it('should convert bold text correctly', () => {
      const markdown = '**bold text**'
      const result = markdownToTiptap(markdown)
      expect(result).toContain('<strong>bold text</strong>')
    })

    it('should convert italic text correctly', () => {
      const markdown = '*italic text*'
      const result = markdownToTiptap(markdown)
      expect(result).toContain('<em>italic text</em>')
    })

    it('should convert strikethrough correctly', () => {
      const markdown = '~~strikethrough~~'
      const result = markdownToTiptap(markdown)
      expect(result).toContain('<del>strikethrough</del>')
    })

    it('should convert inline code correctly', () => {
      const markdown = '`code snippet`'
      const result = markdownToTiptap(markdown)
      expect(result).toContain('<code>code snippet</code>')
    })

    it('should convert code blocks correctly', () => {
      const markdown = '```javascript\nconst x = 1;\n```'
      const result = markdownToTiptap(markdown)
      expect(result).toContain('<pre><code')
      expect(result).toContain('language-javascript')
      expect(result).toContain('const x = 1;')
    })

    it('should convert links correctly', () => {
      const markdown = '[link text](https://example.com)'
      const result = markdownToTiptap(markdown)
      expect(result).toContain('<a href="https://example.com">link text</a>')
    })

    it('should convert images correctly', () => {
      const markdown = '![alt text](https://example.com/image.jpg)'
      const result = markdownToTiptap(markdown)
      expect(result).toContain('<img')
      expect(result).toContain('src="https://example.com/image.jpg"')
      expect(result).toContain('alt="alt text"')
    })

    it('should convert blockquotes correctly', () => {
      const markdown = '> quoted text'
      const result = markdownToTiptap(markdown)
      expect(result).toContain('<blockquote>quoted text</blockquote>')
    })

    it('should convert unordered lists correctly', () => {
      const markdown = '- item 1\n- item 2'
      const result = markdownToTiptap(markdown)
      expect(result).toContain('<ul>')
      expect(result).toContain('<li>item 1</li>')
      expect(result).toContain('<li>item 2</li>')
    })

    it('should convert task lists correctly', () => {
      const markdown = '- [ ] unchecked\n- [x] checked'
      const result = markdownToTiptap(markdown)
      expect(result).toContain('data-type="taskItem"')
      expect(result).toContain('data-checked="false"')
      expect(result).toContain('data-checked="true"')
    })

    it('should handle empty input', () => {
      expect(markdownToTiptap('')).toBe('')
    })

    it('should handle null input safely', () => {
      expect(markdownToTiptap(null as any)).toBe('')
    })

    it('should sanitize malicious markdown', () => {
      const malicious = '<script>alert("xss")</script>'
      const result = markdownToTiptap(malicious)
      expect(result).not.toContain('script')
      expect(result).not.toContain('alert')
    })

    it('should escape HTML entities in code blocks', () => {
      const markdown = '```html\n<div>test</div>\n```'
      const result = markdownToTiptap(markdown)
      expect(result).toContain('&lt;div&gt;')
    })

    it('should reject invalid URLs in links', () => {
      const markdown = '[text](javascript:alert("xss"))'
      const result = markdownToTiptap(markdown)
      expect(result).not.toContain('<a href="javascript:')
    })

    it('should reject invalid URLs in images', () => {
      const markdown = '![text](javascript:alert("xss"))'
      const result = markdownToTiptap(markdown)
      expect(result).not.toContain('<img src="javascript:')
    })

    it('should handle complex nested formatting', () => {
      const markdown = '**bold with *italic* inside**'
      const result = markdownToTiptap(markdown)
      expect(result).toContain('<strong>')
      expect(result).toContain('<em>')
    })

    it('should handle multiple paragraphs', () => {
      const markdown = 'Paragraph 1\n\nParagraph 2'
      const result = markdownToTiptap(markdown)
      expect(result).toContain('<p>Paragraph 1</p>')
      expect(result).toContain('<p>Paragraph 2</p>')
    })
  })

  describe('sanitizeMarkdown', () => {
    it('should trim whitespace', () => {
      expect(sanitizeMarkdown('  test  ')).toBe('test')
    })

    it('should remove script tags', () => {
      const malicious = 'test <script>alert("xss")</script> text'
      const result = sanitizeMarkdown(malicious)
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert')
    })

    it('should remove event handlers', () => {
      const malicious = '<div onclick="alert(\'xss\')">text</div>'
      const result = sanitizeMarkdown(malicious)
      expect(result).not.toContain('onclick')
    })

    it('should remove javascript: protocol', () => {
      const malicious = '[link](javascript:alert("xss"))'
      const result = sanitizeMarkdown(malicious)
      expect(result).not.toContain('javascript:')
    })

    it('should handle empty input', () => {
      expect(sanitizeMarkdown('')).toBe('')
    })

    it('should handle null input', () => {
      expect(sanitizeMarkdown(null as any)).toBe('')
    })

    it('should remove encoded script tags', () => {
      const malicious = '&lt;script&gt;alert("xss")&lt;/script&gt;'
      const result = sanitizeMarkdown(malicious)
      expect(result).not.toContain('&lt;script')
    })

    it('should remove iframe tags', () => {
      const malicious = 'text &lt;iframe src="evil.com"&gt;&lt;/iframe&gt;'
      const result = sanitizeMarkdown(malicious)
      expect(result).not.toContain('&lt;iframe')
    })
  })

  describe('isMarkdownSafe', () => {
    it('should return true for safe markdown', () => {
      expect(isMarkdownSafe('# Heading\n\nParagraph with **bold**')).toBe(true)
    })

    it('should return false for markdown with script tags', () => {
      expect(isMarkdownSafe('<script>alert("xss")</script>')).toBe(false)
    })

    it('should return false for markdown with javascript protocol', () => {
      expect(isMarkdownSafe('[link](javascript:alert("xss"))')).toBe(false)
    })

    it('should return false for markdown with event handlers', () => {
      expect(isMarkdownSafe('<img onerror="alert(\'xss\')" />')).toBe(false)
    })

    it('should return false for markdown with iframe', () => {
      expect(isMarkdownSafe('<iframe src="evil.com"></iframe>')).toBe(false)
    })

    it('should return false for markdown with eval', () => {
      expect(isMarkdownSafe('test eval(malicious)')).toBe(false)
    })

    it('should return false for markdown with expression', () => {
      expect(isMarkdownSafe('test expression(malicious)')).toBe(false)
    })

    it('should return true for empty input', () => {
      expect(isMarkdownSafe('')).toBe(true)
    })

    it('should return true for null input', () => {
      expect(isMarkdownSafe(null as any)).toBe(true)
    })

    it('should be case insensitive', () => {
      expect(isMarkdownSafe('<SCRIPT>alert("xss")</SCRIPT>')).toBe(false)
      expect(isMarkdownSafe('JAVASCRIPT:alert("xss")')).toBe(false)
    })
  })

  describe('Round-trip conversion', () => {
    it('should maintain content through round-trip conversion', () => {
      const markdown = '# Heading\n\n**Bold** and *italic* text with [link](https://example.com)'
      const html = markdownToTiptap(markdown)
      const backToMarkdown = tiptapToMarkdown(html)
      
      // Check that key elements are preserved
      expect(backToMarkdown).toContain('Heading')
      expect(backToMarkdown).toContain('**Bold**')
      expect(backToMarkdown).toMatch(/[_*]italic[_*]/) // Accept either _ or * for italic
      expect(backToMarkdown).toContain('[link]')
    })

    it('should handle complex content through round-trip', () => {
      const markdown = '## Title\n\n- item 1\n- item 2\n\n```js\ncode\n```'
      const html = markdownToTiptap(markdown)
      const backToMarkdown = tiptapToMarkdown(html)
      
      expect(backToMarkdown).toContain('Title')
      expect(backToMarkdown).toContain('item 1')
      expect(backToMarkdown).toContain('code')
    })
  })
})
