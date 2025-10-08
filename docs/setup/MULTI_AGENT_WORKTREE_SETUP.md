# Multi-Agent Work Tree System Setup Guide

This guide explains how to set up and use the Multi-Agent Work Tree System for parallel development across different areas of your portfolio project.

## Overview

The Multi-Agent Work Tree System enables multiple AI agents to work simultaneously on different aspects of your project without conflicts. Each agent operates in its own isolated work tree with dedicated branches and issue assignments.

### Key Benefits

- **Parallel Development**: Multiple agents work simultaneously
- **Conflict Prevention**: Isolated work trees prevent merge conflicts
- **Intelligent Assignment**: Issues are automatically assigned to optimal agents
- **Load Balancing**: Workload is distributed evenly across agents
- **State Tracking**: Central coordination prevents duplicate work

## Architecture

```
portfolio-os/
├── worktrees/                    # Isolated work trees for each agent
│   ├── agent-frontend/          # Frontend development
│   ├── agent-content/           # Content creation
│   ├── agent-infra/             # Infrastructure changes
│   ├── agent-docs/              # Documentation
│   └── agent-backend/           # Backend services
├── worktree-state.json          # Central state tracking
├── worktree-config.json         # System configuration
└── scripts/
    ├── multi-agent-worktree-system.ps1
    ├── agent-coordinator.ps1
    └── multi-agent-automation.ps1
```

## Agent Configuration

### Available Agents

1. **Frontend Agent** (`agent-frontend`)
   - **Scope**: Portfolio Site and Dashboard frontend
   - **Skills**: React, Next.js, TypeScript, Tailwind, UI/UX
   - **Issue Range**: 150-160, 196-208
   - **Max Concurrent**: 3 issues

2. **Content Agent** (`agent-content`)
   - **Scope**: Blog, articles, publishing features
   - **Skills**: MDX, Content, SEO, Publishing
   - **Issue Range**: 196-208
   - **Max Concurrent**: 2 issues

3. **Infrastructure Agent** (`agent-infra`)
   - **Scope**: CI/CD, deployment, infrastructure
   - **Skills**: Docker, GitHub Actions, Security
   - **Issue Range**: 170-179
   - **Max Concurrent**: 1 issue

4. **Documentation Agent** (`agent-docs`)
   - **Scope**: Documentation and DX tooling
   - **Skills**: Markdown, API Docs, Guides
   - **Issue Range**: 180-190
   - **Max Concurrent**: 1 issue

5. **Backend Agent** (`agent-backend`)
   - **Scope**: API, database, backend services
   - **Skills**: Node.js, Prisma, GraphQL
   - **Issue Range**: 200-220
   - **Max Concurrent**: 2 issues

## Setup Instructions

### 1. Initialize the System

```powershell
# Initialize the multi-agent work tree system
.\scripts\multi-agent-worktree-system.ps1 -Operation setup
```

This will:
- Create the `worktrees/` directory
- Initialize state tracking
- Update `.gitignore` for isolation
- Set up agent configurations

### 2. Create Agent Work Trees

```powershell
# Create work trees for all agents
.\scripts\multi-agent-worktree-system.ps1 -Operation create -Agent agent-frontend
.\scripts\multi-agent-worktree-system.ps1 -Operation create -Agent agent-content
.\scripts\multi-agent-worktree-system.ps1 -Operation create -Agent agent-infra
.\scripts\multi-agent-worktree-system.ps1 -Operation create -Agent agent-docs
.\scripts\multi-agent-worktree-system.ps1 -Operation create -Agent agent-backend
```

### 3. Verify Setup

```powershell
# Check system status
.\scripts\multi-agent-worktree-system.ps1 -Operation status
```

## Usage Examples

### Continuous Multi-Agent Processing

Start all agents working in parallel:

```powershell
# Process up to 10 issues across all agents
.\scripts\multi-agent-automation.ps1 -Mode continuous -MaxIssues 10

# With watch mode for continuous monitoring
.\scripts\multi-agent-automation.ps1 -Mode continuous -MaxIssues 10 -Watch
```

### Single Issue Processing

Process a specific issue with optimal agent assignment:

```powershell
# Let the system choose the best agent
.\scripts\multi-agent-automation.ps1 -Mode single-issue -Options 123

# Dry run to see what would happen
.\scripts\multi-agent-automation.ps1 -Mode single-issue -Options 123 -DryRun
```

### Agent-Specific Workflows

Run a specific agent's workflow:

```powershell
# Frontend agent workflow
.\scripts\multi-agent-automation.ps1 -Mode agent-workflow -Agent agent-frontend

# Content agent workflow
.\scripts\multi-agent-automation.ps1 -Mode agent-workflow -Agent agent-content
```

### Manual Issue Assignment

Assign issues to specific agents:

```powershell
# Assign issue to frontend agent
.\scripts\agent-management\manage-agent-coordinator.ps1 -Operation claim-issue -Target agent-frontend -Options 123

# Auto-assign issues to optimal agents
.\scripts\agent-management\manage-agent-coordinator.ps1 -Operation auto-assign -MaxIssues 5
```

