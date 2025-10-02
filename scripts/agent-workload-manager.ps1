# Agent Workload Manager for Multi-Agent System
# Usage: .\scripts\agent-workload-manager.ps1 [-Action <ACTION>] [-Agent <AGENT>] [-IssueNumber <NUMBER>] [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("balance", "assign", "status", "workload", "capacity", "all")]
    [string]$Action = "all",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("agent-frontend", "agent-backend", "agent-docs", "agent-testing", "agent-ai", "agent-default")]
    [string]$Agent = "",
    
    [Parameter(Mandatory=$false)]
    [string]$IssueNumber = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Agent capacity limits
$agentCapacities = @{
    "agent-frontend" = @{ Max = 3; Current = 0; Status = "idle" }
    "agent-backend" = @{ Max = 2; Current = 0; Status = "idle" }
    "agent-docs" = @{ Max = 4; Current = 0; Status = "idle" }
    "agent-testing" = @{ Max = 2; Current = 0; Status = "idle" }
    "agent-ai" = @{ Max = 3; Current = 0; Status = "idle" }
    "agent-default" = @{ Max = 5; Current = 0; Status = "idle" }
}

# Workload tracking file
$workloadFile = "agent-workload.json"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "        Agent Workload Manager" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Get-AgentWorkload {
    param([string]$Agent)
    
    try {
        # Get all issues assigned to this agent
        $issues = gh issue list --assignee $Agent --state open --json number,title,labels,createdAt
        $issueData = $issues | ConvertFrom-Json
        
        $workload = @{
            Agent = $Agent
            ActiveIssues = $issueData.Count
            Issues = $issueData
            Status = "idle"
            Capacity = $agentCapacities[$Agent].Max
            Utilization = 0
            LastUpdate = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        }
        
        # Calculate utilization
        $workload.Utilization = [math]::Round(($issueData.Count / $agentCapacities[$Agent].Max) * 100, 2)
        
        # Determine status
        if ($issueData.Count -eq 0) {
            $workload.Status = "idle"
        } elseif ($issueData.Count -lt $agentCapacities[$Agent].Max) {
            $workload.Status = "working"
        } else {
            $workload.Status = "overloaded"
        }
        
        return $workload
    }
    catch {
        Write-ColorOutput "Error getting workload for $Agent : $($_.Exception.Message)" "Red"
        return @{ Agent = $Agent; ActiveIssues = 0; Status = "error"; Utilization = 0 }
    }
}

function Get-AllAgentWorkloads {
    $workloads = @()
    
    foreach ($agent in $agentCapacities.Keys) {
        $workload = Get-AgentWorkload -Agent $agent
        $workloads += $workload
    }
    
    return $workloads
}

