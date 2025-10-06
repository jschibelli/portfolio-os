# 📚 Scripts Documentation

## 🎯 **Welcome to Portfolio OS Scripts Documentation**

This folder contains comprehensive documentation for the Portfolio OS scripts system, providing developers with everything they need to effectively use and maintain the automation scripts.

---

## 📁 **Documentation Structure**

### **🚀 Getting Started**
- **[Developer Tutorial](DEVELOPER_TUTORIAL.md)** - Complete guide to using scripts
- **[Quick Reference](QUICK_REFERENCE.md)** - Most used commands and workflows
- **[Prompt Integration Guide](PROMPT_INTEGRATION_GUIDE.md)** - Using scripts with AI prompts

### **📋 System Documentation**
- **[Script Analysis and Naming Conventions](SCRIPT_ANALYSIS_AND_NAMING_CONVENTIONS.md)** - Script naming standards
- **[File Rename Mapping](FILE_RENAME_MAPPING.md)** - Old to new file name mapping
- **[House Cleaning Guide](HOUSE_CLEANING_GUIDE.md)** - Cleanup procedures

### **📊 Reports and Summaries**
- **[Organization Summary](ORGANIZATION_SUMMARY.md)** - Folder organization summary
- **[Final Organization Summary](FINAL_ORGANIZATION_SUMMARY.md)** - Final organization status
- **[Scripts Organization Analysis](SCRIPTS_ORGANIZATION_ANALYSIS.md)** - Organization analysis
- **[Script Cleanup Summary](SCRIPT_CLEANUP_SUMMARY.md)** - Cleanup summary
- **[Cleanup Completion](CLEANUP_COMPLETION.md)** - Cleanup completion report
- **[Prompt Updates Summary](PROMPT_UPDATES_SUMMARY.md)** - Prompt updates summary
- **[Documentation Cleanup Summary](DOCUMENTATION_CLEANUP_SUMMARY.md)** - Documentation cleanup

### **🔧 Configuration**
- **[README Auto-Configuration](README-AUTO-CONFIGURATION.md)** - Auto-configuration guide

---

## 🎯 **Quick Start Guide**

### **For New Developers:**
1. Start with the **[Developer Tutorial](DEVELOPER_TUTORIAL.md)** for a complete overview
2. Use the **[Quick Reference](QUICK_REFERENCE.md)** for common commands
3. Check the **[Prompt Integration Guide](PROMPT_INTEGRATION_GUIDE.md)** for AI integration

### **For Experienced Users:**
1. Jump to **[Quick Reference](QUICK_REFERENCE.md)** for fast access
2. Use **[Prompt Integration Guide](PROMPT_INTEGRATION_GUIDE.md)** for advanced workflows
3. Reference **[System Documentation](SCRIPT_ANALYSIS_AND_NAMING_CONVENTIONS.md)** for standards

---

## 📚 **Documentation Categories**

### **🚀 Getting Started Documentation**
These documents help new users understand and use the scripts system:

- **Developer Tutorial**: Complete step-by-step guide
- **Quick Reference**: Fast access to common commands
- **Prompt Integration Guide**: AI integration techniques

### **📋 System Documentation**
These documents explain the system architecture and standards:

- **Script Analysis**: Naming conventions and standards
- **File Rename Mapping**: Historical file name changes
- **House Cleaning Guide**: Maintenance procedures

### **📊 Reports and Summaries**
These documents track system changes and maintenance:

- **Organization Summaries**: Folder structure documentation
- **Cleanup Reports**: Maintenance activity logs
- **Update Summaries**: Change documentation

### **🔧 Configuration Documentation**
These documents explain system configuration:

- **Auto-Configuration**: Automated setup procedures
- **Configuration Guides**: Manual setup instructions

---

## 🎯 **How to Use This Documentation**

### **1. Choose Your Path:**
- **New to scripts?** → Start with [Developer Tutorial](DEVELOPER_TUTORIAL.md)
- **Need quick commands?** → Use [Quick Reference](QUICK_REFERENCE.md)
- **Working with AI?** → Check [Prompt Integration Guide](PROMPT_INTEGRATION_GUIDE.md)

### **2. Find What You Need:**
- **Script usage** → Developer Tutorial
- **Command reference** → Quick Reference
- **AI integration** → Prompt Integration Guide
- **System standards** → Script Analysis
- **Maintenance** → House Cleaning Guide

### **3. Stay Updated:**
- **Check reports** for recent changes
- **Review summaries** for system status
- **Follow standards** for consistency

---

## 📁 **Script Categories Overview**

### **🤖 Agent Management**
Scripts for managing AI agents and their workloads:
- `manage-agent-coordinator.ps1` - Main coordination hub
- `get-agent-commands.ps1` - Available commands
- `manage-agent-coordination.ps1` - Workload management

