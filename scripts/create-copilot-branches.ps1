# Create Copilot Branches Script
# Usage: .\scripts\create-copilot-branches.ps1 [-DryRun]

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

function Create-Branch {
    param(
        [string]$BranchName,
        [string]$BaseBranch = "develop"
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would create branch: $BranchName from $BaseBranch" "Cyan"
        return $true
    }
    
    try {
        # Check if branch already exists
        $existingBranch = git branch --list $BranchName
        if ($existingBranch) {
            Write-ColorOutput "  Branch '$BranchName' already exists, skipping" "Yellow"
            return $true
        }
        
        # Create and checkout new branch
        git checkout -b $BranchName $BaseBranch
        Write-ColorOutput "  Success" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "  Error: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Main {
    Write-ColorOutput "=== Create Copilot Branches ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No branches will be created ***" "Cyan"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Creating branches for missing Copilot issues..." "Yellow"
    Write-ColorOutput ""
    
    # Missing Copilot issues that need branches
    $missingIssues = @(
        @{ Number = 3; Title = "Docs: Component Reference Sync"; BranchName = "feature/issue-3-component-reference-sync" },
        @{ Number = 5; Title = "Docs: Information Architecture Content Map"; BranchName = "feature/issue-5-information-architecture" },
        @{ Number = 19; Title = "[Docs] Generate and Maintain Integration Documentation"; BranchName = "feature/issue-19-integration-documentation" },
        @{ Number = 40; Title = "Medium: Incomplete API Implementations (TODO Items)"; BranchName = "feature/issue-40-api-implementations" },
        @{ Number = 167; Title = "Docs: Theming guidelines and light/dark usage patterns"; BranchName = "feature/issue-167-theming-guidelines" },
        @{ Number = 181; Title = "Dashboard: Add Docs link in sidebar help"; BranchName = "feature/issue-181-dashboard-docs-link" },
        @{ Number = 204; Title = "Phase 4.1: Hashnode Publishing API Integration"; BranchName = "feature/issue-204-hashnode-publishing-api" },
        @{ Number = 206; Title = "Phase 5.1: AI Writing Assistant Integration"; BranchName = "feature/issue-206-ai-writing-assistant" },
        @{ Number = 208; Title = "Phase 7.1: Real-time Features and Auto-save"; BranchName = "feature/issue-208-realtime-autosave" },
        @{ Number = 230; Title = "Content Migration & Sync (LOW)"; BranchName = "feature/issue-230-content-migration-sync" }
    )
    
    $successCount = 0
    $totalBranches = $missingIssues.Count
    
    Write-ColorOutput "=== Creating Branches ===" "Blue"
    
    foreach ($issue in $missingIssues) {
        $issueNumber = $issue.Number
        $issueTitle = $issue.Title
        $branchName = $issue.BranchName
        
        Write-ColorOutput "Creating branch for Issue #${issueNumber}: $issueTitle" "White"
        Write-ColorOutput "  Branch name: $branchName" "Yellow"
        
        if (Create-Branch -BranchName $branchName) {
            $successCount++
        }
        Write-ColorOutput ""
    }
    
    Write-ColorOutput "=== Summary ===" "Blue"
    Write-ColorOutput "Total branches to create: $totalBranches" "White"
    Write-ColorOutput "Successful: $successCount" "Green"
    Write-ColorOutput "Failed: $($totalBranches - $successCount)" "Red"
    Write-ColorOutput ""
    
    if ($successCount -eq $totalBranches) {
        Write-ColorOutput "🎉 All Copilot branches created successfully!" "Green"
        Write-ColorOutput ""
        Write-ColorOutput "Created branches:" "White"
        foreach ($issue in $missingIssues) {
            Write-ColorOutput "  - $($issue.BranchName) (Issue #$($issue.Number))" "Green"
        }
    } else {
        Write-ColorOutput "Some branches failed to create. Please check the output above." "Red"
    }
    
    if (-not $DryRun) {
        Write-ColorOutput ""
        Write-ColorOutput "Next steps:" "Yellow"
        Write-ColorOutput "1. Copilot can now work on these branches" "White"
        Write-ColorOutput "2. Each branch is ready for development" "White"
        Write-ColorOutput "3. Branches are based on 'develop' branch" "White"
    } else {
        Write-ColorOutput "Dry run complete. Use without -DryRun to create branches." "Cyan"
    }
}

# Run the main function
Main
