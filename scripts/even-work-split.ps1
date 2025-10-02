# Even Work Split Script
# Usage: .\scripts\even-work-split.ps1 [-DryRun] [-YourCount 15] [-CopilotCount 15]

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    [Parameter(Mandatory=$false)]
    [int]$YourCount = 15,
    [Parameter(Mandatory=$false)]
    [int]$CopilotCount = 15
)

# Project configuration
$ProjectId = "PVT_kwHOAEnMVc4BCu-c"

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

function Get-IssueDetails {
    param([int]$IssueNumber)
    
    try {
        $issue = gh issue view $IssueNumber --json number,title,body,labels,assignees,author
        return $issue | ConvertFrom-Json
    }
    catch {
        return $null
    }
}

function Remove-Assignee {
    param(
        [int]$IssueNumber,
        [string]$Assignee
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would remove assignee: $Assignee" "Cyan"
        return $true
    }
    
    try {
        gh issue edit $IssueNumber --remove-assignee $Assignee
        Write-ColorOutput "  Success" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "  Error: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Add-Assignee {
    param(
        [int]$IssueNumber,
        [string]$Assignee
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would add assignee: $Assignee" "Cyan"
        return $true
    }
    
    try {
        gh issue edit $IssueNumber --add-assignee $Assignee
        Write-ColorOutput "  Success" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "  Error: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Main {
    Write-ColorOutput "=== Even Work Split ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Work Split Plan:" "Yellow"
    Write-ColorOutput "• Your issues: $YourCount" "White"
    Write-ColorOutput "• Copilot issues: $CopilotCount" "White"
    Write-ColorOutput "• Note: Copilot issues will be assigned to jschibelli but marked for Copilot work" "Yellow"
    Write-ColorOutput ""
    
    # Get all project items
    $items = Get-AllProjectItems
    
    if ($items.Count -eq 0) {
        Write-ColorOutput "No project items found." "Red"
        return
    }
    
    Write-ColorOutput "Found $($items.Count) project items" "Green"
    Write-ColorOutput ""
    
    $backlogIssues = @()
    
    # Find all backlog issues
    foreach ($item in $items) {
        $content = $item.content
        
        if ($content.type -eq "Issue" -and $item.status -eq "Backlog") {
            $issueNumber = $content.number
            $currentAssignees = $item.assignees
            
            $backlogIssues += @{
                ItemId = $item.id
                IssueNumber = $issueNumber
                Title = $content.title
                CurrentAssignees = $currentAssignees
            }
        }
    }
    
    Write-ColorOutput "Found $($backlogIssues.Count) backlog issues" "Green"
    Write-ColorOutput ""
    
    if ($backlogIssues.Count -eq 0) {
        Write-ColorOutput "No backlog issues found." "Red"
        return
    }
    
    # Sort issues by number for consistent distribution
    $backlogIssues = $backlogIssues | Sort-Object { $_.IssueNumber }
    
    # Create work split
    $yourIssues = @()
    $copilotIssues = @()
    
    # Alternate assignment: even numbers to you, odd numbers to Copilot
    for ($i = 0; $i -lt $backlogIssues.Count; $i++) {
        $issue = $backlogIssues[$i]
        
        if ($i % 2 -eq 0 -and $yourIssues.Count -lt $YourCount) {
            $yourIssues += $issue
        } elseif ($copilotIssues.Count -lt $CopilotCount) {
            $copilotIssues += $issue
        } else {
            # If we've hit the limits, assign remaining to you
            $yourIssues += $issue
        }
    }
    
    Write-ColorOutput "=== Work Distribution Plan ===" "Blue"
    Write-ColorOutput "Your issues ($($yourIssues.Count)):" "White"
    foreach ($issue in $yourIssues) {
        Write-ColorOutput "  #$($issue.IssueNumber): $($issue.Title)" "White"
    }
    Write-ColorOutput ""
    
    Write-ColorOutput "Copilot issues ($($copilotIssues.Count)):" "White"
    foreach ($issue in $copilotIssues) {
        Write-ColorOutput "  #$($issue.IssueNumber): $($issue.Title)" "White"
    }
    Write-ColorOutput ""
    
    # Show what changes would be made
    $changesNeeded = @()
    
    foreach ($issue in $yourIssues) {
        $currentAssignee = if ($issue.CurrentAssignees.Count -eq 0) { "None" } 
                          elseif ($issue.CurrentAssignees.Count -eq 1) { $issue.CurrentAssignees[0] }
                          else { "Multiple" }
        
        if ($currentAssignee -ne "jschibelli") {
            $changesNeeded += @{
                IssueNumber = $issue.IssueNumber
                Title = $issue.Title
                CurrentAssignee = $currentAssignee
                NewAssignee = "jschibelli"
                WorkType = "Your work"
            }
        }
    }
    
    foreach ($issue in $copilotIssues) {
        $currentAssignee = if ($issue.CurrentAssignees.Count -eq 0) { "None" } 
                          elseif ($issue.CurrentAssignees.Count -eq 1) { $issue.CurrentAssignees[0] }
                          else { "Multiple" }
        
        if ($currentAssignee -ne "jschibelli") {
            $changesNeeded += @{
                IssueNumber = $issue.IssueNumber
                Title = $issue.Title
                CurrentAssignee = $currentAssignee
                NewAssignee = "jschibelli"
                WorkType = "Copilot work"
            }
        }
    }
    
    if ($changesNeeded.Count -eq 0) {
        Write-ColorOutput "All issues are already correctly assigned!" "Green"
        return
    }
    
    Write-ColorOutput "=== Changes Needed ===" "Blue"
    foreach ($change in $changesNeeded) {
        Write-ColorOutput "Issue #$($change.IssueNumber): $($change.Title)" "White"
        Write-ColorOutput "  -> $($change.CurrentAssignee) → $($change.NewAssignee) ($($change.WorkType))" "Yellow"
    }
    Write-ColorOutput ""
    
    if (-not $DryRun) {
        Write-ColorOutput "=== Applying Changes ===" "Blue"
        
        $successCount = 0
        $totalChanges = $changesNeeded.Count
        
        foreach ($change in $changesNeeded) {
            Write-ColorOutput "Updating Issue #$($change.IssueNumber)..." "Yellow"
            
            $success = $true
            
            # Remove current assignees if any
            if ($change.CurrentAssignee -ne "None" -and $change.CurrentAssignee -ne "Multiple") {
                if (-not (Remove-Assignee $change.IssueNumber $change.CurrentAssignee)) {
                    $success = $false
                }
            } elseif ($change.CurrentAssignee -eq "Multiple") {
                # For multiple assignees, we'll just add the new one
                # GitHub will handle the assignment
            }
            
            # Add new assignee
            if ($success -and (Add-Assignee $change.IssueNumber $change.NewAssignee)) {
                $successCount++
            } else {
                $success = $false
            }
            
            if ($success) {
                Write-ColorOutput "  Success" "Green"
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
            Write-ColorOutput "All changes completed successfully!" "Green"
        } else {
            Write-ColorOutput "Some changes failed. Please check the output above." "Red"
        }
    } else {
        Write-ColorOutput "Dry run complete. Use without -DryRun to apply changes." "Cyan"
    }
}

# Run the main function
Main
