# Unified Issue Configuration Script - Combines all issue configuration functionality
# Usage: .\scripts\issue-config-unified.ps1 -IssueNumber <NUMBER> [-Preset <PRESET>] [-Priority <PRIORITY>] [-Size <SIZE>] [-App <APP>] [-Area <AREA>] [-Status <STATUS>] [-Labels <LABELS>] [-Milestone <MILESTONE>] [-AddToProject] [-DryRun]

param(
    [Parameter(Mandatory=$true)]
    [string]$IssueNumber,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("blog", "dashboard", "docs", "infra", "custom")]
    [string]$Preset = "custom",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("P0", "P1", "P2", "P3")]
    [string]$Priority = "P1",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("XS", "S", "M", "L", "XL")]
    [string]$Size = "M",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Portfolio Site", "Dashboard", "Docs", "Infra")]
    [string]$App = "Portfolio Site",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Frontend", "Backend", "Infra", "Content", "Design")]
    [string]$Area = "Frontend",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Todo", "In progress", "Ready", "Done")]
    [string]$Status = "Todo",
    
    [Parameter(Mandatory=$false)]
    [string[]]$Labels = @(),
    
    [Parameter(Mandatory=$false)]
    [string]$Milestone = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$AddToProject,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [switch]$EnableAI,
    
    [Parameter(Mandatory=$false)]
    [string]$AIPreset = ""
)

# Import shared utilities
$sharedPath = Join-Path $PSScriptRoot "..\core-utilities\github-utils.ps1"
$aiServicesPath = Join-Path $PSScriptRoot "..\core-utilities\ai-services.ps1"

if (Test-Path $sharedPath) {
    . $sharedPath
} else {
    Write-Error "Shared utilities not found at $sharedPath"
    exit 1
}

if (Test-Path $aiServicesPath) {
    . $aiServicesPath
    $script:aiEnabled = $true
} else {
    Write-Warning "AI services not found at $aiServicesPath - AI features disabled"
    $script:aiEnabled = $false
}

# Validate authentication
if (-not (Test-GitHubAuth)) {
    exit 1
}

# Preset configurations
$presets = @{
    "blog" = @{
        Priority = "P1"
        Size = "M"
        App = "Portfolio Site"
        Area = "Frontend"
        Labels = @("blog", "area: functionality", "priority: high")
        Milestone = "Blog Functionality & Connection Issues"
    }
    "dashboard" = @{
        Priority = "P1"
        Size = "M"
        App = "Dashboard"
        Area = "Frontend"
        Labels = @("dashboard", "area: functionality", "priority: high")
        Milestone = "Dashboard Features"
    }
    "docs" = @{
        Priority = "P2"
        Size = "S"
        App = "Docs"
        Area = "Content"
        Labels = @("documentation", "area: content")
        Milestone = "Documentation"
    }
    "infra" = @{
        Priority = "P1"
        Size = "L"
        App = "Portfolio Site"
        Area = "Infra"
        Labels = @("infrastructure", "area: infra", "priority: high")
        Milestone = "Infrastructure"
    }
}

# Field IDs for Project 20
$fieldIds = @{
    "Priority" = "PVTSSF_lAHOAEnMVc4BCu-czg028qQ"
    "Size" = "PVTSSF_lAHOAEnMVc4BCu-czg028qU"
    "App" = "PVTSSF_lAHOAEnMVc4BCu-czg156-s"
    "Area" = "PVTSSF_lAHOAEnMVc4BCu-czg156_Y"
    "Status" = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"
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

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "      Unified Issue Configuration System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Apply-Preset {
    param([string]$PresetName)
    
    if ($presets.ContainsKey($PresetName)) {
        $preset = $presets[$PresetName]
        $script:Priority = $preset.Priority
        $script:Size = $preset.Size
        $script:App = $preset.App
        $script:Area = $preset.Area
        $script:Labels = $preset.Labels
        $script:Milestone = $preset.Milestone
        Write-ColorOutput "Applied preset: $PresetName" "Green"
    }
}

