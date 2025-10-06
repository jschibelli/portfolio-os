# Code Quality Tools - Step-by-Step Tutorial

## Overview

This tutorial provides a comprehensive, step-by-step guide to using the code quality tools effectively. Follow these steps to maintain a clean, well-organized codebase with high quality standards.

## 🎯 Tutorial Objectives

By the end of this tutorial, you will:
- Understand how to analyze and clean up redundant scripts
- Know how to perform comprehensive code quality checks
- Be able to integrate quality tools into your workflow
- Have the skills to maintain code quality standards

## 📋 Prerequisites

- PowerShell 5.1 or later
- Node.js and npm (for code quality tools)
- GitHub CLI (for PR integration)
- Basic understanding of PowerShell scripting

## 🚀 Step 1: Script Analysis and Cleanup

### **1.1 Initial Script Analysis**

Start by analyzing your project for redundant scripts:

```powershell
# Navigate to your project root
cd C:\Users\jschi\OneDrive\Desktop\2025_portfolio\portfolio-os

# Run the simple analysis tool
.\scripts\code-quality\analyze-cleanup-simple.ps1
```

**Expected Output:**
```
🔍 Analyzing Scripts for Cleanup Opportunities
=============================================

🗑️  Scripts That Can Be Removed (Redundant):
  🗑️  pr-automation.ps1
  🗑️  pr-monitor.ps1
  🗑️  cr-gpt-analyzer.ps1
  🗑️  auto-response-generator.ps1
  🗑️  fast-pr-workflow.ps1

✅ Scripts To Keep (Still Useful):
  ✅ auto-configure-pr.ps1
  ✅ code-quality-checker.ps1
  ✅ docs-updater.ps1
  ✅ issue-analyzer.ps1

📈 Cleanup Summary:
  Total Scripts: 25
  Can Remove: 8
  Reduction: 32%

🎯 Ready to remove 8 redundant scripts!
```

### **1.2 Detailed Analysis**

For more detailed analysis, use the text-based tool:

```powershell
# Run detailed analysis
.\scripts\code-quality\analyze-cleanup-text.ps1
```

This provides:
- Comprehensive script categorization
- Detailed explanations for each recommendation
- Enhanced reporting format
- Batch removal commands

### **1.3 Review and Validate**

Before removing scripts, review the recommendations:

1. **Check Script Dependencies**: Ensure no other scripts depend on the ones marked for removal
2. **Verify Functionality**: Confirm that unified scripts provide the same functionality
3. **Test Critical Paths**: Run tests to ensure nothing breaks

### **1.4 Safe Removal Process**

Remove scripts gradually and safely:

```powershell
# Step 1: Backup first (optional but recommended)
Copy-Item -Path "scripts" -Destination "scripts-backup" -Recurse

# Step 2: Remove one script at a time to test
Remove-Item "pr-automation.ps1"

# Step 3: Test functionality
.\scripts\automation\pr-automation-unified.ps1 -PRNumber 123

# Step 4: If successful, continue with others
Remove-Item "pr-monitor.ps1", "cr-gpt-analyzer.ps1"
```

### **1.5 Batch Removal (Advanced)**

If you're confident in the analysis, remove multiple scripts:

```powershell
# Get the list of redundant scripts
$redundantScripts = @("pr-automation.ps1", "pr-monitor.ps1", "cr-gpt-analyzer.ps1")

# Remove them all
Remove-Item $redundantScripts

# Verify removal
Get-ChildItem -Path "." -Filter "*.ps1" | Select-Object Name
```

## 🔍 Step 2: Code Quality Analysis

### **2.1 Basic Quality Check**

Start with a basic quality check for a PR:

```powershell
# Check quality for a specific PR
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123
```

**Expected Output:**
```
Checking code quality for PR #123...
Found 5 changed files
Running linting checks...
Linting: src/components/Button.tsx
Linting: src/utils/helpers.ts
Checking code formatting...
Formatting: src/components/Button.tsx
Running TypeScript type checking...

=== Quality Check Summary ===
Linting Issues: 2
Formatting Issues: 1
Type Checking Issues: 0
Test Issues: 0
```

