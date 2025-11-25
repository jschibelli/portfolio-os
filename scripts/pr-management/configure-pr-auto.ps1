# Auto-Configure PR Script
# Automatically configures pull request fields and metadata for the Portfolio OS project
# Usage: .\scripts\pr-management\configure-pr-auto.ps1 -PRNumber <NUMBER> [-Status <STATUS>] [-Priority <PRIORITY>] [-Size <SIZE>] [-Estimate <ESTIMATE>] [-App <APP>] [-Area <AREA>] [-Assign <ASSIGNEE>] [-DryRun]

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Todo", "In progress", "Ready", "Done")]
    [string]$Status = "In progress",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("P0", "P1", "P2", "P3")]
    [string]$Priority = "P1",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("XS", "S", "M", "L", "XL")]
    [string]$Size = "M",
    
    [Parameter(Mandatory=$false)]
    [int]$Estimate = 3,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Portfolio Site", "Dashboard", "Docs", "Infra")]
    [string]$App = "Portfolio Site",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Frontend", "Backend", "Infra", "Content", "Design")]
    [string]$Area = "Frontend",
    
    [Parameter(Mandatory=$false)]
    [string]$Assign = "jschibelli",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Import shared utilities if available (optional)
$sharedPath = Join-Path $PSScriptRoot "..\core-utilities\github-utils.ps1"
if (Test-Path $sharedPath) {
    . $sharedPath
} else {
    # Define minimal Write-ColorOutput if shared utilities not found
    function Write-ColorOutput {
        param(
            [string]$Message,
            [string]$Color = "White"
        )
        Write-Host $Message -ForegroundColor $Color
    }
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "      Auto-Configure PR System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Get-PRProjectItemId {
    param([string]$PRNumber)
    
    try {
        $prId = gh pr view $PRNumber --json id -q .id
        $graphqlResponse = gh api graphql -f query='query($prId: ID!) { node(id: $prId) { ... on PullRequest { projectItems(first: 10) { nodes { id project { id title } } } } } }' -f prId="$prId"
        $jsonData = $graphqlResponse | ConvertFrom-Json
        
        if ($jsonData.data.node.projectItems.nodes) {
            foreach ($node in $jsonData.data.node.projectItems.nodes) {
                if ($node.project.id -eq "PVT_kwHOAEnMVc4BCu-c") {
                    return $node.id
                }
            }
        }
        return $null
    } catch {
        return $null
    }
}

function Add-PRToProject {
    param([string]$PRNumber)
    
    Write-ColorOutput "Adding PR #$PRNumber to project..." "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would add PR #$PRNumber to project" "Cyan"
        return $true
    }
    
    try {
        gh project item-add 20 --owner jschibelli --url "https://github.com/jschibelli/portfolio-os/pull/$PRNumber"
        Start-Sleep -Seconds 2
        return $true
    } catch {
        Write-ColorOutput "  Failed to add PR #$PRNumber to project" "Red"
        return $false
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
        gh project item-edit --id $ProjectItemId --project-id "PVT_kwHOAEnMVc4BCu-c" --field-id $FieldId --single-select-option-id $OptionId
        return $true
    } catch {
        return $false
    }
}

function Assign-PR {
    param([string]$PRNumber, [string]$Assignee)
    
    if ([string]::IsNullOrEmpty($Assignee)) { return $true }
    
    Write-ColorOutput "Assigning PR to $Assignee..." "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would assign PR to $Assignee" "Cyan"
        return $true
    }
    
    try {
        gh pr edit $PRNumber --add-assignee $Assignee
        return $true
    } catch {
        Write-ColorOutput "  Failed to assign PR to $Assignee" "Red"
        return $false
    }
}

# Field IDs for Project 20
$fieldIds = @{
    "Priority" = "PVTSSF_lAHOAEnMVc4BCu-czg028qQ"
    "Size" = "PVTSSF_lAHOAEnMVc4BCu-czg028qU"
    "App" = "PVTSSF_lAHOAEnMVc4BCu-czg156-s"
    "Area" = "PVTSSF_lAHOAEnMVc4BCu-czg156_Y"
    "Status" = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"
    "Estimate" = "PVTSSF_lAHOAEnMVc4BCu-czg028qV"
}

# Option IDs for Project 20
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
    "App" = @{
        "Portfolio Site" = "f47ac10b-58cc-4372-a567-0e02b2c3d488"
        "Dashboard" = "f47ac10b-58cc-4372-a567-0e02b2c3d489"
        "Docs" = "f47ac10b-58cc-4372-a567-0e02b2c3d490"
        "Infra" = "f47ac10b-58cc-4372-a567-0e02b2c3d491"
    }
    "Area" = @{
        "Frontend" = "f47ac10b-58cc-4372-a567-0e02b2c3d492"
        "Backend" = "f47ac10b-58cc-4372-a567-0e02b2c3d493"
        "Infra" = "f47ac10b-58cc-4372-a567-0e02b2c3d494"
        "Content" = "f47ac10b-58cc-4372-a567-0e02b2c3d495"
        "Design" = "f47ac10b-58cc-4372-a567-0e02b2c3d496"
    }
    "Status" = @{
        "Todo" = "e18bf179"
        "In progress" = "e18bf180"
        "Ready" = "e18bf181"
        "Done" = "e18bf182"
    }
}

