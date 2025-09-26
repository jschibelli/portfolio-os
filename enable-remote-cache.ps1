# PowerShell script to enable remote caching
Write-Host "Enabling Vercel Remote Cache..."
$input = "y"
$input | npx turbo link
