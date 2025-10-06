# Start E2E Multi-Agent Development
# Usage: .\scripts\start-e2e-agents.ps1 -Agent [Agent1|Agent2]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("Agent1", "Agent2")]
    [string]$Agent
)

Write-Host "Starting Multi-Agent E2E Development" -ForegroundColor Green
Write-Host "Agent: $Agent" -ForegroundColor Cyan
Write-Host ""

if ($Agent -eq "Agent1") {
    Write-Host "Agent 1: Frontend/UI Specialist" -ForegroundColor Cyan
    Write-Host "Issues: 247, 251, 253, 254" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Continuous Processing:" -ForegroundColor Yellow
    Write-Host ".\scripts\continuous-issue-pipeline.ps1 -MaxIssues 4 -Agent 'Agent1' -Queue 'frontend' -Watch" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Individual Processing:" -ForegroundColor Yellow
    Write-Host ".\scripts\issue-config-unified.ps1 -IssueNumber 247 -Preset frontend -AddToProject" -ForegroundColor Gray
    Write-Host ".\scripts\create-branch-from-release.ps1 -IssueNumber 247 -BaseBranch 'release/launch-2025-10-07'" -ForegroundColor Gray
    Write-Host ".\scripts\issue-implementation.ps1 -IssueNumber 247 -Agent 'Agent1'" -ForegroundColor Gray
}

if ($Agent -eq "Agent2") {
    Write-Host "Agent 2: Infrastructure/SEO Specialist" -ForegroundColor Magenta
    Write-Host "Issues: 248, 249, 250, 252" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Continuous Processing:" -ForegroundColor Yellow
    Write-Host ".\scripts\continuous-issue-pipeline.ps1 -MaxIssues 4 -Agent 'Agent2' -Queue 'infra' -Watch" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Individual Processing:" -ForegroundColor Yellow
    Write-Host ".\scripts\issue-config-unified.ps1 -IssueNumber 248 -Preset infra -AddToProject" -ForegroundColor Gray
    Write-Host ".\scripts\create-branch-from-release.ps1 -IssueNumber 248 -BaseBranch 'release/launch-2025-10-07'" -ForegroundColor Gray
    Write-Host ".\scripts\issue-implementation.ps1 -IssueNumber 248 -Agent 'Agent2'" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "Multi-Agent Assignments: MULTI-AGENT-ASSIGNMENTS.md" -ForegroundColor Gray
Write-Host "E2E Workflow: prompts/multi-agent-e2e-workflow.md" -ForegroundColor Gray
Write-Host "Development Prompt: prompts/multi-agent-development-prompt.md" -ForegroundColor Gray
