# Multi-Agent E2E Development Workflow

## 🎯 Overview
This enhanced workflow combines multi-agent development with end-to-end automation for parallel development by **Chris (Frontend/UI Specialist)** and **Jason (Infrastructure/Testing Specialist)**. Each agent works on assigned issues with full automation from issue creation to merge.

> **Note**: For single-developer workflows without agent assignments, see `workflows/e2e-issue-to-merge.md`

## 🆕 **Enhanced Automation Features**

### **Auto Branch Creation on Issue Creation**
Issues created with enhanced script automatically get branches:
```powershell
.\scripts\issue-management\create-issue-enhanced.ps1 `
  -Title "Implement feature" `
  -Body "Description" `
  -CreateBranch `
  -PushBranch
```

### **Auto Workflow Doc Updates on Agent Assignment**
Agent assignments automatically update this workflow document:
```powershell
.\scripts\agent-management\assign-agent-enhanced.ps1 `
  -IssueNumber 292 `
  -AgentName jason `
  -UpdateWorkflowDocs
```

### **Current Agent Specialties**
- **Chris (agent-1-chris)**: Frontend components, UI/UX, React/Next.js, accessibility, performance optimization, visual testing
- **Jason (agent-2-jason)**: Backend infrastructure, DevOps, SEO, testing frameworks, security, API integration, performance monitoring

### **Current Active Projects:**

**Playwright Test Coverage Integration (Epic #291 - Milestone #17)**
- **Jason (agent-2-jason)**: 7 issues - Foundation (#292 - CRITICAL FIRST), backend integration tests, performance tests
  - #292 - Test Utils & Config Updates ⚠️ **BLOCKS ALL OTHERS**
  - #294 - Projects & Portfolio Tests
  - #297 - Protected Routes & Session Tests
  - #299 - Newsletter Subscription Tests
  - #301 - Booking System Tests
  - #303 - Error Handling & Edge Cases
  - #305 - Performance & Advanced Accessibility

- **Chris (agent-1-chris)**: 7 issues - Frontend UI tests, interactive components, visual regression
  - #293 - Blog Post Detail Page Tests
  - #295 - Homepage Interactive Tests
  - #296 - Authentication Flow Tests
  - #298 - Contact Form Flow Tests
  - #300 - Chatbot Interaction Tests
  - #302 - Interactive Component Tests
  - #304 - Visual Regression Expansion

**⚠️ Critical Dependency**: Jason's #292 (Test Utils) MUST be completed first - all other test issues depend on it.

---

## 🤖 **Multi-Agent E2E Automation**

### **Agent 1: Frontend/UI Specialist**
```powershell
# Start continuous processing for Agent 1 issues
.\scripts\continuous-issue-pipeline.ps1 -MaxIssues 4 -Status "Ready" -Priority "P0,P1" -Area "Frontend" -Agent "Agent1"

# Or process specific issues
.\scripts\issue-config-unified.ps1 -IssueNumber 247 -Preset frontend -AddToProject
.\scripts\issue-config-unified.ps1 -IssueNumber 251 -Preset frontend -AddToProject  
.\scripts\issue-config-unified.ps1 -IssueNumber 253 -Preset frontend -AddToProject
.\scripts\issue-config-unified.ps1 -IssueNumber 254 -Preset frontend -AddToProject
```

### **Agent 2: Infrastructure/SEO Specialist**
```powershell
# Start continuous processing for Agent 2 issues
.\scripts\continuous-issue-pipeline.ps1 -MaxIssues 4 -Status "Ready" -Priority "P0,P1" -Area "Infra,Content" -Agent "Agent2"

# Or process specific issues
.\scripts\issue-config-unified.ps1 -IssueNumber 248 -Preset infra -AddToProject
.\scripts\issue-config-unified.ps1 -IssueNumber 249 -Preset infra -AddToProject
.\scripts\issue-config-unified.ps1 -IssueNumber 250 -Preset seo -AddToProject
.\scripts\issue-config-unified.ps1 -IssueNumber 252 -Preset content -AddToProject
```

## 🔄 **Enhanced Multi-Agent Workflow**

### **Phase 1: Issue Analysis & Configuration**
```powershell
# Each agent runs this for their assigned issues
.\scripts\issue-config-unified.ps1 -IssueNumber [247-254] -Preset [frontend|infra|seo|content] -AddToProject

