# Test Multi-Agent Automation System
# This script tests the multi-agent automation without making real changes

param(
    [int]$MaxIssues = 3,
    [switch]$Verbose
)

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "       Testing Multi-Agent Automation" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

# Test 1: Check GitHub authentication
Write-Host "🔐 Testing GitHub authentication..." -ForegroundColor Yellow
try {
    gh auth status | Out-Null
    Write-Host "✅ GitHub authentication working" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub authentication failed" -ForegroundColor Red
    Write-Host "Please run: gh auth login" -ForegroundColor Yellow
    exit 1
}

# Test 2: Check if we can fetch issues
Write-Host "📋 Testing issue fetching..." -ForegroundColor Yellow
try {
    $issuesJson = gh issue list --state open --limit $MaxIssues --json number,title,body,labels
    $issues = $issuesJson | ConvertFrom-Json
    
    if ($issues.Count -eq 0) {
        Write-Host "⚠️ No open issues found" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Found $($issues.Count) open issues" -ForegroundColor Green
        if ($Verbose) {
            foreach ($issue in $issues) {
                Write-Host "   #$($issue.number): $($issue.title)" -ForegroundColor White
            }
        }
    }
} catch {
    Write-Host "❌ Failed to fetch issues: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Check if required scripts exist
Write-Host "🔧 Testing required scripts..." -ForegroundColor Yellow
$requiredScripts = @(
    "shared\github-utils.ps1",
    "issue-config-unified.ps1",
    "create-branch-from-develop.ps1",
    "issue-implementation.ps1",
    "working-multi-agent-real.ps1"
)

$allScriptsExist = $true
foreach ($script in $requiredScripts) {
    $scriptPath = Join-Path $PSScriptRoot $script
    if (Test-Path $scriptPath) {
        Write-Host "   ✅ $script" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $script" -ForegroundColor Red
        $allScriptsExist = $false
    }
}

if (-not $allScriptsExist) {
    Write-Host "❌ Some required scripts are missing" -ForegroundColor Red
    exit 1
}

# Test 4: Test dry run of multi-agent system
Write-Host "🤖 Testing multi-agent system (dry run)..." -ForegroundColor Yellow
try {
    & .\scripts\working-multi-agent-real.ps1 -MaxIssues $MaxIssues -DryRun
    Write-Host "✅ Multi-agent system test passed" -ForegroundColor Green
} catch {
    Write-Host "❌ Multi-agent system test failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 5: Check git status
Write-Host "📁 Testing git repository status..." -ForegroundColor Yellow
try {
    $currentBranch = git branch --show-current
    $status = git status --porcelain
    
    Write-Host "   Current branch: $currentBranch" -ForegroundColor White
    if ($status) {
        Write-Host "   ⚠️ Repository has uncommitted changes" -ForegroundColor Yellow
        Write-Host "   Consider committing changes before running automation" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ Repository is clean" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Git repository check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 All tests completed!" -ForegroundColor Green
Write-Host ""
Write-Host "To run the real multi-agent automation:" -ForegroundColor Cyan
Write-Host "  .\scripts\working-multi-agent-real.ps1 -MaxIssues 5" -ForegroundColor White
Write-Host ""
Write-Host "To run with dry run (no changes):" -ForegroundColor Cyan
Write-Host "  .\scripts\working-multi-agent-real.ps1 -MaxIssues 5 -DryRun" -ForegroundColor White
Write-Host ""
Write-Host "To run in watch mode (continuous):" -ForegroundColor Cyan
Write-Host "  .\scripts\working-multi-agent-real.ps1 -MaxIssues 5 -Watch" -ForegroundColor White


