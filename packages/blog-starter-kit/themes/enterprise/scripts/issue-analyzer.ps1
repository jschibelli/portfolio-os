# Issue Requirements Analyzer
# Usage: .\scripts\issue-analyzer.ps1 -IssueNumber <ISSUE_NUMBER> [-GeneratePlan] [-ExportTo <FILE>]

param(
    [Parameter(Mandatory=$true)]
    [string]$IssueNumber,
    
    [Parameter(Mandatory=$false)]
    [switch]$GeneratePlan,
    
    [Parameter(Mandatory=$false)]
    [string]$ExportTo
)

function Analyze-IssueRequirements {
    param([string]$IssueNumber)
    
    Write-Host "=== Analyzing Issue #$IssueNumber Requirements ===" -ForegroundColor Green
    
    try {
        # Get issue details
        $issueData = gh issue view $IssueNumber --json number,title,body,labels,assignees,state,url,createdAt,updatedAt
        $issue = $issueData | ConvertFrom-Json
        
        # Extract requirements from issue body
        $requirements = @{
            Title = $issue.title
            Description = $issue.body
            Labels = $issue.labels.name
            Priority = "Medium"
            Complexity = "Medium"
            EstimatedHours = "Unknown"
            AcceptanceCriteria = @()
            TechnicalRequirements = @()
            FilesToModify = @()
            Dependencies = @()
        }
        
        # Analyze labels for priority and complexity
        foreach ($label in $issue.labels.name) {
            switch ($label.ToLower()) {
                { $_ -match "priority.*high|urgent|critical" } { $requirements.Priority = "High" }
                { $_ -match "priority.*low" } { $requirements.Priority = "Low" }
                { $_ -match "complex|difficult|hard" } { $requirements.Complexity = "High" }
                { $_ -match "simple|easy|quick" } { $requirements.Complexity = "Low" }
                { $_ -match "bug|fix" } { $requirements.EstimatedHours = "2-4" }
                { $_ -match "feature|enhancement" } { $requirements.EstimatedHours = "4-8" }
                { $_ -match "refactor|redesign" } { $requirements.EstimatedHours = "8-16" }
            }
        }
        
        # Extract acceptance criteria (look for bullet points, checkboxes, etc.)
        $bodyLines = $issue.body -split "`n"
        $inCriteriaSection = $false
        
        foreach ($line in $bodyLines) {
            $line = $line.Trim()
            
            # Check for acceptance criteria section
            if ($line -match "acceptance criteria|requirements|criteria") {
                $inCriteriaSection = $true
                continue
            }
            
            # Check for technical requirements section
            if ($line -match "technical|implementation|notes") {
                $inCriteriaSection = $false
                continue
            }
            
            # Extract criteria items
            if ($inCriteriaSection -and ($line -match "^[-*+]\s*|^\d+\.\s*|^- \[.*\]")) {
                $requirements.AcceptanceCriteria += $line
            }
            
            # Extract technical requirements
            if ($line -match "use.*react|implement.*component|add.*api|create.*page") {
                $requirements.TechnicalRequirements += $line
            }
            
            # Extract file mentions
            if ($line -match "file|component|page|script" -and $line -match "\.(tsx?|jsx?|css|md|json)$") {
                $matches = [regex]::Matches($line, '([a-zA-Z0-9/_-]+\.(tsx?|jsx?|css|md|json))')
                foreach ($match in $matches) {
                    $requirements.FilesToModify += $match.Groups[1].Value
                }
            }
        }
        
        # Generate implementation plan if requested
        if ($GeneratePlan) {
            Generate-ImplementationPlan -Requirements $requirements -IssueNumber $IssueNumber
        }
        
        # Export to file if specified
        if ($ExportTo) {
            Export-Analysis -Requirements $requirements -IssueNumber $IssueNumber -OutputFile $ExportTo
        }
        
        # Display analysis results
        Display-Analysis -Requirements $requirements
        
        return $requirements
    }
    catch {
        Write-Error "Failed to analyze issue: $($_.Exception.Message)"
        return $null
    }
}

