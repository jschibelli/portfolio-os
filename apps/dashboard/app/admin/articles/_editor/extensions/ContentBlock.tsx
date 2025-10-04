/**
 * Content Block Extension for TipTap
 * Integrates the modular content block system with TipTap editor
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ContentBlockComponent } from './ContentBlockComponent';

export interface ContentBlockOptions {
  HTMLAttributes: Record<string, any>;
}

export interface ContentBlockAttributes {
  blockType: string;
  blockData: Record<string, any>;
  blockId: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    contentBlock: {
      /**
       * Insert a content block
       */
      insertContentBlock: (blockType: string, blockData?: Record<string, any>) => ReturnType;
      /**
       * Update a content block
       */
      updateContentBlock: (blockId: string, blockData: Record<string, any>) => ReturnType;
      /**
       * Delete a content block
       */
      deleteContentBlock: (blockId: string) => ReturnType;
    };
  }
}

export const ContentBlock = Node.create<ContentBlockOptions>({
  name: 'contentBlock',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      blockType: {
        default: 'code',
        parseHTML: element => element.getAttribute('data-block-type'),
        renderHTML: attributes => ({
          'data-block-type': attributes.blockType,
        }),
      },
      blockData: {
        default: {},
        parseHTML: element => {
          const data = element.getAttribute('data-block-data');
          return data ? JSON.parse(data) : {};
        },
        renderHTML: attributes => ({
          'data-block-data': JSON.stringify(attributes.blockData),
        }),
      },
      blockId: {
        default: () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        parseHTML: element => element.getAttribute('data-block-id'),
        renderHTML: attributes => ({
          'data-block-id': attributes.blockId,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-content-block]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        {
          'data-content-block': '',
          class: 'content-block-wrapper',
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ContentBlockComponent);
  },

  addCommands() {
    return {
      insertContentBlock:
        (blockType, blockData = {}) =>
        ({ commands }) => {
          const blockId = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          return commands.insertContent({
            type: this.name,
            attrs: {
              blockType,
              blockData,
              blockId,
            },
          });
        },
      updateContentBlock:
        (blockId, blockData) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            blockData,
          });
        },
      deleteContentBlock:
        (blockId) =>
        ({ commands }) => {
          return commands.deleteSelection();
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-B': () => this.editor.commands.insertContentBlock('code'),
      'Mod-Shift-C': () => this.editor.commands.insertContentBlock('cta'),
      'Mod-Shift-Q': () => this.editor.commands.insertContentBlock('quote'),
      'Mod-Shift-I': () => this.editor.commands.insertContentBlock('image-gallery'),
      'Mod-Shift-V': () => this.editor.commands.insertContentBlock('video'),
      'Mod-Shift-D': () => this.editor.commands.insertContentBlock('divider'),
      'Mod-Shift-S': () => this.editor.commands.insertContentBlock('spacer'),
      'Mod-Shift-E': () => this.editor.commands.insertContentBlock('embed'),
    };
  },
});


