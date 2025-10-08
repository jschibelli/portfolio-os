# Code Quality Tools - Developer's Guide

## Overview

The `code-quality` folder contains comprehensive tools for analyzing, maintaining, and improving code quality across the project. These tools help identify redundant scripts, analyze code quality issues, and provide automated fixes for common problems.

## 📁 Folder Structure

```
scripts/code-quality/
├── README.md                    # This comprehensive developer guide
├── analyze-cleanup-simple.ps1   # Simple script analysis and cleanup tool
├── analyze-cleanup-text.ps1     # Text-based script analysis tool
└── check-code-quality.ps1       # Comprehensive code quality checker
```

## 🛠️ Tools Overview

### 1. **Script Analysis and Cleanup Tools**

#### **`analyze-cleanup-simple.ps1`**
- **Purpose**: Identifies redundant and obsolete scripts in the project
- **Features**: 
  - Lists scripts that can be safely removed
  - Identifies scripts that should be kept
  - Calculates cleanup statistics and reduction percentages
  - Provides removal commands for batch cleanup

#### **`analyze-cleanup-text.ps1`**
- **Purpose**: Text-based version of script analysis with detailed output
- **Features**:
  - Comprehensive script categorization
  - Detailed cleanup recommendations
  - Batch removal command generation
  - Enhanced reporting format

### 2. **Code Quality Checker**

#### **`check-code-quality.ps1`**
- **Purpose**: Comprehensive code quality analysis for PRs
- **Features**:
  - Linting checks (ESLint)
  - Code formatting validation (Prettier)
  - TypeScript type checking
  - Test execution and validation
  - Automatic issue fixing
  - Detailed quality reports

## 🚀 Quick Start

### **Basic Usage**

```powershell
# Analyze scripts for cleanup opportunities
.\scripts\code-quality\analyze-cleanup-simple.ps1

# Check code quality for a specific PR
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123

# Generate detailed cleanup analysis
.\scripts\code-quality\analyze-cleanup-text.ps1
```

### **Advanced Usage**

```powershell
# Check code quality with fixes and tests
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123 -FixIssues -RunTests -GenerateReport

# Remove redundant scripts (after analysis)
Remove-Item 'script1.ps1', 'script2.ps1', 'script3.ps1'
```

## 📋 Detailed Tool Documentation

### **Script Analysis Tools**

#### **`analyze-cleanup-simple.ps1`**

**What it does:**
- Scans the project for redundant and obsolete scripts
- Categorizes scripts into "remove" and "keep" lists
- Calculates cleanup statistics and potential reduction
- Provides ready-to-use removal commands

**Key Features:**
- **Redundant Script Detection**: Identifies scripts replaced by unified versions
- **Script Categorization**: Separates useful scripts from obsolete ones
- **Statistics Calculation**: Shows cleanup potential and reduction percentages
- **Batch Commands**: Generates removal commands for multiple scripts

**Usage:**
```powershell
.\scripts\code-quality\analyze-cleanup-simple.ps1
```

**Output Example:**
```
🔍 Analyzing Scripts for Cleanup Opportunities
=============================================

🗑️  Scripts That Can Be Removed (Redundant):
  🗑️  pr-automation.ps1
  🗑️  pr-monitor.ps1
  🗑️  cr-gpt-analyzer.ps1

✅ Scripts To Keep (Still Useful):
  ✅ auto-configure-pr.ps1
  ✅ code-quality-checker.ps1
  ✅ docs-updater.ps1

📈 Cleanup Summary:
  Total Scripts: 25
  Can Remove: 8
  Reduction: 32%

🎯 Ready to remove 8 redundant scripts!
```

#### **`analyze-cleanup-text.ps1`**

**What it does:**
- Provides detailed text-based analysis of script cleanup opportunities
- Enhanced reporting with comprehensive categorization
- Detailed recommendations for script maintenance
- Batch removal command generation

**Key Features:**
- **Detailed Analysis**: Comprehensive script analysis with context
- **Enhanced Reporting**: Rich text output with detailed explanations
- **Batch Operations**: Support for removing multiple scripts at once
- **Maintenance Guidance**: Recommendations for ongoing script management

**Usage:**
```powershell
.\scripts\code-quality\analyze-cleanup-text.ps1
```

### **Code Quality Checker**

#### **`check-code-quality.ps1`**

**What it does:**
- Performs comprehensive code quality analysis on PR files
- Runs linting, formatting, type checking, and testing
- Provides automatic fixes for common issues
- Generates detailed quality reports

**Key Features:**
- **Multi-Tool Integration**: ESLint, Prettier, TypeScript, npm test
- **Automatic Fixes**: Can automatically fix linting and formatting issues
- **Comprehensive Reporting**: Detailed reports with recommendations
- **PR Integration**: Works directly with GitHub PRs

**Parameters:**
- `-PRNumber` (Required): GitHub PR number to analyze
- `-FixIssues` (Optional): Automatically fix issues where possible
- `-RunTests` (Optional): Execute test suite
- `-GenerateReport` (Optional): Generate detailed quality report

**Usage Examples:**
```powershell
# Basic quality check
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123

# Full analysis with fixes and tests
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123 -FixIssues -RunTests -GenerateReport

# Generate report only
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123 -GenerateReport
```

