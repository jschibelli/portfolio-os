# Auto-Assign Agent Work Tree
# Automatically assigns issues to the correct agent and switches to their work tree

param(
    [Parameter(Mandatory=$true)]
    [int]$IssueNumber,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

# Import agent assignment configuration
$configPath = Join-Path $PSScriptRoot "agent-assignment-config.json"
if (-not (Test-Path $configPath)) {
    Write-Error "Agent assignment config not found at $configPath"
    exit 1
}

$config = Get-Content $configPath | ConvertFrom-Json

function Write-ColorOutput {
    param([string]$Message, [string]$Color)
    switch ($Color.ToLower()) {
        "red" { Write-Host $Message -ForegroundColor Red }
        "green" { Write-Host $Message -ForegroundColor Green }
        "yellow" { Write-Host $Message -ForegroundColor Yellow }
        "cyan" { Write-Host $Message -ForegroundColor Cyan }
        "blue" { Write-Host $Message -ForegroundColor Blue }
        default { Write-Host $Message -ForegroundColor White }
    }
}

function Find-OptimalAgent {
    param([int]$IssueNum)
    
    Write-ColorOutput "🔍 Finding optimal agent for Issue #$IssueNum..." "Cyan"
    
    $bestAgent = $null
    $bestScore = 0
    
    foreach ($agentName in $config.humanAgents.PSObject.Properties.Name) {
        $agent = $config.humanAgents.$agentName
        
        # Check if issue is in agent's range
        $inRange = $false
        for ($i = 0; $i -lt $agent.issueRanges.Count; $i += 2) {
            $start = $agent.issueRanges[$i]
            $end = $agent.issueRanges[$i + 1]
            if ($IssueNum -ge $start -and $IssueNum -le $end) {
                $inRange = $true
                break
            }
        }
        
        if ($inRange) {
            $score = 100  # Base score for being in range
            Write-ColorOutput "  ✅ $($agent.name): In range (Issues $($agent.issueRanges -join ', '))" "Green"
            
            if ($score -gt $bestScore) {
                $bestScore = $score
                $bestAgent = $agentName
            }
        } else {
            Write-ColorOutput "  ❌ $($agent.name): Outside range (Issues $($agent.issueRanges -join ', '))" "Red"
        }
    }
    
    return $bestAgent
}

function Assign-IssueToAgent {
    param([string]$AgentName, [int]$IssueNum)
    
    $agent = $config.humanAgents.$AgentName
    $workTreePath = Join-Path $PWD $agent.workTreePath
    
    Write-ColorOutput "🎯 Assigning Issue #$IssueNum to $($agent.name)" "Green"
    Write-ColorOutput "   Agent Type: $($agent.agentType)" "White"
    Write-ColorOutput "   Work Tree: $($agent.workTreePath)" "White"
    Write-ColorOutput "   Branch Prefix: $($agent.branchPrefix)" "White"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would switch to work tree: $workTreePath" "Yellow"
        Write-ColorOutput "  [DRY RUN] Would be ready to work on Issue #$IssueNum" "Yellow"
        return $true
    }
    
    if (-not (Test-Path $workTreePath)) {
        Write-ColorOutput "❌ Work tree not found: $workTreePath" "Red"
        return $false
    }
    
    try {
        # Switch to the work tree directory
        Set-Location $workTreePath
        Write-ColorOutput "✅ Switched to $($agent.name)'s work tree" "Green"
        
        # Show current status
        $currentBranch = git branch --show-current
        Write-ColorOutput "Current Branch: $currentBranch" "White"
        
        # Update work tree state
        $statePath = Join-Path (Split-Path -Parent $PWD) "worktree-state.json"
        if (Test-Path $statePath) {
            $state = Get-Content $statePath | ConvertFrom-Json
            $state.agents.$AgentName.currentIssue = $IssueNum
            $state.agents.$AgentName.lastActivity = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
            $state | ConvertTo-Json -Depth 10 | Set-Content $statePath
        }
        
        Write-ColorOutput "🎉 $($agent.name) is now ready to work on Issue #$IssueNum!" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "❌ Failed to switch to work tree: $($_.Exception.Message)" "Red"
        return $false
    }
}

# Main execution
Write-ColorOutput "=== AUTO-ASSIGN AGENT WORK TREE ===" "Cyan"
Write-ColorOutput "Issue: #$IssueNumber" "White"
Write-ColorOutput "Dry Run: $DryRun" "White"
Write-ColorOutput ""

# Find optimal agent
$optimalAgent = Find-OptimalAgent $IssueNumber

if (-not $optimalAgent) {
    Write-ColorOutput "❌ No suitable agent found for Issue #$IssueNumber" "Red"
    Write-ColorOutput "Available agent ranges:" "Yellow"
    foreach ($agentName in $config.humanAgents.PSObject.Properties.Name) {
        $agent = $config.humanAgents.$agentName
        Write-ColorOutput "  $($agent.name): Issues $($agent.issueRanges -join ', ')" "White"
    }
    exit 1
}

Write-ColorOutput "🏆 Optimal agent found: $($config.humanAgents.$optimalAgent.name)" "Green"
Write-ColorOutput ""

# Assign issue to agent
$success = Assign-IssueToAgent $optimalAgent $IssueNumber

if ($success) {
    Write-ColorOutput "✅ Issue assignment completed successfully!" "Green"
} else {
    Write-ColorOutput "❌ Issue assignment failed!" "Red"
    exit 1
}
