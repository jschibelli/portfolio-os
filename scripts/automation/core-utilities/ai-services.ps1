# AI Services Integration Layer
# Provides centralized AI service integration for automation scripts
# Supports multiple AI providers and intelligent automation workflows

# Configuration for AI services
$script:aiConfig = @{
    DefaultProvider = "openai"
    Providers = @{
        "openai" = @{
            Model = "gpt-4"
            Temperature = 0.7
            MaxTokens = 2000
            ApiKey = $env:OPENAI_API_KEY
            BaseUrl = "https://api.openai.com/v1"
        }
        "anthropic" = @{
            Model = "claude-3-sonnet-20240229"
            Temperature = 0.7
            MaxTokens = 2000
            ApiKey = $env:ANTHROPIC_API_KEY
            BaseUrl = "https://api.anthropic.com/v1"
        }
        "azure" = @{
            Model = "gpt-4"
            Temperature = 0.7
            MaxTokens = 2000
            ApiKey = $env:AZURE_OPENAI_API_KEY
            BaseUrl = $env:AZURE_OPENAI_ENDPOINT
            ApiVersion = "2024-02-15-preview"
        }
    }
    CacheEnabled = $true
    CacheExpiryMinutes = 60
    RetryAttempts = 3
    RetryDelaySeconds = 2
}

# In-memory cache for AI responses
$script:aiCache = @{}

function Initialize-AIServices {
    <#
    .SYNOPSIS
    Initialize AI services with configuration validation
    #>
    param(
        [string]$Provider = $script:aiConfig.DefaultProvider,
        [hashtable]$CustomConfig = @{}
    )
    
    Write-ColorOutput "Initializing AI Services..." "Blue"
    
    # Validate provider
    if (-not $script:aiConfig.Providers.ContainsKey($Provider)) {
        Write-Error "Unsupported AI provider: $Provider. Supported providers: $($script:aiConfig.Providers.Keys -join ', ')"
        return $false
    }
    
    # Get provider config
    $providerConfig = $script:aiConfig.Providers[$Provider].Clone()
    
    # Apply custom config
    foreach ($key in $CustomConfig.Keys) {
        $providerConfig[$key] = $CustomConfig[$key]
    }
    
    # Validate API key
    if ([string]::IsNullOrEmpty($providerConfig.ApiKey)) {
        Write-Error "API key not found for provider: $Provider. Please set the appropriate environment variable."
        return $false
    }
    
    # Validate base URL
    if ([string]::IsNullOrEmpty($providerConfig.BaseUrl)) {
        Write-Error "Base URL not configured for provider: $Provider"
        return $false
    }
    
    # Test connectivity
    if (-not (Test-AIConnectivity -Provider $Provider -Config $providerConfig)) {
        Write-Error "Failed to connect to AI provider: $Provider"
        return $false
    }
    
    Write-ColorOutput "✅ AI Services initialized with provider: $Provider" "Green"
    return $true
}

function Test-AIConnectivity {
    <#
    .SYNOPSIS
    Test connectivity to AI provider
    #>
    param(
        [string]$Provider,
        [hashtable]$Config
    )
    
    try {
        switch ($Provider) {
            "openai" {
                $headers = @{
                    "Authorization" = "Bearer $($Config.ApiKey)"
                    "Content-Type" = "application/json"
                }
                $testResponse = Invoke-RestMethod -Uri "$($Config.BaseUrl)/models" -Method Get -Headers $headers -TimeoutSec 10
                return $true
            }
            "anthropic" {
                $headers = @{
                    "x-api-key" = $Config.ApiKey
                    "Content-Type" = "application/json"
                    "anthropic-version" = "2023-06-01"
                }
                # Anthropic doesn't have a simple models endpoint, so we'll just validate the headers
                return $true
            }
            "azure" {
                $headers = @{
                    "api-key" = $Config.ApiKey
                    "Content-Type" = "application/json"
                }
                $testUrl = "$($Config.BaseUrl)/openai/models?api-version=$($Config.ApiVersion)"
                $testResponse = Invoke-RestMethod -Uri $testUrl -Method Get -Headers $headers -TimeoutSec 10
                return $true
            }
            default {
                return $false
            }
        }
    }
    catch {
        Write-Warning "AI connectivity test failed: $($_.Exception.Message)"
        return $false
    }
}

