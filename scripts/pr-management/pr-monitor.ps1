# PR Monitoring System for Portfolio OS
# Usage: .\pr-monitor.ps1 [-WatchMode] [-Interval <SECONDS>] [-Filter <FILTER>]

param(
    [Parameter(Mandatory=$false)]
    [switch]$WatchMode,
    
    [Parameter(Mandatory=$false)]
    [int]$Interval = 60,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("open", "draft", "merged", "closed", "all")]
    [string]$Filter = "open",
    
    [Parameter(Mandatory=$false)]
    [string]$ExportTo,
    
    [Parameter(Mandatory=$false)]
    [switch]$ShowDetails,
    
    [Parameter(Mandatory=$false)]
    [switch]$IncludeCRGPT
)

# Import shared utilities
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$utilsPath = Join-Path (Split-Path -Parent $scriptPath) "core-utilities\get-github-utilities.ps1"

if (Test-Path $utilsPath) {
    . $utilsPath
} else {
    Write-Warning "GitHub utilities not found at $utilsPath"
}

function Show-PRMonitorHeader {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "`n🔍 PORTFOLIO OS PR MONITOR" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    Write-Host "Last Updated: $timestamp" -ForegroundColor Gray
    Write-Host "Filter: $Filter" -ForegroundColor Gray
    if ($WatchMode) {
        Write-Host "Watch Mode: Active (Interval: $Interval seconds)" -ForegroundColor Yellow
    }
    Write-Host "=" * 40 -ForegroundColor Cyan
}

function Get-PRSummary {
    param([string]$State = "open")
    
    try {
        $prs = gh pr list --state $State --json number,title,headRefName,baseRefName,author,createdAt,updatedAt,labels,reviewDecision,isDraft,additions,deletions,changedFiles
        return $prs | ConvertFrom-Json
    }
    catch {
        Write-Host "❌ Failed to fetch PRs: $($_.Exception.Message)" -ForegroundColor Red
        return @()
    }
}

function Get-CRGPTComments {
    param([string]$PRNumber)
    
    try {
        $comments = gh pr view $PRNumber --json comments | ConvertFrom-Json
        $crgptComments = $comments.comments | Where-Object { $_.author.login -eq "cr-gpt" }
        return $crgptComments
    }
    catch {
        Write-Host "⚠️  Could not fetch CR-GPT comments for PR #$PRNumber" -ForegroundColor Yellow
        return @()
    }
}

function Show-PRDetails {
    param([object]$PR)
    
    $statusColor = switch ($PR.reviewDecision) {
        "APPROVED" { "Green" }
        "CHANGES_REQUESTED" { "Red" }
        "REVIEW_REQUIRED" { "Yellow" }
        default { "Gray" }
    }
    
    $draftStatus = if ($PR.isDraft) { "[DRAFT]" } else { "" }
    
    Write-Host "`nPR #$($PR.number): $($PR.title)" -ForegroundColor White
    Write-Host "  Author: $($PR.author.login)" -ForegroundColor Gray
    Write-Host "  Branch: $($PR.headRefName) → $($PR.baseRefName)" -ForegroundColor Gray
    Write-Host "  Status: $($PR.reviewDecision) $draftStatus" -ForegroundColor $statusColor
    Write-Host "  Created: $([DateTime]::Parse($PR.createdAt).ToString('yyyy-MM-dd HH:mm'))" -ForegroundColor Gray
    Write-Host "  Updated: $([DateTime]::Parse($PR.updatedAt).ToString('yyyy-MM-dd HH:mm'))" -ForegroundColor Gray
    
    if ($PR.additions -or $PR.deletions) {
        Write-Host "  Changes: +$($PR.additions) -$($PR.deletions) ($($PR.changedFiles) files)" -ForegroundColor Cyan
    }
    
    if ($PR.labels.Count -gt 0) {
        $labelNames = $PR.labels.name -join ", "
        Write-Host "  Labels: $labelNames" -ForegroundColor Magenta
    }
    
    # Show CR-GPT comments if requested
    if ($IncludeCRGPT) {
        $crgptComments = Get-CRGPTComments -PRNumber $PR.number
        if ($crgptComments.Count -gt 0) {
            Write-Host "  CR-GPT Comments: $($crgptComments.Count)" -ForegroundColor Yellow
            
            if ($ShowDetails) {
                foreach ($comment in $crgptComments | Select-Object -First 3) {
                    $commentPreview = $comment.body.Substring(0, [Math]::Min(100, $comment.body.Length))
                    Write-Host "    • $commentPreview..." -ForegroundColor Gray
                }
            }
        } else {
            Write-Host "  CR-GPT Comments: None" -ForegroundColor Green
        }
    }
}

