import type { Meta, StoryObj } from '@storybook/react';
import FeatureGrid, { Feature } from './FeatureGrid';
import { Code, Database, Zap, Shield, Globe, Smartphone } from 'lucide-react';

/**
 * FeatureGrid component for displaying features in a responsive grid layout.
 * Includes animations, icons, and customizable columns.
 */
const meta = {
  title: 'Projects/FeatureGrid',
  component: FeatureGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A responsive feature grid with smooth animations and hover effects. Perfect for showcasing product features or capabilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    maxColumns: {
      control: 'select',
      options: [2, 3, 4],
      description: 'Maximum number of columns in the grid',
    },
    showIcons: {
      control: 'boolean',
      description: 'Whether to display feature icons',
    },
  },
} satisfies Meta<typeof FeatureGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock features
const mockFeatures: Feature[] = [
  {
    id: '1',
    title: 'Modern Tech Stack',
    description: 'Built with Next.js 15, React 18, and TypeScript for type-safe, performant applications.',
    icon: <Code className="h-6 w-6" />,
  },
  {
    id: '2',
    title: 'Database Integration',
    description: 'Seamless integration with PostgreSQL using Prisma ORM for efficient data management.',
    icon: <Database className="h-6 w-6" />,
  },
  {
    id: '3',
    title: 'Lightning Fast',
    description: 'Optimized performance with code splitting, lazy loading, and edge caching.',
    icon: <Zap className="h-6 w-6" />,
  },
  {
    id: '4',
    title: 'Secure by Default',
    description: 'Built-in security features including CSRF protection, authentication, and input validation.',
    icon: <Shield className="h-6 w-6" />,
  },
  {
    id: '5',
    title: 'Global Deployment',
    description: 'Deploy to edge networks for optimal performance worldwide with automatic scaling.',
    icon: <Globe className="h-6 w-6" />,
  },
  {
    id: '6',
    title: 'Mobile Responsive',
    description: 'Fully responsive design that works beautifully across all devices and screen sizes.',
    icon: <Smartphone className="h-6 w-6" />,
  },
];

// Default feature grid
export const Default: Story = {
  args: {
    features: mockFeatures,
    title: 'Key Features',
    description: 'Everything you need to build modern web applications',
    maxColumns: 3,
    showIcons: true,
  },
};

// Without icons
export const WithoutIcons: Story = {
  args: {
    features: mockFeatures,
    title: 'Core Capabilities',
    description: 'Our platform provides comprehensive solutions for your needs',
    showIcons: false,
    maxColumns: 3,
  },
};

// Different column layouts
export const TwoColumns: Story = {
  args: {
    features: mockFeatures.slice(0, 4),
    title: 'Main Features',
    maxColumns: 2,
    showIcons: true,
  },
};

export const FourColumns: Story = {
  args: {
    features: mockFeatures,
    title: 'Complete Feature Set',
    maxColumns: 4,
    showIcons: true,
  },
};

// With click handler
export const Clickable: Story = {
  args: {
    features: mockFeatures,
    title: 'Interactive Features',
    description: 'Click any feature to learn more',
    showIcons: true,
    onFeatureClick: (feature) => {
      alert(`You clicked: ${feature.title}`);
    },
  },
};

// With links
export const WithLinks: Story = {
  args: {
    features: mockFeatures.map(f => ({
      ...f,
      link: 'https://example.com',
    })),
    title: 'Explore Features',
    description: 'Each feature includes a detailed guide',
    showIcons: true,
  },
};

// Minimal (few features)
export const ThreeFeatures: Story = {
  args: {
    features: mockFeatures.slice(0, 3),
    title: 'Top Features',
    description: 'Our most popular capabilities',
    showIcons: true,
    maxColumns: 3,
  },
};

// Empty state
export const Empty: Story = {
  args: {
    features: [],
    title: 'No Features Yet',
    description: 'Features will appear here',
  },
};

// Custom styling
export const CustomStyle: Story = {
  args: {
    features: mockFeatures,
    title: 'Styled Features',
    description: 'Custom background and spacing',
    className: 'bg-stone-50 dark:bg-stone-900 py-24',
    showIcons: true,
  },
};

// Without title or description
export const NoHeader: Story = {
  args: {
    features: mockFeatures,
    title: undefined,
    description: undefined,
    showIcons: true,
  },
};


