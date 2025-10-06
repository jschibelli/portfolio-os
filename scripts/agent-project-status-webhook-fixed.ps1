# Agent Project Status Webhook - Triggers GitHub Actions workflow for status updates
# Usage: .\scripts\agent-project-status-webhook.ps1 -IssueNumber 250 -Action "start" -AgentName "jason"

param(
    [Parameter(Mandatory=$true)]
    [int]$IssueNumber,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "complete", "create-pr", "merge-pr")]
    [string]$Action,
    
    [Parameter(Mandatory=$false)]
    [string]$AgentName = "agent-3",
    
    [Parameter(Mandatory=$false)]
    [string]$Repository = "jschibelli/portfolio-os",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

function Show-Banner {
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host "     Agent Project Status Webhook" -ForegroundColor Blue
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host ""
}

function Trigger-GitHubWorkflow {
    param(
        [int]$IssueNumber,
        [string]$Action,
        [string]$AgentName,
        [string]$Repository,
        [switch]$DryRun
    )
    
    try {
        Write-Host "🚀 Triggering GitHub Actions workflow..." -ForegroundColor Yellow
        Write-Host "   Issue: #$IssueNumber" -ForegroundColor White
        Write-Host "   Action: $Action" -ForegroundColor White
        Write-Host "   Agent: $AgentName" -ForegroundColor White
        Write-Host "   Repository: $Repository" -ForegroundColor White
        Write-Host ""
        
        if ($DryRun) {
            Write-Host "🔍 [DRY RUN] Would trigger workflow with:" -ForegroundColor Magenta
            Write-Host "   - Issue Number: $IssueNumber" -ForegroundColor Magenta
            Write-Host "   - Action: $Action" -ForegroundColor Magenta
            Write-Host "   - Agent Name: $AgentName" -ForegroundColor Magenta
            Write-Host "   - Repository: $Repository" -ForegroundColor Magenta
            return $true
        }
        
        # Trigger the GitHub Actions workflow using repository dispatch
        $webhookPayload = @{
            issueNumber = $IssueNumber
            action = $Action
            agentName = $AgentName
            repository = $Repository
            timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        } | ConvertTo-Json -Compress
        
        Write-Host "📤 Sending webhook payload..." -ForegroundColor Cyan
        Write-Host "Payload: $webhookPayload" -ForegroundColor Gray
        
        # Use GitHub CLI to trigger repository dispatch
        $result = gh api repos/$Repository/dispatches -X POST -f event_type="agent-status-update" -f client_payload="$webhookPayload"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Successfully triggered GitHub Actions workflow!" -ForegroundColor Green
            Write-Host "🔗 Check workflow status: gh run list --workflow=agent-project-status-update.yml" -ForegroundColor Cyan
            return $true
        } else {
            Write-Host "❌ Failed to trigger workflow" -ForegroundColor Red
            return $false
        }
        
    } catch {
        Write-Host "❌ Error triggering workflow: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Show-Usage {
    Write-Host "Usage Examples:" -ForegroundColor Yellow
    Write-Host "  .\scripts\agent-project-status-webhook.ps1 -IssueNumber 250 -Action start" -ForegroundColor White
    Write-Host "  .\scripts\agent-project-status-webhook.ps1 -IssueNumber 250 -Action complete -AgentName jason" -ForegroundColor White
    Write-Host "  .\scripts\agent-project-status-webhook.ps1 -IssueNumber 250 -Action create-pr -Repository jschibelli/portfolio-os" -ForegroundColor White
    Write-Host "  .\scripts\agent-project-status-webhook.ps1 -IssueNumber 250 -Action create-pr -DryRun" -ForegroundColor White
    Write-Host ""
    Write-Host "Actions:" -ForegroundColor Yellow
    Write-Host "  start     - Agent starts working (moves to 'In Progress')" -ForegroundColor White
    Write-Host "  complete  - Agent completes work (moves to 'Ready')" -ForegroundColor White
    Write-Host "  create-pr - Agent creates PR (moves to 'Ready')" -ForegroundColor White
    Write-Host "  merge-pr  - PR is merged (moves to 'Done')" -ForegroundColor White
    Write-Host ""
}

# Main execution
Show-Banner

Write-Host "Agent: $AgentName" -ForegroundColor White
Write-Host "Issue: #$IssueNumber" -ForegroundColor White
Write-Host "Action: $Action" -ForegroundColor White
Write-Host "Repository: $Repository" -ForegroundColor White
Write-Host "Dry Run: $DryRun" -ForegroundColor White
Write-Host ""

# Check GitHub CLI authentication
$authStatus = gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ GitHub authentication required. Please run 'gh auth login'" -ForegroundColor Red
    exit 1
}

# Trigger the workflow
$success = Trigger-GitHubWorkflow -IssueNumber $IssueNumber -Action $Action -AgentName $AgentName -Repository $Repository -DryRun:$DryRun

if ($success) {
    Write-Host ""
    Write-Host "✅ Agent webhook triggered successfully!" -ForegroundColor Green
    
    if (-not $DryRun) {
        Write-Host ""
        Write-Host "📊 To check workflow status:" -ForegroundColor Cyan
        Write-Host "   gh run list --workflow=agent-project-status-update.yml" -ForegroundColor White
        Write-Host ""
        Write-Host "📋 To view workflow logs:" -ForegroundColor Cyan
        Write-Host "   gh run view --workflow=agent-project-status-update.yml" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "❌ Agent webhook failed!" -ForegroundColor Red
    Show-Usage
    exit 1
}
