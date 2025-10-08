# PR Analysis System for Portfolio OS
# Usage: .\pr-analyzer.ps1 -PRNumber <NUMBER> [-Analysis <TYPE>] [-ExportTo <FILE>]

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("comprehensive", "security", "performance", "complexity", "review", "changes")]
    [string]$Analysis = "comprehensive",
    
    [Parameter(Mandatory=$false)]
    [string]$ExportTo,
    
    [Parameter(Mandatory=$false)]
    [switch]$IncludeHistory,
    
    [Parameter(Mandatory=$false)]
    [switch]$Detailed
)

# Import shared utilities
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$utilsPath = Join-Path (Split-Path -Parent $scriptPath) "core-utilities\github-utils.ps1"

if (Test-Path $utilsPath) {
    . $utilsPath
} else {
    Write-Warning "GitHub utilities not found at $utilsPath"
}

function Show-PRAnalyzerHeader {
    Write-Host "`n🔍 PR ANALYSIS SYSTEM" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    Write-Host "Analyzing PR #$PRNumber" -ForegroundColor White
    Write-Host "Analysis Type: $Analysis" -ForegroundColor Gray
    Write-Host "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
    Write-Host "=" * 40 -ForegroundColor Cyan
}

function Get-PRData {
    param([string]$PRNumber)
    
    try {
        Write-Host "📊 Fetching PR data..." -ForegroundColor Yellow
        
        # Get comprehensive PR information
        $prData = gh pr view $PRNumber --json number,title,body,headRefName,baseRefName,author,createdAt,updatedAt,mergedAt,closedAt,state,isDraft,additions,deletions,changedFiles,commits,reviews,comments,files,labels,assignees,reviewDecision,mergeable,mergeableState
        
        if (-not $prData) {
            throw "Failed to fetch PR data"
        }
        
        $pr = $prData | ConvertFrom-Json
        
        # Get additional data
        $commits = gh pr view $PRNumber --json commits | ConvertFrom-Json
        $files = gh pr view $PRNumber --json files | ConvertFrom-Json
        
        return @{
            PR = $pr
            Commits = $commits.commits
            Files = $files.files
        }
    }
    catch {
        Write-Host "❌ Failed to fetch PR data: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Analyze-PRComplexity {
    param([object]$PRData)
    
    Write-Host "`n🧮 COMPLEXITY ANALYSIS" -ForegroundColor Yellow
    
    $pr = $PRData.PR
    $files = $PRData.Files
    
    $complexity = @{
        LinesChanged = $pr.additions + $pr.deletions
        FilesChanged = $pr.changedFiles
        CommitsCount = $pr.commits.Count
        ComplexityScore = 0
        RiskLevel = "Low"
        Recommendations = @()
    }
    
    # Calculate complexity score
    $complexity.ComplexityScore += $pr.additions * 0.1
    $complexity.ComplexityScore += $pr.deletions * 0.1
    $complexity.ComplexityScore += $pr.changedFiles * 2
    $complexity.ComplexityScore += $pr.commits.Count * 1
    
    # Analyze file types
    $fileTypes = $files | Group-Object { [System.IO.Path]::GetExtension($_.filename) }
    foreach ($fileType in $fileTypes) {
        switch ($fileType.Name) {
            ".tsx" { $complexity.ComplexityScore += $fileType.Count * 3 }
            ".ts" { $complexity.ComplexityScore += $fileType.Count * 2 }
            ".js" { $complexity.ComplexityScore += $fileType.Count * 2 }
            ".json" { $complexity.ComplexityScore += $fileType.Count * 0.5 }
            ".md" { $complexity.ComplexityScore += $fileType.Count * 0.1 }
        }
    }
    
    # Determine risk level
    if ($complexity.ComplexityScore -gt 50) {
        $complexity.RiskLevel = "High"
        $complexity.Recommendations += "Consider breaking this PR into smaller changes"
    } elseif ($complexity.ComplexityScore -gt 20) {
        $complexity.RiskLevel = "Medium"
        $complexity.Recommendations += "Ensure thorough testing before merge"
    }
    
    # Additional recommendations
    if ($pr.changedFiles -gt 20) {
        $complexity.Recommendations += "Large number of files changed - consider splitting"
    }
    
    if ($pr.additions -gt 1000) {
        $complexity.Recommendations += "High line count - ensure code review is thorough"
    }
    
    # Display results
    Write-Host "Lines Changed: $($complexity.LinesChanged)" -ForegroundColor White
    Write-Host "Files Changed: $($complexity.FilesChanged)" -ForegroundColor White
    Write-Host "Commits: $($complexity.CommitsCount)" -ForegroundColor White
    Write-Host "Complexity Score: $([Math]::Round($complexity.ComplexityScore, 1))" -ForegroundColor $(if ($complexity.RiskLevel -eq "High") { "Red" } elseif ($complexity.RiskLevel -eq "Medium") { "Yellow" } else { "Green" })
    Write-Host "Risk Level: $($complexity.RiskLevel)" -ForegroundColor $(if ($complexity.RiskLevel -eq "High") { "Red" } elseif ($complexity.RiskLevel -eq "Medium") { "Yellow" } else { "Green" })
    
    if ($complexity.Recommendations.Count -gt 0) {
        Write-Host "`nRecommendations:" -ForegroundColor Cyan
        foreach ($rec in $complexity.Recommendations) {
            Write-Host "  • $rec" -ForegroundColor Gray
        }
    }
    
    return $complexity
}

function Analyze-PRSecurity {
    param([object]$PRData)
    
    Write-Host "`n🔒 SECURITY ANALYSIS" -ForegroundColor Yellow
    
    $pr = $PRData.PR
    $files = $PRData.Files
    
    $security = @{
        Issues = @()
        Warnings = @()
        Recommendations = @()
        RiskLevel = "Low"
    }
    
    # Check for sensitive files
    $sensitivePatterns = @("password", "secret", "key", "token", "credential", "api_key")
    foreach ($file in $files) {
        foreach ($pattern in $sensitivePatterns) {
            if ($file.filename -match $pattern) {
                $security.Warnings += "Potential sensitive file: $($file.filename)"
            }
        }
    }
    
    # Check for security-related changes
    $securityFiles = $files | Where-Object { $_.filename -match "(auth|security|login|permission)" }
    if ($securityFiles.Count -gt 0) {
        $security.Recommendations += "Security-related changes detected - ensure thorough security review"
    }
    
    # Check for dependency changes
    $packageFiles = $files | Where-Object { $_.filename -match "(package\.json|yarn\.lock|package-lock\.json)" }
    if ($packageFiles.Count -gt 0) {
        $security.Recommendations += "Dependency changes detected - check for security vulnerabilities"
    }
    
    # Determine risk level
    if ($security.Issues.Count -gt 0) {
        $security.RiskLevel = "High"
    } elseif ($security.Warnings.Count -gt 0 -or $security.Recommendations.Count -gt 0) {
        $security.RiskLevel = "Medium"
    }
    
    # Display results
    if ($security.Issues.Count -gt 0) {
        Write-Host "🚨 Security Issues:" -ForegroundColor Red
        foreach ($issue in $security.Issues) {
            Write-Host "  • $issue" -ForegroundColor Red
        }
    }
    
    if ($security.Warnings.Count -gt 0) {
        Write-Host "⚠️  Security Warnings:" -ForegroundColor Yellow
        foreach ($warning in $security.Warnings) {
            Write-Host "  • $warning" -ForegroundColor Yellow
        }
    }
    
    if ($security.Recommendations.Count -gt 0) {
        Write-Host "💡 Security Recommendations:" -ForegroundColor Cyan
        foreach ($rec in $security.Recommendations) {
            Write-Host "  • $rec" -ForegroundColor Gray
        }
    }
    
    Write-Host "Risk Level: $($security.RiskLevel)" -ForegroundColor $(if ($security.RiskLevel -eq "High") { "Red" } elseif ($security.RiskLevel -eq "Medium") { "Yellow" } else { "Green" })
    
    return $security
}

function Analyze-PRPerformance {
    param([object]$PRData)
    
    Write-Host "`n⚡ PERFORMANCE ANALYSIS" -ForegroundColor Yellow
    
    $pr = $PRData.PR
    $files = $PRData.Files
    
    $performance = @{
        Issues = @()
        Warnings = @()
        Recommendations = @()
        RiskLevel = "Low"
    }
    
    # Check for performance-critical files
    $performanceFiles = $files | Where-Object { 
        $_.filename -match "(component|page|api|service)" -or 
        $_.filename -match "\.(tsx?|jsx?)$" 
    }
    
    if ($performanceFiles.Count -gt 0) {
        $performance.Recommendations += "Performance-critical files changed - ensure performance testing"
    }
    
    # Check for large additions
    if ($pr.additions -gt 500) {
        $performance.Warnings += "Large code addition - check for performance impact"
    }
    
    # Check for database-related changes
    $dbFiles = $files | Where-Object { $_.filename -match "(migration|schema|model|query)" }
    if ($dbFiles.Count -gt 0) {
        $performance.Recommendations += "Database changes detected - verify query performance"
    }
    
    # Check for image/media files
    $mediaFiles = $files | Where-Object { $_.filename -match "\.(png|jpg|jpeg|gif|svg|mp4|webm)$" }
    if ($mediaFiles.Count -gt 0) {
        $performance.Recommendations += "Media files added - check file sizes and optimization"
    }
    
    # Determine risk level
    if ($performance.Issues.Count -gt 0) {
        $performance.RiskLevel = "High"
    } elseif ($performance.Warnings.Count -gt 0 -or $performance.Recommendations.Count -gt 0) {
        $performance.RiskLevel = "Medium"
    }
    
    # Display results
    if ($performance.Issues.Count -gt 0) {
        Write-Host "🚨 Performance Issues:" -ForegroundColor Red
        foreach ($issue in $performance.Issues) {
            Write-Host "  • $issue" -ForegroundColor Red
        }
    }
    
    if ($performance.Warnings.Count -gt 0) {
        Write-Host "⚠️  Performance Warnings:" -ForegroundColor Yellow
        foreach ($warning in $performance.Warnings) {
            Write-Host "  • $warning" -ForegroundColor Yellow
        }
    }
    
    if ($performance.Recommendations.Count -gt 0) {
        Write-Host "💡 Performance Recommendations:" -ForegroundColor Cyan
        foreach ($rec in $performance.Recommendations) {
            Write-Host "  • $rec" -ForegroundColor Gray
        }
    }
    
    Write-Host "Risk Level: $($performance.RiskLevel)" -ForegroundColor $(if ($performance.RiskLevel -eq "High") { "Red" } elseif ($performance.RiskLevel -eq "Medium") { "Yellow" } else { "Green" })
    
    return $performance
}

function Analyze-PRReview {
    param([object]$PRData)
    
    Write-Host "`n👥 REVIEW ANALYSIS" -ForegroundColor Yellow
    
    $pr = $PRData.PR
    
    $review = @{
        Status = $pr.reviewDecision
        ReviewsCount = $pr.reviews.Count
        CommentsCount = $pr.comments.Count
        AssigneesCount = $pr.assignees.Count
        Recommendations = @()
    }
    
    # Analyze review status
    switch ($pr.reviewDecision) {
        "APPROVED" {
            Write-Host "Status: ✅ Approved" -ForegroundColor Green
        }
        "CHANGES_REQUESTED" {
            Write-Host "Status: 🔄 Changes Requested" -ForegroundColor Red
            $review.Recommendations += "Address requested changes before merging"
        }
        "REVIEW_REQUIRED" {
            Write-Host "Status: ⏳ Review Required" -ForegroundColor Yellow
            $review.Recommendations += "Request additional reviews if needed"
        }
        default {
            Write-Host "Status: ❓ Unknown" -ForegroundColor Gray
        }
    }
    
    Write-Host "Reviews: $($review.ReviewsCount)" -ForegroundColor White
    Write-Host "Comments: $($review.CommentsCount)" -ForegroundColor White
    Write-Host "Assignees: $($review.AssigneesCount)" -ForegroundColor White
    
    # Check for CR-GPT comments
    $crgptComments = $pr.comments | Where-Object { $_.author.login -eq "cr-gpt" }
    if ($crgptComments.Count -gt 0) {
        Write-Host "CR-GPT Comments: $($crgptComments.Count)" -ForegroundColor Yellow
        $review.Recommendations += "Review and address CR-GPT feedback"
    }
    
    # Recommendations based on PR state
    if ($pr.isDraft) {
        $review.Recommendations += "Mark as ready for review when complete"
    }
    
    if ($pr.mergeableState -eq "blocked") {
        $review.Recommendations += "Resolve merge conflicts"
    }
    
    if ($review.Recommendations.Count -gt 0) {
        Write-Host "`nRecommendations:" -ForegroundColor Cyan
        foreach ($rec in $review.Recommendations) {
            Write-Host "  • $rec" -ForegroundColor Gray
        }
    }
    
    return $review
}

function Analyze-PRChanges {
    param([object]$PRData)
    
    Write-Host "`n📝 CHANGES ANALYSIS" -ForegroundColor Yellow
    
    $pr = $PRData.PR
    $files = $PRData.Files
    
    $changes = @{
        Additions = $pr.additions
        Deletions = $pr.deletions
        FilesChanged = $pr.changedFiles
        Commits = $pr.commits.Count
        FileTypes = @{}
        LargestChanges = @()
    }
    
    # Analyze file types
    $fileTypes = $files | Group-Object { [System.IO.Path]::GetExtension($_.filename) }
    foreach ($fileType in $fileTypes) {
        $changes.FileTypes[$fileType.Name] = $fileType.Count
    }
    
    # Find largest changes
    $changes.LargestChanges = $files | Sort-Object additions -Descending | Select-Object -First 5 filename, additions, deletions
    
    # Display results
    Write-Host "Total Changes: +$($changes.Additions) -$($changes.Deletions)" -ForegroundColor White
    Write-Host "Files Changed: $($changes.FilesChanged)" -ForegroundColor White
    Write-Host "Commits: $($changes.Commits)" -ForegroundColor White
    
    Write-Host "`nFile Types:" -ForegroundColor Cyan
    foreach ($fileType in $changes.FileTypes.GetEnumerator() | Sort-Object Value -Descending) {
        Write-Host "  $($fileType.Key): $($fileType.Value) files" -ForegroundColor Gray
    }
    
    if ($changes.LargestChanges.Count -gt 0) {
        Write-Host "`nLargest Changes:" -ForegroundColor Cyan
        foreach ($change in $changes.LargestChanges) {
            Write-Host "  $($change.filename): +$($change.additions) -$($change.deletions)" -ForegroundColor Gray
        }
    }
    
    return $changes
}

function Export-PRAnalysis {
    param([hashtable]$AnalysisData, [string]$OutputFile)
    
    $report = @{
        GeneratedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        PRNumber = $PRNumber
        AnalysisType = $Analysis
        PR = @{
            Title = $AnalysisData.PR.title
            Author = $AnalysisData.PR.author.login
            State = $AnalysisData.PR.state
            CreatedAt = $AnalysisData.PR.createdAt
            UpdatedAt = $AnalysisData.PR.updatedAt
        }
        Analysis = $AnalysisData
    }
    
    try {
        $report | ConvertTo-Json -Depth 5 | Out-File -FilePath $OutputFile -Encoding UTF8
        Write-Host "📄 Analysis report exported to: $OutputFile" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to export analysis: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main execution
try {
    Show-PRAnalyzerHeader
    
    $prData = Get-PRData -PRNumber $PRNumber
    if (-not $prData) {
        Write-Error "Failed to fetch PR data"
        exit 1
    }
    
    $analysisResults = @{
        PR = $prData.PR
        Files = $prData.Files
        Commits = $prData.Commits
    }
    
    switch ($Analysis) {
        "comprehensive" {
            $analysisResults.Complexity = Analyze-PRComplexity -PRData $prData
            $analysisResults.Security = Analyze-PRSecurity -PRData $prData
            $analysisResults.Performance = Analyze-PRPerformance -PRData $prData
            $analysisResults.Review = Analyze-PRReview -PRData $prData
            $analysisResults.Changes = Analyze-PRChanges -PRData $prData
        }
        "security" {
            $analysisResults.Security = Analyze-PRSecurity -PRData $prData
        }
        "performance" {
            $analysisResults.Performance = Analyze-PRPerformance -PRData $prData
        }
        "complexity" {
            $analysisResults.Complexity = Analyze-PRComplexity -PRData $prData
        }
        "review" {
            $analysisResults.Review = Analyze-PRReview -PRData $prData
        }
        "changes" {
            $analysisResults.Changes = Analyze-PRChanges -PRData $prData
        }
    }
    
    if ($ExportTo) {
        Export-PRAnalysis -AnalysisData $analysisResults -OutputFile $ExportTo
    }
    
    Write-Host "`n✅ PR analysis completed successfully" -ForegroundColor Green
}
catch {
    Write-Error "PR analysis error: $($_.Exception.Message)"
    exit 1
}
