# PowerShell script to fix PR status based on their actual state
# Usage: .\scripts\fix-pr-status.ps1 [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Project configuration
$ProjectId = "PVT_kwHOAEnMVc4BCu-c"
$StatusFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"

# Status option IDs
$StatusOptions = @{
    "Backlog" = "f75ad846"
    "Ready" = "e18bf179"
    "In progress" = "47fc9ee4"
    "In review" = "aba860b9"
    "Done" = "98236657"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Get-AllProjectItems {
    Write-ColorOutput "Fetching all project items using GitHub CLI..." "Yellow"
    
    try {
        # Get all project items using GitHub CLI
        $result = gh project item-list 20 --owner jschibelli --format json
        $items = $result | ConvertFrom-Json
        return $items.items
    }
    catch {
        Write-ColorOutput "Error fetching project items: $($_.Exception.Message)" "Red"
        return @()
    }
}

function Get-PRState {
    param([int]$PRNumber)
    
    try {
        $prInfo = gh pr view $PRNumber --json number,title,state,mergedAt
        $pr = $prInfo | ConvertFrom-Json
        return $pr
    }
    catch {
        return $null
    }
}

function Set-ItemStatus {
    param(
        [string]$ItemId,
        [string]$NewStatus
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would set status to: $NewStatus" "Cyan"
        return $true
    }
    
    try {
        $optionId = $StatusOptions[$NewStatus]
        if (-not $optionId) {
            Write-ColorOutput "  Error: Unknown status '$NewStatus'" "Red"
            return $false
        }
        
        gh project item-edit --id $ItemId --project-id $ProjectId --field-id $StatusFieldId --single-select-option-id $optionId
        return $true
    }
    catch {
        Write-ColorOutput "  Error setting status: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Main {
    Write-ColorOutput "=== Fix PR Status Based on Actual State ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "PR Status Rules:" "Yellow"
    Write-ColorOutput "- Open PRs → In progress" "White"
    Write-ColorOutput "- Merged PRs → Done" "White"
    Write-ColorOutput "- Closed PRs → Done" "White"
    Write-ColorOutput ""
    
    # Get all project items
    $items = Get-AllProjectItems
    
    if ($items.Count -eq 0) {
        Write-ColorOutput "No project items found." "Red"
        return
    }
    
    Write-ColorOutput "Found $($items.Count) project items" "Green"
    Write-ColorOutput ""
    
    $prsToMove = @()
    
    # Analyze each item
    foreach ($item in $items) {
        $content = $item.content
        $currentStatus = $item.status
        
        if ($content.type -eq "PullRequest") {
            $prNumber = $content.number
            
            Write-ColorOutput "PR #$prNumber - Current Status: $currentStatus" "White"
            Write-ColorOutput "  Title: $($content.title)" "Gray"
            
            # Get actual PR state from GitHub
            $prState = Get-PRState $prNumber
            
            if ($prState) {
                Write-ColorOutput "  GitHub State: $($prState.state)" "Gray"
                if ($prState.mergedAt) {
                    Write-ColorOutput "  Merged At: $($prState.mergedAt)" "Gray"
                }
                
                # Determine correct status based on PR state
                $correctStatus = ""
                switch ($prState.state) {
                    "OPEN" { $correctStatus = "In progress" }
                    "MERGED" { $correctStatus = "Done" }
                    "CLOSED" { $correctStatus = "Done" }
                }
                
                if ($correctStatus -and $currentStatus -ne $correctStatus) {
                    Write-ColorOutput "  -> Should be: $correctStatus" "Yellow"
                    $prsToMove += @{
                        ItemId = $item.id
                        PRNumber = $prNumber
                        Title = $content.title
                        CurrentStatus = $currentStatus
                        NewStatus = $correctStatus
                        GitHubState = $prState.state
                    }
                } else {
                    Write-ColorOutput "  -> Status is correct" "Green"
                }
            } else {
                Write-ColorOutput "  -> Could not fetch PR state" "Red"
            }
        }
        
        Write-ColorOutput "" "White"
    }
    
    Write-ColorOutput "=== Changes Needed ===" "Blue"
    
    if ($prsToMove.Count -gt 0) {
        Write-ColorOutput "PRs to move:" "Yellow"
        foreach ($pr in $prsToMove) {
            Write-ColorOutput "  - PR #$($pr.PRNumber): $($pr.Title)" "White"
            Write-ColorOutput "    GitHub State: $($pr.GitHubState)" "Gray"
            Write-ColorOutput "    Status: $($pr.CurrentStatus) → $($pr.NewStatus)" "Gray"
        }
        Write-ColorOutput ""
    } else {
        Write-ColorOutput "All PRs have correct status assignments!" "Green"
        return
    }
    
    # Apply changes if not dry run
    if (-not $DryRun) {
        Write-ColorOutput "=== Applying Changes ===" "Blue"
        
        $successCount = 0
        $totalChanges = $prsToMove.Count
        
        # Move PRs
        foreach ($pr in $prsToMove) {
            Write-ColorOutput "Moving PR #$($pr.PRNumber) to $($pr.NewStatus)..." "Yellow"
            if (Set-ItemStatus $pr.ItemId $pr.NewStatus) {
                Write-ColorOutput "  Success" "Green"
                $successCount++
            } else {
                Write-ColorOutput "  Failed" "Red"
            }
        }
        
        Write-ColorOutput ""
        Write-ColorOutput "=== Final Summary ===" "Blue"
        Write-ColorOutput "Total changes: $totalChanges" "White"
        Write-ColorOutput "Successful: $successCount" "Green"
        Write-ColorOutput "Failed: $($totalChanges - $successCount)" "Red"
        
        if ($successCount -eq $totalChanges) {
            Write-ColorOutput "All PR status updates completed successfully!" "Green"
        } else {
            Write-ColorOutput "Some updates failed. Please check the output above." "Red"
        }
    } else {
        Write-ColorOutput "Dry run complete. Use without -DryRun to apply changes." "Cyan"
    }
}

# Run the main function
Main
