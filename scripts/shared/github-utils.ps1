# GitHub Utilities - Enhanced shared functions for all automation scripts
# This module provides common GitHub API functions with improved error handling, performance, and security

# Configuration and caching
$script:repoInfo = $null
$script:apiCache = @{}
$script:cacheTimeout = 300 # 5 minutes cache timeout
$script:maxRetries = 3
$script:retryDelay = 1000 # 1 second base delay

# Enhanced repository information with error handling and caching
function Get-RepoInfo {
    if (-not $script:repoInfo) {
        try {
            $repoData = gh repo view --json owner,name -q '{owner: .owner.login, name: .name}'
            $script:repoInfo = $repoData | ConvertFrom-Json
        }
        catch {
            Write-Error "Failed to get repository information: $($_.Exception.Message)"
            return $null
        }
    }
    return $script:repoInfo
}

# Enhanced CR-GPT bot comments retrieval with caching and error handling
function Get-CRGPTComments {
    param([string]$PRNumber)
    
    $cacheKey = "crgpt-comments-$PRNumber"
    $cachedData = Get-CachedData -Key $cacheKey
    
    if ($cachedData) {
        return $cachedData
    }
    
    $repo = Get-RepoInfo
    if (-not $repo) {
        Write-Error "Failed to get repository information"
        return @()
    }
    
    try {
        $allCommentsJson = Invoke-GitHubAPI -Endpoint "repos/$($repo.Owner)/$($repo.Name)/pulls/$PRNumber/comments"
        $allComments = $allCommentsJson | ConvertFrom-Json
        $crgptComments = $allComments | Where-Object { $_.user.login -eq "cr-gpt[bot]" }
        
        # Cache the results
        Set-CachedData -Key $cacheKey -Value $crgptComments
        return $crgptComments
    }
    catch {
        Write-Error "Failed to get CR-GPT comments for PR #$PRNumber : $($_.Exception.Message)"
        return @()
    }
}

# Enhanced PR comments retrieval with caching and error handling
function Get-PRComments {
    param([string]$PRNumber)
    
    $cacheKey = "pr-comments-$PRNumber"
    $cachedData = Get-CachedData -Key $cacheKey
    
    if ($cachedData) {
        return $cachedData
    }
    
    $repo = Get-RepoInfo
    if (-not $repo) {
        Write-Error "Failed to get repository information"
        return @()
    }
    
    try {
        $allCommentsJson = Invoke-GitHubAPI -Endpoint "repos/$($repo.Owner)/$($repo.Name)/pulls/$PRNumber/comments"
        $allComments = $allCommentsJson | ConvertFrom-Json
        
        # Cache the results
        Set-CachedData -Key $cacheKey -Value $allComments
        return $allComments
    }
    catch {
        Write-Error "Failed to get PR comments for PR #$PRNumber : $($_.Exception.Message)"
        return @()
    }
}

# Enhanced PR information retrieval with caching and error handling
function Get-PRInfo {
    param([string]$PRNumber)
    
    $cacheKey = "pr-info-$PRNumber"
    $cachedData = Get-CachedData -Key $cacheKey
    
    if ($cachedData) {
        return $cachedData
    }
    
    $repo = Get-RepoInfo
    if (-not $repo) {
        Write-Error "Failed to get repository information"
        return $null
    }
    
    try {
        $prInfoJson = Invoke-GitHubAPI -Endpoint "repos/$($repo.Owner)/$($repo.Name)/pulls/$PRNumber"
        $prInfo = $prInfoJson | ConvertFrom-Json
        
        # Cache the results
        Set-CachedData -Key $cacheKey -Value $prInfo
        return $prInfo
    }
    catch {
        Write-Error "Failed to get PR information for PR #$PRNumber : $($_.Exception.Message)"
        return $null
    }
}

# Enhanced project item ID retrieval with better error handling and validation
function Get-ProjectItemId {
    param([int]$IssueNumber)
    
    try {
        # Validate issue number
        if ($IssueNumber -le 0) {
            Write-Error "Invalid issue number: $IssueNumber"
            return $null
        }
        
        $issueId = gh issue view $IssueNumber --json id -q .id
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to get issue ID for issue #$IssueNumber"
            return $null
        }
        
        $query = @"
query(`$issueId: ID!) {
  node(id: `$issueId) {
    ... on Issue {
      projectItems(first: 10) {
        nodes {
          id
          project {
            id
            title
          }
        }
      }
    }
  }
}
"@
        
        $graphqlResponse = gh api graphql -f query="$query" -f issueId="$issueId"
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to execute GraphQL query for issue #$IssueNumber"
            return $null
        }
        
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
        Write-Error "Failed to get project item ID for issue #$IssueNumber : $($_.Exception.Message)"
        return $null
    }
}

# Enhanced project field value retrieval with validation and error handling
function Get-ProjectFieldValue {
    param([string]$ProjectItemId, [string]$FieldId)
    
    # Validate input parameters
    if ([string]::IsNullOrWhiteSpace($ProjectItemId)) {
        Write-Error "ProjectItemId cannot be null or empty"
        return $null
    }
    
    if ([string]::IsNullOrWhiteSpace($FieldId)) {
        Write-Error "FieldId cannot be null or empty"
        return $null
    }
    
    try {
        $query = @"
query(`$itemId: ID!) {
  node(id: `$itemId) {
    ... on ProjectV2Item {
      fieldValues(first: 20) {
        nodes {
          ... on ProjectV2ItemFieldSingleSelectValue {
            field {
              ... on ProjectV2Field {
                id
                name
              }
            }
            name
          }
          ... on ProjectV2ItemFieldTextValue {
            field {
              ... on ProjectV2Field {
                id
                name
              }
            }
            text
          }
        }
      }
    }
  }
}
"@
        
        $graphqlResponse = gh api graphql -f query="$query" -f itemId="$ProjectItemId"
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to execute GraphQL query for project item $ProjectItemId"
            return $null
        }
        
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
        Write-Error "Failed to get project field value for item $ProjectItemId, field $FieldId : $($_.Exception.Message)"
        return $null
    }
}

