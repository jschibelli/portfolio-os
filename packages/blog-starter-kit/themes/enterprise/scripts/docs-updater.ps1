# PowerShell script to update documentation based on PR changes
# Usage: .\scripts\docs-updater.ps1 -PRNumber <PR_NUMBER> [-UpdateChangelog] [-UpdateReadme] [-GenerateDocs]

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [Parameter(Mandatory=$false)]
    [switch]$UpdateChangelog,
    
    [Parameter(Mandatory=$false)]
    [switch]$UpdateReadme,
    
    [Parameter(Mandatory=$false)]
    [switch]$GenerateDocs
)

function Get-PRInfo {
    param([string]$PRNumber)
    
    $repoOwner = gh repo view --json owner -q .owner.login
    $repoName = gh repo view --json name -q .name
    
    $prInfo = gh api repos/$repoOwner/$repoName/pulls/$PRNumber
    return $prInfo
}

function Get-PRFiles {
    param([string]$PRNumber)
    
    $repoOwner = gh repo view --json owner -q .owner.login
    $repoName = gh repo view --json name -q .name
    
    $files = gh api repos/$repoOwner/$repoName/pulls/$PRNumber/files
    return $files
}

function Update-Changelog {
    param([object]$PRInfo, [array]$Files)
    
    Write-Host "Updating changelog..." -ForegroundColor Green
    
    $changelogPath = "CHANGELOG.md"
    $prTitle = $PRInfo.title
    $prNumber = $PRInfo.number
    $prUrl = $PRInfo.html_url
    $prAuthor = $PRInfo.user.login
    $prDate = (Get-Date).ToString("yyyy-MM-dd")
    
    # Analyze changes
    $newFeatures = @()
    $bugFixes = @()
    $improvements = @()
    $breakingChanges = @()
    
    foreach ($file in $Files) {
        if ($file.filename -match "\.(ts|tsx|js|jsx)$") {
            if ($file.filename -match "feature|component|page") {
                $newFeatures += $file.filename
            }
            if ($file.filename -match "fix|bug|error") {
                $bugFixes += $file.filename
            }
            if ($file.filename -match "improve|optimize|refactor") {
                $improvements += $file.filename
            }
        }
    }
    
    # Create changelog entry
    $changelogEntry = @"

## [$prDate] - PR #$prNumber

### Added
"@
    
    if ($newFeatures.Count -gt 0) {
        foreach ($feature in $newFeatures) {
            $changelogEntry += "`n- Added $feature"
        }
    } else {
        $changelogEntry += "`n- $prTitle"
    }
    
    if ($bugFixes.Count -gt 0) {
        $changelogEntry += "`n`n### Fixed"
        foreach ($fix in $bugFixes) {
            $changelogEntry += "`n- Fixed $fix"
        }
    }
    
    if ($improvements.Count -gt 0) {
        $changelogEntry += "`n`n### Improved"
        foreach ($improvement in $improvements) {
            $changelogEntry += "`n- Improved $improvement"
        }
    }
    
    $changelogEntry += "`n`n**Contributor**: @$prAuthor`n**PR**: [#$prNumber]($prUrl)"
    
    # Add to changelog
    if (Test-Path $changelogPath) {
        $existingContent = Get-Content $changelogPath -Raw
        $newContent = $changelogEntry + "`n" + $existingContent
        $newContent | Out-File -FilePath $changelogPath -Encoding UTF8
    } else {
        $changelogEntry | Out-File -FilePath $changelogPath -Encoding UTF8
    }
    
    Write-Host "Changelog updated: $changelogPath" -ForegroundColor Green
}

function Update-Readme {
    param([object]$PRInfo, [array]$Files)
    
    Write-Host "Updating README..." -ForegroundColor Green
    
    $readmePath = "README.md"
    
    if (-not (Test-Path $readmePath)) {
        Write-Host "README.md not found" -ForegroundColor Yellow
        return
    }
    
    $readmeContent = Get-Content $readmePath -Raw
    
    # Check if PR affects documentation sections
    $needsUpdate = $false
    
    foreach ($file in $Files) {
        if ($file.filename -match "README|readme|docs|documentation") {
            $needsUpdate = $true
            break
        }
    }
    
    if ($needsUpdate) {
        # Add update note to README
        $updateNote = @"

## Recent Updates

- **PR #$($PRInfo.number)**: $($PRInfo.title) - $(Get-Date -Format "yyyy-MM-dd")
"@
        
        $readmeContent += $updateNote
        $readmeContent | Out-File -FilePath $readmePath -Encoding UTF8
        Write-Host "README updated: $readmePath" -ForegroundColor Green
    }
}

