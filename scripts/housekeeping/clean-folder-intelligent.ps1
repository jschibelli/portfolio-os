# Intelligent Portfolio OS Folder House Cleaning Script
# Analyzes content and purpose to organize files intelligently

param(
    [Parameter(Mandatory=$true)]
    [string]$TargetFolder,
    [string]$Mode = "analyze",
    [switch]$DryRun = $false,
    [switch]$Interactive = $false
)

Write-Host "Portfolio OS Intelligent Folder House Cleaning Script" -ForegroundColor Magenta
Write-Host "=====================================================" -ForegroundColor Magenta
Write-Host "Target: $TargetFolder | Mode: $Mode | DryRun: $DryRun" -ForegroundColor Cyan

# Check if target folder exists
if (!(Test-Path $TargetFolder)) {
    Write-Host "ERROR: Target folder '$TargetFolder' does not exist!" -ForegroundColor Red
    exit 1
}

Write-Host "SUCCESS: Target folder found: $TargetFolder" -ForegroundColor Green

# File analysis categories
$fileCategories = @{
    "Analysis" = @()
    "Configuration" = @()
    "Implementation" = @()
    "Management" = @()
    "Documentation" = @()
    "Redundant" = @()
    "Unknown" = @()
}

# PowerShell script analysis patterns
$scriptPatterns = @{
    "Analysis" = @(
        "analyze.*issue",
        "stale.*issue",
        "requirements.*analyzer"
    )
    "Configuration" = @(
        "configure.*issue",
        "project.*field",
        "priority.*size.*app"
    )
    "Implementation" = @(
        "implement.*issue",
        "implementation.*system",
        "code.*generation"
    )
    "Management" = @(
        "manage.*queue",
        "pipeline.*system",
        "continuous.*processing"
    )
}

# Function to analyze file content
function Analyze-FileContent {
    param([string]$FilePath)
    
    try {
        $content = Get-Content $FilePath -Raw -ErrorAction SilentlyContinue
        $fileName = Split-Path $FilePath -Leaf
        $extension = [System.IO.Path]::GetExtension($FilePath)
        
        $analysis = @{
            FileName = $fileName
            Extension = $extension
            Category = "Unknown"
            Purpose = ""
            Redundant = $false
            KeepReason = ""
            DeleteReason = ""
        }
        
        # Analyze PowerShell scripts
        if ($extension -eq ".ps1") {
            $analysis.Purpose = "PowerShell Script"
            
            # Check for analysis patterns
            foreach ($category in $scriptPatterns.Keys) {
                foreach ($pattern in $scriptPatterns[$category]) {
                    if ($fileName -match $pattern -or $content -match $pattern) {
                        $analysis.Category = $category
                        break
                    }
                }
                if ($analysis.Category -ne "Unknown") { break }
            }
            
            # Specific redundant file detection
            if ($fileName -match "configure-launch-issues" -and $fileName -ne "configure-issue-auto.ps1") {
                $analysis.Category = "Redundant"
                $analysis.Redundant = $true
                $analysis.DeleteReason = "Redundant configuration script - use configure-issue-auto.ps1 instead"
            }
            
            if ($fileName -match "implement-issues" -and $fileName -ne "implement-issues.ps1") {
                $analysis.Category = "Redundant"
                $analysis.Redundant = $true
                $analysis.DeleteReason = "Redundant implementation script - use implement-issues.ps1 instead"
            }
        }
        
        # Analyze Markdown files
        if ($extension -eq ".md") {
            $analysis.Purpose = "Documentation"
            $analysis.Category = "Documentation"
            
            # Check for redundant issue documentation
            if ($fileName -match "issue-\d+-.*-agent-implementation\.md") {
                $analysis.Category = "Redundant"
                $analysis.Redundant = $true
                $analysis.DeleteReason = "Agent-specific implementation file - redundant with main implementation file"
            }
        }
        
        return $analysis
    }
    catch {
        return @{
            FileName = Split-Path $FilePath -Leaf
            Extension = [System.IO.Path]::GetExtension($FilePath)
            Category = "Unknown"
            Purpose = "Error analyzing file"
            Redundant = $false
            KeepReason = ""
            DeleteReason = ""
        }
    }
}

