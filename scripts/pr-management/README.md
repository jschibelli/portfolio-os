# PR Management System

This directory contains comprehensive pull request management and automation tools for the Portfolio OS project, providing intelligent PR analysis, automated configuration, agent assignment, quality assurance, and workflow optimization.

## 📁 Structure

```
scripts/pr-management/
├── automate-pr-unified.ps1     # Main PR automation system
├── configure-pr-auto.ps1       # Automated PR configuration
├── assign-pr-agents.ps1        # Agent assignment system
├── configure-sprint-estimate.ps1 # Sprint estimation tools
├── get-pr-aliases.ps1          # PR alias management
├── test-pr-identification.ps1  # PR testing utilities
├── pr-monitor.ps1              # Real-time PR monitoring
├── pr-analyzer.ps1             # Comprehensive PR analysis
├── pr-quality-checker.ps1      # Quality assurance tools
├── data/                       # PR data storage
├── DEVELOPER_GUIDE.md          # Complete developer documentation
└── README.md                   # This file
```

## 🚀 Quick Start

### Basic PR Analysis
```powershell
.\pr-analyzer.ps1 -PRNumber 150 -Analysis comprehensive
```

### Automated PR Configuration
```powershell
.\configure-pr-auto.ps1 -PRNumber 150 -Priority P1 -Size M
```

### Agent Assignment
```powershell
.\assign-pr-agents.ps1 -ProjectNumber "20" -Owner "jschibelli"
```

### Quality Checking
```powershell
.\pr-quality-checker.ps1 -PRNumber 150 -Checks all -AutoFix
```

## 📊 Core Scripts

### `automate-pr-unified.ps1`
**Purpose**: Comprehensive PR automation with AI-powered analysis and response generation

**Key Actions**:
- `analyze`: AI-powered PR analysis and CR-GPT comment processing
- `respond`: Automated response generation to feedback
- `monitor`: Continuous PR monitoring and status updates
- `all`: Complete end-to-end PR automation workflow

**Usage Examples**:
```powershell
# Complete PR automation
.\automate-pr-unified.ps1 -PRNumber 150 -Action all -AutoFix

# Analyze CR-GPT comments
.\automate-pr-unified.ps1 -PRNumber 150 -Action analyze -Detailed

# Generate automated responses
.\automate-pr-unified.ps1 -PRNumber 150 -Action respond -AutoFix

# Monitor PR progress
.\automate-pr-unified.ps1 -PRNumber 150 -Action monitor
```

### `configure-pr-auto.ps1`
**Purpose**: Automated PR configuration with comprehensive field management

**Features**:
- Status assignment (Todo, In progress, Ready, Done)
- Priority classification (P0-P3)
- Size estimation (XS-XL)
- App categorization (Portfolio Site, Dashboard, Docs, Infra)
- Area specification (Frontend, Backend, Infra, Content, Design)
- Assignee management

**Usage Examples**:
```powershell
# Configure with defaults
.\configure-pr-auto.ps1 -PRNumber 150

# Configure with specific settings
.\configure-pr-auto.ps1 -PRNumber 150 -Priority P0 -Size L -App "Dashboard" -Area "Backend"

# Preview changes (dry run)
.\configure-pr-auto.ps1 -PRNumber 150 -DryRun
```

### `assign-pr-agents.ps1`
**Purpose**: Intelligent PR assignment and agent workload management

**Features**:
- PR complexity analysis
- CR-GPT comment categorization
- Agent workload balancing
- Priority-based assignment
- Performance tracking

**Usage Examples**:
```powershell
# Assign PRs to agents
.\assign-pr-agents.ps1 -ProjectNumber "20" -Owner "jschibelli"

# Preview assignments
.\assign-pr-agents.ps1 -ProjectNumber "20" -DryRun

# Export assignment report
.\assign-pr-agents.ps1 -ProjectNumber "20" -ExportTo "assignment-report.md"
```

### `pr-monitor.ps1`
**Purpose**: Real-time PR monitoring and status tracking

**Features**:
- Real-time PR status updates
- CR-GPT comment monitoring
- PR progress tracking
- Alert notifications
- Export capabilities

