# Contributing Guidelines

**Last Updated**: January 2025

## Welcome Contributors! 🎉

Thank you for your interest in contributing to the Mindware Blog platform. This document provides guidelines and standards for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Definition of Done](#definition-of-done)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- Be respectful and constructive in all interactions
- Focus on what is best for the community
- Show empathy towards other community members
- Accept constructive criticism gracefully
- Help create a positive environment for everyone

### Unacceptable Behavior

- Harassment, discrimination, or inappropriate language
- Personal attacks or trolling
- Spam or off-topic discussions
- Any behavior that makes others feel unwelcome

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git
- Code editor (VS Code recommended)

### Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/mindware-blog.git
   cd mindware-blog/packages/blog-starter-kit/themes/enterprise
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements
- `chore/` - Maintenance tasks

**Examples:**
- `feature/admin-dashboard-improvements`
- `fix/authentication-redirect-bug`
- `docs/api-documentation-update`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add Google OAuth integration
fix(api): resolve article creation validation error
docs(readme): update installation instructions
refactor(components): extract reusable button component
```

### Git Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following our standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Standards

### TypeScript

- **Strict Mode**: Always use strict TypeScript configuration
- **Type Safety**: Avoid `any` types, use proper typing
- **Interfaces**: Use interfaces for object shapes
- **Enums**: Use enums for constants and status values
- **Generics**: Use generics for reusable components

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  role: UserRole;
}

// ❌ Bad
const user: any = { id: "123", email: "user@example.com" };
```

### React Components

- **Functional Components**: Use functional components with hooks
- **Props Interface**: Define props interfaces
- **Default Props**: Use default parameters instead of defaultProps
- **Component Naming**: Use PascalCase for component names

```typescript
// ✅ Good
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

// ❌ Bad
export function button(props: any) {
  return <button>{props.children}</button>;
}
```

### File Organization

- **File Naming**: Use kebab-case for files, PascalCase for components
- **Directory Structure**: Group related files together
- **Barrel Exports**: Use index.ts files for clean imports

```
components/
├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   └── index.ts
├── features/
│   └── auth/
│       ├── login-form.tsx
│       └── index.ts
```

### Import Order

1. React and Next.js imports
2. Third-party libraries
3. Internal components and utilities
4. Type imports (with `type` keyword)

```typescript
// ✅ Good
import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { validateUser } from '@/lib/auth';

import type { User } from '@/types/user';
```

### ESLint and Prettier

- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Use Prettier for code formatting
- **Pre-commit**: Run linting before committing

```bash
npm run lint          # Run ESLint
npm run format        # Format with Prettier
npm run typecheck     # TypeScript type checking
```

## Testing Requirements

### Test Types

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test complete user workflows
- **Accessibility Tests**: Ensure WCAG compliance

### Test Structure

```typescript
// ✅ Good test structure
describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Coverage

- **Minimum Coverage**: 80% for new code
- **Critical Paths**: 100% coverage for authentication and payment flows
- **Edge Cases**: Test error conditions and edge cases

### Running Tests

```bash
npm run test                    # Run unit tests
npm run test:accessibility     # Run accessibility tests
npm run test:seo              # Run SEO tests
npm run test:e2e              # Run end-to-end tests
```

## Pull Request Process

### Before Submitting

1. **Update Documentation**: Update relevant documentation
2. **Add Tests**: Add tests for new functionality
3. **Run Tests**: Ensure all tests pass
4. **Check Linting**: Fix any linting errors
5. **Update CHANGELOG**: Add entry to CHANGELOG.md

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] CHANGELOG updated
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: At least one team member reviews
3. **Testing**: Manual testing for complex changes
4. **Approval**: Maintainer approval required for merge

## Definition of Done

A feature is considered complete when:

### Code Quality
- [ ] Code follows style guidelines
- [ ] TypeScript types are properly defined
- [ ] No ESLint errors or warnings
- [ ] Code is properly documented

### Testing
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Accessibility tests passing
- [ ] Manual testing completed

### Documentation
- [ ] Code is properly commented
- [ ] API documentation updated
- [ ] User documentation updated
- [ ] CHANGELOG updated

### Performance
- [ ] No performance regressions
- [ ] Bundle size impact assessed
- [ ] Database queries optimized
- [ ] Caching implemented where appropriate

### Security
- [ ] Input validation implemented
- [ ] Authentication/authorization checked
- [ ] No security vulnerabilities introduced
- [ ] Sensitive data properly handled

## Getting Help

### Resources

- **Documentation**: Check the `/docs` directory
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our Discord community

### Contact

- **Email**: [dev@mindware.dev](mailto:dev@mindware.dev)
- **GitHub Issues**: [Create an issue](https://github.com/your-org/mindware-blog/issues)
- **Discord**: [Join our server](https://discord.gg/mindware)

## Recognition

Contributors will be recognized in:
- **README**: Listed as contributors
- **CHANGELOG**: Mentioned in release notes
- **Documentation**: Credited in relevant sections

Thank you for contributing to the Mindware Blog platform! 🚀
