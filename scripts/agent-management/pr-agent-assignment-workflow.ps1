#!/usr/bin/env pwsh
# PR Agent Assignment Workflow
# Evaluates current PRs, backfills project fields, determines optimal agent count, and assigns PRs
# Usage: .\scripts\automation\assign-pr-agents.ps1 [-ProjectNumber <NUMBER>] [-Owner <USERNAME>] [-DryRun]

param(
    [string]$ProjectNumber = "20",
    [string]$Owner = "jschibelli",
    [switch]$DryRun,
    [string]$ExportTo = "pr-agent-assignment-report.md"
)

# Import GitHub utilities for robust API handling
. ".\scripts\core-utilities\get-github-utilities.ps1"

# Import AI services for intelligent analysis
. ".\scripts\core-utilities\manage-ai-services.ps1"

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "      PR Agent Assignment Workflow" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

# Test GitHub authentication and utilities
Write-Host "Testing GitHub authentication and utilities..." -ForegroundColor Yellow
if (-not (Test-GitHubAuth)) {
    Write-Host "❌ GitHub authentication failed. Please run 'gh auth login' first." -ForegroundColor Red
    exit 1
}

if (-not (Test-GitHubUtils)) {
    Write-Host "❌ GitHub utilities test failed. Please check your GitHub CLI installation." -ForegroundColor Red
    exit 1
}

Write-Host "✅ GitHub authentication and utilities verified" -ForegroundColor Green

# Initialize AI services for intelligent analysis
Write-Host "Initializing AI services for intelligent analysis..." -ForegroundColor Yellow
if (-not (Initialize-AIServices)) {
    Write-Host "⚠️ AI services initialization failed. Continuing with rule-based analysis only." -ForegroundColor Yellow
    $script:useAI = $false
} else {
    Write-Host "✅ AI services initialized successfully" -ForegroundColor Green
    $script:useAI = $true
}
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

# Step 2: Analyze each PR for CR-GPT comments and complexity
Write-Host "Step 2: Analyzing PR complexity and CR-GPT comments..." -ForegroundColor Yellow
$prAnalysis = @()

