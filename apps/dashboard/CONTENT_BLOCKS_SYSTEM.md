# Modular Content Block System

A comprehensive, Hashnode-style modular content block system for the Dashboard editor, enabling drag-and-drop content creation with TipTap integration.

## 🚀 Features

### ✅ Completed Features

- **Content Block Library**: Complete set of content blocks (Code, CTA, Button, Quote, Image Gallery, Video, Divider, Spacer, Embed)
- **Drag-and-Drop Interface**: Full drag-and-drop functionality with @hello-pangea/dnd integration
- **TipTap Integration**: Seamless integration with TipTap editor via custom extensions
- **Slash Commands**: Enhanced slash commands for quick block insertion
- **Block Preview System**: Multi-device preview with export capabilities
- **Customization Options**: Comprehensive settings panels for each block type
- **Serialization/Deserialization**: Full JSON serialization with version compatibility
- **Templates & Presets**: Pre-configured block combinations for common use cases

### 🎯 Core Components

#### Content Blocks
- **CodeBlock**: Syntax-highlighted code with language detection
- **CTABlock**: Call-to-action sections with customizable buttons
- **ButtonBlock**: Interactive buttons with various styles
- **QuoteBlock**: Highlighted quotes with author attribution
- **ImageGalleryBlock**: Multi-layout image galleries (grid, carousel, masonry)
- **VideoBlock**: YouTube, Vimeo, and direct video embedding
- **DividerBlock**: Visual separators with customizable styles
- **SpacerBlock**: Vertical spacing with unit controls
- **EmbedBlock**: External content embedding (Twitter, Instagram, TikTok, etc.)

#### TipTap Extensions
- **ContentBlock Extension**: Custom TipTap node for block rendering
- **ContentBlockComponent**: React node view for TipTap integration
- **Enhanced Slash Commands**: Integrated content block commands

#### Settings & Configuration
- **Individual Block Settings**: Dedicated settings panels for each block type
- **Block Registry**: Centralized block management system
- **Template System**: Pre-configured block combinations
- **Serialization**: JSON-based save/load functionality

## 📁 File Structure

```
apps/dashboard/
├── components/content-blocks/
│   ├── BlockEditor.tsx                 # Main block editor with drag-and-drop
│   ├── BlockPreview.tsx                # Multi-device preview system
│   ├── BlockTemplateSelector.tsx       # Template browser and selector
│   ├── CodeBlock.tsx                   # Code block component
│   ├── CTABlock.tsx                    # CTA block component
│   ├── ButtonBlock.tsx                 # Button block component
│   ├── QuoteBlock.tsx                  # Quote block component
│   ├── ImageGalleryBlock.tsx           # Image gallery block component
│   ├── VideoBlock.tsx                  # Video block component
│   ├── DividerBlock.tsx                # Divider block component
│   ├── SpacerBlock.tsx                 # Spacer block component
│   ├── EmbedBlock.tsx                  # Embed block component
│   └── settings/                       # Block settings components
│       ├── CodeBlockSettings.tsx
│       ├── CTABlockSettings.tsx
│       ├── ButtonBlockSettings.tsx
│       ├── QuoteBlockSettings.tsx
│       ├── ImageGalleryBlockSettings.tsx
│       ├── VideoBlockSettings.tsx
│       ├── DividerBlockSettings.tsx
│       ├── SpacerBlockSettings.tsx
│       └── EmbedBlockSettings.tsx
├── lib/blocks/
│   ├── types.ts                        # TypeScript type definitions
│   ├── registry.ts                     # Block registry and configuration
│   ├── serialization.ts                # Serialization/deserialization
│   ├── templates.ts                    # Pre-configured templates
│   └── slash-commands.ts               # Slash command definitions
├── app/admin/articles/_editor/extensions/
│   ├── ContentBlock.tsx                # TipTap extension for content blocks
│   ├── ContentBlockComponent.tsx       # React node view component
│   └── SlashCommand.tsx                # Enhanced slash commands
└── app/admin/articles/content-blocks-demo/
    └── page.tsx                        # Demo page showcasing the system
```

## 🛠️ Usage

### Basic Usage

```tsx
import { BlockEditor } from '@/components/content-blocks/BlockEditor';
import { ContentBlock } from '@/lib/blocks/types';

const [blocks, setBlocks] = useState<ContentBlock[]>([]);

<BlockEditor
  blocks={blocks}
  onBlocksChange={setBlocks}
  selectedBlockId={selectedBlockId}
  onBlockSelect={setSelectedBlockId}
/>
```

### TipTap Integration

```tsx
import { ContentBlock } from '@/app/admin/articles/_editor/extensions/ContentBlock';
import { SlashCommandExtension } from '@/app/admin/articles/_editor/extensions/SlashCommand';

const editor = useEditor({
  extensions: [
    // ... other extensions
    ContentBlock.configure({
      HTMLAttributes: {
        class: 'content-block-wrapper my-4',
      },
    }),
    SlashCommandExtension.configure({
      suggestion: {
        items: ({ query }) => slashCommands.filter(/* ... */)
      }
    })
  ]
});
```

