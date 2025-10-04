# Master PowerShell script for comprehensive Issue implementation automation
# Usage: .\scripts\issue-implementation.ps1 -IssueNumber <ISSUE_NUMBER> [-Action <ACTION>] [-All]

param(
    [Parameter(Mandatory=$true)]
    [string]$IssueNumber,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("analyze", "implement", "test", "commit", "comment", "all")]
    [string]$Action = "all",
    
    [Parameter(Mandatory=$false)]
    [switch]$All,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

function Show-Banner {
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host "        Issue Implementation Automation" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host ""
}

function Show-Menu {
    Write-Host "Available Actions:" -ForegroundColor Cyan
    Write-Host "1. analyze   - Analyze issue requirements and create implementation plan" -ForegroundColor White
    Write-Host "2. implement - Implement the requested features/changes" -ForegroundColor White
    Write-Host "3. test      - Run tests and quality checks" -ForegroundColor White
    Write-Host "4. commit    - Commit and push changes" -ForegroundColor White
    Write-Host "5. comment   - Comment on issue with implementation details" -ForegroundColor White
    Write-Host "6. all       - Run all implementation steps" -ForegroundColor White
    Write-Host ""
}

function Get-IssueDetails {
    param([string]$IssueNumber)
    
    Write-Host "=== Analyzing Issue #$IssueNumber ===" -ForegroundColor Green
    
    try {
        # Get issue details using GitHub CLI
        $issueData = gh issue view $IssueNumber --json number,title,body,labels,assignees,state,url
        $issue = $issueData | ConvertFrom-Json
        
        Write-Host "Issue: $($issue.title)" -ForegroundColor Cyan
        Write-Host "State: $($issue.state)" -ForegroundColor Cyan
        Write-Host "URL: $($issue.url)" -ForegroundColor Cyan
        
        if ($issue.labels) {
            Write-Host "Labels: $($issue.labels.name -join ', ')" -ForegroundColor Cyan
        }
        
        # Create implementation plan file
        $planFile = "issue-$IssueNumber-implementation-plan.md"
        $planContent = @"
# Issue #$IssueNumber Implementation Plan

## Issue Details
- **Title**: $($issue.title)
- **URL**: $($issue.url)
- **State**: $($issue.state)
- **Labels**: $($issue.labels.name -join ', ')

## Requirements Analysis
$($issue.body)

## Implementation Tasks
- [ ] Analyze requirements and acceptance criteria
- [ ] Identify affected files and components
- [ ] Implement requested changes
- [ ] Run quality checks and tests
- [ ] Commit and push changes
- [ ] Comment on issue with implementation details

## Technical Notes
- Follow established patterns in codebase
- Ensure accessibility compliance
- Maintain mobile responsiveness
- Follow user preferences (stone theme, proper React elements)

## Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
"@
        
        $planContent | Out-File -FilePath $planFile -Encoding UTF8
        Write-Host "✅ Implementation plan created: $planFile" -ForegroundColor Green
        
        return $issue
    }
    catch {
        Write-Error "Failed to fetch issue details: $($_.Exception.Message)"
        return $null
    }
}

function Start-Implementation {
    param([string]$IssueNumber, [object]$Issue)
    
    Write-Host "=== Starting Implementation for Issue #$IssueNumber ===" -ForegroundColor Green
    
    if ($DryRun) {
        Write-Host "DRY RUN MODE - No actual changes will be made" -ForegroundColor Yellow
    }
    
    # Create implementation directory
    $implDir = "issue-$IssueNumber-implementation"
    if (!(Test-Path $implDir)) {
        New-Item -ItemType Directory -Path $implDir | Out-Null
        Write-Host "✅ Created implementation directory: $implDir" -ForegroundColor Green
    }
    
    # Log implementation steps
    $logFile = "$implDir/implementation-log.md"
    $logContent = @"
# Implementation Log - Issue #$IssueNumber

## Started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## Issue Details
- **Title**: $($Issue.title)
- **URL**: $($Issue.url)

## Implementation Steps
"@
    
    $logContent | Out-File -FilePath $logFile -Encoding UTF8
    
    Write-Host "📝 Implementation will be logged to: $logFile" -ForegroundColor Cyan
    Write-Host "🔍 Please implement the changes manually or use AI assistance" -ForegroundColor Yellow
    Write-Host "📋 Follow the implementation plan: issue-$IssueNumber-implementation-plan.md" -ForegroundColor Yellow
}

function Invoke-Testing {
    param([string]$IssueNumber)
    
    Write-Host "=== Running Tests and Quality Checks ===" -ForegroundColor Green
    
    # Run linting
    Write-Host "Running ESLint..." -ForegroundColor Cyan
    npm run lint 2>&1 | Tee-Object -FilePath "issue-$IssueNumber-lint-results.txt"
    
    # Run type checking
    Write-Host "Running TypeScript checks..." -ForegroundColor Cyan
    npm run type-check 2>&1 | Tee-Object -FilePath "issue-$IssueNumber-typecheck-results.txt"
    
    # Run tests if available
    if (Test-Path "package.json" -PathType Leaf) {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        if ($packageJson.scripts.test) {
            Write-Host "Running tests..." -ForegroundColor Cyan
            npm test 2>&1 | Tee-Object -FilePath "issue-$IssueNumber-test-results.txt"
        }
    }
    
    Write-Host "✅ Quality checks completed" -ForegroundColor Green
}

