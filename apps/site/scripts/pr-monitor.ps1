# PowerShell script to monitor pull request activity and CR-GPT bot comments
# Usage: .\scripts\pr-monitor.ps1 -PRNumber <PR_NUMBER> [-WatchMode] [-Interval <SECONDS>]

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [Parameter(Mandatory=$false)]
    [switch]$WatchMode,
    
    [Parameter(Mandatory=$false)]
    [int]$Interval = 30
)

function Get-PRInfo {
    param([string]$PRNumber)
    
    $repoOwner = gh repo view --json owner -q .owner.login
    $repoName = gh repo view --json name -q .name
    
    $prInfoJson = gh api repos/$repoOwner/$repoName/pulls/$PRNumber
    $prInfo = $prInfoJson | ConvertFrom-Json
    return $prInfo
}

function Get-PRComments {
    param([string]$PRNumber)
    
    $repoOwner = gh repo view --json owner -q .owner.login
    $repoName = gh repo view --json name -q .name
    
    $commentsJson = gh api repos/$repoOwner/$repoName/pulls/$PRNumber/comments
    $comments = $commentsJson | ConvertFrom-Json
    return $comments
}

function Get-CRGPTComments {
    param([string]$PRNumber)
    
    $allComments = Get-PRComments -PRNumber $PRNumber
    $crgptComments = $allComments | Where-Object { $_.user.login -eq "cr-gpt[bot]" }
    return $crgptComments
}

function Show-PRStatus {
    param([string]$PRNumber)
    
    $prInfo = Get-PRInfo -PRNumber $PRNumber
    $crgptComments = Get-CRGPTComments -PRNumber $PRNumber
    
    Write-Host "=== PR #$PRNumber Status ===" -ForegroundColor Green
    Write-Host "Title: $($prInfo.title)" -ForegroundColor Cyan
    Write-Host "State: $($prInfo.state)" -ForegroundColor Yellow
    Write-Host "Author: $($prInfo.user.login)" -ForegroundColor Cyan
    Write-Host "CR-GPT Comments: $($crgptComments.Count)" -ForegroundColor Yellow
    
    if ($crgptComments.Count -gt 0) {
        Write-Host "`n=== CR-GPT Bot Comments ===" -ForegroundColor Green
        foreach ($comment in $crgptComments) {
            Write-Host "Comment ID: $($comment.id)" -ForegroundColor Cyan
            Write-Host "Created: $($comment.created_at)" -ForegroundColor Gray
            Write-Host "Preview: $($comment.body.Substring(0, [Math]::Min(100, $comment.body.Length)))..." -ForegroundColor White
            Write-Host "URL: $($comment.html_url)" -ForegroundColor Blue
            Write-Host "---" -ForegroundColor Gray
        }
    }
}

function Watch-PR {
    param([string]$PRNumber, [int]$Interval)
    
    Write-Host "Watching PR #$PRNumber for changes (interval: $Interval seconds)" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    
    $lastCommentCount = 0
    
    while ($true) {
        try {
            $crgptComments = Get-CRGPTComments -PRNumber $PRNumber
            $currentCommentCount = $crgptComments.Count
            
            if ($currentCommentCount -gt $lastCommentCount) {
                Write-Host "`n🔄 New CR-GPT comment detected!" -ForegroundColor Green
                Show-PRStatus -PRNumber $PRNumber
                $lastCommentCount = $currentCommentCount
            }
            
            Start-Sleep -Seconds $Interval
        }
        catch {
            Write-Error "Error monitoring PR: $($_.Exception.Message)"
            Start-Sleep -Seconds $Interval
        }
    }
}

# Main execution
try {
    if ($WatchMode) {
        Watch-PR -PRNumber $PRNumber -Interval $Interval
    } else {
        Show-PRStatus -PRNumber $PRNumber
    }
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
}
