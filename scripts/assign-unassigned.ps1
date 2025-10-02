# Assign Unassigned Issues Script
# Usage: .\scripts\assign-unassigned.ps1 [-DryRun]

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

function Get-UnassignedIssues {
    Write-ColorOutput "Fetching unassigned issues..." "Yellow"
    
    try {
        $issues = gh issue list --state open --json number,title,assignees,labels,body
        $unassignedIssues = @()
        
        foreach ($issue in $issues) {
            if ($issue.assignees.Count -eq 0) {
                $unassignedIssues += $issue
            }
        }
        
        return $unassignedIssues
    }
    catch {
        Write-ColorOutput "Error fetching issues: $($_.Exception.Message)" "Red"
        return @()
    }
}

function DetermineAssignee {
    param(
        [string]$Title,
        [string]$Body,
        [array]$Labels
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
    
    # Default assignment logic
    if ($copilotScore -gt $humanScore) {
        return "jschibelli"  # Fallback since Copilot user doesn't exist
    } elseif ($humanScore -gt $copilotScore) {
        return "jschibelli"
    } else {
        # Default to jschibelli for unassigned issues
        return "jschibelli"
    }
}

function Assign-Issue {
    param(
        [int]$IssueNumber,
        [string]$Assignee
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would assign to: $Assignee" "Cyan"
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
    Write-ColorOutput "=== Assign Unassigned Issues ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Assignment Rules:" "Yellow"
    Write-ColorOutput "• Documentation, automation, testing → jschibelli" "White"
    Write-ColorOutput "• Design, critical features, business logic → jschibelli" "White"
    Write-ColorOutput "• Priority P0/P1/Critical → jschibelli" "White"
    Write-ColorOutput "• Size XL/Large/Epic → jschibelli" "White"
    Write-ColorOutput "• Size XS/Small/Quick → jschibelli" "White"
    Write-ColorOutput "• Note: All assignments go to jschibelli (Copilot user not available)" "Yellow"
    Write-ColorOutput ""
    
    # Get unassigned issues
    $unassignedIssues = Get-UnassignedIssues
    
    if ($unassignedIssues.Count -eq 0) {
        Write-ColorOutput "No unassigned issues found!" "Green"
        return
    }
    
    Write-ColorOutput "Found $($unassignedIssues.Count) unassigned issues" "Green"
    Write-ColorOutput ""
    
    $issuesToAssign = @()
    $assignmentStats = @{
        "jschibelli" = 0
    }
    
    # Analyze each unassigned issue
    foreach ($issue in $unassignedIssues) {
        $issueNumber = $issue.number
        $title = $issue.title
        $body = $issue.body
        $labels = $issue.labels
        
        Write-ColorOutput "Issue #${issueNumber}: $title" "White"
        
        # Determine assignee
        $suggestedAssignee = DetermineAssignee -Title $title -Body $body -Labels $labels
        
        Write-ColorOutput "  -> Suggested assignee: $suggestedAssignee" "Yellow"
        
        $issuesToAssign += @{
            IssueNumber = $issueNumber
            Title = $title
            SuggestedAssignee = $suggestedAssignee
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "=== Proposed Assignments ===" "Blue"
    foreach ($issue in $issuesToAssign) {
        Write-ColorOutput "Issue #$($issue.IssueNumber): $($issue.Title)" "White"
        Write-ColorOutput "  -> Assign to: $($issue.SuggestedAssignee)" "Yellow"
    }
    Write-ColorOutput ""
    
    # Apply assignments if not dry run
    if (-not $DryRun) {
        Write-ColorOutput "=== Applying Assignments ===" "Blue"
        
        $successCount = 0
        $totalAssignments = $issuesToAssign.Count
        
        foreach ($issue in $issuesToAssign) {
            Write-ColorOutput "Assigning Issue #$($issue.IssueNumber) to $($issue.SuggestedAssignee)..." "Yellow"
            if (Assign-Issue $issue.IssueNumber $issue.SuggestedAssignee) {
                $successCount++
                $assignmentStats[$issue.SuggestedAssignee]++
            }
        }
        
        Write-ColorOutput ""
        Write-ColorOutput "=== Final Summary ===" "Blue"
        Write-ColorOutput "Total assignments: $totalAssignments" "White"
        Write-ColorOutput "Successful: $successCount" "Green"
        Write-ColorOutput "Failed: $($totalAssignments - $successCount)" "Red"
        Write-ColorOutput ""
        Write-ColorOutput "Assignment breakdown:" "White"
        Write-ColorOutput "  jschibelli: $($assignmentStats['jschibelli'])" "White"
        
        if ($successCount -eq $totalAssignments) {
            Write-ColorOutput "All assignments completed successfully!" "Green"
        } else {
            Write-ColorOutput "Some assignments failed. Please check the output above." "Red"
        }
    } else {
        Write-ColorOutput "Dry run complete. Use without -DryRun to apply assignments." "Cyan"
    }
}

# Run the main function
Main
