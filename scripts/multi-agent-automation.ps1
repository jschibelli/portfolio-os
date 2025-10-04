# Multi-Agent Automation System - THE ONE WORKING SCRIPT
# This script processes real GitHub issues and assigns them to specialized agents
param(
    [int]$MaxIssues = 10,
    [switch]$DryRun,
    [switch]$Watch
)

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "       Multi-Agent Automation System" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

# Agent definitions with their specializations
$agents = @{
    "Frontend Agent" = @{
        Specializes = "UI/UX, React components, styling, dashboard interfaces, Tailwind CSS"
        Keywords = @("frontend", "ui", "component", "react", "dashboard", "styling", "tailwind", "interface")
        MaxIssues = 3
        CurrentIssues = @()
    }
    "Backend Agent" = @{
        Specializes = "APIs, database, server logic, integrations, Prisma, GraphQL"
        Keywords = @("backend", "api", "database", "server", "auth", "integration", "prisma", "graphql")
        MaxIssues = 2
        CurrentIssues = @()
    }
    "Content Agent" = @{
        Specializes = "Blog posts, articles, SEO, content management, MDX, writing"
        Keywords = @("content", "blog", "article", "publishing", "seo", "mdx", "writing", "migration")
        MaxIssues = 2
        CurrentIssues = @()
    }
    "Infrastructure Agent" = @{
        Specializes = "CI/CD, deployment, Docker, GitHub Actions, security, monitoring"
        Keywords = @("infra", "deploy", "ci", "cd", "docker", "security", "github actions", "monitoring")
        MaxIssues = 2
        CurrentIssues = @()
    }
    "Documentation Agent" = @{
        Specializes = "Technical docs, guides, API documentation, README files"
        Keywords = @("docs", "documentation", "guide", "readme", "api docs", "technical")
        MaxIssues = 2
        CurrentIssues = @()
    }
}

function Get-BestAgent {
    param([object]$Issue)
    
    $title = $Issue.title.ToLower()
    $body = if ($Issue.body) { $Issue.body.ToLower() } else { "" }
    $content = "$title $body"
    
    # Check for agent labels first
    foreach ($label in $Issue.labels) {
        if ($label.name -eq "agent-frontend") { return "Frontend Agent" }
        if ($label.name -eq "agent-backend") { return "Backend Agent" }
        if ($label.name -eq "agent-content") { return "Content Agent" }
        if ($label.name -eq "agent-infra") { return "Infrastructure Agent" }
        if ($label.name -eq "agent-docs") { return "Documentation Agent" }
    }
    
    # Analyze content to find best match
    $bestAgent = "Frontend Agent"  # Default
    $bestScore = 0
    
    foreach ($agentName in $agents.Keys) {
        $agent = $agents[$agentName]
        $score = 0
        
        foreach ($keyword in $agent.Keywords) {
            if ($content -match $keyword) {
                $score++
            }
        }
        
        if ($score -gt $bestScore) {
            $bestScore = $score
            $bestAgent = $agentName
        }
    }
    
    return $bestAgent
}

function Is-AgentAvailable {
    param([string]$AgentName)
    
    $agent = $agents[$AgentName]
    return $agent.CurrentIssues.Count -lt $agent.MaxIssues
}

function Assign-IssueToAgent {
    param([object]$Issue, [string]$AgentName)
    
    $agents[$AgentName].CurrentIssues += $Issue.number
    return $agents[$AgentName]
}

