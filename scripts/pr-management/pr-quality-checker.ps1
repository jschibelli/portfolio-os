# PR Quality Checker for Portfolio OS
# Usage: .\pr-quality-checker.ps1 -PRNumber <NUMBER> [-Checks <CHECKS>] [-AutoFix]

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("all", "linting", "formatting", "tests", "security", "performance", "documentation")]
    [string]$Checks = "all",
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoFix,
    
    [Parameter(Mandatory=$false)]
    [switch]$RunTests,
    
    [Parameter(Mandatory=$false)]
    [string]$ExportTo,
    
    [Parameter(Mandatory=$false)]
    [switch]$Detailed
)

# Import shared utilities
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$utilsPath = Join-Path (Split-Path -Parent $scriptPath) "core-utilities\get-github-utilities.ps1"

if (Test-Path $utilsPath) {
    . $utilsPath
} else {
    Write-Warning "GitHub utilities not found at $utilsPath"
}

function Show-QualityCheckerHeader {
    Write-Host "`n🔍 PR QUALITY CHECKER" -ForegroundColor Cyan
    Write-Host "====================" -ForegroundColor Cyan
    Write-Host "Checking PR #$PRNumber" -ForegroundColor White
    Write-Host "Checks: $Checks" -ForegroundColor Gray
    Write-Host "Auto-Fix: $AutoFix" -ForegroundColor Gray
    Write-Host "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
    Write-Host "=" * 40 -ForegroundColor Cyan
}

function Get-PRFiles {
    param([string]$PRNumber)
    
    try {
        Write-Host "📁 Fetching PR files..." -ForegroundColor Yellow
        
        $files = gh pr view $PRNumber --json files | ConvertFrom-Json
        return $files.files
    }
    catch {
        Write-Host "❌ Failed to fetch PR files: $($_.Exception.Message)" -ForegroundColor Red
        return @()
    }
}

function Test-Linting {
    param([array]$Files)
    
    Write-Host "`n🔍 LINTING CHECK" -ForegroundColor Yellow
    
    $lintResults = @{
        Passed = 0
        Failed = 0
        Errors = @()
        Warnings = @()
    }
    
    $jsFiles = $Files | Where-Object { $_.filename -match "\.(js|jsx|ts|tsx)$" }
    
    if ($jsFiles.Count -eq 0) {
        Write-Host "No JavaScript/TypeScript files found" -ForegroundColor Gray
        return $lintResults
    }
    
    foreach ($file in $jsFiles) {
        $filename = $file.filename
        Write-Host "Checking: $filename" -ForegroundColor Gray
        
        try {
            # Check if file exists locally
            if (Test-Path $filename) {
                # Run ESLint if available
                $lintOutput = & npx eslint $filename --format json 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "  ✅ Passed" -ForegroundColor Green
                    $lintResults.Passed++
                } else {
                    Write-Host "  ❌ Failed" -ForegroundColor Red
                    $lintResults.Failed++
                    $lintResults.Errors += "Linting errors in $filename"
                }
            } else {
                Write-Host "  ⚠️  File not found locally" -ForegroundColor Yellow
                $lintResults.Warnings += "Cannot check $filename - file not found locally"
            }
        }
        catch {
            Write-Host "  ⚠️  Linting check failed: $($_.Exception.Message)" -ForegroundColor Yellow
            $lintResults.Warnings += "Linting check failed for $filename"
        }
    }
    
    # Summary
    Write-Host "`nLinting Summary:" -ForegroundColor Cyan
    Write-Host "  Passed: $($lintResults.Passed)" -ForegroundColor Green
    Write-Host "  Failed: $($lintResults.Failed)" -ForegroundColor Red
    Write-Host "  Warnings: $($lintResults.Warnings.Count)" -ForegroundColor Yellow
    
    return $lintResults
}

