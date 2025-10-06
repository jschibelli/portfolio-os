# GitHub Issue Auto-Configuration Prompt

## Purpose
Automatically configure GitHub issues with proper project fields, labels, and milestone assignments for the Portfolio OS project.

## Usage
When creating or updating GitHub issues, use this automation to ensure consistent project field configuration.

## Available Scripts

### 1. Updated Configuration Script (Recommended)
**File:** `scripts/auto-configure-issue-updated.ps1`

**Usage:**
```powershell
# Basic configuration
.\scripts\auto-configure-issue-updated.ps1 -IssueNumber 190 -Priority "P1" -Size "M" -App "Portfolio Site" -Area "Frontend"

# Full configuration with estimate and milestone
.\scripts\auto-configure-issue-updated.ps1 -IssueNumber 190 -Priority "P1" -Size "M" -App "Portfolio Site" -Area "Frontend" -Estimate 3 -Milestone "Sprint 1" -Labels "ready-to-implement"
```

### 2. Set Estimate and Iteration
**File:** `scripts/set-estimate-iteration.ps1`

**Usage:**
```powershell
# Set estimate only
.\scripts\set-estimate-iteration.ps1 -IssueNumber 190 -Estimate 3

# Set both estimate and iteration
.\scripts\set-estimate-iteration.ps1 -IssueNumber 190 -Estimate 3 -Iteration "Sprint 1"
```

### 3. Legacy Scripts (Deprecated)
**Files:** `scripts/auto-configure-issue.ps1`, `scripts/auto-configure-issue-simple.ps1`

**Note:** These scripts use GraphQL mutations which can fail silently. Use the updated scripts above instead.

## Configuration Presets

### Blog Issues
- **Priority:** P1 (High)
- **Size:** M (Medium)
- **App:** Portfolio Site
- **Area:** Frontend
- **Labels:** ready-to-implement, priority: high, area: functionality

### Dashboard Issues
- **Priority:** P1 (High)
- **Size:** M (Medium)
- **App:** Dashboard
- **Area:** Frontend
- **Labels:** ready-to-implement, priority: high, area: functionality

### Documentation Issues
- **Priority:** P2 (Medium)
- **Size:** S (Small)
- **App:** Docs
- **Area:** Content
- **Labels:** ready-to-implement, priority: medium, area: content

### Infrastructure Issues
- **Priority:** P1 (High)
- **Size:** L (Large)
- **App:** Portfolio Site
- **Area:** Infra
- **Labels:** ready-to-implement, priority: high, area: infra

## Project Field Mappings

### Field IDs (Current as of 2025-01-07)
- **Project ID:** PVT_kwHOAEnMVc4BCu-c
- **Status Field:** PVTSSF_lAHOAEnMVc4BCu-czg028oM
- **Priority Field:** PVTSSF_lAHOAEnMVc4BCu-czg028qQ
- **Size Field:** PVTSSF_lAHOAEnMVc4BCu-czg028qU
- **App Field:** PVTSSF_lAHOAEnMVc4BCu-czg156-s
- **Area Field:** PVTSSF_lAHOAEnMVc4BCu-czg156_Y
- **Estimate Field:** PVTF_lAHOAEnMVc4BCu-czg028qY
- **Iteration Field:** PVTSSF_lAHOAEnMVc4BCu-czg028qY

### Status Options
- **Ready:** e18bf179
- **In progress:** 47fc9ee4
- **In review:** aba860b9
- **Done:** 98236657

### Priority Options
- **P0:** 79628723
- **P1:** 0a877460
- **P2:** da944a9c

### Size Options
- **XS:** 911790be
- **S:** b277fb01
- **M:** 86db8eb3
- **L:** 853c8207
- **XL:** 2d0801e2

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

## GitHub Actions Integration

### Workflow Example
```yaml
name: Auto-Configure Issue
on:
  issues:
    types: [opened, edited]

jobs:
  configure-issue:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Configure Issue
        run: |
          # Add your automation logic here
          echo "Configuring issue #${{ github.event.issue.number }}"
```

## Manual Configuration Commands

