# 🤖 Prompt Integration Guide

## 📚 **Complete Guide to Using Scripts with AI Prompts**

This guide teaches you how to effectively integrate Portfolio OS scripts with AI prompts for maximum productivity and automation.

---

## 🎯 **Overview**

The Portfolio OS scripts system is designed to work seamlessly with AI prompts, allowing you to:
- Automate repetitive tasks
- Generate consistent outputs
- Maintain project standards
- Streamline development workflows

---

## 🚀 **Getting Started with Prompt Integration**

### **Basic Prompt Structure**
```markdown
# Example: Issue Analysis Prompt
You are a Frontend Developer. Before starting work on issue #123, run this analysis:

```powershell
.\scripts\issue-management\analyze-issues.ps1 -IssueNumber 123 -GeneratePlan -ExportTo "issue-123-analysis.md"
```

Review the generated plan, then implement the solution.
```

### **Script-Prompt Workflow**
1. **Identify the task** (issue, PR, cleanup, etc.)
2. **Choose the appropriate script**
3. **Create a prompt that includes the script**
4. **Execute and review results**
5. **Iterate based on output**

---

## 📁 **Script Categories for Prompts**

### **🤖 Agent Management Prompts**

#### **Agent Status Check**
```markdown
# Prompt: Check Agent Status
Before starting any work, check the current agent status:

```powershell
.\scripts\agent-management\manage-agent-coordinator.ps1 -Operation status
```

This will show you which agents are available and their current workload.
```

#### **Agent Assignment**
```markdown
# Prompt: Assign Issue to Agent
To claim an issue for your agent, use:

```powershell
.\scripts\agent-management\manage-agent-coordinator.ps1 -Operation claim-issue -Target "agent-frontend" -IssueNumber 123
```

Replace "agent-frontend" with your agent type and 123 with the actual issue number.
```

#### **Workload Balancing**
```markdown
# Prompt: Balance Agent Workloads
To ensure fair distribution of work:

```powershell
.\scripts\agent-management\manage-agent-coordinator.ps1 -Operation balance-load
```

Run this periodically to maintain optimal workload distribution.
```

### **🎫 Issue Management Prompts**

#### **Issue Analysis**
```markdown
# Prompt: Analyze Issue Before Implementation
Before implementing any issue, run this comprehensive analysis:

```powershell
.\scripts\issue-management\analyze-issues.ps1 -IssueNumber <ISSUE_NUMBER> -GeneratePlan -ExportTo "issue-analysis.md"
```

Review the generated plan carefully before proceeding with implementation.
```

#### **Issue Implementation**
```markdown
# Prompt: Implement Issue Solution
After analysis, implement the issue solution:

```powershell
.\scripts\issue-management\implement-issues.ps1 -IssueNumber <ISSUE_NUMBER>
```

Use the implementation approach that best fits the issue complexity.
```

#### **Issue Configuration**
```markdown
# Prompt: Configure Multiple Issues
To configure multiple issues with consistent settings:

```powershell
.\scripts\issue-management\configure-issues-unified.ps1 -ProjectNumber 20
```

This ensures all issues follow the same configuration standards.
```

### **🔄 PR Management Prompts**

#### **PR Assignment**
```markdown
# Prompt: Assign PRs to Agents
To automatically assign PRs to optimal agents:

```powershell
.\scripts\pr-management\assign-pr-agents.ps1 -DryRun
```

Review the assignments, then run without -DryRun to apply.
```

#### **PR Configuration**
```markdown
# Prompt: Configure PR Settings
To configure PR with proper settings:

```powershell
.\scripts\pr-management\configure-pr-auto.ps1 -PRNumber <PR_NUMBER> -Priority "P1" -Size "M"
```

Adjust priority and size based on PR complexity.
```

### **🧹 Housekeeping Prompts**

#### **Project Cleanup**
```markdown
# Prompt: Clean Project Before Starting
Before starting new work, clean the project:

```powershell
.\scripts\housekeeping\clean-house-basic.ps1
```

This ensures a clean working environment.
```

#### **Folder-Specific Cleanup**
```markdown
# Prompt: Clean Specific Folder
To clean a specific folder:

```powershell
.\scripts\housekeeping\clean-folder.ps1 -TargetFolder "src/components" -Mode "full"
```

Use this for targeted cleanup of specific areas.
```

---

