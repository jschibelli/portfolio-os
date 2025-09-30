# Portfolio OS Scripts

This directory contains essential automation scripts for the Portfolio OS project.

## 📁 **Current Scripts**

### **Issue & PR Configuration**
- **`auto-configure-issue-simple.ps1`** - Simple issue configuration with presets
- **`auto-configure-issue.ps1`** - Full issue configuration with custom options
- **`auto-configure-pr.ps1`** - PR configuration and project field updates

### **Project Management**
- **`add-all-issues-to-project.ps1`** - Add all issues to project
- **`add-and-configure-blog-issues.ps1`** - Configure blog issues
- **`add-and-set-status-ready.ps1`** - Set status to ready
- **`add-blog-issues-to-project.ps1`** - Add blog issues to project
- **`add-issues-to-project.ps1`** - Add issues to project
- **`add-labels-milestone-to-all-issues.ps1`** - Add labels and milestones

### **Issue Configuration**
- **`configure-all-blog-issues.ps1`** - Configure all blog issues
- **`configure-blog-issues.ps1`** - Configure blog issues
- **`configure-blog-issues-complete.ps1`** - Complete blog configuration
- **`configure-project-fields-manual.ps1`** - Manual project field configuration
- **`create-remaining-issues.ps1`** - Create remaining issues

### **Status Management**
- **`set-all-issues-status-ready.ps1`** - Set all issues to ready status
- **`set-project-status-direct.ps1`** - Set project status directly
- **`set-status-ready-cli.ps1`** - Set status ready via CLI

### **Branch Management**
- **`rename-branches-with-issue-numbers.ps1`** - Rename branches
- **`update-issue-branch-names.ps1`** - Update issue branch names
- **`update-issue-branch-names-simple.ps1`** - Simple branch name updates

### **Project Setup**
- **`configure_project_20.sh`** - GitHub Project #20 configuration script

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