function Save-WorkloadData {
    param([array]$Workloads)
    
    try {
        $workloadData = @{
            LastUpdate = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
            Agents = $Workloads
        }
        
        $workloadData | ConvertTo-Json -Depth 3 | Out-File -FilePath $workloadFile -Encoding UTF8
        return $true
    }
    catch {
        Write-ColorOutput "Error saving workload data: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Get-LeastLoadedAgent {
    $workloads = Get-AllAgentWorkloads
    
    # Filter agents that are not overloaded
    $availableAgents = $workloads | Where-Object { $_.Status -ne "overloaded" }
    
    if ($availableAgents.Count -eq 0) {
        return "agent-default"  # Fallback to default agent
    }
    
    # Sort by utilization and return the least loaded
    $leastLoaded = $availableAgents | Sort-Object Utilization | Select-Object -First 1
    
    return $leastLoaded.Agent
}

function Assign-IssueToAgent {
    param(
        [string]$IssueNumber,
        [string]$Agent
    )
    
    try {
        # Add agent label to issue
        gh issue edit $IssueNumber --add-label $Agent
        
        # Assign issue to agent (you'll need to implement this based on your setup)
        # gh issue edit $IssueNumber --assignee $Agent
        
        Write-ColorOutput "✅ Assigned issue #$IssueNumber to $Agent" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "❌ Failed to assign issue: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Auto-AssignIssue {
    param([string]$IssueNumber)
    
    try {
        # Get issue details
        $issue = gh issue view $IssueNumber --json title,body,labels
        $issueData = $issue | ConvertFrom-Json
        
        # Analyze issue content for agent assignment
        $textToAnalyze = "$($issueData.title) $($issueData.body)".ToLower()
        
        # Check for specific agent keywords
        $agentKeywords = @{
            "agent-frontend" = @("ui", "component", "react", "css", "styling", "responsive", "accessibility")
            "agent-backend" = @("api", "database", "server", "auth", "middleware", "service")
            "agent-docs" = @("documentation", "readme", "guide", "tutorial", "content")
            "agent-testing" = @("test", "testing", "coverage", "e2e", "unit", "integration")
            "agent-ai" = @("ai", "automation", "ml", "intelligence", "assistant", "bot")
        }
        
        $bestAgent = "agent-default"
        $maxScore = 0
        
        foreach ($agent in $agentKeywords.Keys) {
            $score = 0
            foreach ($keyword in $agentKeywords[$agent]) {
                if ($textToAnalyze -like "*$keyword*") {
                    $score++
                }
            }
            
            if ($score -gt $maxScore) {
                $maxScore = $score
                $bestAgent = $agent
            }
        }
        
        # Check if the best agent has capacity
        $workload = Get-AgentWorkload -Agent $bestAgent
        if ($workload.Status -eq "overloaded") {
            $bestAgent = Get-LeastLoadedAgent
        }
        
        # Assign the issue
        if ($DryRun) {
            Write-ColorOutput "  [DRY RUN] Would assign issue #$IssueNumber to $bestAgent" "Cyan"
        } else {
            Assign-IssueToAgent -IssueNumber $IssueNumber -Agent $bestAgent
        }
        
        return $bestAgent
    }
    catch {
        Write-ColorOutput "Error auto-assigning issue: $($_.Exception.Message)" "Red"
        return "agent-default"
    }
}

function Balance-Workload {
    $workloads = Get-AllAgentWorkloads
    
    Write-ColorOutput "=== Workload Balancing ===" "Blue"
    
    # Find overloaded agents
    $overloadedAgents = $workloads | Where-Object { $_.Status -eq "overloaded" }
    
    if ($overloadedAgents.Count -eq 0) {
        Write-ColorOutput "All agents are within capacity" "Green"
        return
    }
    
    foreach ($overloadedAgent in $overloadedAgents) {
        Write-ColorOutput "Agent $($overloadedAgent.Agent) is overloaded ($($overloadedAgent.ActiveIssues)/$($overloadedAgent.Capacity))" "Yellow"
        
        # Find least loaded agent
        $leastLoadedAgent = Get-LeastLoadedAgent
        
        if ($leastLoadedAgent -ne $overloadedAgent.Agent) {
            Write-ColorOutput "  Consider redistributing work to $leastLoadedAgent" "White"
            
            # This would require more complex logic to actually move issues
            # For now, we'll just report the recommendation
        }
    }
}

function Show-AgentStatus {
    $workloads = Get-AllAgentWorkloads
    
    Write-ColorOutput "=== Agent Status Report ===" "Blue"
    Write-ColorOutput ""
    
    foreach ($workload in $workloads) {
        $statusColor = switch ($workload.Status) {
            "idle" { "Green" }
            "working" { "Blue" }
            "overloaded" { "Red" }
            "error" { "Red" }
            default { "White" }
        }
        
        Write-ColorOutput "$($workload.Agent):" "White"
        Write-ColorOutput "  Status: $($workload.Status)" $statusColor
        Write-ColorOutput "  Active Issues: $($workload.ActiveIssues)/$($workload.Capacity)" "White"
        Write-ColorOutput "  Utilization: $($workload.Utilization)%" "White"
        Write-ColorOutput "  Last Update: $($workload.LastUpdate)" "Gray"
        Write-ColorOutput ""
    }
}

function Show-WorkloadSummary {
    $workloads = Get-AllAgentWorkloads
    
    $totalIssues = ($workloads | Measure-Object -Property ActiveIssues -Sum).Sum
    $totalCapacity = ($workloads | Measure-Object -Property Capacity -Sum).Sum
    $overallUtilization = [math]::Round(($totalIssues / $totalCapacity) * 100, 2)
    
    Write-ColorOutput "=== Workload Summary ===" "Blue"
    Write-ColorOutput "Total Active Issues: $totalIssues" "White"
    Write-ColorOutput "Total Capacity: $totalCapacity" "White"
    Write-ColorOutput "Overall Utilization: $overallUtilization%" "White"
    Write-ColorOutput ""
    
    # Show capacity utilization by agent
    foreach ($workload in $workloads) {
        $barLength = [math]::Round(($workload.Utilization / 100) * 20)
        $bar = "█" * $barLength + "░" * (20 - $barLength)
        
        Write-ColorOutput "$($workload.Agent): [$bar] $($workload.Utilization)%" "White"
    }
}

function Update-AgentStatus {
    param(
        [string]$Agent,
        [string]$Status
    )
    
    try {
        $workload = Get-AgentWorkload -Agent $Agent
        $workload.Status = $Status
        $workload.LastUpdate = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        
        # Save updated workload data
        $allWorkloads = Get-AllAgentWorkloads
        $allWorkloads = $allWorkloads | Where-Object { $_.Agent -ne $Agent }
        $allWorkloads += $workload
        
        if (-not $DryRun) {
            Save-WorkloadData -Workloads $allWorkloads
        }
        
        Write-ColorOutput "✅ Updated status for $Agent to $Status" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "❌ Failed to update agent status: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Main {
    Show-Banner
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    
    switch ($Action) {
        "balance" {
            Balance-Workload
        }
        "assign" {
            if ($IssueNumber) {
                $assignedAgent = Auto-AssignIssue -IssueNumber $IssueNumber
                Write-ColorOutput "Assigned issue #$IssueNumber to $assignedAgent" "Green"
            } else {
                Write-ColorOutput "Please provide IssueNumber" "Red"
            }
        }
        "status" {
            Show-AgentStatus
        }
        "workload" {
            if ($Agent) {
                $workload = Get-AgentWorkload -Agent $Agent
                Write-ColorOutput "Workload for $Agent :" "White"
                Write-ColorOutput "  Active Issues: $($workload.ActiveIssues)" "White"
                Write-ColorOutput "  Status: $($workload.Status)" "White"
                Write-ColorOutput "  Utilization: $($workload.Utilization)%" "White"
            } else {
                Show-WorkloadSummary
            }
        }
        "capacity" {
            Show-WorkloadSummary
        }
        "all" {
            Show-AgentStatus
            Show-WorkloadSummary
            Balance-Workload
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Agent Workload Manager Ready!" "Green"
}

# Run the main function
Main
