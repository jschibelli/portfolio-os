/**
 * Content Block Registry
 * Central registry for all available content blocks
 */

import React from 'react';
import { BlockRegistry, BlockCategory, BLOCK_CATEGORIES } from './types';
export { BLOCK_CATEGORIES };

// Import block components
import { CodeBlock } from '@/components/content-blocks/CodeBlock';
import { CTABlock } from '@/components/content-blocks/CTABlock';
import { ButtonBlock } from '@/components/content-blocks/ButtonBlock';
import { QuoteBlock } from '@/components/content-blocks/QuoteBlock';
import { ImageGalleryBlock } from '@/components/content-blocks/ImageGalleryBlock';
import { VideoBlock } from '@/components/content-blocks/VideoBlock';
import { DividerBlock } from '@/components/content-blocks/DividerBlock';
import { SpacerBlock } from '@/components/content-blocks/SpacerBlock';
import { EmbedBlock } from '@/components/content-blocks/EmbedBlock';

// Import block settings components
import { CodeBlockSettings } from '@/components/content-blocks/settings/CodeBlockSettings';
import { CTABlockSettings } from '@/components/content-blocks/settings/CTABlockSettings';
import { ButtonBlockSettings } from '@/components/content-blocks/settings/ButtonBlockSettings';
import { QuoteBlockSettings } from '@/components/content-blocks/settings/QuoteBlockSettings';
import { ImageGalleryBlockSettings } from '@/components/content-blocks/settings/ImageGalleryBlockSettings';
import { VideoBlockSettings } from '@/components/content-blocks/settings/VideoBlockSettings';
import { DividerBlockSettings } from '@/components/content-blocks/settings/DividerBlockSettings';
import { SpacerBlockSettings } from '@/components/content-blocks/settings/SpacerBlockSettings';
import { EmbedBlockSettings } from '@/components/content-blocks/settings/EmbedBlockSettings';

// Icons (using Lucide React icons)
import { 
  Code, 
  MousePointer, 
  Square, 
  Quote, 
  Images, 
  Video, 
  Minus, 
  Space, 
  ExternalLink 
} from 'lucide-react';

/**
 * Central registry for all content blocks
 */
export const blockRegistry: BlockRegistry = {
  code: {
    component: CodeBlock,
    icon: Code,
    name: 'Code Block',
    description: 'Display code with syntax highlighting',
    category: BLOCK_CATEGORIES.CODE,
    defaultData: {
      code: '',
      language: 'javascript',
      filename: '',
      showLineNumbers: true,
      highlightLines: []
    },
    settings: CodeBlockSettings
  },

  cta: {
    component: CTABlock,
    icon: MousePointer,
    name: 'Call to Action',
    description: 'Create compelling call-to-action sections',
    category: BLOCK_CATEGORIES.INTERACTIVE,
    defaultData: {
      title: 'Get Started Today',
      description: 'Join thousands of satisfied customers',
      buttonText: 'Sign Up Now',
      buttonUrl: '#',
      buttonStyle: 'primary',
      alignment: 'center',
      background: ''
    },
    settings: CTABlockSettings
  },

  button: {
    component: ButtonBlock,
    icon: Square,
    name: 'Button',
    description: 'Add interactive buttons',
    category: BLOCK_CATEGORIES.INTERACTIVE,
    defaultData: {
      text: 'Click Me',
      url: '#',
      style: 'primary',
      size: 'md',
      alignment: 'left',
      target: '_self'
    },
    settings: ButtonBlockSettings
  },

  quote: {
    component: QuoteBlock,
    icon: Quote,
    name: 'Quote',
    description: 'Highlight important quotes and testimonials',
    category: BLOCK_CATEGORIES.TEXT,
    defaultData: {
      text: 'This is an inspiring quote',
      author: '',
      source: '',
      style: 'default',
      alignment: 'left'
    },
    settings: QuoteBlockSettings
  },

  'image-gallery': {
    component: ImageGalleryBlock,
    icon: Images,
    name: 'Image Gallery',
    description: 'Display multiple images in a gallery',
    category: BLOCK_CATEGORIES.MEDIA,
    defaultData: {
      images: [],
      layout: 'grid',
      columns: 3,
      spacing: 'medium',
      showCaptions: true
    },
    settings: ImageGalleryBlockSettings
  },

  video: {
    component: VideoBlock,
    icon: Video,
    name: 'Video',
    description: 'Embed videos from YouTube, Vimeo, or direct uploads',
    category: BLOCK_CATEGORIES.MEDIA,
    defaultData: {
      url: '',
      title: '',
      description: '',
      thumbnail: '',
      autoplay: false,
      controls: true,
      loop: false,
      muted: false,
      platform: 'youtube'
    },
    settings: VideoBlockSettings
  },

  divider: {
    component: DividerBlock,
    icon: Minus,
    name: 'Divider',
    description: 'Add visual separators between content',
    category: BLOCK_CATEGORIES.LAYOUT,
    defaultData: {
      style: 'solid',
      color: '#e5e7eb',
      thickness: 1,
      width: 'full'
    },
    settings: DividerBlockSettings
  },

  spacer: {
    component: SpacerBlock,
    icon: Space,
    name: 'Spacer',
    description: 'Add vertical spacing between elements',
    category: BLOCK_CATEGORIES.LAYOUT,
    defaultData: {
      height: 32,
      unit: 'px',
      background: ''
    },
    settings: SpacerBlockSettings
  },

  embed: {
    component: EmbedBlock,
    icon: ExternalLink,
    name: 'Embed',
    description: 'Embed external content like tweets, posts, or widgets',
    category: BLOCK_CATEGORIES.INTERACTIVE,
    defaultData: {
      url: '',
      title: '',
      width: 560,
      height: 315,
      responsive: true
    },
    settings: EmbedBlockSettings
  }
};