foreach ($pr in $openPRs) {
    Write-Host "Analyzing PR #$($pr.number): $($pr.title)" -ForegroundColor Cyan
    
    # Get PR details and comments using utilities
    $prDetails = Get-PRInfo -PRNumber $pr.number
    if (-not $prDetails) {
        Write-Host "⚠️ Failed to get details for PR #$($pr.number), skipping..." -ForegroundColor Yellow
        continue
    }
    
    $crgptComments = Get-CRGPTComments -PRNumber $pr.number
    if (-not $crgptComments) {
        $crgptComments = @()
    }
    
    $reviewComments = $prDetails.reviews | Where-Object { $_.state -ne "COMMENTED" }
    
    # Categorize comments by priority
    $criticalComments = 0
    $highComments = 0
    $mediumComments = 0
    $lowComments = 0
    
    foreach ($comment in $crgptComments) {
        $body = $comment.body.ToLower()
        if ($body -match "critical|security|urgent") {
            $criticalComments++
        } elseif ($body -match "high|performance|error") {
            $highComments++
        } elseif ($body -match "medium|improvement") {
            $mediumComments++
        } else {
            $lowComments++
        }
    }
    
    # Determine complexity and category using AI or fallback to rules
    $totalComments = $crgptComments.Count
    
    if ($script:useAI) {
        # Use AI for intelligent analysis
        Write-Host "  🤖 Using AI for intelligent analysis..." -ForegroundColor Cyan
        
        # Prepare context for AI analysis
        $analysisContext = @{
            title = $pr.title
            body = $prDetails.body
            comments = $crgptComments | ForEach-Object { $_.body }
            files = $prDetails.files | ForEach-Object { $_.filename }
            author = $pr.author.login
            created_at = $pr.createdAt
            updated_at = $pr.updatedAt
        }
        
        # Get AI-powered analysis
        $aiAnalysis = Analyze-CodeWithAI -Context $analysisContext -AnalysisType "PRComplexity"
        if ($aiAnalysis) {
            $complexity = $aiAnalysis.complexity
            $category = $aiAnalysis.category
            $aiConfidence = $aiAnalysis.confidence
            $aiReasoning = $aiAnalysis.reasoning
            Write-Host "    AI Analysis: $complexity complexity, $category category (confidence: $aiConfidence%)" -ForegroundColor Gray
        } else {
            # Fallback to rule-based analysis
            Write-Host "    ⚠️ AI analysis failed, using rule-based analysis..." -ForegroundColor Yellow
            $complexity = if ($totalComments -ge 10) { "High" } elseif ($totalComments -ge 5) { "Medium" } elseif ($totalComments -ge 1) { "Low" } else { "None" }
            $category = "General"
            if ($pr.title -match "frontend|ui|component|style|css|react") {
                $category = "Frontend"
            } elseif ($pr.title -match "backend|api|server|database|auth") {
                $category = "Backend"
            } elseif ($pr.title -match "security|auth|permission") {
                $category = "Security"
            } elseif ($pr.title -match "performance|optimization|speed") {
                $category = "Performance"
            } elseif ($pr.title -match "test|testing|spec") {
                $category = "Testing"
            } elseif ($pr.title -match "doc|documentation|readme|changelog|api.*doc|component.*doc") {
                $category = "Documentation"
            }
        }
    } else {
        # Use rule-based analysis
        Write-Host "  📋 Using rule-based analysis..." -ForegroundColor Gray
        $complexity = if ($totalComments -ge 10) { "High" } elseif ($totalComments -ge 5) { "Medium" } elseif ($totalComments -ge 1) { "Low" } else { "None" }
        $category = "General"
        if ($pr.title -match "frontend|ui|component|style|css|react") {
            $category = "Frontend"
        } elseif ($pr.title -match "backend|api|server|database|auth") {
            $category = "Backend"
        } elseif ($pr.title -match "security|auth|permission") {
            $category = "Security"
        } elseif ($pr.title -match "performance|optimization|speed") {
            $category = "Performance"
        } elseif ($pr.title -match "test|testing|spec") {
            $category = "Testing"
        } elseif ($pr.title -match "doc|documentation|readme|changelog|api.*doc|component.*doc") {
            $category = "Documentation"
        }
    }
    
    # Get related issues from PR body and comments
    $relatedIssues = @()
    $prBody = $prDetails.body
    if ($prBody) {
        $issueMatches = [regex]::Matches($prBody, "#(\d+)")
        foreach ($match in $issueMatches) {
            $relatedIssues += [int]$match.Groups[1].Value
        }
    }
    
    # Also check PR comments for issue references
    $prComments = Get-PRComments -PRNumber $pr.number
    if ($prComments) {
        foreach ($comment in $prComments) {
            if ($comment.body) {
                $commentIssueMatches = [regex]::Matches($comment.body, "#(\d+)")
                foreach ($match in $commentIssueMatches) {
                    $issueNum = [int]$match.Groups[1].Value
                    if ($relatedIssues -notcontains $issueNum) {
                        $relatedIssues += $issueNum
                    }
                }
            }
        }
    }
    
    # Calculate estimated effort using AI or fallback to rules
    if ($script:useAI -and $aiAnalysis) {
        # Use AI for effort estimation
        $estimatedEffort = $aiAnalysis.estimatedEffort
        Write-Host "    AI Effort Estimate: $estimatedEffort days" -ForegroundColor Gray
    } else {
        # Use rule-based effort estimation
        $estimatedEffort = 0
        if ($complexity -eq "High") {
            $estimatedEffort = 8
        } elseif ($complexity -eq "Medium") {
            $estimatedEffort = 5
        } elseif ($complexity -eq "Low") {
            $estimatedEffort = 3
        } else {
            $estimatedEffort = 1
        }
        Write-Host "    Rule-based Effort Estimate: $estimatedEffort days" -ForegroundColor Gray
    }
    
    # Determine sprint/iteration using AI or fallback to rules
    if ($script:useAI -and $aiAnalysis) {
        # Use AI for iteration planning
        $suggestedIteration = $aiAnalysis.suggestedIteration
        Write-Host "    AI Iteration Suggestion: $suggestedIteration" -ForegroundColor Gray
    } else {
        # Use rule-based iteration planning
        $suggestedIteration = "Current Sprint"
        if ($category -eq "Security" -or $criticalComments -gt 0) {
            $suggestedIteration = "Immediate"
        } elseif ($category -eq "Performance" -or $highComments -gt 0) {
            $suggestedIteration = "Next Sprint"
        } elseif ($complexity -eq "High") {
            $suggestedIteration = "Future Sprint"
        }
        Write-Host "    Rule-based Iteration: $suggestedIteration" -ForegroundColor Gray
    }
    
    $prAnalysis += @{
        Number = $pr.number
        Title = $pr.title
        Category = $category
        Complexity = $complexity
        TotalComments = $totalComments
        CriticalComments = $criticalComments
        HighComments = $highComments
        MediumComments = $mediumComments
        LowComments = $lowComments
        IsDraft = $pr.isDraft
        ReadyForMerge = $totalComments -eq 0 -and -not $pr.isDraft
        HeadRef = $pr.headRefName
        BaseRef = $pr.baseRefName
        CreatedAt = $pr.createdAt
        UpdatedAt = $pr.updatedAt
        RelatedIssues = $relatedIssues
        EstimatedEffort = $estimatedEffort
        SuggestedIteration = $suggestedIteration
        UsedAI = $script:useAI
        AIAnalysis = if ($script:useAI -and $aiAnalysis) { $aiAnalysis } else { $null }
    }
}

