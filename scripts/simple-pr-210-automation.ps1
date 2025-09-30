# Simple PR #210 Automation Workflow
param([string]$PRNumber = "210")

Write-Host "Starting PR #$PRNumber automation..." -ForegroundColor Cyan

try {
    # Get PR details
    $pr = gh pr view $PRNumber --json title,state,author,comments | ConvertFrom-Json
    Write-Host "PR: $($pr.title)" -ForegroundColor White
    Write-Host "Status: $($pr.state)" -ForegroundColor White
    Write-Host "Author: $($pr.author.login)" -ForegroundColor White
    
    # Count CR-GPT comments
    $crgptCount = ($pr.comments | Where-Object { $_.author.login -eq "cr-gpt[bot]" }).Count
    Write-Host "CR-GPT Comments: $crgptCount" -ForegroundColor Yellow
    
    # Update project status
    if ($crgptCount -gt 0) {
        Write-Host "Updating status to In review..." -ForegroundColor Yellow
        & "scripts\auto-configure-pr.ps1" -PRNumber $PRNumber -Status "In review"
    } else {
        Write-Host "Status remains In progress..." -ForegroundColor Green
        & "scripts\auto-configure-pr.ps1" -PRNumber $PRNumber -Status "In progress"
    }
    
    # Generate report
    Write-Host "`n=== PR #$PRNumber Automation Report ===" -ForegroundColor White
    Write-Host "Status: $($pr.state)" -ForegroundColor White
    Write-Host "CR-GPT Comments: $crgptCount" -ForegroundColor White
    Write-Host "Next Action: Monitor reviews and prepare for merge" -ForegroundColor White
    
} catch {
    Write-Error "Automation failed: $($_.Exception.Message)"
}

Write-Host "Automation completed!" -ForegroundColor Green
