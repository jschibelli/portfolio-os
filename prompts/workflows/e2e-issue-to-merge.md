Automate end-to-end: Detect if it's an issue or PR; for issues, trigger analysis, set fields, assign Jason or Chris, create and track the PR; for PRs, monitor reviews, analyze CR‑GPT, post threaded replies, keep Status updated, run checks, and drive to merge.

**🆕 NEW: Continuous Pipeline Processing** - Automatically processes multiple issues from Backlog → In progress → In review → Ready → Ready for Merge → Done → Merged in sequence, then continues to the next available issues until no more work is available.

**Agent Assignment:**
- **Jason (Frontend Specialist)**: Frontend components, UI/UX, user workflows, analytics dashboards
- **Chris (Backend Specialist)**: Backend infrastructure, AI services, queue management, PowerShell integration

## 🚀 **Continuous Pipeline (NEW - Primary Method)**

### **Start Continuous Processing:**
```powershell
# Process up to 10 issues continuously
.\scripts\continuous-issue-pipeline.ps1 -MaxIssues 10 -Status "Backlog" -Priority "P1"

# Process with specific filters
.\scripts\continuous-issue-pipeline.ps1 -MaxIssues 5 -App "Portfolio Site" -Area "Frontend"

# Watch mode - continuously monitor for new issues
.\scripts\continuous-issue-pipeline.ps1 -Watch -Interval 30

# Dry run to see what would be processed
.\scripts\continuous-issue-pipeline.ps1 -MaxIssues 3 -DryRun
```

### **Queue Management:**
```powershell
# List available queues
.\scripts\issue-queue-manager.ps1 -Operation list

# Check queue status
.\scripts\issue-queue-manager.ps1 -Operation status -Queue "blog"

# Process specific queue
.\scripts\issue-queue-manager.ps1 -Operation process -Queue "blog"

# Create custom queue
.\scripts\issue-queue-manager.ps1 -Operation create -Queue "custom" -Priority "P1" -App "Portfolio Site" -Area "Frontend" -MaxConcurrent 3
```

## 🤖 **Agent Status Updates (NEW - P0 Fix)**

### **Update Project Board Status:**
```powershell
# Direct method - Fast and immediate
.\scripts\agent-status-update.ps1 -IssueNumber 250 -Action start -AgentName "jason"

# Webhook method - Reliable with logging
.\scripts\agent-project-status-webhook.ps1 -IssueNumber 250 -Action start -AgentName "jason"

# Complete work
.\scripts\agent-status-update.ps1 -IssueNumber 250 -Action complete -AgentName "jason"

# Create PR
.\scripts\agent-status-update.ps1 -IssueNumber 250 -Action create-pr -AgentName "jason"

# Merge PR
.\scripts\agent-status-update.ps1 -IssueNumber 250 -Action merge-pr -AgentName "jason"
```

### **Available Actions:**
- `start` - Move issue to "In Progress"
- `complete` - Move issue to "Ready" 
- `create-pr` - Move issue to "Ready"
- `merge-pr` - Move issue to "Done"

## 🔄 **Continuous Workflow Process**

**For Each Issue (Automated Loop):**
1. **Discovery**: Find next available issues matching criteria (Status=Backlog, Priority=P1, etc.)
2. **Configuration**: Auto-configure project fields using `issue-config-unified.ps1`
3. **Status Update**: Set issue to **"In progress"** on project board using `agent-status-update.ps1`
4. **Branch Creation**: Create branch from `develop` using `create-branch-from-develop.ps1`
5. **Implementation**: Implement using `issue-implementation.ps1`
6. **PR Creation**: Automatically create PR with proper base branch
7. **Status Update**: Set issue to **"Ready"** (in review) on project board using `agent-status-update.ps1`
8. **PR Automation**: Monitor and automate using `pr-automation-unified.ps1`
9. **Status Update**: Set issue to **"Done"** after successful merge using `agent-status-update.ps1`
10. **Continue**: Move to next issue in queue

**📊 Real-time Project Board Updates:**
- **Backlog** → **In progress** (when work starts)
- **In progress** → **Ready** (when PR is created and in review)
- **Ready** → **Done** (when PR is merged successfully)

**Queue Processing Features:**
- **Priority-based ordering** (P0 > P1 > P2 > P3)
- **Dependency checking** (waits for blocked issues)
- **Concurrent processing** (configurable limits per queue)
- **Failure recovery** (resume from failed issues)
- **Real-time monitoring** (watch mode with intervals)
- **Comprehensive logging** (detailed pipeline logs)

**For Issues:**
- Use `.\scripts\issue-config-unified.ps1 -IssueNumber <NUMBER> -Preset blog -AddToProject`
- Auto-configure project fields (Status=In progress, Priority=P1, Size=M, App=Portfolio Site, Area=Frontend, Assignee=jschibelli)
- Analyze requirements and generate implementation plan
- **CRITICAL**: Create branch from `develop` base using `.\scripts\create-branch-from-develop.ps1 -IssueNumber <NUMBER>`
- Track progress and update status

**For PRs:**
- **CRITICAL**: Verify base branch is set to `develop` - automation MUST NOT proceed if base branch is `main`
- Use `.\scripts\pr-automation-unified.ps1 -PRNumber <NUMBER> -Action all -AutoFix` (AutoFix automatically corrects base branch)
- Monitor CR-GPT bot comments and reviews
- Analyze feedback with priority categorization (bugs > tests > typing > logic > docs > style)
- Generate threaded replies to CR-GPT comments
- Run quality checks (lint, test, build)
- Update project status and metadata
- Drive to merge with rebase merge strategy (only if base branch is `develop`)
- Update documentation and changelog

**Universal Features:**
- Real-time monitoring and notifications
- Automated testing and validation
- Security and performance analysis
- Documentation updates
- Status tracking and reporting
- **🆕 NEW**: Continuous pipeline processing
- **🆕 NEW**: Queue management and prioritization
- **🆕 NEW**: Dependency resolution
- **🆕 NEW**: Failure recovery and resumption