# Documentation Migration Script
# Migrates docs from root docs/ to apps/docs/contents/docs/

Write-Host "Starting documentation migration..." -ForegroundColor Green

$migrationMap = @{
    # Features
    "docs\features\booking-system.md" = "apps\docs\contents\docs\features\booking-system\index.mdx"
    "docs\features\chatbot-v1.1.0.md" = "apps\docs\contents\docs\features\chatbot\index.mdx"
    
    # Releases
    "docs\releases\RELEASE_GUIDE.md" = "apps\docs\contents\docs\releases\release-guide\index.mdx"
    "docs\releases\YOUR_RELEASE_WORKFLOW.md" = "apps\docs\contents\docs\releases\workflow\index.mdx"
    "docs\releases\CHANGELOG_TEMPLATE_v1.1.0.md" = "apps\docs\contents\docs\releases\changelog-template\index.mdx"
    
    # Security
    "docs\security\AUTH_SECURITY_FIXES.md" = "apps\docs\contents\docs\security\authentication\index.mdx"
    
    # Setup guides
    "docs\setup\CACHING_SETUP.md" = "apps\docs\contents\docs\setup\caching\index.mdx"
    "docs\setup\CHATBOT_SETUP.md" = "apps\docs\contents\docs\setup\chatbot\index.mdx"
    "docs\setup\DASHBOARD_SITE_INTEGRATION.md" = "apps\docs\contents\docs\setup\dashboard-integration\index.mdx"
    "docs\setup\DEPLOYMENT_CONFIGURATION.md" = "apps\docs\contents\docs\setup\deployment-config\index.mdx"
    "docs\setup\HASHNODE_BLOG_INTEGRATION.md" = "apps\docs\contents\docs\setup\hashnode\index.mdx"
    "docs\setup\HASHNODE_QUICK_START.md" = "apps\docs\contents\docs\setup\hashnode-quickstart\index.mdx"
    "docs\setup\HOW_TO_UPDATE_BLOG_ON_PRODUCTION.md" = "apps\docs\contents\docs\setup\update-blog\index.mdx"
    "docs\setup\MULTI_AGENT_WORKTREE_SETUP.md" = "apps\docs\contents\docs\setup\worktree-setup\index.mdx"
    
    # Troubleshooting
    "docs\troubleshooting\TROUBLESHOOTING_GUIDE.md" = "apps\docs\contents\docs\troubleshooting\general\index.mdx"
    
    # User guides
    "docs\user-guides\USER_GUIDE.md" = "apps\docs\contents\docs\getting-started\user-guide\index.mdx"
    
    # Automation
    "docs\automation\md\AUTOMATION_SYSTEM_MANUAL.md" = "apps\docs\contents\docs\scripts-reference\automation\system-manual\index.mdx"
    "docs\automation\md\COMPLETE_AUTOMATION_SYSTEM.md" = "apps\docs\contents\docs\scripts-reference\automation\complete-system\index.mdx"
    "docs\automation\md\GITHUB_ACTIONS_WORKFLOWS.md" = "apps\docs\contents\docs\scripts-reference\automation\github-actions\index.mdx"
    "docs\automation\md\POWERSHELL_AUTOMATION_SCRIPTS.md" = "apps\docs\contents\docs\scripts-reference\automation\powershell\index.mdx"
    "docs\automation\md\QUICK_START_GUIDE.md" = "apps\docs\contents\docs\scripts-reference\automation\quick-start\index.mdx"
    "docs\automation\md\SYSTEM_ARCHITECTURE.md" = "apps\docs\contents\docs\scripts-reference\automation\architecture\index.mdx"
    "docs\automation\md\integrated-automation-system.md" = "apps\docs\contents\docs\scripts-reference\automation\integrated-system\index.mdx"
    
    # API
    "docs\api\HASHNODE_API_IMPLEMENTATION.md" = "apps\docs\contents\docs\api-reference\hashnode\implementation\index.mdx"
    
    # Developer
    "docs\developer\DEVELOPER_GUIDE.md" = "apps\docs\contents\docs\developer-guide\overview\index.mdx"
}

$migrated = 0
$skipped = 0
$errors = 0

foreach ($source in $migrationMap.Keys) {
    $destination = $migrationMap[$source]
    
    if (Test-Path $source) {
        try {
            # Create destination directory if it doesn't exist
            $destDir = Split-Path $destination -Parent
            if (!(Test-Path $destDir)) {
                New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            }
            
            # Read source file
            $content = Get-Content $source -Raw
            
            # Extract title from first heading
            $titleMatch = $content -match '#\s+(.+)'
            if ($titleMatch) {
                $title = $matches[1]
            } else {
                $title = (Split-Path $source -Leaf) -replace '\.(md|mdx)$',''
            }
            
            # Create MDX frontmatter
            $mdxContent = @"
---
title: $title
description: Documentation migrated from legacy docs folder
---

$content
"@
            
            # Write to destination
            $mdxContent | Out-File -FilePath $destination -Encoding UTF8
            
            Write-Host "✅ Migrated: $source → $destination" -ForegroundColor Green
            $migrated++
        }
        catch {
            Write-Host "❌ Error migrating $source : $_" -ForegroundColor Red
            $errors++
        }
    }
    else {
        Write-Host "⚠️  Skipped (not found): $source" -ForegroundColor Yellow
        $skipped++
    }
}

Write-Host "`n=== Migration Summary ===" -ForegroundColor Cyan
Write-Host "✅ Migrated: $migrated files" -ForegroundColor Green
Write-Host "⚠️  Skipped: $skipped files" -ForegroundColor Yellow
Write-Host "❌ Errors: $errors files" -ForegroundColor Red

Write-Host "`nMigration complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Review migrated files in apps/docs/contents/docs/" -ForegroundColor White
Write-Host "2. Keep root files: README.md, CHANGELOG.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md, license.md" -ForegroundColor White
Write-Host "3. Delete old docs/ subdirectories after verification" -ForegroundColor White
Write-Host "4. Update DOCS_MAP.md to reflect new structure" -ForegroundColor White

