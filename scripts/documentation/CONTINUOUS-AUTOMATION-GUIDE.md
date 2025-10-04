# Continuous Issue-to-Merge Automation Guide

## 🚀 **Quick Start**

### **Start Continuous Processing (Recommended)**
```powershell
# Process up to 10 issues automatically
.\scripts\master-automation.ps1 -Mode continuous -MaxIssues 10

# Watch mode - continuously monitor for new issues
.\scripts\master-automation.ps1 -Mode continuous -Watch -MaxIssues 20

# Dry run to preview what would be processed
.\scripts\master-automation.ps1 -Mode continuous -MaxIssues 3 -DryRun
```

### **Process Specific Issue**
```powershell
# Process a single issue through the full pipeline
.\scripts\master-automation.ps1 -Mode single-issue -Target 123
```

### **Monitor Specific PR**
```powershell
# Monitor and automate a specific pull request
.\scripts\master-automation.ps1 -Mode single-pr -Target 456
```

## 📋 **Queue Management**

### **Check Queue Status**
```powershell
# List all available queues
.\scripts\master-automation.ps1 -Mode queue -Target "" -Options "list"

# Check specific queue status
.\scripts\master-automation.ps1 -Mode queue -Target "blog" -Options "status"

# Process a specific queue
.\scripts\master-automation.ps1 -Mode queue -Target "blog" -Options "process"
```

### **Create Custom Queue**
```powershell
# Create a custom queue with specific criteria
.\scripts\issue-queue-manager.ps1 -Operation create -Queue "custom" -Priority "P1" -App "Portfolio Site" -Area "Frontend" -MaxConcurrent 3
```

## 🔄 **How It Works**

### **Continuous Pipeline Process**
1. **Discovery**: Finds issues matching your criteria (Status=Todo, Priority=P1, etc.)
2. **Configuration**: Auto-configures project fields using existing scripts
3. **Branch Creation**: Creates branch from `develop` using existing scripts
4. **Implementation**: Implements the issue using existing scripts
5. **PR Creation**: Automatically creates PR with proper base branch
6. **PR Automation**: Monitors and automates using existing scripts
7. **Status Updates**: Updates issue status to Done after successful merge
8. **Continue**: Moves to next issue in queue

### **📊 Real-time Project Board Updates**
The automation now updates your project board in real-time so you can visually track progress:

- **Backlog** → **In progress** (when work starts)
- **In progress** → **Ready** (when PR is created and in review)  
- **Ready** → **Done** (when PR is merged successfully)

This gives you complete visibility into:
- What's in the backlog ready to work on
- What's currently in progress
- What's in review
- What's completed

### **Queue Processing Features**
- **Priority-based ordering** (P0 > P1 > P2 > P3)
- **Dependency checking** (waits for blocked issues)
- **Concurrent processing** (configurable limits per queue)
- **Failure recovery** (resume from failed issues)
- **Real-time monitoring** (watch mode with intervals)
- **Comprehensive logging** (detailed pipeline logs)

## 📊 **Monitoring and Status**

### **Check System Status**
```powershell
# Check automation system status
.\scripts\master-automation.ps1 -Mode status

# Monitor project board in real-time
.\scripts\master-automation.ps1 -Mode monitor

# Check specific status
.\scripts\project-status-monitor.ps1 -Filter "In progress"

# Check backlog items
.\scripts\project-status-monitor.ps1 -Filter "Backlog"

# Detailed status with labels and URLs
.\scripts\project-status-monitor.ps1 -Detailed
```

### **View Logs**
```powershell
# Check continuous pipeline logs
Get-Content continuous-pipeline.log

# Check master automation logs
Get-Content master-automation.log
```

## 🎯 **Available Queues**

| Queue | Max Concurrent | Priority | App | Area | Use Case |
|-------|----------------|----------|-----|------|----------|
| `default` | 3 | P1 | Portfolio Site | Frontend | General issues |
| `blog` | 2 | P1 | Portfolio Site | Frontend | Blog-related issues |
| `dashboard` | 2 | P1 | Dashboard | Frontend | Dashboard features |
| `docs` | 1 | P2 | Docs | Content | Documentation |
| `infra` | 1 | P1 | Portfolio Site | Infra | Infrastructure |

## 🔧 **Configuration**

### **Queue Configuration File**
The system uses `issue-queue-config.json` to store queue settings. You can modify this file or use the queue management commands to update settings.

### **Log Files**
- `continuous-pipeline.log` - Detailed pipeline processing logs
- `master-automation.log` - Master automation system logs

## 🚨 **Troubleshooting**

### **Common Issues**
1. **GitHub CLI not authenticated**: Run `gh auth login`
2. **Not in git repository**: Ensure you're in the project root
3. **Base branch issues**: The system automatically fixes base branch to `develop`
4. **Permission issues**: Ensure you have proper GitHub permissions

### **Debug Commands**
```powershell
# Check GitHub authentication
gh auth status

# Check git repository status
git status

# Check current branch
git branch --show-current

# Check project issues
gh issue list --state open
```

## 📈 **Best Practices**

1. **Start with Dry Run**: Always test with `-DryRun` first
2. **Use Watch Mode**: For continuous monitoring, use `-Watch` mode
3. **Monitor Logs**: Check log files for detailed processing information
4. **Queue Management**: Use specific queues for different types of work
5. **Dependency Handling**: The system automatically checks for dependencies

## 🔄 **Integration with Existing System**

The continuous automation system integrates seamlessly with your existing automation scripts:
- Uses `issue-config-unified.ps1` for issue configuration
- Uses `create-branch-from-develop.ps1` for branch creation
- Uses `issue-implementation.ps1` for implementation
- Uses `pr-automation-unified.ps1` for PR automation
- Maintains all existing functionality while adding continuous processing

## 🎉 **Success Indicators**

- Issues automatically move from Todo → In progress → Ready → Done
- PRs are created with correct base branch (`develop`)
- PRs are automatically monitored and processed
- Comprehensive logging shows all activities
- System continues processing until no more work is available
