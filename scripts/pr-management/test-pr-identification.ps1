#!/usr/bin/env pwsh
# Test PR Identification Script
# Simple version to identify PRs that can be closed

param(
    [switch]$DryRun
)

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "      PR Identification Test" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

# Step 1: Get all open PRs
Write-Host "Step 1: Fetching open PRs..." -ForegroundColor Yellow
$openPRs = gh pr list --state open --json number,title,headRefName,baseRefName,author,createdAt,updatedAt,labels,reviewDecision,isDraft
$prCount = $openPRs.Count
Write-Host "Found $prCount open PRs" -ForegroundColor Green

if ($prCount -eq 0) {
    Write-Host "No open PRs found. Exiting." -ForegroundColor Red
    exit 0
}

# Step 2: Analyze each PR for CR-GPT comments
Write-Host "Step 2: Analyzing PR complexity and CR-GPT comments..." -ForegroundColor Yellow
$prAnalysis = @()

foreach ($pr in $openPRs) {
    Write-Host "Analyzing PR #$($pr.number): $($pr.title)" -ForegroundColor Cyan
    
    # Get PR details and comments
    $prDetails = gh pr view $pr.number --json title,body,comments,reviews,commits,files
    $crgptComments = $prDetails.comments | Where-Object { $_.author.login -eq "cr-gpt" }
    
    # Count CR-GPT comments
    $totalComments = $crgptComments.Count
    
    # Determine if ready for merge
    $readyForMerge = $totalComments -eq 0 -and -not $pr.isDraft
    
    $prAnalysis += @{
        Number = $pr.number
        Title = $pr.title
        TotalComments = $totalComments
        IsDraft = $pr.isDraft
        ReadyForMerge = $readyForMerge
        HeadRef = $pr.headRefName
        BaseRef = $pr.baseRefName
    }
}

# Step 3: Report results
Write-Host "Step 3: Reporting results..." -ForegroundColor Yellow

$readyPRs = ($prAnalysis | Where-Object { $_.ReadyForMerge }).Count
$draftPRs = ($prAnalysis | Where-Object { $_.IsDraft }).Count

Write-Host ""
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "      Analysis Results" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "Total PRs: $prCount" -ForegroundColor Green
Write-Host "Ready for Merge: $readyPRs PRs" -ForegroundColor Green
Write-Host "Draft PRs: $draftPRs PRs" -ForegroundColor Yellow
Write-Host ""

if ($readyPRs -gt 0) {
    Write-Host "PRs that can be closed/merged:" -ForegroundColor Green
    foreach ($pr in ($prAnalysis | Where-Object { $_.ReadyForMerge })) {
        Write-Host "  ✅ PR #$($pr.Number) - $($pr.Title)" -ForegroundColor Green
        Write-Host "     - CR-GPT Comments: $($pr.TotalComments)" -ForegroundColor White
        Write-Host "     - Branch: $($pr.HeadRef) -> $($pr.BaseRef)" -ForegroundColor White
    }
} else {
    Write-Host "No PRs are ready for merge (all have CR-GPT comments or are drafts)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Analysis complete!" -ForegroundColor Green
