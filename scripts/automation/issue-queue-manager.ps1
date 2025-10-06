# Issue Queue Management System
# Manages prioritized queues of issues for automated processing
# Supports multiple queue types, priority management, and intelligent scheduling

# Import shared utilities
$sharedPath = Join-Path $PSScriptRoot "core-utilities\github-utils.ps1"
$aiServicesPath = Join-Path $PSScriptRoot "core-utilities\ai-services.ps1"

if (Test-Path $sharedPath) {
    . $sharedPath
} else {
    Write-Error "Shared utilities not found at $sharedPath"
    exit 1
}

if (Test-Path $aiServicesPath) {
    . $aiServicesPath
} else {
    Write-Error "AI services not found at $aiServicesPath"
    exit 1
}

# Queue configuration
$script:queueConfig = @{
    MaxConcurrentIssues = 3
    ProcessingTimeoutMinutes = 30
    RetryAttempts = 3
    RetryDelaySeconds = 60
    QueueCheckIntervalSeconds = 30
    AutoAssign = $true
    EnableAI = $true
    PriorityWeights = @{
        "P0" = 100
        "P1" = 80
        "P2" = 60
        "P3" = 40
    }
    SizeWeights = @{
        "XS" = 10
        "S" = 20
        "M" = 30
        "L" = 50
        "XL" = 80
    }
}

# Queue storage (in production, this would be a database)
$script:queueStorage = @{
    Queues = @{}
    ProcessingIssues = @{}
    CompletedIssues = @{}
    FailedIssues = @{}
    Statistics = @{
        TotalProcessed = 0
        TotalFailed = 0
        AverageProcessingTime = 0
        QueueUtilization = 0
    }
}

function Show-QueueBanner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "      Issue Queue Management System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Initialize-QueueManager {
    <#
    .SYNOPSIS
    Initialize the queue management system
    #>
    param(
        [hashtable]$CustomConfig = @{}
    )
    
    Write-ColorOutput "Initializing Issue Queue Manager..." "Blue"
    
    # Apply custom configuration
    foreach ($key in $CustomConfig.Keys) {
        $script:queueConfig[$key] = $CustomConfig[$key]
    }
    
    # Initialize AI services if enabled
    if ($script:queueConfig.EnableAI) {
        if (-not (Initialize-AIServices)) {
            Write-Warning "AI services initialization failed. Continuing without AI features."
            $script:queueConfig.EnableAI = $false
        }
    }
    
    # Initialize default queues
    Initialize-DefaultQueues
    
    Write-ColorOutput "✅ Queue Manager initialized successfully" "Green"
    Write-ColorOutput "  Max Concurrent Issues: $($script:queueConfig.MaxConcurrentIssues)" "White"
    Write-ColorOutput "  AI Features: $(if ($script:queueConfig.EnableAI) { 'Enabled' } else { 'Disabled' })" "White"
    Write-ColorOutput "  Auto Assign: $(if ($script:queueConfig.AutoAssign) { 'Enabled' } else { 'Disabled' })" "White"
}

