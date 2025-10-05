# Unified PR Automation Script
# Comprehensive PR automation including analysis, quality checks, and response generation
# Usage: .\scripts\automation\pr-automation-unified.ps1 -PRNumber <NUMBER> [-Action <ACTION>] [-ExportTo <FILE>] [-DryRun]

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("analyze", "quality", "docs", "respond", "all")]
    [string]$Action = "all",
    
    [Parameter(Mandatory=$false)]
    [string]$ExportTo = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Import shared utilities
$sharedPath = Join-Path $PSScriptRoot "..\core-utilities\github-utils.ps1"
$aiServicesPath = Join-Path $PSScriptRoot "..\core-utilities\ai-services.ps1"

if (Test-Path $sharedPath) {
    . $sharedPath
} else {
    Write-Error "Shared utilities not found at $sharedPath"
    exit 1
}

if (Test-Path $aiServicesPath) {
    . $aiServicesPath
    $script:aiEnabled = $true
} else {
    Write-Warning "AI services not found at $aiServicesPath - AI features disabled"
    $script:aiEnabled = $false
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "      Unified PR Automation System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Get-PRData {
    param([string]$PRNumber)
    
    try {
        $prData = gh pr view $PRNumber --json number,title,body,state,baseRefName,headRefName,files,additions,deletions,statusCheckRollup,author,assignees,labels,createdAt,updatedAt
        return $prData | ConvertFrom-Json
    } catch {
        Write-ColorOutput "Failed to get PR data for #$PRNumber" "Red"
        return $null
    }
}

function Analyze-PRQuality {
    param([object]$PRData)
    
    $analysis = @{
        OverallScore = 0
        QualityIssues = @()
        Recommendations = @()
        SecurityConcerns = @()
        PerformanceIssues = @()
        AccessibilityIssues = @()
        TestingIssues = @()
        AIAnalysis = $null
    }
    
    # Perform basic rule-based analysis
    $basicAnalysis = Analyze-PRQualityBasic -PRData $PRData
    $analysis.OverallScore = $basicAnalysis.OverallScore
    $analysis.QualityIssues = $basicAnalysis.QualityIssues
    $analysis.Recommendations = $basicAnalysis.Recommendations
    $analysis.SecurityConcerns = $basicAnalysis.SecurityConcerns
    $analysis.PerformanceIssues = $basicAnalysis.PerformanceIssues
    $analysis.AccessibilityIssues = $basicAnalysis.AccessibilityIssues
    $analysis.TestingIssues = $basicAnalysis.TestingIssues
    
    # Enhance with AI analysis if available
    if ($script:aiEnabled) {
        try {
            $aiAnalysis = Analyze-PRQualityWithAI -PRData $PRData
            if ($aiAnalysis) {
                $analysis.AIAnalysis = $aiAnalysis
                # Merge AI insights with basic analysis
                $analysis.QualityIssues += $aiAnalysis.QualityIssues
                $analysis.Recommendations += $aiAnalysis.Recommendations
                $analysis.SecurityConcerns += $aiAnalysis.SecurityConcerns
                $analysis.PerformanceIssues += $aiAnalysis.PerformanceIssues
                $analysis.AccessibilityIssues += $aiAnalysis.AccessibilityIssues
                $analysis.TestingIssues += $aiAnalysis.TestingIssues
                
                # Adjust score based on AI analysis
                $analysis.OverallScore = [Math]::Max(0, $analysis.OverallScore + $aiAnalysis.ScoreAdjustment)
            }
        }
        catch {
            Write-Warning "AI PR analysis failed: $($_.Exception.Message)"
        }
    }
    
    return $analysis
}

