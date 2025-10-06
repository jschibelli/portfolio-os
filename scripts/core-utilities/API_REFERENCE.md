# Core Utilities API Reference

## Documentation Updater API

### `docs-updater.ps1`

**Purpose**: Automatically updates project documentation based on code changes and PR content.

#### Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `-PRNumber` | string | No | "" | GitHub PR number to process |
| `-UpdateChangelog` | switch | No | false | Update CHANGELOG.md |
| `-UpdateReadme` | switch | No | false | Update README.md |
| `-GenerateDocs` | switch | No | false | Generate API and component docs |
| `-OutputDir` | string | No | "docs/generated" | Output directory for generated docs |
| `-DryRun` | switch | No | false | Preview changes without executing |

#### Functions
- `Get-PRData(PRNumber)`: Retrieves PR information from GitHub
- `Get-ChangedFiles(PRData)`: Gets list of changed files from PR
- `Update-Changelog(PRData)`: Updates CHANGELOG.md with PR information
- `Update-Readme(PRData, ChangedFiles)`: Analyzes and updates README.md
- `Generate-APIDocs(PRData, ChangedFiles)`: Generates API documentation
- `Generate-ComponentDocs(PRData, ChangedFiles)`: Generates component documentation
- `Generate-SummaryReport(PRData, ChangedFiles)`: Creates summary report

#### Usage Examples
```powershell
# Basic changelog update
.\docs-updater.ps1 -PRNumber "123" -UpdateChangelog

# Complete documentation generation
.\docs-updater.ps1 -PRNumber "123" -GenerateDocs

# Dry run preview
.\docs-updater.ps1 -PRNumber "123" -GenerateDocs -DryRun
```

## GitHub Utilities API

### `get-github-utilities.ps1`

**Purpose**: Provides shared GitHub API functions and utilities for all automation scripts.

#### Core Functions

##### `Get-RepoInfo()`
**Description**: Gets cached repository information (owner and name).
**Returns**: Hashtable with Owner and Name properties.
**Example**:
```powershell
$repo = Get-RepoInfo
Write-Host "Repository: $($repo.Owner)/$($repo.Name)"
```

##### `Get-PRInfo(PRNumber)`
**Description**: Retrieves comprehensive PR information.
**Parameters**:
- `PRNumber` (string, required): GitHub PR number
**Returns**: PSCustomObject with PR details.
**Example**:
```powershell
$prInfo = Get-PRInfo -PRNumber "123"
Write-Host "PR Title: $($prInfo.title)"
```

##### `Get-PRComments(PRNumber)`
**Description**: Gets all comments for a PR.
**Parameters**:
- `PRNumber` (string, required): GitHub PR number
**Returns**: Array of comment objects.
**Example**:
```powershell
$comments = Get-PRComments -PRNumber "123"
Write-Host "Total comments: $($comments.Count)"
```

##### `Get-CRGPTComments(PRNumber)`
**Description**: Gets comments specifically from CR-GPT bot.
**Parameters**:
- `PRNumber` (string, required): GitHub PR number
**Returns**: Array of CR-GPT comment objects.
**Example**:
```powershell
$crgptComments = Get-CRGPTComments -PRNumber "123"
Write-Host "CR-GPT comments: $($crgptComments.Count)"
```

##### `Get-ProjectItemId(IssueNumber)`
**Description**: Gets project item ID for an issue.
**Parameters**:
- `IssueNumber` (int, required): GitHub issue number
**Returns**: String project item ID or null.
**Example**:
```powershell
$projectItemId = Get-ProjectItemId -IssueNumber 123
if ($projectItemId) {
    Write-Host "Project Item ID: $projectItemId"
}
```

##### `Set-ProjectFieldValue(ProjectItemId, FieldId, OptionId)`
**Description**: Sets a project field value.
**Parameters**:
- `ProjectItemId` (string, required): Project item ID
- `FieldId` (string, required): Field ID to update
- `OptionId` (string, required): Option ID to set
**Returns**: Boolean success status.
**Example**:
```powershell
$success = Set-ProjectFieldValue -ProjectItemId $itemId -FieldId $fieldId -OptionId $optionId
```

