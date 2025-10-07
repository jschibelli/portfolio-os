# Enhanced Multi-Agent Coordination Script
# Consolidated from get-agent-commands.ps1 and manage-agent-coordination.ps1
# Provides comprehensive commands, status, and coordination for both agents

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("agent1", "agent2", "status", "sync", "commands", "setup", "help")]
    [string]$Action,
    
    [Parameter(Mandatory=$false)]
    [switch]$Detailed,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Agent assignments - centralized configuration
$agentConfig = @{
    "agent1" = @{
        Name = "Agent 1: Frontend/UI Specialist"
        Color = "Cyan"
        Issues = @(247, 251, 253, 254)
        Branches = @(
            "issue-247-contact-resend-integration",
            "issue-251-social-og-twitter-images", 
            "issue-253-a11y-navigation-focus",
            "issue-254-performance-images-fonts-headers"
        )
        Skills = @("React", "Next.js", "UI/UX", "Accessibility", "Performance")
        Specialties = @("frontend", "ui", "accessibility", "performance")
    }
    "agent2" = @{
        Name = "Agent 2: Infrastructure/SEO Specialist"
        Color = "Magenta"
        Issues = @(248, 249, 250, 252)
        Branches = @(
            "issue-248-canonical-host-redirect",
            "issue-249-projects-ssr-crawlability",
            "issue-250-seo-robots-sitemap-metadata", 
            "issue-252-remove-inflated-metrics"
        )
        Skills = @("DevOps", "SEO", "Infrastructure", "Security", "Content")
        Specialties = @("infrastructure", "seo", "deployment", "security")
    }
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color)
    switch ($Color.ToLower()) {
        "red" { Write-Host $Message -ForegroundColor Red }
        "green" { Write-Host $Message -ForegroundColor Green }
        "yellow" { Write-Host $Message -ForegroundColor Yellow }
        "cyan" { Write-Host $Message -ForegroundColor Cyan }
        "blue" { Write-Host $Message -ForegroundColor Blue }
        "magenta" { Write-Host $Message -ForegroundColor Magenta }
        "gray" { Write-Host $Message -ForegroundColor Gray }
        default { Write-Host $Message -ForegroundColor White }
    }
}

function Show-AgentCommands {
    param([string]$AgentKey)
    
    $agent = $agentConfig[$AgentKey]
    Write-ColorOutput "👤 $($agent.Name)" $agent.Color
    Write-ColorOutput "=" * 60 $agent.Color
    Write-ColorOutput ""
    
    Write-ColorOutput "📋 Your assigned issues:" "White"
    foreach ($issue in $agent.Issues) {
        Write-ColorOutput "  • Issue #$issue" "Gray"
    }
    Write-ColorOutput ""
    
    Write-ColorOutput "🌿 Your assigned branches:" "White"
    foreach ($branch in $agent.Branches) {
        $exists = git branch --list $branch 2>$null
        if ($exists) {
            Write-ColorOutput "  ✅ $branch" "Green"
        } else {
            Write-ColorOutput "  ❌ $branch" "Red"
        }
    }
    Write-ColorOutput ""
    
    Write-ColorOutput "🚀 Getting started:" "Yellow"
    Write-ColorOutput "1. git checkout release/launch-2025-10-07" "Gray"
    Write-ColorOutput "2. git pull origin release/launch-2025-10-07" "Gray"
    Write-ColorOutput "3. git checkout [your-first-branch]" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "🔄 Daily sync workflow:" "Yellow"
    Write-ColorOutput "git checkout release/launch-2025-10-07" "Gray"
    Write-ColorOutput "git pull origin release/launch-2025-10-07" "Gray"
    Write-ColorOutput "git checkout [your-current-branch]" "Gray"
    Write-ColorOutput "git merge release/launch-2025-10-07" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "📤 Create PR workflow:" "Yellow"
    Write-ColorOutput "git push origin [your-branch]" "Gray"
    Write-ColorOutput "# Then create PR from your branch to release/launch-2025-10-07" "Gray"
    Write-ColorOutput ""
    
    if ($Detailed) {
        Write-ColorOutput "🛠️ Your skills:" "White"
        foreach ($skill in $agent.Skills) {
            Write-ColorOutput "  • $skill" "Gray"
        }
        Write-ColorOutput ""
        
        Write-ColorOutput "🎯 Your specialties:" "White"
        foreach ($specialty in $agent.Specialties) {
            Write-ColorOutput "  • $specialty" "Gray"
        }
        Write-ColorOutput ""
    }
}

