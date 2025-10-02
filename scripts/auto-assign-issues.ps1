# Auto Assign Issues Script
# Usage: .\scripts\auto-assign-issues.ps1 [-DryRun]

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
        if ($Assignee -eq "jschibelli") {
            gh issue edit $IssueNumber --add-assignee jschibelli
        } elseif ($Assignee -eq "Copilot") {
            gh issue edit $IssueNumber --add-assignee Copilot
        }
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
        return "Copilot"
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
        return "Copilot"
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
        return "Copilot"
    } elseif ($humanScore -gt $copilotScore) {
        return "jschibelli"
    } else {
        # Default to Copilot for unassigned issues
        return "Copilot"
    }
}

function Main {
    Write-ColorOutput "=== Auto Assign Issues ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Assignment Rules:" "Yellow"
    Write-ColorOutput "• Copilot: Documentation, automation, testing, refactoring, setup" "White"
    Write-ColorOutput "• jschibelli: Design, critical features, business logic, architecture" "White"
    Write-ColorOutput "• Priority P0/P1/Critical → jschibelli" "White"
    Write-ColorOutput "• Size XL/Large/Epic → jschibelli" "White"
    Write-ColorOutput "• Size XS/Small/Quick → Copilot" "White"
    Write-ColorOutput ""
    
    # Get all project items
    $items = Get-AllProjectItems
    
    if ($items.Count -eq 0) {
        Write-ColorOutput "No project items found." "Red"
        return
    }
    
    Write-ColorOutput "Found $($items.Count) project items" "Green"
    Write-ColorOutput ""
    
    $issuesToAssign = @()
    $alreadyAssigned = @()
    $assignmentStats = @{
        "jschibelli" = 0
        "Copilot" = 0
        "Already Assigned" = 0
    }
    
    # Analyze each issue
    foreach ($item in $items) {
        $content = $item.content
        
        if ($content.type -eq "Issue") {
            $issueNumber = $content.number
            $currentAssignees = $item.assignees
            
            Write-ColorOutput "Issue #$issueNumber - Current assignees: $($currentAssignees -join ', ')" "White"
            
            # Skip if already assigned
            if ($currentAssignees.Count -gt 0) {
                Write-ColorOutput "  -> Already assigned, skipping" "Gray"
                $alreadyAssigned += $item
                $assignmentStats["Already Assigned"]++
                continue
            }
            
            # Get detailed issue information
            $issueDetails = Get-IssueDetails $issueNumber
            if (-not $issueDetails) {
                Write-ColorOutput "  -> Could not fetch issue details, skipping" "Red"
                continue
            }
            
            # Determine assignee
            $suggestedAssignee = DetermineAssignee -Issue $issueDetails -Title $issueDetails.title -Body $issueDetails.body -Labels $issueDetails.labels
            
            Write-ColorOutput "  -> Suggested assignee: $suggestedAssignee" "Yellow"
            
            $issuesToAssign += @{
                ItemId = $item.id
                IssueNumber = $issueNumber
                Title = $content.title
                SuggestedAssignee = $suggestedAssignee
            }
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "=== Assignment Summary ===" "Blue"
    Write-ColorOutput "Issues to assign: $($issuesToAssign.Count)" "White"
    Write-ColorOutput "Already assigned: $($alreadyAssigned.Count)" "White"
    Write-ColorOutput ""
    
    if ($issuesToAssign.Count -eq 0) {
        Write-ColorOutput "All issues are already assigned!" "Green"
        return
    }
    
    # Show proposed assignments
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
        Write-ColorOutput "  Copilot: $($assignmentStats['Copilot'])" "White"
        Write-ColorOutput "  Already assigned: $($assignmentStats['Already Assigned'])" "White"
        
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
