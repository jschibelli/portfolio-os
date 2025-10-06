# Test script to isolate syntax issues
param(
    [string]$IssueNumber = "269"
)

Write-Host "Testing basic PowerShell syntax" -ForegroundColor Green
Write-Host "Issue Number: $IssueNumber" -ForegroundColor Cyan

# Test string interpolation with colon
$testVar = "test"
Write-Host "Test: $testVar" -ForegroundColor White

# Test complex string interpolation
$task = "test task"
$error = "test error"
Write-Host "Task: $task`: $error" -ForegroundColor White

Write-Host "Script completed successfully" -ForegroundColor Green