# Function to get file recommendations
function Get-FileRecommendations {
    param([array]$Files)
    
    $recommendations = @{
        Keep = @()
        Delete = @()
        Consolidate = @()
    }
    
    # Group files by base name patterns
    $fileGroups = @{}
    
    foreach ($file in $Files) {
        if ($file.Extension -eq ".ps1") {
            # Group configuration scripts
            if ($file.FileName -match "configure.*issue") {
                $baseKey = "configure-issues"
                if (-not $fileGroups.ContainsKey($baseKey)) {
                    $fileGroups[$baseKey] = @()
                }
                $fileGroups[$baseKey] += $file
            }
            # Group implementation scripts
            elseif ($file.FileName -match "implement.*issue") {
                $baseKey = "implement-issues"
                if (-not $fileGroups.ContainsKey($baseKey)) {
                    $fileGroups[$baseKey] = @()
                }
                $fileGroups[$baseKey] += $file
            }
        }
        elseif ($file.Extension -eq ".md") {
            # Group issue documentation
            if ($file.FileName -match "issue-\d+") {
                $issueNumber = [regex]::Match($file.FileName, "issue-(\d+)").Groups[1].Value
                $baseKey = "issue-$issueNumber"
                if (-not $fileGroups.ContainsKey($baseKey)) {
                    $fileGroups[$baseKey] = @()
                }
                $fileGroups[$baseKey] += $file
            }
        }
    }
    
    # Process file groups
    foreach ($groupKey in $fileGroups.Keys) {
        $groupFiles = $fileGroups[$groupKey]
        
        if ($groupKey -eq "configure-issues") {
            # Keep the most comprehensive configuration script
            $bestConfig = $groupFiles | Sort-Object { $_.FileName -eq "configure-issue-auto.ps1" } -Descending | Select-Object -First 1
            $recommendations.Keep += $bestConfig
            
            foreach ($file in $groupFiles) {
                if ($file.FileName -ne $bestConfig.FileName) {
                    $file.DeleteReason = "Redundant with $($bestConfig.FileName)"
                    $recommendations.Delete += $file
                }
            }
        }
        elseif ($groupKey -eq "implement-issues") {
            # Keep the most comprehensive implementation script
            $bestImpl = $groupFiles | Sort-Object { $_.FileName -eq "implement-issues.ps1" } -Descending | Select-Object -First 1
            $recommendations.Keep += $bestImpl
            
            foreach ($file in $groupFiles) {
                if ($file.FileName -ne $bestImpl.FileName) {
                    $file.DeleteReason = "Redundant with $($bestImpl.FileName)"
                    $recommendations.Delete += $file
                }
            }
        }
        elseif ($groupKey -match "issue-\d+") {
            # For issue documentation, keep the shorter implementation files
            $agentFiles = $groupFiles | Where-Object { $_.FileName -match "agent-implementation" }
            $implFiles = $groupFiles | Where-Object { $_.FileName -match "implementation\.md$" -and $_.FileName -notmatch "agent" }
            
            foreach ($file in $implFiles) {
                $recommendations.Keep += $file
                $file.KeepReason = "Main implementation documentation"
            }
            
            foreach ($file in $agentFiles) {
                $file.DeleteReason = "Agent-specific file - redundant with main implementation file"
                $recommendations.Delete += $file
            }
        }
        else {
            # Keep all other files
            foreach ($file in $groupFiles) {
                $recommendations.Keep += $file
                $file.KeepReason = "Unique functionality"
            }
        }
    }
    
    # Process files not in groups
    $allAnalyzedFiles = @()
    foreach ($category in $fileCategories.Values) {
        $allAnalyzedFiles += $category
    }
    
    foreach ($file in $allAnalyzedFiles) {
        $inGroup = $false
        foreach ($groupFiles in $fileGroups.Values) {
            if ($groupFiles -contains $file) {
                $inGroup = $true
                break
            }
        }
        
        if (-not $inGroup) {
            if ($file.Redundant) {
                $recommendations.Delete += $file
            } else {
                $recommendations.Keep += $file
                $file.KeepReason = "Unique functionality"
            }
        }
    }
    
    return $recommendations
}

# Analyze all files in the target folder
Write-Host "Analyzing files in $TargetFolder..." -ForegroundColor Cyan

$allFiles = Get-ChildItem -Path $TargetFolder -File -Recurse
$analyzedFiles = @()

foreach ($file in $allFiles) {
    $analysis = Analyze-FileContent -FilePath $file.FullName
    $analyzedFiles += $analysis
    $fileCategories[$analysis.Category] += $analysis
}

# Generate recommendations
$recommendations = Get-FileRecommendations -Files $analyzedFiles

# Display analysis results
Write-Host "`n=== FILE ANALYSIS RESULTS ===" -ForegroundColor Green

foreach ($category in $fileCategories.Keys) {
    if ($fileCategories[$category].Count -gt 0) {
        Write-Host "`n$category Files ($($fileCategories[$category].Count)):" -ForegroundColor Yellow
        foreach ($file in $fileCategories[$category]) {
            $status = if ($file.Redundant) { "REDUNDANT" } else { "KEEP" }
            $statusColor = if ($file.Redundant) { "Red" } else { "Green" }
            Write-Host "  [$status] $($file.FileName)" -ForegroundColor $statusColor
        }
    }
}

