# Simple PR Analyzer for Jason and Chris Assignment
# Usage: .\simple-pr-analyzer.ps1 -DryRun

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Agent capabilities
$agentCapabilities = @{
    "jason" = @{
        Name = "Jason - Frontend & Critical Security Specialist"
        Skills = @("React", "Next.js", "TypeScript", "Tailwind", "UI/UX", "SEO", "Accessibility")
        Keywords = @("frontend", "ui", "component", "layout", "styling", "dashboard", "seo", "a11y", "accessibility", "ssr", "social")
    }
    "chris" = @{
        Name = "Chris - Backend & Infrastructure Specialist"
        Skills = @("Node.js", "API", "Database", "Prisma", "GraphQL", "PowerShell", "AI Services", "Performance", "Middleware")
        Keywords = @("backend", "api", "database", "server", "graphql", "performance", "middleware", "automation", "infrastructure", "ai", "queue")
    }
}

function Show-Banner {
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host "        Simple PR Analyzer" -ForegroundColor Blue
    Write-Host "    Jason (Frontend) & Chris (Backend)" -ForegroundColor Blue
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host ""
}

function Analyze-PR {
    param([int]$PRNumber)
    
    try {
        $prJson = gh pr view $PRNumber --json title,body,labels,files
        $pr = $prJson | ConvertFrom-Json
        
        $analysis = @{
            PRNumber = $PRNumber
            Title = $pr.title
            Body = if ($pr.body) { $pr.body } else { "" }
            Labels = if ($pr.labels) { $pr.labels.name } else { @() }
            Files = if ($pr.files) { $pr.files.path } else { @() }
            RecommendedAgent = ""
            Score = @{}
            Reasoning = ""
        }
        
        # Combine text for analysis
        $combinedText = "$($pr.title.ToLower()) $($pr.body.ToLower())"
        $filePaths = if ($pr.files) { $pr.files.path -join " " } else { "" }
        
        # Score each agent
        foreach ($agentName in $agentCapabilities.Keys) {
            $score = 0
            $capabilities = $agentCapabilities[$agentName]
            
            # Check for keywords in title/body
            foreach ($keyword in $capabilities.Keywords) {
                if ($combinedText -match $keyword) {
                    $score += 10
                }
            }
            
            # Check for skills
            foreach ($skill in $capabilities.Skills) {
                if ($combinedText -match $skill.ToLower()) {
                    $score += 5
                }
            }
            
            # Check file paths
            foreach ($keyword in $capabilities.Keywords) {
                if ($filePaths.ToLower() -match $keyword) {
                    $score += 15
                }
            }
            
            $analysis.Score[$agentName] = $score
        }
        
        # Determine recommended agent
        if ($analysis.Score["jason"] -gt $analysis.Score["chris"]) {
            $analysis.RecommendedAgent = "jason"
            $analysis.Reasoning = "Frontend/UI focus detected"
        } elseif ($analysis.Score["chris"] -gt $analysis.Score["jason"]) {
            $analysis.RecommendedAgent = "chris"
            $analysis.Reasoning = "Backend/Infrastructure focus detected"
        } else {
            $analysis.RecommendedAgent = "jason"
            $analysis.Reasoning = "Tie - defaulting to Jason"
        }
        
        return $analysis
    } catch {
        Write-Host "ERROR: Failed to analyze PR #$PRNumber : $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Get-OpenPRs {
    try {
        $prs = gh pr list --state open --json number,title,labels --limit 50 | ConvertFrom-Json
        return $prs
    } catch {
        Write-Host "ERROR: Failed to fetch open PRs: $($_.Exception.Message)" -ForegroundColor Red
        return @()
    }
}

# Main execution
Show-Banner

Write-Host "Fetching open PRs..." -ForegroundColor Green
$openPRs = Get-OpenPRs

if ($openPRs.Count -eq 0) {
    Write-Host "No open PRs found." -ForegroundColor Yellow
    exit 0
}

Write-Host "Found $($openPRs.Count) open PRs. Analyzing..." -ForegroundColor Green
Write-Host ""

$jasonPRs = @()
$chrisPRs = @()

foreach ($pr in $openPRs) {
    Write-Host "Analyzing PR #$($pr.number): $($pr.title)" -ForegroundColor White
    
    $analysis = Analyze-PR $pr.number
    if ($analysis) {
        Write-Host "  Recommended: $($agentCapabilities[$analysis.RecommendedAgent].Name)" -ForegroundColor Cyan
        Write-Host "  Reasoning: $($analysis.Reasoning)" -ForegroundColor Gray
        Write-Host "  Scores: Jason=$($analysis.Score['jason']), Chris=$($analysis.Score['chris'])" -ForegroundColor Gray
        
        if ($analysis.RecommendedAgent -eq "jason") {
            $jasonPRs += $analysis
        } else {
            $chrisPRs += $analysis
        }
    }
    Write-Host ""
}

# Summary
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "           ASSIGNMENT SUMMARY" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

Write-Host "JASON (Frontend Specialist) - $($jasonPRs.Count) PRs:" -ForegroundColor Green
foreach ($pr in $jasonPRs) {
    Write-Host "  PR #$($pr.PRNumber): $($pr.Title)" -ForegroundColor White
}
Write-Host ""

Write-Host "CHRIS (Backend Specialist) - $($chrisPRs.Count) PRs:" -ForegroundColor Green
foreach ($pr in $chrisPRs) {
    Write-Host "  PR #$($pr.PRNumber): $($pr.Title)" -ForegroundColor White
}
Write-Host ""

Write-Host "Total PRs Analyzed: $($openPRs.Count)" -ForegroundColor Cyan
Write-Host "Jason Workload: $($jasonPRs.Count) PRs" -ForegroundColor Yellow
Write-Host "Chris Workload: $($chrisPRs.Count) PRs" -ForegroundColor Yellow

if ($DryRun) {
    Write-Host ""
    Write-Host "[DRY RUN] No actual assignments made." -ForegroundColor Magenta
} else {
    Write-Host ""
    Write-Host "Ready to assign PRs to agents!" -ForegroundColor Green
}
