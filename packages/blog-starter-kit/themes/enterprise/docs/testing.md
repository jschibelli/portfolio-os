# Testing Guide

**Last Updated**: January 2025  
**Version**: 2.0.0

## Overview

This guide covers the testing strategy for the Mindware Blog platform, including unit tests, integration tests, end-to-end tests, and accessibility testing. Our testing approach ensures code quality, reliability, and user experience.

## Testing Strategy

### Testing Pyramid

```
    /\
   /  \     E2E Tests (Few)
  /____\    - Critical user journeys
 /      \   - Cross-browser testing
/________\  - Performance testing

   /\
  /  \      Integration Tests (Some)
 /____\     - API endpoints
/      \    - Database operations
/______\    - External service integration

  /\
 /  \       Unit Tests (Many)
/____\      - Individual functions
/    \      - Component logic
/____\      - Utility functions
```

### Test Types

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test interactions between different parts of the system
3. **End-to-End Tests**: Test complete user workflows
4. **Accessibility Tests**: Ensure WCAG compliance
5. **Performance Tests**: Validate performance requirements
6. **Visual Regression Tests**: Catch unintended UI changes

## Testing Tools

### Core Testing Framework

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing
- **@axe-core/playwright**: Accessibility testing
- **MSW**: API mocking

### Additional Tools

- **Testing Library**: User-centric testing utilities
- **Jest DOM**: Custom Jest matchers
- **Supertest**: API testing
- **Faker.js**: Test data generation

## Unit Testing

### Component Testing

#### Basic Component Test

```typescript
// components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant styles', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

#### Form Component Testing

```typescript
// components/forms/ContactForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

describe('ContactForm', () => {
  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    
    render(<ContactForm onSubmit={onSubmit} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello world');
    
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello world',
      });
    });
  });

  it('shows validation errors for invalid data', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={jest.fn()} />);
    
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });
});
```

### Utility Function Testing

```typescript
// lib/utils.test.ts
import { slugify, formatDate, truncateText } from './utils';

describe('Utility Functions', () => {
  describe('slugify', () => {
    it('converts text to URL-friendly slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('Getting Started with Next.js')).toBe('getting-started-with-next-js');
    });

    it('handles special characters', () => {
      expect(slugify('Test & Development')).toBe('test-development');
      expect(slugify('Price: $100')).toBe('price-100');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2025-01-09T10:00:00Z');
      expect(formatDate(date)).toBe('January 9, 2025');
    });
  });

  describe('truncateText', () => {
    it('truncates text to specified length', () => {
      const text = 'This is a very long text that should be truncated';
      expect(truncateText(text, 20)).toBe('This is a very long...');
    });

    it('returns original text if shorter than limit', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });
  });
});
```

### API Function Testing

```typescript
// lib/api/articles.test.ts
import { getArticles, createArticle, updateArticle } from './articles';
import { prisma } from '../prisma';

