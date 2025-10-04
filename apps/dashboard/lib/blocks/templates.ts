/**
 * Content Block Templates and Presets
 * Pre-configured block combinations for common use cases
 */

import { ContentBlock } from './types';

export interface BlockTemplate {
  id: string;
  name: string;
  description: string;
  category: 'layout' | 'content' | 'marketing' | 'technical' | 'social';
  icon: string;
  tags: string[];
  blocks: ContentBlock[];
  preview?: string;
}

/**
 * Hero Section Templates
 */
export const heroTemplates: BlockTemplate[] = [
  {
    id: 'hero-basic',
    name: 'Basic Hero',
    description: 'Simple hero section with title and CTA',
    category: 'layout',
    icon: '🚀',
    tags: ['hero', 'landing', 'cta'],
    blocks: [
      {
        id: 'hero-title',
        type: 'text',
        data: {
          content: '# Welcome to Our Platform\n\nBuild amazing things with our powerful tools and features.',
          level: 1,
          alignment: 'center'
        },
        position: 0
      },
      {
        id: 'hero-cta',
        type: 'cta',
        data: {
          title: 'Get Started Today',
          description: 'Join thousands of satisfied customers',
          buttonText: 'Sign Up Now',
          buttonUrl: '#',
          buttonStyle: 'primary',
          alignment: 'center',
          background: ''
        },
        position: 1
      }
    ]
  },
  {
    id: 'hero-with-image',
    name: 'Hero with Image',
    description: 'Hero section with image gallery',
    category: 'layout',
    icon: '🖼️',
    tags: ['hero', 'image', 'visual'],
    blocks: [
      {
        id: 'hero-title',
        type: 'text',
        data: {
          content: '# Showcase Your Product\n\nBeautiful imagery that tells your story',
          level: 1,
          alignment: 'center'
        },
        position: 0
      },
      {
        id: 'hero-gallery',
        type: 'image-gallery',
        data: {
          images: [
            { url: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Hero+Image+1', alt: 'Hero Image 1' },
            { url: 'https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Hero+Image+2', alt: 'Hero Image 2' }
          ],
          layout: 'grid',
          columns: 2,
          spacing: 'medium',
          showCaptions: false
        },
        position: 1
      },
      {
        id: 'hero-cta',
        type: 'cta',
        data: {
          title: 'Explore Features',
          description: 'Discover what makes us different',
          buttonText: 'Learn More',
          buttonUrl: '#',
          buttonStyle: 'primary',
          alignment: 'center',
          background: ''
        },
        position: 2
      }
    ]
  }
];

/**
 * Content Section Templates
 */
export const contentTemplates: BlockTemplate[] = [
  {
    id: 'article-intro',
    name: 'Article Introduction',
    description: 'Professional article introduction with quote',
    category: 'content',
    icon: '📝',
    tags: ['article', 'blog', 'introduction'],
    blocks: [
      {
        id: 'article-title',
        type: 'text',
        data: {
          content: '# The Future of Web Development\n\nExploring the latest trends and technologies',
          level: 1,
          alignment: 'left'
        },
        position: 0
      },
      {
        id: 'article-quote',
        type: 'quote',
        data: {
          text: 'The best way to predict the future is to create it.',
          author: 'Peter Drucker',
          source: 'Management Consultant',
          style: 'highlighted',
          alignment: 'center'
        },
        position: 1
      },
      {
        id: 'article-spacer',
        type: 'spacer',
        data: {
          height: 32,
          unit: 'px',
          background: ''
        },
        position: 2
      }
    ]
  },
  {
    id: 'code-showcase',
    name: 'Code Showcase',
    description: 'Code example with explanation and CTA',
    category: 'technical',
    icon: '💻',
    tags: ['code', 'tutorial', 'technical'],
    blocks: [
      {
        id: 'code-intro',
        type: 'text',
        data: {
          content: '## Here\'s how to implement this feature:',
          level: 2,
          alignment: 'left'
        },
        position: 0
      },
      {
        id: 'code-example',
        type: 'code',
        data: {
          code: '// Example implementation\nfunction createBlock(type, data) {\n  return {\n    id: generateId(),\n    type,\n    data,\n    position: 0\n  };\n}',
          language: 'javascript',
          filename: 'block-factory.js',
          showLineNumbers: true,
          highlightLines: [2, 3, 4]
        },
        position: 1
      },
      {
        id: 'code-cta',
        type: 'cta',
        data: {
          title: 'Try It Yourself',
          description: 'Copy this code and start building',
          buttonText: 'Copy Code',
          buttonUrl: '#',
          buttonStyle: 'outline',
          alignment: 'center',
          background: ''
        },
        position: 2
      }
    ]
  }
];

/**
 * Marketing Templates
 */
export const marketingTemplates: BlockTemplate[] = [
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    description: 'Product feature showcase with video and CTA',
    category: 'marketing',
    icon: '🎯',
    tags: ['product', 'marketing', 'features'],
    blocks: [
      {
        id: 'product-title',
        type: 'text',
        data: {
          content: '# Amazing Features\n\nDiscover what makes our product special',
          level: 1,
          alignment: 'center'
        },
        position: 0
      },
      {
        id: 'product-video',
        type: 'video',
        data: {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          title: 'Product Demo',
          description: 'Watch our product in action',
          platform: 'youtube',
          autoplay: false,
          controls: true
        },
        position: 1
      },
      {
        id: 'product-cta',
        type: 'cta',
        data: {
          title: 'Ready to Get Started?',
          description: 'Join thousands of happy customers',
          buttonText: 'Start Free Trial',
          buttonUrl: '#',
          buttonStyle: 'primary',
          alignment: 'center',
          background: 'gradient'
        },
        position: 2
      }
    ]
  },
  {
    id: 'testimonial-section',
    name: 'Testimonial Section',
    description: 'Customer testimonials with social proof',
    category: 'marketing',
    icon: '⭐',
    tags: ['testimonial', 'social-proof', 'customer'],
    blocks: [
      {
        id: 'testimonial-title',
        type: 'text',
        data: {
          content: '## What Our Customers Say',
          level: 2,
          alignment: 'center'
        },
        position: 0
      },
      {
        id: 'testimonial-1',
        type: 'quote',
        data: {
          text: 'This product has completely transformed how we work. Highly recommended!',
          author: 'Sarah Johnson',
          source: 'CEO, TechCorp',
          style: 'highlighted',
          alignment: 'center'
        },
        position: 1
      },
      {
        id: 'testimonial-2',
        type: 'quote',
        data: {
          text: 'The best investment we\'ve made this year. ROI was immediate.',
          author: 'Mike Chen',
          source: 'CTO, StartupXYZ',
          style: 'default',
          alignment: 'center'
        },
        position: 2
      },
      {
        id: 'testimonial-cta',
        type: 'button',
        data: {
          text: 'Join Them Today',
          url: '#',
          style: 'primary',
          size: 'lg',
          alignment: 'center',
          target: '_self'
        },
        position: 3
      }
    ]
  }
];