### Adding Content Blocks via Slash Commands

Type `/` in the TipTap editor to access slash commands:
- `/code` - Add a code block
- `/cta` - Add a call-to-action block
- `/quote` - Add a quote block
- `/gallery` - Add an image gallery
- `/video` - Add a video block
- And many more...

### Keyboard Shortcuts

- `Cmd/Ctrl + Shift + B` - Insert code block
- `Cmd/Ctrl + Shift + C` - Insert CTA block
- `Cmd/Ctrl + Shift + Q` - Insert quote block
- `Cmd/Ctrl + Shift + I` - Insert image gallery
- `Cmd/Ctrl + Shift + V` - Insert video block
- `Cmd/Ctrl + Shift + D` - Insert divider
- `Cmd/Ctrl + Shift + S` - Insert spacer
- `Cmd/Ctrl + Shift + E` - Insert embed block

### Using Templates

```tsx
import { BlockTemplateSelector } from '@/components/content-blocks/BlockTemplateSelector';
import { getTemplateById } from '@/lib/blocks/templates';

const template = getTemplateById('hero-basic');
setBlocks(template.blocks);
```

## 🔧 Configuration

### Block Registry

Blocks are registered in `lib/blocks/registry.ts`:

```tsx
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
  // ... other blocks
};
```

### Adding New Block Types

1. Create the block component in `components/content-blocks/`
2. Create the settings component in `components/content-blocks/settings/`
3. Add the block to the registry in `lib/blocks/registry.ts`
4. Add slash command in `lib/blocks/slash-commands.ts`
5. Update types in `lib/blocks/types.ts`

## 📦 Dependencies

### Required Dependencies
- `@hello-pangea/dnd` - Drag and drop functionality
- `@tiptap/core` - TipTap editor core
- `@tiptap/react` - React integration
- `@tiptap/suggestion` - Slash command suggestions
- `react-syntax-highlighter` - Code syntax highlighting
- `lucide-react` - Icons

### Optional Dependencies
- `lowlight` - Advanced syntax highlighting
- `tippy.js` - Tooltip functionality

## 🎨 Styling

The system uses Tailwind CSS for styling. Key classes:
- `.content-block-wrapper` - Main block container
- `.content-block-node` - TipTap node wrapper
- `.block-preview-item` - Preview mode styling

## 🔄 Serialization

### Save Content
```tsx
import { serializeBlocks } from '@/lib/blocks/serialization';

const serialized = serializeBlocks(blocks, {
  title: 'My Content',
  description: 'Content description'
});
```

### Load Content
```tsx
import { deserializeBlocks } from '@/lib/blocks/serialization';

const blocks = deserializeBlocks(serializedContent);
```

### Export Formats
- **JSON**: Full block data with metadata
- **HTML**: Rendered HTML output
- **Markdown**: Markdown representation
- **Preview**: Visual preview across devices

## 🧪 Testing

### Demo Page
Visit `/admin/articles/content-blocks-demo` to see the system in action with:
- Interactive block editor
- Live preview
- Template selector
- Export/import functionality

### Manual Testing
1. Open the demo page
2. Try adding blocks via slash commands
3. Test drag-and-drop functionality
4. Configure block settings
5. Export/import content
6. Test different templates

## 🚀 Future Enhancements

### Planned Features
- **Advanced Templates**: More sophisticated template combinations
- **Block Analytics**: Usage tracking and insights
- **Custom Block Builder**: Visual block creation tool
- **Collaborative Editing**: Real-time collaboration features
- **Version Control**: Block-level version history
- **AI Integration**: AI-powered content suggestions
- **Performance Optimization**: Lazy loading and virtualization

### Extension Points
- **Custom Block Types**: Plugin system for new blocks
- **Theme System**: Customizable block styling
- **Integration APIs**: Third-party service integrations
- **Export Plugins**: Custom export formats

## 📝 API Reference

### BlockEditor Props
```tsx
interface BlockEditorProps {
  blocks: ContentBlock[];
  onBlocksChange: (blocks: ContentBlock[]) => void;
  selectedBlockId?: string;
  onBlockSelect?: (blockId: string | undefined) => void;
  isPreview?: boolean;
  onPreviewToggle?: (preview: boolean) => void;
}
```

### ContentBlock Interface
```tsx
interface ContentBlock {
  id: string;
  type: string;
  data: Record<string, any>;
  settings?: BlockSettings;
  position?: number;
}
```

### BlockRegistry Interface
```tsx
interface BlockRegistry {
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
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add comprehensive TypeScript types
3. Include proper error handling
4. Write tests for new functionality
5. Update documentation

## 📄 License

This content block system is part of the portfolio-os project and follows the same licensing terms.