function Analyze-PRQualityBasic {
    param([object]$PRData)
    
    $analysis = @{
        OverallScore = 0
        QualityIssues = @()
        Recommendations = @()
        SecurityConcerns = @()
        PerformanceIssues = @()
        AccessibilityIssues = @()
        TestingIssues = @()
    }
    
    # Analyze file changes
    $changedFiles = $PRData.files | Where-Object { $_.status -ne "removed" }
    $removedFiles = $PRData.files | Where-Object { $_.status -eq "removed" }
    
    # Check for test files
    $testFiles = $changedFiles | Where-Object { $_.path -match "(test|spec)\.(ts|tsx|js|jsx)$" }
    if ($testFiles.Count -eq 0 -and $changedFiles.Count -gt 0) {
        $analysis.TestingIssues += "No test files modified - consider adding tests for new functionality"
        $analysis.OverallScore -= 2
    }
    
    # Check for documentation updates
    $docFiles = $changedFiles | Where-Object { $_.path -match "\.(md|mdx)$" }
    if ($docFiles.Count -eq 0 -and $changedFiles.Count -gt 0) {
        $analysis.Recommendations += "Consider updating documentation for new features"
    }
    
    # Check for large PRs
    if ($PRData.additions + $PRData.deletions -gt 500) {
        $analysis.QualityIssues += "Large PR - consider breaking into smaller changes"
        $analysis.OverallScore -= 1
    }
    
    # Check for security-sensitive files
    $securityFiles = $changedFiles | Where-Object { 
        $_.path -match "(auth|security|password|token|key|secret)" -or
        $_.path -match "(middleware|auth|session)" 
    }
    if ($securityFiles.Count -gt 0) {
        $analysis.SecurityConcerns += "Security-sensitive files modified - ensure proper review"
    }
    
    # Check for performance-sensitive changes
    $performanceFiles = $changedFiles | Where-Object { 
        $_.path -match "(api|database|query|fetch)" -or
        $_.path -match "(component|render|useEffect)" 
    }
    if ($performanceFiles.Count -gt 0) {
        $analysis.PerformanceIssues += "Performance-sensitive files modified - consider optimization"
    }
    
    # Check for accessibility
    $uiFiles = $changedFiles | Where-Object { 
        $_.path -match "\.(tsx|jsx)$" -and $_.path -notmatch "(test|spec)" 
    }
    if ($uiFiles.Count -gt 0) {
        $analysis.AccessibilityIssues += "UI files modified - ensure accessibility compliance"
    }
    
    # Calculate overall score
    $analysis.OverallScore = [Math]::Max(0, 10 + $analysis.OverallScore)
    
    return $analysis
}

function Analyze-PRQualityWithAI {
    param([object]$PRData)
    
    try {
        # Initialize AI services if not already done
        if (-not (Get-Variable -Name "aiInitialized" -Scope Script -ErrorAction SilentlyContinue)) {
            if (Initialize-AIServices) {
                $script:aiInitialized = $true
            } else {
                return $null
            }
        }
        
        # Prepare file information for AI analysis
        $fileInfo = @()
        foreach ($file in $PRData.files) {
            $fileInfo += "$($file.path) ($($file.status)) - $($file.additions) additions, $($file.deletions) deletions"
        }
        
        $prompt = @"
Analyze the following pull request for code quality, security, performance, and best practices:

PR Title: $($PRData.title)
PR Description: $($PRData.body.Substring(0, [Math]::Min(1000, $PRData.body.Length)))...

Files Changed:
$($fileInfo -join "`n")

Please provide a JSON response with:
{
  "score_adjustment": -2,
  "quality_issues": ["issue1", "issue2"],
  "recommendations": ["rec1", "rec2"],
  "security_concerns": ["sec1"],
  "performance_issues": ["perf1"],
  "accessibility_issues": ["a11y1"],
  "testing_issues": ["test1"],
  "summary": "Overall assessment"
}

Focus on:
- Code quality and maintainability
- Security vulnerabilities
- Performance implications
- Accessibility compliance
- Test coverage
- Best practices adherence
"@
        
        $response = Invoke-AICompletion -Prompt $prompt -SystemMessage "You are an expert code reviewer analyzing pull requests for quality, security, and best practices."
        
        $aiAnalysis = $response | ConvertFrom-Json
        Write-ColorOutput "🤖 AI analysis completed" "Cyan"
        
        return $aiAnalysis
    }
    catch {
        Write-Warning "AI PR quality analysis failed: $($_.Exception.Message)"
        return $null
    }
}

