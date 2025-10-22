# TypeScript Fixes TODO - Follow-up Tasks

## Issue #344 Status
✅ **Completed**: Reduced from 150+ to 59 errors (61% reduction)
⚠️ **Remaining**: 59 errors to be addressed in follow-up PRs

---

## Immediate Action Items

### 1. Install Missing Dependency (Priority: HIGH)
**Package**: `@hello-pangea/dnd` (drag-and-drop library)
**Used in**: `apps/dashboard/components/content-blocks/BlockEditor.tsx`

```bash
pnpm add @hello-pangea/dnd
```

**Impact**: Will fix ~3 import errors

---

## Follow-up Issues to Create

### Issue: Fix Publishing Service TypeScript Errors (~10 errors)
**Priority**: Medium
**Files affected**:
- `lib/publishing/service.ts`
- `lib/publishing/adapters/hashnode.ts`

**Problems**:
- Missing Prisma models: `publishingStatus`, `publishingQueue`
- Undefined `prisma` imports in hashnode adapter

**Options**:
1. Complete publishing service implementation
2. Comment out incomplete code
3. Add models to Prisma schema

---

### Issue: Fix Auth Type Extensions (~6 errors)
**Priority**: Medium
**Files affected**:
- `lib/auth.ts`

**Problems**:
- Missing `role` property on User type
- Missing `id` property on session.user
- NextAuth module augmentation needed

**Solution**: Add proper module augmentation:
```typescript
declare module "next-auth" {
  interface User {
    id: string
    role: string
  }
  interface Session {
    user: User & {
      id: string
      role: string
    }
  }
}
```

---

### Issue: Fix Block Editor Type Refinements (~8 errors)
**Priority**: Low
**Files affected**:
- `components/content-blocks/BlockEditor.tsx`
- `components/content-blocks/CTABlock.tsx`

**Problems**:
- Type mismatches in block data structures
- Implicit `any` types in drag-drop callbacks
- String undefined handling

**Solution**: Refine ContentBlock types and add proper drag-drop types

---

### Issue: Fix Markdown Converter Types (~3 errors)
**Priority**: Low
**Files affected**:
- `lib/editor/markdownConverter.ts`

**Problems**:
- `strike` not in HTMLElementTagNameMap
- Filter function return type
- ReplacementFunction parameter types

**Solution**: Add proper Turndown type definitions or type assertions

---

### Issue: Fix Publication Route (~3 errors)
**Priority**: Low
**Files affected**:
- `app/api/public/publication/route.ts`

**Problems**:
- Missing Prisma `setting` model
- Implicit `any` types in reduce callback

**Solution**: 
1. Add `setting` model to Prisma or
2. Remove/refactor publication settings endpoint

---

### Issue: Fix Publishing Dashboard Types (~2 errors)
**Priority**: Low
**Files affected**:
- `components/publishing/PublishingDashboard.tsx`

**Problems**:
- PublishingPlatform type mismatch

**Solution**: Update platform configuration types

---

### Issue: Fix Scalability Config Types (~2 errors)
**Priority**: Low
**Files affected**:
- `lib/scalability-config.ts`

**Problems**:
- Config type merging issues

**Solution**: Refactor config type intersection

---

## Test File Improvements (NON-BLOCKING)

### Jest Matcher Types (~7 errors)
**Priority**: Low (doesn't affect production)
**Files affected**:
- `__tests__/dashboard.test.tsx`
- `__tests__/EditorToolbar.test.tsx`

**Note**: Test file errors are now excluded from production type-check.
Can be addressed when improving test coverage.

---

## Long-term Improvements

1. **Enable stricter TypeScript options**:
   - `strictNullChecks: true`
   - `strictFunctionTypes: true`
   - `noImplicitAny: true`

2. **Replace all `any` types** with proper interfaces

3. **Add comprehensive test coverage** with proper type definitions

4. **Document all API types** in centralized type definition files

5. **Set up pre-commit hooks** to prevent new type errors

---

## Commands Reference

### Check remaining errors
```bash
npx tsc --noEmit --project ./apps/dashboard/tsconfig.json
```

### Count errors
```bash
npx tsc --noEmit --project ./apps/dashboard/tsconfig.json 2>&1 | Select-String "error TS" | Measure-Object -Line
```

### Check specific file
```bash
npx tsc --noEmit apps/dashboard/path/to/file.ts
```

---

## Progress Tracking

- [x] API Route handlers fixed
- [x] Prisma model references fixed
- [x] Component type definitions improved
- [x] Test setup created
- [x] Test files excluded from production build
- [ ] Missing dependency installed
- [ ] Publishing service types fixed
- [ ] Auth types extended
- [ ] Block editor types refined
- [ ] All remaining errors resolved

---

**Last Updated**: TypeScript fixes for Issue #344
**Current Error Count**: 52 production + 7 test = 59 total
**Target**: 0 errors