function Initialize-DefaultQueues {
    <#
    .SYNOPSIS
    Initialize default queue types
    #>
    
    # High Priority Queue - P0 and P1 issues
    $script:queueStorage.Queues["high-priority"] = @{
        Name = "High Priority"
        Description = "Critical and high priority issues"
        Filters = @{
            Priority = @("P0", "P1")
            Status = @("Todo", "In progress")
        }
        MaxConcurrent = 2
        ProcessingOrder = "priority-desc"
    }
    
    # Standard Queue - P2 issues
    $script:queueStorage.Queues["standard"] = @{
        Name = "Standard"
        Description = "Standard priority issues"
        Filters = @{
            Priority = @("P2")
            Status = @("Todo", "In progress")
        }
        MaxConcurrent = 3
        ProcessingOrder = "priority-desc"
    }
    
    # Low Priority Queue - P3 issues
    $script:queueStorage.Queues["low-priority"] = @{
        Name = "Low Priority"
        Description = "Low priority and maintenance issues"
        Filters = @{
            Priority = @("P3")
            Status = @("Todo", "In progress")
        }
        MaxConcurrent = 2
        ProcessingOrder = "size-asc"
    }
    
    # Feature Queue - Issues with specific labels
    $script:queueStorage.Queues["features"] = @{
        Name = "Features"
        Description = "New feature development"
        Filters = @{
            Labels = @("feature", "enhancement")
            Status = @("Todo", "In progress")
        }
        MaxConcurrent = 2
        ProcessingOrder = "priority-desc"
    }
    
    # Bug Queue - Issues with bug labels
    $script:queueStorage.Queues["bugs"] = @{
        Name = "Bug Fixes"
        Description = "Bug fixes and issues"
        Filters = @{
            Labels = @("bug", "issue")
            Status = @("Todo", "In progress")
        }
        MaxConcurrent = 3
        ProcessingOrder = "priority-desc"
    }
    
    Write-ColorOutput "✅ Default queues initialized" "Green"
}

function Add-IssueToQueue {
    <#
    .SYNOPSIS
    Add an issue to the appropriate queue
    #>
    param(
        [Parameter(Mandatory=$true)]
        [int]$IssueNumber,
        
        [string]$QueueName = "",
        [hashtable]$IssueMetadata = @{}
    )
    
    try {
        # Get issue details
        $issueData = Get-IssueData -IssueNumber $IssueNumber
        if (-not $issueData) {
            Write-Error "Failed to get issue data for #$IssueNumber"
            return $false
        }
        
        # Determine appropriate queue if not specified
        if ([string]::IsNullOrEmpty($QueueName)) {
            $QueueName = Select-OptimalQueue -IssueData $issueData
        }
        
        # Validate queue exists
        if (-not $script:queueStorage.Queues.ContainsKey($QueueName)) {
            Write-Error "Queue '$QueueName' does not exist"
            return $false
        }
        
        # Create queue item
        $queueItem = @{
            IssueNumber = $IssueNumber
            IssueData = $issueData
            QueueName = $QueueName
            Priority = $issueData.Priority
            Size = $issueData.Size
            Labels = $issueData.Labels
            App = $issueData.App
            Area = $issueData.Area
            Status = $issueData.Status
            Metadata = $IssueMetadata
            AddedAt = Get-Date
            PriorityScore = Calculate-PriorityScore -IssueData $issueData
            ProcessingAttempts = 0
            LastAttempt = $null
            AssignedAgent = $null
        }
        
        # Add to queue
        if (-not $script:queueStorage.Queues[$QueueName].ContainsKey("Items")) {
            $script:queueStorage.Queues[$QueueName]["Items"] = @()
        }
        
        $script:queueStorage.Queues[$QueueName].Items += $queueItem
        
        # Sort queue by processing order
        Sort-QueueItems -QueueName $QueueName
        
        Write-ColorOutput "✅ Added issue #$IssueNumber to queue '$QueueName'" "Green"
        return $true
    }
    catch {
        Write-Error "Failed to add issue to queue: $($_.Exception.Message)"
        return $false
    }
}

