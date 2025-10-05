# GitHub Utilities - Shared functions for all automation scripts
# This module provides common GitHub API functions to eliminate duplication
# Enhanced with comprehensive error handling, testing, and documentation

# Configuration and constants
$script:repoInfo = $null
$script:maxRetries = 3
$script:retryDelay = 1000  # milliseconds

# Get repository information (cached)
function Get-RepoInfo {
    [CmdletBinding()]
    param()
    
    if (-not $script:repoInfo) {
        try {
            $script:repoInfo = @{
                Owner = gh repo view --json owner -q .owner.login
                Name = gh repo view --json name -q .name
            }
            
            # Validate the repository info
            if (-not $script:repoInfo.Owner -or -not $script:repoInfo.Name) {
                throw "Failed to retrieve repository information"
            }
        }
        catch {
            Write-Error "Failed to get repository information: $($_.Exception.Message)"
            return $null
        }
    }
    return $script:repoInfo
}

# Get CR-GPT bot comments from a PR with retry logic and error handling
function Get-CRGPTComments {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$PRNumber
    )
    
    $repo = Get-RepoInfo
    if (-not $repo) {
        Write-Error "Failed to get repository information"
        return $null
    }
    
    for ($attempt = 1; $attempt -le $script:maxRetries; $attempt++) {
        try {
            Write-Verbose "Attempting to get CR-GPT comments for PR #$PRNumber (attempt $attempt)"
            
            $allCommentsJson = gh api repos/$($repo.Owner)/$($repo.Name)/pulls/$PRNumber/comments
            if (-not $allCommentsJson) {
                throw "No response from GitHub API"
            }
            
            $allComments = $allCommentsJson | ConvertFrom-Json
            if (-not $allComments) {
                Write-Warning "No comments found for PR #$PRNumber"
                return @()
            }
            
            $crgptComments = $allComments | Where-Object { $_.user.login -eq "cr-gpt[bot]" }
            Write-Verbose "Found $($crgptComments.Count) CR-GPT comments"
            return $crgptComments
        }
        catch {
            Write-Warning "Attempt $attempt failed: $($_.Exception.Message)"
            if ($attempt -lt $script:maxRetries) {
                Write-Verbose "Retrying in $($script:retryDelay)ms..."
                Start-Sleep -Milliseconds $script:retryDelay
                $script:retryDelay *= 2  # Exponential backoff
            }
            else {
                Write-Error "Failed to get CR-GPT comments after $script:maxRetries attempts: $($_.Exception.Message)"
                return $null
            }
        }
    }
}

# Get all PR comments with error handling
function Get-PRComments {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$PRNumber
    )
    
    $repo = Get-RepoInfo
    if (-not $repo) {
        Write-Error "Failed to get repository information"
        return $null
    }
    
    try {
        Write-Verbose "Getting all comments for PR #$PRNumber"
        $allCommentsJson = gh api repos/$($repo.Owner)/$($repo.Name)/pulls/$PRNumber/comments
        
        if (-not $allCommentsJson) {
            Write-Warning "No response from GitHub API for PR #$PRNumber"
            return @()
        }
        
        $comments = $allCommentsJson | ConvertFrom-Json
        Write-Verbose "Retrieved $($comments.Count) comments"
        return $comments
    }
    catch {
        Write-Error "Failed to get PR comments: $($_.Exception.Message)"
        return $null
    }
}

# Get PR information with error handling
function Get-PRInfo {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$PRNumber
    )
    
    $repo = Get-RepoInfo
    if (-not $repo) {
        Write-Error "Failed to get repository information"
        return $null
    }
    
    try {
        Write-Verbose "Getting PR information for PR #$PRNumber"
        $prInfoJson = gh api repos/$($repo.Owner)/$($repo.Name)/pulls/$PRNumber
        
        if (-not $prInfoJson) {
            Write-Warning "No response from GitHub API for PR #$PRNumber"
            return $null
        }
        
        $prInfo = $prInfoJson | ConvertFrom-Json
        Write-Verbose "Retrieved PR info: $($prInfo.title)"
        return $prInfo
    }
    catch {
        Write-Error "Failed to get PR information: $($_.Exception.Message)"
        return $null
    }
}

# Get project item ID for an issue
function Get-ProjectItemId {
    param([int]$IssueNumber)
    
    try {
        $issueId = gh issue view $IssueNumber --json id -q .id
        $graphqlResponse = gh api graphql -f query='query($issueId: ID!) { node(id: $issueId) { ... on Issue { projectItems(first: 10) { nodes { id project { id title } } } } } }' -f issueId="$issueId"
        $jsonData = $graphqlResponse | ConvertFrom-Json
        
        if ($jsonData.data.node.projectItems.nodes) {
            foreach ($node in $jsonData.data.node.projectItems.nodes) {
                if ($node.project.id -eq "PVT_kwHOAEnMVc4BCu-c") {
                    return $node.id
                }
            }
        }
        return $null
    }
    catch {
        Write-Warning "Failed to get project item ID for issue #$IssueNumber"
        return $null
    }
}

