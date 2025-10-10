# Enhanced Automation System

**Created**: 2025-10-10  
**Version**: 1.0.0  
**Purpose**: Streamlined issue management with automatic branch creation and workflow documentation updates

## 🎯 Overview

The Enhanced Automation System eliminates manual steps in your development workflow by automatically:
1. **Creating Git branches** when issues are created
2. **Updating workflow documentation** when agents are assigned
3. **Maintaining separate workflows** for single-developer and multi-agent scenarios

## 🆕 New Scripts

### 1. Enhanced Issue Creation (`scripts/issue-management/create-issue-enhanced.ps1`)

**Purpose**: Create GitHub issues with automatic branch generation and remote push.

**Features**:
- Creates GitHub issue with all standard options
- Automatically generates semantic branch name from issue title
- Pushes branch to remote repository
- Adds issue to project board
- Displays comprehensive summary

**Usage**:
```powershell
# Basic usage with auto branch creation
.\scripts\issue-management\create-issue-enhanced.ps1 `
  -Title "Add dark mode toggle" `
  -Body "Implement dark mode toggle in settings" `
  -Labels "enhancement,frontend" `
  -CreateBranch `
  -PushBranch

# With milestone and project assignment
.\scripts\issue-management\create-issue-enhanced.ps1 `
  -Title "Fix navigation bug" `
  -Body "Navigation menu not closing on mobile" `
  -Labels "bug,frontend" `
  -Milestone "v1.0.0" `
  -Project "20" `
  -Assignee "jschibelli" `
  -CreateBranch `
  -PushBranch

# Dry run to preview what would happen
.\scripts\issue-management\create-issue-enhanced.ps1 `
  -Title "Test issue" `
  -Body "Description" `
  -DryRun

# Without auto branch creation (traditional behavior)
.\scripts\issue-management\create-issue-enhanced.ps1 `
  -Title "Issue title" `
  -Body "Description" `
  -CreateBranch:$false
```

**Parameters**:
- `-Title` (required): Issue title
- `-Body` (required): Issue description
- `-Labels`: Comma-separated labels
- `-Milestone`: Milestone name or number
- `-Project`: Project number (default: "20")
- `-Assignee`: GitHub username
- `-BaseBranch`: Base branch for new branch (default: "develop")
- `-CreateBranch`: Auto-create branch (default: $true)
- `-PushBranch`: Auto-push to remote (default: $true)
- `-DryRun`: Preview without creating

**Branch Naming Convention**:
- Format: `issue-{number}-{slug}`
- Example: `issue-292-add-dark-mode-toggle`
- Automatically generated from issue title
- Truncated to 50 chars max (plus issue number)
- Special characters removed, spaces replaced with hyphens

### 2. Workflow Document Updater (`scripts/core-utilities/update-workflow-docs.ps1`)

**Purpose**: Automatically update multi-agent workflow documentation when issues are assigned.

**Features**:
- Tracks agent assignments in real-time
- Maintains "Current Active Projects" section
- Supports add and remove operations
- Preserves document structure

**Usage**:
```powershell
# Add issue to agent's assignment list
.\scripts\core-utilities\update-workflow-docs.ps1 `
  -IssueNumber 292 `
  -AgentName "jason" `
  -IssueTitle "Test Utils & Config Updates"

# Remove issue from agent's list
.\scripts\core-utilities\update-workflow-docs.ps1 `
  -IssueNumber 292 `
  -AgentName "jason" `
  -IssueTitle "Test Utils & Config Updates" `
  -Remove

# Preview changes (dry run)
.\scripts\core-utilities\update-workflow-docs.ps1 `
  -IssueNumber 292 `
  -AgentName "jason" `
  -IssueTitle "Test Utils & Config Updates" `
  -DryRun

# Update different workflow file
.\scripts\core-utilities\update-workflow-docs.ps1 `
  -IssueNumber 292 `
  -AgentName "jason" `
  -IssueTitle "Test Utils" `
  -WorkflowFile "prompts/custom-workflow.md"
```

**Parameters**:
- `-IssueNumber` (required): GitHub issue number
- `-AgentName` (required): Agent name (chris, jason, agent-1-chris, agent-2-jason)
- `-IssueTitle` (required): Issue title for display
- `-WorkflowFile`: Workflow doc path (default: "prompts/workflows/multi-agent-e2e-workflow.md")
- `-Remove`: Remove issue from agent's list instead of adding
- `-DryRun`: Preview changes without updating file

### 3. Enhanced Agent Assignment (`scripts/agent-management/assign-agent-enhanced.ps1`)

**Purpose**: Assign issues to agents with automatic workflow documentation updates.

**Features**:
- Auto-determines optimal agent based on issue content (if not specified)
- Adds GitHub comment with agent assignment
- Automatically updates workflow documentation
- Smart keyword matching for agent selection

