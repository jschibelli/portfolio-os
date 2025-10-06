# Monitoring System

This directory contains comprehensive monitoring and analytics tools for the Portfolio OS project, providing real-time insights into system performance, automation metrics, and operational health.

## 📁 Structure

```
scripts/monitoring/
├── automation-metrics.ps1     # Main analytics and monitoring system
├── real-time-dashboard.ps1    # Live monitoring dashboard
├── alert-manager.ps1          # Alert management system
├── performance-analyzer.ps1   # Performance analysis tools
├── data/                      # Metrics storage
├── DEVELOPER_GUIDE.md         # Complete developer documentation
└── README.md                  # This file
```

## 🚀 Quick Start

### Basic System Overview
```powershell
.\automation-metrics.ps1 -Operation overview
```

### Real-Time Dashboard
```powershell
.\real-time-dashboard.ps1 -RefreshInterval 30
```

### Performance Analysis
```powershell
.\performance-analyzer.ps1 -Analysis comprehensive
```

### Alert Management
```powershell
.\alert-manager.ps1 -Action list
```

## 📊 Core Scripts

### `automation-metrics.ps1`
**Purpose**: Comprehensive analytics and monitoring system

**Key Operations**:
- `overview`: Complete system overview dashboard
- `performance`: Detailed performance metrics
- `issues`: Issue tracking and analysis
- `agents`: Agent activity monitoring
- `trends`: Historical trend analysis
- `health`: System health assessment
- `alerts`: Active alert management

**Usage Examples**:
```powershell
# Get system overview
.\automation-metrics.ps1 -Operation overview

# Analyze performance over 7 days
.\automation-metrics.ps1 -Operation performance -TimeRange 7

# Export issue metrics
.\automation-metrics.ps1 -Operation issues -ExportTo "issue-report.json"

# Generate comprehensive report
.\automation-metrics.ps1 -Operation overview -ExportTo "full-report.md"
```

### `real-time-dashboard.ps1`
**Purpose**: Live monitoring dashboard with real-time updates

**Features**:
- Real-time system metrics
- Recent activity tracking
- System health monitoring
- Configurable refresh intervals
- Alert notifications

**Usage Examples**:
```powershell
# Basic dashboard (30-second refresh)
.\real-time-dashboard.ps1

# Custom refresh interval (10 seconds)
.\real-time-dashboard.ps1 -RefreshInterval 10

# Show alerts and performance metrics
.\real-time-dashboard.ps1 -ShowAlerts -ShowPerformance

# Run for 30 minutes maximum
.\real-time-dashboard.ps1 -MaxRuntime 30
```

### `alert-manager.ps1`
**Purpose**: Comprehensive alert management system

**Actions**:
- `list`: Display active alerts
- `create`: Create new alerts
- `acknowledge`: Acknowledge alerts
- `resolve`: Resolve alerts
- `history`: View alert history

**Usage Examples**:
```powershell
# List all alerts
.\alert-manager.ps1 -Action list

# Create critical alert
.\alert-manager.ps1 -Action create -Severity critical -Message "System overload detected"

# Acknowledge alert
.\alert-manager.ps1 -Action acknowledge -AlertId "alert-id-here"

# View alert history
.\alert-manager.ps1 -Action history
```

### `performance-analyzer.ps1`
**Purpose**: Detailed performance analysis tools

**Analysis Types**:
- `system`: System resource monitoring
- `scripts`: Script performance analysis
- `api`: API response time testing
- `git`: Git operation performance
- `comprehensive`: Complete performance analysis

**Usage Examples**:
```powershell
# System performance analysis
.\performance-analyzer.ps1 -Analysis system

# Comprehensive performance report
.\performance-analyzer.ps1 -Analysis comprehensive -ExportTo "performance-report.json"

# Real-time performance monitoring
.\performance-analyzer.ps1 -Analysis system -RealTime -Duration 10
```

## 📈 Key Metrics

### System Metrics
- **CPU Usage**: Processor utilization percentage
- **Memory Usage**: RAM consumption and availability
- **Disk Performance**: I/O operations and space usage
- **Network Activity**: Data transfer rates

### Issue Metrics
- **Total Issues**: Open and closed issue counts
- **Priority Distribution**: Issues by priority level
- **Resolution Times**: Average time to close issues
- **Daily Velocity**: Issues created/closed per day

### Agent Metrics
- **Agent Status**: Total vs active agents
- **Workload Distribution**: Issues per agent
- **Activity Tracking**: Last activity timestamps
- **Performance Indicators**: Efficiency metrics

### Performance Metrics
- **Script Execution Times**: Performance of automation scripts
- **API Response Times**: GitHub API performance
- **Git Operations**: Repository operation speeds
- **Error Rates**: Success/failure ratios

## 🔧 Configuration

### Environment Variables
```powershell
# Set monitoring configuration
$env:MONITORING_DATA_PATH = "scripts/monitoring/data"
$env:MONITORING_LOG_LEVEL = "Information"
$env:GITHUB_PROJECT_ID = "PVT_kwHOAEnMVc4BCu-c"
```

### Data Storage
- **Metrics Data**: Stored in `data/` directory
- **Historical Data**: JSON format for trend analysis
- **Alert Data**: Persistent alert storage
- **Performance Data**: Time-series performance metrics

## 🚨 Alerting

### Alert Types
- **Info**: Informational notifications
- **Warning**: Performance or health concerns
- **Critical**: System-critical issues requiring immediate attention

### Alert Channels
- **Console**: Real-time console notifications
- **Email**: Email notifications (configurable)
- **Slack**: Slack integration (configurable)
- **Webhook**: Custom webhook notifications

### Auto-Generated Alerts
- High CPU usage (>90%)
- High memory usage (>1000MB)
- Low disk space (<5GB)
- GitHub API connectivity issues
- High number of open issues (>20)

## 📊 Reporting

### Report Types
- **Overview Reports**: Complete system status
- **Performance Reports**: Detailed performance analysis
- **Issue Reports**: Issue tracking and trends
- **Health Reports**: System health assessment
- **Alert Reports**: Active and historical alerts

### Export Formats
- **JSON**: Structured data export
- **Markdown**: Human-readable reports
- **CSV**: Data analysis format
- **HTML**: Web-viewable reports

## 🔍 Troubleshooting

### Common Issues

#### GitHub API Rate Limiting
```powershell
# Check rate limit status
gh api rate_limit

# Implement retry logic in scripts
```

#### Missing Dependencies
```powershell
# Verify GitHub CLI
gh --version

# Check PowerShell modules
Get-Module -ListAvailable
```

#### Data Collection Failures
```powershell
# Verify data directory
Test-Path "scripts/monitoring/data"

# Check file permissions
Get-Acl "scripts/monitoring/data"
```

### Debug Mode
```powershell
# Enable verbose logging
.\automation-metrics.ps1 -Operation overview -Verbose

# Run with detailed output
.\performance-analyzer.ps1 -Analysis system -Detailed
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
5. Test with various scenarios
6. Update documentation

## 📞 Support

- **Documentation**: Check DEVELOPER_GUIDE.md for detailed tutorials
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

---

*Last Updated: 2025-10-06*
*Version: 1.0.0*
