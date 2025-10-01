# GitHub Utilities - Shared functions for all automation scripts
# This module provides common GitHub API functions to eliminate duplication

# Get repository information (cached)
$script:repoInfo = $null
function Get-RepoInfo {
    if (-not $script:repoInfo) {
        $script:repoInfo = @{
            Owner = gh repo view --json owner -q .owner.login
            Name = gh repo view --json name -q .name
        }
    }
    return $script:repoInfo
}

# Get CR-GPT bot comments from a PR
function Get-CRGPTComments {
    param([string]$PRNumber)
    
    $repo = Get-RepoInfo
    $allCommentsJson = gh api repos/$($repo.Owner)/$($repo.Name)/pulls/$PRNumber/comments
    $allComments = $allCommentsJson | ConvertFrom-Json
    $crgptComments = $allComments | Where-Object { $_.user.login -eq "cr-gpt[bot]" }
    return $crgptComments
}

# Get all PR comments
function Get-PRComments {
    param([string]$PRNumber)
    
    $repo = Get-RepoInfo
    $allCommentsJson = gh api repos/$($repo.Owner)/$($repo.Name)/pulls/$PRNumber/comments
    return $allCommentsJson | ConvertFrom-Json
}

# Get PR information
function Get-PRInfo {
    param([string]$PRNumber)
    
    $repo = Get-RepoInfo
    $prInfoJson = gh api repos/$($repo.Owner)/$($repo.Name)/pulls/$PRNumber
    return $prInfoJson | ConvertFrom-Json
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
                    return $fieldValue.name ?? $fieldValue.text
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

# Export functions for use in other scripts
Export-ModuleMember -Function @(
    'Get-RepoInfo',
    'Get-CRGPTComments', 
    'Get-PRComments',
    'Get-PRInfo',
    'Get-ProjectItemId',
    'Get-ProjectFieldValue',
    'Set-ProjectFieldValue',
    'Add-IssueToProject',
    'Write-ColorOutput',
    'Test-GitHubAuth'
)
