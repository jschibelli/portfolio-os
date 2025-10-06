# Issue Management Scripts

This directory contains PowerShell scripts and documentation for managing GitHub issues in the Portfolio OS project. Files are organized by their functional purpose rather than file type.

## 📁 Directory Structure

```
scripts/issue-management/
├── analysis/           # Issue analysis tools
│   ├── analyze-issues.ps1
│   └── analyze-stale-issues.ps1
├── configuration/      # Issue configuration tools
│   ├── configure-issue-auto.ps1
│   └── configure-issues-unified.ps1
├── implementation/     # Issue implementation tools
│   └── implement-issues.ps1
├── management/         # Queue and pipeline management
│   ├── manage-issue-queue.ps1
│   └── run-issue-pipeline.ps1
└── README.md          # Complete documentation
```

### 🔍 Analysis (`analysis/`)
Scripts for analyzing issues and identifying patterns:

- **`analyze-issues.ps1`** - Comprehensive issue analysis with AI-powered requirements extraction
- **`analyze-stale-issues.ps1`** - Identifies stale, old, or inactive issues that need attention

### ⚙️ Configuration (`configuration/`)
Scripts for configuring issue properties and project fields:

- **`configure-issue-auto.ps1`** - Auto-configuration script for setting issue priority, size, app, area, etc.
- **`configure-issues-unified.ps1`** - Unified configuration system with presets and AI recommendations

### 🚀 Implementation (`implementation/`)
Scripts for implementing issues and managing the development workflow:

- **`implement-issues.ps1`** - Complete issue implementation system with analysis, planning, execution, and validation

### 📊 Management (`management/`)
Scripts for managing issue queues and processing pipelines:

- **`manage-issue-queue.ps1`** - Queue management system for prioritized issue processing
- **`run-issue-pipeline.ps1`** - Continuous issue pipeline for automated processing


## 🧹 Recent Cleanup

This folder was recently reorganized using an intelligent cleanup script that:

- ✅ **Removed 13 redundant files** that duplicated functionality
- ✅ **Organized by function** rather than file extension
- ✅ **Kept the most comprehensive** version of each script type
- ✅ **Preserved unique functionality** across all remaining files

### Files Removed (Redundant):
- 6 issue comment/implementation documentation files (should have been cleaned up)
- 4 redundant configuration scripts (kept `configure-issue-auto.ps1`)
- 2 redundant implementation scripts (kept `implement-issues.ps1`)
- 1 redundant unified configuration script

## 🚀 Usage Examples

### Analyze Issues
```powershell
# Analyze a specific issue
.\analysis\analyze-issues.ps1 -IssueNumber 250 -GeneratePlan

# Find stale issues
.\analysis\analyze-stale-issues.ps1
```

### Configure Issues
```powershell
# Auto-configure an issue
.\configuration\configure-issue-auto.ps1 -IssueNumber 250 -Priority P1 -Size M -App "Portfolio Site"

# Use unified configuration with presets
.\configuration\configure-issues-unified.ps1 -IssueNumber 250 -Preset blog -EnableAI
```

### Implement Issues
```powershell
# Full implementation workflow
.\implementation\implement-issues.ps1 -IssueNumber 250 -Mode auto -Interactive
```

### Manage Queues
```powershell
# Start queue processing
.\management\manage-issue-queue.ps1

# Run continuous pipeline
.\management\run-issue-pipeline.ps1 -MaxIssues 5 -Watch
```

## 📋 Dependencies

These scripts require:
- **GitHub CLI** (`gh`) - For issue and project management
- **PowerShell 7+** - For script execution
- **Portfolio OS Project** - Must be run from project root

## 🔧 Configuration

Most scripts use the Portfolio OS project configuration:
- **Project ID**: `PVT_kwHOAEnMVc4BCu-c`
- **Default User**: `jschibelli`
- **Base Branch**: `develop`

## 📈 Future Improvements

- Add more AI-powered analysis features
- Implement issue template automation
- Add performance metrics tracking
- Create issue dependency mapping
- Add automated testing integration

---

*Last updated: 2025-10-06 - After intelligent cleanup and reorganization*
