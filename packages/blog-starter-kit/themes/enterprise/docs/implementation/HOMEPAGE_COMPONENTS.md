# Homepage Components

This document describes the new homepage components created for John Schibelli's portfolio website.

## Components Overview

### 1. Hero Section (`components/hero.tsx`)

- **Purpose**: Main landing section with name, title, and CTAs
- **Features**:
  - Stone palette background image with radial gradient overlay
  - Framer Motion animations (fade-in and slide-up)
  - Responsive design with mobile-first approach
  - Two CTA buttons: "View My Work" and "Read the Blog"
  - Scroll indicator animation

### 2. Intro Section (`components/intro.tsx`)

- **Purpose**: Personal introduction with avatar/monogram
- **Features**:
  - JS monogram avatar
  - 2-3 sentence introduction
  - Light divider after section
  - Responsive layout (stacked on mobile)

### 3. Featured Projects (`components/featured-projects.tsx`)

- **Purpose**: Showcase 2-3 featured projects
- **Features**:
  - Uses existing portfolio data from `data/portfolio.json`
  - Grid layout with project cards
  - "View All Projects" CTA button
  - Responsive design

### 4. Project Card (`components/project-card.tsx`)

- **Purpose**: Individual project display card
- **Features**:
  - Image thumbnail with hover effects
  - Project title and description
  - Technology tags
  - "View Case Study" button
  - Hover animations (scale + shadow)

### 5. Skills Ticker (`components/skills-ticker.tsx`)

- **Purpose**: Infinite horizontal scroll of skills and tools
- **Features**:
  - Auto-scrolling animation (30s duration)
  - Pauses on hover/focus
  - Skills organized by categories
  - Smooth gradient edges
  - Uses data from `data/skills.ts`

### 6. CTA Banner (`components/cta-banner.tsx`)

- **Purpose**: Freelance/consulting availability call-to-action
- **Features**:
  - Stone gradient background with pattern overlay
  - Contact button with icon
  - Response time and experience stats
  - Framer Motion animations

### 7. Latest Posts (`components/latest-posts.tsx`)

- **Purpose**: Teaser for recent blog posts
- **Features**:
  - Grid of post cards
  - "Read the Blog" CTA
  - Uses data from `data/posts.ts`

### 8. Post Card (`components/post-card.tsx`)

- **Purpose**: Individual blog post display
- **Features**:
  - Post title, date, and read time
  - Excerpt with line clamping
  - "Read More" link
  - Hover animations

## Data Files

### `data/posts.ts`

- Sample blog post data with title, excerpt, date, slug, and read time
- Used by Latest Posts section

### `data/skills.ts`

- Comprehensive list of skills and tools organized by categories
- Includes icons and category grouping
- Used by Skills Ticker component

### `data/portfolio.json` (existing)

- Updated with placeholder images from Unsplash
- Used by Featured Projects section

## Styling

- **Color Palette**: Stone-based design system
  - `stone-900` with `stone-50`/`stone-100` text accents
  - `stone-800` for dividers
  - Dark mode support throughout

- **Typography**:
  - Responsive font sizes
  - Proper contrast ratios for accessibility
  - Line clamping for text overflow

- **Animations**:
  - Framer Motion for scroll-triggered animations
  - CSS animations for skills ticker
  - Hover effects on interactive elements

## Accessibility Features

- Semantic HTML structure
- Proper alt text for images
- Visible focus states
- Reduced motion support consideration
- ARIA labels where needed
- Keyboard navigation support

## Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Flexible typography scaling
- Touch-friendly interactive elements
- Optimized spacing for different screen sizes

## Usage

To use these components, import them into your page:

```tsx
import Hero from '../components/hero';
import Intro from '../components/intro';
import FeaturedProjects from '../components/featured-projects';
import SkillsTicker from '../components/skills-ticker';
import CTABanner from '../components/cta-banner';
import LatestPosts from '../components/latest-posts';

// Use in your page component
<main>
	<Hero />
	<Intro />
	<FeaturedProjects />
	<SkillsTicker />
	<CTABanner />
	<LatestPosts />
</main>;
```

## Dependencies

- Framer Motion (already installed)
- Lucide React icons
- shadcn/ui components
- Tailwind CSS with custom utilities
- Next.js Image component

## Testing

A test page is available at `/test-homepage` to verify all components work correctly.
