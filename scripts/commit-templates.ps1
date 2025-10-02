# Conventional Commit Templates for Multi-Agent System
# Usage: .\scripts\commit-templates.ps1 [-Action <ACTION>] [-Agent <AGENT>] [-Type <TYPE>] [-Scope <SCOPE>]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("create", "validate", "format", "all")]
    [string]$Action = "all",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("agent-frontend", "agent-backend", "agent-docs", "agent-testing", "agent-ai", "agent-default")]
    [string]$Agent = "agent-default",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("feat", "fix", "docs", "style", "refactor", "test", "chore", "perf", "ci", "build")]
    [string]$Type = "feat",
    
    [Parameter(Mandatory=$false)]
    [string]$Scope = "",
    
    [Parameter(Mandatory=$false)]
    [string]$Message = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "      Conventional Commit Templates" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Get-AgentScope {
    param([string]$Agent)
    
    $scopes = @{
        "agent-frontend" = @("ui", "components", "styles", "layout", "responsive", "accessibility")
        "agent-backend" = @("api", "database", "server", "auth", "middleware", "services")
        "agent-docs" = @("docs", "readme", "guides", "content", "tutorials")
        "agent-testing" = @("tests", "coverage", "e2e", "unit", "integration")
        "agent-ai" = @("ai", "automation", "ml", "intelligence", "assistant")
        "agent-default" = @("general", "misc", "utility")
    }
    
    return $scopes[$Agent]
}

function Format-CommitMessage {
    param(
        [string]$Type,
        [string]$Scope,
        [string]$Message,
        [string]$Agent,
        [string]$BreakingChange = "",
        [string]$IssueNumber = ""
    )
    
    $commitMessage = "$Type"
    
    if ($Scope) {
        $commitMessage += "($Scope)"
    }
    
    $commitMessage += ": $Message"
    
    if ($BreakingChange) {
        $commitMessage += "`n`nBREAKING CHANGE: $BreakingChange"
    }
    
    # Add agent trailer
    $commitMessage += "`n`nAgent: $Agent"
    
    if ($IssueNumber) {
        $commitMessage += "`nIssue: #$IssueNumber"
    }
    
    return $commitMessage
}

function Validate-CommitMessage {
    param([string]$CommitMessage)
    
    $isValid = $true
    $errors = @()
    
    # Check for conventional commit format
    if (-not ($CommitMessage -match "^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: .+")) {
        $isValid = $false
        $errors += "Commit message must follow conventional commit format"
    }
    
    # Check for agent trailer
    if (-not ($CommitMessage -match "Agent: agent-\w+")) {
        $isValid = $false
        $errors += "Commit message must include Agent trailer"
    }
    
    # Check message length
    $firstLine = ($CommitMessage -split "`n")[0]
    if ($firstLine.Length -gt 72) {
        $isValid = $false
        $errors += "First line should be 72 characters or less"
    }
    
    return @{
        IsValid = $isValid
        Errors = $errors
    }
}

function Create-CommitTemplate {
    param([string]$Agent)
    
    $template = @"
# Conventional Commit Template for $Agent
# 
# Format: <type>(<scope>): <description>
#
# Types:
#   feat:     A new feature
#   fix:      A bug fix
#   docs:     Documentation only changes
#   style:    Changes that do not affect the meaning of the code
#   refactor: A code change that neither fixes a bug nor adds a feature
#   test:     Adding missing tests or correcting existing tests
#   chore:    Changes to the build process or auxiliary tools
#   perf:     A code change that improves performance
#   ci:       Changes to CI configuration files and scripts
#   build:    Changes that affect the build system or external dependencies
#
# Scope: $(Get-AgentScope -Agent $Agent -join ', ')
#
# Examples:
#   feat(ui): add responsive navigation component
#   fix(api): resolve authentication timeout issue
#   docs(readme): update installation instructions
#
# Breaking Changes:
#   Use BREAKING CHANGE: in the body to indicate breaking changes
#
# Agent: $Agent
# Issue: #<issue-number>
"@
    
    return $template
}

function Auto-LabelPR {
    param([string]$PRNumber, [string]$Agent)
    
    try {
        # Add agent label to PR
        gh pr edit $PRNumber --add-label $Agent
        
        # Add type-based labels
        $prInfo = gh pr view $PRNumber --json title,body
        $prData = $prInfo | ConvertFrom-Json
        
        $title = $prData.title.ToLower()
        
        if ($title -match "feat|feature|add") {
            gh pr edit $PRNumber --add-label "type:feature"
        } elseif ($title -match "fix|bug|issue") {
            gh pr edit $PRNumber --add-label "type:bugfix"
        } elseif ($title -match "docs|documentation") {
            gh pr edit $PRNumber --add-label "type:documentation"
        } elseif ($title -match "test|testing") {
            gh pr edit $PRNumber --add-label "type:testing"
        } elseif ($title -match "refactor|cleanup") {
            gh pr edit $PRNumber --add-label "type:refactor"
        }
        
        Write-ColorOutput "✅ Auto-labeled PR #$PRNumber with agent and type labels" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "❌ Failed to auto-label PR: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Create-GitHooks {
    Write-ColorOutput "Creating Git hooks for commit validation..." "Yellow"
    
    $commitMsgHook = @"
#!/bin/sh
# Conventional Commit Validation Hook

commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: .+'
agent_regex='Agent: agent-\w+'

if ! grep -qE "`$commit_regex" "`$1"; then
    echo "❌ Commit message does not follow conventional commit format"
    echo "Format: <type>(<scope>): <description>"
    echo "Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build"
    exit 1
fi

if ! grep -qE "`$agent_regex" "`$1"; then
    echo "❌ Commit message must include Agent trailer"
    echo "Add: Agent: agent-<name>"
    exit 1
fi

echo "✅ Commit message validation passed"
"@
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would create .git/hooks/commit-msg" "Cyan"
    } else {
        $commitMsgHook | Out-File -FilePath ".git/hooks/commit-msg" -Encoding UTF8
        Write-ColorOutput "  ✅ Created commit-msg hook" "Green"
    }
}

function Main {
    Show-Banner
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    
    switch ($Action) {
        "create" {
            Write-ColorOutput "Creating commit templates..." "Yellow"
            foreach ($agent in @("agent-frontend", "agent-backend", "agent-docs", "agent-testing", "agent-ai")) {
                $template = Create-CommitTemplate -Agent $agent
                $template | Out-File -FilePath "commit-templates/$agent-template.md" -Encoding UTF8
                Write-ColorOutput "  ✅ Created template for $agent" "Green"
            }
        }
        "validate" {
            if ($Message) {
                $validation = Validate-CommitMessage -CommitMessage $Message
                if ($validation.IsValid) {
                    Write-ColorOutput "✅ Commit message is valid" "Green"
                } else {
                    Write-ColorOutput "❌ Commit message validation failed:" "Red"
                    foreach ($error in $validation.Errors) {
                        Write-ColorOutput "  - $error" "Red"
                    }
                }
            } else {
                Write-ColorOutput "Please provide a commit message to validate" "Red"
            }
        }
        "format" {
            if ($Message) {
                $formatted = Format-CommitMessage -Type $Type -Scope $Scope -Message $Message -Agent $Agent
                Write-ColorOutput "Formatted commit message:" "Yellow"
                Write-ColorOutput $formatted "White"
            } else {
                Write-ColorOutput "Please provide a message to format" "Red"
            }
        }
        "all" {
            Create-GitHooks
            Write-ColorOutput "Commit templates and validation ready!" "Green"
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Conventional Commit System Ready!" "Green"
}

# Run the main function
Main
