# Alert Management System for Portfolio OS Monitoring
# Usage: .\alert-manager.ps1 [-Action <ACTION>] [-Severity <LEVEL>] [-Channel <CHANNEL>]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("list", "create", "acknowledge", "resolve", "history")]
    [string]$Action = "list",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("info", "warning", "critical")]
    [string]$Severity = "info",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("console", "email", "slack", "webhook")]
    [string]$Channel = "console",
    
    [Parameter(Mandatory=$false)]
    [string]$Message,
    
    [Parameter(Mandatory=$false)]
    [string]$AlertId,
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoResolve
)

# Alert storage
$alertStoragePath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "data"
$alertsFile = Join-Path $alertStoragePath "alerts.json"

# Ensure data directory exists
if (-not (Test-Path $alertStoragePath)) {
    New-Item -ItemType Directory -Path $alertStoragePath -Force | Out-Null
}

# Load existing alerts
function Get-Alerts {
    if (Test-Path $alertsFile) {
        try {
            return Get-Content $alertsFile -Raw | ConvertFrom-Json
        }
        catch {
            Write-Warning "Could not load alerts file: $($_.Exception.Message)"
            return @()
        }
    }
    return @()
}

# Save alerts
function Save-Alerts {
    param([array]$Alerts)
    
    try {
        $Alerts | ConvertTo-Json -Depth 3 | Out-File -FilePath $alertsFile -Encoding UTF8
        return $true
    }
    catch {
        Write-Error "Could not save alerts: $($_.Exception.Message)"
        return $false
    }
}

# Create new alert
function New-Alert {
    param(
        [string]$Message,
        [string]$Severity = "info",
        [string]$Source = "system",
        [hashtable]$Metadata = @{}
    )
    
    $alert = @{
        Id = [System.Guid]::NewGuid().ToString()
        Message = $Message
        Severity = $Severity
        Source = $Source
        CreatedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Status = "active"
        Metadata = $Metadata
        AcknowledgedAt = $null
        ResolvedAt = $null
        AcknowledgedBy = $null
        ResolvedBy = $null
    }
    
    return $alert
}

# Send alert notification
function Send-AlertNotification {
    param(
        [hashtable]$Alert,
        [string]$Channel = "console"
    )
    
    $severityColors = @{
        "info" = "Cyan"
        "warning" = "Yellow"
        "critical" = "Red"
    }
    
    $color = $severityColors[$Alert.Severity]
    $icon = switch ($Alert.Severity) {
        "info" { "ℹ️" }
        "warning" { "⚠️" }
        "critical" { "🚨" }
    }
    
    $notification = "$icon [$($Alert.Severity.ToUpper())] $($Alert.Message)"
    
    switch ($Channel) {
        "console" {
            Write-Host $notification -ForegroundColor $color
        }
        "email" {
            # Email implementation would go here
            Write-Host "📧 Email alert: $notification" -ForegroundColor $color
        }
        "slack" {
            # Slack implementation would go here
            Write-Host "💬 Slack alert: $notification" -ForegroundColor $color
        }
        "webhook" {
            # Webhook implementation would go here
            Write-Host "🔗 Webhook alert: $notification" -ForegroundColor $color
        }
    }
}

# List alerts
function Show-Alerts {
    param(
        [string]$Filter = "all"
    )
    
    $alerts = Get-Alerts
    $filteredAlerts = switch ($Filter) {
        "active" { $alerts | Where-Object { $_.Status -eq "active" } }
        "resolved" { $alerts | Where-Object { $_.Status -eq "resolved" } }
        "critical" { $alerts | Where-Object { $_.Severity -eq "critical" } }
        default { $alerts }
    }
    
    if ($filteredAlerts.Count -eq 0) {
        Write-Host "No alerts found." -ForegroundColor Gray
        return
    }
    
    Write-Host "`n🚨 ALERT MANAGEMENT SYSTEM" -ForegroundColor Cyan
    Write-Host "=" * 50 -ForegroundColor Cyan
    
    foreach ($alert in $filteredAlerts) {
        $statusColor = if ($alert.Status -eq "active") { "Red" } else { "Green" }
        $severityColor = switch ($alert.Severity) {
            "info" { "Cyan" }
            "warning" { "Yellow" }
            "critical" { "Red" }
        }
        
        Write-Host "`nID: $($alert.Id)" -ForegroundColor Gray
        Write-Host "Severity: [$($alert.Severity.ToUpper())]" -ForegroundColor $severityColor
        Write-Host "Status: $($alert.Status)" -ForegroundColor $statusColor
        Write-Host "Message: $($alert.Message)" -ForegroundColor White
        Write-Host "Source: $($alert.Source)" -ForegroundColor Gray
        Write-Host "Created: $($alert.CreatedAt)" -ForegroundColor Gray
        
        if ($alert.AcknowledgedAt) {
            Write-Host "Acknowledged: $($alert.AcknowledgedAt) by $($alert.AcknowledgedBy)" -ForegroundColor Yellow
        }
        
        if ($alert.ResolvedAt) {
            Write-Host "Resolved: $($alert.ResolvedAt) by $($alert.ResolvedBy)" -ForegroundColor Green
        }
    }
}

# Acknowledge alert
function Set-AlertAcknowledged {
    param([string]$AlertId)
    
    $alerts = Get-Alerts
    $alert = $alerts | Where-Object { $_.Id -eq $AlertId }
    
    if (-not $alert) {
        Write-Error "Alert with ID $AlertId not found"
        return $false
    }
    
    if ($alert.Status -ne "active") {
        Write-Warning "Alert is not active and cannot be acknowledged"
        return $false
    }
    
    $alert.Status = "acknowledged"
    $alert.AcknowledgedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $alert.AcknowledgedBy = $env:USERNAME
    
    Save-Alerts -Alerts $alerts
    Write-Host "✅ Alert acknowledged: $($alert.Message)" -ForegroundColor Green
    return $true
}