function Get-IssueData {
    <#
    .SYNOPSIS
    Get comprehensive issue data including project fields
    #>
    param([int]$IssueNumber)
    
    try {
        # Get basic issue data
        $issueJson = gh issue view $IssueNumber --json number,title,body,state,labels,assignees,createdAt,updatedAt
        $issue = $issueJson | ConvertFrom-Json
        
        # Get project item ID
        $projectItemId = Get-ProjectItemId -IssueNumber $IssueNumber
        
        # Get project field values
        $projectFields = @{
            Priority = "Unknown"
            Size = "Unknown"
            App = "Unknown"
            Area = "Unknown"
            Status = "Unknown"
        }
        
        if ($projectItemId) {
            $fieldIds = @{
                "Priority" = "PVTSSF_lAHOAEnMVc4BCu-czg028qQ"
                "Size" = "PVTSSF_lAHOAEnMVc4BCu-czg028qU"
                "App" = "PVTSSF_lAHOAEnMVc4BCu-czg156-s"
                "Area" = "PVTSSF_lAHOAEnMVc4BCu-czg156_Y"
                "Status" = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"
            }
            
            foreach ($fieldName in $fieldIds.Keys) {
                $fieldValue = Get-ProjectFieldValue -ProjectItemId $projectItemId -FieldId $fieldIds[$fieldName]
                if ($fieldValue) {
                    $projectFields[$fieldName] = $fieldValue
                }
            }
        }
        
        return @{
            Number = $issue.number
            Title = $issue.title
            Body = $issue.body
            State = $issue.state
            Labels = $issue.labels | ForEach-Object { $_.name }
            Assignees = $issue.assignees | ForEach-Object { $_.login }
            CreatedAt = $issue.createdAt
            UpdatedAt = $issue.updatedAt
            ProjectItemId = $projectItemId
            Priority = $projectFields.Priority
            Size = $projectFields.Size
            App = $projectFields.App
            Area = $projectFields.Area
            Status = $projectFields.Status
        }
    }
    catch {
        Write-Warning "Failed to get issue data for #$IssueNumber: $($_.Exception.Message)"
        return $null
    }
}

function Select-OptimalQueue {
    <#
    .SYNOPSIS
    Select the optimal queue for an issue using AI if enabled
    #>
    param([hashtable]$IssueData)
    
    # First, try rule-based selection
    $selectedQueue = Select-QueueByRules -IssueData $IssueData
    
    # If AI is enabled, enhance selection with AI analysis
    if ($script:queueConfig.EnableAI) {
        $aiRecommendation = Get-AIQueueRecommendation -IssueData $IssueData -CurrentSelection $selectedQueue
        if ($aiRecommendation -and $aiRecommendation -ne $selectedQueue) {
            Write-ColorOutput "🤖 AI recommended queue: $aiRecommendation (was: $selectedQueue)" "Cyan"
            $selectedQueue = $aiRecommendation
        }
    }
    
    return $selectedQueue
}

function Select-QueueByRules {
    <#
    .SYNOPSIS
    Select queue based on predefined rules
    #>
    param([hashtable]$IssueData)
    
    # Check for bug labels
    if ($IssueData.Labels -contains "bug" -or $IssueData.Labels -contains "issue") {
        return "bugs"
    }
    
    # Check for feature labels
    if ($IssueData.Labels -contains "feature" -or $IssueData.Labels -contains "enhancement") {
        return "features"
    }
    
    # Check priority
    switch ($IssueData.Priority) {
        "P0" { return "high-priority" }
        "P1" { return "high-priority" }
        "P2" { return "standard" }
        "P3" { return "low-priority" }
        default { return "standard" }
    }
}

function Get-AIQueueRecommendation {
    <#
    .SYNOPSIS
    Get AI recommendation for optimal queue selection
    #>
    param(
        [hashtable]$IssueData,
        [string]$CurrentSelection
    )
    
    $prompt = @"
Based on the following issue data, recommend the best queue for processing:

Issue Title: $($IssueData.Title)
Issue Description: $($IssueData.Body.Substring(0, [Math]::Min(500, $IssueData.Body.Length)))...
Priority: $($IssueData.Priority)
Size: $($IssueData.Size)
Labels: $($IssueData.Labels -join ', ')
App: $($IssueData.App)
Area: $($IssueData.Area)

Available Queues:
- high-priority: Critical and high priority issues (P0, P1)
- standard: Standard priority issues (P2)
- low-priority: Low priority issues (P3)
- features: New feature development
- bugs: Bug fixes and issues

Current Selection: $CurrentSelection

Recommend the most appropriate queue and explain your reasoning in one sentence.
"@
    
    try {
        $response = Invoke-AICompletion -Prompt $prompt -SystemMessage "You are an expert project manager. Recommend the best queue for issue processing based on priority, complexity, and type."
        $recommendedQueue = ($response -split '\n')[0] -replace '^[^:]*:', '' -replace '^[^a-z]*', '' -replace '[^a-z-].*', ''
        
        # Validate recommendation
        if ($script:queueStorage.Queues.ContainsKey($recommendedQueue)) {
            return $recommendedQueue
        }
    }
    catch {
        Write-Warning "AI queue recommendation failed: $($_.Exception.Message)"
    }
    
    return $CurrentSelection
}

