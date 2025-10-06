# Performance Analysis System for Portfolio OS
# Usage: .\performance-analyzer.ps1 [-Analysis <TYPE>] [-Duration <MINUTES>] [-ExportTo <FILE>]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("system", "scripts", "api", "git", "comprehensive")]
    [string]$Analysis = "system",
    
    [Parameter(Mandatory=$false)]
    [int]$Duration = 5,
    
    [Parameter(Mandatory=$false)]
    [string]$ExportTo,
    
    [Parameter(Mandatory=$false)]
    [switch]$RealTime,
    
    [Parameter(Mandatory=$false)]
    [switch]$Detailed
)

# Performance data storage
$performanceDataPath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "data"
$performanceFile = Join-Path $performanceDataPath "performance-data.json"

# Ensure data directory exists
if (-not (Test-Path $performanceDataPath)) {
    New-Item -ItemType Directory -Path $performanceDataPath -Force | Out-Null
}

# Global performance counters
$global:performanceCounters = @{
    CPU = @()
    Memory = @()
    Disk = @()
    Network = @()
    Scripts = @()
    API = @()
    Git = @()
}

function Get-SystemPerformance {
    Write-Host "🖥️  Collecting System Performance Data..." -ForegroundColor Yellow
    
    $systemData = @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        CPU = @{}
        Memory = @{}
        Disk = @{}
        Network = @{}
        Processes = @()
    }
    
    try {
        # CPU Performance
        $cpuCounters = Get-Counter -Counter "\Processor(_Total)\% Processor Time", "\Processor(_Total)\% User Time", "\Processor(_Total)\% Privileged Time" -SampleInterval 1 -MaxSamples 1
        $systemData.CPU = @{
            TotalUsage = [Math]::Round($cpuCounters.CounterSamples[0].CookedValue, 2)
            UserTime = [Math]::Round($cpuCounters.CounterSamples[1].CookedValue, 2)
            PrivilegedTime = [Math]::Round($cpuCounters.CounterSamples[2].CookedValue, 2)
            CoreCount = (Get-WmiObject -Class Win32_Processor).NumberOfCores
        }
        
        # Memory Performance
        $memoryInfo = Get-WmiObject -Class Win32_OperatingSystem
        $systemData.Memory = @{
            TotalGB = [Math]::Round($memoryInfo.TotalVisibleMemorySize / 1MB, 2)
            FreeGB = [Math]::Round($memoryInfo.FreePhysicalMemory / 1MB, 2)
            UsedGB = [Math]::Round(($memoryInfo.TotalVisibleMemorySize - $memoryInfo.FreePhysicalMemory) / 1MB, 2)
            UsagePercent = [Math]::Round((($memoryInfo.TotalVisibleMemorySize - $memoryInfo.FreePhysicalMemory) / $memoryInfo.TotalVisibleMemorySize) * 100, 2)
        }
        
        # Disk Performance
        $diskCounters = Get-Counter -Counter "\PhysicalDisk(_Total)\Disk Read Bytes/sec", "\PhysicalDisk(_Total)\Disk Write Bytes/sec", "\PhysicalDisk(_Total)\% Disk Time" -SampleInterval 1 -MaxSamples 1
        $diskInfo = Get-WmiObject -Class Win32_LogicalDisk | Where-Object { $_.DeviceID -eq "C:" }
        
        $systemData.Disk = @{
            ReadMBps = [Math]::Round($diskCounters.CounterSamples[0].CookedValue / 1MB, 2)
            WriteMBps = [Math]::Round($diskCounters.CounterSamples[1].CookedValue / 1MB, 2)
            DiskTimePercent = [Math]::Round($diskCounters.CounterSamples[2].CookedValue, 2)
            TotalGB = [Math]::Round($diskInfo.Size / 1GB, 2)
            FreeGB = [Math]::Round($diskInfo.FreeSpace / 1GB, 2)
            UsedGB = [Math]::Round(($diskInfo.Size - $diskInfo.FreeSpace) / 1GB, 2)
        }
        
        # Network Performance (if available)
        try {
            $networkCounters = Get-Counter -Counter "\Network Interface(*)\Bytes Received/sec", "\Network Interface(*)\Bytes Sent/sec" -SampleInterval 1 -MaxSamples 1
            $systemData.Network = @{
                ReceivedMBps = [Math]::Round(($networkCounters.CounterSamples | Where-Object { $_.InstanceName -ne "_Total" } | Measure-Object CookedValue -Sum).Sum / 1MB, 2)
                SentMBps = [Math]::Round(($networkCounters.CounterSamples | Where-Object { $_.InstanceName -ne "_Total" } | Measure-Object CookedValue -Sum).Sum / 1MB, 2)
            }
        }
        catch {
            $systemData.Network = @{ ReceivedMBps = 0; SentMBps = 0 }
        }
        
        # Top processes by CPU usage
        $topProcesses = Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 Name, CPU, WorkingSet, Id
        $systemData.Processes = $topProcesses | ForEach-Object {
            @{
                Name = $_.Name
                CPU = $_.CPU
                MemoryMB = [Math]::Round($_.WorkingSet / 1MB, 2)
                ProcessId = $_.Id
            }
        }
        
        Write-Host "✅ System performance data collected" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to collect system performance: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    return $systemData
}

