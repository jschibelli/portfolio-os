# Enhanced PR Automation with Agent Integration
# Usage: .\scripts\enhanced-pr-automation.ps1 -PRNumber <NUMBER> [-Agent <AGENT>] [-Action <ACTION>] [-AutoFix] [-DryRun]

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("agent-frontend", "agent-backend", "agent-docs", "agent-testing", "agent-ai", "agent-default")]
    [string]$Agent = "",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("monitor", "analyze", "respond", "quality", "docs", "all")]
    [string]$Action = "all",
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoFix,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "    Enhanced PR Automation with Agents" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Get-AgentFromPR {
    param([string]$PRNumber)
    
    try {
        # Get PR info
        $prInfo = gh pr view $PRNumber --json title,body,labels,headRefName
        $prData = $prInfo | ConvertFrom-Json
        
        # Check for agent labels
        $agentLabels = $prData.labels | Where-Object { $_.name -like "agent-*" }
        
        if ($agentLabels.Count -gt 0) {
            return $agentLabels[0].name
        }
        
        # Analyze PR content if no agent label
        $textToAnalyze = "$($prData.title) $($prData.body)".ToLower()
        
        $agentKeywords = @{
            "agent-frontend" = @("ui", "component", "react", "css", "styling", "responsive", "frontend")
            "agent-backend" = @("api", "database", "server", "auth", "middleware", "backend")
            "agent-docs" = @("documentation", "readme", "guide", "tutorial", "docs")
            "agent-testing" = @("test", "testing", "coverage", "e2e", "unit", "integration")
            "agent-ai" = @("ai", "automation", "ml", "intelligence", "assistant")
        }
        
        $bestAgent = "agent-default"
        $maxScore = 0
        
        foreach ($agent in $agentKeywords.Keys) {
            $score = 0
            foreach ($keyword in $agentKeywords[$agent]) {
                if ($textToAnalyze -like "*$keyword*") {
                    $score++
                }
            }
            
            if ($score -gt $maxScore) {
                $maxScore = $score
                $bestAgent = $agent
            }
        }
        
        return $bestAgent
    }
    catch {
        Write-ColorOutput "Error analyzing PR: $($_.Exception.Message)" "Red"
        return "agent-default"
    }
}

function Main {
    Show-Banner
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput "Processing PR #$PRNumber with agent integration..." "Yellow"
    
    # Step 1: Determine agent if not specified
    if (-not $Agent) {
        Write-ColorOutput "1. Determining agent..." "White"
        $Agent = Get-AgentFromPR -PRNumber $PRNumber
        Write-ColorOutput "  Detected agent: $Agent" "Green"
    }
    
    # Step 2: Check for conflicts
    Write-ColorOutput "2. Checking for conflicts..." "White"
    $conflicts = & .\scripts\merge-queue-system.ps1 -Action conflicts -PRNumber $PRNumber -DryRun:$DryRun
    
    if ($conflicts) {
        Write-ColorOutput "  âš ï¸  Conflicts detected, adding to merge queue" "Yellow"
        & .\scripts\merge-queue-system.ps1 -Action add -PRNumber $PRNumber -Agent $Agent -DryRun:$DryRun
    } else {
        Write-ColorOutput "  âœ… No conflicts detected" "Green"
    }
    
    # Step 3: Run existing PR automation
    Write-ColorOutput "3. Running existing PR automation..." "White"
    & .\scripts\pr-automation-unified.ps1 -PRNumber $PRNumber -Action $Action -AutoFix:$AutoFix -DryRun:$DryRun
    
    # Step 4: Update agent status
    Write-ColorOutput "4. Updating agent status..." "White"
    & .\scripts\agent-workload-manager.ps1 -Action status -Agent $Agent -DryRun:$DryRun
    
    # Step 5: Process merge queue if ready
    Write-ColorOutput "5. Processing merge queue..." "White"
    & .\scripts\merge-queue-system.ps1 -Action process -DryRun:$DryRun
    
    Write-ColorOutput ""
    Write-ColorOutput "âœ… Enhanced PR automation complete!" "Green"
    Write-ColorOutput "PR #$PRNumber processed by $Agent" "White"
}

# Run the main function
Main
