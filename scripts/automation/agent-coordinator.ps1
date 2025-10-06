# Agent Coordinator - Intelligent Issue Assignment and Work Flow Management
# Usage: .\scripts\agent-coordinator.ps1 -Operation <OPERATION> [-Target <TARGET>] [-Options <OPTIONS>]
#
# Coordinates multiple agents working in parallel, manages issue assignment, and prevents conflicts

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("auto-assign", "balance-load", "claim-issue", "release-issue", "coordinate", "status", "analyze")]
    [string]$Operation,
    
    [Parameter(Mandatory=$false)]
    [string]$Target = "",
    
    [Parameter(Mandatory=$false)]
    [string]$Options = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force,
    
    [Parameter(Mandatory=$false)]
    [int]$MaxIssues = 10,
    
    [Parameter(Mandatory=$false)]
    [string]$LogFile = "agent-coordinator.log"
)

# Enhanced agent coordinator with improved backend infrastructure
# Import shared utilities and work tree system with enhanced error handling

$sharedPath = Join-Path $PSScriptRoot "shared\github-utils.ps1"
$workTreePath = Join-Path $PSScriptRoot "multi-agent-worktree-system.ps1"

# Enhanced dependency validation
function Test-CoordinatorDependencies {
    $dependencies = @(
        @{ Path = $sharedPath; Name = "Shared Utilities" }
        @{ Path = $workTreePath; Name = "Work Tree System" }
    )
    
    $allValid = $true
    
    foreach ($dep in $dependencies) {
        if (Test-Path $dep.Path) {
            Write-ColorOutput "✓ $($dep.Name) found" "Green"
        } else {
            Write-ColorOutput "✗ $($dep.Name) not found at $($dep.Path)" "Red"
            $allValid = $false
        }
    }
    
    return $allValid
}

# Validate dependencies before proceeding
if (-not (Test-CoordinatorDependencies)) {
    Write-Error "Missing required dependencies. Please ensure all automation scripts are available."
    exit 1
}

# Import systems with enhanced error handling
try {
    . $sharedPath
    Write-ColorOutput "✓ Shared utilities loaded successfully" "Green"
} catch {
    Write-Error "Failed to load shared utilities: $($_.Exception.Message)"
    exit 1
}

try {
    . $workTreePath
    Write-ColorOutput "✓ Work tree system loaded successfully" "Green"
} catch {
    Write-Error "Failed to load work tree system: $($_.Exception.Message)"
    exit 1
}

# Agent capabilities and specializations
$agentCapabilities = @{
    "agent-frontend" = @{
        Skills = @("React", "Next.js", "TypeScript", "Tailwind", "UI/UX")
        Complexity = @("XS", "S", "M", "L")
        Dependencies = @("agent-backend")
        PreferredIssues = @("ui", "component", "layout", "styling", "frontend", "dashboard")
    }
    "agent-content" = @{
        Skills = @("MDX", "Content", "SEO", "Publishing", "Blog")
        Complexity = @("XS", "S", "M")
        Dependencies = @()
        PreferredIssues = @("blog", "article", "content", "publishing", "seo", "mdx")
    }
    "agent-infra" = @{
        Skills = @("CI/CD", "Docker", "Vercel", "GitHub Actions", "Security")
        Complexity = @("S", "M", "L", "XL")
        Dependencies = @()
        PreferredIssues = @("deploy", "ci", "cd", "infra", "security", "docker")
    }
    "agent-docs" = @{
        Skills = @("Documentation", "Markdown", "API Docs", "Guides")
        Complexity = @("XS", "S", "M")
        Dependencies = @()
        PreferredIssues = @("docs", "documentation", "guide", "readme", "api")
    }
    "agent-backend" = @{
        Skills = @("Node.js", "API", "Database", "Prisma", "GraphQL")
        Complexity = @("S", "M", "L", "XL")
        Dependencies = @()
        PreferredIssues = @("api", "database", "backend", "server", "graphql")
    }
}

