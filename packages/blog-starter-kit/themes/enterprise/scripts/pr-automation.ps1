# Master PowerShell script for comprehensive PR automation
# Usage: .\scripts\pr-automation.ps1 -PRNumber <PR_NUMBER> [-Action <ACTION>] [-All]

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("monitor", "analyze", "respond", "quality", "docs", "all")]
    [string]$Action = "all",
    
    [Parameter(Mandatory=$false)]
    [switch]$All
)

function Show-Banner {
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host "           PR Automation System" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host ""
}

function Show-Menu {
    Write-Host "Available Actions:" -ForegroundColor Cyan
    Write-Host "1. monitor  - Monitor PR activity and CR-GPT comments" -ForegroundColor White
    Write-Host "2. analyze  - Analyze CR-GPT bot comments" -ForegroundColor White
    Write-Host "3. respond  - Generate and post responses" -ForegroundColor White
    Write-Host "4. quality  - Run code quality checks" -ForegroundColor White
    Write-Host "5. docs     - Update documentation" -ForegroundColor White
    Write-Host "6. all      - Run all automation steps" -ForegroundColor White
    Write-Host ""
}

function Run-Monitor {
    param([string]$PRNumber)
    
    Write-Host "=== Running PR Monitor ===" -ForegroundColor Green
    & .\scripts\pr-monitor.ps1 -PRNumber $PRNumber
}

function Run-Analyzer {
    param([string]$PRNumber)
    
    Write-Host "=== Running CR-GPT Analyzer ===" -ForegroundColor Green
    & .\scripts\cr-gpt-analyzer.ps1 -PRNumber $PRNumber -GenerateReport -ExportTo "cr-gpt-analysis-pr-$PRNumber.md"
}

function Run-Responder {
    param([string]$PRNumber)
    
    Write-Host "=== Running Auto Response Generator ===" -ForegroundColor Green
    & .\scripts\auto-response-generator.ps1 -PRNumber $PRNumber -AutoFix
}

function Run-QualityChecker {
    param([string]$PRNumber)
    
    Write-Host "=== Running Code Quality Checker ===" -ForegroundColor Green
    & .\scripts\code-quality-checker.ps1 -PRNumber $PRNumber -FixIssues -RunTests -GenerateReport
}

function Run-DocsUpdater {
    param([string]$PRNumber)
    
    Write-Host "=== Running Documentation Updater ===" -ForegroundColor Green
    & .\scripts\docs-updater.ps1 -PRNumber $PRNumber -UpdateChangelog -UpdateReadme -GenerateDocs
}

function Run-All {
    param([string]$PRNumber)
    
    Write-Host "=== Running All Automation Steps ===" -ForegroundColor Green
    
    # Step 1: Monitor
    Run-Monitor -PRNumber $PRNumber
    
    # Step 2: Analyze
    Run-Analyzer -PRNumber $PRNumber
    
    # Step 3: Quality Check
    Run-QualityChecker -PRNumber $PRNumber
    
    # Step 4: Generate Responses
    Run-Responder -PRNumber $PRNumber
    
    # Step 5: Update Documentation
    Run-DocsUpdater -PRNumber $PRNumber
    
    Write-Host "`n=== All Automation Steps Completed ===" -ForegroundColor Green
}

function Show-Summary {
    param([string]$PRNumber, [string]$Action)
    
    Write-Host "`n=== Automation Summary ===" -ForegroundColor Green
    Write-Host "PR Number: $PRNumber" -ForegroundColor Cyan
    Write-Host "Action: $Action" -ForegroundColor Cyan
    Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
    
    # List generated files
    $generatedFiles = @(
        "cr-gpt-analysis-pr-$PRNumber.md",
        "quality-report-pr-$PRNumber.md",
        "CHANGELOG.md",
        "README.md"
    )
    
    Write-Host "`nGenerated Files:" -ForegroundColor Yellow
    foreach ($file in $generatedFiles) {
        if (Test-Path $file) {
            Write-Host "✅ $file" -ForegroundColor Green
        } else {
            Write-Host "❌ $file" -ForegroundColor Red
        }
    }
}

# Main execution
try {
    Show-Banner
    
    if ($All -or $Action -eq "all") {
        Run-All -PRNumber $PRNumber
    } else {
        switch ($Action) {
            "monitor" { Run-Monitor -PRNumber $PRNumber }
            "analyze" { Run-Analyzer -PRNumber $PRNumber }
            "respond" { Run-Responder -PRNumber $PRNumber }
            "quality" { Run-QualityChecker -PRNumber $PRNumber }
            "docs" { Run-DocsUpdater -PRNumber $PRNumber }
            default { 
                Show-Menu
                Write-Host "Please specify a valid action or use -All for all steps" -ForegroundColor Yellow
            }
        }
    }
    
    Show-Summary -PRNumber $PRNumber -Action $Action
    
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
}
