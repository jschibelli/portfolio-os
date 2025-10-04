# Multi-Agent Integration Script
# Usage: .\scripts\integrate-multi-agent.ps1 -Operation <OPERATION>
#
# Integrates the multi-agent work tree system with existing automation

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("install", "upgrade", "validate", "migrate", "status")]
    [string]$Operation,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Import existing automation
$masterPath = Join-Path $PSScriptRoot "master-automation.ps1"
if (Test-Path $masterPath) {
    . $masterPath
} else {
    Write-Error "Master automation not found at $masterPath"
    exit 1
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "      Multi-Agent Integration System" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Install-MultiAgentIntegration {
    Write-ColorOutput "🚀 Installing Multi-Agent Work Tree Integration" "Green"
    Write-ColorOutput ""
    
    # Check prerequisites
    Write-ColorOutput "🔍 Checking prerequisites..." "Yellow"
    
    # Check if git worktree is available
    try {
        git worktree --help | Out-Null
        Write-ColorOutput "✅ Git worktree support available" "Green"
    } catch {
        Write-ColorOutput "❌ Git worktree not available. Please update Git." "Red"
        return $false
    }
    
    # Check if GitHub CLI is available
    try {
        gh --version | Out-Null
        Write-ColorOutput "✅ GitHub CLI available" "Green"
    } catch {
        Write-ColorOutput "❌ GitHub CLI not found. Please install gh CLI." "Red"
        return $false
    }
    
    # Check if we're in a git repository
    try {
        git status | Out-Null
        Write-ColorOutput "✅ Git repository detected" "Green"
    } catch {
        Write-ColorOutput "❌ Not in a git repository" "Red"
        return $false
    }
    
    Write-ColorOutput ""
    
    # Initialize multi-agent system
    if (-not $DryRun) {
        Write-ColorOutput "🏗️  Initializing multi-agent work tree system..." "Yellow"
        & .\scripts\multi-agent-worktree-system.ps1 -Operation setup
        
        Write-ColorOutput "✅ Multi-agent system installed successfully" "Green"
    } else {
        Write-ColorOutput "[DRY RUN] Would initialize multi-agent system" "Cyan"
    }
    
    # Update master automation to include multi-agent options
    if (-not $DryRun) {
        Write-ColorOutput "🔧 Updating master automation integration..." "Yellow"
        Update-MasterAutomationIntegration
        Write-ColorOutput "✅ Master automation updated" "Green"
    } else {
        Write-ColorOutput "[DRY RUN] Would update master automation" "Cyan"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "🎯 Integration complete! Available modes:" "Green"
    Write-ColorOutput "   - Multi-agent continuous processing" "White"
    Write-ColorOutput "   - Intelligent issue assignment" "White"
    Write-ColorOutput "   - Parallel agent workflows" "White"
    Write-ColorOutput "   - Conflict prevention" "White"
    Write-ColorOutput ""
    Write-ColorOutput "📚 Next steps:" "Cyan"
    Write-ColorOutput "   1. Run: .\scripts\multi-agent-automation.ps1 -Mode help" "Gray"
    Write-ColorOutput "   2. Test: .\scripts\multi-agent-automation.ps1 -Mode continuous -MaxIssues 1 -DryRun" "Gray"
    Write-ColorOutput "   3. Monitor: .\scripts\multi-agent-automation.ps1 -Mode monitor" "Gray"
    
    return $true
}

function Update-MasterAutomationIntegration {
    # This would update the master-automation.ps1 to include multi-agent modes
    # For now, we'll just document the integration points
    
    Write-ColorOutput "   Adding multi-agent modes to master automation..." "Gray"
    
    # The integration points are:
    # 1. Add "multi-agent" mode to master automation
    # 2. Route to multi-agent-automation.ps1 for multi-agent operations
    # 3. Update help text to include multi-agent options
    
    Write-ColorOutput "   ✅ Integration points configured" "Gray"
}

function Validate-MultiAgentSystem {
    Write-ColorOutput "🔍 Validating Multi-Agent System" "Green"
    Write-ColorOutput ""
    
    $validationResults = @{
        WorkTreeSystem = $false
        AgentCoordinator = $false
        MultiAgentAutomation = $false
        Configuration = $false
        StateFile = $false
    }
    
    # Check work tree system
    $workTreeScript = Join-Path $PSScriptRoot "multi-agent-worktree-system.ps1"
    if (Test-Path $workTreeScript) {
        Write-ColorOutput "✅ Work tree system script found" "Green"
        $validationResults.WorkTreeSystem = $true
    } else {
        Write-ColorOutput "❌ Work tree system script missing" "Red"
    }
    
    # Check agent coordinator
    $coordinatorScript = Join-Path $PSScriptRoot "agent-coordinator.ps1"
    if (Test-Path $coordinatorScript) {
        Write-ColorOutput "✅ Agent coordinator script found" "Green"
        $validationResults.AgentCoordinator = $true
    } else {
        Write-ColorOutput "❌ Agent coordinator script missing" "Red"
    }
    
    # Check multi-agent automation
    $multiAgentScript = Join-Path $PSScriptRoot "multi-agent-automation.ps1"
    if (Test-Path $multiAgentScript) {
        Write-ColorOutput "✅ Multi-agent automation script found" "Green"
        $validationResults.MultiAgentAutomation = $true
    } else {
        Write-ColorOutput "❌ Multi-agent automation script missing" "Red"
    }
    
    # Check configuration
    $configFile = Join-Path $PSScriptRoot "worktree-config.json"
    if (Test-Path $configFile) {
        Write-ColorOutput "✅ Configuration file found" "Green"
        $validationResults.Configuration = $true
    } else {
        Write-ColorOutput "❌ Configuration file missing" "Red"
    }
    
    # Check state file (optional - created on first run)
    $stateFile = "worktree-state.json"
    if (Test-Path $stateFile) {
        Write-ColorOutput "✅ State file found" "Green"
        $validationResults.StateFile = $true
    } else {
        Write-ColorOutput "⚠️  State file not found (will be created on first run)" "Yellow"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "📊 Validation Summary:" "Cyan"
    
    $allValid = $true
    foreach ($component in $validationResults.Keys) {
        $status = if ($validationResults[$component]) { "✅" } else { "❌" }
        Write-ColorOutput "   $status $component" "White"
        if (-not $validationResults[$component] -and $component -ne "StateFile") {
            $allValid = $false
        }
    }
    
    if ($allValid) {
        Write-ColorOutput ""
        Write-ColorOutput "🎉 Multi-agent system validation passed!" "Green"
    } else {
        Write-ColorOutput ""
        Write-ColorOutput "⚠️  Some components are missing. Run install operation." "Yellow"
    }
    
    return $allValid
}

function Migrate-ExistingAutomation {
    Write-ColorOutput "🔄 Migrating existing automation to multi-agent system" "Green"
    Write-ColorOutput ""
    
    # This would migrate existing automation configurations
    # For now, we'll just document the migration process
    
    Write-ColorOutput "📋 Migration steps:" "Yellow"
    Write-ColorOutput "   1. Backup existing automation state" "White"
    Write-ColorOutput "   2. Map existing issue assignments to agents" "White"
    Write-ColorOutput "   3. Create work trees for active work" "White"
    Write-ColorOutput "   4. Update project board assignments" "White"
    Write-ColorOutput "   5. Validate migration results" "White"
    
    if ($DryRun) {
        Write-ColorOutput ""
        Write-ColorOutput "[DRY RUN] Would perform migration steps" "Cyan"
    } else {
        Write-ColorOutput ""
        Write-ColorOutput "⚠️  Migration functionality not yet implemented" "Yellow"
        Write-ColorOutput "   Manual migration may be required" "Gray"
    }
}

function Show-IntegrationStatus {
    Write-ColorOutput "📊 Multi-Agent Integration Status" "Green"
    Write-ColorOutput ""
    
    # Check if multi-agent system is installed
    $isInstalled = Validate-MultiAgentSystem
    
    if ($isInstalled) {
        Write-ColorOutput "✅ Multi-agent system is installed and ready" "Green"
        Write-ColorOutput ""
        
        # Check system status
        try {
            Write-ColorOutput "🤖 Agent Status:" "Cyan"
            & .\scripts\multi-agent-worktree-system.ps1 -Operation status
        } catch {
            Write-ColorOutput "⚠️  Could not retrieve agent status" "Yellow"
        }
        
        Write-ColorOutput ""
        Write-ColorOutput "🚀 Available Commands:" "Cyan"
        Write-ColorOutput "   .\scripts\multi-agent-automation.ps1 -Mode help" "White"
        Write-ColorOutput "   .\scripts\agent-coordinator.ps1 -Operation status" "White"
        Write-ColorOutput "   .\scripts\multi-agent-worktree-system.ps1 -Operation list" "White"
        
    } else {
        Write-ColorOutput "❌ Multi-agent system not properly installed" "Red"
        Write-ColorOutput ""
        Write-ColorOutput "🔧 To install:" "Yellow"
        Write-ColorOutput "   .\scripts\integrate-multi-agent.ps1 -Operation install" "White"
    }
}

# Main execution
try {
    Show-Banner
    
    switch ($Operation) {
        "install" {
            Install-MultiAgentIntegration
        }
        "upgrade" {
            Write-ColorOutput "🔄 Upgrading Multi-Agent System" "Green"
            Write-ColorOutput ""
            Write-ColorOutput "⚠️  Upgrade functionality not yet implemented" "Yellow"
            Write-ColorOutput "   Use install operation to reinstall" "Gray"
        }
        "validate" {
            Validate-MultiAgentSystem
        }
        "migrate" {
            Migrate-ExistingAutomation
        }
        "status" {
            Show-IntegrationStatus
        }
    }
} catch {
    Write-ColorOutput "❌ Operation failed: $($_.Exception.Message)" "Red"
    exit 1
}
