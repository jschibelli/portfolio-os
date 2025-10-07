# Enhanced Worktree Operations Manager
# Consolidated from assign-agent-worktree.ps1 and switch-agent-worktree.ps1
# Comprehensive worktree assignment, switching, and management

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("assign", "switch", "status", "create", "list", "sync", "cleanup", "help")]
    [string]$Operation,
    
    [Parameter(Mandatory=$false)]
    [int]$IssueNumber,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("chris", "jason", "agent1", "agent2", "auto")]
    [string]$Agent = "auto",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force,
    
    [Parameter(Mandatory=$false)]
    [switch]$Detailed
)

# Enhanced agent configuration
$agentConfig = @{
    "chris" = @{
        name = "Chris (Agent 1)"
        agentType = "Frontend/UI Specialist"
        workTreePath = "worktrees/agent-1-chris"
        branchPrefix = "issue-"
        issueRanges = @(247, 254, 251, 254, 253, 254)
        skills = @("React", "Next.js", "UI/UX", "Accessibility", "Performance")
        specialties = @("frontend", "ui", "accessibility", "performance")
        maxConcurrentIssues = 4
    }
    "jason" = @{
        name = "Jason (Agent 2)"
        agentType = "Infrastructure/SEO Specialist"
        workTreePath = "worktrees/agent-2-jason"
        branchPrefix = "issue-"
        issueRanges = @(248, 252, 249, 252, 250, 252)
        skills = @("DevOps", "SEO", "Infrastructure", "Security", "Content")
        specialties = @("infrastructure", "seo", "deployment", "security")
        maxConcurrentIssues = 4
    }
    "agent1" = @{
        name = "Agent 1 (Frontend)"
        agentType = "Frontend/UI Specialist"
        workTreePath = "worktrees/agent-1-chris"
        branchPrefix = "issue-"
        issueRanges = @(247, 254, 251, 254, 253, 254)
        skills = @("React", "Next.js", "UI/UX", "Accessibility", "Performance")
        specialties = @("frontend", "ui", "accessibility", "performance")
        maxConcurrentIssues = 4
    }
    "agent2" = @{
        name = "Agent 2 (Infrastructure)"
        agentType = "Infrastructure/SEO Specialist"
        workTreePath = "worktrees/agent-2-jason"
        branchPrefix = "issue-"
        issueRanges = @(248, 252, 249, 252, 250, 252)
        skills = @("DevOps", "SEO", "Infrastructure", "Security", "Content")
        specialties = @("infrastructure", "seo", "deployment", "security")
        maxConcurrentIssues = 4
    }
}

# Import configuration if available
$configPath = Join-Path $PSScriptRoot "..\configuration\agent-assignment-config.json"
if (Test-Path $configPath) {
    try {
        $externalConfig = Get-Content $configPath | ConvertFrom-Json
        # Merge external config if available
        if ($externalConfig.humanAgents) {
            foreach ($agentKey in $externalConfig.humanAgents.PSObject.Properties.Name) {
                if ($agentConfig.ContainsKey($agentKey)) {
                    $agentConfig[$agentKey] = $externalConfig.humanAgents.$agentKey
                }
            }
        }
    } catch {
        Write-Warning "Could not load external configuration: $($_.Exception.Message)"
    }
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color)
    switch ($Color.ToLower()) {
        "red" { Write-Host $Message -ForegroundColor Red }
        "green" { Write-Host $Message -ForegroundColor Green }
        "yellow" { Write-Host $Message -ForegroundColor Yellow }
        "cyan" { Write-Host $Message -ForegroundColor Cyan }
        "blue" { Write-Host $Message -ForegroundColor Blue }
        "magenta" { Write-Host $Message -ForegroundColor Magenta }
        "gray" { Write-Host $Message -ForegroundColor Gray }
        default { Write-Host $Message -ForegroundColor White }
    }
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "     Enhanced Worktree Operations Manager" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Find-OptimalAgent {
    param([int]$IssueNum)
    
    Write-ColorOutput "🔍 Finding optimal agent for Issue #$IssueNum..." "Cyan"
    
    $bestAgent = $null
    $bestScore = 0
    
    foreach ($agentName in $agentConfig.Keys) {
        $agent = $agentConfig[$agentName]
        
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
            
            # Bonus points for skills/specialties (could be enhanced with issue analysis)
            $score += 10
            
            Write-ColorOutput "  ✅ $($agent.name): In range (Score: $score)" "Green"
            
            if ($score -gt $bestScore) {
                $bestScore = $score
                $bestAgent = $agentName
            }
        } else {
            Write-ColorOutput "  ❌ $($agent.name): Outside range" "Gray"
        }
    }
    
    return $bestAgent
}

