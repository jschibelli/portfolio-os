# Issue → Merge: End-to-End Workflow

This guide shows the exact steps from opening an issue to merging a PR, leveraging your automations.

## 0) Prereqs (one time)
- Install and auth GitHub CLI:
  ```bash
  gh --version
  gh auth status || gh auth login
  ```
- From repo root, confirm scripts:
  ```bash
  ls scripts/
  ```

## 1) Open an Issue
- Create a new issue in GitHub or via CLI:
  ```bash
  gh issue create -t "<Title>" -b "<Description>"
  ```
- The repo auto-adds it to the Portfolio Project.
- Optionally run Auto-Configure (Actions → Auto-Configure Issues) to set Priority/Size/App/Area, or use ChatOps in a comment:
  - `/priority p1`
  - `/status ready`
  - `/labels add ready-to-implement`

## 2) Prepare Implementation
- Trigger analysis via Actions → "Issue Implementation Automation" (manual), or locally:
  ```powershell
  pwsh scripts/trigger-issue-implementation.ps1 -IssueNumber <N> -Method github-actions
  ```
- The workflow posts an analysis comment and artifacts (plan + JSON).
- Review the plan and confirm acceptance criteria.

## 3) Create a Branch and PR
- Create a branch and push:
  ```bash
  git checkout -b feature/<issue-#>-short-slug
  # implement changes
  git commit -m "feat: implement <short description> (#{ISSUE})"
  git push -u origin HEAD
  gh pr create -t "<Title>" -b "Resolves #<ISSUE>"
  ```
- New PR is added to the Portfolio Project automatically.

## 4) Address Reviews with Automation
- Monitor CR‑GPT comments:
  ```powershell
  pwsh scripts/pr-monitor.ps1 -PRNumber <PR>
  pwsh scripts/cr-gpt-analyzer.ps1 -PRNumber <PR> -GenerateReport -ExportTo analysis.md
  ```
- Draft responses or auto-fixes:
  ```powershell
  pwsh scripts/auto-response-generator.ps1 -PRNumber <PR> -DryRun
  ```
- Reply to a specific review comment (threaded):
  ```powershell
  pwsh scripts/reply-to-review-comment.ps1 -PRNumber <PR> -CommentId <ID> -ResponseFile reply.md
  ```
- Review comment automation adds helpful labels based on feedback.

## 5) Keep Issue Status Updated (ChatOps)
- In the issue, comment commands:
  - `/assign me` → assigns you
  - `/status in progress` → moves Project Status
  - `/priority p0` or `/priority p2`
  - `/labels add needs-review, area: infra`

## 6) Quality Checks
- Run linters/tests locally or via CI as usual.
- If the plan suggests edits, commit and push updates; PR monitors/labels keep pace.

## 7) Merge Readiness
- Ensure:
  - All CR‑GPT and reviewer comments are resolved
  - CI green
  - Issue acceptance criteria met
- Optionally use `/status in review` while waiting for approval.

## 8) Merge
- Merge in GitHub UI, or via CLI:
  ```bash
  gh pr merge <PR> --rebase --delete-branch
  ```
- Close the issue if not auto-closed by commit message.
- Update status: `/status done` on the issue if needed.

## FAQ
- "If I paste an issue link and hit enter, does it push the process?"
  - Paste the link into the issue or PR comment and use ChatOps commands (`/status`, `/priority`, `/assign me`) to drive updates. The router listens for commands and updates project fields, labels, and assignment automatically.

- "Where are the commands defined?"
  - `.github/workflows/issue-comment-router.yml` (issue comments)
  - `.github/workflows/review-comment-automation.yml` (PR review comments)

- "Where are scripts?"
  - Root `scripts/` directory (PowerShell + helpers).
