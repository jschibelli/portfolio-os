# Documentation Discovery Guide for AI Agents

## 📍 Primary Documentation Location

**Always start here**: `DOCS_MAP.md` in the repository root

This file provides a complete map of all documentation in Portfolio OS.

## 🌐 Documentation Site

**URL**: http://localhost:3000 (when running `pnpm dev`)

**Location**: `apps/docs/contents/docs/`

All developer-facing documentation is in the docs app as MDX files.

## 🔍 Finding Information

### Step 1: Check DOCS_MAP.md

```bash
# Read the documentation map
cat DOCS_MAP.md
```

This provides:
- Links to all documentation sections
- File locations
- Quick access URLs

### Step 2: Navigate to Specific Section

Documentation is organized by topic:

| Topic | Location | When to Use |
|-------|----------|-------------|
| Getting Started | `apps/docs/contents/docs/getting-started/` | Setup, installation, first steps |
| Developer Guide | `apps/docs/contents/docs/developer-guide/` | Architecture, workflow, standards |
| Scripts Reference | `apps/docs/contents/docs/scripts-reference/` | PowerShell automation scripts |
| Multi-Agent | `apps/docs/contents/docs/multi-agent/` | Multi-agent development |
| API Reference | `apps/docs/contents/docs/api-reference/` | API documentation |
| Troubleshooting | `apps/docs/contents/docs/troubleshooting/` | Problem solving |
| Setup Guides | `apps/docs/contents/docs/setup/` | System configuration |

### Step 3: Read MDX Files

Documentation files use MDX format (Markdown + React components).

```bash
# Example: Read getting started guide
cat apps/docs/contents/docs/getting-started/index.mdx

# Example: Read architecture overview
cat apps/docs/contents/docs/developer-guide/architecture/index.mdx
```

## 📚 Common Documentation Queries

### "How do I set up the project?"

**Answer**: `apps/docs/contents/docs/getting-started/index.mdx`

### "What's the architecture?"

**Answer**: `apps/docs/contents/docs/developer-guide/architecture/index.mdx`

### "How do I use PowerShell scripts?"

**Answer**: `apps/docs/contents/docs/scripts-reference/index.mdx`

### "What are the coding standards?"

**Answer**: `apps/docs/contents/docs/developer-guide/standards/index.mdx`

### "How does the monorepo work?"

**Answer**: `apps/docs/contents/docs/developer-guide/monorepo/index.mdx`

### "How do I configure multi-agent development?"

**Answer**: `apps/docs/contents/docs/multi-agent/quick-start/index.mdx`

### "Where are the API docs?"

**Answer**: `apps/docs/contents/docs/api-reference/index.mdx`

## 🛠️ Script-Specific Documentation

For detailed script documentation:

1. Check `scripts/[category]/README.md` files
2. Look for `DEVELOPER_GUIDE.md` in script directories
3. View script help: `Get-Help .\script-name.ps1 -Full`

Example:
```bash
# Script documentation
cat scripts/agent-management/README.md
cat scripts/pr-management/DEVELOPER_GUIDE.md
```

## 📖 Reading Documentation as an Agent

### Best Practices

1. **Start with DOCS_MAP.md** - Get the big picture
2. **Be specific** - Navigate directly to relevant sections
3. **Read incrementally** - Don't read entire docs at once
4. **Check examples** - Look for code examples and usage patterns
5. **Cross-reference** - Follow links to related documentation

### Documentation Structure

Each major section has:
- **index.mdx** - Overview and navigation
- **Subsections** - Detailed topic pages
- **Examples** - Code examples and usage
- **Links** - Cross-references to related docs

### MDX Components

Documentation uses these components (ignore in code blocks):

- `<Note>` - Important information
- `<Card>` - Navigation cards
- `<Tabs>` - Tabbed content
- `<Step>` - Step-by-step guides
- `<FileTree>` - Directory structures
- Code blocks with syntax highlighting

## 🔗 Technical Documentation in Source

Some documentation stays in source files:

- **Script README files**: `scripts/*/README.md`
- **App documentation**: `apps/*/README.md`
- **Package docs**: `packages/*/README.md`

These provide implementation details and are linked from the main docs.

## 📝 Updating Documentation

When you make changes that affect documentation:

1. Update relevant MDX files in `apps/docs/contents/docs/`
2. Keep DOCS_MAP.md synchronized
3. Update cross-references
4. Test documentation builds

## 🚦 Documentation Workflow for Agents

### When Starting a Task

1. Read DOCS_MAP.md
2. Navigate to relevant documentation section
3. Review coding standards and architecture
4. Check for existing examples

### When Implementing Features

1. Follow patterns from Developer Guide
2. Reference API documentation
3. Use automation scripts as documented
4. Adhere to coding standards

### When Encountering Issues

1. Check Troubleshooting section
2. Review setup guides
3. Examine script documentation
4. Look for similar examples in codebase

### When Completing Work

1. Update documentation if needed
2. Add examples for new features
3. Document any workarounds
4. Update relevant README files

## 🎯 Quick Reference Commands

```bash
# Start documentation site
cd apps/docs && pnpm dev

# Read documentation map
cat DOCS_MAP.md

# Find specific documentation
find apps/docs/contents/docs -name "*topic*"

# Search documentation content
grep -r "search term" apps/docs/contents/docs/

# List all documentation files
ls -R apps/docs/contents/docs/
```

## 💡 Tips for Effective Documentation Use

1. **Trust the map**: DOCS_MAP.md is your starting point
2. **Be targeted**: Read only what you need for your current task
3. **Follow links**: Documentation is interconnected
4. **Check timestamps**: DOCS_MAP.md shows last update date
5. **Report gaps**: If documentation is missing or unclear, note it

## 🔄 Documentation Updates

Documentation is continuously updated. Always:

1. Check DOCS_MAP.md for the latest structure
2. Look for "Last Updated" timestamps
3. Follow links to see current content
4. Report outdated information

## 📞 Getting Help with Documentation

If documentation is unclear or missing:

1. Check DOCS_MAP.md first
2. Search existing documentation
3. Look for README files in relevant directories
4. Report documentation gaps in your work summary

---

**Remember**: Documentation is your guide. Use it effectively, keep it updated, and help improve it for others.

