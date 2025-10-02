# Fix Ready Status Script
# Usage: .\scripts\fix-ready-status.ps1 [-DryRun]

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

function Get-IssueCommits {
    param([int]$IssueNumber)
    
    try {
        # Get commits that reference this issue
        $commits = gh issue view $IssueNumber --json timelineItems
        $timeline = $commits | ConvertFrom-Json
        
        $commitCount = 0
        foreach ($item in $timeline.timelineItems) {
            if ($item.__typename -eq "CrossReferencedEvent" -and $item.source.__typename -eq "Commit") {
                $commitCount++
            }
        }
        
        return $commitCount
    }
    catch {
        return 0
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
        Write-ColorOutput "  Success" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "  Error setting status: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Main {
    Write-ColorOutput "=== Fix Ready Status ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Correct Workflow Rules:" "Yellow"
    Write-ColorOutput "1. Issues without status -> Backlog" "White"
    Write-ColorOutput "2. Issues with commits but no PR -> In progress" "White"
    Write-ColorOutput "3. Issues with commits AND PRs -> Ready" "White"
    Write-ColorOutput "4. PRs being reviewed -> In progress" "White"
    Write-ColorOutput "5. Merged PRs -> Done" "White"
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
            
            # Check if issue has commits
            $commitCount = Get-IssueCommits $issueNumber
            Write-ColorOutput "  Commits: $commitCount" "Gray"
            
            # Check if issue has associated PRs
            $prs = Get-IssuePRs $issueNumber
            $hasPRs = $prs.Count -gt 0
            
            if ($hasPRs) {
                Write-ColorOutput "  Associated PRs: $($prs.number -join ', ')" "Green"
            } else {
                Write-ColorOutput "  No associated PRs found" "Yellow"
            }
            
            # Determine correct status based on workflow
            if ($currentStatus -eq "Ready" -and $commitCount -eq 0) {
                Write-ColorOutput "  -> Ready but no commits, should move to Backlog" "Yellow"
                $itemsToMove += @{
                    ItemId = $item.id
                    IssueNumber = $issueNumber
                    Title = $content.title
                    CurrentStatus = $currentStatus
                    NewStatus = "Backlog"
                }
            }
            else {
                Write-ColorOutput "  -> Status is correct" "Green"
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
    
    if ($itemsToMove.Count -eq 0) {
        Write-ColorOutput "All Ready issues have commits - status is correct!" "Green"
        return
    }
    
    Write-ColorOutput "=== Changes Needed ===" "Blue"
    Write-ColorOutput "Issues to move from Ready to Backlog (no commits):" "Yellow"
    foreach ($item in $itemsToMove) {
        Write-ColorOutput "  - Issue #$($item.IssueNumber): $($item.Title)" "White"
    }
    Write-ColorOutput ""
    
    # Apply changes if not dry run
    if (-not $DryRun) {
        Write-ColorOutput "=== Applying Changes ===" "Blue"
        
        $successCount = 0
        $totalChanges = $itemsToMove.Count
        
        # Move issues from Ready to Backlog
        foreach ($item in $itemsToMove) {
            Write-ColorOutput "Moving Issue #$($item.IssueNumber) to Backlog..." "Yellow"
            if (Set-ItemStatus $item.ItemId "Backlog") {
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
