# InlineCaseStudy Component

## Overview

The `InlineCaseStudy` component provides an accessible, expandable accordion interface for displaying case study content when there's no dedicated MDX page. It's designed to showcase project information in a structured, interactive format with proper ARIA attributes and keyboard navigation.

## Features

- ✅ **Accessibility First**: Full ARIA support with proper roles, states, and properties
- ✅ **Keyboard Navigation**: Complete keyboard support with arrow keys, Home/End, Enter/Space
- ✅ **Screen Reader Support**: Proper announcements and state changes
- ✅ **Smooth Animations**: Framer Motion powered transitions
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Customizable**: Flexible content structure and styling
- ✅ **Focus Management**: Proper focus handling and visual indicators

## Usage

### Basic Usage

```tsx
import { InlineCaseStudy, createInlineCaseStudy } from '../components/projects/InlineCaseStudy';

const caseStudyData = createInlineCaseStudy(
  'My Project',
  'A brief description of the project',
  [
    {
      id: 'problem',
      title: 'Problem Statement',
      content: <div>Problem description...</div>
    },
    {
      id: 'solution', 
      title: 'Solution',
      content: <div>Solution details...</div>
    }
  ]
);

function MyComponent() {
  return (
    <InlineCaseStudy 
      data={caseStudyData}
      defaultOpenSection="problem"
    />
  );
}
```

### Advanced Usage

```tsx
import { InlineCaseStudy, CaseStudySection } from '../components/projects/InlineCaseStudy';
import { Target, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';

const customSections: CaseStudySection[] = [
  {
    id: 'problem',
    title: 'Problem Statement',
    description: 'The challenge that needed to be solved',
    icon: <Target className="h-4 w-4" />,
    content: (
      <div>
        <p>Detailed problem description...</p>
        <ul>
          <li>Challenge 1</li>
          <li>Challenge 2</li>
        </ul>
      </div>
    )
  },
  {
    id: 'solution',
    title: 'Solution Design', 
    description: 'The approach and architecture chosen',
    icon: <Lightbulb className="h-4 w-4" />,
    content: (
      <div>
        <p>Solution details...</p>
        <div className="grid grid-cols-2 gap-4">
          <div>Frontend: React, TypeScript</div>
          <div>Backend: Node.js, PostgreSQL</div>
        </div>
      </div>
    )
  }
];

const caseStudyData = {
  title: 'Advanced Project',
  description: 'A comprehensive project showcase',
  sections: customSections
};

function AdvancedComponent() {
  return (
    <InlineCaseStudy 
      data={caseStudyData}
      className="border-2 border-blue-200"
      defaultOpenSection="problem"
    />
  );
}
```

## API Reference

### InlineCaseStudy Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `InlineCaseStudyData` | - | **Required.** The case study data object |
| `className` | `string` | - | Optional CSS classes for custom styling |
| `defaultOpenSection` | `string` | - | ID of section to open by default |

### InlineCaseStudyData Interface

```tsx
interface InlineCaseStudyData {
  title: string;                    // Main case study title
  description?: string;             // Optional description
  sections: CaseStudySection[];     // Array of accordion sections
}
```

### CaseStudySection Interface

```tsx
interface CaseStudySection {
  id: string;                       // Unique identifier
  title: string;                    // Section title
  content: React.ReactNode;         // Section content (JSX)
  icon?: React.ReactNode;           // Optional icon
  description?: string;             // Optional description
}
```

## Accessibility Features

### ARIA Attributes

The component implements comprehensive ARIA support:

- `role="region"` on the main container
- `aria-expanded` on accordion triggers
- `aria-controls` linking triggers to content
- `aria-labelledby` and `aria-describedby` for relationships
- `role="button"` on interactive elements

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Navigate between sections |
| `Enter` / `Space` | Toggle current section |
| `Arrow Down` | Focus next section |
| `Arrow Up` | Focus previous section |
| `Home` | Focus first section |
| `End` | Focus last section |

### Screen Reader Support

- State changes are announced (expanded/collapsed)
- Section titles and descriptions are properly labeled
- Content relationships are clearly defined
- Focus management ensures logical reading order

## Styling

### Default Classes