##### `Add-IssueToProject(IssueNumber)`
**Description**: Adds an issue to the project board.
**Parameters**:
- `IssueNumber` (int, required): GitHub issue number
**Returns**: Boolean success status.
**Example**:
```powershell
$success = Add-IssueToProject -IssueNumber 123
```

##### `Test-GitHubAuth()`
**Description**: Validates GitHub CLI authentication.
**Returns**: Boolean authentication status.
**Example**:
```powershell
if (Test-GitHubAuth) {
    Write-Host "GitHub authenticated"
} else {
    Write-Host "GitHub not authenticated"
}
```

##### `Test-GitHubUtils(TestPRNumber)`
**Description**: Tests all GitHub utilities.
**Parameters**:
- `TestPRNumber` (string, optional): PR number to test with
**Returns**: Boolean test result.
**Example**:
```powershell
$success = Test-GitHubUtils -TestPRNumber "123"
```

## AI Services API

### `manage-ai-services.ps1`

**Purpose**: Provides centralized AI service integration supporting multiple providers.

#### Configuration
```powershell
$script:aiConfig = @{
    DefaultProvider = "openai"
    Providers = @{
        "openai" = @{ Model = "gpt-4"; ApiKey = $env:OPENAI_API_KEY }
        "anthropic" = @{ Model = "claude-3-sonnet-20240229"; ApiKey = $env:ANTHROPIC_API_KEY }
        "azure" = @{ Model = "gpt-4"; ApiKey = $env:AZURE_OPENAI_API_KEY }
    }
    CacheEnabled = $true
    CacheExpiryMinutes = 60
    RetryAttempts = 3
    RetryDelaySeconds = 2
}
```

#### Core Functions

##### `Initialize-AIServices(Provider, CustomConfig)`
**Description**: Initializes AI services with configuration validation.
**Parameters**:
- `Provider` (string, optional): AI provider ("openai", "anthropic", "azure")
- `CustomConfig` (hashtable, optional): Custom configuration overrides
**Returns**: Boolean initialization status.
**Example**:
```powershell
$success = Initialize-AIServices -Provider "openai"
```

##### `Invoke-AICompletion(Prompt, Provider, SystemMessage, MaxTokens, Temperature, UseCache, CacheKey)`
**Description**: Main AI completion function with caching and retry logic.
**Parameters**:
- `Prompt` (string, required): User prompt
- `Provider` (string, optional): AI provider
- `SystemMessage` (string, optional): System message for context
- `MaxTokens` (int, optional): Maximum tokens to generate
- `Temperature` (double, optional): Response creativity (0.0-1.0)
- `UseCache` (switch, optional): Enable caching
- `CacheKey` (string, optional): Custom cache key
**Returns**: String AI response.
**Example**:
```powershell
$response = Invoke-AICompletion -Prompt "Explain this code" -Provider "openai"
```

##### `Analyze-CodeWithAI(Code, Language, AnalysisType, Provider)`
**Description**: Analyzes code for quality, security, and best practices.
**Parameters**:
- `Code` (string, required): Code to analyze
- `Language` (string, required): Programming language
- `AnalysisType` (string, optional): Type of analysis ("comprehensive", "security", "performance")
- `Provider` (string, optional): AI provider
**Returns**: String analysis report.
**Example**:
```powershell
$analysis = Analyze-CodeWithAI -Code $code -Language "typescript" -AnalysisType "security"
```

##### `Generate-ImplementationPlan(IssueDescription, IssueTitle, TechStack, Provider)`
**Description**: Generates detailed implementation plans for GitHub issues.
**Parameters**:
- `IssueDescription` (string, required): Issue description
- `IssueTitle` (string, required): Issue title
- `TechStack` (string, optional): Technology stack
- `Provider` (string, optional): AI provider
**Returns**: String implementation plan.
**Example**:
```powershell
$plan = Generate-ImplementationPlan -IssueDescription $desc -IssueTitle $title -TechStack "Next.js, TypeScript"
```

##### `Generate-PRResponse(CommentBody, CommentAuthor, PRTitle, PRDescription, Provider)`
**Description**: Generates intelligent responses to code review feedback.
**Parameters**:
- `CommentBody` (string, required): Review comment text
- `CommentAuthor` (string, required): Comment author
- `PRTitle` (string, optional): PR title
- `PRDescription` (string, optional): PR description
- `Provider` (string, optional): AI provider
**Returns**: String response text.
**Example**:
```powershell
$response = Generate-PRResponse -CommentBody $comment -CommentAuthor $author
```

