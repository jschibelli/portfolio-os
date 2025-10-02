# Merge Queue System for Multi-Agent Workflow
# Usage: .\scripts\merge-queue-system.ps1 [-Action <ACTION>] [-PRNumber <NUMBER>] [-Agent <AGENT>] [-Priority <PRIORITY>]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("add", "remove", "list", "process", "conflicts", "status", "all")]
    [string]$Action = "all",
    
    [Parameter(Mandatory=$false)]
    [string]$PRNumber = "",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("agent-frontend", "agent-backend", "agent-docs", "agent-testing", "agent-ai", "agent-default")]
    [string]$Agent = "",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("high", "medium", "low")]
    [string]$Priority = "medium",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Merge queue file
$queueFile = "merge-queue.json"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "        Merge Queue System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Get-MergeQueue {
    if (Test-Path $queueFile) {
        try {
            $content = Get-Content $queueFile -Raw
            return $content | ConvertFrom-Json
        }
        catch {
            Write-ColorOutput "Error reading merge queue: $($_.Exception.Message)" "Red"
            return @()
        }
    }
    return @()
}

function Save-MergeQueue {
    param([array]$Queue)
    
    try {
        $Queue | ConvertTo-Json -Depth 3 | Out-File -FilePath $queueFile -Encoding UTF8
        return $true
    }
    catch {
        Write-ColorOutput "Error saving merge queue: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Add-ToMergeQueue {
    param(
        [string]$PRNumber,
        [string]$Agent,
        [string]$Priority
    )
    
    $queue = Get-MergeQueue
    
    # Check if PR already in queue
    $existing = $queue | Where-Object { $_.PRNumber -eq $PRNumber }
    if ($existing) {
        Write-ColorOutput "PR #$PRNumber is already in merge queue" "Yellow"
        return $false
    }
    
    # Get PR info
    try {
        $prInfo = gh pr view $PRNumber --json title,state,baseRefName,headRefName,author
        $prData = $prInfo | ConvertFrom-Json
        
        if ($prData.state -ne "OPEN") {
            Write-ColorOutput "PR #$PRNumber is not open" "Red"
            return $false
        }
        
        if ($prData.baseRefName -ne "develop") {
            Write-ColorOutput "PR #$PRNumber is not targeting develop branch" "Red"
            return $false
        }
    }
    catch {
        Write-ColorOutput "Error getting PR info: $($_.Exception.Message)" "Red"
        return $false
    }
    
    # Create queue item
    $queueItem = @{
        PRNumber = $PRNumber
        Agent = $Agent
        Priority = $Priority
        Title = $prData.title
        Author = $prData.author.login
        CreatedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Status = "pending"
        Attempts = 0
        MaxAttempts = 3
    }
    
    $queue += $queueItem
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would add PR #$PRNumber to merge queue" "Cyan"
    } else {
        if (Save-MergeQueue -Queue $queue) {
            Write-ColorOutput "✅ Added PR #$PRNumber to merge queue" "Green"
            return $true
        } else {
            return $false
        }
    }
}

function Remove-FromMergeQueue {
    param([string]$PRNumber)
    
    $queue = Get-MergeQueue
    $filteredQueue = $queue | Where-Object { $_.PRNumber -ne $PRNumber }
    
    if ($queue.Count -eq $filteredQueue.Count) {
        Write-ColorOutput "PR #$PRNumber not found in merge queue" "Yellow"
        return $false
    }
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would remove PR #$PRNumber from merge queue" "Cyan"
    } else {
        if (Save-MergeQueue -Queue $filteredQueue) {
            Write-ColorOutput "✅ Removed PR #$PRNumber from merge queue" "Green"
            return $true
        } else {
            return $false
        }
    }
}

function Show-MergeQueue {
    $queue = Get-MergeQueue
    
    if ($queue.Count -eq 0) {
        Write-ColorOutput "Merge queue is empty" "Yellow"
        return
    }
    
    Write-ColorOutput "=== Merge Queue ===" "Blue"
    Write-ColorOutput "Total items: $($queue.Count)" "White"
    Write-ColorOutput ""
    
    # Sort by priority and creation time
    $sortedQueue = $queue | Sort-Object @{
        Expression = {
            switch ($_.Priority) {
                "high" { 1 }
                "medium" { 2 }
                "low" { 3 }
                default { 4 }
            }
        }
    }, CreatedAt
    
    foreach ($item in $sortedQueue) {
        $statusColor = switch ($item.Status) {
            "pending" { "Yellow" }
            "processing" { "Blue" }
            "completed" { "Green" }
            "failed" { "Red" }
            default { "White" }
        }
        
        Write-ColorOutput "PR #$($item.PRNumber) - $($item.Title)" "White"
        Write-ColorOutput "  Agent: $($item.Agent)" "Gray"
        Write-ColorOutput "  Priority: $($item.Priority)" "Gray"
        Write-ColorOutput "  Status: $($item.Status)" $statusColor
        Write-ColorOutput "  Created: $($item.CreatedAt)" "Gray"
        Write-ColorOutput "  Attempts: $($item.Attempts)/$($item.MaxAttempts)" "Gray"
        Write-ColorOutput ""
    }
}

function Test-PRConflicts {
    param([string]$PRNumber)
    
    try {
        # Get files changed in PR
        $prFiles = gh pr view $PRNumber --json files
        $prData = $prFiles | ConvertFrom-Json
        $changedFiles = $prData.files | ForEach-Object { $_.filename }
        
        # Get all open PRs
        $openPRs = gh pr list --state open --json number,files
        $openPRsData = $openPRs | ConvertFrom-Json
        
        $conflicts = @()
        foreach ($openPR in $openPRsData) {
            if ($openPR.number -ne $PRNumber) {
                $openPRFiles = $openPR.files | ForEach-Object { $_.filename }
                $commonFiles = Compare-Object $changedFiles $openPRFiles -IncludeEqual -ExcludeDifferent
                
                if ($commonFiles) {
                    $conflicts += @{
                        PRNumber = $openPR.number
                        CommonFiles = $commonFiles.InputObject
                    }
                }
            }
        }
        
        return $conflicts
    }
    catch {
        Write-ColorOutput "Error checking conflicts: $($_.Exception.Message)" "Red"
        return @()
    }
}

