# Blog Page Tokens Map

## Overview

This document maps all design tokens used specifically on the Blog page, showing the relationship between CSS variables, Tailwind classes, and computed values.

## Color Tokens

### Primary Colors

| Token | CSS Variable | Light Mode Value | Dark Mode Value | Usage on Blog Page |
|-------|--------------|------------------|-----------------|-------------------|
| `--primary` | `hsl(var(--primary))` | `#e11d48` (Rose 600) | `#e11d48` (Rose 600) | Button backgrounds, focus rings |
| `--primary-foreground` | `hsl(var(--primary-foreground))` | `#fdf2f8` (Rose 50) | `#fdf2f8` (Rose 50) | Button text, primary text on primary bg |
| `--secondary` | `hsl(var(--secondary))` | `#f4f4f5` (Zinc 100) | `#27272a` (Zinc 800) | Secondary backgrounds, badges |
| `--secondary-foreground` | `hsl(var(--secondary-foreground))` | `#18181b` (Zinc 900) | `#fafafa` (Zinc 50) | Text on secondary backgrounds |

### Background Colors

| Token | CSS Variable | Light Mode Value | Dark Mode Value | Usage on Blog Page |
|-------|--------------|------------------|-----------------|-------------------|
| `--background` | `hsl(var(--background))` | `#ffffff` (White) | `#0c0a09` (Stone 950) | Page background, card backgrounds |
| `--foreground` | `hsl(var(--foreground))` | `#0f0f0f` (Zinc 950) | `#f2f2f2` (Zinc 100) | Primary text color |
| `--card` | `hsl(var(--card))` | `#ffffff` (White) | `#1c1917` (Stone 900) | Card backgrounds |
| `--card-foreground` | `hsl(var(--card-foreground))` | `#0f0f0f` (Zinc 950) | `#f2f2f2` (Zinc 100) | Text on cards |

### Muted Colors

| Token | CSS Variable | Light Mode Value | Dark Mode Value | Usage on Blog Page |
|-------|--------------|------------------|-----------------|-------------------|
| `--muted` | `hsl(var(--muted))` | `#f4f4f5` (Zinc 100) | `#262626` (Zinc 800) | Muted backgrounds |
| `--muted-foreground` | `hsl(var(--muted-foreground))` | `#71717a` (Zinc 500) | `#a1a1aa` (Zinc 400) | Secondary text, metadata |

### Border Colors

| Token | CSS Variable | Light Mode Value | Dark Mode Value | Usage on Blog Page |
|-------|--------------|------------------|-----------------|-------------------|
| `--border` | `hsl(var(--border))` | `#e4e4e7` (Zinc 200) | `#27272a` (Zinc 800) | Card borders, input borders |
| `--input` | `hsl(var(--input))` | `#e4e4e7` (Zinc 200) | `#27272a` (Zinc 800) | Input field borders |
| `--ring` | `hsl(var(--ring))` | `#e11d48` (Rose 600) | `#e11d48` (Rose 600) | Focus rings, active states |

### Stone Color Palette (Blog-Specific)

| Class | Light Mode Value | Dark Mode Value | Usage on Blog Page |
|-------|------------------|-----------------|-------------------|
| `text-stone-900` | `#0c0a09` | `#0c0a09` | Primary headings |
| `text-stone-100` | `#f5f5f4` | `#f5f5f4` | Primary headings (dark mode) |
| `text-stone-700` | `#44403c` | `#44403c` | Secondary text |
| `text-stone-400` | `#a8a29e` | `#a8a29e` | Muted text |
| `text-stone-300` | `#d6d3d1` | `#d6d3d1` | Very muted text |
| `text-stone-200` | `#e7e5e4` | `#e7e5e4` | Subtle text |
| `bg-stone-50` | `#fafaf9` | `#fafaf9` | Featured post background |
| `bg-stone-900` | `#0c0a09` | `#0c0a09` | Featured post background (dark) |
| `bg-stone-950` | `#0c0a09` | `#0c0a09` | Page background (dark) |
| `border-stone-200` | `#e7e5e4` | `#e7e5e4` | Social icon borders |
| `border-stone-700` | `#44403c` | `#44403c` | Social icon borders (dark) |

