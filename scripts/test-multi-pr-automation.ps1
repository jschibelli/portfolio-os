# Test Multi-PR Automation Script
# Usage: .\scripts\test-multi-pr-automation.ps1 -PRNumbers @(240,244) [-BreakMinutes 2] [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [int[]]$PRNumbers = @(240, 244),  # Default test PRs
    
    [Parameter(Mandatory=$false)]
    [int]$BreakMinutes = 2,
    
    [Parameter(Mandatory=$false)]
    [int]$CommentBreakSeconds = 30,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

Write-Host "Testing Multi-PR Automation System" -ForegroundColor Cyan
Write-Host "PR Numbers: $($PRNumbers -join ', ')" -ForegroundColor White
Write-Host "Break between PRs: $BreakMinutes minutes" -ForegroundColor White
Write-Host "Break between comments: $CommentBreakSeconds seconds" -ForegroundColor White
Write-Host "Dry Run: $DryRun" -ForegroundColor White
Write-Host ""

if ($DryRun) {
    Write-Host "Running in DRY RUN mode - no actual changes will be made" -ForegroundColor Yellow
    .\scripts\multi-pr-automation.ps1 -PRNumbers $PRNumbers -BreakMinutes $BreakMinutes -CommentBreakSeconds $CommentBreakSeconds -DryRun -AutoFix -AutoCommit
} else {
    Write-Host "WARNING: This will make actual changes to the PRs!" -ForegroundColor Red
    Write-Host "Press Ctrl+C to cancel, or wait 5 seconds to continue..." -ForegroundColor Yellow
    
    for ($i = 5; $i -gt 0; $i--) {
        Write-Host "$i..." -ForegroundColor Yellow -NoNewline
        Start-Sleep -Seconds 1
    }
    Write-Host ""
    
    .\scripts\multi-pr-automation.ps1 -PRNumbers $PRNumbers -BreakMinutes $BreakMinutes -CommentBreakSeconds $CommentBreakSeconds -AutoFix -AutoCommit
}

Write-Host ""
Write-Host "Multi-PR Automation test completed!" -ForegroundColor Green
