# PowerShell Automation Scripts Documentation

## Overview

The Portfolio OS project includes a comprehensive suite of PowerShell automation scripts that provide local execution capabilities, intelligent coordination, and seamless integration with GitHub Actions workflows. These scripts form the backbone of the automation system, handling everything from issue management to multi-agent coordination.

## Script Architecture

### Core Script Categories

1. **Master Automation** - Central coordination and entry points
2. **Issue Management** - Issue processing and automation
3. **PR Management** - Pull request automation and monitoring
4. **Multi-Agent System** - Parallel development coordination
5. **Project Management** - GitHub project board integration
6. **Utility Scripts** - Supporting functions and helpers

## Master Automation Scripts

### 1. Master Automation (`master-automation.ps1`)

**Purpose**: Central entry point for all automation operations

**Location**: `scripts/master-automation.ps1`

### 2. Agent Status Update Scripts (NEW - P0 Fix)

**Purpose**: Allow agents to update project board status when working on issues

**Location**: `scripts/agent-status-update.ps1` and `scripts/agent-project-status-webhook.ps1`

**Usage**:
```powershell
# Direct method - Fast and immediate
.\scripts\agent-status-update.ps1 -IssueNumber 250 -Action start -AgentName "jason"

# Webhook method - Reliable with logging  
.\scripts\agent-project-status-webhook.ps1 -IssueNumber 250 -Action start -AgentName "jason"
```

**Available Actions**:
- `start` - Move issue to "In Progress"
- `complete` - Move issue to "Ready"
- `create-pr` - Move issue to "Ready" 
- `merge-pr` - Move issue to "Done"

**Usage**:
```powershell
.\scripts\master-automation.ps1 -Mode <MODE> [-Target <TARGET>] [-Options <OPTIONS>]
```

**Modes**:

#### Continuous Mode
```powershell
# Process multiple issues automatically
.\scripts\master-automation.ps1 -Mode continuous -MaxIssues 10

# With watch mode for continuous monitoring
.\scripts\master-automation.ps1 -Mode continuous -MaxIssues 10 -Watch

# Dry run to preview actions
.\scripts\master-automation.ps1 -Mode continuous -MaxIssues 5 -DryRun
```

**Features**:
- Continuous issue processing from Backlog → In progress → In review → Ready → Ready for Merge → Done → Merged
- Automatic issue assignment and prioritization
- Workload balancing across agents
- Real-time monitoring and status updates
- Error handling and recovery mechanisms

#### Single Issue Mode
```powershell
# Process specific issue
.\scripts\master-automation.ps1 -Mode single-issue -Target 123

# With specific options
.\scripts\master-automation.ps1 -Mode single-issue -Target 123 -Options "priority=P1"
```

**Features**:
- Targeted issue processing
- Custom configuration options
- Detailed logging and reporting
- Integration with existing workflows

#### Single PR Mode
```powershell
# Monitor specific PR
.\scripts\master-automation.ps1 -Mode single-pr -Target 456

# With monitoring options
.\scripts\master-automation.ps1 -Mode single-pr -Target 456 -Options "watch"
```

**Features**:
- PR monitoring and automation
- CR-GPT integration
- Merge readiness assessment
- Status tracking and updates

#### Queue Management Mode
```powershell
# Manage issue queues
.\scripts\master-automation.ps1 -Mode queue -Target "blog" -Options "status"

# Process queue items
.\scripts\master-automation.ps1 -Mode queue -Target "dashboard" -Options "process"
```

**Features**:
- Queue creation and management
- Priority-based processing
- Dependency management
- Load balancing

#### Status Mode
```powershell
# Check system status
.\scripts\master-automation.ps1 -Mode status

# Detailed status with options
.\scripts\master-automation.ps1 -Mode status -Options "detailed"
```

**Features**:
- System health checks
- Agent status monitoring
- Performance metrics
- Error reporting

