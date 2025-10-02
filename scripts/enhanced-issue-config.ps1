# Enhanced Issue Configuration with Agent Integration
# Usage: .\scripts\enhanced-issue-config.ps1 -IssueNumber <NUMBER> [-Preset <PRESET>] [-Agent <AGENT>] [-AddToProject] [-DryRun]

param(
    [Parameter(Mandatory=$true)]
    [string]$IssueNumber,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("blog", "dashboard", "docs", "infra", "custom")]
    [string]$Preset = "custom",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("agent-frontend", "agent-backend", "agent-docs", "agent-testing", "agent-ai", "agent-default")]
    [string]$Agent = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$AddToProject,
    
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
    Write-ColorOutput "    Enhanced Issue Configuration with Agents" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Auto-AssignAgent {
    param([string]$IssueNumber)
    
    try {
        # Get issue details
        $issue = gh issue view $IssueNumber --json title,body,labels
        $issueData = $issue | ConvertFrom-Json
        
        # Analyze issue content for agent assignment
        $textToAnalyze = "$($issueData.title) $($issueData.body)".ToLower()
        
        # Agent keywords
        $agentKeywords = @{
            "agent-frontend" = @("ui", "component", "react", "css", "styling", "responsive", "accessibility", "frontend", "interface")
            "agent-backend" = @("api", "database", "server", "auth", "middleware", "service", "backend", "migration", "sync")
            "agent-docs" = @("documentation", "readme", "guide", "tutorial", "content", "docs", "documentation")
            "agent-testing" = @("test", "testing", "coverage", "e2e", "unit", "integration", "qa", "quality")
            "agent-ai" = @("ai", "automation", "ml", "intelligence", "assistant", "bot", "smart", "automated")
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
        Write-ColorOutput "Error analyzing issue: $($_.Exception.Message)" "Red"
        return "agent-default"
    }
}

function Main {
    Show-Banner
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput "Processing issue #$IssueNumber with agent integration..." "Yellow"
    
    # Step 1: Auto-assign agent if not specified
    if (-not $Agent) {
        Write-ColorOutput "1. Auto-assigning agent..." "White"
        $Agent = Auto-AssignAgent -IssueNumber $IssueNumber
        Write-ColorOutput "  Suggested agent: $Agent" "Green"
    }
    
    # Step 2: Add agent label
    Write-ColorOutput "2. Adding agent label..." "White"
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would add label: $Agent" "Cyan"
    } else {
        try {
            gh issue edit $IssueNumber --add-label $Agent
            Write-ColorOutput "  âœ… Added agent label: $Agent" "Green"
        }
        catch {
            Write-ColorOutput "  âŒ Failed to add agent label: $($_.Exception.Message)" "Red"
        }
    }
    
    # Step 3: Run existing issue configuration
    Write-ColorOutput "3. Running existing issue configuration..." "White"
    & .\scripts\issue-config-unified.ps1 -IssueNumber $IssueNumber -Preset $Preset -AddToProject:$AddToProject -DryRun:$DryRun
    
    # Step 4: Update agent workload
    Write-ColorOutput "4. Updating agent workload..." "White"
    & .\scripts\agent-workload-manager.ps1 -Action status -Agent $Agent -DryRun:$DryRun
    
    # Step 5: Create branch from develop
    Write-ColorOutput "5. Creating branch from develop..." "White"
    & .\scripts\create-branch-from-develop.ps1 -IssueNumber $IssueNumber -DryRun:$DryRun
    
    Write-ColorOutput ""
    Write-ColorOutput "âœ… Enhanced issue configuration complete!" "Green"
    Write-ColorOutput "Issue #$IssueNumber assigned to $Agent" "White"
}

# Run the main function
Main
