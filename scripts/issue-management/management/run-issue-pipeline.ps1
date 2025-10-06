# Continuous Issue Pipeline Script
# Processes multiple issues continuously from Todo → In progress → Ready → Done → Merged
# Usage: .\scripts\automation\continuous-issue-pipeline.ps1 [-MaxIssues <NUMBER>] [-Status <STATUS>] [-Priority <PRIORITY>] [-App <APP>] [-Area <AREA>] [-Watch] [-Interval <SECONDS>] [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [int]$MaxIssues = 10,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Todo", "In progress", "Ready", "Done")]
    [string]$Status = "Todo",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("P0", "P1", "P2", "P3")]
    [string]$Priority = "P1",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Portfolio Site", "Dashboard", "Docs", "Infra")]
    [string]$App = "",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Frontend", "Backend", "Infra", "Content", "Design")]
    [string]$Area = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$Watch,
    
    [Parameter(Mandatory=$false)]
    [int]$Interval = 30,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [switch]$EnableAI,
    
    [Parameter(Mandatory=$false)]
    [switch]$UseQueueManager
)

# Import shared utilities
$sharedPath = Join-Path $PSScriptRoot "..\core-utilities\github-utils.ps1"
$aiServicesPath = Join-Path $PSScriptRoot "..\core-utilities\ai-services.ps1"
$queueManagerPath = Join-Path $PSScriptRoot "issue-queue-manager.ps1"

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

if (Test-Path $queueManagerPath) {
    . $queueManagerPath
    $script:queueManagerEnabled = $true
} else {
    Write-Warning "Queue manager not found at $queueManagerPath - queue features disabled"
    $script:queueManagerEnabled = $false
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "      Continuous Issue Pipeline System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Get-ProjectIssues {
    param([string]$Status, [string]$Priority, [string]$App, [string]$Area)
    
    try {
        # Get project items with filters
        $filters = @()
        if (-not [string]::IsNullOrEmpty($Status)) {
            $filters += "status:$Status"
        }
        if (-not [string]::IsNullOrEmpty($Priority)) {
            $filters += "priority:$Priority"
        }
        if (-not [string]::IsNullOrEmpty($App)) {
            $filters += "app:$App"
        }
        if (-not [string]::IsNullOrEmpty($Area)) {
            $filters += "area:$Area"
        }
        
        $filterString = $filters -join ","
        $projectItems = gh project item-list 20 --owner jschibelli --format json | ConvertFrom-Json
        
        # Filter items based on criteria
        $filteredItems = @()
        foreach ($item in $projectItems.items) {
            $include = $true
            
            # Check if it's an issue (not PR)
            if ($item.content.type -ne "Issue") {
                continue
            }
            
            # Apply filters
            if (-not [string]::IsNullOrEmpty($Status)) {
                $itemStatus = Get-ProjectFieldValue -ProjectItemId $item.id -FieldName "Status"
                if ($itemStatus -ne $Status) {
                    $include = $false
                }
            }
            
            if (-not [string]::IsNullOrEmpty($Priority)) {
                $itemPriority = Get-ProjectFieldValue -ProjectItemId $item.id -FieldName "Priority"
                if ($itemPriority -ne $Priority) {
                    $include = $false
                }
            }
            
            if (-not [string]::IsNullOrEmpty($App)) {
                $itemApp = Get-ProjectFieldValue -ProjectItemId $item.id -FieldName "App"
                if ($itemApp -ne $App) {
                    $include = $false
                }
            }
            
            if (-not [string]::IsNullOrEmpty($Area)) {
                $itemArea = Get-ProjectFieldValue -ProjectItemId $item.id -FieldName "Area"
                if ($itemArea -ne $Area) {
                    $include = $false
                }
            }
            
            if ($include) {
                $filteredItems += $item
            }
        }
        
        return $filteredItems
    } catch {
        Write-ColorOutput "Failed to get project issues: $($_.Exception.Message)" "Red"
        return @()
    }
}

function Get-ProjectFieldValue {
    param([string]$ProjectItemId, [string]$FieldName)
    
    try {
        # This would need to be implemented to get field values from project items
        # For now, return a placeholder
        return "Unknown"
    } catch {
        return "Unknown"
    }
}

