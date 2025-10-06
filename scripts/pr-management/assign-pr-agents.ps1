#!/usr/bin/env pwsh
# PR Agent Assignment Workflow
# Evaluates current PRs, backfills project fields, determines optimal agent count, and assigns PRs
# Usage: .\scripts\pr-management\assign-pr-agents.ps1 [-ProjectNumber <NUMBER>] [-Owner <USERNAME>] [-DryRun]

param(
    [string]$ProjectNumber = "20",
    [string]$Owner = "jschibelli",
    [switch]$DryRun,
    [string]$ExportTo = "pr-agent-assignment-report.md"
)

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "      PR Agent Assignment Workflow" -ForegroundColor Blue
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

# Step 2: Analyze each PR for CR-GPT comments and complexity
Write-Host "Step 2: Analyzing PR complexity and CR-GPT comments..." -ForegroundColor Yellow
$prAnalysis = @()

foreach ($pr in $openPRs) {
    Write-Host "Analyzing PR #$($pr.number): $($pr.title)" -ForegroundColor Cyan
    
    # Get PR details and comments
    $prDetails = gh pr view $pr.number --json title,body,comments,reviews,commits,files
    $crgptComments = $prDetails.comments | Where-Object { $_.author.login -eq "cr-gpt" }
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
    
    # Determine complexity
    $totalComments = $crgptComments.Count
    $complexity = if ($totalComments -ge 10) { "High" } elseif ($totalComments -ge 5) { "Medium" } elseif ($totalComments -ge 1) { "Low" } else { "None" }
    
    # Determine category based on title and files
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
    }
}

# Step 3: Backfill project fields for all PRs
Write-Host "Step 3: Backfilling project fields..." -ForegroundColor Yellow
if (-not $DryRun) {
    .\scripts\automation\project-management\backfill-project-fields.ps1 -ProjectNumber $ProjectNumber -Owner $Owner
} else {
    Write-Host "  [DRY RUN] Would run backfill-project-fields.ps1" -ForegroundColor Gray
}

# Step 4: Determine optimal agent count and assignment strategy
Write-Host "Step 4: Determining optimal agent assignment..." -ForegroundColor Yellow

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
    $agent1PRs = $prAnalysis | Where-Object { $_.Category -in @("Frontend", "Security") -or $_.CriticalComments -gt 0 }
    $agent2PRs = $prAnalysis | Where-Object { $_.Category -in @("Backend", "Performance") -or $_.Category -notin @("Frontend", "Security") }
    
    $agent1Workload = ($agent1PRs | Measure-Object -Property TotalComments -Sum).Sum
    $agent2Workload = ($agent2PRs | Measure-Object -Property TotalComments -Sum).Sum
    
} elseif ($recommendedAgents -eq 3) {
    # Three-agent strategy
    $agent1PRs = $prAnalysis | Where-Object { $_.CriticalComments -gt 0 -or $_.Category -eq "Security" }
    $agent2PRs = $prAnalysis | Where-Object { $_.Category -in @("Frontend", "Performance") -and $_.CriticalComments -eq 0 }
    $agent3PRs = $prAnalysis | Where-Object { $_.Category -in @("Backend", "Testing") -and $_.CriticalComments -eq 0 }
    
} else {
    # Five-agent strategy
    $agent1PRs = $prAnalysis | Where-Object { $_.CriticalComments -gt 0 }
    $agent2PRs = $prAnalysis | Where-Object { $_.Category -eq "Performance" -and $_.HighComments -gt 0 }
    $agent3PRs = $prAnalysis | Where-Object { $_.Category -in @("Frontend", "Backend") -and $_.TotalComments -gt 0 -and $_.CriticalComments -eq 0 }
    $agent4PRs = $prAnalysis | Where-Object { $_.ReadyForMerge -or $_.TotalComments -eq 0 }
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
.\scripts\automation\pr-automation-unified.ps1 -PRNumber $($pr.Number) -Action all
```"@
    }

    $report += @"

**Agent 2 Commands:**
"@
    foreach ($pr in $agent2PRs) {
        $report += @"
```powershell
.\scripts\automation\pr-automation-unified.ps1 -PRNumber $($pr.Number) -Action all
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

## 🎯 **Next Steps**

1. **Review the assignment report**
2. **Run the backfill script to standardize project fields**
3. **Assign agents to their respective PRs**
4. **Execute the automation commands**
5. **Monitor progress via project board**

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
