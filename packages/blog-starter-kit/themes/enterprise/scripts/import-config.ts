export const IMPORT_CONFIG = {
  // GitHub repository settings
  GITHUB: {
    REPO_OWNER: 'jschibelli',
    REPO_NAME: 'hashnode-schibelli',
    BRANCH: 'main',
    // Files to exclude from import
    EXCLUDE_PATTERNS: [
      'README.md',
      'LICENSE',
      '.github/**',
      'docs/**'
    ]
  },

  // Article processing settings
  ARTICLES: {
    // Default status for imported articles
    DEFAULT_STATUS: 'PUBLISHED' as const,
    
    // Maximum excerpt length
    MAX_EXCERPT_LENGTH: 160,
    
    // Reading time calculation (words per minute)
    WORDS_PER_MINUTE: 200,
    
    // Maximum number of tags per article
    MAX_TAGS: 10,
    
    // Default author (will be overridden by actual user in database)
    DEFAULT_AUTHOR: 'John Schibelli'
  },

  // Content processing
  CONTENT: {
    // Remove these patterns from content
    REMOVE_PATTERNS: [
      /^---\n[\s\S]*?\n---\n/g, // Frontmatter
      /^#\s*Table of Contents.*$/gm, // TOC headers
      /^\[.*\]\(.*\)$/gm, // Empty links
    ],
    
    // Replace these patterns
    REPLACE_PATTERNS: [
      {
        from: /\[([^\]]+)\]\(([^)]+)\)/g,
        to: '[$1]($2)' // Ensure proper markdown link format
      }
    ]
  },

  // Tag extraction patterns
  TAGS: {
    PATTERNS: [
      /#(\w+)/g, // Hashtags
      /tags?:\s*([^\n]+)/gi, // "tags:" or "tag:" followed by comma-separated values
      /categories?:\s*([^\n]+)/gi, // "categories:" or "category:"
      /keywords?:\s*([^\n]+)/gi, // "keywords:" or "keyword:"
    ],
    
    // Common tags to always include if found
    COMMON_TAGS: [
      'development',
      'programming',
      'technology',
      'web-development',
      'software-engineering',
      'case-study',
      'tutorial',
      'best-practices'
    ]
  },

  // Error handling
  ERROR_HANDLING: {
    // Continue processing other articles if one fails
    CONTINUE_ON_ERROR: true,
    
    // Log level: 'debug' | 'info' | 'warn' | 'error'
    LOG_LEVEL: 'info',
    
    // Maximum retries for failed operations
    MAX_RETRIES: 3,
    
    // Delay between retries (ms)
    RETRY_DELAY: 1000
  }
};