# Issue complexity scoring
$complexityScores = @{
    "XS" = 1
    "S" = 2
    "M" = 3
    "L" = 5
    "XL" = 8
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "            Agent Coordinator System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Get-AgentWorkload {
    param([string]$AgentName)
    
    $state = Get-WorkTreeState
    $agentState = $state.Agents[$AgentName]
    
    if (-not $agentState) {
        return 0
    }
    
    # Calculate workload based on current issues and complexity
    $workload = 0
    foreach ($issueNumber in $agentState.LockedIssues) {
        try {
            $issue = gh issue view $issueNumber --json labels,title -q .
            $size = "M"  # Default size
            
            # Try to determine size from labels
            foreach ($label in $issue.labels) {
                if ($label.name -match "^(XS|S|M|L|XL)$") {
                    $size = $label.name
                    break
                }
            }
            
            $workload += $complexityScores[$size]
        } catch {
            $workload += 3  # Default to Medium complexity
        }
    }
    
    return $workload
}

function Get-AgentAvailability {
    param([string]$AgentName)
    
    $config = $agentConfig[$AgentName]
    $currentWorkload = Get-AgentWorkload $AgentName
    $maxWorkload = $complexityScores[$config.MaxConcurrent] * 3  # Rough estimate
    
    return @{
        IsAvailable = $currentWorkload -lt $maxWorkload
        CurrentLoad = $currentWorkload
        MaxLoad = $maxWorkload
        LoadPercentage = [math]::Round(($currentWorkload / $maxLoad) * 100, 1)
    }
}

function Analyze-Issue {
    param([int]$IssueNumber)
    
    try {
        $issue = gh issue view $IssueNumber --json title,body,labels,assignees -q .
        
        $analysis = @{
            IssueNumber = $IssueNumber
            Title = $issue.title
            Body = $issue.body
            Labels = $issue.labels.name
            Complexity = "M"  # Default
            RecommendedAgents = @()
            Score = @{}
        }
        
        # Analyze complexity from labels
        foreach ($label in $issue.labels) {
            if ($label.name -match "^(XS|S|M|L|XL)$") {
                $analysis.Complexity = $label.name
                break
            }
        }
        
        # Score each agent for this issue
        $titleLower = $issue.title.ToLower()
        $bodyLower = $issue.body.ToLower()
        $combinedText = "$titleLower $bodyLower"
        
        foreach ($agentName in $agentCapabilities.Keys) {
            $score = 0
            $capabilities = $agentCapabilities[$agentName]
            
            # Check if agent can handle this complexity
            if ($capabilities.Complexity -contains $analysis.Complexity) {
                $score += 10
            }
            
            # Check for preferred keywords
            foreach ($keyword in $capabilities.PreferredIssues) {
                if ($combinedText -match $keyword) {
                    $score += 5
                }
            }
            
            # Check for skill keywords
            foreach ($skill in $capabilities.Skills) {
                if ($combinedText -match $skill.ToLower()) {
                    $score += 3
                }
            }
            
            # Penalize if agent is overloaded
            $availability = Get-AgentAvailability $agentName
            if (-not $availability.IsAvailable) {
                $score -= 20
            } elseif ($availability.LoadPercentage -gt 70) {
                $score -= 10
            }
            
            $analysis.Score[$agentName] = $score
        }
        
        # Sort agents by score
        $analysis.RecommendedAgents = $analysis.Score.GetEnumerator() | 
            Sort-Object Value -Descending | 
            Select-Object -First 3 | 
            ForEach-Object { $_.Key }
        
        return $analysis
    } catch {
        Write-ColorOutput "❌ Failed to analyze issue #$IssueNumber : $($_.Exception.Message)" "Red"
        return $null
    }
}

