# Script Analysis and Cleanup Tool
Write-Host "Analyzing Scripts for Cleanup Opportunities" -ForegroundColor Blue
Write-Host "===========================================" -ForegroundColor Blue
Write-Host ""

# Define scripts that can be removed (replaced by unified versions)
$redundantScripts = @(
    # PR Automation - replaced by pr-automation-unified.ps1
    "pr-automation.ps1",
    "pr-monitor.ps1", 
    "cr-gpt-analyzer.ps1",
    "auto-response-generator.ps1",
    "fast-pr-workflow.ps1",
    
    # Issue Configuration - replaced by issue-config-unified.ps1
    "auto-configure-issue.ps1",
    "auto-configure-issue-simple.ps1",
    "configure-project-fields-manual.ps1",
    
    # Duplicate functionality
    "reply-to-review-comment.ps1",
    "reply-to-review-comment.sh",
    
    # Setup scripts that are one-time use
    "setup-pr-workflow.ps1",
    "setup_portfolio_project.ps1",
    "setup_portfolio_project.sh"
)

Write-Host "SCRIPTS THAT CAN BE REMOVED (Redundant):" -ForegroundColor Yellow
$foundRedundant = @()
foreach ($script in $redundantScripts) {
    if (Test-Path $script) {
        Write-Host "  REMOVE: $script" -ForegroundColor White
        $foundRedundant += $script
    }
}
Write-Host ""

Write-Host "SCRIPTS TO KEEP (Still Useful):" -ForegroundColor Green
$keepScripts = @(
    "auto-configure-pr.ps1", "code-quality-checker.ps1", "docs-updater.ps1",
    "issue-analyzer.ps1", "issue-implementation.ps1", "trigger-issue-implementation.ps1",
    "pr-aliases.ps1", "create-remaining-issues.ps1", "rename-branches-with-issue-numbers.ps1",
    "build.sh", "configure_project_20.sh", "project-manager.ps1", "branch-manager.ps1",
    "issue-creator.ps1", "README.md", "pr-automation-unified.ps1", "issue-config-unified.ps1"
)

foreach ($script in $keepScripts) {
    if (Test-Path $script) {
        Write-Host "  KEEP: $script" -ForegroundColor White
    }
}
Write-Host ""

# Calculate savings
$totalScripts = (Get-ChildItem -Path "." -Filter "*.ps1").Count + (Get-ChildItem -Path "." -Filter "*.sh").Count
$redundantCount = $foundRedundant.Count
$reductionPercentage = [math]::Round(($redundantCount / $totalScripts) * 100, 1)

Write-Host "CLEANUP SUMMARY:" -ForegroundColor Cyan
Write-Host "  Total Scripts: $totalScripts" -ForegroundColor White
Write-Host "  Can Remove: $redundantCount" -ForegroundColor White
Write-Host "  Reduction: $reductionPercentage%" -ForegroundColor White
Write-Host ""

Write-Host "READY TO REMOVE $redundantCount REDUNDANT SCRIPTS!" -ForegroundColor Green
Write-Host ""
Write-Host "To remove them all, run:" -ForegroundColor Yellow
Write-Host "  Remove-Item '$($foundRedundant -join "', '")'" -ForegroundColor White
