# Workspace Organization Guidelines

## Purpose

This document defines conventions for organizing project files to enable collaboration across multiple agent worktrees while keeping the repository root clean.

## File Organization Strategy

### For Files Shared Across Worktrees
**Use git-tracked directories** - These are accessible to all agent worktrees:
- `docs/project-management/` - Project planning, status docs, assignments
- `scripts/project-management/` - Project-specific automation scripts

### For Temporary Personal Files
**Use `.workspace/` directory** (gitignored, main tree only):
- Personal scratch notes
- Temporary testing files
- Local experimentation
- Files you don't want committed

### What Goes in `docs/project-management/`

**Project documentation that all agents need access to:**
- Agent task assignments and tracking
- Status updates and progress reports
- Implementation plans and execution summaries
- PR/issue analysis and assignment files
- Project coordination documents
- Sprint planning and retrospectives

### What Goes in `scripts/project-management/`

**Project-specific automation scripts:**
- PR assignment scripts
- Status checking scripts
- Project-specific workflows
- Release automation

### What Goes in `.workspace/`

**Personal temporary files (main tree only, gitignored):**
- Personal scratch notes
- Temporary testing
- Local experimentation
- Draft work in progress

### What Does NOT Go Anywhere Special

- Permanent documentation → `docs/`
- Reusable scripts → `scripts/`
- Project configuration → root
- Source code → `apps/` or `packages/`

## File Naming Conventions

Use descriptive names with consistent formatting:

```
✅ Good:
  docs/project-management/chatbot-v1.1.0/EXECUTE_3_AGENT_WORKFLOW.md
  scripts/project-management/chatbot-v1.1.0/chatbot-pr-status-check.ps1
  .workspace/personal-notes.md (temporary only)

❌ Bad:
  AGENT_1_TASKS.md (root clutter)
  MY_NOTES.txt (unclear purpose)
  temp123.md (not descriptive)
```

## Scripts Organization

### Reusable Project Scripts
Create in `scripts/project-management/<project-name>/`:
- Git-tracked ✅
- Accessible from all worktrees ✅
- Version controlled ✅

### Truly Temporary Scripts
Create in `scripts/temp/` (gitignored):
- One-off testing scripts
- Quick experiments
- Not intended for reuse

### Never
Don't create scripts in root directory

## Git Ignore Patterns

The following are gitignored:

- `.workspace/` - Personal temporary files (main tree only)
- `scripts/temp/` - Truly temporary one-off scripts

**Everything else is tracked by git**, allowing all worktrees to access project files.

## Quick Reference

| Content Type | Location | Gitignored | Accessible to Worktrees |
|--------------|----------|------------|------------------------|
| Project planning | `docs/project-management/` | ❌ No | ✅ Yes |
| Project scripts | `scripts/project-management/` | ❌ No | ✅ Yes |
| Personal notes | `.workspace/` | ✅ Yes | ❌ No (main tree only) |
| Temp scripts | `scripts/temp/` | ✅ Yes | ❌ No |
| Permanent docs | `docs/` | ❌ No | ✅ Yes |
| Reusable scripts | `scripts/*/` | ❌ No | ✅ Yes |

## Examples

### Before (❌ Cluttered Root)
```
portfolio-os/
  ├── AGENT_1_CHATBOT_TASKS.md
  ├── CHATBOT_STATUS_AND_3AGENT_PLAN.md
  ├── OUTSTANDING_ISSUES_SUMMARY.md
  ├── assign-prs-to-agents.ps1
  ├── START_PARALLEL_AGENTS.ps1
  └── ...
```

### After (✅ Organized & Accessible)
```
portfolio-os/
  ├── .workspace/               # Personal temp files (gitignored)
  │   └── personal-notes.md
  ├── docs/
  │   └── project-management/   # Project docs (git-tracked)
  │       └── chatbot-v1.1.0/
  │           ├── EXECUTE_3_AGENT_WORKFLOW.md
  │           ├── chatbot-v1.1.0-status.md
  │           └── chatbot-3-agent-assignments.md
  ├── scripts/
  │   └── project-management/   # Project scripts (git-tracked)
  │       └── chatbot-v1.1.0/
  │           ├── assign-chatbot-prs-3-agents.ps1
  │           └── chatbot-pr-status-check.ps1
  ├── apps/
  └── packages/
```

## For AI Agents & Worktrees

When working on projects:

1. **Project documentation** → `docs/project-management/<project-name>/` (git-tracked, all worktrees can access)
2. **Project scripts** → `scripts/project-management/<project-name>/` (git-tracked, all worktrees can access)
3. **Personal temp files** → `.workspace/` (gitignored, main tree only)
4. **Permanent docs** → `docs/` (git-tracked)
5. **Keep root clean** - only essential config files

### Working from Agent Worktrees

All git-tracked files are accessible from worktrees:
```bash
# From any worktree
cd /path/to/agent-1-worktree
cat docs/project-management/chatbot-v1.1.0/EXECUTE_3_AGENT_WORKFLOW.md
./scripts/project-management/chatbot-v1.1.0/chatbot-pr-status-check.ps1
```

## Questions?

See `docs/CONTRIBUTING.md` for general contribution guidelines or `docs/project-management/` for project organization details.

