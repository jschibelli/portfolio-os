# Publish Copilot Branches Script
# Usage: .\scripts\publish-copilot-branches.ps1 [-DryRun]

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

function Push-Branch {
    param(
        [string]$BranchName
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would push branch: $BranchName" "Cyan"
        return $true
    }
    
    try {
        # Push the branch to origin
        git push -u origin $BranchName
        Write-ColorOutput "  Success" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "  Error: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Main {
    Write-ColorOutput "=== Publish Copilot Branches ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No branches will be pushed ***" "Cyan"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Publishing newly created Copilot branches..." "Yellow"
    Write-ColorOutput ""
    
    # Newly created Copilot branches
    $copilotBranches = @(
        "feature/issue-3-component-reference-sync",
        "feature/issue-5-information-architecture", 
        "feature/issue-19-integration-documentation",
        "feature/issue-40-api-implementations",
        "feature/issue-167-theming-guidelines",
        "feature/issue-181-dashboard-docs-link",
        "feature/issue-204-hashnode-publishing-api",
        "feature/issue-206-ai-writing-assistant",
        "feature/issue-208-realtime-autosave",
        "feature/issue-230-content-migration-sync"
    )
    
    $successCount = 0
    $totalBranches = $copilotBranches.Count
    
    Write-ColorOutput "=== Publishing Branches ===" "Blue"
    
    foreach ($branchName in $copilotBranches) {
        Write-ColorOutput "Publishing branch: $branchName" "White"
        
        if (Push-Branch -BranchName $branchName) {
            $successCount++
        }
        Write-ColorOutput ""
    }
    
    Write-ColorOutput "=== Summary ===" "Blue"
    Write-ColorOutput "Total branches to publish: $totalBranches" "White"
    Write-ColorOutput "Successful: $successCount" "Green"
    Write-ColorOutput "Failed: $($totalBranches - $successCount)" "Red"
    Write-ColorOutput ""
    
    if ($successCount -eq $totalBranches) {
        Write-ColorOutput "🎉 All Copilot branches published successfully!" "Green"
        Write-ColorOutput ""
        Write-ColorOutput "Published branches:" "White"
        foreach ($branchName in $copilotBranches) {
            Write-ColorOutput "  - $branchName" "Green"
        }
        Write-ColorOutput ""
        Write-ColorOutput "All branches are now available on GitHub for Copilot to work on!" "Green"
    } else {
        Write-ColorOutput "Some branches failed to publish. Please check the output above." "Red"
    }
    
    if (-not $DryRun) {
        Write-ColorOutput ""
        Write-ColorOutput "Next steps:" "Yellow"
        Write-ColorOutput "1. All branches are now on GitHub" "White"
        Write-ColorOutput "2. Copilot can access and work on these branches" "White"
        Write-ColorOutput "3. Branches are ready for development and collaboration" "White"
    } else {
        Write-ColorOutput "Dry run complete. Use without -DryRun to publish branches." "Cyan"
    }
}

# Run the main function
Main
