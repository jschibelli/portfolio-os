# Agent Work Executor - Makes agents actually work on issues
# Usage: .\scripts\agent-work-executor.ps1 -IssueNumber <NUMBER> [-Agent <AGENT>] [-DryRun]

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
    Write-ColorOutput "        Agent Work Executor" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Get-AgentInstructions {
    param([string]$Agent, [string]$IssueNumber)
    
    $instructions = @{
        "agent-frontend" = @"
You are the Frontend Agent. Your task is to work on issue #$IssueNumber.

INSTRUCTIONS:
1. Read the issue details carefully
2. Create a branch for this issue
3. Implement the frontend changes
4. Create a PR with proper conventional commits
5. Use the commit format: feat(ui): <description>
6. Include Agent: agent-frontend in commit trailers

WORKFLOW:
1. Checkout the issue branch
2. Analyze the requirements
3. Implement the solution
4. Test the changes
5. Commit with proper format
6. Push and create PR

Remember: You are working as agent-frontend. Be thorough and professional.
"@
        "agent-backend" = @"
You are the Backend Agent. Your task is to work on issue #$IssueNumber.

INSTRUCTIONS:
1. Read the issue details carefully
2. Create a branch for this issue
3. Implement the backend changes
4. Create a PR with proper conventional commits
5. Use the commit format: feat(api): <description>
6. Include Agent: agent-backend in commit trailers

WORKFLOW:
1. Checkout the issue branch
2. Analyze the requirements
3. Implement the solution
4. Test the changes
5. Commit with proper format
6. Push and create PR

Remember: You are working as agent-backend. Be thorough and professional.
"@
        "agent-docs" = @"
You are the Documentation Agent. Your task is to work on issue #$IssueNumber.

INSTRUCTIONS:
1. Read the issue details carefully
2. Create a branch for this issue
3. Implement the documentation changes
4. Create a PR with proper conventional commits
5. Use the commit format: docs: <description>
6. Include Agent: agent-docs in commit trailers

WORKFLOW:
1. Checkout the issue branch
2. Analyze the requirements
3. Implement the solution
4. Test the changes
5. Commit with proper format
6. Push and create PR

Remember: You are working as agent-docs. Be thorough and professional.
"@
        "agent-testing" = @"
You are the Testing Agent. Your task is to work on issue #$IssueNumber.

INSTRUCTIONS:
1. Read the issue details carefully
2. Create a branch for this issue
3. Implement the testing changes
4. Create a PR with proper conventional commits
5. Use the commit format: test: <description>
6. Include Agent: agent-testing in commit trailers

WORKFLOW:
1. Checkout the issue branch
2. Analyze the requirements
3. Implement the solution
4. Test the changes
5. Commit with proper format
6. Push and create PR

Remember: You are working as agent-testing. Be thorough and professional.
"@
        "agent-ai" = @"
You are the AI Agent. Your task is to work on issue #$IssueNumber.

INSTRUCTIONS:
1. Read the issue details carefully
2. Create a branch for this issue
3. Implement the AI/automation changes
4. Create a PR with proper conventional commits
5. Use the commit format: feat(ai): <description>
6. Include Agent: agent-ai in commit trailers

WORKFLOW:
1. Checkout the issue branch
2. Analyze the requirements
3. Implement the solution
4. Test the changes
5. Commit with proper format
6. Push and create PR

Remember: You are working as agent-ai. Be thorough and professional.
"@
    }
    
    return $instructions[$Agent]
}

function Create-AgentWorkBranch {
    param([string]$IssueNumber, [string]$Agent)
    
    $branchName = "agent-work/$Agent/issue-$IssueNumber"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would create branch: $branchName" "Cyan"
        return $branchName
    }
    
    try {
        # Create and checkout branch
        git checkout -b $branchName develop
        Write-ColorOutput "  âœ… Created branch: $branchName" "Green"
        return $branchName
    }
    catch {
        Write-ColorOutput "  âŒ Failed to create branch: $($_.Exception.Message)" "Red"
        return $null
    }
}

function Generate-AgentPrompt {
    param([string]$IssueNumber, [string]$Agent)
    
    # Get issue details
    $issue = gh issue view $IssueNumber --json title,body,labels
    $issueData = $issue | ConvertFrom-Json
    
    # Get agent instructions
    $instructions = Get-AgentInstructions -Agent $Agent -IssueNumber $IssueNumber
    
    $prompt = @"
# AGENT WORK PROMPT

## Issue Details
**Title:** $($issueData.title)
**Body:** $($issueData.body)
**Labels:** $($issueData.labels.name -join ', ')

## Agent Instructions
$instructions

## Your Task
Work on this issue as $Agent. Follow the workflow above and implement the solution.

## Commit Format
Use this exact format for your commits:
```
<type>(<scope>): <description>

<optional body>

Agent: $Agent
Issue: #$IssueNumber
```

## Next Steps
1. Read the issue carefully
2. Implement the solution
3. Test your changes
4. Commit with proper format
5. Push and create PR

You are now working as $Agent. Begin implementation.
"@
    
    return $prompt
}

function Main {
    Show-Banner
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput "Making agent work on issue #$IssueNumber..." "Yellow"
    
    # Step 1: Determine agent if not specified
    if (-not $Agent) {
        Write-ColorOutput "1. Auto-assigning agent..." "White"
        $Agent = & .\scripts\agent-workload-manager.ps1 -Action assign -IssueNumber $IssueNumber -DryRun:$DryRun
        Write-ColorOutput "  Assigned to: $Agent" "Green"
    }
    
    # Step 2: Create work branch
    Write-ColorOutput "2. Creating agent work branch..." "White"
    $branchName = Create-AgentWorkBranch -IssueNumber $IssueNumber -Agent $Agent
    
    if (-not $branchName) {
        Write-ColorOutput "âŒ Failed to create work branch" "Red"
        return
    }
    
    # Step 3: Generate agent prompt
    Write-ColorOutput "3. Generating agent work prompt..." "White"
    $prompt = Generate-AgentPrompt -IssueNumber $IssueNumber -Agent $Agent
    
    # Step 4: Save prompt for agent
    $promptFile = "agent-work-prompt-$IssueNumber.md"
    $prompt | Out-File -FilePath $promptFile -Encoding UTF8
    
    Write-ColorOutput "  âœ… Generated prompt: $promptFile" "Green"
    
    # Step 5: Display instructions for human agent
    Write-ColorOutput ""
    Write-ColorOutput "=== AGENT WORK INSTRUCTIONS ===" "Blue"
    Write-ColorOutput "Issue: #$IssueNumber" "White"
    Write-ColorOutput "Agent: $Agent" "White"
    Write-ColorOutput "Branch: $branchName" "White"
    Write-ColorOutput "Prompt file: $promptFile" "White"
    Write-ColorOutput ""
    Write-ColorOutput "NEXT STEPS:" "Yellow"
    Write-ColorOutput "1. Open the prompt file: $promptFile" "White"
    Write-ColorOutput "2. Copy the prompt to Cursor AI" "White"
    Write-ColorOutput "3. Let the AI agent work on the issue" "White"
    Write-ColorOutput "4. The AI will implement the solution" "White"
    Write-ColorOutput "5. Commit with proper format" "White"
    Write-ColorOutput "6. Push and create PR" "White"
    Write-ColorOutput ""
    Write-ColorOutput "The agent is now ready to work!" "Green"
}

# Run the main function
Main
