# Portfolio OS Core Utilities - Developer Documentation

## Overview

The Core Utilities folder contains essential automation scripts and shared functions that provide foundational capabilities for the Portfolio OS project. These utilities handle documentation automation, GitHub integration, AI services, and project management tasks.

## Scripts Overview

### 1. `docs-updater.ps1` - Documentation Automation System
**Purpose**: Automatically updates project documentation based on code changes and PR content.

**What it does**:
- **PR Data Analysis**: Retrieves and analyzes pull request information including files changed, additions, deletions, and metadata
- **Changelog Management**: Automatically updates CHANGELOG.md with new entries based on PR labels and content
- **README Updates**: Analyzes changes to determine if README.md needs updates based on dependency or component changes
- **API Documentation Generation**: Creates comprehensive API documentation for code changes affecting libraries, utilities, and components
- **Component Documentation**: Generates detailed component documentation for React/TypeScript changes
- **Summary Reports**: Creates comprehensive documentation update summaries with next steps and recommendations

**Key Features**:
- Intelligent change detection
- Label-based categorization
- Automated documentation generation
- Comprehensive reporting
- Dry run capabilities

**Usage**:
```powershell
# Update changelog for a specific PR
.\docs-updater.ps1 -PRNumber 123 -UpdateChangelog

# Generate all documentation for a PR
.\docs-updater.ps1 -PRNumber 123 -GenerateDocs

# Update README and generate docs
.\docs-updater.ps1 -PRNumber 123 -UpdateReadme -GenerateDocs

# Dry run to preview changes
.\docs-updater.ps1 -PRNumber 123 -GenerateDocs -DryRun
```

**Parameters**:
- `-PRNumber`: GitHub PR number to process
- `-UpdateChangelog`: Update CHANGELOG.md
- `-UpdateReadme`: Update README.md
- `-GenerateDocs`: Generate API and component documentation
- `-OutputDir`: Output directory for generated docs (default: "docs/generated")
- `-DryRun`: Preview changes without executing

### 2. `get-github-utilities.ps1` - GitHub API Integration Layer
**Purpose**: Provides shared GitHub API functions and utilities for all automation scripts.

**What it does**:
- **Repository Information**: Caches and provides repository owner/name information
- **PR Data Retrieval**: Gets comprehensive PR information including comments, files, and metadata
- **CR-GPT Integration**: Specifically retrieves comments from the CR-GPT bot for automated code review processing
- **Project Management**: Handles GitHub project board operations including field updates and item management
- **Error Handling**: Provides robust retry logic and error handling for all GitHub API operations
- **Authentication**: Validates GitHub CLI authentication and provides helpful error messages

**Key Features**:
- Cached repository information
- Retry logic with exponential backoff
- Comprehensive error handling
- Project board integration
- CR-GPT bot integration
- Authentication validation

**Usage**:
```powershell
# Source the utilities in your script
. .\get-github-utilities.ps1

# Get repository information
$repo = Get-RepoInfo

# Get PR information
$prInfo = Get-PRInfo -PRNumber "123"

# Get all PR comments
$comments = Get-PRComments -PRNumber "123"

# Get CR-GPT bot comments specifically
$crgptComments = Get-CRGPTComments -PRNumber "123"

# Test all utilities
Test-GitHubUtils -TestPRNumber "123"
```

**Available Functions**:
- `Get-RepoInfo`: Get cached repository information
- `Get-PRInfo`: Get comprehensive PR information
- `Get-PRComments`: Get all PR comments
- `Get-CRGPTComments`: Get CR-GPT bot comments specifically
- `Get-ProjectItemId`: Get project item ID for an issue
- `Get-ProjectFieldValue`: Get project field value
- `Set-ProjectFieldValue`: Set project field value
- `Add-IssueToProject`: Add issue to project board
- `Test-GitHubAuth`: Validate GitHub authentication
- `Test-GitHubUtils`: Test all utilities

### 3. `manage-ai-services.ps1` - AI Services Integration Layer
**Purpose**: Provides centralized AI service integration supporting multiple providers and intelligent automation workflows.

**What it does**:
- **Multi-Provider Support**: Integrates with OpenAI, Anthropic Claude, and Azure OpenAI services
- **Intelligent Caching**: Implements in-memory caching with configurable expiry for cost optimization
- **Retry Logic**: Provides robust retry mechanisms with exponential backoff for API reliability
- **Code Analysis**: Uses AI to analyze code for quality, security, and best practices
- **Implementation Planning**: Generates detailed implementation plans for GitHub issues
- **PR Response Generation**: Creates intelligent responses to code review feedback
- **Performance Optimization**: Analyzes code for performance bottlenecks and optimization opportunities

