# Issue Queue Management System
# Usage: .\scripts\issue-queue-manager.ps1 [-Operation <OPERATION>] [-Queue <QUEUE_NAME>] [-Priority <PRIORITY>]
#
# Manages issue queues, dependencies, and prioritization for continuous automation

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("list", "create", "process", "prioritize", "dependencies", "status")]
    [string]$Operation = "list",
    
    [Parameter(Mandatory=$false)]
    [string]$Queue = "default",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("P0", "P1", "P2", "P3")]
    [string]$Priority = "P1",
    
    [Parameter(Mandatory=$false)]
    [int]$MaxConcurrent = 3,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [string]$ConfigFile = "issue-queue-config.json"
)

# Import shared utilities
$sharedPath = Join-Path $PSScriptRoot "shared\github-utils.ps1"
if (Test-Path $sharedPath) {
    . $sharedPath
} else {
    Write-Error "Shared utilities not found at $sharedPath"
}

# Queue configuration
$queueConfig = @{
    "default" = @{
        MaxConcurrent = 3
        Priority = "P1"
        Status = "Todo"
        App = "Portfolio Site"
        Area = "Frontend"
    }
    "blog" = @{
        MaxConcurrent = 2
        Priority = "P1"
        Status = "Todo"
        App = "Portfolio Site"
        Area = "Frontend"
    }
    "dashboard" = @{
        MaxConcurrent = 2
        Priority = "P1"
        Status = "Todo"
        App = "Dashboard"
        Area = "Frontend"
    }
    "docs" = @{
        MaxConcurrent = 1
        Priority = "P2"
        Status = "Todo"
        App = "Docs"
        Area = "Content"
    }
    "infra" = @{
        MaxConcurrent = 1
        Priority = "P1"
        Status = "Todo"
        App = "Portfolio Site"
        Area = "Infra"
    }
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "        Issue Queue Management System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Load-QueueConfig {
    if (Test-Path $ConfigFile) {
        try {
            $config = Get-Content $ConfigFile | ConvertFrom-Json
            return $config
        }
        catch {
            Write-ColorOutput "Failed to load config file, using defaults" "Yellow"
        }
    }
    return $queueConfig
}

function Save-QueueConfig {
    param([object]$Config)
    
    try {
        $Config | ConvertTo-Json -Depth 3 | Out-File -FilePath $ConfigFile -Encoding UTF8
        Write-ColorOutput "Queue configuration saved" "Green"
    }
    catch {
        Write-ColorOutput "Failed to save queue configuration" "Red"
    }
}

