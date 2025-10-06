# Issue Management Automation - Prompt Engineering Strategy

## 🎯 **Overview**

This document outlines a comprehensive prompt engineering strategy for the Portfolio OS issue management automation system. The strategy leverages AI agents to enhance existing PowerShell scripts and GitHub Actions workflows with intelligent decision-making capabilities.

## 🏗️ **Architecture Integration**

### **Current System Components**
- **GitHub Actions Workflows**: Event-driven automation (orchestrate-issues-prs.yml, pr-automation-optimized.yml)
- **PowerShell Scripts**: Local execution and coordination (issue-config-unified.ps1, issue-analyzer.ps1, project-manager.ps1)
- **Project Board Integration**: GitHub project management with field automation
- **CR-GPT Integration**: AI-powered code review automation
- **Multi-Agent Work Tree System**: Parallel development isolation

### **Prompt Engineering Enhancement Layer**
```
┌─────────────────────────────────────────────────────────────┐
│                    AI Agent Layer                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ Issue Analysis  │ │ PR Automation   │ │ Project Mgmt    │ │
│  │ Agent           │ │ Agent           │ │ Agent           │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│              Existing Automation Layer                     │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ GitHub Actions  │ │ PowerShell      │ │ Project Board   │ │
│  │ Workflows       │ │ Scripts         │ │ Integration     │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🧠 **Core Prompt Engineering Principles**

### **1. Context-Aware Decision Making**
- **Issue Classification**: Automatically categorize issues by type, priority, and complexity
- **Smart Field Assignment**: Use AI to determine optimal project field values
- **Dependency Detection**: Identify related issues and potential conflicts
- **Resource Allocation**: Optimize agent assignment based on workload and expertise

### **2. Adaptive Automation**
- **Learning from Patterns**: Improve automation based on historical data
- **Dynamic Configuration**: Adjust automation parameters based on project state
- **Error Recovery**: Intelligent handling of automation failures
- **Escalation Logic**: Smart escalation for complex issues requiring human intervention

### **3. Intelligent Communication**
- **Contextual Comments**: Generate meaningful issue and PR comments
- **Status Updates**: Provide clear, actionable status updates
- **Documentation**: Auto-generate implementation plans and documentation
- **Stakeholder Communication**: Tailor communication for different audiences

## 📋 **Prompt Templates by Use Case**

### **Issue Creation & Configuration**

#### **Template 1: Issue Analysis & Classification**
```
You are an expert issue analyst for the Portfolio OS project. Analyze the following issue and provide structured recommendations:

**Issue Details:**
- Title: {issue_title}
- Body: {issue_body}
- Labels: {current_labels}
- Assignee: {current_assignee}

**Analysis Tasks:**
1. **Priority Assessment**: Determine priority (P0/P1/P2/P3) based on:
   - Business impact and user experience
   - Technical complexity and risk
   - Dependencies and blocking issues
   - Timeline constraints

2. **Size Estimation**: Estimate size (XS/S/M/L/XL) based on:
   - Implementation complexity
   - Testing requirements
   - Documentation needs
   - Integration scope

3. **Field Configuration**: Recommend optimal values for:
   - App: Portfolio Site/Dashboard/Docs/Infra
   - Area: Frontend/Backend/Infra/Content/Design
   - Status: Todo/In progress/Ready/Done
   - Labels: Suggest relevant labels for categorization

4. **Implementation Planning**: Generate:
   - Acceptance criteria checklist
   - Technical requirements
   - Files likely to be modified
   - Dependencies and prerequisites

**Output Format:**
```json
{
  "priority": "P1",
  "size": "M", 
  "app": "Portfolio Site",
  "area": "Frontend",
  "status": "Todo",
  "labels": ["enhancement", "frontend", "priority: high"],
  "acceptance_criteria": ["..."],
  "technical_requirements": ["..."],
  "estimated_files": ["..."],
  "dependencies": ["..."],
  "implementation_plan": "..."
}
```
```

#### **Template 2: Smart Field Configuration**
```
You are a project management expert. Based on the issue analysis, configure the GitHub project fields optimally:

**Issue Context:**
- Issue: {issue_number} - {issue_title}
- Analysis: {ai_analysis_results}
- Current Project State: {project_metrics}

**Configuration Rules:**
1. **Priority Logic**:
   - P0: Critical bugs, security issues, production blockers
   - P1: High-impact features, important bugs, user-facing issues
   - P2: Medium impact features, documentation, improvements
   - P3: Nice-to-have features, technical debt, low priority

2. **Size Logic**:
   - XS: < 2 hours (simple fixes, typos, minor updates)
   - S: 2-4 hours (small features, bug fixes)
   - M: 4-8 hours (medium features, refactoring)
   - L: 8-16 hours (complex features, integrations)
   - XL: 16+ hours (major features, architectural changes)

3. **App Assignment**:
   - Portfolio Site: User-facing website features
   - Dashboard: Admin/management interface
   - Docs: Documentation and guides
   - Infra: Infrastructure, deployment, CI/CD

