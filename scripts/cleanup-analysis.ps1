# Script Analysis and Cleanup Tool
# Analyzes all scripts and identifies which can be removed after consolidation

Write-Host "🔍 Analyzing Scripts for Cleanup Opportunities" -ForegroundColor Blue
Write-Host "=============================================" -ForegroundColor Blue
Write-Host ""

# Define the new unified scripts
$unifiedScripts = @(
    "pr-automation-unified.ps1",
    "issue-config-unified.ps1",
    "project-manager.ps1",
    "branch-manager.ps1", 
    "issue-creator.ps1"
)

# Define scripts that can be removed (replaced by unified versions)
$redundantScripts = @{
    # PR Automation - replaced by pr-automation-unified.ps1
    "pr-automation.ps1" = "pr-automation-unified.ps1"
    "pr-monitor.ps1" = "pr-automation-unified.ps1"
    "cr-gpt-analyzer.ps1" = "pr-automation-unified.ps1"
    "auto-response-generator.ps1" = "pr-automation-unified.ps1"
    "fast-pr-workflow.ps1" = "pr-automation-unified.ps1"
    
    # Issue Configuration - replaced by issue-config-unified.ps1
    "auto-configure-issue.ps1" = "issue-config-unified.ps1"
    "auto-configure-issue-simple.ps1" = "issue-config-unified.ps1"
    "configure-project-fields-manual.ps1" = "issue-config-unified.ps1"
    
    # Duplicate functionality
    "reply-to-review-comment.ps1" = "pr-automation-unified.ps1 (respond action)"
    "reply-to-review-comment.sh" = "pr-automation-unified.ps1 (respond action)"
    
    # Setup scripts that are one-time use
    "setup-pr-workflow.ps1" = "One-time setup (can be removed after use)"
    "setup_portfolio_project.ps1" = "One-time setup (can be removed after use)"
    "setup_portfolio_project.sh" = "One-time setup (can be removed after use)"
}

# Define scripts to keep (still useful)
$keepScripts = @(
    "auto-configure-pr.ps1",  # PR-specific configuration
    "code-quality-checker.ps1",  # Standalone quality checks
    "docs-updater.ps1",  # Documentation updates
    "issue-analyzer.ps1",  # Issue analysis
    "issue-implementation.ps1",  # Issue implementation
    "trigger-issue-implementation.ps1",  # Implementation triggers
    "pr-aliases.ps1",  # PR aliases
    "create-remaining-issues.ps1",  # Issue creation
    "rename-branches-with-issue-numbers.ps1",  # Branch management
    "build.sh",  # Build script
    "configure_project_20.sh",  # Project configuration
    "README.md"  # Documentation
)

# Get all scripts in the directory
$allScripts = Get-ChildItem -Path "." -Filter "*.ps1" | ForEach-Object { $_.Name }
$allScripts += Get-ChildItem -Path "." -Filter "*.sh" | ForEach-Object { $_.Name }

Write-Host "📊 Analysis Results:" -ForegroundColor Green
Write-Host ""

# Show unified scripts
Write-Host "🆕 New Unified Scripts (Keep):" -ForegroundColor Green
foreach ($script in $unifiedScripts) {
    if (Test-Path $script) {
        Write-Host "  ✅ $script" -ForegroundColor White
    } else {
        Write-Host "  ❌ $script (not found)" -ForegroundColor Red
    }
}
Write-Host ""

# Show scripts that can be removed
Write-Host "🗑️  Scripts That Can Be Removed (Redundant):" -ForegroundColor Yellow
foreach ($script in $redundantScripts.Keys) {
    if (Test-Path $script) {
        $replacement = $redundantScripts[$script]
        Write-Host "  🗑️  $script → Replaced by: $replacement" -ForegroundColor White
    }
}
Write-Host ""

# Show scripts to keep
Write-Host "✅ Scripts To Keep (Still Useful):" -ForegroundColor Green
foreach ($script in $keepScripts) {
    if (Test-Path $script) {
        Write-Host "  ✅ $script" -ForegroundColor White
    } else {
        Write-Host "  ❌ $script (not found)" -ForegroundColor Red
    }
}
Write-Host ""

# Show scripts not categorized
$categorizedScripts = $unifiedScripts + $redundantScripts.Keys + $keepScripts
$uncategorizedScripts = $allScripts | Where-Object { $_ -notin $categorizedScripts }

if ($uncategorizedScripts) {
    Write-Host "❓ Uncategorized Scripts (Need Review):" -ForegroundColor Magenta
    foreach ($script in $uncategorizedScripts) {
        Write-Host "  ❓ $script" -ForegroundColor White
    }
    Write-Host ""
}

# Calculate space savings
$redundantCount = ($redundantScripts.Keys | Where-Object { Test-Path $_ }).Count
$totalScripts = $allScripts.Count
$reductionPercentage = [math]::Round(($redundantCount / $totalScripts) * 100, 1)

Write-Host "📈 Cleanup Summary:" -ForegroundColor Cyan
Write-Host "  Total Scripts: $totalScripts" -ForegroundColor White
Write-Host "  Can Remove: $redundantCount" -ForegroundColor White
Write-Host "  Reduction: $reductionPercentage%" -ForegroundColor White
Write-Host ""

# Ask for cleanup confirmation
Write-Host "🤔 Would you like to remove the redundant scripts?" -ForegroundColor Yellow
Write-Host "   This will move them to a backup folder for safety." -ForegroundColor Yellow
Write-Host ""
$response = Read-Host "Type 'yes' to proceed with cleanup"

if ($response -eq "yes") {
    Write-Host ""
    Write-Host "🧹 Starting cleanup..." -ForegroundColor Green
    
    # Create backup directory
    $backupDir = "scripts-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    $removedCount = 0
    foreach ($script in $redundantScripts.Keys) {
        if (Test-Path $script) {
            Move-Item $script $backupDir
            Write-Host "  📦 Moved $script to $backupDir" -ForegroundColor White
            $removedCount++
        }
    }
    
    Write-Host ""
    Write-Host "✅ Cleanup Complete!" -ForegroundColor Green
    Write-Host "  Moved $removedCount scripts to $backupDir" -ForegroundColor White
    Write-Host "  Scripts are safely backed up and can be restored if needed" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "🚫 Cleanup cancelled. Scripts remain unchanged." -ForegroundColor Yellow
    Write-Host "   Run this script again when ready to clean up." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Test the new unified scripts" -ForegroundColor White
Write-Host "  2. Update documentation to reference new scripts" -ForegroundColor White
Write-Host "  3. Update any workflows or aliases that reference old scripts" -ForegroundColor White
Write-Host "  4. Consider removing the backup folder after confirming everything works" -ForegroundColor White
