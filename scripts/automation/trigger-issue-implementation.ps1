# Issue Implementation Trigger Script
# Usage: .\scripts\trigger-issue-implementation.ps1 -IssueNumber <ISSUE_NUMBER> [-Method <METHOD>]

param(
    [Parameter(Mandatory=$true)]
    [string]$IssueNumber,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("local", "github-actions", "both")]
    [string]$Method = "local"
)

function Show-Banner {
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host "      Issue Implementation Trigger" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host ""
}

function Trigger-LocalImplementation {
    param([string]$IssueNumber)
    
    Write-Host "=== Triggering Local Implementation ===" -ForegroundColor Green
    
    # Check if GitHub CLI is available
    try {
        gh --version | Out-Null
        Write-Host "✅ GitHub CLI is available" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ GitHub CLI is not available. Please install it first." -ForegroundColor Red
        Write-Host "   Install from: https://cli.github.com/" -ForegroundColor Yellow
        return $false
    }
    
    # Check if we're in a git repository
    try {
        git status | Out-Null
        Write-Host "✅ Git repository detected" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Not in a git repository. Please run from project root." -ForegroundColor Red
        return $false
    }
    
    # Run local implementation
    Write-Host "🚀 Starting local issue implementation..." -ForegroundColor Cyan
    & .\..\issue-implementation.ps1 -IssueNumber $IssueNumber -Action all
    
    return $true
}

function Trigger-GitHubActions {
    param([string]$IssueNumber)
    
    Write-Host "=== Triggering GitHub Actions Workflow ===" -ForegroundColor Green
    
    # Check if GitHub CLI is authenticated
    try {
        gh auth status | Out-Null
        Write-Host "✅ GitHub CLI is authenticated" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ GitHub CLI is not authenticated. Please run 'gh auth login' first." -ForegroundColor Red
        return $false
    }
    
    # Trigger GitHub Actions workflow
    Write-Host "🚀 Triggering GitHub Actions workflow for Issue #$IssueNumber..." -ForegroundColor Cyan
    
    try {
        gh workflow run issue-implementation.yml --field issue_number=$IssueNumber
        Write-Host "✅ GitHub Actions workflow triggered successfully" -ForegroundColor Green
        Write-Host "📊 Check the Actions tab for progress: https://github.com/$((gh repo view --json owner,name -q '.owner.login + "/" + .name'))/actions" -ForegroundColor Cyan
        return $true
    }
    catch {
        Write-Host "❌ Failed to trigger GitHub Actions workflow: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Show-Usage {
    Write-Host "Usage Examples:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Local Implementation Only:" -ForegroundColor White
    Write-Host "   .\scripts\trigger-issue-implementation.ps1 -IssueNumber 103 -Method local" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. GitHub Actions Only:" -ForegroundColor White
    Write-Host "   .\scripts\trigger-issue-implementation.ps1 -IssueNumber 103 -Method github-actions" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Both Local and GitHub Actions:" -ForegroundColor White
    Write-Host "   .\scripts\trigger-issue-implementation.ps1 -IssueNumber 103 -Method both" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Default (Local):" -ForegroundColor White
    Write-Host "   .\scripts\trigger-issue-implementation.ps1 -IssueNumber 103" -ForegroundColor Gray
    Write-Host ""
}

function Show-PreRequisites {
    Write-Host "Prerequisites:" -ForegroundColor Yellow
    Write-Host "- GitHub CLI installed and authenticated" -ForegroundColor White
    Write-Host "- PowerShell execution policy allows scripts" -ForegroundColor White
    Write-Host "- Node.js and npm installed" -ForegroundColor White
    Write-Host "- Git repository with proper remote setup" -ForegroundColor White
    Write-Host ""
}

# Main execution
try {
    Show-Banner
    
    Write-Host "Issue Number: $IssueNumber" -ForegroundColor Cyan
    Write-Host "Method: $Method" -ForegroundColor Cyan
    Write-Host ""
    
    $success = $false
    
    switch ($Method) {
        "local" {
            $success = Trigger-LocalImplementation -IssueNumber $IssueNumber
        }
        "github-actions" {
            $success = Trigger-GitHubActions -IssueNumber $IssueNumber
        }
        "both" {
            Write-Host "=== Running Both Methods ===" -ForegroundColor Green
            
            $localSuccess = Trigger-LocalImplementation -IssueNumber $IssueNumber
            Write-Host ""
            $actionsSuccess = Trigger-GitHubActions -IssueNumber $IssueNumber
            
            $success = $localSuccess -and $actionsSuccess
        }
        default {
            Show-Usage
            Show-PreRequisites
            Write-Host "Please specify a valid method: local, github-actions, or both" -ForegroundColor Yellow
            exit 1
        }
    }
    
    if ($success) {
        Write-Host "`n✅ Issue implementation triggered successfully!" -ForegroundColor Green
        Write-Host "📋 Issue #$IssueNumber is now being processed" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Failed to trigger issue implementation" -ForegroundColor Red
        Write-Host "Please check the prerequisites and try again" -ForegroundColor Yellow
        Show-PreRequisites
        exit 1
    }
    
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
}
