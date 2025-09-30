# Portfolio OS Scripts

This directory contains essential automation scripts for the Portfolio OS project.

## 📁 **Current Scripts**

### **Issue & PR Configuration**
- **`auto-configure-issue-simple.ps1`** - Simple issue configuration with presets
- **`auto-configure-issue.ps1`** - Full issue configuration with custom options
- **`auto-configure-pr.ps1`** - PR configuration and project field updates

## 🚀 **Quick Start**

### **Issue Configuration (Recommended)**
```powershell
# Using presets
.\scripts\auto-configure-issue-simple.ps1 190 blog
.\scripts\auto-configure-issue-simple.ps1 191 dashboard
.\scripts\auto-configure-issue-simple.ps1 192 docs
.\scripts\auto-configure-issue-simple.ps1 193 infra

# Custom configuration
.\scripts\auto-configure-issue-simple.ps1 -IssueNumber 190 -Priority "P1" -Size "M" -App "Portfolio Site" -Area "Frontend" -Milestone "Blog Functionality & Connection Issues"
```

### **Full Issue Configuration**
```powershell
.\scripts\auto-configure-issue.ps1 -IssueNumber 190 -Priority "P1" -Size "M" -App "Portfolio Site" -Area "Frontend" -Milestone "Blog Functionality & Connection Issues" -Labels "ready-to-implement,priority: high,area: functionality"
```

### **PR Configuration**
```powershell
.\scripts\auto-configure-pr.ps1 -PRNumber 200
```

## 📂 **Other Script Directories**

### **`/apps/site/scripts/`** - Site-Specific Scripts
Contains comprehensive toolset for site management:
- **Build & Deployment**: `build.sh`, `vercel-build.js`
- **Image Optimization**: `create-optimized-images.js`
- **Content Management**: `import-hashnode-articles.ts`, `validate-case-studies.ts`
- **Development Tools**: `code-quality-checker.ps1`, `performance-optimization.js`
- **Setup & Configuration**: Various setup scripts for auth, analytics, OAuth
- **Automation**: PR automation, issue implementation, response generation

### **`/apps/dashboard/scripts/`** - Dashboard-Specific Scripts
Contains specialized scripts for dashboard maintenance:
- **`dependency-maintenance.js`** - Dependency updates and maintenance
- **`implementation-verifier.js`** - Implementation verification
- **`code-quality-checker.js`** - Dashboard-specific code quality checks

## Available Presets

| Preset | Priority | Size | App | Area | Use Case |
|--------|----------|------|-----|------|----------|
| `blog` | P1 | M | Portfolio Site | Frontend | Blog-related issues |
| `dashboard` | P1 | M | Dashboard | Frontend | Dashboard features |
| `docs` | P2 | S | Docs | Content | Documentation |
| `infra` | P1 | L | Portfolio Site | Infra | Infrastructure |

## GitHub Actions

The automation is also available as a GitHub Action that triggers automatically when issues are created or edited. See `.github/workflows/auto-configure-issues.yml` for details.

## Manual Configuration

If you prefer to configure issues manually, use these commands:

```bash
# Set milestone
gh issue edit ISSUE_NUMBER --milestone "MILESTONE_NAME"

# Set labels
gh issue edit ISSUE_NUMBER --add-label "label1,label2,label3"

# Set project fields (requires project item ID)
gh api graphql -f query='mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: String!) { updateProjectV2ItemFieldValue(input: {projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: {singleSelectOptionId: $value}}) { projectV2Item { id } } }' -f projectId="PVT_kwHOAEnMVc4BCu-c" -f itemId="PROJECT_ITEM_ID" -f fieldId="FIELD_ID" -f value="OPTION_ID"
```

## Troubleshooting

### Common Issues
- **Permission denied**: Ensure GitHub CLI is authenticated (`gh auth login`)
- **Issue not found**: Verify issue number exists
- **Project not found**: Ensure issue is added to the correct project
- **Field update fails**: Check field IDs and option IDs are correct

### Debug Commands
```bash
# Check authentication
gh auth status

# List projects
gh project list

# View issue details
gh issue view ISSUE_NUMBER --json id,projectItems

# Test GraphQL
gh api graphql -f query='query { viewer { login } }'
```

## Configuration Reference

See `prompts/github-issue-auto-configuration.md` for detailed configuration options and field mappings.
