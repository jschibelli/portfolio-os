# PowerShell script for comprehensive project management
# Usage: .\scripts\project-manager.ps1 -Operation <OPERATION> -Issues <ISSUE_LIST> [OPTIONS]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("add", "configure", "status", "labels", "milestone", "all")]
    [string]$Operation,
    
    [Parameter(Mandatory=$false)]
    [string[]]$Issues = @(),
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("blog", "dashboard", "docs", "infra", "custom")]
    [string]$Preset = "custom",
    
    [Parameter(Mandatory=$false)]
    [string]$Priority = "P1",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("XS", "S", "M", "L", "XL")]
    [string]$Size = "M",
    
    [Parameter(Mandatory=$false)]
    [string]$App = "Portfolio Site",
    
    [Parameter(Mandatory=$false)]
    [string]$Area = "Frontend",
    
    [Parameter(Mandatory=$false)]
    [string]$Milestone = "",
    
    [Parameter(Mandatory=$false)]
    [string[]]$Labels = @(),
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Todo", "In progress", "Ready", "Done")]
    [string]$Status = "Ready",
    
    [Parameter(Mandatory=$false)]
    [string]$ProjectId = "PVT_kwHOAEnMVc4BCu-c",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Define issue presets
$presets = @{
    "blog" = @(196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208)
    "dashboard" = @(150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160)
    "docs" = @(180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190)
    "infra" = @(170, 171, 172, 173, 174, 175, 176, 177, 178, 179)
}

# Define field IDs
$fieldIds = @{
    "Priority" = "PVTSSF_lAHOAEnMVc4BCu-czg028oP"
    "Size" = "PVTSSF_lAHOAEnMVc4BCu-czg028oQ"
    "App" = "PVTSSF_lAHOAEnMVc4BCu-czg028oR"
    "Area" = "PVTSSF_lAHOAEnMVc4BCu-czg028oS"
    "Status" = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"
}

# Define option IDs
$optionIds = @{
    "Priority" = @{
        "P0" = "f47ac10b-58cc-4372-a567-0e02b2c3d479"
        "P1" = "f47ac10b-58cc-4372-a567-0e02b2c3d480"
        "P2" = "f47ac10b-58cc-4372-a567-0e02b2c3d481"
        "P3" = "f47ac10b-58cc-4372-a567-0e02b2c3d482"
    }
    "Size" = @{
        "XS" = "f47ac10b-58cc-4372-a567-0e02b2c3d483"
        "S" = "f47ac10b-58cc-4372-a567-0e02b2c3d484"
        "M" = "f47ac10b-58cc-4372-a567-0e02b2c3d485"
        "L" = "f47ac10b-58cc-4372-a567-0e02b2c3d486"
        "XL" = "f47ac10b-58cc-4372-a567-0e02b2c3d487"
    }
    "Status" = @{
        "Todo" = "f47ac10b-58cc-4372-a567-0e02b2c3d488"
        "In progress" = "f47ac10b-58cc-4372-a567-0e02b2c3d489"
        "Ready" = "e18bf179"
        "Done" = "f47ac10b-58cc-4372-a567-0e02b2c3d490"
    }
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Get-IssueList {
    if ($Preset -ne "custom" -and $presets.ContainsKey($Preset)) {
        return $presets[$Preset]
    } elseif ($Issues.Count -gt 0) {
        return $Issues
    } else {
        Write-ColorOutput "Error: No issues specified. Use -Issues parameter or -Preset option." "Red"
        exit 1
    }
}

function Add-IssueToProject {
    param([int]$IssueNumber)
    
    Write-ColorOutput "Adding Issue #$IssueNumber to project..." "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would add issue #$IssueNumber to project" "Cyan"
        return $true
    }
    
    try {
        gh project item-add 20 --owner jschibelli --url "https://github.com/jschibelli/portfolio-os/issues/$IssueNumber"
        Start-Sleep -Seconds 2
        return $true
    } catch {
        Write-ColorOutput "  Failed to add issue #$IssueNumber to project" "Red"
        return $false
    }
}

function Get-ProjectItemId {
    param([int]$IssueNumber)
    
    try {
        $issueId = gh issue view $IssueNumber --json id -q .id
        $projectItems = gh api graphql -f query='query($issueId: ID!) { node(id: $issueId) { ... on Issue { projectItems(first: 10) { nodes { id project { id title } } } } } }' -f issueId="$issueId" --jq '.data.node.projectItems.nodes[] | select(.project.id == "PVT_kwHOAEnMVc4BCu-c") | .id'
        
        if ($projectItems) {
            return $projectItems
        }
        return $null
    } catch {
        return $null
    }
}

