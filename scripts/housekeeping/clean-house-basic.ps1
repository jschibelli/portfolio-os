# Portfolio OS House Cleaning Script - Final Working Version
# Basic development branch maintenance

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

# File organization
Write-Host "Organizing file structure..." -ForegroundColor Cyan

$RootFiles = Get-ChildItem -Path . -File | Where-Object { 
    $_.Name -match "\.(ps1|md|json|js|ts|sh)$" -and 
    $_.Name -notmatch "^(README|package|tsconfig|turbo|prettier|vercel|pnpm)" 
}

if ($RootFiles.Count -gt 0) {
    Write-Host "WARNING: Found misplaced files in root directory:" -ForegroundColor Yellow
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
    }
} else {
    Write-Host "SUCCESS: File structure is well organized" -ForegroundColor Green
}

# Cleanup
Write-Host "Cleaning up temporary files..." -ForegroundColor Cyan

$CleanedFiles = 0
$tempFiles = Get-ChildItem -Path . -Recurse -Include "*.log", "*.tmp", "*.temp", ".DS_Store", "Thumbs.db" -Force -ErrorAction SilentlyContinue
foreach ($file in $tempFiles) {
    if ($file.FullName -notmatch "node_modules") {
        if (!$DryRun) {
            Remove-Item $file.FullName -Force -ErrorAction SilentlyContinue
        }
        $CleanedFiles++
    }
}

Write-Host "SUCCESS: Cleaned up $CleanedFiles temporary files" -ForegroundColor Green

# Validation
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
    if (!(Test-Path "logs")) { New-Item -ItemType Directory -Path "logs" -Force | Out-Null }
    $reportPath = "logs/house-cleaning-report-$(Get-Date -Format 'yyyy-MM-dd-HH-mm-ss').md"
    $report = @"
# House Cleaning Report
Generated: $(Get-Date)

## Summary
Mode: $Mode
Dry Run: $DryRun

## Actions Performed
File organization: Completed
Cleanup: Completed
Validation: Completed

## Recommendations
Regular cleanup recommended
Monitor file organization
Update documentation as needed
"@
    $report | Out-File -FilePath $reportPath -Encoding UTF8
    Write-Host "SUCCESS: Report generated: $reportPath" -ForegroundColor Green
} else {
    Write-Host "INFO: Would generate report in logs/ directory" -ForegroundColor Cyan
}

Write-Host "SUCCESS: House cleaning completed successfully!" -ForegroundColor Green
Write-Host "House cleaning script completed!" -ForegroundColor Green
