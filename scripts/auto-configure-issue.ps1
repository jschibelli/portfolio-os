# GitHub Issue Auto-Configuration Script
# Automatically sets project fields, labels, and milestone for new issues

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
    [string]$Labels = "ready-to-implement"
)

# Project Configuration
$PROJECT_ID = "PVT_kwHOAEnMVc4BCu-c"
$PROJECT_NAME = "Portfolio Site — johnschibelli.dev"

# Field IDs (from previous analysis)
$FIELD_IDS = @{
    Status = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"
    Priority = "PVTSSF_lAHOAEnMVc4BCu-czg028qQ"
    Size = "PVTSSF_lAHOAEnMVc4BCu-czg028qU"
    App = "PVTSSF_lAHOAEnMVc4BCu-czg156-s"
    Area = "PVTSSF_lAHOAEnMVc4BCu-czg156_Y"
}

# Option IDs
$OPTION_IDS = @{
    Status = @{
        "Ready" = "e18bf179"
        "In progress" = "47fc9ee4"
        "In review" = "aba860b9"
        "Done" = "98236657"
    }
    Priority = @{
        "P0" = "79628723"
        "P1" = "0a877460"
        "P2" = "da944a9c"
    }
    Size = @{
        "XS" = "911790be"
        "S" = "b277fb01"
        "M" = "86db8eb3"
        "L" = "853c8207"
        "XL" = "2d0801e2"
    }
    App = @{
        "Docs" = "e504fedd"
        "Portfolio Site" = "de5faa4a"
        "Dashboard" = "d134f386"
        "Chatbot" = "c95306ff"
    }
    Area = @{
        "Frontend" = "5618641d"
        "Content" = "663d7084"
        "Infra" = "5a298e61"
        "DX/Tooling" = "a67a98e5"
    }
}

