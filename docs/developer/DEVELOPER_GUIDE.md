# Portfolio OS Developer Guide

## Overview

This guide provides comprehensive information for developers working on the Portfolio OS project. It covers architecture, development workflows, coding standards, and best practices.

## 📋 **Table of Contents**

1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Deployment Process](#deployment-process)
7. [Contributing](#contributing)
8. [Troubleshooting](#troubleshooting)

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js 18+ and PNPM
- Git
- VS Code (recommended)
- PowerShell (for automation scripts)

### **Initial Setup**

```bash
# Clone the repository
git clone https://github.com/johnschibelli/portfolio-os.git
cd portfolio-os

# Install dependencies
pnpm install

# Copy environment files
cp apps/site/.env.example apps/site/.env.local
cp apps/dashboard/.env.example apps/dashboard/.env.local

# Generate Prisma client (for dashboard)
cd apps/dashboard
npx prisma generate
cd ../..
```

### **Development Commands**

```bash
# Start all apps in development mode
pnpm dev

# Start specific app
pnpm dev --filter=site
pnpm dev --filter=dashboard

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

## 🏗️ **Project Architecture**

### **Monorepo Structure**

```
portfolio-os/
├── apps/
│   ├── site/           # Public portfolio site
│   └── dashboard/      # Admin dashboard
├── packages/
│   ├── ui/             # Shared UI components
│   ├── lib/            # Shared libraries
│   ├── utils/          # Utility functions
│   ├── db/             # Database schema
│   └── hashnode/       # Hashnode integration
├── scripts/            # Automation scripts
├── docs/              # Documentation
└── prompts/           # AI prompts
```

### **Technology Stack**

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma, PostgreSQL
- **Styling**: Tailwind CSS, Radix UI
- **Database**: Prisma ORM with PostgreSQL
- **Deployment**: Vercel
- **Monorepo**: Turborepo, PNPM

### **Key Features**

- **Multi-app Architecture**: Site and dashboard as separate apps
- **Shared Packages**: Reusable UI components and utilities
- **Type Safety**: Full TypeScript implementation
- **Automation**: Comprehensive PowerShell automation scripts
- **AI Integration**: Hashnode API integration for content

## 🔄 **Development Workflow**

### **Branch Strategy**

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: Feature development branches
- **`hotfix/*`**: Critical bug fixes

### **Commit Convention**

```
type(scope): description

Examples:
feat(site): add blog post component
fix(dashboard): resolve user authentication issue
docs: update API documentation
chore: update dependencies
```

### **Pull Request Process**

1. Create feature branch from `develop`
2. Implement changes with tests
3. Run linting and tests
4. Create pull request to `develop`
5. Code review and approval
6. Merge to `develop`
7. Deploy to staging for testing

### **Automation Integration**

The project includes comprehensive automation:

```powershell
# House cleaning and organization
.\scripts\utilities\housekeeping\quick-housekeeping.ps1 -Action clean

# Issue automation
.\scripts\automation\multi-agent-automation.ps1 -Mode continuous

# Project management
.\scripts\project-management\project-manager.ps1
```

## 📝 **Coding Standards**

### **TypeScript Guidelines**

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper type annotations for function parameters and returns
- Avoid `any` type - use proper typing

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // implementation
}

// Avoid
function getUser(id: any): any {
  // implementation
}
```

### **React Best Practices**

- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript for component props
- Follow React naming conventions

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant, onClick, children }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};
```

### **CSS and Styling**

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use CSS variables for theming
- Implement proper accessibility

```tsx
<div className="flex flex-col md:flex-row gap-4 p-6 bg-white dark:bg-gray-900">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Responsive Title
  </h1>
</div>
```

## 🧪 **Testing Guidelines**

### **Testing Strategy**

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API route and database testing
- **E2E Tests**: Full user workflow testing
- **Visual Tests**: UI component regression testing

### **Test Structure**

```
__tests__/
├── components/        # Component tests
├── utils/            # Utility function tests
├── api/              # API route tests
└── e2e/              # End-to-end tests
```

### **Writing Tests**

```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button variant="primary" onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 🚀 **Deployment Process**

### **Staging Deployment**

1. Merge feature to `develop` branch
2. Automatic deployment to staging via Vercel
3. Run automated tests
4. Manual testing and validation
5. Performance and security checks

### **Production Deployment**

1. Create release branch from `develop`
2. Update version numbers and changelog
3. Merge to `main` branch
4. Automatic deployment to production
5. Monitor deployment and rollback if needed

### **Environment Configuration**

```bash
# Staging
NEXT_PUBLIC_ENV=staging
DATABASE_URL=postgresql://staging-db-url

# Production
NEXT_PUBLIC_ENV=production
DATABASE_URL=postgresql://production-db-url
```

## 🤝 **Contributing**

### **Contribution Guidelines**

1. **Fork the repository**
2. **Create a feature branch**
3. **Follow coding standards**
4. **Write comprehensive tests**
5. **Update documentation**
6. **Submit pull request**

### **Code Review Process**

- All code must be reviewed before merging
- At least one approval required
- Automated tests must pass
- No merge conflicts allowed

### **Issue Reporting**

- Use GitHub issues for bug reports
- Provide detailed reproduction steps
- Include environment information
- Use appropriate labels and milestones

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm build
```

#### **Database Issues**
```bash
# Reset database
npx prisma migrate reset
npx prisma generate
```

#### **TypeScript Errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

### **Development Tools**

- **VS Code Extensions**: ESLint, Prettier, TypeScript
- **Browser DevTools**: React DevTools, Redux DevTools
- **Database**: Prisma Studio
- **API Testing**: Postman or Insomnia

## 📚 **Additional Resources**

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🆘 **Getting Help**

- **Documentation**: Check this guide and other docs
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Code Review**: Request reviews from team members

---

**This developer guide ensures consistent, high-quality development practices across the Portfolio OS project!** 🚀
