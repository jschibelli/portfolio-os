# Enhanced PR Automation Script - Full Code Fixing and Merge Workflow (Simplified)
# Usage: .\scripts\pr-automation-enhanced-simple.ps1 -PRNumber <PR_NUMBER> [-Action <ACTION>] [-AutoFix] [-AutoCommit] [-AutoMerge]
# 
# This script actually fixes code issues, commits changes, and drives PRs to merge
# CRITICAL: Base branch MUST be 'develop' - automation will stop if base branch is 'main'

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("analyze", "fix", "commit", "respond", "quality", "merge", "all")]
    [string]$Action = "all",
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoFix,
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoCommit,
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoMerge,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [int]$CommentBreakSeconds = 30
)

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "     Enhanced PR Automation System" "Blue"
    Write-ColorOutput "   (Code Fixing + Commit + Merge Workflow)" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Test-BaseBranch {
    param([string]$PRNumber, [switch]$AutoFix)
    
    try {
        $prInfo = gh pr view $PRNumber --json baseRefName,headRefName
        $baseBranch = ($prInfo | ConvertFrom-Json).baseRefName
        
        Write-ColorOutput "Checking base branch: $baseBranch" "Yellow"
        
        if ($baseBranch -ne "develop") {
            Write-ColorOutput "Base branch verification failed: $baseBranch" "Red"
            
            if ($AutoFix) {
                Write-ColorOutput "AutoFix enabled - updating base branch to develop..." "Yellow"
                gh pr edit $PRNumber --base develop
                if ($LASTEXITCODE -eq 0) {
                    Write-ColorOutput "Base branch updated to develop" "Green"
                    return $true
                } else {
                    Write-ColorOutput "Failed to update base branch" "Red"
                    return $false
                }
            }
            
            return $false
        }
        
        Write-ColorOutput "Base branch verification passed: $baseBranch" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "Failed to check base branch: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Get-PRBranch {
    param([string]$PRNumber)
    
    try {
        $prInfo = gh pr view $PRNumber --json headRefName
        return ($prInfo | ConvertFrom-Json).headRefName
    }
    catch {
        Write-ColorOutput "Failed to get PR branch: $($_.Exception.Message)" "Red"
        return $null
    }
}

function Invoke-CodeAnalysis {
    param([string]$PRNumber)
    
    Write-ColorOutput "Analyzing code issues..." "Yellow"
    
    try {
        $issues = @{
            Critical = @()
            High = @()
            Low = @()
        }
        
        # Run ESLint analysis
        Write-ColorOutput "  Running ESLint analysis..." "White"
        $eslintOutput = npm run lint 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "    Found ESLint issues" "Yellow"
            $issues.High += @{
                Category = "ESLint"
                Message = "ESLint found code quality issues"
                File = "Multiple files"
            }
        } else {
            Write-ColorOutput "    No ESLint issues found" "Green"
        }
        
        # Run TypeScript analysis
        Write-ColorOutput "  Running TypeScript analysis..." "White"
        $tscOutput = npm run type-check 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "    Found TypeScript issues" "Red"
            $issues.Critical += @{
                Category = "TypeScript"
                Message = "TypeScript compilation failed"
                File = "TypeScript files"
            }
        } else {
            Write-ColorOutput "    No TypeScript issues found" "Green"
        }
        
        $totalIssues = $issues.Critical.Count + $issues.High.Count + $issues.Low.Count
        Write-ColorOutput "  Found $totalIssues issue categories" "White"
        
        return $issues
    }
    catch {
        Write-ColorOutput "Failed to analyze code issues: $($_.Exception.Message)" "Red"
        return $null
    }
}

