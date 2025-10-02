# Project Status Monitor - Real-time Project Board Status Tracking
# Usage: .\scripts\project-status-monitor.ps1 [-Watch] [-Interval <SECONDS>] [-Filter <STATUS>]
#
# Monitors and displays the current status of issues on the project board

param(
    [Parameter(Mandatory=$false)]
    [switch]$Watch,
    
    [Parameter(Mandatory=$false)]
    [int]$Interval = 30,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Backlog", "In progress", "Ready", "Done", "All")]
    [string]$Filter = "All",
    
    [Parameter(Mandatory=$false)]
    [switch]$Detailed
)

# Import shared utilities
$sharedPath = Join-Path $PSScriptRoot "shared\github-utils.ps1"
if (Test-Path $sharedPath) {
    . $sharedPath
} else {
    Write-Error "Shared utilities not found at $sharedPath"
    exit 1
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "        Project Status Monitor" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Get-ProjectStatus {
    try {
        $query = @"
query {
  viewer {
    projectV2(number: 20) {
      items(first: 100) {
        nodes {
          id
          content {
            ... on Issue {
              number
              title
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
                    State = $item.content.state
                    URL = $item.content.url
                    Labels = $item.content.labels.nodes | ForEach-Object { $_.name }
                    ProjectItemId = $item.id
                    FieldValues = $item.fieldValues.nodes
                }
                
                # Extract field values
                $issue.Priority = ($issue.FieldValues | Where-Object { $_.field.name -eq "Priority" }).name
                $issue.App = ($issue.FieldValues | Where-Object { $_.field.name -eq "App" }).name
                $issue.Area = ($issue.FieldValues | Where-Object { $_.field.name -eq "Area" }).name
                $issue.Status = ($issue.FieldValues | Where-Object { $_.field.name -eq "Status" }).name
                
                # Filter by status if specified
                if ($Filter -eq "All" -or $issue.Status -eq $Filter) {
                    $issues += $issue
                }
            }
        }
        
        return $issues
    }
    catch {
        Write-ColorOutput "Failed to get project status: $($_.Exception.Message)" "Red"
        return @()
    }
}

function Show-StatusSummary {
    param([array]$Issues)
    
    $statusCounts = @{
        "Backlog" = 0
        "In progress" = 0
        "Ready" = 0
        "Done" = 0
    }
    
    foreach ($issue in $Issues) {
        if ($issue.Status -and $statusCounts.ContainsKey($issue.Status)) {
            $statusCounts[$issue.Status]++
        }
    }
    
    Write-ColorOutput "📊 Project Board Status Summary:" "Cyan"
    Write-ColorOutput "  📋 Backlog: $($statusCounts['Backlog'])" "White"
    Write-ColorOutput "  🔄 In progress: $($statusCounts['In progress'])" "Yellow"
    Write-ColorOutput "  📝 Ready (in review): $($statusCounts['Ready'])" "Blue"
    Write-ColorOutput "  ✅ Done: $($statusCounts['Done'])" "Green"
    Write-ColorOutput ""
}

function Show-DetailedStatus {
    param([array]$Issues)
    
    $groupedIssues = $Issues | Group-Object Status
    
    foreach ($group in $groupedIssues) {
        $status = $group.Name
        $statusIssues = $group.Group
        
        # Color coding for status
        $statusColor = switch ($status) {
            "Backlog" { "White" }
            "In progress" { "Yellow" }
            "Ready" { "Blue" }
            "Done" { "Green" }
            default { "Gray" }
        }
        
        Write-ColorOutput "`n📋 $status ($($statusIssues.Count) issues):" $statusColor
        
        foreach ($issue in $statusIssues) {
            $priorityText = if ($issue.Priority) { " [$($issue.Priority)]" } else { "" }
            $appText = if ($issue.App) { " ($($issue.App))" } else { "" }
            
            Write-ColorOutput "  #$($issue.Number): $($issue.Title)$priorityText$appText" "White"
            
            if ($Detailed) {
                Write-ColorOutput "    URL: $($issue.URL)" "Gray"
                if ($issue.Labels.Count -gt 0) {
                    Write-ColorOutput "    Labels: $($issue.Labels -join ', ')" "Gray"
                }
            }
        }
    }
}

function Show-WorkflowProgress {
    param([array]$Issues)
    
    $inProgressIssues = $Issues | Where-Object { $_.Status -eq "In progress" }
    $readyIssues = $Issues | Where-Object { $_.Status -eq "Ready" }
    
    if ($inProgressIssues.Count -gt 0 -or $readyIssues.Count -gt 0) {
        Write-ColorOutput "`n🔄 Active Workflow:" "Cyan"
        
        if ($inProgressIssues.Count -gt 0) {
            Write-ColorOutput "  🔨 Currently Implementing:" "Yellow"
            foreach ($issue in $inProgressIssues) {
                Write-ColorOutput "    #$($issue.Number): $($issue.Title)" "White"
            }
        }
        
        if ($readyIssues.Count -gt 0) {
            Write-ColorOutput "  📝 In Review:" "Blue"
            foreach ($issue in $readyIssues) {
                Write-ColorOutput "    #$($issue.Number): $($issue.Title)" "White"
            }
        }
    }
}

function Start-WatchMode {
    param([int]$Interval)
    
    Write-ColorOutput "🔄 Starting watch mode (interval: ${Interval}s)..." "Green"
    Write-ColorOutput "Press Ctrl+C to stop" "Yellow"
    Write-ColorOutput ""
    
    while ($true) {
        Clear-Host
        Show-Banner
        
        $issues = Get-ProjectStatus
        if ($issues.Count -gt 0) {
            Show-StatusSummary -Issues $issues
            Show-WorkflowProgress -Issues $issues
            
            if ($Detailed) {
                Show-DetailedStatus -Issues $issues
            }
        } else {
            Write-ColorOutput "No issues found matching criteria" "Yellow"
        }
        
        Write-ColorOutput "`n⏳ Next update in $Interval seconds..." "Gray"
        Start-Sleep -Seconds $Interval
    }
}

# Main execution
try {
    Show-Banner
    
    if ($Watch) {
        Start-WatchMode -Interval $Interval
    } else {
        $issues = Get-ProjectStatus
        if ($issues.Count -gt 0) {
            Show-StatusSummary -Issues $issues
            Show-WorkflowProgress -Issues $issues
            
            if ($Detailed) {
                Show-DetailedStatus -Issues $issues
            }
        } else {
            Write-ColorOutput "No issues found matching criteria" "Yellow"
        }
    }
    
} catch {
    Write-ColorOutput "Status monitoring failed: $($_.Exception.Message)" "Red"
    exit 1
}