#### Monitor Mode
```powershell
# Real-time monitoring
.\scripts\master-automation.ps1 -Mode monitor

# With specific focus
.\scripts\master-automation.ps1 -Mode monitor -Options "agents"
```

**Features**:
- Real-time system monitoring
- Live status updates
- Performance tracking
- Alert management

### 2. Multi-Agent Automation (`multi-agent-automation.ps1`)

**Purpose**: Orchestrates multi-agent workflows for parallel development

**Location**: `scripts/multi-agent-automation.ps1`

**Usage**:
```powershell
.\scripts\multi-agent-automation.ps1 -Mode <MODE> [-Agent <AGENT>] [-Options <OPTIONS>]
```

**Modes**:

#### Continuous Multi-Agent Mode
```powershell
# Start continuous multi-agent processing
.\scripts\multi-agent-automation.ps1 -Mode continuous -MaxIssues 10

# With watch mode
.\scripts\multi-agent-automation.ps1 -Mode continuous -MaxIssues 10 -Watch
```

**Features**:
- Parallel agent coordination
- Intelligent issue assignment
- Workload balancing
- Conflict prevention
- State synchronization

#### Single Issue Multi-Agent Mode
```powershell
# Process issue with optimal agent
.\scripts\multi-agent-automation.ps1 -Mode single-issue -Options 123

# Dry run to see agent assignment
.\scripts\multi-agent-automation.ps1 -Mode single-issue -Options 123 -DryRun
```

**Features**:
- Intelligent agent selection
- Issue analysis and categorization
- Optimal assignment algorithms
- Workflow execution

#### Agent Workflow Mode
```powershell
# Run specific agent workflow
.\scripts\multi-agent-automation.ps1 -Mode agent-workflow -Agent agent-frontend

# With specific options
.\scripts\multi-agent-automation.ps1 -Mode agent-workflow -Agent agent-content -Options "issue=123"
```

**Features**:
- Agent-specific workflow execution
- Custom configuration options
- Detailed progress tracking
- Error handling and recovery

#### Orchestrate Mode
```powershell
# Coordinate all agents
.\scripts\multi-agent-automation.ps1 -Mode orchestrate

# With specific parameters
.\scripts\multi-agent-automation.ps1 -Mode orchestrate -MaxIssues 5
```

**Features**:
- Multi-agent coordination
- Workload distribution
- Conflict resolution
- State management

#### Monitor Mode
```powershell
# Monitor multi-agent system
.\scripts\multi-agent-automation.ps1 -Mode monitor
```

**Features**:
- Real-time agent monitoring
- Performance tracking
- Status visualization
- Alert management

## Issue Management Scripts

### 1. Issue Queue Manager (`issue-queue-manager.ps1`)

**Purpose**: Manages issue queues, dependencies, and prioritization

**Location**: `scripts/issue-queue-manager.ps1`

**Usage**:
```powershell
.\scripts\issue-queue-manager.ps1 -Operation <OPERATION> [-Queue <QUEUE_NAME>] [-Priority <PRIORITY>]
```

**Operations**:

#### List Operation
```powershell
# List all queues
.\scripts\issue-queue-manager.ps1 -Operation list

# List specific queue
.\scripts\issue-queue-manager.ps1 -Operation list -Queue "blog"
```

**Features**:
- Queue status display
- Issue count and statistics
- Priority distribution
- Agent assignment status

#### Create Operation
```powershell
# Create new queue
.\scripts\issue-queue-manager.ps1 -Operation create -Queue "mobile" -Priority "P1"

# With specific configuration
.\scripts\issue-queue-manager.ps1 -Operation create -Queue "api" -Priority "P0" -MaxConcurrent 2
```

**Features**:
- Queue creation with configuration
- Priority and size settings
- Concurrency limits
- Integration with project board

#### Process Operation
```powershell
# Process queue items
.\scripts\issue-queue-manager.ps1 -Operation process -Queue "blog"

# With specific options
.\scripts\issue-queue-manager.ps1 -Operation process -Queue "dashboard" -MaxConcurrent 3
```