function Get-ScriptPerformance {
    Write-Host "📜 Analyzing Script Performance..." -ForegroundColor Yellow
    
    $scriptData = @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Scripts = @()
        ExecutionTimes = @()
        ErrorRates = @{}
    }
    
    try {
        # Analyze PowerShell scripts in the project
        $scriptPath = Join-Path (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)) "scripts"
        $scripts = Get-ChildItem -Path $scriptPath -Filter "*.ps1" -Recurse
        
        foreach ($script in $scripts) {
            $scriptInfo = @{
                Name = $script.Name
                Path = $script.FullName
                SizeKB = [Math]::Round($script.Length / 1KB, 2)
                LastModified = $script.LastWriteTime
                LineCount = (Get-Content $script.FullName).Count
            }
            
            # Check for performance-related patterns
            $content = Get-Content $script.FullName -Raw
            $scriptInfo.HasPerformanceOptimization = $content -match "Measure-Command|Start-Job|Parallel|Async"
            $scriptInfo.HasErrorHandling = $content -match "try\s*\{|catch\s*\{|finally\s*\{"
            $scriptInfo.HasLogging = $content -match "Write-Host|Write-Log|Log-"
            
            $scriptData.Scripts += $scriptInfo
        }
        
        # Analyze execution logs if available
        $logPath = Join-Path (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)) "logs"
        if (Test-Path $logPath) {
            $logFiles = Get-ChildItem -Path $logPath -Filter "*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 10
            
            foreach ($logFile in $logFiles) {
                $content = Get-Content $logFile.FullName
                $executionTimes = $content | Where-Object { $_ -match "Execution time: (\d+\.?\d*)" } | ForEach-Object {
                    if ($_ -match "Execution time: (\d+\.?\d*)") {
                        [double]$matches[1]
                    }
                }
                
                $errors = ($content | Where-Object { $_ -match "ERROR|FAILED|Exception" }).Count
                $total = $content.Count
                $errorRate = if ($total -gt 0) { [Math]::Round(($errors / $total) * 100, 2) } else { 0 }
                
                $scriptData.ExecutionTimes += $executionTimes
                $scriptData.ErrorRates[$logFile.Name] = $errorRate
            }
        }
        
        Write-Host "✅ Script performance analysis completed" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to analyze script performance: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    return $scriptData
}

function Get-APIPerformance {
    Write-Host "🌐 Testing API Performance..." -ForegroundColor Yellow
    
    $apiData = @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        GitHubAPI = @{}
        ResponseTimes = @()
        SuccessRates = @{}
    }
    
    try {
        # Test GitHub API performance
        $endpoints = @("user", "rate_limit", "repos", "issues")
        
        foreach ($endpoint in $endpoints) {
            $startTime = Get-Date
            try {
                $response = gh api $endpoint --silent
                $endTime = Get-Date
                $responseTime = ($endTime - $startTime).TotalMilliseconds
                
                $apiData.GitHubAPI[$endpoint] = @{
                    ResponseTimeMs = [Math]::Round($responseTime, 2)
                    Success = $true
                    StatusCode = 200
                }
                
                $apiData.ResponseTimes += $responseTime
            }
            catch {
                $endTime = Get-Date
                $responseTime = ($endTime - $startTime).TotalMilliseconds
                
                $apiData.GitHubAPI[$endpoint] = @{
                    ResponseTimeMs = [Math]::Round($responseTime, 2)
                    Success = $false
                    Error = $_.Exception.Message
                    StatusCode = 500
                }
            }
        }
        
        # Calculate success rates
        $totalTests = $endpoints.Count
        $successfulTests = ($apiData.GitHubAPI.Values | Where-Object { $_.Success }).Count
        $apiData.SuccessRates.GitHubAPI = [Math]::Round(($successfulTests / $totalTests) * 100, 2)
        
        # Calculate average response time
        if ($apiData.ResponseTimes.Count -gt 0) {
            $apiData.AverageResponseTime = [Math]::Round(($apiData.ResponseTimes | Measure-Object -Average).Average, 2)
        }
        
        Write-Host "✅ API performance analysis completed" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to test API performance: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    return $apiData
}

