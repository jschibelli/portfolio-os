# Scripts Utilities Directory

This directory contains utility scripts organized by category for easy navigation and maintenance.

## 📁 **Directory Structure**

### **`housekeeping/`** - House Cleaning Scripts
Scripts for maintaining a clean and organized development environment:

- **`housekeeping-main.ps1`** - Main comprehensive house cleaning script (RECOMMENDED)
- **`housekeeping-basic.ps1`** - Basic house cleaning script (alternative)
- **`housekeeping-quick.ps1`** - Quick access wrapper for common tasks

**Usage:**
```powershell
# Quick access (RECOMMENDED)
.\housekeeping\housekeeping-quick.ps1 -Action clean
.\housekeeping\housekeeping-quick.ps1 -Action organize
.\housekeeping\housekeeping-quick.ps1 -Action validate

# Direct access to main script
.\housekeeping\housekeeping-main.ps1 -Mode full
.\housekeeping\housekeeping-main.ps1 -Mode organization
.\housekeeping\housekeeping-main.ps1 -Mode cleanup
.\housekeeping\housekeeping-main.ps1 -Mode validation
.\housekeeping\housekeeping-main.ps1 -Mode docs

# Dry run to preview changes
.\housekeeping\housekeeping-main.ps1 -Mode full -DryRun
```

### **`maintenance/`** - Maintenance Scripts
Scripts for ongoing maintenance and fixes:

- **`fix-quotes.ps1`** - Fixes quote issues in files

**Usage:**
```powershell
# Fix quote issues
.\maintenance\fix-quotes.ps1
```

### **`build-tools/`** - Build and Development Tools
Scripts for building and development processes:

- **`build.sh`** - Build script for the entire project

**Usage:**
```bash
# Build the project
./build-tools/build.sh
```

### **`configuration/`** - Configuration Files
Configuration files and data for the project:

- **`project_items.json`** - Project items configuration data

## 🚀 **Quick Start**

### **House Cleaning (Most Common)**
```powershell
# Full house cleaning (recommended)
.\housekeeping\housekeeping-main.ps1 -Mode full

# Just organize files
.\housekeeping\housekeeping-main.ps1 -Mode organization

# Organize docs folder specifically
.\housekeeping\housekeeping-main.ps1 -Mode docs
```

### **Maintenance Tasks**
```powershell
# Fix common issues
.\maintenance\fix-quotes.ps1
```

### **Build Process**
```bash
# Build the project
./build-tools/build.sh
```

## 📋 **Available Modes**

### **House Cleaning Modes**
- **`full`** - Complete house cleaning (organization + cleanup + validation)
- **`organization`** - File organization and structure validation
- **`cleanup`** - Temporary file cleanup
- **`validation`** - Project structure validation

### **Parameters**
- **`-DryRun`** - Preview changes without executing them
- **`-Detailed`** - Show detailed output

## 🔧 **What Gets Cleaned**

### **File Organization**
- Moves misplaced files to appropriate directories
- Organizes scripts, documentation, and configuration files
- Validates project structure

### **Temporary File Cleanup**
- Removes cache files (`node_modules/.cache`, `.next`, `dist`, `build`)
- Cleans up log files and temporary files
- Removes system files (`.DS_Store`, `Thumbs.db`)

### **Project Structure Validation**
- Checks for required directories
- Validates essential files
- Ensures proper project organization

## 📊 **Reports and Logs**

### **Generated Reports**
- **House Cleaning Report**: `logs/house-cleaning-report-YYYY-MM-DD-HH-mm-ss.md`

### **Log Directory**
- All reports are stored in the `logs/` directory
- Reports include detailed information about what was cleaned and organized

## 🛡️ **Safety Features**

### **Dry Run Mode**
```powershell
# Preview changes without executing
.\housekeeping\housekeeping-main.ps1 -Mode full -DryRun
```

### **Branch Protection**
- Requires develop branch (unless `-Force` is used)
- Prevents accidental execution on wrong branch

## 📅 **Recommended Schedule**

### **Daily**
```powershell
# Quick organization check
.\housekeeping\housekeeping-main.ps1 -Mode organization -DryRun
```

### **Weekly**
```powershell
# Full house cleaning
.\housekeeping\housekeeping-main.ps1 -Mode full
```

### **As Needed**
```powershell
# Fix specific issues
.\maintenance\fix-quotes.ps1
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
```

### **Recovery**

#### **Undo Changes**
```powershell
# Use Git to undo changes
git checkout -- .
git clean -fd
```

## 📚 **Best Practices**

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

---

**This organized utilities structure makes the Portfolio OS project easy to maintain and keep clean!** 🧹✨
