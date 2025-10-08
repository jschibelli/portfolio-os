# Create Release Script
# Helps create and publish releases with proper versioning
# Usage: .\scripts\project-management\create-release.ps1 -Version "1.0.0" [-PreRelease "beta.1"] [-DryRun]

param(
    [Parameter(Mandatory=$true)]
    [string]$Version,
    
    [Parameter(Mandatory=$false)]
    [string]$PreRelease = "",
    
    [Parameter(Mandatory=$false)]
    [string]$Message = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

function Show-Banner {
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host "      Portfolio OS Release Manager" -ForegroundColor Blue
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

function Test-VersionFormat {
    param([string]$Version)
    
    # Check if version matches semantic versioning (without 'v' prefix)
    if ($Version -match '^v?\d+\.\d+\.\d+$') {
        return $true
    }
    return $false
}

function Get-FullVersion {
    param(
        [string]$Version,
        [string]$PreRelease
    )
    
    # Remove 'v' prefix if present
    $Version = $Version -replace '^v', ''
    
    if ($PreRelease) {
        return "v$Version-$PreRelease"
    }
    return "v$Version"
}

function Get-ReleaseType {
    param([string]$PreRelease)
    
    if (-not $PreRelease) {
        return "Stable Release"
    } elseif ($PreRelease -match "alpha") {
        return "Alpha Pre-release"
    } elseif ($PreRelease -match "beta") {
        return "Beta Pre-release"
    } elseif ($PreRelease -match "rc") {
        return "Release Candidate"
    } else {
        return "Pre-release"
    }
}

function Test-GitStatus {
    Write-ColorOutput "Checking git status..." "Yellow"
    
    # Check if there are uncommitted changes
    $status = git status --porcelain
    if ($status) {
        Write-ColorOutput "  ⚠️  Warning: You have uncommitted changes" "Yellow"
        Write-ColorOutput ""
        Write-ColorOutput "Uncommitted files:" "White"
        git status --short
        Write-ColorOutput ""
        
        $response = Read-Host "Continue anyway? (y/N)"
        if ($response -ne "y" -and $response -ne "Y") {
            Write-ColorOutput "  ❌ Release cancelled" "Red"
            exit 1
        }
    } else {
        Write-ColorOutput "  ✅ Working directory is clean" "Green"
    }
    
    # Check current branch
    $branch = git branch --show-current
    Write-ColorOutput "  Current branch: $branch" "White"
    
    if ($branch -ne "main" -and $branch -ne "develop") {
        Write-ColorOutput "  ⚠️  Warning: Not on main or develop branch" "Yellow"
        $response = Read-Host "Continue anyway? (y/N)"
        if ($response -ne "y" -and $response -ne "Y") {
            Write-ColorOutput "  ❌ Release cancelled" "Red"
            exit 1
        }
    }
}

function Test-VersionExists {
    param([string]$Tag)
    
    Write-ColorOutput "Checking if version already exists..." "Yellow"
    
    $existingTag = git tag -l $Tag
    if ($existingTag) {
        Write-ColorOutput "  ❌ Tag $Tag already exists!" "Red"
        Write-ColorOutput ""
        Write-ColorOutput "Existing releases:" "White"
        git tag -l | Sort-Object | Select-Object -Last 5
        return $false
    }
    
    Write-ColorOutput "  ✅ Version is available" "Green"
    return $true
}

function Update-PackageVersions {
    param([string]$Version)
    
    Write-ColorOutput "Checking package.json versions..." "Yellow"
    
    # Check root package.json
    $rootPackage = Get-Content "package.json" -Raw | ConvertFrom-Json
    $currentVersion = $rootPackage.version
    
    Write-ColorOutput "  Current root version: $currentVersion" "White"
    Write-ColorOutput "  New version: $Version" "White"
    
    if ($currentVersion -ne $Version) {
        Write-ColorOutput "  ⚠️  package.json version needs updating" "Yellow"
        
        if (-not $DryRun) {
            $update = Read-Host "Update package.json files? (Y/n)"
            if ($update -eq "" -or $update -eq "y" -or $update -eq "Y") {
                # Update root package.json
                $rootPackage.version = $Version
                $rootPackage | ConvertTo-Json -Depth 100 | Set-Content "package.json"
                
                Write-ColorOutput "  ✅ Updated root package.json" "Green"
                
                # Suggest updating app package.json files too
                Write-ColorOutput ""
                Write-ColorOutput "  💡 Consider also updating:" "Cyan"
                Write-ColorOutput "     - apps/site/package.json" "White"
                Write-ColorOutput "     - apps/dashboard/package.json" "White"
            }
        } else {
            Write-ColorOutput "  [DRY RUN] Would update package.json to $Version" "Cyan"
        }
    } else {
        Write-ColorOutput "  ✅ package.json already at correct version" "Green"
    }
}

function Show-ReleaseSummary {
    param(
        [string]$FullVersion,
        [string]$Type,
        [string]$Message
    )
    
    Write-ColorOutput ""
    Write-ColorOutput "═══════════════════════════════════════════════" "Cyan"
    Write-ColorOutput "  Release Summary" "Cyan"
    Write-ColorOutput "═══════════════════════════════════════════════" "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "  Version: $FullVersion" "White"
    Write-ColorOutput "  Type: $Type" "White"
    if ($Message) {
        Write-ColorOutput "  Message: $Message" "White"
    }
    Write-ColorOutput ""
    Write-ColorOutput "  What will happen:" "Yellow"
    Write-ColorOutput "    1. Create git tag: $FullVersion" "White"
    Write-ColorOutput "    2. Push tag to GitHub" "White"
    Write-ColorOutput "    3. GitHub Action will create release automatically" "White"
    Write-ColorOutput "    4. Release notes will be extracted from CHANGELOG.md" "White"
    Write-ColorOutput ""
    Write-ColorOutput "═══════════════════════════════════════════════" "Cyan"
    Write-ColorOutput ""
}

function Create-Release {
    param(
        [string]$FullVersion,
        [string]$Message
    )
    
    if (-not $Message) {
        $Message = "Release $FullVersion"
    }
    
    Write-ColorOutput "Creating release $FullVersion..." "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would run: git tag -a $FullVersion -m `"$Message`"" "Cyan"
        Write-ColorOutput "  [DRY RUN] Would run: git push origin $FullVersion" "Cyan"
        Write-ColorOutput ""
        Write-ColorOutput "✅ Dry run complete! No changes made." "Green"
        return
    }
    
    # Create annotated tag
    Write-ColorOutput "  Creating tag..." "White"
    try {
        git tag -a $FullVersion -m $Message
        Write-ColorOutput "  ✅ Tag created locally" "Green"
    } catch {
        Write-ColorOutput "  ❌ Failed to create tag: $_" "Red"
        exit 1
    }
    
    # Push tag
    Write-ColorOutput "  Pushing tag to GitHub..." "White"
    try {
        git push origin $FullVersion
        Write-ColorOutput "  ✅ Tag pushed successfully!" "Green"
    } catch {
        Write-ColorOutput "  ❌ Failed to push tag: $_" "Red"
        Write-ColorOutput "  Rolling back local tag..." "Yellow"
        git tag -d $FullVersion
        exit 1
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "🎉 Release initiated successfully!" "Green"
    Write-ColorOutput ""
    Write-ColorOutput "Next steps:" "Yellow"
    Write-ColorOutput "  1. GitHub Action is now running" "White"
    Write-ColorOutput "  2. Check: https://github.com/jschibelli/portfolio-os/actions" "White"
    Write-ColorOutput "  3. Release will appear at: https://github.com/jschibelli/portfolio-os/releases" "White"
    Write-ColorOutput ""
    Write-ColorOutput "To monitor progress:" "Cyan"
    Write-ColorOutput "  gh run list --workflow=release.yml" "White"
    Write-ColorOutput ""
}

# Main execution
Show-Banner

if ($DryRun) {
    Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***`n" "Cyan"
}

# Validate version format
if (-not (Test-VersionFormat -Version $Version)) {
    Write-ColorOutput "❌ Invalid version format: $Version" "Red"
    Write-ColorOutput "   Version must be in format: X.Y.Z (e.g., 1.0.0)" "Yellow"
    exit 1
}

# Build full version string
$fullVersion = Get-FullVersion -Version $Version -PreRelease $PreRelease
$releaseType = Get-ReleaseType -PreRelease $PreRelease

Write-ColorOutput "Preparing release: $fullVersion" "Green"
Write-ColorOutput "Type: $releaseType" "White"
Write-ColorOutput ""

# Run pre-flight checks
Test-GitStatus
Write-ColorOutput ""

if (-not (Test-VersionExists -Tag $fullVersion)) {
    exit 1
}
Write-ColorOutput ""

# Update package.json if needed
$cleanVersion = $Version -replace '^v', ''
Update-PackageVersions -Version $cleanVersion
Write-ColorOutput ""

# Show summary and confirm
Show-ReleaseSummary -FullVersion $fullVersion -Type $releaseType -Message $Message

if (-not $DryRun) {
    $confirm = Read-Host "Create this release? (Y/n)"
    if ($confirm -eq "n" -or $confirm -eq "N") {
        Write-ColorOutput "❌ Release cancelled" "Yellow"
        exit 0
    }
}

# Create the release
Create-Release -FullVersion $fullVersion -Message $Message