**Output Example:**
```
Checking code quality for PR #123...
Found 5 changed files
Running linting checks...
Linting: src/components/Button.tsx
Linting: src/utils/helpers.ts
Checking code formatting...
Formatting: src/components/Button.tsx
Running TypeScript type checking...
Running tests...

=== Quality Check Summary ===
Linting Issues: 2
Formatting Issues: 1
Type Checking Issues: 0
Test Issues: 0
```

## 🔧 Tool Functions

### **Script Analysis Functions**

#### **Redundant Script Detection**
- Identifies scripts replaced by unified versions
- Flags duplicate functionality
- Marks one-time setup scripts
- Categorizes obsolete automation scripts

#### **Script Categorization**
- **Keep Scripts**: Active, useful scripts
- **Remove Scripts**: Redundant, obsolete scripts
- **Analysis Scripts**: Tools for ongoing maintenance
- **Core Scripts**: Essential project functionality

### **Code Quality Functions**

#### **Linting Analysis**
- ESLint integration for JavaScript/TypeScript
- Configurable linting rules
- Error and warning detection
- Automatic fix capabilities

#### **Formatting Validation**
- Prettier integration for code formatting
- Consistent style enforcement
- Automatic formatting application
- Style deviation detection

#### **Type Checking**
- TypeScript compiler integration
- Type error detection
- Interface validation
- Generic type checking

#### **Test Execution**
- npm test integration
- Test suite validation
- Coverage analysis
- Failure detection and reporting

## 📊 Quality Metrics

### **Script Cleanup Metrics**
- **Total Scripts**: Count of all scripts in project
- **Redundant Scripts**: Scripts that can be removed
- **Reduction Percentage**: Potential cleanup percentage
- **Keep Ratio**: Percentage of scripts to retain

### **Code Quality Metrics**
- **Linting Issues**: ESLint warnings and errors
- **Formatting Issues**: Prettier style violations
- **Type Issues**: TypeScript type errors
- **Test Issues**: Test failures and coverage gaps

## 🎯 Best Practices

### **Script Maintenance**
1. **Regular Analysis**: Run cleanup analysis monthly
2. **Documentation**: Keep script purposes documented
3. **Version Control**: Track script changes and deprecations
4. **Testing**: Validate scripts before removal

### **Code Quality**
1. **Pre-commit Hooks**: Run quality checks before commits
2. **PR Integration**: Use quality checker in PR workflows
3. **Automated Fixes**: Apply automatic fixes where possible
4. **Continuous Monitoring**: Regular quality assessments

### **Tool Usage**
1. **Incremental Cleanup**: Remove scripts gradually
2. **Backup First**: Always backup before bulk operations
3. **Test Changes**: Validate functionality after cleanup
4. **Document Decisions**: Record cleanup rationale

## 🔍 Troubleshooting

### **Common Issues**

#### **Script Analysis Issues**
- **Missing Scripts**: Check file paths and permissions
- **False Positives**: Review script categorization logic
- **Permission Errors**: Ensure proper file access rights
- **Path Issues**: Verify working directory and script locations

#### **Code Quality Issues**
- **Missing Tools**: Install required tools (ESLint, Prettier, TypeScript)
- **Configuration**: Check tool configuration files
- **Dependencies**: Ensure all dependencies are installed
- **Environment**: Verify development environment setup

### **Solutions**

#### **Tool Installation**
```powershell
# Install required tools
npm install -g eslint prettier typescript
npm install --save-dev @types/node

# Verify installation
eslint --version
prettier --version
tsc --version
```

#### **Configuration Setup**
```json
// .eslintrc.json
{
  "extends": ["eslint:recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80
}
```

## 📈 Integration with Workflows

### **PR Workflow Integration**
```yaml
# GitHub Actions example
- name: Code Quality Check
  run: |
    .\scripts\code-quality\check-code-quality.ps1 -PRNumber ${{ github.event.pull_request.number }} -FixIssues -GenerateReport
```

### **Pre-commit Hooks**
```powershell
# Pre-commit script
.\scripts\code-quality\check-code-quality.ps1 -PRNumber $env:PR_NUMBER -FixIssues
```

### **Scheduled Cleanup**
```powershell
# Monthly cleanup script
.\scripts\code-quality\analyze-cleanup-simple.ps1
# Review output and remove redundant scripts
```

## 🚀 Future Enhancements

### **Planned Features**
- **AI-Powered Analysis**: Intelligent script categorization
- **Custom Rules**: Configurable cleanup rules
- **Integration**: Enhanced PR workflow integration
- **Metrics**: Advanced quality metrics and trends

### **Extension Points**
- **Custom Tools**: Add support for additional quality tools
- **Language Support**: Extend to other programming languages
- **CI/CD Integration**: Enhanced continuous integration support
- **Reporting**: Advanced reporting and analytics

## 📚 Additional Resources

### **Related Documentation**
- [Housekeeping Tools](../housekeeping/README.md)
- [Core Utilities](../core-utilities/README.md)
- [Automation Workflows](../automation/README.md)

### **External Tools**
- [ESLint Documentation](https://eslint.org/docs/)
- [Prettier Documentation](https://prettier.io/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### **Best Practices**
- [Code Quality Standards](https://github.com/features/code-quality)
- [Script Maintenance Guidelines](https://docs.microsoft.com/en-us/powershell/scripting/)
- [Automation Best Practices](https://docs.github.com/en/actions/learn-github-actions)

This comprehensive guide provides everything needed to effectively use the code quality tools for maintaining a clean, well-organized, and high-quality codebase.