function Invoke-AICompletion {
    <#
    .SYNOPSIS
    Invoke AI completion with caching and retry logic
    #>
    param(
        [Parameter(Mandatory=$true)]
        [string]$Prompt,
        
        [string]$Provider = $script:aiConfig.DefaultProvider,
        [string]$SystemMessage = "",
        [int]$MaxTokens = 0,
        [double]$Temperature = 0,
        [switch]$UseCache = $script:aiConfig.CacheEnabled,
        [string]$CacheKey = ""
    )
    
    # Generate cache key if not provided
    if ([string]::IsNullOrEmpty($CacheKey)) {
        $CacheKey = Get-HashString -InputString "$Provider|$Prompt|$SystemMessage|$MaxTokens|$Temperature"
    }
    
    # Check cache first
    if ($UseCache -and $script:aiCache.ContainsKey($CacheKey)) {
        $cachedResponse = $script:aiCache[$CacheKey]
        if ((Get-Date) - $cachedResponse.Timestamp -lt [TimeSpan]::FromMinutes($script:aiConfig.CacheExpiryMinutes)) {
            Write-ColorOutput "📋 Using cached AI response" "Cyan"
            return $cachedResponse.Response
        } else {
            $script:aiCache.Remove($CacheKey)
        }
    }
    
    # Get provider config
    $providerConfig = $script:aiConfig.Providers[$Provider]
    if (-not $providerConfig) {
        throw "Provider not configured: $Provider"
    }
    
    # Apply overrides
    $finalMaxTokens = if ($MaxTokens -gt 0) { $MaxTokens } else { $providerConfig.MaxTokens }
    $finalTemperature = if ($Temperature -gt 0) { $Temperature } else { $providerConfig.Temperature }
    
    # Retry logic
    $attempt = 0
    while ($attempt -lt $script:aiConfig.RetryAttempts) {
        try {
            $response = switch ($Provider) {
                "openai" { Invoke-OpenAICompletion -Prompt $Prompt -SystemMessage $SystemMessage -MaxTokens $finalMaxTokens -Temperature $finalTemperature -Config $providerConfig }
                "anthropic" { Invoke-AnthropicCompletion -Prompt $Prompt -SystemMessage $SystemMessage -MaxTokens $finalMaxTokens -Temperature $finalTemperature -Config $providerConfig }
                "azure" { Invoke-AzureCompletion -Prompt $Prompt -SystemMessage $SystemMessage -MaxTokens $finalMaxTokens -Temperature $finalTemperature -Config $providerConfig }
                default { throw "Unsupported provider: $Provider" }
            }
            
            # Cache the response
            if ($UseCache) {
                $script:aiCache[$CacheKey] = @{
                    Response = $response
                    Timestamp = Get-Date
                }
            }
            
            return $response
        }
        catch {
            $attempt++
            if ($attempt -ge $script:aiConfig.RetryAttempts) {
                throw "AI completion failed after $($script:aiConfig.RetryAttempts) attempts: $($_.Exception.Message)"
            }
            
            Write-Warning "AI completion attempt $attempt failed: $($_.Exception.Message). Retrying in $($script:aiConfig.RetryDelaySeconds) seconds..."
            Start-Sleep -Seconds $script:aiConfig.RetryDelaySeconds
        }
    }
}

function Invoke-OpenAICompletion {
    <#
    .SYNOPSIS
    Invoke OpenAI API completion
    #>
    param(
        [string]$Prompt,
        [string]$SystemMessage,
        [int]$MaxTokens,
        [double]$Temperature,
        [hashtable]$Config
    )
    
    $headers = @{
        "Authorization" = "Bearer $($Config.ApiKey)"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        model = $Config.Model
        messages = @()
        max_tokens = $MaxTokens
        temperature = $Temperature
    }
    
    # Add system message if provided
    if (-not [string]::IsNullOrEmpty($SystemMessage)) {
        $body.messages += @{
            role = "system"
            content = $SystemMessage
        }
    }
    
    # Add user prompt
    $body.messages += @{
        role = "user"
        content = $Prompt
    }
    
    $jsonBody = $body | ConvertTo-Json -Depth 10
    $response = Invoke-RestMethod -Uri "$($Config.BaseUrl)/chat/completions" -Method Post -Headers $headers -Body $jsonBody
    
    return $response.choices[0].message.content
}

