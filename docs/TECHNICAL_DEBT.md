# Technical Debt & Known Issues

This document tracks known issues, technical debt, and non-blocking failures in the CI/CD pipeline. These items should be addressed before production release or in upcoming iterations.

## 📊 Status Overview

| Category | Count | Priority | Status |
|----------|-------|----------|--------|
| Linting Issues | 2 | Medium | Tracked |
| Type Errors | 2 | Medium | Tracked |
| Test Failures | 2 | Medium-High | Tracked |
| Build Issues | 1 | Medium | Tracked |
| E2E Test Issues | 1 | Medium | Tracked |
| Accessibility | 1 | High | Tracked |

---

## 🔍 Linting Issues

### Site Application Linting Warnings
- **Severity**: Medium
- **Status**: Pre-existing, addressing incrementally
- **Location**: `apps/site/**`
- **Common Issues**:
  - Unused imports
  - Missing dependencies in useEffect hooks
  - Formatting inconsistencies
- **Fix Command**: `pnpm --filter @mindware-blog/site lint --fix`
- **Action Items**:
  - [ ] Run lint fix across codebase
  - [ ] Review and approve auto-fixes
  - [ ] Manually fix remaining issues
  - [ ] Set up pre-commit hooks to prevent new issues
- **Target**: v1.2.0

### Dashboard Application Linting Warnings
- **Severity**: Medium
- **Status**: Pre-existing, documented
- **Location**: `apps/dashboard/**`
- **Common Issues**:
  - TypeScript errors in ESLint
  - React hooks dependency warnings
  - Import order violations
- **Fix Command**: `pnpm --filter @mindware-blog/dashboard lint --fix`
- **Action Items**:
  - [ ] Audit all linting errors
  - [ ] Create separate issues for complex fixes
  - [ ] Update ESLint config if needed
  - [ ] Address errors incrementally
- **Target**: v1.2.0

---

## 📝 Type Checking Issues

### Site TypeScript Errors
- **Severity**: Medium
- **Status**: Technical debt, non-blocking for deployment
- **Location**: `apps/site/**`
- **Common Issues**:
  - Type mismatches in component props
  - Missing type definitions for third-party libraries
  - Strict null check violations
  - Implicit any types
- **Fix Command**: `pnpm --filter @mindware-blog/site typecheck`
- **Action Items**:
  - [ ] Generate type error report
  - [ ] Categorize errors by severity
  - [ ] Fix high-priority type issues first
  - [ ] Add missing type definitions
  - [ ] Enable stricter TypeScript checks incrementally
- **Logs**: Check `site-typecheck.log` artifact in CI runs
- **Target**: v1.3.0

### Dashboard TypeScript Errors
- **Severity**: Medium
- **Status**: Tracked in backlog
- **Location**: `apps/dashboard/**`
- **Common Issues**:
  - Missing type definitions
  - Incompatible library types
  - Generic type inference issues
- **Fix Command**: `pnpm --filter @mindware-blog/dashboard typecheck`
- **Action Items**:
  - [ ] Upgrade dependencies with better types
  - [ ] Create declaration files for untyped modules
  - [ ] Refactor complex type usage
  - [ ] Document type assumptions
- **Logs**: Check `dashboard-typecheck.log` artifact in CI runs
- **Target**: v1.3.0

---

## 🧪 Unit Test Issues

### Site Tests Not Configured
- **Severity**: Medium
- **Status**: Test suite missing/incomplete
- **Priority**: Should be addressed for production readiness
- **Location**: `apps/site/**`
- **Action Items**:
  - [ ] Set up Jest or Vitest configuration
  - [ ] Add unit tests for critical utilities
  - [ ] Add tests for custom hooks
  - [ ] Add tests for data transformations
  - [ ] Set up code coverage thresholds
- **Fix Command**: `pnpm --filter @mindware-blog/site test`
- **Coverage Goal**: 70% for utilities and hooks
- **Target**: v1.2.0

### Dashboard Tests Failing
- **Severity**: High
- **Status**: Tests exist but have failures
- **Priority**: Should pass before merging new features
- **Location**: `apps/dashboard/**`
- **Common Issues**:
  - Mock setup problems
  - Async timing issues
  - Component mounting failures
  - Outdated snapshots
- **Action Items**:
  - [ ] Run tests locally and identify failures
  - [ ] Fix mock configurations
  - [ ] Update component tests for recent changes
  - [ ] Update or remove outdated snapshots
  - [ ] Add missing test assertions
