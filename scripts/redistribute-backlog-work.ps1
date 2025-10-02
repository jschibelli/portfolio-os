# Redistribute Backlog Work Script
# Usage: .\scripts\redistribute-backlog-work.ps1 [-DryRun]

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

function DetermineAssignee {
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
        return "jschibelli"  # Fallback since Copilot user doesn't exist
    }
    if ($labelNames -contains "human" -or $labelNames -contains "manual") {
        return "jschibelli"
    }
    
    # Check for priority labels
    if ($labelNames -contains "p0" -or $labelNames -contains "critical" -or $labelNames -contains "urgent") {
        return "jschibelli"
    }
    
    # Check for size/complexity labels
    if ($labelNames -contains "xl" -or $labelNames -contains "large" -or $labelNames -contains "epic") {
        return "jschibelli"
    }
    if ($labelNames -contains "xs" -or $labelNames -contains "small" -or $labelNames -contains "quick") {
        return "jschibelli"  # Fallback since Copilot user doesn't exist
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
    # Even numbers go to jschibelli, odd numbers go to Copilot (but fallback to jschibelli)
    if ($IssueNumber % 2 -eq 0) {
        return "jschibelli"
    } else {
        return "jschibelli"  # Fallback since Copilot user doesn't exist
    }
}

function Main {
    Write-ColorOutput "=== Redistribute Backlog Work ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Redistribution Rules:" "Yellow"
    Write-ColorOutput "• Documentation, automation, testing → jschibelli" "White"
    Write-ColorOutput "• Design, critical features, business logic → jschibelli" "White"
    Write-ColorOutput "• Priority P0/P1/Critical → jschibelli" "White"
    Write-ColorOutput "• Size XL/Large/Epic → jschibelli" "White"
    Write-ColorOutput "• Size XS/Small/Quick → jschibelli" "White"
    Write-ColorOutput "• Even issue numbers → jschibelli" "White"
    Write-ColorOutput "• Odd issue numbers → jschibelli (Copilot fallback)" "White"
    Write-ColorOutput "• Note: All assignments go to jschibelli (Copilot user not available)" "Yellow"
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
    $redistributionStats = @{
        "jschibelli" = 0
        "Copilot" = 0
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
                $redistributionStats["Errors"]++
                continue
            }
            
            # Determine correct assignee
            $suggestedAssignee = DetermineAssignee -Issue $issueDetails -Title $issueDetails.title -Body $issueDetails.body -Labels $issueDetails.labels -IssueNumber $issueNumber
            
            Write-ColorOutput "  -> Suggested assignee: $suggestedAssignee" "Yellow"
            
            # Check if redistribution is needed
            $needsRedistribution = $false
            $currentAssignee = ""
            
            if ($currentAssignees.Count -eq 0) {
                $needsRedistribution = $true
                $currentAssignee = "None"
            } elseif ($currentAssignees.Count -eq 1 -and $currentAssignees[0] -ne $suggestedAssignee) {
                $needsRedistribution = $true
                $currentAssignee = $currentAssignees[0]
            } elseif ($currentAssignees.Count -gt 1) {
                $needsRedistribution = $true
                $currentAssignee = "Multiple"
            }
            
            if ($needsRedistribution) {
                Write-ColorOutput "  -> Needs redistribution: $currentAssignee → $suggestedAssignee" "Yellow"
                $backlogIssues += @{
                    ItemId = $item.id
                    IssueNumber = $issueNumber
                    Title = $content.title
                    CurrentAssignee = $currentAssignee
                    SuggestedAssignee = $suggestedAssignee
                }
            } else {
                Write-ColorOutput "  -> No change needed" "Green"
                $redistributionStats["No Change Needed"]++
            }
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "=== Redistribution Summary ===" "Blue"
    Write-ColorOutput "Backlog issues to redistribute: $($backlogIssues.Count)" "White"
    Write-ColorOutput "No change needed: $($redistributionStats['No Change Needed'])" "White"
    Write-ColorOutput ""
    
    if ($backlogIssues.Count -eq 0) {
        Write-ColorOutput "All backlog issues have correct assignments!" "Green"
        return
    }
    
    # Show proposed redistributions
    Write-ColorOutput "=== Proposed Redistributions ===" "Blue"
    foreach ($issue in $backlogIssues) {
        Write-ColorOutput "Issue #$($issue.IssueNumber): $($issue.Title)" "White"
        Write-ColorOutput "  -> $($issue.CurrentAssignee) → $($issue.SuggestedAssignee)" "Yellow"
    }
    Write-ColorOutput ""
    
    # Apply redistributions if not dry run
    if (-not $DryRun) {
        Write-ColorOutput "=== Applying Redistributions ===" "Blue"
        
        $successCount = 0
        $totalRedistributions = $backlogIssues.Count
        
        foreach ($issue in $backlogIssues) {
            Write-ColorOutput "Redistributing Issue #$($issue.IssueNumber) from $($issue.CurrentAssignee) to $($issue.SuggestedAssignee)..." "Yellow"
            
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
                $successCount++
                $redistributionStats[$issue.SuggestedAssignee]++
            } else {
                $redistributionStats["Errors"]++
            }
        }
        
        Write-ColorOutput ""
        Write-ColorOutput "=== Final Summary ===" "Blue"
        Write-ColorOutput "Total redistributions: $totalRedistributions" "White"
        Write-ColorOutput "Successful: $successCount" "Green"
        Write-ColorOutput "Failed: $($totalRedistributions - $successCount)" "Red"
        Write-ColorOutput ""
        Write-ColorOutput "Redistribution breakdown:" "White"
        Write-ColorOutput "  jschibelli: $($redistributionStats['jschibelli'])" "White"
        Write-ColorOutput "  Copilot: $($redistributionStats['Copilot'])" "White"
        Write-ColorOutput "  No change needed: $($redistributionStats['No Change Needed'])" "White"
        Write-ColorOutput "  Errors: $($redistributionStats['Errors'])" "White"
        
        if ($successCount -eq $totalRedistributions) {
            Write-ColorOutput "All redistributions completed successfully!" "Green"
        } else {
            Write-ColorOutput "Some redistributions failed. Please check the output above." "Red"
        }
    } else {
        Write-ColorOutput "Dry run complete. Use without -DryRun to apply redistributions." "Cyan"
    }
}

# Run the main function
Main