## 🔄 **Common Prompt Workflows**

### **Workflow 1: New Issue Assignment**
```markdown
# Complete Issue Assignment Prompt
You are a Frontend Developer. Follow this workflow for issue #123:

1. **Check Agent Status:**
```powershell
.\scripts\agent-management\manage-agent-coordinator.ps1 -Operation status
```

2. **Claim the Issue:**
```powershell
.\scripts\agent-management\manage-agent-coordinator.ps1 -Operation claim-issue -Target "agent-frontend" -IssueNumber 123
```

3. **Analyze the Issue:**
```powershell
.\scripts\issue-management\analyze-issues.ps1 -IssueNumber 123 -GeneratePlan -ExportTo "issue-123-analysis.md"
```

4. **Implement the Solution:**
```powershell
.\scripts\issue-management\implement-issues.ps1 -IssueNumber 123
```

5. **Update Project Status:**
```powershell
.\scripts\project-management\manage-projects.ps1 -Operation update-status -IssueNumber 123
```
```

### **Workflow 2: PR Review Process**
```markdown
# Complete PR Review Prompt
You are a Backend Developer. Follow this workflow for PR #456:

1. **Check PR Assignments:**
```powershell
.\scripts\pr-management\assign-pr-agents.ps1 -DryRun
```

2. **Configure PR Settings:**
```powershell
.\scripts\pr-management\configure-pr-auto.ps1 -PRNumber 456 -Priority "P1" -Size "L"
```

3. **Review and Update Status:**
```powershell
.\scripts\project-management\manage-projects.ps1 -Operation update-status -PRNumber 456
```
```

### **Workflow 3: Project Maintenance**
```markdown
# Complete Project Maintenance Prompt
You are a DevOps Engineer. Follow this workflow for project maintenance:

1. **Run Basic Cleanup:**
```powershell
.\scripts\housekeeping\clean-house-basic.ps1
```

2. **Clean Specific Areas:**
```powershell
.\scripts\housekeeping\clean-folder.ps1 -TargetFolder "src/components" -Mode "full"
.\scripts\housekeeping\clean-folder.ps1 -TargetFolder "docs" -Mode "full"
```

3. **Advanced Cleanup if Needed:**
```powershell
.\scripts\core-utilities\clean-house-advanced.ps1
```
```

---

## 🎯 **Advanced Prompt Techniques**

### **Conditional Script Execution**
```markdown
# Prompt: Conditional Script Execution
You are a Frontend Developer. Follow this conditional workflow:

1. **Check if issue exists:**
```powershell
if (Test-Path "issue-123.md") {
    Write-Host "Issue 123 already analyzed"
} else {
    .\scripts\issue-management\analyze-issues.ps1 -IssueNumber 123 -GeneratePlan
}
```

2. **Only proceed if analysis is complete:**
```powershell
if (Test-Path "issue-123-analysis.md") {
    .\scripts\issue-management\implement-issues.ps1 -IssueNumber 123
} else {
    Write-Host "Please run analysis first"
}
```
```

### **Error Handling in Prompts**
```markdown
# Prompt: Error Handling
You are a Backend Developer. Use this error-handling approach:

```powershell
try {
    .\scripts\agent-management\manage-agent-coordinator.ps1 -Operation claim-issue -Target "agent-backend" -IssueNumber 123
    Write-Host "Issue claimed successfully" -ForegroundColor Green
} catch {
    Write-Host "Error claiming issue: $($_.Exception.Message)" -ForegroundColor Red
    .\scripts\agent-management\manage-agent-coordinator.ps1 -Operation status
}
```
```

### **Batch Operations**
```markdown
# Prompt: Batch Operations
You are a Project Manager. Run these batch operations:

```powershell
# Batch 1: Check all agent statuses
.\scripts\agent-management\manage-agent-coordinator.ps1 -Operation status

# Batch 2: Analyze multiple issues
.\scripts\issue-management\analyze-issues.ps1 -IssueNumber 123 -GeneratePlan
.\scripts\issue-management\analyze-issues.ps1 -IssueNumber 124 -GeneratePlan
.\scripts\issue-management\analyze-issues.ps1 -IssueNumber 125 -GeneratePlan

# Batch 3: Assign PRs
.\scripts\pr-management\assign-pr-agents.ps1 -DryRun
```
```

---

## 📋 **Prompt Templates**

