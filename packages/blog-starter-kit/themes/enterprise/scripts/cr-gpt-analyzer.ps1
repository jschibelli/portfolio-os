# PowerShell script to analyze CR-GPT bot comments and generate actionable insights
# Usage: .\scripts\cr-gpt-analyzer.ps1 -PRNumber <PR_NUMBER> [-GenerateReport] [-ExportTo <FILE>]

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [Parameter(Mandatory=$false)]
    [switch]$GenerateReport,
    
    [Parameter(Mandatory=$false)]
    [string]$ExportTo
)

function Get-CRGPTComments {
    param([string]$PRNumber)
    
    $repoOwner = gh repo view --json owner -q .owner.login
    $repoName = gh repo view --json name -q .name
    
    $allComments = gh api repos/$repoOwner/$repoName/pulls/$PRNumber/comments
    $crgptComments = $allComments | Where-Object { $_.user.login -eq "cr-gpt[bot]" }
    return $crgptComments
}

function Analyze-Comment {
    param([object]$Comment)
    
    $analysis = @{
        CommentId = $Comment.id
        CreatedAt = $Comment.created_at
        Url = $Comment.html_url
        Path = $Comment.path
        Line = $Comment.line
        Body = $Comment.body
        Categories = @()
        Priority = "Medium"
        ActionItems = @()
        BugRisks = @()
        Improvements = @()
    }
    
    $body = $Comment.body.ToLower()
    
    # Categorize feedback
    if ($body -match "bug risk|potential bug|bug") {
        $analysis.Categories += "Bug Risk"
        $analysis.Priority = "High"
    }
    
    if ($body -match "improvement|enhancement|suggestion") {
        $analysis.Categories += "Improvement"
    }
    
    if ($body -match "security|vulnerability|injection") {
        $analysis.Categories += "Security"
        $analysis.Priority = "High"
    }
    
    if ($body -match "performance|optimization|efficiency") {
        $analysis.Categories += "Performance"
    }
    
    if ($body -match "maintainability|readability|code quality") {
        $analysis.Categories += "Code Quality"
    }
    
    if ($body -match "testing|test|coverage") {
        $analysis.Categories += "Testing"
    }
    
    if ($body -match "documentation|comment|doc") {
        $analysis.Categories += "Documentation"
    }
    
    # Extract action items
    if ($body -match "consider|should|recommend|suggest") {
        $analysis.ActionItems += "Review and implement suggestions"
    }
    
    if ($body -match "fix|correct|update|change") {
        $analysis.ActionItems += "Address identified issues"
    }
    
    if ($body -match "test|verify|check") {
        $analysis.ActionItems += "Add or improve testing"
    }
    
    # Extract bug risks
    if ($body -match "bug risk|potential issue|problem") {
        $analysis.BugRisks += "Potential bug identified"
    }
    
    # Extract improvements
    if ($body -match "improve|enhance|optimize|refactor") {
        $analysis.Improvements += "Code improvement opportunity"
    }
    
    return $analysis
}

function Generate-AnalysisReport {
    param([array]$Analyses, [string]$PRNumber)
    
    $report = @"
# CR-GPT Bot Analysis Report for PR #$PRNumber

Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Summary
- Total Comments: $($Analyses.Count)
- High Priority: $(($Analyses | Where-Object { $_.Priority -eq "High" }).Count)
- Medium Priority: $(($Analyses | Where-Object { $_.Priority -eq "Medium" }).Count)
- Low Priority: $(($Analyses | Where-Object { $_.Priority -eq "Low" }).Count)

## Categories Breakdown
"@
    
    $categories = $Analyses | ForEach-Object { $_.Categories } | Sort-Object | Get-Unique
    foreach ($category in $categories) {
        $count = ($Analyses | Where-Object { $_.Categories -contains $category }).Count
        $report += "`n- **$category**: $count comments"
    }
    
    $report += "`n`n## Detailed Analysis`n"
    
    foreach ($analysis in $Analyses) {
        $report += @"

### Comment ID: $($analysis.CommentId)
- **Path**: $($analysis.Path)
- **Line**: $($analysis.Line)
- **Priority**: $($analysis.Priority)
- **Categories**: $($analysis.Categories -join ", ")
- **URL**: $($analysis.Url)

#### Action Items:
"@
        foreach ($item in $analysis.ActionItems) {
            $report += "`n- $item"
        }
        
        if ($analysis.BugRisks.Count -gt 0) {
            $report += "`n`n#### Bug Risks:"
            foreach ($risk in $analysis.BugRisks) {
                $report += "`n- $risk"
            }
        }
        
        if ($analysis.Improvements.Count -gt 0) {
            $report += "`n`n#### Improvements:"
            foreach ($improvement in $analysis.Improvements) {
                $report += "`n- $improvement"
            }
        }
    }
    
    $report += @"

## Recommendations

1. **Address High Priority Issues First**: Focus on security and bug risk items
2. **Implement Improvements**: Review and implement code quality suggestions
3. **Add Testing**: Ensure adequate test coverage for changes
4. **Update Documentation**: Keep documentation current with code changes

## Next Steps

1. Review each comment individually
2. Implement suggested fixes
3. Test changes thoroughly
4. Respond to comments with status updates
5. Merge when all issues are resolved
"@
    
    return $report
}

# Main execution
try {
    Write-Host "Analyzing CR-GPT bot comments for PR #$PRNumber..." -ForegroundColor Green
    
    $crgptComments = Get-CRGPTComments -PRNumber $PRNumber
    
    if ($crgptComments.Count -eq 0) {
        Write-Host "No CR-GPT bot comments found for PR #$PRNumber" -ForegroundColor Yellow
        exit 0
    }
    
    Write-Host "Found $($crgptComments.Count) CR-GPT bot comments" -ForegroundColor Cyan
    
    $analyses = @()
    foreach ($comment in $crgptComments) {
        $analysis = Analyze-Comment -Comment $comment
        $analyses += $analysis
    }
    
    if ($GenerateReport) {
        $report = Generate-AnalysisReport -Analyses $analyses -PRNumber $PRNumber
        
        if ($ExportTo) {
            $report | Out-File -FilePath $ExportTo -Encoding UTF8
            Write-Host "Report exported to: $ExportTo" -ForegroundColor Green
        } else {
            Write-Host $report
        }
    } else {
        # Display summary
        Write-Host "`n=== Analysis Summary ===" -ForegroundColor Green
        Write-Host "Total Comments: $($analyses.Count)" -ForegroundColor Cyan
        Write-Host "High Priority: $(($analyses | Where-Object { $_.Priority -eq "High" }).Count)" -ForegroundColor Red
        Write-Host "Medium Priority: $(($analyses | Where-Object { $_.Priority -eq "Medium" }).Count)" -ForegroundColor Yellow
        Write-Host "Low Priority: $(($analyses | Where-Object { $_.Priority -eq "Low" }).Count)" -ForegroundColor Green
        
        $categories = $analyses | ForEach-Object { $_.Categories } | Sort-Object | Get-Unique
        Write-Host "`nCategories: $($categories -join ", ")" -ForegroundColor Cyan
    }
    
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
}
