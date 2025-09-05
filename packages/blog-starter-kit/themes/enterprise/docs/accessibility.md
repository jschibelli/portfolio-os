# Accessibility Guidelines

**Last Updated**: January 2025  
**Version**: 2.0.0

## Overview

The Mindware Blog platform is committed to providing an accessible experience for all users. This document outlines our accessibility standards, implementation guidelines, and testing procedures to ensure WCAG 2.1 AA compliance.

## Standards and Compliance

### WCAG 2.1 AA Compliance

We follow the Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level, which includes:

- **Perceivable**: Information must be presentable in ways users can perceive
- **Operable**: Interface components must be operable by all users
- **Understandable**: Information and UI operation must be understandable
- **Robust**: Content must be robust enough for various assistive technologies

### Legal Compliance

- **ADA (Americans with Disabilities Act)**: Section 508 compliance
- **AODA (Accessibility for Ontarians with Disabilities Act)**: Ontario accessibility standards
- **EN 301 549**: European accessibility standard

## Global Accessibility Checklist

### Semantic HTML

- [ ] Use proper HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`)
- [ ] Use heading hierarchy (h1 → h2 → h3, no skipping levels)
- [ ] Use list elements (`<ul>`, `<ol>`, `<li>`) for lists
- [ ] Use table elements (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`) for tabular data
- [ ] Use form elements (`<form>`, `<label>`, `<input>`, `<button>`) properly

### ARIA (Accessible Rich Internet Applications)

- [ ] Use ARIA landmarks (`role="banner"`, `role="navigation"`, `role="main"`, etc.)
- [ ] Use ARIA labels for complex UI components
- [ ] Use ARIA live regions for dynamic content updates
- [ ] Use ARIA states and properties (`aria-expanded`, `aria-selected`, `aria-hidden`)
- [ ] Use ARIA descriptions for additional context

### Keyboard Navigation

- [ ] All interactive elements are keyboard accessible
- [ ] Logical tab order throughout the application
- [ ] Visible focus indicators on all focusable elements
- [ ] Skip links for main content navigation
- [ ] No keyboard traps in modal dialogs or complex components

### Color and Contrast

- [ ] Minimum 4.5:1 contrast ratio for normal text
- [ ] Minimum 3:1 contrast ratio for large text (18pt+ or 14pt+ bold)
- [ ] Color is not the only means of conveying information
- [ ] Sufficient contrast for interactive elements and focus states

### Images and Media

- [ ] All images have appropriate alt text
- [ ] Decorative images have empty alt attributes (`alt=""`)
- [ ] Complex images have detailed descriptions
- [ ] Videos have captions and transcripts
- [ ] Audio content has transcripts

### Forms and Inputs

- [ ] All form inputs have associated labels
- [ ] Required fields are clearly marked
- [ ] Error messages are associated with form fields
- [ ] Form validation provides clear, helpful error messages
- [ ] Form submission provides confirmation feedback

## Component-Level Guidelines

### Navigation Components

#### Main Navigation

```tsx
<nav role="navigation" aria-label="Main navigation">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/blog">Blog</a></li>
    <li><a href="/case-studies">Case Studies</a></li>
  </ul>
</nav>
```

#### Breadcrumbs

```tsx
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/blog">Blog</a></li>
    <li aria-current="page">Current Article</li>
  </ol>
</nav>
```

#### Skip Links

```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

### Dialog Components

#### Modal Dialogs

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-description">Are you sure you want to delete this item?</p>
  <button onClick={handleConfirm}>Confirm</button>
  <button onClick={handleCancel}>Cancel</button>
</div>
```

#### Alert Dialogs

```tsx
<div
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="alert-title"
>
  <h2 id="alert-title">Error</h2>
  <p>An error occurred while processing your request.</p>
  <button onClick={handleClose}>Close</button>
</div>
```

### Menu Components

#### Dropdown Menus

```tsx
<div className="dropdown">
  <button
    aria-expanded={isOpen}
    aria-haspopup="menu"
    aria-controls="menu-id"
    onClick={toggleMenu}
  >
    Menu
  </button>
  <ul
    id="menu-id"
    role="menu"
    aria-labelledby="menu-button"
    className={isOpen ? 'open' : 'closed'}
  >
    <li role="none">
      <a href="/profile" role="menuitem">Profile</a>
    </li>
    <li role="none">
      <a href="/settings" role="menuitem">Settings</a>
    </li>
  </ul>
</div>
```

### Form Components

#### Input Fields

```tsx
<div className="form-group">
  <label htmlFor="email-input">Email Address</label>
  <input
    id="email-input"
    type="email"
    required
    aria-describedby="email-error"
    aria-invalid={hasError}
  />
  {hasError && (
    <div id="email-error" role="alert" className="error-message">
      Please enter a valid email address
    </div>
  )}
</div>
```

#### Checkboxes and Radio Buttons

```tsx
<fieldset>
  <legend>Newsletter Preferences</legend>
  <div>
    <input
      id="weekly-newsletter"
      type="checkbox"
      name="newsletter"
      value="weekly"
    />
    <label htmlFor="weekly-newsletter">Weekly Newsletter</label>
  </div>
  <div>
    <input
      id="monthly-newsletter"
      type="checkbox"
      name="newsletter"
      value="monthly"
    />
    <label htmlFor="monthly-newsletter">Monthly Newsletter</label>
  </div>
</fieldset>
```

### Data Tables

```tsx
<table>
  <caption>Article Statistics</caption>
  <thead>
    <tr>
      <th scope="col">Title</th>
      <th scope="col">Author</th>
      <th scope="col">Views</th>
      <th scope="col">Published</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Getting Started with Next.js</th>
      <td>John Doe</td>
      <td>1,250</td>
      <td>2025-01-09</td>
    </tr>
  </tbody>
</table>
```