/**
 * Get all blocks by category
 */
export function getBlocksByCategory(category: BlockCategory) {
  return Object.entries(blockRegistry)
    .filter(([_, block]) => block.category === category)
    .map(([key, block]) => ({ key, ...block }));
}

/**
 * Get all available categories
 */
export function getAvailableCategories(): BlockCategory[] {
  return Object.values(BLOCK_CATEGORIES);
}

/**
 * Get block by type
 */
export function getBlock(type: string) {
  return blockRegistry[type];
}

/**
 * Get all blocks as array
 */
export function getAllBlocks() {
  return Object.entries(blockRegistry).map(([key, block]) => ({ key, ...block }));
}

/**
 * Check if block type exists
 */
export function hasBlock(type: string): boolean {
  return type in blockRegistry;
}

/**
 * Get block templates/presets
 */
export function getBlockTemplates() {
  return {
    'hero-cta': {
      id: 'hero-cta',
      name: 'Hero CTA',
      description: 'Complete hero section with call-to-action',
      category: 'layout',
      icon: MousePointer,
      blocks: [
        {
          type: 'cta',
          data: {
            title: 'Welcome to Our Platform',
            description: 'Discover amazing features and get started today',
            buttonText: 'Get Started',
            buttonUrl: '#',
            buttonStyle: 'primary',
            alignment: 'center',
            background: 'gradient'
          }
        }
      ]
    },
    'code-showcase': {
      id: 'code-showcase',
      name: 'Code Showcase',
      description: 'Highlight code with explanation',
      category: 'code',
      icon: Code,
      blocks: [
        {
          type: 'quote',
          data: {
            text: 'Here\'s how to implement this feature:',
            author: 'Developer',
            style: 'highlighted',
            alignment: 'left'
          }
        },
        {
          type: 'code',
          data: {
            code: '// Your code here\nconsole.log("Hello World");',
            language: 'javascript',
            showLineNumbers: true
          }
        }
      ]
    },
    'media-gallery': {
      id: 'media-gallery',
      name: 'Media Gallery',
      description: 'Showcase multiple images or videos',
      category: 'media',
      icon: Images,
      blocks: [
        {
          type: 'image-gallery',
          data: {
            images: [],
            layout: 'grid',
            columns: 3,
            spacing: 'medium',
            showCaptions: true
          }
        }
      ]
    }
  };
}
