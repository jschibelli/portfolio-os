# Portfolio OS Targeted House Cleaning Script
# Quick access to folder-specific cleaning

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("scripts", "docs", "prompts", "apps", "packages", "automation", "help")]
    [string]$Target = "help",
    [string]$Mode = "full",
    [switch]$DryRun = $false
)

Write-Host "Portfolio OS Targeted House Cleaning" -ForegroundColor Magenta
Write-Host "====================================" -ForegroundColor Magenta

switch ($Target) {
    "scripts" {
        Write-Host "Cleaning scripts folder..." -ForegroundColor Cyan
        & "$PSScriptRoot\housekeeping-folder.ps1" -TargetFolder "scripts" -Mode $Mode -DryRun:$DryRun
    }
    "docs" {
        Write-Host "Cleaning docs folder..." -ForegroundColor Cyan
        & "$PSScriptRoot\housekeeping-folder.ps1" -TargetFolder "docs" -Mode $Mode -DryRun:$DryRun
    }
    "prompts" {
        Write-Host "Cleaning prompts folder..." -ForegroundColor Cyan
        & "$PSScriptRoot\housekeeping-folder.ps1" -TargetFolder "prompts" -Mode $Mode -DryRun:$DryRun
    }
    "apps" {
        Write-Host "Cleaning apps folder..." -ForegroundColor Cyan
        & "$PSScriptRoot\housekeeping-folder.ps1" -TargetFolder "apps" -Mode $Mode -DryRun:$DryRun
    }
    "packages" {
        Write-Host "Cleaning packages folder..." -ForegroundColor Cyan
        & "$PSScriptRoot\housekeeping-folder.ps1" -TargetFolder "packages" -Mode $Mode -DryRun:$DryRun
    }
    "automation" {
        Write-Host "Cleaning automation folder..." -ForegroundColor Cyan
        & "$PSScriptRoot\housekeeping-folder.ps1" -TargetFolder "docs/automation" -Mode $Mode -DryRun:$DryRun
    }
    "help" {
        Write-Host "Available targets:" -ForegroundColor Yellow
        Write-Host "  scripts    - Clean and organize scripts folder" -ForegroundColor White
        Write-Host "  docs       - Clean and organize docs folder" -ForegroundColor White
        Write-Host "  prompts    - Clean and organize prompts folder" -ForegroundColor White
        Write-Host "  apps       - Clean and organize apps folder" -ForegroundColor White
        Write-Host "  packages   - Clean and organize packages folder" -ForegroundColor White
        Write-Host "  automation - Clean and organize automation docs folder" -ForegroundColor White
        Write-Host "  help       - Show this help message" -ForegroundColor White
        Write-Host ""
        Write-Host "Usage examples:" -ForegroundColor Yellow
        Write-Host "  .\housekeeping-target.ps1 -Target scripts" -ForegroundColor White
        Write-Host "  .\housekeeping-target.ps1 -Target docs -DryRun" -ForegroundColor White
        Write-Host "  .\housekeeping-target.ps1 -Target automation -Mode full" -ForegroundColor White
    }
}

Write-Host "Targeted housekeeping completed!" -ForegroundColor Green
