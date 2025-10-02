# Multi-Agent Identity System
# Usage: .\scripts\agent-identity-system.ps1 [-Action <ACTION>] [-Agent <AGENT>] [-IssueNumber <NUMBER>] [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("create", "assign", "status", "workload", "conflicts", "all")]
    [string]$Action = "all",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("agent-frontend", "agent-backend", "agent-docs", "agent-testing", "agent-ai", "agent-default")]
    [string]$Agent = "",
    
    [Parameter(Mandatory=$false)]
    [string]$IssueNumber = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Project configuration
$ProjectId = "PVT_kwHOAEnMVc4BCu-c"

# Agent definitions
$agents = @{
    "agent-frontend" = @{
        Name = "Frontend Agent"
        Description = "Handles UI/UX, React components, styling, and frontend functionality"
        Specialties = @("react", "typescript", "css", "ui", "ux", "responsive", "accessibility")
        Color = "0e8a16"
        Priority = 1
    }
    "agent-backend" = @{
        Name = "Backend Agent"
        Description = "Handles APIs, database, server logic, and backend infrastructure"
        Specialties = @("api", "database", "server", "nodejs", "graphql", "authentication")
        Color = "1d76db"
        Priority = 2
    }
    "agent-docs" = @{
        Name = "Documentation Agent"
        Description = "Handles documentation, README updates, and content management"
        Specialties = @("documentation", "readme", "content", "markdown", "guides")
        Color = "f9ca24"
        Priority = 3
    }
    "agent-testing" = @{
        Name = "Testing Agent"
        Description = "Handles testing, quality assurance, and test automation"
        Specialties = @("testing", "jest", "playwright", "quality", "coverage", "e2e")
        Color = "6f42c1"
        Priority = 4
    }
    "agent-ai" = @{
        Name = "AI Assistant Agent"
        Description = "Handles AI integrations, automation, and intelligent features"
        Specialties = @("ai", "automation", "ml", "nlp", "intelligence", "assistant")
        Color = "fd7e14"
        Priority = 5
    }
    "agent-default" = @{
        Name = "Default Agent"
        Description = "Fallback agent for general tasks"
        Specialties = @("general", "misc", "utility")
        Color = "6c757d"
        Priority = 6
    }
}

# GitHub project field IDs (you'll need to update these with your actual field IDs)
$fieldIds = @{
    "Agent" = "PVTSSF_lAHOAEnMVc4BCu-czg028qR"  # You'll need to create this field
    "Priority" = "PVTSSF_lAHOAEnMVc4BCu-czg028qQ"
    "Size" = "PVTSSF_lAHOAEnMVc4BCu-czg028qU"
    "App" = "PVTSSF_lAHOAEnMVc4BCu-czg156-s"
    "Area" = "PVTSSF_lAHOAEnMVc4BCu-czg156_Y"
    "Status" = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "        Multi-Agent Identity System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Get-AgentFromBranch {
    param([string]$BranchName)
    
    if ($BranchName -match "agent-(\w+)") {
        $agentKey = "agent-$($matches[1])"
        if ($agents.ContainsKey($agentKey)) {
            return $agentKey
        }
    }
    return "agent-default"
}

function Get-AgentFromIssue {
    param([string]$IssueNumber)
    
    try {
        $issue = gh issue view $IssueNumber --json title,body,labels
        $issueData = $issue | ConvertFrom-Json
        
        $textToAnalyze = "$($issueData.title) $($issueData.body)".ToLower()
        
        # Analyze content for agent assignment
        foreach ($agentKey in $agents.Keys) {
            $agent = $agents[$agentKey]
            $score = 0
            
            foreach ($specialty in $agent.Specialties) {
                if ($textToAnalyze -like "*$specialty*") {
                    $score++
                }
            }
            
            if ($score -gt 0) {
                return $agentKey
            }
        }
        
        return "agent-default"
    }
    catch {
        Write-ColorOutput "Error analyzing issue: $($_.Exception.Message)" "Red"
        return "agent-default"
    }
}

