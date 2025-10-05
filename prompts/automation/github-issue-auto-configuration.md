# GitHub Issue Auto-Configuration Prompt

## Purpose
Automatically configure GitHub issues with proper project fields, labels, and milestone assignments for the Portfolio OS project.

## Usage
When creating or updating GitHub issues, use this automation to ensure consistent project field configuration.

## Available Scripts

### 1. Full Configuration Script
**File:** `scripts/auto-configure-issue.ps1`

**Usage:**
```powershell
.\scripts\auto-configure-issue.ps1 -IssueNumber 190 -Priority "P1" -Size "M" -App "Portfolio Site" -Area "Frontend" -Milestone "Blog Functionality & Connection Issues" -Labels "ready-to-implement,priority: high,area: functionality"
```

### 2. Simplified Script with Presets
**File:** `scripts/auto-configure-issue-simple.ps1`

**Usage:**
```powershell
# Using presets
.\scripts\auto-configure-issue-simple.ps1 190 blog
.\scripts\auto-configure-issue-simple.ps1 191 dashboard
.\scripts\auto-configure-issue-simple.ps1 192 docs
.\scripts\auto-configure-issue-simple.ps1 193 infra

# Custom configuration
.\scripts\auto-configure-issue-simple.ps1 -IssueNumber 190 -Priority "P1" -Size "M" -App "Portfolio Site" -Area "Frontend" -Milestone "Blog Functionality & Connection Issues"
```

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

### Set Project Fields
```bash
# Get issue ID
ISSUE_ID=$(gh issue view ISSUE_NUMBER --json id -q .id)

# Get project item ID
PROJECT_ITEM_ID=$(gh api graphql -f query='query($issueId: ID!) { node(id: $issueId) { ... on Issue { projectItems(first: 10) { nodes { id project { id title } } } } } }' -f issueId=$ISSUE_ID | jq -r '.data.node.projectItems.nodes[0].id')

# Update fields (example for Status: Ready)
gh api graphql -f query='mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: String!) { updateProjectV2ItemFieldValue(input: {projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: {singleSelectOptionId: $value}}) { projectV2Item { id } } }' -f projectId="PVT_kwHOAEnMVc4BCu-c" -f itemId=$PROJECT_ITEM_ID -f fieldId="PVTSSF_lAHOAEnMVc4BCu-czg028oM" -f value="e18bf179"
```

### Set Milestone
```bash
gh issue edit ISSUE_NUMBER --milestone "MILESTONE_NAME"
```

### Set Labels
```bash
gh issue edit ISSUE_NUMBER --add-label "label1,label2,label3"
```

## Best Practices

1. **Always use presets** when possible for consistency
2. **Set milestone** for issue tracking and sprint planning
3. **Use appropriate labels** for filtering and organization
4. **Configure all project fields** for proper project board organization
5. **Test the automation** with a test issue before using in production

## Troubleshooting

### Common Issues
- **Issue not found:** Verify issue number exists
- **Project not found:** Ensure issue is added to the correct project
- **Field update fails:** Check field IDs and option IDs are correct
- **Permission denied:** Ensure GitHub CLI is authenticated

### Debug Commands
```bash
# Check GitHub CLI authentication
gh auth status

# List available projects
gh project list

# View issue details
gh issue view ISSUE_NUMBER --json id,projectItems

# Test GraphQL query
gh api graphql -f query='query { viewer { login } }'
```

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