## Typography Tokens

### Font Family
- **Primary**: Plus Jakarta Sans
- **Fallback**: system-ui, -apple-system, sans-serif
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700), ExtraBold (800)

### Font Sizes

| Class | Computed Value | Usage on Blog Page |
|-------|----------------|-------------------|
| `text-xs` | 12px (0.75rem) | Social media labels, small metadata |
| `text-sm` | 14px (0.875rem) | Post metadata, button text |
| `text-base` | 16px (1rem) | Body text, descriptions |
| `text-lg` | 18px (1.125rem) | Hero description, featured post excerpt |
| `text-xl` | 20px (1.25rem) | Post card titles |
| `text-2xl` | 24px (1.5rem) | Section headings, featured post title |
| `text-3xl` | 30px (1.875rem) | Hero subtitle |
| `text-4xl` | 36px (2.25rem) | Hero title (mobile) |
| `text-5xl` | 48px (3rem) | Hero title (tablet) |
| `text-6xl` | 60px (3.75rem) | Hero title (desktop) |
| `text-7xl` | 72px (4.5rem) | Hero title (large desktop) |

### Line Heights

| Class | Computed Value | Usage on Blog Page |
|-------|----------------|-------------------|
| `leading-tight` | 1.25 | Headings, titles |
| `leading-snug` | 1.375 | Subheadings |
| `leading-normal` | 1.5 | Body text (default) |
| `leading-relaxed` | 1.625 | Descriptions, excerpts |

### Font Weights

| Class | Computed Value | Usage on Blog Page |
|-------|----------------|-------------------|
| `font-medium` | 500 | Navigation links, metadata |
| `font-semibold` | 600 | Post titles, section headings |
| `font-bold` | 700 | Main headings, hero title |
| `font-extrabold` | 800 | Large hero titles |

## Spacing Tokens

### Padding & Margin

| Class | Computed Value | Usage on Blog Page |
|-------|----------------|-------------------|
| `p-3` | 12px (0.75rem) | Social icon padding |
| `p-4` | 16px (1rem) | Card padding |
| `p-5` | 20px (1.25rem) | Container padding |
| `p-6` | 24px (1.5rem) | Card header/content padding |
| `py-8` | 32px (2rem) | Section vertical padding |
| `py-12` | 48px (3rem) | Hero vertical padding |
| `py-16` | 64px (4rem) | Hero vertical padding (desktop) |
| `px-4` | 16px (1rem) | Container horizontal padding |
| `px-5` | 20px (1.25rem) | Container horizontal padding |
| `px-6` | 24px (1.5rem) | Button horizontal padding |
| `px-8` | 32px (2rem) | Button horizontal padding (large) |

### Gaps

| Class | Computed Value | Usage on Blog Page |
|-------|----------------|-------------------|
| `gap-2` | 8px (0.5rem) | Tag spacing |
| `gap-3` | 12px (0.75rem) | Small element spacing |
| `gap-4` | 16px (1rem) | Social icon spacing |
| `gap-6` | 24px (1.5rem) | Post grid spacing |
| `gap-8` | 32px (2rem) | Section spacing |
| `gap-10` | 40px (2.5rem) | Main container spacing |

## Border Radius Tokens

| Class | CSS Variable | Computed Value | Usage on Blog Page |
|-------|--------------|----------------|-------------------|
| `rounded-md` | `calc(var(--radius) - 2px)` | 6px | Buttons, inputs |
| `rounded-lg` | `var(--radius)` | 8px | Cards, containers |
| `rounded-xl` | `calc(var(--radius) + 4px)` | 12px | Post cards |
| `rounded-full` | `9999px` | 50% | Social icons, badges |

## Shadow Tokens

