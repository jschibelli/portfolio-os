# Multi-Agent System Automation Prompts

## Purpose
Automate multi-agent development workflow with intelligent agent assignment, workload balancing, conflict detection, and merge coordination.

## Available Scripts

### 1. Complete Agent Workflow
**File:** `scripts/complete-agent-workflow.ps1`

**Usage:**
```powershell
# Full agent workflow with smart assignment
.\scripts\complete-agent-workflow.ps1 -IssueNumber 230

# Specify specific agent
.\scripts\complete-agent-workflow.ps1 -IssueNumber 230 -Agent agent-frontend
```

### 2. Enhanced Issue Configuration
**File:** `scripts/enhanced-issue-config.ps1`

**Usage:**
```powershell
# Auto-assign agent and configure issue
.\scripts\enhanced-issue-config.ps1 -IssueNumber 230

# Specify agent type
.\scripts\enhanced-issue-config.ps1 -IssueNumber 230 -Agent agent-backend
```

### 3. Enhanced PR Automation
**File:** `scripts/enhanced-pr-automation.ps1`

**Usage:**
```powershell
# Enhanced PR automation with agent integration
.\scripts\enhanced-pr-automation.ps1 -PRNumber 456

# Specify agent for coordination
.\scripts\enhanced-pr-automation.ps1 -PRNumber 456 -Agent agent-frontend
```

### 4. Agent Work Executor
**File:** `scripts/agent-work-executor.ps1`

**Usage:**
```powershell
# Make agent actually work on issue
.\scripts\agent-work-executor.ps1 -IssueNumber 230 -Agent agent-backend
```

### 5. Master Integration System
**File:** `scripts/master-automation.ps1`

**Usage:**
```powershell
# Complete system status
.\scripts\master-automation.ps1 -Action status

# Process issue with complete automation
.\scripts\master-automation.ps1 -Action issue -IssueNumber 230

# Process PR with complete automation
.\scripts\master-automation.ps1 -Action pr -PRNumber 456
```

## Agent Types

### agent-frontend
- **Specialties:** UI/UX, React components, styling, responsive design, accessibility
- **Keywords:** ui, component, react, css, styling, responsive, accessibility, frontend, interface
- **Commit Format:** `feat(ui): <description>`
- **Color:** Green (#0e8a16)

### agent-backend
- **Specialties:** APIs, databases, server logic, authentication, middleware
- **Keywords:** api, database, server, auth, middleware, service, backend, migration, sync
- **Commit Format:** `feat(api): <description>`
- **Color:** Blue (#1d76db)

### agent-docs
- **Specialties:** Documentation, README updates, content management, guides
- **Keywords:** documentation, readme, guide, tutorial, content, docs, documentation
- **Commit Format:** `docs: <description>`
- **Color:** Yellow (#f9ca24)

### agent-testing
- **Specialties:** Testing, quality assurance, test automation, coverage
- **Keywords:** test, testing, coverage, e2e, unit, integration, qa, quality
- **Commit Format:** `test: <description>`
- **Color:** Purple (#6f42c1)

### agent-ai
- **Specialties:** AI integrations, automation, intelligent features, ML
- **Keywords:** ai, automation, ml, nlp, intelligence, assistant, bot, smart, automated
- **Commit Format:** `feat(ai): <description>`
- **Color:** Orange (#fd7e14)

### agent-default
- **Specialties:** General tasks, miscellaneous, utility work
- **Keywords:** general, misc, utility
- **Commit Format:** `feat: <description>`
- **Color:** Gray (#6c757d)

## Workflow Commands

### Issue Processing
```powershell
# Complete agent workflow for any issue
.\scripts\complete-agent-workflow.ps1 -IssueNumber <NUMBER>

# Enhanced issue configuration with agent assignment
.\scripts\enhanced-issue-config.ps1 -IssueNumber <NUMBER> -Agent <AGENT>

# Make agent work on issue
.\scripts\agent-work-executor.ps1 -IssueNumber <NUMBER> -Agent <AGENT>
```

### PR Processing
```powershell
# Enhanced PR automation with agent coordination
.\scripts\enhanced-pr-automation.ps1 -PRNumber <NUMBER> -Agent <AGENT>

# Check for conflicts and manage merge queue
.\scripts\merge-queue-system.ps1 -Action conflicts -PRNumber <NUMBER>
```

### System Management
```powershell
# Check complete system status
.\scripts\master-automation.ps1 -Action status

# Check agent workloads
.\scripts\agent-workload-manager.ps1 -Action status

# Check merge queue status
.\scripts\merge-queue-system.ps1 -Action status
```

## Project Views

The system creates 10 specialized project views:

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

## Commit Format

All agents use conventional commits with agent trailers:

```
<type>(<scope>): <description>

<optional body>

Agent: <agent-name>
Issue: #<issue-number>
```

Examples:
- `feat(ui): add responsive navigation component`
- `feat(api): implement user authentication endpoint`
- `docs: update installation guide`
- `test: add unit tests for user service`
- `feat(ai): implement smart content recommendations`

## Integration with Existing Automation

The multi-agent system integrates seamlessly with your existing automation:

- **Enhanced Issue Configuration** - Adds agent assignment to existing issue configuration
- **Enhanced PR Automation** - Adds conflict detection to existing PR automation
- **Master Integration** - Orchestrates all systems together
- **Backward Compatibility** - All existing scripts continue to work

## Best Practices

1. **Use Complete Workflow** - Use `complete-agent-workflow.ps1` for full automation
2. **Let Agents Work** - Use generated prompts with Cursor AI for actual implementation
3. **Monitor Workloads** - Check agent status regularly to balance work
4. **Resolve Conflicts** - Use merge queue system to prevent conflicts
5. **Track Progress** - Use project views to monitor agent work

## Troubleshooting

### Common Issues
- **Agent not found:** Ensure agent labels are created with `.\scripts\multi-agent-orchestrator.ps1 -Action setup`
- **Workload errors:** Expected when no issues are assigned yet
- **Conflict detection:** Use merge queue system to manage conflicts
- **Branch creation:** Ensure you're on the correct base branch

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

## Quick Start

1. **Initialize System:**
   ```powershell
   .\scripts\multi-agent-orchestrator.ps1 -Action setup
   ```

2. **Process Issue:**
   ```powershell
   .\scripts\complete-agent-workflow.ps1 -IssueNumber 230
   ```

3. **Let Agent Work:**
   - Open generated prompt file
   - Copy prompt to Cursor AI
   - Let AI work as the assigned agent

4. **Monitor Progress:**
   ```powershell
   .\scripts\master-automation.ps1 -Action status
   ```

The multi-agent system is now fully integrated with your existing automation!