**Features**:
- Automated queue processing
- Priority-based execution
- Dependency resolution
- Progress tracking

#### Prioritize Operation
```powershell
# Reorder queue items
.\scripts\issue-queue-manager.ps1 -Operation prioritize -Queue "infra"

# With specific criteria
.\scripts\issue-queue-manager.ps1 -Operation prioritize -Queue "docs" -Priority "P1"
```

**Features**:
- Dynamic prioritization
- Criteria-based ordering
- Dependency consideration
- Manual override capabilities

#### Dependencies Operation
```powershell
# Manage dependencies
.\scripts\issue-queue-manager.ps1 -Operation dependencies -Queue "frontend"

# With specific issue
.\scripts\issue-queue-manager.ps1 -Operation dependencies -Queue "backend" -Options "issue=123"
```

**Features**:
- Dependency tracking
- Blocking issue identification
- Resolution guidance
- Impact analysis

#### Status Operation
```powershell
# Check queue status
.\scripts\issue-queue-manager.ps1 -Operation status

# Detailed status
.\scripts\issue-queue-manager.ps1 -Operation status -Queue "all"
```

**Features**:
- Comprehensive status reporting
- Performance metrics
- Bottleneck identification
- Optimization recommendations

### 2. Issue Implementation (`issue-implementation.ps1`)

**Purpose**: Implements specific issue requirements with intelligent automation

**Location**: `scripts/issue-implementation.ps1`

**Usage**:
```powershell
.\scripts\issue-implementation.ps1 -IssueNumber <NUMBER> [-Options <OPTIONS>]
```

**Features**:

#### Issue Analysis
- **Content Analysis**: Analyzes issue title, description, and labels
- **Complexity Assessment**: Determines implementation complexity
- **Skill Requirements**: Identifies required technical skills
- **Dependency Analysis**: Identifies related issues and dependencies

#### Implementation Planning
- **Task Breakdown**: Breaks down complex issues into manageable tasks
- **Resource Allocation**: Determines required resources and time
- **Risk Assessment**: Identifies potential risks and mitigation strategies
- **Testing Strategy**: Plans testing approach and validation

#### Code Generation
- **Template Generation**: Creates code templates based on issue type
- **Boilerplate Code**: Generates standard boilerplate code
- **Configuration Files**: Creates necessary configuration files
- **Documentation**: Generates initial documentation

#### Testing and Validation
- **Unit Tests**: Creates unit tests for new functionality
- **Integration Tests**: Sets up integration test scenarios
- **Validation Scripts**: Creates validation and verification scripts
- **Quality Checks**: Performs code quality and style checks

### 3. Issue Analyzer (`issue-analyzer.ps1`)

**Purpose**: Analyzes issues for complexity, requirements, and optimal assignment

**Location**: `scripts/issue-analyzer.ps1`

**Usage**:
```powershell
.\scripts\issue-analyzer.ps1 -IssueNumber <NUMBER> [-Options <OPTIONS>]
```

**Analysis Features**:

#### Complexity Analysis
- **Size Estimation**: Estimates issue size (XS, S, M, L, XL)
- **Effort Calculation**: Calculates estimated effort in hours
- **Risk Assessment**: Identifies potential risks and challenges
- **Dependency Mapping**: Maps issue dependencies

#### Skill Requirements
- **Technical Skills**: Identifies required technical skills
- **Domain Knowledge**: Determines required domain expertise
- **Tool Proficiency**: Identifies required tool knowledge
- **Experience Level**: Determines required experience level

#### Assignment Optimization
- **Agent Matching**: Matches issues to optimal agents
- **Workload Consideration**: Considers current agent workload
- **Skill Alignment**: Aligns issue requirements with agent skills
- **Priority Weighting**: Considers priority and urgency

