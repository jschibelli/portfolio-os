# Chatbot v1.1.0 - Project Management Scripts

Automation scripts for managing the Chatbot v1.1.0 release (Epic #321).

---

## 📜 Available Scripts

### `chatbot-pr-status-check.ps1`
Check the status of all 9 chatbot PRs.

**Usage:**
```powershell
.\scripts\project-management\chatbot-v1.1.0\chatbot-pr-status-check.ps1

# With detailed output
.\scripts\project-management\chatbot-v1.1.0\chatbot-pr-status-check.ps1 -Detailed
```

**What it shows:**
- Which PRs have commits
- CI status (passing/failing/pending)
- Review status (approved/changes requested/needs review)
- Summary of what needs attention

---

### `assign-chatbot-prs-3-agents.ps1`
Assign all chatbot PRs to the 3 agents with labels and comments.

**Usage:**
```powershell
# Dry run first (safe, shows what it would do)
.\scripts\project-management\chatbot-v1.1.0\assign-chatbot-prs-3-agents.ps1 -DryRun

# Actually assign
.\scripts\project-management\chatbot-v1.1.0\assign-chatbot-prs-3-agents.ps1
```

**What it does:**
- Adds agent labels to PRs (agent:1, agent:2, needs-qa)
- Adds assignment comments explaining roles
- Adds v1.1.0 tracking label
- Coordinates 3-agent workflow

---

## 👥 Agent Assignments

| Agent | PRs | Script Usage |
|-------|-----|--------------|
| **Agent 1 (Chris)** | 8 PRs (333,336,337,340,334,335,338,339) | Owner/Implementation |
| **Agent 2 (Jason)** | 1 PR (332) + Review 3 | Backend Review |
| **Agent 3 (QA)** | Review all 9 | Testing & Merge |

---

## 🔗 Related Documentation

Full documentation in `docs/project-management/chatbot-v1.1.0/`:
- [EXECUTE_3_AGENT_WORKFLOW.md](../../../docs/project-management/chatbot-v1.1.0/EXECUTE_3_AGENT_WORKFLOW.md) - Step-by-step guide
- [chatbot-3-agent-assignments.md](../../../docs/project-management/chatbot-v1.1.0/chatbot-3-agent-assignments.md) - Full assignments
- [chatbot-quick-reference.md](../../../docs/project-management/chatbot-v1.1.0/chatbot-quick-reference.md) - Quick commands

---

## 💡 Examples

### Check status before starting work
```powershell
cd C:\path\to\portfolio-os
.\scripts\project-management\chatbot-v1.1.0\chatbot-pr-status-check.ps1
```

### Assign PRs to begin 3-agent workflow
```powershell
# See what it would do first
.\scripts\project-management\chatbot-v1.1.0\assign-chatbot-prs-3-agents.ps1 -DryRun

# If it looks good, run for real
.\scripts\project-management\chatbot-v1.1.0\assign-chatbot-prs-3-agents.ps1
```

---

## 📝 Notes

- These scripts work from any worktree (main tree or agent worktrees)
- They use GitHub CLI (`gh`) - ensure it's installed and authenticated
- Scripts are safe to run multiple times (idempotent)
- Use `-DryRun` to preview changes before making them

---

**Last Updated:** October 20, 2025

