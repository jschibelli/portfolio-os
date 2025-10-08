# Simple Release Guide

**TL;DR:** Just run one command when you're ready to launch each app. The script does everything for you.

---

## 🚀 When Portfolio Site is Ready

```powershell
.\scripts\project-management\release-app.ps1 -App site
```

**That's it!** This automatically:
- ✅ Updates site to v1.0.0
- ✅ Updates changelogs
- ✅ Creates git tag `v1.0.0-site`
- ✅ Pushes to GitHub
- ✅ Triggers release

---

## 📚 When Docs Site is Ready (Later)

```powershell
.\scripts\project-management\release-app.ps1 -App docs
```

**That's it!** This automatically:
- ✅ Updates docs to v1.0.0
- ✅ Updates changelogs
- ✅ Creates git tag `v1.0.0-docs`
- ✅ Pushes to GitHub
- ✅ Triggers release

---

## 🎛️ When Dashboard is Ready (Last)

```powershell
.\scripts\project-management\release-app.ps1 -App dashboard
```

**That's it!** This automatically:
- ✅ Updates dashboard to v1.0.0
- ✅ Updates changelogs
- ✅ Creates git tag `v1.0.0-dashboard`
- ✅ Pushes to GitHub
- ✅ Triggers release
- ✅ Bumps root version to v2.0.0 (complete platform!)

---

## 🧪 Want to Preview First?

Add `-DryRun` to see what will happen:

```powershell
.\scripts\project-management\release-app.ps1 -App site -DryRun
```

---

## 📋 What You Need to Track

### Individual App Status

| App | Current Version | Launch Version | Status | Command |
|-----|----------------|----------------|--------|---------|
| **Portfolio Site** | 0.9.0 | 1.0.0 | 🚧 Pre-launch | `release-app.ps1 -App site` |
| **Docs Site** | - | 1.0.0 | 📋 Planned | `release-app.ps1 -App docs` |
| **Dashboard** | 0.5.0 | 1.0.0 | 🔨 In Dev | `release-app.ps1 -App dashboard` |

### Each App Has Its Own Changelog

- `apps/site/CHANGELOG.md` - Portfolio site changes
- `apps/dashboard/CHANGELOG.md` - Dashboard changes  
- `apps/docs/CHANGELOG.md` - Docs site changes (when created)
- `CHANGELOG.md` - Overall platform milestones

**You don't need to edit these manually!** The script updates them automatically.

---

## 🎯 The Simple Mental Model

```
App Ready → Run Command → Everything Automated → Live! 🎉
```

No thinking about version numbers.  
No manual changelog updates.  
No git tag confusion.  
Just one command per app when ready.

---

## ❓ FAQ

### Q: What if I'm not sure if I'm ready?
**A:** Run with `-DryRun` to see what would happen:
```powershell
.\scripts\project-management\release-app.ps1 -App site -DryRun
```

### Q: Can I undo a release?
**A:** Yes, delete the tag and release from GitHub:
```powershell
gh release delete v1.0.0-site --yes
git tag -d v1.0.0-site
git push origin :refs/tags/v1.0.0-site
```

### Q: Do I need to update versions manually?
**A:** Nope! The script does it all automatically.

### Q: What happens to the root version?
**A:** It automatically increments based on what's been released:
- Site launches: Root stays 0.9.0
- Docs launches: Root goes to 0.9.5
- Dashboard launches: Root goes to 2.0.0 (complete platform!)

### Q: What if something fails?
**A:** The script will show clear error messages. Just fix the issue and run again.

---

## 🎉 Success Indicators

After running the command, you should see:

```
🎉 Release completed successfully!

Next steps:
  1. GitHub Action is running: https://github.com/jschibelli/portfolio-os/actions
  2. Release will appear at: https://github.com/jschibelli/portfolio-os/releases

Monitor progress:
  gh run list --workflow=release.yml
```

Then check:
- ✅ GitHub Actions ran successfully
- ✅ Release appears on GitHub releases page
- ✅ Version numbers updated in package.json files
- ✅ Changelogs updated

---

## 📞 Quick Reference

| I want to... | Command |
|-------------|---------|
| Launch portfolio site | `.\scripts\project-management\release-app.ps1 -App site` |
| Launch docs site | `.\scripts\project-management\release-app.ps1 -App docs` |
| Launch dashboard | `.\scripts\project-management\release-app.ps1 -App dashboard` |
| Preview first | Add `-DryRun` to any command |
| Check releases | `gh release list` |
| Check GitHub Actions | `gh run list --workflow=release.yml` |

---

**Remember:** One command per app. That's it. Everything else is automated. 🚀

*For detailed technical information, see `docs/RELEASE_GUIDE.md`*

