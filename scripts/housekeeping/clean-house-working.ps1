# Portfolio OS House Cleaning Script - WORKING VERSION
# Actually does housekeeping work

param(
    [string]$Mode = "full",
    [switch]$DryRun = $false
)

Write-Host "Portfolio OS House Cleaning Script" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "Mode: $Mode | DryRun: $DryRun" -ForegroundColor Cyan

# Check branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "develop") {
    Write-Host "WARNING: Not on develop branch (current: $currentBranch)" -ForegroundColor Yellow
    Write-Host "Please switch to develop branch" -ForegroundColor Red
    exit 1
}
Write-Host "SUCCESS: On correct branch: $currentBranch" -ForegroundColor Green

# Create logs directory
if (!(Test-Path "logs")) { 
    if (!$DryRun) { New-Item -ItemType Directory -Path "logs" -Force | Out-Null }
    Write-Host "SUCCESS: Created logs directory" -ForegroundColor Green
}

# File organization - actually look for misplaced files
Write-Host "Searching for misplaced files..." -ForegroundColor Cyan

$RootFiles = Get-ChildItem -Path . -File | Where-Object { 
    $_.Name -match "\.(ps1|md|json|js|ts|sh)$" -and 
    $_.Name -notmatch "^(README|package|tsconfig|turbo|prettier|vercel|pnpm)" 
}

if ($RootFiles.Count -gt 0) {
    Write-Host "FOUND $($RootFiles.Count) misplaced files in root directory:" -ForegroundColor Yellow
    $RootFiles | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Cyan }
    
    if (!$DryRun) {
        foreach ($file in $RootFiles) {
            $extension = [System.IO.Path]::GetExtension($file.Name)
            if ($extension -eq ".ps1") {
                $targetDir = "scripts/utilities"
                if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
                Move-Item $file.FullName $targetDir
                Write-Host "SUCCESS: Moved $($file.Name) to $targetDir" -ForegroundColor Green
            } elseif ($extension -eq ".md") {
                $targetDir = "docs"
                Move-Item $file.FullName $targetDir
                Write-Host "SUCCESS: Moved $($file.Name) to $targetDir" -ForegroundColor Green
            } else {
                $targetDir = "scripts/utilities"
                if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
                Move-Item $file.FullName $targetDir
                Write-Host "SUCCESS: Moved $($file.Name) to $targetDir" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "DRY RUN: Would move $($RootFiles.Count) files" -ForegroundColor Yellow
    }
} else {
    Write-Host "SUCCESS: No misplaced files found in root directory" -ForegroundColor Green
}

# Cleanup - actually find and clean temp files
Write-Host "Cleaning up temporary files..." -ForegroundColor Cyan

$CleanedFiles = 0

# Look for actual temp files
$tempFiles = Get-ChildItem -Path . -Include "*.log", "*.tmp", "*.temp" -Force -ErrorAction SilentlyContinue
foreach ($file in $tempFiles) {
    if (!$DryRun) {
        Remove-Item $file.FullName -Force -ErrorAction SilentlyContinue
    }
    $CleanedFiles++
    Write-Host "Cleaned: $($file.Name)" -ForegroundColor Gray
}

# Look for system files
$systemFiles = Get-ChildItem -Path . -Include ".DS_Store", "Thumbs.db" -Force -ErrorAction SilentlyContinue
foreach ($file in $systemFiles) {
    if (!$DryRun) {
        Remove-Item $file.FullName -Force -ErrorAction SilentlyContinue
    }
    $CleanedFiles++
    Write-Host "Cleaned: $($file.Name)" -ForegroundColor Gray
}

# Look for build artifacts
$buildDirs = @(".next", "dist", "build", "out", "coverage")
foreach ($dir in $buildDirs) {
    if (Test-Path $dir) {
        if (!$DryRun) {
            Remove-Item $dir -Recurse -Force -ErrorAction SilentlyContinue
        }
        $CleanedFiles++
        Write-Host "Cleaned build directory: $dir" -ForegroundColor Gray
    }
}

if ($CleanedFiles -gt 0) {
    Write-Host "SUCCESS: Cleaned up $CleanedFiles temporary files and directories" -ForegroundColor Green
} else {
    Write-Host "INFO: No temporary files found to clean" -ForegroundColor Cyan
}

# Validation - actually check structure
Write-Host "Validating project structure..." -ForegroundColor Cyan

$RequiredDirs = @("apps/site", "apps/dashboard", "packages/ui", "packages/lib", "scripts", "docs", "prompts")
$MissingDirs = @()

foreach ($dir in $RequiredDirs) {
    if (!(Test-Path $dir)) {
        $MissingDirs += $dir
    }
}

if ($MissingDirs.Count -gt 0) {
    Write-Host "WARNING: Missing required directories:" -ForegroundColor Yellow
    $MissingDirs | ForEach-Object { Write-Host "  - $_" -ForegroundColor Cyan }
} else {
    Write-Host "SUCCESS: All required directories present" -ForegroundColor Green
}

$RequiredFiles = @("package.json", "pnpm-workspace.yaml", "turbo.json", "README.md")
$MissingFiles = @()

foreach ($file in $RequiredFiles) {
    if (!(Test-Path $file)) {
        $MissingFiles += $file
    }
}

if ($MissingFiles.Count -gt 0) {
    Write-Host "WARNING: Missing required files:" -ForegroundColor Yellow
    $MissingFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Cyan }
} else {
    Write-Host "SUCCESS: All required files present" -ForegroundColor Green
}

# Generate report
Write-Host "Generating cleaning report..." -ForegroundColor Cyan

if (!$DryRun) {
    $reportPath = "logs/house-cleaning-report-$(Get-Date -Format 'yyyy-MM-dd-HH-mm-ss').md"
    $report = @"
# House Cleaning Report
Generated: $(Get-Date)

## Summary
Mode: $Mode
Dry Run: $DryRun

## Actions Performed
Files organized: $($RootFiles.Count)
Temporary files cleaned: $CleanedFiles
Directories validated: $($RequiredDirs.Count)
Files validated: $($RequiredFiles.Count)

## Results
Misplaced files found: $($RootFiles.Count)
Temporary files cleaned: $CleanedFiles
Missing directories: $($MissingDirs.Count)
Missing files: $($MissingFiles.Count)

## Recommendations
Regular cleanup recommended
Monitor file organization
Update documentation as needed
"@
    $report | Out-File -FilePath $reportPath -Encoding UTF8
    Write-Host "SUCCESS: Report generated: $reportPath" -ForegroundColor Green
} else {
    Write-Host "DRY RUN: Would generate report in logs/ directory" -ForegroundColor Yellow
}

Write-Host "SUCCESS: House cleaning completed!" -ForegroundColor Green
Write-Host "House cleaning script completed!" -ForegroundColor Green
