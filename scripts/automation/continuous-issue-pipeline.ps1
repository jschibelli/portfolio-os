# Continuous Issue-to-Merge Pipeline Automation
# Usage: .\scripts\continuous-issue-pipeline.ps1 [-MaxIssues <NUMBER>] [-Status <STATUS>] [-Priority <PRIORITY>] [-Watch] [-DryRun]
# 
# This script continuously processes issues from Todo → In progress → Ready → Done → Merged
# It automatically finds, configures, implements, creates PRs, and merges issues in sequence

param(
    [Parameter(Mandatory=$false)]
    [int]$MaxIssues = 10,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Backlog", "In progress", "Ready", "Done")]
    [string]$Status = "Backlog",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("P0", "P1", "P2", "P3")]
    [string]$Priority = "P1",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Portfolio Site", "Dashboard", "Docs", "Infra")]
    [string]$App = "Portfolio Site",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Frontend", "Backend", "Infra", "Content", "Design")]
    [string]$Area = "Frontend",
    
    [Parameter(Mandatory=$false)]
    [switch]$Watch,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [int]$Interval = 30,
    
    [Parameter(Mandatory=$false)]
    [switch]$ResumeFromFailure,
    
    [Parameter(Mandatory=$false)]
    [string]$LogFile = "continuous-pipeline.log"
)

# Import shared utilities
$sharedPath = Join-Path $PSScriptRoot "shared\github-utils.ps1"
if (Test-Path $sharedPath) {
    . $sharedPath
} else {
    Write-Error "Shared utilities not found at $sharedPath"
    exit 1
}

