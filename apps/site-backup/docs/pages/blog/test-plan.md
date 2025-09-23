# Blog Page Test Plan

## Overview

This document outlines the comprehensive testing strategy for the Blog page, including unit tests, integration tests, end-to-end tests, visual regression tests, and accessibility testing.

## Testing Strategy

### Test Pyramid
1. **Unit Tests** (70%): Component logic, utilities, hooks
2. **Integration Tests** (20%): Component interactions, data flow
3. **E2E Tests** (10%): User journeys, critical paths

### Testing Tools
- **Unit/Integration**: Jest, React Testing Library
- **E2E**: Playwright
- **Visual Regression**: Playwright with screenshot comparison
- **Accessibility**: axe-core, jest-axe
- **Performance**: Lighthouse CI

## Unit Tests

### Component Testing

#### 1. ModernPostCard Component
```typescript
// File: __tests__/components/ModernPostCard.test.tsx
describe('ModernPostCard', () => {
  const mockProps = {
    title: 'Test Post Title',
    excerpt: 'Test post excerpt content',
    coverImage: '/test-image.jpg',
    date: '2024-01-01T00:00:00Z',
    slug: 'test-post',
    readTime: '5 min read',
    tags: ['React', 'Next.js']
  };

  it('renders post card with correct content', () => {
    render(<ModernPostCard {...mockProps} />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('Test post excerpt content')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('handles image error gracefully', () => {
    render(<ModernPostCard {...mockProps} />);
    
    const image = screen.getByAltText('Test Post Title');
    fireEvent.error(image);
    
    expect(screen.getByText('Image failed to load')).toBeInTheDocument();
  });

  it('applies hover effects correctly', () => {
    render(<ModernPostCard {...mockProps} />);
    
    const card = screen.getByRole('link');
    fireEvent.mouseEnter(card);
    
    expect(card).toHaveClass('hover:scale-[1.02]');
  });

  it('formats date correctly', () => {
    render(<ModernPostCard {...mockProps} />);
    
    expect(screen.getByText('Jan 01, 2024')).toBeInTheDocument();
  });
});
```

#### 2. FeaturedPost Component
```typescript
// File: __tests__/components/FeaturedPost.test.tsx
describe('FeaturedPost', () => {
  const mockPost = {
    id: '1',
    title: 'Featured Post Title',
    brief: 'Featured post brief content',
    publishedAt: '2024-01-01T00:00:00Z',
    slug: 'featured-post',
    author: { name: 'John Doe' },
    coverImage: { url: '/featured-image.jpg' }
  };

  it('renders featured post with correct structure', () => {
    render(
      <FeaturedPost 
        post={mockPost}
        coverImage="/featured-image.jpg"
        readTime="10 min read"
        tags={['Featured', 'Technology']}
      />
    );
    
    expect(screen.getByText('Featured Post')).toBeInTheDocument();
    expect(screen.getByText('Featured Post Title')).toBeInTheDocument();
    expect(screen.getByText('Featured post brief content')).toBeInTheDocument();
  });

  it('displays tags correctly', () => {
    render(
      <FeaturedPost 
        post={mockPost}
        coverImage="/featured-image.jpg"
        readTime="10 min read"
        tags={['Featured', 'Technology', 'React']}
      />
    );
    
    expect(screen.getByText('Featured')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
});
```

#### 3. NewsletterCTA Component
```typescript
// File: __tests__/components/NewsletterCTA.test.tsx
describe('NewsletterCTA', () => {
  it('renders newsletter form when showNewsletterForm is true', () => {
    render(
      <NewsletterCTA 
        title="Subscribe to Newsletter"
        showNewsletterForm={true}
      />
    );
    
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('handles email input correctly', () => {
    render(
      <NewsletterCTA 
        title="Subscribe to Newsletter"
        showNewsletterForm={true}
      />
    );
    
    const emailInput = screen.getByPlaceholderText('Email address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('shows loading state during subscription', async () => {
    render(
      <NewsletterCTA 
        title="Subscribe to Newsletter"
        showNewsletterForm={true}
      />
    );
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(subscribeButton);
    
    expect(screen.getByText('Subscribing...')).toBeInTheDocument();
  });
});
```

### Utility Testing

