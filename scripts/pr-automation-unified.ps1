# Unified PR Automation Script - Combines all PR automation functionality
# Usage: .\scripts\pr-automation-unified.ps1 -PRNumber <PR_NUMBER> [-Action <ACTION>] [-Watch] [-Analyze] [-Respond] [-Quality] [-Docs]

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("monitor", "analyze", "respond", "quality", "docs", "all")]
    [string]$Action = "all",
    
    [Parameter(Mandatory=$false)]
    [switch]$Watch,
    
    [Parameter(Mandatory=$false)]
    [switch]$Analyze,
    
    [Parameter(Mandatory=$false)]
    [switch]$Respond,
    
    [Parameter(Mandatory=$false)]
    [switch]$Quality,
    
    [Parameter(Mandatory=$false)]
    [switch]$Docs,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [int]$Interval = 30,
    
    [Parameter(Mandatory=$false)]
    [string]$ExportTo
)

# Import shared utilities
$sharedPath = Join-Path $PSScriptRoot "shared\github-utils.ps1"
if (Test-Path $sharedPath) {
    . $sharedPath
} else {
    Write-Error "Shared utilities not found at $sharedPath"
    exit 1
}

# Dot-source the functions to make them available
. $sharedPath

# Validate authentication
if (-not (Test-GitHubAuth)) {
    exit 1
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "        Unified PR Automation System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Show-PRStatus {
    param([string]$PRNumber)
    
    try {
        $prInfo = Get-PRInfo -PRNumber $PRNumber
        $repo = Get-RepoInfo
        
        Write-ColorOutput "PR #$PRNumber Status:" "Green"
        Write-ColorOutput "  Title: $($prInfo.title)" "White"
        Write-ColorOutput "  State: $($prInfo.state)" "White"
        Write-ColorOutput "  Author: $($prInfo.user.login)" "White"
        Write-ColorOutput "  URL: $($prInfo.html_url)" "White"
        
        if ($prInfo.labels) {
            $labelNames = $prInfo.labels | ForEach-Object { $_.name }
            Write-ColorOutput "  Labels: $($labelNames -join ', ')" "White"
        }
        
        Write-ColorOutput ""
    }
    catch {
        Write-ColorOutput "Failed to get PR status" "Red"
    }
}

function Invoke-CRGPTAnalysis {
    param([string]$PRNumber, [string]$ExportTo)
    
    Write-ColorOutput "Analyzing CR-GPT comments..." "Yellow"
    
    try {
        $crgptComments = Get-CRGPTComments -PRNumber $PRNumber
        
        if (-not $crgptComments) {
            Write-ColorOutput "No CR-GPT comments found" "Yellow"
            return
        }
        
        Write-ColorOutput "Found $($crgptComments.Count) CR-GPT comments" "Green"
        
        $analysis = @()
        foreach ($comment in $crgptComments) {
            $commentAnalysis = @{
                ID = $comment.id
                Body = $comment.body
                CreatedAt = $comment.created_at
                Categories = @()
                Priority = "Medium"
                Actionable = $false
            }
            
            # Simple analysis based on keywords
            $body = $comment.body.ToLower()
            
            if ($body -match "error|bug|fix|issue") {
                $commentAnalysis.Categories += "Error"
                $commentAnalysis.Priority = "High"
                $commentAnalysis.Actionable = $true
            }
            
            if ($body -match "security|vulnerability") {
                $commentAnalysis.Categories += "Security"
                $commentAnalysis.Priority = "Critical"
                $commentAnalysis.Actionable = $true
            }
            
            if ($body -match "performance|slow|optimize") {
                $commentAnalysis.Categories += "Performance"
                $commentAnalysis.Actionable = $true
            }
            
            if ($body -match "style|format|lint") {
                $commentAnalysis.Categories += "Style"
                $commentAnalysis.Priority = "Low"
            }
            
            $analysis += $commentAnalysis
        }
        
        # Display analysis
        Write-ColorOutput "Analysis Summary:" "Green"
        foreach ($item in $analysis) {
            Write-ColorOutput "  Comment $($item.ID): $($item.Categories -join ', ') - Priority: $($item.Priority)" "White"
        }
        
        # Export if requested
        if ($ExportTo) {
            $analysis | ConvertTo-Json -Depth 3 | Out-File -FilePath $ExportTo -Encoding UTF8
            Write-ColorOutput "Analysis exported to: $ExportTo" "Green"
        }
        
        Write-ColorOutput ""
    }
    catch {
        Write-ColorOutput "Failed to analyze CR-GPT comments: $($_.Exception.Message)" "Red"
    }
}

