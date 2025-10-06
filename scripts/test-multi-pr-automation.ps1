# Test Multi-PR Automation Script
# Usage: .\scripts\test-multi-pr-automation.ps1 -PRNumbers @(240,244) [-BreakMinutes 2] [-DryRun]
# 
# This script provides a testing interface for the multi-PR automation system.
# It includes comprehensive error handling, input validation, and user confirmation.
#
# Parameters:
#   -PRNumbers: Array of PR numbers to process (default: 240, 244)
#   -BreakMinutes: Minutes to wait between PRs (default: 2)
#   -CommentBreakSeconds: Seconds to wait between comments (default: 30)
#   -DryRun: Run in dry-run mode without making actual changes

param(
    [Parameter(Mandatory=$false, HelpMessage="Array of PR numbers to process")]
    [ValidateNotNullOrEmpty()]
    [int[]]$PRNumbers = @(240, 244),  # Default test PRs
    
    [Parameter(Mandatory=$false, HelpMessage="Minutes to wait between PRs")]
    [ValidateRange(1, 60)]
    [int]$BreakMinutes = 2,
    
    [Parameter(Mandatory=$false, HelpMessage="Seconds to wait between comments")]
    [ValidateRange(10, 300)]
    [int]$CommentBreakSeconds = 30,
    
    [Parameter(Mandatory=$false, HelpMessage="Run in dry-run mode without making changes")]
    [switch]$DryRun
)

# Function to get script directory for absolute path resolution
function Get-ScriptDirectory {
    return Split-Path -Parent $MyInvocation.PSCommandPath
}

# Function to validate PR numbers
function Test-PRNumbers {
    param([int[]]$Numbers)
    
    foreach ($number in $Numbers) {
        if ($number -le 0) {
            throw "Invalid PR number: $number. PR numbers must be positive integers."
        }
    }
    return $true
}

# Function to get user confirmation with better UX
function Get-UserConfirmation {
    param([string]$Message)
    
    Write-Host $Message -ForegroundColor Yellow
    Write-Host "Do you want to continue? (y/N): " -ForegroundColor Yellow -NoNewline
    
    $response = Read-Host
    return $response -match '^[yY]'
}

# Function to execute automation script with error handling
function Invoke-AutomationScript {
    param(
        [int[]]$PRNumbers,
        [int]$BreakMinutes,
        [int]$CommentBreakSeconds,
        [bool]$DryRun
    )
    
    try {
        # Get absolute path to the automation script
        $scriptDir = Get-ScriptDirectory
        $automationScript = Join-Path $scriptDir "multi-pr-automation.ps1"
        
        # Check if automation script exists
        if (-not (Test-Path $automationScript)) {
            throw "Automation script not found at: $automationScript"
        }
        
        # Build command arguments
        $arguments = @(
            "-PRNumbers", ($PRNumbers -join ',')
            "-BreakMinutes", $BreakMinutes
            "-CommentBreakSeconds", $CommentBreakSeconds
            "-AutoFix"
            "-AutoCommit"
        )
        
        if ($DryRun) {
            $arguments += "-DryRun"
        }
        
        Write-Host "Executing automation script with arguments: $($arguments -join ' ')" -ForegroundColor Cyan
        
        # Execute the automation script
        & $automationScript @arguments
        
        if ($LASTEXITCODE -ne 0) {
            throw "Automation script failed with exit code: $LASTEXITCODE"
        }
        
        return $true
    }
    catch {
        Write-Error "Failed to execute automation script: $($_.Exception.Message)"
        return $false
    }
}

# Main execution with comprehensive error handling
try {
    # Display script information
    Write-Host "Testing Multi-PR Automation System" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "PR Numbers: $($PRNumbers -join ', ')" -ForegroundColor White
    Write-Host "Break between PRs: $BreakMinutes minutes" -ForegroundColor White
    Write-Host "Break between comments: $CommentBreakSeconds seconds" -ForegroundColor White
    Write-Host "Dry Run: $DryRun" -ForegroundColor White
    Write-Host "Script Directory: $(Get-ScriptDirectory)" -ForegroundColor Gray
    Write-Host ""
    
    # Validate input parameters
    Write-Host "Validating input parameters..." -ForegroundColor Yellow
    Test-PRNumbers -Numbers $PRNumbers
    Write-Host "Input validation passed." -ForegroundColor Green
    
    # Execute based on mode
    if ($DryRun) {
        Write-Host "Running in DRY RUN mode - no actual changes will be made" -ForegroundColor Yellow
        $success = Invoke-AutomationScript -PRNumbers $PRNumbers -BreakMinutes $BreakMinutes -CommentBreakSeconds $CommentBreakSeconds -DryRun $true
    } 
    else {
        # Enhanced user confirmation
        $confirmationMessage = @"
WARNING: This will make actual changes to the following PRs: $($PRNumbers -join ', ')
This action cannot be undone. Please ensure you have reviewed the changes.
"@
        
        if (Get-UserConfirmation -Message $confirmationMessage) {
            Write-Host "Proceeding with automation..." -ForegroundColor Green
            $success = Invoke-AutomationScript -PRNumbers $PRNumbers -BreakMinutes $BreakMinutes -CommentBreakSeconds $CommentBreakSeconds -DryRun $false
        }
        else {
            Write-Host "Operation cancelled by user." -ForegroundColor Yellow
            exit 0
        }
    }
    
    # Report results
    Write-Host ""
    if ($success) {
        Write-Host "Multi-PR Automation test completed successfully!" -ForegroundColor Green
    }
    else {
        Write-Host "Multi-PR Automation test failed. Check the error messages above." -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Error "Script execution failed: $($_.Exception.Message)"
    Write-Host "Stack trace: $($_.ScriptStackTrace)" -ForegroundColor Red
    exit 1
}
finally {
    Write-Host ""
    Write-Host "Script execution completed at $(Get-Date)" -ForegroundColor Gray
}