function Test-Formatting {
    param([array]$Files)
    
    Write-Host "`n🎨 FORMATTING CHECK" -ForegroundColor Yellow
    
    $formatResults = @{
        Passed = 0
        Failed = 0
        Errors = @()
        Warnings = @()
    }
    
    $jsFiles = $Files | Where-Object { $_.filename -match "\.(js|jsx|ts|tsx)$" }
    
    foreach ($file in $jsFiles) {
        $filename = $file.filename
        Write-Host "Checking: $filename" -ForegroundColor Gray
        
        try {
            if (Test-Path $filename) {
                # Check Prettier formatting
                $formatOutput = & npx prettier --check $filename 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "  ✅ Properly formatted" -ForegroundColor Green
                    $formatResults.Passed++
                } else {
                    Write-Host "  ❌ Formatting issues" -ForegroundColor Red
                    $formatResults.Failed++
                    $formatResults.Errors += "Formatting issues in $filename"
                    
                    if ($AutoFix) {
                        Write-Host "  🔧 Auto-fixing formatting..." -ForegroundColor Yellow
                        & npx prettier --write $filename
                        if ($LASTEXITCODE -eq 0) {
                            Write-Host "  ✅ Auto-fix applied" -ForegroundColor Green
                            $formatResults.Failed--
                            $formatResults.Passed++
                        }
                    }
                }
            } else {
                Write-Host "  ⚠️  File not found locally" -ForegroundColor Yellow
                $formatResults.Warnings += "Cannot check $filename - file not found locally"
            }
        }
        catch {
            Write-Host "  ⚠️  Formatting check failed: $($_.Exception.Message)" -ForegroundColor Yellow
            $formatResults.Warnings += "Formatting check failed for $filename"
        }
    }
    
    # Summary
    Write-Host "`nFormatting Summary:" -ForegroundColor Cyan
    Write-Host "  Passed: $($formatResults.Passed)" -ForegroundColor Green
    Write-Host "  Failed: $($formatResults.Failed)" -ForegroundColor Red
    Write-Host "  Warnings: $($formatResults.Warnings.Count)" -ForegroundColor Yellow
    
    return $formatResults
}

function Test-Security {
    param([array]$Files)
    
    Write-Host "`n🔒 SECURITY CHECK" -ForegroundColor Yellow
    
    $securityResults = @{
        Passed = 0
        Failed = 0
        Errors = @()
        Warnings = @()
        Vulnerabilities = @()
    }
    
    # Check for sensitive patterns
    $sensitivePatterns = @(
        @{ Pattern = "password\s*=\s*['\"][^'\"]+['\"]"; Severity = "High"; Message = "Hardcoded password detected" }
        @{ Pattern = "secret\s*=\s*['\"][^'\"]+['\"]"; Severity = "High"; Message = "Hardcoded secret detected" }
        @{ Pattern = "api_key\s*=\s*['\"][^'\"]+['\"]"; Severity = "High"; Message = "Hardcoded API key detected" }
        @{ Pattern = "token\s*=\s*['\"][^'\"]+['\"]"; Severity = "Medium"; Message = "Hardcoded token detected" }
        @{ Pattern = "eval\s*\("; Severity = "High"; Message = "Use of eval() function" }
        @{ Pattern = "innerHTML\s*="; Severity = "Medium"; Message = "Direct innerHTML assignment" }
    )
    
    $jsFiles = $Files | Where-Object { $_.filename -match "\.(js|jsx|ts|tsx)$" }
    
    foreach ($file in $jsFiles) {
        $filename = $file.filename
        Write-Host "Checking: $filename" -ForegroundColor Gray
        
        try {
            if (Test-Path $filename) {
                $content = Get-Content $filename -Raw
                
                foreach ($pattern in $sensitivePatterns) {
                    if ($content -match $pattern.Pattern) {
                        $securityResults.Vulnerabilities += @{
                            File = $filename
                            Severity = $pattern.Severity
                            Message = $pattern.Message
                            Pattern = $pattern.Pattern
                        }
                        
                        if ($pattern.Severity -eq "High") {
                            $securityResults.Failed++
                            $securityResults.Errors += "$($pattern.Message) in $filename"
                        } else {
                            $securityResults.Warnings += "$($pattern.Message) in $filename"
                        }
                    }
                }
                
                if ($securityResults.Vulnerabilities.Count -eq 0) {
                    $securityResults.Passed++
                }
            } else {
                Write-Host "  ⚠️  File not found locally" -ForegroundColor Yellow
                $securityResults.Warnings += "Cannot check $filename - file not found locally"
            }
        }
        catch {
            Write-Host "  ⚠️  Security check failed: $($_.Exception.Message)" -ForegroundColor Yellow
            $securityResults.Warnings += "Security check failed for $filename"
        }
    }
    
    # Display vulnerabilities
    if ($securityResults.Vulnerabilities.Count -gt 0) {
        Write-Host "`n🚨 Security Vulnerabilities Found:" -ForegroundColor Red
        foreach ($vuln in $securityResults.Vulnerabilities) {
            $color = if ($vuln.Severity -eq "High") { "Red" } else { "Yellow" }
            Write-Host "  [$($vuln.Severity)] $($vuln.File): $($vuln.Message)" -ForegroundColor $color
        }
    }
    
    # Summary
    Write-Host "`nSecurity Summary:" -ForegroundColor Cyan
    Write-Host "  Passed: $($securityResults.Passed)" -ForegroundColor Green
    Write-Host "  Failed: $($securityResults.Failed)" -ForegroundColor Red
    Write-Host "  Warnings: $($securityResults.Warnings.Count)" -ForegroundColor Yellow
    Write-Host "  Vulnerabilities: $($securityResults.Vulnerabilities.Count)" -ForegroundColor Red
    
    return $securityResults
}

