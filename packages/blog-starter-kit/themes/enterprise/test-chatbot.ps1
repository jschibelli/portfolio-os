Write-Host "🧪 Testing Chatbot API..." -ForegroundColor Green
Write-Host ""

try {
    $body = @{
        message = "I want to schedule a meeting"
        conversationHistory = @()
        pageContext = $null
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -Body $body -ContentType "application/json"
    
    Write-Host "✅ Response Status: 200" -ForegroundColor Green
    Write-Host "✅ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
    
    if ($response.uiActions) {
        Write-Host "🎯 UI Actions found: $($response.uiActions.Count)" -ForegroundColor Yellow
        for ($i = 0; $i -lt $response.uiActions.Count; $i++) {
            $action = $response.uiActions[$i]
            Write-Host "  $($i + 1). Action: $($action.action)" -ForegroundColor Cyan
            Write-Host "     Data: $($action.data | ConvertTo-Json -Depth 3)" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ No UI actions returned" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}