### System Monitoring

Monitor all agents and their status:

```powershell
# Show current status
.\scripts\multi-agent-automation.ps1 -Mode monitor

# Check coordinator status
.\scripts\agent-management\manage-agent-coordinator.ps1 -Operation status

# Balance agent workload
.\scripts\agent-management\manage-agent-coordinator.ps1 -Operation balance-load
```

## Workflow Process

### 1. Issue Analysis
- System analyzes issue title, description, and labels
- Determines complexity and required skills
- Scores each agent based on capabilities and availability

### 2. Agent Assignment
- Issue is assigned to the highest-scoring available agent
- Agent work tree is created if needed
- Issue is locked to prevent duplicate assignment

### 3. Work Execution
Each agent follows a standardized workflow:

**Pre-Work Phase:**
- Sync work tree with develop branch
- Create feature branch
- Validate changes (infra/backend agents)

**Main Work Phase:**
- Implement changes specific to agent's skills
- Run tests and validation
- Ensure code quality

**Post-Work Phase:**
- Create pull request
- Request code review
- Deploy to staging (infra agent)

### 4. Coordination
- Central state tracking prevents conflicts
- Workload balancing ensures optimal distribution
- Automatic cleanup after completion

## Conflict Prevention

### Issue Locking
- Each issue can only be assigned to one agent
- Locks expire after timeout to handle failures
- Manual override available with `-Force` flag

### Branch Isolation
- Each agent works in separate work tree
- Dedicated branch prefixes prevent naming conflicts
- Automatic cleanup of completed branches

### State Synchronization
- Central state file tracks all agent activities
- File locking prevents concurrent modifications
- Regular sync with develop branch

## Troubleshooting

### Common Issues

**Work tree creation fails:**
```powershell
# Clean up and recreate
.\scripts\multi-agent-worktree-system.ps1 -Operation cleanup -Force
.\scripts\multi-agent-worktree-system.ps1 -Operation setup
```

**Agent assignment conflicts:**
```powershell
# Check current assignments
.\scripts\multi-agent-worktree-system.ps1 -Operation status

# Force reassignment
.\scripts\agent-management\manage-agent-coordinator.ps1 -Operation claim-issue -Target agent-frontend -Options 123 -Force
```

**Sync issues:**
```powershell
# Manual sync all work trees
.\scripts\multi-agent-worktree-system.ps1 -Operation sync
```

### State Recovery

If the state file becomes corrupted:

```powershell
# Backup current state
Copy-Item worktree-state.json worktree-state.json.backup

# Reset system
Remove-Item worktree-state.json
.\scripts\multi-agent-worktree-system.ps1 -Operation setup
```

## Integration with Existing Automation

The Multi-Agent Work Tree System integrates seamlessly with your existing automation:

- **Issue Management**: Uses existing GitHub project integration
- **PR Automation**: Leverages current PR creation and management
- **Branch Management**: Extends existing branch naming conventions
- **CI/CD**: Works with existing GitHub Actions workflows

## Best Practices

### Agent Assignment
- Let the system auto-assign issues when possible
- Use manual assignment only for specific requirements
- Monitor agent workload regularly

### Work Tree Management
- Keep work trees synced with develop branch
- Clean up completed work trees periodically
- Use dry-run mode to test changes

### Monitoring
- Monitor system status regularly
- Check for agent conflicts or overloads
- Review assignment effectiveness

### Maintenance
- Update agent configurations as needed
- Add new agents for specialized areas
- Tune assignment algorithms based on results

## Advanced Configuration

### Custom Agent Creation

To add a new agent, update `worktree-config.json`:

```json
{
  "agents": {
    "agent-mobile": {
      "name": "Mobile Agent",
      "description": "Handles mobile app development",
      "areas": ["Mobile"],
      "apps": ["Mobile App"],
      "maxConcurrent": 2,
      "workTreePath": "worktrees/agent-mobile",
      "branchPrefix": "feat/mobile",
      "priority": "P1",
      "issueRanges": [300, 310],
      "skills": ["React Native", "iOS", "Android"],
      "complexity": ["S", "M", "L"],
      "dependencies": ["agent-backend"],
      "preferredIssues": ["mobile", "app", "ios", "android"]
    }
  }
}
```

### Workflow Customization

Modify agent workflows in the configuration:

```json
{
  "workflows": {
    "agent-frontend": {
      "preWork": ["sync", "create-branch", "install-deps"],
      "mainWork": ["implement-frontend", "test-components", "lint-frontend", "build-assets"],
      "postWork": ["create-pr", "deploy-preview", "request-review"]
    }
  }
}
```

## Security Considerations

- Work trees are isolated from main repository
- State file contains sensitive assignment information
- Agent credentials should be managed securely
- Regular cleanup prevents information leakage

## Performance Optimization

- Limit concurrent agents based on system resources
- Use efficient branch management strategies
- Implement caching for frequent operations
- Monitor disk usage for work trees

This Multi-Agent Work Tree System provides a robust foundation for parallel development while maintaining the integrity and organization of your portfolio project.