# Enhanced project field value setting with validation and error handling
function Set-ProjectFieldValue {
    param([string]$ProjectItemId, [string]$FieldId, [string]$OptionId)
    
    # Validate input parameters
    if ([string]::IsNullOrWhiteSpace($ProjectItemId)) {
        Write-Error "ProjectItemId cannot be null or empty"
        return $false
    }
    
    if ([string]::IsNullOrWhiteSpace($FieldId)) {
        Write-Error "FieldId cannot be null or empty"
        return $false
    }
    
    if ([string]::IsNullOrWhiteSpace($OptionId)) {
        Write-Error "OptionId cannot be null or empty"
        return $false
    }
    
    try {
        $mutation = @"
mutation(`$projectId: ID!, `$itemId: ID!, `$fieldId: ID!, `$value: String!) {
  updateProjectV2ItemFieldValue(input: {
    projectId: `$projectId
    itemId: `$itemId
    fieldId: `$fieldId
    value: { singleSelectOptionId: `$value }
  }) {
    projectV2Item { 
      id 
    }
  }
}
"@
        
        $result = gh api graphql -f query="$mutation" -f projectId="PVT_kwHOAEnMVc4BCu-c" -f itemId="$ProjectItemId" -f fieldId="$FieldId" -f value="$OptionId"
        
        if ($LASTEXITCODE -eq 0) {
            return $true
        }
        else {
            Write-Error "Failed to set project field value - GraphQL mutation failed"
            return $false
        }
    }
    catch {
        Write-Error "Failed to set project field value for item $ProjectItemId, field $FieldId : $($_.Exception.Message)"
        return $false
    }
}

# Enhanced issue to project addition with validation and error handling
function Add-IssueToProject {
    param([int]$IssueNumber)
    
    # Validate issue number
    if ($IssueNumber -le 0) {
        Write-Error "Invalid issue number: $IssueNumber"
        return $false
    }
    
    try {
        $issueId = gh issue view $IssueNumber --json id -q .id
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to get issue ID for issue #$IssueNumber"
            return $false
        }
        
        $mutation = @"
mutation(`$projectId: ID!, `$contentId: ID!) {
  addProjectV2ItemById(input: {
    projectId: `$projectId
    contentId: `$contentId
  }) {
    item { 
      id 
    }
  }
}
"@
        
        $result = gh api graphql -f query="$mutation" -f projectId="PVT_kwHOAEnMVc4BCu-c" -f contentId="$issueId"
        
        if ($LASTEXITCODE -eq 0) {
            return $true
        }
        else {
            Write-Error "Failed to add issue #$IssueNumber to project - GraphQL mutation failed"
            return $false
        }
    }
    catch {
        Write-Error "Failed to add issue #$IssueNumber to project : $($_.Exception.Message)"
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

# Enhanced API call function with retry logic and error handling
function Invoke-GitHubAPI {
    param(
        [string]$Endpoint,
        [int]$MaxRetries = $script:maxRetries,
        [int]$BaseDelay = $script:retryDelay
    )
    
    for ($attempt = 1; $attempt -le $MaxRetries; $attempt++) {
        try {
            $result = gh api $Endpoint
            if ($LASTEXITCODE -eq 0) {
                return $result
            }
            throw "GitHub API call failed with exit code $LASTEXITCODE"
        }
        catch {
            if ($attempt -eq $MaxRetries) {
                Write-Error "GitHub API call failed after $MaxRetries attempts: $($_.Exception.Message)"
                throw
            }
            
            $delay = $BaseDelay * [Math]::Pow(2, $attempt - 1) # Exponential backoff
            Write-Warning "API call failed (attempt $attempt/$MaxRetries), retrying in $delay ms..."
            Start-Sleep -Milliseconds $delay
        }
    }
}

# Caching functions for performance optimization
function Get-CachedData {
    param([string]$Key)
    
    if ($script:apiCache.ContainsKey($Key)) {
        $cachedItem = $script:apiCache[$Key]
        $age = (Get-Date) - $cachedItem.Timestamp
        
        if ($age.TotalSeconds -lt $script:cacheTimeout) {
            return $cachedItem.Data
        }
        else {
            $script:apiCache.Remove($Key)
        }
    }
    return $null
}

function Set-CachedData {
    param(
        [string]$Key,
        [object]$Value
    )
    
    $script:apiCache[$Key] = @{
        Data = $Value
        Timestamp = Get-Date
    }
}

# Enhanced authentication validation with detailed error reporting
function Test-GitHubAuth {
    try {
        $authStatus = gh auth status 2>&1
        if ($LASTEXITCODE -eq 0) {
            return $true
        }
        else {
            Write-Error "GitHub CLI authentication failed: $authStatus"
            Write-Error "Please run 'gh auth login' to authenticate"
            return $false
        }
    }
    catch {
        Write-Error "Failed to check GitHub authentication: $($_.Exception.Message)"
        return $false
    }
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
#     'Invoke-GitHubAPI',
#     'Get-CachedData',
#     'Set-CachedData'
# )
