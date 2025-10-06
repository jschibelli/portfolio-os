# Quick Housekeeping Script
# Easy access to common housekeeping tasks

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("clean", "organize", "validate", "help")]
    [string]$Action = "help"
)

Write-Host "Portfolio OS Quick Housekeeping" -ForegroundColor Magenta
Write-Host "===============================" -ForegroundColor Magenta

switch ($Action) {
    "clean" {
        Write-Host "Running full house cleaning..." -ForegroundColor Cyan
        & "$PSScriptRoot\housekeeping-main.ps1" -Mode full
    }
    "organize" {
        Write-Host "Organizing files..." -ForegroundColor Cyan
        & "$PSScriptRoot\housekeeping-main.ps1" -Mode organization
    }
    "validate" {
        Write-Host "Validating project structure..." -ForegroundColor Cyan
        & "$PSScriptRoot\housekeeping-main.ps1" -Mode validation
    }
    "help" {
        Write-Host "Available actions:" -ForegroundColor Yellow
        Write-Host "  clean    - Full house cleaning (organization + cleanup + validation)" -ForegroundColor White
        Write-Host "  organize - File organization only" -ForegroundColor White
        Write-Host "  validate - Project structure validation only" -ForegroundColor White
        Write-Host "  help     - Show this help message" -ForegroundColor White
        Write-Host ""
        Write-Host "Usage examples:" -ForegroundColor Yellow
        Write-Host "  .\quick-housekeeping.ps1 -Action clean" -ForegroundColor White
        Write-Host "  .\quick-housekeeping.ps1 -Action organize" -ForegroundColor White
        Write-Host "  .\quick-housekeeping.ps1 -Action validate" -ForegroundColor White
    }
}

Write-Host "Quick housekeeping completed!" -ForegroundColor Green