### 4. Issue Creator (`issue-creator.ps1`)

**Purpose**: Creates issues programmatically with proper configuration

**Location**: `scripts/issue-creator.ps1`

**Usage**:
```powershell
.\scripts\issue-creator.ps1 -Title <TITLE> -Body <BODY> [-Options <OPTIONS>]
```

**Features**:

#### Issue Creation
- **Template-Based**: Uses predefined templates for different issue types
- **Auto-Configuration**: Automatically configures issue fields
- **Label Assignment**: Assigns appropriate labels
- **Project Integration**: Adds issues to project board

#### Template System
```powershell
# Bug report template
.\scripts\issue-creator.ps1 -Title "Bug: Login fails" -Body "User cannot login" -Template "bug"

# Feature request template
.\scripts\issue-creator.ps1 -Title "Feature: Dark mode" -Body "Add dark mode support" -Template "feature"

# Documentation template
.\scripts\issue-creator.ps1 -Title "Docs: API documentation" -Body "Document API endpoints" -Template "docs"
```

## PR Management Scripts

### 1. PR Automation Unified (`pr-automation-unified.ps1`)

**Purpose**: Unified PR processing and management with comprehensive automation

**Location**: `scripts/pr-automation-unified.ps1`

**Usage**:
```powershell
.\scripts\pr-automation-unified.ps1 -PRNumber <NUMBER> [-Operation <OPERATION>] [-Options <OPTIONS>]
```

**Operations**:

#### Analyze Operation
```powershell
# Analyze PR for changes and impact
.\scripts\pr-automation-unified.ps1 -PRNumber 123 -Operation analyze
```

**Features**:
- **Change Analysis**: Analyzes code changes and their impact
- **Risk Assessment**: Identifies potential risks and issues
- **Testing Requirements**: Determines required testing
- **Review Complexity**: Assesses review complexity

#### Configure Operation
```powershell
# Configure PR with project fields
.\scripts\pr-automation-unified.ps1 -PRNumber 123 -Operation configure
```

**Features**:
- **Field Configuration**: Sets appropriate project fields
- **Assignment Management**: Assigns reviewers and assignees
- **Label Management**: Assigns appropriate labels
- **Milestone Assignment**: Sets milestones and deadlines

#### Monitor Operation
```powershell
# Monitor PR for updates and changes
.\scripts\pr-automation-unified.ps1 -PRNumber 123 -Operation monitor
```

**Features**:
- **Status Tracking**: Tracks PR status changes
- **Review Monitoring**: Monitors review progress
- **Update Notifications**: Sends notifications for updates
- **Merge Readiness**: Checks merge readiness

#### Merge Operation
```powershell
# Prepare PR for merge
.\scripts\pr-automation-unified.ps1 -PRNumber 123 -Operation merge
```

**Features**:
- **Merge Readiness Check**: Verifies all merge requirements
- **Conflict Resolution**: Assists with conflict resolution
- **Deployment Preparation**: Prepares for deployment
- **Status Updates**: Updates project status

### 2. Auto-Configure PR (`auto-configure-pr.ps1`)

**Purpose**: Automatically configures PRs with project fields and assignments

**Location**: `scripts/auto-configure-pr.ps1`

**Usage**:
```powershell
.\scripts\auto-configure-pr.ps1 -PRNumber <NUMBER> [-Status <STATUS>] [-Priority <PRIORITY>]
```

**Configuration Features**:

#### Project Field Management
```powershell
# Default configuration
.\scripts\auto-configure-pr.ps1 -PRNumber 123

# Custom configuration
.\scripts\auto-configure-pr.ps1 -PRNumber 123 -Status "In progress" -Priority "P1" -Size "M"
```

**Fields Configured**:
- **Status**: Backlog, Ready, In progress, In review, Done
- **Priority**: P0, P1, P2, P3
- **Size**: XS, S, M, L, XL
- **App**: Portfolio Site, Dashboard, Docs, Chatbot
- **Area**: Frontend, Backend, Infra, Content, DX Tooling

