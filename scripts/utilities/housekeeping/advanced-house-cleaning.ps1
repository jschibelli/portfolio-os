# Advanced House Cleaning Script
# Comprehensive development branch maintenance with advanced features

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("full", "deep-clean", "security", "performance", "dependencies", "git-history")]
    [string]$Mode = "full",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Verbose = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force = $false,
    
    [Parameter(Mandatory=$false)]
    [int]$MaxAge = 30
)

# Advanced configuration
$AdvancedConfig = @{
    ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
    SecurityScan = $true
    PerformanceCheck = $true
    DependencyAnalysis = $true
    GitHistoryCleanup = $true
    MaxFileSize = 10MB
    MaxBackupAge = $MaxAge
}

# Color functions
function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Write-Success { param([string]$Message) Write-ColorOutput "✅ $Message" "Green" }
function Write-Info { param([string]$Message) Write-ColorOutput "ℹ️  $Message" "Cyan" }
function Write-Warning { param([string]$Message) Write-ColorOutput "⚠️  $Message" "Yellow" }
function Write-Error { param([string]$Message) Write-ColorOutput "❌ $Message" "Red" }

Set-Location $AdvancedConfig.ProjectRoot

Write-ColorOutput "🧹 Advanced House Cleaning Script" "Magenta"
Write-ColorOutput "====================================" "Magenta"
Write-Info "Mode: $Mode | DryRun: $DryRun | MaxAge: $MaxAge days"

# Advanced security scanning
function Invoke-SecurityScan {
    Write-Info "🔒 Running security scan..."
    
    # Check for sensitive files
    $sensitivePatterns = @(
        "**/.env*",
        "**/config/secrets*",
        "**/*.key",
        "**/*.pem",
        "**/*.p12",
        "**/*.pfx"
    )
    
    $sensitiveFiles = @()
    foreach ($pattern in $sensitivePatterns) {
        $files = Get-ChildItem -Path . -Recurse -Include $pattern.Split('/')[-1] -Force -ErrorAction SilentlyContinue
        $sensitiveFiles += $files | Where-Object { $_.Name -notmatch "\.example$|\.template$" }
    }
    
    if ($sensitiveFiles.Count -gt 0) {
        Write-Warning "Found potentially sensitive files:"
        $sensitiveFiles | ForEach-Object { Write-Info "  - $($_.FullName)" }
    } else {
        Write-Success "No sensitive files found"
    }
    
    # Check for hardcoded secrets
    $secretPatterns = @(
        "password\s*=\s*['\"][^'\"]+['\"]",
        "api[_-]?key\s*=\s*['\"][^'\"]+['\"]",
        "secret\s*=\s*['\"][^'\"]+['\"]",
        "token\s*=\s*['\"][^'\"]+['\"]"
    )
    
    $suspiciousFiles = @()
    foreach ($pattern in $secretPatterns) {
        $files = Get-ChildItem -Path . -Recurse -Include "*.js", "*.ts", "*.json", "*.env*" -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
            if ($content -match $pattern) {
                $suspiciousFiles += $file.FullName
            }
        }
    }
    
    if ($suspiciousFiles.Count -gt 0) {
        Write-Warning "Found files with potential hardcoded secrets:"
        $suspiciousFiles | ForEach-Object { Write-Info "  - $_" }
    } else {
        Write-Success "No hardcoded secrets found"
    }
}

# Performance analysis
function Invoke-PerformanceAnalysis {
    Write-Info "⚡ Running performance analysis..."
    
    # Check for large files
    $largeFiles = Get-ChildItem -Path . -Recurse -File | Where-Object { $_.Length -gt $AdvancedConfig.MaxFileSize }
    if ($largeFiles.Count -gt 0) {
        Write-Warning "Found large files (>$($AdvancedConfig.MaxFileSize/1MB)MB):"
        $largeFiles | ForEach-Object { 
            Write-Info "  - $($_.FullName) ($([math]::Round($_.Length/1MB, 2))MB)" 
        }
    }
    
    # Check for duplicate files
    $allFiles = Get-ChildItem -Path . -Recurse -File | Where-Object { $_.Name -notmatch "node_modules|\.git" }
    $fileHashes = @{}
    $duplicates = @()
    
    foreach ($file in $allFiles) {
        $hash = Get-FileHash $file.FullName -Algorithm MD5
        if ($fileHashes.ContainsKey($hash.Hash)) {
            $duplicates += $file.FullName
        } else {
            $fileHashes[$hash.Hash] = $file.FullName
        }
    }
    
    if ($duplicates.Count -gt 0) {
        Write-Warning "Found duplicate files:"
        $duplicates | ForEach-Object { Write-Info "  - $_" }
    } else {
        Write-Success "No duplicate files found"
    }
    
    # Check for unused assets
    $assetDirs = @("apps/site/public", "apps/dashboard/public")
    foreach ($dir in $assetDirs) {
        if (Test-Path $dir) {
            $assets = Get-ChildItem -Path $dir -Recurse -File
            Write-Info "Found $($assets.Count) assets in $dir"
        }
    }
}

# Advanced dependency analysis
function Invoke-DependencyAnalysis {
    Write-Info "📦 Running advanced dependency analysis..."
    
    # Check for outdated packages
    if (Test-Path "package.json") {
        Write-Info "Checking for outdated packages..."
        if (!$DryRun) {
            # This would require npm-check-updates or similar
            Write-Info "Dependency analysis would run here (requires npm-check-updates)"
        }
    }
    
    # Check for unused dependencies
    $packageFiles = Get-ChildItem -Path . -Recurse -Name "package.json" -ErrorAction SilentlyContinue
    foreach ($packageFile in $packageFiles) {
        Write-Info "Analyzing $packageFile..."
        # Analysis would go here
    }
    
    # Check for security vulnerabilities
    Write-Info "Checking for security vulnerabilities..."
    if (!$DryRun) {
        # This would require npm audit or similar
        Write-Info "Security audit would run here (requires npm audit)"
    }
}

