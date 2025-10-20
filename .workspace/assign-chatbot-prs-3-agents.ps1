#!/usr/bin/env pwsh
# Assign Chatbot v1.1.0 PRs to 3 Agents
# Uses existing PR management workflows

param(
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "   Chatbot v1.1.0 - 3-Agent PR Assignment" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

# Define agent assignments based on analysis
$agent1PRs = @(333, 336, 337, 340, 334, 335, 338, 339)  # Chris - Frontend/Implementation
$agent2PRs = @(332)  # Jason - Backend/Infrastructure
$agent3PRs = @(339, 338, 332, 337, 336, 333, 340, 334, 335)  # QA - All PRs for review

# Agent 1: Chris (Implementation Owner)
Write-Host "Agent 1 (Chris - Frontend/Implementation)" -ForegroundColor Cyan
Write-Host "Assigned PRs: $($agent1PRs -join ', ')" -ForegroundColor Green
Write-Host ""

foreach ($pr in $agent1PRs) {
    if ($DryRun) {
        Write-Host "  [DRY RUN] Would assign PR #$pr to Agent 1" -ForegroundColor Yellow
    } else {
        Write-Host "  Assigning PR #$pr to Agent 1..." -ForegroundColor White
        try {
            # Add label for agent tracking
            gh pr edit $pr --add-label "agent:1,area:frontend,v1.1.0"
            
            # Add comment explaining assignment
            $comment = @"
### 🤖 Agent Assignment

**Agent 1 (Chris - Frontend/Implementation)**

**Your Role:** Code Owner & Implementation Lead  
**Responsibilities:**
- Address any review feedback
- Fix CI/linter issues
- Update PR if needed
- Coordinate with reviewers

**Status:** ✅ Implementation Complete - Awaiting Review

See `.workspace/chatbot-3-agent-assignments.md` for full details.
"@
            gh pr comment $pr --body $comment
            Write-Host "  [OK] Assigned PR #$pr" -ForegroundColor Green
        } catch {
            $errorMsg = $_.Exception.Message
            Write-Host "  [FAIL] Failed to assign PR #$pr : $errorMsg" -ForegroundColor Red
        }
    }
}

Write-Host ""

# Agent 2: Jason (Backend/Infrastructure Reviewer)
Write-Host "Agent 2 (Jason - Backend/Infrastructure Reviewer)" -ForegroundColor Cyan
Write-Host "Assigned PRs: $($agent2PRs -join ', ') + Review: 333, 336, 337" -ForegroundColor Green
Write-Host ""

# Assign PR #332 as owner
foreach ($pr in $agent2PRs) {
    if ($DryRun) {
        Write-Host "  [DRY RUN] Would assign PR #$pr to Agent 2" -ForegroundColor Yellow
    } else {
        Write-Host "  Assigning PR #$pr to Agent 2..." -ForegroundColor White
        try {
            gh pr edit $pr --add-label "agent:2,area:backend,v1.1.0"
            
            $comment = @"
### 🤖 Agent Assignment

**Agent 2 (Jason - Backend/Infrastructure)**

**Your Role:** Backend Owner & Architecture Reviewer  
**Responsibilities:**
- Review and approve PR #332 (your implementation)
- Review backend changes in PRs #333, #336, #337
- Validate API performance and optimization
- Check token usage and context management

**Status:** ✅ Implementation Complete - Awaiting Self-Review

**PRs to Review:**
- #333 - Streaming responses (API route changes)
- #336 - Analytics implementation
- #337 - Error handling (API errors)

See `.workspace/chatbot-3-agent-assignments.md` for full details.
"@
            gh pr comment $pr --body $comment
            Write-Host "  [OK] Assigned PR #$pr" -ForegroundColor Green
        } catch {
            $errorMsg = $_.Exception.Message
            Write-Host "  [FAIL] Failed to assign PR #$pr : $errorMsg" -ForegroundColor Red
        }
    }
}

Write-Host ""

# Agent 3: QA/Integration (Review All)
Write-Host "Agent 3 (QA/Integration Lead)" -ForegroundColor Cyan
Write-Host "Assigned PRs for Review/Test: $($agent3PRs -join ', ')" -ForegroundColor Green
Write-Host ""

# Add Agent 3 as reviewer to all PRs
foreach ($pr in $agent3PRs) {
    if ($DryRun) {
        Write-Host "  [DRY RUN] Would assign PR #$pr to Agent 3 for QA" -ForegroundColor Yellow
    } else {
        Write-Host "  Assigning PR #$pr to Agent 3 for QA..." -ForegroundColor White
        try {
            gh pr edit $pr --add-label "needs-qa,v1.1.0"
            
            # Only add comment to first PR to avoid spam
            if ($pr -eq 339) {
                $comment = @"
### 🤖 Agent Assignment

**Agent 3 (QA/Integration Lead)**

**Your Role:** Quality Assurance & Merge Coordinator  
**Responsibilities:**
- Test all 9 chatbot PRs individually
- Review code quality
- Coordinate merge order
- Perform final integration testing

**Status:** ⏳ Ready for QA Testing

**Testing Checklist:**
- [ ] Test each PR locally
- [ ] Verify functionality
- [ ] Check for console errors
- [ ] Test mobile responsiveness
- [ ] Approve PRs after testing
- [ ] Merge in recommended order

**Recommended Merge Order:**
1. #339 (Docs) → 2. #338 (Modularize) → 3. #332 (Context) → 4. #337 (Errors) → 5. #336 (Analytics) → 6. #333 (Streaming) → 7. #340 (Typing) → 8. #334 (Persistence) → 9. #335 (Quick Replies)

See `.workspace/chatbot-3-agent-assignments.md` for full details.
"@
                gh pr comment $pr --body $comment
            }
            Write-Host "  [OK] Assigned PR #$pr to QA" -ForegroundColor Green
        } catch {
            $errorMsg = $_.Exception.Message
            Write-Host "  [FAIL] Failed to assign PR #$pr : $errorMsg" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "             Assignment Summary" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""
Write-Host "Agent 1 (Chris):" -ForegroundColor Cyan
Write-Host "  - Owner of 8 PRs: $($agent1PRs -join ', ')" -ForegroundColor White
Write-Host "  - Role: Implementation & Fixes" -ForegroundColor White
Write-Host ""
Write-Host "Agent 2 (Jason):" -ForegroundColor Cyan
Write-Host "  - Owner of 1 PR: $($agent2PRs -join ', ')" -ForegroundColor White
Write-Host "  - Reviewer of: 333, 336, 337 (backend changes)" -ForegroundColor White
Write-Host "  - Role: Backend Architecture Review" -ForegroundColor White
Write-Host ""
Write-Host "Agent 3 (QA):" -ForegroundColor Cyan
Write-Host "  - Reviewer of all 9 PRs" -ForegroundColor White
Write-Host "  - Role: Testing, Quality Assurance, Merge Coordination" -ForegroundColor White
Write-Host ""

if ($DryRun) {
    Write-Host "[OK] DRY RUN COMPLETE - No changes made" -ForegroundColor Yellow
} else {
    Write-Host "[OK] Assignment complete! Check PR comments for details." -ForegroundColor Green
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Agent 1: Review your PRs for any CI issues" -ForegroundColor White
Write-Host "  2. Agent 2: Begin reviewing PRs #332, #333, #336, #337" -ForegroundColor White
Write-Host "  3. Agent 3: Set up testing environment and begin QA" -ForegroundColor White
Write-Host ""
Write-Host "Full documentation: .workspace/chatbot-3-agent-assignments.md" -ForegroundColor White