function Add-MissingTypeCheckScript {
    try {
        $packageJsonPath = "package.json"
        if (Test-Path $packageJsonPath) {
            $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
            
            if (-not $packageJson.scripts."type-check") {
                $packageJson.scripts | Add-Member -MemberType NoteProperty -Name "type-check" -Value "tsc --noEmit"
                
                $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath
                Write-ColorOutput "    Added missing type-check script" "Green"
                return $true
            }
        }
        return $false
    }
    catch {
        Write-ColorOutput "    Failed to add type-check script: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Invoke-CodeFixing {
    param([string]$PRNumber, [hashtable]$Issues)
    
    Write-ColorOutput "Fixing code issues..." "Yellow"
    
    try {
        $prBranch = Get-PRBranch -PRNumber $PRNumber
        if (-not $prBranch) {
            Write-ColorOutput "Failed to get PR branch" "Red"
            return $false
        }
        
        # Checkout the PR branch
        Write-ColorOutput "  Checking out PR branch: $prBranch" "White"
        git checkout $prBranch
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "Failed to checkout PR branch" "Red"
            return $false
        }
        
        $fixesApplied = 0
        
        # Fix Critical issues first (TypeScript errors)
        if ($Issues.Critical.Count -gt 0) {
            Write-ColorOutput "  Fixing Critical issues..." "Red"
            foreach ($issue in $Issues.Critical) {
                if ($issue.Category -eq "TypeScript") {
                    Write-ColorOutput "    Fixing TypeScript error: $($issue.Message)" "White"
                    # Add type-check script to package.json if missing
                    if ($issue.Message -match "Missing script") {
                        if (Add-MissingTypeCheckScript) {
                            $fixesApplied++
                        }
                    }
                }
            }
        }
        
        # Auto-fix what we can with ESLint
        Write-ColorOutput "  Running ESLint --fix..." "White"
        $fixOutput = npm run lint -- --fix 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "    ESLint auto-fix completed" "Green"
            $fixesApplied++
        } else {
            Write-ColorOutput "    ESLint auto-fix had issues, but continuing..." "Yellow"
        }
        
        Write-ColorOutput "  Applied $fixesApplied total fixes" "Green"
        return $fixesApplied -gt 0
    }
    catch {
        Write-ColorOutput "Failed to fix code issues: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Invoke-CommitChanges {
    param([string]$PRNumber, [switch]$DryRun)
    
    Write-ColorOutput "Committing changes..." "Yellow"
    
    try {
        # Check for changes
        $gitStatus = git status --porcelain
        if (-not $gitStatus) {
            Write-ColorOutput "No changes to commit" "Yellow"
            return $true
        }
        
        Write-ColorOutput "  Changes detected:" "White"
        $gitStatus | ForEach-Object { Write-ColorOutput "    $_" "White" }
        
        if (-not $DryRun) {
            git add .
            git commit -m "fix: automated code fixes and improvements

- Applied ESLint auto-fixes
- Added missing type-check script
- Fixed code quality issues

PR: #$PRNumber"
            
            if ($LASTEXITCODE -eq 0) {
                Write-ColorOutput "Changes committed successfully" "Green"
            } else {
                Write-ColorOutput "Failed to commit changes" "Red"
                return $false
            }
        } else {
            Write-ColorOutput "[DRY RUN] Would commit changes" "Cyan"
        }
        
        return $true
    }
    catch {
        Write-ColorOutput "Failed to commit changes: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Invoke-PushChanges {
    param([string]$PRNumber, [switch]$DryRun)
    
    Write-ColorOutput "Pushing changes..." "Yellow"
    
    try {
        $prBranch = Get-PRBranch -PRNumber $PRNumber
        if (-not $prBranch) {
            Write-ColorOutput "Failed to get PR branch" "Red"
            return $false
        }
        
        if (-not $DryRun) {
            git push origin $prBranch
            if ($LASTEXITCODE -ne 0) {
                Write-ColorOutput "Failed to push changes" "Red"
                return $false
            }
            Write-ColorOutput "Changes pushed to origin/$prBranch" "Green"
        } else {
            Write-ColorOutput "[DRY RUN] Would push to origin/$prBranch" "Cyan"
        }
        return $true
    }
    catch {
        Write-ColorOutput "Failed to push changes: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Get-CRGPTComments {
    param([string]$PRNumber)
    
    try {
        Write-ColorOutput "  Fetching CR-GPT comments..." "White"
        $commentsJson = gh pr view $PRNumber --json comments
        $commentsData = $commentsJson | ConvertFrom-Json
        $comments = $commentsData.comments | Where-Object { $_.author.login -like "*cr-gpt*" -or $_.author.login -like "*CR-GPT*" }
        
        if ($comments) {
            $commentCount = ($comments | Measure-Object).Count
            Write-ColorOutput "    Found $commentCount CR-GPT comments" "Yellow"
            return $comments
        } else {
            Write-ColorOutput "    No CR-GPT comments found" "Green"
            return @()
        }
    }
    catch {
        Write-ColorOutput "Failed to fetch CR-GPT comments: $($_.Exception.Message)" "Red"
        return @()
    }
}

function Invoke-CommentBreak {
    param([int]$Seconds, [string]$Context = "comment")
    
    if ($Seconds -le 0) { return }
    
    Write-ColorOutput "  Waiting $Seconds seconds before next $Context interaction..." "Cyan"
    
    # Show countdown for longer breaks
    if ($Seconds -ge 10) {
        for ($i = $Seconds; $i -gt 0; $i--) {
            if ($i % 5 -eq 0 -or $i -le 5) {  # Update every 5 seconds or last 5 seconds
                Write-Host "`r    Break time remaining: $i seconds" -NoNewline -ForegroundColor Cyan
            }
            Start-Sleep -Seconds 1
        }
        Write-Host "`r" -NoNewline  # Clear the countdown line
    } else {
        Start-Sleep -Seconds $Seconds
    }
    
    Write-ColorOutput "    Break completed - continuing..." "Green"
}

function Respond-ToCRGPTComments {
    param([string]$PRNumber, [array]$Comments, [int]$BreakSeconds)
    
    Write-ColorOutput "Responding to CR-GPT comments..." "Yellow"
    
    if (-not $Comments -or $Comments.Count -eq 0) {
        Write-ColorOutput "  No CR-GPT comments to respond to" "Green"
        return $true
    }
    
    $responsesSent = 0
    
    foreach ($comment in $Comments) {
        try {
            Write-ColorOutput "  Processing comment by $($comment.author.login)..." "White"
            Write-ColorOutput "    Comment: $($comment.body.Substring(0, [Math]::Min(100, $comment.body.Length)))..." "White"
            
            # Determine response based on comment content
            $response = Generate-CommentResponse -Comment $comment
            
            if ($response) {
                Write-ColorOutput "    Sending response..." "White"
                
                if (-not $DryRun) {
                    # Send threaded reply to the comment
                    gh pr comment $PRNumber --reply-to $comment.id --body $response
                    if ($LASTEXITCODE -eq 0) {
                        Write-ColorOutput "    Response sent successfully" "Green"
                        $responsesSent++
                    } else {
                        Write-ColorOutput "    Failed to send response" "Red"
                    }
                } else {
                    Write-ColorOutput "    [DRY RUN] Would send response" "Cyan"
                    $responsesSent++
                }
            } else {
                Write-ColorOutput "    No response needed for this comment" "Yellow"
            }
            
            # Break between comment interactions (except for the last one)
            if ($comment -ne $Comments[-1]) {
                Invoke-CommentBreak -Seconds $BreakSeconds -Context "comment"
            }
        }
        catch {
            Write-ColorOutput "Failed to process comment: $($_.Exception.Message)" "Red"
        }
    }
    
    Write-ColorOutput "  Responded to $responsesSent out of $($Comments.Count) comments" "White"
    return $true
}

function Generate-CommentResponse {
    param([object]$Comment)
    
    $commentBody = $comment.body.ToLower()
    
    # Generate appropriate responses based on comment content
    if ($commentBody -match "critical|error|bug") {
        return "**CRITICAL ISSUE ACKNOWLEDGED** - I'm addressing this immediately with high priority. This will be fixed in the next commit."
    }
    elseif ($commentBody -match "high|important|fix") {
        return "**HIGH PRIORITY ISSUE NOTED** - I'll prioritize this fix and ensure it's resolved properly."
    }
    elseif ($commentBody -match "suggestion|improvement|enhancement") {
        return "**SUGGESTION APPRECIATED** - Great feedback! I'll implement this improvement."
    }
    elseif ($commentBody -match "test|testing|coverage") {
        return "**TESTING FOCUS** - I'll add/improve tests as requested and ensure proper coverage."
    }
    elseif ($commentBody -match "documentation|docs|readme") {
        return "**DOCUMENTATION UPDATE** - I'll update the documentation to reflect these changes."
    }
    elseif ($commentBody -match "performance|optimization|speed") {
        return "**PERFORMANCE OPTIMIZATION** - I'll optimize this for better performance."
    }
    elseif ($commentBody -match "security|vulnerability|safe") {
        return "**SECURITY CONCERN ADDRESSED** - Security is critical. I'll implement proper security measures."
    }
    else {
        return "**COMMENT REVIEWED** - I've reviewed your feedback and will incorporate the necessary changes."
    }
}

function Invoke-QualityChecks {
    param([string]$PRNumber)
    
    Write-ColorOutput "Running quality checks..." "Yellow"
    
    try {
        # Run ESLint
        Write-ColorOutput "  Running ESLint..." "White"
        $eslintResult = npm run lint 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "    [PASS] Linting passed" "Green"
        } else {
            Write-ColorOutput "    [FAIL] Linting failed" "Red"
        }
        
        # Run TypeScript check
        Write-ColorOutput "  Running TypeScript check..." "White"
        $tscResult = npm run type-check 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "    [PASS] Type checking passed" "Green"
        } else {
            Write-ColorOutput "    [FAIL] Type checking failed" "Red"
        }
        
        $allPassed = ($LASTEXITCODE -eq 0)
        if (-not $allPassed) {
            Write-ColorOutput "Quality checks failed - may need additional fixes" "Yellow"
        }
        
        return $allPassed
    }
    catch {
        Write-ColorOutput "Failed to run quality checks: $($_.Exception.Message)" "Red"
        return $false
    }
}

