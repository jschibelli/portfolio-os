# Multi-Agent System User Guide

## 🚀 **Quick Start**

### **1. Initialize the System**
```powershell
# Set up the complete multi-agent system
.\scripts\multi-agent-orchestrator.ps1 -Action setup
```

### **2. Assign Work to Agents**
```powershell
# Auto-assign an issue to the best agent
.\scripts\multi-agent-orchestrator.ps1 -Action assign -IssueNumber 123

# Assign to specific agent
.\scripts\multi-agent-orchestrator.ps1 -Action assign -IssueNumber 123 -Agent agent-frontend
```

### **3. Monitor System Status**
```powershell
# Check overall system status
.\scripts\multi-agent-orchestrator.ps1 -Action status
```

## 🤖 **Agent Types**

| Agent | Specialties | Capacity | Color |
|-------|-------------|----------|-------|
| **agent-frontend** | UI, React, CSS, Accessibility | 3 issues | Blue |
| **agent-backend** | APIs, Database, Server Logic | 2 issues | Green |
| **agent-docs** | Documentation, Content | 4 issues | Yellow |
| **agent-testing** | Testing, QA, Coverage | 2 issues | Purple |
| **agent-ai** | AI, Automation, ML | 3 issues | Orange |
| **agent-default** | General, Fallback | 5 issues | Gray |

## 📋 **Daily Workflow**

### **Morning Setup**
```powershell
# Check system status
.\scripts\multi-agent-orchestrator.ps1 -Action status

# Process any pending work
.\scripts\multi-agent-orchestrator.ps1 -Action process -Agent agent-frontend
```

### **Assigning New Work**
```powershell
# Auto-assign based on content analysis
.\scripts\agent-identity-system.ps1 -Action assign -IssueNumber 123

# Check workload before assigning
.\scripts\agent-workload-manager.ps1 -Action workload
```

### **Handling PRs**
```powershell
# Check for conflicts
.\scripts\merge-queue-system.ps1 -Action conflicts -PRNumber 456

# Add to merge queue
.\scripts\merge-queue-system.ps1 -Action add -PRNumber 456 -Agent agent-frontend

# Process merge queue
.\scripts\merge-queue-system.ps1 -Action process
```

## 🔧 **Advanced Usage**

### **Workload Management**
```powershell
# Check specific agent workload
.\scripts\agent-workload-manager.ps1 -Action workload -Agent agent-frontend

# Balance workload across agents
.\scripts\agent-workload-manager.ps1 -Action balance

# Update agent status
.\scripts\agent-workload-manager.ps1 -Action status
```

### **Conflict Resolution**
```powershell
# Check for file conflicts
.\scripts\merge-queue-system.ps1 -Action conflicts -PRNumber 456

# Resolve conflicts automatically
.\scripts\merge-queue-system.ps1 -Action process
```

### **Project Views**
```powershell
# Create agent-specific views
.\scripts\project-views-config.ps1 -Action create -Agent agent-frontend

# Create all views
.\scripts\project-views-config.ps1 -Action all
```

## 📊 **GitHub Project Views**

### **Available Views**
- **Frontend Agent Work** - All frontend tasks
- **Backend Agent Work** - All backend tasks  
- **Documentation Agent Work** - All docs tasks
- **Testing Agent Work** - All testing tasks
- **AI Agent Work** - All AI tasks
- **All Agent Work** - Overview of all work
- **Agent Workload Overview** - Capacity utilization
- **High Priority Work** - Priority P1/P0 items
- **Blocked Work** - Items needing attention
- **Ready for Review** - Items ready for review

### **Swim Lane Layout**
Each agent view uses swim lanes grouped by:
- **Status** (Todo, In Progress, Ready, Done)
- **Priority** (P0, P1, P2, P3)
- **Agent** (agent-frontend, agent-backend, etc.)

## 🏷️ **Labeling System**

### **Agent Labels**
- `agent-frontend` - Frontend work
- `agent-backend` - Backend work
- `agent-docs` - Documentation work
- `agent-testing` - Testing work
- `agent-ai` - AI/Automation work

