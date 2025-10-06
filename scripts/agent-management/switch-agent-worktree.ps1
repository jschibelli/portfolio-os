# Agent Work Tree Switcher
# Automatically switches agents to their assigned work trees when issues are assigned

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("chris", "jason")]
    [string]$Agent,
    
    [Parameter(Mandatory=$false)]
    [int]$IssueNumber,
    
    [Parameter(Mandatory=$false)]
    [switch]$Status,
    
    [Parameter(Mandatory=$false)]
    [switch]$SwitchNow
)

# Import configuration
$configPath = Join-Path $PSScriptRoot "agent-assignment-config.json"
if (-not (Test-Path $configPath)) {
    Write-Error "Agent assignment config not found at $configPath"
    exit 1
}

$config = Get-Content $configPath | ConvertFrom-Json
$agentConfig = $config.humanAgents.$Agent

if (-not $agentConfig) {
    Write-Error "Unknown agent: $Agent"
    exit 1
}

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

function Get-AgentStatus {
    param([string]$AgentName)
    
    $agentConfig = $config.humanAgents.$AgentName
    $workTreePath = Join-Path $PWD $agentConfig.workTreePath
    
    Write-ColorOutput "=== $($agentConfig.name) ($($agentConfig.agentType)) ===" "Cyan"
    Write-ColorOutput "Work Tree: $($agentConfig.workTreePath)" "White"
    Write-ColorOutput "Branch Prefix: $($agentConfig.branchPrefix)" "White"
    Write-ColorOutput "Issue Ranges: $($agentConfig.issueRanges -join ', ')" "White"
    Write-ColorOutput "Skills: $($agentConfig.skills -join ', ')" "White"
    Write-ColorOutput "Max Concurrent Issues: $($agentConfig.maxConcurrentIssues)" "White"
    
    # Check if work tree exists
    if (Test-Path $workTreePath) {
        Write-ColorOutput "✅ Work Tree: EXISTS" "Green"
        
        # Get current branch in work tree
        Push-Location $workTreePath
        $currentBranch = git branch --show-current
        Pop-Location
        
        Write-ColorOutput "Current Branch: $currentBranch" "White"
    } else {
        Write-ColorOutput "❌ Work Tree: NOT FOUND" "Red"
    }
    
    Write-ColorOutput ""
}

function Switch-ToAgentWorkTree {
    param([string]$AgentName)
    
    $agentConfig = $config.humanAgents.$AgentName
    $workTreePath = Join-Path $PWD $agentConfig.workTreePath
    
    if (-not (Test-Path $workTreePath)) {
        Write-ColorOutput "❌ Work tree not found: $workTreePath" "Red"
        return $false
    }
    
    Write-ColorOutput "🔄 Switching to $($agentConfig.name)'s work tree..." "Yellow"
    Write-ColorOutput "Path: $workTreePath" "White"
    
    try {
        # Switch to the work tree directory
        Set-Location $workTreePath
        Write-ColorOutput "✅ Switched to $($agentConfig.name)'s work tree" "Green"
        
        # Show current status
        $currentBranch = git branch --show-current
        Write-ColorOutput "Current Branch: $currentBranch" "White"
        
        return $true
    }
    catch {
        Write-ColorOutput "❌ Failed to switch to work tree: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Assign-IssueToAgent {
    param([string]$AgentName, [int]$IssueNum)
    
    $agentConfig = $config.humanAgents.$AgentName
    
    # Check if issue is in agent's range
    $inRange = $false
    for ($i = 0; $i -lt $agentConfig.issueRanges.Count; $i += 2) {
        $start = $agentConfig.issueRanges[$i]
        $end = $agentConfig.issueRanges[$i + 1]
        if ($IssueNum -ge $start -and $IssueNum -le $end) {
            $inRange = $true
            break
        }
    }
    
    if (-not $inRange) {
        Write-ColorOutput "⚠️  Issue #$IssueNum is outside $AgentName's assigned range" "Yellow"
        Write-ColorOutput "Agent Range: $($agentConfig.issueRanges -join ', ')" "White"
        return $false
    }
    
    Write-ColorOutput "🎯 Assigning Issue #$IssueNum to $($agentConfig.name)" "Green"
    
    # Switch to agent's work tree
    if (Switch-ToAgentWorkTree $AgentName) {
        Write-ColorOutput "✅ $($agentConfig.name) is now ready to work on Issue #$IssueNum" "Green"
        return $true
    } else {
        return $false
    }
}

# Main execution
if ($Status) {
    Write-ColorOutput "=== AGENT WORK TREE STATUS ===" "Cyan"
    Get-AgentStatus "chris"
    Get-AgentStatus "jason"
}
elseif ($SwitchNow) {
    Switch-ToAgentWorkTree $Agent
}
elseif ($IssueNumber) {
    Assign-IssueToAgent $Agent $IssueNumber
}
else {
    Write-ColorOutput "Usage:" "Yellow"
    Write-ColorOutput "  .\agent-worktree-switcher.ps1 -Agent chris -Status" "White"
    Write-ColorOutput "  .\agent-worktree-switcher.ps1 -Agent jason -SwitchNow" "White"
    Write-ColorOutput "  .\agent-worktree-switcher.ps1 -Agent chris -IssueNumber 210" "White"
}
