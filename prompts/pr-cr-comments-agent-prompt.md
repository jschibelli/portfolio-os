# PR CR-GPT Comments Agent Prompt

## Overview
This prompt is designed to get AI agents started on addressing CR-GPT review comments on open pull requests to drive them to merge-ready status.

## Agent Assignment Strategy

### High Priority PRs (CR-GPT Comments with HIGH Priority Issues)
**Assignment: Senior Agent or Performance Specialist**

#### PR #262 - Performance: images, fonts, headers
- **Status**: 5 CR-GPT comments, HIGH priority (Error, Performance)
- **Agent**: Performance & Error Resolution Specialist
- **Focus**: Performance optimizations, error handling, security fixes
- **Priority**: P0 - Address immediately

### Medium Priority PRs (CR-GPT Comments with LOW Priority Issues)
**Assignment: General Agent or Style Specialist**

#### PR #261 - A11y pass: navigation & focus states  
- **Status**: 4 CR-GPT comments, LOW priority (Error, Style)
- **Agent**: Accessibility & Style Specialist
- **Focus**: Error fixes, code style improvements
- **Priority**: P1 - Address after high priority items

### Low Priority PRs (No CR-GPT Comments)
**Assignment: Quality Assurance Agent**

#### PR #260 - Social OG/Twitter images
- **Status**: No CR-GPT comments
- **Agent**: QA & Final Review Agent
- **Focus**: Final quality checks, merge readiness verification
- **Priority**: P2 - Ready for final review and merge

## Agent Instructions

### For Performance & Error Resolution Specialist (PR #262):
```
You are assigned to PR #262 which has HIGH priority CR-GPT comments requiring immediate attention.

**Your Mission**: Address all 5 CR-GPT comments focusing on:
1. Error handling improvements
2. Performance optimizations  
3. Security enhancements
4. Code style improvements

**Action Plan**:
1. Run: `.\scripts\pr-automation-unified.ps1 -PRNumber 262 -Action analyze` to get detailed comment analysis
2. Run: `.\scripts\pr-automation-unified.ps1 -PRNumber 262 -Action respond` to generate automated responses
3. Review each comment and implement fixes
4. Run quality checks: `.\scripts\pr-automation-unified.ps1 -PRNumber 262 -Action quality`
5. Update project status and drive to merge

**Success Criteria**: All HIGH priority issues resolved, PR ready for merge
```

### For Accessibility & Style Specialist (PR #261):
```
You are assigned to PR #261 which has LOW priority CR-GPT comments for accessibility and style improvements.

**Your Mission**: Address 4 CR-GPT comments focusing on:
1. Error fixes
2. Code style improvements
3. Accessibility compliance

**Action Plan**:
1. Run: `.\scripts\pr-automation-unified.ps1 -PRNumber 261 -Action analyze` to get detailed comment analysis
2. Run: `.\scripts\pr-automation-unified.ps1 -PRNumber 261 -Action respond` to generate automated responses
3. Review and implement style/error fixes
4. Run quality checks: `.\scripts\pr-automation-unified.ps1 -PRNumber 261 -Action quality`
5. Update project status

**Success Criteria**: All style and error issues resolved, PR ready for merge
```

### For QA & Final Review Agent (PR #260):
```
You are assigned to PR #260 which has no CR-GPT comments and appears ready for final review.

**Your Mission**: Perform final quality assurance and prepare for merge.

**Action Plan**:
1. Run: `.\scripts\pr-automation-unified.ps1 -PRNumber 260 -Action quality` to run final checks
2. Verify all tests pass
3. Check for any remaining issues
4. Update project status to "Ready for Merge"
5. Prepare merge documentation

**Success Criteria**: PR verified as merge-ready, all quality checks pass
```

## Automation Commands Reference

### Universal Commands for All Agents:
```powershell
# Monitor PR status
.\scripts\pr-automation-unified.ps1 -PRNumber <NUMBER> -Action monitor

# Analyze CR-GPT comments  
.\scripts\pr-automation-unified.ps1 -PRNumber <NUMBER> -Action analyze

# Generate automated responses
.\scripts\pr-automation-unified.ps1 -PRNumber <NUMBER> -Action respond

# Run quality checks
.\scripts\pr-automation-unified.ps1 -PRNumber <NUMBER> -Action quality

# Update documentation
.\scripts\pr-automation-unified.ps1 -PRNumber <NUMBER> -Action docs

# Run all actions (recommended)
.\scripts\pr-automation-unified.ps1 -PRNumber <NUMBER> -Action all
```

### Project Board Integration:
All PRs are already added to Portfolio Site project (#20) with these default fields:
- Status: In progress
- Priority: P1 (adjust based on CR-GPT analysis)
- Size: M
- Estimate: 3
- App: Portfolio Site
- Area: Frontend
- Assignee: jschibelli

## Success Metrics
- **PR #262**: All HIGH priority CR-GPT comments resolved
- **PR #261**: All LOW priority CR-GPT comments resolved  
- **PR #260**: Quality verified, ready for merge
- All PRs moved to "Ready for Merge" status on project board

## Next Steps
1. Agents should start with their assigned PRs immediately
2. Use the automation scripts for consistent workflow
3. Update project board status as work progresses
4. Report completion and any blockers
5. Move to next available PRs once current assignments are complete
