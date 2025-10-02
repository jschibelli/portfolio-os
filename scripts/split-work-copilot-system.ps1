# Split Work with Copilot System Script
# Usage: .\scripts\split-work-copilot-system.ps1 [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
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

function Add-Label {
    param(
        [int]$IssueNumber,
        [string]$Label
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would add label: $Label" "Cyan"
        return $true
    }
    
    try {
        gh issue edit $IssueNumber --add-label $Label
        Write-ColorOutput "  Success" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "  Error: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Remove-Label {
    param(
        [int]$IssueNumber,
        [string]$Label
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would remove label: $Label" "Cyan"
        return $true
    }
    
    try {
        gh issue edit $IssueNumber --remove-label $Label
        Write-ColorOutput "  Success" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "  Error: $($_.Exception.Message)" "Red"
        return $false
    }
}

function DetermineWorkAssignment {
    param(
        [object]$Issue,
        [string]$Title,
        [string]$Body,
        [array]$Labels,
        [int]$IssueNumber
    )
    
    # Convert labels to lowercase for easier matching
    $labelNames = @()
    foreach ($label in $Labels) {
        $labelNames += $label.name.ToLower()
    }
    
    # Keywords that suggest Copilot should handle
    $copilotKeywords = @(
        "documentation", "docs", "readme", "guide", "tutorial", "example",
        "setup", "configuration", "config", "environment", "env",
        "automation", "script", "workflow", "ci/cd", "deployment",
        "testing", "test", "spec", "coverage", "quality",
        "refactor", "cleanup", "optimization", "performance",
        "seo", "meta", "analytics", "tracking", "monitoring",
        "integration", "api", "webhook", "sync", "migration",
        "accessibility", "a11y", "responsive", "mobile",
        "security", "auth", "permission", "validation"
    )
    
    # Keywords that suggest human (jschibelli) should handle
    $humanKeywords = @(
        "design", "ui", "ux", "user interface", "user experience",
        "creative", "branding", "visual", "layout", "styling",
        "business logic", "core functionality", "feature",
        "architecture", "system design", "database", "schema",
        "critical", "urgent", "priority", "high", "p0", "p1",
        "review", "approval", "decision", "strategy", "planning",
        "client", "customer", "user", "stakeholder", "requirement"
    )
    
    # Check for explicit labels
    if ($labelNames -contains "copilot" -or $labelNames -contains "automation") {
        return @{ Assignee = "jschibelli"; Label = "copilot-work" }
    }
    if ($labelNames -contains "human" -or $labelNames -contains "manual") {
        return @{ Assignee = "jschibelli"; Label = "human-work" }
    }
    
    # Check for priority labels
    if ($labelNames -contains "p0" -or $labelNames -contains "critical" -or $labelNames -contains "urgent") {
        return @{ Assignee = "jschibelli"; Label = "human-work" }
    }
    
    # Check for size/complexity labels
    if ($labelNames -contains "xl" -or $labelNames -contains "large" -or $labelNames -contains "epic") {
        return @{ Assignee = "jschibelli"; Label = "human-work" }
    }
    if ($labelNames -contains "xs" -or $labelNames -contains "small" -or $labelNames -contains "quick") {
        return @{ Assignee = "jschibelli"; Label = "copilot-work" }
    }
    
    # Analyze title and body for keywords
    $textToAnalyze = "$Title $Body".ToLower()
    
    $copilotScore = 0
    $humanScore = 0
    
    foreach ($keyword in $copilotKeywords) {
        if ($textToAnalyze -like "*$keyword*") {
            $copilotScore++
        }
    }
    
    foreach ($keyword in $humanKeywords) {
        if ($textToAnalyze -like "*$keyword*") {
            $humanScore++
        }
    }
    
    # Alternative distribution: Use issue number for even split
    # Even numbers go to jschibelli with copilot-work label, odd numbers go to jschibelli with human-work label
    if ($IssueNumber % 2 -eq 0) {
        return @{ Assignee = "jschibelli"; Label = "copilot-work" }
    } else {
        return @{ Assignee = "jschibelli"; Label = "human-work" }
    }
}

function Main {
    Write-ColorOutput "=== Split Work with Copilot System ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Work Distribution Rules:" "Yellow"
    Write-ColorOutput "• Documentation, automation, testing → jschibelli + 'copilot-work' label" "White"
    Write-ColorOutput "• Design, critical features, business logic → jschibelli + 'human-work' label" "White"
    Write-ColorOutput "• Priority P0/P1/Critical → jschibelli + 'human-work' label" "White"
    Write-ColorOutput "• Size XL/Large/Epic → jschibelli + 'human-work' label" "White"
    Write-ColorOutput "• Size XS/Small/Quick → jschibelli + 'copilot-work' label" "White"
    Write-ColorOutput "• Even issue numbers → jschibelli + 'copilot-work' label" "White"
    Write-ColorOutput "• Odd issue numbers → jschibelli + 'human-work' label" "White"
    Write-ColorOutput "• Note: All issues assigned to jschibelli, but labeled for work type" "Yellow"
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
    $distributionStats = @{
        "copilot-work" = 0
        "human-work" = 0
        "No Change Needed" = 0
        "Errors" = 0
    }
    
    # Find backlog issues
    foreach ($item in $items) {
        $content = $item.content
        
        if ($content.type -eq "Issue" -and $item.status -eq "Backlog") {
            $issueNumber = $content.number
            $currentAssignees = $item.assignees
            
            Write-ColorOutput "Backlog Issue #$issueNumber - Current assignees: $($currentAssignees -join ', ')" "White"
            
            # Get detailed issue information
            $issueDetails = Get-IssueDetails $issueNumber
            if (-not $issueDetails) {
                Write-ColorOutput "  -> Could not fetch issue details, skipping" "Red"
                $distributionStats["Errors"]++
                continue
            }
            
            # Determine work assignment
            $workAssignment = DetermineWorkAssignment -Issue $issueDetails -Title $issueDetails.title -Body $issueDetails.body -Labels $issueDetails.labels -IssueNumber $issueNumber
            
            Write-ColorOutput "  -> Suggested assignment: $($workAssignment.Assignee) + '$($workAssignment.Label)' label" "Yellow"
            
            # Check if redistribution is needed
            $needsRedistribution = $false
            $currentAssignee = ""
            $currentLabels = $issueDetails.labels | ForEach-Object { $_.name }
            
            if ($currentAssignees.Count -eq 0) {
                $needsRedistribution = $true
                $currentAssignee = "None"
            } elseif ($currentAssignees.Count -eq 1 -and $currentAssignees[0] -ne $workAssignment.Assignee) {
                $needsRedistribution = $true
                $currentAssignee = $currentAssignees[0]
            } elseif ($currentAssignees.Count -gt 1) {
                $needsRedistribution = $true
                $currentAssignee = "Multiple"
            }
            
            # Check if label needs to be added/removed
            $needsLabelUpdate = $false
            if ($currentLabels -notcontains $workAssignment.Label) {
                $needsLabelUpdate = $true
            }
            
            if ($needsRedistribution -or $needsLabelUpdate) {
                Write-ColorOutput "  -> Needs update: $currentAssignee → $($workAssignment.Assignee) + '$($workAssignment.Label)' label" "Yellow"
                $backlogIssues += @{
                    ItemId = $item.id
                    IssueNumber = $issueNumber
                    Title = $content.title
                    CurrentAssignee = $currentAssignee
                    SuggestedAssignee = $workAssignment.Assignee
                    SuggestedLabel = $workAssignment.Label
                    CurrentLabels = $currentLabels
                }
            } else {
                Write-ColorOutput "  -> No change needed" "Green"
                $distributionStats["No Change Needed"]++
            }
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "=== Distribution Summary ===" "Blue"
    Write-ColorOutput "Backlog issues to update: $($backlogIssues.Count)" "White"
    Write-ColorOutput "No change needed: $($distributionStats['No Change Needed'])" "White"
    Write-ColorOutput ""
    
    if ($backlogIssues.Count -eq 0) {
        Write-ColorOutput "All backlog issues have correct assignments!" "Green"
        return
    }
    
    # Show proposed updates
    Write-ColorOutput "=== Proposed Updates ===" "Blue"
    foreach ($issue in $backlogIssues) {
        Write-ColorOutput "Issue #$($issue.IssueNumber): $($issue.Title)" "White"
        Write-ColorOutput "  -> $($issue.CurrentAssignee) → $($issue.SuggestedAssignee) + '$($issue.SuggestedLabel)' label" "Yellow"
    }
    Write-ColorOutput ""
    
    # Apply updates if not dry run
    if (-not $DryRun) {
        Write-ColorOutput "=== Applying Updates ===" "Blue"
        
        $successCount = 0
        $totalUpdates = $backlogIssues.Count
        
        foreach ($issue in $backlogIssues) {
            Write-ColorOutput "Updating Issue #$($issue.IssueNumber)..." "Yellow"
            
            $success = $true
            
            # Remove current assignees if any
            if ($issue.CurrentAssignee -ne "None" -and $issue.CurrentAssignee -ne "Multiple") {
                if (-not (Remove-Assignee $issue.IssueNumber $issue.CurrentAssignee)) {
                    $success = $false
                }
            } elseif ($issue.CurrentAssignee -eq "Multiple") {
                # For multiple assignees, we'll just add the new one
                # GitHub will handle the assignment
            }
            
            # Add new assignee
            if ($success -and (Add-Assignee $issue.IssueNumber $issue.SuggestedAssignee)) {
                $success = $true
            } else {
                $success = $false
            }
            
            # Add/remove labels
            if ($success) {
                # Remove old work labels if they exist
                if ($issue.CurrentLabels -contains "copilot-work" -and $issue.SuggestedLabel -eq "human-work") {
                    Remove-Label $issue.IssueNumber "copilot-work"
                }
                if ($issue.CurrentLabels -contains "human-work" -and $issue.SuggestedLabel -eq "copilot-work") {
                    Remove-Label $issue.IssueNumber "human-work"
                }
                
                # Add new label
                if (Add-Label $issue.IssueNumber $issue.SuggestedLabel) {
                    $successCount++
                    $distributionStats[$issue.SuggestedLabel]++
                } else {
                    $distributionStats["Errors"]++
                }
            } else {
                $distributionStats["Errors"]++
            }
        }
        
        Write-ColorOutput ""
        Write-ColorOutput "=== Final Summary ===" "Blue"
        Write-ColorOutput "Total updates: $totalUpdates" "White"
        Write-ColorOutput "Successful: $successCount" "Green"
        Write-ColorOutput "Failed: $($totalUpdates - $successCount)" "Red"
        Write-ColorOutput ""
        Write-ColorOutput "Distribution breakdown:" "White"
        Write-ColorOutput "  copilot-work: $($distributionStats['copilot-work'])" "White"
        Write-ColorOutput "  human-work: $($distributionStats['human-work'])" "White"
        Write-ColorOutput "  No change needed: $($distributionStats['No Change Needed'])" "White"
        Write-ColorOutput "  Errors: $($distributionStats['Errors'])" "White"
        
        if ($successCount -eq $totalUpdates) {
            Write-ColorOutput "All updates completed successfully!" "Green"
        } else {
            Write-ColorOutput "Some updates failed. Please check the output above." "Red"
        }
    } else {
        Write-ColorOutput "Dry run complete. Use without -DryRun to apply updates." "Cyan"
    }
}

# Run the main function
Main