function Show-PRSummary {
    param([array]$PRs)
    
    if ($PRs.Count -eq 0) {
        Write-Host "`n📭 No PRs found matching filter: $Filter" -ForegroundColor Gray
        return
    }
    
    Write-Host "`n📊 PR SUMMARY" -ForegroundColor Yellow
    
    # Count by status
    $approved = ($PRs | Where-Object { $_.reviewDecision -eq "APPROVED" }).Count
    $changesRequested = ($PRs | Where-Object { $_.reviewDecision -eq "CHANGES_REQUESTED" }).Count
    $reviewRequired = ($PRs | Where-Object { $_.reviewDecision -eq "REVIEW_REQUIRED" }).Count
    $drafts = ($PRs | Where-Object { $_.isDraft }).Count
    
    Write-Host "Total PRs: $($PRs.Count)" -ForegroundColor White
    Write-Host "✅ Approved: $approved" -ForegroundColor Green
    Write-Host "🔄 Changes Requested: $changesRequested" -ForegroundColor Red
    Write-Host "⏳ Review Required: $reviewRequired" -ForegroundColor Yellow
    Write-Host "📝 Drafts: $drafts" -ForegroundColor Gray
    
    # Calculate total changes
    $totalAdditions = ($PRs | Measure-Object -Property additions -Sum).Sum
    $totalDeletions = ($PRs | Measure-Object -Property deletions -Sum).Sum
    $totalFiles = ($PRs | Measure-Object -Property changedFiles -Sum).Sum
    
    Write-Host "`n📈 Total Changes:" -ForegroundColor Cyan
    Write-Host "  +$totalAdditions lines added" -ForegroundColor Green
    Write-Host "  -$totalDeletions lines deleted" -ForegroundColor Red
    Write-Host "  $totalFiles files changed" -ForegroundColor White
    
    # Show oldest PRs
    $oldestPRs = $PRs | Sort-Object createdAt | Select-Object -First 3
    if ($oldestPRs.Count -gt 0) {
        Write-Host "`n⏰ Oldest PRs:" -ForegroundColor Yellow
        foreach ($pr in $oldestPRs) {
            $daysOld = [Math]::Round(((Get-Date) - [DateTime]::Parse($pr.createdAt)).TotalDays, 1)
            Write-Host "  #$($pr.number): $($pr.title) ($daysOld days old)" -ForegroundColor Gray
        }
    }
}

function Export-PRReport {
    param([array]$PRs, [string]$OutputFile)
    
    $report = @{
        GeneratedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Filter = $Filter
        TotalPRs = $PRs.Count
        Summary = @{
            Approved = ($PRs | Where-Object { $_.reviewDecision -eq "APPROVED" }).Count
            ChangesRequested = ($PRs | Where-Object { $_.reviewDecision -eq "CHANGES_REQUESTED" }).Count
            ReviewRequired = ($PRs | Where-Object { $_.reviewDecision -eq "REVIEW_REQUIRED" }).Count
            Drafts = ($PRs | Where-Object { $_.isDraft }).Count
        }
        Changes = @{
            TotalAdditions = ($PRs | Measure-Object -Property additions -Sum).Sum
            TotalDeletions = ($PRs | Measure-Object -Property deletions -Sum).Sum
            TotalFiles = ($PRs | Measure-Object -Property changedFiles -Sum).Sum
        }
        PRs = $PRs | ForEach-Object {
            @{
                Number = $_.number
                Title = $_.title
                Author = $_.author.login
                Status = $_.reviewDecision
                IsDraft = $_.isDraft
                CreatedAt = $_.createdAt
                UpdatedAt = $_.updatedAt
                Changes = @{
                    Additions = $_.additions
                    Deletions = $_.deletions
                    Files = $_.changedFiles
                }
            }
        }
    }
    
    try {
        $report | ConvertTo-Json -Depth 3 | Out-File -FilePath $OutputFile -Encoding UTF8
        Write-Host "📄 PR report exported to: $OutputFile" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to export report: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Start-PRWatchMode {
    param([int]$IntervalSeconds)
    
    Write-Host "`n👀 Starting PR watch mode..." -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Gray
    
    $lastPRCount = 0
    $lastUpdate = [DateTime]::MinValue
    
    while ($true) {
        try {
            Clear-Host
            Show-PRMonitorHeader
            
            $prs = Get-PRSummary -State $Filter
            
            # Check for new PRs
            if ($prs.Count -ne $lastPRCount) {
                $change = $prs.Count - $lastPRCount
                $changeText = if ($change -gt 0) { "+$change" } else { "$change" }
                Write-Host "`n📊 PR Count Changed: $changeText (Total: $($prs.Count))" -ForegroundColor Yellow
                $lastPRCount = $prs.Count
            }
            
            Show-PRSummary -PRs $prs
            
            if ($ShowDetails) {
                Write-Host "`n📋 DETAILED PR LIST" -ForegroundColor Yellow
                foreach ($pr in $prs | Sort-Object updatedAt -Descending | Select-Object -First 10) {
                    Show-PRDetails -PR $pr
                }
            }
            
            $lastUpdate = Get-Date
            Write-Host "`n⏰ Next update in $IntervalSeconds seconds..." -ForegroundColor Gray
            Write-Host "Press Ctrl+C to exit" -ForegroundColor Gray
            
            Start-Sleep -Seconds $IntervalSeconds
        }
        catch {
            Write-Host "❌ Error in watch mode: $($_.Exception.Message)" -ForegroundColor Red
            Start-Sleep -Seconds 5
        }
    }
}

# Main execution
try {
    if ($WatchMode) {
        Start-PRWatchMode -IntervalSeconds $Interval
    } else {
        Show-PRMonitorHeader
        
        $prs = Get-PRSummary -State $Filter
        Show-PRSummary -PRs $prs
        
        if ($ShowDetails) {
            Write-Host "`n📋 DETAILED PR LIST" -ForegroundColor Yellow
            foreach ($pr in $prs | Sort-Object updatedAt -Descending | Select-Object -First 20) {
                Show-PRDetails -PR $pr
            }
        }
        
        if ($ExportTo) {
            Export-PRReport -PRs $prs -OutputFile $ExportTo
        }
    }
}
catch {
    Write-Error "PR monitoring error: $($_.Exception.Message)"
    exit 1
}
