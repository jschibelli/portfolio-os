# Multi-Agent System Orchestrator
# Usage: .\scripts\multi-agent-orchestrator.ps1 [-Action <ACTION>] [-Agent <AGENT>] [-IssueNumber <NUMBER>] [-PRNumber <NUMBER>] [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("setup", "assign", "process", "status", "conflicts", "merge", "all")]
    [string]$Action = "all",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("agent-frontend", "agent-backend", "agent-docs", "agent-testing", "agent-ai", "agent-default")]
    [string]$Agent = "",
    
    [Parameter(Mandatory=$false)]
    [string]$IssueNumber = "",
    
    [Parameter(Mandatory=$false)]
    [string]$PRNumber = "",
    
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
    Write-ColorOutput "        Multi-Agent System Orchestrator" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Initialize-MultiAgentSystem {
    Write-ColorOutput "Initializing Multi-Agent System..." "Yellow"
    
    # Step 1: Create agent labels
    Write-ColorOutput "1. Creating agent labels..." "White"
    & .\scripts\agent-identity-system.ps1 -Action create -DryRun:$DryRun
    
    # Step 2: Set up commit templates
    Write-ColorOutput "2. Setting up commit templates..." "White"
    & .\scripts\commit-templates.ps1 -Action create -DryRun:$DryRun
    
    # Step 3: Create project views
    Write-ColorOutput "3. Creating project views..." "White"
    & .\scripts\project-views-config.ps1 -Action create -DryRun:$DryRun
    
    # Step 4: Initialize workload tracking
    Write-ColorOutput "4. Initializing workload tracking..." "White"
    & .\scripts\agent-workload-manager.ps1 -Action status -DryRun:$DryRun
    
    Write-ColorOutput "✅ Multi-Agent System initialized!" "Green"
}

function Assign-WorkToAgent {
    param(
        [string]$IssueNumber,
        [string]$Agent
    )
    
    Write-ColorOutput "Assigning work to agent..." "Yellow"
    
    # Step 1: Auto-assign issue to agent
    Write-ColorOutput "1. Auto-assigning issue #$IssueNumber to $Agent..." "White"
    & .\scripts\agent-identity-system.ps1 -Action assign -IssueNumber $IssueNumber -Agent $Agent -DryRun:$DryRun
    
    # Step 2: Update workload tracking
    Write-ColorOutput "2. Updating workload tracking..." "White"
    & .\scripts\agent-workload-manager.ps1 -Action assign -IssueNumber $IssueNumber -Agent $Agent -DryRun:$DryRun
    
    # Step 3: Configure project fields
    Write-ColorOutput "3. Configuring project fields..." "White"
    & .\scripts\issue-config-unified.ps1 -IssueNumber $IssueNumber -Preset custom -AddToProject -DryRun:$DryRun
    
    Write-ColorOutput "✅ Work assigned successfully!" "Green"
}

function Process-AgentWork {
    param([string]$Agent)
    
    Write-ColorOutput "Processing work for $Agent..." "Yellow"
    
    # Step 1: Check agent status
    Write-ColorOutput "1. Checking agent status..." "White"
    & .\scripts\agent-workload-manager.ps1 -Action status -Agent $Agent -DryRun:$DryRun
    
    # Step 2: Check for conflicts
    Write-ColorOutput "2. Checking for conflicts..." "White"
    & .\scripts\merge-queue-system.ps1 -Action conflicts -PRNumber $PRNumber -DryRun:$DryRun
    
    # Step 3: Process merge queue
    Write-ColorOutput "3. Processing merge queue..." "White"
    & .\scripts\merge-queue-system.ps1 -Action process -DryRun:$DryRun
    
    Write-ColorOutput "✅ Agent work processed!" "Green"
}

function Show-SystemStatus {
    Write-ColorOutput "=== Multi-Agent System Status ===" "Blue"
    
    # Agent status
    Write-ColorOutput "Agent Status:" "White"
    & .\scripts\agent-workload-manager.ps1 -Action status -DryRun:$DryRun
    
    # Workload summary
    Write-ColorOutput "Workload Summary:" "White"
    & .\scripts\agent-workload-manager.ps1 -Action workload -DryRun:$DryRun
    
    # Merge queue status
    Write-ColorOutput "Merge Queue Status:" "White"
    & .\scripts\merge-queue-system.ps1 -Action status -DryRun:$DryRun
}

function Handle-Conflicts {
    param([string]$PRNumber)
    
    Write-ColorOutput "Handling conflicts for PR #$PRNumber..." "Yellow"
    
    # Check for conflicts
    $conflicts = & .\scripts\merge-queue-system.ps1 -Action conflicts -PRNumber $PRNumber -DryRun:$DryRun
    
    if ($conflicts) {
        Write-ColorOutput "Conflicts detected. Resolving..." "Yellow"
        
        # Add to merge queue for later processing
        & .\scripts\merge-queue-system.ps1 -Action add -PRNumber $PRNumber -Agent $Agent -DryRun:$DryRun
        
        Write-ColorOutput "PR added to merge queue for conflict resolution" "Green"
    } else {
        Write-ColorOutput "No conflicts detected" "Green"
    }
}

function Process-MergeQueue {
    Write-ColorOutput "Processing merge queue..." "Yellow"
    
    # Process the merge queue
    & .\scripts\merge-queue-system.ps1 -Action process -DryRun:$DryRun
    
    Write-ColorOutput "✅ Merge queue processed!" "Green"
}

function Main {
    Show-Banner
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    
    switch ($Action) {
        "setup" {
            Initialize-MultiAgentSystem
        }
        "assign" {
            if ($IssueNumber -and $Agent) {
                Assign-WorkToAgent -IssueNumber $IssueNumber -Agent $Agent
            } else {
                Write-ColorOutput "Please provide IssueNumber and Agent" "Red"
            }
        }
        "process" {
            if ($Agent) {
                Process-AgentWork -Agent $Agent
            } else {
                Write-ColorOutput "Please provide Agent to process work" "Red"
            }
        }
        "status" {
            Show-SystemStatus
        }
        "conflicts" {
            if ($PRNumber) {
                Handle-Conflicts -PRNumber $PRNumber
            } else {
                Write-ColorOutput "Please provide PRNumber to check conflicts" "Red"
            }
        }
        "merge" {
            Process-MergeQueue
        }
        "all" {
            Initialize-MultiAgentSystem
            Show-SystemStatus
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Multi-Agent System Orchestrator Complete!" "Green"
}

# Run the main function
Main