##### `Optimize-PerformanceWithAI(Code, Language, PerformanceContext, Provider)`
**Description**: Analyzes code for performance optimization opportunities.
**Parameters**:
- `Code` (string, required): Code to analyze
- `Language` (string, required): Programming language
- `PerformanceContext` (string, optional): Performance context
- `Provider` (string, optional): AI provider
**Returns**: String optimization recommendations.
**Example**:
```powershell
$optimization = Optimize-PerformanceWithAI -Code $code -Language "typescript"
```

##### `Clear-AICache()`
**Description**: Clears the AI response cache.
**Returns**: Void.
**Example**:
```powershell
Clear-AICache
```

##### `Get-AICacheStats()`
**Description**: Gets AI cache statistics.
**Returns**: Hashtable with cache statistics.
**Example**:
```powershell
$stats = Get-AICacheStats
Write-Host "Cache items: $($stats.ItemCount)"
```

## Project Management API

### `set-estimate-iteration.ps1`

**Purpose**: Manages GitHub project board fields including estimates and iterations.

#### Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `-IssueNumber` | int | Yes | - | GitHub issue number |
| `-Estimate` | int | No | 0 | Story point estimate (0-13) |
| `-Iteration` | string | No | "" | Sprint/iteration name |

#### Functions
- `Get-ProjectItemId(IssueNumber)`: Gets project item ID for an issue
- `Set-Estimate(ProjectItemId, Estimate)`: Sets story point estimate
- `Set-Iteration(ProjectItemId, Iteration)`: Sets sprint/iteration

#### Usage Examples
```powershell
# Set estimate only
.\set-estimate-iteration.ps1 -IssueNumber 123 -Estimate 5

# Set iteration only
.\set-estimate-iteration.ps1 -IssueNumber 123 -Iteration "Sprint 1"

# Set both
.\set-estimate-iteration.ps1 -IssueNumber 123 -Estimate 3 -Iteration "Sprint 2"
```

## Error Handling

### Common Error Types

#### GitHub API Errors
- **Authentication Error**: `gh auth login` required
- **Rate Limit Error**: Wait and retry
- **Not Found Error**: Check PR/issue number
- **Permission Error**: Check repository access

#### AI Service Errors
- **API Key Error**: Check environment variables
- **Rate Limit Error**: Wait and retry
- **Model Error**: Check model availability
- **Network Error**: Check connectivity

#### Documentation Errors
- **File Permission Error**: Check write permissions
- **Directory Error**: Create output directory
- **PR Error**: Check PR number and access

### Error Handling Patterns

#### Try-Catch Pattern
```powershell
try {
    $result = Get-PRInfo -PRNumber "123"
    if ($result) {
        # Process result
    }
} catch {
    Write-Error "Failed to get PR info: $($_.Exception.Message)"
}
```

#### Retry Pattern
```powershell
$maxRetries = 3
$attempt = 0
while ($attempt -lt $maxRetries) {
    try {
        $result = Get-PRInfo -PRNumber "123"
        break
    } catch {
        $attempt++
        if ($attempt -ge $maxRetries) {
            throw "Max retries exceeded"
        }
        Start-Sleep -Seconds 2
    }
}
```

## Performance Considerations

### Caching
- **Repository Info**: Cached for session duration
- **AI Responses**: Cached for 60 minutes by default
- **GitHub API**: Uses retry logic with exponential backoff

### Optimization Tips
- Use caching for repeated operations
- Batch related operations
- Use dry run mode for testing
- Monitor API rate limits

### Resource Management
```powershell
# Clear caches when done
Clear-AICache

# Reset verbose preference
$VerbosePreference = "SilentlyContinue"
```

## Security Considerations

### API Key Management
- Store API keys in environment variables
- Never commit API keys to version control
- Use least-privilege access for API keys

### Data Privacy
- AI services may process code content
- Review AI provider data handling policies
- Consider data residency requirements

### Best Practices
- Use dry run mode for testing
- Validate inputs before processing
- Implement proper error handling
- Monitor for sensitive data exposure