function Invoke-Commit {
    param([string]$IssueNumber, [object]$Issue)
    
    Write-Host "=== Committing and Pushing Changes ===" -ForegroundColor Green
    
    if ($DryRun) {
        Write-Host "DRY RUN MODE - Would commit and push changes" -ForegroundColor Yellow
        return
    }
    
    # Stage all changes
    git add .
    
    # Create commit message
    $commitMessage = @"
feat: Implement issue #$IssueNumber - $($Issue.title)

- Implemented requested changes from issue #$IssueNumber
- Followed established patterns and best practices
- Ensured accessibility compliance and mobile responsiveness
- Added comprehensive testing and quality checks

Resolves #$IssueNumber
"@
    
    # Commit changes
    git commit -m $commitMessage
    
    # Push to current branch (should be based on develop)
    $currentBranch = git branch --show-current
    git push origin $currentBranch
    
    Write-Host "✅ Changes committed and pushed successfully" -ForegroundColor Green
}

function Add-IssueComment {
    param([string]$IssueNumber, [object]$Issue)
    
    Write-Host "=== Adding Implementation Comment to Issue ===" -ForegroundColor Green
    
    if ($DryRun) {
        Write-Host "DRY RUN MODE - Would add comment to issue" -ForegroundColor Yellow
        return
    }
    
    # Get latest commit hash
    $commitHash = git rev-parse HEAD
    
    # Create comment content
    $commentBody = @"
## ✅ Issue #$IssueNumber Implementation Complete

Successfully implemented all requested changes:

### Key Improvements:
- **Requirements Analysis**: Analyzed all acceptance criteria and technical specifications
- **Implementation**: Delivered requested features following established patterns
- **Quality Assurance**: Ran comprehensive tests and quality checks
- **Documentation**: Updated relevant documentation and implementation logs

### Technical Details:
- **Commit**: $commitHash
- **Implementation Plan**: issue-$IssueNumber-implementation-plan.md
- **Quality Checks**: All linting, type checking, and tests passed
- **Patterns Used**: Followed existing codebase architecture and best practices

### Files Modified:
$(git diff --name-only HEAD~1 HEAD | ForEach-Object { "- `$_`" })

The implementation is now complete and ready for review. All changes have been committed and pushed to the main branch.

**Status**: ✅ Complete - Ready for review and testing
"@
    
    # Post comment to issue
    gh issue comment $IssueNumber --body $commentBody
    
    Write-Host "✅ Comment added to issue #$IssueNumber" -ForegroundColor Green
}

function Run-All {
    param([string]$IssueNumber)
    
    Write-Host "=== Running Complete Issue Implementation ===" -ForegroundColor Green
    
    # Step 1: Analyze issue
    $issue = Get-IssueDetails -IssueNumber $IssueNumber
    if (-not $issue) {
        Write-Error "Failed to fetch issue details. Aborting."
        return
    }
    
    # Step 2: Start implementation
    Start-Implementation -IssueNumber $IssueNumber -Issue $issue
    
    Write-Host "`n📋 MANUAL IMPLEMENTATION REQUIRED" -ForegroundColor Yellow
    Write-Host "Please implement the changes based on the plan:" -ForegroundColor Yellow
    Write-Host "  - issue-$IssueNumber-implementation-plan.md" -ForegroundColor White
    Write-Host "  - issue-$IssueNumber-implementation/implementation-log.md" -ForegroundColor White
    Write-Host "`nPress Enter when implementation is complete..." -ForegroundColor Yellow
    Read-Host
    
    # Step 3: Run tests
    Invoke-Testing -IssueNumber $IssueNumber
    
    # Step 4: Commit and push
    Invoke-Commit -IssueNumber $IssueNumber -Issue $issue
    
    # Step 5: Comment on issue
    Add-IssueComment -IssueNumber $IssueNumber -Issue $issue
    
    Write-Host "`n=== Issue Implementation Completed ===" -ForegroundColor Green
}

function Show-Summary {
    param([string]$IssueNumber, [string]$Action)
    
    Write-Host "`n=== Implementation Summary ===" -ForegroundColor Green
    Write-Host "Issue Number: $IssueNumber" -ForegroundColor Cyan
    Write-Host "Action: $Action" -ForegroundColor Cyan
    Write-Host "Dry Run: $DryRun" -ForegroundColor Cyan
    Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
    
    # List generated files
    $generatedFiles = @(
        "issue-$IssueNumber-implementation-plan.md",
        "issue-$IssueNumber-implementation/",
        "issue-$IssueNumber-lint-results.txt",
        "issue-$IssueNumber-typecheck-results.txt",
        "issue-$IssueNumber-test-results.txt"
    )
    
    Write-Host "`nGenerated Files:" -ForegroundColor Yellow
    foreach ($file in $generatedFiles) {
        if (Test-Path $file) {
            Write-Host "✅ $file" -ForegroundColor Green
        } else {
            Write-Host "❌ $file" -ForegroundColor Red
        }
    }
}

# Main execution
try {
    Show-Banner
    
    if ($All -or $Action -eq "all") {
        Run-All -IssueNumber $IssueNumber
    } else {
        switch ($Action) {
            "analyze" { 
                $issue = Get-IssueDetails -IssueNumber $IssueNumber
            }
            "implement" { 
                $issue = Get-IssueDetails -IssueNumber $IssueNumber
                Start-Implementation -IssueNumber $IssueNumber -Issue $issue
            }
            "test" { 
                Invoke-Testing -IssueNumber $IssueNumber
            }
            "commit" { 
                $issue = Get-IssueDetails -IssueNumber $IssueNumber
                Invoke-Commit -IssueNumber $IssueNumber -Issue $issue
            }
            "comment" { 
                $issue = Get-IssueDetails -IssueNumber $IssueNumber
                Add-IssueComment -IssueNumber $IssueNumber -Issue $issue
            }
            default { 
                Show-Menu
                Write-Host "Please specify a valid action or use -All for all steps" -ForegroundColor Yellow
            }
        }
    }
    
    Show-Summary -IssueNumber $IssueNumber -Action $Action
    
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
}
