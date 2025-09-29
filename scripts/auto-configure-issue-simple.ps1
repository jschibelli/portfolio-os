# Simplified GitHub Issue Auto-Configuration Script
# Usage: .\auto-configure-issue-simple.ps1 -IssueNumber 190 -Priority "P1" -Size "M" -App "Portfolio Site" -Area "Frontend" -Milestone "Blog Functionality & Connection Issues"

param(
    [Parameter(Mandatory=$true)]
    [string]$IssueNumber,
    
    [Parameter(Mandatory=$false)]
    [string]$Priority = "P1",
    
    [Parameter(Mandatory=$false)]
    [string]$Size = "M",
    
    [Parameter(Mandatory=$false)]
    [string]$App = "Portfolio Site",
    
    [Parameter(Mandatory=$false)]
    [string]$Area = "Frontend",
    
    [Parameter(Mandatory=$false)]
    [string]$Milestone = "",
    
    [Parameter(Mandatory=$false)]
    [string]$Labels = "ready-to-implement,priority: high,area: functionality"
)

# Quick configuration for common scenarios
$CONFIGS = @{
    "blog" = @{
        Priority = "P1"
        Size = "M"
        App = "Portfolio Site"
        Area = "Frontend"
        Labels = "ready-to-implement,priority: high,area: functionality"
    }
    "dashboard" = @{
        Priority = "P1"
        Size = "M"
        App = "Dashboard"
        Area = "Frontend"
        Labels = "ready-to-implement,priority: high,area: functionality"
    }
    "docs" = @{
        Priority = "P2"
        Size = "S"
        App = "Docs"
        Area = "Content"
        Labels = "ready-to-implement,priority: medium,area: content"
    }
    "infra" = @{
        Priority = "P1"
        Size = "L"
        App = "Portfolio Site"
        Area = "Infra"
        Labels = "ready-to-implement,priority: high,area: infra"
    }
}

# If a config preset is provided, use it
if ($args[0] -and $CONFIGS.ContainsKey($args[0])) {
    $config = $CONFIGS[$args[0]]
    $Priority = $config.Priority
    $Size = $config.Size
    $App = $config.App
    $Area = $config.Area
    $Labels = $config.Labels
    Write-Host "Using preset: $($args[0])" -ForegroundColor Cyan
}

# Project field mappings
$FIELD_MAPPINGS = @{
    "Status" = @{
        "Ready" = "e18bf179"
        "In progress" = "47fc9ee4"
        "In review" = "aba860b9"
        "Done" = "98236657"
    }
    "Priority" = @{
        "P0" = "79628723"
        "P1" = "0a877460"
        "P2" = "da944a9c"
    }
    "Size" = @{
        "XS" = "911790be"
        "S" = "b277fb01"
        "M" = "86db8eb3"
        "L" = "853c8207"
        "XL" = "2d0801e2"
    }
    "App" = @{
        "Docs" = "e504fedd"
        "Portfolio Site" = "de5faa4a"
        "Dashboard" = "d134f386"
        "Chatbot" = "c95306ff"
    }
    "Area" = @{
        "Frontend" = "5618641d"
        "Content" = "663d7084"
        "Infra" = "5a298e61"
        "DX/Tooling" = "a67a98e5"
    }
}

# Field IDs
$FIELD_IDS = @{
    Status = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"
    Priority = "PVTSSF_lAHOAEnMVc4BCu-czg028qQ"
    Size = "PVTSSF_lAHOAEnMVc4BCu-czg028qU"
    App = "PVTSSF_lAHOAEnMVc4BCu-czg156-s"
    Area = "PVTSSF_lAHOAEnMVc4BCu-czg156_Y"
}

$PROJECT_ID = "PVT_kwHOAEnMVc4BCu-c"

# Get issue and project item IDs
$issueId = (gh issue view $IssueNumber --json id).id
$projectItemId = (gh api graphql -f query='query($issueId: ID!) { node(id: $issueId) { ... on Issue { projectItems(first: 10) { nodes { id project { id title } } } } } }' -f issueId=$issueId | ConvertFrom-Json).data.node.projectItems.nodes[0].id

# Update all fields
Write-Host "Auto-configuring issue #$IssueNumber..." -ForegroundColor Cyan

# Status: Ready
gh api graphql -f query='mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: String!) { updateProjectV2ItemFieldValue(input: {projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: {singleSelectOptionId: $value}}) { projectV2Item { id } } }' -f projectId=$PROJECT_ID -f itemId=$projectItemId -f fieldId=$FIELD_IDS.Status -f value=$FIELD_MAPPINGS.Status.Ready | Out-Null

# Priority
gh api graphql -f query='mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: String!) { updateProjectV2ItemFieldValue(input: {projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: {singleSelectOptionId: $value}}) { projectV2Item { id } } }' -f projectId=$PROJECT_ID -f itemId=$projectItemId -f fieldId=$FIELD_IDS.Priority -f value=$FIELD_MAPPINGS.Priority.$Priority | Out-Null

# Size
gh api graphql -f query='mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: String!) { updateProjectV2ItemFieldValue(input: {projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: {singleSelectOptionId: $value}}) { projectV2Item { id } } }' -f projectId=$PROJECT_ID -f itemId=$projectItemId -f fieldId=$FIELD_IDS.Size -f value=$FIELD_MAPPINGS.Size.$Size | Out-Null

# App
gh api graphql -f query='mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: String!) { updateProjectV2ItemFieldValue(input: {projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: {singleSelectOptionId: $value}}) { projectV2Item { id } } }' -f projectId=$PROJECT_ID -f itemId=$projectItemId -f fieldId=$FIELD_IDS.App -f value=$FIELD_MAPPINGS.App.$App | Out-Null

# Area
gh api graphql -f query='mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: String!) { updateProjectV2ItemFieldValue(input: {projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: {singleSelectOptionId: $value}}) { projectV2Item { id } } }' -f projectId=$PROJECT_ID -f itemId=$projectItemId -f fieldId=$FIELD_IDS.Area -f value=$FIELD_MAPPINGS.Area.$Area | Out-Null

# Set milestone if provided
if ($Milestone) {
    gh issue edit $IssueNumber --milestone $Milestone
}

# Set labels if provided
if ($Labels) {
    $labelArray = $Labels -split ","
    foreach ($label in $labelArray) {
        gh issue edit $IssueNumber --add-label $label.Trim()
    }
}

Write-Host "Issue #$IssueNumber configured successfully!" -ForegroundColor Green
Write-Host "Status: Ready | Priority: $Priority | Size: $Size | App: $App | Area: $Area" -ForegroundColor Cyan
