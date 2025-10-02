# Quick Setup Script for Multi-Agent System
# Usage: .\scripts\setup-multi-agent-system.ps1 [-DryRun]

param(
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
    Write-ColorOutput "    Multi-Agent System Quick Setup" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Main {
    Show-Banner
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput "Setting up Multi-Agent System..." "Yellow"
    Write-ColorOutput ""
    
    # Step 1: Create agent labels
    Write-ColorOutput "Step 1: Creating agent labels..." "White"
    & .\scripts\agent-identity-system.ps1 -Action create -DryRun:$DryRun
    Write-ColorOutput ""
    
    # Step 2: Set up commit templates
    Write-ColorOutput "Step 2: Setting up commit templates..." "White"
    & .\scripts\commit-templates.ps1 -Action create -DryRun:$DryRun
    Write-ColorOutput ""
    
    # Step 3: Create project views
    Write-ColorOutput "Step 3: Creating project views..." "White"
    & .\scripts\project-views-config.ps1 -Action create -DryRun:$DryRun
    Write-ColorOutput ""
    
    # Step 4: Initialize workload tracking
    Write-ColorOutput "Step 4: Initializing workload tracking..." "White"
    & .\scripts\agent-workload-manager.ps1 -Action status -DryRun:$DryRun
    Write-ColorOutput ""
    
    # Step 5: Show system status
    Write-ColorOutput "Step 5: System status..." "White"
    & .\scripts\multi-agent-orchestrator.ps1 -Action status -DryRun:$DryRun
    Write-ColorOutput ""
    
    Write-ColorOutput "✅ Multi-Agent System setup complete!" "Green"
    Write-ColorOutput ""
    Write-ColorOutput "Next steps:" "Yellow"
    Write-ColorOutput "1. Review the user guide: docs/multi-agent-system-guide.md" "White"
    Write-ColorOutput "2. Test with: .\scripts\multi-agent-orchestrator.ps1 -Action status" "White"
    Write-ColorOutput "3. Assign work: .\scripts\multi-agent-orchestrator.ps1 -Action assign -IssueNumber <NUMBER>" "White"
    Write-ColorOutput ""
    Write-ColorOutput "Happy coding with your multi-agent system! 🚀" "Green"
}

# Run the main function
Main
