# PowerShell script for creating branches from develop base
# Usage: .\scripts\create-branch-from-develop.ps1 -IssueNumber <ISSUE_NUMBER> [-BranchName <NAME>] [-Type <TYPE>]

param(
    [Parameter(Mandatory=$true)]
    [int]$IssueNumber,
    
    [Parameter(Mandatory=$false)]
    [string]$BranchName,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("feature", "bugfix", "hotfix", "chore")]
    [string]$Type = "feature",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Get-IssueTitle {
    param([int]$IssueNumber)
    
    try {
        $title = gh issue view $IssueNumber --json title -q .title
        # Clean title for branch name (remove special characters, convert to lowercase)
        $cleanTitle = $title -replace '[^a-zA-Z0-9\s-]', '' -replace '\s+', '-' -replace '^-+|-+$', '' -replace '-+', '-'
        return $cleanTitle.ToLower()
    } catch {
        Write-ColorOutput "❌ Failed to get issue title for #$IssueNumber" "Red"
        return "issue-$IssueNumber"
    }
}

function Ensure-DevelopBranch {
    try {
        # Check if develop branch exists
        $developExists = git branch --list develop
        if (-not $developExists) {
            Write-ColorOutput "❌ CRITICAL: Develop branch does not exist!" "Red"
            Write-ColorOutput "Please create the develop branch first:" "Yellow"
            Write-ColorOutput "  git checkout -b develop" "White"
            Write-ColorOutput "  git push -u origin develop" "White"
            return $false
        }
        
        # Check if we're already on develop
        $currentBranch = git branch --show-current
        if ($currentBranch -eq "develop") {
            Write-ColorOutput "✅ Already on develop branch" "Green"
        } else {
            Write-ColorOutput "🔄 Switching to develop branch..." "Yellow"
            git checkout develop
        }
        
        # Pull latest changes from develop
        Write-ColorOutput "🔄 Pulling latest changes from develop..." "Yellow"
        git pull origin develop
        
        Write-ColorOutput "✅ Develop branch is up to date" "Green"
        return $true
    } catch {
        Write-ColorOutput "❌ Failed to ensure develop branch: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Create-Branch {
    param([string]$BranchName)
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would create branch '$BranchName' from develop" "Cyan"
        return $true
    }
    
    try {
        # Ensure we're on develop branch with latest changes
        if (-not (Ensure-DevelopBranch)) {
            return $false
        }
        
        # Check if branch already exists
        $branchExists = git branch --list $BranchName
        if ($branchExists) {
            Write-ColorOutput "⚠️ Branch '$BranchName' already exists" "Yellow"
            $switch = Read-Host "Switch to existing branch? (y/N)"
            if ($switch -eq 'y' -or $switch -eq 'Y') {
                git checkout $BranchName
                Write-ColorOutput "✅ Switched to existing branch '$BranchName'" "Green"
                return $true
            } else {
                Write-ColorOutput "❌ Branch creation cancelled" "Red"
                return $false
            }
        }
        
        # Create new branch from develop
        Write-ColorOutput "🔄 Creating branch '$BranchName' from develop..." "Yellow"
        git checkout -b $BranchName
        
        Write-ColorOutput "✅ Successfully created branch '$BranchName' from develop" "Green"
        Write-ColorOutput "📍 You are now on branch: $BranchName" "Cyan"
        
        return $true
    } catch {
        Write-ColorOutput "❌ Failed to create branch: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Generate-BranchName {
    param([int]$IssueNumber, [string]$IssueTitle, [string]$Type)
    
    if ($BranchName) {
        return $BranchName
    }
    
    # Generate branch name following convention: type/issue-number-title
    $branchName = "$Type/$IssueNumber-$IssueTitle"
    return $branchName
}

# Main execution
Write-ColorOutput "===============================================" "Blue"
Write-ColorOutput "        Create Branch from Develop" "Blue"
Write-ColorOutput "===============================================" "Blue"
Write-ColorOutput ""

Write-ColorOutput "Issue Number: $IssueNumber" "Green"
Write-ColorOutput "Type: $Type" "Green"

if ($DryRun) {
    Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
}

Write-ColorOutput ""

# Get issue title
$issueTitle = Get-IssueTitle $IssueNumber
Write-ColorOutput "Issue Title: $issueTitle" "White"

# Generate branch name
$branchName = Generate-BranchName $IssueNumber $issueTitle $Type
Write-ColorOutput "Branch Name: $branchName" "White"

Write-ColorOutput ""

# Create the branch
$success = Create-Branch $branchName

if ($success) {
    Write-ColorOutput "" "White"
    Write-ColorOutput "=== Branch Creation Complete ===" "Green"
    Write-ColorOutput "Branch: $branchName" "White"
    Write-ColorOutput "Base: develop" "White"
    Write-ColorOutput "Issue: #$IssueNumber" "White"
    Write-ColorOutput "" "White"
    Write-ColorOutput "Next steps:" "Yellow"
    Write-ColorOutput "1. Make your changes" "White"
    Write-ColorOutput "2. Commit your changes" "White"
    Write-ColorOutput "3. Push the branch: git push -u origin $branchName" "White"
    Write-ColorOutput "4. Create a PR targeting the 'develop' branch" "White"
    
    if (-not $DryRun) {
        exit 0
    }
} else {
    Write-ColorOutput "" "White"
    Write-ColorOutput "=== Branch Creation Failed ===" "Red"
    Write-ColorOutput "Please check the errors above and try again" "Red"
    
    if (-not $DryRun) {
        exit 1
    }
}
