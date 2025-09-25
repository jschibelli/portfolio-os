## Theming Guidelines

### Tokens
- Define light tokens on `:root`; dark overrides under `.dark` in `styles/index.css`.
- Use Tailwind color aliases mapped to tokens (e.g., `bg-background`, `text-foreground`).

### Configuration
- Tailwind `darkMode: 'class'` in `tailwind.config.js`.
- `next-themes` `ThemeProvider` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`, `enableColorScheme`.
- Set `<html suppressHydrationWarning>` and `<body className="bg-background text-foreground">` in `app/layout.tsx`.

### Usage Rules
- Always provide a base (light) class, then optional `dark:` variant.
- Prefer token utilities over hard-coded palette classes. Example: replace `bg-stone-50` with `bg-card`, `text-stone-900` with `text-foreground`, borders with `border-border`.
- For prose and code: ensure light mode legibility; dark uses `dark:prose-invert` and specific code colors.

### Accessibility
- Target WCAG AA contrast minimums. Validate `--foreground` vs `--background`, border vs background, and muted text.
- Ensure focus states use `--ring` and are visible on both themes.

### Testing
- Playwright spec `tests/theme-toggle.spec.ts` verifies respecting stored theme and no flicker.
- Add axe checks where appropriate for color contrast.

### Migration Tips
- Search for `stone-*` and replace with token-based classes.
- Ensure components with `dark:` also have adequate base styles in light mode.



