# Code Quality Tools - API Reference

## Overview

This document provides detailed API reference for all code quality tools, including function signatures, parameters, return values, and usage examples.

## 📁 Script Analysis Tools

### **analyze-cleanup-simple.ps1**

**Purpose**: Identifies redundant and obsolete scripts in the project

**Usage**:
```powershell
.\scripts\code-quality\analyze-cleanup-simple.ps1
```

**Output Format**:
```
🔍 Analyzing Scripts for Cleanup Opportunities
=============================================

🗑️  Scripts That Can Be Removed (Redundant):
  🗑️  script1.ps1
  🗑️  script2.ps1

✅ Scripts To Keep (Still Useful):
  ✅ script3.ps1
  ✅ script4.ps1

📈 Cleanup Summary:
  Total Scripts: 25
  Can Remove: 8
  Reduction: 32%

🎯 Ready to remove 8 redundant scripts!
```

**Key Features**:
- **Redundant Script Detection**: Identifies scripts replaced by unified versions
- **Script Categorization**: Separates useful scripts from obsolete ones
- **Statistics Calculation**: Shows cleanup potential and reduction percentages
- **Batch Commands**: Generates removal commands for multiple scripts

**Internal Variables**:
```powershell
$redundantScripts = @(
    "pr-automation.ps1",
    "pr-monitor.ps1",
    "cr-gpt-analyzer.ps1",
    # ... more scripts
)

$keepScripts = @(
    "auto-configure-pr.ps1",
    "code-quality-checker.ps1",
    "docs-updater.ps1",
    # ... more scripts
)
```

### **analyze-cleanup-text.ps1**

**Purpose**: Text-based version of script analysis with detailed output

**Usage**:
```powershell
.\scripts\code-quality\analyze-cleanup-text.ps1
```

**Output Format**:
```
Analyzing Scripts for Cleanup Opportunities
===========================================

SCRIPTS THAT CAN BE REMOVED (Redundant):
  REMOVE: script1.ps1
  REMOVE: script2.ps1

SCRIPTS TO KEEP (Still Useful):
  KEEP: script3.ps1
  KEEP: script4.ps1

CLEANUP SUMMARY:
  Total Scripts: 25
  Can Remove: 8
  Reduction: 32%

READY TO REMOVE 8 REDUNDANT SCRIPTS!

To remove them all, run:
  Remove-Item 'script1.ps1', 'script2.ps1', 'script3.ps1'
```

**Key Features**:
- **Detailed Analysis**: Comprehensive script analysis with context
- **Enhanced Reporting**: Rich text output with detailed explanations
- **Batch Operations**: Support for removing multiple scripts at once
- **Maintenance Guidance**: Recommendations for ongoing script management

## 🔍 Code Quality Checker

### **check-code-quality.ps1**

**Purpose**: Comprehensive code quality analysis for PRs

**Usage**:
```powershell
.\scripts\code-quality\check-code-quality.ps1 -PRNumber <PR_NUMBER> [-FixIssues] [-RunTests] [-GenerateReport]
```

**Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `-PRNumber` | string | ✅ | - | GitHub PR number to analyze |
| `-FixIssues` | switch | ❌ | $false | Automatically fix issues where possible |
| `-RunTests` | switch | ❌ | $false | Execute test suite |
| `-GenerateReport` | switch | ❌ | $false | Generate detailed quality report |

**Return Values**:
- **Exit Code 0**: Success
- **Exit Code 1**: Error occurred
- **Output**: Quality check summary to console
- **Files**: Optional quality report file

**Usage Examples**:
```powershell
# Basic quality check
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123

# Full analysis with fixes and tests
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123 -FixIssues -RunTests -GenerateReport

# Generate report only
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123 -GenerateReport
```

## 🔧 Internal Functions