# This automatically:
# - Analyzes issue requirements
# - Sets project fields (Status=In progress, Priority, Size, App, Area)
# - Assigns to agent
# - Creates implementation plan
```

### **Phase 2: Branch Creation & Development**
```powershell
# Create branch from release/launch-2025-10-07 (not develop for launch issues)
.\scripts\create-branch-from-release.ps1 -IssueNumber [247-254] -BaseBranch "release/launch-2025-10-07"

# This automatically:
# - Creates issue-[number]-[slug] branch
# - Sets up development environment
# - Syncs with latest release changes
```

### **Phase 3: Implementation & Testing**
```powershell
# Implement the issue
.\scripts\issue-implementation.ps1 -IssueNumber [247-254] -Agent [Agent1|Agent2]

# This automatically:
# - Generates implementation code
# - Runs tests and linting
# - Validates accessibility and performance
# - Updates documentation
```

### **Phase 4: PR Creation & Review**
```powershell
# Create PR with proper base branch
.\scripts\pr-automation-unified.ps1 -IssueNumber [247-254] -Action create -BaseBranch "release/launch-2025-10-07"

# This automatically:
# - Creates PR from issue branch to release/launch-2025-10-07
# - Sets up proper labels and assignees
# - Links PR to issue
# - Updates project status to "Ready"
```

### **Phase 5: Review & Merge Automation**
```powershell
# Monitor and automate PR review process
.\scripts\pr-automation-unified.ps1 -PRNumber [PR_NUMBER] -Action all -AutoFix

# This automatically:
# - Monitors CR-GPT bot comments
# - Analyzes feedback with priority categorization
# - Generates threaded replies to comments
# - Runs quality checks (lint, test, build)
# - Updates project status
# - Drives to merge when ready
```

## 🎯 **Agent-Specific Automation**

### **Agent 1: Frontend/UI Automation**
```powershell
# Process all Agent 1 issues in sequence
.\scripts\continuous-issue-pipeline.ps1 -MaxIssues 4 -Agent "Agent1" -Queue "frontend" -Watch

# Individual issue processing
.\scripts\issue-config-unified.ps1 -IssueNumber 247 -Preset frontend -AddToProject
.\scripts\create-branch-from-release.ps1 -IssueNumber 247 -BaseBranch "release/launch-2025-10-07"
.\scripts\issue-implementation.ps1 -IssueNumber 247 -Agent "Agent1"
.\scripts\pr-automation-unified.ps1 -IssueNumber 247 -Action create -BaseBranch "release/launch-2025-10-07"
```

### **Agent 2: Infrastructure/SEO Automation**
```powershell
# Process all Agent 2 issues in sequence
.\scripts\continuous-issue-pipeline.ps1 -MaxIssues 4 -Agent "Agent2" -Queue "infra" -Watch

# Individual issue processing
.\scripts\issue-config-unified.ps1 -IssueNumber 248 -Preset infra -AddToProject
.\scripts\create-branch-from-release.ps1 -IssueNumber 248 -BaseBranch "release/launch-2025-10-07"
.\scripts\issue-implementation.ps1 -IssueNumber 248 -Agent "Agent2"
.\scripts\pr-automation-unified.ps1 -IssueNumber 248 -Action create -BaseBranch "release/launch-2025-10-07"
```

## 🔄 **Continuous Pipeline Processing**

### **Queue Management for Multi-Agent**
```powershell
# Create agent-specific queues
.\scripts\issue-queue-manager.ps1 -Operation create -Queue "agent1-frontend" -Priority "P0,P1" -App "Portfolio Site" -Area "Frontend" -MaxConcurrent 2
.\scripts\issue-queue-manager.ps1 -Operation create -Queue "agent2-infra" -Priority "P0,P1" -App "Portfolio Site" -Area "Infra,Content" -MaxConcurrent 2

