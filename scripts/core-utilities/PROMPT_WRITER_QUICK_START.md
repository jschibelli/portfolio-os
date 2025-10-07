# Prompt Writer - Quick Start Guide

## 🚀 5-Minute Quick Start

### Generate Your First Prompt

```powershell
# Navigate to project root
cd C:\Users\jschi\OneDrive\Desktop\2025_portfolio\portfolio-os

# Generate a workflow prompt for a single script
.\scripts\core-utilities\generate-prompt-writer.ps1 `
    -ScriptPath "scripts/agent-management/start-multi-agent-e2e.ps1" `
    -PromptType workflow
```

✅ **Result**: Creates `scripts/core-utilities/prompts/generated/start-multi-agent-e2e-workflow-prompt.md`

### Preview What Would Be Generated

```powershell
# Dry run to see what prompts would be created
.\scripts\core-utilities\generate-prompt-writer.ps1 -AnalyzeAll -DryRun
```

✅ **Result**: Shows analysis for all 55 scripts without creating files

### Generate All Prompts for All Scripts

```powershell
# Generate all 5 prompt types for all 55 scripts = 275 prompts
.\scripts\core-utilities\generate-prompt-writer.ps1 -AnalyzeAll
```

✅ **Result**: Creates 275 prompts in `scripts/core-utilities/prompts/generated/`

## 📚 Common Commands

### Single Script Analysis

```powershell
# Workflow prompt only
.\scripts\core-utilities\generate-prompt-writer.ps1 `
    -ScriptPath "scripts/pr-management/configure-pr-auto.ps1" `
    -PromptType workflow

# All prompt types for one script
.\scripts\core-utilities\generate-prompt-writer.ps1 `
    -ScriptPath "scripts/monitoring/automation-metrics.ps1" `
    -PromptType all
```

### Batch Analysis

```powershell
# Generate workflow prompts for all scripts
.\scripts\core-utilities\generate-prompt-writer.ps1 `
    -AnalyzeAll `
    -PromptType workflow

# Generate automation prompts for all scripts
.\scripts\core-utilities\generate-prompt-writer.ps1 `
    -AnalyzeAll `
    -PromptType automation

# Generate all prompts with custom output directory
.\scripts\core-utilities\generate-prompt-writer.ps1 `
    -AnalyzeAll `
    -OutputDir "prompts/custom"
```

## 🎯 Prompt Types

| Type | Purpose | When to Use |
|------|---------|-------------|
| `workflow` | Day-to-day script usage | Running scripts, understanding parameters |
| `analysis` | Interpreting results | Analyzing script output, finding patterns |
| `automation` | Building workflows | CI/CD, scheduling, automation design |
| `management` | Team coordination | Resource allocation, project management |
| `documentation` | Creating docs | Writing guides, API docs, tutorials |
| `all` | Everything above | Complete prompt generation |

## 💡 Usage Examples

### Example 1: Help Me Use This Script

```powershell
# Generate workflow prompt
.\scripts\core-utilities\generate-prompt-writer.ps1 `
    -ScriptPath "scripts/project-management/manage-projects.ps1" `
    -PromptType workflow

# Copy the generated prompt to your AI assistant
# Ask: "How do I add issues with custom priority?"
```

### Example 2: Build Automation Workflows

```powershell
# Generate automation prompt
.\scripts\core-utilities\generate-prompt-writer.ps1 `
    -ScriptPath "scripts/automation/pr-agent-assignment-workflow.ps1" `
    -PromptType automation

# Use with AI to design CI/CD pipelines
```

### Example 3: Create Documentation

```powershell
# Generate documentation prompt
.\scripts\core-utilities\generate-prompt-writer.ps1 `
    -ScriptPath "scripts/core-utilities/docs-updater.ps1" `
    -PromptType documentation

# Use with AI to write comprehensive docs
```

## 🔍 Understanding Output

### Generated Prompt Structure

Each prompt includes:
1. **Role** - AI's area of expertise
2. **Context** - Script being worked with
3. **Purpose** - What the script does
4. **Parameters** - All script parameters with types
5. **Functions** - Custom functions available
6. **Dependencies** - Required scripts/modules
7. **Usage** - How to run the script
8. **Guidelines** - How AI should help

### Example Output Location

```
scripts/core-utilities/prompts/generated/
├── start-multi-agent-e2e-workflow-prompt.md
├── start-multi-agent-e2e-analysis-prompt.md
├── start-multi-agent-e2e-automation-prompt.md
├── start-multi-agent-e2e-management-prompt.md
└── start-multi-agent-e2e-documentation-prompt.md
```

## 🤖 Using Generated Prompts

### With Cursor/Claude

1. Generate prompt: `.\scripts\core-utilities\generate-prompt-writer.ps1 -ScriptPath "your-script.ps1"`
2. Open generated `.md` file
3. Copy prompt content
4. Paste into Cursor chat or Claude
5. Ask questions about your script!

### Example AI Conversation

```
[Load workflow prompt for manage-projects.ps1]

You: How do I add issues 250-255 to the project with P1 priority?

AI: Use the -Issues parameter with an array and -Priority P1:

.\scripts\project-management\manage-projects.ps1 `
    -Operation add `
    -Issues @(250, 251, 252, 253, 254, 255) `
    -Priority P1 `
    -Preset blog

This adds all issues with P1 (high) priority using the blog preset.
```

## 📊 Your Portfolio OS Scripts

You have **55 PowerShell scripts** that can generate **275 prompts**:

| Category | Scripts | Prompts (5 types each) |
|----------|---------|------------------------|
| Agent Management | 11 | 55 |
| PR Management | 10 | 50 |
| Issue Management | 7 | 35 |
| Project Management | 3 | 15 |
| Monitoring | 4 | 20 |
| Housekeeping | 8 | 40 |
| Core Utilities | 5 | 25 |
| Others | 7 | 35 |
| **Total** | **55** | **275** |

## ⚡ Pro Tips

### Tip 1: Test First
```powershell
# Always test with -DryRun first
.\scripts\core-utilities\generate-prompt-writer.ps1 -ScriptPath "script.ps1" -DryRun
```

### Tip 2: Target Specific Categories
```powershell
# Generate prompts for specific script categories
.\scripts\core-utilities\generate-prompt-writer.ps1 `
    -ScriptPath "scripts/agent-management/*.ps1" `
    -PromptType all
```

### Tip 3: Organize Output
```powershell
# Use custom directories for different purposes
.\scripts\core-utilities\generate-prompt-writer.ps1 `
    -AnalyzeAll `
    -OutputDir "prompts/production"
```

## 🐛 Quick Troubleshooting

**Issue**: Parameters not extracted  
**Fix**: Ensure script has proper `param()` block with `[Parameter()]` attributes

**Issue**: Wrong category  
**Fix**: Move script to correct folder (agent-management, pr-management, etc.)

**Issue**: Script error  
**Fix**: Run `.\scripts\core-utilities\generate-prompt-writer.ps1` without parameters to see usage

## 📖 Next Steps

1. ✅ Generate prompts for scripts you use often
2. ✅ Try them with your AI assistant
3. ✅ Customize prompts for your needs
4. ✅ Share with your team
5. ✅ Regenerate when scripts change

## 📞 Need Help?

- **Full Documentation**: `scripts/core-utilities/PROMPT_WRITER_README.md`
- **Issues**: Create GitHub issue
- **Contact**: john@schibelli.dev

---

**Quick Reference**: `.\scripts\core-utilities\generate-prompt-writer.ps1 -ScriptPath "your-script.ps1" -PromptType workflow`

*Generated: 2025-10-07 | Version: 1.1.0*

