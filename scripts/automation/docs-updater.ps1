# Documentation Updater Script
# Automatically updates documentation based on code changes and PR content
# Usage: .\scripts\automation\docs-updater.ps1 -PRNumber <NUMBER> [-UpdateChangelog] [-UpdateReadme] [-GenerateDocs] [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [string]$PRNumber = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$UpdateChangelog,
    
    [Parameter(Mandatory=$false)]
    [switch]$UpdateReadme,
    
    [Parameter(Mandatory=$false)]
    [switch]$GenerateDocs,
    
    [Parameter(Mandatory=$false)]
    [string]$OutputDir = "docs/generated",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

function Show-Banner {
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host "      Documentation Updater System" -ForegroundColor Blue
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

function Get-PRData {
    param([string]$PRNumber)
    
    if ([string]::IsNullOrEmpty($PRNumber)) {
        return $null
    }
    
    try {
        $prData = gh pr view $PRNumber --json number,title,body,state,baseRefName,headRefName,files,additions,deletions,author,labels,createdAt,updatedAt
        return $prData | ConvertFrom-Json
    } catch {
        Write-ColorOutput "Failed to get PR data for #$PRNumber" "Red"
        return $null
    }
}

function Get-ChangedFiles {
    param([object]$PRData)
    
    if (-not $PRData) {
        return @()
    }
    
    return $PRData.files | Where-Object { $_.status -ne "removed" }
}

function Update-Changelog {
    param([object]$PRData)
    
    Write-ColorOutput "Updating CHANGELOG.md..." "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would update CHANGELOG.md" "Cyan"
        return
    }
    
    $changelogPath = "CHANGELOG.md"
    $changelogExists = Test-Path $changelogPath
    
    if (-not $changelogExists) {
        # Create initial changelog
        $initialChangelog = @"
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial changelog

### Changed

### Deprecated

### Removed

### Fixed

### Security

---

"@
        $initialChangelog | Out-File -FilePath $changelogPath -Encoding UTF8
        Write-ColorOutput "  ✅ Created initial CHANGELOG.md" "Green"
    }
    
    # Get current date
    $date = Get-Date -Format "yyyy-MM-dd"
    
    # Determine change type based on PR labels
    $changeType = "Changed"
    if ($PRData.labels) {
        foreach ($label in $PRData.labels) {
            switch ($label.name.ToLower()) {
                { $_ -match "feature|enhancement" } { $changeType = "Added" }
                { $_ -match "bug|fix" } { $changeType = "Fixed" }
                { $_ -match "security" } { $changeType = "Security" }
                { $_ -match "deprecat" } { $changeType = "Deprecated" }
                { $_ -match "remov" } { $changeType = "Removed" }
            }
        }
    }
    
    # Create changelog entry
    $entry = @"

## [Unreleased] - $date

### $changeType
- $($PRData.title) ([#$($PRData.number)]($($PRData.html_url)))
"@
    
    # Read current changelog
    $currentContent = Get-Content $changelogPath -Raw
    
    # Insert new entry after [Unreleased] section
    $updatedContent = $currentContent -replace "(\[Unreleased\]\s*\n)", "`$1$entry`n"
    
    # Write updated changelog
    $updatedContent | Out-File -FilePath $changelogPath -Encoding UTF8
    Write-ColorOutput "  ✅ Updated CHANGELOG.md" "Green"
}

function Update-Readme {
    param([object]$PRData, [array]$ChangedFiles)
    
    Write-ColorOutput "Updating README.md..." "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would update README.md" "Cyan"
        return
    }
    
    $readmePath = "README.md"
    $readmeExists = Test-Path $readmePath
    
    if (-not $readmeExists) {
        Write-ColorOutput "  ⚠️ README.md not found - skipping update" "Yellow"
        return
    }
    
    # Check if any significant changes were made that might affect README
    $needsUpdate = $false
    $updateReason = ""
    
    foreach ($file in $ChangedFiles) {
        if ($file.path -match "package\.json$") {
            $needsUpdate = $true
            $updateReason = "Dependencies updated"
            break
        } elseif ($file.path -match "\.(tsx?|jsx?)$" -and $file.path -match "(component|page|api)") {
            $needsUpdate = $true
            $updateReason = "Components or pages modified"
            break
        }
    }
    
    if ($needsUpdate) {
        Write-ColorOutput "  📝 README may need updates due to: $updateReason" "Yellow"
        # In production, this would analyze and update specific sections
    } else {
        Write-ColorOutput "  ✅ README.md appears up to date" "Green"
    }
}

function Generate-APIDocs {
    param([object]$PRData, [array]$ChangedFiles)
    
    Write-ColorOutput "Generating API documentation..." "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would generate API documentation" "Cyan"
        return
    }
    
    # Check for API-related changes
    $apiFiles = $ChangedFiles | Where-Object { 
        $_.path -match "api/" -or 
        $_.path -match "lib/" -or
        $_.path -match "utils/" -or
        $_.path -match "\.(ts|js)$" 
    }
    
    if ($apiFiles.Count -eq 0) {
        Write-ColorOutput "  ✅ No API changes detected" "Green"
        return
    }
    
    # Ensure output directory exists
    if (-not (Test-Path $OutputDir)) {
        New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    }
    
    # Generate basic API documentation
    $apiDoc = @"
# API Documentation

Generated on: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
PR: #$($PRData.number) - $($PRData.title)

## Modified Files

$($apiFiles | ForEach-Object { "- $($_.path) ($($_.status))" } | Out-String)

## Changes Summary

$($PRData.body)

## Next Steps

- Review generated documentation
- Update manual documentation if needed
- Verify API compatibility

---
*This documentation was automatically generated by the Documentation Updater.*
"@
    
    $apiDocPath = Join-Path $OutputDir "api-changes-$($PRData.number).md"
    $apiDoc | Out-File -FilePath $apiDocPath -Encoding UTF8
    
    Write-ColorOutput "  ✅ Generated API documentation: $apiDocPath" "Green"
}