function Invoke-AnthropicCompletion {
    <#
    .SYNOPSIS
    Invoke Anthropic Claude API completion
    #>
    param(
        [string]$Prompt,
        [string]$SystemMessage,
        [int]$MaxTokens,
        [double]$Temperature,
        [hashtable]$Config
    )
    
    $headers = @{
        "x-api-key" = $Config.ApiKey
        "Content-Type" = "application/json"
        "anthropic-version" = "2023-06-01"
    }
    
    $body = @{
        model = $Config.Model
        max_tokens = $MaxTokens
        temperature = $Temperature
        messages = @(@{
            role = "user"
            content = $Prompt
        })
    }
    
    # Add system message if provided
    if (-not [string]::IsNullOrEmpty($SystemMessage)) {
        $body.system = $SystemMessage
    }
    
    $jsonBody = $body | ConvertTo-Json -Depth 10
    $response = Invoke-RestMethod -Uri "https://api.anthropic.com/v1/messages" -Method Post -Headers $headers -Body $jsonBody
    
    return $response.content[0].text
}

function Invoke-AzureCompletion {
    <#
    .SYNOPSIS
    Invoke Azure OpenAI API completion
    #>
    param(
        [string]$Prompt,
        [string]$SystemMessage,
        [int]$MaxTokens,
        [double]$Temperature,
        [hashtable]$Config
    )
    
    $headers = @{
        "api-key" = $Config.ApiKey
        "Content-Type" = "application/json"
    }
    
    $body = @{
        messages = @()
        max_tokens = $MaxTokens
        temperature = $Temperature
    }
    
    # Add system message if provided
    if (-not [string]::IsNullOrEmpty($SystemMessage)) {
        $body.messages += @{
            role = "system"
            content = $SystemMessage
        }
    }
    
    # Add user prompt
    $body.messages += @{
        role = "user"
        content = $Prompt
    }
    
    $jsonBody = $body | ConvertTo-Json -Depth 10
    $deploymentUrl = "$($Config.BaseUrl)/openai/deployments/$($Config.Model)/chat/completions?api-version=$($Config.ApiVersion)"
    $response = Invoke-RestMethod -Uri $deploymentUrl -Method Post -Headers $headers -Body $jsonBody
    
    return $response.choices[0].message.content
}

function Get-HashString {
    <#
    .SYNOPSIS
    Generate hash string for caching
    #>
    param([string]$InputString)
    
    $hash = [System.Security.Cryptography.SHA256]::Create()
    $hashBytes = $hash.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($InputString))
    return [System.BitConverter]::ToString($hashBytes) -replace '-', ''
}

function Analyze-CodeWithAI {
    <#
    .SYNOPSIS
    Analyze code using AI for quality, security, and best practices
    #>
    param(
        [Parameter(Mandatory=$true)]
        [string]$Code,
        
        [Parameter(Mandatory=$true)]
        [string]$Language,
        
        [string]$AnalysisType = "comprehensive",
        [string]$Provider = $script:aiConfig.DefaultProvider
    )
    
    $systemMessage = "You are an expert code reviewer and software engineer. Analyze the provided code for quality, security, performance, and best practices. Provide specific, actionable feedback."
    
    $prompt = @"
Please analyze the following $Language code:

```$Language
$Code
```

Analysis type: $AnalysisType

Please provide:
1. Overall assessment (score 1-10)
2. Security concerns
3. Performance issues
4. Code quality issues
5. Best practices violations
6. Specific recommendations for improvement

Format your response in a structured way with clear sections.
"@
    
    return Invoke-AICompletion -Prompt $prompt -SystemMessage $systemMessage -Provider $Provider
}

