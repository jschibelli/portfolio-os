# Portfolio OS House Cleaning Guide

## Overview

The Portfolio OS house cleaning system provides comprehensive maintenance and organization tools for the development branch. It ensures the codebase remains clean, organized, and maintainable.

## 🧹 **House Cleaning Scripts**

### **Basic House Cleaning** (`scripts/utilities/house-cleaning.ps1`)
Essential maintenance and organization tasks for daily development.

### **Advanced House Cleaning** (`scripts/automation/advanced-house-cleaning.ps1`)
Comprehensive analysis and deep cleaning with security and performance checks.

## 🚀 **Quick Start**

### **Basic House Cleaning**
```powershell
# Full house cleaning (recommended)
.\scripts\utilities\house-cleaning.ps1 -Mode full

# Organization only
.\scripts\utilities\house-cleaning.ps1 -Mode organization

# Cleanup only
.\scripts\utilities\house-cleaning.ps1 -Mode cleanup

# Validation only
.\scripts\utilities\house-cleaning.ps1 -Mode validation
```

### **Advanced House Cleaning**
```powershell
# Full advanced cleaning
.\scripts\automation\advanced-house-cleaning.ps1 -Mode full

# Security scan
.\scripts\automation\advanced-house-cleaning.ps1 -Mode security

# Performance analysis
.\scripts\automation\advanced-house-cleaning.ps1 -Mode performance

# Deep clean
.\scripts\automation\advanced-house-cleaning.ps1 -Mode deep-clean
```

## 📋 **Available Modes**

### **Basic House Cleaning Modes**
- **`full`** - Complete house cleaning (organization + cleanup + validation + docs + deps + git)
- **`organization`** - File organization and structure validation
- **`cleanup`** - Temporary file cleanup and dependency cleanup
- **`validation`** - Project structure validation
- **`docs`** - Documentation updates and maintenance
- **`deps`** - Dependency cleanup and analysis
- **`git`** - Git repository cleanup

### **Advanced House Cleaning Modes**
- **`full`** - Complete advanced cleaning (security + performance + dependencies + git history + deep clean)
- **`deep-clean`** - Deep cleaning of old files and backups
- **`security`** - Security scanning and vulnerability checks
- **`performance`** - Performance analysis and optimization
- **`dependencies`** - Advanced dependency analysis
- **`git-history`** - Git history cleanup and optimization

## 🔧 **Parameters**

### **Common Parameters**
- **`-Mode`** - Specifies the cleaning mode (see modes above)
- **`-DryRun`** - Preview changes without executing them
- **`-Verbose`** - Show detailed output
- **`-Force`** - Force execution even if not on develop branch

### **Advanced Parameters**
- **`-MaxAge`** - Maximum age for files to keep (default: 30 days)

## 📁 **What Gets Cleaned**

### **File Organization**
- Moves misplaced files to appropriate directories
- Organizes scripts, documentation, and configuration files
- Validates project structure

### **Temporary File Cleanup**
- Removes cache files (`node_modules/.cache`, `.next`, `dist`, `build`)
- Cleans up log files and temporary files
- Removes system files (`.DS_Store`, `Thumbs.db`)

### **Dependency Cleanup**
- Analyzes unused dependencies
- Checks for outdated packages
- Identifies security vulnerabilities

### **Git Repository Cleanup**
- Identifies untracked files
- Finds large files in repository
- Lists old branches for cleanup
- Analyzes Git history

### **Security Scanning**
- Scans for sensitive files (`.env`, keys, certificates)
- Checks for hardcoded secrets
- Identifies potential security issues

### **Performance Analysis**
- Finds large files (>10MB)
- Identifies duplicate files
- Analyzes asset usage
- Performance optimization recommendations

## 📊 **Reports and Logs**

### **Generated Reports**
- **Basic Report**: `logs/house-cleaning-report-YYYY-MM-DD-HH-mm-ss.md`
- **Advanced Report**: `logs/advanced-house-cleaning-report-YYYY-MM-DD-HH-mm-ss.md`

### **Backup System**
- Creates backups before major operations
- Stores backups in `backups/` directory
- Configurable backup retention (default: 30 days)

## 🛡️ **Safety Features**

### **Dry Run Mode**
```powershell
# Preview changes without executing
.\scripts\utilities\house-cleaning.ps1 -Mode full -DryRun
```

### **Backup System**
- Automatic backups before major operations
- Configurable backup retention
- Easy restoration process

### **Branch Protection**
- Requires develop branch (unless `-Force` is used)
- Prevents accidental execution on wrong branch

## 📅 **Recommended Schedule**

### **Daily**
```powershell
# Quick organization check
.\scripts\utilities\house-cleaning.ps1 -Mode organization -DryRun
```

### **Weekly**
```powershell
# Full house cleaning
.\scripts\utilities\house-cleaning.ps1 -Mode full
```

### **Monthly**
```powershell
# Advanced cleaning with security scan
.\scripts\automation\advanced-house-cleaning.ps1 -Mode full
```

### **Quarterly**
```powershell
# Deep clean with Git history optimization
.\scripts\automation\advanced-house-cleaning.ps1 -Mode deep-clean
.\scripts\automation\advanced-house-cleaning.ps1 -Mode git-history
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Permission Errors**
```powershell
# Run as administrator or check file permissions
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### **Git Branch Issues**
```powershell
# Switch to develop branch
git checkout develop

# Or use Force flag (not recommended)
.\scripts\utilities\house-cleaning.ps1 -Mode full -Force
```

#### **Large File Warnings**
```powershell
# Check for large files
.\scripts\automation\advanced-house-cleaning.ps1 -Mode performance
```

### **Recovery**

#### **Restore from Backup**
```powershell
# List available backups
Get-ChildItem backups/

# Restore specific backup
Copy-Item "backups/house-cleaning-backup-YYYY-MM-DD-HH-mm-ss/*" . -Recurse
```

#### **Undo Changes**
```powershell
# Use Git to undo changes
git checkout -- .
git clean -fd
```

## 📈 **Best Practices**

### **Before Running**
1. **Commit current changes** to Git
2. **Switch to develop branch**
3. **Run dry run first** to preview changes
4. **Review the report** before applying changes

### **After Running**
1. **Review the generated report**
2. **Test the application** to ensure nothing is broken
3. **Commit the changes** if everything looks good
4. **Schedule regular maintenance**

### **Automation**
```powershell
# Create scheduled task for weekly cleaning
# Windows Task Scheduler or cron job
```

## 🎯 **Integration with CI/CD**

### **GitHub Actions Integration**
```yaml
name: House Cleaning
on:
  schedule:
    - cron: '0 2 * * 0'  # Weekly on Sunday at 2 AM
jobs:
  house-cleaning:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run House Cleaning
        run: |
          pwsh -File scripts/utilities/house-cleaning.ps1 -Mode full
```

### **Pre-commit Hooks**
```bash
#!/bin/sh
# Run basic house cleaning before commits
pwsh -File scripts/utilities/house-cleaning.ps1 -Mode organization -DryRun
```

## 📚 **Additional Resources**

- **Scripts Documentation**: `scripts/README.md`
- **Automation Guide**: `docs/automation/`
- **Project Organization**: `README.md`

---

**This comprehensive house cleaning system ensures the Portfolio OS codebase remains clean, organized, and maintainable!** 🧹✨
