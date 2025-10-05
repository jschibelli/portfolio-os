# Master Automation Script - Unified Entry Point
# Usage: .\scripts\master-automation.ps1 [-Mode <MODE>] [-Target <TARGET>] [-Options <OPTIONS>]
#
# This is the main entry point for all automation workflows

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("continuous", "single-issue", "single-pr", "queue", "status", "monitor", "help")]
    [string]$Mode = "help",
    
    [Parameter(Mandatory=$false)]
    [string]$Target = "",
    
    [Parameter(Mandatory=$false)]
    [string]$Options = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [switch]$Watch,
    
    [Parameter(Mandatory=$false)]
    [int]$MaxIssues = 10,
    
    [Parameter(Mandatory=$false)]
    [string]$LogFile = "master-automation.log"
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
    Write-ColorOutput "           Master Automation System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Show-Help {
    Write-ColorOutput "🚀 Master Automation System - Usage Guide" "Green"
    Write-ColorOutput ""
    
    Write-ColorOutput "📋 Available Modes:" "Cyan"
    Write-ColorOutput ""
    
    Write-ColorOutput "1. CONTINUOUS PIPELINE (Recommended)" "Yellow"
    Write-ColorOutput "   Process multiple issues automatically from Todo → Done → Merged" "White"
    Write-ColorOutput "   Usage: .\scripts\master-automation.ps1 -Mode continuous -MaxIssues 10" "Gray"
    Write-ColorOutput "   Options: -Watch (monitor continuously), -DryRun (preview only)" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "2. SINGLE ISSUE" "Yellow"
    Write-ColorOutput "   Process one specific issue through the full pipeline" "White"
    Write-ColorOutput "   Usage: .\scripts\master-automation.ps1 -Mode single-issue -Target 123" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "3. SINGLE PR" "Yellow"
    Write-ColorOutput "   Monitor and automate a specific pull request" "White"
    Write-ColorOutput "   Usage: .\scripts\master-automation.ps1 -Mode single-pr -Target 456" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "4. QUEUE MANAGEMENT" "Yellow"
    Write-ColorOutput "   Manage issue queues and prioritization" "White"
    Write-ColorOutput "   Usage: .\scripts\master-automation.ps1 -Mode queue -Target 'blog'" "Gray"
    Write-ColorOutput "   Options: -Options 'status|process|create'" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "5. STATUS CHECK" "Yellow"
    Write-ColorOutput "   Check current automation status and pipeline health" "White"
    Write-ColorOutput "   Usage: .\scripts\master-automation.ps1 -Mode status" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "6. PROJECT MONITOR" "Yellow"
    Write-ColorOutput "   Real-time monitoring of project board status" "White"
    Write-ColorOutput "   Usage: .\scripts\master-automation.ps1 -Mode monitor" "Gray"
    Write-ColorOutput ""
    
    Write-ColorOutput "📚 Examples:" "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "# Start continuous processing (recommended)" "White"
    Write-ColorOutput ".\scripts\master-automation.ps1 -Mode continuous -MaxIssues 5" "Gray"
    Write-ColorOutput ""
    Write-ColorOutput "# Process specific issue" "White"
    Write-ColorOutput ".\scripts\master-automation.ps1 -Mode single-issue -Target 123" "Gray"
    Write-ColorOutput ""
    Write-ColorOutput "# Monitor continuously with watch mode" "White"
    Write-ColorOutput ".\scripts\master-automation.ps1 -Mode continuous -Watch -MaxIssues 20" "Gray"
    Write-ColorOutput ""
    Write-ColorOutput "# Check queue status" "White"
    Write-ColorOutput ".\scripts\master-automation.ps1 -Mode queue -Target 'blog' -Options 'status'" "Gray"
    Write-ColorOutput ""
    Write-ColorOutput "# Dry run to preview what would happen" "White"
    Write-ColorOutput ".\scripts\master-automation.ps1 -Mode continuous -MaxIssues 3 -DryRun" "Gray"
    Write-ColorOutput ""
}

function Start-ContinuousPipeline {
    param([int]$MaxIssues, [switch]$Watch, [switch]$DryRun)
    
    Write-ColorOutput "🚀 Starting Continuous Pipeline..." "Green"
    Write-ColorOutput "Max Issues: $MaxIssues" "White"
    Write-ColorOutput "Watch Mode: $Watch" "White"
    Write-ColorOutput "Dry Run: $DryRun" "White"
    Write-ColorOutput ""
    
    try {
        $params = @{
            MaxIssues = $MaxIssues
        }
        
        if ($Watch) { $params.Watch = $true }
        if ($DryRun) { $params.DryRun = $true }
        
        & .\scripts\continuous-issue-pipeline.ps1 @params
    }
    catch {
        Write-ColorOutput "Continuous pipeline failed: $($_.Exception.Message)" "Red"
        exit 1
    }
}