# Main execution
Show-Banner

Write-ColorOutput "Configuring PR #$PRNumber" "Green"

if ($DryRun) {
    Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
}

Write-ColorOutput ""
Write-ColorOutput "Configuration:" "White"
Write-ColorOutput "  Status: $Status" "White"
Write-ColorOutput "  Priority: $Priority" "White"
Write-ColorOutput "  Size: $Size" "White"
Write-ColorOutput "  Estimate: $Estimate" "White"
Write-ColorOutput "  App: $App" "White"
Write-ColorOutput "  Area: $Area" "White"
Write-ColorOutput "  Assignee: $Assign" "White"
Write-ColorOutput ""

# Add PR to project if not already added
$projectItemId = Get-PRProjectItemId -PRNumber $PRNumber
if (-not $projectItemId) {
    $success = Add-PRToProject -PRNumber $PRNumber
    if ($success) {
        Write-ColorOutput "✅ PR added to project" "Green"
        # Get the project item ID after adding
        Start-Sleep -Seconds 3
        $projectItemId = Get-PRProjectItemId -PRNumber $PRNumber
    } else {
        Write-ColorOutput "❌ Failed to add PR to project" "Red"
        exit 1
    }
} else {
    Write-ColorOutput "✅ PR already in project: $projectItemId" "Green"
}

# Configure project fields
if ($projectItemId) {
    Write-ColorOutput "Configuring project fields..." "Yellow"
    
    # Set Priority
    if ($optionIds.Priority.ContainsKey($Priority)) {
        $success = Set-ProjectField $projectItemId $fieldIds.Priority $optionIds.Priority[$Priority]
        if ($success) {
            Write-ColorOutput "  ✅ Set Priority: $Priority" "Green"
        } else {
            Write-ColorOutput "  ❌ Failed to set Priority" "Red"
        }
    }
    
    # Set Size
    if ($optionIds.Size.ContainsKey($Size)) {
        $success = Set-ProjectField $projectItemId $fieldIds.Size $optionIds.Size[$Size]
        if ($success) {
            Write-ColorOutput "  ✅ Set Size: $Size" "Green"
        } else {
            Write-ColorOutput "  ❌ Failed to set Size" "Red"
        }
    }
    
    # Set App
    if ($optionIds.App.ContainsKey($App)) {
        $success = Set-ProjectField $projectItemId $fieldIds.App $optionIds.App[$App]
        if ($success) {
            Write-ColorOutput "  ✅ Set App: $App" "Green"
        } else {
            Write-ColorOutput "  ❌ Failed to set App" "Red"
        }
    }
    
    # Set Area
    if ($optionIds.Area.ContainsKey($Area)) {
        $success = Set-ProjectField $projectItemId $fieldIds.Area $optionIds.Area[$Area]
        if ($success) {
            Write-ColorOutput "  ✅ Set Area: $Area" "Green"
        } else {
            Write-ColorOutput "  ❌ Failed to set Area" "Red"
        }
    }
    
    # Set Status
    if ($optionIds.Status.ContainsKey($Status)) {
        $success = Set-ProjectField $projectItemId $fieldIds.Status $optionIds.Status[$Status]
        if ($success) {
            Write-ColorOutput "  ✅ Set Status: $Status" "Green"
        } else {
            Write-ColorOutput "  ❌ Failed to set Status" "Red"
        }
    }
    
    # Set Estimate (as number field)
    if ($Estimate -gt 0) {
        if ($DryRun) {
            Write-ColorOutput "  [DRY RUN] Would set Estimate: $Estimate" "Cyan"
        } else {
            try {
                gh project item-edit --id $projectItemId --project-id "PVT_kwHOAEnMVc4BCu-c" --field-id $fieldIds.Estimate --number $Estimate
                Write-ColorOutput "  ✅ Set Estimate: $Estimate" "Green"
            } catch {
                Write-ColorOutput "  ❌ Failed to set Estimate" "Red"
            }
        }
    }
} else {
    Write-ColorOutput "❌ Could not get project item ID for PR #$PRNumber" "Red"
    exit 1
}

# Assign PR
if (-not [string]::IsNullOrEmpty($Assign)) {
    $success = Assign-PR -PRNumber $PRNumber -Assignee $Assign
    if ($success) {
        Write-ColorOutput "✅ Assigned PR to $Assign" "Green"
    } else {
        Write-ColorOutput "❌ Failed to assign PR" "Red"
    }
}

Write-ColorOutput ""
Write-ColorOutput "PR configuration complete!" "Green"