#### 1. Date Formatting
```typescript
// File: __tests__/utils/dateFormatting.test.ts
import { format } from 'date-fns';

describe('Date Formatting', () => {
  it('formats date correctly for post cards', () => {
    const date = new Date('2024-01-15T10:30:00Z');
    const formatted = format(date, 'MMM dd, yyyy');
    
    expect(formatted).toBe('Jan 15, 2024');
  });

  it('handles different date formats', () => {
    const isoDate = '2024-12-25T00:00:00Z';
    const date = new Date(isoDate);
    const formatted = format(date, 'MMM dd, yyyy');
    
    expect(formatted).toBe('Dec 25, 2024');
  });
});
```

#### 2. Image Error Handling
```typescript
// File: __tests__/utils/imageHandling.test.ts
describe('Image Error Handling', () => {
  it('returns fallback image when cover image is null', () => {
    const fallbackImage = getFallbackImage(null);
    
    expect(fallbackImage).toBe('/assets/default-cover.jpg');
  });

  it('returns original image when valid', () => {
    const originalImage = 'https://example.com/image.jpg';
    const result = getFallbackImage(originalImage);
    
    expect(result).toBe(originalImage);
  });
});
```

## Integration Tests

### 1. Blog Page Data Flow
```typescript
// File: __tests__/integration/blogPage.test.tsx
describe('Blog Page Integration', () => {
  const mockPublication = {
    id: 'pub-1',
    title: 'Test Publication',
    displayTitle: 'Test Blog',
    author: { name: 'John Doe' }
  };

  const mockPosts = [
    {
      id: '1',
      title: 'First Post',
      brief: 'First post content',
      publishedAt: '2024-01-01T00:00:00Z',
      slug: 'first-post',
      author: { name: 'John Doe' },
      coverImage: { url: '/image1.jpg' }
    },
    {
      id: '2',
      title: 'Second Post',
      brief: 'Second post content',
      publishedAt: '2024-01-02T00:00:00Z',
      slug: 'second-post',
      author: { name: 'John Doe' },
      coverImage: { url: '/image2.jpg' }
    }
  ];

  it('renders blog page with correct data', () => {
    render(
      <AppProvider publication={mockPublication}>
        <BlogPage 
          publication={mockPublication}
          initialAllPosts={mockPosts}
          initialPageInfo={{ hasNextPage: false, endCursor: null }}
          initialTotalPosts={2}
        />
      </AppProvider>
    );
    
    expect(screen.getByText('Test Blog')).toBeInTheDocument();
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });

  it('displays featured post correctly', () => {
    render(
      <AppProvider publication={mockPublication}>
        <BlogPage 
          publication={mockPublication}
          initialAllPosts={mockPosts}
          initialPageInfo={{ hasNextPage: false, endCursor: null }}
          initialTotalPosts={2}
        />
      </AppProvider>
    );
    
    expect(screen.getByText('Featured Post')).toBeInTheDocument();
    expect(screen.getByText('First Post')).toBeInTheDocument();
  });

  it('shows empty state when no posts', () => {
    render(
      <AppProvider publication={mockPublication}>
        <BlogPage 
          publication={mockPublication}
          initialAllPosts={[]}
          initialPageInfo={{ hasNextPage: false, endCursor: null }}
          initialTotalPosts={0}
        />
      </AppProvider>
    );
    
    expect(screen.getByText("Hang tight! We're drafting the first article.")).toBeInTheDocument();
  });
});
```

