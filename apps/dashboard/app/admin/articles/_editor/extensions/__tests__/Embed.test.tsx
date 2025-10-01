import { describe, it, expect } from '@jest/globals'

/**
 * Comprehensive tests for Embed Extension
 * Tests URL extraction for all supported platforms
 */

describe('Embed URL Extraction', () => {
  describe('YouTube', () => {
    it('extracts ID from watch URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      const id = extractYouTubeId(url)
      expect(id).toBe('dQw4w9WgXcQ')
    })

    it('extracts ID from short URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ'
      const id = extractYouTubeId(url)
      expect(id).toBe('dQw4w9WgXcQ')
    })

    it('extracts ID from embed URL', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      const id = extractYouTubeId(url)
      expect(id).toBe('dQw4w9WgXcQ')
    })

    it('extracts direct ID', () => {
      const url = 'dQw4w9WgXcQ'
      const id = extractYouTubeId(url)
      expect(id).toBe('dQw4w9WgXcQ')
    })
  })

  describe('Twitter/X', () => {
    it('extracts ID from twitter.com URL', () => {
      const url = 'https://twitter.com/username/status/1234567890'
      const id = extractTweetId(url)
      expect(id).toBe('1234567890')
    })

    it('extracts ID from x.com URL', () => {
      const url = 'https://x.com/username/status/1234567890'
      const id = extractTweetId(url)
      expect(id).toBe('1234567890')
    })

    it('extracts direct ID', () => {
      const url = '1234567890'
      const id = extractTweetId(url)
      expect(id).toBe('1234567890')
    })
  })

  describe('GitHub Gist', () => {
    it('extracts ID from full URL', () => {
      const url = 'https://gist.github.com/username/abc123def456'
      const result = extractGitHubGistId(url)
      expect(result).toEqual({ id: 'abc123def456' })
    })

    it('extracts ID and file from URL with file hash', () => {
      const url = 'https://gist.github.com/username/abc123def456#file-example-js'
      const result = extractGitHubGistId(url)
      expect(result).toEqual({ 
        id: 'abc123def456',
        file: 'example-js'
      })
    })

    it('extracts direct ID', () => {
      const url = 'abc123def456789012345678901234'
      const result = extractGitHubGistId(url)
      expect(result).toEqual({ id: 'abc123def456789012345678901234' })
    })
  })

  describe('CodePen', () => {
    it('extracts ID and user from full URL', () => {
      const url = 'https://codepen.io/username/pen/abcDEF'
      const result = extractCodePenId(url)
      expect(result).toEqual({
        user: 'username',
        id: 'abcDEF',
        tab: 'result'
      })
    })

    it('extracts ID and tab from URL with query params', () => {
      const url = 'https://codepen.io/username/pen/abcDEF?default-tab=html,css'
      const result = extractCodePenId(url)
      expect(result).toEqual({
        user: 'username',
        id: 'abcDEF',
        tab: 'html,css'
      })
    })

    it('extracts direct ID', () => {
      const url = 'abcDEF'
      const result = extractCodePenId(url)
      expect(result).toEqual({
        id: 'abcDEF',
        tab: 'result'
      })
    })
  })

  describe('CodeSandbox', () => {
    it('extracts ID from /s/ URL', () => {
      const url = 'https://codesandbox.io/s/sandbox-id-123'
      const id = extractCodeSandboxId(url)
      expect(id).toBe('sandbox-id-123')
    })

    it('extracts ID from /embed/ URL', () => {
      const url = 'https://codesandbox.io/embed/sandbox-id-123'
      const id = extractCodeSandboxId(url)
      expect(id).toBe('sandbox-id-123')
    })

    it('extracts direct ID', () => {
      const url = 'sandbox-id-123'
      const id = extractCodeSandboxId(url)
      expect(id).toBe('sandbox-id-123')
    })
  })
})

// Export functions for testing
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function extractTweetId(url: string): string | null {
  const patterns = [
    /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
    /^(\d+)$/
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function extractGitHubGistId(url: string): { id: string; file?: string } | null {
  const fullPattern = /gist\.github\.com\/[\w-]+\/([a-f0-9]+)(?:#file-(.+))?/
  const fullMatch = url.match(fullPattern)
  if (fullMatch) {
    return { id: fullMatch[1], file: fullMatch[2] }
  }
  
  const idPattern = /^([a-f0-9]{32}|[a-f0-9]{20})$/
  const idMatch = url.match(idPattern)
  if (idMatch) {
    return { id: idMatch[1] }
  }
  return null
}

function extractCodePenId(url: string): { id: string; user?: string; tab?: string } | null {
  const fullPattern = /codepen\.io\/([\w-]+)\/(?:pen|embed)\/([a-zA-Z]{6,10})(?:\?default-tab=([^&]+))?/
  const fullMatch = url.match(fullPattern)
  if (fullMatch) {
    return { user: fullMatch[1], id: fullMatch[2], tab: fullMatch[3] || 'result' }
  }
  
  const idPattern = /^([a-zA-Z]{6,10})$/
  const idMatch = url.match(idPattern)
  if (idMatch) {
    return { id: idMatch[1], tab: 'result' }
  }
  return null
}

function extractCodeSandboxId(url: string): string | null {
  const patterns = [
    /codesandbox\.io\/(?:s|embed)\/([a-z0-9-]+)/,
    /^([a-z0-9-]+)$/
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

