# Prompt Writer Script Generator
# Analyzes existing scripts and generates corresponding AI prompts
# Usage: .\scripts\core-utilities\generate-prompt-writer.ps1 -ScriptPath <PATH> [-OutputDir <DIR>] [-PromptType <TYPE>] [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [string]$ScriptPath = "",
    
    [Parameter(Mandatory=$false)]
    [string]$OutputDir = "prompts/generated",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("all", "workflow", "analysis", "automation", "management", "documentation")]
    [string]$PromptType = "all",
    
    [Parameter(Mandatory=$false)]
    [switch]$AnalyzeAll,
    
    [Parameter(Mandatory=$false)]
    [switch]$IncludeExamples,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

function Show-Banner {
    Write-Host "===============================================" -ForegroundColor Blue
    Write-Host "      AI Prompt Writer Generator" -ForegroundColor Blue
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

function Get-ScriptAnalysis {
    param([string]$ScriptPath)
    
    if (-not (Test-Path $ScriptPath)) {
        Write-ColorOutput "Script not found: $ScriptPath" "Red"
        return $null
    }
    
    $content = Get-Content $ScriptPath -Raw
    $fileName = Split-Path $ScriptPath -Leaf
    $folder = Split-Path (Split-Path $ScriptPath -Parent) -Leaf
    
    # Analyze script structure
    $analysis = @{
        FileName = $fileName
        Folder = $folder
        FullPath = $ScriptPath
        Content = $content
        Parameters = @()
        Functions = @()
        Purpose = ""
        Category = ""
        Complexity = "Medium"
        Dependencies = @()
        Usage = ""
        Examples = @()
    }
    
    # Extract parameters
    $paramMatches = [regex]::Matches($content, 'param\s*\(([\s\S]*?)\n\)', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($paramMatches.Count -gt 0) {
        $paramBlock = $paramMatches[0].Groups[1].Value
        
        # Extract all parameter declarations
        $paramPattern = '\[Parameter[^\]]*\]\s*(?:\[[^\]]+\]\s*)*\[([^\]]+)\]\s*\$(\w+)'
        $paramMatches2 = [regex]::Matches($paramBlock, $paramPattern, [System.Text.RegularExpressions.RegexOptions]::Multiline)
        
        foreach ($match in $paramMatches2) {
            $paramType = $match.Groups[1].Value
            $paramName = $match.Groups[2].Value
            $fullMatch = $match.Value
            
            $isMandatory = $fullMatch -match 'Mandatory\s*=\s*\$true'
            $hasValidation = $fullMatch -match 'ValidateSet'
            
            # Extract ValidateSet values if present
            $validValues = @()
            if ($hasValidation -and $fullMatch -match 'ValidateSet\("([^"]+)"\)') {
                $validValues = $matches[1] -split '",\s*"'
            }
            
            $analysis.Parameters += @{
                Name = $paramName
                Type = $paramType
                Mandatory = $isMandatory
                HasValidation = $hasValidation
                ValidValues = $validValues
                Line = $fullMatch.Trim()
            }
        }
    }
    
    # Extract functions
    $functionMatches = [regex]::Matches($content, 'function\s+(\w+)\s*\{', [System.Text.RegularExpressions.RegexOptions]::Multiline)
    foreach ($match in $functionMatches) {
        $analysis.Functions += $match.Groups[1].Value
    }
    
    # Determine purpose from comments and structure
    if ($content -match '# ([^#\n]+)') {
        $analysis.Purpose = $matches[1].Trim()
    }
    
    # Determine category from folder and filename
    $categoryMap = @{
        "agent-management" = "Agent Management"
        "pr-management" = "PR Management"
        "issue-management" = "Issue Management"
        "project-management" = "Project Management"
        "monitoring" = "Monitoring"
        "housekeeping" = "Housekeeping"
        "core-utilities" = "Core Utilities"
        "automation" = "Automation"
        "documentation" = "Documentation"
    }
    
    if ($categoryMap.ContainsKey($folder)) {
        $analysis.Category = $categoryMap[$folder]
    }
    
    # Determine complexity
    $lineCount = ($content -split '\n').Count
    $functionCount = $analysis.Functions.Count
    $paramCount = $analysis.Parameters.Count
    
    if ($lineCount -gt 500 -or $functionCount -gt 10 -or $paramCount -gt 8) {
        $analysis.Complexity = "High"
    } elseif ($lineCount -lt 100 -and $functionCount -lt 3 -and $paramCount -lt 3) {
        $analysis.Complexity = "Low"
    }
    
    # Extract dependencies (PowerShell script imports like '. "path/to/script.ps1"')
    $pattern = '\.\s+"([^"]+\.ps1)"'
    $importMatches = [regex]::Matches($content, $pattern)
    foreach ($match in $importMatches) {
        $depPath = $match.Groups[1].Value
        if (-not $analysis.Dependencies.Contains($depPath)) {
            $analysis.Dependencies += $depPath
        }
    }
    # Also check for single quotes
    $pattern2 = "\.\s+'([^']+\.ps1)'"
    $importMatches2 = [regex]::Matches($content, $pattern2)
    foreach ($match in $importMatches2) {
        $depPath = $match.Groups[1].Value
        if (-not $analysis.Dependencies.Contains($depPath)) {
            $analysis.Dependencies += $depPath
        }
    }
    
    # Extract usage examples
    if ($content -match 'Usage:\s*([^\n]+)') {
        $analysis.Usage = $matches[1].Trim()
    }
    
    return $analysis
}

function Generate-WorkflowPrompt {
    param([object]$Analysis)
    
    $prompt = @"
# AI Workflow Assistant Prompt

## Role
You are an AI assistant specialized in helping developers work with the **$($Analysis.Category)** system in Portfolio OS. You understand PowerShell scripting, GitHub workflows, and automated project management.

## Context
The user is working with the **$($Analysis.FileName)** script, which is a **$($Analysis.Complexity.ToLower())** complexity **$($Analysis.Category.ToLower())** tool.

## Script Purpose
$($Analysis.Purpose)

## Script Location
- **File**: `$($Analysis.FullPath)`
- **Category**: $($Analysis.Category)
- **Complexity**: $($Analysis.Complexity)

## Parameters
The script accepts the following parameters:
"@

    if ($Analysis.Parameters.Count -gt 0) {
        foreach ($param in $Analysis.Parameters) {
            $mandatory = if ($param.Mandatory) { "Required" } else { "Optional" }
            $typeInfo = if ($param.Type) { "[$($param.Type)]" } else { "" }
            $validInfo = if ($param.HasValidation -and $param.ValidValues.Count -gt 0) { 
                " (Valid values: $($param.ValidValues -join ', '))" 
            } else { 
                "" 
            }
            $prompt += "`n- **`$$($param.Name)`** $typeInfo ($mandatory)$validInfo"
        }
    } else {
        $prompt += "`n- No parameters defined"
    }

    $prompt += @"

## Functions Available
"@

    if ($Analysis.Functions.Count -gt 0) {
        $prompt += "`nThe script includes these functions:"
        foreach ($func in $Analysis.Functions) {
            $prompt += "`n- **$func**"
        }
    } else {
        $prompt += "`nThis script does not define custom functions."
    }

    if ($Analysis.Dependencies.Count -gt 0) {
        $prompt += @"

## Dependencies
The script depends on:
"@
        foreach ($dep in $Analysis.Dependencies) {
            $prompt += "`n- ``$dep``"
        }
    }

    $prompt += @"

## Usage Instructions
$($Analysis.Usage)

## Your Tasks
1. **Help the user understand** what this script does and when to use it
2. **Provide examples** of how to run the script with different parameters
3. **Troubleshoot issues** when the script doesn't work as expected
4. **Suggest improvements** or alternative approaches when appropriate
5. **Explain the workflow** and how it fits into the larger Portfolio OS system

## Response Guidelines
- Be specific and actionable
- Provide PowerShell code examples when helpful
- Explain the "why" behind recommendations
- Consider the script's complexity level in your explanations
- Reference related scripts in the same category when relevant

## Example Interactions
- "How do I run this script with custom parameters?"
- "What does this script do and when should I use it?"
- "I'm getting an error when running this script, can you help?"
- "How does this script integrate with other Portfolio OS tools?"

Remember: You're helping with a **$($Analysis.Category.ToLower())** tool that's part of a larger automated development workflow system.
"@

    return $prompt
}

function Generate-AnalysisPrompt {
    param([object]$Analysis)
    
    $prompt = @"
# AI Analysis Assistant Prompt

## Role
You are an AI assistant specialized in analyzing and interpreting results from Portfolio OS automation scripts. You understand data analysis, PowerShell output interpretation, and project management workflows.

## Context
The user has run the **$($Analysis.FileName)** script and needs help analyzing the results, understanding the output, or interpreting data patterns.

## Script Context
- **Script**: $($Analysis.FileName)
- **Category**: $($Analysis.Category)
- **Purpose**: $($Analysis.Purpose)
- **Complexity**: $($Analysis.Complexity)

## Analysis Capabilities
You can help with:

### Data Interpretation
- Parse and explain PowerShell script output
- Identify patterns in results
- Highlight important metrics or findings
- Compare results across different runs

### Output Analysis
- Explain what different output formats mean
- Help identify errors or warnings
- Suggest next steps based on results
- Validate that results are as expected

### Trend Analysis
- Compare current results with historical data
- Identify performance trends
- Spot anomalies or unusual patterns
- Predict potential issues

### Reporting
- Help format results for reports
- Generate summaries of findings
- Create visual representations of data
- Prepare findings for stakeholders

## Your Tasks
1. **Analyze script output** and explain what it means
2. **Identify patterns** or trends in the data
3. **Highlight important findings** that need attention
4. **Suggest actionable next steps** based on analysis
5. **Help format results** for different audiences

## Response Guidelines
- Focus on actionable insights
- Use clear, non-technical language when appropriate
- Provide context for why findings matter
- Suggest specific follow-up actions
- Highlight both positive and concerning findings

## Example Interactions
- "Can you analyze this script output and tell me what it means?"
- "What patterns do you see in these results?"
- "Are these results normal or do they indicate a problem?"
- "How should I present these findings to my team?"
- "What should I do next based on this analysis?"

Remember: You're helping interpret results from a **$($Analysis.Category.ToLower())** tool that's part of an automated development workflow.
"@

    return $prompt
}

function Generate-AutomationPrompt {
    param([object]$Analysis)
    
    $prompt = @"
# AI Automation Assistant Prompt

## Role
You are an AI assistant specialized in automating development workflows using Portfolio OS scripts. You understand PowerShell automation, GitHub workflows, CI/CD pipelines, and project management automation.

## Context
The user wants to automate workflows using the **$($Analysis.FileName)** script as part of a larger automation strategy.

## Automation Context
- **Script**: $($Analysis.FileName)
- **Category**: $($Analysis.Category)
- **Purpose**: $($Analysis.Purpose)
- **Complexity**: $($Analysis.Complexity)

## Automation Capabilities
You can help with:

### Workflow Design
- Design automated workflows using this script
- Integrate with other Portfolio OS tools
- Create multi-step automation sequences
- Design error handling and recovery strategies

### Integration Patterns
- Connect with GitHub Actions
- Integrate with CI/CD pipelines
- Set up scheduled automation
- Create event-driven automation

### Optimization
- Improve script performance
- Reduce manual intervention
- Optimize resource usage
- Minimize execution time

### Monitoring and Alerting
- Set up automation monitoring
- Create alerting for failures
- Design health checks
- Implement automated recovery

## Your Tasks
1. **Design automation workflows** using this script
2. **Suggest integration points** with other tools
3. **Help optimize** automation performance
4. **Design monitoring** and alerting strategies
5. **Create error handling** and recovery plans

## Response Guidelines
- Focus on practical automation solutions
- Consider the script's complexity in recommendations
- Provide specific implementation examples
- Explain the benefits of automation
- Consider maintenance and monitoring needs

## Example Interactions
- "How can I automate this script to run daily?"
- "What's the best way to integrate this with GitHub Actions?"
- "How can I set up monitoring for this automation?"
- "What error handling should I add to this workflow?"
- "How can I optimize this automation for better performance?"

Remember: You're helping create automation solutions using a **$($Analysis.Category.ToLower())** tool in the Portfolio OS ecosystem.
"@

    return $prompt
}

function Generate-ManagementPrompt {
    param([object]$Analysis)
    
    $prompt = @"
# AI Management Assistant Prompt

## Role
You are an AI assistant specialized in managing development projects, teams, and workflows using Portfolio OS management scripts. You understand project management, team coordination, resource allocation, and workflow optimization.

## Context
The user is managing development workflows using the **$($Analysis.FileName)** script as part of the Portfolio OS project management system.

## Management Context
- **Script**: $($Analysis.FileName)
- **Category**: $($Analysis.Category)
- **Purpose**: $($Analysis.Purpose)
- **Complexity**: $($Analysis.Complexity)

## Management Capabilities
You can help with:

### Project Management
- Plan and coordinate development activities
- Allocate resources and assign tasks
- Track progress and manage timelines
- Coordinate between team members and agents

### Workflow Management
- Optimize development workflows
- Manage dependencies and blockers
- Coordinate parallel development streams
- Ensure quality and consistency

### Resource Management
- Optimize agent assignments
- Balance workloads across team members
- Manage project priorities
- Coordinate resource allocation

### Quality Management
- Ensure consistent quality standards
- Manage code review processes
- Coordinate testing and validation
- Monitor and improve processes

## Your Tasks
1. **Help plan and coordinate** development activities
2. **Optimize workflow management** and resource allocation
3. **Suggest improvements** to project management processes
4. **Help resolve conflicts** and manage dependencies
5. **Provide guidance** on best practices and standards

## Response Guidelines
- Focus on practical management solutions
- Consider team dynamics and coordination needs
- Provide actionable management advice
- Explain the reasoning behind recommendations
- Consider scalability and sustainability

## Example Interactions
- "How should I coordinate multiple agents working on related tasks?"
- "What's the best way to manage dependencies between different work streams?"
- "How can I optimize resource allocation across the team?"
- "What workflow improvements would help our team be more efficient?"
- "How should I handle conflicts or blockers in the development process?"

Remember: You're helping manage development workflows using **$($Analysis.Category.ToLower())** tools in a complex, multi-agent development environment.
"@

    return $prompt
}

function Generate-DocumentationPrompt {
    param([object]$Analysis)
    
    $prompt = @"
# AI Documentation Assistant Prompt

## Role
You are an AI assistant specialized in creating and maintaining documentation for Portfolio OS scripts and workflows. You understand technical writing, documentation standards, and developer experience optimization.

## Context
The user needs help with documentation for the **$($Analysis.FileName)** script, including usage guides, API documentation, and integration instructions.

## Documentation Context
- **Script**: $($Analysis.FileName)
- **Category**: $($Analysis.Category)
- **Purpose**: $($Analysis.Purpose)
- **Complexity**: $($Analysis.Complexity)

## Documentation Capabilities
You can help with:

### Technical Documentation
- Create comprehensive usage guides
- Document API interfaces and parameters
- Write integration instructions
- Create troubleshooting guides

### Developer Experience
- Write clear, actionable documentation
- Create examples and tutorials
- Design intuitive user interfaces
- Improve developer onboarding

### Maintenance Documentation
- Create maintenance procedures
- Document configuration options
- Write upgrade and migration guides
- Create troubleshooting runbooks

### Integration Documentation
- Document integration points
- Create API reference materials
- Write workflow documentation
- Create best practices guides

## Your Tasks
1. **Create comprehensive documentation** for the script
2. **Write clear usage examples** and tutorials
3. **Document integration points** with other tools
4. **Create troubleshooting guides** and FAQs
5. **Improve developer experience** through better documentation

## Response Guidelines
- Write clear, concise, and actionable content
- Use consistent terminology and formatting
- Include practical examples and use cases
- Consider different user skill levels
- Focus on solving real problems

## Example Interactions
- "How should I document this script for new developers?"
- "What examples should I include in the documentation?"
- "How can I make this documentation more user-friendly?"
- "What troubleshooting information should I include?"
- "How should I structure the API documentation?"

Remember: You're helping create documentation for a **$($Analysis.Category.ToLower())** tool that's part of a larger development ecosystem.
"@

    return $prompt
}

function Generate-PromptFile {
    param(
        [string]$PromptContent,
        [string]$FileName,
        [string]$OutputDir
    )
    
    if (-not (Test-Path $OutputDir)) {
        New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    }
    
    $outputPath = Join-Path $OutputDir $FileName
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would create: $outputPath" "Cyan"
        return
    }
    
    $PromptContent | Out-File -FilePath $outputPath -Encoding UTF8
    Write-ColorOutput "  ✅ Created: $outputPath" "Green"
}

function Process-SingleScript {
    param([string]$ScriptPath)
    
    Write-ColorOutput "Analyzing script: $ScriptPath" "Yellow"
    
    $analysis = Get-ScriptAnalysis -ScriptPath $ScriptPath
    if (-not $analysis) {
        return
    }
    
    Write-ColorOutput "  Script: $($analysis.FileName)" "White"
    Write-ColorOutput "  Category: $($analysis.Category)" "White"
    Write-ColorOutput "  Complexity: $($analysis.Complexity)" "White"
    Write-ColorOutput "  Parameters: $($analysis.Parameters.Count)" "White"
    Write-ColorOutput "  Functions: $($analysis.Functions.Count)" "White"
    Write-ColorOutput ""
    
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($analysis.FileName)
    
    # Clean up base name to avoid redundancy (remove common suffixes)
    $baseName = $baseName -replace '-(workflow|script|tool|util|helper)$', ''
    
    # Generate prompts based on type
    if ($PromptType -eq "all" -or $PromptType -eq "workflow") {
        $workflowPrompt = Generate-WorkflowPrompt -Analysis $analysis
        Generate-PromptFile -PromptContent $workflowPrompt -FileName "$baseName-workflow-prompt.md" -OutputDir $OutputDir
    }
    
    if ($PromptType -eq "all" -or $PromptType -eq "analysis") {
        $analysisPrompt = Generate-AnalysisPrompt -Analysis $analysis
        Generate-PromptFile -PromptContent $analysisPrompt -FileName "$baseName-analysis-prompt.md" -OutputDir $OutputDir
    }
    
    if ($PromptType -eq "all" -or $PromptType -eq "automation") {
        $automationPrompt = Generate-AutomationPrompt -Analysis $analysis
        Generate-PromptFile -PromptContent $automationPrompt -FileName "$baseName-automation-prompt.md" -OutputDir $OutputDir
    }
    
    if ($PromptType -eq "all" -or $PromptType -eq "management") {
        $managementPrompt = Generate-ManagementPrompt -Analysis $analysis
        Generate-PromptFile -PromptContent $managementPrompt -FileName "$baseName-management-prompt.md" -OutputDir $OutputDir
    }
    
    if ($PromptType -eq "all" -or $PromptType -eq "documentation") {
        $documentationPrompt = Generate-DocumentationPrompt -Analysis $analysis
        Generate-PromptFile -PromptContent $documentationPrompt -FileName "$baseName-documentation-prompt.md" -OutputDir $OutputDir
    }
}

function Process-AllScripts {
    param([string]$ScriptsDir)
    
    Write-ColorOutput "Scanning all scripts in: $ScriptsDir" "Yellow"
    
    $scriptFiles = Get-ChildItem -Path $ScriptsDir -Recurse -Filter "*.ps1" | Where-Object { $_.FullName -notlike "*node_modules*" }
    
    Write-ColorOutput "Found $($scriptFiles.Count) PowerShell scripts" "Green"
    Write-ColorOutput ""
    
    foreach ($script in $scriptFiles) {
        Process-SingleScript -ScriptPath $script.FullName
    }
}

# Main execution
Show-Banner

if ($AnalyzeAll) {
    Process-AllScripts -ScriptsDir "scripts"
} elseif (-not [string]::IsNullOrEmpty($ScriptPath)) {
    Process-SingleScript -ScriptPath $ScriptPath
} else {
    Write-ColorOutput "Please specify either -ScriptPath for a single script or -AnalyzeAll for all scripts" "Red"
    Write-ColorOutput ""
    Write-ColorOutput "Usage examples:" "Yellow"
    Write-ColorOutput "  .\generate-prompt-writer.ps1 -ScriptPath 'scripts/agent-management/assign-agent-worktree.ps1'" "White"
    Write-ColorOutput "  .\generate-prompt-writer.ps1 -AnalyzeAll -PromptType workflow" "White"
    Write-ColorOutput "  .\generate-prompt-writer.ps1 -AnalyzeAll -OutputDir 'prompts/custom' -DryRun" "White"
    exit 1
}

Write-ColorOutput ""
Write-ColorOutput "===============================================" -ForegroundColor Blue
Write-ColorOutput "      Prompt Generation Complete!" -ForegroundColor Blue
Write-ColorOutput "===============================================" -ForegroundColor Blue

if (-not $DryRun) {
    Write-ColorOutput "Generated prompts saved to: $OutputDir" "Green"
    Write-ColorOutput "You can now use these prompts with AI assistants to get specialized help!" "Green"
}