### **Template 1: Issue Analysis Prompt**
```markdown
# Issue Analysis Prompt Template
You are a [ROLE] Developer. Follow this workflow for issue #[ISSUE_NUMBER]:

1. **Analyze the Issue:**
```powershell
.\scripts\issue-management\analyze-issues.ps1 -IssueNumber [ISSUE_NUMBER] -GeneratePlan -ExportTo "issue-[ISSUE_NUMBER]-analysis.md"
```

2. **Review the Analysis:**
- Check the generated plan
- Identify key requirements
- Note any dependencies

3. **Implement the Solution:**
```powershell
.\scripts\issue-management\implement-issues.ps1 -IssueNumber [ISSUE_NUMBER]
```

4. **Update Project Status:**
```powershell
.\scripts\project-management\manage-projects.ps1 -Operation update-status -IssueNumber [ISSUE_NUMBER]
```
```

### **Template 2: PR Review Prompt**
```markdown
# PR Review Prompt Template
You are a [ROLE] Developer. Follow this workflow for PR #[PR_NUMBER]:

1. **Check PR Status:**
```powershell
.\scripts\pr-management\assign-pr-agents.ps1 -DryRun
```

2. **Configure PR Settings:**
```powershell
.\scripts\pr-management\configure-pr-auto.ps1 -PRNumber [PR_NUMBER] -Priority "[PRIORITY]" -Size "[SIZE]"
```

3. **Review and Update:**
- Review the PR changes
- Test the functionality
- Update project status
```

### **Template 3: Project Cleanup Prompt**
```markdown
# Project Cleanup Prompt Template
You are a [ROLE] Developer. Follow this cleanup workflow:

1. **Basic Cleanup:**
```powershell
.\scripts\housekeeping\clean-house-basic.ps1
```

2. **Targeted Cleanup:**
```powershell
.\scripts\housekeeping\clean-folder.ps1 -TargetFolder "[FOLDER_PATH]" -Mode "full"
```

3. **Advanced Cleanup (if needed):**
```powershell
.\scripts\core-utilities\clean-house-advanced.ps1
```
```

---

## 🚀 **Best Practices for Prompt Integration**

### **1. Always Include Script Commands**
- Include the exact PowerShell commands in your prompts
- Use proper parameter names and values
- Include error handling when appropriate

### **2. Use Descriptive Comments**
- Explain what each script does
- Include expected outputs
- Note any prerequisites

### **3. Provide Context**
- Explain when to use each script
- Include workflow steps
- Mention dependencies

### **4. Test Your Prompts**
- Run scripts manually first
- Verify parameter values
- Check for errors

---

## 🔧 **Troubleshooting Prompt Integration**

### **Common Issues**

#### **Script Not Found**
```markdown
# Prompt: Check Script Availability
Before running any script, verify it exists:

```powershell
if (Test-Path ".\scripts\issue-management\analyze-issues.ps1") {
    Write-Host "Script found" -ForegroundColor Green
    .\scripts\issue-management\analyze-issues.ps1 -IssueNumber 123
} else {
    Write-Host "Script not found" -ForegroundColor Red
}
```
```

#### **Parameter Errors**
```markdown
# Prompt: Validate Parameters
Before running scripts, validate parameters:

```powershell
$IssueNumber = 123
if ($IssueNumber -match '^\d+$') {
    .\scripts\issue-management\analyze-issues.ps1 -IssueNumber $IssueNumber
} else {
    Write-Host "Invalid issue number" -ForegroundColor Red
}
```
```

#### **Permission Issues**
```markdown
# Prompt: Check Permissions
Before running scripts, check permissions:

```powershell
if (Get-ExecutionPolicy -Scope CurrentUser -List | Where-Object { $_.ExecutionPolicy -eq "RemoteSigned" }) {
    Write-Host "Execution policy OK" -ForegroundColor Green
} else {
    Write-Host "Setting execution policy..." -ForegroundColor Yellow
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
}
```
```

---

## 📚 **Additional Resources**

- [Developer Tutorial](DEVELOPER_TUTORIAL.md)
- [Script Analysis and Naming Conventions](SCRIPT_ANALYSIS_AND_NAMING_CONVENTIONS.md)
- [File Rename Mapping](FILE_RENAME_MAPPING.md)
- [House Cleaning Guide](HOUSE_CLEANING_GUIDE.md)

---

*Last updated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")*