function Get-AgentStatus {
    param([string]$AgentName)
    
    if (-not $agentConfig.ContainsKey($AgentName)) {
        Write-ColorOutput "❌ Unknown agent: $AgentName" "Red"
        return $null
    }
    
    $agent = $agentConfig[$AgentName]
    $workTreePath = Join-Path $PWD $agent.workTreePath
    
    $status = @{
        AgentName = $AgentName
        Name = $agent.name
        AgentType = $agent.agentType
        WorkTreePath = $agent.workTreePath
        WorkTreeExists = Test-Path $workTreePath
        CurrentBranch = $null
        IssueRanges = $agent.issueRanges
        Skills = $agent.skills
        Specialties = $agent.specialties
        MaxConcurrentIssues = $agent.maxConcurrentIssues
    }
    
    # Get current branch if worktree exists
    if ($status.WorkTreeExists) {
        try {
            Push-Location $workTreePath -ErrorAction SilentlyContinue
            $status.CurrentBranch = git branch --show-current 2>$null
            Pop-Location
        } catch {
            $status.CurrentBranch = "Unknown"
        }
    }
    
    return $status
}

function Show-AgentStatus {
    param([string]$AgentName)
    
    $status = Get-AgentStatus $AgentName
    if (-not $status) { return }
    
    $color = if ($AgentName -like "*1*" -or $AgentName -eq "chris") { "Cyan" } else { "Magenta" }
    
    Write-ColorOutput "=== $($status.Name) ($($status.AgentType)) ===" $color
    Write-ColorOutput "Work Tree: $($status.WorkTreePath)" "White"
    Write-ColorOutput "Branch Prefix: $($status.branchPrefix)" "White"
    Write-ColorOutput "Issue Ranges: $($status.IssueRanges -join ', ')" "White"
    Write-ColorOutput "Max Concurrent Issues: $($status.MaxConcurrentIssues)" "White"
    
    if ($status.WorkTreeExists) {
        Write-ColorOutput "✅ Work Tree: EXISTS" "Green"
        Write-ColorOutput "Current Branch: $($status.CurrentBranch)" "White"
    } else {
        Write-ColorOutput "❌ Work Tree: NOT FOUND" "Red"
    }
    
    if ($Detailed) {
        Write-ColorOutput "Skills: $($status.Skills -join ', ')" "Gray"
        Write-ColorOutput "Specialties: $($status.Specialties -join ', ')" "Gray"
    }
    
    Write-ColorOutput ""
}