function Test-Performance {
    param([array]$Files)
    
    Write-Host "`n⚡ PERFORMANCE CHECK" -ForegroundColor Yellow
    
    $perfResults = @{
        Passed = 0
        Failed = 0
        Errors = @()
        Warnings = @()
        Issues = @()
    }
    
    # Performance anti-patterns
    $perfPatterns = @(
        @{ Pattern = "document\.getElementById"; Severity = "Low"; Message = "Consider using React refs instead of direct DOM access" }
        @{ Pattern = "setInterval\s*\("; Severity = "Medium"; Message = "setInterval detected - ensure cleanup" }
        @{ Pattern = "setTimeout\s*\("; Severity = "Low"; Message = "setTimeout detected - ensure cleanup" }
        @{ Pattern = "\.map\s*\(.*\.map\s*\("; Severity = "Medium"; Message = "Nested map functions detected" }
        @{ Pattern = "\.filter\s*\(.*\.map\s*\("; Severity = "Low"; Message = "Consider combining filter and map operations" }
    )
    
    $jsFiles = $Files | Where-Object { $_.filename -match "\.(js|jsx|ts|tsx)$" }
    
    foreach ($file in $jsFiles) {
        $filename = $file.filename
        Write-Host "Checking: $filename" -ForegroundColor Gray
        
        try {
            if (Test-Path $filename) {
                $content = Get-Content $filename -Raw
                
                foreach ($pattern in $perfPatterns) {
                    if ($content -match $pattern.Pattern) {
                        $perfResults.Issues += @{
                            File = $filename
                            Severity = $pattern.Severity
                            Message = $pattern.Message
                        }
                        
                        if ($pattern.Severity -eq "High") {
                            $perfResults.Failed++
                            $perfResults.Errors += "$($pattern.Message) in $filename"
                        } else {
                            $perfResults.Warnings += "$($pattern.Message) in $filename"
                        }
                    }
                }
                
                if ($perfResults.Issues.Count -eq 0) {
                    $perfResults.Passed++
                }
            } else {
                Write-Host "  ⚠️  File not found locally" -ForegroundColor Yellow
                $perfResults.Warnings += "Cannot check $filename - file not found locally"
            }
        }
        catch {
            Write-Host "  ⚠️  Performance check failed: $($_.Exception.Message)" -ForegroundColor Yellow
            $perfResults.Warnings += "Performance check failed for $filename"
        }
    }
    
    # Display issues
    if ($perfResults.Issues.Count -gt 0) {
        Write-Host "`n⚡ Performance Issues Found:" -ForegroundColor Yellow
        foreach ($issue in $perfResults.Issues) {
            $color = if ($issue.Severity -eq "High") { "Red" } elseif ($issue.Severity -eq "Medium") { "Yellow" } else { "Gray" }
            Write-Host "  [$($issue.Severity)] $($issue.File): $($issue.Message)" -ForegroundColor $color
        }
    }
    
    # Summary
    Write-Host "`nPerformance Summary:" -ForegroundColor Cyan
    Write-Host "  Passed: $($perfResults.Passed)" -ForegroundColor Green
    Write-Host "  Failed: $($perfResults.Failed)" -ForegroundColor Red
    Write-Host "  Warnings: $($perfResults.Warnings.Count)" -ForegroundColor Yellow
    Write-Host "  Issues: $($perfResults.Issues.Count)" -ForegroundColor Yellow
    
    return $perfResults
}

