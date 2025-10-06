# Configure Remaining Launch Issues Project Fields
# This script configures the remaining launch issues with proper project field values

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

# Issue configurations (remaining issues)
$issues = @(
    @{ Number = 249; Priority = $P0OptionId; Size = $MOptionId; App = $PortfolioSiteOptionId; Area = $FrontendOptionId },
    @{ Number = 250; Priority = $P1OptionId; Size = $MOptionId; App = $PortfolioSiteOptionId; Area = $FrontendOptionId },
    @{ Number = 251; Priority = $P1OptionId; Size = $MOptionId; App = $PortfolioSiteOptionId; Area = $FrontendOptionId },
    @{ Number = 252; Priority = $P2OptionId; Size = $SOptionId; App = $PortfolioSiteOptionId; Area = $ContentOptionId },
    @{ Number = 253; Priority = $P1OptionId; Size = $MOptionId; App = $PortfolioSiteOptionId; Area = $FrontendOptionId }
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
    $result = gh project item-edit --id $projectItemId --field-id $PriorityFieldId --project-id $ProjectId --single-select-option-id $issue.Priority
    if ($result -match "Edited item") {
        Write-Host "  ✅ Priority set"
    } else {
        Write-Host "  ❌ Priority failed: $result"
    }
    
    # Configure Size
    $result = gh project item-edit --id $projectItemId --field-id $SizeFieldId --project-id $ProjectId --single-select-option-id $issue.Size
    if ($result -match "Edited item") {
        Write-Host "  ✅ Size set"
    } else {
        Write-Host "  ❌ Size failed: $result"
    }
    
    # Configure App
    $result = gh project item-edit --id $projectItemId --field-id $AppFieldId --project-id $ProjectId --single-select-option-id $issue.App
    if ($result -match "Edited item") {
        Write-Host "  ✅ App set"
    } else {
        Write-Host "  ❌ App failed: $result"
    }
    
    # Configure Area
    $result = gh project item-edit --id $projectItemId --field-id $AreaFieldId --project-id $ProjectId --single-select-option-id $issue.Area
    if ($result -match "Edited item") {
        Write-Host "  ✅ Area set"
    } else {
        Write-Host "  ❌ Area failed: $result"
    }
    
    Write-Host "  ✅ Issue #$($issue.Number) configured successfully"
    Write-Host ""
}

Write-Host "All remaining issues configured successfully!"
