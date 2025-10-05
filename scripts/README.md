# Scripts Directory

This directory contains all automation scripts organized by functionality for easy navigation and maintenance.

## 📁 **Directory Structure**

### **`automation/`** - Core Automation Scripts
Contains the main automation scripts that orchestrate the entire system:

- **`agent-coordinator.ps1`** - Coordinates multiple AI agents and manages workload distribution
- **`continuous-issue-pipeline.ps1`** - Processes issues continuously from backlog to completion
- **`integrate-multi-agent.ps1`** - Integrates and validates multi-agent system components
- **`master-automation.ps1`** - Main automation controller and system orchestrator
- **`multi-agent-automation.ps1`** - Core multi-agent automation engine
- **`multi-agent-worktree-system.ps1`** - Manages isolated work environments for agents
- **`multi-pr-automation.ps1`** - Automates pull request processing and management
- **`pr-automation-enhanced-simple.ps1`** - Enhanced PR automation with simplified interface
- **`pr-automation-unified.ps1`** - Unified PR automation system
- **`trigger-issue-implementation.ps1`** - Triggers issue implementation workflows

### **`project-management/`** - Project Management Scripts
Scripts for managing GitHub projects, boards, and project-related tasks:

- **`backfill-project-fields.ps1`** - Backfills missing project fields for existing issues
- **`branch-manager.ps1`** - Manages branch creation, naming, and cleanup
- **`create-branch-from-develop.ps1`** - Creates new branches from develop branch
- **`project-manager.ps1`** - Main project management controller
- **`project-status-monitor.ps1`** - Monitors project status and health
- **`sync-project-board.ps1`** - Synchronizes GitHub project board with automation system

### **`analysis/`** - Analysis and Quality Scripts
Scripts for analyzing code quality, stale issues, and system health:

- **`analyze-stale-issues.ps1`** - Analyzes and reports on stale issues
- **`cleanup-analysis-simple.ps1`** - Simple cleanup analysis and recommendations
- **`cleanup-analysis-text.ps1`** - Text-based cleanup analysis
- **`code-quality-checker.ps1`** - Checks code quality and standards compliance
- **`issue-analyzer.ps1`** - Analyzes issues for complexity, priority, and assignment

### **`utilities/`** - Utility Scripts
General utility scripts for configuration, testing, and maintenance:

- **`auto-configure-pr.ps1`** - Automatically configures PR fields and metadata
- **`build.sh`** - Build script for the entire project
- **`issue-config-unified.ps1`** - Unified issue configuration system
- **`issue-creator.ps1`** - Creates new issues with proper configuration
- **`issue-implementation.ps1`** - Implements issue solutions
- **`issue-queue-manager.ps1`** - Manages issue queues and processing
- **`pr-aliases.ps1`** - PowerShell aliases for common PR operations
- **`test-multi-pr-automation.ps1`** - Tests multi-PR automation functionality
- **`worktree-config.json`** - Configuration for worktree management

### **`documentation/`** - Documentation Scripts
Scripts for generating and maintaining documentation:

- **`docs-updater.ps1`** - Updates documentation automatically
- **`CONTINUOUS-AUTOMATION-GUIDE.md`** - Guide for continuous automation
- **`issue-227-frontend-agent-implementation.md`** - Implementation docs
- **`issue-228-backend-agent-implementation.md`** - Backend agent implementation
- **`issue-228-implementation.md`** - Implementation documentation
- **`issue-229-frontend-agent-implementation.md`** - Frontend agent docs
- **`issue-229-implementation.md`** - Implementation guide
- **`issue-230-backend-agent-implementation.md`** - Backend implementation
- **`issue-230-implementation.md`** - Implementation documentation

### **`shared/`** - Shared Utilities
Common utilities used across multiple scripts:

- **`github-utils.ps1`** - GitHub API utilities and helper functions

## 🚀 **Quick Start**

### **Essential Commands**
```powershell
# Start the main automation system
.\automation\master-automation.ps1 -Mode continuous

# Process issues automatically
.\automation\multi-agent-automation.ps1 -Mode continuous -MaxIssues 10

# Monitor system health
.\automation\integrate-multi-agent.ps1 -Operation validate

# Check project status
.\project-management\project-status-monitor.ps1
```

### **Common Workflows**
1. **Start Automation**: `.\automation\master-automation.ps1 -Mode start`
2. **Process Issues**: `.\automation\continuous-issue-pipeline.ps1 -MaxIssues 5`
3. **Monitor Agents**: `.\automation\multi-agent-automation.ps1 -Mode monitor`
4. **Check Health**: `.\automation\integrate-multi-agent.ps1 -Operation validate`

## 📋 **Usage Guidelines**

### **Script Categories**
- **Automation**: Core system automation and orchestration
- **Project Management**: GitHub project and board management
- **Analysis**: Code quality and system analysis
- **Utilities**: General purpose utilities and tools
- **Documentation**: Documentation generation and maintenance

### **Best Practices**
- Always run scripts from the project root directory
- Use PowerShell execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Check script parameters with `-Help` or `-?` flags
- Monitor logs for any errors or warnings

### **Troubleshooting**
- Check PowerShell execution policy
- Verify GitHub token is configured
- Ensure all dependencies are installed
- Review script logs for detailed error information

## 🔧 **System Integration**

These scripts work together to provide:
- **Automated Issue Processing**: From creation to completion
- **Multi-Agent Coordination**: Parallel development workflows
- **Project Management**: GitHub project board integration
- **Quality Assurance**: Automated testing and code review
- **Documentation**: Auto-generated and maintained docs

---

**This organized structure makes the Portfolio OS automation system easy to navigate, maintain, and extend!** 🚀