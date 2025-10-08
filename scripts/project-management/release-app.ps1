# Release App Script
# Simplified script for releasing individual apps in the monorepo
# Usage: .\scripts\project-management\release-app.ps1 -App "site|dashboard|docs" [-DryRun]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("site", "dashboard", "docs", "root")]
    [string]$App,
    
    [Parameter(Mandatory=$false)]
    [string]$Message = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

function Show-Banner {
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host "      Portfolio OS App Release Manager" -ForegroundColor Blue
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

function Get-AppInfo {
    param([string]$AppName)
    
    $appConfigs = @{
        "site" = @{
            Path = "apps/site"
            Name = "Portfolio Site"
            CurrentVersion = "0.9.0"
            NextVersion = "1.0.0"
            TagSuffix = "-site"
            Emoji = "LAUNCH"
            Description = "Portfolio Site Launch"
        }
        "dashboard" = @{
            Path = "apps/dashboard"
            Name = "Dashboard"
            CurrentVersion = "0.5.0"
            NextVersion = "1.0.0"
            TagSuffix = "-dashboard"
            Emoji = "DASHBOARD"
            Description = "Dashboard Launch"
        }
        "docs" = @{
            Path = "apps/docs"
            Name = "Documentation Site"
            CurrentVersion = "0.1.0"
            NextVersion = "1.0.0"
            TagSuffix = "-docs"
            Emoji = "DOCS"
            Description = "Documentation Site Launch"
        }
        "root" = @{
            Path = "."
            Name = "Complete Platform"
            CurrentVersion = "1.0.0"
            NextVersion = "2.0.0"
            TagSuffix = ""
            Emoji = "PLATFORM"
            Description = "Complete Platform Launch"
        }
    }
    
    return $appConfigs[$AppName]
}

function Get-NextRootVersion {
    # Determine root version based on what's been released
    $tags = git tag -l "v*" 2>$null
    
    if ($tags -match "v2\.") {
        return "2.1.0"  # Platform already launched, increment minor
    } elseif ($tags -match "v1\.") {
        return "1.1.0"  # Site launched, increment minor
    } else {
        return "0.9.0"  # Pre-launch
    }
}

function Get-AppVersion {
    param([string]$AppPath)
    
    if (-not (Test-Path "$AppPath/package.json")) {
        return $null
    }
    
    $packageJson = Get-Content "$AppPath/package.json" -Raw | ConvertFrom-Json
    return $packageJson.version
}

function Update-AppVersion {
    param(
        [string]$AppPath,
        [string]$NewVersion
    )
    
    if (-not (Test-Path "$AppPath/package.json")) {
        Write-ColorOutput "  ⚠️  No package.json found at $AppPath" "Yellow"
        return $false
    }
    
    $packageJson = Get-Content "$AppPath/package.json" -Raw | ConvertFrom-Json
    $oldVersion = $packageJson.version
    $packageJson.version = $NewVersion
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would update $AppPath/package.json: $oldVersion → $NewVersion" "Cyan"
    } else {
        $packageJson | ConvertTo-Json -Depth 100 | Set-Content "$AppPath/package.json"
        Write-ColorOutput "  ✅ Updated $AppPath/package.json: $oldVersion → $NewVersion" "Green"
    }
    
    return $true
}

function Update-AppChangelog {
    param(
        [string]$AppPath,
        [string]$Version,
        [string]$AppName
    )
    
    $changelogPath = "$AppPath/CHANGELOG.md"
    
    if (-not (Test-Path $changelogPath)) {
        Write-ColorOutput "  ⚠️  No CHANGELOG.md found at $AppPath" "Yellow"
        return
    }
    
    $date = Get-Date -Format "yyyy-MM-dd"
    $entry = "`n## [$Version] - $date`n`n### Released`n- $AppName launched to production`n- All features stable and tested`n- Ready for public use`n"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would update $changelogPath with v$Version entry" "Cyan"
    } else {
        $content = Get-Content $changelogPath -Raw
        $content = $content -replace "## \[Unreleased\]", "## [Unreleased]$entry"
        $content | Set-Content $changelogPath
        Write-ColorOutput "  ✅ Updated $changelogPath" "Green"
    }
}

function Show-ReleasePlan {
    param(
        [hashtable]$AppInfo,
        [string]$Tag,
        [string]$RootVersion
    )
    
    Write-ColorOutput ""
    Write-ColorOutput "═══════════════════════════════════════════════" "Cyan"
    Write-ColorOutput "  Release Plan: $($AppInfo.Name)" "Cyan"
    Write-ColorOutput "═══════════════════════════════════════════════" "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "  App: $($AppInfo.Name)" "White"
    Write-ColorOutput "  Path: $($AppInfo.Path)" "White"
    Write-ColorOutput "  Version: $($AppInfo.CurrentVersion) → $($AppInfo.NextVersion)" "White"
    Write-ColorOutput "  Git Tag: $Tag" "White"
    Write-ColorOutput "  Root Version: $RootVersion" "White"
    Write-ColorOutput ""
    Write-ColorOutput "  What will happen:" "Yellow"
    Write-ColorOutput "    1. Update $($AppInfo.Path)/package.json to v$($AppInfo.NextVersion)" "White"
    Write-ColorOutput "    2. Update $($AppInfo.Path)/CHANGELOG.md" "White"
    Write-ColorOutput "    3. Update root package.json to v$RootVersion" "White"
    Write-ColorOutput "    4. Update root CHANGELOG.md" "White"
    Write-ColorOutput "    5. Commit changes" "White"
    Write-ColorOutput "    6. Create git tag: $Tag" "White"
    Write-ColorOutput "    7. Push to GitHub" "White"
    Write-ColorOutput "    8. GitHub Action creates release" "White"
    Write-ColorOutput ""
    Write-ColorOutput "═══════════════════════════════════════════════" "Cyan"
    Write-ColorOutput ""
}

