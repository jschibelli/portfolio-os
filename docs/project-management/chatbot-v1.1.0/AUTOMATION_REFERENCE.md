# Chatbot v1.1.0 - Automation Reference

**All agents:** Use these automation tools to speed up your work!

---

## 🚀 Quick Start Commands

### Process All PRs Automatically (Easiest)
```powershell
# Agent 1: Process all your PRs
.\scripts\continuous-issue-pipeline.ps1 -Agent "Agent1" -Queue "chatbot" -Watch

# Agent 2: Review backend PRs
$prs = @(332, 333, 336, 337)
foreach ($pr in $prs) {
    .\scripts\pr-management\automate-pr-unified.ps1 -PRNumber $pr -Action all
}

# Agent 3: Test and merge all PRs
.\scripts\pr-management\pr-monitor.ps1 -Labels "chatbot,v1.1.0" -AutoTest -AutoMerge
```

---

## 📦 Core Automation Scripts

### 1. PR Automation (Most Powerful)
**Location:** `.\scripts\pr-management\automate-pr-unified.ps1`

**What it does:**
- Analyzes PR changes
- Fixes linter/type errors
- Responds to code review comments
- Runs tests
- Manages PR lifecycle
- Auto-merges when ready

**Usage:**
```powershell
# Fix everything automatically
.\scripts\pr-management\automate-pr-unified.ps1 -PRNumber 340 -Action all -AutoFix

# Just analyze
.\scripts\pr-management\automate-pr-unified.ps1 -PRNumber 333 -Action analyze

# Review and approve
.\scripts\pr-management\automate-pr-unified.ps1 -PRNumber 332 -Action review -AutoApprove

# Merge safely
.\scripts\pr-management\automate-pr-unified.ps1 -PRNumber 339 -Action merge -Method squash -DeleteBranch
```

---

### 2. PR Analyzer
**Location:** `.\scripts\pr-management\pr-analyzer.ps1`

**What it does:**
- Deep code analysis
- Identifies issues and improvements
- Generates reports
- Performance impact analysis

**Usage:**
```powershell
# Analyze PR
.\scripts\pr-management\pr-analyzer.ps1 -PRNumber 333

# With performance check
.\scripts\pr-management\pr-analyzer.ps1 -PRNumber 336 -CheckPerformance

# Export report
.\scripts\pr-management\pr-analyzer.ps1 -PRNumber 337 -ExportTo "analysis-report.md"
```

---

### 3. Quality Checker
**Location:** `.\scripts\pr-management\pr-quality-checker.ps1`

**What it does:**
- Runs linter
- Runs type checker
- Runs tests
- Checks build
- Validates CI status

**Usage:**
```powershell
# Full quality check
.\scripts\pr-management\pr-quality-checker.ps1 -PRNumber 340

# Just linting
.\scripts\pr-management\pr-quality-checker.ps1 -PRNumber 334 -CheckLint

# With auto-fix
.\scripts\pr-management\pr-quality-checker.ps1 -PRNumber 335 -AutoFix
```

---

### 4. PR Monitor
**Location:** `.\scripts\pr-management\pr-monitor.ps1`

**What it does:**
- Real-time PR tracking
- Status dashboards
- Bottleneck detection
- Auto-alerts

**Usage:**
```powershell
# Monitor chatbot PRs
.\scripts\pr-management\pr-monitor.ps1 -Labels "chatbot,v1.1.0"

# With auto-actions
.\scripts\pr-management\pr-monitor.ps1 -Labels "chatbot" -AutoTest -AutoMerge

# Watch mode
.\scripts\pr-management\pr-monitor.ps1 -Labels "chatbot" -Watch -Interval 60
```

---

### 5. Continuous Pipeline
**Location:** `.\scripts\continuous-issue-pipeline.ps1`

**What it does:**
- Processes PRs continuously
- Queue management
- Priority handling
- Auto-coordination

**Usage:**
```powershell
# Process Agent 1 PRs continuously
.\scripts\continuous-issue-pipeline.ps1 -Agent "Agent1" -Queue "chatbot" -Watch

# Batch processing
.\scripts\continuous-issue-pipeline.ps1 -Agent "Agent1" -MaxIssues 8 -Priority "P0,P1"

# With interval
.\scripts\continuous-issue-pipeline.ps1 -Agent "Agent3" -Queue "chatbot" -Watch -Interval 30
```