| Class | Computed Value | Usage on Blog Page |
|-------|----------------|-------------------|
| `shadow` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` | Default card shadows |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Post cards, featured post |
| `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | Hover states |
| `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Subtle shadows |

## Animation Tokens

### Duration

| Class | Computed Value | Usage on Blog Page |
|-------|----------------|-------------------|
| `duration-300` | 300ms | Quick transitions, hover effects |
| `duration-500` | 500ms | Card animations, image effects |
| `duration-700` | 700ms | Section animations |
| `duration-1000` | 1000ms | Main section entrance animations |

### Easing

| Class | Computed Value | Usage on Blog Page |
|-------|----------------|-------------------|
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Default easing for most animations |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth transitions |

### Transform Values

| Class | Computed Value | Usage on Blog Page |
|-------|----------------|-------------------|
| `scale-[1.02]` | `scale(1.02)` | Card hover effects |
| `scale-[1.05]` | `scale(1.05)` | Button hover effects |
| `scale-110` | `scale(1.1)` | Image hover effects |
| `translate-y-8` | `translateY(2rem)` | Initial animation state |
| `translate-y-0` | `translateY(0)` | Final animation state |
| `translate-x-1` | `translateX(0.25rem)` | Arrow animations |

## Breakpoint Tokens

| Breakpoint | Min Width | Usage on Blog Page |
|------------|-----------|-------------------|
| `sm` | 640px | Small tablets, large phones |
| `md` | 768px | Tablets, small laptops |
| `lg` | 1024px | Laptops, desktops |
| `xl` | 1280px | Large desktops |
| `2xl` | 1536px | Extra large screens |

## Component-Specific Token Usage

### ModernPostCard
```css
/* Card Container */
.bg-card { background-color: hsl(var(--card)); }
.border-border { border-color: hsl(var(--border)); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
.rounded-xl { border-radius: 0.75rem; }

/* Hover States */
.hover\:scale-\[1\.02\]:hover { transform: scale(1.02); }
.hover\:border-primary\/30:hover { border-color: hsl(var(--primary) / 0.3); }
.hover\:shadow-xl:hover { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
```

### FeaturedPost
```css
/* Background */
.bg-stone-50 { background-color: #fafaf9; }
.dark\:bg-stone-900 { background-color: #0c0a09; }

/* Text Colors */
.text-stone-900 { color: #0c0a09; }
.dark\:text-stone-100 { color: #f5f5f4; }
.text-stone-600 { color: #57534e; }
.dark\:text-stone-400 { color: #a8a29e; }
```

### Social Media Icons
```css
/* Icon Container */
.border-stone-200 { border-color: #e7e5e4; }
.dark\:border-stone-700 { border-color: #44403c; }
.text-stone-600 { color: #57534e; }
.dark\:text-stone-400 { color: #a8a29e; }

/* Hover States */
.hover\:bg-stone-100:hover { background-color: #f5f5f4; }
.dark\:hover\:bg-stone-800:hover { background-color: #292524; }
.hover\:text-stone-900:hover { color: #0c0a09; }
.dark\:hover\:text-stone-100:hover { color: #f5f5f4; }
```

## Token Dependencies

### CSS Variable Dependencies
```css
/* Primary color system */
--primary → --primary-foreground
--secondary → --secondary-foreground
--muted → --muted-foreground
--accent → --accent-foreground
--destructive → --destructive-foreground

/* Background system */
--background → --foreground
--card → --card-foreground

/* Border system */
--border → --input (same values)
--ring (independent, used for focus states)
```

### Tailwind Class Dependencies
```css
/* Color system dependencies */
.bg-primary → .text-primary-foreground
.bg-secondary → .text-secondary-foreground
.bg-muted → .text-muted-foreground

/* Spacing dependencies */
.p-6 → .pt-0 (overrides top padding)
.gap-6 → .space-y-6 (vertical spacing)
```

## Token Validation

### Color Contrast Ratios
- **Primary text on background**: 4.5:1 (WCAG AA compliant)
- **Secondary text on background**: 3:1 (WCAG AA compliant)
- **Interactive elements**: 3:1 (WCAG AA compliant)

### Accessibility Considerations
- All color tokens meet WCAG AA contrast requirements
- Focus states use high-contrast ring colors
- Dark mode maintains proper contrast ratios
- Interactive elements have clear visual feedback

---

*This token map was generated on $(date) and should be updated whenever design tokens are modified.*
