# Fast PR Workflow - Optimized for speed and efficiency
# Usage: .\scripts\fast-pr-workflow.ps1 -PRNumber <PR_NUMBER> [-Watch] [-QuickAnalysis]

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [Parameter(Mandatory=$false)]
    [switch]$Watch,
    
    [Parameter(Mandatory=$false)]
    [switch]$QuickAnalysis
)

function Show-FastBanner {
    Write-Host "Fast PR Workflow - Optimized for Speed" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
}

function Get-PRStatus {
    param([string]$PRNumber)
    
    $repoOwner = gh repo view --json owner -q .owner.login
    $repoName = gh repo view --json name -q .name
    
    $prInfoJson = gh api repos/$repoOwner/$repoName/pulls/$PRNumber
    $prInfo = $prInfoJson | ConvertFrom-Json
    
    Write-Host "PR $PRNumber - $($prInfo.title)" -ForegroundColor Cyan
    Write-Host "Author: $($prInfo.user.login)" -ForegroundColor Cyan
    Write-Host "State: $($prInfo.state)" -ForegroundColor $(if ($prInfo.state -eq "open") { "Green" } else { "Yellow" })
    Write-Host "URL: $($prInfo.html_url)" -ForegroundColor Blue
    Write-Host ""
}

function Get-CRGPTSummary {
    param([string]$PRNumber)
    
    $repoOwner = gh repo view --json owner -q .owner.login
    $repoName = gh repo view --json name -q .name
    
    $commentsJson = gh api repos/$repoOwner/$repoName/pulls/$PRNumber/comments
    $comments = $commentsJson | ConvertFrom-Json
    $crgptComments = $comments | Where-Object { $_.user.login -eq "cr-gpt[bot]" }
    
    if ($crgptComments.Count -eq 0) {
        Write-Host "No CR-GPT comments found" -ForegroundColor Green
        return
    }
    
    Write-Host "CR-GPT Bot Activity: $($crgptComments.Count) comments" -ForegroundColor Yellow
    
    # Quick summary of comment types
    $highPriority = 0
    $mediumPriority = 0
    $lowPriority = 0
    
    foreach ($comment in $crgptComments) {
        $body = $comment.body.ToLower()
        if ($body -match "bug risk|security|vulnerability") {
            $highPriority++
        } elseif ($body -match "improvement|enhancement|suggestion") {
            $mediumPriority++
        } else {
            $lowPriority++
        }
    }
    
    Write-Host "   High Priority: $highPriority" -ForegroundColor Red
    Write-Host "   Medium Priority: $mediumPriority" -ForegroundColor Yellow
    Write-Host "   Low Priority: $lowPriority" -ForegroundColor Green
    Write-Host ""
    
    # Show latest comment
    if ($crgptComments.Count -gt 0) {
        $latestComment = $crgptComments | Sort-Object { [DateTime]$_.created_at } -Descending | Select-Object -First 1
        Write-Host "Latest Comment Preview:" -ForegroundColor Cyan
        $preview = $latestComment.body.Substring(0, [Math]::Min(150, $latestComment.body.Length))
        Write-Host "   $preview..." -ForegroundColor Gray
        Write-Host "   URL: $($latestComment.html_url)" -ForegroundColor Blue
        Write-Host ""
    }
}

function Run-QuickAnalysis {
    param([string]$PRNumber)
    
    Write-Host "Running Quick Analysis..." -ForegroundColor Green
    
    # Generate a quick summary report
    $reportPath = "quick-analysis-pr-$PRNumber.md"
    
    $report = "# Quick PR Analysis - PR $PRNumber`n`n"
    $report += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n`n"
    
    # Get PR info
    $repoOwner = gh repo view --json owner -q .owner.login
    $repoName = gh repo view --json name -q .name
    
    $prInfoJson = gh api repos/$repoOwner/$repoName/pulls/$PRNumber
    $prInfo = $prInfoJson | ConvertFrom-Json
    
    $report += "## PR Summary`n"
    $report += "- **Title**: $($prInfo.title)`n"
    $report += "- **Author**: $($prInfo.user.login)`n"
    $report += "- **State**: $($prInfo.state)`n"
    $report += "- **URL**: $($prInfo.html_url)`n`n"
    
    # Get CR-GPT comments summary
    $commentsJson = gh api repos/$repoOwner/$repoName/pulls/$PRNumber/comments
    $comments = $commentsJson | ConvertFrom-Json
    $crgptComments = $comments | Where-Object { $_.user.login -eq "cr-gpt[bot]" }
    
    $report += "## CR-GPT Bot Analysis`n"
    $report += "- **Total Comments**: $($crgptComments.Count)`n"
    
    if ($crgptComments.Count -gt 0) {
        $report += "- **Latest Comment**: $($crgptComments[0].created_at)`n"
        $report += "- **Comment URL**: $($crgptComments[0].html_url)`n`n"
        
        $report += "## Action Items`n"
        $report += "1. Review CR-GPT bot comments`n"
        $report += "2. Address high-priority issues first`n"
        $report += "3. Test changes locally`n"
        $report += "4. Respond to comments with status updates`n"
    } else {
        $report += "- **Status**: No CR-GPT comments found`n`n"
        $report += "## Next Steps`n"
        $report += "1. Continue with normal PR review process`n"
        $report += "2. Monitor for new CR-GPT comments`n"
    }
    
    $report | Out-File -FilePath $reportPath -Encoding UTF8
    Write-Host "Quick analysis saved to: $reportPath" -ForegroundColor Green
}

function Watch-PRActivity {
    param([string]$PRNumber, [int]$Interval = 30)
    
    Write-Host "Watching PR $PRNumber for changes (interval: $Interval seconds)" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""
    
    $lastCommentCount = 0
    
    while ($true) {
        try {
            $repoOwner = gh repo view --json owner -q .owner.login
            $repoName = gh repo view --json name -q .name
            
            $commentsJson = gh api repos/$repoOwner/$repoName/pulls/$PRNumber/comments
            $comments = $commentsJson | ConvertFrom-Json
            $crgptComments = $comments | Where-Object { $_.user.login -eq "cr-gpt[bot]" }
            $currentCommentCount = $crgptComments.Count
            
            if ($currentCommentCount -gt $lastCommentCount) {
                Write-Host "New CR-GPT comment detected!" -ForegroundColor Green
                Write-Host "Total comments: $currentCommentCount" -ForegroundColor Cyan
                
                # Show latest comment
                $latestComment = $crgptComments | Sort-Object { [DateTime]$_.created_at } -Descending | Select-Object -First 1
                Write-Host "Latest: $($latestComment.body.Substring(0, [Math]::Min(100, $latestComment.body.Length)))..." -ForegroundColor Gray
                Write-Host "URL: $($latestComment.html_url)" -ForegroundColor Blue
                Write-Host ""
                
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
    Show-FastBanner
    
    # Show PR status
    Get-PRStatus -PRNumber $PRNumber
    
    # Show CR-GPT summary
    Get-CRGPTSummary -PRNumber $PRNumber
    
    if ($QuickAnalysis) {
        Run-QuickAnalysis -PRNumber $PRNumber
    }
    
    if ($Watch) {
        Watch-PRActivity -PRNumber $PRNumber
    } else {
        Write-Host "Tip: Use -Watch flag for continuous monitoring" -ForegroundColor Cyan
        Write-Host "Tip: Use -QuickAnalysis flag for detailed analysis" -ForegroundColor Cyan
    }
    
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
}