# Pull Request Automation Guide

## Overview
This guide covers the comprehensive automation system for working with pull requests, including CR-GPT bot integration, automated analysis, and intelligent responses.

## Quick Start

### 1. Monitor PR Activity
```powershell
# Monitor a specific PR
.\scripts\pr-monitor.ps1 -PRNumber 72

# Watch for changes in real-time
.\scripts\pr-monitor.ps1 -PRNumber 72 -WatchMode -Interval 30
```

### 2. Analyze CR-GPT Comments
```powershell
# Analyze all CR-GPT comments
.\scripts\cr-gpt-analyzer.ps1 -PRNumber 72 -GenerateReport

# Export analysis to file
.\scripts\cr-gpt-analyzer.ps1 -PRNumber 72 -GenerateReport -ExportTo "analysis.md"
```

### 3. Auto-respond to Feedback
```powershell
# Generate responses to all comments
.\scripts\auto-response-generator.ps1 -PRNumber 72 -AutoFix

# Respond to specific comment
.\scripts\auto-response-generator.ps1 -PRNumber 72 -CommentId 123456 -AutoFix

# Dry run (preview without posting)
.\scripts\auto-response-generator.ps1 -PRNumber 72 -DryRun
```

### 4. Check Code Quality
```powershell
# Run quality checks
.\scripts\code-quality-checker.ps1 -PRNumber 72 -FixIssues -RunTests

# Generate quality report
.\scripts\code-quality-checker.ps1 -PRNumber 72 -GenerateReport
```

### 5. Update Documentation
```powershell
# Update all documentation
.\scripts\docs-updater.ps1 -PRNumber 72 -UpdateChangelog -UpdateReadme -GenerateDocs
```

### 6. Run All Automation
```powershell
# Run complete automation pipeline
.\scripts\pr-automation.ps1 -PRNumber 72 -Action all
```

## Detailed Usage

### PR Monitor (`pr-monitor.ps1`)
Monitors pull request activity and CR-GPT bot comments.

**Features:**
- Real-time monitoring
- CR-GPT comment detection
- Activity notifications
- Status summaries

**Usage:**
```powershell
.\scripts\pr-monitor.ps1 -PRNumber <PR_NUMBER> [-WatchMode] [-Interval <SECONDS>]
```

**Examples:**
```powershell
# Basic monitoring
.\scripts\pr-monitor.ps1 -PRNumber 72

# Watch mode with 30-second intervals
.\scripts\pr-monitor.ps1 -PRNumber 72 -WatchMode -Interval 30
```

### CR-GPT Analyzer (`cr-gpt-analyzer.ps1`)
Analyzes CR-GPT bot comments and generates actionable insights.

**Features:**
- Comment categorization
- Priority assessment
- Action item extraction
- Report generation

**Usage:**
```powershell
.\scripts\cr-gpt-analyzer.ps1 -PRNumber <PR_NUMBER> [-GenerateReport] [-ExportTo <FILE>]
```

**Examples:**
```powershell
# Basic analysis
.\scripts\cr-gpt-analyzer.ps1 -PRNumber 72

# Generate detailed report
.\scripts\cr-gpt-analyzer.ps1 -PRNumber 72 -GenerateReport

# Export to specific file
.\scripts\cr-gpt-analyzer.ps1 -PRNumber 72 -GenerateReport -ExportTo "analysis.md"
```

### Auto Response Generator (`auto-response-generator.ps1`)
Automatically generates and posts responses to CR-GPT bot comments.

**Features:**
- Intelligent response generation
- Automatic fix application
- Comment-specific responses
- Dry run mode

**Usage:**
```powershell
.\scripts\auto-response-generator.ps1 -PRNumber <PR_NUMBER> [-CommentId <COMMENT_ID>] [-AutoFix] [-DryRun]
```

**Examples:**
```powershell
# Respond to all comments
.\scripts\auto-response-generator.ps1 -PRNumber 72 -AutoFix

# Respond to specific comment
.\scripts\auto-response-generator.ps1 -PRNumber 72 -CommentId 123456 -AutoFix

# Preview responses without posting
.\scripts\auto-response-generator.ps1 -PRNumber 72 -DryRun
```

