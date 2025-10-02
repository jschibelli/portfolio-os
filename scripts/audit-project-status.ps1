# PowerShell script to audit and fix project status assignments
# Usage: .\scripts\audit-project-status.ps1 [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Import shared utilities
. "$PSScriptRoot\shared\github-utils.ps1"

# Project configuration
$ProjectId = "PVT_kwHOAEnMVc4BCu-c"
$StatusFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"

# Status option IDs
$StatusOptions = @{
    "Backlog" = "f47ac10b-58cc-4372-a567-0e02b2c3d488"
    "In progress" = "47fc9ee4"
    "Ready" = "e18bf179"
    "Done" = "98236657"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Get-ProjectItems {
    Write-ColorOutput "Fetching all project items..." "Yellow"
    
    try {
        $query = @"
query(`$projectId: ID!) {
  node(id: `$projectId) {
    ... on ProjectV2 {
      items(first: 100) {
        nodes {
          id
          content {
            ... on Issue {
              number
              title
              state
              assignees(first: 10) {
                nodes {
                  login
                }
              }
              labels(first: 20) {
                nodes {
                  name
                }
              }
            }
            ... on PullRequest {
              number
              title
              state
              headRefName
              baseRefName
            }
          }
          fieldValues(first: 20) {
            nodes {
              ... on ProjectV2ItemFieldSingleSelectValue {
                field {
                  ... on ProjectV2FieldCommon {
                    name
                  }
                }
                name
              }
            }
          }
        }
      }
    }
  }
}
"@

        $result = gh api graphql -f query=$query -f projectId=$ProjectId
        $jsonData = $result | ConvertFrom-Json
        return $jsonData.data.node.items.nodes
    }
    catch {
        Write-ColorOutput "Error fetching project items: $($_.Exception.Message)" "Red"
        return @()
    }
}

function Get-ItemStatus {
    param($Item)
    
    $statusValue = $Item.fieldValues.nodes | Where-Object { 
        $_.field.name -eq "Status" 
    } | Select-Object -First 1
    
    return $statusValue.name
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

function Get-IssuePRs {
    param([int]$IssueNumber)
    
    try {
        $prs = gh pr list --state all --search "is:pr is:issue #$IssueNumber" --json number,title,state
        return $prs | ConvertFrom-Json
    }
    catch {
        return @()
    }
}

function Main {
    Write-ColorOutput "=== Portfolio OS Project Status Audit ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    
    # Get all project items
    $items = Get-ProjectItems
    
    if ($items.Count -eq 0) {
        Write-ColorOutput "No project items found." "Red"
        return
    }
    
    Write-ColorOutput "Found $($items.Count) project items" "Green"
    Write-ColorOutput ""
    
    $issuesToMove = @()
    $prsToMove = @()
    $workingIssues = @()
    
    # Analyze each item
    foreach ($item in $items) {
        $content = $item.content
        
        if ($content.__typename -eq "Issue") {
            $issueNumber = $content.number
            $currentStatus = Get-ItemStatus $item
            $assignees = $content.assignees.nodes.login
            
            Write-ColorOutput "Issue #$issueNumber - Status: $currentStatus" "White"
            
            # Check if issue has associated PRs
            $prs = Get-IssuePRs $issueNumber
            $hasPRs = $prs.Count -gt 0
            
            if ($currentStatus -eq "Ready" -and -not $hasPRs) {
                Write-ColorOutput "  -> No PRs found, should move to Backlog" "Yellow"
                $issuesToMove += @{
                    ItemId = $item.id
                    IssueNumber = $issueNumber
                    Title = $content.title
                    CurrentStatus = $currentStatus
                    NewStatus = "Backlog"
                }
            }
            elseif ($currentStatus -eq "Backlog" -and $assignees.Count -gt 0) {
                Write-ColorOutput "  -> Has assignees, should move to In progress" "Yellow"
                $workingIssues += @{
                    ItemId = $item.id
                    IssueNumber = $issueNumber
                    Title = $content.title
                    CurrentStatus = $currentStatus
                    NewStatus = "In progress"
                }
            }
            else {
                Write-ColorOutput "  -> Status is correct" "Green"
            }
        }
        elseif ($content.__typename -eq "PullRequest") {
            $prNumber = $content.number
            $currentStatus = Get-ItemStatus $item
            
            Write-ColorOutput "PR #$prNumber - Status: $currentStatus" "White"
            
            if ($currentStatus -ne "Ready") {
                Write-ColorOutput "  -> Should move to Ready" "Yellow"
                $prsToMove += @{
                    ItemId = $item.id
                    PRNumber = $prNumber
                    Title = $content.title
                    CurrentStatus = $currentStatus
                    NewStatus = "Ready"
                }
            }
            else {
                Write-ColorOutput "  -> Status is correct" "Green"
            }
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "=== Summary of Changes Needed ===" "Blue"
    
    # Move issues without PRs to Backlog
    if ($issuesToMove.Count -gt 0) {
        Write-ColorOutput "Issues to move from Ready to Backlog (no PRs):" "Yellow"
        foreach ($issue in $issuesToMove) {
            Write-ColorOutput "  - Issue #$($issue.IssueNumber): $($issue.Title)" "White"
        }
        Write-ColorOutput ""
    }
    
    # Move PRs to Ready
    if ($prsToMove.Count -gt 0) {
        Write-ColorOutput "PRs to move to Ready:" "Yellow"
        foreach ($pr in $prsToMove) {
            Write-ColorOutput "  - PR #$($pr.PRNumber): $($pr.Title)" "White"
        }
        Write-ColorOutput ""
    }
    
    # Move working issues to In progress
    if ($workingIssues.Count -gt 0) {
        Write-ColorOutput "Issues to move from Backlog to In progress (assigned):" "Yellow"
        foreach ($issue in $workingIssues) {
            Write-ColorOutput "  - Issue #$($issue.IssueNumber): $($issue.Title)" "White"
        }
        Write-ColorOutput ""
    }
    
    if ($issuesToMove.Count -eq 0 -and $prsToMove.Count -eq 0 -and $workingIssues.Count -eq 0) {
        Write-ColorOutput "All project items have correct status assignments!" "Green"
        return
    }
    
    # Apply changes
    Write-ColorOutput "=== Applying Changes ===" "Blue"
    
    $successCount = 0
    $totalChanges = $issuesToMove.Count + $prsToMove.Count + $workingIssues.Count
    
    # Move issues without PRs to Backlog
    foreach ($issue in $issuesToMove) {
        Write-ColorOutput "Moving Issue #$($issue.IssueNumber) to Backlog..." "Yellow"
        if (Set-ItemStatus $issue.ItemId "Backlog") {
            Write-ColorOutput "  Success" "Green"
            $successCount++
        } else {
            Write-ColorOutput "  Failed" "Red"
        }
    }
    
    # Move PRs to Ready
    foreach ($pr in $prsToMove) {
        Write-ColorOutput "Moving PR #$($pr.PRNumber) to Ready..." "Yellow"
        if (Set-ItemStatus $pr.ItemId "Ready") {
            Write-ColorOutput "  Success" "Green"
            $successCount++
        } else {
            Write-ColorOutput "  Failed" "Red"
        }
    }
    
    # Move working issues to In progress
    foreach ($issue in $workingIssues) {
        Write-ColorOutput "Moving Issue #$($issue.IssueNumber) to In progress..." "Yellow"
        if (Set-ItemStatus $issue.ItemId "In progress") {
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
}

# Run the main function
Main