# Resolve alert
function Set-AlertResolved {
    param([string]$AlertId)
    
    $alerts = Get-Alerts
    $alert = $alerts | Where-Object { $_.Id -eq $AlertId }
    
    if (-not $alert) {
        Write-Error "Alert with ID $AlertId not found"
        return $false
    }
    
    $alert.Status = "resolved"
    $alert.ResolvedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $alert.ResolvedBy = $env:USERNAME
    
    Save-Alerts -Alerts $alerts
    Write-Host "✅ Alert resolved: $($alert.Message)" -ForegroundColor Green
    return $true
}

# Auto-generate system alerts
function New-SystemAlerts {
    $alerts = Get-Alerts
    $newAlerts = @()
    
    # Check CPU usage
    try {
        $cpuUsage = (Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 1 -MaxSamples 1).CounterSamples.CookedValue
        if ($cpuUsage -gt 90) {
            $existingAlert = $alerts | Where-Object { 
                $_.Message -like "*CPU usage*" -and $_.Status -eq "active" 
            }
            if (-not $existingAlert) {
                $newAlerts += New-Alert -Message "High CPU usage: $([Math]::Round($cpuUsage, 1))%" -Severity "critical" -Source "system"
            }
        }
    }
    catch {
        # CPU check failed, create info alert
        $newAlerts += New-Alert -Message "Could not check CPU usage" -Severity "info" -Source "system"
    }
    
    # Check memory usage
    try {
        $memoryUsage = (Get-Process -Name "powershell" -ErrorAction SilentlyContinue | Measure-Object WorkingSet -Sum).Sum / 1MB
        if ($memoryUsage -gt 1000) {
            $existingAlert = $alerts | Where-Object { 
                $_.Message -like "*memory usage*" -and $_.Status -eq "active" 
            }
            if (-not $existingAlert) {
                $newAlerts += New-Alert -Message "High memory usage: $([Math]::Round($memoryUsage, 1)) MB" -Severity "warning" -Source "system"
            }
        }
    }
    catch {
        # Memory check failed
    }
    
    # Check disk space
    try {
        $diskSpace = (Get-WmiObject -Class Win32_LogicalDisk | Where-Object { $_.DeviceID -eq "C:" }).FreeSpace / 1GB
        if ($diskSpace -lt 5) {
            $existingAlert = $alerts | Where-Object { 
                $_.Message -like "*disk space*" -and $_.Status -eq "active" 
            }
            if (-not $existingAlert) {
                $newAlerts += New-Alert -Message "Low disk space: $([Math]::Round($diskSpace, 1)) GB free" -Severity "critical" -Source "system"
            }
        }
    }
    catch {
        # Disk check failed
    }
    
    # Check GitHub connectivity
    try {
        gh api user | Out-Null
    }
    catch {
        $existingAlert = $alerts | Where-Object { 
            $_.Message -like "*GitHub API*" -and $_.Status -eq "active" 
        }
        if (-not $existingAlert) {
            $newAlerts += New-Alert -Message "GitHub API connectivity issue" -Severity "critical" -Source "system"
        }
    }
    
    # Add new alerts to existing ones
    if ($newAlerts.Count -gt 0) {
        $alerts += $newAlerts
        Save-Alerts -Alerts $alerts
        
        # Send notifications for new alerts
        foreach ($alert in $newAlerts) {
            Send-AlertNotification -Alert $alert -Channel $Channel
        }
    }
    
    return $newAlerts
}

# Main execution
try {
    switch ($Action) {
        "list" {
            $filter = if ($Severity -ne "info") { $Severity } else { "all" }
            Show-Alerts -Filter $filter
        }
        "create" {
            if (-not $Message) {
                Write-Error "Message parameter is required for creating alerts"
                exit 1
            }
            
            $alerts = Get-Alerts
            $newAlert = New-Alert -Message $Message -Severity $Severity -Source "manual"
            $alerts += $newAlert
            Save-Alerts -Alerts $alerts
            Send-AlertNotification -Alert $newAlert -Channel $Channel
            Write-Host "✅ Alert created: $Message" -ForegroundColor Green
        }
        "acknowledge" {
            if (-not $AlertId) {
                Write-Error "AlertId parameter is required for acknowledging alerts"
                exit 1
            }
            Set-AlertAcknowledged -AlertId $AlertId
        }
        "resolve" {
            if (-not $AlertId) {
                Write-Error "AlertId parameter is required for resolving alerts"
                exit 1
            }
            Set-AlertResolved -AlertId $AlertId
        }
        "history" {
            $alerts = Get-Alerts | Sort-Object CreatedAt -Descending
            Write-Host "`n📊 ALERT HISTORY" -ForegroundColor Cyan
            Write-Host "=" * 30 -ForegroundColor Cyan
            
            foreach ($alert in $alerts) {
                $statusIcon = switch ($alert.Status) {
                    "active" { "🔴" }
                    "acknowledged" { "🟡" }
                    "resolved" { "🟢" }
                }
                
                Write-Host "$statusIcon $($alert.CreatedAt) [$($alert.Severity.ToUpper())] $($alert.Message)" -ForegroundColor White
            }
        }
        default {
            # Auto-generate system alerts
            $newAlerts = New-SystemAlerts
            if ($newAlerts.Count -eq 0) {
                Write-Host "✅ No new alerts generated" -ForegroundColor Green
            } else {
                Write-Host "🚨 Generated $($newAlerts.Count) new alerts" -ForegroundColor Yellow
            }
        }
    }
}
catch {
    Write-Error "Alert management error: $($_.Exception.Message)"
    exit 1
}