# Get project field value
function Get-ProjectFieldValue {
    param([string]$ProjectItemId, [string]$FieldId)
    
    try {
        $graphqlResponse = gh api graphql -f query='query($itemId: ID!) { node(id: $itemId) { ... on ProjectV2Item { fieldValues(first: 20) { nodes { ... on ProjectV2ItemFieldSingleSelectValue { field { ... on ProjectV2Field { id name } } name } ... on ProjectV2ItemFieldTextValue { field { ... on ProjectV2Field { id name } } text } } } } } }' -f itemId="$ProjectItemId"
        $jsonData = $graphqlResponse | ConvertFrom-Json
        
        if ($jsonData.data.node.fieldValues.nodes) {
            foreach ($fieldValue in $jsonData.data.node.fieldValues.nodes) {
                if ($fieldValue.field.id -eq $FieldId) {
                    if ($fieldValue.name) {
                        return $fieldValue.name
                    } else {
                        return $fieldValue.text
                    }
                }
            }
        }
        return $null
    }
    catch {
        Write-Warning "Failed to get project field value for item $ProjectItemId, field $FieldId"
        return $null
    }
}

# Set project field value
function Set-ProjectFieldValue {
    param([string]$ProjectItemId, [string]$FieldId, [string]$OptionId)
    
    try {
        $mutation = @"
mutation(`$projectId: ID!, `$itemId: ID!, `$fieldId: ID!, `$value: String!) {
  updateProjectV2ItemFieldValue(input: {
    projectId: `$projectId
    itemId: `$itemId
    fieldId: `$fieldId
    value: { singleSelectOptionId: `$value }
  }) {
    projectV2Item { id }
  }
}
"@
        
        $result = gh api graphql -f query="$mutation" -f projectId="PVT_kwHOAEnMVc4BCu-c" -f itemId="$ProjectItemId" -f fieldId="$FieldId" -f value="$OptionId"
        return $true
    }
    catch {
        Write-Warning "Failed to set project field value for item $ProjectItemId, field $FieldId"
        return $false
    }
}

# Add issue to project
function Add-IssueToProject {
    param([int]$IssueNumber)
    
    try {
        $issueId = gh issue view $IssueNumber --json id -q .id
        $mutation = @"
mutation(`$projectId: ID!, `$contentId: ID!) {
  addProjectV2ItemById(input: {
    projectId: `$projectId
    contentId: `$contentId
  }) {
    item { id }
  }
}
"@
        
        $result = gh api graphql -f query="$mutation" -f projectId="PVT_kwHOAEnMVc4BCu-c" -f contentId="$issueId"
        return $true
    }
    catch {
        Write-Warning "Failed to add issue #$IssueNumber to project"
        return $false
    }
}

# Color output functions
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Validate GitHub CLI authentication
function Test-GitHubAuth {
    try {
        gh auth status | Out-Null
        return $true
    }
    catch {
        Write-Error "GitHub CLI not authenticated. Run 'gh auth login' first."
        return $false
    }
}

# Test function to validate all utilities
function Test-GitHubUtils {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$false)]
        [string]$TestPRNumber = "270"
    )
    
    Write-ColorOutput "Testing GitHub Utilities..." "Cyan"
    
    # Test authentication
    if (-not (Test-GitHubAuth)) {
        Write-ColorOutput "❌ GitHub authentication failed" "Red"
        return $false
    }
    Write-ColorOutput "✅ GitHub authentication successful" "Green"
    
    # Test repository info
    $repo = Get-RepoInfo
    if (-not $repo) {
        Write-ColorOutput "❌ Failed to get repository information" "Red"
        return $false
    }
    Write-ColorOutput "✅ Repository info: $($repo.Owner)/$($repo.Name)" "Green"
    
    # Test PR info
    $prInfo = Get-PRInfo -PRNumber $TestPRNumber
    if (-not $prInfo) {
        Write-ColorOutput "❌ Failed to get PR information" "Red"
        return $false
    }
    Write-ColorOutput "✅ PR info retrieved: $($prInfo.title)" "Green"
    
    # Test comments
    $comments = Get-PRComments -PRNumber $TestPRNumber
    if ($comments -eq $null) {
        Write-ColorOutput "❌ Failed to get PR comments" "Red"
        return $false
    }
    Write-ColorOutput "✅ Retrieved $($comments.Count) comments" "Green"
    
    # Test CR-GPT comments
    $crgptComments = Get-CRGPTComments -PRNumber $TestPRNumber
    if ($crgptComments -eq $null) {
        Write-ColorOutput "❌ Failed to get CR-GPT comments" "Red"
        return $false
    }
    Write-ColorOutput "✅ Retrieved $($crgptComments.Count) CR-GPT comments" "Green"
    
    Write-ColorOutput "🎉 All GitHub utilities tests passed!" "Green"
    return $true
}

# Export functions for use in other scripts
# Note: Export-ModuleMember is commented out because this file is dot-sourced, not imported as a module
# Export-ModuleMember -Function @(
#     'Get-RepoInfo',
#     'Get-CRGPTComments', 
#     'Get-PRComments',
#     'Get-PRInfo',
#     'Get-ProjectItemId',
#     'Get-ProjectFieldValue',
#     'Set-ProjectFieldValue',
#     'Add-IssueToProject',
#     'Write-ColorOutput',
#     'Test-GitHubAuth',
#     'Test-GitHubUtils'
# )