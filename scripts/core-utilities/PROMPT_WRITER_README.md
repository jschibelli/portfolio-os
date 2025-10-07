# AI Prompt Writer Generator

## 🎯 Overview

The **Prompt Writer Generator** is an intelligent script analyzer that examines your Portfolio OS scripts and generates corresponding AI prompts. These prompts can be used with AI assistants (like ChatGPT, Claude, etc.) to get specialized help for working with your specific scripts.

## 🚀 What It Does

### **Script Analysis**
- **Analyzes PowerShell scripts** to understand their structure, parameters, functions, and purpose
- **Categorizes scripts** by type (Agent Management, PR Management, Issue Management, etc.)
- **Determines complexity** (Low, Medium, High) based on code metrics
- **Extracts dependencies** and integration points

### **Prompt Generation**
- **Creates specialized AI prompts** tailored to each script's functionality
- **Generates multiple prompt types** for different use cases
- **Provides context-aware assistance** for working with your scripts
- **Includes practical examples** and usage scenarios

## 📋 Prompt Types Generated

### 1. **Workflow Prompts**
- Help users understand and use scripts effectively
- Provide examples and troubleshooting guidance
- Explain integration with other Portfolio OS tools

### 2. **Analysis Prompts**
- Help interpret script output and results
- Identify patterns and trends in data
- Provide actionable insights and recommendations

### 3. **Automation Prompts**
- Design automated workflows using scripts
- Integrate with CI/CD pipelines and GitHub Actions
- Optimize performance and monitoring

### 4. **Management Prompts**
- Coordinate team workflows and resource allocation
- Manage projects and dependencies
- Optimize team productivity and quality

### 5. **Documentation Prompts**
- Create comprehensive documentation for scripts
- Write usage guides and tutorials
- Improve developer experience

## 🛠️ Usage

### **Basic Usage**
```powershell
# Analyze a single script
.\generate-prompt-writer.ps1 -ScriptPath "scripts/agent-management/assign-agent-worktree.ps1"

# Analyze all scripts in the project
.\generate-prompt-writer.ps1 -AnalyzeAll

# Generate only workflow prompts
.\generate-prompt-writer.ps1 -AnalyzeAll -PromptType workflow

# Custom output directory
.\generate-prompt-writer.ps1 -AnalyzeAll -OutputDir "prompts/custom"
```

### **Advanced Usage**
```powershell
# Dry run to see what would be generated
.\generate-prompt-writer.ps1 -AnalyzeAll -DryRun

# Generate specific prompt types
.\generate-prompt-writer.ps1 -AnalyzeAll -PromptType automation

# Include examples in prompts
.\generate-prompt-writer.ps1 -AnalyzeAll -IncludeExamples
```

## 📁 Output Structure

```
prompts/generated/
├── assign-agent-worktree-workflow-prompt.md
├── assign-agent-worktree-analysis-prompt.md
├── assign-agent-worktree-automation-prompt.md
├── assign-agent-worktree-management-prompt.md
├── assign-agent-worktree-documentation-prompt.md
├── docs-updater-workflow-prompt.md
├── docs-updater-analysis-prompt.md
└── ... (more prompts for each script)
```

## 🎯 Example Generated Prompt

### **Workflow Prompt Example**
```markdown
# AI Workflow Assistant Prompt

## Role
You are an AI assistant specialized in helping developers work with the **Agent Management** system in Portfolio OS.

## Context
The user is working with the **assign-agent-worktree.ps1** script, which is a **medium** complexity **agent management** tool.

## Script Purpose
Automatically assigns issues to the correct agent and switches to their work tree

## Parameters
The script accepts the following parameters:
- **$IssueNumber** (Required): The issue number to assign
- **$DryRun** (Optional): Preview changes without executing
- **$Force** (Optional): Force assignment even if conflicts exist

## Functions Available
- **Find-OptimalAgent**: Determines the best agent for an issue
- **Assign-IssueToAgent**: Assigns the issue to the selected agent
- **Switch-ToWorkTree**: Switches to the agent's work tree

## Your Tasks
1. Help the user understand what this script does and when to use it
2. Provide examples of how to run the script with different parameters
3. Troubleshoot issues when the script doesn't work as expected
4. Suggest improvements or alternative approaches when appropriate
5. Explain the workflow and how it fits into the larger Portfolio OS system
```

## 🔧 Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `-ScriptPath` | Path to a single script to analyze | "" |
| `-OutputDir` | Directory to save generated prompts | "prompts/generated" |
| `-PromptType` | Type of prompts to generate | "all" |
| `-AnalyzeAll` | Analyze all scripts in the project | $false |
| `-IncludeExamples` | Include usage examples in prompts | $false |
| `-DryRun` | Preview what would be generated | $false |

### **Prompt Types**
- `all` - Generate all prompt types
- `workflow` - Workflow assistance prompts
- `analysis` - Analysis and interpretation prompts
- `automation` - Automation and integration prompts
- `management` - Management and coordination prompts
- `documentation` - Documentation creation prompts

## 🎯 Use Cases

### **For Developers**
- Get AI assistance specifically tailored to your scripts
- Understand complex scripts with AI help
- Troubleshoot script issues with contextual guidance
- Learn best practices for script usage

### **For Teams**
- Provide consistent AI assistance across the team
- Create standardized help for common workflows
- Improve onboarding for new team members
- Maintain up-to-date AI assistance as scripts evolve

