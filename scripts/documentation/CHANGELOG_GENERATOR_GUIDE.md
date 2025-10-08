# Full Changelog Generator Guide

A comprehensive PowerShell script to generate a complete changelog from your entire git history.

## Quick Start

```powershell
# Generate a complete changelog with default settings
.\scripts\documentation\generate-full-changelog.ps1

# Preview what will be generated (dry run)
.\scripts\documentation\generate-full-changelog.ps1 -DryRun

# Generate with PR information included
.\scripts\documentation\generate-full-changelog.ps1 -IncludePRs
```

## Features

- ✅ **Complete History**: Generates changelog from entire git history
- ✅ **Multiple Formats**: Keep a Changelog, Simple, or Detailed
- ✅ **Smart Categorization**: Automatically categorizes commits by type (Added, Fixed, Changed, etc.)
- ✅ **Conventional Commits**: Supports conventional commit format
- ✅ **PR Integration**: Optional GitHub PR information integration
- ✅ **Statistics**: Provides detailed commit statistics
- ✅ **Flexible Filtering**: Filter by date range
- ✅ **Dry Run Mode**: Preview before generating

## Usage

### Basic Usage

```powershell
# Generate changelog to default location (CHANGELOG.md)
.\scripts\documentation\generate-full-changelog.ps1

# Specify output path
.\scripts\documentation\generate-full-changelog.ps1 -OutputPath "docs/COMPLETE_CHANGELOG.md"
```

### Format Options

The script supports three formats:

#### 1. Keep a Changelog (Default) - Recommended

```powershell
.\scripts\documentation\generate-full-changelog.ps1 -Format keepachangelog
```

**Output Structure:**
```markdown
# Changelog

## [2025-01] - 2025-01-15

### Added
- New feature implementation (#123)
- Component created (abc1234)

### Fixed
- Bug fix description (#124)

### Changed
- Updated configuration
```

**Best for:** Official project changelogs following industry standards

#### 2. Simple Format

```powershell
.\scripts\documentation\generate-full-changelog.ps1 -Format simple
```

**Output Structure:**
```markdown
# Changelog

## 2025-01-15

- **[abc1234]** Commit message - *Author Name*
- **[def5678]** Another commit - *Author Name*
```

**Best for:** Quick chronological overview

#### 3. Detailed Format

```powershell
.\scripts\documentation\generate-full-changelog.ps1 -Format detailed
```

**Output Structure:**
```markdown
# Detailed Changelog

## 2025-01-15

### Added

#### New feature implementation

- **Commit:** [abc1234](link)
- **Author:** John Doe <john@example.com>
- **Type:** Added
- **Details:**
  ```
  Full commit body with details
  ```
- **Pull Request:** [#123](link)
```

**Best for:** Comprehensive documentation with full commit details

### Date Filtering

```powershell
# Changes since a specific date
.\scripts\documentation\generate-full-changelog.ps1 -SinceDate "2024-01-01"

# Changes until a specific date
.\scripts\documentation\generate-full-changelog.ps1 -UntilDate "2024-12-31"

# Date range
.\scripts\documentation\generate-full-changelog.ps1 -SinceDate "2024-01-01" -UntilDate "2024-12-31"
```

### PR Integration

Include GitHub Pull Request information (requires GitHub CLI `gh`):

```powershell
.\scripts\documentation\generate-full-changelog.ps1 -IncludePRs
```

**Note:** This will fetch PR data from GitHub and link commits to their PRs. Requires the `gh` CLI tool to be installed and authenticated.

### Dry Run

Preview the changelog without writing to file:

```powershell
.\scripts\documentation\generate-full-changelog.ps1 -DryRun
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `-OutputPath` | string | `CHANGELOG.md` | Path where the changelog will be written |
| `-IncludePRs` | switch | `false` | Include GitHub PR information |
| `-GroupBy` | string | `date` | How to group commits: `commits`, `date`, `version`, `type` |
| `-Format` | string | `keepachangelog` | Output format: `keepachangelog`, `simple`, `detailed` |
| `-SinceDate` | string | `""` | Only include commits since this date (YYYY-MM-DD) |
| `-UntilDate` | string | `""` | Only include commits until this date (YYYY-MM-DD) |
| `-DryRun` | switch | `false` | Preview without writing file |

## Commit Type Detection

The script automatically categorizes commits based on:

### Conventional Commits

- `feat:` or `feature:` → **Added**
- `fix:` → **Fixed**
- `docs:` → **Documentation**
- `style:` → **Style**
- `refactor:` → **Changed**
- `perf:` or `performance:` → **Performance**
- `test:` → **Tests**
- `build:` → **Build**
- `ci:` → **CI/CD**
- `chore:` → **Chore**
- `revert:` → **Reverted**
- `security:` → **Security**

### Pattern Matching (for non-conventional commits)

- Contains "add", "implement", "create", "new" → **Added**
- Contains "fix", "bug", "issue", "error" → **Fixed**
- Contains "update", "change", "modify", "improve" → **Changed**
- Contains "remove", "delete" → **Removed**
- Contains "deprecat" → **Deprecated**
- Contains "security", "vulnerability" → **Security**
- Contains "doc", "readme", "guide" → **Documentation**

## Examples

### Example 1: Generate Complete Project Changelog

```powershell
# Navigate to project root
cd C:\Users\jschi\OneDrive\Desktop\2025_portfolio\portfolio-os

# Generate complete changelog with PRs
.\scripts\documentation\generate-full-changelog.ps1 -IncludePRs -Format keepachangelog