# Process queues
.\scripts\issue-queue-manager.ps1 -Operation process -Queue "agent1-frontend"
.\scripts\issue-queue-manager.ps1 -Operation process -Queue "agent2-infra"
```

### **Watch Mode for Real-Time Processing**
```powershell
# Agent 1 watch mode
.\scripts\continuous-issue-pipeline.ps1 -Watch -Interval 30 -Agent "Agent1" -Queue "frontend"

# Agent 2 watch mode  
.\scripts\continuous-issue-pipeline.ps1 -Watch -Interval 30 -Agent "Agent2" -Queue "infra"
```

## 📊 **Real-Time Project Board Updates**

### **Status Flow:**
- **Backlog** → **In progress** (when agent starts work)
- **In progress** → **Ready** (when PR is created and in review)
- **Ready** → **Done** (when PR is merged successfully)

### **Automated Status Updates:**
```powershell
# Each phase automatically updates project status
.\scripts\update-project-status.ps1 -IssueNumber [247-254] -Status "In progress" -Agent [Agent1|Agent2]
.\scripts\update-project-status.ps1 -IssueNumber [247-254] -Status "Ready" -PRNumber [PR_NUMBER]
.\scripts\update-project-status.ps1 -IssueNumber [247-254] -Status "Done" -MergedPR [PR_NUMBER]
```

## 🚨 **Conflict Resolution & Coordination**

### **Multi-Agent Conflict Prevention:**
```powershell
# Check for conflicts before starting work
.\scripts\check-agent-conflicts.ps1 -Agent1 "Agent1" -Agent2 "Agent2" -Issues "247,248,249,250,251,252,253,254"

# Sync agents' work
.\scripts\sync-agent-work.ps1 -Agent1 "Agent1" -Agent2 "Agent2" -BaseBranch "release/launch-2025-10-07"
```

### **Shared File Coordination:**
```powershell
# Check shared files before modification
.\scripts\check-shared-files.ps1 -Files "apps/site/app/layout.tsx,apps/site/components/"

