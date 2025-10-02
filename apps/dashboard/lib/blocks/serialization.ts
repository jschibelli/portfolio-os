/**
 * Block Serialization and Deserialization
 * Convert blocks to/from JSON and MDX formats
 */

import { ContentBlock, SerializedContent } from './types';

/**
 * Serialize blocks to JSON format for database storage
 */
export function serializeBlocks(blocks: ContentBlock[], metadata?: SerializedContent['metadata']): SerializedContent {
  return {
    version: '1.0',
    blocks,
    metadata
  };
}

/**
 * Deserialize blocks from JSON format
 */
export function deserializeBlocks(content: SerializedContent): ContentBlock[] {
  // Validate version
  if (!content.version || content.version !== '1.0') {
    console.warn('Content version mismatch, attempting to deserialize anyway');
  }

  return content.blocks || [];
}

/**
 * Convert blocks to MDX format
 */
export function blocksToMDX(blocks: ContentBlock[]): string {
  return blocks.map((block) => blockToMDX(block)).join('\n\n');
}

/**
 * Convert a single block to MDX
 */
function blockToMDX(block: ContentBlock): string {
  switch (block.type) {
    case 'code':
      return `\`\`\`${block.data.language}${block.data.filename ? `:${block.data.filename}` : ''}
${block.data.code}
\`\`\``;

    case 'cta':
      return `<CTA
  title="${escapeQuotes(block.data.title)}"
  description="${escapeQuotes(block.data.description || '')}"
  buttonText="${escapeQuotes(block.data.buttonText)}"
  buttonUrl="${escapeQuotes(block.data.buttonUrl)}"
  buttonStyle="${block.data.buttonStyle}"
  alignment="${block.data.alignment}"
  ${block.data.background ? `background="${block.data.background}"` : ''}
/>`;

    case 'button':
      return `<Button
  text="${escapeQuotes(block.data.text)}"
  url="${escapeQuotes(block.data.url)}"
  style="${block.data.style}"
  size="${block.data.size}"
  alignment="${block.data.alignment}"
  ${block.data.target ? `target="${block.data.target}"` : ''}
/>`;

    case 'quote':
      return `> ${block.data.text}
${block.data.author ? `> — ${block.data.author}` : ''}
${block.data.source ? `> ${block.data.source}` : ''}`;

    case 'image-gallery':
      return `<ImageGallery
  layout="${block.data.layout}"
  columns={${block.data.columns}}
  spacing="${block.data.spacing}"
  showCaptions={${block.data.showCaptions}}
  images={${JSON.stringify(block.data.images)}}
/>`;

    case 'video':
      return `<Video
  url="${escapeQuotes(block.data.url)}"
  ${block.data.title ? `title="${escapeQuotes(block.data.title)}"` : ''}
  ${block.data.description ? `description="${escapeQuotes(block.data.description)}"` : ''}
  platform="${block.data.platform}"
  autoplay={${block.data.autoplay}}
  controls={${block.data.controls}}
  loop={${block.data.loop}}
  muted={${block.data.muted}}
/>`;

    case 'divider':
      return `<Divider
  style="${block.data.style}"
  color="${block.data.color}"
  thickness={${block.data.thickness}}
  width="${block.data.width}"
/>`;

    case 'spacer':
      return `<Spacer
  height={${block.data.height}}
  unit="${block.data.unit}"
  ${block.data.background ? `background="${block.data.background}"` : ''}
/>`;

    case 'embed':
      return `<Embed
  url="${escapeQuotes(block.data.url)}"
  ${block.data.title ? `title="${escapeQuotes(block.data.title)}"` : ''}
  width={${block.data.width}}
  height={${block.data.height}}
  responsive={${block.data.responsive}}
/>`;

    default:
      return '';
  }
}

/**
 * Parse MDX back to blocks (basic implementation)
 */
