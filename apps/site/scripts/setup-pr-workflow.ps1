# Setup PR Workflow - Run this once to set up your PR automation
# Usage: .\scripts\setup-pr-workflow.ps1

Write-Host "Setting up PR Workflow..." -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""

# Create aliases for current session
Write-Host "Creating aliases for current session..." -ForegroundColor Yellow

function pr-status { param($PRNumber) .\scripts\fast-pr-workflow.ps1 -PRNumber $PRNumber }
function pr-watch { param($PRNumber) .\scripts\fast-pr-workflow.ps1 -PRNumber $PRNumber -Watch }
function pr-analyze { param($PRNumber) .\scripts\fast-pr-workflow.ps1 -PRNumber $PRNumber -QuickAnalysis }
function pr-full { param($PRNumber) .\scripts\fast-pr-workflow.ps1 -PRNumber $PRNumber -QuickAnalysis -Watch }
function pr-monitor { param($PRNumber) .\scripts\pr-monitor.ps1 -PRNumber $PRNumber }
function pr-monitor-watch { param($PRNumber) .\scripts\pr-monitor.ps1 -PRNumber $PRNumber -WatchMode }
function pr-crgpt-analyze { param($PRNumber) .\scripts\cr-gpt-analyzer.ps1 -PRNumber $PRNumber -GenerateReport }
function pr-list { gh pr list --limit 10 }
function pr-open { param($PRNumber) gh pr view $PRNumber --web }

Write-Host "Aliases created successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  pr-status <number>     - Quick PR status check" -ForegroundColor White
Write-Host "  pr-watch <number>      - Watch PR for changes" -ForegroundColor White
Write-Host "  pr-analyze <number>    - Generate quick analysis" -ForegroundColor White
Write-Host "  pr-full <number>       - Full analysis + watch mode" -ForegroundColor White
Write-Host "  pr-monitor <number>    - Detailed monitoring" -ForegroundColor White
Write-Host "  pr-crgpt-analyze <number> - Full CR-GPT analysis" -ForegroundColor White
Write-Host "  pr-list                - List recent PRs" -ForegroundColor White
Write-Host "  pr-open <number>       - Open PR in browser" -ForegroundColor White
Write-Host ""

Write-Host "Example usage:" -ForegroundColor Cyan
Write-Host "  pr-status 155          - Check status of PR 155" -ForegroundColor Gray
Write-Host "  pr-watch 155           - Watch PR 155 for changes" -ForegroundColor Gray
Write-Host "  pr-analyze 155         - Generate analysis report" -ForegroundColor Gray
Write-Host "  pr-list                - Show recent PRs" -ForegroundColor Gray
Write-Host ""

Write-Host "Setup complete! You can now use the PR workflow commands." -ForegroundColor Green
