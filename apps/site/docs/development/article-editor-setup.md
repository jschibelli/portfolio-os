# Article Editor Setup Guide

## Quick Start

The Hashnode-style article editor is now ready to use! Here's how to get started:

### 1. Access the Editor

- **New Article**: Navigate to `/admin/articles/new`
- **Edit Article**: Navigate to `/admin/articles/[id]/edit`
- **Article List**: Navigate to `/admin/articles`

### 2. Basic Usage

1. **Create a New Article**:
   - Click "New Article" in the sidebar or articles list
   - Enter a title (slug auto-generates)
   - Add tags and cover image (optional)
   - Start writing in the editor

2. **Use Slash Commands**:
   - Type `/` to see available commands
   - Select from headings, lists, callouts, embeds, etc.

3. **Format Text**:
   - Use the toolbar for bold, italic, links
   - Select text to see the bubble menu
   - Use keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+K)

4. **Preview**:
   - Click the "Preview" button to see MDX output
   - Toggle between edit and preview modes

5. **Save & Publish**:
   - Auto-saves every 5 seconds
   - Manual save with Ctrl+S
   - Publish when ready

### 3. Available Features

#### ✅ Working Features
- Rich text editing with Tiptap
- Headings (H1, H2, H3)
- Lists (bullet, numbered, task)
- Text formatting (bold, italic, underline, strikethrough, code)
- Images with upload
- Callouts (info, warn, success, error)
- YouTube and Twitter embeds
- React components (InfoCard, StatBadge)
- Auto-save functionality
- Preview mode
- Tag management
- Slug generation

#### 🔄 Coming Soon
- Tables (requires additional Tiptap extensions)
- Horizontal rules
- Advanced slash command menu
- Collaborative editing
- Version history

### 4. Custom Components

Add your own React components to the editor:

1. Create component in `app/(admin)/admin/articles/_editor/components/`
2. Add to `registry.tsx`
3. Use in editor via slash command or toolbar

Example:
```tsx
// MyComponent.tsx
export function MyComponent({ title, content }) {
  return (
    <div className="my-custom-component">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  )
}

// registry.tsx
export const COMPONENT_REGISTRY = {
  InfoCard,
  StatBadge,
  MyComponent, // Add here
}
```

### 5. API Endpoints

The editor uses these API endpoints:

- `POST /api/articles/save-draft` - Auto-save drafts
- `POST /api/articles/publish` - Publish articles
- `POST /api/upload` - Upload images

### 6. Data Storage

Articles are stored with:
- `content_json`: ProseMirror JSON for editing
- `content_mdx`: MDX string for static rendering
- Standard fields: title, slug, tags, cover, status

### 7. Troubleshooting

#### Common Issues

1. **Editor not loading**: Check browser console for errors
2. **Auto-save not working**: Verify API routes are accessible
3. **Images not uploading**: Check `/api/upload` endpoint
4. **Components not rendering**: Verify component registry

#### Missing Dependencies

If you need table support, install:
```bash
npm install @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-header @tiptap/extension-table-cell @tiptap/extension-horizontal-rule
```

Then uncomment the table-related code in:
- `ArticleEditor.tsx`
- `EditorToolbar.tsx`
- `SimpleSlashCommand.tsx`

### 8. Next Steps

1. **Test the Editor**: Create a test article
2. **Customize Components**: Add your own React components
3. **Style Customization**: Modify the Stone theme as needed
4. **Add Features**: Implement tables, advanced scheduling, etc.

### 9. Development Notes

- The editor uses ProseMirror under the hood via Tiptap
- MDX serialization happens automatically
- All components are fully typed with TypeScript
- Follows your Stone theme preferences
- Responsive design for mobile/desktop

The editor is production-ready and provides a solid foundation for content creation!