function Process-MergeQueue {
    $queue = Get-MergeQueue
    
    if ($queue.Count -eq 0) {
        Write-ColorOutput "No items in merge queue" "Yellow"
        return
    }
    
    # Sort by priority
    $sortedQueue = $queue | Sort-Object @{
        Expression = {
            switch ($_.Priority) {
                "high" { 1 }
                "medium" { 2 }
                "low" { 3 }
                default { 4 }
            }
        }
    }, CreatedAt
    
    foreach ($item in $sortedQueue) {
        if ($item.Status -ne "pending") {
            continue
        }
        
        Write-ColorOutput "Processing PR #$($item.PRNumber)..." "Yellow"
        
        # Check for conflicts
        $conflicts = Test-PRConflicts -PRNumber $item.PRNumber
        
        if ($conflicts.Count -gt 0) {
            Write-ColorOutput "  ⚠️  Conflicts detected with PRs: $($conflicts.PRNumber -join ', ')" "Yellow"
            
            # Update attempts
            $item.Attempts++
            $item.Status = "failed"
            
            if ($item.Attempts -ge $item.MaxAttempts) {
                Write-ColorOutput "  ❌ Max attempts reached for PR #$($item.PRNumber)" "Red"
            } else {
                Write-ColorOutput "  🔄 Will retry later" "Yellow"
                $item.Status = "pending"
            }
        } else {
            Write-ColorOutput "  ✅ No conflicts detected" "Green"
            
            # Check if PR is ready to merge
            try {
                $prStatus = gh pr view $item.PRNumber --json mergeable,mergeStateStatus
                $prStatusData = $prStatus | ConvertFrom-Json
                
                if ($prStatusData.mergeable -and $prStatusData.mergeStateStatus -eq "clean") {
                    Write-ColorOutput "  🚀 PR is ready to merge" "Green"
                    $item.Status = "ready"
                } else {
                    Write-ColorOutput "  ⏳ PR not ready for merge" "Yellow"
                }
            }
            catch {
                Write-ColorOutput "  ❌ Error checking PR status: $($_.Exception.Message)" "Red"
            }
        }
    }
    
    # Save updated queue
    if (-not $DryRun) {
        Save-MergeQueue -Queue $queue
    }
}

function Merge-PR {
    param([string]$PRNumber, [string]$Strategy = "rebase")
    
    try {
        if ($DryRun) {
            Write-ColorOutput "  [DRY RUN] Would merge PR #$PRNumber using $Strategy strategy" "Cyan"
            return $true
        }
        
        # Merge the PR
        gh pr merge $PRNumber --$Strategy --delete-branch
        
        Write-ColorOutput "✅ Successfully merged PR #$PRNumber" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "❌ Failed to merge PR #$PRNumber : $($_.Exception.Message)" "Red"
        return $false
    }
}

function Resolve-Conflicts {
    param([string]$PRNumber, [string]$ConflictingPR)
    
    try {
        Write-ColorOutput "Resolving conflicts between PR #$PRNumber and PR #$ConflictingPR..." "Yellow"
        
        # Get the conflicting PR's branch
        $conflictingPRInfo = gh pr view $ConflictingPR --json headRefName
        $conflictingPRData = $conflictingPRInfo | ConvertFrom-Json
        
        # Rebase the current PR onto the conflicting PR
        $currentPRInfo = gh pr view $PRNumber --json headRefName
        $currentPRData = $currentPRInfo | ConvertFrom-Json
        
        # This would require more complex git operations
        # For now, we'll just report the conflict
        Write-ColorOutput "  ⚠️  Manual conflict resolution required" "Yellow"
        Write-ColorOutput "  Consider rebasing PR #$PRNumber onto PR #$ConflictingPR" "White"
        
        return $false
    }
    catch {
        Write-ColorOutput "❌ Error resolving conflicts: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Main {
    Show-Banner
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    
    switch ($Action) {
        "add" {
            if ($PRNumber -and $Agent) {
                Add-ToMergeQueue -PRNumber $PRNumber -Agent $Agent -Priority $Priority
            } else {
                Write-ColorOutput "Please provide PRNumber and Agent" "Red"
            }
        }
        "remove" {
            if ($PRNumber) {
                Remove-FromMergeQueue -PRNumber $PRNumber
            } else {
                Write-ColorOutput "Please provide PRNumber" "Red"
            }
        }
        "list" {
            Show-MergeQueue
        }
        "process" {
            Process-MergeQueue
        }
        "conflicts" {
            if ($PRNumber) {
                $conflicts = Test-PRConflicts -PRNumber $PRNumber
                if ($conflicts.Count -gt 0) {
                    Write-ColorOutput "Conflicts detected:" "Yellow"
                    foreach ($conflict in $conflicts) {
                        Write-ColorOutput "  PR #$($conflict.PRNumber) - Files: $($conflict.CommonFiles -join ', ')" "White"
                    }
                } else {
                    Write-ColorOutput "No conflicts detected" "Green"
                }
            } else {
                Write-ColorOutput "Please provide PRNumber to check conflicts" "Red"
            }
        }
        "status" {
            Show-MergeQueue
        }
        "all" {
            Show-MergeQueue
            Process-MergeQueue
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Merge Queue System Ready!" "Green"
}

# Run the main function
Main