**Usage Examples**:
```powershell
# Monitor open PRs
.\pr-monitor.ps1 -Filter open -ShowDetails

# Watch mode with custom interval
.\pr-monitor.ps1 -WatchMode -Interval 30 -IncludeCRGPT

# Export PR report
.\pr-monitor.ps1 -Filter open -ExportTo "pr-report.json"
```

### `pr-analyzer.ps1`
**Purpose**: Comprehensive PR analysis and assessment

**Analysis Types**:
- `comprehensive`: Complete PR analysis
- `security`: Security vulnerability assessment
- `performance`: Performance impact analysis
- `complexity`: Code complexity evaluation
- `review`: Review status and feedback analysis
- `changes`: Change impact assessment

**Usage Examples**:
```powershell
# Comprehensive analysis
.\pr-analyzer.ps1 -PRNumber 150 -Analysis comprehensive -Detailed

# Security analysis
.\pr-analyzer.ps1 -PRNumber 150 -Analysis security -ExportTo "security-report.json"

# Performance analysis
.\pr-analyzer.ps1 -PRNumber 150 -Analysis performance
```

### `pr-quality-checker.ps1`
**Purpose**: Automated quality assurance and testing

**Check Types**:
- `all`: Complete quality assessment
- `linting`: Code linting validation
- `formatting`: Code formatting verification
- `security`: Security vulnerability scanning
- `performance`: Performance anti-pattern detection
- `documentation`: Documentation completeness check
- `tests`: Automated test execution

**Usage Examples**:
```powershell
# Complete quality check
.\pr-quality-checker.ps1 -PRNumber 150 -Checks all -AutoFix

# Security and performance checks
.\pr-quality-checker.ps1 -PRNumber 150 -Checks security,performance

# Run tests and quality checks
.\pr-quality-checker.ps1 -PRNumber 150 -Checks all -RunTests -ExportTo "quality-report.json"
```

### `configure-sprint-estimate.ps1`
**Purpose**: Sprint estimation and capacity planning

**Features**:
- Story point calculation
- Sprint capacity planning
- Velocity tracking
- Burn-down analysis

**Usage Examples**:
```powershell
# Estimate current sprint
.\configure-sprint-estimate.ps1 -SprintName "Sprint 2024.1"

# Calculate team capacity
.\configure-sprint-estimate.ps1 -SprintName "Sprint 2024.1" -CalculateCapacity
```

### `get-pr-aliases.ps1`
**Purpose**: PR alias management and quick access

**Features**:
- PR number to alias mapping
- Quick PR lookup
- Alias validation
- Bulk alias operations

**Usage Examples**:
```powershell
# List all aliases
.\get-pr-aliases.ps1 -ListAll

# Find PR by alias
.\get-pr-aliases.ps1 -Alias "feature-auth"

# Create new alias
.\get-pr-aliases.ps1 -PRNumber 150 -Alias "bug-fix-login"
```

### `test-pr-identification.ps1`
**Purpose**: PR identification and validation testing

**Features**:
- PR validation testing
- Branch analysis
- Commit verification
- Integration testing

**Usage Examples**:
```powershell
# Test PR identification
.\test-pr-identification.ps1 -PRNumber 150

# Validate PR data
.\test-pr-identification.ps1 -PRNumber 150 -ValidateData

# Run integration tests
.\test-pr-identification.ps1 -PRNumber 150 -IntegrationTest
```

## 📈 Key Features

### AI-Powered Analysis
- **CR-GPT Integration**: Automated analysis of code review bot feedback
- **Intelligent Classification**: Automatic categorization of issues and recommendations
- **Response Generation**: Automated response creation for common feedback types
- **Complexity Assessment**: AI-powered code complexity evaluation

### Automated Configuration
- **Smart Field Assignment**: Automatic PR field population based on content analysis
- **Priority Classification**: Intelligent priority assignment (P0-P3)
- **Size Estimation**: Automated size estimation (XS-XL)
- **App/Area Mapping**: Automatic categorization by application and area

