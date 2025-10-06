# Agent Status Update - Simple script for agents to update project board status
# Usage: .\scripts\agent-status-update.ps1 -IssueNumber 250 -Action "start"
# Actions: start, complete, create-pr, merge-pr

param(
    [Parameter(Mandatory=$true)]
    [int]$IssueNumber,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "complete", "create-pr", "merge-pr")]
    [string]$Action,
    
    [Parameter(Mandatory=$false)]
    [string]$AgentName = "agent-3",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

function Show-Banner {
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host "     Agent Status Update" -ForegroundColor Blue
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host ""
}

function Update-ProjectStatus {
    param(
        [int]$IssueNumber,
        [string]$Status,
        [string]$AgentName
    )
    
    try {
        Write-Host " Updating project status for Issue #$IssueNumber to '$Status' (Agent: $AgentName)" -ForegroundColor Yellow
        
        # Get the project item ID for this issue
        $itemQuery = @"
query {
  repository(owner: "jschibelli", name: "portfolio-os") {
    issue(number: $IssueNumber) {
      projectItems(first: 10) {
        nodes {
          id
          project {
            id
          }
        }
      }
    }
  }
}
"@
        
        $itemResult = gh api graphql -f query=$itemQuery
        if (-not $itemResult) {
            Write-Host " Failed to get project item for issue #$IssueNumber" -ForegroundColor Red
            return $false
        }
        
        $itemData = $itemResult | ConvertFrom-Json
        $projectItem = $itemData.data.repository.issue.projectItems.nodes | Where-Object { $_.project.id -eq "PVT_kwHOAEnMVc4BCu-c" }
        
        if (-not $projectItem) {
            Write-Host " Issue #$IssueNumber not found in project board" -ForegroundColor Red
            return $false
        }
        
        # Get project status field and options
        $projectQuery = @"
query {
  node(id: "PVT_kwHOAEnMVc4BCu-c") {
    ... on ProjectV2 {
      id
      fields(first: 20) {
        nodes {
          ... on ProjectV2SingleSelectField {
            id
            name
            options {
              id
              name
            }
          }
        }
      }
    }
  }
}
"@
        
        $projectResult = gh api graphql -f query=$projectQuery
        if (-not $projectResult) {
            Write-Host " Failed to get project details" -ForegroundColor Red
            return $false
        }
        
        $projectData = $projectResult | ConvertFrom-Json
        $project = $projectData.data.node
        $statusField = $project.fields.nodes | Where-Object { $_.name -eq "Status" }
        
        if (-not $statusField) {
            Write-Host " Status field not found in project" -ForegroundColor Red
            return $false
        }
        
        # Find the status option
        $statusOption = $statusField.options | Where-Object { $_.name -eq $Status }
        if (-not $statusOption) {
            Write-Host " Status option '$Status' not found" -ForegroundColor Red
            Write-Host "Available options: $($statusField.options.name -join ', ')" -ForegroundColor Gray
            return $false
        }
        
        if ($DryRun) {
            Write-Host " [DRY RUN] Would update status to: $Status ($($statusOption.id))" -ForegroundColor Magenta
            return $true
        }
        
        # Update the project item status
        $updateMutation = @"
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: "$($project.id)"
    itemId: "$($projectItem.id)"
    fieldId: "$($statusField.id)"
    value: {
      singleSelectOptionId: "$($statusOption.id)"
    }
  }) {
    projectV2Item {
      id
    }
  }
}
"@
        
        $updateResult = gh api graphql -f query=$updateMutation
        if ($updateResult) {
            Write-Host " Successfully updated Issue #$IssueNumber status to '$Status'" -ForegroundColor Green
            return $true
        } else {
            Write-Host " Failed to update project status" -ForegroundColor Red
            return $false
        }
        
    } catch {
        Write-Host " Error updating project status: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Process-AgentAction {
    param(
        [string]$AgentName,
        [int]$IssueNumber,
        [string]$Action
    )
    
    Write-Host " Processing $AgentName action: $Action for Issue #$IssueNumber" -ForegroundColor Cyan
    
    switch ($Action) {
        "start" {
            # Agent is starting work on an issue
            $success = Update-ProjectStatus -IssueNumber $IssueNumber -Status "In Progress" -AgentName $AgentName
            if ($success) {
                Write-Host " Agent $AgentName is now working on Issue #$IssueNumber" -ForegroundColor Green
            }
        }
        "complete" {
            # Agent has completed implementation, ready for review
            $success = Update-ProjectStatus -IssueNumber $IssueNumber -Status "Ready" -AgentName $AgentName
            if ($success) {
                Write-Host " Agent $AgentName completed Issue #$IssueNumber - ready for review" -ForegroundColor Green
            }
        }
        "create-pr" {
            # Agent has created a PR
            $success = Update-ProjectStatus -IssueNumber $IssueNumber -Status "Ready" -AgentName $AgentName
            if ($success) {
                Write-Host " Agent $AgentName created PR for Issue #$IssueNumber - ready for review" -ForegroundColor Green
            }
        }
        "merge-pr" {
            # PR has been merged
            $success = Update-ProjectStatus -IssueNumber $IssueNumber -Status "Done" -AgentName $AgentName
            if ($success) {
                Write-Host " Agent $AgentName's PR merged for Issue #$IssueNumber - completed!" -ForegroundColor Green
            }
        }
        default {
            Write-Host " Unknown action: $Action" -ForegroundColor Red
            return $false
        }
    }
    
    return $success
}

# Main execution
Show-Banner

Write-Host "Agent: $AgentName" -ForegroundColor White
Write-Host "Issue: #$IssueNumber" -ForegroundColor White
Write-Host "Action: $Action" -ForegroundColor White
Write-Host "Dry Run: $DryRun" -ForegroundColor White
Write-Host ""

if (-not (Test-Path "gh")) {
    Write-Host " GitHub CLI not found. Please install GitHub CLI" -ForegroundColor Red
    exit 1
}

# Check GitHub authentication
$authStatus = gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host " GitHub authentication required. Please run 'gh auth login'" -ForegroundColor Red
    exit 1
}

# Process the agent action
$success = Process-AgentAction -AgentName $AgentName -IssueNumber $IssueNumber -Action $Action

if ($success) {
    Write-Host ""
    Write-Host " Agent status update completed successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host " Agent status update failed!" -ForegroundColor Red
    exit 1
}
