# End-to-End Issue to Merge Workflow (Single Developer)

**Purpose**: Streamlined automation for solo developers to process issues from creation to merge.

**🆕 NEW: Continuous Pipeline Processing** - Automatically processes multiple issues from Backlog → In progress → In review → Ready → Ready for Merge → Done → Merged in sequence, then continues to the next available issues until no more work is available.

> **Note**: For multi-agent workflows with Jason and Chris assignments, see `multi-agent-e2e-workflow.md`

## 🆕 **Enhanced Issue & Branch Creation**

### **Create Issue with Auto Branch:**
```powershell
# Create issue and automatically generate branch
.\scripts\issue-management\create-issue-enhanced.ps1 `
  -Title "Add dark mode toggle" `
  -Body "Implement dark mode toggle in settings" `
  -Labels "enhancement,frontend" `
  -Milestone "v1.0.0" `
  -CreateBranch `
  -PushBranch

# Result: Issue created + branch created + pushed to remote
# Branch name: issue-XXX-add-dark-mode-toggle
```

### **Manual Issue Creation:**
```powershell
# Traditional method (if you prefer manual control)
gh issue create --title "Title" --body "Description" --label "enhancement"
git branch issue-XXX-feature-name
git push origin issue-XXX-feature-name
```

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

## 🎯 **Example: Multi-Agent Completed Work (Epic #291)**

### **Jason (Infrastructure/Testing Specialist) - 7 Issues Completed:**

| Issue | PR | Description | Status |
|-------|-----|-------------|--------|
| #292 | [#306](https://github.com/jschibelli/portfolio-os/pull/306) | Test Utils & Config Updates (Foundation) | 🔄 Open - Ready for Review |
| #294 | [#307](https://github.com/jschibelli/portfolio-os/pull/307) | Projects & Portfolio Tests (~70 tests) | 🔄 Open - Ready for Review |
| #297 | [#312](https://github.com/jschibelli/portfolio-os/pull/312) | Protected Routes & Session Tests (40+ tests) | 🔄 Open - Ready for Review |
| #299 | [#308](https://github.com/jschibelli/portfolio-os/pull/308) | Newsletter Subscription Tests (50+ tests) | 🔄 Open - Ready for Review |
| #301 | [#309](https://github.com/jschibelli/portfolio-os/pull/309) | Booking System Tests (50+ tests) | 🔄 Open - Ready for Review |
| #303 | [#310](https://github.com/jschibelli/portfolio-os/pull/310) | Error Handling & Edge Cases (31 tests) | 🔄 Open - Ready for Review |
| #305 | [#311](https://github.com/jschibelli/portfolio-os/pull/311) | Performance & Accessibility (28 tests) | 🔄 Open - Ready for Review |

**Jason's Total Delivered:**
- 7 PRs (100% completion - All Open)
- 13 test files created
- ~290+ comprehensive tests
- ~14,400+ lines of code added
- Foundation utilities for entire team

---

### **Chris (Frontend/UI Specialist) - 7 Issues Completed:**

| Issue | PR | Description | Status |
|-------|-----|-------------|--------|
| #293 | [#317](https://github.com/jschibelli/portfolio-os/pull/317) | Blog Post Detail Page Tests (23 tests) | ✅ Merged |
| #295 | [#315](https://github.com/jschibelli/portfolio-os/pull/315) | Homepage Interactive Tests (28 tests) | ✅ Merged |
| #296 | [#313](https://github.com/jschibelli/portfolio-os/pull/313) | Authentication Flow Tests (34 tests) | ✅ Merged |
| #298 | [#314](https://github.com/jschibelli/portfolio-os/pull/314) | Contact Form Flow Tests (32 tests) | ✅ Merged |
| #300 | [#316](https://github.com/jschibelli/portfolio-os/pull/316) | Chatbot Interaction Tests (21 tests) | ✅ Merged |
| #302 | [#318](https://github.com/jschibelli/portfolio-os/pull/318) | Interactive Component Tests (43 tests) | ✅ Merged |
| #304 | [#319](https://github.com/jschibelli/portfolio-os/pull/319) | Visual Regression Expansion (19 tests + baselines) | ✅ Merged |