function Calculate-PriorityScore {
    <#
    .SYNOPSIS
    Calculate priority score for queue ordering
    #>
    param([hashtable]$IssueData)
    
    $score = 0
    
    # Priority weight
    if ($script:queueConfig.PriorityWeights.ContainsKey($IssueData.Priority)) {
        $score += $script:queueConfig.PriorityWeights[$IssueData.Priority]
    }
    
    # Size weight (smaller issues get higher priority)
    if ($script:queueConfig.SizeWeights.ContainsKey($IssueData.Size)) {
        $score += (100 - $script:queueConfig.SizeWeights[$IssueData.Size])
    }
    
    # Age factor (older issues get slightly higher priority)
    $age = (Get-Date) - [DateTime]::Parse($IssueData.CreatedAt)
    $ageScore = [Math]::Min(10, $age.TotalDays)
    $score += $ageScore
    
    # Label bonuses
    if ($IssueData.Labels -contains "urgent") { $score += 20 }
    if ($IssueData.Labels -contains "critical") { $score += 15 }
    if ($IssueData.Labels -contains "bug") { $score += 10 }
    
    return $score
}

function Sort-QueueItems {
    <#
    .SYNOPSIS
    Sort queue items by processing order
    #>
    param([string]$QueueName)
    
    $queue = $script:queueStorage.Queues[$QueueName]
    if (-not $queue.Items) { return }
    
    switch ($queue.ProcessingOrder) {
        "priority-desc" {
            $queue.Items = $queue.Items | Sort-Object PriorityScore -Descending
        }
        "priority-asc" {
            $queue.Items = $queue.Items | Sort-Object PriorityScore
        }
        "size-asc" {
            $queue.Items = $queue.Items | Sort-Object { $script:queueConfig.SizeWeights[$_.Size] }
        }
        "size-desc" {
            $queue.Items = $queue.Items | Sort-Object { $script:queueConfig.SizeWeights[$_.Size] } -Descending
        }
        "fifo" {
            $queue.Items = $queue.Items | Sort-Object AddedAt
        }
        default {
            $queue.Items = $queue.Items | Sort-Object PriorityScore -Descending
        }
    }
}

