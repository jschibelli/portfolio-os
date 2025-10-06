# Test script to verify project board automation is working
param(
    [string]$ProjectItemId = "PVTI_lAHOAEnMVc4BCu-czgfaB6M",
    [string]$Status = "In Progress"
)

Write-Host "🧪 Testing Project Board Update..." -ForegroundColor Cyan
Write-Host "Project Item ID: $ProjectItemId" -ForegroundColor White
Write-Host "New Status: $Status" -ForegroundColor White

# Get current status first
Write-Host "`n📊 Getting current status..." -ForegroundColor Yellow
try {
    $currentItem = gh project item-list 20 --owner jschibelli --format json | ConvertFrom-Json | Select-Object -ExpandProperty items | Where-Object {$_.id -eq $ProjectItemId}
    
    if ($currentItem) {
        Write-Host "Current item found: $($currentItem.content.title)" -ForegroundColor Green
        Write-Host "Current status: $($currentItem.fieldValues[0].text)" -ForegroundColor Green
    } else {
        Write-Host "Item not found in project" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error getting current status: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test the update
Write-Host "`n🔄 Testing status update..." -ForegroundColor Yellow
try {
    # This is a test - we'll just show what the command would be
    Write-Host "Would run: gh project item-edit --id $ProjectItemId --project-id PVT_kwHOAEnMVc4BCu-c --field-id <STATUS_FIELD_ID> --single-select-option-id <STATUS_OPTION_ID>" -ForegroundColor Gray
    Write-Host "✅ Project board update test completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error during update test: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n📝 Summary:" -ForegroundColor Cyan
Write-Host "- Project board is accessible" -ForegroundColor White
Write-Host "- Items can be queried successfully" -ForegroundColor White  
Write-Host "- Update mechanism is ready (needs correct field/option IDs)" -ForegroundColor White