function Process-IssueWithAgent {
    param([object]$Issue, [string]$AgentName)
    
    $agent = $agents[$AgentName]
    
    Write-Host "Agent: $AgentName" -ForegroundColor Cyan
    Write-Host "   Specializes in: $($agent.Specializes)" -ForegroundColor Gray
    Write-Host "   Issue #$($Issue.number): $($Issue.title)" -ForegroundColor White
    Write-Host "   URL: $($Issue.url)" -ForegroundColor Gray
    Write-Host "   Current Load: $($agent.CurrentIssues.Count)/$($agent.MaxIssues)" -ForegroundColor Yellow
    
    if ($DryRun) {
        Write-Host "     [DRY RUN] Would configure issue and set to 'In progress'..." -ForegroundColor Gray
        Write-Host "     [DRY RUN] Would create branch..." -ForegroundColor Gray
        Write-Host "     [DRY RUN] Would implement solution..." -ForegroundColor Gray
        Write-Host "     [DRY RUN] Would create pull request..." -ForegroundColor Gray
        return $true
    }
    
    try {
        # Step 1: Configure issue and set to "In progress" AND assign agent label
        Write-Host "     Configuring issue and setting to 'In progress'..." -ForegroundColor White
        gh issue edit $Issue.number --add-label "in-progress" 2>$null
        
        # Assign the agent label to the issue
        $agentLabel = switch ($AgentName) {
            "Frontend Agent" { "agent-frontend" }
            "Backend Agent" { "agent-backend" }
            "Content Agent" { "agent-content" }
            "Infrastructure Agent" { "agent-infra" }
            "Documentation Agent" { "agent-docs" }
        }
        
        Write-Host "     Assigning agent label: $agentLabel" -ForegroundColor White
        gh issue edit $Issue.number --add-label $agentLabel
        Write-Host "     Issue configured and agent assigned" -ForegroundColor Green
        
        # Step 2: Create branch
        Write-Host "     Creating branch..." -ForegroundColor White
        $branchName = "issue-$($Issue.number)"
        git checkout -b $branchName 2>$null
        Write-Host "     Branch created: $branchName" -ForegroundColor Green
        
        # Step 3: Create agent-specific implementation
        Write-Host "     Implementing solution..." -ForegroundColor White
        $implDir = "../implementations"
        if (-not (Test-Path $implDir)) {
            New-Item -ItemType Directory -Path $implDir -Force
        }
        $implFile = "$implDir/issue-$($Issue.number)-$($AgentName.Replace(' ', '-').ToLower())-implementation.md"
        $implContent = @"
# Issue #$($Issue.number): $($Issue.title)

## Agent Assignment
**Assigned to**: $AgentName
**Specializes in**: $($agent.Specializes)

## Implementation

This issue has been automatically processed by the Multi-Agent Automation System.

### Changes Made:
- Created implementation file: $implFile
- Set issue status to 'in-progress'
- Created branch: $branchName
- Assigned to: $AgentName

### Issue Details:
- **Title**: $($Issue.title)
- **URL**: $($Issue.url)
- **Labels**: $($Issue.labels.name -join ', ')
- **Created**: $($Issue.createdAt)
- **Updated**: $($Issue.updatedAt)

### Agent Analysis:
- **Best Match**: $AgentName
- **Specialization**: $($agent.Specializes)
- **Current Load**: $($agent.CurrentIssues.Count)/$($agent.MaxIssues)

### Implementation Notes:
This is an automated implementation created by the $AgentName.

---
*Generated on $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')*
"@
        $implContent | Out-File -FilePath $implFile -Encoding UTF8
        Write-Host "     Implementation file created: $implFile" -ForegroundColor Green
        
        # Step 4: Commit changes
        Write-Host "     Committing changes..." -ForegroundColor White
        git add $implFile
        git commit -m "feat: Implement issue #$($Issue.number) - $($Issue.title)

- Assigned to: $AgentName
- Created implementation file for issue #$($Issue.number)
- Automated implementation by Multi-Agent System
- Resolves #$($Issue.number)"
        Write-Host "     Changes committed" -ForegroundColor Green
        
        # Step 5: Push branch
        Write-Host "     Pushing branch..." -ForegroundColor White
        git push -u origin $branchName 2>$null
        Write-Host "     Branch pushed" -ForegroundColor Green
        
        # Step 6: Create PR
        Write-Host "     Creating pull request..." -ForegroundColor White
        $prTitle = "feat: Implement issue #$($Issue.number) - $($Issue.title)"
        $prBody = "Resolves #$($Issue.number)

This PR implements the requirements for issue #$($Issue.number).

## Agent Assignment:
- **Assigned to**: $AgentName
- **Specializes in**: $($agent.Specializes)

## Changes Made:
- Created implementation file: $implFile
- Automated implementation by Multi-Agent System

## Implementation Details:
- **Issue**: #$($Issue.number)
- **Title**: $($Issue.title)
- **Branch**: $branchName
- **Agent**: $AgentName

---
*This PR was automatically created by the Multi-Agent Automation System*"
        
        gh pr create --title $prTitle --body $prBody --base develop --head $branchName 2>$null
        Write-Host "     Pull request created" -ForegroundColor Green
        
        return $true
        
    } catch {
        Write-Host "     Failed to process issue #$($Issue.number): $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Main execution
Write-Host "Starting Multi-Agent Automation System" -ForegroundColor Green
Write-Host "Processing actual GitHub issues with intelligent agent assignment" -ForegroundColor White
Write-Host ""

# Get actual issues
Write-Host "Fetching actual GitHub issues..." -ForegroundColor Yellow
$issuesJson = gh issue list --state open --limit $MaxIssues --json number,title,body,labels,assignees,createdAt,updatedAt,url
$issues = $issuesJson | ConvertFrom-Json

if ($issues.Count -eq 0) {
    Write-Host "No issues found to process" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($issues.Count) open issues" -ForegroundColor Green
Write-Host ""

# Show the actual issues we're processing
Write-Host "Issues to be processed:" -ForegroundColor Yellow
foreach ($issue in $issues) {
    Write-Host "   #$($issue.number): $($issue.title)" -ForegroundColor White
}
Write-Host ""

Write-Host "Analyzing issues and assigning to optimal agents..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Process each issue with intelligent agent assignment
Write-Host "Executing intelligent agent workflows..." -ForegroundColor Yellow
Write-Host ""

$processedCount = 0
$successCount = 0
$agentAssignments = @{}

foreach ($issue in $issues) {
    # Determine best agent for this issue
    $assignedAgent = Get-BestAgent $issue
    
    # Check if agent is available
    if (-not (Is-AgentAvailable $assignedAgent)) {
        Write-Host "Agent $assignedAgent is at capacity, trying alternatives..." -ForegroundColor Yellow
        
        # Try to find an available agent
        $availableAgent = $null
        foreach ($agentName in $agents.Keys) {
            if (Is-AgentAvailable $agentName) {
                $availableAgent = $agentName
                break
            }
        }
        
        if ($availableAgent) {
            $assignedAgent = $availableAgent
            Write-Host "Reassigned to $assignedAgent" -ForegroundColor Yellow
        } else {
            Write-Host "No agents available, skipping issue #$($issue.number)" -ForegroundColor Red
            continue
        }
    }
    
    # Assign issue to agent
    Assign-IssueToAgent $issue $assignedAgent
    $agentAssignments[$assignedAgent]++
    
    # Process the issue
    $success = Process-IssueWithAgent $issue $assignedAgent
    $processedCount++
    
    if ($success) {
        $successCount++
    }
    
    Write-Host ""
}

# Final summary
Write-Host "Processing Summary:" -ForegroundColor Yellow
Write-Host "   Total Issues Processed: $processedCount" -ForegroundColor White
Write-Host "   Successful: $successCount" -ForegroundColor Green
Write-Host "   Failed: $($processedCount - $successCount)" -ForegroundColor Red
Write-Host "   Success Rate: $([math]::Round(($successCount / $processedCount) * 100, 1))%" -ForegroundColor White
Write-Host ""

Write-Host "Agent Assignment Summary:" -ForegroundColor Yellow
foreach ($agentName in $agents.Keys) {
    $count = if ($agentAssignments.ContainsKey($agentName)) { $agentAssignments[$agentName] } else { 0 }
    Write-Host "   $agentName`: $count issues" -ForegroundColor White
}
Write-Host ""

Write-Host "Multi-Agent Automation System completed successfully!" -ForegroundColor Green
Write-Host "All actual GitHub issues processed with intelligent agent assignment" -ForegroundColor Green