function Process-Queue {
    <#
    .SYNOPSIS
    Process items in a specific queue
    #>
    param(
        [Parameter(Mandatory=$true)]
        [string]$QueueName,
        
        [int]$MaxItems = 0,
        [switch]$DryRun = $false
    )
    
    if (-not $script:queueStorage.Queues.ContainsKey($QueueName)) {
        Write-Error "Queue '$QueueName' does not exist"
        return
    }
    
    $queue = $script:queueStorage.Queues[$QueueName]
    if (-not $queue.Items -or $queue.Items.Count -eq 0) {
        Write-ColorOutput "Queue '$QueueName' is empty" "Yellow"
        return
    }
    
    # Check concurrent processing limits
    $currentlyProcessing = ($script:queueStorage.ProcessingIssues.Values | Where-Object { $_.QueueName -eq $QueueName }).Count
    $maxConcurrent = $queue.MaxConcurrent
    $availableSlots = $maxConcurrent - $currentlyProcessing
    
    if ($availableSlots -le 0) {
        Write-ColorOutput "Queue '$QueueName' is at capacity ($currentlyProcessing/$maxConcurrent)" "Yellow"
        return
    }
    
    # Determine how many items to process
    $itemsToProcess = if ($MaxItems -gt 0) { [Math]::Min($MaxItems, $availableSlots) } else { $availableSlots }
    
    Write-ColorOutput "Processing $itemsToProcess items from queue '$QueueName'" "Blue"
    
    for ($i = 0; $i -lt [Math]::Min($itemsToProcess, $queue.Items.Count); $i++) {
        $queueItem = $queue.Items[$i]
        
        if ($DryRun) {
            Write-ColorOutput "  [DRY RUN] Would process issue #$($queueItem.IssueNumber)" "Cyan"
            continue
        }
        
        Write-ColorOutput "  Processing issue #$($queueItem.IssueNumber) - $($queueItem.IssueData.Title)" "Green"
        
        # Start processing the issue
        $processingResult = Start-IssueProcessing -QueueItem $queueItem
        
        if ($processingResult.Success) {
            # Remove from queue and add to processing
            $script:queueStorage.Queues[$QueueName].Items = $script:queueStorage.Queues[$QueueName].Items | Where-Object { $_.IssueNumber -ne $queueItem.IssueNumber }
            $script:queueStorage.ProcessingIssues[$queueItem.IssueNumber] = $processingResult
            Write-ColorOutput "    ✅ Issue processing started" "Green"
        } else {
            Write-ColorOutput "    ❌ Failed to start processing: $($processingResult.Error)" "Red"
        }
    }
}

