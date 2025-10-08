# Your Release Workflow - Dead Simple

## The One Thing You Need to Remember

When an app is ready to launch, run ONE command:

```powershell
.\scripts\project-management\release-app.ps1 -App <app-name>
```

That's it. Everything else is automatic.

---

## Your Three Launches

### 1. Portfolio Site (First Launch)

```powershell
# When portfolio site is ready
.\scripts\project-management\release-app.ps1 -App site
```

**What happens automatically:**
- ✅ Site → v1.0.0
- ✅ Root → stays 0.9.0
- ✅ Tag: `v1.0.0-site`
- ✅ Both CHANGELOG.md files updated
- ✅ GitHub release created

---

### 2. Docs Site (Second Launch - When Ready)

```powershell
# When docs site is ready  
.\scripts\project-management\release-app.ps1 -App docs
```

**What happens automatically:**
- ✅ Docs → v1.0.0
- ✅ Root → bumps to 0.9.5
- ✅ Tag: `v1.0.0-docs`
- ✅ All CHANGELOG.md files updated
- ✅ GitHub release created

---

### 3. Dashboard (Final Launch - Complete Platform)

```powershell
# When dashboard is ready
.\scripts\project-management\release-app.ps1 -App dashboard
```

**What happens automatically:**
- ✅ Dashboard → v1.0.0
- ✅ Root → bumps to 2.0.0 (COMPLETE PLATFORM!)
- ✅ Tag: `v1.0.0-dashboard`
- ✅ All CHANGELOG.md files updated
- ✅ GitHub release created

---

## What You Have Now

### ✅ Automated
- Changelogs per app (`apps/site/CHANGELOG.md`, `apps/dashboard/CHANGELOG.md`)
- Root changelog (`CHANGELOG.md`) for platform milestones
- Version management (no thinking required)
- Git tagging (automatic)
- GitHub releases (automatic)

### ✅ Tracked
Each app has its own changelog:
- `apps/site/CHANGELOG.md` - Portfolio site history
- `apps/dashboard/CHANGELOG.md` - Dashboard history
- `CHANGELOG.md` - Overall platform milestones

### ✅ Simple
One command per app. No version numbers to remember.

---

## Pre-Launch Checklist (Per App)

Before running the release command:

```powershell
# 1. Make sure everything is committed
git status

# 2. Preview what will happen
.\scripts\project-management\release-app.ps1 -App site -DryRun

# 3. If it looks good, run for real
.\scripts\project-management\release-app.ps1 -App site
```

---

## Current Status

| App | Version | Status | Ready to Launch? |
|-----|---------|--------|------------------|
| Portfolio Site | 0.9.0 | Pre-launch | When you say so |
| Dashboard | 0.5.0 | In development | Not yet |
| Docs Site | - | Not created | Not yet |

---

## What Happens After You Run It

1. Script updates all versions
2. Script updates all changelogs  
3. Script commits changes
4. Script creates git tag
5. Script pushes to GitHub
6. GitHub Action runs
7. Release appears on GitHub
8. Done! 🎉

---

## Monitoring

```powershell
# Check if release workflow is running
gh run list --workflow=release.yml

# View your releases
gh release list

# View specific release
gh release view v1.0.0-site --web
```

---

## If You Need to Test First

```powershell
# Always safe to run dry run
.\scripts\project-management\release-app.ps1 -App site -DryRun
```

This shows you exactly what would happen without making any changes.

---

## The Mental Model

```
App Ready
    ↓
Run Command  
    ↓
Everything Automated
    ↓
Live on GitHub! 🎉
```

No version number decisions.  
No changelog writing.  
No git tag commands.  
Just: `release-app.ps1 -App <name>`

---

## Files Created

1. **Release Scripts**
   - `scripts/project-management/release-app.ps1` - The magic script
   - `scripts/project-management/create-release.ps1` - Advanced manual control
   
2. **Changelogs**
   - `apps/site/CHANGELOG.md` - Site history
   - `apps/dashboard/CHANGELOG.md` - Dashboard history
   - `CHANGELOG.md` - Platform milestones

3. **Documentation**
   - `docs/SIMPLE_RELEASE_GUIDE.md` - Quick reference
   - `docs/RELEASE_GUIDE.md` - Detailed technical guide
   - `docs/YOUR_RELEASE_WORKFLOW.md` - This file!

4. **GitHub Workflow**
   - `.github/workflows/release.yml` - Automatic release creation

---

## Questions?

**Q: When should I run this?**  
A: When your app is 100% ready to go live.

**Q: Can I undo it?**  
A: Yes, delete the tag and release from GitHub.

**Q: What if I'm not sure?**  
A: Run with `-DryRun` first to see what happens.

**Q: Do I need to update changelogs manually?**  
A: Nope! Automatic.

**Q: Do I need to remember version numbers?**  
A: Nope! Automatic.

**Q: What about the root version?**  
A: Automatic based on what's been released.

---

**Remember: You have three simple commands, one for each app launch. That's it!** 🚀

---

*Last updated: October 8, 2025*