function Test-Documentation {
    param([array]$Files)
    
    Write-Host "`n📚 DOCUMENTATION CHECK" -ForegroundColor Yellow
    
    $docResults = @{
        Passed = 0
        Failed = 0
        Errors = @()
        Warnings = @()
        MissingDocs = @()
    }
    
    $jsFiles = $Files | Where-Object { $_.filename -match "\.(js|jsx|ts|tsx)$" }
    
    foreach ($file in $jsFiles) {
        $filename = $file.filename
        Write-Host "Checking: $filename" -ForegroundColor Gray
        
        try {
            if (Test-Path $filename) {
                $content = Get-Content $filename -Raw
                
                # Check for function documentation
                $functions = $content | Select-String -Pattern "(function|const|let|var)\s+(\w+)\s*[=\(]" -AllMatches
                
                foreach ($match in $functions.Matches) {
                    $functionName = $match.Groups[2].Value
                    
                    # Check if function has JSDoc comments
                    $functionStart = $match.Index
                    $beforeFunction = $content.Substring([Math]::Max(0, $functionStart - 200), 200)
                    
                    if ($beforeFunction -notmatch "/\*\*" -and $functionName -notmatch "^(test|spec|mock)") {
                        $docResults.MissingDocs += @{
                            File = $filename
                            Function = $functionName
                        }
                        $docResults.Warnings += "Missing documentation for function '$functionName' in $filename"
                    }
                }
                
                # Check for file header documentation
                if ($content -notmatch "/\*\*" -and $filename -notmatch "(test|spec|mock)") {
                    $docResults.Warnings += "Missing file header documentation for $filename"
                }
                
                $docResults.Passed++
            } else {
                Write-Host "  ⚠️  File not found locally" -ForegroundColor Yellow
                $docResults.Warnings += "Cannot check $filename - file not found locally"
            }
        }
        catch {
            Write-Host "  ⚠️  Documentation check failed: $($_.Exception.Message)" -ForegroundColor Yellow
            $docResults.Warnings += "Documentation check failed for $filename"
        }
    }
    
    # Display missing documentation
    if ($docResults.MissingDocs.Count -gt 0) {
        Write-Host "`n📝 Missing Documentation:" -ForegroundColor Yellow
        foreach ($doc in $docResults.MissingDocs) {
            Write-Host "  $($doc.File): $($doc.Function)" -ForegroundColor Gray
        }
    }
    
    # Summary
    Write-Host "`nDocumentation Summary:" -ForegroundColor Cyan
    Write-Host "  Passed: $($docResults.Passed)" -ForegroundColor Green
    Write-Host "  Failed: $($docResults.Failed)" -ForegroundColor Red
    Write-Host "  Warnings: $($docResults.Warnings.Count)" -ForegroundColor Yellow
    Write-Host "  Missing Docs: $($docResults.MissingDocs.Count)" -ForegroundColor Yellow
    
    return $docResults
}

function Run-Tests {
    param([array]$Files)
    
    Write-Host "`n🧪 RUNNING TESTS" -ForegroundColor Yellow
    
    $testResults = @{
        Passed = 0
        Failed = 0
        Skipped = 0
        Errors = @()
        Warnings = @()
    }
    
    try {
        # Check if test files exist
        $testFiles = $Files | Where-Object { $_.filename -match "(test|spec)\.(js|jsx|ts|tsx)$" }
        
        if ($testFiles.Count -eq 0) {
            Write-Host "No test files found in PR" -ForegroundColor Gray
            $testResults.Warnings += "No test files found in PR"
            return $testResults
        }
        
        # Run tests
        Write-Host "Running tests..." -ForegroundColor Gray
        
        if (Test-Path "package.json") {
            # Try to run tests using npm/yarn
            $testOutput = & npm test 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ All tests passed" -ForegroundColor Green
                $testResults.Passed++
            } else {
                Write-Host "❌ Tests failed" -ForegroundColor Red
                $testResults.Failed++
                $testResults.Errors += "Test failures detected"
            }
        } else {
            Write-Host "⚠️  No package.json found - cannot run tests" -ForegroundColor Yellow
            $testResults.Warnings += "No package.json found - cannot run tests"
        }
    }
    catch {
        Write-Host "❌ Test execution failed: $($_.Exception.Message)" -ForegroundColor Red
        $testResults.Errors += "Test execution failed: $($_.Exception.Message)"
    }
    
    # Summary
    Write-Host "`nTest Summary:" -ForegroundColor Cyan
    Write-Host "  Passed: $($testResults.Passed)" -ForegroundColor Green
    Write-Host "  Failed: $($testResults.Failed)" -ForegroundColor Red
    Write-Host "  Skipped: $($testResults.Skipped)" -ForegroundColor Yellow
    Write-Host "  Warnings: $($testResults.Warnings.Count)" -ForegroundColor Yellow
    
    return $testResults
}

