# Multi-Agent Work Tree System
# Usage: .\scripts\multi-agent-worktree-system.ps1 -Operation <OPERATION> [-Agent <AGENT>] [-Options <OPTIONS>]
#
# Manages isolated work trees for parallel agent development with conflict prevention

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("setup", "create", "destroy", "list", "assign", "sync", "status", "cleanup")]
    [string]$Operation,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("agent-frontend", "agent-content", "agent-infra", "agent-docs", "agent-backend")]
    [string]$Agent,
    
    [Parameter(Mandatory=$false)]
    [string]$Options = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$Force,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [string]$ConfigFile = "worktree-config.json"
)

# Import shared utilities
$sharedPath = Join-Path $PSScriptRoot "shared\github-utils.ps1"
if (Test-Path $sharedPath) {
    . $sharedPath
} else {
    Write-Error "Shared utilities not found at $sharedPath"
    exit 1
}

# Agent configuration based on existing area mappings
$agentConfig = @{
    "agent-frontend" = @{
        Name = "Frontend Agent"
        Description = "Handles Portfolio Site and Dashboard frontend issues"
        Areas = @("Frontend")
        Apps = @("Portfolio Site", "Dashboard")
        MaxConcurrent = 3
        WorkTreePath = "worktrees/agent-frontend"
        BranchPrefix = "feat/frontend"
        Priority = "P1"
        IssueRanges = @(150, 160, 196, 208)  # Dashboard + Blog issues
    }
    "agent-content" = @{
        Name = "Content Agent"
        Description = "Handles blog, articles, and publishing features"
        Areas = @("Content")
        Apps = @("Portfolio Site")
        MaxConcurrent = 2
        WorkTreePath = "worktrees/agent-content"
        BranchPrefix = "feat/content"
        Priority = "P1"
        IssueRanges = @(196, 208)  # Blog issues
    }
    "agent-infra" = @{
        Name = "Infrastructure Agent"
        Description = "Handles CI/CD, deployment, and infrastructure"
        Areas = @("Infra")
        Apps = @("Portfolio Site", "Dashboard")
        MaxConcurrent = 1
        WorkTreePath = "worktrees/agent-infra"
        BranchPrefix = "feat/infra"
        Priority = "P1"
        IssueRanges = @(170, 179)  # Infrastructure issues
    }
    "agent-docs" = @{
        Name = "Documentation Agent"
        Description = "Handles documentation and DX tooling"
        Areas = @("DX Tooling")
        Apps = @("Docs")
        MaxConcurrent = 1
        WorkTreePath = "worktrees/agent-docs"
        BranchPrefix = "feat/docs"
        Priority = "P2"
        IssueRanges = @(180, 190)  # Documentation issues
    }
    "agent-backend" = @{
        Name = "Backend Agent"
        Description = "Handles API, database, and backend services"
        Areas = @("Backend")
        Apps = @("Portfolio Site", "Dashboard")
        MaxConcurrent = 2
        WorkTreePath = "worktrees/agent-backend"
        BranchPrefix = "feat/backend"
        Priority = "P1"
        IssueRanges = @(200, 220)  # Backend issues (example range)
    }
}

# Global work tree state tracking
$stateFile = "worktree-state.json"
$stateLock = "worktree-state.lock"

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "        Multi-Agent Work Tree System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Get-WorkTreeState {
    if (Test-Path $stateFile) {
        try {
            return Get-Content $stateFile -Raw | ConvertFrom-Json
        } catch {
            Write-ColorOutput "Warning: Could not read state file, creating new state" "Yellow"
            return @{
                Agents = @{}
                GlobalLock = $null
                LastSync = $null
            }
        }
    }
    return @{
        Agents = @{}
        GlobalLock = $null
        LastSync = $null
    }
}

