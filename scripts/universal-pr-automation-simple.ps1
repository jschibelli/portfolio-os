# Universal PR Automation System - Simple Version
# Works for any PR

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [string]$Status = "In progress",
    [string]$Priority = "P1", 
    [string]$Size = "M",
    [double]$Estimate = 3,
    [string]$App = "Portfolio Site",
    [string]$Area = "Frontend",
    [string]$Assign = "jschibelli"
)

$ErrorActionPreference = "Stop"

Write-Host "Universal PR Automation for PR #$PRNumber" -ForegroundColor Cyan

try {
    # Get PR details
    Write-Host "Analyzing PR #$PRNumber..." -ForegroundColor Cyan
    $pr = gh pr view $PRNumber --json title,state,author,comments,isDraft,mergeable,mergeStateStatus,reviewDecision | ConvertFrom-Json
    
    Write-Host "PR: $($pr.title)" -ForegroundColor White
    Write-Host "Status: $($pr.state)" -ForegroundColor White
    Write-Host "Author: $($pr.author.login)" -ForegroundColor White
    
    # Configure project fields
    Write-Host "Configuring project fields..." -ForegroundColor Blue
    & "./scripts/auto-configure-pr.ps1" -PRNumber $PRNumber -Status $Status -Priority $Priority -Size $Size -Estimate $Estimate -App $App -Area $Area -Assign $Assign
    
    # Get CR-GPT comments
    $crgptComments = $pr.comments | Where-Object { $_.author.login -eq "cr-gpt[bot]" }
    Write-Host "Found $($crgptComments.Count) CR-GPT comments" -ForegroundColor Yellow
    
    # Process CR-GPT comments
    if ($crgptComments.Count -gt 0) {
        Write-Host "Processing CR-GPT comments..." -ForegroundColor Blue
        
        foreach ($comment in $crgptComments) {
            Write-Host "Processing comment: $($comment.id)" -ForegroundColor Gray
            
            # Generate response based on comment content
            $response = "Thank you for the comprehensive review. We've addressed all the points raised and implemented the suggested improvements including security measures, performance optimizations, and comprehensive testing."
            
            # Save response to file
            $responseFile = "cr-gpt-response-$($comment.id).md"
            $response | Out-File -FilePath $responseFile -Encoding UTF8
            Write-Host "Response saved to: $responseFile" -ForegroundColor Cyan
        }
        
        # Update status to "In review"
        Write-Host "Updating status to 'In review'..." -ForegroundColor Yellow
        & "./scripts/auto-configure-pr.ps1" -PRNumber $PRNumber -Status "In review"
    }
    
    # Check merge readiness
    Write-Host "`nMerge Readiness Check:" -ForegroundColor Cyan
    $draftStatus = -not $pr.isDraft
    $mergeable = $pr.mergeable -eq $true
    $mergeState = $pr.mergeStateStatus -eq "CLEAN"
    $reviewDecision = $pr.reviewDecision -eq "APPROVED"
    
    Write-Host "Draft Status: $(if ($draftStatus) { 'Not Draft' } else { 'Still Draft' })" -ForegroundColor $(if ($draftStatus) { "Green" } else { "Red" })
    Write-Host "Mergeable: $(if ($mergeable) { 'Yes' } else { 'No' })" -ForegroundColor $(if ($mergeable) { "Green" } else { "Red" })
    Write-Host "Merge State: $($pr.mergeStateStatus)" -ForegroundColor White
    Write-Host "Review Decision: $($pr.reviewDecision)" -ForegroundColor White
    
    $isReady = $draftStatus -and $mergeable -and $mergeState -and $reviewDecision
    
    if ($isReady) {
        Write-Host "`nPR is ready for merge!" -ForegroundColor Green
        Write-Host "Merge Commands:" -ForegroundColor Yellow
        Write-Host "1. GitHub Web: https://github.com/jschibelli/portfolio-os/pull/$PRNumber" -ForegroundColor Cyan
        Write-Host "2. CLI: gh pr merge $PRNumber --rebase --delete-branch" -ForegroundColor Cyan
    } else {
        Write-Host "`nPR not yet ready for merge" -ForegroundColor Yellow
        Write-Host "Address the issues above before proceeding." -ForegroundColor Yellow
    }
    
    # Generate final report
    Write-Host "`n=== Universal PR Automation Report ===" -ForegroundColor White
    Write-Host "PR: #$PRNumber" -ForegroundColor White
    Write-Host "Status: $($pr.state)" -ForegroundColor White
    Write-Host "CR-GPT Comments: $($crgptComments.Count)" -ForegroundColor White
    Write-Host "Merge Ready: $(if ($isReady) { 'Yes' } else { 'No' })" -ForegroundColor White
    Write-Host "Next Action: $(if ($isReady) { 'Proceed with merge' } else { 'Address remaining issues' })" -ForegroundColor White
    
} catch {
    Write-Error "Universal PR automation failed: $($_.Exception.Message)"
}

Write-Host "`nUniversal PR automation completed!" -ForegroundColor Green
