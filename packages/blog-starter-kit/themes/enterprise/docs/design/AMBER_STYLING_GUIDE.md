# Amber Accent Styling Guide

## Overview
This guide documents the amber accent system implemented in the Tendrilo case study, designed to be applied app-wide for consistent visual hierarchy and brand identity across light and dark modes.

## Color Palette

### Primary Amber Shades
- **amber-500**: Primary accent color (main brand color)
- **amber-600**: Darker variant for hover states and emphasis
- **amber-400**: Lighter variant for subtle accents
- **amber-300**: Very light for backgrounds and borders

### Light Mode Specific
- **amber-50**: Very light backgrounds
- **amber-100**: Light backgrounds with better contrast
- **amber-200**: Light borders and subtle backgrounds

### Dark Mode Specific
- **amber-900**: Dark backgrounds
- **amber-800**: Darker borders
- **amber-700**: Dark mode accent borders

## Component Styling Patterns

### 1. Section Headers (h2, h3)
```tsx
// Primary section headers
<h2 className="relative text-2xl font-bold mb-6">
  Section Title
  <span className="absolute left-0 -bottom-2 h-1 w-16 bg-amber-500/60 rounded-full" />
</h2>

// Secondary headers
<h3 className="relative text-xl font-semibold mb-4">
  Subsection Title
  <span className="absolute left-0 -bottom-1 h-0.5 w-12 bg-amber-400/50 rounded-full" />
</h3>
```

### 2. Buttons
```tsx
// Primary buttons
<Button className="bg-amber-600 hover:bg-amber-700 text-white border-amber-600 hover:border-amber-700">
  Primary Action
</Button>

// Secondary buttons
<Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/30">
  Secondary Action
</Button>

// Ghost buttons
<Button variant="ghost" className="text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30">
  Ghost Action
</Button>
```

### 3. Navigation Elements
```tsx
// Active navigation items
<nav className="space-y-2">
  <button className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
    isActive 
      ? 'bg-amber-50/60 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-l-2 border-amber-400 ring-1 ring-amber-200/60 dark:ring-amber-700/40' 
      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
  }`}>
    Navigation Item
  </button>
</nav>
```

### 4. Cards and Containers
```tsx
// Primary cards
<Card className="border-amber-200/60 dark:border-amber-700/40 bg-gradient-to-br from-amber-50/30 to-transparent dark:from-amber-900/20">
  <CardContent className="p-6">
    Content
  </CardContent>
</Card>

// Accent cards
<Card className="bg-amber-50/60 dark:bg-amber-500/10 border-amber-200/60 dark:border-amber-700/40">
  <CardContent className="p-6">
    Accent Content
  </CardContent>
</Card>
```

### 5. Tables
```tsx
// Table headers
<thead>
  <tr className="bg-amber-50/60 dark:bg-amber-500/10">
    <th className="px-4 py-3 text-center font-semibold text-amber-800 dark:text-amber-200">
      Header
    </th>
  </tr>
</thead>

// Accent columns
<td className="px-4 py-3 bg-amber-50/60 dark:bg-amber-500/10 font-medium">
  Accent Cell
</td>
```

### 6. Badges and Tags
```tsx
// Primary badges
<Badge className="bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/60 dark:border-amber-700/40">
  Badge Text
</Badge>

// Status badges
<Badge className="bg-amber-500/20 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300">
  Status
</Badge>
```

### 7. Icons
```tsx
// Primary icons
<Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />

// Accent icons
<Icon className="h-4 w-4 text-amber-500/70 dark:text-amber-400/70" />
```

### 8. Progress Indicators
```tsx
// Progress bars
<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
  <div className="bg-amber-500 dark:bg-amber-400 h-2 rounded-full" style={{ width: '60%' }} />
</div>

// Timeline elements
<div className="relative">
  <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-amber-300 dark:bg-amber-700 z-0" />
  <div className="relative z-10 bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-300/70 dark:border-amber-600/60 rounded-full w-8 h-8 flex items-center justify-center shadow-[0_0_0_4px_rgba(0,0,0,0.15)]">
    <Icon className="h-4 w-4 text-amber-600" />
  </div>
</div>
```

### 9. Form Elements
```tsx
// Input focus states
<Input className="focus:ring-2 focus:ring-amber-500/50 focus:border-amber-300 dark:focus:ring-amber-400/50 dark:focus:border-amber-600" />

// Checkbox
<Checkbox className="text-amber-600 focus:ring-amber-500" />

// Select
<Select className="focus:ring-2 focus:ring-amber-500/50 focus:border-amber-300">
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
</Select>
```

### 10. Links
```tsx
// Primary links
<Link className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 underline decoration-amber-300/50 hover:decoration-amber-500">
  Link Text
</Link>

// Navigation links
<Link className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
  Nav Link
</Link>
```

## Dark Mode Considerations

### Contrast Enhancement
- Use stronger amber shades in light mode for better visibility
- Leverage opacity for subtle effects in dark mode
- Ensure sufficient contrast ratios (WCAG AA compliant)

### Background Patterns
```tsx
// Light mode backgrounds
className="bg-amber-100 dark:bg-amber-900/30"

// Dark mode borders
className="border-amber-300 dark:border-amber-700/40"
```

## Implementation Guidelines

### 1. Consistency
- Use the same amber shades across similar components
- Maintain consistent spacing and sizing
- Apply hover states uniformly

### 2. Accessibility
- Ensure sufficient color contrast (4.5:1 for normal text)
- Provide alternative indicators beyond color
- Test with color blindness simulators

### 3. Responsive Design
- Scale accent elements appropriately on mobile
- Maintain touch targets (44px minimum)
- Consider reduced motion preferences

### 4. Performance
- Use CSS custom properties for dynamic theming
- Minimize color variations to reduce bundle size
- Leverage Tailwind's JIT compilation

## Usage Examples

### Hero Section
```tsx
<section className="relative bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-900/20">
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-amber-800 dark:text-amber-200 mb-4">
      Hero Title
    </h1>
    <p className="text-amber-700 dark:text-amber-300 mb-8">
      Hero description
    </p>
    <Button className="bg-amber-600 hover:bg-amber-700 text-white">
      Call to Action
    </Button>
  </div>
</section>
```

### Feature Cards
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card className="border-amber-200/60 dark:border-amber-700/40 hover:border-amber-300 transition-colors">
    <CardHeader>
      <Icon className="h-8 w-8 text-amber-600 mb-2" />
      <h3 className="text-lg font-semibold">Feature Title</h3>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Feature description</p>
    </CardContent>
  </Card>
</div>
```

## Migration Strategy

### Phase 1: Core Components
1. Update button variants
2. Apply to navigation elements
3. Update form components

### Phase 2: Layout Elements
1. Apply to headers and typography
2. Update card components
3. Style table elements

### Phase 3: Interactive Elements
1. Update hover states
2. Apply to progress indicators
3. Style timeline components

### Phase 4: Polish
1. Fine-tune contrast ratios
2. Optimize for accessibility
3. Performance optimization

This guide ensures consistent application of the amber accent system across the entire application while maintaining accessibility and performance standards.
