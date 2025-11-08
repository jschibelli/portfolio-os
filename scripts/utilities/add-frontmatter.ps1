# Add MDX frontmatter to migrated documentation files

Write-Host "Adding frontmatter to migrated docs..." -ForegroundColor Green

$filesToFix = @(
    @{ Path = "apps\docs\contents\docs\features\booking-system\index.mdx"; Title = "Booking & Scheduling System"; Description = "Complete booking and scheduling system with Google Calendar integration" },
    @{ Path = "apps\docs\contents\docs\features\chatbot\index.mdx"; Title = "AI Chatbot v1.1.0"; Description = "Intelligent AI chatbot with streaming responses and analytics" },
    @{ Path = "apps\docs\contents\docs\releases\release-guide\index.mdx"; Title = "Release Guide"; Description = "Guide for creating and managing releases" },
    @{ Path = "apps\docs\contents\docs\releases\workflow\index.mdx"; Title = "Release Workflow"; Description = "Step-by-step release workflow and process" },
    @{ Path = "apps\docs\contents\docs\setup\caching\index.mdx"; Title = "Caching Setup"; Description = "Configure caching for optimal performance" },
    @{ Path = "apps\docs\contents\docs\setup\chatbot-setup\index.mdx"; Title = "Chatbot Setup"; Description = "Set up and configure the AI chatbot" },
    @{ Path = "apps\docs\contents\docs\setup\dashboard-integration\index.mdx"; Title = "Dashboard Integration"; Description = "Integrate the dashboard with the main site" },
    @{ Path = "apps\docs\contents\docs\setup\deployment-config\index.mdx"; Title = "Deployment Configuration"; Description = "Configure deployment settings" },
    @{ Path = "apps\docs\contents\docs\setup\deployment-runbook\index.mdx"; Title = "Deployment Runbook"; Description = "Production deployment guide" },
    @{ Path = "apps\docs\contents\docs\setup\hashnode\index.mdx"; Title = "Hashnode Blog Integration"; Description = "Integrate Hashnode for blogging" },
    @{ Path = "apps\docs\contents\docs\setup\hashnode-quickstart\index.mdx"; Title = "Hashnode Quick Start"; Description = "Get started with Hashnode integration quickly" },
    @{ Path = "apps\docs\contents\docs\setup\update-blog\index.mdx"; Title = "Update Blog on Production"; Description = "How to update blog content in production" },
    @{ Path = "apps\docs\contents\docs\setup\worktree-multi-agent\index.mdx"; Title = "Multi-Agent Worktree Setup"; Description = "Set up worktrees for multi-agent development" },
    @{ Path = "apps\docs\contents\docs\troubleshooting\general\index.mdx"; Title = "Troubleshooting Guide"; Description = "Common issues and solutions" },
    @{ Path = "apps\docs\contents\docs\getting-started\user-guide\index.mdx"; Title = "User Guide"; Description = "Guide for using Portfolio OS" },
    @{ Path = "apps\docs\contents\docs\developer-guide\overview\index.mdx"; Title = "Developer Guide"; Description = "Complete developer guide for Portfolio OS" },
    @{ Path = "apps\docs\contents\docs\api-reference\hashnode\implementation\index.mdx"; Title = "Hashnode API Implementation"; Description = "Implementation details for Hashnode API" },
    @{ Path = "apps\docs\contents\docs\scripts-reference\automation\automation-system-manual\index.mdx"; Title = "Automation System Manual"; Description = "Complete manual for the automation system" },
    @{ Path = "apps\docs\contents\docs\scripts-reference\automation\complete-automation-system\index.mdx"; Title = "Complete Automation System"; Description = "Overview of the complete automation system" },
    @{ Path = "apps\docs\contents\docs\scripts-reference\automation\github-actions-workflows\index.mdx"; Title = "GitHub Actions Workflows"; Description = "GitHub Actions workflow automation" },
    @{ Path = "apps\docs\contents\docs\scripts-reference\automation\powershell-automation-scripts\index.mdx"; Title = "PowerShell Automation Scripts"; Description = "PowerShell scripts for automation" },
    @{ Path = "apps\docs\contents\docs\scripts-reference\automation\quick-start-guide\index.mdx"; Title = "Automation Quick Start"; Description = "Get started with automation quickly" },
    @{ Path = "apps\docs\contents\docs\scripts-reference\automation\system-architecture\index.mdx"; Title = "Automation System Architecture"; Description = "Architecture of the automation system" },
    @{ Path = "apps\docs\contents\docs\scripts-reference\automation\integrated-automation-system\index.mdx"; Title = "Integrated Automation System"; Description = "Integrated automation system overview" }
)

$fixed = 0

foreach ($file in $filesToFix) {
    if (Test-Path $file.Path) {
        $content = Get-Content $file.Path -Raw
        
        # Check if it already has frontmatter
        if (-not ($content -match "^---\s*\n")) {
            $frontmatter = @"
---
title: $($file.Title)
description: $($file.Description)
---

"@
            $newContent = $frontmatter + $content
            $newContent | Out-File -FilePath $file.Path -Encoding UTF8 -NoNewline
            Write-Host "✅ Added frontmatter to: $($file.Path)" -ForegroundColor Green
            $fixed++
        }
        else {
            Write-Host "⏭️  Skipped (has frontmatter): $($file.Path)" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "⚠️  Not found: $($file.Path)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Fixed $fixed files" -ForegroundColor Green
Write-Host "Restart the docs server to see the changes!" -ForegroundColor Cyan