function Get-GitPerformance {
    Write-Host "📚 Analyzing Git Performance..." -ForegroundColor Yellow
    
    $gitData = @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Operations = @{}
        Repository = @{}
        Branches = @{}
    }
    
    try {
        # Test common git operations
        $operations = @{
            "status" = { git status --porcelain }
            "log" = { git log --oneline --max-count=10 }
            "branch" = { git branch -a }
            "remote" = { git remote -v }
        }
        
        foreach ($operation in $operations.GetEnumerator()) {
            $startTime = Get-Date
            try {
                $output = & $operation.Value
                $endTime = Get-Date
                $executionTime = ($endTime - $startTime).TotalMilliseconds
                
                $gitData.Operations[$operation.Key] = @{
                    ExecutionTimeMs = [Math]::Round($executionTime, 2)
                    Success = $true
                    OutputLines = $output.Count
                }
            }
            catch {
                $endTime = Get-Date
                $executionTime = ($endTime - $startTime).TotalMilliseconds
                
                $gitData.Operations[$operation.Key] = @{
                    ExecutionTimeMs = [Math]::Round($executionTime, 2)
                    Success = $false
                    Error = $_.Exception.Message
                }
            }
        }
        
        # Repository information
        $gitData.Repository = @{
            BranchCount = (git branch -a).Count
            RemoteCount = (git remote).Count
            CommitCount = (git rev-list --count HEAD)
            LastCommit = git log -1 --format="%H %s"
        }
        
        Write-Host "✅ Git performance analysis completed" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to analyze Git performance: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    return $gitData
}

function Show-PerformanceReport {
    param([hashtable]$PerformanceData)
    
    Write-Host "`n📊 PERFORMANCE ANALYSIS REPORT" -ForegroundColor Cyan
    Write-Host "=" * 50 -ForegroundColor Cyan
    Write-Host "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
    
    # System Performance
    if ($PerformanceData.System) {
        Write-Host "`n🖥️  SYSTEM PERFORMANCE" -ForegroundColor Yellow
        $sys = $PerformanceData.System
        Write-Host "CPU Usage: $($sys.CPU.TotalUsage)%" -ForegroundColor $(if ($sys.CPU.TotalUsage -gt 80) { "Red" } elseif ($sys.CPU.TotalUsage -gt 60) { "Yellow" } else { "Green" })
        Write-Host "Memory Usage: $($sys.Memory.UsedGB)GB / $($sys.Memory.TotalGB)GB ($($sys.Memory.UsagePercent)%)" -ForegroundColor $(if ($sys.Memory.UsagePercent -gt 80) { "Red" } elseif ($sys.Memory.UsagePercent -gt 60) { "Yellow" } else { "Green" })
        Write-Host "Disk Usage: $($sys.Disk.UsedGB)GB / $($sys.Disk.TotalGB)GB" -ForegroundColor White
        Write-Host "Disk I/O: Read $($sys.Disk.ReadMBps)MB/s, Write $($sys.Disk.WriteMBps)MB/s" -ForegroundColor White
        
        if ($sys.Processes.Count -gt 0) {
            Write-Host "`nTop Processes:" -ForegroundColor Gray
            $sys.Processes | ForEach-Object { Write-Host "  $($_.Name): $($_.CPU)s CPU, $($_.MemoryMB)MB RAM" -ForegroundColor White }
        }
    }
    
    # API Performance
    if ($PerformanceData.API) {
        Write-Host "`n🌐 API PERFORMANCE" -ForegroundColor Yellow
        $api = $PerformanceData.API
        Write-Host "Average Response Time: $($api.AverageResponseTime)ms" -ForegroundColor White
        Write-Host "Success Rate: $($api.SuccessRates.GitHubAPI)%" -ForegroundColor $(if ($api.SuccessRates.GitHubAPI -gt 95) { "Green" } elseif ($api.SuccessRates.GitHubAPI -gt 90) { "Yellow" } else { "Red" })
        
        Write-Host "`nEndpoint Performance:" -ForegroundColor Gray
        foreach ($endpoint in $api.GitHubAPI.GetEnumerator()) {
            $status = if ($endpoint.Value.Success) { "✅" } else { "❌" }
            Write-Host "  $status $($endpoint.Key): $($endpoint.Value.ResponseTimeMs)ms" -ForegroundColor White
        }
    }
    
    # Git Performance
    if ($PerformanceData.Git) {
        Write-Host "`n📚 GIT PERFORMANCE" -ForegroundColor Yellow
        $git = $PerformanceData.Git
        Write-Host "Repository Info:" -ForegroundColor Gray
        Write-Host "  Branches: $($git.Repository.BranchCount)" -ForegroundColor White
        Write-Host "  Remotes: $($git.Repository.RemoteCount)" -ForegroundColor White
        Write-Host "  Commits: $($git.Repository.CommitCount)" -ForegroundColor White
        
        Write-Host "`nOperation Performance:" -ForegroundColor Gray
        foreach ($operation in $git.Operations.GetEnumerator()) {
            $status = if ($operation.Value.Success) { "✅" } else { "❌" }
            Write-Host "  $status $($operation.Key): $($operation.Value.ExecutionTimeMs)ms" -ForegroundColor White
        }
    }
    
    # Script Performance
    if ($PerformanceData.Scripts) {
        Write-Host "`n📜 SCRIPT PERFORMANCE" -ForegroundColor Yellow
        $scripts = $PerformanceData.Scripts
        Write-Host "Total Scripts: $($scripts.Scripts.Count)" -ForegroundColor White
        Write-Host "Total Lines of Code: $(($scripts.Scripts | Measure-Object LineCount -Sum).Sum)" -ForegroundColor White
        
        if ($scripts.ErrorRates.Count -gt 0) {
            Write-Host "`nError Rates:" -ForegroundColor Gray
            foreach ($log in $scripts.ErrorRates.GetEnumerator()) {
                $color = if ($log.Value -lt 5) { "Green" } elseif ($log.Value -lt 10) { "Yellow" } else { "Red" }
                Write-Host "  $($log.Key): $($log.Value)%" -ForegroundColor $color
            }
        }
    }
}