# Step 3: Backfill project fields for all PRs
Write-Host "Step 3: Backfilling project fields..." -ForegroundColor Yellow
if (-not $DryRun) {
    .\scripts\automation\project-management\backfill-project-fields.ps1 -ProjectNumber $ProjectNumber -Owner $Owner
} else {
    Write-Host "  [DRY RUN] Would run backfill-project-fields.ps1" -ForegroundColor Gray
}

# Step 4: Process documentation updates for relevant PRs
Write-Host "Step 4: Processing documentation updates..." -ForegroundColor Yellow
$docsProcessed = 0
$docsNeeded = 0

foreach ($pr in $prAnalysis) {
    # Check if PR needs documentation updates
    $needsDocs = $false
    $docReasons = @()
    
    # Check for documentation-related changes
    if ($pr.Category -eq "Documentation") {
        $needsDocs = $true
        $docReasons += "Documentation category"
    }
    
    # Check for API/component changes that need docs
    if ($pr.Title -match "api|endpoint|component|library|utility" -and $pr.Category -in @("Backend", "Frontend")) {
        $needsDocs = $true
        $docReasons += "API/Component changes"
    }
    
    # Check for feature changes that need changelog
    if ($pr.Title -match "feature|enhancement|add|implement" -and $pr.Category -ne "Testing") {
        $needsDocs = $true
        $docReasons += "Feature changes"
    }
    
    if ($needsDocs) {
        $docsNeeded++
        Write-Host "  Processing documentation for PR #$($pr.Number): $($pr.Title)" -ForegroundColor Cyan
        Write-Host "    Reasons: $($docReasons -join ', ')" -ForegroundColor Gray
        
        if (-not $DryRun) {
            try {
                # Run documentation updater with retry logic
                $maxRetries = 3
                $retryCount = 0
                $success = $false
                
                while ($retryCount -lt $maxRetries -and -not $success) {
                    $retryCount++
                    Write-Host "    Documentation attempt $retryCount/$maxRetries for PR #$($pr.Number)..." -ForegroundColor Gray
                    
                    $docsResult = & ".\scripts\core-utilities\docs-updater.ps1" -PRNumber $pr.Number -UpdateChangelog -UpdateReadme -GenerateDocs
                    if ($LASTEXITCODE -eq 0) {
                        $success = $true
                        $docsProcessed++
                        Write-Host "    ✅ Documentation updated successfully" -ForegroundColor Green
                    } else {
                        if ($retryCount -lt $maxRetries) {
                            Write-Host "    ⚠️ Documentation attempt $retryCount failed, retrying..." -ForegroundColor Yellow
                            Start-Sleep -Seconds 2
                        } else {
                            Write-Host "    ❌ Documentation update failed after $maxRetries attempts" -ForegroundColor Red
                        }
                    }
                }
            } catch {
                Write-Host "    ❌ Documentation update failed: $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "    [DRY RUN] Would run docs-updater.ps1 for PR #$($pr.Number)" -ForegroundColor Gray
            $docsProcessed++
        }
    }
}

Write-Host "Documentation processing complete: $docsProcessed/$docsNeeded PRs processed" -ForegroundColor Green

# Step 5: Process estimates and iterations for related issues
Write-Host "Step 5: Processing estimates and iterations for related issues..." -ForegroundColor Yellow
$issuesProcessed = 0
$issuesNeeded = 0

# Collect all unique related issues
$allRelatedIssues = @()
foreach ($pr in $prAnalysis) {
    foreach ($issueNumber in $pr.RelatedIssues) {
        if ($allRelatedIssues -notcontains $issueNumber) {
            $allRelatedIssues += $issueNumber
        }
    }
}

Write-Host "Found $($allRelatedIssues.Count) unique related issues across all PRs" -ForegroundColor Cyan

foreach ($issueNumber in $allRelatedIssues) {
    $issuesNeeded++
    Write-Host "  Processing issue #$issueNumber..." -ForegroundColor Cyan
    
    # Find the PR that references this issue to get context
    $referencingPR = $prAnalysis | Where-Object { $_.RelatedIssues -contains $issueNumber } | Select-Object -First 1
    
    if ($referencingPR) {
        $estimatedEffort = $referencingPR.EstimatedEffort
        $suggestedIteration = $referencingPR.SuggestedIteration
        
        Write-Host "    PR #$($referencingPR.Number): $($referencingPR.Title)" -ForegroundColor Gray
        Write-Host "    Estimated effort: $estimatedEffort days" -ForegroundColor Gray
        Write-Host "    Suggested iteration: $suggestedIteration" -ForegroundColor Gray
        
        if (-not $DryRun) {
            try {
                # Run estimate and iteration script with retry logic
                $maxRetries = 3
                $retryCount = 0
                $success = $false
                
                while ($retryCount -lt $maxRetries -and -not $success) {
                    $retryCount++
                    Write-Host "    Attempt $retryCount/$maxRetries for issue #$issueNumber..." -ForegroundColor Gray
                    
                    $estimateResult = & ".\scripts\core-utilities\set-estimate-iteration.ps1" -IssueNumber $issueNumber -Estimate $estimatedEffort -Iteration $suggestedIteration
                    if ($LASTEXITCODE -eq 0) {
                        $success = $true
                        $issuesProcessed++
                        Write-Host "    ✅ Issue #$issueNumber configured successfully" -ForegroundColor Green
                    } else {
                        if ($retryCount -lt $maxRetries) {
                            Write-Host "    ⚠️ Attempt $retryCount failed, retrying..." -ForegroundColor Yellow
                            Start-Sleep -Seconds 2
                        } else {
                            Write-Host "    ❌ Issue #$issueNumber configuration failed after $maxRetries attempts" -ForegroundColor Red
                        }
                    }
                }
            } catch {
                Write-Host "    ❌ Issue #$issueNumber configuration failed: $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "    [DRY RUN] Would set estimate=$estimatedEffort, iteration=$suggestedIteration for issue #$issueNumber" -ForegroundColor Gray
            $issuesProcessed++
        }
    }
}

Write-Host "Issue processing complete: $issuesProcessed/$issuesNeeded issues processed" -ForegroundColor Green

# Display AI cache statistics if AI was used
if ($script:useAI) {
    Write-Host ""
    Write-Host "AI Services Statistics:" -ForegroundColor Yellow
    $cacheStats = Get-AICacheStats
    if ($cacheStats) {
        Write-Host "  Cache hits: $($cacheStats.CacheHits)" -ForegroundColor Gray
        Write-Host "  Cache misses: $($cacheStats.CacheMisses)" -ForegroundColor Gray
        Write-Host "  Total requests: $($cacheStats.TotalRequests)" -ForegroundColor Gray
        Write-Host "  Cache hit rate: $($cacheStats.HitRate)%" -ForegroundColor Gray
    }
    Write-Host ""
}

# Step 6: Determine optimal agent count and assignment strategy
Write-Host "Step 6: Determining optimal agent assignment..." -ForegroundColor Yellow

# Calculate workload metrics
$totalCriticalComments = ($prAnalysis | Measure-Object -Property CriticalComments -Sum).Sum
$totalHighComments = ($prAnalysis | Measure-Object -Property HighComments -Sum).Sum
$totalMediumComments = ($prAnalysis | Measure-Object -Property MediumComments -Sum).Sum
$totalLowComments = ($prAnalysis | Measure-Object -Property LowComments -Sum).Sum
$totalComments = ($prAnalysis | Measure-Object -Property TotalComments -Sum).Sum

$highComplexityPRs = ($prAnalysis | Where-Object { $_.Complexity -eq "High" }).Count
$mediumComplexityPRs = ($prAnalysis | Where-Object { $_.Complexity -eq "Medium" }).Count
$lowComplexityPRs = ($prAnalysis | Where-Object { $_.Complexity -eq "Low" }).Count
$readyPRs = ($prAnalysis | Where-Object { $_.ReadyForMerge }).Count
$draftPRs = ($prAnalysis | Where-Object { $_.IsDraft }).Count

# Determine optimal agent count
$recommendedAgents = 2  # Default to 2-agent strategy
if ($prCount -ge 15 -or $totalCriticalComments -ge 5 -or $highComplexityPRs -ge 3) {
    $recommendedAgents = 5  # Multi-agent strategy for complex workloads
} elseif ($prCount -ge 10 -or $totalHighComments -ge 8) {
    $recommendedAgents = 3  # 3-agent strategy for medium workloads
}

# Step 5: Generate agent assignments
Write-Host "Step 5: Generating agent assignments..." -ForegroundColor Yellow

if ($recommendedAgents -eq 2) {
    # Two-agent strategy
    $agent1PRs = $prAnalysis | Where-Object { $_.Category -in @("Frontend", "Security", "Documentation") -or $_.CriticalComments -gt 0 }
    $agent2PRs = $prAnalysis | Where-Object { $_.Category -in @("Backend", "Performance", "Testing") -or $_.Category -notin @("Frontend", "Security", "Documentation") }
    
    $agent1Workload = ($agent1PRs | Measure-Object -Property TotalComments -Sum).Sum
    $agent2Workload = ($agent2PRs | Measure-Object -Property TotalComments -Sum).Sum
    
} elseif ($recommendedAgents -eq 3) {
    # Three-agent strategy
    $agent1PRs = $prAnalysis | Where-Object { $_.CriticalComments -gt 0 -or $_.Category -eq "Security" }
    $agent2PRs = $prAnalysis | Where-Object { $_.Category -in @("Frontend", "Performance", "Documentation") -and $_.CriticalComments -eq 0 }
    $agent3PRs = $prAnalysis | Where-Object { $_.Category -in @("Backend", "Testing") -and $_.CriticalComments -eq 0 }
    
} else {
    # Five-agent strategy
    $agent1PRs = $prAnalysis | Where-Object { $_.CriticalComments -gt 0 }
    $agent2PRs = $prAnalysis | Where-Object { $_.Category -eq "Performance" -and $_.HighComments -gt 0 }
    $agent3PRs = $prAnalysis | Where-Object { $_.Category -in @("Frontend", "Backend") -and $_.TotalComments -gt 0 -and $_.CriticalComments -eq 0 }
    $agent4PRs = $prAnalysis | Where-Object { $_.Category -eq "Documentation" -or $_.ReadyForMerge -or $_.TotalComments -eq 0 }
    $agent5PRs = $prAnalysis | Where-Object { $_.IsDraft }
}

# Step 6: Generate comprehensive report
Write-Host "Step 6: Generating assignment report..." -ForegroundColor Yellow

$report = @"
# PR Agent Assignment Report
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## 📊 **Workload Analysis Summary**

### **PR Statistics:**
- **Total Open PRs**: $prCount
- **High Complexity**: $highComplexityPRs PRs
- **Medium Complexity**: $mediumComplexityPRs PRs  
- **Low Complexity**: $lowComplexityPRs PRs
- **Ready for Merge**: $readyPRs PRs
- **Draft PRs**: $draftPRs PRs
- **Documentation Updates**: $docsProcessed/$docsNeeded PRs processed
- **Issue Estimates**: $issuesProcessed/$issuesNeeded issues processed
- **GitHub API Calls**: Using robust utilities with retry logic and error handling
- **AI Analysis**: $($prAnalysis | Where-Object { $_.UsedAI }).Count/$prCount PRs analyzed with AI

### **CR-GPT Comments by Priority:**
- **CRITICAL**: $totalCriticalComments comments
- **HIGH**: $totalHighComments comments
- **MEDIUM**: $totalMediumComments comments
- **LOW**: $totalLowComments comments
- **TOTAL**: $totalComments comments

## 🎯 **Recommended Strategy: $recommendedAgents Agents**

"@

if ($recommendedAgents -eq 2) {
    $report += @"

### **Agent 1: Frontend & Critical Security Specialist**
**PRs Assigned**: $($agent1PRs.Count)
**Total Comments**: $agent1Workload

**Assigned PRs:**
"@
    foreach ($pr in $agent1PRs) {
        $report += @"
- **PR #$($pr.Number)** - $($pr.Title)
  - $($pr.TotalComments) CR-GPT comments ($($pr.CriticalComments) CRITICAL, $($pr.HighComments) HIGH)
  - **Category**: $($pr.Category)
  - **Complexity**: $($pr.Complexity)
"@
    }

    $report += @"

### **Agent 2: Backend & Infrastructure Specialist**
**PRs Assigned**: $($agent2PRs.Count)
**Total Comments**: $agent2Workload

**Assigned PRs:**
"@
    foreach ($pr in $agent2PRs) {
        $report += @"
- **PR #$($pr.Number)** - $($pr.Title)
  - $($pr.TotalComments) CR-GPT comments ($($pr.CriticalComments) CRITICAL, $($pr.HighComments) HIGH)
  - **Category**: $($pr.Category)
  - **Complexity**: $($pr.Complexity)
"@
    }
}

$report += @"

## 🚀 **Execution Commands**

### **Step 1: Backfill Project Fields**
```powershell
.\scripts\automation\project-management\backfill-project-fields.ps1 -ProjectNumber $ProjectNumber -Owner $Owner
```

### **Step 2: Agent Assignment Commands**
"@

if ($recommendedAgents -eq 2) {
    $report += @"

**Agent 1 Commands:**
"@
    foreach ($pr in $agent1PRs) {
        $report += @"
```powershell
# Process PR #$($pr.Number) - $($pr.Title)
.\scripts\automation\pr-automation-unified.ps1 -PRNumber $($pr.Number) -Action all
# Update documentation if needed
.\scripts\core-utilities\docs-updater.ps1 -PRNumber $($pr.Number) -UpdateChangelog -UpdateReadme -GenerateDocs
# Set estimates and iterations for related issues"@
        if ($pr.RelatedIssues.Count -gt 0) {
            $report += @"
# Related issues: $($pr.RelatedIssues -join ', ')
# Estimated effort: $($pr.EstimatedEffort) days
# Suggested iteration: $($pr.SuggestedIteration)
"@
            foreach ($issueNumber in $pr.RelatedIssues) {
                $report += @"
.\scripts\core-utilities\set-estimate-iteration.ps1 -IssueNumber $issueNumber -Estimate $($pr.EstimatedEffort) -Iteration "$($pr.SuggestedIteration)"
"@
            }
        }
        $report += @"
```"@
    }

    $report += @"

**Agent 2 Commands:**
"@
    foreach ($pr in $agent2PRs) {
        $report += @"
```powershell
# Process PR #$($pr.Number) - $($pr.Title)
.\scripts\automation\pr-automation-unified.ps1 -PRNumber $($pr.Number) -Action all
# Update documentation if needed
.\scripts\core-utilities\docs-updater.ps1 -PRNumber $($pr.Number) -UpdateChangelog -UpdateReadme -GenerateDocs
# Set estimates and iterations for related issues"@
        if ($pr.RelatedIssues.Count -gt 0) {
            $report += @"
# Related issues: $($pr.RelatedIssues -join ', ')
# Estimated effort: $($pr.EstimatedEffort) days
# Suggested iteration: $($pr.SuggestedIteration)
"@
            foreach ($issueNumber in $pr.RelatedIssues) {
                $report += @"
.\scripts\core-utilities\set-estimate-iteration.ps1 -IssueNumber $issueNumber -Estimate $($pr.EstimatedEffort) -Iteration "$($pr.SuggestedIteration)"
"@
            }
        }
        $report += @"
```"@
    }
}

$report += @"

## 📈 **Success Metrics**

- **100% of CRITICAL security issues resolved**
- **100% of HIGH priority issues resolved**
- **90% of MEDIUM/LOW priority issues resolved**
- **All ready PRs merged**
- **All draft PRs integrated or closed**
- **100% of documentation updates completed**
- **All API/component changes documented**
- **100% of related issues have estimates set**
- **All issues assigned to appropriate iterations**
- **All GitHub API calls completed successfully with retry logic**
- **Robust error handling for all external service calls**
- **AI analysis completed for all PRs (with fallback to rule-based)**
- **Intelligent complexity and category assessment using AI**

## 🎯 **Next Steps**

1. **Review the assignment report**
2. **Run the backfill script to standardize project fields**
3. **Execute documentation updates for relevant PRs**
4. **Set estimates and iterations for related issues**
5. **Assign agents to their respective PRs**
6. **Execute the automation commands**
7. **Monitor progress via project board**
8. **Verify documentation updates are complete**
9. **Verify issue estimates and iterations are set**

---
*Generated by PR Agent Assignment Workflow*
"@

# Save report
if ($ExportTo) {
    $report | Out-File -FilePath $ExportTo -Encoding UTF8
    Write-Host "Report saved to: $ExportTo" -ForegroundColor Green
}

# Display summary
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "      Assignment Complete!" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "Total PRs: $prCount" -ForegroundColor Green
Write-Host "Recommended Agents: $recommendedAgents" -ForegroundColor Green
Write-Host "Total Comments: $totalComments" -ForegroundColor Green
Write-Host "Critical Issues: $totalCriticalComments" -ForegroundColor $(if ($totalCriticalComments -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($DryRun) {
    Write-Host "This was a DRY RUN - no changes were made" -ForegroundColor Yellow
} else {
    Write-Host "Project fields have been backfilled" -ForegroundColor Green
    Write-Host "Assignment report generated: $ExportTo" -ForegroundColor Green
}