function Set-ProjectFields {
    param([string]$ProjectItemId)
    
    Write-ColorOutput "Configuring project fields..." "Yellow"
    
    $fieldsToSet = @{
        "Priority" = $optionIds.Priority[$Priority]
        "Size" = $optionIds.Size[$Size]
        "App" = $optionIds.App[$App]
        "Area" = $optionIds.Area[$Area]
        "Status" = $optionIds.Status[$Status]
    }
    
    foreach ($fieldName in $fieldsToSet.Keys) {
        $fieldId = $fieldIds[$fieldName]
        $optionId = $fieldsToSet[$fieldName]
        
        if ($optionId) {
            if ($DryRun) {
                Write-ColorOutput "  [DRY RUN] Would set $fieldName to $optionId" "Cyan"
            } else {
                $success = Set-ProjectFieldValue -ProjectItemId $ProjectItemId -FieldId $fieldId -OptionId $optionId
                if ($success) {
                    Write-ColorOutput "  ✅ Set $fieldName" "Green"
                } else {
                    Write-ColorOutput "  ❌ Failed to set $fieldName" "Red"
                }
            }
        }
    }
}

function Set-IssueLabels {
    param([string]$IssueNumber)
    
    if ($Labels.Count -eq 0) { return }
    
    Write-ColorOutput "Setting labels: $($Labels -join ', ')" "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would set labels: $($Labels -join ', ')" "Cyan"
    } else {
        try {
            gh issue edit $IssueNumber --add-label ($Labels -join ",")
            Write-ColorOutput "  ✅ Labels set successfully" "Green"
        }
        catch {
            Write-ColorOutput "  ❌ Failed to set labels" "Red"
        }
    }
}

function Set-IssueMilestone {
    param([string]$IssueNumber)
    
    if ([string]::IsNullOrEmpty($Milestone)) { return }
    
    Write-ColorOutput "Setting milestone: $Milestone" "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would set milestone: $Milestone" "Cyan"
    } else {
        try {
            gh issue edit $IssueNumber --milestone "$Milestone"
            Write-ColorOutput "  ✅ Milestone set successfully" "Green"
        }
        catch {
            Write-ColorOutput "  ❌ Failed to set milestone" "Red"
        }
    }
}

function Get-AIIssueConfiguration {
    param(
        [string]$IssueNumber,
        [string]$IssueTitle,
        [string]$IssueBody
    )
    
    if (-not $script:aiEnabled) {
        Write-ColorOutput "AI features disabled - using default configuration" "Yellow"
        return $null
    }
    
    Write-ColorOutput "🤖 Analyzing issue with AI..." "Cyan"
    
    try {
        # Initialize AI services if not already done
        if (-not (Get-Variable -Name "aiInitialized" -Scope Script -ErrorAction SilentlyContinue)) {
            if (Initialize-AIServices) {
                $script:aiInitialized = $true
            } else {
                Write-Warning "Failed to initialize AI services"
                return $null
            }
        }
        
        $prompt = @"
Analyze the following GitHub issue and recommend optimal configuration:

Issue #$IssueNumber: $IssueTitle

Description:
$IssueBody

Please recommend:
1. Priority (P0, P1, P2, P3) - P0 is critical, P3 is low
2. Size (XS, S, M, L, XL) - XS is tiny, XL is very large
3. App (Portfolio Site, Dashboard, Docs, Infra)
4. Area (Frontend, Backend, Infra, Content, Design)
5. Status (Todo, In progress, Ready, Done)
6. Labels (comma-separated list)
7. Milestone (if applicable)

Consider the issue type, complexity, impact, and urgency.
Respond in JSON format:
{
  "priority": "P1",
  "size": "M",
  "app": "Portfolio Site",
  "area": "Frontend",
  "status": "Todo",
  "labels": ["bug", "frontend"],
  "milestone": "Bug Fixes"
}
"@
        
        $response = Invoke-AICompletion -Prompt $prompt -SystemMessage "You are an expert project manager who analyzes GitHub issues and recommends optimal configuration for project management."
        
        # Parse JSON response
        $aiConfig = $response | ConvertFrom-Json
        Write-ColorOutput "✅ AI analysis completed" "Green"
        
        return $aiConfig
    }
    catch {
        Write-Warning "AI analysis failed: $($_.Exception.Message)"
        return $null
    }
}