**Usage**:
```powershell
# Auto-assign based on issue content
.\scripts\agent-management\assign-agent-enhanced.ps1 `
  -IssueNumber 292

# Assign to specific agent
.\scripts\agent-management\assign-agent-enhanced.ps1 `
  -IssueNumber 292 `
  -AgentName "jason"

# Assign without updating workflow docs
.\scripts\agent-management\assign-agent-enhanced.ps1 `
  -IssueNumber 292 `
  -AgentName "chris" `
  -UpdateWorkflowDocs:$false

# Assign without GitHub comment
.\scripts\agent-management\assign-agent-enhanced.ps1 `
  -IssueNumber 292 `
  -AgentName "jason" `
  -AddGitHubComment:$false

# Dry run to preview assignment
.\scripts\agent-management\assign-agent-enhanced.ps1 `
  -IssueNumber 292 `
  -DryRun
```

**Parameters**:
- `-IssueNumber` (required): GitHub issue number
- `-AgentName`: Agent name or "auto" for automatic detection (default: "auto")
- `-UpdateWorkflowDocs`: Update workflow documentation (default: $true)
- `-AddGitHubComment`: Add assignment comment to issue (default: $true)
- `-DryRun`: Preview assignment without executing

**Auto-Assignment Logic**:
- Analyzes issue title, body, and labels
- Scores keywords for each agent
- **Chris (Frontend/UI)**: frontend, ui, component, react, accessibility, visual, etc.
- **Jason (Infrastructure/Testing)**: backend, api, testing, devops, seo, performance, etc.
- Assigns to agent with higher keyword match score

## 📂 Workflow Files

### Single Developer: `prompts/workflows/e2e-issue-to-merge.md`

**Purpose**: Streamlined workflow for solo developers without agent assignments.

**Use Cases**:
- Working alone on a project
- No need for agent-specific tracking
- Simplified automation without multi-agent complexity

**Key Sections**:
- Enhanced Issue & Branch Creation
- Continuous Pipeline Processing
- Issue Configuration and Implementation
- PR Automation and Merge

### Multi-Agent: `prompts/multi-agent-e2e-workflow.md`

**Purpose**: Coordinated workflow for Chris and Jason working in parallel.

**Use Cases**:
- Parallel development with multiple agents
- Agent-specific issue assignments
- Tracking current agent workloads
- Automated workflow documentation

**Key Sections**:
- Enhanced Automation Features (NEW)
- Current Agent Specialties (auto-updated)
- Current Active Projects (auto-updated)
- Multi-Agent E2E Automation
- Agent-Specific Workflows

## 🔄 Complete Workflow Examples

### Example 1: Create Issue with Auto Branch (Single Developer)

```powershell
# 1. Create issue with auto branch
.\scripts\issue-management\create-issue-enhanced.ps1 `
  -Title "Add search functionality" `
  -Body "Implement global search with keyboard shortcuts" `
  -Labels "enhancement,frontend" `
  -Milestone "v1.1.0" `
  -CreateBranch `
  -PushBranch

# Output:
# ✅ Issue #306 created
# ✅ Branch created: issue-306-add-search-functionality
# ✅ Branch pushed to remote

# 2. Start working
git checkout issue-306-add-search-functionality
# ... make changes ...

# 3. Create PR
gh pr create --base develop --head issue-306-add-search-functionality
```

### Example 2: Create Issue with Agent Assignment (Multi-Agent)

```powershell
# 1. Create issue with auto branch
.\scripts\issue-management\create-issue-enhanced.ps1 `
  -Title "Optimize database queries" `
  -Body "Add indexes and query optimization" `
  -Labels "performance,backend" `
  -Milestone "v1.0.0" `
  -CreateBranch `
  -PushBranch

# Output: Issue #307 created, branch created

# 2. Auto-assign to agent
.\scripts\agent-management\assign-agent-enhanced.ps1 `
  -IssueNumber 307 `
  -AgentName "auto"

# Output:
# Auto-assigned to Jason (Infrastructure/Testing)
# ✅ Comment added to issue
# ✅ Workflow docs updated

# 3. Check workflow doc
cat prompts/multi-agent-e2e-workflow.md
# Shows: Jason assigned to #307 in "Current Active Projects"
```

### Example 3: Bulk Issue Creation for Epic

```powershell
# Create multiple related issues for an epic
$issues = @(
  @{Title="Test Utils Setup"; Body="Foundation"; Labels="testing"},
  @{Title="Unit Tests"; Body="Add unit tests"; Labels="testing"},
  @{Title="E2E Tests"; Body="Add E2E tests"; Labels="testing"}
)

foreach ($issue in $issues) {
  .\scripts\issue-management\create-issue-enhanced.ps1 `
    -Title $issue.Title `
    -Body $issue.Body `
    -Labels $issue.Labels `
    -Milestone "Testing Epic" `
    -CreateBranch `
    -PushBranch
  
  Start-Sleep -Seconds 2  # Rate limiting
}