### **Get-PRFiles**
```powershell
function Get-PRFiles {
    param([string]$PRNumber)
    
    $repoOwner = gh repo view --json owner -q .owner.login
    $repoName = gh repo view --json name -q .name
    
    $filesJson = gh api repos/$repoOwner/$repoName/pulls/$PRNumber/files
    $files = $filesJson | ConvertFrom-Json
    return $files
}
```

**Purpose**: Retrieves list of files changed in a PR

**Parameters**:
- `$PRNumber` (string): GitHub PR number

**Returns**: Array of file objects with properties:
- `filename`: File path
- `status`: File status (added, modified, deleted)
- `additions`: Number of lines added
- `deletions`: Number of lines deleted
- `changes`: Total number of changes

### **Run-Linting**
```powershell
function Run-Linting {
    param([array]$Files)
    
    Write-Host "Running linting checks..." -ForegroundColor Green
    
    $lintResults = @()
    
    foreach ($file in $Files) {
        if ($file.filename -match "\.(ts|tsx|js|jsx)$") {
            Write-Host "Linting: $($file.filename)" -ForegroundColor Cyan
            
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
```

**Purpose**: Runs ESLint linting checks on JavaScript/TypeScript files

**Parameters**:
- `$Files` (array): Array of file objects from Get-PRFiles

**Returns**: Array of linting result objects:
- `File`: File path
- `Issues`: Linting output/errors
- `Type`: "Linting"

### **Run-Formatting**
```powershell
function Run-Formatting {
    param([array]$Files)
    
    Write-Host "Checking code formatting..." -ForegroundColor Green
    
    $formatResults = @()
    
    foreach ($file in $Files) {
        if ($file.filename -match "\.(ts|tsx|js|jsx)$") {
            Write-Host "Formatting: $($file.filename)" -ForegroundColor Cyan
            
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
```

**Purpose**: Runs Prettier formatting checks on JavaScript/TypeScript files

**Parameters**:
- `$Files` (array): Array of file objects from Get-PRFiles

**Returns**: Array of formatting result objects:
- `File`: File path
- `Issues`: Formatting output/errors
- `Type`: "Formatting"

### **Run-TypeChecking**
```powershell
function Run-TypeChecking {
    param([array]$Files)
    
    Write-Host "Running TypeScript type checking..." -ForegroundColor Green
    
    $typeResults = @()
    
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
```

**Purpose**: Runs TypeScript type checking

**Parameters**:
- `$Files` (array): Array of file objects from Get-PRFiles

**Returns**: Array of type checking result objects:
- `File`: "TypeScript Project"
- `Issues`: Type checking output/errors
- `Type`: "Type Checking"

### **Run-Tests**
```powershell
function Run-Tests {
    param([array]$Files)
    
    Write-Host "Running tests..." -ForegroundColor Green
    
    $testResults = @()
    
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
```

**Purpose**: Runs test suite

**Parameters**:
- `$Files` (array): Array of file objects from Get-PRFiles

**Returns**: Array of test result objects:
- `File`: "Test Suite"
- `Issues`: Test output/errors
- `Type`: "Testing"

### **Apply-Fixes**
```powershell
function Apply-Fixes {
    param([array]$Files)
    
    Write-Host "Applying automatic fixes..." -ForegroundColor Green
    
    foreach ($file in $Files) {
        if ($file.filename -match "\.(ts|tsx|js|jsx)$") {
            Write-Host "Fixing: $($file.filename)" -ForegroundColor Cyan
            
            if (Get-Command "eslint" -ErrorAction SilentlyContinue) {
                eslint --fix $file.filename
            }
            
            if (Get-Command "prettier" -ErrorAction SilentlyContinue) {
                prettier --write $file.filename
            }
        }
    }
}
```

**Purpose**: Applies automatic fixes to files

**Parameters**:
- `$Files` (array): Array of file objects from Get-PRFiles

**Returns**: None (modifies files in place)

**Actions**:
- Runs `eslint --fix` on JavaScript/TypeScript files
- Runs `prettier --write` on JavaScript/TypeScript files

