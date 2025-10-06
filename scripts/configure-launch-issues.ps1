# Configure Launch Tuesday QA Issues Project Fields
# This script configures all the launch issues with proper project field values

param(
    [string]$ProjectId = "PVT_kwHOAEnMVc4BCu-c"
)

# Field IDs
$PriorityFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028qQ"
$SizeFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028qU"
$AppFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg156-s"
$AreaFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg156_Y"

# Option IDs
$P0OptionId = "79628723"
$P1OptionId = "0a877460"
$P2OptionId = "da944a9c"

$SOptionId = "b277fb01"
$MOptionId = "86db8eb3"
$LOptionId = "853c8207"

$PortfolioSiteOptionId = "de5faa4a"

$FrontendOptionId = "5618641d"
$InfraOptionId = "5a298e61"
$ContentOptionId = "663d7084"

# Issue configurations
$issues = @(
    @{ Number = 247; Priority = $P0OptionId; Size = $MOptionId; App = $PortfolioSiteOptionId; Area = $FrontendOptionId },
    @{ Number = 248; Priority = $P0OptionId; Size = $SOptionId; App = $PortfolioSiteOptionId; Area = $InfraOptionId },
    @{ Number = 249; Priority = $P0OptionId; Size = $MOptionId; App = $PortfolioSiteOptionId; Area = $FrontendOptionId },
    @{ Number = 250; Priority = $P1OptionId; Size = $MOptionId; App = $PortfolioSiteOptionId; Area = $FrontendOptionId },
    @{ Number = 251; Priority = $P1OptionId; Size = $MOptionId; App = $PortfolioSiteOptionId; Area = $FrontendOptionId },
    @{ Number = 252; Priority = $P2OptionId; Size = $SOptionId; App = $PortfolioSiteOptionId; Area = $ContentOptionId },
    @{ Number = 253; Priority = $P1OptionId; Size = $MOptionId; App = $PortfolioSiteOptionId; Area = $FrontendOptionId },
    @{ Number = 254; Priority = $P1OptionId; Size = $LOptionId; App = $PortfolioSiteOptionId; Area = $FrontendOptionId }
)

foreach ($issue in $issues) {
    Write-Host "Configuring Issue #$($issue.Number)..."
    
    # Get issue ID
    $issueId = (gh issue view $issue.Number --json id -q .id)
    if (-not $issueId) {
        Write-Host "Failed to get issue ID for #$($issue.Number)"
        continue
    }
    
    # Get project item ID
    $projectItemQuery = @"
query(`$issueId: ID!) { 
  node(id: `$issueId) { 
    ... on Issue { 
      projectItems(first: 10) { 
        nodes { 
          id 
          project { 
            id 
            title 
          } 
        } 
      } 
    } 
  } 
}
"@
    
    $projectItemResult = gh api graphql -f query=$projectItemQuery -f issueId=$issueId
    $projectItemId = ($projectItemResult | ConvertFrom-Json).data.node.projectItems.nodes[0].id
    
    if (-not $projectItemId) {
        Write-Host "Failed to get project item ID for issue #$($issue.Number)"
        continue
    }
    
    # Configure Priority
    $priorityMutation = @"
mutation(`$projectId: ID!, `$itemId: ID!, `$fieldId: ID!, `$value: String!) { 
  updateProjectV2ItemFieldValue(input: {projectId: `$projectId, itemId: `$itemId, fieldId: `$fieldId, value: {singleSelectOptionId: `$value}}) { 
    projectV2Item { 
      id 
    } 
  } 
}
"@
    
    gh api graphql -f query=$priorityMutation -f projectId=$ProjectId -f itemId=$projectItemId -f fieldId=$PriorityFieldId -f value=$issue.Priority | Out-Null
    Write-Host "  ✅ Priority set"
    
    # Configure Size
    gh api graphql -f query=$priorityMutation -f projectId=$ProjectId -f itemId=$projectItemId -f fieldId=$SizeFieldId -f value=$issue.Size | Out-Null
    Write-Host "  ✅ Size set"
    
    # Configure App
    gh api graphql -f query=$priorityMutation -f projectId=$ProjectId -f itemId=$projectItemId -f fieldId=$AppFieldId -f value=$issue.App | Out-Null
    Write-Host "  ✅ App set"
    
    # Configure Area
    gh api graphql -f query=$priorityMutation -f projectId=$ProjectId -f itemId=$projectItemId -f fieldId=$AreaFieldId -f value=$issue.Area | Out-Null
    Write-Host "  ✅ Area set"
    
    Write-Host "  ✅ Issue #$($issue.Number) configured successfully"
    Write-Host ""
}

Write-Host "All issues configured successfully!"