function Generate-ImplementationPlan {
    <#
    .SYNOPSIS
    Generate implementation plan for an issue using AI
    #>
    param(
        [Parameter(Mandatory=$true)]
        [string]$IssueDescription,
        
        [Parameter(Mandatory=$true)]
        [string]$IssueTitle,
        
        [string]$TechStack = "Next.js, TypeScript, React",
        [string]$Provider = $script:aiConfig.DefaultProvider
    )
    
    $systemMessage = "You are an expert software architect and developer. Create detailed implementation plans for software features and issues."
    
    $prompt = @"
Issue Title: $IssueTitle

Issue Description:
$IssueDescription

Tech Stack: $TechStack

Please create a detailed implementation plan including:

1. **Analysis**: Break down the requirements and identify key components
2. **Architecture**: Describe the overall approach and system design
3. **File Structure**: List the files that need to be created/modified
4. **Implementation Steps**: Provide step-by-step implementation guide
5. **Testing Strategy**: Outline testing approach
6. **Dependencies**: List any new dependencies needed
7. **Risk Assessment**: Identify potential challenges and mitigation strategies
8. **Timeline Estimate**: Provide realistic time estimates

Make the plan actionable and specific to the codebase structure.
"@
    
    return Invoke-AICompletion -Prompt $prompt -SystemMessage $systemMessage -Provider $Provider
}

function Generate-PRResponse {
    <#
    .SYNOPSIS
    Generate intelligent PR response using AI
    #>
    param(
        [Parameter(Mandatory=$true)]
        [string]$CommentBody,
        
        [Parameter(Mandatory=$true)]
        [string]$CommentAuthor,
        
        [string]$PRTitle = "",
        [string]$PRDescription = "",
        [string]$Provider = $script:aiConfig.DefaultProvider
    )
    
    $systemMessage = "You are a professional software developer responding to code review feedback. Be respectful, acknowledge valid points, and provide clear action plans."
    
    $prompt = @"
You received a code review comment from $CommentAuthor:

Comment: $CommentBody

PR Title: $PRTitle
PR Description: $PRDescription

Generate a professional, constructive response that:
1. Acknowledges the feedback
2. Addresses the specific concerns raised
3. Provides a clear action plan
4. Shows understanding of the issue
5. Maintains a positive, collaborative tone

Keep the response concise but thorough.
"@
    
    return Invoke-AICompletion -Prompt $prompt -SystemMessage $systemMessage -Provider $Provider
}

function Optimize-PerformanceWithAI {
    <#
    .SYNOPSIS
    Analyze and suggest performance optimizations using AI
    #>
    param(
        [Parameter(Mandatory=$true)]
        [string]$Code,
        
        [Parameter(Mandatory=$true)]
        [string]$Language,
        
        [string]$PerformanceContext = "general",
        [string]$Provider = $script:aiConfig.DefaultProvider
    )
    
    $systemMessage = "You are a performance optimization expert. Analyze code for performance bottlenecks and provide specific optimization recommendations."
    
    $prompt = @"
Analyze the following $Language code for performance optimization opportunities:

```$Language
$Code
```

Performance Context: $PerformanceContext

Please identify:
1. Performance bottlenecks
2. Memory usage issues
3. Algorithm inefficiencies
4. Resource utilization problems
5. Specific optimization recommendations
6. Expected performance improvements

Provide actionable suggestions with code examples where applicable.
"@
    
    return Invoke-AICompletion -Prompt $prompt -SystemMessage $systemMessage -Provider $Provider
}

function Clear-AICache {
    <#
    .SYNOPSIS
    Clear the AI response cache
    #>
    $script:aiCache.Clear()
    Write-ColorOutput "✅ AI cache cleared" "Green"
}

function Get-AICacheStats {
    <#
    .SYNOPSIS
    Get AI cache statistics
    #>
    $cacheCount = $script:aiCache.Count
    $cacheSize = 0
    
    foreach ($item in $script:aiCache.Values) {
        $cacheSize += $item.Response.Length
    }
    
    return @{
        ItemCount = $cacheCount
        TotalSizeBytes = $cacheSize
        TotalSizeKB = [Math]::Round($cacheSize / 1024, 2)
    }
}

# Export functions for use in other scripts
# Note: This file is dot-sourced, not imported as a module