**Key Features**:
- Multi-provider AI integration
- Intelligent response caching
- Code quality analysis
- Implementation planning
- Performance optimization
- Cost optimization

**Usage**:
```powershell
# Source the AI services
. .\manage-ai-services.ps1

# Initialize AI services
Initialize-AIServices -Provider "openai"

# Analyze code with AI
$analysis = Analyze-CodeWithAI -Code $codeContent -Language "typescript"

# Generate implementation plan
$plan = Generate-ImplementationPlan -IssueDescription $description -IssueTitle $title

# Generate PR response
$response = Generate-PRResponse -CommentBody $comment -CommentAuthor $author

# Optimize performance
$optimization = Optimize-PerformanceWithAI -Code $codeContent -Language "typescript"

# Get cache statistics
$stats = Get-AICacheStats
```

**Available Functions**:
- `Initialize-AIServices`: Initialize AI services with provider validation
- `Invoke-AICompletion`: Main AI completion function with caching
- `Analyze-CodeWithAI`: Analyze code for quality and security
- `Generate-ImplementationPlan`: Create implementation plans for issues
- `Generate-PRResponse`: Generate intelligent PR responses
- `Optimize-PerformanceWithAI`: Analyze code for performance optimization
- `Clear-AICache`: Clear AI response cache
- `Get-AICacheStats`: Get cache statistics

**Supported Providers**:
- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude-3-sonnet, Claude-3-haiku
- **Azure OpenAI**: Azure-hosted OpenAI models

### 4. `set-estimate-iteration.ps1` - GitHub Project Management
**Purpose**: Manages GitHub project board fields including estimates and iterations for issues.

**What it does**:
- **Project Integration**: Connects to GitHub project boards using GraphQL API
- **Estimate Management**: Sets story point estimates for issues
- **Iteration Planning**: Manages sprint/iteration assignments
- **Field Validation**: Validates project field IDs and issue existence
- **Error Handling**: Provides comprehensive error handling and user feedback

**Key Features**:
- GitHub project board integration
- Estimate and iteration management
- Field validation
- Comprehensive error handling
- User-friendly feedback

**Usage**:
```powershell
# Set estimate for an issue
.\set-estimate-iteration.ps1 -IssueNumber 123 -Estimate 5

# Set iteration for an issue
.\set-estimate-iteration.ps1 -IssueNumber 123 -Iteration "Sprint 1"

# Set both estimate and iteration
.\set-estimate-iteration.ps1 -IssueNumber 123 -Estimate 3 -Iteration "Sprint 2"
```

**Parameters**:
- `-IssueNumber`: GitHub issue number (required)
- `-Estimate`: Story point estimate (0-13)
- `-Iteration`: Sprint/iteration name

## Integration Patterns

### Documentation Automation Workflow
```powershell
# Complete documentation update for a PR
$prNumber = "123"
.\docs-updater.ps1 -PRNumber $prNumber -UpdateChangelog -UpdateReadme -GenerateDocs
```

### GitHub Integration Workflow
```powershell
# Source utilities
. .\get-github-utilities.ps1

# Get PR data and process
$prInfo = Get-PRInfo -PRNumber "123"
$comments = Get-CRGPTComments -PRNumber "123"

# Process based on PR data
if ($prInfo.labels -contains "documentation") {
    .\docs-updater.ps1 -PRNumber "123" -GenerateDocs
}
```

### AI-Powered Code Analysis
```powershell
# Source AI services
. .\manage-ai-services.ps1

# Initialize AI services
Initialize-AIServices -Provider "openai"

# Analyze code changes
$codeAnalysis = Analyze-CodeWithAI -Code $changedCode -Language "typescript"

# Generate implementation plan
$plan = Generate-ImplementationPlan -IssueDescription $issueDescription -IssueTitle $issueTitle
```

### Project Management Integration
```powershell
# Set up issue for development
.\set-estimate-iteration.ps1 -IssueNumber 123 -Estimate 5 -Iteration "Sprint 1"

# Update based on progress
.\set-estimate-iteration.ps1 -IssueNumber 123 -Estimate 3 -Iteration "Sprint 1"
```

## Configuration