The component uses Tailwind CSS with the stone color palette:

- **Container**: `border-stone-200 dark:border-stone-700`
- **Triggers**: `hover:bg-stone-50 dark:hover:bg-stone-800/50`
- **Content**: `bg-stone-50/50 dark:bg-stone-800/30`
- **Focus**: `focus-visible:ring-2 focus-visible:ring-stone-500`

### Custom Styling

```tsx
<InlineCaseStudy 
  data={data}
  className="border-2 border-blue-200 dark:border-blue-800"
/>
```

## Helper Functions

### createInlineCaseStudy

Creates a case study with default sections:

```tsx
const data = createInlineCaseStudy(
  'Project Title',
  'Optional description',
  [
    // Custom sections (optional)
    {
      id: 'custom',
      title: 'Custom Section',
      content: <div>Custom content</div>
    }
  ]
);
```

### createDefaultCaseStudySections

Returns the standard case study sections:

- **Problem Statement** - The challenge that needed to be solved
- **Solution Design** - The approach and architecture chosen  
- **Challenges & Implementation** - Technical implementation and obstacles
- **Results & Metrics** - Outcomes and measurable success

## Best Practices

### Content Structure

1. **Keep sections focused**: Each section should have a clear purpose
2. **Use descriptive titles**: Make section titles self-explanatory
3. **Provide context**: Include descriptions for better understanding
4. **Use semantic HTML**: Structure content with proper headings and lists

### Accessibility

1. **Test with screen readers**: Verify announcements work correctly
2. **Keyboard testing**: Ensure all functionality is keyboard accessible
3. **Color contrast**: Verify text meets WCAG guidelines
4. **Focus indicators**: Ensure focus is clearly visible

### Performance

1. **Lazy loading**: Consider lazy loading for heavy content
2. **Image optimization**: Optimize images within content
3. **Bundle size**: Be mindful of content size in sections

## Examples

### Simple Project Showcase

```tsx
const simpleProject = createInlineCaseStudy(
  'E-commerce Platform',
  'A modern e-commerce solution built with Next.js',
  [
    {
      id: 'problem',
      title: 'Problem',
      content: <p>Need for a scalable e-commerce platform...</p>
    },
    {
      id: 'solution',
      title: 'Solution', 
      content: <p>Built with Next.js, Stripe, and PostgreSQL...</p>
    }
  ]
);
```

### Technical Case Study

```tsx
const technicalCaseStudy = {
  title: 'Microservices Architecture Migration',
  description: 'Migrating from monolithic to microservices architecture',
  sections: [
    {
      id: 'challenge',
      title: 'Technical Challenge',
      icon: <AlertTriangle className="h-4 w-4" />,
      content: (
        <div>
          <h4>Legacy System Issues</h4>
          <ul>
            <li>Monolithic architecture</li>
            <li>Scalability limitations</li>
            <li>Deployment complexity</li>
          </ul>
        </div>
      )
    },
    {
      id: 'architecture',
      title: 'New Architecture',
      icon: <Lightbulb className="h-4 w-4" />,
      content: (
        <div>
          <h4>Microservices Design</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>User Service</div>
            <div>Order Service</div>
            <div>Payment Service</div>
            <div>Notification Service</div>
          </div>
        </div>
      )
    }
  ]
};
```

## Testing

### Manual Testing Checklist

- [ ] All sections can be toggled with mouse clicks
- [ ] Keyboard navigation works in all directions
- [ ] Screen reader announces state changes
- [ ] Focus indicators are visible
- [ ] Content is properly structured
- [ ] Animations are smooth and performant
- [ ] Responsive design works on all screen sizes

### Automated Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { InlineCaseStudy } from '../InlineCaseStudy';

test('toggles section on click', () => {
  const data = createInlineCaseStudy('Test', 'Test description');
  render(<InlineCaseStudy data={data} />);
  
  const trigger = screen.getByRole('button', { name: /problem statement/i });
  fireEvent.click(trigger);
  
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
});
```

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Dependencies

- React 18+
- Framer Motion 10+
- Lucide React (for icons)
- Tailwind CSS (for styling)
- Radix UI Accordion (for accessibility primitives)
