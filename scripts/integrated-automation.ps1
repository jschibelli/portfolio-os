# Integrated Automation System - Combines existing automation with multi-agent system
# Usage: .\scripts\integrated-automation.ps1 -IssueNumber <NUMBER> [-Action <ACTION>] [-Agent <AGENT>] [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("issue", "pr", "status", "all")]
    [string]$Action = "all",
    
    [Parameter(Mandatory=$false)]
    [string]$IssueNumber = "",
    
    [Parameter(Mandatory=$false)]
    [string]$PRNumber = "",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("agent-frontend", "agent-backend", "agent-docs", "agent-testing", "agent-ai", "agent-default")]
    [string]$Agent = "",
    
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
    Write-ColorOutput "        Integrated Automation System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Process-IssueWithAgent {
    param(
        [string]$IssueNumber,
        [string]$Agent
    )
    
    Write-ColorOutput "Processing issue #$IssueNumber with agent assignment..." "Yellow"
    
    # Step 1: Auto-assign agent if not specified
    if (-not $Agent) {
        Write-ColorOutput "1. Auto-assigning agent..." "White"
        $Agent = & .\scripts\agent-workload-manager.ps1 -Action assign -IssueNumber $IssueNumber -DryRun:$DryRun
        Write-ColorOutput "  Assigned to: $Agent" "Green"
    }
    
    # Step 2: Configure issue with existing automation
    Write-ColorOutput "2. Configuring issue with existing automation..." "White"
    & .\scripts\issue-config-unified.ps1 -IssueNumber $IssueNumber -Preset blog -AddToProject -DryRun:$DryRun
    
    # Step 3: Update agent workload tracking
    Write-ColorOutput "3. Updating agent workload..." "White"
    & .\scripts\agent-workload-manager.ps1 -Action status -Agent $Agent -DryRun:$DryRun
    
    # Step 4: Create branch from develop (existing automation)
    Write-ColorOutput "4. Creating branch from develop..." "White"
    & .\scripts\create-branch-from-develop.ps1 -IssueNumber $IssueNumber -DryRun:$DryRun
    
    Write-ColorOutput "âœ… Issue processing complete!" "Green"
}

function Process-PRWithAgent {
    param(
        [string]$PRNumber,
        [string]$Agent
    )
    
    Write-ColorOutput "Processing PR #$PRNumber with agent coordination..." "Yellow"
    
    # Step 1: Check for conflicts
    Write-ColorOutput "1. Checking for conflicts..." "White"
    $conflicts = & .\scripts\merge-queue-system.ps1 -Action conflicts -PRNumber $PRNumber -DryRun:$DryRun
    
    if ($conflicts) {
        Write-ColorOutput "  âš ï¸  Conflicts detected, adding to merge queue" "Yellow"
        & .\scripts\merge-queue-system.ps1 -Action add -PRNumber $PRNumber -Agent $Agent -DryRun:$DryRun
    } else {
        Write-ColorOutput "  âœ… No conflicts detected" "Green"
    }
    
    # Step 2: Run existing PR automation
    Write-ColorOutput "2. Running existing PR automation..." "White"
    & .\scripts\pr-automation-unified.ps1 -PRNumber $PRNumber -Action all -AutoFix -DryRun:$DryRun
    
    # Step 3: Update agent status
    Write-ColorOutput "3. Updating agent status..." "White"
    & .\scripts\agent-workload-manager.ps1 -Action status -Agent $Agent -DryRun:$DryRun
    
    Write-ColorOutput "âœ… PR processing complete!" "Green"
}

function Show-IntegratedStatus {
    Write-ColorOutput "=== Integrated System Status ===" "Blue"
    
    # Show agent status
    Write-ColorOutput "Agent Status:" "White"
    & .\scripts\agent-workload-manager.ps1 -Action status -DryRun:$DryRun
    
    # Show merge queue
    Write-ColorOutput "Merge Queue:" "White"
    & .\scripts\merge-queue-system.ps1 -Action status -DryRun:$DryRun
    
    # Show project status
    Write-ColorOutput "Project Status:" "White"
    & .\scripts\real-time-workflow-automation.ps1 -DryRun:$DryRun
}

function Main {
    Show-Banner
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    
    switch ($Action) {
        "issue" {
            if ($IssueNumber) {
                Process-IssueWithAgent -IssueNumber $IssueNumber -Agent $Agent
            } else {
                Write-ColorOutput "Please provide IssueNumber" "Red"
            }
        }
        "pr" {
            if ($PRNumber) {
                Process-PRWithAgent -PRNumber $PRNumber -Agent $Agent
            } else {
                Write-ColorOutput "Please provide PRNumber" "Red"
            }
        }
        "status" {
            Show-IntegratedStatus
        }
        "all" {
            Show-IntegratedStatus
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Integrated Automation Complete!" "Green"
}

# Run the main function
Main