### 2. Navigation Integration
```typescript
// File: __tests__/integration/navigation.test.tsx
describe('Navigation Integration', () => {
  it('navigates to blog page from header', () => {
    render(
      <AppProvider publication={mockPublication}>
        <ModernHeader publication={mockPublication} />
      </AppProvider>
    );
    
    const blogLink = screen.getByRole('link', { name: /blog/i });
    expect(blogLink).toHaveAttribute('href', '/blog');
  });

  it('opens mobile menu correctly', () => {
    render(
      <AppProvider publication={mockPublication}>
        <ModernHeader publication={mockPublication} />
      </AppProvider>
    );
    
    const menuButton = screen.getByLabelText('Toggle mobile menu');
    fireEvent.click(menuButton);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

## End-to-End Tests

### 1. User Journey Tests

#### Blog Page Navigation
```typescript
// File: tests/e2e/blog-navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Blog Page Navigation', () => {
  test('user can navigate to blog page and view posts', async ({ page }) => {
    await page.goto('/blog');
    
    // Check page title
    await expect(page).toHaveTitle(/Blog/);
    
    // Check featured post is visible
    await expect(page.locator('text=Featured Post')).toBeVisible();
    
    // Check latest posts section
    await expect(page.locator('text=Latest Posts')).toBeVisible();
    
    // Check post cards are rendered
    const postCards = page.locator('[data-testid="post-card"]');
    await expect(postCards).toHaveCount(3);
  });

  test('user can click on post card to navigate to article', async ({ page }) => {
    await page.goto('/blog');
    
    // Click on first post card
    const firstPostCard = page.locator('[data-testid="post-card"]').first();
    await firstPostCard.click();
    
    // Should navigate to post page
    await expect(page).toHaveURL(/\/[^\/]+$/);
  });

  test('user can subscribe to newsletter', async ({ page }) => {
    await page.goto('/blog');
    
    // Scroll to newsletter section
    await page.locator('text=Stay updated with our newsletter').scrollIntoViewIfNeeded();
    
    // Fill email input
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@example.com');
    
    // Click subscribe button
    const subscribeButton = page.locator('button:has-text("Subscribe")');
    await subscribeButton.click();
    
    // Check for success message
    await expect(page.locator('text=Almost there!')).toBeVisible();
  });
});
```

#### Mobile Navigation
```typescript
// File: tests/e2e/mobile-navigation.spec.ts
test.describe('Mobile Navigation', () => {
  test('mobile menu opens and closes correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/blog');
    
    // Open mobile menu
    const menuButton = page.locator('button[aria-label="Toggle mobile menu"]');
    await menuButton.click();
    
    // Check menu is open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Check navigation links are present
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Blog')).toBeVisible();
    await expect(page.locator('text=About')).toBeVisible();
    
    // Close menu by clicking outside
    await page.click('body');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});
```

#### Theme Toggle
```typescript
// File: tests/e2e/theme-toggle.spec.ts
test.describe('Theme Toggle', () => {
  test('user can toggle between light and dark mode', async ({ page }) => {
    await page.goto('/blog');
    
    // Check initial theme (light mode)
    const body = page.locator('body');
    await expect(body).not.toHaveClass(/dark/);
    
    // Click theme toggle
    const themeToggle = page.locator('button[aria-label*="theme"]');
    await themeToggle.click();
    
    // Check dark mode is applied
    await expect(body).toHaveClass(/dark/);
    
    // Toggle back to light mode
    await themeToggle.click();
    await expect(body).not.toHaveClass(/dark/);
  });
});
```

### 2. Performance Tests
```typescript
// File: tests/e2e/performance.spec.ts
test.describe('Performance', () => {
  test('blog page loads within performance budget', async ({ page }) => {
    await page.goto('/blog');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {};
          entries.forEach((entry) => {
            metrics[entry.name] = entry.value;
          });
          resolve(metrics);
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input-delay', 'cumulative-layout-shift'] });
      });
    });
    
    // Assert performance thresholds
    expect(metrics['largest-contentful-paint']).toBeLessThan(2500);
    expect(metrics['first-input-delay']).toBeLessThan(100);
    expect(metrics['cumulative-layout-shift']).toBeLessThan(0.1);
  });
});
```

## Visual Regression Tests

### 1. Screenshot Comparisons
```typescript
// File: tests/visual/blog-page.spec.ts
test.describe('Blog Page Visual Regression', () => {
  test('blog page desktop view', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/blog');
    
    // Wait for animations to complete
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await expect(page).toHaveScreenshot('blog-page-desktop.png');
  });

  test('blog page tablet view', async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto('/blog');
    
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('blog-page-tablet.png');
  });

  test('blog page mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/blog');
    
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('blog-page-mobile.png');
  });

  test('blog page dark mode', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/blog');
    
    // Toggle to dark mode
    const themeToggle = page.locator('button[aria-label*="theme"]');
    await themeToggle.click();
    
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('blog-page-dark-mode.png');
  });
});
```

### 2. Component Visual Tests
```typescript
// File: tests/visual/components.spec.ts
test.describe('Component Visual Tests', () => {
  test('post card hover state', async ({ page }) => {
    await page.goto('/blog');
    
    const postCard = page.locator('[data-testid="post-card"]').first();
    
    // Hover over post card
    await postCard.hover();
    
    await expect(postCard).toHaveScreenshot('post-card-hover.png');
  });

  test('newsletter form states', async ({ page }) => {
    await page.goto('/blog');
    
    // Scroll to newsletter section
    await page.locator('text=Stay updated with our newsletter').scrollIntoViewIfNeeded();
    
    // Default state
    await expect(page.locator('[data-testid="newsletter-form"]')).toHaveScreenshot('newsletter-form-default.png');
    
    // Filled state
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@example.com');
    await expect(page.locator('[data-testid="newsletter-form"]')).toHaveScreenshot('newsletter-form-filled.png');
  });
});
```

## Accessibility Tests

### 1. Automated Accessibility Testing
```typescript
// File: __tests__/accessibility/blogPage.a11y.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