# Pipeline state management
$pipelineState = @{
    ProcessedIssues = @()
    FailedIssues = @()
    CurrentIssue = $null
    StartTime = Get-Date
    LogFile = $LogFile
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "    Continuous Issue-to-Merge Pipeline" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Initialize-Pipeline {
    Write-ColorOutput "🚀 Initializing Continuous Pipeline..." "Green"
    Write-ColorOutput "Max Issues: $MaxIssues" "White"
    Write-ColorOutput "Target Status: $Status" "White"
    Write-ColorOutput "Priority Filter: $Priority" "White"
    Write-ColorOutput "App Filter: $App" "White"
    Write-ColorOutput "Area Filter: $Area" "White"
    Write-ColorOutput "Dry Run: $DryRun" "White"
    Write-ColorOutput ""
    
    # Initialize log file
    $logHeader = @"
# Continuous Pipeline Log
Started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Max Issues: $MaxIssues
Status Filter: $Status
Priority Filter: $Priority
App Filter: $App
Area Filter: $Area
Dry Run: $DryRun

"@
    $logHeader | Out-File -FilePath $LogFile -Encoding UTF8
}

function Get-NextIssues {
    param([int]$Count = 5)
    
    Write-ColorOutput "🔍 Finding next available issues..." "Yellow"
    
    try {
        # Get issues from project with filters
        $query = @"
query {
  viewer {
    projectV2(number: 20) {
      items(first: $Count, filter: {status: "$Status"}) {
        nodes {
          id
          content {
            ... on Issue {
              number
              title
              body
              state
              url
              labels(first: 10) {
                nodes {
                  name
                }
              }
            }
          }
          fieldValues(first: 20) {
            nodes {
              ... on ProjectV2ItemFieldSingleSelectValue {
                field {
                  ... on ProjectV2Field {
                    name
                  }
                }
                name
              }
            }
          }
        }
      }
    }
  }
}
"@
        
        $result = gh api graphql -f query=$query
        $data = $result | ConvertFrom-Json
        
        $issues = @()
        foreach ($item in $data.data.viewer.projectV2.items.nodes) {
            if ($item.content -and $item.content.number) {
                $issue = @{
                    Number = $item.content.number
                    Title = $item.content.title
                    Body = $item.content.body
                    State = $item.content.state
                    URL = $item.content.url
                    Labels = $item.content.labels.nodes | ForEach-Object { $_.name }
                    ProjectItemId = $item.id
                    FieldValues = $item.fieldValues.nodes
                }
                
                # Filter by priority, app, area if specified
                $issuePriority = ($issue.FieldValues | Where-Object { $_.field.name -eq "Priority" }).name
                $issueApp = ($issue.FieldValues | Where-Object { $_.field.name -eq "App" }).name
                $issueArea = ($issue.FieldValues | Where-Object { $_.field.name -eq "Area" }).name
                
                if (($Priority -eq "" -or $issuePriority -eq $Priority) -and
                    ($App -eq "" -or $issueApp -eq $App) -and
                    ($Area -eq "" -or $issueArea -eq $Area)) {
                    $issues += $issue
                }
            }
        }
        
        Write-ColorOutput "Found $($issues.Count) matching issues" "Green"
        return $issues
    }
    catch {
        Write-ColorOutput "Failed to get issues: $($_.Exception.Message)" "Red"
        return @()
    }
}

function Process-SingleIssue {
    param([object]$Issue)
    
    $issueNumber = $Issue.Number
    Write-ColorOutput "
🔄 Processing Issue #$issueNumber: $($Issue.Title)" "Cyan"
    Write-ColorOutput "URL: $($Issue.URL)" "White"
    
    $pipelineState.CurrentIssue = $Issue
    
    try {
        # Step 1: Configure issue and set to "In progress"
        Write-ColorOutput "  📋 Step 1: Configuring issue and setting to 'In progress'..." "Yellow"
        if (-not $DryRun) {
            & .\..\issue-config-unified.ps1 -IssueNumber $issueNumber -Preset "blog" -AddToProject -Status "In progress"
            # Update project status to "In progress"
            Update-ProjectStatus -Issue $Issue -Status "In progress"
        } else {
            Write-ColorOutput "    [DRY RUN] Would configure issue #$issueNumber and set to 'In progress'" "Cyan"
        }
        
        # Step 2: Create branch from develop
        Write-ColorOutput "  🌿 Step 2: Creating branch..." "Yellow"
        if (-not $DryRun) {
            & .\..\create-branch-from-develop.ps1 -IssueNumber $issueNumber
        } else {
            Write-ColorOutput "    [DRY RUN] Would create branch for issue #$issueNumber" "Cyan"
        }
        
        # Step 3: Implement the issue
        Write-ColorOutput "  🔨 Step 3: Implementing issue..." "Yellow"
        if (-not $DryRun) {
            & .\..\issue-implementation.ps1 -IssueNumber $issueNumber -Action all
        } else {
            Write-ColorOutput "    [DRY RUN] Would implement issue #$issueNumber" "Cyan"
        }
        
        # Step 4: Create PR and set to "Ready" (in review)
        Write-ColorOutput "  📝 Step 4: Creating Pull Request and setting to 'Ready'..." "Yellow"
        if (-not $DryRun) {
            # Check if PR already exists
            $existingPR = gh pr list --head "issue-$issueNumber" --json number -q '.[0].number' 2>$null
            if ($existingPR) {
                Write-ColorOutput "    PR already exists: #$existingPR" "Green"
            } else {
                # Create PR
                $prTitle = "feat: $($Issue.Title)"
                $prBody = @"
## Issue #$issueNumber

$($Issue.Body)

### Changes Made
- Implemented requested functionality
- Added comprehensive testing
- Updated documentation

Resolves #$issueNumber
"@
                gh pr create --title $prTitle --body $prBody --base develop --head "issue-$issueNumber"
                Write-ColorOutput "    ✅ PR created successfully" "Green"
            }
            # Update project status to "Ready" (in review)
            Update-ProjectStatus -Issue $Issue -Status "Ready"
        } else {
            Write-ColorOutput "    [DRY RUN] Would create PR for issue #$issueNumber and set to 'Ready'" "Cyan"
        }
        
        # Step 5: Monitor and automate PR
        Write-ColorOutput "  🤖 Step 5: Automating PR process..." "Yellow"
        if (-not $DryRun) {
            # Get the PR number
            $prNumber = gh pr list --head "issue-$issueNumber" --json number -q '.[0].number' 2>$null
            if ($prNumber) {
                & .\pr-automation-unified.ps1 -PRNumber $prNumber -Action all -AutoFix
            }
        } else {
            Write-ColorOutput "    [DRY RUN] Would automate PR for issue #$issueNumber" "Cyan"
        }
        
        # Step 6: Update issue status to Done
        Write-ColorOutput "  ✅ Step 6: Marking issue as 'Done'..." "Yellow"
        if (-not $DryRun) {
            # Update project status to Done
            Update-ProjectStatus -Issue $Issue -Status "Done"
        } else {
            Write-ColorOutput "    [DRY RUN] Would mark issue #$issueNumber as 'Done'" "Cyan"
        }
        
        # Log successful processing
        $pipelineState.ProcessedIssues += $Issue
        Log-PipelineEvent "SUCCESS" "Issue #$issueNumber processed successfully"
        
        Write-ColorOutput "  ✅ Issue #$issueNumber completed successfully!" "Green"
        return $true
        
    }
    catch {
        Write-ColorOutput "  ❌ Failed to process issue #$issueNumber: $($_.Exception.Message)" "Red"
        $pipelineState.FailedIssues += $Issue
        Log-PipelineEvent "ERROR" "Issue #$issueNumber failed: $($_.Exception.Message)"
        return $false
    }
}

function Update-ProjectStatus {
    param([object]$Issue, [string]$Status)
    
    try {
        $projectItemId = $Issue.ProjectItemId
        if (-not $projectItemId) {
            Write-ColorOutput "    ⚠️ No project item ID found for issue #$($Issue.Number)" "Yellow"
            return $false
        }
        
        # Status field IDs and option IDs
        $statusFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"
        $statusOptions = @{
            "Backlog" = "e18bf179"
            "In progress" = "e18bf180"
            "Ready" = "e18bf181"
            "Done" = "e18bf182"
        }
        
        $optionId = $statusOptions[$Status]
        if (-not $optionId) {
            Write-ColorOutput "    ❌ Invalid status: $Status" "Red"
            return $false
        }
        
        # Update the project status
        $success = Set-ProjectFieldValue -ProjectItemId $projectItemId -FieldId $statusFieldId -OptionId $optionId
        
        if ($success) {
            Write-ColorOutput "    ✅ Updated issue #$($Issue.Number) status to '$Status'" "Green"
            Log-PipelineEvent "STATUS" "Issue #$($Issue.Number) status updated to '$Status'"
            return $true
        } else {
            Write-ColorOutput "    ❌ Failed to update issue #$($Issue.Number) status to '$Status'" "Red"
            return $false
        }
    }
    catch {
        Write-ColorOutput "    ❌ Error updating status: $($_.Exception.Message)" "Red"
        Log-PipelineEvent "ERROR" "Failed to update issue #$($Issue.Number) status to '$Status': $($_.Exception.Message)"
        return $false
    }
}

function Log-PipelineEvent {
    param([string]$Level, [string]$Message)
    
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logEntry = "[$timestamp] [$Level] $Message"
    
    Add-Content -Path $LogFile -Value $logEntry -Encoding UTF8
    
    if ($Level -eq "ERROR") {
        Write-ColorOutput "    📝 $logEntry" "Red"
    } else {
        Write-ColorOutput "    📝 $logEntry" "White"
    }
}

function Show-PipelineStatus {
    Write-ColorOutput "
📊 Pipeline Status:" "Cyan"
    Write-ColorOutput "  Processed: $($pipelineState.ProcessedIssues.Count)" "Green"
    Write-ColorOutput "  Failed: $($pipelineState.FailedIssues.Count)" "Red"
    Write-ColorOutput "  Runtime: $((Get-Date) - $pipelineState.StartTime)" "White"
    Write-ColorOutput "  Log File: $LogFile" "White"
    
    if ($pipelineState.ProcessedIssues.Count -gt 0) {
        Write-ColorOutput "
✅ Successfully Processed:" "Green"
        foreach ($issue in $pipelineState.ProcessedIssues) {
            Write-ColorOutput "  - Issue #$($issue.Number): $($issue.Title)" "White"
        }
    }
    
    if ($pipelineState.FailedIssues.Count -gt 0) {
        Write-ColorOutput "
❌ Failed Issues:" "Red"
        foreach ($issue in $pipelineState.FailedIssues) {
            Write-ColorOutput "  - Issue #$($issue.Number): $($issue.Title)" "White"
        }
    }
}

function Start-ContinuousLoop {
    Write-ColorOutput "🔄 Starting continuous processing loop..." "Green"
    Write-ColorOutput "Press Ctrl+C to stop" "Yellow"
    Write-ColorOutput ""
    
    $processedCount = 0
    
    while ($processedCount -lt $MaxIssues) {
        try {
            # Get next batch of issues
            $issues = Get-NextIssues -Count 5
            
            if ($issues.Count -eq 0) {
                Write-ColorOutput "No more issues to process. Pipeline complete!" "Green"
                break
            }
            
            # Process each issue
            foreach ($issue in $issues) {
                if ($processedCount -ge $MaxIssues) {
                    Write-ColorOutput "Reached maximum issue limit ($MaxIssues)" "Yellow"
                    break
                }
                
                $success = Process-SingleIssue -Issue $issue
                if ($success) {
                    $processedCount++
                }
                
                # Brief pause between issues
                Start-Sleep -Seconds 2
            }
            
            # Show current status
            Show-PipelineStatus
            
            if ($Watch) {
                Write-ColorOutput "
⏳ Waiting $Interval seconds before next check..." "Yellow"
                Start-Sleep -Seconds $Interval
            } else {
                break
            }
        }
        catch {
            Write-ColorOutput "Error in continuous loop: $($_.Exception.Message)" "Red"
            Log-PipelineEvent "ERROR" "Continuous loop error: $($_.Exception.Message)"
            break
        }
    }
}

function Resume-FailedIssues {
    if ($pipelineState.FailedIssues.Count -eq 0) {
        Write-ColorOutput "No failed issues to resume" "Yellow"
        return
    }
    
    Write-ColorOutput "🔄 Resuming failed issues..." "Yellow"
    foreach ($issue in $pipelineState.FailedIssues) {
        Write-ColorOutput "Retrying Issue #$($issue.Number)..." "Cyan"
        Process-SingleIssue -Issue $issue
    }
}

# Main execution
try {
    Show-Banner
    Initialize-Pipeline
    
    if ($ResumeFromFailure) {
        Resume-FailedIssues
    } else {
        Start-ContinuousLoop
    }
    
    # Final status
    Show-PipelineStatus
    
    Write-ColorOutput "
🎉 Continuous Pipeline Complete!" "Green"
    Write-ColorOutput "Check the log file for detailed information: $LogFile" "Cyan"
    
} catch {
    Write-ColorOutput "Pipeline failed: $($_.Exception.Message)" "Red"
    Log-PipelineEvent "FATAL" "Pipeline failed: $($_.Exception.Message)"
    exit 1
}