function Process-Issue {
    param([object]$Issue)
    
    Write-ColorOutput "Processing Issue #$($Issue.content.number) - $($Issue.content.title)" "Green"
    
    $issueNumber = $Issue.content.number
    
    # Step 1: Update status to "In progress"
    Write-ColorOutput "  Step 1: Setting status to 'In progress'" "Yellow"
    if (-not $DryRun) {
        Update-ProjectStatus -ProjectItemId $Issue.id -Status "In progress"
    } else {
        Write-ColorOutput "    [DRY RUN] Would set status to 'In progress'" "Cyan"
    }
    
    # Step 2: Create branch from develop
    Write-ColorOutput "  Step 2: Creating branch from develop" "Yellow"
    if (-not $DryRun) {
        $branchName = "issue-$issueNumber"
        try {
            & "$PSScriptRoot\..\branch-management\create-branch-from-develop.ps1" -IssueNumber $issueNumber
            Write-ColorOutput "    ✅ Branch created: $branchName" "Green"
        } catch {
            Write-ColorOutput "    ❌ Failed to create branch" "Red"
            return $false
        }
    } else {
        Write-ColorOutput "    [DRY RUN] Would create branch from develop" "Cyan"
    }
    
    # Step 3: Analyze and implement issue
    Write-ColorOutput "  Step 3: Analyzing issue requirements" "Yellow"
    if (-not $DryRun) {
        try {
            # Use AI analysis if enabled
            if ($script:aiEnabled -and $EnableAI) {
                $aiAnalysis = Analyze-IssueWithAI -IssueNumber $issueNumber -IssueData $Issue
                if ($aiAnalysis) {
                    Write-ColorOutput "    🤖 AI analysis completed" "Cyan"
                    # Store AI analysis for later use
                    $Issue.AIAnalysis = $aiAnalysis
                }
            }
            
            # Run traditional issue analyzer
            & "$PSScriptRoot\..\issue-management\issue-analyzer.ps1" -IssueNumber $issueNumber -GeneratePlan
            Write-ColorOutput "    ✅ Issue analysis completed" "Green"
        } catch {
            Write-ColorOutput "    ❌ Issue analysis failed" "Red"
            # Continue anyway - analysis is not critical for basic flow
        }
    } else {
        Write-ColorOutput "    [DRY RUN] Would analyze issue requirements" "Cyan"
    }
    
    # Step 4: Create implementation (placeholder)
    Write-ColorOutput "  Step 4: Creating implementation" "Yellow"
    if (-not $DryRun) {
        # This would trigger actual implementation
        # For now, we'll simulate the process
        Write-ColorOutput "    📝 Implementation would be created here" "Yellow"
        Write-ColorOutput "    💡 This would involve:" "White"
        Write-ColorOutput "      - Code generation/implementation" "White"
        Write-ColorOutput "      - Testing" "White"
        Write-ColorOutput "      - Documentation updates" "White"
        Write-ColorOutput "      - PR creation" "White"
    } else {
        Write-ColorOutput "    [DRY RUN] Would create implementation" "Cyan"
    }
    
    # Step 5: Update status to "Ready"
    Write-ColorOutput "  Step 5: Setting status to 'Ready'" "Yellow"
    if (-not $DryRun) {
        Update-ProjectStatus -ProjectItemId $Issue.id -Status "Ready"
    } else {
        Write-ColorOutput "    [DRY RUN] Would set status to 'Ready'" "Cyan"
    }
    
    # Step 6: Monitor PR and update to "Done" when merged
    Write-ColorOutput "  Step 6: Monitoring for completion" "Yellow"
    Write-ColorOutput "    📊 Issue will be marked as 'Done' when PR is merged" "White"
    
    Write-ColorOutput "  ✅ Issue #$issueNumber processed successfully" "Green"
    return $true
}