### Set Project Fields (Recommended Method)
```bash
# Get issue ID
ISSUE_ID=$(gh issue view ISSUE_NUMBER --json id -q .id)

# Get project item ID
PROJECT_ITEM_ID=$(gh api graphql -f query='query($issueId: ID!) { node(id: $issueId) { ... on Issue { projectItems(first: 10) { nodes { id project { id title } } } } } }' -f issueId=$ISSUE_ID | jq -r '.data.node.projectItems.nodes[0].id')

# Update fields using gh project item-edit (RECOMMENDED)
# Priority
gh project item-edit --id $PROJECT_ITEM_ID --field-id "PVTSSF_lAHOAEnMVc4BCu-czg028qQ" --project-id "PVT_kwHOAEnMVc4BCu-c" --single-select-option-id "0a877460"

# Size
gh project item-edit --id $PROJECT_ITEM_ID --field-id "PVTSSF_lAHOAEnMVc4BCu-czg028qU" --project-id "PVT_kwHOAEnMVc4BCu-c" --single-select-option-id "86db8eb3"

# App
gh project item-edit --id $PROJECT_ITEM_ID --field-id "PVTSSF_lAHOAEnMVc4BCu-czg156-s" --project-id "PVT_kwHOAEnMVc4BCu-c" --single-select-option-id "de5faa4a"

# Area
gh project item-edit --id $PROJECT_ITEM_ID --field-id "PVTSSF_lAHOAEnMVc4BCu-czg156_Y" --project-id "PVT_kwHOAEnMVc4BCu-c" --single-select-option-id "5618641d"

# Estimate (number field)
gh project item-edit --id $PROJECT_ITEM_ID --field-id "PVTF_lAHOAEnMVc4BCu-czg028qY" --project-id "PVT_kwHOAEnMVc4BCu-c" --number 3

# Sprint/Iteration (if needed)
gh project item-edit --id $PROJECT_ITEM_ID --field-id "PVTSSF_lAHOAEnMVc4BCu-czg028qY" --project-id "PVT_kwHOAEnMVc4BCu-c" --iteration-id "ITERATION_ID"
```

### Set Milestone
```bash
gh issue edit ISSUE_NUMBER --milestone "MILESTONE_NAME"
```

### Set Labels
```bash
gh issue edit ISSUE_NUMBER --add-label "label1,label2,label3"
```

## Key Improvements (2025-01-07)

### ✅ What's Fixed
- **Reliable field updates** using `gh project item-edit` instead of GraphQL mutations
- **Added Estimate field support** for story points/time tracking
- **Added Iteration field support** for sprint planning
- **Better error handling** with clear success/failure feedback
- **Updated field IDs** to current project structure

### ✅ What's New
- **Estimate field** - Set story points (1-20 days)
- **Iteration field** - Assign to sprints/iterations
- **Simplified syntax** - No complex GraphQL mutations needed
- **Better debugging** - Clear error messages and status updates

## Best Practices

1. **Use the updated scripts** (`auto-configure-issue-updated.ps1`) for reliability
2. **Set estimate values** for better sprint planning (1-20 days)
3. **Set milestone** for issue tracking and sprint planning
4. **Use appropriate labels** for filtering and organization
5. **Configure all project fields** for proper project board organization
6. **Test the automation** with a test issue before using in production
7. **Check field IDs** if project structure changes using `gh project view 20 --json fields`

## Troubleshooting

### Common Issues
- **Issue not found:** Verify issue number exists
- **Project not found:** Ensure issue is added to the correct project
- **Field update fails:** Use `gh project item-edit` instead of GraphQL mutations
- **Permission denied:** Ensure GitHub CLI is authenticated
- **GraphQL mutations succeed but don't update:** This is a known issue - use `gh project item-edit` instead

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

## Integration with Development Workflow

1. **Create issue** using GitHub CLI or web interface
2. **Run automation script** to configure project fields
3. **Issue appears** in project board with correct status and priority
4. **Begin development** with proper project tracking

## Maintenance

- **Update field IDs** if project structure changes
- **Add new presets** for different issue types
- **Test automation** regularly with new issues
- **Document changes** to configuration options
