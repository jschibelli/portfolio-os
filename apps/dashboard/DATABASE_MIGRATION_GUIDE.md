# Database Migration Guide

This guide will help you migrate your database to include the new Comment model and update your dashboard to use the latest features.

---

## Prerequisites

- Node.js 18+ installed
- pnpm installed
- Dashboard environment variables configured

---

## Step 1: Backup Your Current Database (Recommended)

```bash
# If using SQLite (development)
cp apps/dashboard/prisma/dev.db apps/dashboard/prisma/dev.db.backup

# If using PostgreSQL (production)
# Use your database provider's backup tool
```

---

## Step 2: Run Database Migration

### Option A: Using Prisma Migrate (Recommended)

```bash
cd apps/dashboard

# Create and apply migration
pnpm db:migrate

# This will:
# - Create a new migration file
# - Add the Comment table
# - Update Article relations
# - Apply indexes
```

### Option B: Using Prisma Push (Development Only)

```bash
cd apps/dashboard

# Push schema changes to database
pnpm db:push

# Warning: This doesn't create migration history
# Only use for development databases
```

---

## Step 3: Verify Migration

```bash
# Open Prisma Studio to verify
pnpm db:studio

# Check that these tables exist:
# - Comment (NEW)
# - Article (should have comments relation)
# - Tag (existing)
# - ImageAsset (existing)
# - User (existing)
```

---

## Step 4: Restart Dashboard

```bash
# Start the dashboard
pnpm --filter dashboard dev

# Visit: http://localhost:3003
```

---

## Step 5: Test New Features

1. **Comments System**
   - Navigate to `/admin/comments`
   - Should show empty list (not demo data)
   - Try creating a test comment

2. **Tags**
   - Navigate to `/admin/tags`
   - Should show existing tags with real article counts

3. **Media Library**
   - Navigate to `/admin/media`
   - Upload a test image
   - Verify it appears in the list

4. **Analytics**
   - Navigate to `/admin/analytics`
   - Should see "Database Analytics Mode" badge (if GA not configured)
   - Or "Connected to Google Analytics" (if GA configured)

---

## Troubleshooting

### Error: "Prisma Client not found"

```bash
# Regenerate Prisma client
pnpm --filter dashboard db:generate
```

### Error: "Table Comment does not exist"

```bash
# Reset database and reapply schema
pnpm --filter dashboard db:push --force-reset

# Warning: This deletes all data!
```

### Error: "Migration failed"

```bash
# Check migration status
npx prisma migrate status

# Resolve migration issues
npx prisma migrate resolve

# Then try again
pnpm db:migrate
```

### Error: "BLOB_READ_WRITE_TOKEN not found"

1. Go to https://vercel.com/dashboard
2. Select your project
3. Navigate to Storage > Blob
4. Copy the Read/Write token
5. Add to `.env.local`:
   ```env
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```

---

## What Changed in the Database

### New Tables

**Comment**
- `id` (String, PK)
- `articleId` (String, FK to Article)
- `author` (String)
- `email` (String)
- `content` (String)
- `status` (String, default: "pending")
- `parentId` (String, nullable, FK to Comment)
- `likes` (Int, default: 0)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Updated Tables

**Article**
- Added `comments` relation (one-to-many)

### Indexes Added
- `Comment.articleId`
- `Comment.status`
- `Comment.createdAt`

---

## Production Deployment

### 1. Push Schema Changes

```bash
# In your CI/CD pipeline or manually
pnpm --filter dashboard db:migrate deploy
```

### 2. Verify Environment Variables

Make sure your production environment has:
- `DATABASE_URL` (PostgreSQL connection string)
- `BLOB_READ_WRITE_TOKEN`
- `AUTH_SECRET`
- `ADMIN_PASSWORD_HASH`
- (Optional) `GOOGLE_ANALYTICS_PROPERTY_ID`
- (Optional) `GOOGLE_ANALYTICS_ACCESS_TOKEN`

### 3. Restart Application

```bash
# Vercel will auto-restart on deploy
# Or manually restart your hosting service
```

---

## Rollback Instructions

If you need to rollback:

### SQLite (Development)

```bash
# Restore from backup
cp apps/dashboard/prisma/dev.db.backup apps/dashboard/prisma/dev.db
```

### PostgreSQL (Production)

```bash
# Revert migration
npx prisma migrate resolve --rolled-back <migration_name>

# Or restore from database backup
# Use your database provider's restore tool
```

---

## FAQ

**Q: Will this break my existing data?**  
A: No, all changes are additive. Existing tables are not modified.

**Q: Do I need Google Analytics?**  
A: No, the dashboard will use database metrics as a fallback.

**Q: What if migration fails?**  
A: Check the error message, ensure DATABASE_URL is correct, and try `pnpm db:push` instead.

**Q: Can I skip the migration?**  
A: The dashboard will still work, but the Comments page won't function.

**Q: How do I add demo data?**  
A: Create a few articles manually, upload some images, and the dashboard will show real stats.

---

## Success Indicators

After migration, you should see:

✅ Dashboard loads without errors  
✅ Comments page shows empty list (or existing comments)  
✅ Tags show real article counts  
✅ Media library shows uploaded files  
✅ Analytics shows "Database Analytics Mode" or "Connected to Google Analytics"  
✅ Toast notifications appear on actions  
✅ No console errors

---

## Need Help?

- Check `apps/dashboard/DASHBOARD_AUDIT_SUMMARY.md` for architecture overview
- Review `apps/dashboard/env.template` for configuration options
- Check console logs for specific error messages
- Ensure all environment variables are set correctly

---

**Migration completed successfully!** 🎉

Your dashboard is now fully operational with real database connections.






