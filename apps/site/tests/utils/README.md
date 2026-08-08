# Playwright Test Utilities

## Overview

This directory contains comprehensive test utilities and helpers for Playwright end-to-end tests. These utilities provide reusable functions for common testing scenarios, making test writing faster and more consistent.

## Table of Contents

1. [Test Helpers](#test-helpers)
2. [Authentication Mocking](#authentication-mocking)
3. [API Mocking](#api-mocking)
4. [Form Testing](#form-testing)
5. [Component Interaction Testing](#component-interaction-testing)
6. [Animation Handling](#animation-handling)
7. [Responsive Design Testing](#responsive-design-testing)
8. [Storage Mocking](#storage-mocking)
9. [Test Data](#test-data)
10. [Best Practices](#best-practices)

---

## Test Helpers

### Performance Testing

```typescript
import { testPagePerformance, navigateWithValidation } from './utils/test-helpers'

// Test page performance
test('homepage loads quickly', async ({ page }) => {
  const { loadTime } = await testPagePerformance(page, '/', 5000)
  console.log(`Page loaded in ${loadTime}ms`)
})

// Navigate with validation
test('navigate to about page', async ({ page }) => {
  const { response, loadTime, success } = await navigateWithValidation(
    page, 
    '/about', 
    'About - John Schibelli'
  )
  expect(success).toBe(true)
})
```

### Accessibility Testing

```typescript
import { runComprehensiveAccessibilityTest, testSpecificAccessibilityRules } from './utils/test-helpers'

// Run comprehensive accessibility test
test('homepage is accessible', async ({ page }) => {
  await runComprehensiveAccessibilityTest(page, 'Homepage', '/')
})

// Test specific accessibility rules
test('form has proper labels', async ({ page }) => {
  await testSpecificAccessibilityRules(
    page,
    '/contact',
    ['label', 'aria-valid-attr'],
    'Contact Form'
  )
})
```

---

## Authentication Mocking

### Mock Authenticated Session

```typescript
import { mockAuthSession, clearAuthSession } from './utils/test-helpers'
import { TEST_USERS } from '../config/test-data'

test('authenticated user can access dashboard', async ({ page }) => {
  // Mock authentication
  await mockAuthSession(page, TEST_USERS.authenticated)
  
  // Navigate to protected route
  await page.goto('/dashboard')
  
  // Verify access
  await expect(page.locator('h1')).toContainText('Dashboard')
})

test('admin user has admin privileges', async ({ page }) => {
  // Mock admin user
  await mockAuthSession(page, TEST_USERS.admin)
  
  // Navigate to admin panel
  await page.goto('/admin')
  
  // Verify admin UI
  await expect(page.locator('[data-testid="admin-panel"]')).toBeVisible()
})

test.afterEach(async ({ page }) => {
  // Clear authentication after each test
  await clearAuthSession(page)
})
```

### Custom User Data

```typescript
test('custom user session', async ({ page }) => {
  await mockAuthSession(page, {
    id: 'custom-user-id',
    email: 'custom@example.com',
    name: 'Custom User',
    role: 'editor',
  })
  
  await page.goto('/profile')
  await expect(page.locator('[data-testid="user-name"]')).toContainText('Custom User')
})
```

---

## API Mocking

### Generic API Mocking

```typescript
import { mockAPIResponse } from './utils/test-helpers'

test('mock any API endpoint', async ({ page }) => {
  // Mock custom API response
  await mockAPIResponse(
    page,
    '**/api/projects',
    [
      { id: 1, title: 'Project 1' },
      { id: 2, title: 'Project 2' },
    ],
    200
  )
  
  await page.goto('/projects')
  await expect(page.locator('.project-card')).toHaveCount(2)
})

test('mock API error', async ({ page }) => {
  // Mock error response
  await mockAPIResponse(
    page,
    '**/api/data',
    { error: 'Not found' },
    404
  )
  
  await page.goto('/data')
  await expect(page.locator('.error-message')).toContainText('Not found')
})
```

### Newsletter Subscription

```typescript
import { mockNewsletterAPI } from './utils/test-helpers'

test('successful newsletter subscription', async ({ page }) => {
  await mockNewsletterAPI(page, true)
  
  await page.goto('/blog')
  await page.fill('[name="email"]', 'test@example.com')
  await page.click('button[type="submit"]')
  
  await expect(page.locator('.success-message')).toContainText('Successfully subscribed')
})

test('duplicate newsletter subscription error', async ({ page }) => {
  await mockNewsletterAPI(page, false)
  
  await page.goto('/blog')
  await page.fill('[name="email"]', 'test@example.com')
  await page.click('button[type="submit"]')
  
  await expect(page.locator('.error-message')).toContainText('already subscribed')
})
```

### Booking System

```typescript
import { mockBookingAPI } from './utils/test-helpers'

test('booking with custom slots', async ({ page }) => {
  const customSlots = [
    '2025-10-20T10:00:00Z',
    '2025-10-20T14:00:00Z',
  ]
  
  await mockBookingAPI(page, customSlots)
  
  await page.goto('/book')
  
  // Verify custom slots are displayed
  const slots = page.locator('.time-slot')
  await expect(slots).toHaveCount(2)
})

test('successful booking creation', async ({ page }) => {
  await mockBookingAPI(page)
  
  await page.goto('/book')
  await page.click('.time-slot:first-child')
  await page.fill('[name="name"]', 'John Doe')
  await page.fill('[name="email"]', 'john@example.com')
  await page.click('button:text("Confirm Booking")')
  
  await expect(page.locator('.confirmation')).toContainText('booking-123')
})
```

### Contact Form

```typescript
import { mockContactFormAPI } from './utils/test-helpers'

test('successful contact form submission', async ({ page }) => {
  await mockContactFormAPI(page, true)
  
  await page.goto('/contact')
  await page.fill('[name="name"]', 'Jane Doe')
  await page.fill('[name="email"]', 'jane@example.com')
  await page.fill('[name="message"]', 'Test message')
  await page.click('button[type="submit"]')
  
  await expect(page.locator('.success')).toContainText('Message sent successfully')
})

test('contact form submission error', async ({ page }) => {
  await mockContactFormAPI(page, false)
  
  await page.goto('/contact')
  await page.fill('[name="name"]', 'Jane Doe')
  await page.fill('[name="email"]', 'jane@example.com')
  await page.fill('[name="message"]', 'Test message')
  await page.click('button[type="submit"]')
  
  await expect(page.locator('.error')).toContainText('Failed to send message')
})
```

---

## Form Testing

### Validation Testing

```typescript
import { testFormValidation } from './utils/test-helpers'

test('contact form validation', async ({ page }) => {
  await page.goto('/contact')
  
  await testFormValidation(page, 'form#contact-form', [
    {
      fieldSelector: '[name="email"]',
      invalidValue: 'not-an-email',
      validValue: 'valid@example.com',
      expectedError: 'Please enter a valid email address',
    },
    {
      fieldSelector: '[name="message"]',
      invalidValue: 'Too short',
      validValue: 'This is a valid message with sufficient length.',
      expectedError: 'Message must be at least 20 characters',
    },
  ])
})
```

---

## Component Interaction Testing

### Interactive Components

```typescript
import { testInteractiveComponent } from './utils/test-helpers'

test('dropdown menu interaction', async ({ page }) => {
  await page.goto('/')
  
  await testInteractiveComponent(page, '[data-testid="nav-menu"]', [
    {
      action: 'click',
      target: 'button.menu-trigger',
      expectedResult: {
        selector: '.dropdown-menu',
        state: 'visible',
      },
    },
    {
      action: 'hover',
      target: '.menu-item:first-child',
      expectedResult: {
        selector: '.submenu',
        state: 'visible',
      },
    },
  ])
})

test('search component', async ({ page }) => {
  await page.goto('/')
  
  await testInteractiveComponent(page, '[data-testid="search"]', [
    {
      action: 'focus',
      expectedResult: {
        selector: '.search-suggestions',
        state: 'visible',
      },
    },
    {
      action: 'type',
      value: 'test query',
      expectedResult: {
        selector: '.search-results',
        state: 'visible',
      },
    },
  ])
})
```

---

## Animation Handling

### Wait for Animations

```typescript
import { waitForAnimation, ANIMATION_TIMEOUTS } from './utils/test-helpers'

test('wait for modal animation', async ({ page }) => {
  await page.goto('/')
  
  // Open modal
  await page.click('button.open-modal')
  
  // Wait for animation to complete
  await waitForAnimation(page, '.modal', ANIMATION_TIMEOUTS.medium)
  
  // Now interact with modal
  await expect(page.locator('.modal')).toBeVisible()
})

test('wait for page transition', async ({ page }) => {
  await page.goto('/')
  await page.click('a[href="/about"]')
  
  // Wait for page transition animation
  await waitForAnimation(page)
  
  await expect(page).toHaveURL('/about')
})
```

---

## Responsive Design Testing

### Multi-Viewport Testing

```typescript
import { testResponsiveDesign } from './utils/test-helpers'
import { VIEWPORTS } from '../config/test-data'

test('responsive navigation', async ({ page }) => {
  await testResponsiveDesign(page, '/', [
    {
      viewport: VIEWPORTS.mobile,
      expectations: [
        { selector: '.mobile-menu', shouldBeVisible: true },
        { selector: '.desktop-menu', shouldBeVisible: false },
      ],
    },
    {
      viewport: VIEWPORTS.desktop,
      expectations: [
        { selector: '.mobile-menu', shouldBeVisible: false },
        { selector: '.desktop-menu', shouldBeVisible: true },
      ],
    },
  ])
})
```

---

## Storage Mocking

### LocalStorage & SessionStorage

```typescript
import { mockLocalStorage, mockSessionStorage, clearAllStorage } from './utils/test-helpers'

test('mock user preferences', async ({ page }) => {
  await mockLocalStorage(page, {
    theme: 'dark',
    language: 'en',
    cookieConsent: 'accepted',
  })
  
  await page.goto('/')
  
  // Verify dark theme is applied
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('mock session data', async ({ page }) => {
  await mockSessionStorage(page, {
    'form-draft': JSON.stringify({ name: 'John', email: 'john@example.com' }),
  })
  
  await page.goto('/contact')
  
  // Verify form is pre-filled
  await expect(page.locator('[name="name"]')).toHaveValue('John')
})

test.afterEach(async ({ page }) => {
  await clearAllStorage(page)
})
```

---

## Test Data

### Using Predefined Test Data

```typescript
import { 
  TEST_USERS, 
  FORM_TEST_DATA, 
  MOCK_PROJECTS,
  MOCK_API_RESPONSES,
  ERROR_SCENARIOS,
} from '../config/test-data'

test('use predefined test data', async ({ page }) => {
  // Use predefined valid form data
  await page.goto('/contact')
  await page.fill('[name="name"]', FORM_TEST_DATA.validContact.name)
  await page.fill('[name="email"]', FORM_TEST_DATA.validContact.email)
  await page.fill('[name="message"]', FORM_TEST_DATA.validContact.message)
})

test('use mock projects', async ({ page }) => {
  await mockAPIResponse(page, '**/api/projects', MOCK_PROJECTS)
  
  await page.goto('/projects')
  await expect(page.locator('.project-card')).toHaveCount(MOCK_PROJECTS.length)
})
```

---

## Best Practices

### 1. Always Clean Up

```typescript
test.afterEach(async ({ page }) => {
  await clearAuthSession(page)
  await clearAllStorage(page)
})
```

### 2. Use Test Data Constants

```typescript
// ✅ Good - Use constants
import { FORM_TEST_DATA } from '../config/test-data'
await page.fill('[name="email"]', FORM_TEST_DATA.validContact.email)

// ❌ Bad - Hardcode test data
await page.fill('[name="email"]', 'test@example.com')
```

### 3. Wait for Animations

```typescript
// ✅ Good - Wait for animation
await page.click('.modal-trigger')
await waitForAnimation(page, '.modal')
await expect(page.locator('.modal')).toBeVisible()

// ❌ Bad - Don't wait
await page.click('.modal-trigger')
await expect(page.locator('.modal')).toBeVisible() // May fail due to animation
```

### 4. Use Descriptive Test Names

```typescript
// ✅ Good
test('authenticated user can submit contact form and receives confirmation', async ({ page }) => {
  // ...
})

// ❌ Bad
test('contact form test', async ({ page }) => {
  // ...
})
```

### 5. Group Related Tests

```typescript
test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })
  
  test('validates email format', async ({ page }) => {
    // ...
  })
  
  test('validates required fields', async ({ page }) => {
    // ...
  })
  
  test('submits successfully with valid data', async ({ page }) => {
    // ...
  })
})
```

### 6. Use Page Object Pattern for Complex Pages

```typescript
import { CaseStudyPage } from '../pages/CaseStudyPage'

test('case study page content', async ({ page }) => {
  const caseStudyPage = new CaseStudyPage(page)
  await caseStudyPage.goto('fintech-ux-redesign')
  await caseStudyPage.verifyTitle('FinTech UX Redesign')
  await caseStudyPage.scrollToResults()
})
```

---

## Contributing

When adding new utilities:

1. Add comprehensive JSDoc comments
2. Include usage examples in this README
3. Add corresponding test data to `test-data.ts`
4. Ensure utilities are generic and reusable
5. Write tests for the utilities themselves

---

## Support

For questions or issues:
- Check existing test examples in `/tests`
- Review Playwright documentation: https://playwright.dev/
- Consult the team's testing guidelines

---

**Last Updated**: 2025-10-10  
**Maintainer**: Jason (Infrastructure/Testing Specialist)