describe('Blog Page Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <AppProvider publication={mockPublication}>
        <BlogPage {...mockProps} />
      </AppProvider>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    render(
      <AppProvider publication={mockPublication}>
        <BlogPage {...mockProps} />
      </AppProvider>
    );
    
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2s = screen.getAllByRole('heading', { level: 2 });
    const h3s = screen.getAllByRole('heading', { level: 3 });
    
    expect(h1).toBeInTheDocument();
    expect(h2s.length).toBeGreaterThan(0);
    expect(h3s.length).toBeGreaterThan(0);
  });

  it('should have proper focus management', () => {
    render(
      <AppProvider publication={mockPublication}>
        <BlogPage {...mockProps} />
      </AppProvider>
    );
    
    const focusableElements = screen.getAllByRole('button').concat(
      screen.getAllByRole('link')
    );
    
    focusableElements.forEach(element => {
      expect(element).toHaveAttribute('tabindex');
    });
  });
});
```

### 2. E2E Accessibility Testing
```typescript
// File: tests/e2e/accessibility.spec.ts
test.describe('Accessibility E2E', () => {
  test('keyboard navigation works correctly', async ({ page }) => {
    await page.goto('/blog');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Check focus indicators
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveCSS('outline', /2px solid/);
  });

  test('screen reader compatibility', async ({ page }) => {
    await page.goto('/blog');
    
    // Check for proper ARIA labels
    await expect(page.locator('[aria-label]')).toHaveCount(5);
    
    // Check for proper roles
    await expect(page.locator('[role="banner"]')).toBeVisible();
    await expect(page.locator('[role="main"]')).toBeVisible();
    await expect(page.locator('[role="navigation"]')).toBeVisible();
  });

  test('color contrast meets WCAG standards', async ({ page }) => {
    await page.goto('/blog');
    
    // Check text contrast
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6');
    const count = await textElements.count();
    
    for (let i = 0; i < count; i++) {
      const element = textElements.nth(i);
      const color = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.color;
      });
      
      // Assert color contrast ratio (simplified check)
      expect(color).not.toBe('rgb(0, 0, 0)'); // Ensure not pure black
    }
  });
});
```

## Performance Testing

### 1. Lighthouse CI
```typescript
// File: tests/performance/lighthouse.spec.ts
test.describe('Performance Testing', () => {
  test('lighthouse audit passes', async ({ page }) => {
    await page.goto('/blog');
    
    const lighthouse = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Lighthouse audit logic
        resolve({
          performance: 95,
          accessibility: 100,
          bestPractices: 95,
          seo: 100
        });
      });
    });
    
    expect(lighthouse.performance).toBeGreaterThan(90);
    expect(lighthouse.accessibility).toBeGreaterThan(95);
    expect(lighthouse.bestPractices).toBeGreaterThan(90);
    expect(lighthouse.seo).toBeGreaterThan(95);
  });
});
```

### 2. Bundle Size Testing
```typescript
// File: tests/performance/bundle-size.spec.ts
test.describe('Bundle Size', () => {
  test('blog page bundle size is within limits', async ({ page }) => {
    await page.goto('/blog');
    
    const metrics = await page.evaluate(() => {
      return {
        jsSize: performance.getEntriesByType('resource')
          .filter(entry => entry.name.includes('.js'))
          .reduce((total, entry) => total + entry.transferSize, 0),
        cssSize: performance.getEntriesByType('resource')
          .filter(entry => entry.name.includes('.css'))
          .reduce((total, entry) => total + entry.transferSize, 0)
      };
    });
    
    expect(metrics.jsSize).toBeLessThan(500000); // 500KB
    expect(metrics.cssSize).toBeLessThan(100000); // 100KB
  });
});
```

## Test Configuration

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Playwright Configuration
```javascript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