function Switch-ToAgentWorkTree {
    param([string]$AgentName)
    
    $agent = $agentConfig[$AgentName]
    if (-not $agent) {
        Write-ColorOutput "❌ Unknown agent: $AgentName" "Red"
        return $false
    }
    
    $workTreePath = Join-Path $PWD $agent.workTreePath
    
    if (-not (Test-Path $workTreePath)) {
        Write-ColorOutput "❌ Work tree not found: $workTreePath" "Red"
        Write-ColorOutput "💡 Use 'create' operation to create the worktree first" "Yellow"
        return $false
    }
    
    Write-ColorOutput "🔄 Switching to $($agent.name)'s work tree..." "Yellow"
    Write-ColorOutput "Path: $workTreePath" "White"
    
    if ($DryRun) {
        Write-ColorOutput "[DRY RUN] Would switch to: $workTreePath" "Cyan"
        return $true
    }
    
    try {
        Set-Location $workTreePath
        Write-ColorOutput "✅ Switched to $($agent.name)'s work tree" "Green"
        
        $currentBranch = git branch --show-current 2>$null
        Write-ColorOutput "Current Branch: $currentBranch" "White"
        
        return $true
    } catch {
        Write-ColorOutput "❌ Failed to switch to work tree: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Assign-IssueToAgent {
    param([string]$AgentName, [int]$IssueNum)
    
    $agent = $agentConfig[$AgentName]
    if (-not $agent) {
        Write-ColorOutput "❌ Unknown agent: $AgentName" "Red"
        return $false
    }
    
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
    
    if (-not $inRange) {
        Write-ColorOutput "⚠️  Issue #$IssueNum is outside $AgentName's assigned range" "Yellow"
        Write-ColorOutput "Agent Range: $($agent.issueRanges -join ', ')" "White"
        if (-not $Force) {
            return $false
        } else {
            Write-ColorOutput "🔄 Force mode enabled - proceeding anyway" "Yellow"
        }
    }
    
    Write-ColorOutput "🎯 Assigning Issue #$IssueNum to $($agent.name)" "Green"
    Write-ColorOutput "   Agent Type: $($agent.agentType)" "White"
    Write-ColorOutput "   Work Tree: $($agent.workTreePath)" "White"
    Write-ColorOutput "   Branch Prefix: $($agent.branchPrefix)" "White"
    
    # Switch to agent's work tree
    if (Switch-ToAgentWorkTree $AgentName) {
        Write-ColorOutput "✅ $($agent.name) is now ready to work on Issue #$IssueNum" "Green"
        
        # Update work tree state if state file exists
        $statePath = Join-Path (Split-Path -Parent $PWD) "worktree-state.json"
        if (Test-Path $statePath) {
            try {
                $state = Get-Content $statePath | ConvertFrom-Json
                $state.agents.$AgentName.currentIssue = $IssueNum
                $state.agents.$AgentName.lastActivity = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
                $state | ConvertTo-Json -Depth 10 | Set-Content $statePath
                Write-ColorOutput "📝 Updated worktree state" "Gray"
            } catch {
                Write-ColorOutput "⚠️  Could not update worktree state: $($_.Exception.Message)" "Yellow"
            }
        }
        
        return $true
    } else {
        return $false
    }
}

function Create-AgentWorkTree {
    param([string]$AgentName)
    
    $agent = $agentConfig[$AgentName]
    if (-not $agent) {
        Write-ColorOutput "❌ Unknown agent: $AgentName" "Red"
        return $false
    }
    
    $workTreePath = Join-Path $PWD $agent.workTreePath
    
    if (Test-Path $workTreePath) {
        Write-ColorOutput "✅ Work tree already exists: $workTreePath" "Green"
        return $true
    }
    
    Write-ColorOutput "🔧 Creating work tree for $($agent.name)..." "Yellow"
    Write-ColorOutput "Path: $workTreePath" "White"
    
    if ($DryRun) {
        Write-ColorOutput "[DRY RUN] Would create worktree: $workTreePath" "Cyan"
        return $true
    }
    
    try {
        # Create worktree from develop branch
        git worktree add $workTreePath develop
        Write-ColorOutput "✅ Created work tree for $($agent.name)" "Green"
        return $true
    } catch {
        Write-ColorOutput "❌ Failed to create work tree: $($_.Exception.Message)" "Red"
        return $false
    }
}

function List-AllWorkTrees {
    Write-ColorOutput "📋 All Agent Worktrees" "Blue"
    Write-ColorOutput "=" * 40 "Blue"
    Write-ColorOutput ""
    
    foreach ($agentName in $agentConfig.Keys) {
        Show-AgentStatus $agentName
    }
    
    # Also show system worktrees
    Write-ColorOutput "🔍 System Worktree Status:" "Yellow"
    try {
        $worktrees = git worktree list
        if ($worktrees) {
            $worktrees | ForEach-Object { Write-ColorOutput "  $_" "Gray" }
        } else {
            Write-ColorOutput "  No worktrees found" "Gray"
        }
    } catch {
        Write-ColorOutput "  Could not list worktrees: $($_.Exception.Message)" "Red"
    }
    Write-ColorOutput ""
}

function Sync-AgentWorkTrees {
    Write-ColorOutput "🔄 Syncing all agent worktrees..." "Yellow"
    
    foreach ($agentName in $agentConfig.Keys) {
        $agent = $agentConfig[$agentName]
        $workTreePath = Join-Path $PWD $agent.workTreePath
        
        if (Test-Path $workTreePath) {
            Write-ColorOutput "🔄 Syncing $($agent.name)..." "Cyan"
            
            if ($DryRun) {
                Write-ColorOutput "[DRY RUN] Would sync: $workTreePath" "Gray"
            } else {
                try {
                    Push-Location $workTreePath
                    git checkout develop
                    git pull origin develop
                    Pop-Location
                    Write-ColorOutput "✅ Synced $($agent.name)" "Green"
                } catch {
                    Write-ColorOutput "❌ Failed to sync $($agent.name): $($_.Exception.Message)" "Red"
                    Pop-Location -ErrorAction SilentlyContinue
                }
            }
        } else {
            Write-ColorOutput "⚠️  Work tree not found for $($agent.name): $workTreePath" "Yellow"
        }
    }
}

function Cleanup-AgentWorkTrees {
    Write-ColorOutput "🧹 Cleaning up agent worktrees..." "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "[DRY RUN] Would clean up worktrees" "Cyan"
        return
    }
    
    foreach ($agentName in $agentConfig.Keys) {
        $agent = $agentConfig[$agentName]
        $workTreePath = Join-Path $PWD $agent.workTreePath
        
        if (Test-Path $workTreePath) {
            Write-ColorOutput "🧹 Cleaning $($agent.name) worktree..." "Cyan"
            
            try {
                # Remove worktree
                git worktree remove $workTreePath --force
                Write-ColorOutput "✅ Removed $($agent.name) worktree" "Green"
            } catch {
                Write-ColorOutput "❌ Failed to remove $($agent.name) worktree: $($_.Exception.Message)" "Red"
            }
        }
    }
}

