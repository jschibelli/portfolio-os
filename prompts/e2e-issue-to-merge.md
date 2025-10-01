Automate end-to-end: https://github.com/jschibelli/portfolio-os/pull/223#issue-3471917573. Detect if it's an issue or PR; for issues, trigger analysis, set fields, assign me, create and track the PR; for PRs, monitor reviews, analyze CR‑GPT, post threaded replies, keep Status updated, run checks, and drive to merge.

**For Issues:**
- Use `.\scripts\issue-config-unified.ps1 -IssueNumber <NUMBER> -Preset blog -AddToProject`
- Auto-configure project fields (Status=In progress, Priority=P1, Size=M, App=Portfolio Site, Area=Frontend, Assignee=jschibelli)
- Analyze requirements and generate implementation plan
- Create branch with issue number prefix
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