function Get-IssueNodeId {
    param([string]$IssueNumber)
    
    $query = "query(`$number: Int!) { repository(owner: `"jschibelli`", name: `"portfolio-os`") { issue(number: `$number) { id } } }"
    $result = gh api graphql -f query=$query -f number=[int]$IssueNumber
    $issueData = $result | ConvertFrom-Json
    return $issueData.data.repository.issue.id
}

function Get-ProjectItemId {
    param([string]$IssueId)
    
    $query = "query(`$issueId: ID!) { node(id: `$issueId) { ... on Issue { projectItems(first: 10) { nodes { id project { id title } } } } } }"
    $result = gh api graphql -f query=$query -f issueId=$IssueId
    $issueData = $result | ConvertFrom-Json
    $projectItem = $issueData.data.node.projectItems.nodes | Where-Object { $_.project.id -eq $PROJECT_ID }
    return $projectItem.id
}

function Update-ProjectField {
    param(
        [string]$ItemId,
        [string]$FieldId,
        [string]$Value,
        [string]$FieldType = "singleSelect"
    )
    
    if ($FieldType -eq "singleSelect") {
        $query = "mutation(`$projectId: ID!, `$itemId: ID!, `$fieldId: ID!, `$value: String!) { updateProjectV2ItemFieldValue(input: {projectId: `$projectId, itemId: `$itemId, fieldId: `$fieldId, value: {singleSelectOptionId: `$value}}) { projectV2Item { id } } }"
        gh api graphql -f query=$query -f projectId=$PROJECT_ID -f itemId=$ItemId -f fieldId=$FieldId -f value=$Value | Out-Null
    } elseif ($FieldType -eq "text") {
        $query = "mutation(`$projectId: ID!, `$itemId: ID!, `$fieldId: ID!, `$value: String!) { updateProjectV2ItemFieldValue(input: {projectId: `$projectId, itemId: `$itemId, fieldId: `$fieldId, value: {text: `$value}}) { projectV2Item { id } } }"
        gh api graphql -f query=$query -f projectId=$PROJECT_ID -f itemId=$ItemId -f fieldId=$FieldId -f value=$Value | Out-Null
    } elseif ($FieldType -eq "number") {
        $query = "mutation(`$projectId: ID!, `$itemId: ID!, `$fieldId: ID!, `$value: Float!) { updateProjectV2ItemFieldValue(input: {projectId: `$projectId, itemId: `$itemId, fieldId: `$fieldId, value: {number: `$value}}) { projectV2Item { id } } }"
        gh api graphql -f query=$query -f projectId=$PROJECT_ID -f itemId=$ItemId -f fieldId=$FieldId -f value=$Value | Out-Null
    }
}

function Set-IssueMilestone {
    param([string]$IssueNumber, [string]$MilestoneTitle)
    
    if ($MilestoneTitle) {
        gh issue edit $IssueNumber --milestone $MilestoneTitle
    }
}

function Set-IssueLabels {
    param([string]$IssueNumber, [string]$Labels)
    
    if ($Labels) {
        $labelArray = $Labels -split ","
        foreach ($label in $labelArray) {
            gh issue edit $IssueNumber --add-label $label.Trim()
        }
    }
}

# Main execution
try {
    Write-Host "🔧 Auto-configuring issue #$IssueNumber..." -ForegroundColor Cyan
    
    # Get issue node ID
    Write-Host "📋 Getting issue details..." -ForegroundColor Yellow
    $issueId = Get-IssueNodeId -IssueNumber $IssueNumber
    
    if (-not $issueId) {
        throw "Issue #$IssueNumber not found"
    }
    
    # Get project item ID
    Write-Host "📊 Getting project item..." -ForegroundColor Yellow
    $projectItemId = Get-ProjectItemId -IssueId $issueId
    
    if (-not $projectItemId) {
        throw "Issue not found in project"
    }
    
    # Update project fields
    Write-Host "⚙️ Updating project fields..." -ForegroundColor Yellow
    
    # Set Status to Ready
    Update-ProjectField -ItemId $projectItemId -FieldId $FIELD_IDS.Status -Value $OPTION_IDS.Status.Ready
    Write-Host "  ✅ Status: Ready" -ForegroundColor Green
    
    # Set Priority
    Update-ProjectField -ItemId $projectItemId -FieldId $FIELD_IDS.Priority -Value $OPTION_IDS.Priority.$Priority
    Write-Host "  ✅ Priority: $Priority" -ForegroundColor Green
    
    # Set Size
    Update-ProjectField -ItemId $projectItemId -FieldId $FIELD_IDS.Size -Value $OPTION_IDS.Size.$Size
    Write-Host "  ✅ Size: $Size" -ForegroundColor Green
    
    # Set App
    Update-ProjectField -ItemId $projectItemId -FieldId $FIELD_IDS.App -Value $OPTION_IDS.App.$App
    Write-Host "  ✅ App: $App" -ForegroundColor Green
    
    # Set Area
    Update-ProjectField -ItemId $projectItemId -FieldId $FIELD_IDS.Area -Value $OPTION_IDS.Area.$Area
    Write-Host "  ✅ Area: $Area" -ForegroundColor Green
    
    # Set milestone if provided
    if ($Milestone) {
        Write-Host "🏷️ Setting milestone..." -ForegroundColor Yellow
        Set-IssueMilestone -IssueNumber $IssueNumber -MilestoneTitle $Milestone
        Write-Host "  ✅ Milestone: $Milestone" -ForegroundColor Green
    }
    
    # Set labels if provided
    if ($Labels) {
        Write-Host "🏷️ Setting labels..." -ForegroundColor Yellow
        Set-IssueLabels -IssueNumber $IssueNumber -Labels $Labels
        Write-Host "  ✅ Labels: $Labels" -ForegroundColor Green
    }
    
    Write-Host "🎉 Issue #$IssueNumber successfully configured!" -ForegroundColor Green
    Write-Host "📊 Project: $PROJECT_NAME" -ForegroundColor Cyan
    Write-Host "🔗 View: https://github.com/jschibelli/portfolio-os/issues/$IssueNumber" -ForegroundColor Blue
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
