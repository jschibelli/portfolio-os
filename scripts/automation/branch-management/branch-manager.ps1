# PowerShell script for comprehensive branch management
# Usage: .\scripts\branch-manager.ps1 -Operation <OPERATION> -Issues <ISSUE_LIST> [OPTIONS]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("create", "rename", "update", "validate", "list")]
    [string]$Operation,
    
    [Parameter(Mandatory=$false)]
    [string[]]$Issues = @(),
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("blog", "dashboard", "docs", "infra", "custom")]
    [string]$Preset = "custom",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("feature", "bugfix", "hotfix", "chore")]
    [string]$Type = "feature",
    
    [Parameter(Mandatory=$false)]
    [string]$Pattern = "feature/{type}/{issue-number}-{title}",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

# Define issue presets
$presets = @{
    "blog" = @(196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208)
    "dashboard" = @(150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160)
    "docs" = @(180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190)
    "infra" = @(170, 171, 172, 173, 174, 175, 176, 177, 178, 179)
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Get-IssueList {
    if ($Preset -ne "custom" -and $presets.ContainsKey($Preset)) {
        return $presets[$Preset]
    } elseif ($Issues.Count -gt 0) {
        return $Issues
    } else {
        Write-ColorOutput "Error: No issues specified. Use -Issues parameter or -Preset option." "Red"
        exit 1
    }
}

function Get-IssueTitle {
    param([int]$IssueNumber)
    
    try {
        $title = gh issue view $IssueNumber --json title -q .title
        # Clean title for branch name (remove special characters, convert to lowercase)
        $cleanTitle = $title -replace '[^a-zA-Z0-9\s-]', '' -replace '\s+', '-' -replace '^-+|-+$', '' -replace '-+', '-'
        return $cleanTitle.ToLower()
    } catch {
        return "issue-$IssueNumber"
    }
}

function Get-CurrentBranch {
    try {
        return git branch --show-current
    } catch {
        return $null
    }
}

function Ensure-DevelopBase {
    try {
        # Check if we're on develop branch
        $currentBranch = Get-CurrentBranch
        if ($currentBranch -eq "develop") {
            Write-ColorOutput "✅ Already on develop branch" "Green"
            return $true
        }
        
        # Check if develop branch exists
        $developExists = git branch --list develop
        if (-not $developExists) {
            Write-ColorOutput "❌ Develop branch does not exist. Please create it first." "Red"
            return $false
        }
        
        # Switch to develop branch
        Write-ColorOutput "🔄 Switching to develop branch..." "Yellow"
        git checkout develop
        
        # Pull latest changes
        Write-ColorOutput "🔄 Pulling latest changes from develop..." "Yellow"
        git pull origin develop
        
        Write-ColorOutput "✅ Now on develop branch with latest changes" "Green"
        return $true
    } catch {
        Write-ColorOutput "❌ Failed to ensure develop base: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Create-BranchFromDevelop {
    param([string]$BranchName)
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would create branch '$BranchName' from develop" "Cyan"
        return $true
    }
    
    try {
        # Ensure we're on develop
        if (-not (Ensure-DevelopBase)) {
            return $false
        }
        
        # Create new branch from develop
        git checkout -b $BranchName
        
        Write-ColorOutput "✅ Created branch '$BranchName' from develop" "Green"
        return $true
    } catch {
        Write-ColorOutput "❌ Failed to create branch: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Generate-BranchName {
    param([int]$IssueNumber, [string]$IssueTitle)
    
    $branchName = $Pattern
    $branchName = $branchName -replace '\{type\}', $Type
    $branchName = $branchName -replace '\{issue-number\}', $IssueNumber
    $branchName = $branchName -replace '\{title\}', $IssueTitle
    
    return $branchName
}

function Rename-Branch {
    param([string]$OldBranch, [string]$NewBranch)
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would rename branch '$OldBranch' to '$NewBranch'" "Cyan"
        return $true
    }
    
    try {
        git branch -m $OldBranch $NewBranch
        Write-ColorOutput "  ✓ Renamed branch to '$NewBranch'" "Green"
        return $true
    } catch {
        Write-ColorOutput "  ✗ Failed to rename branch: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Update-BranchName {
    param([int]$IssueNumber)
    
    Write-ColorOutput "Updating branch name for Issue #$IssueNumber..." "Yellow"
    
    $issueTitle = Get-IssueTitle $IssueNumber
    $newBranchName = Generate-BranchName $IssueNumber $issueTitle
    
    Write-ColorOutput "  Issue title: $issueTitle" "White"
    Write-ColorOutput "  New branch name: $newBranchName" "White"
    
    $currentBranch = Get-CurrentBranch
    if ($currentBranch) {
        Write-ColorOutput "  Current branch: $currentBranch" "White"
        
        if ($currentBranch -eq $newBranchName) {
            Write-ColorOutput "  Branch name is already correct" "Green"
            return $true
        }
        
        if ($Force -or (Read-Host "Rename branch '$currentBranch' to '$newBranchName'? (y/N)") -eq 'y') {
            return Rename-Branch $currentBranch $newBranchName
        } else {
            Write-ColorOutput "  Skipped branch rename" "Yellow"
            return $true
        }
    } else {
        Write-ColorOutput "  No current branch found" "Red"
        return $false
    }
}

function Validate-BranchName {
    param([string]$BranchName)
    
    # Check if branch name follows conventions
    $isValid = $true
    $issues = @()
    
    # Check for issue number pattern
    if ($BranchName -notmatch '\d+') {
        $issues += "Branch name should contain issue number"
        $isValid = $false
    }
    
    # Check for type prefix
    $validTypes = @("feature", "bugfix", "hotfix", "chore")
    $hasValidType = $false
    foreach ($type in $validTypes) {
        if ($BranchName.StartsWith("$type/")) {
            $hasValidType = $true
            break
        }
    }
    
    if (-not $hasValidType) {
        $issues += "Branch name should start with type prefix (feature/, bugfix/, hotfix/, chore/)"
        $isValid = $false
    }
    
    # Check for special characters
    if ($BranchName -match '[^a-zA-Z0-9/-]') {
        $issues += "Branch name contains invalid characters"
        $isValid = $false
    }
    
    return @{
        IsValid = $isValid
        Issues = $issues
    }
}

function List-Branches {
    Write-ColorOutput "Listing all branches..." "Yellow"
    
    try {
        $branches = git branch --list
        Write-ColorOutput "Current branches:" "White"
        
        foreach ($branch in $branches) {
            $branchName = $branch.Trim() -replace '^\* ', ''
            $isCurrent = $branch.StartsWith('*')
            $prefix = if ($isCurrent) { "  * " } else { "    " }
            $color = if ($isCurrent) { "Green" } else { "White" }
            
            Write-ColorOutput "$prefix$branchName" $color
            
            # Validate branch name
            $validation = Validate-BranchName $branchName
            if (-not $validation.IsValid) {
                foreach ($issue in $validation.Issues) {
                    Write-ColorOutput "      ⚠ $issue" "Yellow"
                }
            }
        }
        
        return $true
    } catch {
        Write-ColorOutput "Failed to list branches: $($_.Exception.Message)" "Red"
        return $false
    }
}

# Main execution
Write-ColorOutput "=== Portfolio OS Branch Manager ===" "Blue"
Write-ColorOutput "Operation: $Operation" "Green"
Write-ColorOutput "Preset: $Preset" "Green"

if ($Operation -eq "list") {
    List-Branches
    exit $LASTEXITCODE
}

$issueList = Get-IssueList
Write-ColorOutput "Issues to process: $($issueList -join ', ')" "Green"

if ($DryRun) {
    Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
}

Write-ColorOutput ""

$successCount = 0
$totalCount = $issueList.Count

foreach ($issueNumber in $issueList) {
    $success = $false
    
    switch ($Operation) {
        "create" {
            $issueTitle = Get-IssueTitle $issueNumber
            $branchName = Generate-BranchName $issueNumber $issueTitle
            $success = Create-BranchFromDevelop $branchName
        }
        "rename" {
            $success = Rename-Branch (Get-CurrentBranch) (Generate-BranchName $issueNumber (Get-IssueTitle $issueNumber))
        }
        "update" {
            $success = Update-BranchName $issueNumber
        }
        "validate" {
            $currentBranch = Get-CurrentBranch
            if ($currentBranch) {
                $validation = Validate-BranchName $currentBranch
                if ($validation.IsValid) {
                    Write-ColorOutput "✓ Branch name '$currentBranch' is valid" "Green"
                    $success = $true
                } else {
                    Write-ColorOutput "✗ Branch name '$currentBranch' has issues:" "Red"
                    foreach ($issue in $validation.Issues) {
                        Write-ColorOutput "  - $issue" "Red"
                    }
                    $success = $false
                }
            } else {
                Write-ColorOutput "✗ No current branch found" "Red"
                $success = $false
            }
        }
    }
    
    if ($success) {
        $successCount++
    }
    
    Write-ColorOutput ""
}

Write-ColorOutput "=== Summary ===" "Blue"
Write-ColorOutput "Total issues: $totalCount" "White"
Write-ColorOutput "Successful: $successCount" "Green"
Write-ColorOutput "Failed: $($totalCount - $successCount)" "Red"

if ($successCount -eq $totalCount) {
    Write-ColorOutput "All operations completed successfully!" "Green"
    exit 0
} else {
    Write-ColorOutput "Some operations failed. Please check the output above." "Red"
    exit 1
}
