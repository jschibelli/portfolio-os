#!/usr/bin/env pwsh
# Enhanced Agent Assignment with Auto Workflow Doc Updates
# Assigns issues to agents and automatically updates workflow documentation

param(
    [Parameter(Mandatory=$true)]
    [int]$IssueNumber,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("chris", "jason", "agent-1-chris", "agent-2-jason", "auto")]
    [string]$AgentName = "auto",
    
    [switch]$UpdateWorkflowDocs = $true,
    [switch]$AddGitHubComment = $true,
    [switch]$DryRun
)

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "  Enhanced Agent Assignment with Auto-Update" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

# Import utilities if they exist
$utilsPath = "scripts/core-utilities/get-github-utilities.ps1"
if (Test-Path $utilsPath) {
    . $utilsPath
}

# Step 1: Get issue details
Write-Host "Step 1: Fetching issue details..." -ForegroundColor Yellow

try {
    $issueData = gh issue view $IssueNumber --json number,title,labels,body | ConvertFrom-Json
    
    Write-Host "  Issue #$($issueData.number): $($issueData.title)" -ForegroundColor Cyan
    Write-Host "  Labels: $($issueData.labels.name -join ', ')" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "  ❌ Failed to fetch issue details: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Determine agent assignment (if auto)
if ($AgentName -eq "auto") {
    Write-Host "Step 2: Auto-determining agent assignment..." -ForegroundColor Yellow
    
    $title = $issueData.title.ToLower()
    $body = $issueData.body.ToLower()
    $labels = $issueData.labels.name -join " " | ForEach-Object { $_.ToLower() }
    $combinedText = "$title $body $labels"
    
    # Agent 1 - Chris (Frontend/UI Specialist) keywords
    $chrisKeywords = @(
        'frontend', 'ui', 'ux', 'component', 'react', 'next.js', 'accessibility', 'a11y',
        'visual', 'design', 'css', 'tailwind', 'animation', 'framer', 'interactive',
        'form', 'button', 'modal', 'navigation', 'menu', 'hero', 'blog post', 'chatbot',
        'contact form', 'homepage', 'visual regression', 'styling', 'layout', 'responsive'
    )
    
    # Agent 2 - Jason (Infrastructure/Testing Specialist) keywords
    $jasonKeywords = @(
        'backend', 'api', 'infrastructure', 'devops', 'deployment', 'seo', 'performance',
        'security', 'testing', 'test', 'e2e', 'integration', 'playwright', 'jest',
        'authentication', 'auth', 'session', 'protected', 'route', 'database', 'prisma',
        'optimization', 'monitoring', 'analytics', 'webhook', 'cron', 'queue', 'config',
        'test utils', 'mock', 'fixture', 'booking system', 'newsletter', 'error handling'
    )
    
    # Count keyword matches
    $chrisScore = 0
    $jasonScore = 0
    
    foreach ($keyword in $chrisKeywords) {
        if ($combinedText -match $keyword) { $chrisScore++ }
    }
    
    foreach ($keyword in $jasonKeywords) {
        if ($combinedText -match $keyword) { $jasonScore++ }
    }
    
    # Determine agent based on scores
    if ($jasonScore > $chrisScore) {
        $AgentName = "agent-2-jason"
        Write-Host "  Auto-assigned to Jason (Infrastructure/Testing)" -ForegroundColor Cyan
        Write-Host "  Score: Chris=$chrisScore, Jason=$jasonScore" -ForegroundColor Gray
    } else {
        $AgentName = "agent-1-chris"
        Write-Host "  Auto-assigned to Chris (Frontend/UI)" -ForegroundColor Cyan
        Write-Host "  Score: Chris=$chrisScore, Jason=$jasonScore" -ForegroundColor Gray
    }
    Write-Host ""
} else {
    Write-Host "Step 2: Using specified agent: $AgentName" -ForegroundColor Yellow
    Write-Host ""
}

# Normalize agent name
$normalizedAgent = switch ($AgentName.ToLower()) {
    { $_ -in @("chris", "agent-1-chris") } { "agent-1-chris" }
    { $_ -in @("jason", "agent-2-jason") } { "agent-2-jason" }
}

$agentDisplayName = if ($normalizedAgent -eq "agent-1-chris") { "Chris (Frontend/UI Specialist)" } else { "Jason (Infrastructure/Testing Specialist)" }

# Step 3: Add GitHub comment (if requested)
if ($AddGitHubComment -and -not $DryRun) {
    Write-Host "Step 3: Adding agent assignment comment to GitHub..." -ForegroundColor Yellow
    
    $commentBody = "**Agent Assignment: $normalizedAgent**`n`n"
    $commentBody += "This issue has been assigned to **$agentDisplayName**."
    
    try {
        gh issue comment $IssueNumber --body $commentBody | Out-Null
        Write-Host "  ✅ Comment added to issue #$IssueNumber" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️  Failed to add comment: $_" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Step 4: Update workflow documentation (if requested)
if ($UpdateWorkflowDocs) {
    Write-Host "Step 4: Updating workflow documentation..." -ForegroundColor Yellow
    
    $updateParams = @{
        IssueNumber = $IssueNumber
        AgentName = $normalizedAgent
        IssueTitle = $issueData.title
    }
    
    if ($DryRun) {
        $updateParams.DryRun = $true
    }
    
    try {
        & "scripts/core-utilities/update-workflow-docs.ps1" @updateParams
    } catch {
        Write-Host "  ⚠️  Failed to update workflow docs: $_" -ForegroundColor Yellow
    }
}

# Step 5: Display summary
Write-Host ""
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "              Summary" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "  Issue: #$IssueNumber - $($issueData.title)" -ForegroundColor Cyan
Write-Host "  Agent: $agentDisplayName" -ForegroundColor Cyan
Write-Host "  Worktree: worktrees/$normalizedAgent" -ForegroundColor Cyan
Write-Host ""

if (-not $DryRun) {
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Navigate to agent worktree: cd worktrees/$normalizedAgent" -ForegroundColor Gray
    Write-Host "  2. Checkout the issue branch: git checkout issue-$IssueNumber-*" -ForegroundColor Gray
    Write-Host "  3. Start implementing the changes" -ForegroundColor Gray
    Write-Host "  4. Workflow docs have been auto-updated" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Agent assignment complete!" -ForegroundColor Green

