# Quick Documentation Update Guide

**For updating documentation, version, and changelog after new features**

---

## 🚀 **Quick Start - One Command Solution**

### For Your Current Chatbot & Booking Features:

```powershell
# Preview what will be updated (recommended first)
.\scripts\documentation\update-docs-chatbot-booking.ps1 -DryRun

# Apply all documentation updates
.\scripts\documentation\update-docs-chatbot-booking.ps1
```

**This single script:**
- ✅ Updates `apps/site/CHANGELOG.md` with v1.1.0 entry
- ✅ Creates/updates root `CHANGELOG.md`
- ✅ Updates version to 1.1.0 in package.json files
- ✅ Creates feature documentation in `docs/features/`
- ✅ Updates documentation index

---

## 📚 **All Available Documentation Scripts**

### 1. **Custom Feature Update** (NEW!)
**File:** `scripts/documentation/update-docs-chatbot-booking.ps1`

**Use When:** Updating docs for chatbot and booking features

```powershell
# Dry run first
.\scripts\documentation\update-docs-chatbot-booking.ps1 -DryRun

# Apply changes
.\scripts\documentation\update-docs-chatbot-booking.ps1
```

---

### 2. **Full Changelog Generator**
**File:** `scripts/documentation/generate-full-changelog.ps1`

**Use When:** Generating complete changelog from entire git history

```powershell
# Preview changelog
.\scripts\documentation\generate-full-changelog.ps1 -DryRun

# Generate full changelog with PRs
.\scripts\documentation\generate-full-changelog.ps1 -IncludePRs

# Generate for specific date range
.\scripts\documentation\generate-full-changelog.ps1 -SinceDate "2025-10-01"

# Generate for specific app
.\scripts\documentation\generate-full-changelog.ps1 -OutputPath "apps/site/CHANGELOG.md"
```

**Options:**
- `-DryRun` - Preview without making changes
- `-IncludePRs` - Include PR links (requires `gh` CLI)
- `-Format` - Choose format: `keepachangelog` (default), `simple`, or `detailed`
- `-SinceDate` - Only commits since date (YYYY-MM-DD)
- `-UntilDate` - Only commits until date (YYYY-MM-DD)
- `-OutputPath` - Where to write changelog

---

### 3. **PR Documentation Updater**
**File:** `scripts/core-utilities/docs-updater.ps1`

**Use When:** Updating docs for a specific PR

```powershell
# Update docs for PR #333
.\scripts\core-utilities\docs-updater.ps1 -PRNumber 333 -UpdateChangelog -GenerateDocs

# Just update changelog
.\scripts\core-utilities\docs-updater.ps1 -PRNumber 333 -UpdateChangelog

# Just update README
.\scripts\core-utilities\docs-updater.ps1 -PRNumber 333 -UpdateReadme

# Dry run
.\scripts\core-utilities\docs-updater.ps1 -PRNumber 333 -GenerateDocs -DryRun
```

**Options:**
- `-PRNumber` - PR number to process
- `-UpdateChangelog` - Update CHANGELOG.md
- `-UpdateReadme` - Update README.md
- `-GenerateDocs` - Generate all documentation
- `-DryRun` - Preview without changes

---

### 4. **App Release Manager**
**File:** `scripts/project-management/release-app.ps1`

**Use When:** Ready to release an app with version bump

```powershell
# Preview release
.\scripts\project-management\release-app.ps1 -App site -DryRun

# Release portfolio site
.\scripts\project-management\release-app.ps1 -App site

# Release with custom message
.\scripts\project-management\release-app.ps1 -App site -Message "Chatbot & Booking Launch"
```

**Options:**
- `-App` - Which app: `site`, `dashboard`, `docs`, or `root`
- `-Message` - Custom release message
- `-DryRun` - Preview without changes

**What it does:**
- Updates version numbers
- Updates changelogs
- Creates git tag
- Pushes to GitHub
- Triggers release workflow

---

## 🎯 **Recommended Workflow**

### Option A: Quick Update (Recommended for your case)

```powershell
# 1. Preview changes
.\scripts\documentation\update-docs-chatbot-booking.ps1 -DryRun

# 2. Apply changes
.\scripts\documentation\update-docs-chatbot-booking.ps1

# 3. Review and commit
git add .
git commit -m "docs: Update documentation for v1.1.0 - Chatbot & Booking features"
git push
```

---

### Option B: Full Release Process

```powershell
# 1. Update documentation
.\scripts\documentation\update-docs-chatbot-booking.ps1

# 2. Commit documentation changes
git add .
git commit -m "docs: Update documentation for v1.1.0"
git push

# 3. Create release (updates version, creates tag, triggers CI/CD)
.\scripts\project-management\release-app.ps1 -App site
```

---

### Option C: Manual Control

```powershell
# 1. Generate changelog from recent changes
.\scripts\documentation\generate-full-changelog.ps1 -SinceDate "2025-10-01" -IncludePRs

# 2. Update docs for each major PR
.\scripts\core-utilities\docs-updater.ps1 -PRNumber 333 -GenerateDocs
.\scripts\core-utilities\docs-updater.ps1 -PRNumber 336 -GenerateDocs

# 3. Manually edit CHANGELOG.md to organize entries

# 4. Update version in package.json manually

# 5. Commit and push
git add .
git commit -m "docs: Update for v1.1.0"
git push
```

---

## 📝 **What Gets Updated**