function Show-Help {
    Write-ColorOutput "🛠️ Enhanced Worktree Operations Manager Help" "Blue"
    Write-ColorOutput "=" * 50 "Blue"
    Write-ColorOutput ""
    
    Write-ColorOutput "Available Operations:" "White"
    Write-ColorOutput "  assign       Assign an issue to the optimal agent and switch to their worktree" "Green"
    Write-ColorOutput "  switch       Switch to a specific agent's worktree" "Cyan"
    Write-ColorOutput "  status       Show status of all agent worktrees" "Blue"
    Write-ColorOutput "  create       Create worktree for a specific agent" "Yellow"
    Write-ColorOutput "  list         List all worktrees (same as status)" "Blue"
    Write-ColorOutput "  sync         Sync all agent worktrees with main branch" "Magenta"
    Write-ColorOutput "  cleanup      Remove all agent worktrees" "Red"
    Write-ColorOutput "  help         Show this help message" "Blue"
    Write-ColorOutput ""
    
    Write-ColorOutput "Parameters:" "White"
    Write-ColorOutput "  -IssueNumber <number>  Issue number to assign" "Gray"
    Write-ColorOutput "  -Agent <name>          Agent name (chris, jason, agent1, agent2, auto)" "Gray"
    Write-ColorOutput "  -DryRun               Preview actions without executing" "Gray"
    Write-ColorOutput "  -Force                Force operation even if constraints are violated" "Gray"
    Write-ColorOutput "  -Detailed             Show detailed information" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "Examples:" "White"
    Write-ColorOutput "  .\manage-worktree-operations-enhanced.ps1 -Operation assign -IssueNumber 250" "Gray"
    Write-ColorOutput "  .\manage-worktree-operations-enhanced.ps1 -Operation switch -Agent chris" "Gray"
    Write-ColorOutput "  .\manage-worktree-operations-enhanced.ps1 -Operation status -Detailed" "Gray"
    Write-ColorOutput "  .\manage-worktree-operations-enhanced.ps1 -Operation create -Agent agent1" "Gray"
    Write-ColorOutput "  .\manage-worktree-operations-enhanced.ps1 -Operation sync -DryRun" "Gray"
    Write-ColorOutput ""
}