#### Assignment Logic
- **Automatic Assignment**: Assigns based on PR content and history
- **Reviewer Selection**: Selects appropriate reviewers
- **Team Assignment**: Assigns to appropriate team members
- **Role-Based Assignment**: Assigns based on user roles

### 3. PR Aliases (`pr-aliases.ps1`)

**Purpose**: Provides convenient aliases and shortcuts for common PR operations

**Location**: `scripts/pr-aliases.ps1`

**Usage**:
```powershell
# Load aliases
. .\scripts\pr-aliases.ps1

# Use aliases
pr-status 123
pr-review 123
pr-merge 123
```

**Available Aliases**:

#### Status Aliases
```powershell
# Check PR status
pr-status <number>

# Get PR details
pr-details <number>

# List PRs
pr-list [options]
```

#### Review Aliases
```powershell
# Request review
pr-review <number>

# Check reviews
pr-reviews <number>

# Approve PR
pr-approve <number>
```

#### Merge Aliases
```powershell
# Check merge readiness
pr-ready <number>

# Merge PR
pr-merge <number>

# Close PR
pr-close <number>
```

## Multi-Agent System Scripts

### 1. Multi-Agent Work Tree System (`multi-agent-worktree-system.ps1`)

**Purpose**: Manages isolated work trees for parallel agent development

**Location**: `scripts/multi-agent-worktree-system.ps1`

**Usage**:
```powershell
.\scripts\multi-agent-worktree-system.ps1 -Operation <OPERATION> [-Agent <AGENT>] [-Options <OPTIONS>]
```

**Operations**:

#### Setup Operation
```powershell
# Initialize multi-agent system
.\scripts\multi-agent-worktree-system.ps1 -Operation setup
```

**Features**:
- **System Initialization**: Creates work tree directories
- **State File Creation**: Initializes state tracking
- **Configuration Setup**: Sets up agent configurations
- **Git Integration**: Configures git worktree support

#### Create Operation
```powershell
# Create work tree for specific agent
.\scripts\multi-agent-worktree-system.ps1 -Operation create -Agent agent-frontend
```

**Features**:
- **Work Tree Creation**: Creates isolated work tree
- **Branch Setup**: Sets up agent-specific branches
- **Configuration**: Applies agent-specific configuration
- **Integration**: Integrates with existing automation

#### Assign Operation
```powershell
# Assign issue to agent
.\scripts\multi-agent-worktree-system.ps1 -Operation assign -Agent agent-frontend -Options "issue=123"
```

**Features**:
- **Issue Assignment**: Assigns issues to specific agents
- **Conflict Prevention**: Prevents duplicate assignments
- **State Tracking**: Updates central state
- **Workflow Integration**: Integrates with agent workflows

#### Sync Operation
```powershell
# Sync all work trees
.\scripts\multi-agent-worktree-system.ps1 -Operation sync
```

**Features**:
- **Synchronization**: Syncs all work trees with develop
- **Conflict Resolution**: Resolves merge conflicts
- **State Updates**: Updates central state
- **Validation**: Validates sync results

#### Status Operation
```powershell
# Check system status
.\scripts\multi-agent-worktree-system.ps1 -Operation status

# Check specific agent
.\scripts\multi-agent-worktree-system.ps1 -Operation status -Agent agent-frontend
```

**Features**:
- **System Overview**: Shows overall system status
- **Agent Status**: Shows individual agent status
- **Work Tree Status**: Shows work tree status
- **Issue Assignments**: Shows current issue assignments

### 2. Agent Coordinator (`agent-coordinator.ps1`)

**Purpose**: Intelligent issue assignment and agent coordination

**Location**: `scripts/agent-coordinator.ps1`

**Usage**:
```powershell
.\scripts\agent-coordinator.ps1 -Operation <OPERATION> [-Target <TARGET>] [-Options <OPTIONS>]
```

