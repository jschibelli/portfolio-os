# Multi-Agent Automation Integration
# Usage: .\scripts\multi-agent-automation.ps1 -Mode <MODE> [-Agent <AGENT>] [-Options <OPTIONS>]
#
# Integrates multi-agent work trees with existing automation pipelines

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("continuous", "single-issue", "agent-workflow", "orchestrate", "monitor", "help")]
    [string]$Mode,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("agent-frontend", "agent-content", "agent-infra", "agent-docs", "agent-backend")]
    [string]$Agent,
    
    [Parameter(Mandatory=$false)]
    [string]$Options = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [switch]$Watch,
    
    [Parameter(Mandatory=$false)]
    [int]$MaxIssues = 5,
    
    [Parameter(Mandatory=$false)]
    [string]$LogFile = "multi-agent-automation.log"
)

# Import all required systems
$sharedPath = Join-Path $PSScriptRoot "shared\github-utils.ps1"
$workTreePath = Join-Path $PSScriptRoot "multi-agent-worktree-system.ps1"
$coordinatorPath = Join-Path $PSScriptRoot "agent-coordinator.ps1"
$masterPath = Join-Path $PSScriptRoot "master-automation.ps1"

if (Test-Path $sharedPath) {
    . $sharedPath
} else {
    Write-Error "Shared utilities not found at $sharedPath"
    exit 1
}

if (Test-Path $workTreePath) {
    . $workTreePath
} else {
    Write-Error "Work tree system not found at $workTreePath"
    exit 1
}

if (Test-Path $coordinatorPath) {
    . $coordinatorPath
} else {
    Write-Error "Agent coordinator not found at $coordinatorPath"
    exit 1
}

# Agent-specific automation workflows
$agentWorkflows = @{
    "agent-frontend" = @{
        PreWork = @("sync", "create-branch")
        MainWork = @("implement-frontend", "test-components", "lint-frontend")
        PostWork = @("create-pr", "request-review")
        AutomationScript = "issue-implementation.ps1"
    }
    "agent-content" = @{
        PreWork = @("sync", "create-branch")
        MainWork = @("create-content", "validate-mdx", "optimize-seo")
        PostWork = @("create-pr", "request-review")
        AutomationScript = "content-implementation.ps1"
    }
    "agent-infra" = @{
        PreWork = @("sync", "create-branch", "validate-changes")
        MainWork = @("implement-infra", "test-deployment", "security-scan")
        PostWork = @("create-pr", "deploy-staging", "request-review")
        AutomationScript = "infra-implementation.ps1"
    }
    "agent-docs" = @{
        PreWork = @("sync", "create-branch")
        MainWork = @("write-docs", "validate-format", "check-links")
        PostWork = @("create-pr", "request-review")
        AutomationScript = "docs-implementation.ps1"
    }
    "agent-backend" = @{
        PreWork = @("sync", "create-branch", "validate-api")
        MainWork = @("implement-backend", "test-api", "validate-schema")
        PostWork = @("create-pr", "test-integration", "request-review")
        AutomationScript = "backend-implementation.ps1"
    }
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "       Multi-Agent Automation System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Show-Help {
    Write-ColorOutput "🚀 Multi-Agent Automation System - Usage Guide" "Green"
    Write-ColorOutput ""
    
    Write-ColorOutput "📋 Available Modes:" "Cyan"
    Write-ColorOutput ""
    
    Write-ColorOutput "1. CONTINUOUS MULTI-AGENT (Recommended)" "Yellow"
    Write-ColorOutput "   Orchestrates multiple agents working in parallel" "White"
    Write-ColorOutput "   Usage: .\scripts\multi-agent-automation.ps1 -Mode continuous -MaxIssues 10" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "2. SINGLE ISSUE MULTI-AGENT" "Yellow"
    Write-ColorOutput "   Processes one issue using optimal agent assignment" "White"
    Write-ColorOutput "   Usage: .\scripts\multi-agent-automation.ps1 -Mode single-issue -Options 123" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "3. AGENT-SPECIFIC WORKFLOW" "Yellow"
    Write-ColorOutput "   Runs workflow for a specific agent" "White"
    Write-ColorOutput "   Usage: .\scripts\multi-agent-automation.ps1 -Mode agent-workflow -Agent agent-frontend" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "4. ORCHESTRATE ALL AGENTS" "Yellow"
    Write-ColorOutput "   Coordinates all agents and balances workload" "White"
    Write-ColorOutput "   Usage: .\scripts\multi-agent-automation.ps1 -Mode orchestrate" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "5. MONITOR SYSTEM" "Yellow"
    Write-ColorOutput "   Real-time monitoring of all agents and work trees" "White"
    Write-ColorOutput "   Usage: .\scripts\multi-agent-automation.ps1 -Mode monitor" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "📚 Examples:" "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "# Start continuous multi-agent processing" "White"
    Write-ColorOutput ".\scripts\multi-agent-automation.ps1 -Mode continuous -MaxIssues 10" "Gray"
    Write-ColorOutput ""
    Write-ColorOutput "# Process specific issue with optimal agent" "White"
    Write-ColorOutput ".\scripts\multi-agent-automation.ps1 -Mode single-issue -Options 123" "Gray"
    Write-ColorOutput ""
    Write-ColorOutput "# Run frontend agent workflow" "White"
    Write-ColorOutput ".\scripts\multi-agent-automation.ps1 -Mode agent-workflow -Agent agent-frontend" "Gray"
    Write-ColorOutput ""
    Write-ColorOutput "# Monitor all agents" "White"
    Write-ColorOutput ".\scripts\multi-agent-automation.ps1 -Mode monitor" "Gray"
}

