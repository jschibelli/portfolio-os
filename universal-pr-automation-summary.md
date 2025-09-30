# Universal PR Automation System

## 🚀 **Global/Reusable PR Automation**

You're absolutely right! The automation should be **global and reusable** for any PR, not just PR #210. Here's what we've built:

## 📁 **New Universal Scripts**

### 1. `scripts/universal-pr-automation-simple.ps1`
**Purpose**: Universal PR automation that works for any PR number
**Usage**: `powershell -File "scripts\universal-pr-automation-simple.ps1" -PRNumber "XXX"`

**Features**:
- ✅ **Any PR Number**: Works with any PR (210, 211, 212, etc.)
- ✅ **Project Configuration**: Sets Status, Priority, Size, Estimate, App, Area, Assignee
- ✅ **CR-GPT Monitoring**: Detects and responds to CR-GPT bot comments
- ✅ **Merge Readiness**: Checks draft status, mergeable, merge state, review decision
- ✅ **Status Updates**: Automatically updates project status based on conditions
- ✅ **Response Generation**: Creates threaded replies for CR-GPT comments
- ✅ **Merge Guidance**: Provides clear next steps and merge commands

## 🎯 **How to Use for Any PR**

### For PR #210 (Enhanced Toolbar):
```powershell
powershell -File "scripts\universal-pr-automation-simple.ps1" -PRNumber "210"
```

### For PR #211 (Any other PR):
```powershell
powershell -File "scripts\universal-pr-automation-simple.ps1" -PRNumber "211"
```

### For PR #212 (Another PR):
```powershell
powershell -File "scripts\universal-pr-automation-simple.ps1" -PRNumber "212"
```

## 🔧 **Customizable Parameters**

```powershell
powershell -File "scripts\universal-pr-automation-simple.ps1" `
  -PRNumber "210" `
  -Status "In progress" `
  -Priority "P1" `
  -Size "M" `
  -Estimate 3 `
  -App "Portfolio Site" `
  -Area "Frontend" `
  -Assign "jschibelli"
```

## 📊 **What It Does for Any PR**

1. **Analyzes PR**: Gets title, status, author, comments
2. **Configures Project**: Sets all project fields automatically
3. **Monitors CR-GPT**: Detects CR-GPT bot comments
4. **Generates Responses**: Creates intelligent threaded replies
5. **Checks Merge Readiness**: Verifies all merge requirements
6. **Updates Status**: Changes project status based on conditions
7. **Provides Guidance**: Shows next steps and merge commands

## 🎯 **Updated Prompt Library**

Your `prompts/github-complete-prompt-list.md` now includes:

```
Universal PR Automation
- Universal PR automation: <PR_NUMBER>. Configure project fields, monitor CR‑GPT, generate responses, check merge readiness, provide guidance for any PR.
```

## 🚀 **Usage Examples**

### Quick PR Automation:
```
Universal PR automation: 210. Configure project fields, monitor CR‑GPT, generate responses, check merge readiness, provide guidance.
```

### Custom PR Automation:
```
Universal PR automation: 211 -Status "In review" -Priority "P0" -Size "L". Configure project fields, monitor CR‑GPT, generate responses, check merge readiness, provide guidance.
```

## ✅ **Benefits of Universal System**

1. **Reusable**: Works for any PR number
2. **Consistent**: Same automation for all PRs
3. **Customizable**: Adjustable parameters
4. **Integrated**: Uses your existing infrastructure
5. **Scalable**: Easy to extend for new features

## 🔄 **Integration with Existing System**

```
Your Existing Infrastructure
├── auto-configure-pr.ps1 ← Used by universal automation
├── cr-gpt-analyzer.ps1 ← Leveraged for analysis
├── auto-response-generator.ps1 ← Built upon
└── prompts/github-complete-prompt-list.md ← Enhanced

New Universal System
├── universal-pr-automation-simple.ps1 ← Works for any PR
├── Enhanced prompt library ← Updated with universal automation
└── Universal documentation ← Complete usage guide
```

## 🎉 **Result**

Now you have a **global, reusable PR automation system** that:
- ✅ Works for any PR number
- ✅ Uses your existing infrastructure
- ✅ Provides consistent automation
- ✅ Is easily customizable
- ✅ Integrates with your prompt library

**Usage**: Just run `Universal PR automation: <PR_NUMBER>` and it handles everything automatically! 🚀