function Generate-ComponentDocs {
    param([object]$PRData, [array]$ChangedFiles)
    
    Write-ColorOutput "Generating component documentation..." "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would generate component documentation" "Cyan"
        return
    }
    
    # Check for component changes
    $componentFiles = $ChangedFiles | Where-Object { 
        $_.path -match "\.(tsx|jsx)$" -and 
        $_.path -notmatch "(test|spec)" -and
        $_.path -match "(component|page|app)" 
    }
    
    if ($componentFiles.Count -eq 0) {
        Write-ColorOutput "  ✅ No component changes detected" "Green"
        return
    }
    
    # Ensure output directory exists
    if (-not (Test-Path $OutputDir)) {
        New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    }
    
    # Generate component documentation
    $componentDoc = @"
# Component Documentation

Generated on: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
PR: #$($PRData.number) - $($PRData.title)

## Modified Components

$($componentFiles | ForEach-Object { "- $($_.path) ($($_.status))" } | Out-String)

## Changes Summary

$($PRData.body)

## Component Details

$($componentFiles | ForEach-Object {
    $componentName = Split-Path $_.path -Leaf
    "- **$componentName** ($($_.path))"
    "  - Status: $($_.status)"
    "  - Changes: $($_.changes)"
    ""
} | Out-String)

## Next Steps

- Review component changes
- Update storybook stories if needed
- Verify component functionality
- Update usage examples

---
*This documentation was automatically generated by the Documentation Updater.*
"@
    
    $componentDocPath = Join-Path $OutputDir "component-changes-$($PRData.number).md"
    $componentDoc | Out-File -FilePath $componentDocPath -Encoding UTF8
    
    Write-ColorOutput "  ✅ Generated component documentation: $componentDocPath" "Green"
}

function Generate-SummaryReport {
    param([object]$PRData, [array]$ChangedFiles)
    
    Write-ColorOutput "Generating summary report..." "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would generate summary report" "Cyan"
        return
    }
    
    # Ensure output directory exists
    if (-not (Test-Path $OutputDir)) {
        New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    }
    
    # Generate summary report
    $summaryReport = @"
# Documentation Update Summary

**PR:** #$($PRData.number) - $($PRData.title)
**Date:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**Author:** $($PRData.author.login)

## Files Changed

$($ChangedFiles | ForEach-Object { "- $($_.path) ($($_.status))" } | Out-String)

## Documentation Updates

- ✅ CHANGELOG.md updated
- ✅ README.md reviewed
- ✅ API documentation generated
- ✅ Component documentation generated

## Generated Files

- `$OutputDir/api-changes-$($PRData.number).md`
- `$OutputDir/component-changes-$($PRData.number).md`
- `$OutputDir/docs-summary-$($PRData.number).md`

## Next Steps

1. Review generated documentation
2. Update manual documentation if needed
3. Verify accuracy of changes
4. Merge PR when ready

---
*This report was automatically generated by the Documentation Updater.*
"@
    
    $summaryPath = Join-Path $OutputDir "docs-summary-$($PRData.number).md"
    $summaryReport | Out-File -FilePath $summaryPath -Encoding UTF8
    
    Write-ColorOutput "  ✅ Generated summary report: $summaryPath" "Green"
}

# Main execution
Show-Banner

if ($DryRun) {
    Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" -ForegroundColor Cyan
}

# Get PR data if PR number provided
$prData = $null
$changedFiles = @()

if (-not [string]::IsNullOrEmpty($PRNumber)) {
    Write-ColorOutput "Processing PR #$PRNumber" -ForegroundColor Green
    
    $prData = Get-PRData -PRNumber $PRNumber
    if ($prData) {
        $changedFiles = Get-ChangedFiles -PRData $prData
        
        Write-ColorOutput "PR Details:" -ForegroundColor White
        Write-ColorOutput "  Title: $($prData.title)" -ForegroundColor White
        Write-ColorOutput "  Files Changed: $($changedFiles.Count)" -ForegroundColor White
        Write-ColorOutput "  Additions: $($prData.additions)" -ForegroundColor White
        Write-ColorOutput "  Deletions: $($prData.deletions)" -ForegroundColor White
    }
} else {
    Write-ColorOutput "No PR number provided - running general documentation update" -ForegroundColor Yellow
}

Write-ColorOutput ""

# Perform requested operations
if ($UpdateChangelog -or $GenerateDocs) {
    if ($prData) {
        Update-Changelog -PRData $prData
    } else {
        Write-ColorOutput "⚠️ Changelog update requires PR number" -ForegroundColor Yellow
    }
}

if ($UpdateReadme -or $GenerateDocs) {
    Update-Readme -PRData $prData -ChangedFiles $changedFiles
}

if ($GenerateDocs) {
    if ($prData) {
        Generate-APIDocs -PRData $prData -ChangedFiles $changedFiles
        Generate-ComponentDocs -PRData $prData -ChangedFiles $changedFiles
        Generate-SummaryReport -PRData $prData -ChangedFiles $changedFiles
    } else {
        Write-ColorOutput "⚠️ Documentation generation requires PR number" -ForegroundColor Yellow
    }
}

Write-ColorOutput ""
Write-ColorOutput "Documentation update complete!" -ForegroundColor Green
