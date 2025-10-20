#!/usr/bin/env pwsh
# Check Status of All Chatbot v1.1.0 PRs

param(
    [switch]$Detailed
)

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "      Chatbot v1.1.0 - PR Status Check" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

# All chatbot PRs
$chatbotPRs = @(333, 336, 337, 340, 334, 332, 335, 338, 339)

$results = @()

foreach ($prNum in $chatbotPRs) {
    Write-Host "Checking PR #$prNum..." -ForegroundColor Cyan
    
    try {
        $prData = gh pr view $prNum --json number,title,state,isDraft,commits,reviewDecision,statusCheckRollup | ConvertFrom-Json
        
        $commitCount = $prData.commits.Count
        $hasCommits = $commitCount -gt 0
        $reviewStatus = if ($prData.reviewDecision) { $prData.reviewDecision } else { "NONE" }
        
        # Check CI status
        $ciStatus = "UNKNOWN"
        if ($prData.statusCheckRollup) {
            $failedChecks = $prData.statusCheckRollup | Where-Object { $_.state -in @("FAILURE", "ERROR") }
            $pendingChecks = $prData.statusCheckRollup | Where-Object { $_.state -in @("PENDING", "EXPECTED") }
            
            if ($failedChecks.Count -gt 0) {
                $ciStatus = "FAILED"
            } elseif ($pendingChecks.Count -gt 0) {
                $ciStatus = "PENDING"
            } else {
                $ciStatus = "PASSED"
            }
        }
        
        $results += @{
            PR = $prNum
            Title = $prData.title
            Commits = $commitCount
            Review = $reviewStatus
            CI = $ciStatus
            Draft = $prData.isDraft
        }
        
        # Display status
        Write-Host "  CI: $ciStatus | Review: $reviewStatus | Commits: $commitCount" -ForegroundColor Gray
        
        if ($Detailed) {
            Write-Host "  Title: $($prData.title)" -ForegroundColor White
            if ($ciStatus -eq "FAILED") {
                $failedChecks = $prData.statusCheckRollup | Where-Object { $_.state -in @("FAILURE", "ERROR") }
                foreach ($check in $failedChecks) {
                    Write-Host "    FAILED: $($check.name): $($check.state)" -ForegroundColor Red
                }
            }
        }
        
    } catch {
        Write-Host "  Error checking PR: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Summary
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "                  Summary" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

$totalPRs = $results.Count
$withCommits = ($results | Where-Object { $_.Commits -gt 0 }).Count
$ciPassed = ($results | Where-Object { $_.CI -eq "PASSED" }).Count
$ciFailed = ($results | Where-Object { $_.CI -eq "FAILED" }).Count
$ciPending = ($results | Where-Object { $_.CI -eq "PENDING" }).Count
$approved = ($results | Where-Object { $_.Review -eq "APPROVED" }).Count
$changesRequested = ($results | Where-Object { $_.Review -eq "CHANGES_REQUESTED" }).Count
$needsReview = ($results | Where-Object { $_.Review -in @("NONE", "REVIEW_REQUIRED") }).Count

Write-Host "Total PRs: $totalPRs" -ForegroundColor White
Write-Host ""

Write-Host "Implementation:" -ForegroundColor Cyan
Write-Host "  With commits: $withCommits / $totalPRs" -ForegroundColor Green
if ($withCommits -eq $totalPRs) {
    Write-Host "  SUCCESS: All PRs have been implemented!" -ForegroundColor Green
}
Write-Host ""

Write-Host "CI Status:" -ForegroundColor Cyan
Write-Host "  Passed: $ciPassed" -ForegroundColor Green
Write-Host "  Pending: $ciPending" -ForegroundColor Yellow
Write-Host "  Failed: $ciFailed" -ForegroundColor Red
Write-Host ""

Write-Host "Review Status:" -ForegroundColor Cyan
Write-Host "  Approved: $approved" -ForegroundColor Green
Write-Host "  Changes Requested: $changesRequested" -ForegroundColor Red
Write-Host "  Needs Review: $needsReview" -ForegroundColor Yellow
Write-Host ""

# Next actions
Write-Host "Next Actions:" -ForegroundColor Cyan

if ($ciFailed -gt 0) {
    Write-Host "  URGENT: Fix $ciFailed PR(s) with failing CI" -ForegroundColor Red
    $failedPRs = $results | Where-Object { $_.CI -eq "FAILED" }
    foreach ($pr in $failedPRs) {
        Write-Host "     - PR #$($pr.PR): $($pr.Title)" -ForegroundColor Red
    }
}

if ($changesRequested -gt 0) {
    Write-Host "  WARNING: Address $changesRequested PR(s) with requested changes" -ForegroundColor Yellow
    $changedPRs = $results | Where-Object { $_.Review -eq "CHANGES_REQUESTED" }
    foreach ($pr in $changedPRs) {
        Write-Host "     - PR #$($pr.PR): $($pr.Title)" -ForegroundColor Yellow
    }
}

if ($needsReview -gt 0) {
    Write-Host "  TODO: Request reviews for $needsReview PR(s)" -ForegroundColor Cyan
}

if ($approved -eq $totalPRs -and $ciPassed -eq $totalPRs) {
    Write-Host "  SUCCESS: All PRs approved and passing CI!" -ForegroundColor Green
    Write-Host "  READY: Can begin merging!" -ForegroundColor Green
}

Write-Host ""
