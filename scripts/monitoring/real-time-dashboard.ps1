# Real-Time Monitoring Dashboard for Portfolio OS
# Usage: .\real-time-dashboard.ps1 [-RefreshInterval <SECONDS>] [-MaxRuntime <MINUTES>]

param(
    [Parameter(Mandatory=$false)]
    [int]$RefreshInterval = 30,
    
    [Parameter(Mandatory=$false)]
    [int]$MaxRuntime = 60,
    
    [Parameter(Mandatory=$false)]
    [switch]$ShowAlerts,
    
    [Parameter(Mandatory=$false)]
    [switch]$ShowPerformance
)

# Import the main monitoring script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$metricsScript = Join-Path $scriptPath "automation-metrics.ps1"

function Clear-Console {
    Clear-Host
}

function Show-Header {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "🔄 PORTFOLIO OS REAL-TIME DASHBOARD" -ForegroundColor Cyan
    Write-Host "Last Updated: $timestamp" -ForegroundColor Gray
    Write-Host "Refresh Interval: $RefreshInterval seconds" -ForegroundColor Gray
    Write-Host "Runtime Limit: $MaxRuntime minutes" -ForegroundColor Gray
    Write-Host "=" * 50 -ForegroundColor Cyan
}

function Show-QuickStats {
    try {
        # Get basic GitHub stats
        $openIssues = (gh issue list --state open --json number | ConvertFrom-Json).Count
        $closedIssues = (gh issue list --state closed --limit 100 --json number | ConvertFrom-Json).Count
        
        # Get system stats
        $cpuUsage = [Math]::Round((Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 1 -MaxSamples 1).CounterSamples.CookedValue, 1)
        $memoryUsage = [Math]::Round((Get-Process -Name "powershell" -ErrorAction SilentlyContinue | Measure-Object WorkingSet -Sum).Sum / 1MB, 1)
        
        Write-Host "`n📊 QUICK STATS" -ForegroundColor Yellow
        Write-Host "Open Issues: $openIssues" -ForegroundColor $(if ($openIssues -gt 10) { "Red" } else { "Green" })
        Write-Host "Closed Issues: $closedIssues" -ForegroundColor Green
        Write-Host "CPU Usage: $cpuUsage%" -ForegroundColor $(if ($cpuUsage -gt 80) { "Red" } elseif ($cpuUsage -gt 60) { "Yellow" } else { "Green" })
        Write-Host "Memory Usage: $memoryUsage MB" -ForegroundColor $(if ($memoryUsage -gt 1000) { "Red" } elseif ($memoryUsage -gt 500) { "Yellow" } else { "Green" })
    }
    catch {
        Write-Host "⚠️  Could not fetch quick stats: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

function Show-RecentActivity {
    try {
        Write-Host "`n🕐 RECENT ACTIVITY" -ForegroundColor Yellow
        
        # Get recent commits
        $recentCommits = git log --oneline --since="1 hour ago" --max-count=5
        if ($recentCommits) {
            Write-Host "Recent Commits (Last Hour):" -ForegroundColor Gray
            $recentCommits | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
        } else {
            Write-Host "No commits in the last hour" -ForegroundColor Gray
        }
        
        # Get recent issues
        $recentIssues = gh issue list --state open --limit 3 --json number,title,updatedAt | ConvertFrom-Json
        if ($recentIssues) {
            Write-Host "`nRecent Issues:" -ForegroundColor Gray
            $recentIssues | ForEach-Object { 
                $updated = [DateTime]::Parse($_.updatedAt).ToString("HH:mm")
                Write-Host "  #$($_.number): $($_.title.Substring(0, [Math]::Min(50, $_.title.Length)))..." -ForegroundColor White
                Write-Host "    Updated: $updated" -ForegroundColor Gray
            }
        }
    }
    catch {
        Write-Host "⚠️  Could not fetch recent activity: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

function Show-SystemHealth {
    Write-Host "`n🏥 SYSTEM HEALTH" -ForegroundColor Yellow
    
    $healthChecks = @()
    
    # Check GitHub connectivity
    try {
        gh api user | Out-Null
        $healthChecks += @{ Name = "GitHub API"; Status = "✅ Healthy"; Color = "Green" }
    }
    catch {
        $healthChecks += @{ Name = "GitHub API"; Status = "❌ Unhealthy"; Color = "Red" }
    }
    
    # Check git status
    try {
        git status | Out-Null
        $healthChecks += @{ Name = "Git Repository"; Status = "✅ Healthy"; Color = "Green" }
    }
    catch {
        $healthChecks += @{ Name = "Git Repository"; Status = "❌ Unhealthy"; Color = "Red" }
    }
    
    # Check disk space
    $diskSpace = (Get-WmiObject -Class Win32_LogicalDisk | Where-Object { $_.DeviceID -eq "C:" }).FreeSpace / 1GB
    if ($diskSpace -gt 10) {
        $healthChecks += @{ Name = "Disk Space"; Status = "✅ $([Math]::Round($diskSpace, 1)) GB Free"; Color = "Green" }
    } elseif ($diskSpace -gt 5) {
        $healthChecks += @{ Name = "Disk Space"; Status = "⚠️  $([Math]::Round($diskSpace, 1)) GB Free"; Color = "Yellow" }
    } else {
        $healthChecks += @{ Name = "Disk Space"; Status = "❌ $([Math]::Round($diskSpace, 1)) GB Free"; Color = "Red" }
    }
    
    foreach ($check in $healthChecks) {
        Write-Host "  $($check.Name): $($check.Status)" -ForegroundColor $check.Color
    }
}

function Show-Alerts {
    if (-not $ShowAlerts) { return }
    
    Write-Host "`n🚨 ACTIVE ALERTS" -ForegroundColor Red
    
    $alerts = @()
    
    # Check for high CPU usage
    $cpuUsage = (Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 1 -MaxSamples 1).CounterSamples.CookedValue
    if ($cpuUsage -gt 90) {
        $alerts += "High CPU usage: $([Math]::Round($cpuUsage, 1))%"
    }
    
    # Check for high memory usage
    $memoryUsage = (Get-Process -Name "powershell" -ErrorAction SilentlyContinue | Measure-Object WorkingSet -Sum).Sum / 1MB
    if ($memoryUsage -gt 1000) {
        $alerts += "High memory usage: $([Math]::Round($memoryUsage, 1)) MB"
    }
    
    # Check for too many open issues
    try {
        $openIssues = (gh issue list --state open --json number | ConvertFrom-Json).Count
        if ($openIssues -gt 20) {
            $alerts += "High number of open issues: $openIssues"
        }
    }
    catch {
        $alerts += "Could not check issue count"
    }
    
    if ($alerts.Count -eq 0) {
        Write-Host "  No active alerts" -ForegroundColor Green
    } else {
        foreach ($alert in $alerts) {
            Write-Host "  ⚠️  $alert" -ForegroundColor Red
        }
    }
}

function Show-Performance {
    if (-not $ShowPerformance) { return }
    
    Write-Host "`n⚡ PERFORMANCE METRICS" -ForegroundColor Yellow
    
    try {
        # CPU usage
        $cpuUsage = (Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 1 -MaxSamples 1).CounterSamples.CookedValue
        Write-Host "  CPU Usage: $([Math]::Round($cpuUsage, 1))%" -ForegroundColor White
        
        # Memory usage
        $memoryUsage = (Get-Process -Name "powershell" -ErrorAction SilentlyContinue | Measure-Object WorkingSet -Sum).Sum / 1MB
        Write-Host "  Memory Usage: $([Math]::Round($memoryUsage, 1)) MB" -ForegroundColor White
        
        # Disk I/O
        $diskRead = (Get-Counter '\PhysicalDisk(_Total)\Disk Read Bytes/sec' -SampleInterval 1 -MaxSamples 1).CounterSamples.CookedValue
        $diskWrite = (Get-Counter '\PhysicalDisk(_Total)\Disk Write Bytes/sec' -SampleInterval 1 -MaxSamples 1).CounterSamples.CookedValue
        Write-Host "  Disk Read: $([Math]::Round($diskRead / 1KB, 1)) KB/s" -ForegroundColor White
        Write-Host "  Disk Write: $([Math]::Round($diskWrite / 1KB, 1)) KB/s" -ForegroundColor White
    }
    catch {
        Write-Host "  ⚠️  Could not fetch performance metrics" -ForegroundColor Yellow
    }
}

function Show-Footer {
    Write-Host "`n" + "=" * 50 -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to exit" -ForegroundColor Gray
    Write-Host "Next refresh in $RefreshInterval seconds..." -ForegroundColor Gray
}

# Main dashboard loop
try {
    $startTime = Get-Date
    $endTime = $startTime.AddMinutes($MaxRuntime)
    
    while ((Get-Date) -lt $endTime) {
        Clear-Console
        Show-Header
        Show-QuickStats
        Show-RecentActivity
        Show-SystemHealth
        Show-Alerts
        Show-Performance
        Show-Footer
        
        Start-Sleep -Seconds $RefreshInterval
    }
    
    Write-Host "`n⏰ Dashboard runtime limit reached. Exiting..." -ForegroundColor Yellow
}
catch {
    Write-Host "`n❌ Dashboard error: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Write-Host "`n👋 Real-time dashboard stopped." -ForegroundColor Cyan
}