function Generate-Documentation {
    param([object]$PRInfo, [array]$Files)
    
    Write-Host "Generating documentation..." -ForegroundColor Green
    
    $docsPath = "docs"
    
    if (-not (Test-Path $docsPath)) {
        New-Item -ItemType Directory -Path $docsPath -Force
    }
    
    # Generate PR documentation
    $prDocPath = "$docsPath/pr-$($PRInfo.number).md"
    
    $prDoc = @"
# PR #$($PRInfo.number): $($PRInfo.title)

**Author**: @$($PRInfo.user.login)  
**Date**: $(Get-Date -Format "yyyy-MM-dd")  
**Status**: $($PRInfo.state)  
**URL**: $($PRInfo.html_url)

## Description

$($PRInfo.body)

## Changes

"@
    
    foreach ($file in $Files) {
        $prDoc += "`n- **$($file.filename)**: $($file.status)"
        if ($file.patch) {
            $prDoc += "`n  ```diff`n  $($file.patch)`n  ```"
        }
    }
    
    $prDoc += @"

## Testing

- [ ] Manual testing completed
- [ ] Automated tests passing
- [ ] Code review completed

## Notes

- Add any additional notes or considerations here
"@
    
    $prDoc | Out-File -FilePath $prDocPath -Encoding UTF8
    Write-Host "PR documentation generated: $prDocPath" -ForegroundColor Green
}

function Update-API-Documentation {
    param([array]$Files)
    
    Write-Host "Updating API documentation..." -ForegroundColor Green
    
    $apiDocsPath = "docs/api"
    
    if (-not (Test-Path $apiDocsPath)) {
        New-Item -ItemType Directory -Path $apiDocsPath -Force
    }
    
    foreach ($file in $Files) {
        if ($file.filename -match "\.(ts|tsx)$") {
            # Extract API information from TypeScript files
            $fileContent = Get-Content $file.filename -Raw
            
            if ($fileContent -match "export\s+(interface|type|class|function)") {
                $apiDocPath = "$apiDocsPath/$($file.filename -replace '\.(ts|tsx)$', '.md')"
                
                $apiDoc = @"
# API Documentation: $($file.filename)

## Exports

"@
                
                # Extract exports
                $exports = [regex]::Matches($fileContent, "export\s+(interface|type|class|function)\s+(\w+)")
                foreach ($match in $exports) {
                    $apiDoc += "`n- **$($match.Groups[1].Value)**: $($match.Groups[2].Value)"
                }
                
                $apiDoc | Out-File -FilePath $apiDocPath -Encoding UTF8
                Write-Host "API documentation updated: $apiDocPath" -ForegroundColor Green
            }
        }
    }
}

# Main execution
try {
    Write-Host "Updating documentation for PR #$PRNumber..." -ForegroundColor Green
    
    $prInfo = Get-PRInfo -PRNumber $PRNumber
    $files = Get-PRFiles -PRNumber $PRNumber
    
    Write-Host "PR Title: $($prInfo.title)" -ForegroundColor Cyan
    Write-Host "Changed Files: $($files.Count)" -ForegroundColor Cyan
    
    if ($UpdateChangelog) {
        Update-Changelog -PRInfo $prInfo -Files $files
    }
    
    if ($UpdateReadme) {
        Update-Readme -PRInfo $prInfo -Files $files
    }
    
    if ($GenerateDocs) {
        Generate-Documentation -PRInfo $prInfo -Files $files
        Update-API-Documentation -Files $files
    }
    
    Write-Host "`n=== Documentation Update Summary ===" -ForegroundColor Green
    Write-Host "Changelog Updated: $($UpdateChangelog)" -ForegroundColor $(if ($UpdateChangelog) { "Green" } else { "Gray" })
    Write-Host "README Updated: $($UpdateReadme)" -ForegroundColor $(if ($UpdateReadme) { "Green" } else { "Gray" })
    Write-Host "Docs Generated: $($GenerateDocs)" -ForegroundColor $(if ($GenerateDocs) { "Green" } else { "Gray" })
    
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
}
