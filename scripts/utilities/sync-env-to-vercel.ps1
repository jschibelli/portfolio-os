# Sync Environment Variables from .env.local to Vercel
# Run this script to automatically add all required env vars to Vercel

Write-Host "`n🔐 Syncing Environment Variables to Vercel Dashboard" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

$envFile = "apps/dashboard/.env.local"

if (-not (Test-Path $envFile)) {
    Write-Host "❌ Error: .env.local not found at $envFile" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found .env.local" -ForegroundColor Green

# Critical variables for dashboard authentication
$criticalVars = @(
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL", 
    "NEXT_AUTH_ADMIN_EMAIL",
    "NEXT_AUTH_ADMIN_PASSWORD",
    "DATABASE_URL",
    "POSTGRES_URL",
    "BLOB_READ_WRITE_TOKEN"
)

Write-Host "`n📋 Required Environment Variables for Dashboard:`n" -ForegroundColor Yellow

# Read and display critical variables
$envContent = Get-Content $envFile
$foundVars = @{}

foreach ($line in $envContent) {
    if ($line -match '^([A-Z_]+)=(.+)$') {
        $key = $matches[1]
        $value = $matches[2]
        
        if ($criticalVars -contains $key) {
            # Mask sensitive values
            if ($value.Length -gt 20) {
                $maskedValue = $value.Substring(0, 10) + "..." + $value.Substring($value.Length - 5)
            } else {
                $maskedValue = "***"
            }
            $foundVars[$key] = $value
            Write-Host "  ✓ $key = $maskedValue" -ForegroundColor Green
        }
    }
}

Write-Host "`n" -ForegroundColor Gray
Write-Host "=" * 60 -ForegroundColor Gray

# Check if vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "`n⚠️  Vercel CLI not installed. Install it with:" -ForegroundColor Yellow
    Write-Host "   npm i -g vercel`n" -ForegroundColor Cyan
    Write-Host "📝 Manual Setup Required:" -ForegroundColor Yellow
    Write-Host "   1. Go to https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "   2. Select your 'portfolio-os-dashboard' project" -ForegroundColor White
    Write-Host "   3. Go to Settings → Environment Variables" -ForegroundColor White
    Write-Host "   4. Add each variable listed above`n" -ForegroundColor White
    
    # Create a text file with the variables for easy copying
    $outputFile = "vercel-env-vars.txt"
    $foundVars.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" } | Out-File $outputFile
    Write-Host "✅ Variables saved to: $outputFile" -ForegroundColor Green
    Write-Host "   You can copy-paste from this file to Vercel dashboard`n" -ForegroundColor Gray
    exit 0
}

Write-Host "`n🚀 Vercel CLI detected! Setting up environment variables...`n" -ForegroundColor Cyan

# Prompt user
$response = Read-Host "Add these variables to Vercel? (y/n)"

if ($response -ne 'y') {
    Write-Host "`nℹ️  Cancelled. To add manually, go to:" -ForegroundColor Yellow
    Write-Host "   https://vercel.com/dashboard → your-project → Settings → Environment Variables`n" -ForegroundColor White
    exit 0
}

Write-Host "`n📤 Adding variables to Vercel production environment...`n" -ForegroundColor Cyan

$projectPath = "apps/dashboard"
Set-Location $projectPath

foreach ($var in $foundVars.GetEnumerator()) {
    Write-Host "  Adding $($var.Key)..." -NoNewline
    
    # Add to production
    $value = $var.Value
    echo $value | vercel env add $var.Key production --force 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ❌ (try manual setup)" -ForegroundColor Red
    }
}

Write-Host "`n✅ Environment variables configured!" -ForegroundColor Green
Write-Host "`n📱 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Go to Vercel dashboard" -ForegroundColor White
Write-Host "   2. Redeploy your dashboard app" -ForegroundColor White
Write-Host "   3. Test the login`n" -ForegroundColor White

Set-Location ../..