- **Fix Command**: `pnpm --filter @mindware-blog/dashboard test`
- **Target**: v1.1.1 (hotfix)

---

## 🏗️ Build Issues

### Dashboard Build Failures
- **Severity**: Medium
- **Status**: Non-blocking for site-only deployments
- **Location**: `apps/dashboard/**`
- **Common Issues**:
  - Import errors
  - Missing types in production build
  - Configuration issues
- **Impact**: Blocks dashboard deployment but not site
- **Action Items**:
  - [ ] Run production build locally
  - [ ] Identify and fix import errors
  - [ ] Ensure all dependencies are production-ready
  - [ ] Test build output
  - [ ] Verify deployment configuration
- **Fix Command**: `pnpm --filter @mindware-blog/dashboard build`
- **Note**: Dashboard should be fixed before v1.2.0 release
- **Target**: v1.2.0

---

## 🎭 E2E Test Issues

### Playwright Test Failures
- **Severity**: Medium
- **Status**: Non-blocking for PR merge
- **Priority**: Should be fixed to maintain test coverage
- **Location**: `apps/site/tests/ci-integration.spec.ts`
- **Common Issues**:
  - Selector changes (component refactoring broke selectors)
  - Timing issues (elements not visible when expected)
  - Navigation failures (page routing changed)
  - Environment differences (CI vs local)
- **Action Items**:
  - [ ] Review failing test screenshots in Playwright report
  - [ ] Update test selectors for refactored components
  - [ ] Add proper wait conditions for dynamic content
  - [ ] Ensure stable test data
  - [ ] Run tests in CI mode locally
- **Debugging**:
  - Run: `pnpm --filter @mindware-blog/site exec playwright test`
  - UI Mode: `pnpm --filter @mindware-blog/site exec playwright test --ui`
  - Check artifacts for screenshots and traces
- **Target**: v1.1.1 (hotfix)

---

## ♿ Accessibility Issues

### Accessibility Test Failures
- **Severity**: High
- **Status**: Non-blocking but should be addressed
- **Priority**: High - accessibility is important for all users
- **Location**: `apps/site/**`
- **Common Issues**:
  - Missing alt text on images
  - Insufficient color contrast
  - Missing ARIA labels
  - Keyboard navigation problems
  - Heading hierarchy issues
- **Action Items**:
  - [ ] Run accessibility tests locally
  - [ ] Review axe-core violations
  - [ ] Add missing alt text to all images
  - [ ] Audit and fix color contrast issues
  - [ ] Add proper ARIA labels to interactive elements
  - [ ] Test keyboard navigation flow
  - [ ] Fix heading hierarchy
- **Fix Command**: `pnpm --filter @mindware-blog/site run test:accessibility`
- **Resources**: 
  - [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
  - [WebAIM](https://webaim.org/)
- **Target**: v1.1.1 (hotfix)

---

## 🎯 Action Plan

### Immediate (v1.1.1 - Hotfix)
1. Fix dashboard unit tests
2. Fix Playwright E2E tests
3. Address critical accessibility issues

### Short-term (v1.2.0)
1. Resolve linting issues in both apps
2. Fix dashboard build failures
3. Set up site unit tests
4. Add pre-commit hooks

### Long-term (v1.3.0)
1. Resolve all TypeScript errors
2. Achieve 70%+ test coverage
3. Implement stricter CI checks
4. Zero accessibility violations

---

## 📋 Contributing

When working on technical debt:

1. **Pick an Item**: Choose an issue from this document
2. **Create a Branch**: `fix/[issue-name]`
3. **Make Changes**: Fix the issue following best practices
4. **Test**: Ensure all tests pass locally
5. **Update Docs**: Update this document if issue is resolved
6. **Submit PR**: Link to this document in your PR description

---

## 🔄 Workflow Integration

This document is referenced by:
- `.github/workflows/ci.yml` - CI workflow with detailed error messages
- `.github/workflows/e2e-optimized.yml` - E2E testing workflow

When CI/CD checks fail, they point to this document for tracking and resolution steps.

---

## 📊 Progress Tracking

Use GitHub Projects or Issues to track progress on these items. Each major category should have:
- [ ] A parent tracking issue
- [ ] Child issues for specific problems
- [ ] Milestones assigned
- [ ] Owners assigned

---

_Last Updated: October 21, 2025_
_Version: 1.0.0_
_Maintainer: @jschibelli_

