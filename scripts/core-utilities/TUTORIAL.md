# Core Utilities Tutorial - Step-by-Step Developer Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Documentation Automation Tutorial](#documentation-automation-tutorial)
3. [GitHub Integration Tutorial](#github-integration-tutorial)
4. [AI Services Tutorial](#ai-services-tutorial)
5. [Project Management Tutorial](#project-management-tutorial)
6. [Advanced Integration Patterns](#advanced-integration-patterns)
7. [Troubleshooting Guide](#troubleshooting-guide)

## Getting Started

### Prerequisites
Before using the core utilities, ensure you have:

1. **PowerShell 5.1+** or **PowerShell Core 7+**
2. **GitHub CLI** installed and authenticated
3. **Environment variables** set for AI services (optional)

### Initial Setup
```powershell
# 1. Verify GitHub CLI authentication
gh auth status

# 2. If not authenticated, run:
gh auth login

# 3. Set up environment variables (optional)
$env:OPENAI_API_KEY = "your-openai-key"
$env:ANTHROPIC_API_KEY = "your-anthropic-key"
```

### Test Your Setup
```powershell
# Test GitHub utilities
. .\get-github-utilities.ps1
Test-GitHubUtils

# Test AI services (if configured)
. .\manage-ai-services.ps1
Initialize-AIServices -Provider "openai"
```

## Documentation Automation Tutorial

### Tutorial 1: Basic Documentation Update

**Scenario**: You have a PR that adds a new feature and want to update documentation automatically.

**Step 1**: Create a test PR or use an existing one
```powershell
# Get a PR number (replace with actual PR)
$prNumber = "123"
```

**Step 2**: Run documentation update
```powershell
# Basic documentation update
.\docs-updater.ps1 -PRNumber $prNumber -UpdateChangelog -UpdateReadme
```

**Step 3**: Check the results
```powershell
# Check if CHANGELOG.md was updated
Get-Content CHANGELOG.md | Select-Object -First 20

# Check if README.md was analyzed
Write-Host "README.md analysis completed"
```

### Tutorial 2: Complete Documentation Generation

**Scenario**: You want to generate comprehensive documentation for a PR with API changes.

**Step 1**: Run complete documentation generation
```powershell
# Generate all documentation types
.\docs-updater.ps1 -PRNumber $prNumber -UpdateChangelog -UpdateReadme -GenerateDocs
```

**Step 2**: Review generated files
```powershell
# Check generated documentation
Get-ChildItem "docs/generated" -Recurse

# View API documentation
Get-Content "docs/generated/api-changes-$prNumber.md"
```

### Tutorial 3: Dry Run Testing

**Scenario**: You want to preview what documentation updates would be made without actually executing them.

**Step 1**: Run dry run
```powershell
# Preview all documentation updates
.\docs-updater.ps1 -PRNumber $prNumber -GenerateDocs -DryRun
```

**Step 2**: Review the preview output
```powershell
# The script will show what would be done without executing
# Look for "[DRY RUN]" messages in the output
```

## GitHub Integration Tutorial

### Tutorial 1: Basic PR Data Retrieval

**Scenario**: You want to get information about a specific PR.

**Step 1**: Source the utilities
```powershell
# Load GitHub utilities
. .\get-github-utilities.ps1
```

**Step 2**: Get PR information
```powershell
# Get basic PR information
$prInfo = Get-PRInfo -PRNumber "123"
Write-Host "PR Title: $($prInfo.title)"
Write-Host "Author: $($prInfo.user.login)"
Write-Host "State: $($prInfo.state)"
```

**Step 3**: Get PR comments
```powershell
# Get all comments
$comments = Get-PRComments -PRNumber "123"
Write-Host "Total comments: $($comments.Count)"

# Get CR-GPT bot comments specifically
$crgptComments = Get-CRGPTComments -PRNumber "123"
Write-Host "CR-GPT comments: $($crgptComments.Count)"
```

### Tutorial 2: Advanced PR Analysis

**Scenario**: You want to analyze a PR for automated processing.

**Step 1**: Get comprehensive PR data
```powershell
# Get PR information
$prInfo = Get-PRInfo -PRNumber "123"

# Analyze PR labels
if ($prInfo.labels) {
    $labels = $prInfo.labels | ForEach-Object { $_.name }
    Write-Host "PR Labels: $($labels -join ', ')"
}

# Check for specific labels
$isFeature = $prInfo.labels | Where-Object { $_.name -match "feature|enhancement" }
if ($isFeature) {
    Write-Host "This is a feature PR"
}
```

**Step 2**: Process based on PR data
```powershell
# Example: Update documentation for feature PRs
if ($isFeature) {
    .\docs-updater.ps1 -PRNumber "123" -UpdateChangelog -GenerateDocs
}
```

### Tutorial 3: Project Board Integration

**Scenario**: You want to manage GitHub project board items.

**Step 1**: Get project item ID
```powershell
# Get project item ID for an issue
$projectItemId = Get-ProjectItemId -IssueNumber 123
if ($projectItemId) {
    Write-Host "Project Item ID: $projectItemId"
}
```

**Step 2**: Update project fields
```powershell
# Set project field value
$success = Set-ProjectFieldValue -ProjectItemId $projectItemId -FieldId "PVTF_lAHOAEnMVc4BCu-czg028qY" -OptionId "5"
if ($success) {
    Write-Host "Field updated successfully"
}
```

## AI Services Tutorial

### Tutorial 1: Basic AI Integration

**Scenario**: You want to use AI services for code analysis.

**Step 1**: Initialize AI services
```powershell
# Load AI services
. .\manage-ai-services.ps1

# Initialize with OpenAI
$initialized = Initialize-AIServices -Provider "openai"
if ($initialized) {
    Write-Host "AI services initialized successfully"
}
```

**Step 2**: Basic AI completion
```powershell
# Simple AI completion
$response = Invoke-AICompletion -Prompt "Explain what this code does: function add(a, b) { return a + b; }"
Write-Host "AI Response: $response"
```

### Tutorial 2: Code Analysis with AI

**Scenario**: You want to analyze code for quality and security issues.

**Step 1**: Prepare code for analysis
```powershell
# Sample code to analyze
$code = @"
function processUserData(userData) {
    const apiKey = 'sk-1234567890abcdef';
    return fetch('/api/users', {
        method: 'POST',
        headers: { 'Authorization': apiKey },
        body: JSON.stringify(userData)
    });
}
"@
```

**Step 2**: Analyze code with AI
```powershell
# Analyze code for security and quality
$analysis = Analyze-CodeWithAI -Code $code -Language "javascript" -AnalysisType "security"
Write-Host "Code Analysis:"
Write-Host $analysis
```

### Tutorial 3: Implementation Planning

**Scenario**: You want to generate an implementation plan for a GitHub issue.

**Step 1**: Prepare issue data
```powershell
# Issue information
$issueTitle = "Add user authentication system"
$issueDescription = @"
We need to implement a comprehensive user authentication system with:
- User registration
- Login/logout functionality
- Password reset
- Session management
- Role-based access control
"@
```

**Step 2**: Generate implementation plan
```powershell
# Generate detailed implementation plan
$plan = Generate-ImplementationPlan -IssueDescription $issueDescription -IssueTitle $issueTitle -TechStack "Next.js, TypeScript, React, Prisma"
Write-Host "Implementation Plan:"
Write-Host $plan
```

### Tutorial 4: PR Response Generation

**Scenario**: You want to generate intelligent responses to code review feedback.

**Step 1**: Prepare review data
```powershell
# Code review comment
$commentBody = "This function is too long and has multiple responsibilities. Consider breaking it down into smaller functions."
$commentAuthor = "code-reviewer"
$prTitle = "Add user management features"
$prDescription = "Implements user CRUD operations with validation"
```

**Step 2**: Generate response
```powershell
# Generate intelligent response
$response = Generate-PRResponse -CommentBody $commentBody -CommentAuthor $commentAuthor -PRTitle $prTitle -PRDescription $prDescription
Write-Host "Generated Response:"
Write-Host $response
```

## Project Management Tutorial

### Tutorial 1: Setting Issue Estimates

**Scenario**: You want to set story point estimates for issues.

**Step 1**: Set estimate for an issue
```powershell
# Set estimate for issue #123
.\set-estimate-iteration.ps1 -IssueNumber 123 -Estimate 5
```

**Step 2**: Verify the estimate was set
```powershell
# Check the issue in GitHub project board
gh project view 20
```

### Tutorial 2: Managing Iterations

**Scenario**: You want to assign issues to specific sprints.

**Step 1**: Set iteration for an issue
```powershell
# Assign issue to Sprint 1
.\set-estimate-iteration.ps1 -IssueNumber 123 -Iteration "Sprint 1"
```

**Step 2**: Set both estimate and iteration
```powershell
# Set both estimate and iteration
.\set-estimate-iteration.ps1 -IssueNumber 123 -Estimate 3 -Iteration "Sprint 2"
```

### Tutorial 3: Batch Issue Management

**Scenario**: You want to manage multiple issues at once.

**Step 1**: Create a batch script
```powershell
# Batch issue management script
$issues = @(
    @{ Number = 123; Estimate = 5; Iteration = "Sprint 1" },
    @{ Number = 124; Estimate = 3; Iteration = "Sprint 1" },
    @{ Number = 125; Estimate = 8; Iteration = "Sprint 2" }
)

foreach ($issue in $issues) {
    Write-Host "Processing issue #$($issue.Number)..."
    .\set-estimate-iteration.ps1 -IssueNumber $issue.Number -Estimate $issue.Estimate -Iteration $issue.Iteration
}
```

## Advanced Integration Patterns

### Pattern 1: Automated PR Processing

**Scenario**: Automatically process PRs based on their content and labels.

```powershell
# Complete PR processing workflow
function Process-PR {
    param([string]$PRNumber)
    
    # Load utilities
    . .\get-github-utilities.ps1
    . .\manage-ai-services.ps1
    
    # Get PR information
    $prInfo = Get-PRInfo -PRNumber $PRNumber
    if (-not $prInfo) {
        Write-Error "Failed to get PR information"
        return
    }
    
    # Initialize AI services
    Initialize-AIServices -Provider "openai"
    
    # Process based on labels
    $labels = $prInfo.labels | ForEach-Object { $_.name }
    
    if ($labels -contains "documentation") {
        Write-Host "Processing documentation updates..."
        .\docs-updater.ps1 -PRNumber $PRNumber -GenerateDocs
    }
    
    if ($labels -contains "feature") {
        Write-Host "Processing feature PR..."
        # Additional feature-specific processing
    }
    
    # Generate AI analysis
    $analysis = Analyze-CodeWithAI -Code $prInfo.body -Language "markdown"
    Write-Host "AI Analysis: $analysis"
}

# Use the function
Process-PR -PRNumber "123"
```

### Pattern 2: Intelligent Documentation Updates

**Scenario**: Use AI to determine what documentation needs updating.

```powershell
# AI-powered documentation updates
function Update-DocumentationWithAI {
    param([string]$PRNumber)
    
    # Load utilities
    . .\get-github-utilities.ps1
    . .\manage-ai-services.ps1
    
    # Initialize AI services
    Initialize-AIServices -Provider "openai"
    
    # Get PR information
    $prInfo = Get-PRInfo -PRNumber $PRNumber
    $comments = Get-PRComments -PRNumber $PRNumber
    
    # Analyze PR content with AI
    $analysis = Analyze-CodeWithAI -Code $prInfo.body -Language "markdown"
    
    # Determine documentation needs
    $needsChangelog = $analysis -match "feature|fix|breaking"
    $needsAPI = $analysis -match "api|endpoint|function"
    $needsComponent = $analysis -match "component|ui|interface"
    
    # Update documentation based on analysis
    if ($needsChangelog) {
        .\docs-updater.ps1 -PRNumber $PRNumber -UpdateChangelog
    }
    
    if ($needsAPI -or $needsComponent) {
        .\docs-updater.ps1 -PRNumber $PRNumber -GenerateDocs
    }
}

# Use the function
Update-DocumentationWithAI -PRNumber "123"
```

### Pattern 3: Automated Project Management

**Scenario**: Automatically manage project board items based on PR status.

```powershell
# Automated project management
function Manage-ProjectItems {
    param([string]$PRNumber)
    
    # Load utilities
    . .\get-github-utilities.ps1
    
    # Get PR information
    $prInfo = Get-PRInfo -PRNumber $PRNumber
    
    # Get related issues
    $relatedIssues = $prInfo.body | Select-String -Pattern "#\d+" -AllMatches
    foreach ($match in $relatedIssues.Matches) {
        $issueNumber = $match.Value -replace "#", ""
        
        # Get project item ID
        $projectItemId = Get-ProjectItemId -IssueNumber $issueNumber
        if ($projectItemId) {
            # Update project fields based on PR status
            switch ($prInfo.state) {
                "open" {
                    # Set status to "In Progress"
                    Set-ProjectFieldValue -ProjectItemId $projectItemId -FieldId "status" -OptionId "in-progress"
                }
                "closed" {
                    # Set status to "Done"
                    Set-ProjectFieldValue -ProjectItemId $projectItemId -FieldId "status" -OptionId "done"
                }
            }
        }
    }
}

# Use the function
Manage-ProjectItems -PRNumber "123"
```

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue 1: GitHub Authentication Errors
**Problem**: `gh auth status` shows not authenticated
**Solution**:
```powershell
# Re-authenticate
gh auth login

# Check authentication
gh auth status
```

#### Issue 2: AI Service Errors
**Problem**: AI services fail to initialize
**Solution**:
```powershell
# Check environment variables
echo $env:OPENAI_API_KEY

# Test with different provider
Initialize-AIServices -Provider "anthropic"
```

#### Issue 3: Project Board Access
**Problem**: Cannot access project board
**Solution**:
```powershell
# Check project access
gh project view 20

# Verify field IDs
gh project view 20 --json fields
```

#### Issue 4: Documentation Generation Fails
**Problem**: Documentation updates fail
**Solution**:
```powershell
# Run with dry run first
.\docs-updater.ps1 -PRNumber "123" -GenerateDocs -DryRun

# Check output directory permissions
Test-Path "docs/generated"
```

### Debug Mode

Enable verbose output for troubleshooting:

```powershell
# GitHub utilities
$VerbosePreference = "Continue"
Get-PRInfo -PRNumber "123" -Verbose

# AI services
Initialize-AIServices -Provider "openai" -Verbose

# Documentation updates
.\docs-updater.ps1 -PRNumber "123" -GenerateDocs -Verbose
```

### Performance Optimization

#### Caching
```powershell
# Use caching for AI responses
$response = Invoke-AICompletion -Prompt $prompt -UseCache

# Check cache statistics
$stats = Get-AICacheStats
Write-Host "Cache items: $($stats.ItemCount)"
Write-Host "Cache size: $($stats.TotalSizeKB) KB"
```

#### Batch Operations
```powershell
# Batch multiple operations
$prNumbers = @("123", "124", "125")
foreach ($prNumber in $prNumbers) {
    .\docs-updater.ps1 -PRNumber $prNumber -UpdateChangelog
}
```

## Best Practices

### 1. Error Handling
Always wrap utility calls in try-catch blocks:
```powershell
try {
    $prInfo = Get-PRInfo -PRNumber "123"
    if ($prInfo) {
        # Process PR data
    }
} catch {
    Write-Error "Failed to get PR information: $($_.Exception.Message)"
}
```

### 2. Resource Management
Clean up resources when done:
```powershell
# Clear AI cache when done
Clear-AICache

# Reset verbose preference
$VerbosePreference = "SilentlyContinue"
```

### 3. Testing
Always test with dry run mode first:
```powershell
# Test documentation updates
.\docs-updater.ps1 -PRNumber "123" -GenerateDocs -DryRun

# Test AI services
Initialize-AIServices -Provider "openai"
```

### 4. Logging
Implement proper logging for production use:
```powershell
# Log operations
$logFile = "logs/automation-$(Get-Date -Format 'yyyy-MM-dd').log"
Start-Transcript -Path $logFile

# Your automation code here

Stop-Transcript
```

This tutorial provides comprehensive guidance for using the core utilities effectively in your development workflow.