function Show-CoordinationStatus {
    Write-ColorOutput "📊 Multi-Agent Development Status" "Green"
    Write-ColorOutput "=" * 50 "Green"
    Write-ColorOutput ""
    
    # Current branch info
    Write-ColorOutput "🔄 Current environment:" "Yellow"
    $currentBranch = git branch --show-current 2>$null
    if ($currentBranch) {
        Write-ColorOutput "  Current Branch: $currentBranch" "White"
    } else {
        Write-ColorOutput "  Current Branch: Not in a git repository" "Red"
    }
    
    $currentDir = Get-Location
    Write-ColorOutput "  Current Directory: $currentDir" "White"
    Write-ColorOutput ""
    
    # Agent 1 status
    Write-ColorOutput "👤 Agent 1 Status:" "Cyan"
    foreach ($branch in $agentConfig["agent1"].Branches) {
        $exists = git branch --list $branch 2>$null
        if ($exists) {
            Write-ColorOutput "  ✅ $branch" "Green"
        } else {
            Write-ColorOutput "  ❌ $branch" "Red"
        }
    }
    Write-ColorOutput ""
    
    # Agent 2 status
    Write-ColorOutput "👤 Agent 2 Status:" "Magenta"
    foreach ($branch in $agentConfig["agent2"].Branches) {
        $exists = git branch --list $branch 2>$null
        if ($exists) {
            Write-ColorOutput "  ✅ $branch" "Green"
        } else {
            Write-ColorOutput "  ❌ $branch" "Red"
        }
    }
    Write-ColorOutput ""
    
    # Repository status
    Write-ColorOutput "📁 Repository Status:" "Yellow"
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        Write-ColorOutput "  ⚠️ Uncommitted changes detected:" "Yellow"
        $gitStatus | ForEach-Object { Write-ColorOutput "    $_" "Gray" }
    } else {
        Write-ColorOutput "  ✅ Working directory clean" "Green"
    }
    Write-ColorOutput ""
}

function Show-SyncCommands {
    Write-ColorOutput "🔄 Multi-Agent Sync Commands" "Yellow"
    Write-ColorOutput "=" * 50 "Yellow"
    Write-ColorOutput ""
    
    Write-ColorOutput "📥 Pull latest changes from release branch:" "White"
    Write-ColorOutput "git checkout release/launch-2025-10-07" "Gray"
    Write-ColorOutput "git pull origin release/launch-2025-10-07" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "🔄 Sync your current branch:" "White"
    Write-ColorOutput "git checkout [your-branch]" "Gray"
    Write-ColorOutput "git merge release/launch-2025-10-07" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "📤 Push your changes:" "White"
    Write-ColorOutput "git push origin [your-branch]" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "⚠️  Conflict Resolution Guide:" "Red"
    Write-ColorOutput "If conflicts occur during merge:" "White"
    Write-ColorOutput "1. Resolve conflicts in your editor" "Gray"
    Write-ColorOutput "2. git add ." "Gray"
    Write-ColorOutput "3. git commit -m 'Resolve merge conflicts'" "Gray"
    Write-ColorOutput "4. git push origin [your-branch]" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "🤝 Cross-Agent Coordination:" "Cyan"
    Write-ColorOutput "• Coordinate on shared files (layout.tsx, globals.css)" "Gray"
    Write-ColorOutput "• Communicate before making breaking changes" "Gray"
    Write-ColorOutput "• Test integration before creating PRs" "Gray"
    Write-ColorOutput ""
}

