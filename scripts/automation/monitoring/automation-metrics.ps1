# Advanced Analytics and Monitoring System for Portfolio OS Automation
# Usage: .\scripts\automation\monitoring\automation-metrics.ps1 [-Operation <OPERATION>] [-ExportTo <FILE>] [-TimeRange <DAYS>]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("overview", "performance", "issues", "agents", "trends", "health", "alerts")]
    [string]$Operation = "overview",
    
    [Parameter(Mandatory=$false)]
    [string]$ExportTo,
    
    [Parameter(Mandatory=$false)]
    [int]$TimeRange = 30,
    
    [Parameter(Mandatory=$false)]
    [switch]$RealTime,
    
    [Parameter(Mandatory=$false)]
    [switch]$Detailed
)

# Import required modules and utilities
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$automationPath = Split-Path -Parent $scriptPath
$coreUtilsPath = Join-Path $automationPath "core-utilities"
$githubUtilsPath = Join-Path $coreUtilsPath "github-utils.ps1"

if (Test-Path $githubUtilsPath) {
    . $githubUtilsPath
}

# Global metrics storage
$global:metrics = @{
    Issues = @{}
    Agents = @{}
    Performance = @{}
    Trends = @{}
    Health = @{}
    Alerts = @()
}

function Get-ColorOutput {
    param([string]$Message, [string]$Color)
    Write-Host $Message -ForegroundColor $Color
}

function Initialize-MetricsSystem {
    Write-Host "📊 Initializing Advanced Analytics and Monitoring System" -ForegroundColor Blue
    Write-Host "=====================================================" -ForegroundColor Blue
    
    # Create metrics directory if it doesn't exist
    $metricsDir = Join-Path $scriptPath "data"
    if (-not (Test-Path $metricsDir)) {
        New-Item -ItemType Directory -Path $metricsDir -Force | Out-Null
    }
    
    # Load historical data if available
    Load-HistoricalMetrics
    
    Write-Host "✅ Metrics system initialized" -ForegroundColor Green
}

