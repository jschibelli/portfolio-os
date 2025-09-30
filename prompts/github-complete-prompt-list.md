Here’s a set of ready-to-paste one‑liners you can use (swap in your links/values).

Issue-focused
- Analyze and plan: <ISSUE_URL>. Generate plan, acceptance criteria, risks, and next commands.
- Auto-configure: <ISSUE_URL>. Set Status=Ready, Priority=P1, Size=M, App=Portfolio Site, Area=Frontend; label ready-to-implement.
- Start work: <ISSUE_URL>. Assign me, set Status=In progress, create branch name, list first 3 steps.
- Implement end-to-end: <ISSUE_URL>. Analyze, set fields, create and track PR, monitor CR‑GPT, reply, update Status, guide to merge.
- Grooming: <ISSUE_URL>. Break into subtasks with estimates and labels.

PR-focused
- Automate this PR end-to-end: <PR_URL>. Monitor reviews, analyze CR‑GPT, draft threaded replies, update Project Status, run checks, drive to merge.
- Review summary: <PR_URL>. Summarize reviewer+CR‑GPT comments by priority with an action checklist.
- Draft replies: <PR_URL>. Generate concise threaded replies for all unresolved comments.
- Conflict guard: <PR_URL>. Check mergeability, attempt auto-rebase, and report outcome.
- Metadata & routing: <PR_URL>. Add labels [type: enhancement, area: frontend], request reviewers @user1 @user2, link related issue.
- Merge prep: <PR_URL>. Verify all comments resolved and CI green; produce final merge checklist (rebase merge).
- Changelog: <PR_URL>. Draft release notes and improve PR description.

Cross-cutting
- Status update: <URL>. Set Status=<ready|in progress|in review|done>, Priority=<p0|p1|p2>, add labels <LABELS>.
- Test & QA: <PR_URL>. Run lint/test/build summary; list failures with suggested fixes.
- Security scan: <PR_URL>. Identify security-sensitive diffs and propose mitigations.
- Performance pass: <PR_URL>. Inspect hotspots; propose measurable optimizations.
- Docs pass: <PR_URL>. Identify docs to update and draft changes.
- Backport/cherry-pick: <PR_URL>. Create backport PR to <BRANCH> with minimal diffs.

Ops/maintenance
- Dependency refresh: <URL>. Propose safe dependency updates and impact notes.
- Dead code/find TODOs: <PR_URL>. Flag dead code and convert TODOs into actionable tasks with owners.
- Risk assessment: <PR_URL>. Summarize risks, rollback plan, and validation steps.

Universal autopilot
- Automate end-to-end: <URL>. Detect issue vs PR; for issues, analyze, set fields, create and track PR; for PRs, monitor reviews, analyze CR‑GPT, thread replies, update Status, run checks, drive to merge (rebase merge).
