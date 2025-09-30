# Simple Merge Guidance for PR #210
param([string]$PRNumber = "210")

Write-Host "Merge Guidance for PR #$PRNumber" -ForegroundColor Cyan

try {
    # Get PR details
    $pr = gh pr view $PRNumber --json isDraft,mergeable,mergeStateStatus,reviewDecision,reviews | ConvertFrom-Json
    
    Write-Host "`nMerge Readiness Check:" -ForegroundColor Cyan
    Write-Host "Draft Status: $(if (-not $pr.isDraft) { '✅ Not Draft' } else { '❌ Still Draft' })" -ForegroundColor $(if (-not $pr.isDraft) { "Green" } else { "Red" })
    Write-Host "Mergeable: $(if ($pr.mergeable) { '✅ Yes' } else { '❌ No' })" -ForegroundColor $(if ($pr.mergeable) { "Green" } else { "Red" })
    Write-Host "Merge State: $($pr.mergeStateStatus)" -ForegroundColor White
    Write-Host "Review Decision: $($pr.reviewDecision)" -ForegroundColor White
    
    $isReady = -not $pr.isDraft -and $pr.mergeable -and $pr.mergeStateStatus -eq "CLEAN"
    
    if ($isReady) {
        Write-Host "`n🎉 PR is ready for merge!" -ForegroundColor Green
        
        Write-Host "`nMerge Checklist:" -ForegroundColor Yellow
        Write-Host "* All CR-GPT comments addressed" -ForegroundColor Gray
        Write-Host "* Code review approved" -ForegroundColor Gray
        Write-Host "* CI checks passing" -ForegroundColor Gray
        Write-Host "* No merge conflicts" -ForegroundColor Gray
        Write-Host "* Tests passing" -ForegroundColor Gray
        
        Write-Host "`nMerge Commands:" -ForegroundColor Yellow
        Write-Host "1. GitHub Web: https://github.com/jschibelli/portfolio-os/pull/$PRNumber" -ForegroundColor Cyan
        Write-Host "2. CLI: gh pr merge $PRNumber --rebase --delete-branch" -ForegroundColor Cyan
        
        # Update status to "In review" (ready for merge)
        & "scripts\auto-configure-pr.ps1" -PRNumber $PRNumber -Status "In review"
        
    } else {
        Write-Host "`n⏳ PR not yet ready for merge" -ForegroundColor Yellow
        Write-Host "Address the issues above before proceeding." -ForegroundColor Yellow
        
        # Keep status as "In progress"
        & "scripts\auto-configure-pr.ps1" -PRNumber $PRNumber -Status "In progress"
    }
    
    Write-Host "`n=== Merge Guidance Report ===" -ForegroundColor White
    Write-Host "PR: #$PRNumber" -ForegroundColor White
    Write-Host "Merge Ready: $(if ($isReady) { 'Yes' } else { 'No' })" -ForegroundColor White
    Write-Host "Next Action: $(if ($isReady) { 'Proceed with merge' } else { 'Address remaining issues' })" -ForegroundColor White
    
} catch {
    Write-Error "Merge guidance failed: $($_.Exception.Message)"
}

Write-Host "`nMerge guidance completed!" -ForegroundColor Green