function Show-AgentSetup {
    Write-ColorOutput "🚀 Multi-Agent Development Setup" "Green"
    Write-ColorOutput "=" * 50 "Green"
    Write-ColorOutput ""
    
    Write-ColorOutput "📋 Setup Checklist:" "White"
    Write-ColorOutput "1. ✅ Verify you're in the Portfolio OS repository" "Green"
    Write-ColorOutput "2. ✅ Ensure you're on the release/launch-2025-10-07 branch" "Green"
    Write-ColorOutput "3. ✅ Pull latest changes: git pull origin release/launch-2025-10-07" "Green"
    Write-ColorOutput "4. ✅ Check that all agent branches exist" "Green"
    Write-ColorOutput ""
    
    Write-ColorOutput "🎯 Agent Assignment Summary:" "Yellow"
    Write-ColorOutput ""
    
    foreach ($agentKey in @("agent1", "agent2")) {
        $agent = $agentConfig[$agentKey]
        Write-ColorOutput "$($agent.Name)" $agent.Color
        Write-ColorOutput "  Issues: $($agent.Issues -join ', ')" "Gray"
        Write-ColorOutput "  Branches: $($agent.Branches.Count) branches" "Gray"
        Write-ColorOutput ""
    }
    
    Write-ColorOutput "🔧 Quick Setup Commands:" "Cyan"
    Write-ColorOutput "git checkout release/launch-2025-10-07" "Gray"
    Write-ColorOutput "git pull origin release/launch-2025-10-07" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "📚 Additional Resources:" "White"
    Write-ColorOutput "• Multi-Agent Assignments: MULTI-AGENT-ASSIGNMENTS.md" "Gray"
    Write-ColorOutput "• E2E Workflow: prompts/multi-agent-e2e-workflow.md" "Gray"
    Write-ColorOutput "• Development Prompt: prompts/multi-agent-development-prompt.md" "Gray"
    Write-ColorOutput ""
}

function Show-Help {
    Write-ColorOutput "🤖 Enhanced Multi-Agent Coordination Help" "Blue"
    Write-ColorOutput "=" * 50 "Blue"
    Write-ColorOutput ""
    
    Write-ColorOutput "Available Actions:" "White"
    Write-ColorOutput "  agent1       Show Agent 1 (Frontend) commands and status" "Cyan"
    Write-ColorOutput "  agent2       Show Agent 2 (Infrastructure) commands and status" "Magenta"
    Write-ColorOutput "  status       Show overall coordination status" "Green"
    Write-ColorOutput "  sync         Show sync commands for both agents" "Yellow"
    Write-ColorOutput "  commands     Show commands for current agent context" "Blue"
    Write-ColorOutput "  setup        Show setup instructions and checklist" "Green"
    Write-ColorOutput "  help         Show this help message" "Blue"
    Write-ColorOutput ""
    
    Write-ColorOutput "Options:" "White"
    Write-ColorOutput "  -Detailed    Show detailed information (skills, specialties)" "Gray"
    Write-ColorOutput "  -DryRun      Preview actions without executing" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "Examples:" "White"
    Write-ColorOutput "  .\manage-agent-coordination-enhanced.ps1 -Action agent1" "Gray"
    Write-ColorOutput "  .\manage-agent-coordination-enhanced.ps1 -Action status -Detailed" "Gray"
    Write-ColorOutput "  .\manage-agent-coordination-enhanced.ps1 -Action sync" "Gray"
    Write-ColorOutput "  .\manage-agent-coordination-enhanced.ps1 -Action setup" "Gray"
    Write-ColorOutput ""
}

# Main execution
Write-ColorOutput "🤖 Enhanced Multi-Agent Coordination System" "Blue"
Write-ColorOutput "Action: $Action" "White"
if ($Detailed) { Write-ColorOutput "Mode: Detailed" "White" }
if ($DryRun) { Write-ColorOutput "Mode: Dry Run" "Yellow" }
Write-ColorOutput ""

switch ($Action) {
    "agent1" { 
        Show-AgentCommands "agent1"
    }
    "agent2" { 
        Show-AgentCommands "agent2"
    }
    "status" { 
        Show-CoordinationStatus
    }
    "sync" { 
        Show-SyncCommands
    }
    "commands" {
        # Auto-detect current agent based on branch or provide both
        $currentBranch = git branch --show-current 2>$null
        $currentAgent = $null
        
        foreach ($agentKey in @("agent1", "agent2")) {
            if ($agentConfig[$agentKey].Branches -contains $currentBranch) {
                $currentAgent = $agentKey
                break
            }
        }
        
        if ($currentAgent) {
            Write-ColorOutput "🎯 Detected current agent: $($agentConfig[$currentAgent].Name)" "Green"
            Write-ColorOutput ""
            Show-AgentCommands $currentAgent
        } else {
            Write-ColorOutput "🤔 No agent detected for current branch: $currentBranch" "Yellow"
            Write-ColorOutput "Showing both agents:" "White"
            Write-ColorOutput ""
            Show-AgentCommands "agent1"
            Show-AgentCommands "agent2"
        }
    }
    "setup" {
        Show-AgentSetup
    }
    "help" {
        Show-Help
    }
    default {
        Write-ColorOutput "❌ Unknown action: $Action" "Red"
        Show-Help
    }
}

Write-ColorOutput ""
Write-ColorOutput "✅ Enhanced coordination complete!" "Green"