function Auto-AssignIssues {
    param([int]$MaxIssues = 10)
    
    Write-ColorOutput "🎯 Auto-assigning issues to optimal agents" "Green"
    Write-ColorOutput ""
    
    try {
        # Get unassigned issues from project
        $issues = gh project item-list "PVT_kwHOAEnMVc4BCu-c" --format json --owner jschibelli --number 1 | ConvertFrom-Json
        
        $assignedCount = 0
        $skippedCount = 0
        
        foreach ($item in $issues.items | Select-Object -First $MaxIssues) {
            $issueNumber = [int]$item.content.number
            
            # Skip if already assigned
            if ($item.assignees.Count -gt 0) {
                Write-ColorOutput "⏭️  Issue #$issueNumber already assigned, skipping" "Yellow"
                $skippedCount++
                continue
            }
            
            # Analyze issue
            $analysis = Analyze-Issue $issueNumber
            if (-not $analysis) {
                $skippedCount++
                continue
            }
            
            Write-ColorOutput "📋 Issue #$issueNumber : $($analysis.Title)" "White"
            Write-ColorOutput "   Complexity: $($analysis.Complexity)" "Gray"
            Write-ColorOutput "   Recommended: $($analysis.RecommendedAgents -join ', ')" "Gray"
            
            # Try to assign to best available agent
            $assigned = $false
            foreach ($agentName in $analysis.RecommendedAgents) {
                $availability = Get-AgentAvailability $agentName
                
                if ($availability.IsAvailable) {
                    Write-ColorOutput "   🤖 Assigning to $($agentConfig[$agentName].Name) (Score: $($analysis.Score[$agentName]))" "Cyan"
                    
                    if (-not $DryRun) {
                        if (Assign-IssueToAgent $agentName $issueNumber) {
                            $assigned = $true
                            $assignedCount++
                            break
                        }
                    } else {
                        Write-ColorOutput "   [DRY RUN] Would assign to $($agentConfig[$agentName].Name)" "Cyan"
                        $assigned = $true
                        $assignedCount++
                        break
                    }
                } else {
                    Write-ColorOutput "   ⚠️  $($agentConfig[$agentName].Name) unavailable (Load: $($availability.LoadPercentage)%)" "Yellow"
                }
            }
            
            if (-not $assigned) {
                Write-ColorOutput "   ❌ No available agents for this issue" "Red"
                $skippedCount++
            }
            
            Write-ColorOutput ""
        }
        
        Write-ColorOutput "📊 Assignment Summary:" "Green"
        Write-ColorOutput "   Assigned: $assignedCount" "Green"
        Write-ColorOutput "   Skipped: $skippedCount" "Yellow"
        Write-ColorOutput "   Total: $($assignedCount + $skippedCount)" "White"
        
    } catch {
        Write-ColorOutput "❌ Auto-assignment failed: $($_.Exception.Message)" "Red"
    }
}