4. **Area Assignment**:
   - Frontend: React components, UI/UX, client-side logic
   - Backend: API endpoints, server logic, data processing
   - Infra: Deployment, CI/CD, infrastructure
   - Content: Documentation, blog posts, marketing content
   - Design: Visual design, user experience, accessibility

**Generate Configuration:**
```json
{
  "priority": "calculated_priority",
  "size": "calculated_size",
  "app": "calculated_app", 
  "area": "calculated_area",
  "status": "Todo",
  "labels": ["calculated_labels"],
  "milestone": "suggested_milestone",
  "assignee": "jschibelli",
  "reasoning": "explanation_of_choices"
}
```
```

### **PR Automation & Management**

#### **Template 3: PR Analysis & Response Generation**
```
You are a senior code reviewer and automation specialist. Analyze the PR and generate intelligent responses:

**PR Context:**
- PR: #{pr_number} - {pr_title}
- Base Branch: {base_branch}
- Files Changed: {changed_files}
- CR-GPT Comments: {cr_gpt_feedback}
- CI Status: {ci_status}

**Analysis Tasks:**
1. **Code Quality Assessment**: 
   - Review code changes for best practices
   - Identify potential issues or improvements
   - Assess test coverage and documentation
   - Check for security vulnerabilities

2. **CR-GPT Response Generation**:
   - Categorize feedback by priority (bugs > tests > typing > logic > docs > style)
   - Generate contextual responses to CR-GPT comments
   - Provide implementation guidance for fixes
   - Create threaded conversations for complex discussions

3. **Merge Readiness Assessment**:
   - Verify all requirements are met
   - Check CI/CD pipeline status
   - Ensure proper documentation
   - Confirm no breaking changes

**Response Strategy:**
```json
{
  "overall_assessment": "ready_for_review|needs_work|blocked",
  "priority_issues": ["..."],
  "cr_gpt_responses": [
    {
      "comment_id": "123",
      "response": "Thank you for the feedback...",
      "action_plan": "I'll implement the suggested changes...",
      "priority": "high"
    }
  ],
  "merge_checklist": ["..."],
  "status_update": "Ready for final review"
}
```
```

#### **Template 4: Continuous Pipeline Management**
```
You are a project automation coordinator. Manage the continuous issue processing pipeline:

**Pipeline Context:**
- Current Queue: {queue_status}
- Active Issues: {active_issues}
- Completed Issues: {completed_issues}
- Failed Issues: {failed_issues}
- Resource Availability: {agent_status}

**Management Tasks:**
1. **Queue Optimization**:
   - Prioritize issues based on business value
   - Detect and resolve dependencies
   - Balance workload across agents
   - Handle blocking issues

2. **Resource Allocation**:
   - Assign issues to available agents
   - Monitor agent capacity and performance
   - Escalate complex issues to senior agents
   - Coordinate parallel development

3. **Progress Monitoring**:
   - Track issue completion rates
   - Identify bottlenecks and delays
   - Generate progress reports
   - Predict completion timelines

**Pipeline Decisions:**
```json
{
  "next_issue": "issue_number",
  "agent_assignment": "agent_id",
  "priority_adjustments": ["..."],
  "dependency_resolution": ["..."],
  "escalation_needed": ["..."],
  "pipeline_status": "healthy|degraded|blocked",
  "recommendations": ["..."]
}
```
```

### **Project Management & Coordination**

#### **Template 5: Project Board Intelligence**
```
You are a project management AI assistant. Provide intelligent project board management:

**Project Context:**
- Project: Portfolio OS (ID: PVT_kwHOAEnMVc4BCu-c)
- Current Issues: {total_issues}
- Status Distribution: {status_breakdown}
- Team Capacity: {team_metrics}
- Sprint Goals: {sprint_objectives}

**Management Tasks:**
1. **Status Optimization**:
   - Identify stalled issues
   - Suggest status transitions
   - Detect workflow bottlenecks
   - Recommend process improvements

2. **Resource Planning**:
   - Forecast capacity needs
   - Identify skill gaps
   - Suggest training opportunities
   - Optimize team allocation

3. **Sprint Management**:
   - Plan upcoming sprints
   - Balance workload distribution
   - Set realistic commitments
   - Track progress against goals

**Management Recommendations:**
```json
{
  "stalled_issues": ["..."],
  "status_updates": ["..."],
  "capacity_recommendations": ["..."],
  "sprint_planning": ["..."],
  "process_improvements": ["..."],
  "risk_assessment": ["..."]
}
```
```

## 🔧 **Implementation Integration**

### **PowerShell Script Enhancement**

#### **Enhanced Issue Configuration Script**
```powershell
# Add AI analysis to issue-config-unified.ps1
function Invoke-AIAnalysis {
    param([string]$IssueNumber, [string]$IssueTitle, [string]$IssueBody)
    
    $prompt = Get-IssueAnalysisPrompt -IssueNumber $IssueNumber -Title $IssueTitle -Body $IssueBody
    $analysis = Invoke-AICompletion -Prompt $prompt -Model "gpt-4"
    
    return $analysis | ConvertFrom-Json
}

