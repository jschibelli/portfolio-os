Automate end-to-end: https://github.com/jschibelli/portfolio-os/pull/231#issue-3475859962. Detect if it's an issue or PR; for issues, trigger analysis, set fields, assign me, create and track the PR; for PRs, monitor reviews, analyze CRâ€‘GPT, post threaded replies, keep Status updated, run checks, and drive to merge.

**For Issues:**
- Use `.\scripts\enhanced-issue-config.ps1 -IssueNumber <NUMBER> -Agent <AGENT>` (NEW: Multi-agent system with smart assignment)
- Auto-configure project fields (Status=In progress, Priority=P1, Size=M, App=Portfolio Site, Area=Frontend, Assignee=jschibelli)
- **NEW: Auto-assign agent** based on issue content analysis (agent-frontend, agent-backend, agent-docs, agent-testing, agent-ai)
- **NEW: Add agent labels** for tracking and filtering
- **NEW: Update agent workload** tracking
- Analyze requirements and generate implementation plan
- **CRITICAL**: Create branch from `develop` base using `.\scripts\create-branch-from-develop.ps1 -IssueNumber <NUMBER>`
- **NEW: Generate agent work prompt** using `.\scripts\agent-work-executor.ps1 -IssueNumber <NUMBER> -Agent <AGENT>`
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

**NEW: Multi-Agent System Features:**
- **Smart Agent Assignment** - Auto-assigns best agent based on issue content
- **Agent Workload Balancing** - Distributes work evenly across agents
- **Conflict Detection** - Prevents merge conflicts between agents
- **Project Views** - 10 specialized views for agent work tracking
- **Agent Status Tracking** - Real-time agent status and capacity monitoring
- **Merge Queue Management** - Coordinates merges to prevent conflicts

**NEW: Agent Work Execution:**
- **Complete Workflow**: `.\scripts\complete-agent-workflow.ps1 -IssueNumber <NUMBER> -Agent <AGENT>`
- **Agent Work**: `.\scripts\agent-work-executor.ps1 -IssueNumber <NUMBER> -Agent <AGENT>`
- **System Status**: `.\scripts\master-automation.ps1 -Action status`

**Universal Features:**
- Real-time monitoring and notifications
- Automated testing and validation
- Security and performance analysis
- Documentation updates
- Status tracking and reporting
- **NEW: Multi-agent coordination and workload management**