function Set-WorkTreeState {
    param($State)
    
    # Create lock to prevent concurrent state updates
    $lockPath = Join-Path $PWD $stateLock
    $maxWait = 30
    $waited = 0
    
    while ((Test-Path $lockPath) -and ($waited -lt $maxWait)) {
        Start-Sleep -Seconds 1
        $waited++
    }
    
    if (Test-Path $lockPath) {
        throw "Could not acquire state lock after $maxWait seconds"
    }
    
    try {
        New-Item -Path $lockPath -ItemType File -Force | Out-Null
        $State | ConvertTo-Json -Depth 10 | Set-Content $stateFile -Encoding UTF8
    } finally {
        Remove-Item $lockPath -Force -ErrorAction SilentlyContinue
    }
}

function Test-WorkTreeExists {
    param([string]$AgentName)
    
    $config = $agentConfig[$AgentName]
    if (-not $config) {
        return $false
    }
    
    $workTreePath = Join-Path $PWD $config.WorkTreePath
    return Test-Path $workTreePath
}

function Initialize-WorkTreeSystem {
    Write-ColorOutput "🚀 Initializing Multi-Agent Work Tree System" "Green"
    Write-ColorOutput ""
    
    # Create worktrees directory
    $workTreesDir = Join-Path $PWD "worktrees"
    if (-not (Test-Path $workTreesDir)) {
        New-Item -Path $workTreesDir -ItemType Directory -Force | Out-Null
        Write-ColorOutput "✅ Created worktrees directory" "Green"
    }
    
    # Initialize state file
    $initialState = @{
        Agents = @{}
        GlobalLock = $null
        LastSync = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        SystemInitialized = $true
    }
    
    foreach ($agentName in $agentConfig.Keys) {
        $initialState.Agents[$agentName] = @{
            Status = "inactive"
            CurrentIssue = $null
            WorkTreePath = $agentConfig[$agentName].WorkTreePath
            LastActivity = $null
            ActiveBranches = @()
            LockedIssues = @()
        }
    }
    
    Set-WorkTreeState $initialState
    Write-ColorOutput "✅ Initialized agent state tracking" "Green"
    
    # Create .gitignore entries for worktrees
    $gitignorePath = Join-Path $PWD ".gitignore"
    $gitignoreContent = Get-Content $gitignorePath -Raw -ErrorAction SilentlyContinue
    
    if ($gitignoreContent -notmatch "worktrees/") {
        Add-Content -Path $gitignorePath -Value "`n# Multi-Agent Work Trees`nworktrees/`nworktree-state.json`nworktree-state.lock" -Encoding UTF8
        Write-ColorOutput "✅ Updated .gitignore for work tree isolation" "Green"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "🎯 System ready for multi-agent parallel development!" "Cyan"
}

function Create-AgentWorkTree {
    param([string]$AgentName)
    
    $config = $agentConfig[$AgentName]
    if (-not $config) {
        throw "Unknown agent: $AgentName"
    }
    
    Write-ColorOutput "🏗️  Creating work tree for $($config.Name)" "Green"
    
    $workTreePath = Join-Path $PWD $config.WorkTreePath
    $branchName = "$($config.BranchPrefix)/agent-setup"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would create work tree at: $workTreePath" "Cyan"
        Write-ColorOutput "  [DRY RUN] Would use branch: $branchName" "Cyan"
        return $true
    }
    
    try {
        # Ensure we're on develop and up to date
        git checkout develop 2>$null
        git pull origin develop 2>$null
        
        # Create work tree
        git worktree add $workTreePath $branchName 2>$null
        
        # If branch doesn't exist, create it from develop
        if ($LASTEXITCODE -ne 0) {
            git checkout -b $branchName develop
            git worktree add $workTreePath $branchName
        }
        
        Write-ColorOutput "✅ Created work tree: $workTreePath" "Green"
        
        # Update agent state
        $state = Get-WorkTreeState
        $state.Agents[$AgentName].Status = "active"
        $state.Agents[$AgentName].LastActivity = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Set-WorkTreeState $state
        
        return $true
    } catch {
        Write-ColorOutput "❌ Failed to create work tree: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Assign-IssueToAgent {
    param([string]$AgentName, [int]$IssueNumber)
    
    $config = $agentConfig[$AgentName]
    if (-not $config) {
        throw "Unknown agent: $AgentName"
    }
    
    Write-ColorOutput "🎯 Assigning Issue #$IssueNumber to $($config.Name)" "Green"
    
    # Check if work tree exists
    if (-not (Test-WorkTreeExists $AgentName)) {
        Write-ColorOutput "⚠️  Work tree does not exist for $AgentName. Creating..." "Yellow"
        if (-not (Create-AgentWorkTree $AgentName)) {
            return $false
        }
    }
    
    # Verify issue is in agent's range
    $inRange = $false
    for ($i = 0; $i -lt $config.IssueRanges.Count; $i += 2) {
        $start = $config.IssueRanges[$i]
        $end = $config.IssueRanges[$i + 1]
        if ($IssueNumber -ge $start -and $IssueNumber -le $end) {
            $inRange = $true
            break
        }
    }
    
    if (-not $inRange) {
        Write-ColorOutput "⚠️  Issue #$IssueNumber is outside $AgentName's assigned range" "Yellow"
        if (-not $Force) {
            Write-ColorOutput "Use -Force to override range check" "Gray"
            return $false
        }
    }
    
    # Check for conflicts
    $state = Get-WorkTreeState
    foreach ($agent in $state.Agents.Keys) {
        if ($state.Agents[$agent].LockedIssues -contains $IssueNumber) {
            Write-ColorOutput "❌ Issue #$IssueNumber is already assigned to $agent" "Red"
            return $false
        }
    }
    
    # Assign issue
    $state.Agents[$AgentName].CurrentIssue = $IssueNumber
    $state.Agents[$AgentName].LockedIssues += $IssueNumber
    $state.Agents[$AgentName].LastActivity = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Set-WorkTreeState $state
    
    Write-ColorOutput "✅ Issue #$IssueNumber assigned to $($config.Name)" "Green"
    Write-ColorOutput "   Work tree: $($config.WorkTreePath)" "White"
    Write-ColorOutput "   Branch prefix: $($config.BranchPrefix)" "White"
    
    return $true
}

function Get-AgentStatus {
    param([string]$AgentName = $null)
    
    $state = Get-WorkTreeState
    
    if ($AgentName) {
        if (-not $state.Agents.ContainsKey($AgentName)) {
            Write-ColorOutput "❌ Unknown agent: $AgentName" "Red"
            return
        }
        
        $agentState = $state.Agents[$AgentName]
        $config = $agentConfig[$AgentName]
        
        Write-ColorOutput "🤖 $($config.Name) Status:" "Cyan"
        Write-ColorOutput "   Status: $($agentState.Status)" "White"
        Write-ColorOutput "   Current Issue: $($agentState.CurrentIssue)" "White"
        Write-ColorOutput "   Work Tree: $($agentState.WorkTreePath)" "White"
        Write-ColorOutput "   Last Activity: $($agentState.LastActivity)" "White"
        Write-ColorOutput "   Locked Issues: $($agentState.LockedIssues -join ', ')" "White"
        Write-ColorOutput "   Active Branches: $($agentState.ActiveBranches -join ', ')" "White"
    } else {
        Write-ColorOutput "🤖 Multi-Agent System Status:" "Cyan"
        Write-ColorOutput ""
        
        foreach ($agentName in $agentConfig.Keys) {
            $agentState = $state.Agents[$agentName]
            $config = $agentConfig[$agentName]
            $status = if ($agentState.Status -eq "active") { "🟢" } else { "🔴" }
            
            Write-ColorOutput "$status $($config.Name)" "White"
            Write-ColorOutput "   Issue: $($agentState.CurrentIssue)" "Gray"
            Write-ColorOutput "   Work Tree: $(if (Test-WorkTreeExists $agentName) { '✅' } else { '❌' })" "Gray"
            Write-ColorOutput ""
        }
        
        Write-ColorOutput "📊 System Summary:" "Yellow"
        Write-ColorOutput "   Last Sync: $($state.LastSync)" "White"
        Write-ColorOutput "   Global Lock: $($state.GlobalLock)" "White"
    }
}

function Sync-AgentWorkTrees {
    Write-ColorOutput "🔄 Syncing all agent work trees with develop" "Green"
    
    $state = Get-WorkTreeState
    
    foreach ($agentName in $agentConfig.Keys) {
        $config = $agentConfig[$agentName]
        $workTreePath = Join-Path $PWD $config.WorkTreePath
        
        if (Test-Path $workTreePath) {
            Write-ColorOutput "   Syncing $($config.Name)..." "Yellow"
            
            try {
                # Switch to work tree directory and sync
                Push-Location $workTreePath
                git fetch origin develop
                git merge origin/develop --no-edit
                Pop-Location
                
                Write-ColorOutput "   ✅ $($config.Name) synced" "Green"
            } catch {
                Write-ColorOutput "   ❌ Failed to sync $($config.Name): $($_.Exception.Message)" "Red"
                Pop-Location
            }
        }
    }
    
    $state.LastSync = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Set-WorkTreeState $state
    
    Write-ColorOutput "✅ All work trees synced" "Green"
}

function Cleanup-WorkTrees {
    param([switch]$Force)
    
    Write-ColorOutput "🧹 Cleaning up work trees" "Green"
    
    $state = Get-WorkTreeState
    
    foreach ($agentName in $agentConfig.Keys) {
        $config = $agentConfig[$agentName]
        $workTreePath = Join-Path $PWD $config.WorkTreePath
        
        if (Test-Path $workTreePath) {
            if ($Force -or (Read-Host "Remove work tree for $($config.Name)? (y/N)") -eq 'y') {
                try {
                    git worktree remove $workTreePath --force
                    Write-ColorOutput "   ✅ Removed $($config.Name) work tree" "Green"
                    
                    $state.Agents[$agentName].Status = "inactive"
                    $state.Agents[$agentName].CurrentIssue = $null
                    $state.Agents[$agentName].LockedIssues = @()
                } catch {
                    Write-ColorOutput "   ❌ Failed to remove $($config.Name): $($_.Exception.Message)" "Red"
                }
            }
        }
    }
    
    Set-WorkTreeState $state
}

# Main execution
try {
    Show-Banner
    
    switch ($Operation) {
        "setup" {
            Initialize-WorkTreeSystem
        }
        "create" {
            if (-not $Agent) {
                Write-ColorOutput "❌ Agent name required for create operation" "Red"
                Write-ColorOutput "Available agents: $($agentConfig.Keys -join ', ')" "Yellow"
                exit 1
            }
            Create-AgentWorkTree $Agent
        }
        "assign" {
            if (-not $Agent -or -not $Options) {
                Write-ColorOutput "❌ Agent name and issue number required for assign operation" "Red"
                Write-ColorOutput "Usage: -Agent <agent-name> -Options <issue-number>" "Yellow"
                exit 1
            }
            $issueNumber = [int]$Options
            Assign-IssueToAgent $Agent $issueNumber
        }
        "status" {
            Get-AgentStatus $Agent
        }
        "sync" {
            Sync-AgentWorkTrees
        }
        "list" {
            Get-AgentStatus
        }
        "cleanup" {
            Cleanup-WorkTrees $Force
        }
        "destroy" {
            if (-not $Agent) {
                Write-ColorOutput "❌ Agent name required for destroy operation" "Red"
                exit 1
            }
            $config = $agentConfig[$Agent]
            $workTreePath = Join-Path $PWD $config.WorkTreePath
            if (Test-Path $workTreePath) {
                git worktree remove $workTreePath --force
                Write-ColorOutput "✅ Destroyed work tree for $($config.Name)" "Green"
            }
        }
    }
} catch {
    Write-ColorOutput "❌ Operation failed: $($_.Exception.Message)" "Red"
    exit 1
}