function Set-SmartConfiguration {
    param([string]$IssueNumber)
    
    $issueData = Get-IssueData -IssueNumber $IssueNumber
    $aiAnalysis = Invoke-AIAnalysis -IssueNumber $IssueNumber -Title $issueData.title -Body $issueData.body
    
    # Apply AI-recommended configuration
    Set-ProjectFields -IssueNumber $IssueNumber -Configuration $aiAnalysis
    Set-IssueLabels -IssueNumber $IssueNumber -Labels $aiAnalysis.labels
    Set-IssueMilestone -IssueNumber $IssueNumber -Milestone $aiAnalysis.milestone
}
```

#### **Enhanced PR Automation Script**
```powershell
# Add AI response generation to pr-automation scripts
function Generate-CRGPTResponses {
    param([string]$PRNumber)
    
    $prData = Get-PRData -PRNumber $PRNumber
    $crGPTComments = Get-CRGPTComments -PRNumber $PRNumber
    
    foreach ($comment in $crGPTComments) {
        $prompt = Get-CRGPTResponsePrompt -PRNumber $PRNumber -Comment $comment
        $response = Invoke-AICompletion -Prompt $prompt -Model "gpt-4"
        
        Post-CommentResponse -CommentId $comment.id -Response $response
    }
}
```

### **GitHub Actions Integration**

#### **Enhanced Workflow with AI**
```yaml
# Add AI analysis step to orchestrate-issues-prs.yml
- name: AI Issue Analysis
  if: needs.detect-and-route.outputs.is_issue == 'true'
  shell: pwsh
  run: |
    $analysis = ./scripts/ai-issue-analyzer.ps1 -IssueNumber ${{ needs.detect-and-route.outputs.issue_number }}
    echo "AI_ANALYSIS=$($analysis | ConvertTo-Json -Compress)" >> $GITHUB_OUTPUT

- name: Apply AI Configuration
  if: needs.detect-and-route.outputs.is_issue == 'true'
  shell: pwsh
  run: |
    ./scripts/issue-config-unified.ps1 -IssueNumber ${{ needs.detect-and-route.outputs.issue_number }} -AIConfig ${{ steps.ai-analysis.outputs.AI_ANALYSIS }}
```

## 📊 **Monitoring & Optimization**

### **Performance Metrics**
- **Issue Processing Time**: Time from creation to completion
- **Automation Accuracy**: Percentage of correct field assignments
- **Agent Efficiency**: Issues completed per agent per day
- **Error Rates**: Failed automation attempts
- **User Satisfaction**: Feedback on automation quality

### **Continuous Improvement**
- **Pattern Learning**: Identify successful automation patterns
- **Failure Analysis**: Learn from automation failures
- **User Feedback Integration**: Incorporate team feedback
- **Performance Optimization**: Improve response times and accuracy

## 🚀 **Deployment Strategy**

### **Phase 1: Core Integration**
1. Integrate AI analysis into existing PowerShell scripts
2. Add AI-powered field configuration
3. Implement basic response generation

### **Phase 2: Advanced Features**
1. Deploy continuous pipeline management
2. Add intelligent project board management
3. Implement learning and adaptation

### **Phase 3: Full Automation**
1. Complete end-to-end automation
2. Advanced analytics and reporting
3. Predictive capabilities and forecasting

## 📝 **Usage Examples**

### **Basic Issue Processing**
```bash
# Traditional approach
./scripts/issue-config-unified.ps1 -IssueNumber 123 -Preset blog

# AI-enhanced approach
./scripts/ai-enhanced-issue-config.ps1 -IssueNumber 123 -UseAI
```

### **PR Automation**
```bash
# Traditional approach
./scripts/pr-automation-unified.ps1 -PRNumber 456 -Action all

# AI-enhanced approach
./scripts/ai-enhanced-pr-automation.ps1 -PRNumber 456 -GenerateResponses -SmartAnalysis
```

### **Continuous Pipeline**
```bash
# Start AI-enhanced continuous processing
./scripts/ai-continuous-pipeline.ps1 -MaxIssues 10 -UseAI -LearningEnabled
```

## 🔒 **Security & Privacy Considerations**

- **Data Handling**: Ensure sensitive issue data is handled securely
- **API Keys**: Secure management of AI service API keys
- **Rate Limiting**: Implement proper rate limiting for AI API calls
- **Audit Logging**: Log all AI decisions for accountability
- **Fallback Mechanisms**: Maintain manual override capabilities

## 📈 **Success Metrics**

- **Automation Coverage**: Percentage of issues processed automatically
- **Accuracy Rate**: Correctness of AI-generated configurations
- **Time Savings**: Reduction in manual configuration time
- **Quality Improvement**: Better issue prioritization and assignment
- **Team Satisfaction**: User feedback on automation quality

---

This prompt engineering strategy transforms your existing automation system into an intelligent, adaptive, and self-improving platform that can handle complex issue management scenarios while maintaining the reliability and efficiency of your current PowerShell and GitHub Actions infrastructure.
