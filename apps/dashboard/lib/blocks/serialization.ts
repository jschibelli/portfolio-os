/**
 * Content Block Serialization System
 * Handles serialization and deserialization of content blocks
 */

import { ContentBlock, SerializedContent, BlockValidation, BlockValidator } from './types';
import { blockRegistry } from './registry';

/**
 * Serialize content blocks to JSON format
 */
export function serializeBlocks(blocks: ContentBlock[], metadata?: SerializedContent['metadata']): SerializedContent {
  return {
    version: '1.0.0',
    blocks: blocks.map(block => ({
      ...block,
      // Ensure all required fields are present
      id: block.id || generateBlockId(),
      type: block.type,
      data: block.data || {},
      position: block.position ?? 0,
      settings: block.settings || {}
    })),
    metadata: {
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      ...metadata
    }
  };
}

/**
 * Deserialize JSON content to content blocks
 */
export function deserializeBlocks(serializedContent: SerializedContent): ContentBlock[] {
  if (!serializedContent || !serializedContent.blocks) {
    return [];
  }

  // Validate version compatibility
  if (!isVersionCompatible(serializedContent.version)) {
    console.warn(`Content version ${serializedContent.version} may not be fully compatible`);
  }

  return serializedContent.blocks.map(block => {
    // Validate block structure
    const validatedBlock = validateBlockStructure(block);
    
    // Migrate block data if needed
    const migratedBlock = migrateBlockData(validatedBlock, serializedContent.version);
    
    return migratedBlock;
  });
}

/**
 * Convert content blocks to HTML
 */
export function blocksToHTML(blocks: ContentBlock[]): string {
  return blocks.map(block => {
    const blockConfig = blockRegistry[block.type];
    if (!blockConfig) {
      return `<div class="unknown-block" data-block-type="${block.type}">Unknown block type: ${block.type}</div>`;
    }

    // This is a simplified HTML representation
    // In a real implementation, you'd want to render the actual React components to HTML
    return `<div class="content-block" data-block-type="${block.type}" data-block-id="${block.id}">
      <div class="block-content">
        ${JSON.stringify(block.data)}
      </div>
    </div>`;
  }).join('\n');
}

/**
 * Convert content blocks to Markdown
 */
export function blocksToMarkdown(blocks: ContentBlock[]): string {
  return blocks.map(block => {
    switch (block.type) {
      case 'code':
        return `\`\`\`${block.data.language || 'text'}\n${block.data.code || ''}\n\`\`\``;
      
      case 'quote':
        const author = block.data.author ? ` - ${block.data.author}` : '';
        return `> ${block.data.text}${author}`;
      
      case 'cta':
        return `## ${block.data.title}\n\n${block.data.description || ''}\n\n[${block.data.buttonText}](${block.data.buttonUrl})`;
      
      case 'button':
        return `[${block.data.text}](${block.data.url})`;
      
      case 'divider':
        return '---';
      
      case 'spacer':
        return '\n\n';
      
      case 'image-gallery':
        return block.data.images?.map((img: any) => `![${img.alt}](${img.url})`).join('\n\n') || '';
      
      case 'video':
        return `[${block.data.title || 'Video'}](${block.data.url})`;
      
      case 'embed':
        return `[${block.data.title || 'Embedded Content'}](${block.data.url})`;
      
      default:
        return `<!-- Unknown block type: ${block.type} -->`;
    }
  }).join('\n\n');
}

/**
 * Convert HTML to content blocks (basic implementation)
 */
export function htmlToBlocks(html: string): ContentBlock[] {
  // This is a basic implementation
  // In a real scenario, you'd parse the HTML and convert it to blocks
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blockElements = doc.querySelectorAll('[data-content-block]');
  
  return Array.from(blockElements).map((element, index) => {
    const blockType = element.getAttribute('data-block-type') || 'text';
    const blockId = element.getAttribute('data-block-id') || generateBlockId();
    
    return {
      id: blockId,
      type: blockType,
      data: {},
      position: index
    };
  });
}

/**
 * Convert Markdown to content blocks
 */
