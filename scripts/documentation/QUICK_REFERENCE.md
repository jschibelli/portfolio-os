# ⚡ Quick Reference Guide

## 🚀 **Most Used Scripts & Commands**

### **🤖 Agent Management**
```powershell
# Check agent status
.\agent-management\manage-agent-coordinator.ps1 -Operation status

# Claim issue for agent
.\agent-management\manage-agent-coordinator.ps1 -Operation claim-issue -Target "agent-frontend" -IssueNumber 123

# Balance agent workloads
.\agent-management\manage-agent-coordinator.ps1 -Operation balance-load

# Auto-assign issues
.\agent-management\manage-agent-coordinator.ps1 -Operation auto-assign -MaxIssues 5
```

### **🎫 Issue Management**
```powershell
# Analyze issue
.\issue-management\analyze-issues.ps1 -IssueNumber 123 -GeneratePlan

# Implement issue
.\issue-management\implement-issues.ps1 -IssueNumber 123

# Configure multiple issues
.\issue-management\configure-issues-unified.ps1 -ProjectNumber 20

# Analyze stale issues
.\issue-management\analyze-stale-issues.ps1
```

### **🔄 PR Management**
```powershell
# Assign PRs to agents
.\pr-management\assign-pr-agents.ps1 -DryRun

# Configure PR settings
.\pr-management\configure-pr-auto.ps1 -PRNumber 123 -Priority "P1" -Size "M"

# Get PR aliases
.\pr-management\get-pr-aliases.ps1
```

### **🧹 Housekeeping**
```powershell
# Basic cleanup
.\housekeeping\clean-house-basic.ps1

# Clean specific folder
.\housekeeping\clean-folder.ps1 -TargetFolder "src/components" -Mode "full"

# Advanced cleanup
.\core-utilities\clean-house-advanced.ps1
```

### **📋 Project Management**
```powershell
# Update project status
.\project-management\manage-projects.ps1 -Operation update-status -IssueNumber 123

# Backfill project fields
.\project-management\backfill-project-fields.ps1
```

---

## 🎯 **Common Workflows**

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

# 2. Clean specific areas
.\housekeeping\clean-folder.ps1 -TargetFolder "src/components" -Mode "full"

# 3. Advanced cleanup if needed
.\core-utilities\clean-house-advanced.ps1
```

---

## 📁 **Script Locations**

| Category | Folder | Key Scripts |
|----------|--------|-------------|
| **Agent Management** | `agent-management/` | `manage-agent-coordinator.ps1`, `get-agent-commands.ps1` |
| **Issue Management** | `issue-management/` | `analyze-issues.ps1`, `implement-issues.ps1` |
| **PR Management** | `pr-management/` | `assign-pr-agents.ps1`, `configure-pr-auto.ps1` |
| **Housekeeping** | `housekeeping/` | `clean-house-basic.ps1`, `clean-folder.ps1` |
| **Core Utilities** | `core-utilities/` | `clean-house-advanced.ps1`, `get-github-utilities.ps1` |
| **Project Management** | `project-management/` | `manage-projects.ps1`, `backfill-project-fields.ps1` |

---

## 🔧 **Common Parameters**

### **Universal Parameters**
- `-DryRun` - Show what would be done without executing
- `-Verbose` - Show detailed output
- `-Force` - Override confirmations

### **Issue Parameters**
- `-IssueNumber` - Specific issue number
- `-GeneratePlan` - Generate implementation plan
- `-ExportTo` - Export results to file

### **PR Parameters**
- `-PRNumber` - Specific PR number
- `-Priority` - Priority level (P0, P1, P2)
- `-Size` - Size estimate (S, M, L, XL)

### **Agent Parameters**
- `-Operation` - Operation to perform
- `-Target` - Target agent or issue
- `-MaxIssues` - Maximum issues to process

---

## 🚨 **Troubleshooting**

### **Script Not Found**
```powershell
# Check if script exists
Test-Path ".\agent-management\manage-agent-coordinator.ps1"

# List all scripts
Get-ChildItem -Path ".\" -Recurse -Filter "*.ps1"
```

### **Permission Issues**
```powershell
# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **GitHub CLI Issues**
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

## 📚 **Documentation Links**

- [Developer Tutorial](DEVELOPER_TUTORIAL.md) - Complete developer guide
- [Prompt Integration Guide](PROMPT_INTEGRATION_GUIDE.md) - Using scripts with AI prompts
- [Script Analysis](SCRIPT_ANALYSIS_AND_NAMING_CONVENTIONS.md) - Script naming conventions
- [File Rename Mapping](FILE_RENAME_MAPPING.md) - Old to new file names
- [House Cleaning Guide](HOUSE_CLEANING_GUIDE.md) - Cleanup procedures

---

## 🎯 **Quick Tips**

1. **Always use `-DryRun` first** to see what will happen
2. **Check agent status** before claiming issues
3. **Analyze issues** before implementing
4. **Use verbose mode** for debugging
5. **Keep scripts organized** by functionality
6. **Document your workflows** for team consistency

---

*Last updated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")*