/**
 * Social Media Templates
 */
export const socialTemplates: BlockTemplate[] = [
  {
    id: 'social-embed',
    name: 'Social Media Embed',
    description: 'Embed social media content and engagement',
    category: 'social',
    icon: '📱',
    tags: ['social', 'embed', 'engagement'],
    blocks: [
      {
        id: 'social-title',
        type: 'text',
        data: {
          content: '## Follow Us on Social Media',
          level: 2,
          alignment: 'center'
        },
        position: 0
      },
      {
        id: 'social-embed',
        type: 'embed',
        data: {
          url: 'https://twitter.com/example/status/1234567890',
          title: 'Latest Tweet',
          width: 400,
          height: 300,
          responsive: true
        },
        position: 1
      },
      {
        id: 'social-buttons',
        type: 'button',
        data: {
          text: 'Follow on Twitter',
          url: 'https://twitter.com/example',
          style: 'outline',
          size: 'md',
          alignment: 'center',
          target: '_blank'
        },
        position: 2
      }
    ]
  }
];

/**
 * All templates combined
 */
export const allTemplates: BlockTemplate[] = [
  ...heroTemplates,
  ...contentTemplates,
  ...marketingTemplates,
  ...socialTemplates
];

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: BlockTemplate['category']): BlockTemplate[] {
  return allTemplates.filter(template => template.category === category);
}

/**
 * Get templates by tag
 */
export function getTemplatesByTag(tag: string): BlockTemplate[] {
  return allTemplates.filter(template => 
    template.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

/**
 * Search templates
 */
export function searchTemplates(query: string): BlockTemplate[] {
  const normalizedQuery = query.toLowerCase();
  
  return allTemplates.filter(template => 
    template.name.toLowerCase().includes(normalizedQuery) ||
    template.description.toLowerCase().includes(normalizedQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
  );
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): BlockTemplate | undefined {
  return allTemplates.find(template => template.id === id);
}

/**
 * Create a template from blocks
 */
export function createTemplateFromBlocks(
  id: string,
  name: string,
  description: string,
  category: BlockTemplate['category'],
  blocks: ContentBlock[],
  tags: string[] = []
): BlockTemplate {
  return {
    id,
    name,
    description,
    category,
    icon: '📦',
    tags,
    blocks: blocks.map((block, index) => ({
      ...block,
      position: index
    }))
  };
}

/**
 * Popular templates (curated list)
 */
export const popularTemplates: BlockTemplate[] = [
  getTemplateById('hero-basic')!,
  getTemplateById('article-intro')!,
  getTemplateById('product-showcase')!,
  getTemplateById('code-showcase')!,
  getTemplateById('testimonial-section')!
].filter(Boolean);


