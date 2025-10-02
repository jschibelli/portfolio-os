# Quick Workflow Check Script
# Usage: .\scripts\quick-workflow-check.ps1

Write-Host "=== Quick Workflow Check ===" -ForegroundColor Blue
Write-Host ""

# Run the maintain workflow script
powershell -ExecutionPolicy Bypass -File scripts\maintain-workflow.ps1

Write-Host ""
Write-Host "=== Workflow Check Complete ===" -ForegroundColor Green
Write-Host "Run this script regularly to maintain your real-time workflow!" -ForegroundColor Yellow