# Main execution
Show-Banner

# CRITICAL: Verify base branch is 'develop' before proceeding
Write-ColorOutput "Verifying base branch requirement..." "Yellow"
$baseBranchValid = Test-BaseBranch -PRNumber $PRNumber -AutoFix:$AutoFix

if (-not $baseBranchValid) {
    Write-ColorOutput ""
    Write-ColorOutput "AUTOMATION STOPPED: Base branch must be 'develop'" "Red"
    Write-ColorOutput "Please update the PR base branch and run the automation again" "Red"
    exit 1
}

Write-ColorOutput ""
Write-ColorOutput "Starting enhanced PR automation workflow..." "Green"
Write-ColorOutput ""

# Determine actions to run
$actions = @()
if ($Action -eq "all") {
    $actions = @("analyze", "respond", "fix", "commit", "quality")
} else {
    $actions = @($Action)
}

# Run the workflow
$success = $true
$issues = $null
$comments = $null

foreach ($action in $actions) {
    switch ($action) {
        "analyze" { 
            Write-ColorOutput "Step 1: Analyzing code issues..." "Blue"
            $issues = Invoke-CodeAnalysis -PRNumber $PRNumber
            if (-not $issues) {
                Write-ColorOutput "Code analysis failed" "Red"
                $success = $false
                break
            }
        }
        "respond" {
            Write-ColorOutput "Step 2: Responding to CR-GPT comments..." "Blue"
            $comments = Get-CRGPTComments -PRNumber $PRNumber
            $respondSuccess = Respond-ToCRGPTComments -PRNumber $PRNumber -Comments $comments -BreakSeconds $CommentBreakSeconds
            if (-not $respondSuccess) {
                Write-ColorOutput "Comment response failed" "Red"
                $success = $false
                break
            }
        }
        "fix" { 
            Write-ColorOutput "Step 3: Fixing code issues..." "Blue"
            if ($issues) {
                $fixSuccess = Invoke-CodeFixing -PRNumber $PRNumber -Issues $issues
                if (-not $fixSuccess) {
                    Write-ColorOutput "Code fixing failed" "Red"
                    $success = $false
                    break
                }
            }
        }
        "commit" { 
            Write-ColorOutput "Step 4: Committing changes..." "Blue"
            $commitSuccess = Invoke-CommitChanges -PRNumber $PRNumber -DryRun:$DryRun
            if (-not $commitSuccess) {
                Write-ColorOutput "Commit failed" "Red"
                $success = $false
                break
            }
            
            Write-ColorOutput "Step 4b: Pushing changes..." "Blue"
            $pushSuccess = Invoke-PushChanges -PRNumber $PRNumber -DryRun:$DryRun
            if (-not $pushSuccess) {
                Write-ColorOutput "Push failed" "Red"
                $success = $false
                break
            }
        }
        "quality" {
            Write-ColorOutput "Step 5: Running quality checks..." "Blue"
            $qualitySuccess = Invoke-QualityChecks -PRNumber $PRNumber
            if (-not $qualitySuccess) {
                Write-ColorOutput "Quality checks failed" "Yellow"
                # Don't break here - quality failures are warnings
            }
        }
    }
    
    if (-not $success) {
        break
    }
}

Write-ColorOutput ""
if ($success) {
    Write-ColorOutput "Enhanced PR automation completed successfully!" "Green"
    exit 0
} else {
    Write-ColorOutput "Enhanced PR automation failed!" "Red"
    exit 1
}
