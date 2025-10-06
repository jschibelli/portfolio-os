# Portfolio OS House Cleaning Script - Simple Working Version
# Organizes files and cleans up the project

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("full", "organization", "cleanup", "validation", "docs")]
    [string]$Mode = "full",
    
    [Parameter(Mandatory=$false)]
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

# Function to organize docs folder
function Organize-DocsFolder {
    Write-Host "Organizing docs folder..." -ForegroundColor Cyan
    
    # Create project-management subdirectory for project-related docs
    $projectManagementDir = "docs/project-management"
    if (!(Test-Path $projectManagementDir)) {
        if (!$DryRun) {
            New-Item -ItemType Directory -Path $projectManagementDir -Force | Out-Null
            Write-Host "SUCCESS: Created $projectManagementDir" -ForegroundColor Green
        }
    }
    
    # Files that should be moved to specific subdirectories
    $docsMoves = @{
        "CODE_OF_CONDUCT.md" = "docs/"
        "CONTRIBUTING.md" = "docs/"
        "HASHNODE_API_IMPLEMENTATION.md" = "docs/api/"
        "license.md" = "docs/"
    }
    
    # Project management files
    $projectFiles = @(
        "PROJECT_BOARD_AUDIT_REPORT.md",
        "STALE_ISSUES_ANALYSIS.md", 
        "STALE_ISSUES_RECOMMENDATIONS.md"
    )
    
    $movedFiles = 0
    
    # Move general docs files
    foreach ($file in $docsMoves.Keys) {
        $sourcePath = "docs/$file"
        $targetPath = $docsMoves[$file] + $file
        
        if (Test-Path $sourcePath) {
            if (!$DryRun) {
                # Ensure target directory exists
                $targetDir = Split-Path $targetPath -Parent
                if (!(Test-Path $targetDir)) { 
                    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null 
                }
                
                Move-Item $sourcePath $targetPath -Force
                Write-Host "SUCCESS: Moved $file to $targetPath" -ForegroundColor Green
            } else {
                Write-Host "Would move $file to $targetPath" -ForegroundColor Yellow
            }
            $movedFiles++
        }
    }
    
    # Move project management files
    foreach ($file in $projectFiles) {
        $sourcePath = "docs/$file"
        $targetPath = "$projectManagementDir/$file"
        
        if (Test-Path $sourcePath) {
            if (!$DryRun) {
                Move-Item $sourcePath $targetPath -Force
                Write-Host "SUCCESS: Moved $file to project-management/" -ForegroundColor Green
            } else {
                Write-Host "Would move $file to project-management/" -ForegroundColor Yellow
            }
            $movedFiles++
        }
    }
    
    if ($movedFiles -gt 0) {
        Write-Host "SUCCESS: Organized $movedFiles files in docs folder" -ForegroundColor Green
    } else {
        Write-Host "SUCCESS: Docs folder is already well organized" -ForegroundColor Green
    }
}

# Function to organize file structure
function Organize-FileStructure {
    Write-Host "Organizing file structure..." -ForegroundColor Cyan
    
    # Check for misplaced files in root
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
}

# Function to clean up temporary files
function Cleanup-TemporaryFiles {
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
}

# Function to validate project structure
function Validate-ProjectStructure {
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
}

# Main execution logic
try {
    # Pre-flight checks
    $currentBranch = git branch --show-current
    if ($currentBranch -ne "develop") {
        Write-Host "WARNING: Not on develop branch (current: $currentBranch)" -ForegroundColor Yellow
        Write-Host "Please switch to develop branch" -ForegroundColor Red
        exit 1
    }
    Write-Host "SUCCESS: On correct branch: $currentBranch" -ForegroundColor Green
    
    # Create logs directory
    if (!(Test-Path "logs")) { New-Item -ItemType Directory -Path "logs" -Force | Out-Null }
    
    # Determine actions based on Mode
    $shouldOrganize = ($Mode -eq "full" -or $Mode -eq "organization")
    $shouldCleanup = ($Mode -eq "full" -or $Mode -eq "cleanup")
    $shouldValidate = ($Mode -eq "full" -or $Mode -eq "validation")
    $shouldDocs = ($Mode -eq "full" -or $Mode -eq "organization" -or $Mode -eq "docs")
    
    if ($shouldOrganize) {
        Organize-FileStructure
    }
    if ($shouldDocs) {
        Organize-DocsFolder
    }
    if ($shouldCleanup) {
        Cleanup-TemporaryFiles
    }
    if ($shouldValidate) {
        Validate-ProjectStructure
    }
    
    Write-Host "SUCCESS: House cleaning completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: House cleaning failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host "House cleaning script completed!" -ForegroundColor Green
