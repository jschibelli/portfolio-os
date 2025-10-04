# Multi-Agent Development Setup Script
# Assigns specific issues to different agents for parallel development

param(
    [Parameter(Mandatory=$false)]
    [string]$Agent1Name = "Agent-1",
    
    [Parameter(Mandatory=$false)]
    [string]$Agent2Name = "Agent-2"
)

Write-Host "🚀 Setting up Multi-Agent Development for Launch Issues" -ForegroundColor Green
Write-Host ""

# Agent assignments based on issue complexity and file overlap
$agent1Issues = @(
    @{ Number = 247; Title = "Contact route and Resend integration"; Branch = "issue-247-contact-resend-integration"; Complexity = "High"; Files = @("apps/site/app/api/contact/route.ts", "apps/site/app/contact/page.tsx") }
    @{ Number = 251; Title = "Social: OG/Twitter defaults + images"; Branch = "issue-251-social-og-twitter-images"; Complexity = "Medium"; Files = @("apps/site/app/layout.tsx", "apps/site/app/og/", "apps/site/public/og/") }
    @{ Number = 253; Title = "A11y pass: navigation & focus states"; Branch = "issue-253-a11y-navigation-focus"; Complexity = "Medium"; Files = @("apps/site/components/navigation/", "apps/site/components/theme-toggle.tsx") }
    @{ Number = 254; Title = "Performance: images, fonts, headers"; Branch = "issue-254-performance-images-fonts-headers"; Complexity = "High"; Files = @("apps/site/next.config.mjs", "apps/site/app/globals.css", "apps/site/components/") }
)

$agent2Issues = @(
    @{ Number = 248; Title = "Canonical host redirect (www vs apex)"; Branch = "issue-248-canonical-host-redirect"; Complexity = "Low"; Files = @("apps/site/middleware.ts") }
    @{ Number = 249; Title = "Projects page SSR + crawlability"; Branch = "issue-249-projects-ssr-crawlability"; Complexity = "Medium"; Files = @("apps/site/app/projects/page.tsx", "apps/site/app/projects/[slug]/page.tsx") }
    @{ Number = 250; Title = "SEO: robots.ts + sitemap.ts + per-page metadata"; Branch = "issue-250-seo-robots-sitemap-metadata"; Complexity = "Medium"; Files = @("apps/site/app/robots.ts", "apps/site/app/sitemap.ts", "apps/site/app/layout.tsx") }
    @{ Number = 252; Title = "Content: Remove inflated metrics sitewide"; Branch = "issue-252-remove-inflated-metrics"; Complexity = "Low"; Files = @("apps/site/app/about/page.tsx", "apps/site/app/projects/page.tsx", "apps/site/components/") }
)

function Show-AgentAssignment {
    param(
        [string]$AgentName,
        [array]$Issues,
        [string]$Color
    )
    
    Write-Host "👤 $AgentName Assignment:" -ForegroundColor $Color
    Write-Host "=" * 50 -ForegroundColor $Color
    
    foreach ($issue in $Issues) {
        Write-Host "📋 Issue #$($issue.Number): $($issue.Title)" -ForegroundColor White
        Write-Host "   Branch: $($issue.Branch)" -ForegroundColor Gray
        Write-Host "   Complexity: $($issue.Complexity)" -ForegroundColor Gray
        Write-Host "   Files: $($issue.Files -join ', ')" -ForegroundColor Gray
        Write-Host ""
    }
}

function Create-AgentBranches {
    param(
        [string]$AgentName,
        [array]$Issues
    )
    
    Write-Host "🔧 Creating branches for $AgentName..." -ForegroundColor Cyan
    
    foreach ($issue in $Issues) {
        try {
            # Check if branch exists
            $branchExists = git branch --list $issue.Branch
            if ($branchExists) {
                Write-Host "  ✅ Branch $($issue.Branch) already exists" -ForegroundColor Green
            } else {
                # Create branch from release/launch-2025-10-07
                git checkout release/launch-2025-10-07
                git pull origin release/launch-2025-10-07
                git checkout -b $issue.Branch
                git push origin $issue.Branch
                Write-Host "  ✅ Created and pushed branch $($issue.Branch)" -ForegroundColor Green
            }
        }
        catch {
            Write-Host "  ❌ Failed to create branch $($issue.Branch): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

function Show-CoordinationGuidelines {
    Write-Host ""
    Write-Host "🤝 Multi-Agent Coordination Guidelines" -ForegroundColor Yellow
    Write-Host "=" * 60 -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Workflow:" -ForegroundColor White
    Write-Host "1. Each agent works on their assigned branches" -ForegroundColor Gray
    Write-Host "2. Start from release/launch-2025-10-07 branch" -ForegroundColor Gray
    Write-Host "3. Create small, focused commits" -ForegroundColor Gray
    Write-Host "4. Test integration before merging to release branch" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⚠️  Conflict Prevention:" -ForegroundColor White
    Write-Host "• Agent 1: Frontend/UI components and API routes" -ForegroundColor Gray
    Write-Host "• Agent 2: Infrastructure, SEO, and content files" -ForegroundColor Gray
    Write-Host "• Minimal file overlap between agents" -ForegroundColor Gray
    Write-Host "• Communicate any shared file changes" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔄 Sync Strategy:" -ForegroundColor White
    Write-Host "• Pull from release/launch-2025-10-07 daily" -ForegroundColor Gray
    Write-Host "• Create PRs for each issue branch" -ForegroundColor Gray
    Write-Host "• Merge to release branch after review" -ForegroundColor Gray
    Write-Host ""
}

# Main execution
Write-Host "🎯 Multi-Agent Development Setup" -ForegroundColor Green
Write-Host "Launch Issues: 247-254" -ForegroundColor Gray
Write-Host "Release Branch: release/launch-2025-10-07" -ForegroundColor Gray
Write-Host ""

# Show assignments
Show-AgentAssignment -AgentName $Agent1Name -Issues $agent1Issues -Color "Cyan"
Show-AgentAssignment -AgentName $Agent2Name -Issues $agent2Issues -Color "Magenta"

# Create branches
Write-Host "🔧 Setting up branches..." -ForegroundColor Yellow
Create-AgentBranches -AgentName $Agent1Name -Issues $agent1Issues
Create-AgentBranches -AgentName $Agent2Name -Issues $agent2Issues

# Show coordination guidelines
Show-CoordinationGuidelines

Write-Host "✅ Multi-Agent Development Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Assign agents to their respective issue branches" -ForegroundColor Gray
Write-Host "2. Each agent should start with: git checkout <branch-name>" -ForegroundColor Gray
Write-Host "3. Work on assigned issues in parallel" -ForegroundColor Gray
Write-Host "4. Create PRs when ready for review" -ForegroundColor Gray
