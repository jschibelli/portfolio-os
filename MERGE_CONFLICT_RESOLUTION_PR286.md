# Merge Conflict Resolution Guide for PR #286

## Conflict Location
`apps/site/lib/env-validation.ts`

## Why This Conflict Exists
The `main` branch has an older version of `env-validation.ts` with:
- Unicode characters in error messages (emojis, box-drawing characters)
- Direct environment variable loading (causes build hangs)
- Non-lazy feature flags (triggers validation at import time)

The `develop` branch has improvements:
- ASCII characters only (better Windows compatibility)
- Lazy-loaded environment validation (prevents build hangs)
- Lazy-loaded feature flags (prevents premature validation)

## Resolution Strategy
**Keep ALL changes from `develop` (HEAD)**. The develop version includes critical fixes for:
1. Build hangs on Windows
2. JSDoc syntax errors  
3. Better error messaging without Unicode issues

## Conflicts to Resolve

### Conflict #1: Error Message Format (lines 151-203)
**Choose:** develop version (HEAD) - ASCII characters without Unicode

```typescript
// Keep this (develop/HEAD):
console.error('Environment validation failed:');
console.error('================================================================');
error.errors.forEach((err) => {
  console.error(`  - ${err.path.join('.')}: ${err.message}`);
});
```

**Reject:** main version with Unicode characters (❌, ━, ✗, 📋, ┌, │, ├, └, •, 💡)

### Conflict #2: Environment Helper Functions (lines 237-245)
**Choose:** develop version (HEAD) - Uses `process.env` directly

```typescript
// Keep this (develop/HEAD):
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isTest = process.env.NODE_ENV === 'test';
```

**Reject:** main version that uses `env.NODE_ENV` (would trigger lazy loading)

### Conflict #3: Feature Flags (lines 262-312)
**Choose:** develop version (HEAD) - Lazy-loaded Proxy

```typescript
// Keep this (develop/HEAD):
export const features = new Proxy({} as any, {
  get(target, prop) {
    const e = getEnv();
    switch (prop) {
      case 'googleCalendar':
        return Boolean(e.GOOGLE_CLIENT_ID && ...);
      case 'email':
        return Boolean(e.RESEND_API_KEY && e.EMAIL_FROM);
      // ... rest of cases
    }
  }
});
```

**Reject:** main version with direct object (would trigger validation at module load)

## How to Resolve on GitHub

1. When merging PR #286, GitHub will show conflicts
2. Click "Resolve conflicts" button
3. For each conflict marker, keep the HEAD (develop) version:
   - Remove `<<<<<<< HEAD` marker
   - Keep the code after it (until `=======`)
   - Remove everything from `=======` to `>>>>>>>` (including the closing marker)
4. Click "Mark as resolved"
5. Commit the merge

## Why These Changes Matter

### Build Hang Fix
The lazy-loading prevents Prisma and environment validation from running during Next.js build time, which was causing infinite hangs.

### Windows Compatibility
ASCII characters prevent terminal encoding issues on Windows systems.

### Performance
Lazy evaluation means validation only runs when actually needed, not at every module import.

## Test After Merge

After merging, verify:
1. ✅ `npm run build` completes successfully
2. ✅ Vercel preview builds and deploys
3. ✅ Contact form works in preview
4. ✅ No console errors about environment variables

## Related Commits

- `9ade900` - JSDoc syntax fix
- `2637be3` - Lazy-loaded Prisma and env validation  
- `886cc48` - CR-GPT review feedback addressed
- `84dd537` - Previous merge conflict resolution

## Summary

**Resolution**: Accept ALL changes from `develop` (HEAD) branch. Reject all changes from `main` branch for this file.

The develop version includes critical fixes that prevent build hangs and improve Windows compatibility.

