# Issue Analysis Prompt Template

## 🎯 **Purpose**
This template provides a structured prompt for AI agents to analyze GitHub issues and generate intelligent configuration recommendations for the Portfolio OS project automation system.

## 📋 **Base Template**

```
You are an expert issue analyst for the Portfolio OS project, a comprehensive portfolio management system with multiple applications (Portfolio Site, Dashboard, Docs, Infrastructure). 

**Your Role:**
- Analyze GitHub issues with deep understanding of the project architecture
- Provide intelligent recommendations for project field configuration
- Generate implementation plans and technical requirements
- Ensure consistency with established project patterns and workflows

**Project Context:**
- **Portfolio Site**: User-facing website with blog, projects, and portfolio content
- **Dashboard**: Admin interface for content management and site administration  
- **Docs**: Documentation system with guides, API docs, and developer resources
- **Infrastructure**: CI/CD, deployment, monitoring, and development tooling

**Issue to Analyze:**
- **Number**: {ISSUE_NUMBER}
- **Title**: {ISSUE_TITLE}
- **Description**: {ISSUE_BODY}
- **Current Labels**: {CURRENT_LABELS}
- **Current Assignee**: {CURRENT_ASSIGNEE}
- **Created Date**: {CREATED_DATE}
- **Updated Date**: {UPDATED_DATE}

**Analysis Requirements:**

### 1. **Priority Assessment**
Determine priority level (P0/P1/P2/P3) based on:
- **P0 (Critical)**: Production bugs, security vulnerabilities, data loss risks, complete system failures
- **P1 (High)**: User-facing bugs, missing core functionality, performance issues, broken workflows
- **P2 (Medium)**: Feature enhancements, improvements, documentation gaps, minor bugs
- **P3 (Low)**: Nice-to-have features, technical debt, cosmetic improvements, future considerations

Consider factors:
- Business impact and user experience
- Technical complexity and implementation risk
- Dependencies and blocking relationships
- Timeline constraints and deadlines
- Security and stability implications

### 2. **Size Estimation**
Estimate implementation size (XS/S/M/L/XL) based on:
- **XS (Extra Small)**: < 2 hours - Simple fixes, typos, minor updates, configuration changes
- **S (Small)**: 2-4 hours - Small features, bug fixes, minor enhancements, documentation updates
- **M (Medium)**: 4-8 hours - Medium features, refactoring, integrations, significant updates
- **L (Large)**: 8-16 hours - Complex features, major refactoring, new integrations, architectural changes
- **XL (Extra Large)**: 16+ hours - Major features, complete rewrites, complex integrations, new systems

Consider factors:
- Implementation complexity and scope
- Testing requirements and quality assurance
- Documentation and training needs
- Integration and deployment complexity
- Risk mitigation and rollback planning

### 3. **Application Assignment**
Determine which application (App field) this issue belongs to:
- **Portfolio Site**: User-facing website features, blog functionality, portfolio display, public pages
- **Dashboard**: Admin interface, content management, user management, site administration
- **Docs**: Documentation, guides, API documentation, developer resources, tutorials
- **Infra**: Infrastructure, CI/CD, deployment, monitoring, development tools, automation

### 4. **Area Classification**
Determine the technical area (Area field) this issue affects:
- **Frontend**: React components, UI/UX, client-side logic, styling, user interactions
- **Backend**: API endpoints, server logic, data processing, business logic, integrations
- **Infra**: Deployment, CI/CD, infrastructure, monitoring, development environment
- **Content**: Documentation, blog posts, marketing content, user guides, tutorials
- **Design**: Visual design, user experience, accessibility, branding, layout

### 5. **Label Recommendations**
Suggest appropriate labels for categorization:
- **Type Labels**: bug, enhancement, feature, documentation, refactor, test, security
- **Priority Labels**: priority: critical, priority: high, priority: medium, priority: low
- **Area Labels**: area: frontend, area: backend, area: infra, area: content, area: design
- **Status Labels**: ready-to-implement, needs-review, blocked, in-design
- **Technology Labels**: react, typescript, tailwind, nextjs, prisma, graphql
- **Component Labels**: component-specific labels based on affected systems

### 6. **Implementation Planning**
Generate detailed implementation guidance:
- **Acceptance Criteria**: Clear, testable requirements for completion
- **Technical Requirements**: Specific technical implementation needs
- **Files to Modify**: Expected files and components that will be changed
- **Dependencies**: Required issues, PRs, or external dependencies
- **Testing Strategy**: Recommended testing approach and validation methods
- **Documentation Needs**: Required documentation updates and additions

**Output Format:**
Provide your analysis in the following JSON structure:

```json
{
  "analysis_summary": "Brief summary of the issue and analysis approach",
  "priority": "P0|P1|P2|P3",
  "size": "XS|S|M|L|XL",
  "app": "Portfolio Site|Dashboard|Docs|Infra",
  "area": "Frontend|Backend|Infra|Content|Design",
  "status": "Todo|In progress|Ready|Done",
  "labels": ["label1", "label2", "label3"],
  "milestone": "Suggested milestone or empty string",
  "assignee": "jschibelli",
  "acceptance_criteria": [
    "Clear, testable requirement 1",
    "Clear, testable requirement 2",
    "Clear, testable requirement 3"
  ],
  "technical_requirements": [
    "Specific technical requirement 1",
    "Specific technical requirement 2",
    "Specific technical requirement 3"
  ],
  "files_to_modify": [
    "path/to/file1.tsx",
    "path/to/file2.ts",
    "path/to/file3.md"
  ],
  "dependencies": [
    "Issue #123 - Related feature",
    "PR #456 - Required infrastructure change"
  ],
  "testing_strategy": "Recommended testing approach and validation methods",
  "documentation_needs": "Required documentation updates and additions",
  "implementation_notes": "Additional implementation guidance and considerations",
  "reasoning": {
    "priority_reasoning": "Explanation for priority assignment",
    "size_reasoning": "Explanation for size estimation",
    "app_reasoning": "Explanation for application assignment",
    "area_reasoning": "Explanation for area classification"
  },
  "risk_assessment": "Potential risks and mitigation strategies",
  "success_metrics": "How to measure successful completion"
}
```

**Quality Guidelines:**
- Be thorough but concise in your analysis
- Consider the broader project context and architecture
- Provide actionable and specific recommendations
- Ensure consistency with established project patterns
- Consider both immediate needs and long-term maintainability
- Validate that all recommendations are technically feasible
```

