# QuickStats Component

A compact, accessible component for displaying project metadata as badges. This component renders a semantic list of badges describing project information such as technology stack, role, status, and year.

## Features

- ✅ **Semantic HTML**: Uses proper `<ul>` and `<li>` elements with ARIA roles
- ✅ **Accessibility**: Full keyboard navigation support with focus indicators
- ✅ **TypeScript**: Fully typed with comprehensive interfaces
- ✅ **Customizable**: Support for different badge variants and custom styling
- ✅ **Responsive**: Flexible layout that adapts to different screen sizes
- ✅ **Utility Functions**: Helper functions for creating ProjectMeta arrays

## Usage

### Basic Usage

```tsx
import { QuickStats, ProjectMeta } from '@/components/features/projects';

const projectMeta: ProjectMeta[] = [
  { label: 'Next.js', type: 'stack' },
  { label: 'TypeScript', type: 'stack' },
  { label: 'Frontend Developer', type: 'role' },
  { label: 'Active', type: 'status' },
  { label: '2024', type: 'year' }
];

function MyComponent() {
  return <QuickStats items={projectMeta} />;
}
```

### Using Utility Functions

```tsx
import { QuickStats, createProjectMeta, createMixedProjectMeta } from '@/components/features/projects';

// Create badges from a simple array
const stackTags = ['React', 'Next.js', 'TypeScript'];
const stackMeta = createProjectMeta(stackTags, 'stack');

// Create mixed badges
const mixedMeta = createMixedProjectMeta(
  ['React', 'TypeScript'], // stack
  ['Frontend Developer'],   // role
  ['Active'],              // status
  ['2024']                 // year
);

function MyComponent() {
  return <QuickStats items={mixedMeta} />;
}
```

### Custom Styling

```tsx
const customMeta: ProjectMeta[] = [
  { 
    label: 'React', 
    type: 'stack', 
    variant: 'default',
    className: 'bg-blue-100 text-blue-800'
  },
  { 
    label: 'Senior Developer', 
    type: 'role', 
    variant: 'secondary',
    className: 'bg-purple-100 text-purple-800'
  }
];

function MyComponent() {
  return (
    <QuickStats 
      items={customMeta} 
      className="bg-gray-50 p-4 rounded-lg"
      aria-label="Custom styled project badges"
    />
  );
}
```

## API Reference

### ProjectMeta Interface

```tsx
interface ProjectMeta {
  /** The label/text to display on the badge */
  label: string;
  /** The type/category of the badge */
  type: 'stack' | 'role' | 'status' | 'year' | 'category' | 'technology';
  /** Optional variant for styling */
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  /** Optional custom className for additional styling */
  className?: string;
}
```

### QuickStats Props

```tsx
interface QuickStatsProps {
  /** Array of ProjectMeta objects to render as badges */
  items: ProjectMeta[];
  /** Optional className for the container */
  className?: string;
  /** Optional aria-label for accessibility */
  'aria-label'?: string;
}
```

### Utility Functions

#### createProjectMeta

Creates an array of ProjectMeta objects from a simple string array.

```tsx
function createProjectMeta(
  tags: string[], 
  type: ProjectMeta['type'] = 'stack'
): ProjectMeta[]
```

#### createMixedProjectMeta

Creates a mixed array of ProjectMeta objects with different types.

```tsx
function createMixedProjectMeta(
  stack: string[] = [],
  role: string[] = [],
  status: string[] = [],
  year: string[] = []
): ProjectMeta[]
```

## Badge Types and Default Variants

| Type | Default Variant | Description |
|------|----------------|-------------|
| `stack` | `default` | Technology stack items |
| `technology` | `default` | Specific technologies |
| `role` | `secondary` | Job roles or positions |
| `status` | `outline` | Project status |
| `year` | `outline` | Year information |
| `category` | `secondary` | Project categories |

## Accessibility Features

- **Semantic HTML**: Uses proper list structure with `<ul>` and `<li>` elements
- **ARIA Labels**: Each badge has descriptive `aria-label` attributes
- **Keyboard Navigation**: All badges are focusable with `tabIndex={0}`
- **Focus Indicators**: Clear visual focus styles for keyboard users
- **Screen Reader Support**: Proper roles and labels for assistive technology

## Testing

The component includes comprehensive tests covering:

- Rendering and basic functionality
- Accessibility compliance (axe checks)
- Keyboard navigation
- Responsive behavior
- Edge cases (empty arrays, undefined values)

Run tests with:

```bash
npm run test:accessibility -- tests/quickstats-accessibility.spec.ts
```

## Examples

See `QuickStats.example.tsx` for comprehensive usage examples including:

- Basic usage patterns
- Utility function examples
- Custom styling approaches
- Integration with existing project data
- Responsive layouts

## Integration with Existing Data

The component works seamlessly with existing project data structures:

```tsx
// From portfolio.json or similar
const projectData = {
  id: 'tendrilo',
  title: 'Tendril Multi-Tenant Chatbot SaaS',
  tags: ['Next.js', 'TypeScript', 'AI/ML', 'Multi-tenant', 'SaaS'],
  role: 'Lead Developer',
  status: 'In Development',
  year: '2024'
};

// Convert to ProjectMeta
const projectMeta: ProjectMeta[] = [
  ...createProjectMeta(projectData.tags, 'stack'),
  { label: projectData.role, type: 'role' },
  { label: projectData.status, type: 'status' },
  { label: projectData.year, type: 'year' }
];
```

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Full keyboard navigation support
- Screen reader compatible
- Responsive design for all device sizes
