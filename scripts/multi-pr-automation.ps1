# Multi-PR Automation Script with 2-Minute Breaks Between PRs
# Usage: .\scripts\multi-pr-automation.ps1 -PRNumbers @(240,244,245) [-Agent "Agent-One"] [-BreakMinutes 2]

param(
    [Parameter(Mandatory=$true)]
    [int[]]$PRNumbers,
    
    [Parameter(Mandatory=$false)]
    [string]$Agent = "Agent-One",
    
    [Parameter(Mandatory=$false)]
    [int]$BreakMinutes = 2,
    
    [Parameter(Mandatory=$false)]
    [int]$CommentBreakSeconds = 30,
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoFix,
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoCommit,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "     Multi-PR Automation System" "Blue"
    Write-ColorOutput "   (With $BreakMinutes-minute breaks between PRs)" "Blue"
    Write-ColorOutput "   ($CommentBreakSeconds-second breaks between comments)" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "Agent: $Agent" "Cyan"
    Write-ColorOutput "PRs to process: $($PRNumbers -join ', ')" "Cyan"
    Write-ColorOutput ""
}

function Invoke-PRAutomation {
    param([int]$PRNumber, [string]$Agent)
    
    Write-ColorOutput "Starting automation for PR #$PRNumber" "Green"
    Write-ColorOutput "Agent: $Agent" "White"
    Write-ColorOutput "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" "White"
    Write-ColorOutput ""
    
    try {
        # Run the enhanced PR automation
        $scriptPath = Join-Path $PSScriptRoot "pr-automation-enhanced-simple.ps1"
        
        $params = @{
            PRNumber = $PRNumber
            Action = "all"
            CommentBreakSeconds = $CommentBreakSeconds
        }
        
        if ($AutoFix) { $params.AutoFix = $true }
        if ($AutoCommit) { $params.AutoCommit = $true }
        if ($DryRun) { $params.DryRun = $true }
        
        # Execute the PR automation
        & $scriptPath @params
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "PR #$PRNumber automation completed successfully" "Green"
            return $true
        } else {
            Write-ColorOutput "PR #$PRNumber automation failed" "Red"
            return $false
        }
    }
    catch {
        Write-ColorOutput "Error processing PR #$PRNumber : $($_.Exception.Message)" "Red"
        return $false
    }
}

function Invoke-BreakBetweenPRs {
    param([int]$Minutes, [int]$CurrentPR, [int]$NextPR)
    
    Write-ColorOutput "" "White"
    Write-ColorOutput "BREAK TIME" "Yellow"
    Write-ColorOutput "Completed PR #$CurrentPR" "White"
    Write-ColorOutput "Next: PR #$NextPR" "White"
    Write-ColorOutput "Waiting $Minutes minutes before next PR operation..." "Yellow"
    Write-ColorOutput ""
    
    # Show countdown
    $totalSeconds = $Minutes * 60
    for ($i = $totalSeconds; $i -gt 0; $i--) {
        $remainingMinutes = [math]::Floor($i / 60)
        $remainingSeconds = $i % 60
        
        if ($i % 30 -eq 0 -or $i -le 10) {  # Update every 30 seconds or last 10 seconds
            Write-Host "`rBreak time remaining: $remainingMinutes`:$(($remainingSeconds).ToString('00'))" -NoNewline -ForegroundColor Cyan
        }
        
        Start-Sleep -Seconds 1
    }
    
    Write-Host "`r" -NoNewline  # Clear the countdown line
    Write-ColorOutput "Break completed - starting next PR" "Green"
    Write-ColorOutput ""
}

# Main execution
Show-Banner

$totalPRs = $PRNumbers.Count
$successfulPRs = 0
$failedPRs = 0
$startTime = Get-Date

Write-ColorOutput "Processing $totalPRs PRs with $BreakMinutes-minute breaks" "White"
Write-ColorOutput "Started at: $($startTime.ToString('yyyy-MM-dd HH:mm:ss'))" "White"
Write-ColorOutput ""

for ($i = 0; $i -lt $PRNumbers.Count; $i++) {
    $prNumber = $PRNumbers[$i]
    $prIndex = $i + 1
    
    Write-ColorOutput "PR $prIndex of $totalPRs" "Cyan"
    
    # Process the PR
    $success = Invoke-PRAutomation -PRNumber $prNumber -Agent $Agent
    
    if ($success) {
        $successfulPRs++
    } else {
        $failedPRs++
    }
    
    # Add break between PRs (except for the last one)
    if ($i -lt ($PRNumbers.Count - 1)) {
        $nextPR = $PRNumbers[$i + 1]
        Invoke-BreakBetweenPRs -Minutes $BreakMinutes -CurrentPR $prNumber -NextPR $nextPR
    }
}

# Final summary
$endTime = Get-Date
$totalDuration = $endTime - $startTime

Write-ColorOutput "" "White"
Write-ColorOutput "MULTI-PR AUTOMATION COMPLETE" "Green"
Write-ColorOutput "===============================================" "Green"
Write-ColorOutput "Total PRs processed: $totalPRs" "White"
Write-ColorOutput "Successful: $successfulPRs" "Green"
Write-ColorOutput "Failed: $failedPRs" "Red"
Write-ColorOutput "Start time: $($startTime.ToString('yyyy-MM-dd HH:mm:ss'))" "White"
Write-ColorOutput "End time: $($endTime.ToString('yyyy-MM-dd HH:mm:ss'))" "White"
Write-ColorOutput "Total duration: $($totalDuration.ToString('hh\:mm\:ss'))" "White"
Write-ColorOutput "Agent: $Agent" "Cyan"
Write-ColorOutput ""

if ($failedPRs -gt 0) {
    Write-ColorOutput "Some PRs failed - check the logs above" "Yellow"
    exit 1
} else {
    Write-ColorOutput "All PRs processed successfully!" "Green"
    exit 0
}