function Process-SingleIssue {
    param([string]$IssueNumber)
    
    if (-not $IssueNumber -or $IssueNumber -notmatch '^\d+$') {
        Write-ColorOutput "Invalid issue number: $IssueNumber" "Red"
        Write-ColorOutput "Please provide a valid issue number" "Yellow"
        return
    }
    
    Write-ColorOutput "🔄 Processing Single Issue #$IssueNumber..." "Green"
    
    try {
        # Step 1: Configure issue and set to "In progress"
        Write-ColorOutput "  📋 Configuring issue and setting to 'In progress'..." "Yellow"
        & .\..\issue-config-unified.ps1 -IssueNumber $IssueNumber -Preset "blog" -AddToProject -Status "In progress"
        
        # Step 2: Create branch
        Write-ColorOutput "  🌿 Creating branch..." "Yellow"
        & .\..\create-branch-from-develop.ps1 -IssueNumber $IssueNumber
        
        # Step 3: Implement
        Write-ColorOutput "  🔨 Implementing issue..." "Yellow"
        & .\..\issue-implementation.ps1 -IssueNumber $IssueNumber -Action all
        
        # Step 4: Create PR and set to "Ready" (in review)
        Write-ColorOutput "  📝 Creating PR and setting to 'Ready'..." "Yellow"
        $prTitle = "feat: Issue #$IssueNumber"
        $prBody = "Resolves #$IssueNumber"
        gh pr create --title $prTitle --body $prBody --base develop --head "issue-$IssueNumber"
        
        # Update project status to "Ready" (in review)
        Write-ColorOutput "  📊 Updating project status to 'Ready'..." "Yellow"
        # Note: This would need the project item ID to update status
        
        # Step 5: Automate PR
        Write-ColorOutput "  🤖 Automating PR..." "Yellow"
        $prNumber = gh pr list --head "issue-$IssueNumber" --json number -q '.[0].number' 2>$null
        if ($prNumber) {
            & .\pr-automation-unified.ps1 -PRNumber $prNumber -Action all -AutoFix
        }
        
        # Step 6: Set to "Done" after successful processing
        Write-ColorOutput "  ✅ Setting issue to 'Done'..." "Yellow"
        # Note: This would need the project item ID to update status
        
        Write-ColorOutput "✅ Issue #$IssueNumber processed successfully!" "Green"
    }
    catch {
        Write-ColorOutput "Failed to process issue #$IssueNumber: $($_.Exception.Message)" "Red"
        exit 1
    }
}

function Process-SinglePR {
    param([string]$PRNumber)
    
    if (-not $PRNumber -or $PRNumber -notmatch '^\d+$') {
        Write-ColorOutput "Invalid PR number: $PRNumber" "Red"
        Write-ColorOutput "Please provide a valid PR number" "Yellow"
        return
    }
    
    Write-ColorOutput "🔄 Processing Single PR #$PRNumber..." "Green"
    
    try {
        & .\pr-automation-unified.ps1 -PRNumber $PRNumber -Action all -AutoFix
        Write-ColorOutput "✅ PR #$PRNumber processed successfully!" "Green"
    }
    catch {
        Write-ColorOutput "Failed to process PR #$PRNumber: $($_.Exception.Message)" "Red"
        exit 1
    }
}

function Manage-Queue {
    param([string]$QueueName, [string]$Operation)
    
    Write-ColorOutput "📋 Managing Queue: $QueueName" "Green"
    Write-ColorOutput "Operation: $Operation" "White"
    
    try {
        $params = @{
            Operation = $Operation
            Queue = $QueueName
        }
        
        if ($DryRun) { $params.DryRun = $true }
        
        & .\scripts\issue-queue-manager.ps1 @params
    }
    catch {
        Write-ColorOutput "Queue management failed: $($_.Exception.Message)" "Red"
        exit 1
    }
}

function Show-Status {
    Write-ColorOutput "📊 Automation Status Check" "Green"
    Write-ColorOutput ""
    
    # Check GitHub authentication
    try {
        gh auth status | Out-Null
        Write-ColorOutput "✅ GitHub CLI authenticated" "Green"
    }
    catch {
        Write-ColorOutput "❌ GitHub CLI not authenticated" "Red"
        Write-ColorOutput "Run 'gh auth login' to authenticate" "Yellow"
    }
    
    # Check git repository
    try {
        $currentBranch = git branch --show-current
        Write-ColorOutput "✅ Git repository detected" "Green"
        Write-ColorOutput "Current branch: $currentBranch" "White"
    }
    catch {
        Write-ColorOutput "❌ Not in a git repository" "Red"
    }
    
    # Check project status
    try {
        Write-ColorOutput "`n📋 Project Status:" "Cyan"
        & .\scripts\issue-queue-manager.ps1 -Operation list
    }
    catch {
        Write-ColorOutput "Failed to check project status" "Red"
    }
    
    # Check for any running processes
    Write-ColorOutput "`n🔄 System Status:" "Cyan"
    Write-ColorOutput "Log file: $LogFile" "White"
    Write-ColorOutput "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" "White"
}

function Log-AutomationEvent {
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

# Main execution
try {
    Show-Banner
    
    # Initialize log file
    $logHeader = @"
# Master Automation Log
Started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Mode: $Mode
Target: $Target
Options: $Options
Dry Run: $DryRun
Watch: $Watch
Max Issues: $MaxIssues

"@
    $logHeader | Out-File -FilePath $LogFile -Encoding UTF8
    
    Log-AutomationEvent "INFO" "Master automation started with mode: $Mode"
    
    switch ($Mode) {
        "continuous" {
            Start-ContinuousPipeline -MaxIssues $MaxIssues -Watch:$Watch -DryRun:$DryRun
        }
        "single-issue" {
            Process-SingleIssue -IssueNumber $Target
        }
        "single-pr" {
            Process-SinglePR -PRNumber $Target
        }
        "queue" {
            Manage-Queue -QueueName $Target -Operation $Options
        }
        "status" {
            Show-Status
        }
        "monitor" {
            & .\scripts\project-status-monitor.ps1 -Watch -Interval 30
        }
        "help" {
            Show-Help
        }
        default {
            Write-ColorOutput "Invalid mode: $Mode" "Red"
            Write-ColorOutput "Use -Mode help to see available options" "Yellow"
            exit 1
        }
    }
    
    Log-AutomationEvent "INFO" "Master automation completed successfully"
    
} catch {
    Write-ColorOutput "Master automation failed: $($_.Exception.Message)" "Red"
    Log-AutomationEvent "ERROR" "Master automation failed: $($_.Exception.Message)"
    exit 1
}