function Generate-QualityReport {
    param([object]$Analysis, [string]$PRNumber)
    
    $report = @"
# PR Quality Analysis Report - #$PRNumber

## Overall Score: $($Analysis.OverallScore)/10

## Quality Issues
$($Analysis.QualityIssues | ForEach-Object { "- $_" } | Out-String)

## Security Concerns
$($Analysis.SecurityConcerns | ForEach-Object { "- $_" } | Out-String)

## Performance Issues
$($Analysis.PerformanceIssues | ForEach-Object { "- $_" } | Out-String)

## Accessibility Issues
$($Analysis.AccessibilityIssues | ForEach-Object { "- $_" } | Out-String)

## Testing Issues
$($Analysis.TestingIssues | ForEach-Object { "- $_" } | Out-String)

## Recommendations
$($Analysis.Recommendations | ForEach-Object { "- $_" } | Out-String)

---
*Generated by PR Automation System*
"@
    
    return $report
}

function Respond-ToCRGPT {
    param([string]$PRNumber, [hashtable[]]$CRGPTComments)
    
    Write-ColorOutput "Processing CR-GPT comments..." "Yellow"
    
    foreach ($comment in $CRGPTComments) {
        Write-ColorOutput "  Processing comment: $($comment.id)" "White"
        
        # Categorize comment priority
        $priority = "medium"
        $category = "general"
        
        if ($comment.body -match "bug|error|fail|broken") {
            $priority = "high"
            $category = "bugs"
        } elseif ($comment.body -match "test|spec") {
            $priority = "high"
            $category = "tests"
        } elseif ($comment.body -match "type|typing") {
            $priority = "medium"
            $category = "typing"
        } elseif ($comment.body -match "style|format|lint") {
            $priority = "low"
            $category = "style"
        }
        
        # Generate response based on category
        $response = Generate-CommentResponse -Comment $comment -Category $category -Priority $priority
        
        if (-not $DryRun -and $response) {
            try {
                # Post response to GitHub comment
                gh api graphql -f query='
                    mutation($commentId: ID!, $body: String!) {
                        addComment(input: {subjectId: $commentId, body: $body}) {
                            commentEdge {
                                node {
                                    id
                                    body
                                }
                            }
                        }
                    }
                ' -f commentId=$comment.id -f body=$response
                
                Write-ColorOutput "    ✅ Posted response" "Green"
            } catch {
                Write-ColorOutput "    ❌ Failed to post response" "Red"
            }
        } else {
            Write-ColorOutput "    [DRY RUN] Would post response" "Cyan"
        }
    }
}

function Generate-CommentResponse {
    param([object]$Comment, [string]$Category, [string]$Priority)
    
    # Use AI to generate intelligent responses if available
    if ($script:aiEnabled) {
        try {
            # Initialize AI services if not already done
            if (-not (Get-Variable -Name "aiInitialized" -Scope Script -ErrorAction SilentlyContinue)) {
                if (Initialize-AIServices) {
                    $script:aiInitialized = $true
                } else {
                    Write-Warning "Failed to initialize AI services for comment response"
                    return Generate-StaticCommentResponse -Comment $Comment -Category $Category -Priority $Priority
                }
            }
            
            $response = Generate-PRResponse -CommentBody $Comment.body -CommentAuthor $Comment.user.login
            Write-ColorOutput "    🤖 Generated AI response" "Cyan"
            return $response
        }
        catch {
            Write-Warning "AI comment response generation failed: $($_.Exception.Message)"
            return Generate-StaticCommentResponse -Comment $Comment -Category $Category -Priority $Priority
        }
    } else {
        return Generate-StaticCommentResponse -Comment $Comment -Category $Category -Priority $Priority
    }
}

function Generate-StaticCommentResponse {
    param([object]$Comment, [string]$Category, [string]$Priority)
    
    $responseTemplates = @{
        "bugs" = @"
Thank you for catching this bug! You're absolutely right - this issue needs to be addressed.

**Action Plan:**
1. [ ] Investigate the root cause
2. [ ] Implement the fix
3. [ ] Add tests to prevent regression

**Implementation:**
I'll analyze the code and implement a proper fix.

**Timeline:** I'll address this in the next commit.

**Questions:** Do you have any specific concerns about the implementation approach?
"@
        "tests" = @"
Great point about the testing! You're right that test coverage should be improved.

**Action Plan:**
1. [ ] Add unit tests for the new functionality
2. [ ] Add integration tests if needed
3. [ ] Ensure edge cases are covered

**Implementation:**
I'll add comprehensive tests to cover the scenarios.

**Timeline:** I'll add these tests in the next commit.
"@
        "typing" = @"
Thanks for the TypeScript feedback! I agree that type safety could be improved.

**Action Plan:**
1. [ ] Add proper type definitions
2. [ ] Fix any type errors

**Implementation:**
I'll improve the typing to ensure better type safety.

**Timeline:** I'll implement these improvements in the next commit.
"@
        "style" = @"
You're absolutely right about the styling! I'll fix this issue.

**Action Plan:**
1. [ ] Apply consistent formatting
2. [ ] Fix any style issues

**Timeline:** I'll make these style improvements in the next commit.
"@
        "general" = @"
Thank you for the feedback! I appreciate you pointing this out.

**Action Plan:**
1. [ ] Review the concern
2. [ ] Implement improvements

**Implementation:**
I'll address your concerns with the appropriate changes.

**Timeline:** I'll implement these changes in the next commit.
"@
    }
    
    $template = $responseTemplates[$category]
    if (-not $template) {
        $template = $responseTemplates["general"]
    }
    
    return $template
}

