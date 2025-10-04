# PowerShell script for creating issues with templates
# Usage: .\scripts\issue-creator.ps1 -Template <TEMPLATE> -Count <COUNT> [OPTIONS]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("blog", "dashboard", "docs", "infra", "bug", "feature", "chore")]
    [string]$Template,
    
    [Parameter(Mandatory=$false)]
    [int]$Count = 1,
    
    [Parameter(Mandatory=$false)]
    [string]$Title = "",
    
    [Parameter(Mandatory=$false)]
    [string]$Body = "",
    
    [Parameter(Mandatory=$false)]
    [string[]]$Labels = @(),
    
    [Parameter(Mandatory=$false)]
    [string]$Milestone = "",
    
    [Parameter(Mandatory=$false)]
    [string]$Assignee = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$AddToProject,
    
    [Parameter(Mandatory=$false)]
    [string]$ProjectId = "PVT_kwHOAEnMVc4BCu-c",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Define issue templates
$templates = @{
    "blog" = @{
        Title = "Blog: {title}"
        Body = @"
## Blog Post Requirements

### Content
- [ ] Write engaging blog post
- [ ] Include relevant code examples
- [ ] Add proper formatting and structure
- [ ] Include call-to-action

### SEO
- [ ] Optimize for target keywords
- [ ] Add meta description
- [ ] Include relevant tags
- [ ] Optimize images

### Publishing
- [ ] Review and edit content
- [ ] Schedule publication
- [ ] Share on social media
- [ ] Monitor engagement
"@
        Labels = @("blog", "content", "seo")
        Milestone = "Blog Functionality & Connection Issues"
    }
    
    "dashboard" = @{
        Title = "Dashboard: {title}"
        Body = @"
## Dashboard Feature Requirements

### Functionality
- [ ] Implement core functionality
- [ ] Add proper error handling
- [ ] Include user feedback
- [ ] Add loading states

### UI/UX
- [ ] Design responsive layout
- [ ] Implement accessibility features
- [ ] Add proper styling
- [ ] Test user interactions

### Testing
- [ ] Write unit tests
- [ ] Add integration tests
- [ ] Test edge cases
- [ ] Performance testing
"@
        Labels = @("dashboard", "frontend", "feature")
        Milestone = "Dashboard Enhancement"
    }
    
    "docs" = @{
        Title = "Documentation: {title}"
        Body = @"
## Documentation Requirements

### Content
- [ ] Write comprehensive documentation
- [ ] Include code examples
- [ ] Add diagrams if needed
- [ ] Review for accuracy

### Structure
- [ ] Organize content logically
- [ ] Add table of contents
- [ ] Include cross-references
- [ ] Format consistently

### Review
- [ ] Technical review
- [ ] Proofreading
- [ ] Update related docs
- [ ] Publish and announce
"@
        Labels = @("documentation", "content")
        Milestone = "Documentation Updates"
    }
    
    "infra" = @{
        Title = "Infrastructure: {title}"
        Body = @"
## Infrastructure Requirements

### Setup
- [ ] Configure environment
- [ ] Set up monitoring
- [ ] Implement security measures
- [ ] Document configuration

### Deployment
- [ ] Create deployment pipeline
- [ ] Test deployment process
- [ ] Monitor deployment
- [ ] Rollback plan

### Maintenance
- [ ] Schedule maintenance windows
- [ ] Update dependencies
- [ ] Monitor performance
- [ ] Backup procedures
"@
        Labels = @("infrastructure", "devops")
        Milestone = "Infrastructure Improvements"
    }
    
    "bug" = @{
        Title = "Bug: {title}"
        Body = @"
## Bug Report

### Description
Describe the bug clearly and concisely.

### Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

### Expected Behavior
What you expected to happen.

### Actual Behavior
What actually happened.

### Environment
- OS: [e.g. Windows, macOS, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]

### Additional Context
Add any other context about the problem here.
"@
        Labels = @("bug", "priority: high")
        Milestone = "Bug Fixes"
    }
    
    "feature" = @{
        Title = "Feature: {title}"
        Body = @"
## Feature Request

### Description
Describe the feature you'd like to see implemented.

### Problem Statement
What problem does this feature solve?

### Proposed Solution
Describe your proposed solution.

### Alternatives Considered
Describe any alternative solutions you've considered.

### Additional Context
Add any other context, mockups, or examples about the feature request.
"@
        Labels = @("enhancement", "feature")
        Milestone = "Feature Requests"
    }
    
    "chore" = @{
        Title = "Chore: {title}"
        Body = @"
## Maintenance Task

### Description
Describe the maintenance task to be performed.

### Tasks
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
- [ ] Task 4

### Dependencies
List any dependencies or prerequisites.

### Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3
"@
        Labels = @("chore", "maintenance")
        Milestone = "Maintenance"
    }
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Get-TemplateContent {
    param([string]$TemplateName)
    
    if ($templates.ContainsKey($TemplateName)) {
        return $templates[$TemplateName]
    } else {
        Write-ColorOutput "Error: Unknown template '$TemplateName'" "Red"
        exit 1
    }
}

function Create-Issue {
    param(
        [string]$Title,
        [string]$Body,
        [string[]]$Labels,
        [string]$Milestone,
        [string]$Assignee
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would create issue:" "Cyan"
        Write-ColorOutput "    Title: $Title" "Cyan"
        Write-ColorOutput "    Labels: $($Labels -join ', ')" "Cyan"
        Write-ColorOutput "    Milestone: $Milestone" "Cyan"
        if ($Assignee) { Write-ColorOutput "    Assignee: $Assignee" "Cyan" }
        return @{ Number = "DRY-RUN"; Url = "https://github.com/jschibelli/portfolio-os/issues/DRY-RUN" }
    }
    
    try {
        $issueParams = @(
            "issue", "create",
            "--title", $Title,
            "--body", $Body
        )
        
        if ($Labels.Count -gt 0) {
            $issueParams += "--label"
            $issueParams += ($Labels -join ',')
        }
        
        if ($Milestone) {
            $issueParams += "--milestone"
            $issueParams += $Milestone
        }
        
        if ($Assignee) {
            $issueParams += "--assignee"
            $issueParams += $Assignee
        }
        
        $result = gh $issueParams
        $issueNumber = $result -replace '.*#(\d+).*', '$1'
        $issueUrl = $result -replace '.*(https://github.com/[^\s]+).*', '$1'
        
        return @{
            Number = $issueNumber
            Url = $issueUrl
        }
    } catch {
        Write-ColorOutput "  ✗ Failed to create issue: $($_.Exception.Message)" "Red"
        return $null
    }
}

function Add-IssueToProject {
    param([string]$IssueNumber)
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would add issue #$IssueNumber to project" "Cyan"
        return $true
    }
    
    try {
        gh project item-add 20 --owner jschibelli --url "https://github.com/jschibelli/portfolio-os/issues/$IssueNumber"
        return $true
    } catch {
        Write-ColorOutput "  ✗ Failed to add issue #$IssueNumber to project" "Red"
        return $false
    }
}