export function markdownToBlocks(markdown: string): ContentBlock[] {
  const lines = markdown.split('\n');
  const blocks: ContentBlock[] = [];
  let currentBlock: Partial<ContentBlock> | null = null;
  let codeBuffer: string[] = [];
  let inCodeBlock = false;
  let codeLanguage = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        blocks.push({
          id: generateBlockId(),
          type: 'code',
          data: {
            code: codeBuffer.join('\n'),
            language: codeLanguage,
            showLineNumbers: true,
            highlightLines: []
          },
          position: blocks.length
        });
        codeBuffer = [];
        inCodeBlock = false;
        codeLanguage = '';
      } else {
        // Start of code block
        codeLanguage = line.slice(3).trim() || 'text';
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Handle quotes
    if (line.startsWith('> ')) {
      if (currentBlock?.type !== 'quote') {
        if (currentBlock) blocks.push(currentBlock as ContentBlock);
        currentBlock = {
          id: generateBlockId(),
          type: 'quote',
          data: { text: '', author: '', style: 'default', alignment: 'left' },
          position: blocks.length
        };
      }
      currentBlock.data.text += line.slice(2) + '\n';
      continue;
    }

    // Handle headings
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 1;
      const text = line.replace(/^#+\s*/, '');
      blocks.push({
        id: generateBlockId(),
        type: 'heading',
        data: { level, text },
        position: blocks.length
      });
      continue;
    }

    // Handle horizontal rules
    if (line.match(/^-{3,}$/)) {
      if (currentBlock) blocks.push(currentBlock as ContentBlock);
      blocks.push({
        id: generateBlockId(),
        type: 'divider',
        data: { style: 'solid', color: '#e5e7eb', thickness: 1, width: 'full' },
        position: blocks.length
      });
      currentBlock = null;
      continue;
    }

    // Handle links (basic button conversion)
    const linkMatch = line.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      if (currentBlock) blocks.push(currentBlock as ContentBlock);
      blocks.push({
        id: generateBlockId(),
        type: 'button',
        data: {
          text: linkMatch[1],
          url: linkMatch[2],
          style: 'primary',
          size: 'md',
          alignment: 'left',
          target: '_self'
        },
        position: blocks.length
      });
      currentBlock = null;
      continue;
    }

    // Handle regular text
    if (line.trim()) {
      if (currentBlock?.type !== 'text') {
        if (currentBlock) blocks.push(currentBlock as ContentBlock);
        currentBlock = {
          id: generateBlockId(),
          type: 'text',
          data: { content: '' },
          position: blocks.length
        };
      }
      currentBlock.data.content += line + '\n';
    } else {
      // Empty line - push current block if exists
      if (currentBlock) {
        blocks.push(currentBlock as ContentBlock);
        currentBlock = null;
      }
    }
  }

  // Push final block if exists
  if (currentBlock) {
    blocks.push(currentBlock as ContentBlock);
  }

  return blocks;
}

/**
 * Validate block structure
 */
function validateBlockStructure(block: any): ContentBlock {
  const blockConfig = blockRegistry[block.type];
  
  if (!blockConfig) {
    throw new Error(`Unknown block type: ${block.type}`);
  }

  // Ensure required fields exist
  const validatedBlock: ContentBlock = {
    id: block.id || generateBlockId(),
    type: block.type,
    data: { ...blockConfig.defaultData, ...block.data },
    position: block.position ?? 0,
    settings: block.settings || {}
  };

  return validatedBlock;
}

/**
 * Migrate block data for version compatibility
 */
function migrateBlockData(block: ContentBlock, version: string): ContentBlock {
  // Add migration logic here for different versions
  // For now, just return the block as-is
  return block;
}

/**
 * Check if version is compatible
 */
function isVersionCompatible(version: string): boolean {
  const [major] = version.split('.').map(Number);
  return major >= 1; // Currently only support v1.x.x
}

/**
 * Generate unique block ID
 */
function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate content blocks
 */
export function validateBlocks(blocks: ContentBlock[]): BlockValidation[] {
  return blocks.map(block => {
    const blockConfig = blockRegistry[block.type];
    
    if (!blockConfig) {
      return {
        isValid: false,
        errors: [`Unknown block type: ${block.type}`],
        warnings: []
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required data fields
    Object.entries(blockConfig.defaultData).forEach(([key, defaultValue]) => {
      if (block.data[key] === undefined || block.data[key] === null) {
        errors.push(`Missing required field: ${key}`);
      }
    });

    // Add block-specific validation
    switch (block.type) {
      case 'code':
        if (!block.data.code || block.data.code.trim() === '') {
          warnings.push('Code block is empty');
        }
        break;
      
      case 'cta':
        if (!block.data.buttonUrl || block.data.buttonUrl === '#') {
          warnings.push('CTA button URL is not set');
        }
        break;
      
      case 'button':
        if (!block.data.url || block.data.url === '#') {
          warnings.push('Button URL is not set');
        }
        break;
      
      case 'image-gallery':
        if (!block.data.images || block.data.images.length === 0) {
          warnings.push('Image gallery is empty');
        }
        break;
      
      case 'video':
        if (!block.data.url) {
          errors.push('Video URL is required');
        }
        break;
      
      case 'embed':
        if (!block.data.url) {
          errors.push('Embed URL is required');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  });
}

/**
 * Sanitize block data
 */
export function sanitizeBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.map(block => {
    const sanitizedBlock = { ...block };
    
    // Sanitize URLs
    if (sanitizedBlock.data.url) {
      sanitizedBlock.data.url = sanitizeUrl(sanitizedBlock.data.url);
    }
    
    if (sanitizedBlock.data.buttonUrl) {
      sanitizedBlock.data.buttonUrl = sanitizeUrl(sanitizedBlock.data.buttonUrl);
    }
    
    // Sanitize text content
    if (sanitizedBlock.data.text) {
      sanitizedBlock.data.text = sanitizeText(sanitizedBlock.data.text);
    }
    
    if (sanitizedBlock.data.title) {
      sanitizedBlock.data.title = sanitizeText(sanitizedBlock.data.title);
    }
    
    if (sanitizedBlock.data.description) {
      sanitizedBlock.data.description = sanitizeText(sanitizedBlock.data.description);
    }
    
    return sanitizedBlock;
  });
}

/**
 * Sanitize URL
 */
function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      return urlObj.toString();
    }
    return '#';
  } catch {
    return '#';
  }
}

/**
 * Sanitize text content
 */
function sanitizeText(text: string): string {
  // Basic HTML sanitization
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}


