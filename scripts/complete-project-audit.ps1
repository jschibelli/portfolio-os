# Complete PowerShell script to audit and fix project status assignments with pagination
# Usage: .\scripts\complete-project-audit.ps1 [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Project configuration
$ProjectId = "PVT_kwHOAEnMVc4BCu-c"
$StatusFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"

# Status option IDs (corrected from diagnostic)
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
    Write-ColorOutput "Fetching all project items with pagination..." "Yellow"
    
    $allItems = @()
    $hasNextPage = $true
    $cursor = $null
    
    while ($hasNextPage) {
        try {
            $query = @"
query(`$projectId: ID!, `$cursor: String) {
  node(id: `$projectId) {
    ... on ProjectV2 {
      items(first: 100, after: `$cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
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

            $result = gh api graphql -f query=$query -f projectId=$ProjectId -f cursor=$cursor
            $jsonData = $result | ConvertFrom-Json
            
            if ($jsonData.data.node.items.nodes) {
                $allItems += $jsonData.data.node.items.nodes
            }
            
            $hasNextPage = $jsonData.data.node.items.pageInfo.hasNextPage
            $cursor = $jsonData.data.node.items.pageInfo.endCursor
            
            Write-ColorOutput "  Fetched $($jsonData.data.node.items.nodes.Count) items (Total: $($allItems.Count))" "Gray"
        }
        catch {
            Write-ColorOutput "Error fetching project items: $($_.Exception.Message)" "Red"
            break
        }
    }
    
    return $allItems
}

function Get-ItemStatus {
    param($Item)
    
    $statusValue = $Item.fieldValues.nodes | Where-Object { 
        $_.field.name -eq "Status" 
    } | Select-Object -First 1
    
    return $statusValue.name
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
    Write-ColorOutput "=== Complete Portfolio OS Project Status Audit ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    
    # Get all project items
    $items = Get-AllProjectItems
    
    if ($items.Count -eq 0) {
        Write-ColorOutput "No project items found." "Red"
        return
    }
    
    Write-ColorOutput "Found $($items.Count) project items" "Green"
    Write-ColorOutput ""
    
    $issuesToMove = @()
    $prsToMove = @()
    $workingIssues = @()
    $readyIssues = @()
    $backlogIssues = @()
    $inProgressIssues = @()
    $doneIssues = @()
    
    # Analyze each item
    foreach ($item in $items) {
        $content = $item.content
        $currentStatus = Get-ItemStatus $item
        
        if ($content.type -eq "Issue") {
            $issueNumber = $content.number
            $assignees = @()
            $labels = @()
            
            # Get assignees and labels from the item level, not content level
            if ($item.assignees) {
                $assignees = $item.assignees
            }
            if ($item.labels) {
                $labels = $item.labels
            }
            
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
            
            # Categorize by current status
            switch ($currentStatus) {
                "Ready" { $readyIssues += $item }
                "Backlog" { $backlogIssues += $item }
                "In progress" { $inProgressIssues += $item }
                "Done" { $doneIssues += $item }
            }
            
            # Determine if status needs to change
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
        elseif ($content.type -eq "PullRequest") {
            $prNumber = $content.number
            
            Write-ColorOutput "PR #$prNumber - Status: $currentStatus" "White"
            Write-ColorOutput "  Branch: $($content.headRefName) -> $($content.baseRefName)" "Gray"
            
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
        
        Write-ColorOutput "" "White"
    }
    
    Write-ColorOutput "=== Current Status Summary ===" "Blue"
    Write-ColorOutput "Ready Issues: $($readyIssues.Count)" "White"
    Write-ColorOutput "Backlog Issues: $($backlogIssues.Count)" "White"
    Write-ColorOutput "In Progress Issues: $($inProgressIssues.Count)" "White"
    Write-ColorOutput "Done Issues: $($doneIssues.Count)" "White"
    Write-ColorOutput ""
    
    Write-ColorOutput "=== Changes Needed ===" "Blue"
    
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
    
    # Apply changes if not dry run
    if (-not $DryRun) {
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
    } else {
        Write-ColorOutput "Dry run complete. Use without -DryRun to apply changes." "Cyan"
    }
}

# Run the main function
Main
