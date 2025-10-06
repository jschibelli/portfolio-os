# Code Quality Tools - Quick Reference

## 🚀 Quick Commands

### **Script Analysis**
```powershell
# Simple analysis
.\scripts\code-quality\analyze-cleanup-simple.ps1

# Detailed analysis
.\scripts\code-quality\analyze-cleanup-text.ps1
```

### **Code Quality Check**
```powershell
# Basic check
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123

# Full check with fixes
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123 -FixIssues -RunTests -GenerateReport
```

## 📋 Tool Parameters

### **check-code-quality.ps1**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `-PRNumber` | string | ✅ | GitHub PR number to analyze |
| `-FixIssues` | switch | ❌ | Automatically fix issues |
| `-RunTests` | switch | ❌ | Execute test suite |
| `-GenerateReport` | switch | ❌ | Generate detailed report |

## 🔧 Common Tasks

### **Remove Redundant Scripts**
```powershell
# 1. Analyze first
.\scripts\code-quality\analyze-cleanup-simple.ps1

# 2. Review output
# 3. Remove scripts (one by one)
Remove-Item "script1.ps1"

# 4. Or batch remove
Remove-Item "script1.ps1", "script2.ps1", "script3.ps1"
```

### **Fix Code Quality Issues**
```powershell
# Auto-fix issues
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123 -FixIssues

# Generate report for manual fixes
.\scripts\code-quality\check-code-quality.ps1 -PRNumber 123 -GenerateReport
```

### **Batch Process Multiple PRs**
```powershell
# Get all open PRs
$openPRs = gh pr list --state open --json number

foreach ($pr in $openPRs) {
    .\scripts\code-quality\check-code-quality.ps1 -PRNumber $pr.number -GenerateReport
}
```

## 📊 Quality Metrics

### **Script Cleanup Metrics**
- **Total Scripts**: Count of all scripts
- **Redundant Scripts**: Scripts that can be removed
- **Reduction %**: Potential cleanup percentage
- **Keep Ratio**: Percentage of scripts to retain

### **Code Quality Metrics**
- **Linting Issues**: ESLint warnings/errors
- **Formatting Issues**: Prettier violations
- **Type Issues**: TypeScript errors
- **Test Issues**: Test failures

## 🛠️ Tool Dependencies

### **Required Tools**
```powershell
# Install Node.js tools
npm install -g eslint prettier typescript

# Verify installation
eslint --version
prettier --version
tsc --version
```

### **Configuration Files**
```json
// .eslintrc.json
{
  "extends": ["eslint:recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"]
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

## 🔍 Troubleshooting

### **Common Issues**
| Issue | Solution |
|-------|----------|
| Tool not found | `npm install -g eslint prettier typescript` |
| Permission error | `Set-ExecutionPolicy RemoteSigned` |
| Configuration error | Check `.eslintrc.json` and `.prettierrc` |
| PR not found | Verify PR number and GitHub CLI auth |

### **Quick Fixes**
```powershell
# Fix execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Check GitHub CLI auth
gh auth status

# Verify tool versions
eslint --version && prettier --version && tsc --version
```

## 📈 Integration Examples

### **Pre-commit Hook**
```powershell
# .git/hooks/pre-commit
#!/usr/bin/env pwsh
.\scripts\code-quality\check-code-quality.ps1 -PRNumber $env:PR_NUMBER -FixIssues
```

### **GitHub Actions**
```yaml
# .github/workflows/quality.yml
name: Quality Check
on: [pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run quality check
        run: .\scripts\code-quality\check-code-quality.ps1 -PRNumber ${{ github.event.pull_request.number }} -FixIssues
```

### **Scheduled Cleanup**
```powershell
# Monthly cleanup
.\scripts\code-quality\analyze-cleanup-simple.ps1
# Review and remove redundant scripts
```

## 🎯 Best Practices

### **Script Maintenance**
- ✅ Run analysis monthly
- ✅ Remove redundant scripts gradually
- ✅ Test functionality after cleanup
- ✅ Document cleanup decisions

### **Code Quality**
- ✅ Check quality on every PR
- ✅ Fix issues automatically when possible
- ✅ Generate reports for manual fixes
- ✅ Integrate into CI/CD pipeline

### **Tool Usage**
- ✅ Start with simple analysis
- ✅ Review recommendations before acting
- ✅ Test changes incrementally
- ✅ Keep tools updated

## 📚 File Locations

### **Scripts**
- `scripts/code-quality/analyze-cleanup-simple.ps1`
- `scripts/code-quality/analyze-cleanup-text.ps1`
- `scripts/code-quality/check-code-quality.ps1`

### **Configuration**
- `.eslintrc.json` (ESLint configuration)
- `.prettierrc` (Prettier configuration)
- `tsconfig.json` (TypeScript configuration)

### **Reports**
- `quality-report-pr-{PR_NUMBER}.md` (Generated quality reports)

## 🚀 Quick Start Checklist

- [ ] Install required tools (`eslint`, `prettier`, `typescript`)
- [ ] Configure tools (`.eslintrc.json`, `.prettierrc`)
- [ ] Run script analysis (`analyze-cleanup-simple.ps1`)
- [ ] Review and remove redundant scripts
- [ ] Test code quality on a PR (`check-code-quality.ps1`)
- [ ] Integrate into workflow (pre-commit, CI/CD)
- [ ] Set up regular maintenance schedule

## 💡 Pro Tips

1. **Start Small**: Begin with simple analysis before complex cleanup
2. **Test First**: Always test functionality after changes
3. **Document**: Keep track of cleanup decisions and rationale
4. **Automate**: Integrate tools into your workflow for consistency
5. **Monitor**: Track quality metrics over time for continuous improvement
