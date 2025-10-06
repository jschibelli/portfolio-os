# Start Multi-Agent E2E Development
# Usage: .\scripts\start-multi-agent-e2e.ps1 -Agent [Agent1|Agent2] -Mode [continuous|individual]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("Agent1", "Agent2")]
    [string]$Agent,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("continuous", "individual")]
    [string]$Mode = "continuous"
)

Write-Host "🚀 Starting Multi-Agent E2E Development" -ForegroundColor Green
Write-Host "Agent: $Agent" -ForegroundColor Cyan
Write-Host "Mode: $Mode" -ForegroundColor Yellow
Write-Host ""

if ($Agent -eq "Agent1") {
    Write-Host "👤 Agent 1: Frontend/UI Specialist" -ForegroundColor Cyan
    Write-Host "Issues: 247, 251, 253, 254" -ForegroundColor Gray
    Write-Host ""
    
    if ($Mode -eq "continuous") {
        Write-Host "🔄 Starting continuous processing..." -ForegroundColor Yellow
        Write-Host "Command: .\scripts\continuous-issue-pipeline.ps1 -MaxIssues 4 -Agent 'Agent1' -Queue 'frontend' -Watch" -ForegroundColor Gray
        Write-Host ""
        Write-Host "This will automatically:" -ForegroundColor White
        Write-Host "• Process issues 247, 251, 253, 254 in sequence" -ForegroundColor Gray
        Write-Host "• Configure project fields" -ForegroundColor Gray
        Write-Host "• Create branches from release/launch-2025-10-07" -ForegroundColor Gray
        Write-Host "• Implement each issue" -ForegroundColor Gray
        Write-Host "• Create PRs and drive to merge" -ForegroundColor Gray
        Write-Host "• Update project status in real-time" -ForegroundColor Gray
    } else {
        Write-Host "📋 Individual issue processing:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Issue #247: Contact route and Resend integration" -ForegroundColor White
        Write-Host ".\scripts\issue-config-unified.ps1 -IssueNumber 247 -Preset frontend -AddToProject" -ForegroundColor Gray
        Write-Host ".\scripts\create-branch-from-release.ps1 -IssueNumber 247 -BaseBranch 'release/launch-2025-10-07'" -ForegroundColor Gray
        Write-Host ".\scripts\issue-implementation.ps1 -IssueNumber 247 -Agent 'Agent1'" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Issue #251: Social: OG/Twitter defaults + images" -ForegroundColor White
        Write-Host ".\scripts\issue-config-unified.ps1 -IssueNumber 251 -Preset frontend -AddToProject" -ForegroundColor Gray
        Write-Host ".\scripts\create-branch-from-release.ps1 -IssueNumber 251 -BaseBranch 'release/launch-2025-10-07'" -ForegroundColor Gray
        Write-Host ".\scripts\issue-implementation.ps1 -IssueNumber 251 -Agent 'Agent1'" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Issue #253: A11y pass: navigation & focus states" -ForegroundColor White
        Write-Host ".\scripts\issue-config-unified.ps1 -IssueNumber 253 -Preset frontend -AddToProject" -ForegroundColor Gray
        Write-Host ".\scripts\create-branch-from-release.ps1 -IssueNumber 253 -BaseBranch 'release/launch-2025-10-07'" -ForegroundColor Gray
        Write-Host ".\scripts\issue-implementation.ps1 -IssueNumber 253 -Agent 'Agent1'" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Issue #254: Performance: images, fonts, headers" -ForegroundColor White
        Write-Host ".\scripts\issue-config-unified.ps1 -IssueNumber 254 -Preset frontend -AddToProject" -ForegroundColor Gray
        Write-Host ".\scripts\create-branch-from-release.ps1 -IssueNumber 254 -BaseBranch 'release/launch-2025-10-07'" -ForegroundColor Gray
        Write-Host ".\scripts\issue-implementation.ps1 -IssueNumber 254 -Agent 'Agent1'" -ForegroundColor Gray
    }
}