# Display recommendations
Write-Host "`n=== RECOMMENDATIONS ===" -ForegroundColor Green

Write-Host "`nFiles to KEEP ($($recommendations.Keep.Count)):" -ForegroundColor Green
foreach ($file in $recommendations.Keep) {
    $reason = if ($file.KeepReason) { " - $($file.KeepReason)" } else { "" }
    Write-Host "  ✅ $($file.FileName)$reason" -ForegroundColor Green
}

Write-Host "`nFiles to DELETE ($($recommendations.Delete.Count)):" -ForegroundColor Red
foreach ($file in $recommendations.Delete) {
    $reason = if ($file.DeleteReason) { " - $($file.DeleteReason)" } else { " - Redundant" }
    Write-Host "  ❌ $($file.FileName)$reason" -ForegroundColor Red
}

# Interactive mode
if ($Interactive) {
    Write-Host "`n=== INTERACTIVE MODE ===" -ForegroundColor Cyan
    $response = Read-Host "Do you want to proceed with these recommendations? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "Operation cancelled by user." -ForegroundColor Yellow
        exit 0
    }
}

# Execute recommendations if not dry run
if (-not $DryRun -and $recommendations.Delete.Count -gt 0) {
    Write-Host "`n=== EXECUTING CLEANUP ===" -ForegroundColor Cyan
    
    $deletedCount = 0
    foreach ($file in $recommendations.Delete) {
        $filePath = Join-Path $TargetFolder $file.FileName
        if (Test-Path $filePath) {
            try {
                Remove-Item $filePath -Force
                Write-Host "  ✅ Deleted: $($file.FileName)" -ForegroundColor Green
                $deletedCount++
            }
            catch {
                Write-Host "  ❌ Failed to delete: $($file.FileName) - $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    
    Write-Host "`nSUCCESS: Deleted $deletedCount redundant files" -ForegroundColor Green
}
elseif ($DryRun) {
    Write-Host "`nDRY RUN: Would delete $($recommendations.Delete.Count) redundant files" -ForegroundColor Yellow
}

# Generate report
Write-Host "`n=== GENERATING REPORT ===" -ForegroundColor Cyan

if (!(Test-Path "logs")) { 
    New-Item -ItemType Directory -Path "logs" -Force | Out-Null 
}

$reportPath = "logs/intelligent-cleaning-report-$(Get-Date -Format 'yyyy-MM-dd-HH-mm-ss').md"
$report = @"
# Intelligent Folder House Cleaning Report
Generated: $(Get-Date)

## Summary
Target Folder: $TargetFolder
Mode: $Mode
Dry Run: $DryRun
Interactive: $Interactive

## Analysis Results
Total Files Analyzed: $($analyzedFiles.Count)

### File Categories:
"@

foreach ($category in $fileCategories.Keys) {
    if ($fileCategories[$category].Count -gt 0) {
        $report += "`n- **$category**: $($fileCategories[$category].Count) files"
    }
}

$report += @"

## Recommendations
Files to Keep: $($recommendations.Keep.Count)
Files to Delete: $($recommendations.Delete.Count)

### Files to Keep:
"@

foreach ($file in $recommendations.Keep) {
    $reason = if ($file.KeepReason) { " - $($file.KeepReason)" } else { "" }
    $report += "`n- ✅ $($file.FileName)$reason"
}

$report += @"

### Files to Delete:
"@

foreach ($file in $recommendations.Delete) {
    $reason = if ($file.DeleteReason) { " - $($file.DeleteReason)" } else { " - Redundant" }
    $report += "`n- ❌ $($file.FileName)$reason"
}

$report += @"

## Actions Taken
Files Deleted: $(if (-not $DryRun) { $deletedCount } else { "0 (Dry Run)" })

## Recommendations
- Regular cleanup recommended for $TargetFolder
- Monitor for new redundant files
- Update documentation as needed
"@

if (-not $DryRun) {
    $report | Out-File -FilePath $reportPath -Encoding UTF8
    Write-Host "SUCCESS: Report generated: $reportPath" -ForegroundColor Green
} else {
    Write-Host "DRY RUN: Would generate report in logs/ directory" -ForegroundColor Yellow
}

Write-Host "`nSUCCESS: Intelligent folder house cleaning completed for $TargetFolder!" -ForegroundColor Green
Write-Host "Intelligent cleaning script completed!" -ForegroundColor Green