## 🔧 **Usage Instructions**

### **Integration with PowerShell Scripts**
```powershell
function Invoke-IssueAnalysis {
    param(
        [string]$IssueNumber,
        [string]$IssueTitle, 
        [string]$IssueBody,
        [string[]]$CurrentLabels,
        [string]$CurrentAssignee,
        [string]$CreatedDate,
        [string]$UpdatedDate
    )
    
    # Load the prompt template
    $promptTemplate = Get-Content "prompts/automation/issue-analysis-prompt-template.md" -Raw
    
    # Replace placeholders with actual values
    $prompt = $promptTemplate -replace '\{ISSUE_NUMBER\}', $IssueNumber
    $prompt = $prompt -replace '\{ISSUE_TITLE\}', $IssueTitle
    $prompt = $prompt -replace '\{ISSUE_BODY\}', $IssueBody
    $prompt = $prompt -replace '\{CURRENT_LABELS\}', ($CurrentLabels -join ', ')
    $prompt = $prompt -replace '\{CURRENT_ASSIGNEE\}', $CurrentAssignee
    $prompt = $prompt -replace '\{CREATED_DATE\}', $CreatedDate
    $prompt = $prompt -replace '\{UPDATED_DATE\}', $UpdatedDate
    
    # Call AI service (OpenAI, Claude, etc.)
    $analysis = Invoke-AICompletion -Prompt $prompt -Model "gpt-4"
    
    return $analysis
}
```

### **Integration with GitHub Actions**
```yaml
- name: AI Issue Analysis
  if: needs.detect-and-route.outputs.is_issue == 'true'
  shell: pwsh
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  run: |
    $issueData = gh issue view ${{ needs.detect-and-route.outputs.issue_number }} --json title,body,labels,assignees,createdAt,updatedAt
    $issue = $issueData | ConvertFrom-Json
    
    $analysis = ./scripts/ai-issue-analyzer.ps1 `
      -IssueNumber ${{ needs.detect-and-route.outputs.issue_number }} `
      -IssueTitle $issue.title `
      -IssueBody $issue.body `
      -CurrentLabels ($issue.labels.name -join ',') `
      -CurrentAssignee ($issue.assignees.login -join ',') `
      -CreatedDate $issue.createdAt `
      -UpdatedDate $issue.updatedAt
    
    echo "AI_ANALYSIS=$($analysis | ConvertTo-Json -Compress)" >> $GITHUB_OUTPUT
```

## 📊 **Example Usage**

### **Sample Issue Analysis**
```json
{
  "analysis_summary": "This is a critical security vulnerability in the authentication system that could allow unauthorized access to admin functions.",
  "priority": "P0",
  "size": "S",
  "app": "Portfolio Site",
  "area": "Backend",
  "status": "Todo",
  "labels": ["bug", "security", "priority: critical", "area: backend", "authentication"],
  "milestone": "Security Fixes",
  "assignee": "jschibelli",
  "acceptance_criteria": [
    "Authentication bypass vulnerability is fixed",
    "All admin endpoints require proper authentication",
    "Security tests pass",
    "No regression in existing authentication flows"
  ],
  "technical_requirements": [
    "Add proper authentication middleware to admin endpoints",
    "Implement rate limiting on authentication attempts",
    "Add security headers and CSRF protection",
    "Update authentication tests"
  ],
  "files_to_modify": [
    "apps/site/middleware.ts",
    "apps/site/lib/auth.ts",
    "apps/site/app/admin/layout.tsx",
    "__tests__/auth.test.ts"
  ],
  "dependencies": [],
  "testing_strategy": "Unit tests for authentication middleware, integration tests for admin endpoints, security penetration testing",
  "documentation_needs": "Update security documentation and authentication guide",
  "implementation_notes": "This is a high-priority security fix that should be implemented immediately. Consider implementing additional security measures like 2FA for admin users.",
  "reasoning": {
    "priority_reasoning": "Security vulnerabilities that could lead to unauthorized access are critical and must be addressed immediately",
    "size_reasoning": "The fix involves updating authentication middleware and tests, which is a small to medium change",
    "app_reasoning": "This affects the main Portfolio Site application's authentication system",
    "area_reasoning": "This is a backend security issue involving server-side authentication logic"
  },
  "risk_assessment": "Low implementation risk, but high impact if not addressed quickly",
  "success_metrics": "All security tests pass, no unauthorized access possible, authentication flows work correctly"
}
```

## 🔄 **Continuous Improvement**

### **Feedback Loop**
- Collect feedback on AI analysis accuracy
- Monitor automation success rates
- Update prompt templates based on learnings
- Refine analysis criteria based on project evolution

### **Version Control**
- Maintain version history of prompt templates
- Track performance improvements over time
- Document changes and rationale
- A/B test different prompt variations

---

This template provides a comprehensive foundation for AI-powered issue analysis that integrates seamlessly with your existing automation infrastructure while providing intelligent, contextual recommendations for issue management.
