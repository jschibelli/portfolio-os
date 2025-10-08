# Portfolio OS Documentation Map

## 🌐 Primary Documentation Site

**apps/docs** - [http://localhost:3000](http://localhost:3000)

Complete searchable documentation for developers, contributors, and users.

### Quick Access

- **Getting Started**: [http://localhost:3000/docs/getting-started](http://localhost:3000/docs/getting-started)
- **Developer Guide**: [http://localhost:3000/docs/developer-guide](http://localhost:3000/docs/developer-guide)
- **Scripts Reference**: [http://localhost:3000/docs/scripts-reference](http://localhost:3000/docs/scripts-reference)
- **Multi-Agent System**: [http://localhost:3000/docs/multi-agent](http://localhost:3000/docs/multi-agent)
- **API Reference**: [http://localhost:3000/docs/api-reference](http://localhost:3000/docs/api-reference)

## 📚 Documentation Structure

### 1. Getting Started
**Location**: `apps/docs/contents/docs/getting-started/`

Essential guides for new developers:
- Quick Start (10-minute setup)
- Installation & Prerequisites
- Environment Configuration
- First Steps Tutorial

### 2. Developer Guide
**Location**: `apps/docs/contents/docs/developer-guide/`

Comprehensive development documentation:
- Architecture Overview
- Development Workflow
- Coding Standards
- Monorepo Structure
- Package System

### 3. Scripts Reference
**Location**: `apps/docs/contents/docs/scripts-reference/`

PowerShell automation scripts:
- Agent Management
- PR Management
- Issue Management
- Core Utilities
- Automation Scripts

### 4. Multi-Agent System
**Location**: `apps/docs/contents/docs/multi-agent/`

Parallel development with AI agents:
- System Architecture
- Quick Start Guide
- Agent Coordination
- Worktree Management
- Workflow Automation

### 5. API Reference
**Location**: `apps/docs/contents/docs/api-reference/`

API documentation:
- REST API
- Hashnode Integration
- GraphQL Endpoints
- Authentication

### 6. Apps & Packages
**Location**: `apps/docs/contents/docs/apps-packages/`

Application and package documentation:
- Site App
- Dashboard App
- Shared Packages
- UI Components

### 7. Troubleshooting
**Location**: `apps/docs/contents/docs/troubleshooting/`

Problem-solving guides:
- Common Issues
- Development Problems
- Deployment Issues
- Performance Optimization

### 8. Setup Guides
**Location**: `apps/docs/contents/docs/setup/`

System configuration:
- Worktree Setup
- Database Setup
- Deployment Runbook
- Caching Configuration

## 📖 Technical Documentation (Keep in Source)

These files remain in their original locations for context:

### Script Documentation
- `scripts/[category]/README.md` - Script-specific technical documentation
- `scripts/[category]/DEVELOPER_GUIDE.md` - Developer guides for script categories

### App Documentation
- `apps/site/README.md` - Site app setup instructions
- `apps/dashboard/README.md` - Dashboard app documentation

### Package Documentation
- `packages/[package]/README.md` - Package-specific documentation

### Root Documentation
- `docs/` - Legacy documentation (being migrated to apps/docs)
  - `docs/setup/` - Setup guides
  - `docs/automation/` - Automation documentation
  - `docs/api/` - API documentation
  - `docs/troubleshooting/` - Troubleshooting guides

## 🔍 Finding Documentation

### For Developers

1. **Start here**: [Getting Started](http://localhost:3001/docs/getting-started)
2. **Learn architecture**: [Developer Guide](http://localhost:3001/docs/developer-guide)
3. **Automate tasks**: [Scripts Reference](http://localhost:3001/docs/scripts-reference)

### For AI Agents

1. **System overview**: [Multi-Agent System](http://localhost:3001/docs/multi-agent)
2. **Coding standards**: [Developer Guide > Standards](http://localhost:3001/docs/developer-guide/standards)
3. **Workflows**: [Developer Guide > Workflow](http://localhost:3001/docs/developer-guide/workflow)

### For Contributors

1. **Setup**: [Getting Started > Installation](http://localhost:3001/docs/getting-started/installation)
2. **Standards**: [Developer Guide > Coding Standards](http://localhost:3001/docs/developer-guide/standards)
3. **Workflow**: [Developer Guide > Development Workflow](http://localhost:3001/docs/developer-guide/workflow)

## 🚀 Quick Commands

```bash
# Start documentation site
cd apps/docs
pnpm dev # Opens at localhost:3001

# Build documentation
pnpm build

# Search documentation
# Use the search bar in the docs site
```

## 📝 Contributing to Documentation

To update documentation:

1. Edit MDX files in `apps/docs/contents/docs/`
2. Test locally with `pnpm dev`
3. Submit PR with documentation updates

### File Naming Convention

- Use kebab-case: `getting-started`, `developer-guide`
- Main pages: `index.mdx`
- Subpages: `[topic]/index.mdx`

### Documentation Standards

- Use MDX for rich components (Cards, Tabs, Steps, Notes)
- Include code examples where applicable
- Link to related pages
- Keep pages focused and scannable

## 🔗 External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [PNPM Documentation](https://pnpm.io)

## 📧 Getting Help

- **Documentation Issues**: Open issue with `documentation` label
- **Missing Docs**: Request via GitHub issue
- **Incorrect Information**: Submit PR with corrections

---

**Last Updated**: 2025-10-08

**Maintained By**: Portfolio OS Team