**Operations**:

#### Auto-Assign Operation
```powershell
# Auto-assign issues to optimal agents
.\scripts\agent-coordinator.ps1 -Operation auto-assign -MaxIssues 10
```

**Features**:
- **Intelligent Assignment**: Uses AI to assign issues optimally
- **Workload Balancing**: Balances workload across agents
- **Skill Matching**: Matches issues to agent skills
- **Priority Consideration**: Considers issue priority

#### Balance-Load Operation
```powershell
# Balance agent workload
.\scripts\agent-coordinator.ps1 -Operation balance-load
```

**Features**:
- **Load Analysis**: Analyzes current agent workload
- **Redistribution**: Redistributes work for balance
- **Optimization**: Optimizes agent utilization
- **Conflict Resolution**: Resolves assignment conflicts

#### Claim-Issue Operation
```powershell
# Manually assign issue to agent
.\scripts\agent-coordinator.ps1 -Operation claim-issue -Target agent-frontend -Options "issue=123"
```

**Features**:
- **Manual Assignment**: Allows manual issue assignment
- **Conflict Checking**: Checks for assignment conflicts
- **Validation**: Validates assignment feasibility
- **State Updates**: Updates central state

#### Coordinate Operation
```powershell
# Coordinate all agents
.\scripts\agent-coordinator.ps1 -Operation coordinate
```

**Features**:
- **Multi-Agent Coordination**: Coordinates multiple agents
- **Workflow Synchronization**: Synchronizes agent workflows
- **Conflict Prevention**: Prevents agent conflicts
- **State Management**: Manages central state

#### Analyze Operation
```powershell
# Analyze issue for optimal assignment
.\scripts\agent-coordinator.ps1 -Operation analyze -Target "issue=123"
```

**Features**:
- **Issue Analysis**: Analyzes issue requirements
- **Agent Scoring**: Scores agents for assignment
- **Recommendation**: Provides assignment recommendations
- **Justification**: Explains assignment reasoning

### 3. Integrate Multi-Agent (`integrate-multi-agent.ps1`)

**Purpose**: Integrates multi-agent system with existing automation

**Location**: `scripts/integrate-multi-agent.ps1`

**Usage**:
```powershell
.\scripts\integrate-multi-agent.ps1 -Operation <OPERATION> [-Force] [-DryRun]
```

**Operations**:

#### Install Operation
```powershell
# Install multi-agent integration
.\scripts\integrate-multi-agent.ps1 -Operation install
```

**Features**:
- **System Installation**: Installs multi-agent system
- **Integration Setup**: Sets up integration with existing automation
- **Configuration**: Configures system settings
- **Validation**: Validates installation

#### Validate Operation
```powershell
# Validate multi-agent system
.\scripts\integrate-multi-agent.ps1 -Operation validate
```

**Features**:
- **System Validation**: Validates system components
- **Integration Check**: Checks integration status
- **Configuration Validation**: Validates configuration
- **Health Check**: Performs system health check

#### Migrate Operation
```powershell
# Migrate existing automation
.\scripts\integrate-multi-agent.ps1 -Operation migrate
```

**Features**:
- **Data Migration**: Migrates existing data
- **Configuration Migration**: Migrates configuration
- **State Migration**: Migrates system state
- **Validation**: Validates migration results

## Project Management Scripts

### 1. Project Manager (`project-manager.ps1`)

**Purpose**: GitHub project board management and automation

**Location**: `scripts/project-manager.ps1`

**Usage**:
```powershell
.\scripts\project-manager.ps1 -Operation <OPERATION> [-Options <OPTIONS>]
```

**Operations**:

#### Sync Operation
```powershell
# Sync project board with issues and PRs
.\scripts\project-manager.ps1 -Operation sync
```

**Features**:
- **Data Synchronization**: Syncs project board with GitHub data
- **Field Updates**: Updates project fields
- **Status Management**: Manages issue and PR status
- **Assignment Updates**: Updates assignments