function Export-PerformanceData {
    param(
        [hashtable]$PerformanceData,
        [string]$OutputFile
    )
    
    $report = @{
        ReportType = "Performance Analysis"
        GeneratedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Data = $PerformanceData
        Summary = @{
            SystemHealth = if ($PerformanceData.System.CPU.TotalUsage -lt 80 -and $PerformanceData.System.Memory.UsagePercent -lt 80) { "Good" } else { "Needs Attention" }
            APIPerformance = if ($PerformanceData.API.SuccessRates.GitHubAPI -gt 95) { "Excellent" } elseif ($PerformanceData.API.SuccessRates.GitHubAPI -gt 90) { "Good" } else { "Poor" }
            GitPerformance = if (($PerformanceData.Git.Operations.Values | Where-Object { $_.Success }).Count -eq $PerformanceData.Git.Operations.Count) { "Excellent" } else { "Issues Detected" }
        }
    }
    
    try {
        $report | ConvertTo-Json -Depth 5 | Out-File -FilePath $OutputFile -Encoding UTF8
        Write-Host "📄 Performance report exported to: $OutputFile" -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to export performance data: $($_.Exception.Message)"
    }
}

# Main execution
try {
    $performanceData = @{}
    
    switch ($Analysis) {
        "system" {
            $performanceData.System = Get-SystemPerformance
        }
        "scripts" {
            $performanceData.Scripts = Get-ScriptPerformance
        }
        "api" {
            $performanceData.API = Get-APIPerformance
        }
        "git" {
            $performanceData.Git = Get-GitPerformance
        }
        "comprehensive" {
            $performanceData.System = Get-SystemPerformance
            $performanceData.Scripts = Get-ScriptPerformance
            $performanceData.API = Get-APIPerformance
            $performanceData.Git = Get-GitPerformance
        }
    }
    
    # Save performance data
    $existingData = if (Test-Path $performanceFile) { Get-Content $performanceFile -Raw | ConvertFrom-Json } else { @() }
    $existingData += $performanceData
    $existingData | ConvertTo-Json -Depth 5 | Out-File -FilePath $performanceFile -Encoding UTF8
    
    # Display report
    Show-PerformanceReport -PerformanceData $performanceData
    
    # Export if requested
    if ($ExportTo) {
        Export-PerformanceData -PerformanceData $performanceData -OutputFile $ExportTo
    }
    
    Write-Host "`n✅ Performance analysis completed successfully" -ForegroundColor Green
}
catch {
    Write-Error "Performance analysis error: $($_.Exception.Message)"
    exit 1
}