// Mock Prisma
jest.mock('../prisma', () => ({
  prisma: {
    article: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('Articles API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getArticles', () => {
    it('returns articles with pagination', async () => {
      const mockArticles = [
        { id: '1', title: 'Test Article', status: 'PUBLISHED' },
      ];
      
      (prisma.article.findMany as jest.Mock).mockResolvedValue(mockArticles);
      
      const result = await getArticles({ page: 1, limit: 10 });
      
      expect(result.articles).toEqual(mockArticles);
      expect(result.pagination.page).toBe(1);
      expect(prisma.article.findMany).toHaveBeenCalledWith({
        where: { status: 'PUBLISHED' },
        skip: 0,
        take: 10,
        orderBy: { publishedAt: 'desc' },
      });
    });
  });

  describe('createArticle', () => {
    it('creates article with valid data', async () => {
      const articleData = {
        title: 'New Article',
        content: 'Article content',
        authorId: 'author-1',
      };
      
      const mockArticle = { id: '1', ...articleData };
      (prisma.article.create as jest.Mock).mockResolvedValue(mockArticle);
      
      const result = await createArticle(articleData);
      
      expect(result).toEqual(mockArticle);
      expect(prisma.article.create).toHaveBeenCalledWith({
        data: {
          ...articleData,
          slug: expect.any(String),
          status: 'DRAFT',
        },
      });
    });
  });
});
```

## Integration Testing

### API Route Testing

```typescript
// app/api/articles/route.test.ts
import { createMocks } from 'node-mocks-http';
import { GET, POST } from './route';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma');

describe('/api/articles', () => {
  describe('GET', () => {
    it('returns articles list', async () => {
      const mockArticles = [
        { id: '1', title: 'Test Article', status: 'PUBLISHED' },
      ];
      
      (prisma.article.findMany as jest.Mock).mockResolvedValue(mockArticles);
      
      const { req } = createMocks({
        method: 'GET',
        query: { page: '1', limit: '10' },
      });
      
      const response = await GET(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockArticles);
    });
  });

  describe('POST', () => {
    it('creates new article', async () => {
      const articleData = {
        title: 'New Article',
        content: 'Article content',
      };
      
      const mockArticle = { id: '1', ...articleData };
      (prisma.article.create as jest.Mock).mockResolvedValue(mockArticle);
      
      const { req } = createMocks({
        method: 'POST',
        body: articleData,
      });
      
      const response = await POST(req);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockArticle);
    });

    it('returns validation error for invalid data', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: { title: '' }, // Invalid data
      });
      
      const response = await POST(req);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

### Database Integration Testing

```typescript
// tests/integration/database.test.ts
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

describe('Database Integration', () => {
  beforeAll(async () => {
    // Run migrations
    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean database
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();
  });

  it('creates and retrieves user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
      },
    });

    const retrievedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    expect(retrievedUser).toEqual(user);
  });

  it('creates article with author relationship', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'author@example.com',
        name: 'Author',
        password: 'hashedpassword',
      },
    });

    const article = await prisma.article.create({
      data: {
        title: 'Test Article',
        content: 'Article content',
        authorId: user.id,
        status: 'PUBLISHED',
      },
    });

    const articleWithAuthor = await prisma.article.findUnique({
      where: { id: article.id },
      include: { author: true },
    });

    expect(articleWithAuthor?.author).toEqual(user);
  });
});
```

## End-to-End Testing

### Playwright Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
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
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Basic E2E Tests

```typescript
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Mindware Blog/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigates to blog section', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Blog');
    await expect(page).toHaveURL('/blog');
    await expect(page.locator('h1')).toContainText('Blog');
  });

  test('displays recent articles', async ({ page }) => {
    await page.goto('/');
    
    const articles = page.locator('[data-testid="article-card"]');
    await expect(articles).toHaveCount.greaterThan(0);
  });
});
```

### Authentication E2E Tests

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'admin@mindware.dev');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/admin');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('user cannot login with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'invalid@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('user can logout', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@mindware.dev');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');
    
    await expect(page).toHaveURL('/');
  });
});
```

### Admin Dashboard E2E Tests

```typescript
// tests/e2e/admin.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@mindware.dev');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');
  });

  test('displays dashboard statistics', async ({ page }) => {
    await expect(page.locator('[data-testid="total-articles"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-views"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-users"]')).toBeVisible();
  });

  test('can create new article', async ({ page }) => {
    await page.click('text=Articles');
    await page.click('text=Create Article');
    
    await page.fill('[name="title"]', 'Test Article');
    await page.fill('[name="content"]', 'This is test content');
    await page.selectOption('[name="status"]', 'PUBLISHED');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Article created successfully')).toBeVisible();
  });

  test('can edit existing article', async ({ page }) => {
    await page.click('text=Articles');
    await page.click('[data-testid="edit-article"]');
    
    await page.fill('[name="title"]', 'Updated Article Title');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Article updated successfully')).toBeVisible();
  });
});
```

## Accessibility Testing

### Automated Accessibility Tests

```typescript
// tests/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('blog page should not have accessibility violations', async ({ page }) => {
    await page.goto('/blog');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('article page should not have accessibility violations', async ({ page }) => {
    await page.goto('/blog/test-article');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('admin dashboard should not have accessibility violations', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@mindware.dev');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

### Keyboard Navigation Tests

```typescript
// tests/accessibility-keyboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test('can navigate homepage with keyboard', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveText('Home');
    
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveText('Blog');
    
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveText('Case Studies');
  });

  test('can navigate forms with keyboard', async ({ page }) => {
    await page.goto('/contact');
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[name="name"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[name="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[name="message"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('can close modal with Escape key', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="open-modal"]');
    
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    await page.keyboard.press('Escape');
    
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});
```

## Performance Testing

### Core Web Vitals Testing

```typescript
// tests/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('homepage meets Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    expect(lcp).toBeLessThan(2500); // LCP should be < 2.5s
    
    // Measure FID
    const fid = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0];
          resolve(firstEntry.processingStart - firstEntry.startTime);
        }).observe({ entryTypes: ['first-input'] });
      });
    });
    
    expect(fid).toBeLessThan(100); // FID should be < 100ms
  });

  test('article page loads quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/blog/test-article');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // Page should load in < 3s
  });
});
```

## Test Data Management

### Test Fixtures

```typescript
// tests/fixtures/articles.ts
export const testArticles = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    slug: 'getting-started-nextjs',
    content: 'This is a test article about Next.js.',
    status: 'PUBLISHED',
    publishedAt: new Date('2025-01-01'),
    author: {
      id: 'author-1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
  {
    id: '2',
    title: 'React Best Practices',
    slug: 'react-best-practices',
    content: 'This is a test article about React.',
    status: 'DRAFT',
    author: {
      id: 'author-1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
];

export const testUsers = [
  {
    id: 'user-1',
    email: 'admin@mindware.dev',
    name: 'Admin User',
    role: 'ADMIN',
  },
  {
    id: 'user-2',
    email: 'author@mindware.dev',
    name: 'Author User',
    role: 'AUTHOR',
  },
];
```

### Database Seeding for Tests

```typescript
// tests/helpers/seed.ts
import { PrismaClient } from '@prisma/client';
import { testArticles, testUsers } from '../fixtures/articles';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

export async function seedTestData() {
  // Create test users
  for (const user of testUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: {
        ...user,
        password: 'hashedpassword',
      },
    });
  }

  // Create test articles
  for (const article of testArticles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: {
        ...article,
        authorId: article.author.id,
      },
    });
  }
}

export async function cleanupTestData() {
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();
}
```

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
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

module.exports = createJestConfig(customJestConfig);
```

### Jest Setup

```javascript
// jest.setup.js
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));
```

## Running Tests

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="Button"

# Run E2E tests
npm run test:e2e

# Run accessibility tests
npm run test:accessibility

# Run performance tests
npm run test:performance

# Run all tests in CI
npm run test:ci
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:accessibility": "playwright test tests/accessibility.spec.ts",
    "test:performance": "playwright test tests/performance.spec.ts",
    "test:ci": "jest --ci --coverage --watchAll=false && playwright test"
  }
}
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: packages/blog-starter-kit/themes/enterprise/package-lock.json
      
      - name: Install dependencies
        run: |
          cd packages/blog-starter-kit/themes/enterprise
          npm ci
      
      - name: Run database migrations
        run: |
          cd packages/blog-starter-kit/themes/enterprise
          npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Run unit tests
        run: |
          cd packages/blog-starter-kit/themes/enterprise
          npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Run E2E tests
        run: |
          cd packages/blog-starter-kit/themes/enterprise
          npm run test:e2e
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: packages/blog-starter-kit/themes/enterprise/coverage/lcov.info
```

## Best Practices

### Testing Guidelines

1. **Write Tests First**: Use TDD when possible
2. **Test Behavior, Not Implementation**: Focus on what the code does, not how
3. **Keep Tests Simple**: One assertion per test when possible
4. **Use Descriptive Names**: Test names should explain what is being tested
5. **Mock External Dependencies**: Isolate units under test
6. **Test Edge Cases**: Include boundary conditions and error cases
7. **Maintain Test Data**: Keep test fixtures up to date

### Test Organization

1. **Group Related Tests**: Use `describe` blocks for organization
2. **Use Setup and Teardown**: Clean up test data between tests
3. **Share Common Utilities**: Create helper functions for repeated code
4. **Keep Tests Independent**: Tests should not depend on each other
5. **Use Page Object Model**: For E2E tests, create page objects

### Performance Considerations

1. **Run Tests in Parallel**: Use Jest's parallel execution
2. **Mock Heavy Operations**: Avoid real API calls in unit tests
3. **Use Test Databases**: Separate test data from development data
4. **Clean Up Resources**: Close database connections and browser instances
5. **Optimize Test Data**: Use minimal data sets for tests

## Troubleshooting

### Common Issues

#### Tests Failing Intermittently

**Problem**: Tests pass sometimes but fail randomly

**Solutions**:
1. Add proper waits and assertions
2. Use `waitFor` for async operations
3. Check for race conditions
4. Ensure test data isolation

#### Slow Test Execution

**Problem**: Tests take too long to run

**Solutions**:
1. Mock external API calls
2. Use in-memory databases for tests
3. Run tests in parallel
4. Optimize test data setup

#### Flaky E2E Tests

**Problem**: E2E tests are unreliable

**Solutions**:
1. Add proper waits and timeouts
2. Use stable selectors
3. Handle dynamic content properly
4. Retry failed tests

## Resources

### Documentation

- **Jest**: [jestjs.io/docs](https://jestjs.io/docs)
- **React Testing Library**: [testing-library.com/docs](https://testing-library.com/docs)
- **Playwright**: [playwright.dev/docs](https://playwright.dev/docs)
- **Axe Core**: [github.com/dequelabs/axe-core](https://github.com/dequelabs/axe-core)

### Tools

- **Testing Library**: [testing-library.com](https://testing-library.com)
- **MSW**: [mswjs.io](https://mswjs.io)
- **Faker.js**: [fakerjs.dev](https://fakerjs.dev)
- **Supertest**: [github.com/visionmedia/supertest](https://github.com/visionmedia/supertest)

## Support

For testing support:

- **Email**: [testing@mindware.dev](mailto:testing@mindware.dev)
- **Slack**: #testing channel
- **Documentation**: Check this guide and inline code comments
