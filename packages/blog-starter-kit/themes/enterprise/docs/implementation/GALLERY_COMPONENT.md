# Gallery Component with Lightbox Dialog

## Overview

The Gallery component provides a responsive image grid with an accessible lightbox dialog for viewing images in full size. It's designed to meet WCAG 2.1 AA accessibility standards and provides keyboard navigation support.

## Features

### ✅ Implemented Features

- **Responsive Grid Layout**: Configurable columns (1-4) that adapt to screen size
- **Lightbox Dialog**: Full-screen image viewing with proper ARIA attributes
- **Keyboard Navigation**: 
  - `ESC` to close lightbox
  - `Arrow Left/Right` to navigate between images
  - `Enter/Space` to open lightbox from grid
- **Accessibility Features**:
  - Proper ARIA labels and roles
  - Focus management and trap
  - Screen reader support
  - All images require alt text
- **Image Captions**: Optional captions displayed in both grid and lightbox
- **Next.js Image Optimization**: Uses Next.js Image component for performance
- **Stone Theme Integration**: Follows the project's design system

## Usage

### Basic Usage

```tsx
import { Gallery } from '@/components/projects/Gallery';

const images = [
  {
    src: '/path/to/image1.jpg',
    alt: 'Description of image 1',
    caption: 'Optional caption for image 1'
  },
  {
    src: '/path/to/image2.jpg',
    alt: 'Description of image 2',
    caption: 'Optional caption for image 2'
  }
];

<Gallery images={images} />
```

### Advanced Usage

```tsx
<Gallery 
  images={images}
  columns={4}
  className="my-custom-class"
/>
```

### Legacy Format (Case Studies)

The component also supports the legacy format used in case studies:

```tsx
import { LegacyGallery } from '@/components/projects/Gallery';

<LegacyGallery 
  headers={['url', 'alt', 'caption']}
  rows={[
    ['/image1.jpg', 'Image 1', 'Caption 1'],
    ['/image2.jpg', 'Image 2', 'Caption 2']
  ]}
/>
```

## Props

### Gallery Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `GalleryImage[]` | - | Array of image objects |
| `columns` | `1 \| 2 \| 3 \| 4` | `3` | Number of columns in grid |
| `className` | `string` | - | Additional CSS classes |

### GalleryImage Interface

```tsx
interface GalleryImage {
  src: string;        // Image URL
  alt: string;        // Alt text (required for accessibility)
  caption?: string;   // Optional caption
}
```

## Accessibility Features

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: All functionality accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Focus trap in lightbox dialog
- **Alt Text**: All images require descriptive alt text
- **Color Contrast**: Follows stone theme contrast ratios

### Keyboard Shortcuts

- `Enter` or `Space`: Open lightbox from grid item
- `ESC`: Close lightbox
- `Arrow Left`: Previous image
- `Arrow Right`: Next image

### ARIA Attributes

- `role="dialog"` on lightbox
- `aria-modal="true"` on lightbox
- `aria-label` on all interactive elements
- `aria-label` on gallery items for screen readers

## Testing

The component includes comprehensive accessibility tests:

```bash
npm run test:accessibility -- tests/gallery-accessibility.spec.ts
```

Tests cover:
- Keyboard navigation
- Screen reader compatibility
- ARIA attribute validation
- Focus management
- Image caption display

## Integration

### Case Studies

The Gallery component is automatically integrated into case studies through the `case-study-blocks.tsx` file. Case studies can use the gallery block:

```markdown
```gallery
url,alt,caption
/image1.jpg,Description 1,Caption 1
/image2.jpg,Description 2,Caption 2
```
```

### Custom Implementation

For custom implementations, import the component directly:

```tsx
import { Gallery } from '@/components/projects/Gallery';
```

## Performance

- Uses Next.js Image component for optimization
- Lazy loading for grid images
- Priority loading for lightbox images
- Responsive image sizing

## Browser Support

- Modern browsers with ES6+ support
- Mobile and tablet responsive
- Touch gesture support on mobile devices

## Future Enhancements

Potential future improvements:
- Touch/swipe gestures for mobile
- Image zoom functionality
- Fullscreen mode
- Image download functionality
- Social sharing integration
