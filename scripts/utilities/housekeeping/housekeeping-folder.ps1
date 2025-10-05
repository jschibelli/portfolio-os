# Portfolio OS Folder-Specific House Cleaning Script
# Clean and organize a specific folder

param(
    [Parameter(Mandatory=$true)]
    [string]$TargetFolder,
    [string]$Mode = "full",
    [switch]$DryRun = $false
)

Write-Host "Portfolio OS Folder House Cleaning Script" -ForegroundColor Magenta
Write-Host "===========================================" -ForegroundColor Magenta
Write-Host "Target: $TargetFolder | Mode: $Mode | DryRun: $DryRun" -ForegroundColor Cyan

# Check if target folder exists
if (!(Test-Path $TargetFolder)) {
    Write-Host "ERROR: Target folder '$TargetFolder' does not exist!" -ForegroundColor Red
    exit 1
}

Write-Host "SUCCESS: Target folder found: $TargetFolder" -ForegroundColor Green

# Create logs directory
if (!(Test-Path "logs")) { 
    if (!$DryRun) { New-Item -ItemType Directory -Path "logs" -Force | Out-Null }
    Write-Host "SUCCESS: Created logs directory" -ForegroundColor Green
}

# File organization - organize files within the target folder
Write-Host "Organizing files in $TargetFolder..." -ForegroundColor Cyan

$OrganizedFiles = 0

# Get all files in the target folder
$AllFiles = Get-ChildItem -Path $TargetFolder -File -Recurse

# Group files by extension for organization
$FilesByExtension = $AllFiles | Group-Object Extension

foreach ($group in $FilesByExtension) {
    $extension = $group.Name
    $files = $group.Group
    
    if ($files.Count -gt 1) {
        Write-Host "Found $($files.Count) files with extension $extension" -ForegroundColor Yellow
        
        # Create subdirectory for this file type if there are multiple files
        $subDir = "$TargetFolder/$($extension.TrimStart('.'))"
        if (!(Test-Path $subDir)) {
            if (!$DryRun) {
                New-Item -ItemType Directory -Path $subDir -Force | Out-Null
                Write-Host "SUCCESS: Created subdirectory: $subDir" -ForegroundColor Green
            } else {
                Write-Host "DRY RUN: Would create subdirectory: $subDir" -ForegroundColor Yellow
            }
        }
        
        # Move files to subdirectory
        foreach ($file in $files) {
            $targetPath = "$subDir/$($file.Name)"
            if ($file.FullName -ne $targetPath) {
                if (!$DryRun) {
                    Move-Item $file.FullName $targetPath -Force
                    Write-Host "SUCCESS: Moved $($file.Name) to $subDir" -ForegroundColor Green
                } else {
                    Write-Host "DRY RUN: Would move $($file.Name) to $subDir" -ForegroundColor Yellow
                }
                $OrganizedFiles++
            }
        }
    }
}

if ($OrganizedFiles -gt 0) {
    Write-Host "SUCCESS: Organized $OrganizedFiles files in $TargetFolder" -ForegroundColor Green
} else {
    Write-Host "SUCCESS: $TargetFolder is already well organized" -ForegroundColor Green
}

# Cleanup - clean temp files in the target folder
Write-Host "Cleaning up temporary files in $TargetFolder..." -ForegroundColor Cyan

$CleanedFiles = 0

# Look for temp files in target folder
$tempFiles = Get-ChildItem -Path $TargetFolder -Include "*.log", "*.tmp", "*.temp" -Recurse -Force -ErrorAction SilentlyContinue
foreach ($file in $tempFiles) {
    if (!$DryRun) {
        Remove-Item $file.FullName -Force -ErrorAction SilentlyContinue
    }
    $CleanedFiles++
    Write-Host "Cleaned: $($file.Name)" -ForegroundColor Gray
}

# Look for system files in target folder
$systemFiles = Get-ChildItem -Path $TargetFolder -Include ".DS_Store", "Thumbs.db" -Recurse -Force -ErrorAction SilentlyContinue
foreach ($file in $systemFiles) {
    if (!$DryRun) {
        Remove-Item $file.FullName -Force -ErrorAction SilentlyContinue
    }
    $CleanedFiles++
    Write-Host "Cleaned: $($file.Name)" -ForegroundColor Gray
}

# Look for build artifacts in target folder
$buildDirs = @(".next", "dist", "build", "out", "coverage", "node_modules")
foreach ($dir in $buildDirs) {
    $buildPath = "$TargetFolder/$dir"
    if (Test-Path $buildPath) {
        if (!$DryRun) {
            Remove-Item $buildPath -Recurse -Force -ErrorAction SilentlyContinue
        }
        $CleanedFiles++
        Write-Host "Cleaned build directory: $buildPath" -ForegroundColor Gray
    }
}

if ($CleanedFiles -gt 0) {
    Write-Host "SUCCESS: Cleaned up $CleanedFiles temporary files and directories in $TargetFolder" -ForegroundColor Green
} else {
    Write-Host "INFO: No temporary files found to clean in $TargetFolder" -ForegroundColor Cyan
}

# Validation - check folder structure
Write-Host "Validating $TargetFolder structure..." -ForegroundColor Cyan

$RequiredFiles = @("README.md")
$MissingFiles = @()

foreach ($file in $RequiredFiles) {
    $filePath = "$TargetFolder/$file"
    if (!(Test-Path $filePath)) {
        $MissingFiles += $file
    }
}

if ($MissingFiles.Count -gt 0) {
    Write-Host "WARNING: Missing recommended files in ${TargetFolder}:" -ForegroundColor Yellow
    $MissingFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Cyan }
} else {
    Write-Host "SUCCESS: All recommended files present in $TargetFolder" -ForegroundColor Green
}

# Generate report
Write-Host "Generating cleaning report..." -ForegroundColor Cyan

if (!$DryRun) {
    $reportPath = "logs/folder-cleaning-report-$(Get-Date -Format 'yyyy-MM-dd-HH-mm-ss').md"
    $report = @"
# Folder House Cleaning Report
Generated: $(Get-Date)

## Summary
Target Folder: $TargetFolder
Mode: $Mode
Dry Run: $DryRun

## Actions Performed
Files organized: $OrganizedFiles
Temporary files cleaned: $CleanedFiles
Files validated: $($RequiredFiles.Count)

## Results
Files organized: $OrganizedFiles
Temporary files cleaned: $CleanedFiles
Missing files: $($MissingFiles.Count)

## Recommendations
Regular cleanup recommended for $TargetFolder
Monitor file organization
Update documentation as needed
"@
    $report | Out-File -FilePath $reportPath -Encoding UTF8
    Write-Host "SUCCESS: Report generated: $reportPath" -ForegroundColor Green
} else {
    Write-Host "DRY RUN: Would generate report in logs/ directory" -ForegroundColor Yellow
}

Write-Host "SUCCESS: Folder house cleaning completed for $TargetFolder!" -ForegroundColor Green
Write-Host "Folder cleaning script completed!" -ForegroundColor Green