export function mdxToBlocks(mdx: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  
  // Split by double newlines to get blocks
  const sections = mdx.split('\n\n').filter(s => s.trim());
  
  for (const section of sections) {
    const trimmed = section.trim();
    
    // Code block
    if (trimmed.startsWith('```')) {
      const lines = trimmed.split('\n');
      const firstLine = lines[0].substring(3); // Remove ```
      const [language, filename] = firstLine.split(':');
      const code = lines.slice(1, -1).join('\n'); // Remove first and last lines
      
      blocks.push({
        id: generateId(),
        type: 'code',
        data: {
          code,
          language: language || 'javascript',
          filename: filename || '',
          showLineNumbers: true,
          highlightLines: []
        }
      });
      continue;
    }
    
    // Quote
    if (trimmed.startsWith('>')) {
      const lines = trimmed.split('\n').map(l => l.replace(/^>\s*/, ''));
      const text = lines[0] || '';
      const author = lines.find(l => l.startsWith('—'))?.substring(1).trim() || '';
      
      blocks.push({
        id: generateId(),
        type: 'quote',
        data: {
          text,
          author,
          source: '',
          style: 'default',
          alignment: 'left'
        }
      });
      continue;
    }
    
    // Component blocks (basic parsing)
    if (trimmed.startsWith('<CTA') || trimmed.startsWith('<Button') || 
        trimmed.startsWith('<Video') || trimmed.startsWith('<ImageGallery') ||
        trimmed.startsWith('<Divider') || trimmed.startsWith('<Spacer') ||
        trimmed.startsWith('<Embed')) {
      // This would require a full JSX parser
      // For now, we'll skip these and let them be handled by the MDX renderer
      continue;
    }
  }
  
  return blocks;
}

/**
 * Helper to escape quotes in strings
 */
function escapeQuotes(str: string): string {
  return str.replace(/"/g, '\\"');
}

/**
 * Generate a unique block ID
 */
function generateId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate block data
 */
export function validateBlock(block: ContentBlock): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!block.id) {
    errors.push('Block ID is required');
  }
  if (!block.type) {
    errors.push('Block type is required');
  }
  if (!block.data) {
    errors.push('Block data is required');
  }

  // Type-specific validation
  switch (block.type) {
    case 'code':
      if (!block.data.code) {
        errors.push('Code content is required');
      }
      if (!block.data.language) {
        errors.push('Code language is required');
      }
      break;

    case 'cta':
    case 'button':
      if (!block.data.text && !block.data.buttonText) {
        errors.push('Button text is required');
      }
      if (!block.data.url && !block.data.buttonUrl) {
        errors.push('Button URL is required');
      }
      break;

    case 'quote':
      if (!block.data.text) {
        errors.push('Quote text is required');
      }
      break;

    case 'video':
    case 'embed':
      if (!block.data.url) {
        errors.push('URL is required');
      }
      break;

    case 'image-gallery':
      if (!block.data.images || block.data.images.length === 0) {
        errors.push('At least one image is required');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize block data to prevent XSS
 */
export function sanitizeBlock(block: ContentBlock): ContentBlock {
  const sanitized = { ...block };

  // Remove any potentially dangerous HTML/scripts from text fields
  const sanitizeText = (text: string): string => {
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
  };

  // Sanitize data fields
  if (typeof sanitized.data === 'object') {
    for (const [key, value] of Object.entries(sanitized.data)) {
      if (typeof value === 'string') {
        sanitized.data[key] = sanitizeText(value);
      }
    }
  }

  return sanitized;
}

/**
 * Export blocks as JSON string
 */
export function exportBlocks(blocks: ContentBlock[], filename?: string): void {
  const serialized = serializeBlocks(blocks);
  const json = JSON.stringify(serialized, null, 2);
  
  if (typeof window !== 'undefined') {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `blocks-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

/**
 * Import blocks from JSON string
 */
export function importBlocks(json: string): ContentBlock[] {
  try {
    const parsed = JSON.parse(json);
    return deserializeBlocks(parsed);
  } catch (error) {
    console.error('Failed to import blocks:', error);
    return [];
  }
}