### **For Documentation**
- Generate comprehensive documentation prompts
- Create consistent documentation standards
- Automate documentation creation workflows
- Improve developer experience

## 🚀 Integration with AI Assistants

### **ChatGPT Integration**
1. Copy a generated prompt into ChatGPT
2. The AI will understand your specific script context
3. Ask questions like "How do I run this script with custom parameters?"
4. Get tailored, actionable advice

### **Claude Integration**
1. Use the prompts with Claude for specialized assistance
2. Get detailed explanations of script functionality
3. Receive troubleshooting help for specific issues
4. Get suggestions for workflow improvements

### **Custom AI Integration**
1. Use prompts as system messages for custom AI applications
2. Integrate with internal AI tools and workflows
3. Create specialized AI assistants for your scripts
4. Build automated help systems

## 📊 Analysis Features

### **Script Metrics**
- **Line count** and complexity assessment
- **Parameter analysis** with validation rules
- **Function extraction** and categorization
- **Dependency mapping** and integration points

### **Context Understanding**
- **Category detection** (Agent Management, PR Management, etc.)
- **Purpose extraction** from comments and structure
- **Usage pattern analysis** from parameter definitions
- **Integration point identification** from imports and calls

### **Intelligent Categorization**
- **Complexity scoring** based on multiple factors
- **Category assignment** based on folder structure
- **Purpose inference** from script content
- **Dependency analysis** for integration understanding

## 🔄 Workflow Integration

### **Continuous Integration**
```powershell
# Add to CI pipeline to keep prompts updated
.\generate-prompt-writer.ps1 -AnalyzeAll -OutputDir "prompts/ci-generated"
```

### **Development Workflow**
```powershell
# Generate prompts after script changes
.\generate-prompt-writer.ps1 -ScriptPath "scripts/my-new-script.ps1"
```

### **Documentation Pipeline**
```powershell
# Generate documentation prompts for new scripts
.\generate-prompt-writer.ps1 -AnalyzeAll -PromptType documentation
```

## 🎯 Benefits

### **For Individual Developers**
- **Contextual AI assistance** tailored to your specific scripts
- **Faster problem solving** with script-aware AI help
- **Better understanding** of complex scripts and workflows
- **Improved productivity** through AI-powered guidance

### **For Teams**
- **Consistent AI assistance** across all team members
- **Standardized help** for common workflows and scripts
- **Reduced onboarding time** for new team members
- **Improved knowledge sharing** through AI-assisted documentation

### **For Projects**
- **Self-documenting scripts** through AI prompt generation
- **Automated help system** that evolves with your code
- **Improved maintainability** through AI-assisted understanding
- **Better developer experience** with contextual assistance

## 📊 Current Status

Based on your Portfolio OS project:

- ✅ **55 PowerShell scripts** analyzed across 8 categories
- ✅ **275 potential prompts** (5 types × 55 scripts)
- ✅ **Fixed regex issues** for better dependency extraction
- ✅ **Improved parameter extraction** with type and validation info
- ✅ **Working dry-run mode** for safe testing

### Script Categories Analyzed
- **Agent Management** (11 scripts)
- **PR Management** (10 scripts)
- **Issue Management** (7 scripts)
- **Project Management** (3 scripts)
- **Monitoring** (4 scripts)
- **Housekeeping** (8 scripts)
- **Core Utilities** (5 scripts)
- **Others** (7 scripts)

## 🐛 Troubleshooting

### Common Issues

**Problem**: "No parameters extracted"
**Solution**: Ensure your script uses proper PowerShell parameter blocks with `[Parameter()]` attributes

**Problem**: "Wrong category assigned"
**Solution**: Move scripts to the correct folder (agent-management, pr-management, etc.)

**Problem**: "Dependencies not detected"
**Solution**: Use dot-sourcing syntax: `. ".\path\to\script.ps1"`

### Debug Mode

```powershell
# Run with -DryRun to see what would be generated
.\generate-prompt-writer.ps1 -AnalyzeAll -DryRun

# Check script analysis details
$VerbosePreference = "Continue"
.\generate-prompt-writer.ps1 -ScriptPath "path/to/script.ps1"
```

## 🚀 Future Enhancements

### **Planned Features**
- [ ] Custom prompt templates for specific use cases
- [ ] Integration with IDE for real-time AI assistance
- [ ] Automated prompt updates when scripts change
- [ ] Multi-language support (Python, JavaScript, TypeScript)
- [ ] Prompt versioning and change tracking
- [ ] Integration with LangChain/LlamaIndex

### **Advanced Analysis**
- [ ] Usage pattern detection from script execution
- [ ] Performance analysis and optimization suggestions
- [ ] Security analysis and vulnerability detection
- [ ] Integration mapping between related scripts
- [ ] Function call graph generation
- [ ] Automated testing prompt generation

## 📝 Recent Updates (2025-10-07)

- ✅ Fixed regex pattern for dependency extraction
- ✅ Improved parameter parsing to extract types and validation
- ✅ Added support for ValidateSet extraction
- ✅ Fixed issues with empty parameters and functions
- ✅ Improved prompt formatting and clarity
- ✅ Tested with all 55 Portfolio OS scripts

---

*This tool helps bridge the gap between your complex PowerShell scripts and AI assistance, making your development workflows more efficient and accessible.*

**Version**: 1.1.0  
**Last Updated**: 2025-10-07  
**Maintainer**: John Schibelli (john@schibelli.dev)