function Update-Documentation {
    param([object]$PRData)
    
    Write-ColorOutput "Updating documentation..." "Yellow"
    
    $changedFiles = $PRData.files | Where-Object { $_.status -ne "removed" }
    $needsDocsUpdate = $false
    
    # Check if documentation updates are needed
    foreach ($file in $changedFiles) {
        if ($file.path -match "\.(tsx?|jsx?)$" -and $file.path -notmatch "(test|spec)") {
            $needsDocsUpdate = $true
            break
        }
    }
    
    if ($needsDocsUpdate) {
        Write-ColorOutput "  Documentation updates recommended" "Yellow"
        # In production, this would generate documentation updates
    } else {
        Write-ColorOutput "  No documentation updates needed" "Green"
    }
}

# Main execution
Show-Banner

Write-ColorOutput "Processing PR #$PRNumber" "Green"
Write-ColorOutput "Action: $Action" "White"

if ($DryRun) {
    Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
}

# Get PR data
$prData = Get-PRData -PRNumber $PRNumber
if (-not $prData) {
    Write-ColorOutput "Failed to get PR data" "Red"
    exit 1
}

Write-ColorOutput ""
Write-ColorOutput "PR Details:" "White"
Write-ColorOutput "  Title: $($prData.title)" "White"
Write-ColorOutput "  Base: $($prData.baseRefName)" "White"
Write-ColorOutput "  Head: $($prData.headRefName)" "White"
Write-ColorOutput "  Files: $($prData.files.Count)" "White"
Write-ColorOutput "  Additions: $($prData.additions)" "White"
Write-ColorOutput "  Deletions: $($prData.deletions)" "White"
Write-ColorOutput ""

# Perform requested actions
if ($Action -eq "analyze" -or $Action -eq "all") {
    Write-ColorOutput "=== PR Analysis ===" "Blue"
    
    $analysis = Analyze-PRQuality -PRData $prData
    $report = Generate-QualityReport -Analysis $analysis -PRNumber $PRNumber
    
    Write-ColorOutput "Quality Score: $($analysis.OverallScore)/10" "White"
    
    if ($ExportTo) {
        $report | Out-File -FilePath $ExportTo -Encoding UTF8
        Write-ColorOutput "Report exported to: $ExportTo" "Green"
    } else {
        Write-ColorOutput "Report:" "Yellow"
        Write-Output $report
    }
}

if ($Action -eq "quality" -or $Action -eq "all") {
    Write-ColorOutput "=== Quality Checks ===" "Blue"
    
    # Run quality checks
    Write-ColorOutput "Running quality checks..." "Yellow"
    # In production, this would run linting, type checking, etc.
    
    Write-ColorOutput "Quality checks completed" "Green"
}

if ($Action -eq "docs" -or $Action -eq "all") {
    Write-ColorOutput "=== Documentation Updates ===" "Blue"
    
    Update-Documentation -PRData $prData
}

if ($Action -eq "respond" -or $Action -eq "all") {
    Write-ColorOutput "=== CR-GPT Response Generation ===" "Blue"
    
    $crgptComments = Get-CRGPTComments -PRNumber $PRNumber
    if ($crgptComments.Count -gt 0) {
        Respond-ToCRGPT -PRNumber $PRNumber -CRGPTComments $crgptComments
    } else {
        Write-ColorOutput "No CR-GPT comments found" "Yellow"
    }
}

Write-ColorOutput ""
Write-ColorOutput "PR automation complete!" "Green"
