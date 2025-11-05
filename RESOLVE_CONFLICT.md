# Resolving vercel.json Merge Conflict

## Quick Resolution

Run these commands:

```bash
# 1. Make sure you're on develop
git checkout develop

# 2. Pull latest main
git fetch origin main

# 3. Try to merge main into develop
git merge origin/main

# 4. You'll see the conflict. Open apps/dashboard/vercel.json and keep this version:
```

```json
{
  "buildCommand": "cd ../.. && pnpm --filter @mindware-blog/db prisma generate && pnpm turbo run build --filter=@mindware-blog/dashboard...",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

```bash
# 5. Stage the resolved file
git add apps/dashboard/vercel.json

# 6. Complete the merge
git commit -m "chore: resolve vercel.json conflict - keep Prisma generate fix"

# 7. Push
git push origin develop
```

## Why Keep the Develop Version?

The develop version includes `prisma generate` which fixes the 500 AUTH error. Without it:
- ❌ Prisma Client isn't generated
- ❌ Auth routes crash
- ❌ Returns HTML error instead of JSON
- ❌ Login fails

With it:
- ✅ Prisma Client generated before build
- ✅ Auth routes work
- ✅ JSON responses
- ✅ Login works!