# Result: 3 issues created, 3 branches created and pushed
```

## 🔧 Integration with Existing Scripts

### Issue Configuration
```powershell
# Enhanced creation + configuration
.\scripts\issue-management\create-issue-enhanced.ps1 `
  -Title "Fix bug" -Body "Description" -CreateBranch

# Then configure project fields
.\scripts\issue-config-unified.ps1 `
  -IssueNumber 308 `
  -Preset frontend `
  -AddToProject
```

### Agent Status Updates
```powershell
# Create issue + assign agent
.\scripts\issue-management\create-issue-enhanced.ps1 `
  -Title "Feature" -Body "Desc" -CreateBranch

.\scripts\agent-management\assign-agent-enhanced.ps1 `
  -IssueNumber 309 -AgentName "chris"

# Update status when starting work
.\scripts\agent-status-update.ps1 `
  -IssueNumber 309 -Action start -AgentName "chris"
```

### PR Automation
```powershell
# Complete workflow from issue to merge
.\scripts\issue-management\create-issue-enhanced.ps1 `
  -Title "Update" -Body "Details" -CreateBranch

# ... make changes, commit, push ...

# Create PR
gh pr create --base develop

# Automate PR process
.\scripts\pr-automation-unified.ps1 `
  -PRNumber 123 -Action all -AutoFix
```

## 📊 Benefits

### Before Enhanced Automation:
1. Create issue manually in GitHub UI ❌
2. Copy issue number
3. Manually create branch with correct naming ❌
4. Push branch to remote ❌
5. Assign agent in GitHub UI ❌
6. Manually update workflow documentation ❌
7. Add comment about agent assignment ❌

**Total**: 7 manual steps, ~5 minutes

### After Enhanced Automation:
1. Run create-issue-enhanced.ps1 ✅
2. Run assign-agent-enhanced.ps1 ✅

**Total**: 2 commands, ~30 seconds

**Time Saved**: 90% reduction in manual work

## 🚀 Quick Start

### For Single Developers:
```powershell
# Read the single-developer workflow
cat prompts/workflows/e2e-issue-to-merge.md

# Create your first enhanced issue
.\scripts\issue-management\create-issue-enhanced.ps1 `
  -Title "My First Enhanced Issue" `
  -Body "Testing the new automation" `
  -Labels "test" `
  -CreateBranch `
  -PushBranch
```

### For Multi-Agent Teams:
```powershell
# Read the multi-agent workflow
cat prompts/multi-agent-e2e-workflow.md

# Create issue and assign to agent
.\scripts\issue-management\create-issue-enhanced.ps1 `
  -Title "Implement feature" `
  -Body "Feature description" `
  -CreateBranch

.\scripts\agent-management\assign-agent-enhanced.ps1 `
  -IssueNumber <NUMBER> `
  -AgentName "auto"

# Check updated workflow docs
cat prompts/multi-agent-e2e-workflow.md
```

## 🐛 Troubleshooting

### Issue: Branch Already Exists
```powershell
# Error: Branch issue-XXX-name already exists

# Solution: Delete existing branch first
git branch -d issue-XXX-name
git push origin --delete issue-XXX-name

# Then recreate issue with new branch
```

### Issue: Workflow Doc Not Updating
```powershell
# Check if workflow file exists
Test-Path prompts/workflows/multi-agent-e2e-workflow.md

# Manually run updater with dry run
.\scripts\core-utilities\update-workflow-docs.ps1 `
  -IssueNumber 292 `
  -AgentName "jason" `
  -IssueTitle "Test" `
  -DryRun

# Check permissions
Get-Acl prompts/workflows/multi-agent-e2e-workflow.md
```

### Issue: Agent Auto-Assignment Not Working
```powershell
# Run with dry run to see keyword matching
.\scripts\agent-management\assign-agent-enhanced.ps1 `
  -IssueNumber 292 `
  -AgentName "auto" `
  -DryRun

# Manually specify agent if auto-detection fails
.\scripts\agent-management\assign-agent-enhanced.ps1 `
  -IssueNumber 292 `
  -AgentName "jason"
```

## 📝 Best Practices

1. **Always use enhanced issue creation** for consistency
2. **Use auto-assignment** for objective agent selection
3. **Commit workflow doc changes** after agent assignments
4. **Review dry-run output** before executing
5. **Keep workflow docs in sync** with actual assignments
6. **Use descriptive issue titles** for better branch names

## 🔗 Related Documentation

- **Agent Management**: `scripts/agent-management/README.md`
- **Issue Management**: `scripts/issue-management/README.md`
- **Core Utilities**: `scripts/core-utilities/README.md`
- **PR Automation**: `scripts/pr-management/README.md`

---

**Last Updated**: 2025-10-10  
**Maintained By**: Portfolio OS Development Team  
**Questions?**: Create an issue or check existing documentation