function Get-QueueIssues {
    param([string]$QueueName)
    
    $config = Load-QueueConfig
    $queueSettings = $config[$QueueName]
    
    if (-not $queueSettings) {
        Write-ColorOutput "Queue '$QueueName' not found" "Red"
        return @()
    }
    
    Write-ColorOutput "🔍 Finding issues for queue '$QueueName'..." "Yellow"
    Write-ColorOutput "  Priority: $($queueSettings.Priority)" "White"
    Write-ColorOutput "  Status: $($queueSettings.Status)" "White"
    Write-ColorOutput "  App: $($queueSettings.App)" "White"
    Write-ColorOutput "  Area: $($queueSettings.Area)" "White"
    
    try {
        # Get issues matching queue criteria
        $query = @"
query {
  viewer {
    projectV2(number: 20) {
      items(first: 50, filter: {status: "$($queueSettings.Status)"}) {
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
                    Queue = $QueueName
                    Priority = ($item.fieldValues.nodes | Where-Object { $_.field.name -eq "Priority" }).name
                    App = ($item.fieldValues.nodes | Where-Object { $_.field.name -eq "App" }).name
                    Area = ($item.fieldValues.nodes | Where-Object { $_.field.name -eq "Area" }).name
                }
                
                # Filter by queue criteria
                if (($queueSettings.Priority -eq "" -or $issue.Priority -eq $queueSettings.Priority) -and
                    ($queueSettings.App -eq "" -or $issue.App -eq $queueSettings.App) -and
                    ($queueSettings.Area -eq "" -or $issue.Area -eq $queueSettings.Area)) {
                    $issues += $issue
                }
            }
        }
        
        # Sort by priority (P0 > P1 > P2 > P3)
        $priorityOrder = @{ "P0" = 0; "P1" = 1; "P2" = 2; "P3" = 3 }
        $issues = $issues | Sort-Object { $priorityOrder[$_.Priority] }, { $_.Number }
        
        Write-ColorOutput "Found $($issues.Count) issues for queue '$QueueName'" "Green"
        return $issues
    }
    catch {
        Write-ColorOutput "Failed to get queue issues: $($_.Exception.Message)" "Red"
        return @()
    }
}

function Show-QueueStatus {
    param([string]$QueueName)
    
    $issues = Get-QueueIssues -QueueName $QueueName
    $config = Load-QueueConfig
    $queueSettings = $config[$QueueName]
    
    Write-ColorOutput "`n📊 Queue Status: $QueueName" "Cyan"
    Write-ColorOutput "  Max Concurrent: $($queueSettings.MaxConcurrent)" "White"
    Write-ColorOutput "  Total Issues: $($issues.Count)" "White"
    Write-ColorOutput "  Priority Filter: $($queueSettings.Priority)" "White"
    Write-ColorOutput "  Status Filter: $($queueSettings.Status)" "White"
    Write-ColorOutput ""
    
    if ($issues.Count -gt 0) {
        Write-ColorOutput "Next Issues to Process:" "Green"
        $count = 0
        foreach ($issue in $issues) {
            if ($count -ge $queueSettings.MaxConcurrent) { break }
            Write-ColorOutput "  $($count + 1). Issue #$($issue.Number): $($issue.Title)" "White"
            Write-ColorOutput "     Priority: $($issue.Priority) | App: $($issue.App) | Area: $($issue.Area)" "Gray"
            $count++
        }
        
        if ($issues.Count -gt $queueSettings.MaxConcurrent) {
            Write-ColorOutput "  ... and $($issues.Count - $queueSettings.MaxConcurrent) more issues" "Gray"
        }
    } else {
        Write-ColorOutput "No issues found matching queue criteria" "Yellow"
    }
}

function Process-Queue {
    param([string]$QueueName)
    
    $issues = Get-QueueIssues -QueueName $QueueName
    $config = Load-QueueConfig
    $queueSettings = $config[$QueueName]
    
    if ($issues.Count -eq 0) {
        Write-ColorOutput "No issues to process in queue '$QueueName'" "Yellow"
        return
    }
    
    Write-ColorOutput "🚀 Processing queue '$QueueName'..." "Green"
    Write-ColorOutput "Processing up to $($queueSettings.MaxConcurrent) issues concurrently" "White"
    
    $processedCount = 0
    $maxProcess = [Math]::Min($queueSettings.MaxConcurrent, $issues.Count)
    
    for ($i = 0; $i -lt $maxProcess; $i++) {
        $issue = $issues[$i]
        Write-ColorOutput "`n🔄 Processing Issue #$($issue.Number): $($issue.Title)" "Cyan"
        
        if ($DryRun) {
            Write-ColorOutput "  [DRY RUN] Would process issue #$($issue.Number)" "Cyan"
        } else {
            # Process the issue using continuous pipeline
            try {
                & .\scripts\continuous-issue-pipeline.ps1 -MaxIssues 1 -Status $queueSettings.Status -Priority $queueSettings.Priority -App $queueSettings.App -Area $queueSettings.Area
                $processedCount++
                Write-ColorOutput "  ✅ Issue #$($issue.Number) processed successfully" "Green"
            }
            catch {
                Write-ColorOutput "  ❌ Failed to process issue #$($issue.Number): $($_.Exception.Message)" "Red"
            }
        }
    }
    
    Write-ColorOutput "`n📊 Queue Processing Summary:" "Cyan"
    Write-ColorOutput "  Processed: $processedCount" "Green"
    Write-ColorOutput "  Remaining: $($issues.Count - $processedCount)" "White"
}

function Create-Queue {
    param([string]$QueueName, [string]$Priority, [string]$App, [string]$Area, [int]$MaxConcurrent)
    
    $config = Load-QueueConfig
    
    $config[$QueueName] = @{
        MaxConcurrent = $MaxConcurrent
        Priority = $Priority
        Status = "Todo"
        App = $App
        Area = $Area
    }
    
    Save-QueueConfig -Config $config
    Write-ColorOutput "✅ Queue '$QueueName' created successfully" "Green"
}

function Show-AllQueues {
    $config = Load-QueueConfig
    
    Write-ColorOutput "`n📋 Available Queues:" "Cyan"
    foreach ($queueName in $config.Keys) {
        $queueSettings = $config[$queueName]
        Write-ColorOutput "  $queueName" "White"
        Write-ColorOutput "    Max Concurrent: $($queueSettings.MaxConcurrent)" "Gray"
        Write-ColorOutput "    Priority: $($queueSettings.Priority)" "Gray"
        Write-ColorOutput "    App: $($queueSettings.App)" "Gray"
        Write-ColorOutput "    Area: $($queueSettings.Area)" "Gray"
        Write-ColorOutput ""
    }
}

function Check-Dependencies {
    param([object]$Issue)
    
    # Check if issue has dependencies (blocked by other issues)
    $body = $Issue.Body.ToLower()
    $dependencies = @()
    
    # Look for dependency patterns in issue body
    if ($body -match "depends on|blocked by|requires.*issue|waiting for.*issue") {
        # Extract issue numbers from text
        $matches = [regex]::Matches($body, "#(\d+)")
        foreach ($match in $matches) {
            $depIssueNumber = $match.Groups[1].Value
            $dependencies += $depIssueNumber
        }
    }
    
    return $dependencies
}

function Validate-Dependencies {
    param([object]$Issue)
    
    $dependencies = Check-Dependencies -Issue $Issue
    
    if ($dependencies.Count -eq 0) {
        return $true
    }
    
    Write-ColorOutput "  🔗 Issue #$($Issue.Number) has dependencies: $($dependencies -join ', ')" "Yellow"
    
    # Check if dependencies are resolved
    foreach ($depNumber in $dependencies) {
        try {
            $depIssue = gh issue view $depNumber --json state,projectItems
            $depData = $depIssue | ConvertFrom-Json
            
            if ($depData.state -ne "closed") {
                Write-ColorOutput "    ❌ Dependency #$depNumber is not closed" "Red"
                return $false
            }
        }
        catch {
            Write-ColorOutput "    ❌ Could not check dependency #$depNumber" "Red"
            return $false
        }
    }
    
    Write-ColorOutput "    ✅ All dependencies resolved" "Green"
    return $true
}

# Main execution
try {
    Show-Banner
    
    switch ($Operation) {
        "list" {
            Show-AllQueues
        }
        "status" {
            Show-QueueStatus -QueueName $Queue
        }
        "process" {
            Process-Queue -QueueName $Queue
        }
        "create" {
            Create-Queue -QueueName $Queue -Priority $Priority -App $App -Area $Area -MaxConcurrent $MaxConcurrent
        }
        "dependencies" {
            $issues = Get-QueueIssues -QueueName $Queue
            foreach ($issue in $issues) {
                Validate-Dependencies -Issue $issue
            }
        }
        default {
            Write-ColorOutput "Available operations: list, status, process, create, dependencies" "Yellow"
        }
    }
    
} catch {
    Write-ColorOutput "Queue management failed: $($_.Exception.Message)" "Red"
    exit 1
}
