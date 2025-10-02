Automate end-to-end: Detect if it's an issue or PR; for issues, trigger analysis, set fields, assign me, create and track the PR; for PRs, monitor reviews, analyze CR‑GPT, post threaded replies, keep Status updated, run checks, and drive to merge.

**For Issues:**
- Use `.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber <NUMBER> -Agent <AGENT>` (NEW: Completely autonomous agents)
- Auto-configure project fields (Status=In progress, Priority=P1, Size=M, App=Portfolio Site, Area=Frontend, Assignee=jschibelli)
- **NEW: Auto-assign agent** based on issue content analysis (agent-frontend, agent-backend, agent-docs, agent-testing, agent-ai)
- **NEW: Add agent labels** for tracking and filtering
- **NEW: Update agent workload** tracking
- Analyze requirements and generate implementation plan
- **CRITICAL**: Create branch from `develop` base using `.\scripts\create-branch-from-develop.ps1 -IssueNumber <NUMBER>`
- **NEW: Generate autonomous agent prompt** using `.\scripts\autonomous-agent-system.ps1 -IssueNumber <NUMBER> -Agent <AGENT>`
- Track progress and update status

**For PRs:**
- **CRITICAL**: Verify base branch is set to `develop` - automation MUST NOT proceed if base branch is `main`
- Use `.\scripts\enhanced-pr-automation.ps1 -PRNumber <NUMBER> -Agent <AGENT> -Action all -AutoFix` (NEW: Enhanced with agent integration)
- **NEW: Auto-detect agent** from PR labels or content analysis
- **NEW: Check for conflicts** using merge queue system
- **NEW: Add to merge queue** if conflicts detected
- Monitor CR-GPT bot comments and reviews
- Analyze feedback with priority categorization (bugs > tests > typing > logic > docs > style)
- Generate threaded replies to CR-GPT comments
- Run quality checks (lint, test, build)
- Update project status and metadata
- **NEW: Update agent status** and workload tracking
- **NEW: Process merge queue** for conflict resolution
- Drive to merge with rebase merge strategy (only if base branch is `develop`)
- Update documentation and changelog

**NEW: Completely Autonomous Agent System:**
- **Autonomous Implementation** - Agents implement complete solutions without human intervention
- **Autonomous Git Operations** - Agents handle all git operations (add, commit, push)
- **Autonomous PR Management** - Agents create and manage PRs automatically
- **Autonomous Review Response** - Agents monitor and respond to all reviews
- **Autonomous Quality Checks** - Agents run tests, linting, and fix issues
- **Autonomous Merge** - Agents drive to merge completion automatically

**NEW: Multi-Agent System Features:**
- **Smart Agent Assignment** - Auto-assigns best agent based on issue content
- **Agent Workload Balancing** - Distributes work evenly across agents
- **Conflict Detection** - Prevents merge conflicts between agents
- **Project Views** - 10 specialized views for agent work tracking
- **Agent Status Tracking** - Real-time agent status and capacity monitoring
- **Merge Queue Management** - Coordinates merges to prevent conflicts

**NEW: Autonomous Agent Execution:**
- **Complete Autonomous Workflow**: `.\scripts\enhanced-autonomous-automation.ps1 -IssueNumber <NUMBER> -Agent <AGENT>`
- **Autonomous Agent System**: `.\scripts\autonomous-agent-system.ps1 -IssueNumber <NUMBER> -Agent <AGENT>`
- **Agent Work**: `.\scripts\agent-work-executor.ps1 -IssueNumber <NUMBER> -Agent <AGENT>`
- **System Status**: `.\scripts\master-automation.ps1 -Action status`

**Universal Features:**
- Real-time monitoring and notifications
- Automated testing and validation
- Security and performance analysis
- Documentation updates
- Status tracking and reporting
- **NEW: Completely autonomous multi-agent coordination and workload management**

**QUICK START COMMANDS:**
- **Autonomous agent work**: `<ISSUE_URL>` - Completely autonomous agent that implements, commits, creates PR, responds to reviews, and drives to merge
- **Smart autonomous assignment**: `<ISSUE_URL>` - Auto-assign best agent, create autonomous environment, generate autonomous prompt
- **Enhanced autonomous workflow**: `<ISSUE_URL>` - Full autonomous workflow with agent assignment and complete automation
- **System status**: Check complete autonomous agent system status, agent workloads, merge queue, project views