# Simple Multi-Agent Commands
# Usage: .\scripts\agent-commands.ps1 agent1|agent2|status

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("agent1", "agent2", "status")]
    [string]$Action
)

Write-Host "Multi-Agent Development Commands" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

if ($Action -eq "agent1") {
    Write-Host "Agent 1: Frontend/UI Specialist" -ForegroundColor Cyan
    Write-Host "Your branches:" -ForegroundColor White
    Write-Host "  issue-247-contact-resend-integration" -ForegroundColor Gray
    Write-Host "  issue-251-social-og-twitter-images" -ForegroundColor Gray
    Write-Host "  issue-253-a11y-navigation-focus" -ForegroundColor Gray
    Write-Host "  issue-254-performance-images-fonts-headers" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Start with:" -ForegroundColor Yellow
    Write-Host "git checkout issue-247-contact-resend-integration" -ForegroundColor Gray
}

if ($Action -eq "agent2") {
    Write-Host "Agent 2: Infrastructure/SEO Specialist" -ForegroundColor Magenta
    Write-Host "Your branches:" -ForegroundColor White
    Write-Host "  issue-248-canonical-host-redirect" -ForegroundColor Gray
    Write-Host "  issue-249-projects-ssr-crawlability" -ForegroundColor Gray
    Write-Host "  issue-250-seo-robots-sitemap-metadata" -ForegroundColor Gray
    Write-Host "  issue-252-remove-inflated-metrics" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Start with:" -ForegroundColor Yellow
    Write-Host "git checkout issue-248-canonical-host-redirect" -ForegroundColor Gray
}

if ($Action -eq "status") {
    Write-Host "Current Status:" -ForegroundColor Yellow
    $currentBranch = git branch --show-current
    Write-Host "Current branch: $currentBranch" -ForegroundColor Gray
    Write-Host ""
    Write-Host "All issue branches exist:" -ForegroundColor Green
    Write-Host "  issue-247-contact-resend-integration" -ForegroundColor Gray
    Write-Host "  issue-248-canonical-host-redirect" -ForegroundColor Gray
    Write-Host "  issue-249-projects-ssr-crawlability" -ForegroundColor Gray
    Write-Host "  issue-250-seo-robots-sitemap-metadata" -ForegroundColor Gray
    Write-Host "  issue-251-social-og-twitter-images" -ForegroundColor Gray
    Write-Host "  issue-252-remove-inflated-metrics" -ForegroundColor Gray
    Write-Host "  issue-253-a11y-navigation-focus" -ForegroundColor Gray
    Write-Host "  issue-254-performance-images-fonts-headers" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Sync commands for both agents:" -ForegroundColor Yellow
Write-Host "git checkout release/launch-2025-10-07" -ForegroundColor Gray
Write-Host "git pull origin release/launch-2025-10-07" -ForegroundColor Gray
Write-Host "git checkout [your-branch]" -ForegroundColor Gray
Write-Host "git merge release/launch-2025-10-07" -ForegroundColor Gray
