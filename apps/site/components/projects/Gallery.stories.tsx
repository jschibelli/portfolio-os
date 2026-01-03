import type { Meta, StoryObj } from '@storybook/react';
import { Gallery } from './Gallery';

/**
 * Gallery component for displaying images in a grid with lightbox functionality.
 * Features keyboard navigation, accessibility support, and responsive design.
 */
const meta = {
  title: 'Projects/Gallery',
  component: Gallery,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A responsive image gallery with lightbox functionality. Supports keyboard navigation (Arrow keys, Escape), captions, and various grid layouts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'select',
      options: [1, 2, 3, 4],
      description: 'Number of columns in the gallery grid',
    },
  },
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock images for stories
const mockImages = [
  {
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=600&fit=crop',
    alt: 'Person coding on laptop',
    caption: 'Modern development workspace with dual monitors',
  },
  {
    src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=600&fit=crop',
    alt: 'Code on screen',
    caption: 'Clean code implementation',
  },
  {
    src: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=600&fit=crop',
    alt: 'Team collaboration',
    caption: 'Collaborative development environment',
  },
  {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=600&fit=crop',
    alt: 'Planning session',
    caption: 'Sprint planning and architecture design',
  },
  {
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=600&fit=crop',
    alt: 'Mobile development',
    caption: 'Cross-platform mobile development',
  },
  {
    src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=600&fit=crop',
    alt: 'Laptop workspace',
    caption: 'Minimalist development setup',
  },
];

// Default gallery with 3 columns
export const Default: Story = {
  args: {
    images: mockImages,
    columns: 3,
  },
};

// Different column layouts
export const SingleColumn: Story = {
  args: {
    images: mockImages.slice(0, 3),
    columns: 1,
  },
};

export const TwoColumns: Story = {
  args: {
    images: mockImages.slice(0, 4),
    columns: 2,
  },
};

export const FourColumns: Story = {
  args: {
    images: mockImages,
    columns: 4,
  },
};

// Few images
export const ThreeImages: Story = {
  args: {
    images: mockImages.slice(0, 3),
    columns: 3,
  },
};

// Without captions
export const WithoutCaptions: Story = {
  args: {
    images: mockImages.map(img => ({
      src: img.src,
      alt: img.alt,
    })),
    columns: 3,
  },
};

// Empty state
export const Empty: Story = {
  args: {
    images: [],
    columns: 3,
  },
};

// Single image
export const SingleImage: Story = {
  args: {
    images: [mockImages[0]],
    columns: 1,
  },
};

// Large gallery
export const LargeGallery: Story = {
  args: {
    images: [
      ...mockImages,
      ...mockImages.map((img, i) => ({
        ...img,
        alt: `${img.alt} (${i + 1})`,
      })),
    ],
    columns: 4,
  },
};



