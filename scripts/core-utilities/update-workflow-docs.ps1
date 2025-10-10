#!/usr/bin/env pwsh
# Workflow Document Updater
# Automatically updates multi-agent workflow documentation when agents are assigned

param(
    [Parameter(Mandatory=$true)]
    [int]$IssueNumber,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("chris", "jason", "agent-1-chris", "agent-2-jason")]
    [string]$AgentName,
    
    [Parameter(Mandatory=$true)]
    [string]$IssueTitle,
    
    [string]$WorkflowFile = "prompts/workflows/multi-agent-e2e-workflow.md",
    [switch]$Remove,
    [switch]$DryRun
)

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "     Workflow Document Auto-Updater" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

# Normalize agent name
$normalizedAgent = switch ($AgentName.ToLower()) {
    { $_ -in @("chris", "agent-1-chris") } { "agent-1-chris" }
    { $_ -in @("jason", "agent-2-jason") } { "agent-2-jason" }
}

$agentDisplayName = if ($normalizedAgent -eq "agent-1-chris") { "Chris" } else { "Jason" }

Write-Host "Issue: #$IssueNumber - $IssueTitle" -ForegroundColor Cyan
Write-Host "Agent: $agentDisplayName ($normalizedAgent)" -ForegroundColor Cyan
Write-Host "Action: $(if ($Remove) { 'Remove' } else { 'Add' })" -ForegroundColor Cyan
Write-Host ""

# Check if workflow file exists
if (-not (Test-Path $WorkflowFile)) {
    Write-Host "❌ Workflow file not found: $WorkflowFile" -ForegroundColor Red
    exit 1
}

# Read the current workflow file
$content = Get-Content $WorkflowFile -Raw

# Find the Current Active Projects section
$projectsSectionPattern = '(?s)(### \*\*Current Active Projects:\*\*.*?)((?=##)|(?=\z))'

if ($content -notmatch $projectsSectionPattern) {
    Write-Host "⚠️  'Current Active Projects' section not found in workflow file" -ForegroundColor Yellow
    Write-Host "Creating new section..." -ForegroundColor Yellow
    
    # Find where to insert (after Agent Assignment section)
    $insertPattern = '(?s)(- \*\*Jason.*?performance monitoring\n\n)'
    
    if ($content -match $insertPattern) {
        $newSection = @"
### **Current Active Projects:**

**Active Assignments:**
- **$agentDisplayName ($normalizedAgent)**: 
  - #$IssueNumber - $IssueTitle

---

"@
        $content = $content -replace $insertPattern, "`$1$newSection"
    }
} else {
    # Section exists, update it
    $projectsSection = $Matches[1]
    
    # Find the agent's assignment block
    $agentPattern = "(?s)(- \*\*$agentDisplayName \($normalizedAgent\)\*\*:.*?)(\n  - #\d+.*?)*(\n\n|\n- \*\*|(?=\*\*⚠️)|$)"
    
    if ($Remove) {
        # Remove the issue from the agent's list
        $issuePattern = "\n  - #$IssueNumber - .*?"
        $projectsSection = $projectsSection -replace $issuePattern, ""
        
        Write-Host "✅ Removed issue #$IssueNumber from $agentDisplayName's assignments" -ForegroundColor Green
    } else {
        # Add the issue to the agent's list
        if ($projectsSection -match $agentPattern) {
            # Agent block exists, add to it
            $agentBlock = $Matches[0]
            $newIssue = "  - #$IssueNumber - $IssueTitle"
            
            # Check if issue already exists
            if ($agentBlock -match "#$IssueNumber") {
                Write-Host "⚠️  Issue #$IssueNumber already assigned to $agentDisplayName" -ForegroundColor Yellow
            } else {
                # Insert before the next agent or end marker
                if ($agentBlock -match '(\n\n|- \*\*|(?=\*\*⚠️)|$)') {
                    $insertPoint = $agentBlock.IndexOf($Matches[1])
                    $updatedBlock = $agentBlock.Insert($insertPoint, "`n$newIssue")
                    $projectsSection = $projectsSection -replace [regex]::Escape($agentBlock), $updatedBlock
                }
                
                Write-Host "✅ Added issue #$IssueNumber to $agentDisplayName's assignments" -ForegroundColor Green
            }
        } else {
            # Agent block doesn't exist, create it
            $newAgentBlock = @"

- **$agentDisplayName ($normalizedAgent)**: 
  - #$IssueNumber - $IssueTitle
"@
            # Insert before the warning or end of section
            if ($projectsSection -match '(\*\*⚠️|$)') {
                $insertPoint = $projectsSection.IndexOf($Matches[1])
                $projectsSection = $projectsSection.Insert($insertPoint, $newAgentBlock + "`n`n")
            }
            
            Write-Host "✅ Created new assignment block for $agentDisplayName" -ForegroundColor Green
        }
    }
    
    # Replace the section in the content
    $content = $content -replace $projectsSectionPattern, $projectsSection + "`$2"
}

# Write the updated content back (if not dry run)
if ($DryRun) {
    Write-Host ""
    Write-Host "[DRY RUN] Would update $WorkflowFile" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Preview of changes:" -ForegroundColor Yellow
    Write-Host "==================" -ForegroundColor Yellow
    
    # Show the updated projects section
    if ($content -match '(?s)(### \*\*Current Active Projects:\*\*.*?)((?=##)|(?=\z))') {
        Write-Host $Matches[1] -ForegroundColor Gray
    }
} else {
    try {
        $content | Set-Content $WorkflowFile -NoNewline
        Write-Host ""
        Write-Host "✅ Workflow document updated: $WorkflowFile" -ForegroundColor Green
    } catch {
        Write-Host ""
        Write-Host "❌ Failed to update workflow document: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review the updated workflow at: $WorkflowFile" -ForegroundColor Gray
Write-Host "  2. Commit the changes to version control" -ForegroundColor Gray
Write-Host ""

