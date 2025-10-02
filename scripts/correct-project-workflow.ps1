# PowerShell script to implement correct project workflow
# Usage: .\scripts\correct-project-workflow.ps1 [-DryRun]

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

function Get-IssuePRs {
    param([int]$IssueNumber)
    
    try {
        # Try multiple search patterns to find associated PRs
        $searchPatterns = @(
            "is:pr is:issue #$IssueNumber",
            "is:pr #$IssueNumber",
            "is:pr in:title #$IssueNumber",
            "is:pr in:body #$IssueNumber"
        )
        
        $allPRs = @()
        foreach ($pattern in $searchPatterns) {
            try {
                $prs = gh pr list --state all --search $pattern --json number,title,state,body
                $prsArray = $prs | ConvertFrom-Json
                $allPRs += $prsArray
            }
            catch {
                # Continue with next pattern
            }
        }
        
        # Remove duplicates
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
    Write-ColorOutput "=== Correct Project Workflow Implementation ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Workflow Rules:" "Yellow"
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
    
    # Analyze each item
    foreach ($item in $items) {
        $content = $item.content
        $currentStatus = $item.status
        
        if ($content.type -eq "Issue") {
            $issueNumber = $content.number
            $assignees = $item.assignees
            $labels = $item.labels
            
            Write-ColorOutput "Issue #$issueNumber - Status: $currentStatus" "White"
            Write-ColorOutput "  Assignees: $($assignees -join ', ')" "Gray"
            Write-ColorOutput "  Labels: $($labels -join ', ')" "Gray"
            
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
            $prState = $content.state
            
            Write-ColorOutput "PR #$prNumber - Status: $currentStatus, State: $prState" "White"
            Write-ColorOutput "  Title: $($content.title)" "Gray"
            
            # Determine correct status for PRs
            if ($prState -eq "MERGED") {
                if ($currentStatus -ne "Done") {
                    Write-ColorOutput "  -> Merged PR should be Done" "Yellow"
                    $prsToMove += @{
                        ItemId = $item.id
                        PRNumber = $prNumber
                        Title = $content.title
                        CurrentStatus = $currentStatus
                        NewStatus = "Done"
                    }
                } else {
                    Write-ColorOutput "  -> Status is correct" "Green"
                }
            }
            elseif ($prState -eq "OPEN") {
                if ($currentStatus -ne "In progress") {
                    Write-ColorOutput "  -> Open PR should be In progress" "Yellow"
                    $prsToMove += @{
                        ItemId = $item.id
                        PRNumber = $prNumber
                        Title = $content.title
                        CurrentStatus = $currentStatus
                        NewStatus = "In progress"
                    }
                } else {
                    Write-ColorOutput "  -> Status is correct" "Green"
                }
            }
            else {
                Write-ColorOutput "  -> Status is correct" "Green"
            }
        }
        
        Write-ColorOutput "" "White"
    }
    
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
            Write-ColorOutput "  - Issue #$($item.IssueNumber): $($item.Title) ($($item.CurrentStatus) → $($item.NewStatus))" "White"
        }
        Write-ColorOutput ""
    }
    
    # PRs to move
    if ($prsToMove.Count -gt 0) {
        Write-ColorOutput "PRs to move:" "Yellow"
        foreach ($pr in $prsToMove) {
            Write-ColorOutput "  - PR #$($pr.PRNumber): $($pr.Title) ($($pr.CurrentStatus) → $($pr.NewStatus))" "White"
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
            if (Set-ItemStatus $item.ItemId "Backlog") {
                Write-ColorOutput "  Success" "Green"
                $successCount++
            } else {
                Write-ColorOutput "  Failed" "Red"
            }
        }
        
        # Move issues
        foreach ($item in $itemsToMove) {
            Write-ColorOutput "Moving Issue #$($item.IssueNumber) to $($item.NewStatus)..." "Yellow"
            if (Set-ItemStatus $item.ItemId $item.NewStatus) {
                Write-ColorOutput "  Success" "Green"
                $successCount++
            } else {
                Write-ColorOutput "  Failed" "Red"
            }
        }
        
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
