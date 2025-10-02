/**
 * Content Block System Types
 * Defines the structure and interfaces for modular content blocks
 */

export interface BaseBlock {
  id: string;
  type: string;
  data: Record<string, any>;
  settings?: BlockSettings;
  position?: number;
}

export interface BlockSettings {
  width?: 'full' | 'half' | 'third' | 'quarter';
  alignment?: 'left' | 'center' | 'right';
  spacing?: 'none' | 'small' | 'medium' | 'large';
  background?: string;
  border?: boolean;
  shadow?: boolean;
}

export interface BlockTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  block: BaseBlock;
  preview?: string;
}

// Specific block types
export interface CodeBlock extends BaseBlock {
  type: 'code';
  data: {
    code: string;
    language: string;
    filename?: string;
    showLineNumbers?: boolean;
    highlightLines?: number[];
  };
}

export interface CTABlock extends BaseBlock {
  type: 'cta';
  data: {
    title: string;
    description?: string;
    buttonText: string;
    buttonUrl: string;
    buttonStyle: 'primary' | 'secondary' | 'outline';
    alignment: 'left' | 'center' | 'right';
    background?: string;
  };
}

export interface ButtonBlock extends BaseBlock {
  type: 'button';
  data: {
    text: string;
    url: string;
    style: 'primary' | 'secondary' | 'outline' | 'ghost';
    size: 'sm' | 'md' | 'lg';
    alignment: 'left' | 'center' | 'right';
    target?: '_blank' | '_self';
  };
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  data: {
    text: string;
    author?: string;
    source?: string;
    style: 'default' | 'highlighted' | 'minimal';
    alignment: 'left' | 'center' | 'right';
  };
}

export interface ImageGalleryBlock extends BaseBlock {
  type: 'image-gallery';
  data: {
    images: Array<{
      url: string;
      alt: string;
      caption?: string;
    }>;
    layout: 'grid' | 'carousel' | 'masonry';
    columns: number;
    spacing: 'none' | 'small' | 'medium' | 'large';
    showCaptions?: boolean;
  };
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  data: {
    url: string;
    title?: string;
    description?: string;
    thumbnail?: string;
    autoplay?: boolean;
    controls?: boolean;
    loop?: boolean;
    muted?: boolean;
    platform: 'youtube' | 'vimeo' | 'direct';
  };
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  data: {
    style: 'solid' | 'dashed' | 'dotted' | 'gradient';
    color?: string;
    thickness: number;
    width: 'full' | 'half' | 'quarter';
  };
}

export interface SpacerBlock extends BaseBlock {
  type: 'spacer';
  data: {
    height: number;
    unit: 'px' | 'rem' | 'em';
    background?: string;
  };
}

export interface EmbedBlock extends BaseBlock {
  type: 'embed';
  data: {
    url: string;
    title?: string;
    width?: number;
    height?: number;
    responsive?: boolean;
  };
}

// Union type for all blocks
export type ContentBlock = 
  | CodeBlock 
  | CTABlock 
  | ButtonBlock 
  | QuoteBlock 
  | ImageGalleryBlock 
  | VideoBlock 
  | DividerBlock 
  | SpacerBlock 
  | EmbedBlock;

// Block categories
export const BLOCK_CATEGORIES = {
  TEXT: 'text',
  MEDIA: 'media',
  LAYOUT: 'layout',
  INTERACTIVE: 'interactive',
  CODE: 'code',
} as const;

export type BlockCategory = typeof BLOCK_CATEGORIES[keyof typeof BLOCK_CATEGORIES];

// Block registry interface
export interface BlockRegistry {
  [key: string]: {
    component: React.ComponentType<any>;
    icon: string;
    name: string;
    description: string;
    category: BlockCategory;
    defaultData: Record<string, any>;
    settings?: React.ComponentType<any>;
  };
}

// Editor state
export interface EditorState {
  blocks: ContentBlock[];
  selectedBlock?: string;
  clipboard?: ContentBlock[];
  history: {
    past: ContentBlock[][];
    future: ContentBlock[][];
  };
}

// Block operations
export interface BlockOperations {
  addBlock: (block: ContentBlock, position?: number) => void;
  updateBlock: (id: string, data: Partial<ContentBlock['data']>) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (id: string, newPosition: number) => void;
  copyBlock: (id: string) => void;
  pasteBlock: (position?: number) => void;
  selectBlock: (id: string) => void;
  deselectBlock: () => void;
}

// Serialization
export interface SerializedContent {
  version: string;
  blocks: ContentBlock[];
  metadata?: {
    title?: string;
    description?: string;
    tags?: string[];
    created?: string;
    updated?: string;
  };
}

// Validation
export interface BlockValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BlockValidator {
  validate: (block: ContentBlock) => BlockValidation;
  sanitize: (block: ContentBlock) => ContentBlock;
}
