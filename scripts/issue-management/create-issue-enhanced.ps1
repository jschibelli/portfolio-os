#!/usr/bin/env pwsh
# Enhanced Issue Creation with Automatic Branch Creation
# Creates GitHub issues and automatically generates corresponding feature branches

param(
    [Parameter(Mandatory=$true)]
    [string]$Title,
    
    [Parameter(Mandatory=$true)]
    [string]$Body,
    
    [string]$Labels = "",
    [string]$Milestone = "",
    [string]$Project = "20",
    [string]$Assignee = "",
    [string]$BaseBranch = "develop",
    [switch]$CreateBranch = $true,
    [switch]$PushBranch = $true,
    [switch]$DryRun
)

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "   Enhanced Issue Creation with Auto Branch" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

# Function to generate branch name from issue title
function Get-BranchNameFromTitle {
    param([string]$IssueTitle, [int]$IssueNumber)
    
    # Convert title to lowercase and replace spaces/special chars with hyphens
    $slug = $IssueTitle.ToLower() `
        -replace '[^\w\s-]', '' `
        -replace '\s+', '-' `
        -replace '-+', '-' `
        -replace '^-|-$', ''
    
    # Truncate if too long (max 50 chars after issue number)
    if ($slug.Length > 50) {
        $slug = $slug.Substring(0, 50).TrimEnd('-')
    }
    
    return "issue-$IssueNumber-$slug"
}

# Step 1: Create the GitHub issue
Write-Host "Step 1: Creating GitHub issue..." -ForegroundColor Yellow
Write-Host "  Title: $Title" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "  [DRY RUN] Would create issue with title: $Title" -ForegroundColor Magenta
    $issueNumber = 999
} else {
    # Build the gh issue create command
    $createCmd = "gh issue create --title `"$Title`" --body `"$Body`""
    
    if ($Labels) {
        $createCmd += " --label `"$Labels`""
    }
    
    if ($Milestone) {
        $createCmd += " --milestone `"$Milestone`""
    }
    
    if ($Assignee) {
        $createCmd += " --assignee `"$Assignee`""
    }
    
    Write-Host "  Executing: $createCmd" -ForegroundColor Gray
    
    try {
        $issueUrl = Invoke-Expression $createCmd
        
        # Extract issue number from URL
        if ($issueUrl -match '/issues/(\d+)') {
            $issueNumber = [int]$Matches[1]
            Write-Host "  ✅ Issue #$issueNumber created: $issueUrl" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Failed to extract issue number from: $issueUrl" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "  ❌ Failed to create issue: $_" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Add issue to project (if specified)
if ($Project -and -not $DryRun) {
    Write-Host ""
    Write-Host "Step 2: Adding issue to project..." -ForegroundColor Yellow
    
    try {
        $owner = gh api user --jq .login
        gh project item-add $Project --owner $owner --url "https://github.com/$owner/portfolio-os/issues/$issueNumber" | Out-Null
        Write-Host "  ✅ Added to project #$Project" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️  Failed to add to project: $_" -ForegroundColor Yellow
    }
}

# Step 3: Create branch (if requested)
if ($CreateBranch) {
    Write-Host ""
    Write-Host "Step 3: Creating feature branch..." -ForegroundColor Yellow
    
    # Generate branch name
    $branchName = Get-BranchNameFromTitle -IssueTitle $Title -IssueNumber $issueNumber
    Write-Host "  Branch name: $branchName" -ForegroundColor Cyan
    
    if ($DryRun) {
        Write-Host "  [DRY RUN] Would create branch: $branchName from $BaseBranch" -ForegroundColor Magenta
    } else {
        try {
            # Ensure we're on the base branch and it's up to date
            Write-Host "  Checking out $BaseBranch..." -ForegroundColor Gray
            git checkout $BaseBranch 2>&1 | Out-Null
            
            Write-Host "  Pulling latest changes..." -ForegroundColor Gray
            git pull origin $BaseBranch 2>&1 | Out-Null
            
            # Create the new branch
            Write-Host "  Creating branch $branchName..." -ForegroundColor Gray
            git branch $branchName 2>&1 | Out-Null
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ Branch created: $branchName" -ForegroundColor Green
                
                # Push branch to remote (if requested)
                if ($PushBranch) {
                    Write-Host "  Pushing branch to remote..." -ForegroundColor Gray
                    git push origin $branchName 2>&1 | Out-Null
                    
                    if ($LASTEXITCODE -eq 0) {
                        Write-Host "  ✅ Branch pushed to remote" -ForegroundColor Green
                    } else {
                        Write-Host "  ⚠️  Failed to push branch to remote" -ForegroundColor Yellow
                    }
                }
            } else {
                Write-Host "  ⚠️  Branch may already exist" -ForegroundColor Yellow
            }
            
            # Return to original branch
            git checkout $BaseBranch 2>&1 | Out-Null
            
        } catch {
            Write-Host "  ❌ Failed to create branch: $_" -ForegroundColor Red
        }
    }
}

# Step 4: Display summary
Write-Host ""
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "              Summary" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "  Issue #$issueNumber: $Title" -ForegroundColor Cyan
Write-Host "  URL: https://github.com/$(gh api user --jq .login)/portfolio-os/issues/$issueNumber" -ForegroundColor Cyan

if ($CreateBranch) {
    Write-Host "  Branch: $branchName" -ForegroundColor Cyan
    Write-Host "  Base: $BaseBranch" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review the issue at the URL above" -ForegroundColor Gray
Write-Host "  2. Configure project fields if needed" -ForegroundColor Gray

if ($CreateBranch) {
    Write-Host "  3. Checkout the branch: git checkout $branchName" -ForegroundColor Gray
    Write-Host "  4. Start implementing the changes" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Issue creation complete!" -ForegroundColor Green

