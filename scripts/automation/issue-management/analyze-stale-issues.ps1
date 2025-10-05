#!/usr/bin/env pwsh
# Analyze Stale Issues Script
# Identifies issues that may be stale based on age and activity

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "      Stale Issues Analysis" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

# Get all open issues
Write-Host "Fetching open issues..." -ForegroundColor Yellow
$issues = gh issue list --state open --json number,title,createdAt,updatedAt,labels,assignees,state --limit 50 | ConvertFrom-Json

Write-Host "Found $($issues.Count) open issues" -ForegroundColor Green
Write-Host ""

# Categories for stale issues
$staleCategories = @{
    VeryOld = @()      # Over 60 days
    Old = @()          # 30-60 days
    Inactive = @()     # No updates in 30+ days
    LowPriority = @()  # Low priority with no recent activity
    Unassigned = @()   # No assignee
    Documentation = @() # Documentation issues that might be outdated
}

foreach ($issue in $issues) {
    $createdDate = [DateTime]::Parse($issue.createdAt)
    $updatedDate = [DateTime]::Parse($issue.updatedAt)
    $daysOld = [math]::Round(((Get-Date) - $createdDate).TotalDays)
    $daysSinceUpdate = [math]::Round(((Get-Date) - $updatedDate).TotalDays)
    
    $issueData = @{
        Number = $issue.number
        Title = $issue.title
        CreatedDate = $createdDate
        UpdatedDate = $updatedDate
        DaysOld = $daysOld
        DaysSinceUpdate = $daysSinceUpdate
        Labels = $issue.labels.name
        Assignees = $issue.assignees.login
        HasAssignee = $issue.assignees.Count -gt 0
    }
    
    # Categorize based on age and activity
    if ($daysOld -gt 60) {
        $staleCategories.VeryOld += $issueData
    } elseif ($daysOld -gt 30) {
        $staleCategories.Old += $issueData
    }
    
    if ($daysSinceUpdate -gt 30) {
        $staleCategories.Inactive += $issueData
    }
    
    if (-not $issueData.HasAssignee) {
        $staleCategories.Unassigned += $issueData
    }
    
    # Check for documentation issues
    $title = $issue.title.ToLower()
    if ($title -match "docs|documentation|guide|readme") {
        $staleCategories.Documentation += $issueData
    }
    
    # Check for low priority issues with no recent activity
    $labels = $issue.labels.name -join " "
    if (($labels -match "priority.*low|priority.*p3|priority.*p2") -and $daysSinceUpdate -gt 14) {
        $staleCategories.LowPriority += $issueData
    }
}