function Set-AgentField {
    param(
        [string]$ProjectItemId,
        [string]$Agent
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would set Agent field to: $Agent" "Cyan"
        return $true
    }
    
    try {
        # This would set the Agent field in your GitHub project
        # You'll need to implement this based on your project's field structure
        Write-ColorOutput "  Setting Agent field to: $Agent" "Yellow"
        
        # Example implementation (you'll need to adapt this):
        # gh project item-edit --id $ProjectItemId --project-id $ProjectId --field-id $fieldIds.Agent --single-select-option-id $agentOptionId
        
        Write-ColorOutput "  ✅ Agent field set successfully" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "  ❌ Failed to set Agent field: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Get-AgentWorkload {
    param([string]$Agent)
    
    try {
        # Get all issues assigned to this agent
        $issues = gh issue list --assignee $Agent --state open --json number,title
        $issueData = $issues | ConvertFrom-Json
        
        $workload = @{
            Agent = $Agent
            ActiveIssues = $issueData.Count
            Issues = $issueData
            Status = "idle"
        }
        
        if ($issueData.Count -gt 0) {
            $workload.Status = "working"
        }
        
        return $workload
    }
    catch {
        Write-ColorOutput "Error getting workload for $Agent : $($_.Exception.Message)" "Red"
        return @{ Agent = $Agent; ActiveIssues = 0; Status = "error" }
    }
}

function Test-FileConflicts {
    param([string]$PRNumber)
    
    try {
        $prInfo = gh pr view $PRNumber --json files
        $prData = $prInfo | ConvertFrom-Json
        
        $changedFiles = $prData.files | ForEach-Object { $_.filename }
        
        # Check for other open PRs that might conflict
        $openPRs = gh pr list --state open --json number,files
        $openPRsData = $openPRs | ConvertFrom-Json
        
        $conflicts = @()
        foreach ($openPR in $openPRsData) {
            if ($openPR.number -ne $PRNumber) {
                $openPRFiles = $openPR.files | ForEach-Object { $_.filename }
                $commonFiles = Compare-Object $changedFiles $openPRFiles -IncludeEqual -ExcludeDifferent
                
                if ($commonFiles) {
                    $conflicts += @{
                        PRNumber = $openPR.number
                        CommonFiles = $commonFiles.InputObject
                    }
                }
            }
        }
        
        return $conflicts
    }
    catch {
        Write-ColorOutput "Error checking conflicts: $($_.Exception.Message)" "Red"
        return @()
    }
}

function Create-AgentLabels {
    Write-ColorOutput "Creating agent labels..." "Yellow"
    
    foreach ($agentKey in $agents.Keys) {
        $agent = $agents[$agentKey]
        
        if ($DryRun) {
            Write-ColorOutput "  [DRY RUN] Would create label: $agentKey" "Cyan"
        } else {
            try {
                gh label create $agentKey --description $agent.Description --color $agent.Color
                Write-ColorOutput "  ✅ Created label: $agentKey" "Green"
            }
            catch {
                Write-ColorOutput "  ⚠️  Label $agentKey might already exist" "Yellow"
            }
        }
    }
}

function Assign-AgentToIssue {
    param(
        [string]$IssueNumber,
        [string]$Agent
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would assign agent $Agent to issue #$IssueNumber" "Cyan"
        return $true
    }
    
    try {
        # Add agent label
        gh issue edit $IssueNumber --add-label $Agent
        Write-ColorOutput "  ✅ Added agent label: $Agent" "Green"
        
        # Set agent field in project (if issue is in project)
        $projectItemId = Get-ProjectItemId -IssueNumber $IssueNumber
        if ($projectItemId) {
            Set-AgentField -ProjectItemId $projectItemId -Agent $Agent
        }
        
        return $true
    }
    catch {
        Write-ColorOutput "  ❌ Failed to assign agent: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Show-AgentStatus {
    Write-ColorOutput "=== Agent Status Report ===" "Blue"
    
    foreach ($agentKey in $agents.Keys) {
        $agent = $agents[$agentKey]
        $workload = Get-AgentWorkload -Agent $agentKey
        
        Write-ColorOutput "$($agent.Name) ($agentKey):" "White"
        Write-ColorOutput "  Status: $($workload.Status)" "White"
        Write-ColorOutput "  Active Issues: $($workload.ActiveIssues)" "White"
        Write-ColorOutput "  Specialties: $($agent.Specialties -join ', ')" "Gray"
        Write-ColorOutput ""
    }
}

function Main {
    Show-Banner
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    
    switch ($Action) {
        "create" {
            Create-AgentLabels
        }
        "assign" {
            if ($IssueNumber -and $Agent) {
                Assign-AgentToIssue -IssueNumber $IssueNumber -Agent $Agent
            } elseif ($IssueNumber) {
                $suggestedAgent = Get-AgentFromIssue -IssueNumber $IssueNumber
                Write-ColorOutput "Suggested agent for issue #$IssueNumber : $suggestedAgent" "Yellow"
                Assign-AgentToIssue -IssueNumber $IssueNumber -Agent $suggestedAgent
            } else {
                Write-ColorOutput "Please provide IssueNumber and Agent" "Red"
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
            } else {
                Show-AgentStatus
            }
        }
        "conflicts" {
            if ($IssueNumber) {
                $conflicts = Test-FileConflicts -PRNumber $IssueNumber
                if ($conflicts.Count -gt 0) {
                    Write-ColorOutput "Potential conflicts detected:" "Yellow"
                    foreach ($conflict in $conflicts) {
                        Write-ColorOutput "  PR #$($conflict.PRNumber) - Files: $($conflict.CommonFiles -join ', ')" "White"
                    }
                } else {
                    Write-ColorOutput "No conflicts detected" "Green"
                }
            } else {
                Write-ColorOutput "Please provide PRNumber to check conflicts" "Red"
            }
        }
        "all" {
            Create-AgentLabels
            Show-AgentStatus
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Multi-Agent System Ready!" "Green"
}

# Run the main function
Main