function Update-RootChangelog {
    param(
        [hashtable]$AppInfo,
        [string]$Version
    )
    
    $date = Get-Date -Format "yyyy-MM-dd"
    $entry = "`n## [$Version] - $date - $($AppInfo.Description)`n`n### $($AppInfo.Name)`n- **LAUNCHED** to production`n- Version $($AppInfo.NextVersion) released`n- All features stable and tested`n"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would update root CHANGELOG.md" "Cyan"
    } else {
        $content = Get-Content "CHANGELOG.md" -Raw
        # Find the first ## [ and insert before it
        if ($content -match "(## \[\d+\.\d+\.\d+\])") {
            $content = $content -replace "(## \[\d+\.\d+\.\d+\])", "$entry`$1"
        } else {
            $content += "`n$entry"
        }
        $content | Set-Content "CHANGELOG.md"
        Write-ColorOutput "  ✅ Updated root CHANGELOG.md" "Green"
    }
}

function Create-Release {
    param(
        [hashtable]$AppInfo,
        [string]$Tag,
        [string]$RootVersion
    )
    
    Write-ColorOutput "Creating release..." "Yellow"
    Write-ColorOutput ""
    
    # Update app package.json
    Write-ColorOutput "1. Updating app version..." "Yellow"
    Update-AppVersion -AppPath $AppInfo.Path -NewVersion $AppInfo.NextVersion
    
    # Update app changelog
    Write-ColorOutput ""
    Write-ColorOutput "2. Updating app changelog..." "Yellow"
    Update-AppChangelog -AppPath $AppInfo.Path -Version $AppInfo.NextVersion -AppName $AppInfo.Name
    
    # Update root package.json
    Write-ColorOutput ""
    Write-ColorOutput "3. Updating root version..." "Yellow"
    Update-AppVersion -AppPath "." -NewVersion $RootVersion
    
    # Update root changelog
    Write-ColorOutput ""
    Write-ColorOutput "4. Updating root changelog..." "Yellow"
    Update-RootChangelog -AppInfo $AppInfo -Version $RootVersion
    
    if ($DryRun) {
        Write-ColorOutput ""
        Write-ColorOutput "[DRY RUN] Would commit and push changes" "Cyan"
        Write-ColorOutput "[DRY RUN] Would create tag: $Tag" "Cyan"
        Write-ColorOutput ""
        Write-ColorOutput "✅ Dry run complete! No changes made." "Green"
        return
    }
    
    # Commit changes
    Write-ColorOutput ""
    Write-ColorOutput "5. Committing changes..." "Yellow"
    try {
        git add .
        $commitMsg = "chore: Release $($AppInfo.Name) v$($AppInfo.NextVersion)"
        git commit -m $commitMsg
        Write-ColorOutput "  ✅ Changes committed" "Green"
    } catch {
        Write-ColorOutput "  ⚠️  Commit failed or no changes to commit" "Yellow"
    }
    
    # Create and push tag
    Write-ColorOutput ""
    Write-ColorOutput "6. Creating and pushing tag..." "Yellow"
    try {
        $tagMessage = "$($AppInfo.Description) v$($AppInfo.NextVersion)"
        git tag -a $Tag -m $tagMessage
        Write-ColorOutput "  ✅ Tag created: $Tag" "Green"
        
        git push origin develop
        git push origin $Tag
        Write-ColorOutput "  ✅ Pushed to GitHub" "Green"
    } catch {
        Write-ColorOutput "  ❌ Failed to create/push tag: $_" "Red"
        exit 1
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "🎉 Release completed successfully!" "Green"
    Write-ColorOutput ""
    Write-ColorOutput "Next steps:" "Yellow"
    Write-ColorOutput "  1. GitHub Action is running: https://github.com/jschibelli/portfolio-os/actions" "White"
    Write-ColorOutput "  2. Release will appear at: https://github.com/jschibelli/portfolio-os/releases" "White"
    Write-ColorOutput ""
    Write-ColorOutput "Monitor progress:" "Cyan"
    Write-ColorOutput "  gh run list --workflow=release.yml" "White"
    Write-ColorOutput ""
}

# Main execution
Show-Banner

if ($DryRun) {
    Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***`n" "Cyan"
}

# Get app configuration
$appInfo = Get-AppInfo -AppName $App

if (-not $appInfo) {
    Write-ColorOutput "❌ Unknown app: $App" "Red"
    exit 1
}

Write-ColorOutput "Preparing release for: $($appInfo.Name)" "Green"
Write-ColorOutput ""

# Determine versions and tags
$nextRootVersion = if ($App -eq "root") { "2.0.0" } else { Get-NextRootVersion }
$tag = "v$($appInfo.NextVersion)$($appInfo.TagSuffix)"

# Show release plan
Show-ReleasePlan -AppInfo $appInfo -Tag $tag -RootVersion $nextRootVersion

# Confirm
if (-not $DryRun) {
    $confirm = Read-Host "Proceed with this release? (Y/n)"
    if ($confirm -eq "n" -or $confirm -eq "N") {
        Write-ColorOutput "❌ Release cancelled" "Yellow"
        exit 0
    }
}

# Execute release
Create-Release -AppInfo $appInfo -Tag $tag -RootVersion $nextRootVersion

