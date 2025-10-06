# GitHub Issue Auto-Configuration System

## 🎯 Overview
This system automates the configuration of GitHub issues with proper project fields, labels, and milestone assignments for the Portfolio OS project.

## 🚀 Quick Start

### Basic Configuration
```powershell
.\scripts\auto-configure-issue-updated.ps1 -IssueNumber 190 -Priority "P1" -Size "M" -App "Portfolio Site" -Area "Frontend"
```

### Full Configuration
```powershell
.\scripts\auto-configure-issue-updated.ps1 -IssueNumber 190 -Priority "P1" -Size "M" -App "Portfolio Site" -Area "Frontend" -Estimate 3 -Milestone "Sprint 1" -Labels "ready-to-implement"
```

## 📋 Available Scripts

### 1. `auto-configure-issue-updated.ps1` (Recommended)
- **Purpose:** Complete issue configuration with all project fields
- **Features:** Priority, Size, App, Area, Estimate, Milestone, Labels
- **Reliability:** Uses `gh project item-edit` for reliable field updates

### 2. `set-estimate-iteration.ps1`
- **Purpose:** Set estimate and iteration fields specifically
- **Usage:** For updating existing issues with time tracking

### 3. Legacy Scripts (Deprecated)
- `auto-configure-issue.ps1` - Uses GraphQL mutations (unreliable)
- `auto-configure-issue-simple.ps1` - Uses GraphQL mutations (unreliable)

## 🔧 Project Field Mappings

### Field IDs (Current as of 2025-01-07)
- **Project ID:** PVT_kwHOAEnMVc4BCu-c
- **Status Field:** PVTSSF_lAHOAEnMVc4BCu-czg028oM
- **Priority Field:** PVTSSF_lAHOAEnMVc4BCu-czg028qQ
- **Size Field:** PVTSSF_lAHOAEnMVc4BCu-czg028qU
- **App Field:** PVTSSF_lAHOAEnMVc4BCu-czg156-s
- **Area Field:** PVTSSF_lAHOAEnMVc4BCu-czg156_Y
- **Estimate Field:** PVTF_lAHOAEnMVc4BCu-czg028qY

### Priority Options
- **P0:** 79628723 (Critical/Blocker)
- **P1:** 0a877460 (High)
- **P2:** da944a9c (Medium)

### Size Options
- **XS:** 911790be (Extra Small)
- **S:** b277fb01 (Small)
- **M:** 86db8eb3 (Medium)
- **L:** 853c8207 (Large)
- **XL:** 2d0801e2 (Extra Large)

### App Options
- **Docs:** e504fedd
- **Portfolio Site:** de5faa4a
- **Dashboard:** d134f386
- **Chatbot:** c95306ff

### Area Options
- **Frontend:** 5618641d
- **Content:** 663d7084
- **Infra:** 5a298e61
- **DX/Tooling:** a67a98e5

### Estimate Options (Number Field)
- **1-2 days:** 1
- **3-5 days:** 3
- **1 week:** 5
- **2 weeks:** 10
- **1 month:** 20

## 🎯 Configuration Presets

### Blog Issues
```powershell
.\scripts\auto-configure-issue-updated.ps1 -IssueNumber 190 -Priority "P1" -Size "M" -App "Portfolio Site" -Area "Frontend" -Estimate 3
```

### Dashboard Issues
```powershell
.\scripts\auto-configure-issue-updated.ps1 -IssueNumber 191 -Priority "P1" -Size "M" -App "Dashboard" -Area "Frontend" -Estimate 3
```

### Documentation Issues
```powershell
.\scripts\auto-configure-issue-updated.ps1 -IssueNumber 192 -Priority "P2" -Size "S" -App "Docs" -Area "Content" -Estimate 1
```

### Infrastructure Issues
```powershell
.\scripts\auto-configure-issue-updated.ps1 -IssueNumber 193 -Priority "P1" -Size "L" -App "Portfolio Site" -Area "Infra" -Estimate 5
```

## 🔍 Troubleshooting

### Common Issues
- **Issue not found:** Verify issue number exists
- **Project not found:** Ensure issue is added to the correct project
- **Field update fails:** Use `gh project item-edit` instead of GraphQL mutations
- **Permission denied:** Ensure GitHub CLI is authenticated

### Debug Commands
```bash
# Check GitHub CLI authentication
gh auth status

# List available projects
gh project list

# View issue details
gh issue view ISSUE_NUMBER --json id,projectItems

# Get current project field values
gh project view 20 --json fields

# Test individual field update
gh project item-edit --id PROJECT_ITEM_ID --field-id FIELD_ID --project-id PROJECT_ID --single-select-option-id OPTION_ID
```

### Why Use `gh project item-edit` Instead of GraphQL?
- **GraphQL mutations can "succeed" but not actually update fields** - this is a known GitHub API issue
- **`gh project item-edit` is more reliable** - it directly updates the project fields
- **Better error handling** - clearer success/failure feedback
- **Simpler syntax** - no need to construct complex GraphQL mutations

## 📚 Best Practices

1. **Use the updated scripts** (`auto-configure-issue-updated.ps1`) for reliability
2. **Set estimate values** for better sprint planning (1-20 days)
3. **Set milestone** for issue tracking and sprint planning
4. **Use appropriate labels** for filtering and organization
5. **Configure all project fields** for proper project board organization
6. **Test the automation** with a test issue before using in production
7. **Check field IDs** if project structure changes using `gh project view 20 --json fields`

## 🔄 Integration with Development Workflow

1. **Create issue** using GitHub CLI or web interface
2. **Run automation script** to configure project fields
3. **Issue appears** in project board with correct status and priority
4. **Begin development** with proper project tracking

## 🛠️ Maintenance

- **Update field IDs** if project structure changes
- **Add new presets** for different issue types
- **Test automation** regularly with new issues
- **Document changes** to configuration options

## 📝 Examples

### Setting Estimate Only
```powershell
.\scripts\set-estimate-iteration.ps1 -IssueNumber 190 -Estimate 3
```

### Setting Both Estimate and Iteration
```powershell
.\scripts\set-estimate-iteration.ps1 -IssueNumber 190 -Estimate 3 -Iteration "Sprint 1"
```

### Manual Field Updates
```bash
# Get project item ID
ISSUE_ID=$(gh issue view ISSUE_NUMBER --json id -q .id)
PROJECT_ITEM_ID=$(gh api graphql -f query='query($issueId: ID!) { node(id: $issueId) { ... on Issue { projectItems(first: 10) { nodes { id project { id title } } } } } }' -f issueId=$ISSUE_ID | jq -r '.data.node.projectItems.nodes[0].id')

# Update Priority
gh project item-edit --id $PROJECT_ITEM_ID --field-id "PVTSSF_lAHOAEnMVc4BCu-czg028qQ" --project-id "PVT_kwHOAEnMVc4BCu-c" --single-select-option-id "0a877460"
```

## 🎉 Success!

The auto-configuration system is now working reliably with:
- ✅ **Priority, Size, App, Area fields** properly set
- ✅ **Estimate field** for time tracking
- ✅ **Iteration field** for sprint planning
- ✅ **Reliable field updates** using `gh project item-edit`
- ✅ **Better error handling** and debugging
- ✅ **Updated documentation** with current field IDs

Use `.\scripts\auto-configure-issue-updated.ps1` for all new issue configurations!