### **2.2 Comprehensive Quality Check**

For thorough analysis, include fixes and tests:

```powershell
# Full quality check with fixes and tests
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123 -FixIssues -RunTests -GenerateReport
```

This will:
- Run all quality checks
- Automatically fix issues where possible
- Execute the test suite
- Generate a detailed report

### **2.3 Understanding Quality Issues**

#### **Linting Issues**
- **ESLint Errors**: Code style and best practice violations
- **Common Issues**: Unused variables, missing semicolons, inconsistent formatting
- **Auto-fixable**: Many issues can be automatically fixed

#### **Formatting Issues**
- **Prettier Violations**: Inconsistent code formatting
- **Style Issues**: Indentation, spacing, line length
- **Auto-fixable**: All formatting issues can be automatically fixed

#### **Type Checking Issues**
- **TypeScript Errors**: Type mismatches and errors
- **Interface Issues**: Missing or incorrect type definitions
- **Requires Manual Fix**: Usually requires code changes

#### **Test Issues**
- **Test Failures**: Failing unit tests
- **Coverage Issues**: Insufficient test coverage
- **Requires Investigation**: May indicate code problems

### **2.4 Fixing Quality Issues**

#### **Automatic Fixes**
```powershell
# Apply automatic fixes
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123 -FixIssues
```

This will:
- Fix ESLint issues that can be auto-fixed
- Apply Prettier formatting
- Update code style automatically

#### **Manual Fixes**
For issues that can't be auto-fixed:

1. **Review the Report**: Check the generated quality report
2. **Identify Issues**: Focus on critical issues first
3. **Fix Incrementally**: Address one type of issue at a time
4. **Test Changes**: Verify fixes don't break functionality

## 📊 Step 3: Quality Reporting

### **3.1 Generate Quality Reports**

Create detailed quality reports:

```powershell
# Generate comprehensive report
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123 -GenerateReport
```

**Report Contents:**
- Summary of all quality issues
- Detailed breakdown by category
- Specific file and line information
- Recommendations for improvement
- Next steps for resolution

### **3.2 Understanding Reports**

#### **Report Structure**
```
# Code Quality Report for PR #123

Generated: 2024-01-15 14:30:00

## Summary
- Linting Issues: 2
- Formatting Issues: 1
- Type Checking Issues: 0
- Test Issues: 0

## Detailed Results

### Linting Issues
**File**: src/components/Button.tsx
```
Error: 'unusedVariable' is assigned a value but never used
```

### Formatting Issues
**File**: src/utils/helpers.ts
```
Error: Expected indentation of 2 spaces but found 4
```

## Recommendations
1. Fix Linting Issues: Address all ESLint warnings and errors
2. Apply Formatting: Use Prettier to ensure consistent code formatting
3. Resolve Type Issues: Fix TypeScript type errors and warnings
4. Improve Test Coverage: Add or fix failing tests

## Next Steps
1. Review and fix identified issues
2. Run tests to ensure functionality
3. Commit fixes to the PR
4. Request re-review if needed
```

### **3.3 Using Reports for Improvement**

1. **Prioritize Issues**: Focus on critical issues first
2. **Track Progress**: Monitor improvement over time
3. **Team Standards**: Use reports to establish quality standards
4. **Continuous Improvement**: Regular quality assessments

## 🔧 Step 4: Tool Configuration

### **4.1 ESLint Configuration**

Create or update `.eslintrc.json`:

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

### **4.2 Prettier Configuration**

Create or update `.prettierrc`:

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

### **4.3 TypeScript Configuration**

Ensure `tsconfig.json` is properly configured:

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

## 🚀 Step 5: Workflow Integration

### **5.1 Pre-commit Hooks**

Set up pre-commit quality checks:

