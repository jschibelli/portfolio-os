# Storybook Configuration

This directory contains the Storybook configuration for Portfolio OS component library.

## Quick Start

```bash
# Start Storybook development server
pnpm storybook

# Build Storybook for production
pnpm build-storybook

# Serve built Storybook
pnpm storybook:serve
```

## Configuration Files

### `main.ts`
Main Storybook configuration:
- Story file locations
- Addons configuration
- Framework setup (Next.js)
- Webpack customization for path aliases

### `preview.ts`
Preview configuration:
- Global decorators
- Parameter defaults
- Background colors
- Theme configuration

## Story Locations

Stories are located throughout the codebase:

- `components/**/*.stories.tsx` - Component stories
- `app/**/*.stories.tsx` - App-specific stories
- `stories/**/*.stories.mdx` - Documentation pages

## Available Addons

- **@storybook/addon-essentials** - Essential addons bundle (docs, controls, actions, etc.)
- **@storybook/addon-links** - Link stories together
- **@storybook/addon-interactions** - Test user interactions
- **@storybook/addon-onboarding** - Onboarding guide for new users

## Path Aliases

The following path aliases are configured:

- `@/` → Root of the app
- `@components/` → `components/`
- `@app/` → `app/`
- `@lib/` → `lib/`

## Creating Stories

### Basic Story

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta = {
  title: 'Category/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Your props here
  },
};
```

### With Multiple Variants

```typescript
export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};
```

### Custom Render

```typescript
export const Complex: Story = {
  render: (args) => (
    <div>
      <MyComponent {...args} />
    </div>
  ),
};
```

## Best Practices

1. **Name stories descriptively** - Use names like `Default`, `WithIcon`, `Disabled`
2. **Include all variants** - Show all possible states and configurations
3. **Add documentation** - Use the `parameters.docs` field to add descriptions
4. **Test edge cases** - Include stories for empty states, errors, etc.
5. **Keep stories simple** - Focus on one scenario per story
6. **Use autodocs** - Add `tags: ['autodocs']` to generate documentation

## CI/CD Integration

Storybook is automatically built in CI/CD:

- **Workflow**: `.github/workflows/ci.yml`
- **Job**: `build-storybook`
- **Artifacts**: Uploaded with 7-day retention
- **Status**: Non-blocking (won't fail the build)

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Next.js Framework Guide](https://storybook.js.org/docs/get-started/nextjs)
- [Portfolio OS Storybook Docs](/docs/component-library/storybook)

## Troubleshooting

### Port Already in Use

```bash
# Kill the process using port 6006
# Windows
netstat -ano | findstr :6006
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:6006 | xargs kill -9
```

### Styles Not Loading

Ensure `../app/globals.css` is imported in `preview.ts`.

### Path Aliases Not Working

Check the `webpackFinal` configuration in `main.ts` to ensure all aliases are set up correctly.

## Examples

Example stories are available for:

- `Button` - UI component with multiple variants
- `Card` - Container component with sections
- `Gallery` - Image gallery with lightbox
- `FeatureGrid` - Responsive feature grid

Browse these stories to see best practices in action!



