# 🚀 Developer Tutorial: Using Scripts with Prompts

## 📚 **Complete Guide to Scripts and Prompt Integration**

This comprehensive tutorial teaches developers how to effectively use the Portfolio OS scripts system with AI prompts for maximum productivity.

---

## 🎯 **Table of Contents**

1. [Getting Started](#getting-started)
2. [Script Categories & Usage](#script-categories--usage)
3. [Prompt Integration](#prompt-integration)
4. [Common Workflows](#common-workflows)
5. [Advanced Techniques](#advanced-techniques)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## 🚀 **Getting Started**

### **Prerequisites**
- PowerShell 7+ installed
- GitHub CLI (`gh`) configured
- Access to Portfolio OS repository
- Basic understanding of PowerShell

### **Quick Start**
```powershell
# Navigate to scripts directory
cd scripts

# Run a simple script
.\housekeeping\clean-house-basic.ps1

# Get help for any script
Get-Help .\agent-management\get-agent-commands.ps1 -Full
```

---

## 📁 **Script Categories & Usage**

### **🤖 Agent Management Scripts**

#### **`get-agent-commands.ps1`**
**Purpose**: Retrieve available agent commands and operations
```powershell
# Get all available commands
.\agent-management\get-agent-commands.ps1

# Get commands for specific agent
.\agent-management\get-agent-commands.ps1 -Agent "frontend"
```

#### **`manage-agent-coordination.ps1`**
**Purpose**: Coordinate multiple agents and manage workloads
```powershell
# Check agent status
.\agent-management\manage-agent-coordination.ps1 -Operation status

# Balance agent workloads
.\agent-management\manage-agent-coordination.ps1 -Operation balance-load

# Assign specific issue to agent
.\agent-management\manage-agent-coordination.ps1 -Operation assign -IssueNumber 123 -Agent "backend"
```

#### **`manage-agent-coordinator.ps1`**
**Purpose**: Main agent coordination hub
```powershell
# Auto-assign issues to optimal agents
.\agent-management\manage-agent-coordinator.ps1 -Operation auto-assign -MaxIssues 5

# Claim specific issue
.\agent-management\manage-agent-coordinator.ps1 -Operation claim-issue -Target "agent-frontend" -IssueNumber 123

# Balance agent loads
.\agent-management\manage-agent-coordinator.ps1 -Operation balance-load
```

### **🎫 Issue Management Scripts**

#### **`analyze-issues.ps1`**
**Purpose**: Analyze issues and generate implementation plans
```powershell
# Analyze specific issue
.\issue-management\analyze-issues.ps1 -IssueNumber 123

# Generate implementation plan
.\issue-management\analyze-issues.ps1 -IssueNumber 123 -GeneratePlan

# Export analysis to file
.\issue-management\analyze-issues.ps1 -IssueNumber 123 -ExportTo "analysis-report.md"
```

#### **`configure-issues-unified.ps1`**
**Purpose**: Configure multiple issues with unified settings
```powershell
# Configure all issues in project
.\issue-management\configure-issues-unified.ps1 -ProjectNumber 20

# Configure specific issue range
.\issue-management\configure-issues-unified.ps1 -IssueRange @(100, 150)
```

#### **`implement-issues.ps1`**
**Purpose**: Implement issue solutions
```powershell
# Implement specific issue
.\issue-management\implement-issues.ps1 -IssueNumber 123

# Implement with specific approach
.\issue-management\implement-issues.ps1 -IssueNumber 123 -Approach "minimal"
```

### **🔄 PR Management Scripts**

#### **`assign-pr-agents.ps1`**
**Purpose**: Assign PRs to optimal agents based on workload and expertise
```powershell
# Auto-assign PRs to agents
.\pr-management\assign-pr-agents.ps1

# Assign with specific project
.\pr-management\assign-pr-agents.ps1 -ProjectNumber 20

# Dry run to see assignments
.\pr-management\assign-pr-agents.ps1 -DryRun
```

#### **`configure-pr-auto.ps1`**
**Purpose**: Automatically configure PR settings
```powershell
# Configure PR with default settings
.\pr-management\configure-pr-auto.ps1 -PRNumber 123

# Configure with custom settings
.\pr-management\configure-pr-auto.ps1 -PRNumber 123 -Priority "P1" -Size "L"
```

### **🧹 Housekeeping Scripts**

#### **`clean-house-basic.ps1`**
**Purpose**: Basic cleanup of the entire project
```powershell
# Run basic cleanup
.\housekeeping\clean-house-basic.ps1

# Dry run to see what would be cleaned
.\housekeeping\clean-house-basic.ps1 -DryRun
```

#### **`clean-folder.ps1`**
**Purpose**: Clean and organize specific folders
```powershell
# Clean specific folder
.\housekeeping\clean-folder.ps1 -TargetFolder "src/components"

# Clean with full mode
.\housekeeping\clean-folder.ps1 -TargetFolder "src/components" -Mode "full"
```

---

## 🤖 **Prompt Integration**

### **Using Scripts with AI Prompts**

#### **1. Agent Assignment Prompts**
```markdown
# Example: Assign PR to Frontend Agent
You are Jason, a Frontend Specialist. Use this script to claim your next assignment:

```powershell
.\agent-management\manage-agent-coordinator.ps1 -Operation claim-issue -Target "agent-frontend"
```

Then analyze the issue:
```powershell
.\issue-management\analyze-issues.ps1 -IssueNumber <ISSUE_NUMBER> -GeneratePlan
```
```

#### **2. Issue Analysis Prompts**
```markdown
# Example: Analyze and Implement Issue
Before implementing any issue, run this analysis:

```powershell
.\issue-management\analyze-issues.ps1 -IssueNumber <ISSUE_NUMBER> -GeneratePlan -ExportTo "issue-analysis.md"
```

Review the generated plan, then implement:
```powershell
.\issue-management\implement-issues.ps1 -IssueNumber <ISSUE_NUMBER>
```
```

#### **3. PR Management Prompts**
```markdown
# Example: Handle PR Review Process
When working on PRs, use these scripts:

1. Check PR status:
```powershell
.\pr-management\assign-pr-agents.ps1 -DryRun
```

2. Configure PR settings:
```powershell
.\pr-management\configure-pr-auto.ps1 -PRNumber <PR_NUMBER>
```
```

---

## 🔄 **Common Workflows**

### **Workflow 1: New Issue Assignment**
```powershell
# 1. Check available issues
.\issue-management\analyze-issues.ps1 -IssueNumber 123

# 2. Claim issue for your agent
.\agent-management\manage-agent-coordinator.ps1 -Operation claim-issue -Target "agent-frontend" -IssueNumber 123

# 3. Generate implementation plan
.\issue-management\analyze-issues.ps1 -IssueNumber 123 -GeneratePlan

# 4. Implement the solution
.\issue-management\implement-issues.ps1 -IssueNumber 123
```

### **Workflow 2: PR Review Process**
```powershell
# 1. Check PR assignments
.\pr-management\assign-pr-agents.ps1 -DryRun

# 2. Configure PR settings
.\pr-management\configure-pr-auto.ps1 -PRNumber 123

# 3. Review and update project status
.\project-management\manage-projects.ps1 -Operation update-status -PRNumber 123
```

### **Workflow 3: Project Cleanup**
```powershell
# 1. Run basic cleanup
.\housekeeping\clean-house-basic.ps1

# 2. Clean specific folders
.\housekeeping\clean-folder.ps1 -TargetFolder "src/components"

# 3. Advanced cleanup if needed
.\core-utilities\clean-house-advanced.ps1
```

---

## 🚀 **Advanced Techniques**

### **Script Chaining**
```powershell
# Chain multiple scripts together
.\agent-management\manage-agent-coordinator.ps1 -Operation auto-assign -MaxIssues 5; 
.\issue-management\analyze-issues.ps1 -IssueNumber 123 -GeneratePlan; 
.\pr-management\assign-pr-agents.ps1 -DryRun
```

### **Custom Script Parameters**
```powershell
# Use custom parameters for specific needs
.\issue-management\analyze-issues.ps1 -IssueNumber 123 -GeneratePlan -ExportTo "custom-analysis.md" -Verbose
```

### **Error Handling**
```powershell
# Use try-catch for error handling
try {
    .\agent-management\manage-agent-coordinator.ps1 -Operation status
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Script Not Found**
```powershell
# Check if script exists
Test-Path ".\agent-management\manage-agent-coordinator.ps1"

# List all available scripts
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

# Re-authenticate if needed
gh auth login
```

### **Debug Mode**
```powershell
# Run scripts with verbose output
.\agent-management\manage-agent-coordinator.ps1 -Operation status -Verbose

# Use debug mode
$DebugPreference = "Continue"
.\issue-management\analyze-issues.ps1 -IssueNumber 123
```

---

## 📋 **Best Practices**

### **1. Script Organization**
- Use descriptive script names
- Group related scripts in folders
- Keep scripts focused on single tasks
- Document script parameters

### **2. Prompt Integration**
- Include script commands in prompts
- Use consistent parameter naming
- Provide clear examples
- Document expected outputs

### **3. Error Handling**
- Always use try-catch blocks
- Provide meaningful error messages
- Log errors for debugging
- Validate inputs before processing

### **4. Performance**
- Use dry-run mode for testing
- Batch operations when possible
- Avoid unnecessary API calls
- Cache results when appropriate

---

## 🎯 **Quick Reference**

### **Most Used Commands**
```powershell
# Check agent status
.\agent-management\manage-agent-coordinator.ps1 -Operation status

# Analyze issue
.\issue-management\analyze-issues.ps1 -IssueNumber <NUMBER> -GeneratePlan

# Assign PRs
.\pr-management\assign-pr-agents.ps1 -DryRun

# Clean project
.\housekeeping\clean-house-basic.ps1
```

### **Script Locations**
- **Agent Management**: `scripts/agent-management/`
- **Issue Management**: `scripts/issue-management/`
- **PR Management**: `scripts/pr-management/`
- **Housekeeping**: `scripts/housekeeping/`
- **Core Utilities**: `scripts/core-utilities/`

---

## 📚 **Additional Resources**

- [Script Analysis and Naming Conventions](SCRIPT_ANALYSIS_AND_NAMING_CONVENTIONS.md)
- [File Rename Mapping](FILE_RENAME_MAPPING.md)
- [House Cleaning Guide](HOUSE_CLEANING_GUIDE.md)
- [Organization Summary](ORGANIZATION_SUMMARY.md)

---

*Last updated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")*
