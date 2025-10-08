# Configure Estimate and Sprint fields for existing issues
# Usage: .\scripts\configure-estimate-sprint.ps1

# Project configuration
$projectId = "PVT_kwHOAEnMVc4BCu-c"
$estimateFieldId = "PVTF_lAHOAEnMVc4BCu-czg028qY"
$sprintFieldId = "PVTIF_lAHOAEnMVc4BCu-czg028qc"

# Issue configurations with estimates
$issueConfigs = @(
    @{ Number = 247; Title = "FIX: Contact route and Resend integration [BLOCKER]"; Estimate = 3; Sprint = "Current Sprint" }
    @{ Number = 248; Title = "FIX: Canonical host redirect (www vs apex) [BLOCKER]"; Estimate = 2; Sprint = "Current Sprint" }
    @{ Number = 249; Title = "FIX: Projects page SSR + crawlability [BLOCKER]"; Estimate = 3; Sprint = "Current Sprint" }
    @{ Number = 250; Title = "SEO: robots.ts + sitemap.ts + per-page metadata"; Estimate = 2; Sprint = "Current Sprint" }
    @{ Number = 251; Title = "Social: OG/Twitter defaults + images"; Estimate = 2; Sprint = "Current Sprint" }
    @{ Number = 252; Title = "Content: Remove inflated metrics sitewide"; Estimate = 1; Sprint = "Current Sprint" }
    @{ Number = 253; Title = "A11y pass: navigation & focus states"; Estimate = 3; Sprint = "Current Sprint" }
    @{ Number = 254; Title = "Performance: images, fonts, headers"; Estimate = 4; Sprint = "Current Sprint" }
)

function Get-ProjectItemId {
    param([string]$IssueNumber)
    
    try {
        $issueId = (gh issue view $IssueNumber --json id -q .id)
        if (-not $issueId) {
            Write-Host "ERROR: Issue $IssueNumber not found" -ForegroundColor Red
            return $null
        }
        
        $projectItemId = (gh api graphql -f query='query($issueId: ID!) { node(id: $issueId) { ... on Issue { projectItems(first: 10) { nodes { id project { id title } } } } } }' -f issueId=$issueId | ConvertFrom-Json).data.node.projectItems.nodes[0].id
        
        if (-not $projectItemId) {
            Write-Host "ERROR: Issue $IssueNumber not found in project" -ForegroundColor Red
            return $null
        }
        
        return $projectItemId
    }
    catch {
        Write-Host "ERROR: Error getting project item ID: $($_.Exception.Message)" -ForegroundColor Red
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
        Write-Host "  SUCCESS: Estimate set to $Estimate days" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "  ERROR: Estimate failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Set-Sprint {
    param(
        [string]$ProjectItemId,
        [string]$SprintName
    )
    
    try {
        # For now, we'll skip the Sprint field since we need to determine available iterations
        Write-Host "  WARNING: Sprint field requires iteration ID lookup - skipping for now" -ForegroundColor Yellow
        Write-Host "  INFO: To set Sprint: Check available iterations with 'gh project view 20' and use --iteration-id" -ForegroundColor Cyan
        return $true
    }
    catch {
        Write-Host "  ERROR: Sprint failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Configure-Issue {
    param(
        [int]$IssueNumber,
        [string]$Title,
        [int]$Estimate,
        [string]$Sprint
    )
    
    Write-Host "Configuring issue $($IssueNumber): $($Title)" -ForegroundColor Cyan
    
    $projectItemId = Get-ProjectItemId -IssueNumber $IssueNumber
    if (-not $projectItemId) {
        return $false
    }
    
    $success = $true
    
    # Set Estimate
    $result = Set-Estimate -ProjectItemId $projectItemId -Estimate $Estimate
    $success = $success -and $result
    
    # Set Sprint (skip for now)
    $result = Set-Sprint -ProjectItemId $projectItemId -Sprint $Sprint
    $success = $success -and $result
    
    return $success
}

# Main execution
Write-Host "Configuring Estimate and Sprint fields for launch issues..." -ForegroundColor Green

$totalSuccess = $true

foreach ($config in $issueConfigs) {
    $result = Configure-Issue -IssueNumber $config.Number -Title $config.Title -Estimate $config.Estimate -Sprint $config.Sprint
    $totalSuccess = $totalSuccess -and $result
    Write-Host ""
}

if ($totalSuccess) {
    Write-Host "SUCCESS: All issues configured successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Check available iterations: gh project view 20" -ForegroundColor Cyan
    Write-Host "2. Set Sprint field manually or update this script with iteration IDs" -ForegroundColor Cyan
} else {
    Write-Host "ERROR: Some issues failed to configure" -ForegroundColor Red
    exit 1
}