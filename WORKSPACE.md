# Workspace Organization Guidelines

## Purpose

This document defines conventions for organizing temporary files, agent-generated content, and task management files to keep the repository root clean and maintainable.

## The `.workspace/` Directory

All AI agent collaboration files, task management docs, planning documents, and temporary work files should be placed in the `.workspace/` directory.

### What Goes in `.workspace/`

- Agent task assignments and tracking (e.g., `agent-1-tasks.md`)
- Status updates and progress reports (e.g., `chatbot-status.md`)
- Implementation plans and execution summaries (e.g., `implementation-plan.md`)
- PR/issue analysis and assignment files (e.g., `pr-assignments.md`)
- Temporary workflow coordination files
- Code review responses and feedback drafts

### What Does NOT Go in `.workspace/`

- Permanent documentation → goes in `docs/`
- Scripts meant to be reused → goes in `scripts/`
- Project configuration → stays in root
- Source code → goes in `apps/` or `packages/`

## File Naming Conventions

When creating files in `.workspace/`, use descriptive lowercase names with hyphens:

```
✅ Good:
  .workspace/agent-1-frontend-tasks.md
  .workspace/chatbot-implementation-plan.md
  .workspace/pr-review-notes.md

❌ Bad:
  AGENT_1_TASKS.md (root clutter)
  MY_NOTES.txt (unclear purpose)
  temp123.md (not descriptive)
```

## Temporary Scripts

If you need to create temporary automation scripts:

1. **Preferred:** Use existing scripts in `scripts/` directories
2. **If needed:** Create in `scripts/temp/` (gitignored)
3. **Never:** Create temp scripts in root directory

## Git Ignore Patterns

The following patterns are automatically ignored by git to prevent accidental commits:

- `.workspace/` - All workspace content
- `AGENT_*.md` - Agent-generated files in root
- `*_TASKS.md`, `*_SUMMARY.md`, `*_PLAN.md`, etc.
- `pr-*.md`, `issue-*.md`, `cr-response*.md`
- Temp scripts: `assign-*.ps1`, `START_*.ps1`

## Quick Reference

| Content Type | Location | Gitignored |
|--------------|----------|------------|
| Agent tasks | `.workspace/` | ✅ Yes |
| Planning docs | `.workspace/` | ✅ Yes |
| Temp scripts | `scripts/temp/` | ✅ Yes |
| Permanent docs | `docs/` | ❌ No |
| Reusable scripts | `scripts/*/` | ❌ No |

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

### After (✅ Clean Root)
```
portfolio-os/
  ├── .workspace/
  │   ├── agent-1-chatbot-tasks.md
  │   ├── chatbot-status-and-plan.md
  │   ├── outstanding-issues.md
  │   └── pr-assignments.md
  ├── apps/
  ├── docs/
  ├── scripts/
  └── ...
```

## For AI Agents

When working on tasks:

1. **Create task files** in `.workspace/` not root
2. **Use existing scripts** in `scripts/` directories
3. **Document permanent changes** in `docs/`
4. **Keep root clean** - only essential config files

## Questions?

See `docs/CONTRIBUTING.md` for general contribution guidelines or `docs/project-management/` for project organization details.

