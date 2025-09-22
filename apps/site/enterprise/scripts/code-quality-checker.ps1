# PowerShell script to check code quality and apply fixes
# Usage: .\scripts\code-quality-checker.ps1 -PRNumber <PR_NUMBER> [-FixIssues] [-RunTests] [-GenerateReport]

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [Parameter(Mandatory=$false)]
    [switch]$FixIssues,
    
    [Parameter(Mandatory=$false)]
    [switch]$RunTests,
    
    [Parameter(Mandatory=$false)]
    [switch]$GenerateReport
)

function Get-PRFiles {
    param([string]$PRNumber)
    
    $repoOwner = gh repo view --json owner -q .owner.login
    $repoName = gh repo view --json name -q .name
    
    $files = gh api repos/$repoOwner/$repoName/pulls/$PRNumber/files
    return $files
}

function Run-Linting {
    param([array]$Files)
    
    Write-Host "Running linting checks..." -ForegroundColor Green
    
    $lintResults = @()
    
    foreach ($file in $Files) {
        if ($file.filename -match "\.(ts|tsx|js|jsx)$") {
            Write-Host "Linting: $($file.filename)" -ForegroundColor Cyan
            
            # Run ESLint if available
            if (Get-Command "eslint" -ErrorAction SilentlyContinue) {
                $lintOutput = eslint $file.filename 2>&1
                if ($LASTEXITCODE -ne 0) {
                    $lintResults += @{
                        File = $file.filename
                        Issues = $lintOutput
                        Type = "Linting"
                    }
                }
            }
        }
    }
    
    return $lintResults
}

function Run-Formatting {
    param([array]$Files)
    
    Write-Host "Checking code formatting..." -ForegroundColor Green
    
    $formatResults = @()
    
    foreach ($file in $Files) {
        if ($file.filename -match "\.(ts|tsx|js|jsx)$") {
            Write-Host "Formatting: $($file.filename)" -ForegroundColor Cyan
            
            # Run Prettier if available
            if (Get-Command "prettier" -ErrorAction SilentlyContinue) {
                $formatOutput = prettier --check $file.filename 2>&1
                if ($LASTEXITCODE -ne 0) {
                    $formatResults += @{
                        File = $file.filename
                        Issues = $formatOutput
                        Type = "Formatting"
                    }
                }
            }
        }
    }
    
    return $formatResults
}

function Run-TypeChecking {
    param([array]$Files)
    
    Write-Host "Running TypeScript type checking..." -ForegroundColor Green
    
    $typeResults = @()
    
    # Check if TypeScript files exist
    $tsFiles = $Files | Where-Object { $_.filename -match "\.(ts|tsx)$" }
    
    if ($tsFiles.Count -gt 0) {
        if (Get-Command "tsc" -ErrorAction SilentlyContinue) {
            $typeOutput = tsc --noEmit 2>&1
            if ($LASTEXITCODE -ne 0) {
                $typeResults += @{
                    File = "TypeScript Project"
                    Issues = $typeOutput
                    Type = "Type Checking"
                }
            }
        }
    }
    
    return $typeResults
}

function Run-Tests {
    param([array]$Files)
    
    Write-Host "Running tests..." -ForegroundColor Green
    
    $testResults = @()
    
    # Check for test files
    $testFiles = $Files | Where-Object { $_.filename -match "\.(test|spec)\.(ts|tsx|js|jsx)$" }
    
    if ($testFiles.Count -gt 0) {
        if (Get-Command "npm" -ErrorAction SilentlyContinue) {
            $testOutput = npm test 2>&1
            if ($LASTEXITCODE -ne 0) {
                $testResults += @{
                    File = "Test Suite"
                    Issues = $testOutput
                    Type = "Testing"
                }
            }
        }
    }
    
    return $testResults
}

function Apply-Fixes {
    param([array]$Files)
    
    Write-Host "Applying automatic fixes..." -ForegroundColor Green
    
    foreach ($file in $Files) {
        if ($file.filename -match "\.(ts|tsx|js|jsx)$") {
            Write-Host "Fixing: $($file.filename)" -ForegroundColor Cyan
            
            # Apply ESLint fixes
            if (Get-Command "eslint" -ErrorAction SilentlyContinue) {
                eslint --fix $file.filename
            }
            
            # Apply Prettier formatting
            if (Get-Command "prettier" -ErrorAction SilentlyContinue) {
                prettier --write $file.filename
            }
        }
    }
}

