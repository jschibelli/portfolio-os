# Set Estimate and Iteration fields for GitHub issues
# Usage: .\scripts\set-estimate-iteration.ps1 -IssueNumber 247 -Estimate 3 -Iteration "Sprint 1"

param(
    [Parameter(Mandatory=$true)]
    [int]$IssueNumber,
    
    [Parameter(Mandatory=$false)]
    [int]$Estimate = 0,
    
    [Parameter(Mandatory=$false)]
    [string]$Iteration = ""
)

# Project configuration
$projectId = "PVT_kwHOAEnMVc4BCu-c"
$estimateFieldId = "PVTF_lAHOAEnMVc4BCu-czg028qY"
$iterationFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028qY"

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

function Set-Estimate {
    param(
        [string]$ProjectItemId,
        [int]$Estimate
    )
    
    try {
        gh project item-edit --id $ProjectItemId --field-id $estimateFieldId --project-id $projectId --number $Estimate
        Write-Host "  ✅ Estimate set to $Estimate days" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "  ❌ Estimate failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Set-Iteration {
    param(
        [string]$ProjectItemId,
        [string]$Iteration
    )
    
    try {
        # Note: You'll need to get the actual iteration ID from the project
        # This is a placeholder - you'll need to query the project for available iterations
        Write-Host "  ⚠️  Iteration setting requires iteration ID lookup" -ForegroundColor Yellow
        Write-Host "  💡 Use: gh project view 20 --json fields to get iteration options" -ForegroundColor Cyan
        return $false
    }
    catch {
        Write-Host "  ❌ Iteration failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Main execution
Write-Host "🔧 Setting estimate and iteration for issue #$IssueNumber..." -ForegroundColor Cyan

$projectItemId = Get-ProjectItemId -IssueNumber $IssueNumber
if (-not $projectItemId) {
    exit 1
}

$success = $true

# Set Estimate
if ($Estimate -gt 0) {
    $result = Set-Estimate -ProjectItemId $projectItemId -Estimate $Estimate
    $success = $success -and $result
}

# Set Iteration
if (-not [string]::IsNullOrEmpty($Iteration)) {
    $result = Set-Iteration -ProjectItemId $projectItemId -Iteration $Iteration
    $success = $success -and $result
}

if ($success) {
    Write-Host "✅ Configuration completed for issue #$IssueNumber" -ForegroundColor Green
} else {
    Write-Host "❌ Some fields failed to configure" -ForegroundColor Red
    exit 1
}