### Environment Variables
```bash
# GitHub CLI authentication
gh auth login

# AI Service API Keys
export OPENAI_API_KEY="your-openai-key"
export ANTHROPIC_API_KEY="your-anthropic-key"
export AZURE_OPENAI_API_KEY="your-azure-key"
export AZURE_OPENAI_ENDPOINT="your-azure-endpoint"
```

### Project Configuration
The utilities use the following project-specific configurations:
- **Project ID**: `PVT_kwHOAEnMVc4BCu-c`
- **Estimate Field ID**: `PVTF_lAHOAEnMVc4BCu-czg028qY`
- **Iteration Field ID**: `PVTSSF_lAHOAEnMVc4BCu-czg028qY`

## Best Practices

### 1. Error Handling
Always use try-catch blocks when calling utility functions:
```powershell
try {
    $prInfo = Get-PRInfo -PRNumber "123"
    if ($prInfo) {
        # Process PR data
    }
} catch {
    Write-Error "Failed to get PR information: $($_.Exception.Message)"
}
```

### 2. Caching
Leverage built-in caching for performance:
```powershell
# Repository info is automatically cached
$repo = Get-RepoInfo  # First call fetches from GitHub
$repo = Get-RepoInfo  # Subsequent calls use cache
```

### 3. AI Service Optimization
Use caching and appropriate providers:
```powershell
# Initialize with caching enabled
Initialize-AIServices -Provider "openai"

# Use cached responses when possible
$response = Invoke-AICompletion -Prompt $prompt -UseCache
```

### 4. Documentation Automation
Use dry run mode for testing:
```powershell
# Test documentation updates
.\docs-updater.ps1 -PRNumber "123" -GenerateDocs -DryRun

# Execute when satisfied
.\docs-updater.ps1 -PRNumber "123" -GenerateDocs
```

## Troubleshooting

### Common Issues

#### GitHub Authentication
```powershell
# Check authentication status
gh auth status

# Re-authenticate if needed
gh auth login
```

#### AI Service Errors
```powershell
# Check API keys
echo $env:OPENAI_API_KEY

# Test AI services
Initialize-AIServices -Provider "openai"
```

#### Project Board Access
```powershell
# Verify project access
gh project view 20

# Check field IDs
gh project view 20 --json fields
```

### Debug Mode
Enable verbose output for troubleshooting:
```powershell
# GitHub utilities
$VerbosePreference = "Continue"
Get-PRInfo -PRNumber "123" -Verbose

# AI services
Initialize-AIServices -Provider "openai" -Verbose
```

## Performance Optimization

### Caching Strategy
- **Repository Info**: Cached for session duration
- **AI Responses**: Cached for 60 minutes by default
- **GitHub API**: Uses retry logic with exponential backoff

### Cost Optimization
- **AI Caching**: Reduces API calls and costs
- **Batch Operations**: Group related operations
- **Dry Run Mode**: Test before executing expensive operations

## Security Considerations

### API Key Management
- Store API keys in environment variables
- Never commit API keys to version control
- Use least-privilege access for API keys

### Data Privacy
- AI services may process code content
- Review AI provider data handling policies
- Consider data residency requirements

## Future Enhancements

### Planned Features
- **Additional AI Providers**: Support for more AI services
- **Advanced Caching**: Persistent caching across sessions
- **Custom Templates**: Configurable documentation templates
- **Integration Testing**: Automated testing for all utilities

### Extension Points
- **Custom AI Providers**: Add support for new AI services
- **Documentation Templates**: Customize generated documentation
- **Project Field Mapping**: Support for different project configurations
- **Workflow Integration**: CI/CD pipeline integration

## Quick Reference

### Most Common Commands
```powershell
# Documentation automation
.\docs-updater.ps1 -PRNumber 123 -GenerateDocs

# GitHub integration
. .\get-github-utilities.ps1
$prInfo = Get-PRInfo -PRNumber "123"

# AI services
. .\manage-ai-services.ps1
Initialize-AIServices -Provider "openai"

# Project management
.\set-estimate-iteration.ps1 -IssueNumber 123 -Estimate 5
```

### Emergency Commands
```powershell
# Test all utilities
. .\get-github-utilities.ps1
Test-GitHubUtils

# Clear AI cache
. .\manage-ai-services.ps1
Clear-AICache

# Check authentication
gh auth status
```

This documentation provides comprehensive guidance for using the core utilities effectively in the Portfolio OS project development workflow.