function Invoke-AutoResponse {
    param([string]$PRNumber)
    
    Write-ColorOutput "Generating auto-responses..." "Yellow"
    
    try {
        $crgptComments = Get-CRGPTComments -PRNumber $PRNumber
        
        if (-not $crgptComments) {
            Write-ColorOutput "No CR-GPT comments to respond to" "Yellow"
            return
        }
        
        foreach ($comment in $crgptComments) {
            $body = $comment.body.ToLower()
            $response = ""
            
            # Generate responses based on comment content
            if ($body -match "error|bug") {
                $response = "Thanks for catching this error! I will fix it right away."
            }
            elseif ($body -match "security") {
                $response = "Good security catch! I will address this security concern immediately."
            }
            elseif ($body -match "performance") {
                $response = "Great point about performance! I will optimize this code."
            }
            elseif ($body -match "style|format") {
                $response = "I will clean up the formatting. Thanks for the suggestion!"
            }
            else {
                $response = "Thanks for the feedback! I will review and address this."
            }
            
            if ($response -and -not $DryRun) {
                $repo = Get-RepoInfo
                gh api repos/$($repo.Owner)/$($repo.Name)/pulls/$PRNumber/comments/$($comment.id)/replies -f body="$response" | Out-Null
                Write-ColorOutput "  Responded to comment $($comment.id)" "Green"
            }
            elseif ($response) {
                Write-ColorOutput "  [DRY RUN] Would respond: $response" "Cyan"
            }
        }
        
        Write-ColorOutput ""
    }
    catch {
        Write-ColorOutput "Failed to generate auto-responses: $($_.Exception.Message)" "Red"
    }
}

function Invoke-QualityCheck {
    param([string]$PRNumber)
    
    Write-ColorOutput "Running quality checks..." "Yellow"
    
    try {
        # Run linting
        Write-ColorOutput "  Running ESLint..." "White"
        $lintResult = npm run lint 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "  [PASS] Linting passed" "Green"
        } else {
            Write-ColorOutput "  [FAIL] Linting failed" "Red"
            Write-ColorOutput $lintResult "Red"
        }
        
        # Run type checking
        Write-ColorOutput "  Running TypeScript check..." "White"
        $typeResult = npm run type-check 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "  [PASS] Type checking passed" "Green"
        } else {
            Write-ColorOutput "  [FAIL] Type checking failed" "Red"
            Write-ColorOutput $typeResult "Red"
        }
        
        Write-ColorOutput ""
    }
    catch {
        Write-ColorOutput "Failed to run quality checks: $($_.Exception.Message)" "Red"
    }
}

function Invoke-DocsUpdate {
    param([string]$PRNumber)
    
    Write-ColorOutput "Updating documentation..." "Yellow"
    
    try {
        # This would typically update changelog, README, etc.
        Write-ColorOutput "  Documentation updates would be implemented here" "White"
        Write-ColorOutput ""
    }
    catch {
        Write-ColorOutput "Failed to update documentation: $($_.Exception.Message)" "Red"
    }
}

function Start-WatchMode {
    param([string]$PRNumber, [int]$Interval)
    
    Write-ColorOutput "Starting watch mode (interval: ${Interval}s)..." "Yellow"
    Write-ColorOutput "Press Ctrl+C to stop" "Yellow"
    Write-ColorOutput ""
    
    while ($true) {
        Clear-Host
        Show-Banner
        Show-PRStatus -PRNumber $PRNumber
        
        Start-Sleep -Seconds $Interval
    }
}

# Main execution
Show-Banner

# Determine actions to run
$actions = @()
if ($Action -eq "all") {
    $actions = @("monitor", "analyze", "respond", "quality", "docs")
} else {
    $actions = @($Action)
}

# Add individual switches
if ($Analyze) { $actions += "analyze" }
if ($Respond) { $actions += "respond" }
if ($Quality) { $actions += "quality" }
if ($Docs) { $actions += "docs" }

# Remove duplicates
$actions = $actions | Sort-Object | Get-Unique

# Run actions
foreach ($action in $actions) {
    switch ($action) {
        "monitor" { 
            if ($Watch) {
                Start-WatchMode -PRNumber $PRNumber -Interval $Interval
            } else {
                Show-PRStatus -PRNumber $PRNumber
            }
        }
        "analyze" { Invoke-CRGPTAnalysis -PRNumber $PRNumber -ExportTo $ExportTo }
        "respond" { Invoke-AutoResponse -PRNumber $PRNumber }
        "quality" { Invoke-QualityCheck -PRNumber $PRNumber }
        "docs" { Invoke-DocsUpdate -PRNumber $PRNumber }
    }
}

Write-ColorOutput "Automation complete!" "Green"
