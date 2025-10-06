# Simple test script
param(
    [string]$IssueNumber = "269"
)

Write-Host "Testing basic functionality" -ForegroundColor Green

# Test foreach loop
$phases = @(
    @{ Name = "Phase 1"; Tasks = @("Task 1", "Task 2") },
    @{ Name = "Phase 2"; Tasks = @("Task 3", "Task 4") }
)

foreach ($phaseIndex in 0..($phases.Count - 1)) {
    $phase = $phases[$phaseIndex]
    Write-Host "Phase $($phaseIndex + 1): $($phase.Name)" -ForegroundColor Cyan
    
    foreach ($task in $phase.Tasks) {
        Write-Host "  Task: $task" -ForegroundColor White
    }
}

Write-Host "Test completed successfully" -ForegroundColor Green