function Balance-AgentLoad {
    Write-ColorOutput "⚖️  Balancing agent workload" "Green"
    Write-ColorOutput ""
    
    $agentLoads = @{}
    
    # Calculate current loads
    foreach ($agentName in $agentConfig.Keys) {
        $availability = Get-AgentAvailability $agentName
        $agentLoads[$agentName] = $availability
        
        Write-ColorOutput "🤖 $($agentConfig[$agentName].Name)" "White"
        Write-ColorOutput "   Load: $($availability.CurrentLoad)/$($availability.MaxLoad) ($($availability.LoadPercentage)%)" "Gray"
        Write-ColorOutput "   Status: $(if ($availability.IsAvailable) { 'Available' } else { 'Overloaded' })" "Gray"
        Write-ColorOutput ""
    }
    
    # Identify overloaded agents
    $overloadedAgents = $agentLoads.GetEnumerator() | Where-Object { $_.Value.LoadPercentage -gt 80 }
    $availableAgents = $agentLoads.GetEnumerator() | Where-Object { $_.Value.IsAvailable }
    
    if ($overloadedAgents.Count -eq 0) {
        Write-ColorOutput "✅ All agents are within acceptable load limits" "Green"
        return
    }
    
    Write-ColorOutput "⚠️  Overloaded agents detected:" "Yellow"
    foreach ($agent in $overloadedAgents) {
        Write-ColorOutput "   $($agentConfig[$agent.Key].Name): $($agent.Value.LoadPercentage)%" "Red"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "💡 Consider redistributing work or creating additional agents" "Cyan"
}

function Coordinate-Agents {
    param([int]$MaxIssues = 10)
    
    Write-ColorOutput "🎭 Coordinating multi-agent workflow" "Green"
    Write-ColorOutput ""
    
    # Step 1: Sync all work trees
    Write-ColorOutput "1️⃣  Syncing work trees..." "Yellow"
    Sync-AgentWorkTrees
    Write-ColorOutput ""
    
    # Step 2: Balance workload
    Write-ColorOutput "2️⃣  Checking workload balance..." "Yellow"
    Balance-AgentLoad
    Write-ColorOutput ""
    
    # Step 3: Auto-assign new issues
    Write-ColorOutput "3️⃣  Auto-assigning new issues..." "Yellow"
    Auto-AssignIssues $MaxIssues
    Write-ColorOutput ""
    
    # Step 4: Show coordination status
    Write-ColorOutput "4️⃣  Final coordination status:" "Yellow"
    Get-AgentStatus
}

function Show-CoordinatorStatus {
    Write-ColorOutput "📊 Agent Coordinator Status" "Green"
    Write-ColorOutput ""
    
    # System overview
    $state = Get-WorkTreeState
    $activeAgents = 0
    $totalIssues = 0
    
    foreach ($agentName in $agentConfig.Keys) {
        $agentState = $state.Agents[$agentName]
        if ($agentState.Status -eq "active") {
            $activeAgents++
        }
        $totalIssues += $agentState.LockedIssues.Count
    }
    
    Write-ColorOutput "🏗️  System Overview:" "Cyan"
    Write-ColorOutput "   Active Agents: $activeAgents/$($agentConfig.Keys.Count)" "White"
    Write-ColorOutput "   Total Assigned Issues: $totalIssues" "White"
    Write-ColorOutput "   Last Sync: $($state.LastSync)" "White"
    Write-ColorOutput ""
    
    # Agent details
    foreach ($agentName in $agentConfig.Keys) {
        $config = $agentConfig[$agentName]
        $agentState = $state.Agents[$agentName]
        $availability = Get-AgentAvailability $agentName
        
        $status = if ($agentState.Status -eq "active") { "🟢" } else { "🔴" }
        $loadStatus = if ($availability.IsAvailable) { "✅" } else { "⚠️" }
        
        Write-ColorOutput "$status $($config.Name)" "White"
        Write-ColorOutput "   Work Tree: $(if (Test-WorkTreeExists $agentName) { '✅' } else { '❌' })" "Gray"
        Write-ColorOutput "   Load: $($availability.LoadPercentage)% $loadStatus" "Gray"
        Write-ColorOutput "   Issues: $($agentState.LockedIssues.Count)" "Gray"
        Write-ColorOutput "   Current: #$($agentState.CurrentIssue)" "Gray"
        Write-ColorOutput ""
    }
}

# Main execution
try {
    Show-Banner
    
    switch ($Operation) {
        "auto-assign" {
            Auto-AssignIssues $MaxIssues
        }
        "balance-load" {
            Balance-AgentLoad
        }
        "claim-issue" {
            if (-not $Target -or -not $Options) {
                Write-ColorOutput "❌ Agent name and issue number required" "Red"
                Write-ColorOutput "Usage: -Target <agent-name> -Options <issue-number>" "Yellow"
                exit 1
            }
            $issueNumber = [int]$Options
            Assign-IssueToAgent $Target $issueNumber
        }
        "coordinate" {
            Coordinate-Agents $MaxIssues
        }
        "status" {
            Show-CoordinatorStatus
        }
        "analyze" {
            if (-not $Target) {
                Write-ColorOutput "❌ Issue number required for analysis" "Red"
                exit 1
            }
            $issueNumber = [int]$Target
            $analysis = Analyze-Issue $issueNumber
            if ($analysis) {
                Write-ColorOutput "📋 Issue #$($analysis.IssueNumber) Analysis:" "Green"
                Write-ColorOutput "   Title: $($analysis.Title)" "White"
                Write-ColorOutput "   Complexity: $($analysis.Complexity)" "White"
                Write-ColorOutput "   Recommended Agents:" "White"
                foreach ($agentName in $analysis.RecommendedAgents) {
                    Write-ColorOutput "     $($agentConfig[$agentName].Name): $($analysis.Score[$agentName]) points" "Gray"
                }
            }
        }
    }
} catch {
    Write-ColorOutput "❌ Operation failed: $($_.Exception.Message)" "Red"
    exit 1
}