# Output: CHANGELOG.md created in root
```

### Example 2: Generate Changelog for Last Year

```powershell
# Changelog for 2024
.\scripts\documentation\generate-full-changelog.ps1 `
    -SinceDate "2024-01-01" `
    -UntilDate "2024-12-31" `
    -OutputPath "docs/CHANGELOG-2024.md" `
    -Format detailed
```

### Example 3: Preview Before Generating

```powershell
# See what will be generated
.\scripts\documentation\generate-full-changelog.ps1 -DryRun -IncludePRs

# Review the output, then generate for real
.\scripts\documentation\generate-full-changelog.ps1 -IncludePRs
```

### Example 4: Multiple Changelog Formats

```powershell
# Generate all three formats
.\scripts\documentation\generate-full-changelog.ps1 -Format keepachangelog -OutputPath "CHANGELOG.md"
.\scripts\documentation\generate-full-changelog.ps1 -Format simple -OutputPath "docs/CHANGELOG-SIMPLE.md"
.\scripts\documentation\generate-full-changelog.ps1 -Format detailed -OutputPath "docs/CHANGELOG-DETAILED.md"
```

## Statistics Output

The script provides detailed statistics during generation:

```
Commit Statistics:
  Total Commits: 523

  By Type:
    Added: 156 (29.8%)
    Fixed: 98 (18.7%)
    Changed: 142 (27.2%)
    Documentation: 45 (8.6%)
    ...

  Top Contributors:
    John Schibelli: 412 commits (78.8%)
    Contributor 2: 67 commits (12.8%)
    ...

  Date Range:
    First Commit: 2024-01-15
    Last Commit: 2025-10-08
```

## Output

### File Structure

The generated `CHANGELOG.md` will be placed in the root directory (or specified path) with:

- **Header**: Project information and format specification
- **Sections**: Organized by date/version
- **Categories**: Added, Changed, Fixed, etc.
- **Commit Details**: Short hash, message, author
- **PR Links**: (if `-IncludePRs` is used)
- **Footer**: Generation timestamp

### File Size

Typical file sizes:
- Small project (100 commits): ~10-20 KB
- Medium project (500 commits): ~50-100 KB
- Large project (1000+ commits): ~100-300 KB

## Requirements

### Required

- **Git**: Must be in a git repository
- **PowerShell**: 5.1 or later

### Optional

- **GitHub CLI (`gh`)**: Required only if using `-IncludePRs` flag
  - Install: `winget install GitHub.cli`
  - Authenticate: `gh auth login`

## Best Practices

### 1. Regular Updates

```powershell
# Generate monthly
.\scripts\documentation\generate-full-changelog.ps1 -SinceDate "2025-01-01"

# Append to existing changelog manually or automate
```

### 2. Version Tags

If you use git tags for versions:

```powershell
# After tagging a release
git tag v1.0.0
.\scripts\documentation\generate-full-changelog.ps1 -IncludePRs
git add CHANGELOG.md
git commit -m "docs: Update changelog for v1.0.0"
```

### 3. Pre-Release Review

```powershell
# Before major release
.\scripts\documentation\generate-full-changelog.ps1 -DryRun -IncludePRs -Format detailed

# Review and edit as needed
```

### 4. Conventional Commits

For best results, use conventional commits in your project:

```bash
git commit -m "feat: Add new portfolio component"
git commit -m "fix: Resolve navigation bug"
git commit -m "docs: Update API documentation"
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Update Changelog

on:
  release:
    types: [created]

jobs:
  changelog:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Fetch all history
      
      - name: Generate Changelog
        run: |
          .\scripts\documentation\generate-full-changelog.ps1 -IncludePRs
      
      - name: Commit Changelog
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add CHANGELOG.md
          git commit -m "docs: Update changelog for release"
          git push
```

## Troubleshooting

### Issue: "No git history found"

**Solution:** Ensure you're in a git repository with commits:
```powershell
git log --oneline  # Verify commits exist
```

### Issue: "Failed to fetch PR information"

**Solution:** Install and authenticate GitHub CLI:
```powershell
winget install GitHub.cli
gh auth login
```

Or run without `-IncludePRs`:
```powershell
.\scripts\documentation\generate-full-changelog.ps1
```

### Issue: Output file is too large

**Solution:** Use date filtering:
```powershell
# Only last 6 months
$sixMonthsAgo = (Get-Date).AddMonths(-6).ToString("yyyy-MM-dd")
.\scripts\documentation\generate-full-changelog.ps1 -SinceDate $sixMonthsAgo
```

### Issue: Commits not categorized correctly

**Solution:** The script uses pattern matching. For better results:
1. Use conventional commits going forward
2. Manually edit the generated changelog
3. Create custom categorization rules (modify script)

## Customization

### Modify Repository URL

Edit the script to change the GitHub repository URL:

```powershell
# Line ~190, ~290, ~380
# Change: https://github.com/jschibelli/portfolio-os
# To: https://github.com/your-username/your-repo
```

### Add Custom Categories

Edit the `Get-CommitType` function (lines 45-71) to add custom patterns:

```powershell
if ($Message -match "your-pattern") { return "Your-Category" }
```

### Change Section Order

Edit the `$typeOrder` array (line ~210):

```powershell
$typeOrder = @("Added", "Changed", "Fixed", "Your-Custom-Order")
```

## Related Scripts

- **docs-updater.ps1**: Update changelog for individual PRs
- **pr-automation scripts**: Automated PR management and documentation

## Support

For issues or questions:
1. Check this guide
2. Review the script comments
3. Check git history exists: `git log`
4. Try dry run mode first: `-DryRun`

## License

This script is part of the portfolio-os project and follows the same license.

---

**Generated with ❤️ by the Portfolio OS Documentation Team**