#### Status Operation
```powershell
# Check project status
.\scripts\project-manager.ps1 -Operation status
```

**Features**:
- **Project Overview**: Shows project overview
- **Issue Statistics**: Shows issue statistics
- **PR Statistics**: Shows PR statistics
- **Progress Tracking**: Tracks project progress

#### Configure Operation
```powershell
# Configure project settings
.\scripts\project-manager.ps1 -Operation configure
```

**Features**:
- **Field Configuration**: Configures project fields
- **Workflow Setup**: Sets up project workflows
- **Integration Setup**: Sets up integrations
- **Notification Setup**: Sets up notifications

### 2. Project Status Monitor (`project-status-monitor.ps1`)

**Purpose**: Real-time project monitoring and status tracking

**Location**: `scripts/project-status-monitor.ps1`

**Usage**:
```powershell
.\scripts\project-status-monitor.ps1 -PRNumber <NUMBER> [-Options <OPTIONS>]
```

**Features**:

#### Status Monitoring
- **Real-time Updates**: Monitors status in real-time
- **Change Detection**: Detects status changes
- **Notification**: Sends notifications for changes
- **Logging**: Logs status changes

#### Progress Tracking
- **Issue Progress**: Tracks issue progress
- **PR Progress**: Tracks PR progress
- **Milestone Progress**: Tracks milestone progress
- **Sprint Progress**: Tracks sprint progress

#### Reporting
- **Status Reports**: Generates status reports
- **Progress Reports**: Generates progress reports
- **Performance Reports**: Generates performance reports
- **Trend Analysis**: Analyzes trends and patterns

### 3. Backfill Project Fields (`backfill-project-fields.ps1`)

**Purpose**: Backfills project fields for existing issues and PRs

**Location**: `scripts/backfill-project-fields.ps1`

**Usage**:
```powershell
.\scripts\backfill-project-fields.ps1 [-Options <OPTIONS>]
```

**Features**:

#### Field Backfilling
- **Automatic Detection**: Automatically detects missing fields
- **Intelligent Assignment**: Intelligently assigns field values
- **Bulk Processing**: Processes multiple items at once
- **Validation**: Validates field assignments

#### Field Mapping
```powershell
# Field mappings based on content analysis
$fieldMappings = @{
    Status = @{
        fieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"
        defaultOption = "f75ad846" # Backlog
    }
    Priority = @{
        fieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028qQ"
        defaultOption = "0a877460" # P1
    }
    Size = @{
        fieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028qU"
        defaultOption = "86db8eb3" # M
    }
}
```

## Utility Scripts

### 1. Branch Manager (`branch-manager.ps1`)

**Purpose**: Comprehensive branch management and naming

**Location**: `scripts/branch-manager.ps1`

**Usage**:
```powershell
.\scripts\branch-manager.ps1 -Operation <OPERATION> [-Issues <ISSUE_LIST>] [-Options <OPTIONS>]
```

**Operations**:

#### Create Operation
```powershell
# Create branches for issues
.\scripts\branch-manager.ps1 -Operation create -Issues @(123, 124, 125)
```

**Features**:
- **Branch Creation**: Creates branches from develop
- **Naming Convention**: Follows established naming conventions
- **Validation**: Validates branch names
- **Conflict Prevention**: Prevents naming conflicts

#### Rename Operation
```powershell
# Rename existing branches
.\scripts\branch-manager.ps1 -Operation rename -Issues @(123)
```

**Features**:
- **Branch Renaming**: Renames existing branches
- **Validation**: Validates new names
- **Update References**: Updates all references
- **Conflict Resolution**: Resolves naming conflicts

#### Validate Operation
```powershell
# Validate branch names
.\scripts\branch-manager.ps1 -Operation validate
```

