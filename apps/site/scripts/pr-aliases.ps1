# PR Workflow Aliases - Add these to your PowerShell profile for easy access
# Usage: Source this file or add to your PowerShell profile

# Fast PR workflow aliases
function pr-status { param($PRNumber) .\scripts\fast-pr-workflow.ps1 -PRNumber $PRNumber }
function pr-watch { param($PRNumber) .\scripts\fast-pr-workflow.ps1 -PRNumber $PRNumber -Watch }
function pr-analyze { param($PRNumber) .\scripts\fast-pr-workflow.ps1 -PRNumber $PRNumber -QuickAnalysis }
function pr-full { param($PRNumber) .\scripts\fast-pr-workflow.ps1 -PRNumber $PRNumber -QuickAnalysis -Watch }

# Original automation aliases
function pr-monitor { param($PRNumber) .\scripts\pr-monitor.ps1 -PRNumber $PRNumber }
function pr-monitor-watch { param($PRNumber) .\scripts\pr-monitor.ps1 -PRNumber $PRNumber -WatchMode }
function pr-crgpt-analyze { param($PRNumber) .\scripts\cr-gpt-analyzer.ps1 -PRNumber $PRNumber -GenerateReport }

# Quick commands for common tasks
function pr-list { gh pr list --limit 10 }
function pr-open { param($PRNumber) gh pr view $PRNumber --web }

Write-Host "PR Workflow Aliases loaded!" -ForegroundColor Green
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  pr-status <number>     - Quick PR status check" -ForegroundColor White
Write-Host "  pr-watch <number>      - Watch PR for changes" -ForegroundColor White
Write-Host "  pr-analyze <number>    - Generate quick analysis" -ForegroundColor White
Write-Host "  pr-full <number>       - Full analysis + watch mode" -ForegroundColor White
Write-Host "  pr-list                - List recent PRs" -ForegroundColor White
Write-Host "  pr-open <number>       - Open PR in browser" -ForegroundColor White
