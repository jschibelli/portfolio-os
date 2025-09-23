# Hashnode-Style Article Editor

A comprehensive article editor built with Next.js, Tiptap, and shadcn/ui that provides a Hashnode-like writing experience.

## Features

### Core Editor
- **Rich Text Editing**: Full-featured editor with Tiptap (ProseMirror)
- **Slash Commands**: Type `/` to access quick commands for blocks
- **Auto-save**: Saves drafts every 5 seconds and on blur
- **Live Preview**: Side-by-side preview mode with MDX rendering
- **Keyboard Shortcuts**: Cmd/Ctrl+S to save, Cmd/Ctrl+K for links

### Content Blocks
- **Text Formatting**: Bold, italic, underline, strikethrough, code
- **Headings**: H1, H2, H3 with proper hierarchy
- **Lists**: Bullet lists, numbered lists, task lists
- **Media**: Images with upload support, embeds (YouTube, Twitter)
- **Advanced**: Tables, code blocks, blockquotes, horizontal rules
- **Custom Components**: React components with live rendering

### Custom Extensions
- **Callouts**: Info, warning, success, error callout boxes
- **Embeds**: YouTube videos and Twitter posts
- **React Components**: Custom components like InfoCard and StatBadge
- **Slash Commands**: Quick insertion of any block type

### Data Management
- **Dual Format**: Stores both ProseMirror JSON and MDX
- **Auto-slug**: Generates URL-friendly slugs from titles
- **Tag Management**: Add/remove tags with visual badges
- **Cover Images**: Support for article cover images
- **Publishing**: Draft, published, and scheduled states

## Architecture

### File Structure
```
app/(admin)/admin/articles/
├── new/page.tsx                    # New article page
├── [id]/edit/page.tsx             # Edit existing article
├── _components/
│   ├── ArticleEditor.tsx          # Main editor component
│   └── EditorToolbar.tsx          # Enhanced toolbar
└── _editor/
    ├── extensions/
    │   ├── SimpleSlashCommand.tsx # Slash command extension
    │   ├── Callout.tsx            # Callout block extension
    │   ├── Embed.tsx              # Embed extension
    │   └── ReactComponentBlock.tsx # React component extension
    └── components/
        ├── InfoCard.tsx           # Example component
        ├── StatBadge.tsx          # Example component
        └── registry.tsx           # Component registry

lib/
├── types/article.ts               # TypeScript types
├── slugify.ts                     # Slug generation utilities
└── editor/
    ├── pmToMdx.ts                 # ProseMirror to MDX conversion
    ├── mdxComponents.tsx          # MDX components for preview
    └── renderMdx.tsx              # MDX rendering utility

app/api/
├── articles/save-draft/route.ts   # Save draft endpoint
├── articles/publish/route.ts      # Publish article endpoint
└── upload/route.ts                # File upload endpoint
```

### Key Components

#### ArticleEditor
The main editor component that orchestrates the entire editing experience:
- Manages editor state and autosave
- Handles title, slug, tags, and cover image
- Provides preview mode toggle
- Implements keyboard shortcuts

#### Custom Extensions
Each extension provides specific functionality:

**Callout Extension**
- Node type: `callout`
- Attributes: `variant` (info/warn/success/error), `title`
- React node view with inline editing

**Embed Extension**
- Node type: `embed`
- Attributes: `provider` (youtube/tweet), `url`, `id`
- Renders iframes and Twitter embeds

**React Component Extension**
- Node type: `component`
- Attributes: `name`, `props`
- Renders live React components from registry

#### MDX Serialization
The `pmToMdx.ts` utility converts ProseMirror JSON to MDX:
- Maps editor nodes to MDX syntax
- Handles custom components and embeds
- Preserves formatting and structure

## Usage

### Creating a New Article
1. Navigate to `/admin/articles/new`
2. Enter a title (slug auto-generates)
3. Add tags and cover image (optional)
4. Start writing with the editor
5. Use `/` for slash commands
6. Toggle preview mode to see MDX output
7. Save draft or publish

### Editing an Article
1. Navigate to `/admin/articles/[id]/edit`
2. Existing content loads automatically
3. Make changes (auto-saves every 5s)
4. Preview changes in real-time
5. Save or publish updates

### Adding Custom Components
1. Create component in `_editor/components/`
2. Add to `registry.tsx`
3. Use slash command or insert via toolbar
4. Component renders live in editor
5. Serializes to MDX for static rendering

## API Endpoints

### Save Draft
```typescript
POST /api/articles/save-draft
{
  id?: string,
  title: string,
  slug: string,
  tags: string[],
  coverUrl?: string,
  content_json: JSONContent,
  content_mdx: string
}
```

### Publish Article
```typescript
POST /api/articles/publish
{
  id: string,
  publishAt?: Date
}
```

### Upload File
```typescript
POST /api/upload
FormData with file
```

## Keyboard Shortcuts

- `Cmd/Ctrl + S`: Save draft
- `Cmd/Ctrl + K`: Add link
- `/`: Open slash command menu
- `Cmd/Ctrl + B`: Bold
- `Cmd/Ctrl + I`: Italic

## Styling

The editor uses the Stone theme from shadcn/ui for consistent styling:
- Clean, minimal interface
- Proper contrast and accessibility
- Responsive design
- Consistent with admin panel

## Future Enhancements

- [ ] Collaborative editing
- [ ] Version history
- [ ] Advanced scheduling
- [ ] SEO optimization tools
- [ ] Analytics integration
- [ ] Comment system
- [ ] Social sharing
- [ ] Export to various formats

## Dependencies

- `@tiptap/react`: Rich text editor
- `@tiptap/starter-kit`: Basic editor functionality
- `@tiptap/extension-*`: Various extensions
- `lowlight`: Syntax highlighting
- `next-mdx-remote`: MDX rendering (optional)
- `shadcn/ui`: UI components
- `tailwindcss`: Styling

## Notes

This implementation provides a solid foundation for a Hashnode-style editor while being fully open-source and customizable. The dual-format storage (JSON + MDX) ensures compatibility with both dynamic editing and static site generation.