### **Type Labels**
- `type:feature` - New features
- `type:bugfix` - Bug fixes
- `type:documentation` - Docs updates
- `type:testing` - Test improvements
- `type:refactor` - Code refactoring

### **Priority Labels**
- `priority:high` - P1/P0 items
- `priority:medium` - P2 items
- `priority:low` - P3 items

## 📝 **Commit Convention**

### **Format**
```
<type>(<scope>): <description>

<optional body>

<optional footer>

Agent: agent-<name>
Issue: #<number>
```

### **Types**
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Testing
- `chore` - Maintenance

### **Examples**
```bash
feat(ui): add responsive navigation component

- Implement mobile-first navigation
- Add hamburger menu for mobile
- Update accessibility attributes

Agent: agent-frontend
Issue: #123
```

## 🔄 **Merge Strategy**

### **Conflict Resolution**
1. **First-merged-wins** - First PR to merge takes precedence
2. **Rebase strategy** - Other PRs rebase onto updated develop
3. **Automatic detection** - System detects file conflicts
4. **Queue management** - PRs queued by priority and agent

### **Merge Queue Process**
1. Check for conflicts
2. Verify status checks pass
3. Merge using rebase strategy
4. Update project status
5. Notify agents of completion

## 📈 **Monitoring & Analytics**

### **Agent Status Tracking**
- **Idle** - No active work
- **Working** - Active on issues
- **Overloaded** - At capacity
- **Blocked** - Waiting for dependencies

### **Workload Metrics**
- Active issues per agent
- Capacity utilization
- Work distribution
- Completion rates

### **Conflict Analytics**
- File conflict frequency
- Resolution time
- Agent coordination issues

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Agent Overloaded**
```powershell
# Check workload
.\scripts\agent-workload-manager.ps1 -Action workload -Agent agent-frontend

# Rebalance work
.\scripts\agent-workload-manager.ps1 -Action balance
```

#### **Merge Conflicts**
```powershell
# Check conflicts
.\scripts\merge-queue-system.ps1 -Action conflicts -PRNumber 456

# Process queue
.\scripts\merge-queue-system.ps1 -Action process
```

#### **Project Field Issues**
```powershell
# Recreate project views
.\scripts\project-views-config.ps1 -Action create
```

### **Debug Mode**
```powershell
# Run with dry run to see what would happen
.\scripts\multi-agent-orchestrator.ps1 -Action all -DryRun
```

## 🎯 **Best Practices**

### **1. Regular Monitoring**
- Check system status daily
- Monitor agent workloads
- Review conflict reports

### **2. Work Distribution**
- Use auto-assignment for new issues
- Balance workload across agents
- Respect agent capacities

### **3. Conflict Prevention**
- Check for conflicts before merging
- Use merge queue for coordination
- Communicate with other agents

### **4. Quality Assurance**
- Follow commit conventions
- Use proper labeling
- Maintain project field accuracy

## 🔧 **Configuration**

### **Agent Capacities**
Edit `scripts/agent-workload-manager.ps1`:
```powershell
$agentCapacities = @{
    "agent-frontend" = @{ Max = 3; Current = 0; Status = "idle" }
    "agent-backend" = @{ Max = 2; Current = 0; Status = "idle" }
    # ... adjust as needed
}
```

### **Project Field IDs**
Update field IDs in scripts to match your GitHub project:
```powershell
$fieldIds = @{
    "Agent" = "YOUR_AGENT_FIELD_ID"
    "Priority" = "YOUR_PRIORITY_FIELD_ID"
    # ... update with your field IDs
}
```

## 📞 **Support**

### **Getting Help**
1. Check the troubleshooting section
2. Run scripts with `-DryRun` to see what would happen
3. Review agent status and workload
4. Check merge queue for stuck items

### **System Health Check**
```powershell
# Complete system status
.\scripts\multi-agent-orchestrator.ps1 -Action status

# Individual component checks
.\scripts\agent-workload-manager.ps1 -Action all
.\scripts\merge-queue-system.ps1 -Action status
.\scripts\project-views-config.ps1 -Action list
```

---

**🎉 You're now ready to use the Multi-Agent System!**

Start with `.\scripts\multi-agent-orchestrator.ps1 -Action setup` to initialize everything.