```powershell
# Create pre-commit script
@"
#!/usr/bin/env pwsh
# Pre-commit quality check
.\scripts\code-quality\check-code-quality.ps1 -PRNumber `$env:PR_NUMBER -FixIssues
"@ | Out-File -FilePath ".git\hooks\pre-commit" -Encoding UTF8
```

### **5.2 GitHub Actions Integration**

Create `.github/workflows/quality-check.yml`:

```yaml
name: Code Quality Check
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run quality check
        run: |
          .\scripts\code-quality\check-code-quality.ps1 -PRNumber ${{ github.event.pull_request.number }} -FixIssues -GenerateReport
```

### **5.3 Scheduled Cleanup**

Set up regular script cleanup:

```powershell
# Create monthly cleanup script
@"
# Monthly script cleanup
Write-Host "Running monthly script cleanup..." -ForegroundColor Blue
.\scripts\code-quality\analyze-cleanup-simple.ps1
# Review output and remove redundant scripts as needed
"@ | Out-File -FilePath "scripts\maintenance\monthly-cleanup.ps1" -Encoding UTF8
```

## 📈 Step 6: Advanced Usage

### **6.1 Custom Quality Rules**

Create custom quality rules:

```powershell
# Custom quality checker
function Test-CustomQuality {
    param([string]$FilePath)
    
    $content = Get-Content $FilePath
    $issues = @()
    
    # Check for TODO comments
    if ($content -match "TODO|FIXME|HACK") {
        $issues += "Contains TODO/FIXME/HACK comments"
    }
    
    # Check for console.log statements
    if ($content -match "console\.log") {
        $issues += "Contains console.log statements"
    }
    
    return $issues
}
```

### **6.2 Batch Processing**

Process multiple PRs:

```powershell
# Get all open PRs
$openPRs = gh pr list --state open --json number

foreach ($pr in $openPRs) {
    Write-Host "Checking quality for PR #$($pr.number)..." -ForegroundColor Cyan
    .\scripts\code-quality\check-code-quality.ps1 -PRNumber $pr.number -GenerateReport
}
```

### **6.3 Quality Metrics**

Track quality metrics over time:

```powershell
# Quality metrics script
function Get-QualityMetrics {
    $metrics = @{
        TotalPRs = 0
        QualityIssues = 0
        AutoFixed = 0
        ManualFixed = 0
    }
    
    # Implementation here...
    
    return $metrics
}
```

## 🎯 Step 7: Best Practices

### **7.1 Regular Maintenance**

- **Weekly**: Run script analysis
- **Per PR**: Run quality checks
- **Monthly**: Comprehensive cleanup
- **Quarterly**: Review and update tools

### **7.2 Team Standards**

- **Establish Guidelines**: Define quality standards
- **Training**: Ensure team knows how to use tools
- **Documentation**: Keep standards documented
- **Enforcement**: Use tools to enforce standards

### **7.3 Continuous Improvement**

- **Monitor Metrics**: Track quality trends
- **Update Tools**: Keep tools current
- **Refine Rules**: Adjust quality rules as needed
- **Share Knowledge**: Document lessons learned

## 🔍 Troubleshooting

### **Common Issues**

#### **Tool Not Found**
```powershell
# Install missing tools
npm install -g eslint prettier typescript
```

#### **Permission Errors**
```powershell
# Fix execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### **Configuration Issues**
```powershell
# Check tool versions
eslint --version
prettier --version
tsc --version
```

### **Solutions**

1. **Check Dependencies**: Ensure all required tools are installed
2. **Verify Configuration**: Check tool configuration files
3. **Test Individually**: Run tools separately to isolate issues
4. **Check Permissions**: Ensure proper file access rights

## 📚 Next Steps

After completing this tutorial:

1. **Practice**: Use the tools regularly
2. **Customize**: Adapt tools to your project needs
3. **Integrate**: Add tools to your workflow
4. **Share**: Help team members learn the tools
5. **Improve**: Continuously refine your quality process

## 🎉 Conclusion

You now have the knowledge and skills to:
- Effectively analyze and clean up redundant scripts
- Perform comprehensive code quality checks
- Integrate quality tools into your workflow
- Maintain high code quality standards

Remember: Quality is an ongoing process, not a one-time activity. Use these tools regularly to maintain a clean, well-organized, and high-quality codebase.