### Code Quality Checker (`code-quality-checker.ps1`)
Runs comprehensive code quality checks and applies fixes.

**Features:**
- Linting and formatting
- Type checking
- Test execution
- Automatic fixes
- Quality reports

**Usage:**
```powershell
.\scripts\code-quality-checker.ps1 -PRNumber <PR_NUMBER> [-FixIssues] [-RunTests] [-GenerateReport]
```

**Examples:**
```powershell
# Basic quality check
.\scripts\code-quality-checker.ps1 -PRNumber 72

# Fix issues and run tests
.\scripts\code-quality-checker.ps1 -PRNumber 72 -FixIssues -RunTests

# Generate quality report
.\scripts\code-quality-checker.ps1 -PRNumber 72 -GenerateReport
```

### Documentation Updater (`docs-updater.ps1`)
Updates documentation based on PR changes.

**Features:**
- Changelog updates
- README updates
- API documentation
- PR documentation

**Usage:**
```powershell
.\scripts\docs-updater.ps1 -PRNumber <PR_NUMBER> [-UpdateChangelog] [-UpdateReadme] [-GenerateDocs]
```

**Examples:**
```powershell
# Update all documentation
.\scripts\docs-updater.ps1 -PRNumber 72 -UpdateChangelog -UpdateReadme -GenerateDocs

# Update only changelog
.\scripts\docs-updater.ps1 -PRNumber 72 -UpdateChangelog
```

### Master Automation (`pr-automation.ps1`)
Runs the complete automation pipeline.

**Features:**
- Complete automation workflow
- Individual action execution
- Progress tracking
- Summary reporting

**Usage:**
```powershell
.\scripts\pr-automation.ps1 -PRNumber <PR_NUMBER> [-Action <ACTION>] [-All]
```

**Actions:**
- `monitor` - Monitor PR activity
- `analyze` - Analyze CR-GPT comments
- `respond` - Generate responses
- `quality` - Run quality checks
- `docs` - Update documentation
- `all` - Run all steps

**Examples:**
```powershell
# Run all automation
.\scripts\pr-automation.ps1 -PRNumber 72 -Action all

# Run specific action
.\scripts\pr-automation.ps1 -PRNumber 72 -Action analyze
```

## GitHub Actions Integration

The automation system includes GitHub Actions workflows for continuous integration.

### Workflow Features
- Automatic PR monitoring
- Quality checks on every PR
- Documentation updates
- Artifact generation

### Workflow Triggers
- PR opened
- PR synchronized
- Review requested
- Review submitted

## Best Practices

### 1. Always Review Automated Changes
- Check generated responses before posting
- Verify quality fixes are appropriate
- Review documentation updates

### 2. Use Dry Run Mode
- Test responses before posting
- Preview changes before applying
- Validate automation logic

### 3. Monitor Automation Results
- Check generated reports
- Verify all steps completed
- Address any failures

### 4. Maintain Human Oversight
- Review CR-GPT analysis
- Validate automated responses
- Ensure quality standards

### 5. Document Automation
- Keep automation scripts updated
- Document any customizations
- Maintain clear usage guidelines

## Troubleshooting

### Common Issues

1. **Script Execution Errors**
   - Check PowerShell execution policy
   - Verify GitHub CLI authentication
   - Ensure all dependencies are installed

2. **API Rate Limits**
   - Use appropriate intervals for monitoring
   - Implement retry logic for failed requests
   - Monitor API usage

3. **Permission Issues**
   - Verify GitHub token permissions
   - Check repository access
   - Ensure proper authentication

### Debug Mode
```powershell
# Enable verbose output
$VerbosePreference = "Continue"
.\scripts\pr-automation.ps1 -PRNumber 72 -Action all
```

## Future Enhancements

### Planned Features
- AI-powered code suggestions
- Automated test generation
- Performance optimization
- Security scanning
- Dependency updates

### Integration Opportunities
- IDE extensions
- Slack notifications
- Email alerts
- Dashboard integration

## Conclusion

This automation system provides comprehensive tools for working with pull requests and CR-GPT bot comments. By following the guidelines and best practices, you can significantly improve your development workflow and code quality.

For additional support or feature requests, please refer to the project documentation or create an issue in the repository.
