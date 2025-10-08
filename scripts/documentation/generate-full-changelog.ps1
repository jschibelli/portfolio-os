# Generate Full Changelog Script
# Generates a complete changelog from the entire git history
# Usage: .\scripts\documentation\generate-full-changelog.ps1 [-OutputPath <path>] [-IncludePRs] [-GroupBy <commits|date|version>] [-Format <keepachangelog|simple|detailed>]

param(
    [Parameter(Mandatory=$false)]
    [string]$OutputPath = "CHANGELOG.md",
    
    [Parameter(Mandatory=$false)]
    [switch]$IncludePRs,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("commits", "date", "version", "type")]
    [string]$GroupBy = "date",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("keepachangelog", "simple", "detailed")]
    [string]$Format = "keepachangelog",
    
    [Parameter(Mandatory=$false)]
    [string]$SinceDate = "",
    
    [Parameter(Mandatory=$false)]
    [string]$UntilDate = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

function Show-Banner {
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host "      Full Changelog Generator" -ForegroundColor Blue
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

function Get-CommitType {
    param([string]$Message)
    
    # Conventional commits pattern
    if ($Message -match "^(feat|feature)[\(:]") { return "Added" }
    if ($Message -match "^fix[\(:]") { return "Fixed" }
    if ($Message -match "^docs?[\(:]") { return "Documentation" }
    if ($Message -match "^style[\(:]") { return "Style" }
    if ($Message -match "^refactor[\(:]") { return "Changed" }
    if ($Message -match "^perf(ormance)?[\(:]") { return "Performance" }
    if ($Message -match "^test[\(:]") { return "Tests" }
    if ($Message -match "^build[\(:]") { return "Build" }
    if ($Message -match "^ci[\(:]") { return "CI/CD" }
    if ($Message -match "^chore[\(:]") { return "Chore" }
    if ($Message -match "^revert[\(:]") { return "Reverted" }
    if ($Message -match "^security[\(:]") { return "Security" }
    if ($Message -match "^deprecat") { return "Deprecated" }
    if ($Message -match "^remov") { return "Removed" }
    
    # Pattern matching for non-conventional commits
    if ($Message -match "(add|implement|create|new)\s") { return "Added" }
    if ($Message -match "(fix|bug|issue|error|correct)\s") { return "Fixed" }
    if ($Message -match "(update|change|modify|improve|enhance)\s") { return "Changed" }
    if ($Message -match "(remove|delete)\s") { return "Removed" }
    if ($Message -match "(deprecat)\s") { return "Deprecated" }
    if ($Message -match "(security|vulnerability|cve)\s") { return "Security" }
    if ($Message -match "(doc|readme|guide)\s") { return "Documentation" }
    
    return "Changed"
}

function Get-GitHistory {
    Write-ColorOutput "Fetching git history..." "Yellow"
    
    $gitLogArgs = @(
        "log",
        "--pretty=format:%H|%ai|%an|%ae|%s|%b",
        "--date=iso",
        "--no-merges"
    )
    
    if ($SinceDate) {
        $gitLogArgs += "--since=$SinceDate"
    }
    
    if ($UntilDate) {
        $gitLogArgs += "--until=$UntilDate"
    }
    
    try {
        $gitLog = & git @gitLogArgs
        
        if (-not $gitLog) {
            Write-ColorOutput "  ⚠️ No git history found" "Yellow"
            return @()
        }
        
        $commits = @()
        foreach ($line in $gitLog) {
            if ([string]::IsNullOrWhiteSpace($line)) { continue }
            
            $parts = $line -split '\|', 6
            if ($parts.Count -ge 5) {
                $commits += @{
                    Hash = $parts[0]
                    Date = $parts[1]
                    Author = $parts[2]
                    Email = $parts[3]
                    Subject = $parts[4]
                    Body = if ($parts.Count -gt 5) { $parts[5] } else { "" }
                    Type = Get-CommitType -Message $parts[4]
                }
            }
        }
        
        Write-ColorOutput "  ✅ Found $($commits.Count) commits" "Green"
        return $commits
    }
    catch {
        Write-ColorOutput "  ❌ Failed to fetch git history: $_" "Red"
        return @()
    }
}

function Get-PRInformation {
    Write-ColorOutput "Fetching PR information from GitHub..." "Yellow"
    
    try {
        # Check if gh CLI is available
        $ghAvailable = Get-Command gh -ErrorAction SilentlyContinue
        if (-not $ghAvailable) {
            Write-ColorOutput "  ⚠️ GitHub CLI (gh) not available, skipping PR information" "Yellow"
            return @{}
        }
        
        # Get all PRs
        $prs = gh pr list --state all --limit 1000 --json number,title,mergedAt,labels,author,body | ConvertFrom-Json
        
        $prMap = @{}
        foreach ($pr in $prs) {
            # Try to match PR number from commit messages
            $prMap[$pr.number] = $pr
        }
        
        Write-ColorOutput "  ✅ Found $($prMap.Count) PRs" "Green"
        return $prMap
    }
    catch {
        Write-ColorOutput "  ⚠️ Failed to fetch PR information: $_" "Yellow"
        return @{}
    }
}

function Group-CommitsByDate {
    param([array]$Commits)
    
    $grouped = @{}
    foreach ($commit in $Commits) {
        $date = ([DateTime]$commit.Date).ToString("yyyy-MM-dd")
        if (-not $grouped.ContainsKey($date)) {
            $grouped[$date] = @()
        }
        $grouped[$date] += $commit
    }
    
    return $grouped
}

function Group-CommitsByType {
    param([array]$Commits)
    
    $grouped = @{}
    foreach ($commit in $Commits) {
        $type = $commit.Type
        if (-not $grouped.ContainsKey($type)) {
            $grouped[$type] = @()
        }
        $grouped[$type] += $commit
    }
    
    return $grouped
}

function Format-ChangelogKeepAChangelog {
    param(
        [array]$Commits,
        [hashtable]$PRs = @{}
    )
    
    Write-ColorOutput "Formatting changelog (Keep a Changelog format)..." "Yellow"
    
    $changelog = @"
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

"@
    
    # Group commits by date (year-month)
    $commitsByYearMonth = @{}
    foreach ($commit in $Commits) {
        $yearMonth = ([DateTime]$commit.Date).ToString("yyyy-MM")
        if (-not $commitsByYearMonth.ContainsKey($yearMonth)) {
            $commitsByYearMonth[$yearMonth] = @()
        }
        $commitsByYearMonth[$yearMonth] += $commit
    }
    
    # Sort by year-month descending
    $sortedYearMonths = $commitsByYearMonth.Keys | Sort-Object -Descending
    
    foreach ($yearMonth in $sortedYearMonths) {
        $commits = $commitsByYearMonth[$yearMonth]
        $firstCommitDate = ([DateTime]$commits[0].Date).ToString("yyyy-MM-dd")
        
        $changelog += "`n## [$yearMonth] - $firstCommitDate`n`n"
        
        # Group by type
        $byType = Group-CommitsByType -Commits $commits
        
        # Define order of sections
        $typeOrder = @("Added", "Changed", "Fixed", "Removed", "Deprecated", "Security", "Performance", "Documentation", "Tests", "Build", "CI/CD", "Chore", "Style", "Reverted")
        
        foreach ($type in $typeOrder) {
            if ($byType.ContainsKey($type) -and $byType[$type].Count -gt 0) {
                $changelog += "### $type`n`n"
                
                foreach ($commit in $byType[$type]) {
                    $subject = $commit.Subject
                    $hash = $commit.Hash.Substring(0, 7)
                    
                    # Try to extract PR number
                    $prNumber = $null
                    if ($subject -match '\(#(\d+)\)' -or $subject -match '#(\d+)') {
                        $prNumber = $matches[1]
                    }
                    
                    if ($prNumber -and $IncludePRs -and $PRs.ContainsKey([int]$prNumber)) {
                        $pr = $PRs[[int]$prNumber]
                        $changelog += "- $subject - [#$prNumber](https://github.com/jschibelli/portfolio-os/pull/$prNumber) ([$hash](https://github.com/jschibelli/portfolio-os/commit/$($commit.Hash)))`n"
                    } else {
                        $changelog += "- $subject ([$hash](https://github.com/jschibelli/portfolio-os/commit/$($commit.Hash)))`n"
                    }
                }
                
                $changelog += "`n"
            }
        }
    }
    
    $changelog += @"

---

## Format

This changelog follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

### Types of Changes

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

---

*Generated on $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') by generate-full-changelog.ps1*
"@
    
    return $changelog
}

function Format-ChangelogSimple {
    param(
        [array]$Commits,
        [hashtable]$PRs = @{}
    )
    
    Write-ColorOutput "Formatting changelog (Simple format)..." "Yellow"
    
    $changelog = @"
# Changelog

Complete history of changes to this project.

Generated on: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

---

"@
    
    # Group by date
    $byDate = Group-CommitsByDate -Commits $Commits
    $sortedDates = $byDate.Keys | Sort-Object -Descending
    
    foreach ($date in $sortedDates) {
        $changelog += "`n## $date`n`n"
        
        foreach ($commit in $byDate[$date]) {
            $hash = $commit.Hash.Substring(0, 7)
            $subject = $commit.Subject
            $author = $commit.Author
            
            $changelog += "- **[$hash]** $subject - *$author*`n"
        }
    }
    
    $changelog += "`n---`n`n*Generated by generate-full-changelog.ps1*`n"
    
    return $changelog
}

function Format-ChangelogDetailed {
    param(
        [array]$Commits,
        [hashtable]$PRs = @{}
    )
    
    Write-ColorOutput "Formatting changelog (Detailed format)..." "Yellow"
    
    $changelog = @"
# Detailed Changelog

Complete detailed history of all changes to this project.

**Generated:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**Total Commits:** $($Commits.Count)

---

"@
    
    # Group by date
    $byDate = Group-CommitsByDate -Commits $Commits
    $sortedDates = $byDate.Keys | Sort-Object -Descending
    
    foreach ($date in $sortedDates) {
        $changelog += "`n## $date`n`n"
        
        # Group by type within date
        $byType = Group-CommitsByType -Commits $byDate[$date]
        
        foreach ($type in $byType.Keys | Sort-Object) {
            $changelog += "`n### $type`n`n"
            
            foreach ($commit in $byType[$type]) {
                $hash = $commit.Hash.Substring(0, 7)
                $fullHash = $commit.Hash
                $subject = $commit.Subject
                $author = $commit.Author
                $email = $commit.Email
                $body = $commit.Body
                
                $changelog += "#### $subject`n`n"
                $changelog += "- **Commit:** [$hash](https://github.com/jschibelli/portfolio-os/commit/$fullHash)`n"
                $changelog += "- **Author:** $author <$email>`n"
                $changelog += "- **Type:** $type`n"
                
                if ($body -and $body.Trim()) {
                    $newline = [Environment]::NewLine
                    $cleanBody = $body.Trim() -replace $newline, ($newline + "  ")
                    $changelog += ("- **Details:**" + $newline + "  ``````")
                    $changelog += ($newline + "  " + $cleanBody)
                    $changelog += ($newline + "  ``````")
                }
                
                # Try to extract PR number
                if ($subject -match '\(#(\d+)\)' -or $subject -match '#(\d+)') {
                    $prNumber = $matches[1]
                    if ($IncludePRs -and $PRs.ContainsKey([int]$prNumber)) {
                        $pr = $PRs[[int]$prNumber]
                        $changelog += "- **Pull Request:** [#$prNumber](https://github.com/jschibelli/portfolio-os/pull/$prNumber)`n"
                    }
                }
                
                $changelog += "`n"
            }
        }
    }
    
    $changelog += "`n---`n`n*Generated by generate-full-changelog.ps1*`n"
    
    return $changelog
}

function Generate-Statistics {
    param([array]$Commits)
    
    Write-ColorOutput "`nGenerating statistics..." "Yellow"
    
    # Count by type
    $byType = Group-CommitsByType -Commits $Commits
    
    Write-ColorOutput "`nCommit Statistics:" "Cyan"
    Write-ColorOutput "  Total Commits: $($Commits.Count)" "White"
    Write-ColorOutput "`n  By Type:" "Cyan"
    
    foreach ($type in $byType.Keys | Sort-Object) {
        $count = $byType[$type].Count
        $percentage = [math]::Round(($count / $Commits.Count) * 100, 1)
        Write-ColorOutput "    $type : $count ($percentage%)" "White"
    }
    
    # Count by author
    $byAuthor = @{}
    foreach ($commit in $Commits) {
        if (-not $byAuthor.ContainsKey($commit.Author)) {
            $byAuthor[$commit.Author] = 0
        }
        $byAuthor[$commit.Author]++
    }
    
    Write-ColorOutput "`n  Top Contributors:" "Cyan"
    $topAuthors = $byAuthor.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 10
    foreach ($author in $topAuthors) {
        $count = $author.Value
        $percentage = [math]::Round(($count / $Commits.Count) * 100, 1)
        Write-ColorOutput "    $($author.Key): $count commits ($percentage%)" "White"
    }
    
    # Date range
    $firstCommit = ([DateTime]($Commits | Select-Object -Last 1).Date).ToString("yyyy-MM-dd")
    $lastCommit = ([DateTime]($Commits | Select-Object -First 1).Date).ToString("yyyy-MM-dd")
    
    Write-ColorOutput "`n  Date Range:" "Cyan"
    Write-ColorOutput "    First Commit: $firstCommit" "White"
    Write-ColorOutput "    Last Commit: $lastCommit" "White"
}

# Main execution
Show-Banner

if ($DryRun) {
    Write-ColorOutput "*** DRY RUN MODE - No files will be written ***`n" "Cyan"
}

Write-ColorOutput "Configuration:" "Cyan"
Write-ColorOutput "  Output Path: $OutputPath" "White"
Write-ColorOutput "  Include PRs: $IncludePRs" "White"
Write-ColorOutput "  Group By: $GroupBy" "White"
Write-ColorOutput "  Format: $Format" "White"
if ($SinceDate) { Write-ColorOutput "  Since Date: $SinceDate" "White" }
if ($UntilDate) { Write-ColorOutput "  Until Date: $UntilDate" "White" }
Write-ColorOutput ""

# Get git history
$commits = Get-GitHistory

if ($commits.Count -eq 0) {
    Write-ColorOutput "❌ No commits found. Cannot generate changelog." "Red"
    exit 1
}

# Get PR information if requested
$prs = @{}
if ($IncludePRs) {
    $prs = Get-PRInformation
}

# Generate statistics
Generate-Statistics -Commits $commits

# Format changelog based on selected format
Write-ColorOutput ""
$changelogContent = switch ($Format) {
    "keepachangelog" { Format-ChangelogKeepAChangelog -Commits $commits -PRs $prs }
    "simple" { Format-ChangelogSimple -Commits $commits -PRs $prs }
    "detailed" { Format-ChangelogDetailed -Commits $commits -PRs $prs }
    default { Format-ChangelogKeepAChangelog -Commits $commits -PRs $prs }
}

# Write to file
if (-not $DryRun) {
    Write-ColorOutput "Writing changelog to $OutputPath..." "Yellow"
    
    try {
        $changelogContent | Out-File -FilePath $OutputPath -Encoding UTF8 -Force
        Write-ColorOutput "  ✅ Changelog written successfully!" "Green"
        
        $fileSize = (Get-Item $OutputPath).Length
        $fileSizeKB = [math]::Round($fileSize / 1KB, 2)
        Write-ColorOutput "  📄 File size: $fileSizeKB KB" "White"
    }
    catch {
        Write-ColorOutput "  ❌ Failed to write changelog: $_" "Red"
        exit 1
    }
} else {
    Write-ColorOutput "[DRY RUN] Would write changelog to $OutputPath" "Cyan"
    Write-ColorOutput "Preview (first 50 lines):" "Cyan"
    Write-ColorOutput ""
    $changelogContent -split "`n" | Select-Object -First 50 | ForEach-Object { Write-Host $_ }
    Write-ColorOutput "`n... (truncated in dry run mode)" "Cyan"
}

Write-ColorOutput ""
Write-ColorOutput "===============================================" "Green"
Write-ColorOutput "  Changelog generation complete!" "Green"
Write-ColorOutput "===============================================" "Green"
Write-ColorOutput ""
Write-ColorOutput "Next steps:" "Yellow"
Write-ColorOutput "  1. Review the generated changelog: $OutputPath" "White"
Write-ColorOutput "  2. Edit and customize as needed" "White"
Write-ColorOutput "  3. Commit the changelog to your repository" "White"
Write-ColorOutput ""

