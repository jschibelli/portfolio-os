# Comment Automation Guide

This doc explains the new comment automation features for issues and PR review comments.

## Issue Comment Router

Workflow: `.github/workflows/issue-comment-router.yml`

Triggers on issue comments (`created`, `edited`) and supports ChatOps commands:

- `/help` – lists available commands
- `/assign me` – assigns the commenting user to the issue
- `/unassign me` – removes the commenting user from the issue
- `/labels add <comma,separated>` – adds labels
- `/status <ready|in progress|in review|done>` – updates Project Status (Project V2)
- `/priority <p0|p1|p2>` – updates Project Priority (Project V2)

Notes:
- Field and option IDs are wired to the Portfolio Project via GraphQL, reusing IDs from existing scripts.
- Requires default `GITHUB_TOKEN` permissions (already specified in the workflow).

## Review Comment Automation

Workflow: `.github/workflows/review-comment-automation.yml`

Triggers on PR review comments and performs simple triage:

- Adds `type: bug` label when bug-like keywords detected
- Adds `area: performance` label for perf-related feedback
- (Optional) Can call `scripts/auto-response-generator.ps1` to draft replies

## Threaded Replies to Review Comments

Script: `scripts/reply-to-review-comment.ps1`

Usage:

```powershell
pwsh scripts/reply-to-review-comment.ps1 -PRNumber <PR_NUMBER> -CommentId <COMMENT_ID> -ResponseFile <PATH_TO_MD>
```

This now posts a threaded reply directly under the specific review comment using the GitHub API:

```text
POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/replies
```

## Tips

- Keep using root `scripts/` for automation scripts.
- Prefer `$PSScriptRoot` inside scripts to reference neighbors.
- For local testing, export `GH_TOKEN` or run `gh auth login`.