### **Generate-QualityReport**
```powershell
function Generate-QualityReport {
    param(
        [array]$LintResults,
        [array]$FormatResults,
        [array]$TypeResults,
        [array]$TestResults,
        [string]$PRNumber
    )
    
    $report = "# Code Quality Report for PR #$PRNumber`n`n"
    $report += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n`n"
    $report += "## Summary`n"
    $report += "- Linting Issues: $($LintResults.Count)`n"
    $report += "- Formatting Issues: $($FormatResults.Count)`n"
    $report += "- Type Checking Issues: $($TypeResults.Count)`n"
    $report += "- Test Issues: $($TestResults.Count)`n`n"
    $report += "## Detailed Results`n"
    
    # ... detailed report generation ...
    
    return $report
}
```

**Purpose**: Generates detailed quality report

**Parameters**:
- `$LintResults` (array): Linting result objects
- `$FormatResults` (array): Formatting result objects
- `$TypeResults` (array): Type checking result objects
- `$TestResults` (array): Test result objects
- `$PRNumber` (string): PR number for report title

**Returns**: String containing markdown-formatted report

**Report Structure**:
- Header with PR number and timestamp
- Summary with issue counts
- Detailed results by category
- Recommendations for improvement
- Next steps for resolution

## 📊 Data Structures

### **File Object**
```powershell
@{
    filename = "src/components/Button.tsx"
    status = "modified"
    additions = 15
    deletions = 3
    changes = 18
}
```

### **Quality Result Object**
```powershell
@{
    File = "src/components/Button.tsx"
    Issues = "Error: 'unusedVariable' is assigned a value but never used"
    Type = "Linting"
}
```

### **Report Object**
```powershell
@{
    LintResults = @()
    FormatResults = @()
    TypeResults = @()
    TestResults = @()
    PRNumber = "123"
    Generated = "2024-01-15 14:30:00"
}
```

## 🔧 Configuration

### **ESLint Configuration**
```json
{
  "extends": ["eslint:recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-console": "warn",
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  }
}
```

### **Prettier Configuration**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### **TypeScript Configuration**
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 🚀 Usage Patterns

### **Basic Quality Check**
```powershell
# Check quality for PR
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123
```

### **Comprehensive Analysis**
```powershell
# Full analysis with fixes and tests
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123 -FixIssues -RunTests -GenerateReport
```

### **Batch Processing**
```powershell
# Process multiple PRs
$openPRs = gh pr list --state open --json number
foreach ($pr in $openPRs) {
    .\scripts\code-quality\check-code-quality.ps1 -PRNumber $pr.number -GenerateReport
}
```

### **Integration with Workflows**
```powershell
# Pre-commit hook
.\scripts\code-quality\check-code-quality.ps1 -PRNumber $env:PR_NUMBER -FixIssues

# CI/CD pipeline
.\scripts\code-quality\check-code-quality.ps1 -PRNumber ${{ github.event.pull_request.number }} -FixIssues -GenerateReport
```

## 🔍 Error Handling

### **Common Errors**
- **Tool not found**: Install required tools (eslint, prettier, typescript)
- **Permission denied**: Check execution policy and file permissions
- **Configuration error**: Verify tool configuration files
- **PR not found**: Check PR number and GitHub CLI authentication

### **Error Codes**
- **Exit Code 0**: Success
- **Exit Code 1**: General error
- **Exit Code 2**: Configuration error
- **Exit Code 3**: Tool not found
- **Exit Code 4**: Permission denied

### **Error Messages**
- **"Tool not found"**: Required tool is not installed
- **"Permission denied"**: Insufficient permissions
- **"Configuration error"**: Tool configuration is invalid
- **"PR not found"**: GitHub PR does not exist or is not accessible

This API reference provides comprehensive documentation for all code quality tools, enabling developers to effectively use and integrate these tools into their workflows.