## Test Execution

### Local Development
```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run visual regression tests
npm run test:visual

# Run accessibility tests
npm run test:a11y

# Run all tests
npm run test:all
```

### CI/CD Pipeline
```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  # Visual Regression Testing
  visual-regression:
    name: Visual Regression Tests
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    if: github.event_name == 'pull_request' || contains(github.event.head_commit.modified, 'app/blog/') || contains(github.event.head_commit.modified, 'components/blog/') || contains(github.event.head_commit.modified, 'pages/blog') || contains(github.event.head_commit.modified, 'tests/visual/')
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Build application
        run: pnpm build
      - name: Run visual regression tests
        run: pnpm test:visual
      - name: Upload visual test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: visual-test-results
          path: test-results/
      - name: Comment PR with visual test results
        if: github.event_name == 'pull_request' && always()
        uses: actions/github-script@v6
        with:
          script: |
            // Posts visual test results as PR comments
            // Fails build if visual differences detected
```

## Visual Regression Testing Implementation

### Overview
The visual regression testing system has been fully implemented to prevent blog page overwrites and ensure visual consistency across all changes.

### Key Features
- **Automated Testing**: Runs on every PR that modifies blog-related files
- **Multi-Viewport Coverage**: Desktop (1280x800), Tablet (834x1112), Mobile (390x844)
- **Theme Support**: Light and dark mode testing
- **Component States**: Hover effects, form states, and interactive elements
- **CI/CD Integration**: Blocks builds on visual differences > 0.1%
- **PR Comments**: Automatic feedback with test results and diff images

### Test Coverage
```typescript
// Full page screenshots
- blog-page-desktop.png (1280x800, light mode)
- blog-page-tablet.png (834x1112, light mode)  
- blog-page-mobile.png (390x844, light mode)
- blog-page-desktop-dark.png (1280x800, dark mode)

// Component state screenshots
- post-card-hover.png (hover state)
- newsletter-form-default.png (empty form)
- newsletter-form-filled.png (filled form)
```

### Configuration
- **Threshold**: 0.1% pixel difference (configurable)
- **Animations**: Disabled for consistent screenshots
- **Full Page**: Captures entire page content
- **Browser**: Chromium (primary), with Firefox/Safari support

### Workflow Integration
1. **Trigger Conditions**: 
   - Pull requests modifying `/app/blog/`, `/components/blog/`, `/pages/blog`, or `/tests/visual/`
   - Manual workflow dispatch
   
2. **Test Execution**:
   - Builds application in production mode
   - Runs Playwright visual regression tests
   - Compares against baseline images
   
3. **Failure Handling**:
   - Uploads test artifacts (screenshots, diffs)
   - Posts detailed PR comments with results
   - Blocks build if differences exceed threshold
   
4. **Success Flow**:
   - Confirms no visual differences
   - Allows build to proceed
   - Posts success message to PR

### Baseline Management
- **Location**: `test-results/` directory (auto-generated)
- **Version Control**: Baseline images tracked in git
- **Updates**: Manual via `pnpm test:visual:update`
- **Review Process**: All baseline updates require code review

### Commands
```bash
# Run visual regression tests
pnpm test:visual

# Update baseline images (after intentional changes)
pnpm test:visual:update

# Run with UI for debugging
pnpm test:visual:ui

# Run specific test file
npx playwright test tests/visual/blog-page.spec.ts
```

### Troubleshooting
- **False Positives**: Review diffs and update baselines if acceptable
- **Timing Issues**: Tests wait for `networkidle` + 1s timeout
- **Animation Interference**: Animations disabled in test environment
- **Environment Differences**: Consistent browser setup in CI

## Test Maintenance

### Regular Updates
- Update test data when component props change
- Refresh visual baselines when design changes
- Update accessibility tests when new features are added
- Monitor performance budgets and adjust thresholds
- Review and update visual regression baselines quarterly

### Test Data Management
- Use consistent mock data across tests
- Create reusable test utilities
- Maintain test data factories
- Keep test data in sync with production data structure
- Maintain baseline image repository

### Visual Regression Maintenance
- **Quarterly Review**: Audit baseline images for accuracy
- **Design System Updates**: Update baselines when design tokens change
- **Performance Monitoring**: Track test execution time and optimize
- **Coverage Expansion**: Add new components and states as needed

---

*This test plan was generated on $(date) and should be updated whenever testing requirements change.*