if ($Agent -eq "Agent2") {
    Write-Host "👤 Agent 2: Infrastructure/SEO Specialist" -ForegroundColor Magenta
    Write-Host "Issues: 248, 249, 250, 252" -ForegroundColor Gray
    Write-Host ""
    
    if ($Mode -eq "continuous") {
        Write-Host "🔄 Starting continuous processing..." -ForegroundColor Yellow
        Write-Host "Command: .\scripts\continuous-issue-pipeline.ps1 -MaxIssues 4 -Agent 'Agent2' -Queue 'infra' -Watch" -ForegroundColor Gray
        Write-Host ""
        Write-Host "This will automatically:" -ForegroundColor White
        Write-Host "• Process issues 248, 249, 250, 252 in sequence" -ForegroundColor Gray
        Write-Host "• Configure project fields" -ForegroundColor Gray
        Write-Host "• Create branches from release/launch-2025-10-07" -ForegroundColor Gray
        Write-Host "• Implement each issue" -ForegroundColor Gray
        Write-Host "• Create PRs and drive to merge" -ForegroundColor Gray
        Write-Host "• Update project status in real-time" -ForegroundColor Gray
    } else {
        Write-Host "📋 Individual issue processing:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Issue #248: Canonical host redirect (www vs apex)" -ForegroundColor White
        Write-Host ".\scripts\issue-config-unified.ps1 -IssueNumber 248 -Preset infra -AddToProject" -ForegroundColor Gray
        Write-Host ".\scripts\create-branch-from-release.ps1 -IssueNumber 248 -BaseBranch 'release/launch-2025-10-07'" -ForegroundColor Gray
        Write-Host ".\scripts\issue-implementation.ps1 -IssueNumber 248 -Agent 'Agent2'" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Issue #249: Projects page SSR + crawlability" -ForegroundColor White
        Write-Host ".\scripts\issue-config-unified.ps1 -IssueNumber 249 -Preset infra -AddToProject" -ForegroundColor Gray
        Write-Host ".\scripts\create-branch-from-release.ps1 -IssueNumber 249 -BaseBranch 'release/launch-2025-10-07'" -ForegroundColor Gray
        Write-Host ".\scripts\issue-implementation.ps1 -IssueNumber 249 -Agent 'Agent2'" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Issue #250: SEO: robots.ts + sitemap.ts + per-page metadata" -ForegroundColor White
        Write-Host ".\scripts\issue-config-unified.ps1 -IssueNumber 250 -Preset seo -AddToProject" -ForegroundColor Gray
        Write-Host ".\scripts\create-branch-from-release.ps1 -IssueNumber 250 -BaseBranch 'release/launch-2025-10-07'" -ForegroundColor Gray
        Write-Host ".\scripts\issue-implementation.ps1 -IssueNumber 250 -Agent 'Agent2'" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Issue #252: Content: Remove inflated metrics sitewide" -ForegroundColor White
        Write-Host ".\scripts\issue-config-unified.ps1 -IssueNumber 252 -Preset content -AddToProject" -ForegroundColor Gray
        Write-Host ".\scripts\create-branch-from-release.ps1 -IssueNumber 252 -BaseBranch 'release/launch-2025-10-07'" -ForegroundColor Gray
        Write-Host ".\scripts\issue-implementation.ps1 -IssueNumber 252 -Agent 'Agent2'" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "📋 Documentation:" -ForegroundColor Yellow
Write-Host "• Multi-Agent Assignments: MULTI-AGENT-ASSIGNMENTS.md" -ForegroundColor Gray
Write-Host "• E2E Workflow: prompts/multi-agent-e2e-workflow.md" -ForegroundColor Gray
Write-Host "• Development Prompt: prompts/multi-agent-development-prompt.md" -ForegroundColor Gray
Write-Host ""
Write-Host "Goal: Complete all 8 launch issues by October 7, 2025" -ForegroundColor Green