# Main execution
Write-ColorOutput "=== Portfolio OS Issue Creator ===" "Blue"
Write-ColorOutput "Template: $Template" "Green"
Write-ColorOutput "Count: $Count" "Green"

if ($DryRun) {
    Write-ColorOutput "*** DRY RUN MODE - No issues will be created ***" "Cyan"
}

$templateContent = Get-TemplateContent $Template
Write-ColorOutput ""

$successCount = 0
$createdIssues = @()

for ($i = 1; $i -le $Count; $i++) {
    Write-ColorOutput "Creating issue $i of $Count..." "Yellow"
    
    # Generate title
    $issueTitle = if ($Title) { $Title } else { $templateContent.Title -replace '\{title\}', "Task $i" }
    if ($Count -gt 1) {
        $issueTitle += " ($i of $Count)"
    }
    
    # Use provided body or template body
    $issueBody = if ($Body) { $Body } else { $templateContent.Body }
    
    # Use provided labels or template labels
    $issueLabels = if ($Labels.Count -gt 0) { $Labels } else { $templateContent.Labels }
    
    # Use provided milestone or template milestone
    $issueMilestone = if ($Milestone) { $Milestone } else { $templateContent.Milestone }
    
    Write-ColorOutput "  Title: $issueTitle" "White"
    Write-ColorOutput "  Labels: $($issueLabels -join ', ')" "White"
    Write-ColorOutput "  Milestone: $issueMilestone" "White"
    
    # Create the issue
    $issue = Create-Issue $issueTitle $issueBody $issueLabels $issueMilestone $Assignee
    
    if ($issue) {
        Write-ColorOutput "  ✓ Created issue #$($issue.Number)" "Green"
        Write-ColorOutput "  URL: $($issue.Url)" "Blue"
        
        # Add to project if requested
        if ($AddToProject) {
            if (Add-IssueToProject $issue.Number) {
                Write-ColorOutput "  ✓ Added to project" "Green"
            }
        }
        
        $createdIssues += $issue
        $successCount++
    } else {
        Write-ColorOutput "  ✗ Failed to create issue" "Red"
    }
    
    Write-ColorOutput ""
}

Write-ColorOutput "=== Summary ===" "Blue"
Write-ColorOutput "Total requested: $Count" "White"
Write-ColorOutput "Successfully created: $successCount" "Green"
Write-ColorOutput "Failed: $($Count - $successCount)" "Red"

if ($successCount -gt 0) {
    Write-ColorOutput "`nCreated issues:" "Green"
    foreach ($issue in $createdIssues) {
        Write-ColorOutput "  #$($issue.Number): $($issue.Url)" "Blue"
    }
}

if ($successCount -eq $Count) {
    Write-ColorOutput "`nAll issues created successfully!" "Green"
    exit 0
} else {
    Write-ColorOutput "`nSome issues failed to create. Please check the output above." "Red"
    exit 1
}
