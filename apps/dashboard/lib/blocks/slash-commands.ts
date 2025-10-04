/**
 * Slash Commands for Content Blocks
 * Provides slash command integration for the content block system
 */

import { SlashCommand } from '@/lib/types/article';
import { blockRegistry, getBlocksByCategory } from './registry';
import { BLOCK_CATEGORIES } from './types';

// Icons for different categories
const CATEGORY_ICONS = {
  [BLOCK_CATEGORIES.TEXT]: '📝',
  [BLOCK_CATEGORIES.MEDIA]: '🎬',
  [BLOCK_CATEGORIES.LAYOUT]: '📐',
  [BLOCK_CATEGORIES.INTERACTIVE]: '🎯',
  [BLOCK_CATEGORIES.CODE]: '💻',
};

export const contentBlockSlashCommands: SlashCommand[] = [
  // Code blocks
  {
    title: 'Code Block',
    description: 'Add a code block with syntax highlighting',
    icon: '💻',
    command: (editor) => {
      editor.commands.insertContentBlock('code', {
        code: '// Your code here\nconsole.log("Hello World");',
        language: 'javascript',
        showLineNumbers: true,
        highlightLines: []
      });
    },
  },
  
  // CTA blocks
  {
    title: 'Call to Action',
    description: 'Create a compelling call-to-action section',
    icon: '🎯',
    command: (editor) => {
      editor.commands.insertContentBlock('cta', {
        title: 'Get Started Today',
        description: 'Join thousands of satisfied customers',
        buttonText: 'Sign Up Now',
        buttonUrl: '#',
        buttonStyle: 'primary',
        alignment: 'center',
        background: ''
      });
    },
  },
  
  // Button blocks
  {
    title: 'Button',
    description: 'Add an interactive button',
    icon: '🔘',
    command: (editor) => {
      editor.commands.insertContentBlock('button', {
        text: 'Click Me',
        url: '#',
        style: 'primary',
        size: 'md',
        alignment: 'left',
        target: '_self'
      });
    },
  },
  
  // Quote blocks
  {
    title: 'Quote',
    description: 'Highlight important quotes and testimonials',
    icon: '💬',
    command: (editor) => {
      editor.commands.insertContentBlock('quote', {
        text: 'This is an inspiring quote',
        author: '',
        source: '',
        style: 'default',
        alignment: 'left'
      });
    },
  },
  
  // Image gallery blocks
  {
    title: 'Image Gallery',
    description: 'Display multiple images in a gallery',
    icon: '🖼️',
    command: (editor) => {
      editor.commands.insertContentBlock('image-gallery', {
        images: [],
        layout: 'grid',
        columns: 3,
        spacing: 'medium',
        showCaptions: true
      });
    },
  },
  
  // Video blocks
  {
    title: 'Video',
    description: 'Embed videos from YouTube, Vimeo, or direct uploads',
    icon: '📺',
    command: (editor) => {
      editor.commands.insertContentBlock('video', {
        url: '',
        title: '',
        description: '',
        thumbnail: '',
        autoplay: false,
        controls: true,
        loop: false,
        muted: false,
        platform: 'youtube'
      });
    },
  },
  
  // Divider blocks
  {
    title: 'Divider',
    description: 'Add visual separators between content',
    icon: '➖',
    command: (editor) => {
      editor.commands.insertContentBlock('divider', {
        style: 'solid',
        color: '#e5e7eb',
        thickness: 1,
        width: 'full'
      });
    },
  },
  
  // Spacer blocks
  {
    title: 'Spacer',
    description: 'Add vertical spacing between elements',
    icon: '⬜',
    command: (editor) => {
      editor.commands.insertContentBlock('spacer', {
        height: 32,
        unit: 'px',
        background: ''
      });
    },
  },
  
  // Embed blocks
  {
    title: 'Embed',
    description: 'Embed external content like tweets, posts, or widgets',
    icon: '🔗',
    command: (editor) => {
      editor.commands.insertContentBlock('embed', {
        url: '',
        title: '',
        width: 560,
        height: 315,
        responsive: true
      });
    },
  },
];

/**
 * Get slash commands organized by category
 */
export function getSlashCommandsByCategory() {
  const commandsByCategory: Record<string, SlashCommand[]> = {};
  
  // Initialize categories
  Object.values(BLOCK_CATEGORIES).forEach(category => {
    commandsByCategory[category] = [];
  });
  
  // Group commands by category
  contentBlockSlashCommands.forEach(command => {
    // Find the block type that matches this command
    const blockEntry = Object.entries(blockRegistry).find(([_, block]) => 
      block.name.toLowerCase() === command.title.toLowerCase()
    );
    
    if (blockEntry) {
      const [_, block] = blockEntry;
      commandsByCategory[block.category].push(command);
    }
  });
  
  return commandsByCategory;
}

/**
 * Get all slash commands with category headers
 */
export function getAllSlashCommandsWithCategories(): SlashCommand[] {
  const commandsByCategory = getSlashCommandsByCategory();
  const allCommands: SlashCommand[] = [];
  
  Object.entries(commandsByCategory).forEach(([category, commands]) => {
    if (commands.length > 0) {
      // Add category header
      allCommands.push({
        title: `${CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        description: `${category} blocks`,
        icon: CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || '📦',
        command: () => {}, // No-op command for headers
      });
      
      // Add commands for this category
      allCommands.push(...commands);
    }
  });
  
  return allCommands;
}

/**
 * Search slash commands by query
 */
export function searchSlashCommands(query: string): SlashCommand[] {
  const normalizedQuery = query.toLowerCase();
  
  return contentBlockSlashCommands.filter(command => 
    command.title.toLowerCase().includes(normalizedQuery) ||
    command.description.toLowerCase().includes(normalizedQuery)
  );
}