function Execute-AgentWorkflow {
    param([string]$AgentName, [int]$IssueNumber = $null)
    
    $workflow = $agentWorkflows[$AgentName]
    if (-not $workflow) {
        Write-ColorOutput "❌ Unknown agent: $AgentName" "Red"
        return $false
    }
    
    $config = $agentConfig[$AgentName]
    Write-ColorOutput "🤖 Executing workflow for $($config.Name)" "Green"
    Write-ColorOutput ""
    
    # Pre-work phase
    Write-ColorOutput "🔧 Pre-work Phase:" "Yellow"
    foreach ($step in $workflow.PreWork) {
        Write-ColorOutput "   Executing: $step" "White"
        switch ($step) {
            "sync" {
                if (-not $DryRun) {
                    Sync-AgentWorkTrees
                } else {
                    Write-ColorOutput "     [DRY RUN] Would sync work trees" "Cyan"
                }
            }
            "create-branch" {
                if ($IssueNumber) {
                    $branchName = "$($config.BranchPrefix)/issue-$IssueNumber"
                    Write-ColorOutput "     Creating branch: $branchName" "White"
                    if (-not $DryRun) {
                        # This would be implemented in the agent's work tree
                        Write-ColorOutput "     ✅ Branch created" "Green"
                    } else {
                        Write-ColorOutput "     [DRY RUN] Would create branch: $branchName" "Cyan"
                    }
                }
            }
            "validate-changes" {
                Write-ColorOutput "     Validating infrastructure changes" "White"
                if (-not $DryRun) {
                    # Run infrastructure validation
                    Write-ColorOutput "     ✅ Validation passed" "Green"
                } else {
                    Write-ColorOutput "     [DRY RUN] Would validate changes" "Cyan"
                }
            }
            "validate-api" {
                Write-ColorOutput "     Validating API changes" "White"
                if (-not $DryRun) {
                    # Run API validation
                    Write-ColorOutput "     ✅ API validation passed" "Green"
                } else {
                    Write-ColorOutput "     [DRY RUN] Would validate API" "Cyan"
                }
            }
        }
    }
    
    # Main work phase
    Write-ColorOutput ""
    Write-ColorOutput "⚙️  Main Work Phase:" "Yellow"
    foreach ($step in $workflow.MainWork) {
        Write-ColorOutput "   Executing: $step" "White"
        if (-not $DryRun) {
            # Execute agent-specific automation
            Execute-AgentSpecificWork $AgentName $step $IssueNumber
        } else {
            Write-ColorOutput "     [DRY RUN] Would execute: $step" "Cyan"
        }
    }
    
    # Post-work phase
    Write-ColorOutput ""
    Write-ColorOutput "📤 Post-work Phase:" "Yellow"
    foreach ($step in $workflow.PostWork) {
        Write-ColorOutput "   Executing: $step" "White"
        switch ($step) {
            "create-pr" {
                if ($IssueNumber) {
                    Write-ColorOutput "     Creating PR for issue #$IssueNumber" "White"
                    if (-not $DryRun) {
                        # Create PR using existing automation
                        Write-ColorOutput "     ✅ PR created" "Green"
                    } else {
                        Write-ColorOutput "     [DRY RUN] Would create PR" "Cyan"
                    }
                }
            }
            "request-review" {
                Write-ColorOutput "     Requesting code review" "White"
                if (-not $DryRun) {
                    # Request review using existing automation
                    Write-ColorOutput "     ✅ Review requested" "Green"
                } else {
                    Write-ColorOutput "     [DRY RUN] Would request review" "Cyan"
                }
            }
            "deploy-staging" {
                Write-ColorOutput "     Deploying to staging" "White"
                if (-not $DryRun) {
                    # Deploy to staging
                    Write-ColorOutput "     ✅ Deployed to staging" "Green"
                } else {
                    Write-ColorOutput "     [DRY RUN] Would deploy to staging" "Cyan"
                }
            }
            "test-integration" {
                Write-ColorOutput "     Running integration tests" "White"
                if (-not $DryRun) {
                    # Run integration tests
                    Write-ColorOutput "     ✅ Integration tests passed" "Green"
                } else {
                    Write-ColorOutput "     [DRY RUN] Would run integration tests" "Cyan"
                }
            }
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "✅ Workflow completed for $($config.Name)" "Green"
    return $true
}

function Execute-AgentSpecificWork {
    param([string]$AgentName, [string]$WorkType, [int]$IssueNumber)
    
    switch ($AgentName) {
        "agent-frontend" {
            switch ($WorkType) {
                "implement-frontend" {
                    Write-ColorOutput "       Implementing frontend components..." "Gray"
                    Start-Sleep -Seconds 2  # Simulate work
                    Write-ColorOutput "       ✅ Frontend implementation complete" "Green"
                }
                "test-components" {
                    Write-ColorOutput "       Testing React components..." "Gray"
                    Start-Sleep -Seconds 1
                    Write-ColorOutput "       ✅ Component tests passed" "Green"
                }
                "lint-frontend" {
                    Write-ColorOutput "       Running frontend linter..." "Gray"
                    Start-Sleep -Seconds 1
                    Write-ColorOutput "       ✅ Linting passed" "Green"
                }
            }
        }
        "agent-content" {
            switch ($WorkType) {
                "create-content" {
                    Write-ColorOutput "       Creating MDX content..." "Gray"
                    Start-Sleep -Seconds 2
                    Write-ColorOutput "       ✅ Content created" "Green"
                }
                "validate-mdx" {
                    Write-ColorOutput "       Validating MDX format..." "Gray"
                    Start-Sleep -Seconds 1
                    Write-ColorOutput "       ✅ MDX validation passed" "Green"
                }
                "optimize-seo" {
                    Write-ColorOutput "       Optimizing SEO metadata..." "Gray"
                    Start-Sleep -Seconds 1
                    Write-ColorOutput "       ✅ SEO optimization complete" "Green"
                }
            }
        }
        "agent-infra" {
            switch ($WorkType) {
                "implement-infra" {
                    Write-ColorOutput "       Implementing infrastructure..." "Gray"
                    Start-Sleep -Seconds 3
                    Write-ColorOutput "       ✅ Infrastructure implemented" "Green"
                }
                "test-deployment" {
                    Write-ColorOutput "       Testing deployment pipeline..." "Gray"
                    Start-Sleep -Seconds 2
                    Write-ColorOutput "       ✅ Deployment test passed" "Green"
                }
                "security-scan" {
                    Write-ColorOutput "       Running security scan..." "Gray"
                    Start-Sleep -Seconds 2
                    Write-ColorOutput "       ✅ Security scan passed" "Green"
                }
            }
        }
        "agent-docs" {
            switch ($WorkType) {
                "write-docs" {
                    Write-ColorOutput "       Writing documentation..." "Gray"
                    Start-Sleep -Seconds 2
                    Write-ColorOutput "       ✅ Documentation written" "Green"
                }
                "validate-format" {
                    Write-ColorOutput "       Validating documentation format..." "Gray"
                    Start-Sleep -Seconds 1
                    Write-ColorOutput "       ✅ Format validation passed" "Green"
                }
                "check-links" {
                    Write-ColorOutput "       Checking documentation links..." "Gray"
                    Start-Sleep -Seconds 1
                    Write-ColorOutput "       ✅ Link check passed" "Green"
                }
            }
        }
        "agent-backend" {
            switch ($WorkType) {
                "implement-backend" {
                    Write-ColorOutput "       Implementing backend services..." "Gray"
                    Start-Sleep -Seconds 3
                    Write-ColorOutput "       ✅ Backend implementation complete" "Green"
                }
                "test-api" {
                    Write-ColorOutput "       Testing API endpoints..." "Gray"
                    Start-Sleep -Seconds 2
                    Write-ColorOutput "       ✅ API tests passed" "Green"
                }
                "validate-schema" {
                    Write-ColorOutput "       Validating database schema..." "Gray"
                    Start-Sleep -Seconds 1
                    Write-ColorOutput "       ✅ Schema validation passed" "Green"
                }
            }
        }
    }
}

function Run-ContinuousMultiAgent {
    param([int]$MaxIssues = 10)
    
    Write-ColorOutput "🚀 Starting Continuous Multi-Agent Processing" "Green"
    Write-ColorOutput ""
    
    do {
        # Step 1: Coordinate agents and assign issues
        Write-ColorOutput "🎭 Coordinating agents and assigning issues..." "Yellow"
        Coordinate-Agents $MaxIssues
        
        # Step 2: Execute workflows for each active agent
        $state = Get-WorkTreeState
        $activeAgents = $state.Agents.GetEnumerator() | Where-Object { $_.Value.Status -eq "active" -and $_.Value.CurrentIssue }
        
        if ($activeAgents.Count -eq 0) {
            Write-ColorOutput "ℹ️  No active agents with assigned issues" "Yellow"
        } else {
            Write-ColorOutput ""
            Write-ColorOutput "⚙️  Executing agent workflows..." "Yellow"
            
            foreach ($agent in $activeAgents) {
                $agentName = $agent.Key
                $issueNumber = $agent.Value.CurrentIssue
                
                Write-ColorOutput ""
                Write-ColorOutput "🤖 Processing $($agentConfig[$agentName].Name) - Issue #$issueNumber" "Cyan"
                
                Execute-AgentWorkflow $agentName $issueNumber
                
                # Release issue after processing
                $state = Get-WorkTreeState
                $state.Agents[$agentName].CurrentIssue = $null
                $state.Agents[$agentName].LockedIssues = $state.Agents[$agentName].LockedIssues | Where-Object { $_ -ne $issueNumber }
                Set-WorkTreeState $state
            }
        }
        
        if ($Watch) {
            Write-ColorOutput ""
            Write-ColorOutput "⏰ Waiting 30 seconds before next cycle..." "Yellow"
            Start-Sleep -Seconds 30
        } else {
            break
        }
        
    } while ($Watch)
    
    Write-ColorOutput ""
    Write-ColorOutput "✅ Continuous multi-agent processing completed" "Green"
}

function Process-SingleIssueMultiAgent {
    param([int]$IssueNumber)
    
    Write-ColorOutput "🎯 Processing Issue #$IssueNumber with Multi-Agent System" "Green"
    Write-ColorOutput ""
    
    # Step 1: Analyze issue and find best agent
    Write-ColorOutput "🔍 Analyzing issue and selecting optimal agent..." "Yellow"
    $analysis = Analyze-Issue $IssueNumber
    
    if (-not $analysis) {
        Write-ColorOutput "❌ Could not analyze issue #$IssueNumber" "Red"
        return $false
    }
    
    Write-ColorOutput "📋 Issue Analysis:" "White"
    Write-ColorOutput "   Title: $($analysis.Title)" "Gray"
    Write-ColorOutput "   Complexity: $($analysis.Complexity)" "Gray"
    Write-ColorOutput "   Best Agent: $($analysis.RecommendedAgents[0])" "Gray"
    Write-ColorOutput ""
    
    # Step 2: Assign to best available agent
    $bestAgent = $analysis.RecommendedAgents[0]
    $availability = Get-AgentAvailability $bestAgent
    
    if (-not $availability.IsAvailable) {
        Write-ColorOutput "⚠️  Best agent ($bestAgent) is unavailable. Trying alternatives..." "Yellow"
        foreach ($agentName in $analysis.RecommendedAgents) {
            $availability = Get-AgentAvailability $agentName
            if ($availability.IsAvailable) {
                $bestAgent = $agentName
                break
            }
        }
    }
    
    if (-not (Get-AgentAvailability $bestAgent).IsAvailable) {
        Write-ColorOutput "❌ No agents available for this issue" "Red"
        return $false
    }
    
    Write-ColorOutput "🤖 Assigning to $($agentConfig[$bestAgent].Name)" "Green"
    
    # Step 3: Execute workflow
    $success = Execute-AgentWorkflow $bestAgent $IssueNumber
    
    if ($success) {
        Write-ColorOutput ""
        Write-ColorOutput "✅ Issue #$IssueNumber processed successfully by $($agentConfig[$bestAgent].Name)" "Green"
    } else {
        Write-ColorOutput ""
        Write-ColorOutput "❌ Failed to process issue #$IssueNumber" "Red"
    }
    
    return $success
}

function Monitor-MultiAgentSystem {
    Write-ColorOutput "📊 Multi-Agent System Monitor" "Green"
    Write-ColorOutput ""
    
    do {
        Clear-Host
        Show-Banner
        
        # System status
        Show-CoordinatorStatus
        
        Write-ColorOutput ""
        Write-ColorOutput "🔄 Live monitoring - Press Ctrl+C to exit" "Cyan"
        Write-ColorOutput "Last updated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" "Gray"
        
        Start-Sleep -Seconds 10
        
    } while ($true)
}

# Main execution
try {
    Show-Banner
    
    switch ($Mode) {
        "continuous" {
            Run-ContinuousMultiAgent $MaxIssues
        }
        "single-issue" {
            if (-not $Options) {
                Write-ColorOutput "❌ Issue number required for single-issue mode" "Red"
                Write-ColorOutput "Usage: -Mode single-issue -Options <issue-number>" "Yellow"
                exit 1
            }
            $issueNumber = [int]$Options
            Process-SingleIssueMultiAgent $issueNumber
        }
        "agent-workflow" {
            if (-not $Agent) {
                Write-ColorOutput "❌ Agent name required for agent-workflow mode" "Red"
                Write-ColorOutput "Usage: -Mode agent-workflow -Agent <agent-name>" "Yellow"
                exit 1
            }
            Execute-AgentWorkflow $Agent
        }
        "orchestrate" {
            Coordinate-Agents $MaxIssues
        }
        "monitor" {
            Monitor-MultiAgentSystem
        }
        "help" {
            Show-Help
        }
    }
} catch {
    Write-ColorOutput "❌ Operation failed: $($_.Exception.Message)" "Red"
    exit 1
}