function Load-HistoricalMetrics {
    $metricsDir = Join-Path $scriptPath "data"
    $historicalFile = Join-Path $metricsDir "historical-metrics.json"
    
    if (Test-Path $historicalFile) {
        try {
            $historicalData = Get-Content $historicalFile -Raw | ConvertFrom-Json
            $global:metrics = $historicalData
            Write-Host "📈 Loaded historical metrics data" -ForegroundColor Cyan
        } catch {
            Write-Host "⚠️  Could not load historical metrics: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

function Save-Metrics {
    $metricsDir = Join-Path $scriptPath "data"
    $metricsFile = Join-Path $metricsDir "historical-metrics.json"
    
    try {
        $global:metrics | ConvertTo-Json -Depth 5 | Out-File -FilePath $metricsFile -Encoding UTF8
        Write-Host "💾 Metrics saved to historical data" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to save metrics: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Collect-IssueMetrics {
    Write-Host "🎫 Collecting Issue Metrics..." -ForegroundColor Yellow
    
    try {
        # Get all issues from the last TimeRange days
        $cutoffDate = (Get-Date).AddDays(-$TimeRange).ToString("yyyy-MM-dd")
        $issues = gh issue list --state all --limit 100 --json number,title,state,labels,assignees,createdAt,updatedAt,closedAt | ConvertFrom-Json
        
        $issueMetrics = @{
            Total = $issues.Count
            Open = ($issues | Where-Object { $_.state -eq "OPEN" }).Count
            Closed = ($issues | Where-Object { $_.state -eq "CLOSED" }).Count
            ByPriority = @{}
            ByLabel = @{}
            ByAssignee = @{}
            ResolutionTime = @()
            CreatedPerDay = @{}
            ClosedPerDay = @{}
        }
        
        foreach ($issue in $issues) {
            # Priority analysis
            $priority = "Medium"
            foreach ($label in $issue.labels.name) {
                if ($label -match "priority.*high|urgent|critical") { $priority = "High"; break }
                if ($label -match "priority.*low") { $priority = "Low"; break }
            }
            if (-not $issueMetrics.ByPriority.ContainsKey($priority)) {
                $issueMetrics.ByPriority[$priority] = 0
            }
            $issueMetrics.ByPriority[$priority]++
            
            # Label analysis
            foreach ($label in $issue.labels.name) {
                if (-not $issueMetrics.ByLabel.ContainsKey($label)) {
                    $issueMetrics.ByLabel[$label] = 0
                }
                $issueMetrics.ByLabel[$label]++
            }
            
            # Assignee analysis
            foreach ($assignee in $issue.assignees.login) {
                if (-not $issueMetrics.ByAssignee.ContainsKey($assignee)) {
                    $issueMetrics.ByAssignee[$assignee] = 0
                }
                $issueMetrics.ByAssignee[$assignee]++
            }
            
            # Resolution time calculation
            if ($issue.state -eq "CLOSED" -and $issue.closedAt) {
                $createdDate = [DateTime]::Parse($issue.createdAt)
                $closedDate = [DateTime]::Parse($issue.closedAt)
                $resolutionTime = ($closedDate - $createdDate).TotalHours
                $issueMetrics.ResolutionTime += $resolutionTime
            }
            
            # Daily creation/closure tracking
            $createdDate = [DateTime]::Parse($issue.createdAt).ToString("yyyy-MM-dd")
            if (-not $issueMetrics.CreatedPerDay.ContainsKey($createdDate)) {
                $issueMetrics.CreatedPerDay[$createdDate] = 0
            }
            $issueMetrics.CreatedPerDay[$createdDate]++
            
            if ($issue.closedAt) {
                $closedDate = [DateTime]::Parse($issue.closedAt).ToString("yyyy-MM-dd")
                if (-not $issueMetrics.ClosedPerDay.ContainsKey($closedDate)) {
                    $issueMetrics.ClosedPerDay[$closedDate] = 0
                }
                $issueMetrics.ClosedPerDay[$closedDate]++
            }
        }
        
        $global:metrics.Issues = $issueMetrics
        Write-Host "✅ Issue metrics collected: $($issueMetrics.Total) total issues" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Failed to collect issue metrics: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Collect-AgentMetrics {
    Write-Host "🤖 Collecting Agent Metrics..." -ForegroundColor Yellow
    
    try {
        # Analyze agent worktree states if available
        $worktreeStateFile = Join-Path $scriptPath "..\issue-management\worktree-state.json"
        
        $agentMetrics = @{
            TotalAgents = 0
            ActiveAgents = 0
            AgentWorkloads = @{}
            AgentPerformance = @{}
            LastActivity = @{}
        }
        
        if (Test-Path $worktreeStateFile) {
            $worktreeState = Get-Content $worktreeStateFile -Raw | ConvertFrom-Json
            
            foreach ($agent in $worktreeState.Agents.PSObject.Properties) {
                $agentMetrics.TotalAgents++
                
                if ($agent.Value.CurrentIssue -ne $null) {
                    $agentMetrics.ActiveAgents++
                }
                
                $agentMetrics.AgentWorkloads[$agent.Name] = @{
                    CurrentIssue = $agent.Value.CurrentIssue
                    LockedIssues = $agent.Value.LockedIssues.Count
                    LastActivity = $agent.Value.LastActivity
                }
            }
        } else {
            # Fallback: analyze based on branch names and recent commits
            $branches = git branch -a | Where-Object { $_ -match "agent-\d+" }
            $agentMetrics.TotalAgents = $branches.Count
            
            foreach ($branch in $branches) {
                $branchName = $branch.Trim('* ')
                $agentMetrics.AgentWorkloads[$branchName] = @{
                    CurrentIssue = $null
                    LockedIssues = 0
                    LastActivity = "Unknown"
                }
            }
        }
        
        $global:metrics.Agents = $agentMetrics
        Write-Host "✅ Agent metrics collected: $($agentMetrics.TotalAgents) agents, $($agentMetrics.ActiveAgents) active" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Failed to collect agent metrics: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Collect-PerformanceMetrics {
    Write-Host "⚡ Collecting Performance Metrics..." -ForegroundColor Yellow
    
    try {
        $performanceMetrics = @{
            ScriptExecutionTimes = @{}
            APIResponseTimes = @{}
            ErrorRates = @{}
            SuccessRates = @{}
            ResourceUsage = @{}
        }
        
        # Analyze script execution logs if available
        $logDir = Join-Path $scriptPath "..\..\..\logs"
        if (Test-Path $logDir) {
            $logFiles = Get-ChildItem $logDir -Filter "*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 10
            
            foreach ($logFile in $logFiles) {
                $content = Get-Content $logFile.FullName
                
                # Extract execution times and error rates
                $executionTimes = $content | Where-Object { $_ -match "Execution time: (\d+\.?\d*)" }
                $errors = $content | Where-Object { $_ -match "ERROR|FAILED|Exception" }
                $successes = $content | Where-Object { $_ -match "SUCCESS|COMPLETED|✅" }
                
                $performanceMetrics.ErrorRates[$logFile.Name] = $errors.Count
                $performanceMetrics.SuccessRates[$logFile.Name] = $successes.Count
            }
        }
        
        # System resource usage
        $performanceMetrics.ResourceUsage = @{
            CPUUsage = (Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 1 -MaxSamples 1).CounterSamples.CookedValue
            MemoryUsage = [Math]::Round((Get-Process -Name "powershell" -ErrorAction SilentlyContinue | Measure-Object WorkingSet -Sum).Sum / 1MB, 2)
            DiskSpace = (Get-WmiObject -Class Win32_LogicalDisk | Where-Object { $_.DeviceID -eq "C:" }).FreeSpace / 1GB
        }
        
        $global:metrics.Performance = $performanceMetrics
        Write-Host "✅ Performance metrics collected" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Failed to collect performance metrics: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Analyze-Trends {
    Write-Host "📈 Analyzing Trends..." -ForegroundColor Yellow
    
    try {
        $trendMetrics = @{
            IssueVelocity = @{}
            ResolutionTrends = @{}
            AgentEfficiency = @{}
            AutomationAdoption = @{}
        }
        
        # Calculate issue velocity (issues closed per day)
        if ($global:metrics.Issues.ClosedPerDay) {
            $recentDays = $global:metrics.Issues.ClosedPerDay.Keys | Sort-Object | Select-Object -Last 7
            $totalClosed = 0
            foreach ($day in $recentDays) {
                $totalClosed += $global:metrics.Issues.ClosedPerDay[$day]
            }
            $trendMetrics.IssueVelocity = @{
                RecentAverage = [Math]::Round($totalClosed / $recentDays.Count, 2)
                Trend = if ($totalClosed -gt 0) { "Increasing" } else { "Stable" }
            }
        }
        
        # Resolution time trends
        if ($global:metrics.Issues.ResolutionTime) {
            $avgResolutionTime = ($global:metrics.Issues.ResolutionTime | Measure-Object -Average).Average
            $trendMetrics.ResolutionTrends = @{
                AverageHours = [Math]::Round($avgResolutionTime, 2)
                Trend = if ($avgResolutionTime -lt 24) { "Fast" } elseif ($avgResolutionTime -lt 72) { "Medium" } else { "Slow" }
            }
        }
        
        $global:metrics.Trends = $trendMetrics
        Write-Host "✅ Trend analysis completed" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Failed to analyze trends: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Check-SystemHealth {
    Write-Host "🏥 Checking System Health..." -ForegroundColor Yellow
    
    try {
        $healthMetrics = @{
            Overall = "Healthy"
            Issues = @()
            Warnings = @()
            Recommendations = @()
        }
        
        # Check for stale issues
        if ($global:metrics.Issues.Open -gt 0) {
            $staleThreshold = 7 # days
            $healthMetrics.Issues += "Open issues detected: $($global:metrics.Issues.Open)"
            
            if ($global:metrics.Issues.Open -gt 10) {
                $healthMetrics.Warnings += "High number of open issues: $($global:metrics.Issues.Open)"
                $healthMetrics.Recommendations += "Consider increasing automation or adding more agents"
            }
        }
        
        # Check agent activity
        if ($global:metrics.Agents.ActiveAgents -eq 0) {
            $healthMetrics.Warnings += "No active agents detected"
            $healthMetrics.Recommendations += "Check agent worktree status and restart if needed"
        }
        
        # Check performance
        if ($global:metrics.Performance.ResourceUsage) {
            $cpuUsage = $global:metrics.Performance.ResourceUsage.CPUUsage
            if ($cpuUsage -gt 80) {
                $healthMetrics.Warnings += "High CPU usage: $([Math]::Round($cpuUsage, 1))%"
            }
            
            $memoryUsage = $global:metrics.Performance.ResourceUsage.MemoryUsage
            if ($memoryUsage -gt 1000) { # MB
                $healthMetrics.Warnings += "High memory usage: $memoryUsage MB"
            }
        }
        
        # Determine overall health
        if ($healthMetrics.Warnings.Count -gt 3) {
            $healthMetrics.Overall = "Critical"
        } elseif ($healthMetrics.Warnings.Count -gt 1) {
            $healthMetrics.Overall = "Warning"
        } elseif ($healthMetrics.Issues.Count -gt 0) {
            $healthMetrics.Overall = "Attention"
        }
        
        $global:metrics.Health = $healthMetrics
        Write-Host "✅ System health check completed: $($healthMetrics.Overall)" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Failed to check system health: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Generate-Alerts {
    Write-Host "🚨 Generating Alerts..." -ForegroundColor Yellow
    
    try {
        $alerts = @()
        
        # Health-based alerts
        if ($global:metrics.Health.Overall -eq "Critical") {
            $alerts += @{
                Type = "Critical"
                Message = "System health is critical - immediate attention required"
                Timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
            }
        }
        
        # Performance alerts
        if ($global:metrics.Performance.ResourceUsage.CPUUsage -gt 90) {
            $alerts += @{
                Type = "Warning"
                Message = "CPU usage is critically high: $([Math]::Round($global:metrics.Performance.ResourceUsage.CPUUsage, 1))%"
                Timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
            }
        }
        
        # Issue velocity alerts
        if ($global:metrics.Trends.IssueVelocity.Trend -eq "Decreasing") {
            $alerts += @{
                Type = "Info"
                Message = "Issue resolution velocity is decreasing"
                Timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
            }
        }
        
        $global:metrics.Alerts = $alerts
        Write-Host "✅ Generated $($alerts.Count) alerts" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Failed to generate alerts: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Show-Overview {
    Write-Host "`n📊 PORTFOLIO OS AUTOMATION OVERVIEW" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    
    # Issues Summary
    Write-Host "`n🎫 ISSUES" -ForegroundColor Yellow
    Write-Host "Total: $($global:metrics.Issues.Total)" -ForegroundColor White
    Write-Host "Open: $($global:metrics.Issues.Open)" -ForegroundColor Red
    Write-Host "Closed: $($global:metrics.Issues.Closed)" -ForegroundColor Green
    
    if ($global:metrics.Issues.ByPriority) {
        Write-Host "`nPriority Breakdown:" -ForegroundColor Gray
        foreach ($priority in $global:metrics.Issues.ByPriority.Keys) {
            Write-Host "  $priority`: $($global:metrics.Issues.ByPriority[$priority])" -ForegroundColor White
        }
    }
    
    # Agents Summary
    Write-Host "`n🤖 AGENTS" -ForegroundColor Yellow
    Write-Host "Total: $($global:metrics.Agents.TotalAgents)" -ForegroundColor White
    Write-Host "Active: $($global:metrics.Agents.ActiveAgents)" -ForegroundColor Green
    
    # Performance Summary
    Write-Host "`n⚡ PERFORMANCE" -ForegroundColor Yellow
    if ($global:metrics.Performance.ResourceUsage) {
        Write-Host "CPU: $([Math]::Round($global:metrics.Performance.ResourceUsage.CPUUsage, 1))%" -ForegroundColor White
        Write-Host "Memory: $($global:metrics.Performance.ResourceUsage.MemoryUsage) MB" -ForegroundColor White
        Write-Host "Disk Space: $([Math]::Round($global:metrics.Performance.ResourceUsage.DiskSpace, 1)) GB" -ForegroundColor White
    }
    
    # Trends Summary
    Write-Host "`n📈 TRENDS" -ForegroundColor Yellow
    if ($global:metrics.Trends.IssueVelocity) {
        Write-Host "Issue Velocity: $($global:metrics.Trends.IssueVelocity.RecentAverage) issues/day" -ForegroundColor White
        Write-Host "Trend: $($global:metrics.Trends.IssueVelocity.Trend)" -ForegroundColor White
    }
    
    if ($global:metrics.Trends.ResolutionTrends) {
        Write-Host "Avg Resolution: $($global:metrics.Trends.ResolutionTrends.AverageHours) hours" -ForegroundColor White
        Write-Host "Speed: $($global:metrics.Trends.ResolutionTrends.Trend)" -ForegroundColor White
    }
    
    # Health Summary
    Write-Host "`n🏥 SYSTEM HEALTH" -ForegroundColor Yellow
    $healthColor = switch ($global:metrics.Health.Overall) {
        "Healthy" { "Green" }
        "Attention" { "Yellow" }
        "Warning" { "Red" }
        "Critical" { "Red" }
        default { "White" }
    }
    Write-Host "Status: $($global:metrics.Health.Overall)" -ForegroundColor $healthColor
    
    if ($global:metrics.Health.Warnings.Count -gt 0) {
        Write-Host "`nWarnings:" -ForegroundColor Red
        foreach ($warning in $global:metrics.Health.Warnings) {
            Write-Host "  ⚠️  $warning" -ForegroundColor Red
        }
    }
    
    if ($global:metrics.Health.Recommendations.Count -gt 0) {
        Write-Host "`nRecommendations:" -ForegroundColor Cyan
        foreach ($recommendation in $global:metrics.Health.Recommendations) {
            Write-Host "  💡 $recommendation" -ForegroundColor Cyan
        }
    }
    
    # Alerts
    if ($global:metrics.Alerts.Count -gt 0) {
        Write-Host "`n🚨 ACTIVE ALERTS" -ForegroundColor Red
        foreach ($alert in $global:metrics.Alerts) {
            $alertColor = switch ($alert.Type) {
                "Critical" { "Red" }
                "Warning" { "Yellow" }
                "Info" { "Cyan" }
                default { "White" }
            }
            Write-Host "  [$($alert.Type)] $($alert.Message)" -ForegroundColor $alertColor
        }
    }
}

function Export-MetricsReport {
    param([string]$OutputFile)
    
    $reportContent = @"
# Portfolio OS Automation Metrics Report
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## Executive Summary
- **System Health**: $($global:metrics.Health.Overall)
- **Total Issues**: $($global:metrics.Issues.Total)
- **Active Agents**: $($global:metrics.Agents.ActiveAgents)
- **Issue Velocity**: $($global:metrics.Trends.IssueVelocity.RecentAverage) issues/day

## Detailed Metrics
$(($global:metrics | ConvertTo-Json -Depth 5))

## Recommendations
$(($global:metrics.Health.Recommendations -join "`n"))

## Alerts
$(($global:metrics.Alerts | ForEach-Object { "[$($_.Type)] $($_.Message)" }) -join "`n")
"@
    
    $reportContent | Out-File -FilePath $OutputFile -Encoding UTF8
    Write-Host "📄 Metrics report exported to: $OutputFile" -ForegroundColor Green
}

# Main execution
try {
    Initialize-MetricsSystem
    
    # Collect all metrics
    Collect-IssueMetrics
    Collect-AgentMetrics
    Collect-PerformanceMetrics
    Analyze-Trends
    Check-SystemHealth
    Generate-Alerts
    
    # Save metrics for historical tracking
    Save-Metrics
    
    # Display results based on operation
    switch ($Operation) {
        "overview" { Show-Overview }
        "performance" { 
            Write-Host "`n⚡ PERFORMANCE METRICS" -ForegroundColor Yellow
            $global:metrics.Performance | ConvertTo-Json -Depth 3 | Write-Host
        }
        "issues" {
            Write-Host "`n🎫 ISSUE METRICS" -ForegroundColor Yellow
            $global:metrics.Issues | ConvertTo-Json -Depth 3 | Write-Host
        }
        "agents" {
            Write-Host "`n🤖 AGENT METRICS" -ForegroundColor Yellow
            $global:metrics.Agents | ConvertTo-Json -Depth 3 | Write-Host
        }
        "trends" {
            Write-Host "`n📈 TREND ANALYSIS" -ForegroundColor Yellow
            $global:metrics.Trends | ConvertTo-Json -Depth 3 | Write-Host
        }
        "health" {
            Write-Host "`n🏥 SYSTEM HEALTH" -ForegroundColor Yellow
            $global:metrics.Health | ConvertTo-Json -Depth 3 | Write-Host
        }
        "alerts" {
            Write-Host "`n🚨 ACTIVE ALERTS" -ForegroundColor Yellow
            $global:metrics.Alerts | ConvertTo-Json -Depth 3 | Write-Host
        }
    }
    
    # Export if requested
    if ($ExportTo) {
        Export-MetricsReport -OutputFile $ExportTo
    }
    
    Write-Host "`n✅ Analytics and monitoring completed successfully" -ForegroundColor Green
    
} catch {
    Write-Error "An error occurred in analytics system: $($_.Exception.Message)"
    exit 1
}