---

### 6. Chatbot Status Checker
**Location:** `.\scripts\project-management\chatbot-v1.1.0\chatbot-pr-status-check.ps1`

**What it does:**
- Shows status of all 9 PRs
- CI pass/fail status
- Review status
- Next actions

**Usage:**
```powershell
# Check status
.\scripts\project-management\chatbot-v1.1.0\chatbot-pr-status-check.ps1

# With details
.\scripts\project-management\chatbot-v1.1.0\chatbot-pr-status-check.ps1 -Detailed
```

---

### 7. Agent Assignment
**Location:** `.\scripts\project-management\chatbot-v1.1.0\assign-chatbot-prs-3-agents.ps1`

**What it does:**
- Assigns PRs to agents
- Adds labels
- Adds comments
- Coordinates workflow

**Usage:**
```powershell
# Dry run first
.\scripts\project-management\chatbot-v1.1.0\assign-chatbot-prs-3-agents.ps1 -DryRun

# Actually assign
.\scripts\project-management\chatbot-v1.1.0\assign-chatbot-prs-3-agents.ps1
```

---

## 🎯 Common Workflows

### Agent 1: Fix CI and Process PRs
```powershell
# Fix #340 automatically
.\scripts\pr-management\automate-pr-unified.ps1 -PRNumber 340 -Action all -AutoFix

# Process all PRs in watch mode
.\scripts\continuous-issue-pipeline.ps1 -Agent "Agent1" -Queue "chatbot" -Watch
```

### Agent 2: Review Backend PRs
```powershell
# Analyze all backend PRs
$prs = @(332, 333, 336, 337)
foreach ($pr in $prs) {
    .\scripts\pr-management\pr-analyzer.ps1 -PRNumber $pr -CheckPerformance
    .\scripts\pr-management\automate-pr-unified.ps1 -PRNumber $pr -Action review
}
```

### Agent 3: Test and Merge
```powershell
# Test all PRs
$prs = @(339, 338, 332, 337, 336, 333, 340, 334, 335)
foreach ($pr in $prs) {
    .\scripts\pr-management\pr-quality-checker.ps1 -PRNumber $pr
}

# Merge in sequence
$mergeOrder = @(339, 338, 332, 337, 336, 333, 340, 334, 335)
foreach ($pr in $mergeOrder) {
    .\scripts\pr-management\automate-pr-unified.ps1 -PRNumber $pr -Action merge -Method squash
    Start-Sleep -Seconds 300
}
```

---

## 💡 Pro Tips

### 1. Always Use Automation First
```powershell
# ✅ Good: Use automation
.\scripts\pr-management\automate-pr-unified.ps1 -PRNumber 340 -Action all -AutoFix

# ❌ Bad: Manual commands
gh pr checkout 340
# ... manual fixes ...
git commit -m "fix"
git push
```

### 2. Batch Process Multiple PRs
```powershell
# Process all PRs at once
$prs = @(333, 336, 337, 340)
foreach ($pr in $prs) {
    .\scripts\pr-management\automate-pr-unified.ps1 -PRNumber $pr -Action all
}
```

### 3. Use Watch Mode for Real-Time
```powershell
# Continuous monitoring and processing
.\scripts\continuous-issue-pipeline.ps1 -Agent "Agent1" -Queue "chatbot" -Watch -Interval 30
```

### 4. Check Status Frequently
```powershell
# Quick status check
.\scripts\project-management\chatbot-v1.1.0\chatbot-pr-status-check.ps1
```

---

## 🚨 Troubleshooting

### Automation Not Working?
```powershell
# Check GitHub auth
gh auth status

# Check script path
Get-Location

# Run with -Verbose
.\scripts\pr-management\automate-pr-unified.ps1 -PRNumber 340 -Action all -Verbose
```

### Manual Fallback
If automation fails, fall back to manual commands:
```powershell
gh pr checkout <pr-number>
# Fix manually
git commit -am "fix"
git push
```

---

**Remember: These automation tools save hours of manual work. Use them!** 🚀

