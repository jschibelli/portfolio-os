#!/usr/bin/env pwsh
# Assign Agent 3 - Chatbot Epic PRs
# This script assigns all 9 chatbot PRs from the v1.1.0 epic to Agent 3
# Usage: .\scripts\agent-management\assign-agent-3-chatbot-prs.ps1 [-DryRun] [-AssigneeUsername <USERNAME>]

param(
    [switch]$DryRun,
    [string]$AssigneeUsername = "@me"
)

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "  Agent 3 - Chatbot Epic PR Assignment" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

# Test GitHub authentication
Write-Host "Testing GitHub authentication..." -ForegroundColor Yellow
$authTest = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ GitHub authentication failed. Please run 'gh auth login' first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ GitHub authenticated" -ForegroundColor Green
Write-Host ""

# Define all 9 chatbot PRs
$chatbotPRs = @(
    @{
        Number = 333
        Issue = 322
        Title = "feat(chatbot): implement streaming responses with OpenAI"
        Priority = "P0"
        Phase = 1
    },
    @{
        Number = 337
        Issue = 324
        Title = "fix(chatbot): improve error handling and user feedback"
        Priority = "P0"
        Phase = 1
    },
    @{
        Number = 336
        Issue = 323
        Title = "feat(chatbot): enable analytics tracking system"
        Priority = "P0"
        Phase = 1
    },
    @{
        Number = 340
        Issue = "325,326"
        Title = "feat(chatbot): typing indicator and feedback buttons"
        Priority = "P1"
        Phase = 2
    },
    @{
        Number = 334
        Issue = 327
        Title = "feat(chatbot): Add conversation persistence with localStorage"
        Priority = "P1"
        Phase = 2
    },
    @{
        Number = 335
        Issue = 329
        Title = "feat(chatbot): Add context-aware quick reply suggestions"
        Priority = "P1"
        Phase = 2
    },
    @{
        Number = 332
        Issue = 328
        Title = "feat(chatbot): Expand context window from 5 to 15 exchanges"
        Priority = "P1"
        Phase = 2
    },
    @{
        Number = 338
        Issue = 330
        Title = "refactor(chatbot): Modularize component into reusable modules"
        Priority = "P2"
        Phase = 3
    },
    @{
        Number = 339
        Issue = 331
        Title = "docs(chatbot): Comprehensive TypeScript types and documentation"
        Priority = "P2"
        Phase = 3
    }
)

Write-Host "Found $($chatbotPRs.Count) chatbot PRs to assign to Agent 3" -ForegroundColor Cyan
Write-Host ""

# Verify all PRs exist
Write-Host "Step 1: Verifying all PRs exist..." -ForegroundColor Yellow
$verifiedPRs = @()
$missingPRs = @()