### **🎫 Issue Management**
Scripts for handling GitHub issues:
- `analyze-issues.ps1` - Issue analysis and planning
- `implement-issues.ps1` - Issue implementation
- `configure-issues-unified.ps1` - Bulk configuration

### **🔄 PR Management**
Scripts for pull request automation:
- `assign-pr-agents.ps1` - PR assignment
- `configure-pr-auto.ps1` - PR configuration
- `get-pr-aliases.ps1` - PR aliases

### **🧹 Housekeeping**
Scripts for project maintenance:
- `clean-house-basic.ps1` - Basic cleanup
- `clean-folder.ps1` - Targeted cleanup
- `clean-house-advanced.ps1` - Advanced cleanup

### **📋 Project Management**
Scripts for project coordination:
- `manage-projects.ps1` - Project management
- `backfill-project-fields.ps1` - Field updates
- `update-project-status-webhook.ps1` - Status updates

### **🔧 Core Utilities**
Essential utility scripts:
- `get-github-utilities.ps1` - GitHub integration
- `manage-ai-services.ps1` - AI service management
- `clean-house-advanced.ps1` - Advanced cleanup

---

## 🚀 **Common Workflows**

### **New Issue Workflow**
```powershell
# 1. Check agent status
.\agent-management\manage-agent-coordinator.ps1 -Operation status

# 2. Claim issue
.\agent-management\manage-agent-coordinator.ps1 -Operation claim-issue -Target "agent-frontend" -IssueNumber 123

# 3. Analyze issue
.\issue-management\analyze-issues.ps1 -IssueNumber 123 -GeneratePlan

# 4. Implement solution
.\issue-management\implement-issues.ps1 -IssueNumber 123
```

### **PR Review Workflow**
```powershell
# 1. Check PR assignments
.\pr-management\assign-pr-agents.ps1 -DryRun

# 2. Configure PR
.\pr-management\configure-pr-auto.ps1 -PRNumber 123

# 3. Update status
.\project-management\manage-projects.ps1 -Operation update-status -PRNumber 123
```

### **Project Cleanup Workflow**
```powershell
# 1. Basic cleanup
.\housekeeping\clean-house-basic.ps1

# 2. Targeted cleanup
.\housekeeping\clean-folder.ps1 -TargetFolder "src/components" -Mode "full"

# 3. Advanced cleanup if needed
.\core-utilities\clean-house-advanced.ps1
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Script Not Found**
```powershell
# Check if script exists
Test-Path ".\agent-management\manage-agent-coordinator.ps1"

# List all scripts
Get-ChildItem -Path ".\" -Recurse -Filter "*.ps1"
```

#### **Permission Issues**
```powershell
# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### **GitHub CLI Issues**
```powershell
# Check GitHub CLI status
gh auth status

# Re-authenticate
gh auth login
```

### **Debug Mode**
```powershell
# Enable debug output
$DebugPreference = "Continue"

# Run with verbose output
.\agent-management\manage-agent-coordinator.ps1 -Operation status -Verbose
```

---

## 📋 **Best Practices**

### **1. Script Usage**
- Always use `-DryRun` first to see what will happen
- Check agent status before claiming issues
- Analyze issues before implementing
- Use verbose mode for debugging

### **2. Documentation**
- Keep documentation up-to-date
- Document new scripts and workflows
- Follow naming conventions
- Maintain clear folder structure

### **3. Maintenance**
- Run regular cleanup procedures
- Monitor script performance
- Update documentation as needed
- Remove outdated files

---

## 🎯 **Contributing**

### **Adding New Scripts**
1. Follow naming conventions (action-object.ps1)
2. Place in appropriate category folder
3. Update documentation
4. Test thoroughly

### **Updating Documentation**
1. Keep information current
2. Follow established format
3. Include examples
4. Test all links

### **Reporting Issues**
1. Check troubleshooting section
2. Include error messages
3. Provide reproduction steps
4. Update documentation if needed

---

## 📚 **Additional Resources**

- **GitHub Repository**: Portfolio OS main repository
- **Scripts Folder**: `scripts/` directory
- **Documentation**: This folder
- **Support**: Check troubleshooting section

---

## 🎯 **Quick Links**

- **[Developer Tutorial](DEVELOPER_TUTORIAL.md)** - Complete guide
- **[Quick Reference](QUICK_REFERENCE.md)** - Fast commands
- **[Prompt Integration](PROMPT_INTEGRATION_GUIDE.md)** - AI integration
- **[Script Analysis](SCRIPT_ANALYSIS_AND_NAMING_CONVENTIONS.md)** - Standards
- **[House Cleaning](HOUSE_CLEANING_GUIDE.md)** - Maintenance

---

*Last updated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")*