# Display results
Write-Host "VERY OLD ISSUES (60+ days):" -ForegroundColor Red
if ($staleCategories.VeryOld.Count -gt 0) {
    foreach ($issue in $staleCategories.VeryOld) {
        Write-Host "  #$($issue.Number): $($issue.Title)" -ForegroundColor Red
        Write-Host "    Created: $($issue.CreatedDate.ToString('yyyy-MM-dd')) ($($issue.DaysOld) days ago)" -ForegroundColor Gray
        Write-Host "    Updated: $($issue.UpdatedDate.ToString('yyyy-MM-dd')) ($($issue.DaysSinceUpdate) days ago)" -ForegroundColor Gray
        Write-Host "    Assignee: $(if ($issue.HasAssignee) { $issue.Assignees -join ', ' } else { 'None' })" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "  No very old issues found" -ForegroundColor Green
    Write-Host ""
}

Write-Host "OLD ISSUES (30-60 days):" -ForegroundColor Yellow
if ($staleCategories.Old.Count -gt 0) {
    foreach ($issue in $staleCategories.Old) {
        Write-Host "  #$($issue.Number): $($issue.Title)" -ForegroundColor Yellow
        Write-Host "    Created: $($issue.CreatedDate.ToString('yyyy-MM-dd')) ($($issue.DaysOld) days ago)" -ForegroundColor Gray
        Write-Host "    Updated: $($issue.UpdatedDate.ToString('yyyy-MM-dd')) ($($issue.DaysSinceUpdate) days ago)" -ForegroundColor Gray
        Write-Host "    Assignee: $(if ($issue.HasAssignee) { $issue.Assignees -join ', ' } else { 'None' })" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "  No old issues found" -ForegroundColor Green
    Write-Host ""
}

Write-Host "INACTIVE ISSUES (30+ days since update):" -ForegroundColor Magenta
if ($staleCategories.Inactive.Count -gt 0) {
    foreach ($issue in $staleCategories.Inactive) {
        Write-Host "  #$($issue.Number): $($issue.Title)" -ForegroundColor Magenta
        Write-Host "    Last updated: $($issue.UpdatedDate.ToString('yyyy-MM-dd')) ($($issue.DaysSinceUpdate) days ago)" -ForegroundColor Gray
        Write-Host "    Assignee: $(if ($issue.HasAssignee) { $issue.Assignees -join ', ' } else { 'None' })" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "  No inactive issues found" -ForegroundColor Green
    Write-Host ""
}

Write-Host "UNASSIGNED ISSUES:" -ForegroundColor Cyan
if ($staleCategories.Unassigned.Count -gt 0) {
    foreach ($issue in $staleCategories.Unassigned) {
        Write-Host "  #$($issue.Number): $($issue.Title)" -ForegroundColor Cyan
        Write-Host "    Created: $($issue.CreatedDate.ToString('yyyy-MM-dd')) ($($issue.DaysOld) days ago)" -ForegroundColor Gray
        Write-Host "    Labels: $($issue.Labels -join ', ')" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "  No unassigned issues found" -ForegroundColor Green
    Write-Host ""
}

Write-Host "DOCUMENTATION ISSUES:" -ForegroundColor Blue
if ($staleCategories.Documentation.Count -gt 0) {
    foreach ($issue in $staleCategories.Documentation) {
        Write-Host "  #$($issue.Number): $($issue.Title)" -ForegroundColor Blue
        Write-Host "    Created: $($issue.CreatedDate.ToString('yyyy-MM-dd')) ($($issue.DaysOld) days ago)" -ForegroundColor Gray
        Write-Host "    Updated: $($issue.UpdatedDate.ToString('yyyy-MM-dd')) ($($issue.DaysSinceUpdate) days ago)" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "  No documentation issues found" -ForegroundColor Green
    Write-Host ""
}

Write-Host "LOW PRIORITY WITH NO RECENT ACTIVITY:" -ForegroundColor DarkYellow
if ($staleCategories.LowPriority.Count -gt 0) {
    foreach ($issue in $staleCategories.LowPriority) {
        Write-Host "  #$($issue.Number): $($issue.Title)" -ForegroundColor DarkYellow
        Write-Host "    Last updated: $($issue.UpdatedDate.ToString('yyyy-MM-dd')) ($($issue.DaysSinceUpdate) days ago)" -ForegroundColor Gray
        Write-Host "    Labels: $($issue.Labels -join ', ')" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "  No low priority inactive issues found" -ForegroundColor Green
    Write-Host ""
}

# Summary
$totalStaleIssues = $staleCategories.VeryOld.Count + $staleCategories.Old.Count + $staleCategories.Inactive.Count + $staleCategories.Unassigned.Count

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "      SUMMARY" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "Total issues analyzed: $($issues.Count)" -ForegroundColor White
Write-Host "Very old issues (60+ days): $($staleCategories.VeryOld.Count)" -ForegroundColor Red
Write-Host "Old issues (30-60 days): $($staleCategories.Old.Count)" -ForegroundColor Yellow
Write-Host "Inactive issues (30+ days no update): $($staleCategories.Inactive.Count)" -ForegroundColor Magenta
Write-Host "Unassigned issues: $($staleCategories.Unassigned.Count)" -ForegroundColor Cyan
Write-Host "Documentation issues: $($staleCategories.Documentation.Count)" -ForegroundColor Blue
Write-Host "Low priority inactive: $($staleCategories.LowPriority.Count)" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "Total potentially stale issues: $totalStaleIssues" -ForegroundColor $(if ($totalStaleIssues -gt 0) { "Red" } else { "Green" })
Write-Host ""