function Export-QualityReport {
    param([hashtable]$Results, [string]$OutputFile)
    
    $report = @{
        GeneratedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        PRNumber = $PRNumber
        Checks = $Checks
        AutoFix = $AutoFix
        Results = $Results
        Summary = @{
            TotalChecks = ($Results.Values | Measure-Object).Count
            TotalPassed = ($Results.Values | ForEach-Object { $_.Passed } | Measure-Object -Sum).Sum
            TotalFailed = ($Results.Values | ForEach-Object { $_.Failed } | Measure-Object -Sum).Sum
            TotalWarnings = ($Results.Values | ForEach-Object { $_.Warnings.Count } | Measure-Object -Sum).Sum
        }
    }
    
    try {
        $report | ConvertTo-Json -Depth 5 | Out-File -FilePath $OutputFile -Encoding UTF8
        Write-Host "📄 Quality report exported to: $OutputFile" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to export quality report: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main execution
try {
    Show-QualityCheckerHeader
    
    $files = Get-PRFiles -PRNumber $PRNumber
    if ($files.Count -eq 0) {
        Write-Error "No files found in PR"
        exit 1
    }
    
    $results = @{}
    
    switch ($Checks) {
        "all" {
            $results.Linting = Test-Linting -Files $files
            $results.Formatting = Test-Formatting -Files $files
            $results.Security = Test-Security -Files $files
            $results.Performance = Test-Performance -Files $files
            $results.Documentation = Test-Documentation -Files $files
            
            if ($RunTests) {
                $results.Tests = Run-Tests -Files $files
            }
        }
        "linting" {
            $results.Linting = Test-Linting -Files $files
        }
        "formatting" {
            $results.Formatting = Test-Formatting -Files $files
        }
        "security" {
            $results.Security = Test-Security -Files $files
        }
        "performance" {
            $results.Performance = Test-Performance -Files $files
        }
        "documentation" {
            $results.Documentation = Test-Documentation -Files $files
        }
        "tests" {
            $results.Tests = Run-Tests -Files $files
        }
    }
    
    # Overall summary
    $totalPassed = ($results.Values | ForEach-Object { $_.Passed } | Measure-Object -Sum).Sum
    $totalFailed = ($results.Values | ForEach-Object { $_.Failed } | Measure-Object -Sum).Sum
    $totalWarnings = ($results.Values | ForEach-Object { $_.Warnings.Count } | Measure-Object -Sum).Sum
    
    Write-Host "`n📊 OVERALL QUALITY SUMMARY" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    Write-Host "Total Passed: $totalPassed" -ForegroundColor Green
    Write-Host "Total Failed: $totalFailed" -ForegroundColor Red
    Write-Host "Total Warnings: $totalWarnings" -ForegroundColor Yellow
    
    $overallStatus = if ($totalFailed -eq 0) { "✅ PASSED" } else { "❌ FAILED" }
    Write-Host "Overall Status: $overallStatus" -ForegroundColor $(if ($totalFailed -eq 0) { "Green" } else { "Red" })
    
    if ($ExportTo) {
        Export-QualityReport -Results $results -OutputFile $ExportTo
    }
    
    Write-Host "`n✅ Quality check completed successfully" -ForegroundColor Green
}
catch {
    Write-Error "Quality check error: $($_.Exception.Message)"
    exit 1
}