**Features**:
- **Name Validation**: Validates branch naming
- **Convention Check**: Checks naming conventions
- **Issue Check**: Validates issue numbers
- **Recommendation**: Provides improvement recommendations

### 2. Code Quality Checker (`code-quality-checker.ps1`)

**Purpose**: Code quality analysis and reporting

**Location**: `scripts/code-quality-checker.ps1`

**Usage**:
```powershell
.\scripts\code-quality-checker.ps1 -PRNumber <NUMBER> [-Options <OPTIONS>]
```

**Features**:

#### Quality Analysis
- **Code Review**: Performs automated code review
- **Style Checking**: Checks code style and formatting
- **Complexity Analysis**: Analyzes code complexity
- **Security Scanning**: Performs security scans

#### Reporting
- **Quality Reports**: Generates quality reports
- **Recommendation**: Provides improvement recommendations
- **Trend Analysis**: Analyzes quality trends
- **Benchmarking**: Compares against benchmarks

### 3. Shared Utilities (`shared/github-utils.ps1`)

**Purpose**: Shared utility functions for GitHub operations

**Location**: `scripts/shared/github-utils.ps1`

**Features**:

#### GitHub API Functions
```powershell
# GitHub API wrapper functions
function Get-GitHubIssue($number) { ... }
function Update-GitHubIssue($number, $data) { ... }
function Create-GitHubPR($data) { ... }
function Update-GitHubPR($number, $data) { ... }
```

#### Project Management Functions
```powershell
# Project board functions
function Get-ProjectItems($projectId) { ... }
function Update-ProjectItem($itemId, $fields) { ... }
function Add-ProjectItem($projectId, $contentId) { ... }
```

#### Utility Functions
```powershell
# General utility functions
function Write-ColorOutput($message, $color) { ... }
function Get-ConfigValue($key) { ... }
function Set-ConfigValue($key, $value) { ... }
```

## Configuration and Setup

### Script Configuration

#### Environment Variables
```powershell
# Required environment variables
$env:GITHUB_TOKEN = "your_github_token"
$env:GH_TOKEN = "your_github_token"
$env:PROJECT_ID = "your_project_id"
```

#### Configuration Files
```json
{
  "github": {
    "token": "your_token",
    "projectId": "your_project_id",
    "baseBranch": "develop"
  },
  "agents": {
    "maxConcurrent": 5,
    "workTreeBasePath": "worktrees"
  },
  "automation": {
    "maxIssues": 10,
    "syncInterval": 300
  }
}
```

### Script Dependencies

#### Required Tools
- **PowerShell 7+**: Modern PowerShell features
- **Git**: Version control operations
- **GitHub CLI**: GitHub API operations
- **Node.js**: For some automation tools

#### Required Modules
```powershell
# Install required modules
Install-Module -Name PowerShellGet -Force
Install-Module -Name GitHub -Force
```

## Best Practices

### Script Development

1. **Error Handling**: Implement comprehensive error handling
2. **Logging**: Use structured logging for debugging
3. **Validation**: Validate all inputs and parameters
4. **Documentation**: Document all functions and parameters

### Performance Optimization

1. **Caching**: Implement caching for frequent operations
2. **Parallel Execution**: Use parallel execution where possible
3. **Resource Management**: Manage system resources efficiently
4. **Batch Operations**: Use batch operations for multiple items

### Security Considerations

1. **Token Management**: Secure token storage and usage
2. **Input Validation**: Validate all inputs to prevent injection
3. **Access Control**: Implement proper access controls
4. **Audit Logging**: Log all sensitive operations

### Maintenance

1. **Regular Updates**: Keep scripts and dependencies updated
2. **Testing**: Test scripts thoroughly before deployment
3. **Monitoring**: Monitor script performance and errors
4. **Documentation**: Keep documentation up to date

This comprehensive PowerShell automation system provides robust local execution capabilities, intelligent coordination, and seamless integration with GitHub Actions workflows, enabling efficient parallel development and comprehensive project management.