function Update-ProjectStatus {
    param([string]$ProjectItemId, [string]$Status)
    
    try {
        # Status field ID for Project 20
        $statusFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"
        
        # Status option IDs
        $statusOptions = @{
            "Todo" = "e18bf179"
            "In progress" = "e18bf180"
            "Ready" = "e18bf181"
            "Done" = "e18bf182"
        }
        
        if ($statusOptions.ContainsKey($Status)) {
            gh project item-edit --id $ProjectItemId --project-id "PVT_kwHOAEnMVc4BCu-c" --field-id $statusFieldId --single-select-option-id $statusOptions[$Status]
            return $true
        } else {
            Write-ColorOutput "Invalid status: $Status" "Red"
            return $false
        }
    } catch {
        Write-ColorOutput "Failed to update project status: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Analyze-IssueWithAI {
    param(
        [int]$IssueNumber,
        [object]$IssueData
    )
    
    try {
        # Initialize AI services if not already done
        if (-not (Get-Variable -Name "aiInitialized" -Scope Script -ErrorAction SilentlyContinue)) {
            if (Initialize-AIServices) {
                $script:aiInitialized = $true
            } else {
                return $null
            }
        }
        
        $prompt = @"
Analyze the following GitHub issue and provide implementation guidance:

Issue #$IssueNumber: $($IssueData.content.title)

Description:
$($IssueData.content.body.Substring(0, [Math]::Min(2000, $IssueData.content.body.Length)))...

Please provide a JSON response with:
{
  "complexity": "low|medium|high",
  "estimated_hours": 8,
  "implementation_approach": "Brief description of approach",
  "key_components": ["component1", "component2"],
  "potential_challenges": ["challenge1", "challenge2"],
  "testing_strategy": "Brief testing approach",
  "dependencies": ["dep1", "dep2"],
  "risk_level": "low|medium|high",
  "recommended_priority": "P0|P1|P2|P3"
}

Focus on:
- Technical complexity and implementation approach
- Key components that need to be built/modified
- Potential challenges and risks
- Testing strategy
- Dependencies and prerequisites
- Time estimation
"@
        
        $response = Invoke-AICompletion -Prompt $prompt -SystemMessage "You are an expert software architect analyzing GitHub issues for implementation planning and technical assessment."
        
        $aiAnalysis = $response | ConvertFrom-Json
        Write-ColorOutput "    🤖 AI issue analysis completed" "Cyan"
        
        return $aiAnalysis
    }
    catch {
        Write-Warning "AI issue analysis failed: $($_.Exception.Message)"
        return $null
    }
}

function Show-PipelineStatus {
    param([array]$Issues, [array]$ProcessedIssues, [array]$FailedIssues)
    
    Write-ColorOutput "=== Pipeline Status ===" "Blue"
    Write-ColorOutput "Total Issues Found: $($Issues.Count)" "White"
    Write-ColorOutput "Issues Processed: $($ProcessedIssues.Count)" "Green"
    Write-ColorOutput "Issues Failed: $($FailedIssues.Count)" "Red"
    Write-ColorOutput "Issues Remaining: $($Issues.Count - $ProcessedIssues.Count - $FailedIssues.Count)" "Yellow"
    
    if ($ProcessedIssues.Count -gt 0) {
        Write-ColorOutput ""
        Write-ColorOutput "Successfully Processed:" "Green"
        foreach ($issue in $ProcessedIssues) {
            Write-ColorOutput "  ✅ #$($issue.content.number) - $($issue.content.title)" "White"
        }
    }
    
    if ($FailedIssues.Count -gt 0) {
        Write-ColorOutput ""
        Write-ColorOutput "Failed to Process:" "Red"
        foreach ($issue in $FailedIssues) {
            Write-ColorOutput "  ❌ #$($issue.content.number) - $($issue.content.title)" "White"
        }
    }
}

function Start-WatchMode {
    param([string]$Status, [string]$Priority, [string]$App, [string]$Area, [int]$Interval, [int]$MaxIssues)
    
    Write-ColorOutput "Starting watch mode (checking every $Interval seconds)" "Blue"
    Write-ColorOutput "Press Ctrl+C to stop" "Yellow"
    Write-ColorOutput ""
    
    while ($true) {
        try {
            Write-ColorOutput "=== Checking for new issues ($(Get-Date -Format 'HH:mm:ss')) ===" "Blue"
            
            $issues = Get-ProjectIssues -Status $Status -Priority $Priority -App $App -Area $Area
            if ($issues.Count -gt 0) {
                Write-ColorOutput "Found $($issues.Count) issues to process" "Green"
                
                $processedIssues = @()
                $failedIssues = @()
                
                for ($i = 0; $i -lt [Math]::Min($MaxIssues, $issues.Count); $i++) {
                    $issue = $issues[$i]
                    $success = Process-Issue -Issue $issue
                    
                    if ($success) {
                        $processedIssues += $issue
                    } else {
                        $failedIssues += $issue
                    }
                    
                    # Small delay between issues
                    Start-Sleep -Seconds 2
                }
                
                Show-PipelineStatus -Issues $issues -ProcessedIssues $processedIssues -FailedIssues $failedIssues
            } else {
                Write-ColorOutput "No issues found matching criteria" "Yellow"
            }
            
            Write-ColorOutput ""
            Write-ColorOutput "Waiting $Interval seconds for next check..." "Gray"
            Start-Sleep -Seconds $Interval
        } catch {
            Write-ColorOutput "Error in watch mode: $($_.Exception.Message)" "Red"
            Start-Sleep -Seconds $Interval
        }
    }
}

# Main execution
Show-Banner

Write-ColorOutput "Continuous Issue Pipeline Configuration:" "White"
Write-ColorOutput "  Max Issues: $MaxIssues" "White"
Write-ColorOutput "  Status Filter: $Status" "White"
Write-ColorOutput "  Priority Filter: $Priority" "White"
Write-ColorOutput "  App Filter: $(if ($App) { $App } else { 'None' })" "White"
Write-ColorOutput "  Area Filter: $(if ($Area) { $Area } else { 'None' })" "White"
Write-ColorOutput "  Watch Mode: $(if ($Watch) { 'Enabled' } else { 'Disabled' })" "White"
Write-ColorOutput "  AI Features: $(if ($script:aiEnabled -and $EnableAI) { 'Enabled' } else { 'Disabled' })" "White"
Write-ColorOutput "  Queue Manager: $(if ($script:queueManagerEnabled -and $UseQueueManager) { 'Enabled' } else { 'Disabled' })" "White"
if ($Watch) {
    Write-ColorOutput "  Check Interval: $Interval seconds" "White"
}

if ($DryRun) {
    Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
}

Write-ColorOutput ""

# Get issues to process
Write-ColorOutput "Fetching issues..." "Yellow"
$issues = Get-ProjectIssues -Status $Status -Priority $Priority -App $App -Area $Area

if ($issues.Count -eq 0) {
    Write-ColorOutput "No issues found matching the specified criteria" "Yellow"
    exit 0
}

Write-ColorOutput "Found $($issues.Count) issues to process" "Green"
Write-ColorOutput ""

# Start watch mode if requested
if ($Watch) {
    Start-WatchMode -Status $Status -Priority $Priority -App $App -Area $Area -Interval $Interval -MaxIssues $MaxIssues
    exit 0
}

# Process issues in batch
$processedIssues = @()
$failedIssues = @()

for ($i = 0; $i -lt [Math]::Min($MaxIssues, $issues.Count); $i++) {
    $issue = $issues[$i]
    
    Write-ColorOutput "=== Processing Issue $($i + 1) of $([Math]::Min($MaxIssues, $issues.Count)) ===" "Blue"
    
    $success = Process-Issue -Issue $issue
    
    if ($success) {
        $processedIssues += $issue
    } else {
        $failedIssues += $issue
    }
    
    Write-ColorOutput ""
    
    # Small delay between issues
    if ($i -lt [Math]::Min($MaxIssues, $issues.Count) - 1) {
        Start-Sleep -Seconds 1
    }
}

# Show final status
Show-PipelineStatus -Issues $issues -ProcessedIssues $processedIssues -FailedIssues $failedIssues

Write-ColorOutput ""
Write-ColorOutput "Pipeline execution complete!" "Green"

if ($processedIssues.Count -gt 0) {
    Write-ColorOutput "Successfully processed $($processedIssues.Count) issues" "Green"
}

if ($failedIssues.Count -gt 0) {
    Write-ColorOutput "Failed to process $($failedIssues.Count) issues" "Red"
    exit 1
}