function Apply-AIConfiguration {
    param(
        [object]$AIConfig,
        [string]$IssueNumber
    )
    
    if (-not $AIConfig) { return }
    
    Write-ColorOutput "🤖 Applying AI-recommended configuration..." "Cyan"
    
    # Apply AI recommendations
    $script:Priority = $AIConfig.priority
    $script:Size = $AIConfig.size
    $script:App = $AIConfig.app
    $script:Area = $AIConfig.area
    $script:Status = $AIConfig.status
    $script:Labels = $AIConfig.labels
    $script:Milestone = $AIConfig.milestone
    
    Write-ColorOutput "  ✅ AI configuration applied" "Green"
    Write-ColorOutput "    Priority: $Priority" "White"
    Write-ColorOutput "    Size: $Size" "White"
    Write-ColorOutput "    App: $App" "White"
    Write-ColorOutput "    Area: $Area" "White"
    Write-ColorOutput "    Status: $Status" "White"
    Write-ColorOutput "    Labels: $($Labels -join ', ')" "White"
    Write-ColorOutput "    Milestone: $Milestone" "White"
}

# Main execution
Show-Banner

Write-ColorOutput "Configuring Issue #$IssueNumber" "Green"
Write-ColorOutput "Preset: $Preset" "White"
Write-ColorOutput "AI Features: $(if ($script:aiEnabled) { 'Enabled' } else { 'Disabled' })" "White"

if ($DryRun) {
    Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
}

# Get issue data for AI analysis if enabled
$issueData = $null
if ($script:aiEnabled -and ($EnableAI -or -not [string]::IsNullOrEmpty($AIPreset))) {
    try {
        $issueJson = gh issue view $IssueNumber --json title,body
        $issueData = $issueJson | ConvertFrom-Json
    }
    catch {
        Write-Warning "Failed to get issue data for AI analysis: $($_.Exception.Message)"
    }
}

# Apply AI configuration if enabled
if ($script:aiEnabled -and ($EnableAI -or -not [string]::IsNullOrEmpty($AIPreset)) -and $issueData) {
    $aiConfig = Get-AIIssueConfiguration -IssueNumber $IssueNumber -IssueTitle $issueData.title -IssueBody $issueData.body
    if ($aiConfig) {
        Apply-AIConfiguration -AIConfig $aiConfig -IssueNumber $IssueNumber
    }
}

# Apply preset configuration (only if not using AI or if AI failed)
if ($Preset -ne "custom" -and (-not $aiConfig -or [string]::IsNullOrEmpty($AIPreset))) {
    Apply-Preset -PresetName $Preset
}

Write-ColorOutput ""
Write-ColorOutput "Configuration:" "White"
Write-ColorOutput "  Priority: $Priority" "White"
Write-ColorOutput "  Size: $Size" "White"
Write-ColorOutput "  App: $App" "White"
Write-ColorOutput "  Area: $Area" "White"
Write-ColorOutput "  Status: $Status" "White"
Write-ColorOutput "  Labels: $($Labels -join ', ')" "White"
Write-ColorOutput "  Milestone: $Milestone" "White"
Write-ColorOutput ""

# Add to project if requested
if ($AddToProject) {
    Write-ColorOutput "Adding issue to project..." "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would add issue #$IssueNumber to project" "Cyan"
    } else {
        $success = Add-IssueToProject -IssueNumber $IssueNumber
        if ($success) {
            Write-ColorOutput "  ✅ Issue added to project" "Green"
        } else {
            Write-ColorOutput "  ❌ Failed to add issue to project" "Red"
            exit 1
        }
    }
}

# Get project item ID
$projectItemId = Get-ProjectItemId -IssueNumber $IssueNumber
if ($projectItemId) {
    Write-ColorOutput "Found project item: $projectItemId" "Green"
    Set-ProjectFields -ProjectItemId $projectItemId
} else {
    Write-ColorOutput "Issue not found in project or not added yet" "Yellow"
}

# Set labels and milestone
Set-IssueLabels -IssueNumber $IssueNumber
Set-IssueMilestone -IssueNumber $IssueNumber

Write-ColorOutput ""
Write-ColorOutput "Configuration complete!" "Green"