function Generate-ImplementationPlan {
    param([hashtable]$Requirements, [string]$IssueNumber)
    
    $planFile = "issue-$IssueNumber-implementation-plan.md"
    
    $planContent = @"
# Issue #$IssueNumber Implementation Plan

## Issue Analysis
- **Title**: $($Requirements.Title)
- **Priority**: $($Requirements.Priority)
- **Complexity**: $($Requirements.Complexity)
- **Estimated Hours**: $($Requirements.EstimatedHours)

## Requirements Summary
$($Requirements.Description)

## Acceptance Criteria
$($Requirements.AcceptanceCriteria -join "`n")

## Technical Requirements
$($Requirements.TechnicalRequirements -join "`n")

## Files to Modify
$($Requirements.FilesToModify -join "`n")

## Implementation Steps

### Phase 1: Analysis & Planning
- [ ] Review requirements and acceptance criteria
- [ ] Identify affected components and files
- [ ] Plan implementation approach
- [ ] Set up development environment

### Phase 2: Implementation
- [ ] Create/modify required files
- [ ] Implement core functionality
- [ ] Add proper error handling
- [ ] Ensure accessibility compliance

### Phase 3: Testing & Quality
- [ ] Run linting and type checks
- [ ] Test functionality manually
- [ ] Verify responsive design
- [ ] Check accessibility compliance

### Phase 4: Documentation & Deployment
- [ ] Update relevant documentation
- [ ] Commit changes with descriptive message
- [ ] Push to repository
- [ ] Comment on issue with implementation details

## Technical Notes
- Follow established patterns in codebase
- Use proper React elements with Tailwind CSS (Stone theme)
- Ensure mobile-first responsive design
- Maintain accessibility standards (WCAG guidelines)
- Follow user preferences for narrative storytelling

## Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
"@
    
    $planContent | Out-File -FilePath $planFile -Encoding UTF8
    Write-Host "✅ Implementation plan generated: $planFile" -ForegroundColor Green
}

function Export-Analysis {
    param([hashtable]$Requirements, [string]$IssueNumber, [string]$OutputFile)
    
    $exportData = @{
        IssueNumber = $IssueNumber
        AnalysisDate = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
        Requirements = $Requirements
    }
    
    $jsonData = $exportData | ConvertTo-Json -Depth 3
    $jsonData | Out-File -FilePath $OutputFile -Encoding UTF8
    Write-Host "✅ Analysis exported to: $OutputFile" -ForegroundColor Green
}

function Display-Analysis {
    param([hashtable]$Requirements)
    
    Write-Host "`n=== Issue Analysis Results ===" -ForegroundColor Green
    Write-Host "Priority: $($Requirements.Priority)" -ForegroundColor Cyan
    Write-Host "Complexity: $($Requirements.Complexity)" -ForegroundColor Cyan
    Write-Host "Estimated Hours: $($Requirements.EstimatedHours)" -ForegroundColor Cyan
    
    if ($Requirements.AcceptanceCriteria.Count -gt 0) {
        Write-Host "`nAcceptance Criteria ($($Requirements.AcceptanceCriteria.Count) items):" -ForegroundColor Yellow
        $Requirements.AcceptanceCriteria | ForEach-Object { Write-Host "  • $_" -ForegroundColor White }
    }
    
    if ($Requirements.TechnicalRequirements.Count -gt 0) {
        Write-Host "`nTechnical Requirements ($($Requirements.TechnicalRequirements.Count) items):" -ForegroundColor Yellow
        $Requirements.TechnicalRequirements | ForEach-Object { Write-Host "  • $_" -ForegroundColor White }
    }
    
    if ($Requirements.FilesToModify.Count -gt 0) {
        Write-Host "`nFiles to Modify ($($Requirements.FilesToModify.Count) files):" -ForegroundColor Yellow
        $Requirements.FilesToModify | ForEach-Object { Write-Host "  • $_" -ForegroundColor White }
    }
}

# Main execution
try {
    $requirements = Analyze-IssueRequirements -IssueNumber $IssueNumber
    
    if ($requirements) {
        Write-Host "`n✅ Issue analysis completed successfully" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Failed to analyze issue" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
}