function Start-IssueProcessing {
    <#
    .SYNOPSIS
    Start processing a queued issue
    #>
    param([hashtable]$QueueItem)
    
    try {
        $processingJob = @{
            IssueNumber = $QueueItem.IssueNumber
            QueueName = $QueueItem.QueueName
            StartedAt = Get-Date
            Status = "processing"
            Agent = if ($script:queueConfig.AutoAssign) { "auto-agent" } else { "manual" }
            Attempt = $QueueItem.ProcessingAttempts + 1
            QueueItem = $QueueItem
        }
        
        # In a real implementation, this would start actual processing
        # For now, we'll simulate the processing start
        Write-ColorOutput "    📋 Issue processing simulation started" "White"
        
        return @{
            Success = $true
            ProcessingJob = $processingJob
        }
    }
    catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

function Get-QueueStatus {
    <#
    .SYNOPSIS
    Get comprehensive queue status and statistics
    #>
    param([string]$QueueName = "")
    
    if ([string]::IsNullOrEmpty($QueueName)) {
        # Show all queues
        Write-ColorOutput "=== Queue Status Overview ===" "Blue"
        
        foreach ($queueKey in $script:queueStorage.Queues.Keys) {
            $queue = $script:queueStorage.Queues[$queueKey]
            $itemCount = if ($queue.Items) { $queue.Items.Count } else { 0 }
            $processingCount = ($script:queueStorage.ProcessingIssues.Values | Where-Object { $_.QueueName -eq $queueKey }).Count
            
            Write-ColorOutput "📋 $($queue.Name) ($queueKey)" "White"
            Write-ColorOutput "  Items in queue: $itemCount" "White"
            Write-ColorOutput "  Currently processing: $processingCount/$($queue.MaxConcurrent)" "White"
            Write-ColorOutput "  Processing order: $($queue.ProcessingOrder)" "White"
            Write-ColorOutput ""
        }
        
        # Show statistics
        $stats = $script:queueStorage.Statistics
        Write-ColorOutput "=== Statistics ===" "Blue"
        Write-ColorOutput "Total processed: $($stats.TotalProcessed)" "White"
        Write-ColorOutput "Total failed: $($stats.TotalFailed)" "White"
        Write-ColorOutput "Average processing time: $($stats.AverageProcessingTime) minutes" "White"
        Write-ColorOutput "Queue utilization: $($stats.QueueUtilization)%" "White"
    } else {
        # Show specific queue
        if (-not $script:queueStorage.Queues.ContainsKey($QueueName)) {
            Write-Error "Queue '$QueueName' does not exist"
            return
        }
        
        $queue = $script:queueStorage.Queues[$QueueName]
        Write-ColorOutput "=== Queue: $($queue.Name) ===" "Blue"
        Write-ColorOutput "Description: $($queue.Description)" "White"
        Write-ColorOutput "Processing order: $($queue.ProcessingOrder)" "White"
        Write-ColorOutput "Max concurrent: $($queue.MaxConcurrent)" "White"
        
        if ($queue.Items) {
            Write-ColorOutput "" "White"
            Write-ColorOutput "Items in queue ($($queue.Items.Count)):" "White"
            foreach ($item in $queue.Items) {
                Write-ColorOutput "  #$($item.IssueNumber) - $($item.IssueData.Title)" "White"
                Write-ColorOutput "    Priority: $($item.Priority) | Size: $($item.Size) | Score: $($item.PriorityScore)" "Gray"
            }
        } else {
            Write-ColorOutput "No items in queue" "Yellow"
        }
    }
}

function Start-QueueProcessor {
    <#
    .SYNOPSIS
    Start the continuous queue processor
    #>
    param(
        [int]$IntervalSeconds = $script:queueConfig.QueueCheckIntervalSeconds,
        [switch]$DryRun = $false
    )
    
    Write-ColorOutput "Starting Queue Processor..." "Blue"
    Write-ColorOutput "Check interval: $IntervalSeconds seconds" "White"
    Write-ColorOutput "Dry run mode: $(if ($DryRun) { 'Enabled' } else { 'Disabled' })" "White"
    Write-ColorOutput "Press Ctrl+C to stop" "Yellow"
    Write-ColorOutput ""
    
    while ($true) {
        try {
            Write-ColorOutput "=== Queue Check ($(Get-Date -Format 'HH:mm:ss')) ===" "Blue"
            
            # Process all queues
            foreach ($queueName in $script:queueStorage.Queues.Keys) {
                Process-Queue -QueueName $queueName -DryRun:$DryRun
            }
            
            # Check for completed processing jobs
            Check-CompletedJobs
            
            Write-ColorOutput "Waiting $IntervalSeconds seconds for next check..." "Gray"
            Start-Sleep -Seconds $IntervalSeconds
        }
        catch {
            Write-ColorOutput "Error in queue processor: $($_.Exception.Message)" "Red"
            Start-Sleep -Seconds $IntervalSeconds
        }
    }
}

function Check-CompletedJobs {
    <#
    .SYNOPSIS
    Check for completed processing jobs and update statistics
    #>
    $completedJobs = @()
    
    foreach ($jobKey in $script:queueStorage.ProcessingIssues.Keys) {
        $job = $script:queueStorage.ProcessingIssues[$jobKey]
        
        # Check if job is completed (timeout or success)
        $processingTime = (Get-Date) - $job.StartedAt
        if ($processingTime.TotalMinutes -gt $script:queueConfig.ProcessingTimeoutMinutes) {
            $completedJobs += $jobKey
            $script:queueStorage.Statistics.TotalFailed++
            Write-ColorOutput "⏰ Job #$($job.IssueNumber) timed out" "Yellow"
        }
        # In a real implementation, we would check for actual completion signals
    }
    
    # Remove completed jobs
    foreach ($jobKey in $completedJobs) {
        $script:queueStorage.ProcessingIssues.Remove($jobKey)
    }
}

# Main execution
if ($MyInvocation.InvocationName -ne '.') {
    Show-QueueBanner
    
    # Initialize queue manager
    Initialize-QueueManager
    
    # Example usage
    Write-ColorOutput "Queue Manager ready!" "Green"
    Write-ColorOutput "Use Get-QueueStatus to view queue information" "White"
    Write-ColorOutput "Use Start-QueueProcessor to begin processing" "White"
}