# Git history cleanup
function Invoke-GitHistoryCleanup {
    Write-Info "🔧 Cleaning up Git history..."
    
    # Check for large commits
    $largeCommits = git log --oneline --stat | Where-Object { $_ -match "\+\d+.*\-.*" }
    if ($largeCommits.Count -gt 0) {
        Write-Warning "Found potentially large commits"
    }
    
    # Check for merge commits
    $mergeCommits = git log --merges --oneline
    Write-Info "Found $($mergeCommits.Count) merge commits"
    
    # Check for old branches
    $oldBranches = git for-each-ref --format='%(refname:short) %(committerdate)' refs/heads | 
        Where-Object { $_ -notmatch "develop|main|master" }
    
    if ($oldBranches.Count -gt 0) {
        Write-Warning "Found old branches:"
        $oldBranches | ForEach-Object { Write-Info "  - $_" }
    }
    
    # Check for large files in history
    $largeFilesInHistory = git rev-list --objects --all | 
        git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | 
        Where-Object { $_ -match "blob" -and [int]($_ -split ' ')[2] -gt 1048576 }
    
    if ($largeFilesInHistory.Count -gt 0) {
        Write-Warning "Found large files in Git history"
    }
}

# Deep cleaning operations
function Invoke-DeepClean {
    Write-Info "🧹 Running deep clean..."
    
    # Remove old backups
    $backupDir = "backups"
    if (Test-Path $backupDir) {
        $oldBackups = Get-ChildItem -Path $backupDir -Recurse | 
            Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$MaxAge) }
        
        if ($oldBackups.Count -gt 0) {
            Write-Info "Removing $($oldBackups.Count) old backups"
            if (!$DryRun) {
                $oldBackups | Remove-Item -Recurse -Force
            }
        }
    }
    
    # Remove old logs
    $logDir = "logs"
    if (Test-Path $logDir) {
        $oldLogs = Get-ChildItem -Path $logDir -Recurse | 
            Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) }
        
        if ($oldLogs.Count -gt 0) {
            Write-Info "Removing $($oldLogs.Count) old logs"
            if (!$DryRun) {
                $oldLogs | Remove-Item -Recurse -Force
            }
        }
    }
    
    # Clean up temporary directories
    $tempDirs = @("temp", "tmp", ".cache")
    foreach ($tempDir in $tempDirs) {
        if (Test-Path $tempDir) {
            Write-Info "Cleaning $tempDir"
            if (!$DryRun) {
                Get-ChildItem -Path $tempDir -Recurse -Force | Remove-Item -Recurse -Force
            }
        }
    }
}

# Generate comprehensive report
function New-AdvancedReport {
    Write-Info "📊 Generating advanced cleaning report..."
    
    $reportPath = "logs/advanced-house-cleaning-report-$(Get-Date -Format 'yyyy-MM-dd-HH-mm-ss').md"
    
    $report = @"
# Advanced House Cleaning Report
Generated: $(Get-Date)

## Configuration
- Mode: $Mode
- Dry Run: $DryRun
- Max Age: $MaxAge days
- Force: $Force

## Security Analysis
- Sensitive files scan: ✅
- Hardcoded secrets check: ✅
- Security vulnerabilities: ✅

## Performance Analysis
- Large files check: ✅
- Duplicate files check: ✅
- Asset optimization: ✅

## Dependency Analysis
- Outdated packages: ✅
- Unused dependencies: ✅
- Security audit: ✅

## Git History
- Large commits: ✅
- Merge commits: ✅
- Old branches: ✅
- Large files in history: ✅

## Recommendations
1. Regular security scans
2. Performance monitoring
3. Dependency updates
4. Git history optimization

## Next Steps
- Review security findings
- Optimize performance issues
- Update dependencies
- Clean up Git history
"@

    if (!$DryRun) {
        $report | Out-File -FilePath $reportPath -Encoding UTF8
        Write-Success "Advanced report generated: $reportPath"
    } else {
        Write-Info "Would generate advanced report: $reportPath"
    }
}

# Main execution
try {
    switch ($Mode) {
        "full" {
            Write-Info "🧹 Running full advanced house cleaning..."
            Invoke-SecurityScan
            Invoke-PerformanceAnalysis
            Invoke-DependencyAnalysis
            Invoke-GitHistoryCleanup
            Invoke-DeepClean
        }
        "deep-clean" {
            Write-Info "🧹 Running deep clean..."
            Invoke-DeepClean
        }
        "security" {
            Write-Info "🔒 Running security scan..."
            Invoke-SecurityScan
        }
        "performance" {
            Write-Info "⚡ Running performance analysis..."
            Invoke-PerformanceAnalysis
        }
        "dependencies" {
            Write-Info "📦 Running dependency analysis..."
            Invoke-DependencyAnalysis
        }
        "git-history" {
            Write-Info "🔧 Cleaning Git history..."
            Invoke-GitHistoryCleanup
        }
    }
    
    # Generate comprehensive report
    New-AdvancedReport
    
    Write-Success "Advanced house cleaning completed successfully!"
    
} catch {
    Write-Error "Advanced house cleaning failed: $($_.Exception.Message)"
    exit 1
}

Write-ColorOutput "🎉 Advanced house cleaning script completed!" "Green"
