# Autonomous Agent System - Command Cheat Sheet

## 🚀 Essential Commands

### System Setup
```powershell
# Initialize complete system
.\scripts\multi-agent-orchestrator.ps1 -Action setup

# Create project views
.\scripts\project-views-config.ps1 -Action create

# Create agent labels
.\scripts\agent-identity-system.ps1 -Action create-labels
```

### Issue Processing (Autonomous)
```powershell
# Completely autonomous agent (RECOMMENDED)
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 230

# With specific agent
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 230 -Agent agent-frontend

# Enhanced issue configuration
.\scripts\enhanced-issue-config.ps1 -IssueNumber 230 -Agent agent-backend

# Agent work execution
.\scripts\agent-work-executor.ps1 -IssueNumber 230 -Agent agent-docs

# Autonomous agent system
.\scripts\autonomous-agent-system.ps1 -IssueNumber 230 -Agent agent-testing
```

### PR Processing (Enhanced)
```powershell
# Enhanced PR automation with agent coordination
.\scripts\enhanced-pr-automation.ps1 -PRNumber 456 -Agent agent-frontend

# Existing PR automation (still works)
.\scripts\pr-automation-unified.ps1 -PRNumber 456 -Action all -AutoFix
```

### System Management
```powershell
# Complete system status
.\scripts\master-automation.ps1 -Action status

# Agent workload status
.\scripts\agent-workload-manager.ps1 -Action status

# Merge queue status
.\scripts\merge-queue-system.ps1 -Action status

# Project workflow status
.\scripts\real-time-workflow-automation.ps1
```

## 🤖 Agent-Specific Commands

### Frontend Agent
```powershell
# Process frontend issue
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 230 -Agent agent-frontend

# Check frontend agent workload
.\scripts\agent-workload-manager.ps1 -Action status -Agent agent-frontend
```

### Backend Agent
```powershell
# Process backend issue
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 231 -Agent agent-backend

# Check backend agent workload
.\scripts\agent-workload-manager.ps1 -Action status -Agent agent-backend
```

### Documentation Agent
```powershell
# Process docs issue
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 232 -Agent agent-docs

# Check docs agent workload
.\scripts\agent-workload-manager.ps1 -Action status -Agent agent-docs
```

### Testing Agent
```powershell
# Process testing issue
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 233 -Agent agent-testing

# Check testing agent workload
.\scripts\agent-workload-manager.ps1 -Action status -Agent agent-testing
```

### AI Agent
```powershell
# Process AI issue
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 234 -Agent agent-ai

# Check AI agent workload
.\scripts\agent-workload-manager.ps1 -Action status -Agent agent-ai
```

## 🔧 Workload Management

### Check Workloads
```powershell
# All agent workloads
.\scripts\agent-workload-manager.ps1 -Action status

# Specific agent workload
.\scripts\agent-workload-manager.ps1 -Action status -Agent agent-frontend

# Auto-assign to least loaded agent
.\scripts\agent-workload-manager.ps1 -Action assign -IssueNumber 230
```

### Workload Balancing
```powershell
# Redistribute work across agents
.\scripts\agent-workload-manager.ps1 -Action balance

# Check capacity utilization
.\scripts\agent-workload-manager.ps1 -Action capacity
```

## 🔄 Merge Queue Management

### Check Merge Queue
```powershell
# Merge queue status
.\scripts\merge-queue-system.ps1 -Action status

# Check for conflicts
.\scripts\merge-queue-system.ps1 -Action conflicts -PRNumber 456

# Add to merge queue
.\scripts\merge-queue-system.ps1 -Action add -PRNumber 456 -Agent agent-frontend
```

### Process Merge Queue
```powershell
# Process merge queue
.\scripts\merge-queue-system.ps1 -Action process

# Clear merge queue
.\scripts\merge-queue-system.ps1 -Action clear
```

## 📊 Project Views

### Create Project Views
```powershell
# Create all project views
.\scripts\project-views-config.ps1 -Action create

# Check project views
.\scripts\project-views-config.ps1 -Action status

# Delete project views
.\scripts\project-views-config.ps1 -Action delete
```

### View Management
```powershell
# List all views
.\scripts\project-views-config.ps1 -Action list

# Update view configuration
.\scripts\project-views-config.ps1 -Action update
```

## 🚨 Troubleshooting Commands

### System Diagnostics
```powershell
# Complete system status
.\scripts\master-automation.ps1 -Action status

# Agent system status
.\scripts\multi-agent-orchestrator.ps1 -Action status

# Individual component status
.\scripts\agent-workload-manager.ps1 -Action status
.\scripts\merge-queue-system.ps1 -Action status
```

### Fix Common Issues
```powershell
# Recreate agent labels
.\scripts\agent-identity-system.ps1 -Action create-labels

# Delete and recreate labels
.\scripts\agent-identity-system.ps1 -Action delete-labels
.\scripts\agent-identity-system.ps1 -Action create-labels

# Reset system
.\scripts\multi-agent-orchestrator.ps1 -Action reset
```

## 🎯 Training Scenarios

### Scenario 1: New Issue Processing
```powershell
# Step 1: Process with autonomous agent
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 230

# Step 2: Check system status
.\scripts\master-automation.ps1 -Action status

# Step 3: Monitor agent workload
.\scripts\agent-workload-manager.ps1 -Action status
```

### Scenario 2: Multiple Agents Working
```powershell
# Assign different agents to different issues
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 230 -Agent agent-frontend
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 231 -Agent agent-backend
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 232 -Agent agent-docs

# Monitor all workloads
.\scripts\agent-workload-manager.ps1 -Action status
```

### Scenario 3: PR Processing with Conflicts
```powershell
# Process PR with agent coordination
.\scripts\enhanced-pr-automation.ps1 -PRNumber 456 -Agent agent-frontend

# Check for conflicts
.\scripts\merge-queue-system.ps1 -Action conflicts -PRNumber 456

# Add to merge queue if conflicts
.\scripts\merge-queue-system.ps1 -Action add -PRNumber 456 -Agent agent-frontend

# Process merge queue
.\scripts\merge-queue-system.ps1 -Action process
```

## 📋 Quick Reference

### Most Used Commands
```powershell
# Process issue (autonomous)
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber <NUMBER>

# Process PR (enhanced)
.\scripts\enhanced-pr-automation.ps1 -PRNumber <NUMBER> -Agent <AGENT>

# System status
.\scripts\master-automation.ps1 -Action status

# Agent workloads
.\scripts\agent-workload-manager.ps1 -Action status

# Merge queue
.\scripts\merge-queue-system.ps1 -Action status
```

### Agent Types
- `agent-frontend` - UI/UX, React, styling
- `agent-backend` - APIs, databases, server
- `agent-docs` - Documentation, guides
- `agent-testing` - Testing, QA, coverage
- `agent-ai` - AI, automation, ML
- `agent-default` - General tasks

### Common Parameters
- `-IssueNumber <NUMBER>` - Issue number to process
- `-PRNumber <NUMBER>` - PR number to process
- `-Agent <AGENT>` - Specific agent to use
- `-DryRun` - Test mode without making changes

## 🎉 Ready to Use!

**Start with:** `.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber <NUMBER>`
**Monitor with:** `.\scripts\master-automation.ps1 -Action status`
**Check workloads:** `.\scripts\agent-workload-manager.ps1 -Action status`