# Main execution
Show-Banner

Write-ColorOutput "Operation: $Operation" "White"
if ($IssueNumber) { Write-ColorOutput "Issue: #$IssueNumber" "White" }
if ($Agent -ne "auto") { Write-ColorOutput "Agent: $Agent" "White" }
if ($DryRun) { Write-ColorOutput "Mode: Dry Run" "Yellow" }
if ($Force) { Write-ColorOutput "Mode: Force" "Red" }
if ($Detailed) { Write-ColorOutput "Mode: Detailed" "Cyan" }
Write-ColorOutput ""

switch ($Operation) {
    "assign" {
        if (-not $IssueNumber) {
            Write-ColorOutput "❌ Issue number required for assign operation" "Red"
            Write-ColorOutput "Usage: -Operation assign -IssueNumber <number>" "Yellow"
            exit 1
        }
        
        if ($Agent -eq "auto") {
            $Agent = Find-OptimalAgent $IssueNumber
            if (-not $Agent) {
                Write-ColorOutput "❌ No suitable agent found for Issue #$IssueNumber" "Red"
                exit 1
            }
            Write-ColorOutput "🏆 Auto-selected agent: $($agentConfig[$Agent].name)" "Green"
        }
        
        $success = Assign-IssueToAgent $Agent $IssueNumber
        if (-not $success) {
            exit 1
        }
    }
    "switch" {
        if ($Agent -eq "auto") {
            Write-ColorOutput "❌ Agent name required for switch operation" "Red"
            Write-ColorOutput "Usage: -Operation switch -Agent <agent-name>" "Yellow"
            exit 1
        }
        
        $success = Switch-ToAgentWorkTree $Agent
        if (-not $success) {
            exit 1
        }
    }
    "status" {
        List-AllWorkTrees
    }
    "list" {
        List-AllWorkTrees
    }
    "create" {
        if ($Agent -eq "auto") {
            Write-ColorOutput "❌ Agent name required for create operation" "Red"
            Write-ColorOutput "Usage: -Operation create -Agent <agent-name>" "Yellow"
            exit 1
        }
        
        $success = Create-AgentWorkTree $Agent
        if (-not $success) {
            exit 1
        }
    }
    "sync" {
        Sync-AgentWorkTrees
    }
    "cleanup" {
        if (-not $Force) {
            Write-ColorOutput "⚠️  This will remove all agent worktrees!" "Red"
            Write-ColorOutput "Use -Force to confirm this action" "Yellow"
            exit 1
        }
        Cleanup-AgentWorkTrees
    }
    "help" {
        Show-Help
    }
    default {
        Write-ColorOutput "❌ Unknown operation: $Operation" "Red"
        Show-Help
        exit 1
    }
}

Write-ColorOutput ""
Write-ColorOutput "✅ Enhanced worktree operation completed!" "Green"