### Live Regions

#### Status Updates

```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>
```

#### Error Announcements

```tsx
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

## Testing Procedures

### Automated Testing

#### Playwright Accessibility Tests

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

#### Jest Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button component should be accessible', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing

#### Keyboard Navigation Testing

1. **Tab Navigation**
   - [ ] Tab through all interactive elements
   - [ ] Verify logical tab order
   - [ ] Check for keyboard traps
   - [ ] Test skip links functionality

2. **Keyboard Shortcuts**
   - [ ] Test common shortcuts (Enter, Space, Escape)
   - [ ] Verify custom keyboard shortcuts work
   - [ ] Test arrow key navigation in menus

#### Screen Reader Testing

1. **NVDA (Windows)**
   - [ ] Test with NVDA screen reader
   - [ ] Verify proper heading structure
   - [ ] Check form labels and descriptions
   - [ ] Test dynamic content announcements

2. **JAWS (Windows)**
   - [ ] Test with JAWS screen reader
   - [ ] Verify table navigation
   - [ ] Check list and landmark navigation

3. **VoiceOver (macOS)**
   - [ ] Test with VoiceOver screen reader
   - [ ] Verify rotor navigation
   - [ ] Check gesture navigation

#### Visual Testing

1. **Color Contrast**
   - [ ] Use WebAIM contrast checker
   - [ ] Test with color blindness simulators
   - [ ] Verify high contrast mode compatibility

2. **Zoom Testing**
   - [ ] Test at 200% zoom level
   - [ ] Verify horizontal scrolling is not required
   - [ ] Check text remains readable

### Testing Tools

#### Browser Extensions

- **axe DevTools**: Chrome/Firefox extension for accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built-in Chrome accessibility audit
- **Accessibility Insights**: Microsoft's accessibility testing tool

#### Command Line Tools

```bash
# Run accessibility tests
npm run test:accessibility

# Run axe-core tests
npx @axe-core/cli https://mindware.hashnode.dev

# Run Lighthouse accessibility audit
npx lighthouse https://mindware.hashnode.dev --only-categories=accessibility
```

## Implementation Guidelines

### CSS and Styling

#### Focus Management

```css
/* Visible focus indicators */
:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Skip link styling */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

#### High Contrast Support

```css
@media (prefers-contrast: high) {
  .button {
    border: 2px solid currentColor;
  }
  
  .card {
    border: 1px solid currentColor;
  }
}
```

#### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### JavaScript Accessibility

#### Focus Management

```typescript
// Focus management for modals
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
}
```

#### ARIA Live Regions

```typescript
// Announce dynamic content changes
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
```

## Common Accessibility Issues and Solutions

### Issue: Missing Alt Text

**Problem**: Images without alt text are not accessible to screen readers.

**Solution**:
```tsx
// ✅ Good
<img src="chart.png" alt="Sales increased by 25% in Q3 2024" />

// ❌ Bad
<img src="chart.png" />
```

### Issue: Poor Color Contrast

**Problem**: Text is not readable due to insufficient contrast.

**Solution**:
```css
/* ✅ Good - 4.5:1 contrast ratio */
.text {
  color: #333333; /* Dark gray on white background */
}

/* ❌ Bad - 2.1:1 contrast ratio */
.text {
  color: #999999; /* Light gray on white background */
}
```

### Issue: Missing Form Labels

**Problem**: Form inputs without labels are not accessible.

**Solution**:
```tsx
// ✅ Good
<label htmlFor="email">Email Address</label>
<input id="email" type="email" />

// ❌ Bad
<input type="email" placeholder="Email" />
```

### Issue: Keyboard Navigation Problems

**Problem**: Interactive elements are not keyboard accessible.

**Solution**:
```tsx
// ✅ Good
<button onClick={handleClick} onKeyDown={handleKeyDown}>
  Click me
</button>

// ❌ Bad
<div onClick={handleClick}>Click me</div>
```

## Accessibility Checklist for New Features

### Before Development

- [ ] Review accessibility requirements for the feature
- [ ] Plan keyboard navigation flow
- [ ] Design with sufficient color contrast
- [ ] Consider screen reader announcements

### During Development

- [ ] Use semantic HTML elements
- [ ] Add appropriate ARIA attributes
- [ ] Implement keyboard navigation
- [ ] Test with screen reader
- [ ] Verify color contrast ratios

### Before Release

- [ ] Run automated accessibility tests
- [ ] Perform manual keyboard testing
- [ ] Test with screen reader
- [ ] Verify zoom compatibility
- [ ] Check high contrast mode

## Resources and Tools

### Documentation

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Resources](https://webaim.org/)

### Testing Tools

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Accessibility Insights](https://accessibilityinsights.io/)

### Screen Readers

- [NVDA](https://www.nvaccess.org/) (Windows, Free)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) (Windows, Paid)
- [VoiceOver](https://www.apple.com/accessibility/vision/) (macOS, Built-in)
- [Orca](https://help.gnome.org/users/orca/) (Linux, Free)

## Support and Feedback

If you encounter accessibility issues or have suggestions for improvement:

- **Email**: [accessibility@mindware.dev](mailto:accessibility@mindware.dev)
- **GitHub Issues**: [Create an accessibility issue](https://github.com/your-org/mindware-blog/issues)
- **Discord**: [Join our accessibility discussion](https://discord.gg/mindware)

We are committed to making the Mindware Blog platform accessible to everyone and welcome your feedback.