function Generate-QualityReport {
    param([array]$LintResults, [array]$FormatResults, [array]$TypeResults, [array]$TestResults, [string]$PRNumber)
    
    $report = @"
# Code Quality Report for PR #$PRNumber

Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Summary
- Linting Issues: $($LintResults.Count)
- Formatting Issues: $($FormatResults.Count)
- Type Checking Issues: $($TypeResults.Count)
- Test Issues: $($TestResults.Count)

## Detailed Results
"@
    
    if ($LintResults.Count -gt 0) {
        $report += "`n`n### Linting Issues`n"
        foreach ($result in $LintResults) {
            $report += "`n**File**: $($result.File)`n"
            $report += "```$($result.Issues)```"
        }
    }
    
    if ($FormatResults.Count -gt 0) {
        $report += "`n`n### Formatting Issues`n"
        foreach ($result in $FormatResults) {
            $report += "`n**File**: $($result.File)`n"
            $report += "```$($result.Issues)```"
        }
    }
    
    if ($TypeResults.Count -gt 0) {
        $report += "`n`n### Type Checking Issues`n"
        foreach ($result in $TypeResults) {
            $report += "`n**File**: $($result.File)`n"
            $report += "```$($result.Issues)```"
        }
    }
    
    if ($TestResults.Count -gt 0) {
        $report += "`n`n### Test Issues`n"
        foreach ($result in $TestResults) {
            $report += "`n**File**: $($result.File)`n"
            $report += "```$($result.Issues)```"
        }
    }
    
    $report += @"

## Recommendations

1. **Fix Linting Issues**: Address all ESLint warnings and errors
2. **Apply Formatting**: Use Prettier to ensure consistent code formatting
3. **Resolve Type Issues**: Fix TypeScript type errors and warnings
4. **Improve Test Coverage**: Add or fix failing tests

## Next Steps

1. Review and fix identified issues
2. Run tests to ensure functionality
3. Commit fixes to the PR
4. Request re-review if needed
"@
    
    return $report
}

# Main execution
try {
    Write-Host "Checking code quality for PR #$PRNumber..." -ForegroundColor Green
    
    $files = Get-PRFiles -PRNumber $PRNumber
    Write-Host "Found $($files.Count) changed files" -ForegroundColor Cyan
    
    # Run quality checks
    $lintResults = Run-Linting -Files $files
    $formatResults = Run-Formatting -Files $files
    $typeResults = Run-TypeChecking -Files $files
    
    if ($RunTests) {
        $testResults = Run-Tests -Files $files
    } else {
        $testResults = @()
    }
    
    # Apply fixes if requested
    if ($FixIssues) {
        Apply-Fixes -Files $files
    }
    
    # Generate report if requested
    if ($GenerateReport) {
        $report = Generate-QualityReport -LintResults $lintResults -FormatResults $formatResults -TypeResults $typeResults -TestResults $testResults -PRNumber $PRNumber
        $report | Out-File -FilePath "quality-report-pr-$PRNumber.md" -Encoding UTF8
        Write-Host "Quality report generated: quality-report-pr-$PRNumber.md" -ForegroundColor Green
    }
    
    # Display summary
    Write-Host "`n=== Quality Check Summary ===" -ForegroundColor Green
    Write-Host "Linting Issues: $($lintResults.Count)" -ForegroundColor $(if ($lintResults.Count -eq 0) { "Green" } else { "Red" })
    Write-Host "Formatting Issues: $($formatResults.Count)" -ForegroundColor $(if ($formatResults.Count -eq 0) { "Green" } else { "Yellow" })
    Write-Host "Type Checking Issues: $($typeResults.Count)" -ForegroundColor $(if ($typeResults.Count -eq 0) { "Green" } else { "Red" })
    Write-Host "Test Issues: $($testResults.Count)" -ForegroundColor $(if ($testResults.Count -eq 0) { "Green" } else { "Red" })
    
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
}
