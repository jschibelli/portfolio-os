# Complete Agent Workflow - Makes agents actually work
# Usage: .\scripts\complete-agent-workflow.ps1 -IssueNumber <NUMBER> [-Agent <AGENT>] [-DryRun]

param(
    [Parameter(Mandatory=$true)]
    [string]$IssueNumber,
    
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
    Write-ColorOutput "        Complete Agent Workflow" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Main {
    Show-Banner
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput "Setting up complete agent workflow for issue #$IssueNumber..." "Yellow"
    
    # Step 1: Assign agent and configure issue
    Write-ColorOutput "1. Assigning agent and configuring issue..." "White"
    & .\scripts\enhanced-issue-config.ps1 -IssueNumber $IssueNumber -Agent $Agent -DryRun:$DryRun
    
    # Step 2: Create agent work environment
    Write-ColorOutput "2. Creating agent work environment..." "White"
    & .\scripts\agent-work-executor.ps1 -IssueNumber $IssueNumber -Agent $Agent -DryRun:$DryRun
    
    # Step 3: Display complete workflow instructions
    Write-ColorOutput ""
    Write-ColorOutput "=== COMPLETE AGENT WORKFLOW ===" "Blue"
    Write-ColorOutput ""
    Write-ColorOutput "ðŸŽ¯ AGENT IS NOW READY TO WORK!" "Green"
    Write-ColorOutput ""
    Write-ColorOutput "WORKFLOW STEPS:" "Yellow"
    Write-ColorOutput "1. âœ… Issue assigned to agent" "White"
    Write-ColorOutput "2. âœ… Agent work branch created" "White"
    Write-ColorOutput "3. âœ… Agent prompt generated" "White"
    Write-ColorOutput ""
    Write-ColorOutput "NEXT STEPS FOR AGENT:" "Yellow"
    Write-ColorOutput "1. Open the generated prompt file" "White"
    Write-ColorOutput "2. Copy the prompt to Cursor AI" "White"
    Write-ColorOutput "3. Let Cursor AI work as the agent" "White"
    Write-ColorOutput "4. AI will implement the solution" "White"
    Write-ColorOutput "5. AI will commit with proper format" "White"
    Write-ColorOutput "6. AI will push and create PR" "White"
    Write-ColorOutput ""
    Write-ColorOutput "AGENT WORKFLOW COMPLETE!" "Green"
    Write-ColorOutput "The agent is now ready to work on issue #$IssueNumber" "White"
}

# Run the main function
Main
