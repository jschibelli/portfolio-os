# Master Integration Script - Complete automation with multi-agent system
# Usage: .\scripts\master-automation.ps1 -IssueNumber <NUMBER> [-Action <ACTION>] [-Agent <AGENT>] [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("issue", "pr", "status", "setup", "all")]
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
    Write-ColorOutput "        Master Integration System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Setup-CompleteSystem {
    Write-ColorOutput "Setting up complete integrated system..." "Yellow"
    
    # Step 1: Initialize multi-agent system
    Write-ColorOutput "1. Initializing multi-agent system..." "White"
    & .\scripts\multi-agent-orchestrator.ps1 -Action setup -DryRun:$DryRun
    
    # Step 2: Create project views
    Write-ColorOutput "2. Creating project views..." "White"
    & .\scripts\project-views-config.ps1 -Action create -DryRun:$DryRun
    
    # Step 3: Test system integration
    Write-ColorOutput "3. Testing system integration..." "White"
    & .\scripts\agent-workload-manager.ps1 -Action status -DryRun:$DryRun
    
    Write-ColorOutput "âœ… Complete system setup finished!" "Green"
}

function Process-IssueComplete {
    param(
        [string]$IssueNumber,
        [string]$Agent
    )
    
    Write-ColorOutput "Processing issue #$IssueNumber with complete automation..." "Yellow"
    
    # Use enhanced issue configuration
    & .\scripts\enhanced-issue-config.ps1 -IssueNumber $IssueNumber -Agent $Agent -AddToProject -DryRun:$DryRun
    
    Write-ColorOutput "âœ… Complete issue processing finished!" "Green"
}

function Process-PRComplete {
    param(
        [string]$PRNumber,
        [string]$Agent
    )
    
    Write-ColorOutput "Processing PR #$PRNumber with complete automation..." "Yellow"
    
    # Use enhanced PR automation
    & .\scripts\enhanced-pr-automation.ps1 -PRNumber $PRNumber -Agent $Agent -Action all -AutoFix -DryRun:$DryRun
    
    Write-ColorOutput "âœ… Complete PR processing finished!" "Green"
}

function Show-CompleteStatus {
    Write-ColorOutput "=== Complete System Status ===" "Blue"
    
    # Multi-agent status
    Write-ColorOutput "Multi-Agent System:" "White"
    & .\scripts\multi-agent-orchestrator.ps1 -Action status -DryRun:$DryRun
    
    # Project workflow status
    Write-ColorOutput "Project Workflow:" "White"
    & .\scripts\real-time-workflow-automation.ps1 -DryRun:$DryRun
    
    # Merge queue status
    Write-ColorOutput "Merge Queue:" "White"
    & .\scripts\merge-queue-system.ps1 -Action status -DryRun:$DryRun
}

function Main {
    Show-Banner
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    
    switch ($Action) {
        "setup" {
            Setup-CompleteSystem
        }
        "issue" {
            if ($IssueNumber) {
                Process-IssueComplete -IssueNumber $IssueNumber -Agent $Agent
            } else {
                Write-ColorOutput "Please provide IssueNumber" "Red"
            }
        }
        "pr" {
            if ($PRNumber) {
                Process-PRComplete -PRNumber $PRNumber -Agent $Agent
            } else {
                Write-ColorOutput "Please provide PRNumber" "Red"
            }
        }
        "status" {
            Show-CompleteStatus
        }
        "all" {
            Show-CompleteStatus
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Master Integration System Complete!" "Green"
}

# Run the main function
Main
