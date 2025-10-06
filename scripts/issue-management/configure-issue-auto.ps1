# GitHub Issue Auto-Configuration Script (Updated)
# Uses gh project item-edit instead of GraphQL mutations for reliability

param(
    [Parameter(Mandatory=$true)]
    [int]$IssueNumber,
    
    [Parameter(Mandatory=$false)]
    [string]$Priority = "P1",
    
    [Parameter(Mandatory=$false)]
    [string]$Size = "M",
    
    [Parameter(Mandatory=$false)]
    [string]$App = "Portfolio Site",
    
    [Parameter(Mandatory=$false)]
    [string]$Area = "Frontend",
    
    [Parameter(Mandatory=$false)]
    [int]$Estimate = 3,
    
    [Parameter(Mandatory=$false)]
    [string]$Milestone = "",
    
    [Parameter(Mandatory=$false)]
    [string]$Labels = ""
)

# Project configuration
$projectId = "PVT_kwHOAEnMVc4BCu-c"

# Field IDs (current as of 2025-01-07)
$statusFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"
$priorityFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028qQ"
$sizeFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028qU"
$appFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg156-s"
$areaFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg156_Y"
$estimateFieldId = "PVTF_lAHOAEnMVc4BCu-czg028qY"

# Option mappings
$priorityOptions = @{
    "P0" = "79628723"
    "P1" = "0a877460"
    "P2" = "da944a9c"
}

$sizeOptions = @{
    "XS" = "911790be"
    "S" = "b277fb01"
    "M" = "86db8eb3"
    "L" = "853c8207"
    "XL" = "2d0801e2"
}

$appOptions = @{
    "Docs" = "e504fedd"
    "Portfolio Site" = "de5faa4a"
    "Dashboard" = "d134f386"
    "Chatbot" = "c95306ff"
}

$areaOptions = @{
    "Frontend" = "5618641d"
    "Content" = "663d7084"
    "Infra" = "5a298e61"
    "DX/Tooling" = "a67a98e5"
}

function Get-ProjectItemId {
    param([string]$IssueNumber)
    
    try {
        $issueId = (gh issue view $IssueNumber --json id -q .id)
        if (-not $issueId) {
            Write-Host "❌ Issue #$IssueNumber not found" -ForegroundColor Red
            return $null
        }
        
        $projectItemId = (gh api graphql -f query='query($issueId: ID!) { node(id: $issueId) { ... on Issue { projectItems(first: 10) { nodes { id project { id title } } } } } }' -f issueId=$issueId | ConvertFrom-Json).data.node.projectItems.nodes[0].id
        
        if (-not $projectItemId) {
            Write-Host "❌ Issue #$IssueNumber not found in project" -ForegroundColor Red
            return $null
        }
        
        return $projectItemId
    }
    catch {
        Write-Host "❌ Error getting project item ID: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Set-ProjectField {
    param(
        [string]$ProjectItemId,
        [string]$FieldId,
        [string]$FieldName,
        [string]$Value,
        [string]$ValueType = "single-select"
    )
    
    try {
        if ($ValueType -eq "single-select") {
            gh project item-edit --id $ProjectItemId --field-id $FieldId --project-id $projectId --single-select-option-id $Value
        }
        elseif ($ValueType -eq "number") {
            gh project item-edit --id $ProjectItemId --field-id $FieldId --project-id $projectId --number $Value
        }
        
        Write-Host "  ✅ $FieldName set to $Value" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "  ❌ $FieldName failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Set-IssueConfiguration {
    param(
        [string]$IssueNumber,
        [string]$Priority,
        [string]$Size,
        [string]$App,
        [string]$Area,
        [int]$Estimate,
        [string]$Milestone,
        [string]$Labels
    )
    
    Write-Host "🔧 Configuring issue #$IssueNumber..." -ForegroundColor Cyan
    
    # Get project item ID
    $projectItemId = Get-ProjectItemId -IssueNumber $IssueNumber
    if (-not $projectItemId) {
        return $false
    }
    
    $success = $true
    
    # Set Priority
    if ($priorityOptions.ContainsKey($Priority)) {
        $result = Set-ProjectField -ProjectItemId $projectItemId -FieldId $priorityFieldId -FieldName "Priority" -Value $priorityOptions[$Priority]
        $success = $success -and $result
    }
    
    # Set Size
    if ($sizeOptions.ContainsKey($Size)) {
        $result = Set-ProjectField -ProjectItemId $projectItemId -FieldId $sizeFieldId -FieldName "Size" -Value $sizeOptions[$Size]
        $success = $success -and $result
    }
    
    # Set App
    if ($appOptions.ContainsKey($App)) {
        $result = Set-ProjectField -ProjectItemId $projectItemId -FieldId $appFieldId -FieldName "App" -Value $appOptions[$App]
        $success = $success -and $result
    }
    
    # Set Area
    if ($areaOptions.ContainsKey($Area)) {
        $result = Set-ProjectField -ProjectItemId $projectItemId -FieldId $areaFieldId -FieldName "Area" -Value $areaOptions[$Area]
        $success = $success -and $result
    }
    
    # Set Estimate
    if ($Estimate -gt 0) {
        $result = Set-ProjectField -ProjectItemId $projectItemId -FieldId $estimateFieldId -FieldName "Estimate" -Value $Estimate -ValueType "number"
        $success = $success -and $result
    }
    
    # Set Milestone
    if (-not [string]::IsNullOrEmpty($Milestone)) {
        try {
            gh issue edit $IssueNumber --milestone $Milestone
            Write-Host "  ✅ Milestone set to $Milestone" -ForegroundColor Green
        }
        catch {
            Write-Host "  ❌ Milestone failed: $($_.Exception.Message)" -ForegroundColor Red
            $success = $false
        }
    }
    
    # Set Labels
    if (-not [string]::IsNullOrEmpty($Labels)) {
        try {
            gh issue edit $IssueNumber --add-label $Labels
            Write-Host "  ✅ Labels added: $Labels" -ForegroundColor Green
        }
        catch {
            Write-Host "  ❌ Labels failed: $($_.Exception.Message)" -ForegroundColor Red
            $success = $false
        }
    }
    
    return $success
}

# Main execution
Write-Host "🚀 Starting GitHub Issue Auto-Configuration" -ForegroundColor Green
Write-Host "Issue: #$IssueNumber" -ForegroundColor Yellow
Write-Host "Priority: $Priority, Size: $Size, App: $App, Area: $Area" -ForegroundColor Yellow

$result = Set-IssueConfiguration -IssueNumber $IssueNumber -Priority $Priority -Size $Size -App $App -Area $Area -Estimate $Estimate -Milestone $Milestone -Labels $Labels

if ($result) {
    Write-Host "✅ Issue #$IssueNumber configured successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Some fields failed to configure for issue #$IssueNumber" -ForegroundColor Red
    exit 1
}
