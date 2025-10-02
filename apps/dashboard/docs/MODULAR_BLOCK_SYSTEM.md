# Modular Content Block System

A comprehensive, Hashnode-style modular content block system for the Dashboard editor with drag-and-drop capabilities, extensive customization options, and seamless serialization.

## 🎯 Features

### Content Block Types
- **Code Block**: Syntax-highlighted code with multiple language support
- **CTA Block**: Call-to-action sections with customizable buttons
- **Button Block**: Interactive buttons with various styles and sizes
- **Quote Block**: Styled quotes and testimonials
- **Image Gallery Block**: Multi-image galleries with grid, carousel, and masonry layouts
- **Video Block**: Embed videos from YouTube, Vimeo, or direct URLs
- **Divider Block**: Visual separators with customizable styles
- **Spacer Block**: Vertical spacing control
- **Embed Block**: Embed external content (tweets, CodePen, etc.)

### Editor Features
- ✅ **Drag-and-Drop Interface**: HTML5 drag-and-drop for intuitive block reordering
- ✅ **Slash Commands**: Quick block insertion with `/` command (already implemented)
- ✅ **Block Settings**: Customization panels for each block type
- ✅ **Block Templates**: Pre-configured block combinations
- ✅ **Search & Filter**: Find blocks by name, description, or category
- ✅ **Keyboard Navigation**: Arrow keys and Enter for block menu
- ✅ **Serialization**: JSON and MDX format support
- ✅ **Validation & Sanitization**: XSS protection and data validation

## 📦 File Structure

```
apps/dashboard/
├── components/content-blocks/
│   ├── ButtonBlock.tsx
│   ├── CTABlock.tsx
│   ├── CodeBlock.tsx
│   ├── QuoteBlock.tsx
│   ├── ImageGalleryBlock.tsx
│   ├── VideoBlock.tsx
│   ├── DividerBlock.tsx
│   ├── SpacerBlock.tsx
│   ├── EmbedBlock.tsx
│   ├── ModularBlockEditor.tsx
│   └── settings/
│       ├── ButtonBlockSettings.tsx
│       ├── CTABlockSettings.tsx
│       ├── CodeBlockSettings.tsx
│       ├── QuoteBlockSettings.tsx
│       ├── ImageGalleryBlockSettings.tsx
│       ├── VideoBlockSettings.tsx
│       ├── DividerBlockSettings.tsx
│       ├── SpacerBlockSettings.tsx
│       └── EmbedBlockSettings.tsx
└── lib/blocks/
    ├── types.ts
    ├── registry.ts
    └── serialization.ts
```

## 🚀 Quick Start

### Basic Usage

```tsx
import { ModularBlockEditor } from '@/components/content-blocks/ModularBlockEditor';
import { ContentBlock } from '@/lib/blocks/types';

function MyEditor() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  return (
    <ModularBlockEditor
      blocks={blocks}
      onChange={setBlocks}
    />
  );
}
```

### Saving & Loading

```tsx
import { serializeBlocks, deserializeBlocks } from '@/lib/blocks/serialization';

// Save
const serialized = serializeBlocks(blocks, {
  title: 'My Article',
  tags: ['tutorial'],
  created: new Date().toISOString()
});

// Load
const loadedBlocks = deserializeBlocks(data);
```

## 🎨 Block Examples

### Code Block
```tsx
{
  id: 'code-1',
  type: 'code',
  data: {
    code: 'console.log("Hello");',
    language: 'javascript',
    showLineNumbers: true
  }
}
```

### CTA Block
```tsx
{
  id: 'cta-1',
  type: 'cta',
  data: {
    title: 'Get Started',
    buttonText: 'Sign Up',
    buttonUrl: '/signup',
    buttonStyle: 'primary',
    alignment: 'center'
  }
}
```

### Image Gallery
```tsx
{
  id: 'gallery-1',
  type: 'image-gallery',
  data: {
    images: [
      { url: '/img1.jpg', alt: 'Image 1' }
    ],
    layout: 'grid',
    columns: 3
  }
}
```

## 🔧 Customization

### Adding Custom Blocks

1. Define type in `lib/blocks/types.ts`
2. Create component in `components/content-blocks/`
3. Create settings in `components/content-blocks/settings/`
4. Register in `lib/blocks/registry.ts`

## 📝 What's Included

✅ 9 content block types
✅ Drag-and-drop interface
✅ Block settings panels
✅ Slash commands
✅ Search and filtering
✅ JSON/MDX serialization
✅ Validation & sanitization
✅ Dark mode support
✅ TypeScript support

See the full documentation for detailed usage examples and API reference.
