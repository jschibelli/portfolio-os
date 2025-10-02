# Real-Time Workflow Automation Script
# Usage: .\scripts\real-time-workflow-automation.ps1 [-DryRun]

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
    Write-ColorOutput "Fetching all project items..." "Yellow"
    
    try {
        $result = gh project item-list 20 --owner jschibelli --limit 200 --format json
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

function Get-IssuePRs {
    param([int]$IssueNumber)
    
    try {
        $searchPatterns = @(
            "is:pr is:issue #$IssueNumber",
            "is:pr #$IssueNumber"
        )
        
        $allPRs = @()
        foreach ($pattern in $searchPatterns) {
            try {
                $prs = gh pr list --state all --search $pattern --json number,title,state
                $prsArray = $prs | ConvertFrom-Json
                $allPRs += $prsArray
            }
            catch {
                # Continue with next pattern
            }
        }
        
        $uniquePRs = $allPRs | Sort-Object number -Unique
        return $uniquePRs
    }
    catch {
        return @()
    }
}

function Set-ItemStatus {
    param(
        [string]$ItemId,
        [string]$NewStatus,
        [string]$ItemType = "Item"
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would set $ItemType status to: $NewStatus" "Cyan"
        return $true
    }
    
    try {
        $optionId = $StatusOptions[$NewStatus]
        if (-not $optionId) {
            Write-ColorOutput "  Error: Unknown status '$NewStatus'" "Red"
            return $false
        }
        
        gh project item-edit --id $ItemId --project-id $ProjectId --field-id $StatusFieldId --single-select-option-id $optionId
        Write-ColorOutput "  ✓ $ItemType moved to: $NewStatus" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "  Error setting status: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Main {
    Write-ColorOutput "=== Real-Time Workflow Automation ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Real-Time Workflow Rules:" "Yellow"
    Write-ColorOutput "1. Issues without status → Backlog" "White"
    Write-ColorOutput "2. Issues being worked on → In progress" "White"
    Write-ColorOutput "3. Issues with PRs created → Ready" "White"
    Write-ColorOutput "4. PRs being reviewed → In progress" "White"
    Write-ColorOutput "5. Merged PRs → Done" "White"
    Write-ColorOutput ""
    
    # Get all project items
    $items = Get-AllProjectItems
    
    if ($items.Count -eq 0) {
        Write-ColorOutput "No project items found." "Red"
        return
    }
    
    Write-ColorOutput "Found $($items.Count) project items" "Green"
    Write-ColorOutput ""
    
    $itemsToMove = @()
    $prsToMove = @()
    $unassignedItems = @()
    $statusCounts = @{
        "Backlog" = 0
        "Ready" = 0
        "In progress" = 0
        "Done" = 0
        "No Status" = 0
    }
    
    # Analyze each item
    foreach ($item in $items) {
        $content = $item.content
        $currentStatus = $item.status
        
        # Count statuses
        if ([string]::IsNullOrEmpty($currentStatus)) {
            $statusCounts["No Status"]++
        } else {
            if ($statusCounts.ContainsKey($currentStatus)) {
                $statusCounts[$currentStatus]++
            }
        }
        
        if ($content.type -eq "Issue") {
            $issueNumber = $content.number
            $assignees = $item.assignees
            
            Write-ColorOutput "Issue #$issueNumber - Status: $currentStatus" "White"
            Write-ColorOutput "  Assignees: $($assignees -join ', ')" "Gray"
            
            # Check if issue has associated PRs
            $prs = Get-IssuePRs $issueNumber
            $hasPRs = $prs.Count -gt 0
            
            if ($hasPRs) {
                Write-ColorOutput "  Associated PRs: $($prs.number -join ', ')" "Green"
            } else {
                Write-ColorOutput "  No associated PRs found" "Yellow"
            }
            
            # Determine correct status based on workflow
            if ([string]::IsNullOrEmpty($currentStatus)) {
                Write-ColorOutput "  -> No status assigned, should move to Backlog" "Yellow"
                $unassignedItems += @{
                    ItemId = $item.id
                    IssueNumber = $issueNumber
                    Title = $content.title
                    CurrentStatus = $currentStatus
                    NewStatus = "Backlog"
                }
            }
            elseif ($currentStatus -eq "Ready" -and -not $hasPRs) {
                Write-ColorOutput "  -> Issue in Ready but no PRs, should move to Backlog" "Yellow"
                $itemsToMove += @{
                    ItemId = $item.id
                    IssueNumber = $issueNumber
                    Title = $content.title
                    CurrentStatus = $currentStatus
                    NewStatus = "Backlog"
                }
            }
            elseif ($currentStatus -eq "Backlog" -and $assignees.Count -gt 0) {
                Write-ColorOutput "  -> Issue assigned but in Backlog, should move to In progress" "Yellow"
                $itemsToMove += @{
                    ItemId = $item.id
                    IssueNumber = $issueNumber
                    Title = $content.title
                    CurrentStatus = $currentStatus
                    NewStatus = "In progress"
                }
            }
            elseif ($currentStatus -eq "In progress" -and $hasPRs) {
                Write-ColorOutput "  -> Issue has PRs, should move to Ready" "Yellow"
                $itemsToMove += @{
                    ItemId = $item.id
                    IssueNumber = $issueNumber
                    Title = $content.title
                    CurrentStatus = $currentStatus
                    NewStatus = "Ready"
                }
            }
            else {
                Write-ColorOutput "  -> Status is correct" "Green"
            }
        }
        elseif ($content.type -eq "PullRequest") {
            $prNumber = $content.number
            
            Write-ColorOutput "PR #$prNumber - Status: $currentStatus" "White"
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
    
    Write-ColorOutput "=== Current Status Summary ===" "Blue"
    foreach ($status in $statusCounts.Keys) {
        if ($statusCounts[$status] -gt 0) {
            Write-ColorOutput "${status}: $($statusCounts[$status])" "White"
        }
    }
    Write-ColorOutput ""
    
    Write-ColorOutput "=== Changes Needed ===" "Blue"
    
    # Items without status
    if ($unassignedItems.Count -gt 0) {
        Write-ColorOutput "Items to move to Backlog (no status assigned):" "Yellow"
        foreach ($item in $unassignedItems) {
            Write-ColorOutput "  - Issue #$($item.IssueNumber): $($item.Title)" "White"
        }
        Write-ColorOutput ""
    }
    
    # Issues to move
    if ($itemsToMove.Count -gt 0) {
        Write-ColorOutput "Issues to move:" "Yellow"
        foreach ($item in $itemsToMove) {
            Write-ColorOutput "  - Issue #$($item.IssueNumber): $($item.Title) ($($item.CurrentStatus) -> $($item.NewStatus))" "White"
        }
        Write-ColorOutput ""
    }
    
    # PRs to move
    if ($prsToMove.Count -gt 0) {
        Write-ColorOutput "PRs to move:" "Yellow"
        foreach ($pr in $prsToMove) {
            Write-ColorOutput "  - PR #$($pr.PRNumber): $($pr.Title) ($($pr.CurrentStatus) -> $($pr.NewStatus))" "White"
        }
        Write-ColorOutput ""
    }
    
    if ($itemsToMove.Count -eq 0 -and $prsToMove.Count -eq 0 -and $unassignedItems.Count -eq 0) {
        Write-ColorOutput "All project items have correct status assignments!" "Green"
        return
    }
    
    # Apply changes if not dry run
    if (-not $DryRun) {
        Write-ColorOutput "=== Applying Changes ===" "Blue"
        
        $successCount = 0
        $totalChanges = $itemsToMove.Count + $prsToMove.Count + $unassignedItems.Count
        
        # Move unassigned items to Backlog
        foreach ($item in $unassignedItems) {
            Write-ColorOutput "Moving Issue #$($item.IssueNumber) to Backlog..." "Yellow"
            if (Set-ItemStatus $item.ItemId "Backlog" "Issue") {
                $successCount++
            }
        }
        
        # Move issues
        foreach ($item in $itemsToMove) {
            Write-ColorOutput "Moving Issue #$($item.IssueNumber) to $($item.NewStatus)..." "Yellow"
            if (Set-ItemStatus $item.ItemId $item.NewStatus "Issue") {
                $successCount++
            }
        }
        
        # Move PRs
        foreach ($pr in $prsToMove) {
            Write-ColorOutput "Moving PR #$($pr.PRNumber) to $($pr.NewStatus)..." "Yellow"
            if (Set-ItemStatus $pr.ItemId $pr.NewStatus "PR") {
                $successCount++
            }
        }
        
        Write-ColorOutput ""
        Write-ColorOutput "=== Final Summary ===" "Blue"
        Write-ColorOutput "Total changes: $totalChanges" "White"
        Write-ColorOutput "Successful: $successCount" "Green"
        Write-ColorOutput "Failed: $($totalChanges - $successCount)" "Red"
        
        if ($successCount -eq $totalChanges) {
            Write-ColorOutput "All status updates completed successfully!" "Green"
        } else {
            Write-ColorOutput "Some updates failed. Please check the output above." "Red"
        }
    } else {
        Write-ColorOutput "Dry run complete. Use without -DryRun to apply changes." "Cyan"
    }
}

# Run the main function
Main