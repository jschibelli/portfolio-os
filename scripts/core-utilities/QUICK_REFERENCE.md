# Core Utilities Quick Reference

## Quick Commands

### Documentation Automation
```powershell
# Basic documentation update
.\docs-updater.ps1 -PRNumber 123 -UpdateChangelog

# Complete documentation generation
.\docs-updater.ps1 -PRNumber 123 -GenerateDocs

# Dry run preview
.\docs-updater.ps1 -PRNumber 123 -GenerateDocs -DryRun
```

### GitHub Integration
```powershell
# Load utilities
. .\get-github-utilities.ps1

# Get PR info
$prInfo = Get-PRInfo -PRNumber "123"

# Get comments
$comments = Get-PRComments -PRNumber "123"

# Get CR-GPT comments
$crgptComments = Get-CRGPTComments -PRNumber "123"

# Test utilities
Test-GitHubUtils
```

### AI Services
```powershell
# Load AI services
. .\manage-ai-services.ps1

# Initialize
Initialize-AIServices -Provider "openai"

# Basic completion
$response = Invoke-AICompletion -Prompt "Your prompt here"

# Code analysis
$analysis = Analyze-CodeWithAI -Code $code -Language "typescript"

# Implementation plan
$plan = Generate-ImplementationPlan -IssueDescription $desc -IssueTitle $title

# PR response
$response = Generate-PRResponse -CommentBody $comment -CommentAuthor $author
```

### Project Management
```powershell
# Set estimate
.\set-estimate-iteration.ps1 -IssueNumber 123 -Estimate 5

# Set iteration
.\set-estimate-iteration.ps1 -IssueNumber 123 -Iteration "Sprint 1"

# Set both
.\set-estimate-iteration.ps1 -IssueNumber 123 -Estimate 3 -Iteration "Sprint 2"
```

## Common Patterns

### PR Processing Workflow
```powershell
# Complete PR processing
. .\get-github-utilities.ps1
$prInfo = Get-PRInfo -PRNumber "123"
if ($prInfo.labels -contains "documentation") {
    .\docs-updater.ps1 -PRNumber "123" -GenerateDocs
}
```

### AI-Powered Analysis
```powershell
# AI code analysis
. .\manage-ai-services.ps1
Initialize-AIServices -Provider "openai"
$analysis = Analyze-CodeWithAI -Code $code -Language "typescript"
```

### Batch Operations
```powershell
# Batch issue management
$issues = @(123, 124, 125)
foreach ($issue in $issues) {
    .\set-estimate-iteration.ps1 -IssueNumber $issue -Estimate 3
}
```

## Environment Setup

### Required Environment Variables
```bash
# GitHub CLI (required)
gh auth login

# AI Services (optional)
export OPENAI_API_KEY="your-key"
export ANTHROPIC_API_KEY="your-key"
export AZURE_OPENAI_API_KEY="your-key"
```

### Project Configuration
```powershell
# Project IDs (Portfolio OS specific)
$projectId = "PVT_kwHOAEnMVc4BCu-c"
$estimateFieldId = "PVTF_lAHOAEnMVc4BCu-czg028qY"
$iterationFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028qY"
```

## Error Handling

### Common Error Patterns
```powershell
# GitHub authentication
try {
    $prInfo = Get-PRInfo -PRNumber "123"
} catch {
    Write-Error "GitHub authentication failed. Run 'gh auth login'"
}

# AI services
try {
    Initialize-AIServices -Provider "openai"
} catch {
    Write-Error "AI service initialization failed. Check API keys."
}

# Documentation updates
try {
    .\docs-updater.ps1 -PRNumber "123" -GenerateDocs
} catch {
    Write-Error "Documentation update failed. Check PR number and permissions."
}
```

## Debug Commands

### Enable Verbose Output
```powershell
$VerbosePreference = "Continue"
Get-PRInfo -PRNumber "123" -Verbose
```

### Test All Utilities
```powershell
# Test GitHub utilities
. .\get-github-utilities.ps1
Test-GitHubUtils

# Test AI services
. .\manage-ai-services.ps1
Initialize-AIServices -Provider "openai"
```

### Check Cache Status
```powershell
# AI cache statistics
. .\manage-ai-services.ps1
$stats = Get-AICacheStats
Write-Host "Cache items: $($stats.ItemCount)"
```

## Performance Tips

### Caching
```powershell
# Use AI caching
$response = Invoke-AICompletion -Prompt $prompt -UseCache

# Clear cache when needed
Clear-AICache
```

### Batch Operations
```powershell
# Batch documentation updates
$prNumbers = @("123", "124", "125")
foreach ($prNumber in $prNumbers) {
    .\docs-updater.ps1 -PRNumber $prNumber -UpdateChangelog
}
```

### Dry Run Testing
```powershell
# Always test with dry run first
.\docs-updater.ps1 -PRNumber "123" -GenerateDocs -DryRun
```

## File Locations

### Core Utilities
- `scripts/core-utilities/docs-updater.ps1` - Documentation automation
- `scripts/core-utilities/get-github-utilities.ps1` - GitHub integration
- `scripts/core-utilities/manage-ai-services.ps1` - AI services
- `scripts/core-utilities/set-estimate-iteration.ps1` - Project management

### Generated Files
- `docs/generated/` - Generated documentation
- `logs/` - Automation logs
- `CHANGELOG.md` - Updated changelog

## Quick Troubleshooting

### GitHub Issues
```powershell
# Check authentication
gh auth status

# Re-authenticate
gh auth login

# Check project access
gh project view 20
```

### AI Service Issues
```powershell
# Check API keys
echo $env:OPENAI_API_KEY

# Test different provider
Initialize-AIServices -Provider "anthropic"
```

### Documentation Issues
```powershell
# Check output directory
Test-Path "docs/generated"

# Create if missing
New-Item -ItemType Directory -Path "docs/generated" -Force
```

## Emergency Commands

### Reset Everything
```powershell
# Clear all caches
. .\manage-ai-services.ps1
Clear-AICache

# Reset verbose preference
$VerbosePreference = "SilentlyContinue"
```

### Test All Systems
```powershell
# Test GitHub
. .\get-github-utilities.ps1
Test-GitHubUtils

# Test AI services
. .\manage-ai-services.ps1
Initialize-AIServices -Provider "openai"

# Test documentation
.\docs-updater.ps1 -PRNumber "123" -GenerateDocs -DryRun
```

### Get Help
```powershell
# GitHub utilities help
Get-Help Get-PRInfo -Full

# AI services help
Get-Help Initialize-AIServices -Full

# Documentation help
.\docs-updater.ps1 -h
```
