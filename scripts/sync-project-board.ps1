# Sync Project Board Status Script
# This script manually syncs the project board status for all items
# Usage: .\scripts\sync-project-board.ps1

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [string]$ProjectNumber = "20"
)

# Import shared utilities
$sharedPath = Join-Path $PSScriptRoot "shared\github-utils.ps1"
if (Test-Path $sharedPath) {
    . $sharedPath
} else {
    Write-Error "Shared utilities not found at $sharedPath"
    exit 1
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "        Project Board Sync Tool" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Sync-ProjectBoard {
    param(
        [string]$ProjectNumber,
        [bool]$DryRun
    )
    
    Write-ColorOutput "🔄 Syncing Project Board #$ProjectNumber..." "Yellow"
    
    # Get project items
    $projectItems = Get-ProjectItems -ProjectNumber $ProjectNumber
    
    if (-not $projectItems) {
        Write-ColorOutput "❌ No project items found" "Red"
        return
    }
    
    Write-ColorOutput "📊 Found $($projectItems.Count) project items" "Green"
    
    $updatedCount = 0
    $skippedCount = 0
    
    foreach ($item in $projectItems) {
        $itemNumber = $item.content.number
        $itemType = $item.content.type
        $currentStatus = $item.status
        $linkedPRs = $item.'linked pull requests'
        
        Write-ColorOutput "Processing $itemType #$itemNumber (Status: $currentStatus)" "Cyan"
        
        # Determine correct status
        $correctStatus = Get-CorrectStatus -Item $item
        
        if ($correctStatus -and $correctStatus -ne $currentStatus) {
            Write-ColorOutput "  📝 Status should be: $correctStatus (currently: $currentStatus)" "Yellow"
            
            if (-not $DryRun) {
                $result = Update-ProjectItemStatus -ProjectNumber $ProjectNumber -ItemId $item.id -Status $correctStatus
                if ($result) {
                    Write-ColorOutput "  ✅ Updated status to: $correctStatus" "Green"
                    $updatedCount++
                } else {
                    Write-ColorOutput "  ❌ Failed to update status" "Red"
                }
            } else {
                Write-ColorOutput "  🔍 [DRY RUN] Would update status to: $correctStatus" "Magenta"
                $updatedCount++
            }
        } else {
            Write-ColorOutput "  ✓ Status is correct: $currentStatus" "Green"
            $skippedCount++
        }
        
        Write-ColorOutput ""
    }
    
    # Summary
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "           Sync Summary" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "Total items processed: $($projectItems.Count)" "White"
    Write-ColorOutput "Items updated: $updatedCount" "Green"
    Write-ColorOutput "Items skipped: $skippedCount" "Cyan"
    
    if ($DryRun) {
        Write-ColorOutput "Mode: DRY RUN (no actual changes made)" "Magenta"
    }
}

function Get-CorrectStatus {
    param($Item)
    
    $itemType = $Item.content.type
    $linkedPRs = $Item.'linked pull requests'
    $currentStatus = $Item.status
    
    # For Issues
    if ($itemType -eq "Issue") {
        $issueState = $Item.content.state
        
        if ($issueState -eq "CLOSED") {
            return "Done"
        }
        
        # If issue has linked PRs, check PR status
        if ($linkedPRs -and $linkedPRs.Count -gt 0) {
            $pr = $linkedPRs[0]
            if ($pr.state -eq "MERGED") {
                return "Done"
            } elseif ($pr.state -eq "OPEN") {
                # PR is open, issue should be "In Progress" or "In Review"
                if ($pr.isDraft) {
                    return "In Progress"
                } else {
                    return "In Review"
                }
            }
        }
        
        # Default for open issues
        return "Backlog"
    }
    
    # For Pull Requests
    if ($itemType -eq "PullRequest") {
        $prState = $Item.content.state
        $isDraft = $Item.content.isDraft
        
        if ($prState -eq "MERGED") {
            return "Done"
        } elseif ($prState -eq "CLOSED") {
            return "Backlog"  # Closed but not merged
        } elseif ($isDraft) {
            return "In Progress"
        } else {
            return "In Review"
        }
    }
    
    return $currentStatus  # No change needed
}

function Get-ProjectItems {
    param([string]$ProjectNumber)
    
    try {
        $query = @"
{
  organization(login: "jschibelli") {
    projectV2(number: $ProjectNumber) {
      id
      title
      items(first: 100) {
        nodes {
          id
          content {
            ... on Issue {
              number
              title
              state
              type: __typename
            }
            ... on PullRequest {
              number
              title
              state
              isDraft
              type: __typename
            }
          }
          fieldValues(first: 20) {
            nodes {
              ... on ProjectV2ItemFieldSingleSelectValue {
                field {
                  ... on ProjectV2SingleSelectField {
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
        
        $result = gh api graphql -f query=$query
        
        if ($result) {
            $data = $result | ConvertFrom-Json
            $items = $data.data.organization.projectV2.items.nodes
            
            # Transform items to include status and other fields
            $transformedItems = @()
            
            foreach ($item in $items) {
                $transformedItem = @{
                    id = $item.id
                    content = $item.content
                    status = ""
                    'linked pull requests' = @()
                }
                
                # Extract status from field values
                foreach ($fieldValue in $item.fieldValues.nodes) {
                    if ($fieldValue.field.name -eq "Status") {
                        $transformedItem.status = $fieldValue.name
                        break
                    }
                }
                
                $transformedItems += $transformedItem
            }
            
            return $transformedItems
        }
    }
    catch {
        Write-Error "Failed to get project items: $($_.Exception.Message)"
        return $null
    }
    
    return $null
}

function Update-ProjectItemStatus {
    param(
        [string]$ProjectNumber,
        [string]$ItemId,
        [string]$Status
    )
    
    try {
        # Get project and status field details
        $projectQuery = @"
{
  organization(login: "jschibelli") {
    projectV2(number: $ProjectNumber) {
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
        $projectData = $projectResult | ConvertFrom-Json
        $project = $projectData.data.organization.projectV2
        
        # Find status field
        $statusField = $project.fields.nodes | Where-Object { $_.name -eq "Status" }
        if (-not $statusField) {
            Write-Error "Status field not found in project"
            return $false
        }
        
        # Find status option
        $statusOption = $statusField.options | Where-Object { $_.name -eq $Status }
        if (-not $statusOption) {
            Write-Error "Status option '$Status' not found"
            return $false
        }
        
        # Update the item
        $updateMutation = @"
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: "$($project.id)"
    itemId: "$ItemId"
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
            return $true
        }
    }
    catch {
        Write-Error "Failed to update project item status: $($_.Exception.Message)"
        return $false
    }
    
    return $false
}

# Main execution
Show-Banner

if (-not (Test-GitHubAuth)) {
    Write-ColorOutput "❌ GitHub authentication required. Please run 'gh auth login'" "Red"
    exit 1
}

Write-ColorOutput "Project Number: $ProjectNumber" "White"
Write-ColorOutput "Dry Run: $DryRun" "White"
Write-ColorOutput ""

Sync-ProjectBoard -ProjectNumber $ProjectNumber -DryRun $DryRun

Write-ColorOutput ""
Write-ColorOutput "✅ Project board sync completed!" "Green"
