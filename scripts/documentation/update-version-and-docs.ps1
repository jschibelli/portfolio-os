# Simple Version and Documentation Updater
# Updates version numbers and provides documentation templates
# Usage: .\scripts\documentation\update-version-and-docs.ps1 [-Version "1.1.0"] [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [string]$Version = "1.1.0",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

function Show-Banner {
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host "  Version & Documentation Updater" -ForegroundColor Blue
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host ""
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

Show-Banner

if ($DryRun) {
    Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***`n" "Cyan"
}

Write-ColorOutput "Target Version: $Version" "Green"
Write-ColorOutput ""

# Step 1: Update package.json versions
Write-ColorOutput "Step 1: Updating version numbers..." "Yellow"

$packageFiles = @(
    "package.json",
    "apps/site/package.json",
    "apps/dashboard/package.json",
    "apps/docs/package.json"
)

foreach ($pkgFile in $packageFiles) {
    if (Test-Path $pkgFile) {
        $json = Get-Content $pkgFile -Raw | ConvertFrom-Json
        $currentVersion = $json.version
        
        if ($currentVersion -eq $Version) {
            Write-ColorOutput "  ✅ $pkgFile already at v$Version" "Green"
        } else {
            if ($DryRun) {
                Write-ColorOutput "  [DRY RUN] Would update $pkgFile from $currentVersion to $Version" "Cyan"
            } else {
                $json.version = $Version
                $json | ConvertTo-Json -Depth 100 | Set-Content $pkgFile -Encoding UTF8
                Write-ColorOutput "  ✅ Updated $pkgFile from $currentVersion to $Version" "Green"
            }
        }
    } else {
        Write-ColorOutput "  ⚠️  $pkgFile not found" "Yellow"
    }
}

# Step 2: Create documentation templates
Write-ColorOutput "`nStep 2: Creating documentation templates..." "Yellow"

$docsDir = "docs/features"
if (-not (Test-Path $docsDir)) {
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would create $docsDir directory" "Cyan"
    } else {
        New-Item -ItemType Directory -Path $docsDir -Force | Out-Null
        Write-ColorOutput "  ✅ Created $docsDir directory" "Green"
    }
}

# Create changelog template file
$changelogTemplatePath = "docs/CHANGELOG_TEMPLATE_v$Version.md"
if ($DryRun) {
    Write-ColorOutput "  [DRY RUN] Would create $changelogTemplatePath" "Cyan"
} else {
    $template = "## [$Version] - $(Get-Date -Format 'yyyy-MM-dd')`n`n"
    $template += "### Chatbot v1.1.0 - AI Assistant Enhancement`n`n"
    $template += "**New Features:**`n"
    $template += "- Streaming responses with OpenAI integration (PR #333)`n"
    $template += "- Analytics tracking system (PR #336)`n"
    $template += "- Enhanced error handling (PR #337)`n"
    $template += "- Typing indicators and user feedback (PR #340)`n"
    $template += "- Conversation persistence (PR #334)`n"
    $template += "- Expanded context window (PR #332)`n"
    $template += "- Quick reply buttons (PR #335)`n"
    $template += "- Modular component architecture (PR #338)`n"
    $template += "- TypeScript types and documentation (PR #339)`n`n"
    $template += "### Booking & Scheduling System`n`n"
    $template += "**New Features:**`n"
    $template += "- Integrated calendar booking system`n"
    $template += "- Real-time availability checking`n"
    $template += "- Conflict detection and prevention`n"
    $template += "- Automatic email confirmations`n"
    $template += "- Timezone support`n"
    $template += "- Google Meet integration`n`n"
    $template += "---`n"
    
    $template | Out-File -FilePath $changelogTemplatePath -Encoding UTF8
    Write-ColorOutput "  ✅ Created $changelogTemplatePath" "Green"
}

# Step 3: Show next steps
Write-ColorOutput "`n===============================================" "Green"
Write-ColorOutput "  Update Complete!" "Green"
Write-ColorOutput "===============================================" "Green"
Write-ColorOutput ""

if ($DryRun) {
    Write-ColorOutput "This was a DRY RUN. Run without -DryRun to apply changes." "Cyan"
    Write-ColorOutput ""
} else {
    Write-ColorOutput "Version updated to $Version" "Green"
    Write-ColorOutput ""
    
    Write-ColorOutput "Next Steps:" "Yellow"
    Write-ColorOutput ""
    Write-ColorOutput "1. Update CHANGELOG files:" "White"
    $changelogTemplate = "docs/CHANGELOG_TEMPLATE_v" + $Version + ".md"
    Write-ColorOutput "   - Copy content from $changelogTemplate" "Gray"
    Write-ColorOutput "   - Add to apps/site/CHANGELOG.md" "Gray"
    Write-ColorOutput "   - Create/update root CHANGELOG.md if needed" "Gray"
    Write-ColorOutput ""
    Write-ColorOutput "2. Or use the changelog generator:" "White"
    Write-ColorOutput "   .\scripts\documentation\generate-full-changelog.ps1 -IncludePRs" "Gray"
    Write-ColorOutput ""
    Write-ColorOutput "3. Review and commit:" "White"
    Write-ColorOutput "   git add ." "Gray"
    $commitMsg = "chore: Bump version to v" + $Version + " and update docs"
    Write-ColorOutput "   git commit -m '$commitMsg'" "Gray"
    Write-ColorOutput "   git push" "Gray"
    Write-ColorOutput ""
    Write-ColorOutput "4. Optional - Create release:" "White"
    Write-ColorOutput "   .\scripts\project-management\release-app.ps1 -App site" "Gray"
    Write-ColorOutput ""
}

Write-ColorOutput "For more options see documentation guide" "Cyan"
Write-ColorOutput ""