**Chris's Total Delivered:**
- 7 PRs (100% completion - All Merged ✅)
- 14 test files created
- ~200+ comprehensive tests (functional + visual)
- 12 visual regression baselines
- ~7,400+ lines of code added
- Complete frontend test coverage

---

### **Combined Epic #291 Achievements:**
- ✅ **14 PRs total** (100% of planned work)
  - 7 PRs from Chris: **All Merged ✅**
  - 7 PRs from Jason: **All Open - Ready for Review 🔄**
- ✅ **27 test files** created
- ✅ **490+ tests** implemented
- ✅ **~21,800+ lines** of test code added
- ✅ **Complete E2E coverage** (frontend + backend + visual)
- ✅ **Perfect parallel execution** - no conflicts between agents

**Status Summary:**
- Chris's work: 100% merged into `develop` branch
- Jason's work: 100% complete and awaiting review/merge

**Assign Jason's Open PRs (if needed):**
```powershell
# Jason's PRs are all assigned and open - awaiting review
gh pr edit 306 --add-assignee jschibelli
gh pr edit 307 --add-assignee jschibelli
gh pr edit 308 --add-assignee jschibelli
gh pr edit 309 --add-assignee jschibelli
gh pr edit 310 --add-assignee jschibelli
gh pr edit 311 --add-assignee jschibelli
gh pr edit 312 --add-assignee jschibelli

# Chris's PRs are all MERGED - no action needed ✅
```

**Update Project Status for Jason's Issues (if needed):**
```powershell
# Mark Jason's issues as ready for review (if not already done)
.\scripts\agent-status-update.ps1 -IssueNumber 292 -Action complete -AgentName jason
.\scripts\agent-status-update.ps1 -IssueNumber 294 -Action complete -AgentName jason
.\scripts\agent-status-update.ps1 -IssueNumber 297 -Action complete -AgentName jason
.\scripts\agent-status-update.ps1 -IssueNumber 299 -Action complete -AgentName jason
.\scripts\agent-status-update.ps1 -IssueNumber 301 -Action complete -AgentName jason
.\scripts\agent-status-update.ps1 -IssueNumber 303 -Action complete -AgentName jason
.\scripts\agent-status-update.ps1 -IssueNumber 305 -Action complete -AgentName jason

# Chris's issues are already merged - status already updated to "Done" ✅
```

**To Merge Jason's PRs (once reviewed):**
```powershell
# Merge each PR after approval
gh pr merge 306 --rebase --delete-branch
gh pr merge 307 --rebase --delete-branch
gh pr merge 308 --rebase --delete-branch
gh pr merge 309 --rebase --delete-branch
gh pr merge 310 --rebase --delete-branch
gh pr merge 311 --rebase --delete-branch
gh pr merge 312 --rebase --delete-branch

# Update status to "Done" after merge
.\scripts\agent-status-update.ps1 -IssueNumber 292 -Action merge-pr -AgentName jason
.\scripts\agent-status-update.ps1 -IssueNumber 294 -Action merge-pr -AgentName jason
.\scripts\agent-status-update.ps1 -IssueNumber 297 -Action merge-pr -AgentName jason
.\scripts\agent-status-update.ps1 -IssueNumber 299 -Action merge-pr -AgentName jason
.\scripts\agent-status-update.ps1 -IssueNumber 301 -Action merge-pr -AgentName jason
.\scripts\agent-status-update.ps1 -IssueNumber 303 -Action merge-pr -AgentName jason
.\scripts\agent-status-update.ps1 -IssueNumber 305 -Action merge-pr -AgentName jason
```

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