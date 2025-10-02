# Autonomous Agent Automation Prompts

## Purpose
Completely autonomous agent system that works without human intervention - agents implement, commit, create PRs, respond to reviews, and drive to merge automatically.

## Available Scripts

### 1. Enhanced Autonomous Automation
**File:** `scripts/enhanced-autonomous-automation.ps1`

**Usage:**
```powershell
# Completely autonomous agent workflow
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 230

# Specify specific agent
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 230 -Agent agent-frontend
```

### 2. Autonomous Agent System
**File:** `scripts/autonomous-agent-system.ps1`

**Usage:**
```powershell
# Autonomous agent system with complete automation
.\scripts\autonomous-agent-system.ps1 -IssueNumber 230 -Agent agent-backend
```

### 3. Enhanced Issue Configuration
**File:** `scripts/enhanced-issue-config.ps1`

**Usage:**
```powershell
# Enhanced issue configuration with agent assignment
.\scripts\enhanced-issue-config.ps1 -IssueNumber 230 -Agent agent-docs
```

### 4. Enhanced PR Automation
**File:** `scripts/enhanced-pr-automation.ps1`

**Usage:**
```powershell
# Enhanced PR automation with agent coordination
.\scripts\enhanced-pr-automation.ps1 -PRNumber 456 -Agent agent-testing
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

## Autonomous Agent Types

### agent-frontend
- **Specialties:** UI/UX, React components, styling, responsive design, accessibility
- **Keywords:** ui, component, react, css, styling, responsive, accessibility, frontend, interface
- **Commit Format:** `feat(ui): <description>`
- **Autonomous Actions:** Implements UI components, handles responsive design, manages state, creates tests

### agent-backend
- **Specialties:** APIs, databases, server logic, authentication, middleware
- **Keywords:** api, database, server, auth, middleware, service, backend, migration, sync
- **Commit Format:** `feat(api): <description>`
- **Autonomous Actions:** Implements APIs, manages databases, handles authentication, creates server logic

### agent-docs
- **Specialties:** Documentation, README updates, content management, guides
- **Keywords:** documentation, readme, guide, tutorial, content, docs, documentation
- **Commit Format:** `docs: <description>`
- **Autonomous Actions:** Updates documentation, creates guides, manages content, improves README

### agent-testing
- **Specialties:** Testing, quality assurance, test automation, coverage
- **Keywords:** test, testing, coverage, e2e, unit, integration, qa, quality
- **Commit Format:** `test: <description>`
- **Autonomous Actions:** Creates tests, improves coverage, automates QA, handles test failures

### agent-ai
- **Specialties:** AI integrations, automation, intelligent features, ML
- **Keywords:** ai, automation, ml, nlp, intelligence, assistant, bot, smart, automated
- **Commit Format:** `feat(ai): <description>`
- **Autonomous Actions:** Implements AI features, creates automation, builds intelligent systems

### agent-default
- **Specialties:** General tasks, miscellaneous, utility work
- **Keywords:** general, misc, utility
- **Commit Format:** `feat: <description>`
- **Autonomous Actions:** Handles general tasks, implements utilities, manages miscellaneous work

## Autonomous Workflow Commands

### Issue Processing
```powershell
# Completely autonomous agent workflow
.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber <NUMBER>

# Autonomous agent system
.\scripts\autonomous-agent-system.ps1 -IssueNumber <NUMBER> -Agent <AGENT>

# Enhanced issue configuration
.\scripts\enhanced-issue-config.ps1 -IssueNumber <NUMBER> -Agent <AGENT>
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

## Autonomous Agent Capabilities

### 1. Autonomous Implementation
- **Code Implementation:** Agents implement complete solutions without human intervention
- **Error Handling:** Agents handle edge cases and error scenarios
- **Testing:** Agents create and run tests automatically
- **Quality Assurance:** Agents ensure code quality and standards

### 2. Autonomous Git Operations
- **Branch Management:** Agents create and manage branches automatically
- **Staging Changes:** Agents stage all changes with `git add .`
- **Committing:** Agents commit with proper conventional commit format
- **Pushing:** Agents push changes to remote repository

### 3. Autonomous PR Management
- **PR Creation:** Agents create pull requests automatically
- **PR Descriptions:** Agents write detailed PR descriptions
- **Label Management:** Agents add appropriate labels
- **Base Branch:** Agents ensure correct base branch (develop)

### 4. Autonomous Review Response
- **Review Monitoring:** Agents monitor for review comments
- **Comment Response:** Agents respond to each comment
- **Change Implementation:** Agents make requested changes
- **Update Pushes:** Agents push updates automatically

### 5. Autonomous Quality Checks
- **Linting:** Agents run linting and fix issues
- **Testing:** Agents run tests and fix failures
- **Building:** Agents run build processes
- **CI Checks:** Agents ensure CI checks pass

### 6. Autonomous Merge Management
- **Conflict Resolution:** Agents resolve merge conflicts
- **Merge Queue:** Agents manage merge queue
- **Final Review:** Agents ensure all reviews resolved
- **Merge Completion:** Agents drive to merge completion

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

The autonomous system integrates seamlessly with your existing automation:

- **Enhanced Issue Configuration** - Adds autonomous agent assignment to existing issue configuration
- **Enhanced PR Automation** - Adds autonomous conflict detection to existing PR automation
- **Master Integration** - Orchestrates all systems together
- **Backward Compatibility** - All existing scripts continue to work

## Best Practices

1. **Use Enhanced Autonomous Automation** - Use `enhanced-autonomous-automation.ps1` for complete automation
2. **Let Agents Work Autonomously** - Use generated prompts with Cursor AI for autonomous implementation
3. **Monitor Autonomous Workloads** - Check agent status regularly to balance work
4. **Resolve Autonomous Conflicts** - Use merge queue system to prevent conflicts
5. **Track Autonomous Progress** - Use project views to monitor agent work

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

2. **Process Issue Autonomously:**
   ```powershell
   .\scripts\enhanced-autonomous-automation.ps1 -IssueNumber 230
   ```

3. **Let Agent Work Autonomously:**
   - Open generated prompt file
   - Copy prompt to Cursor AI
   - Let AI work completely autonomously
   - Agent will handle everything until merge

4. **Monitor Autonomous Progress:**
   ```powershell
   .\scripts\master-automation.ps1 -Action status
   ```

## Autonomous Agent Workflow

### Complete Autonomous Process:
1. **Issue Analysis** - Agent analyzes issue requirements
2. **Branch Creation** - Agent creates autonomous branch
3. **Code Implementation** - Agent implements complete solution
4. **Git Operations** - Agent stages, commits, and pushes changes
5. **PR Creation** - Agent creates pull request
6. **Review Monitoring** - Agent monitors for review comments
7. **Review Response** - Agent responds to all comments
8. **Change Implementation** - Agent makes requested changes
9. **Quality Checks** - Agent runs tests and fixes issues
10. **Merge Completion** - Agent drives to merge completion

The autonomous agent system is now fully integrated with your existing automation!
