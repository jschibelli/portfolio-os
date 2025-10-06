# Default Two-Agent PR Assignment Strategy
## Template for PR Distribution Between Two Specialized Agents

## ✅ **Pre-Assignment Checklist**

Before assigning PRs to agents, verify:
- [ ] All PRs target the correct base branch (usually `develop` or `main`)
- [ ] PRs are properly labeled and prioritized
- [ ] No critical merge conflicts exist
- [ ] Required approvals are in place

---

## 🎯 **Two-Agent Strategy Overview**

Split PRs between **2 specialized agents** with clear separation of concerns and staggered execution timing.

### **Agent Separation Strategy:**
- **Agent 1**: Frontend/UI focused PRs + Critical Security
- **Agent 2**: Backend/Infrastructure focused PRs + Performance
- **Staggered Execution**: Agent 1 starts first, Agent 2 starts 30 minutes later
- **File Isolation**: Minimal overlap in file modifications
- **Rate Limit Protection**: Maximum 8-9 PRs per agent

---

## 📊 **Workload Distribution Template**

### **Agent 1: Frontend & Critical Security Specialist** 🔴
**Focus**: Frontend components, UI/UX, Critical security issues
**PR Count**: [X] PRs
**Estimated Comments**: [X]+ comments

**Assigned PRs:**
1. **[PR #XXX]** - [Title] ([Category])
   - [X] CR-GPT comments, [X] CRITICAL ([Type]), [X] HIGH ([Type])
   - **Priority**: P[X] - [Description]
2. **[PR #XXX]** - [Title] ([Category])
   - [X] CR-GPT comments, [X] priority ([Type])
   - **Priority**: P[X] - [Description]
3. **[PR #XXX]** - [Title] ([Category])
   - [X] CR-GPT comments, [X] priority ([Type])
   - **Priority**: P[X] - [Description]
4. **[PR #XXX]** - [Title] ([Category])
   - [X] CR-GPT comments, [X] priority ([Type])
   - **Priority**: P[X] - [Description]
5. **[PR #XXX]** - [Title] ([Category])
   - [X] CR-GPT comments, [X] priority ([Type])
   - **Priority**: P[X] - [Description]

**Agent 1 Workload Summary:**
- **CRITICAL**: [X] comments ([Type])
- **HIGH**: [X] comments ([Type])
- **LOW**: [X]+ comments ([Type])
- **Draft PRs**: [X] ([Description])
- **Ready for Merge**: [X] ([Description])

---

### **Agent 2: Backend & Infrastructure Specialist** 🔵
**Focus**: Backend services, infrastructure, server-side performance
**PR Count**: [X] PRs
**Estimated Comments**: [X]+ comments

**Assigned PRs:**
1. **[PR #XXX]** - [Title] ([Category])
   - [X] CR-GPT comments, [X] CRITICAL ([Type])
   - **Priority**: P[X] - [Description]
2. **[PR #XXX]** - [Title] ([Category])
   - [X] CR-GPT comments, [X] CRITICAL ([Type])
   - **Priority**: P[X] - [Description]
3. **[PR #XXX]** - [Title] ([Category])
   - [X] CR-GPT comments, [X] priority ([Type])
   - **Priority**: P[X] - [Description]
4. **[PR #XXX]** - [Title] ([Category])
   - [X] CR-GPT comments, [X] priority ([Type])
   - **Priority**: P[X] - [Description]
5. **[PR #XXX]** - [Title] ([Category])
   - [X] CR-GPT comments, [X] priority ([Type])
   - **Priority**: P[X] - [Description]

**Agent 2 Workload Summary:**
- **CRITICAL**: [X] comments ([Type])
- **HIGH**: [X] comments ([Type])
- **LOW**: [X]+ comments ([Type])
- **Draft PRs**: [X] ([Description])
- **Ready for Merge**: [X] ([Description])

---

## 🚀 **Execution Strategy Template**

### **Phase 1: Critical Issues (Day 1-2)**
**Agent 1 (Starts First):**
- 09:00 - Start with [PR #XXX] (CRITICAL Security)
- 10:30 - Move to [PR #XXX] (HIGH Performance)
- 12:00 - Break for lunch
- 13:00 - Continue with [PR #XXX] (HIGH [Category])
- 14:30 - Handle [PR #XXX] ([Category])

**Agent 2 (Starts 30 minutes later):**
- 09:30 - Start with [PR #XXX] (CRITICAL Security)
- 11:00 - Move to [PR #XXX] (CRITICAL Security)
- 12:30 - Break for lunch
- 13:30 - Continue with [PR #XXX] (HIGH [Category])
- 15:00 - Handle [PR #XXX] (Ready for merge)

### **Phase 2: Quality Improvements (Day 3-4)**
**Agent 1:**
- [PR #XXX] ([Category])
- [PR #XXX] ([Category])
- [PR #XXX] ([Category])
- [PR #XXX] ([Category])

**Agent 2:**
- [PR #XXX] ([Category])
- [PR #XXX] ([Category])
- [PR #XXX] ([Category])
- [PR #XXX] ([Category])

### **Phase 3: Final Cleanup (Day 5)**
- Both agents complete remaining work
- Final quality checks and merges
- Documentation updates

---

## 🛡️ **Conflict Prevention Strategy**

### **File Isolation:**
- **Agent 1**: Focuses on `[frontend-paths]`, `[ui-paths]`, frontend assets
- **Agent 2**: Focuses on `[backend-paths]`, `[api-paths]`, backend services
- **Shared Files**: Coordinate on `[shared-config-files]` changes

### **Rate Limit Protection:**
- **Maximum 2 concurrent PR operations per agent**
- **30-minute stagger between agent start times**
- **5-minute breaks between PR operations**
- **Automated retry with exponential backoff**

### **Coordination Protocol:**
1. **Daily Standup**: 15-minute sync at 09:00 and 15:00
2. **File Lock Detection**: Check for active file modifications before starting
3. **Shared Resources**: Coordinate on shared configuration files
4. **Progress Updates**: Real-time project board status updates

---

## 📋 **Agent-Specific Commands Template**

### **Agent 1 Commands (Frontend & Critical Security):**
```powershell
# Day 1 Morning - Critical Security
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action all
Start-Sleep -Seconds 300  # 5-minute break

# Day 1 Morning - Frontend Performance  
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action all
Start-Sleep -Seconds 300  # 5-minute break

# Day 1 Afternoon - [Category]
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action all
Start-Sleep -Seconds 300  # 5-minute break

# Day 1 Afternoon - [Category]
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action all

# Day 2 - [Category] and Features
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action all
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action quality
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action monitor  # Review draft
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action monitor  # Review draft
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action all
```

### **Agent 2 Commands (Backend & Infrastructure):**
```powershell
# Day 1 Morning - Critical Security (Start 30 min after Agent 1)
Start-Sleep -Seconds 1800  # 30-minute delay
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action all
Start-Sleep -Seconds 300  # 5-minute break

# Day 1 Morning - Backend API Security
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action all
Start-Sleep -Seconds 300  # 5-minute break

# Day 1 Afternoon - Backend [Category]
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action all
Start-Sleep -Seconds 300  # 5-minute break

# Day 1 Afternoon - Backend [Category]
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action quality

# Day 2 - [Category] Systems
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action all
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action all
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action quality
.\scripts\pr-automation-unified.ps1 -PRNumber [XXX] -Action monitor  # Review draft
```

---

## 📊 **Success Metrics Template**

### **Agent 1 Targets:**
- **[X] CRITICAL security issues resolved** ([PR #XXX])
- **[X] HIGH priority issues resolved** ([PR #XXX])
- **[X]+ LOW priority issues resolved** ([PR #XXX])
- **[X] draft PRs integrated** ([PR #XXX])
- **[X] PRs merged** ([PR #XXX])

### **Agent 2 Targets:**
- **[X] CRITICAL security issues resolved** ([PR #XXX])
- **[X] HIGH priority issues resolved** ([PR #XXX])
- **[X]+ LOW priority issues resolved** ([PR #XXX])
- **[X] draft PRs integrated** ([PR #XXX])
- **[X] PRs merged** ([PR #XXX])

### **Overall Goals:**
- **100% of CRITICAL security issues resolved**
- **100% of HIGH priority issues resolved**
- **90% of MEDIUM/LOW priority issues resolved**
- **All ready PRs merged**
- **All draft PRs integrated or closed**

---

## 🔄 **Coordination Checkpoints**

### **Daily Sync Points:**
- **09:00**: Morning standup - review priorities and conflicts
- **12:00**: Lunch break - status update
- **15:00**: Afternoon sync - resolve blockers
- **17:00**: End of day - progress review and next day planning

### **Conflict Resolution:**
1. **File Conflicts**: Agent 2 waits if Agent 1 is modifying shared files
2. **Rate Limits**: Automatic 5-minute delays between operations
3. **Priority Conflicts**: Agent 1 handles CRITICAL, Agent 2 handles HIGH
4. **Resource Conflicts**: First-come-first-served with 5-minute hold

---

## 🎯 **Project Board Updates**

Both agents will update the [Project Name] project board (#[Project Number]) with:
- **Status**: In progress → Ready → Done
- **Priority**: P0/P1/P2/P3 (based on analysis)
- **Progress**: Daily updates on comment resolution
- **Assignee**: [username] (with agent notes in comments)

---

## 📈 **Expected Timeline**

- **Day 1**: Critical and HIGH priority issues resolved
- **Day 2**: MEDIUM/LOW priority issues and draft PR integration
- **Day 3**: Final cleanup and quality assurance
- **Day 4**: Documentation and merge finalization
- **Day 5**: Project completion and celebration!

---

## 🔧 **How to Use This Template**

1. **Replace [XXX] placeholders** with actual PR numbers
2. **Update [Category] placeholders** with specific PR categories
3. **Fill in [X] placeholders** with actual comment counts and priorities
4. **Customize file paths** based on your project structure
5. **Adjust timeline** based on your team's capacity
6. **Update project board references** with your actual project details

This template ensures optimal workload distribution, conflict prevention, and systematic resolution of CR-GPT comments across your open pull requests while maintaining high efficiency and avoiding rate limit issues.