function Set-ProjectField {
    param(
        [string]$ProjectItemId,
        [string]$FieldId,
        [string]$OptionId
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would set field $FieldId to option $OptionId" "Cyan"
        return $true
    }
    
    try {
        gh project item-edit --id $ProjectItemId --project-id $ProjectId --field-id $FieldId --single-select-option-id $OptionId
        return $true
    } catch {
        return $false
    }
}

function Set-IssueLabels {
    param([int]$IssueNumber, [string[]]$Labels)
    
    if ($Labels.Count -eq 0) { return $true }
    
    Write-ColorOutput "  Setting labels: $($Labels -join ', ')" "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would set labels: $($Labels -join ', ')" "Cyan"
        return $true
    }
    
    try {
        gh issue edit $IssueNumber --add-label ($Labels -join ',')
        return $true
    } catch {
        Write-ColorOutput "  Failed to set labels for issue #$IssueNumber" "Red"
        return $false
    }
}

function Set-IssueMilestone {
    param([int]$IssueNumber, [string]$Milestone)
    
    if ([string]::IsNullOrEmpty($Milestone)) { return $true }
    
    Write-ColorOutput "  Setting milestone: $Milestone" "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would set milestone: $Milestone" "Cyan"
        return $true
    }
    
    try {
        gh issue edit $IssueNumber --milestone $Milestone
        return $true
    } catch {
        Write-ColorOutput "  Failed to set milestone for issue #$IssueNumber" "Red"
        return $false
    }
}

# Main execution
Write-ColorOutput "=== Portfolio OS Project Manager ===" "Blue"
Write-ColorOutput "Operation: $Operation" "Green"
Write-ColorOutput "Preset: $Preset" "Green"

$issueList = Get-IssueList
Write-ColorOutput "Issues to process: $($issueList -join ', ')" "Green"

if ($DryRun) {
    Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
}

Write-ColorOutput ""

$successCount = 0
$totalCount = $issueList.Count

foreach ($issueNumber in $issueList) {
    Write-ColorOutput "Processing Issue #$issueNumber..." "White"
    
    $success = $true
    
    # Add to project if needed
    if ($Operation -eq "add" -or $Operation -eq "all") {
        $success = Add-IssueToProject $issueNumber -and $success
    }
    
    # Configure project fields
    if (($Operation -eq "configure" -or $Operation -eq "all") -and $success) {
        $projectItemId = Get-ProjectItemId $issueNumber
        
        if ($projectItemId) {
            Write-ColorOutput "  Configuring project fields..." "Yellow"
            
            # Set Priority
            if ($optionIds.Priority.ContainsKey($Priority)) {
                $success = Set-ProjectField $projectItemId $fieldIds.Priority $optionIds.Priority[$Priority] -and $success
            }
            
            # Set Size
            if ($optionIds.Size.ContainsKey($Size)) {
                $success = Set-ProjectField $projectItemId $fieldIds.Size $optionIds.Size[$Size] -and $success
            }
            
            # Set Status
            if ($optionIds.Status.ContainsKey($Status)) {
                $success = Set-ProjectField $projectItemId $fieldIds.Status $optionIds.Status[$Status] -and $success
            }
        } else {
            Write-ColorOutput "  No project item found for issue #$issueNumber" "Red"
            $success = $false
        }
    }
    
    # Set labels
    if (($Operation -eq "labels" -or $Operation -eq "all") -and $success) {
        $success = Set-IssueLabels $issueNumber $Labels -and $success
    }
    
    # Set milestone
    if (($Operation -eq "milestone" -or $Operation -eq "all") -and $success) {
        $success = Set-IssueMilestone $issueNumber $Milestone -and $success
    }
    
    if ($success) {
        Write-ColorOutput "  ✓ Issue #$issueNumber processed successfully" "Green"
        $successCount++
    } else {
        Write-ColorOutput "  ✗ Failed to process issue #$issueNumber" "Red"
    }
    
    Write-ColorOutput ""
}

Write-ColorOutput "=== Summary ===" "Blue"
Write-ColorOutput "Total issues: $totalCount" "White"
Write-ColorOutput "Successful: $successCount" "Green"
Write-ColorOutput "Failed: $($totalCount - $successCount)" "Red"

if ($successCount -eq $totalCount) {
    Write-ColorOutput "All operations completed successfully!" "Green"
    exit 0
} else {
    Write-ColorOutput "Some operations failed. Please check the output above." "Red"
    exit 1
}