foreach ($pr in $chatbotPRs) {
    $prInfo = gh pr view $($pr.Number) --json number,title,state 2>&1
    if ($LASTEXITCODE -eq 0) {
        $prData = $prInfo | ConvertFrom-Json
        if ($prData.state -eq "OPEN") {
            $verifiedPRs += $pr
            Write-Host "  ✅ PR #$($pr.Number): $($pr.Title)" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  PR #$($pr.Number): Not open (state: $($prData.state))" -ForegroundColor Yellow
        }
    } else {
        $missingPRs += $pr
        Write-Host "  ❌ PR #$($pr.Number): Not found" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Verified: $($verifiedPRs.Count) PRs are open and ready" -ForegroundColor Green
if ($missingPRs.Count -gt 0) {
    Write-Host "Missing/Closed: $($missingPRs.Count) PRs" -ForegroundColor Yellow
}
Write-Host ""

if ($verifiedPRs.Count -eq 0) {
    Write-Host "❌ No valid PRs found to assign. Exiting." -ForegroundColor Red
    exit 1
}

# Step 2: Assign PRs to Agent 3
Write-Host "Step 2: Assigning PRs to Agent 3..." -ForegroundColor Yellow
$assignedCount = 0
$failedAssignments = @()

foreach ($pr in $verifiedPRs) {
    Write-Host "  Processing PR #$($pr.Number)..." -ForegroundColor Cyan
    
    if ($DryRun) {
        Write-Host "    [DRY RUN] Would assign PR #$($pr.Number) to $AssigneeUsername" -ForegroundColor Gray
        Write-Host "    [DRY RUN] Would add labels: agent-3, chatbot, $($pr.Priority)" -ForegroundColor Gray
        $assignedCount++
    } else {
        # Assign PR to Agent 3
        $assignResult = gh pr edit $($pr.Number) --add-assignee $AssigneeUsername 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    ✅ Assigned to $AssigneeUsername" -ForegroundColor Green
            
            # Add labels for tracking
            $labelResult = gh pr edit $($pr.Number) --add-label "agent-3,chatbot,$($pr.Priority)" 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "    ✅ Labels added: agent-3, chatbot, $($pr.Priority)" -ForegroundColor Green
                $assignedCount++
            } else {
                Write-Host "    ⚠️  Failed to add labels: $labelResult" -ForegroundColor Yellow
                $assignedCount++  # Still count as assigned even if labels failed
            }
        } else {
            Write-Host "    ❌ Failed to assign: $assignResult" -ForegroundColor Red
            $failedAssignments += $pr
        }
    }
    
    Start-Sleep -Milliseconds 500  # Rate limiting
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "  Assignment Complete!" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""
Write-Host "SUMMARY:" -ForegroundColor Cyan
Write-Host "  Total PRs: $($chatbotPRs.Count)" -ForegroundColor White
Write-Host "  Verified: $($verifiedPRs.Count)" -ForegroundColor Green
Write-Host "  Assigned: $assignedCount" -ForegroundColor Green
Write-Host "  Failed: $($failedAssignments.Count)" -ForegroundColor $(if ($failedAssignments.Count -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($failedAssignments.Count -gt 0) {
    Write-Host "FAILED ASSIGNMENTS:" -ForegroundColor Red
    foreach ($pr in $failedAssignments) {
        Write-Host "  - PR #$($pr.Number): $($pr.Title)" -ForegroundColor Red
    }
    Write-Host ""
}

# Step 3: Generate Phase-based Summary
Write-Host "Step 3: Generating Phase Summary..." -ForegroundColor Yellow
Write-Host ""

$phase1PRs = $verifiedPRs | Where-Object { $_.Phase -eq 1 }
$phase2PRs = $verifiedPRs | Where-Object { $_.Phase -eq 2 }
$phase3PRs = $verifiedPRs | Where-Object { $_.Phase -eq 3 }

Write-Host "Phase 1: Critical Features (P0)" -ForegroundColor Magenta
foreach ($pr in $phase1PRs) {
    Write-Host "  - PR #$($pr.Number) - Issue #$($pr.Issue)" -ForegroundColor White
}
Write-Host ""

Write-Host "Phase 2: UX Enhancements (P1)" -ForegroundColor Magenta
foreach ($pr in $phase2PRs) {
    Write-Host "  - PR #$($pr.Number) - Issue #$($pr.Issue)" -ForegroundColor White
}
Write-Host ""

Write-Host "Phase 3: Quality and Docs (P2)" -ForegroundColor Magenta
foreach ($pr in $phase3PRs) {
    Write-Host "  - PR #$($pr.Number) - Issue #$($pr.Issue)" -ForegroundColor White
}
Write-Host ""

# Step 4: Display Next Steps
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "  Next Steps for Agent 3" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

Write-Host "1. Create Agent 3 Worktree:" -ForegroundColor Cyan
Write-Host "   .\scripts\agent-management\manage-worktree-operations-unified.ps1 -Operation create -AgentName 'agent-3-chatbot' -BaseBranch 'develop'" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Navigate to Agent 3 Worktree:" -ForegroundColor Cyan
Write-Host "   cd worktrees\agent-3-chatbot" -ForegroundColor Gray
Write-Host ""

Write-Host "3. View Assigned PRs:" -ForegroundColor Cyan
Write-Host "   gh pr list --assignee $AssigneeUsername --search 'chatbot' --state open" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Start with Phase 1 (Critical):" -ForegroundColor Cyan
Write-Host "   gh pr checkout 333  # Streaming responses (HIGHEST PRIORITY)" -ForegroundColor Gray
Write-Host "   gh pr checkout 337  # Error handling" -ForegroundColor Gray
Write-Host "   gh pr checkout 336  # Analytics tracking" -ForegroundColor Gray
Write-Host ""

Write-Host "5. Review Assignment Document:" -ForegroundColor Cyan
Write-Host "   Open: pr-agent-3-chatbot-assignment.md" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "WARNING: This was a DRY RUN - no changes were made" -ForegroundColor Yellow
    Write-Host "   Run without -DryRun flag to actually assign PRs" -ForegroundColor Yellow
} else {
    Write-Host "SUCCESS: All chatbot PRs have been assigned to Agent 3!" -ForegroundColor Green
    Write-Host "   Review the assignment document for detailed instructions" -ForegroundColor Green
}

Write-Host ""
Write-Host "Assignment Document: pr-agent-3-chatbot-assignment.md" -ForegroundColor Cyan
Write-Host "Epic Issue: #321 - v1.1.0 AI Chatbot Enhancement" -ForegroundColor Cyan
Write-Host ""

# Display quick reference card
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "  Quick Reference - Agent 3 PRs" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""
Write-Host "Priority Order:" -ForegroundColor Yellow
Write-Host "  1. PR #333 → PR #337 → PR #336 (Phase 1: P0)" -ForegroundColor White
Write-Host "  2. PR #340 → PR #334 → PR #335 → PR #332 (Phase 2: P1)" -ForegroundColor White
Write-Host "  3. PR #338 → PR #339 (Phase 3: P2 - Optional)" -ForegroundColor White
Write-Host ""
Write-Host "Timeline:" -ForegroundColor Yellow
Write-Host "  Week 1: Phase 1 (3 PRs)" -ForegroundColor White
Write-Host "  Week 2: Phase 2 (4 PRs)" -ForegroundColor White
Write-Host "  Week 3: Phase 3 (2 PRs - Optional)" -ForegroundColor White
Write-Host ""

exit 0