### Agent Management
- **Workload Balancing**: Intelligent distribution of PRs across agents
- **Skill Matching**: Assignment based on agent capabilities
- **Performance Tracking**: Monitor agent productivity and efficiency
- **Queue Management**: Prioritized PR processing

### Quality Assurance
- **Automated Testing**: Run tests and validate code quality
- **Linting Integration**: ESLint and Prettier integration
- **Security Scanning**: Vulnerability detection and assessment
- **Performance Analysis**: Performance anti-pattern detection
- **Documentation Checking**: Ensure proper code documentation

### Monitoring & Analytics
- **Real-time Monitoring**: Live PR status and progress tracking
- **Trend Analysis**: Historical performance and velocity tracking
- **Alert System**: Proactive notifications for issues and delays
- **Reporting**: Comprehensive reports and data export

## 🔧 Configuration

### Environment Variables
```powershell
# Set PR management configuration
$env:PR_MANAGEMENT_DATA_PATH = "scripts/pr-management/data"
$env:PR_MANAGEMENT_LOG_LEVEL = "Information"
$env:GITHUB_PROJECT_ID = "PVT_kwHOAEnMVc4BCu-c"
$env:DEFAULT_ASSIGNEE = "jschibelli"
```

### Data Storage
- **PR Data**: Stored in `data/` directory
- **Analysis Results**: JSON format for trend analysis
- **Quality Reports**: Persistent quality assessment data
- **Agent Metrics**: Performance and workload tracking

## 🚨 Quality Gates

### Automated Checks
- **Linting**: Code style and quality validation
- **Formatting**: Code formatting consistency
- **Security**: Vulnerability scanning
- **Performance**: Performance impact assessment
- **Tests**: Automated test execution
- **Documentation**: Documentation completeness

### Manual Reviews
- **Human Review**: Required for all PRs
- **CR-GPT Feedback**: Address all bot feedback
- **Security Review**: For security-related changes
- **Performance Review**: For performance-critical changes

## 📊 Metrics & Reporting

### PR Metrics
- **Resolution Time**: Time from creation to merge
- **Review Cycles**: Number of review iterations
- **Quality Score**: Overall quality assessment
- **Agent Performance**: Individual agent metrics

### Team Metrics
- **Velocity**: Story points completed per sprint
- **Throughput**: PRs processed per time period
- **Quality Trends**: Quality metrics over time
- **Bottleneck Analysis**: Identify process bottlenecks

## 🔍 Troubleshooting

### Common Issues

#### GitHub API Rate Limiting
```powershell
# Check rate limit status
gh api rate_limit

# Implement retry logic
.\automate-pr-unified.ps1 -PRNumber 150 -MaxRetries 3 -RetryDelay 1000
```

#### PR Not Found
```powershell
# Verify PR exists
gh pr view $PRNumber

# Check PR status
gh pr list --state all | Where-Object { $_ -match $PRNumber }
```

#### Quality Check Failures
```powershell
# Run with auto-fix
.\pr-quality-checker.ps1 -PRNumber 150 -Checks all -AutoFix

# Check specific issues
.\pr-quality-checker.ps1 -PRNumber 150 -Checks security -Detailed
```

### Debug Mode
```powershell
# Enable verbose logging
.\automate-pr-unified.ps1 -PRNumber 150 -Action analyze -Detailed -Verbose

# Run quality checks with detailed output
.\pr-quality-checker.ps1 -PRNumber 150 -Checks all -Detailed
```

## 📚 Documentation

For complete developer documentation, see:
- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)**: Comprehensive developer guide with tutorials
- **Individual Script Headers**: Detailed parameter documentation
- **GitHub Issues**: Report bugs or request features

## 🤝 Contributing

1. Follow PowerShell best practices
2. Add comprehensive error handling
3. Include parameter validation
4. Document all functions and parameters
5. Test with various PR scenarios
6. Update documentation

## 📞 Support

- **Documentation**: Check DEVELOPER_GUIDE.md for detailed tutorials
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

---

*Last Updated: 2025-10-06*
*Version: 1.0.0*
