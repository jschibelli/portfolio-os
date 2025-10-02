# Autonomous Agent System - Quick Reference Card

## 🚀 Quick Start Commands

### Initialize System
```powershell
# Set up complete system
.\scripts\multi-agent-orchestrator.ps1 -Action setup
```

### Process Issues (Autonomous)
```powershell
# Completely autonomous agent (RECOMMENDED)
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 230

# With specific agent
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 230 -Agent agent-frontend
```

### Process PRs (Enhanced)
```powershell
# Enhanced PR automation with agent coordination
.\scripts\enhanced-pr-automation.ps1 -PRNumber 456 -Agent agent-backend
```

### System Management
```powershell
# Check complete system status
.\scripts\master-automation.ps1 -Action status

# Check agent workloads
.\scripts\agent-workload-manager.ps1 -Action status

# Check merge queue
.\scripts\merge-queue-system.ps1 -Action status
```

## 🤖 Agent Types

| Agent | Specialties | Keywords | Commit Format |
|-------|-------------|----------|---------------|
| **agent-frontend** | UI/UX, React, styling | ui, component, react, css | `feat(ui): <description>` |
| **agent-backend** | APIs, databases, server | api, database, server, auth | `feat(api): <description>` |
| **agent-docs** | Documentation, guides | docs, readme, guide, content | `docs: <description>` |
| **agent-testing** | Testing, QA, coverage | test, testing, coverage, qa | `test: <description>` |
| **agent-ai** | AI, automation, ML | ai, automation, ml, intelligence | `feat(ai): <description>` |
| **agent-default** | General tasks | general, misc, utility | `feat: <description>` |

## 📋 Workflow Steps

### For Issues
1. **Run autonomous automation:**
   ```powershell
   .\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 230
   ```

2. **Open generated prompt file** (e.g., `autonomous-agent-prompt-230.md`)

3. **Copy entire prompt to Cursor AI**

4. **Let AI work completely autonomously**

5. **Monitor progress:**
   ```powershell
   .\scripts\master-automation.ps1 -Action status
   ```

### For PRs
1. **Run enhanced PR automation:**
   ```powershell
   .\scripts\enhanced-pr-automation.ps1 -PRNumber 456 -Agent agent-frontend
   ```

2. **Check for conflicts:**
   ```powershell
   .\scripts\merge-queue-system.ps1 -Action conflicts -PRNumber 456
   ```

3. **Process merge queue if needed:**
   ```powershell
   .\scripts\merge-queue-system.ps1 -Action process
   ```

## 🔧 System Management

### Check System Health
```powershell
# Complete system status
.\scripts\master-automation.ps1 -Action status

# Agent workloads
.\scripts\agent-workload-manager.ps1 -Action status

# Merge queue status
.\scripts\merge-queue-system.ps1 -Action status
```

### Initialize Components
```powershell
# Set up multi-agent system
.\scripts\multi-agent-orchestrator.ps1 -Action setup

# Create project views
.\scripts\project-views-config.ps1 -Action create

# Create agent labels
.\scripts\agent-identity-system.ps1 -Action create-labels
```

### Workload Management
```powershell
# Auto-assign to least loaded agent
.\scripts\agent-workload-manager.ps1 -Action assign -IssueNumber 230

# Check specific agent
.\scripts\agent-workload-manager.ps1 -Action status -Agent agent-frontend
```

## 🎯 Training Scenarios

### Scenario 1: New Issue
```powershell
# Step 1: Process with autonomous agent
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 230

# Step 2: Open prompt file and copy to Cursor AI
# Step 3: Let agent work autonomously
# Step 4: Monitor progress
.\scripts\master-automation.ps1 -Action status
```

### Scenario 2: Multiple Agents
```powershell
# Assign different agents to different issues
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 230 -Agent agent-frontend
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 231 -Agent agent-backend

# Monitor workloads
.\scripts\agent-workload-manager.ps1 -Action status
```

### Scenario 3: PR Processing
```powershell
# Process PR with agent coordination
.\scripts\enhanced-pr-automation.ps1 -PRNumber 456 -Agent agent-frontend

# Check for conflicts
.\scripts\merge-queue-system.ps1 -Action conflicts -PRNumber 456
```

## 🚨 Troubleshooting

### Common Issues
- **Agent not found:** Run `.\scripts\multi-agent-orchestrator.ps1 -Action setup`
- **Workload errors:** Expected when no issues assigned yet
- **Branch creation issues:** Ensure you're on `develop` branch
- **Conflict detection:** Use merge queue system

### Debug Commands
```powershell
# Check system status
.\scripts\master-automation.ps1 -Action status

# Check agent setup
.\scripts\multi-agent-orchestrator.ps1 -Action status

# Check individual components
.\scripts\agent-workload-manager.ps1 -Action status
.\scripts\merge-queue-system.ps1 -Action status
```

## 📊 Project Views

The system creates 10 specialized views:
1. **Agent Frontend** - Frontend agent work
2. **Agent Backend** - Backend agent work
3. **Agent Docs** - Documentation agent work
4. **Agent Testing** - Testing agent work
5. **Agent AI** - AI agent work
6. **Workload Overview** - All agent workloads
7. **High Priority** - High priority items
8. **Blocked** - Blocked items
9. **Ready for Review** - Items ready for review
10. **Merge Queue** - Merge queue status

## 🎉 Best Practices

1. **Use autonomous agents** for new issues
2. **Let agents work autonomously** - Don't interrupt
3. **Monitor progress** using system status commands
4. **Check for conflicts** before processing PRs
5. **Use project views** to track agent work

## 🔑 Key Commands Summary

| Purpose | Command |
|---------|---------|
| **Process Issue** | `.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber <NUMBER>` |
| **Process PR** | `.\scripts\enhanced-pr-automation.ps1 -PRNumber <NUMBER> -Agent <AGENT>` |
| **System Status** | `.\scripts\master-automation.ps1 -Action status` |
| **Agent Workloads** | `.\scripts\agent-workload-manager.ps1 -Action status` |
| **Merge Queue** | `.\scripts\merge-queue-system.ps1 -Action status` |
| **Setup System** | `.\scripts\multi-agent-orchestrator.ps1 -Action setup` |

## 🚀 Ready to Use!

**For Issues:** Use `.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber <NUMBER>`
**For PRs:** Use `.\scripts\enhanced-pr-automation.ps1 -PRNumber <NUMBER> -Agent <AGENT>`
**For Status:** Use `.\scripts\master-automation.ps1 -Action status`
