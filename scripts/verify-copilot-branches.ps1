# Verify Copilot Branches Script
# Usage: .\scripts\verify-copilot-branches.ps1

param(
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

function Get-AllBranches {
    try {
        $branches = git branch -a
        return $branches
    }
    catch {
        Write-ColorOutput "Error fetching branches: $($_.Exception.Message)" "Red"
        return @()
    }
}

function Check-BranchExists {
    param(
        [array]$AllBranches,
        [int]$IssueNumber
    )
    
    $patterns = @(
        "issue-$IssueNumber",
        "feature/issue-$IssueNumber",
        "issue-$IssueNumber-",
        "feature/issue-$IssueNumber-",
        "copilot/issue-$IssueNumber",
        "copilot/issue-$IssueNumber-"
    )
    
    $foundBranches = @()
    
    foreach ($branch in $AllBranches) {
        foreach ($pattern in $patterns) {
            if ($branch -like "*$pattern*") {
                $foundBranches += $branch.Trim()
            }
        }
    }
    
    return $foundBranches
}

function Main {
    Write-ColorOutput "=== Verify Copilot Branches ===" "Blue"
    Write-ColorOutput ""
    
    # Copilot issues from our distribution
    $copilotIssues = @(
        @{ Number = 3; Title = "Docs: Component Reference Sync" },
        @{ Number = 5; Title = "Docs: Information Architecture Content Map" },
        @{ Number = 19; Title = "[Docs] Generate and Maintain Integration Documentation" },
        @{ Number = 40; Title = "Medium: Incomplete API Implementations (TODO Items)" },
        @{ Number = 167; Title = "Docs: Theming guidelines and light/dark usage patterns" },
        @{ Number = 181; Title = "Dashboard: Add Docs link in sidebar help" },
        @{ Number = 185; Title = "Implement Proper Blog Data Fetching and Caching" },
        @{ Number = 187; Title = "Implement RSS Feed and Social Media Integration" },
        @{ Number = 189; Title = "Add Blog Search and Filtering Functionality" },
        @{ Number = 204; Title = "Phase 4.1: Hashnode Publishing API Integration" },
        @{ Number = 206; Title = "Phase 5.1: AI Writing Assistant Integration" },
        @{ Number = 208; Title = "Phase 7.1: Real-time Features and Auto-save" },
        @{ Number = 226; Title = "Modular Content Block System (HIGH)" },
        @{ Number = 228; Title = "Unified Publishing Workflow (MEDIUM)" },
        @{ Number = 230; Title = "Content Migration & Sync (LOW)" }
    )
    
    Write-ColorOutput "Fetching all branches..." "Yellow"
    $allBranches = Get-AllBranches
    
    if ($allBranches.Count -eq 0) {
        Write-ColorOutput "No branches found." "Red"
        return
    }
    
    Write-ColorOutput "Found $($allBranches.Count) branches" "Green"
    Write-ColorOutput ""
    
    $branchesFound = 0
    $branchesMissing = 0
    $totalIssues = $copilotIssues.Count
    
    Write-ColorOutput "=== Copilot Issue Branch Status ===" "Blue"
    Write-ColorOutput ""
    
    foreach ($issue in $copilotIssues) {
        $issueNumber = $issue.Number
        $issueTitle = $issue.Title
        
        Write-ColorOutput "Issue #${issueNumber}: $issueTitle" "White"
        
        $foundBranches = Check-BranchExists -AllBranches $allBranches -IssueNumber $issueNumber
        
        if ($foundBranches.Count -gt 0) {
            Write-ColorOutput "  ✅ Branches found:" "Green"
            foreach ($branch in $foundBranches) {
                Write-ColorOutput "    - $branch" "Green"
            }
            $branchesFound++
        } else {
            Write-ColorOutput "  ❌ No branches found" "Red"
            $branchesMissing++
        }
        Write-ColorOutput ""
    }
    
    Write-ColorOutput "=== Summary ===" "Blue"
    Write-ColorOutput "Total Copilot issues: $totalIssues" "White"
    Write-ColorOutput "Issues with branches: $branchesFound" "Green"
    Write-ColorOutput "Issues missing branches: $branchesMissing" "Red"
    Write-ColorOutput ""
    
    if ($branchesMissing -eq 0) {
        Write-ColorOutput "🎉 All Copilot issues have branches!" "Green"
    } else {
        Write-ColorOutput "⚠️  $branchesMissing Copilot issues need branches created" "Yellow"
        Write-ColorOutput ""
        Write-ColorOutput "Missing branches for:" "Yellow"
        
        foreach ($issue in $copilotIssues) {
            $foundBranches = Check-BranchExists -AllBranches $allBranches -IssueNumber $issue.Number
            if ($foundBranches.Count -eq 0) {
                Write-ColorOutput "  - Issue #$($issue.Number): $($issue.Title)" "Red"
            }
        }
    }
}

# Run the main function
Main
