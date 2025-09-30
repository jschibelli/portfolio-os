# Portfolio OS Scripts

This directory contains essential automation scripts for the Portfolio OS project.

## 📁 **Current Scripts**

### **🆕 Unified Management Scripts (Recommended)**
- **`project-manager.ps1`** - Comprehensive project management (combines 14+ scripts)
- **`branch-manager.ps1`** - Branch operations and naming (combines 2+ scripts)
- **`issue-creator.ps1`** - Issue creation with templates (enhanced version)

### **Issue & PR Configuration**
- **`auto-configure-issue-simple.ps1`** - Simple issue configuration with presets
- **`auto-configure-issue.ps1`** - Full issue configuration with custom options
- **`auto-configure-pr.ps1`** - PR configuration and project field updates

### **Legacy Scripts (Still Available)**
- **`configure-project-fields-manual.ps1`** - Manual project field configuration
- **`create-remaining-issues.ps1`** - Create remaining issues
- **`rename-branches-with-issue-numbers.ps1`** - Rename branches

### **Project Setup**
- **`configure_project_20.sh`** - GitHub Project #20 configuration script

## 🚀 **Quick Start**

### **🆕 Unified Project Management (Recommended)**
```powershell
# Add blog issues to project and configure them
.\scripts\project-manager.ps1 -Operation "all" -Preset "blog" -Priority "P1" -Status "Ready"

# Set status for specific issues
.\scripts\project-manager.ps1 -Operation "status" -Issues @(196, 197, 198) -Status "In progress"

# Add labels and milestone to issues
.\scripts\project-manager.ps1 -Operation "labels" -Preset "dashboard" -Labels @("frontend", "priority: high")

# Dry run to see what would happen
.\scripts\project-manager.ps1 -Operation "all" -Preset "blog" -DryRun
```

### **🆕 Branch Management**
```powershell
# Update current branch name with issue number
.\scripts\branch-manager.ps1 -Operation "update" -Issues @(196) -Type "feature"

# Rename branch for specific issue
.\scripts\branch-manager.ps1 -Operation "rename" -Issues @(197) -Type "bugfix"

# List and validate all branches
.\scripts\branch-manager.ps1 -Operation "list"

# Validate current branch name
.\scripts\branch-manager.ps1 -Operation "validate"
```

### **🆕 Issue Creation**
```powershell
# Create a blog issue with template
.\scripts\issue-creator.ps1 -Template "blog" -Title "Advanced SEO Techniques" -AddToProject

# Create multiple dashboard issues
.\scripts\issue-creator.ps1 -Template "dashboard" -Count 3 -AddToProject

# Create a bug report
.\scripts\issue-creator.ps1 -Template "bug" -Title "Login form validation error"

# Create documentation task
.\scripts\issue-creator.ps1 -Template "docs" -Title "API documentation update"
```

### **Legacy Scripts (Still Available)**
```powershell
# Simple issue configuration
.\scripts\auto-configure-issue-simple.ps1 190 blog

# Full issue configuration
.\scripts\auto-configure-issue.ps1 -IssueNumber 190 -Priority "P1" -Size "M" -App "Portfolio Site" -Area "Frontend"

# PR configuration
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