# Coordinate changes to shared files
.\scripts\coordinate-shared-changes.ps1 -File "apps/site/app/layout.tsx" -Agent1 "Agent1" -Agent2 "Agent2"
```

## 🎯 **Launch Issue Specific Automation**

### **Issue #247: Contact Route and Resend Integration**
```powershell
.\scripts\issue-config-unified.ps1 -IssueNumber 247 -Preset frontend -AddToProject
.\scripts\create-branch-from-release.ps1 -IssueNumber 247 -BaseBranch "release/launch-2025-10-07"
.\scripts\issue-implementation.ps1 -IssueNumber 247 -Agent "Agent1" -Focus "contact-form,resend-api"
```

### **Issue #248: Canonical Host Redirect**
```powershell
.\scripts\issue-config-unified.ps1 -IssueNumber 248 -Preset infra -AddToProject
.\scripts\create-branch-from-release.ps1 -IssueNumber 248 -BaseBranch "release/launch-2025-10-07"
.\scripts\issue-implementation.ps1 -IssueNumber 248 -Agent "Agent2" -Focus "middleware,redirect"
```

### **Issue #249: Projects Page SSR + Crawlability**
```powershell
.\scripts\issue-config-unified.ps1 -IssueNumber 249 -Preset infra -AddToProject
.\scripts\create-branch-from-release.ps1 -IssueNumber 249 -BaseBranch "release/launch-2025-10-07"
.\scripts\issue-implementation.ps1 -IssueNumber 249 -Agent "Agent2" -Focus "ssr,projects-page"
```

### **Issue #250: SEO: robots.ts + sitemap.ts + per-page metadata**
```powershell
.\scripts\issue-config-unified.ps1 -IssueNumber 250 -Preset seo -AddToProject
.\scripts\create-branch-from-release.ps1 -IssueNumber 250 -BaseBranch "release/launch-2025-10-07"
.\scripts\issue-implementation.ps1 -IssueNumber 250 -Agent "Agent2" -Focus "seo,robots,sitemap"
```

### **Issue #251: Social: OG/Twitter Defaults + Images**
```powershell
.\scripts\issue-config-unified.ps1 -IssueNumber 251 -Preset frontend -AddToProject
.\scripts\create-branch-from-release.ps1 -IssueNumber 251 -BaseBranch "release/launch-2025-10-07"
.\scripts\issue-implementation.ps1 -IssueNumber 251 -Agent "Agent1" -Focus "og-images,social-meta"
```

### **Issue #252: Content: Remove Inflated Metrics**
```powershell
.\scripts\issue-config-unified.ps1 -IssueNumber 252 -Preset content -AddToProject
.\scripts\create-branch-from-release.ps1 -IssueNumber 252 -BaseBranch "release/launch-2025-10-07"
.\scripts\issue-implementation.ps1 -IssueNumber 252 -Agent "Agent2" -Focus "content-cleanup,metrics"
```

### **Issue #253: A11y Pass: Navigation & Focus States**
```powershell
.\scripts\issue-config-unified.ps1 -IssueNumber 253 -Preset frontend -AddToProject
.\scripts\create-branch-from-release.ps1 -IssueNumber 253 -BaseBranch "release/launch-2025-10-07"
.\scripts\issue-implementation.ps1 -IssueNumber 253 -Agent "Agent1" -Focus "accessibility,navigation"
```

### **Issue #254: Performance: Images, Fonts, Headers**
```powershell
.\scripts\issue-config-unified.ps1 -IssueNumber 254 -Preset frontend -AddToProject
.\scripts\create-branch-from-release.ps1 -IssueNumber 254 -BaseBranch "release/launch-2025-10-07"
.\scripts\issue-implementation.ps1 -IssueNumber 254 -Agent "Agent1" -Focus "performance,images,fonts"
```

## 🚀 **Quick Start Commands**

### **For Agent 1 (Frontend/UI):**
```powershell
# Start continuous processing
.\scripts\continuous-issue-pipeline.ps1 -MaxIssues 4 -Agent "Agent1" -Queue "frontend" -Watch

# Or process individually
.\scripts\issue-config-unified.ps1 -IssueNumber 247 -Preset frontend -AddToProject
.\scripts\create-branch-from-release.ps1 -IssueNumber 247 -BaseBranch "release/launch-2025-10-07"
.\scripts\issue-implementation.ps1 -IssueNumber 247 -Agent "Agent1"
```

### **For Agent 2 (Infrastructure/SEO):**
```powershell
# Start continuous processing
.\scripts\continuous-issue-pipeline.ps1 -MaxIssues 4 -Agent "Agent2" -Queue "infra" -Watch

# Or process individually
.\scripts\issue-config-unified.ps1 -IssueNumber 248 -Preset infra -AddToProject
.\scripts\create-branch-from-release.ps1 -IssueNumber 248 -BaseBranch "release/launch-2025-10-07"
.\scripts\issue-implementation.ps1 -IssueNumber 248 -Agent "Agent2"
```

## 📈 **Success Metrics & Monitoring**

### **Real-Time Dashboard:**
```powershell
# Monitor progress
.\scripts\monitor-agent-progress.ps1 -Agent1 "Agent1" -Agent2 "Agent2" -Issues "247,248,249,250,251,252,253,254"

# Check completion status
.\scripts\check-launch-readiness.ps1 -Milestone "Launch Tuesday QA (2025-10-07)"
```

### **Automated Reporting:**
```powershell
# Generate progress report
.\scripts\generate-progress-report.ps1 -Agent1 "Agent1" -Agent2 "Agent2" -Format "html"

# Check quality metrics
.\scripts\check-quality-metrics.ps1 -Issues "247,248,249,250,251,252,253,254"
```

---

**🎯 Goal**: Complete all 8 launch issues by October 7, 2025 with full automation from issue analysis to merge, while maintaining coordination between two agents working in parallel.