### Changelog Files
- `CHANGELOG.md` - Root/platform changelog (created if missing)
- `apps/site/CHANGELOG.md` - Portfolio site changes
- `apps/dashboard/CHANGELOG.md` - Dashboard changes
- `apps/docs/CHANGELOG.md` - Docs site changes

### Version Files
- `package.json` - Root package version
- `apps/site/package.json` - Site app version
- `apps/dashboard/package.json` - Dashboard version
- `apps/docs/package.json` - Docs version

### Documentation Files
- `docs/features/` - Feature-specific documentation
- `docs/DOCUMENTATION_INDEX.md` - Updated index
- `docs/generated/` - Auto-generated API/component docs

---

## 🔍 **Comparison: Which Script to Use?**

| Scenario | Script to Use | Command |
|----------|---------------|---------|
| **Update docs for chatbot & booking** | Custom script | `update-docs-chatbot-booking.ps1` |
| **Generate full project changelog** | Changelog generator | `generate-full-changelog.ps1` |
| **Update docs for specific PR** | PR updater | `docs-updater.ps1 -PRNumber XXX` |
| **Create official release** | Release manager | `release-app.ps1 -App site` |
| **Quick version bump only** | Manual edit | Edit `package.json` |

---

## ⚡ **Pro Tips**

### 1. Always Use Dry Run First
```powershell
# See what will happen without making changes
.\scripts\documentation\update-docs-chatbot-booking.ps1 -DryRun
```

### 2. Use PR Numbers for Traceability
```powershell
# Link changes to PRs
.\scripts\core-utilities\docs-updater.ps1 -PRNumber 333 -GenerateDocs
```

### 3. Include PR Links in Changelog
```powershell
# Makes changelog more useful
.\scripts\documentation\generate-full-changelog.ps1 -IncludePRs
```

### 4. Generate Multiple Formats
```powershell
# Different formats for different audiences
.\scripts\documentation\generate-full-changelog.ps1 -Format keepachangelog  # Official
.\scripts\documentation\generate-full-changelog.ps1 -Format simple  # Quick overview
.\scripts\documentation\generate-full-changelog.ps1 -Format detailed  # Full details
```

### 5. Use Date Filters for Incremental Updates
```powershell
# Only recent changes
$lastMonth = (Get-Date).AddMonths(-1).ToString("yyyy-MM-dd")
.\scripts\documentation\generate-full-changelog.ps1 -SinceDate $lastMonth
```

---

## 🐛 **Troubleshooting**

### Script Not Found
```powershell
# Check current directory
Get-Location

# Should be in project root
cd C:\Users\jschi\OneDrive\Desktop\2025_portfolio\portfolio-os
```

### GitHub CLI Not Available
```powershell
# Install GitHub CLI
winget install GitHub.cli

# Authenticate
gh auth login

# Verify
gh auth status
```

### Permission Denied
```powershell
# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Changes Not Applied
- Check if `-DryRun` flag is set (remove it to apply)
- Verify file permissions
- Check git status for conflicts

---

## 📊 **Documentation Structure**

```
portfolio-os/
├── CHANGELOG.md                          # Root changelog (platform-wide)
├── package.json                          # Root version
├── apps/
│   ├── site/
│   │   ├── CHANGELOG.md                  # Site-specific changelog
│   │   └── package.json                  # Site version
│   ├── dashboard/
│   │   ├── CHANGELOG.md                  # Dashboard changelog
│   │   └── package.json                  # Dashboard version
│   └── docs/
│       ├── CHANGELOG.md                  # Docs changelog
│       └── package.json                  # Docs version
├── docs/
│   ├── features/                         # Feature documentation
│   │   ├── chatbot-v1.1.0.md
│   │   └── booking-system.md
│   ├── DOCUMENTATION_INDEX.md            # Main documentation index
│   └── generated/                        # Auto-generated docs
└── scripts/
    ├── documentation/
    │   ├── generate-full-changelog.ps1
    │   └── update-docs-chatbot-booking.ps1
    ├── core-utilities/
    │   └── docs-updater.ps1
    └── project-management/
        └── release-app.ps1
```

---

## 🎯 **For Your Current Situation**

You mentioned needing to update docs for **chatbot** and **booking** features. Here's exactly what to do:

```powershell
# Step 1: Preview the updates (see what will change)
.\scripts\documentation\update-docs-chatbot-booking.ps1 -DryRun

# Step 2: Review the preview output, then apply
.\scripts\documentation\update-docs-chatbot-booking.ps1

# Step 3: Review the changes
git status
git diff

# Step 4: Commit the changes
git add .
git commit -m "docs: Add v1.1.0 documentation for chatbot and booking features"
git push

# Optional Step 5: Create a release
.\scripts\project-management\release-app.ps1 -App site
```

**That's it! The script handles:**
- ✅ Version bump to 1.1.0
- ✅ CHANGELOG updates
- ✅ Feature documentation
- ✅ Documentation index

---

## 📚 **More Resources**

- **Changelog Guide:** `scripts/documentation/CHANGELOG_GENERATOR_GUIDE.md`
- **Release Guide:** `docs/SIMPLE_RELEASE_GUIDE.md`
- **Full Documentation:** `docs/DOCUMENTATION_INDEX.md`
- **Developer Tutorial:** `scripts/documentation/DEVELOPER_TUTORIAL.md`

---

*Last updated: 2025-10-21*

