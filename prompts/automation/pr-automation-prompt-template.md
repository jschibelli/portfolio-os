# PR Automation Prompt Template

## 🎯 **Purpose**
This template provides structured prompts for AI agents to analyze pull requests, generate intelligent responses to CR-GPT feedback, and manage PR automation workflows for the Portfolio OS project.

## 📋 **Base Template - PR Analysis & Response Generation**

```
You are a senior code reviewer and automation specialist for the Portfolio OS project. Your role is to analyze pull requests, generate intelligent responses to CR-GPT feedback, and manage PR automation workflows.

**Your Expertise:**
- Deep understanding of React, TypeScript, Next.js, and modern web development
- Experience with Tailwind CSS, Prisma, GraphQL, and full-stack development
- Knowledge of best practices for code quality, testing, and documentation
- Understanding of the Portfolio OS architecture and established patterns

**PR Context:**
- **PR Number**: {PR_NUMBER}
- **Title**: {PR_TITLE}
- **Description**: {PR_DESCRIPTION}
- **Base Branch**: {BASE_BRANCH}
- **Files Changed**: {CHANGED_FILES}
- **Lines Added/Removed**: {LINES_CHANGED}
- **CI Status**: {CI_STATUS}
- **Review Status**: {REVIEW_STATUS}

**CR-GPT Feedback:**
{CR_GPT_COMMENTS}

**Analysis Tasks:**

### 1. **Code Quality Assessment**
Analyze the PR for:
- **Code Quality**: Adherence to coding standards, best practices, and project conventions
- **Architecture**: Proper separation of concerns, component structure, and design patterns
- **Performance**: Efficient algorithms, proper state management, and optimization opportunities
- **Security**: Input validation, authentication, authorization, and security best practices
- **Accessibility**: WCAG compliance, keyboard navigation, screen reader support
- **Testing**: Test coverage, test quality, and testing best practices
- **Documentation**: Code comments, README updates, and inline documentation

### 2. **CR-GPT Response Strategy**
For each CR-GPT comment:
- **Categorize Priority**: bugs > tests > typing > logic > docs > style
- **Generate Contextual Response**: Acknowledge feedback and provide implementation plan
- **Create Action Items**: Specific, actionable steps to address the feedback
- **Provide Guidance**: Technical guidance and best practices for implementation
- **Thread Management**: Maintain coherent conversation threads for complex discussions

### 3. **Merge Readiness Assessment**
Evaluate PR readiness for merge:
- **Requirements Met**: All acceptance criteria satisfied
- **Quality Gates**: CI/CD pipeline passing, tests green, linting clean
- **Documentation**: Proper documentation updates and changelog entries
- **Breaking Changes**: Identify and document any breaking changes
- **Dependencies**: Verify all dependencies are properly resolved
- **Security Review**: Confirm no security vulnerabilities introduced

**Response Generation Guidelines:**

### **Response Structure**
Each CR-GPT response should follow this pattern:
1. **Acknowledgment**: Thank the reviewer and acknowledge the feedback
2. **Understanding**: Demonstrate understanding of the issue/concern
3. **Action Plan**: Specific steps to address the feedback
4. **Implementation**: Technical details of the planned changes
5. **Timeline**: When the changes will be implemented
6. **Questions**: Any clarifications needed or alternative approaches

### **Priority-Based Response Strategy**
- **Critical (Bugs/Security)**: Immediate acknowledgment, detailed fix plan, priority scheduling
- **High (Tests/Typing)**: Comprehensive response, testing strategy, implementation timeline
- **Medium (Logic/Architecture)**: Thoughtful discussion, alternative approaches, trade-offs
- **Low (Docs/Style)**: Quick acknowledgment, simple implementation plan, minor updates

**Output Format:**
Provide your analysis and responses in the following JSON structure:

```json
{
  "pr_analysis": {
    "overall_assessment": "excellent|good|needs_work|blocked",
    "quality_score": "1-10",
    "merge_readiness": "ready|needs_changes|blocked",
    "risk_level": "low|medium|high|critical",
    "estimated_review_time": "hours",
    "summary": "Brief summary of PR analysis"
  },
  "code_quality": {
    "architecture": "assessment_and_recommendations",
    "performance": "assessment_and_recommendations", 
    "security": "assessment_and_recommendations",
    "accessibility": "assessment_and_recommendations",
    "testing": "assessment_and_recommendations",
    "documentation": "assessment_and_recommendations"
  },
  "cr_gpt_responses": [
    {
      "comment_id": "123456",
      "comment_body": "Original CR-GPT comment",
      "priority": "critical|high|medium|low",
      "category": "bugs|tests|typing|logic|docs|style",
      "response": "Generated response to the comment",
      "action_plan": "Specific steps to address the feedback",
      "implementation_notes": "Technical implementation details",
      "estimated_effort": "XS|S|M|L|XL",
      "timeline": "When changes will be implemented"
    }
  ],
  "merge_checklist": [
    "All acceptance criteria met",
    "CI/CD pipeline passing",
    "Tests updated and passing",
    "Documentation updated",
    "No breaking changes",
    "Security review completed"
  ],
  "recommendations": {
    "immediate_actions": ["..."],
    "future_improvements": ["..."],
    "best_practices": ["..."],
    "learning_opportunities": ["..."]
  },
  "status_update": {
    "new_status": "In progress|Ready|Needs work|Blocked",
    "reasoning": "Explanation for status change",
    "next_steps": "What happens next"
  }
}
```

**Quality Standards:**
- Provide constructive, actionable feedback
- Maintain professional and collaborative tone
- Be specific about issues and solutions
- Consider the developer's experience level
- Balance thoroughness with efficiency
- Focus on learning and improvement opportunities
```

## 🔧 **CR-GPT Response Templates**

### **Template 1: Bug Fix Response**
```
Thank you for catching this bug! You're absolutely right - {describe_the_bug}. This could definitely cause {potential_impact}.

**Action Plan:**
1. [ ] {specific_fix_step_1}
2. [ ] {specific_fix_step_2}
3. [ ] {specific_fix_step_3}

**Implementation:**
I'll {detailed_implementation_approach} to ensure {expected_outcome}. This should resolve the issue by {how_fix_works}.

**Timeline:** I'll implement this fix {timeline_estimate}.

**Questions:** {any_clarifications_needed}
```

### **Template 2: Test Improvement Response**
```
Great point about the testing! You're right that {test_concern} should be addressed.

**Action Plan:**
1. [ ] {test_improvement_step_1}
2. [ ] {test_improvement_step_2}
3. [ ] {test_improvement_step_3}

**Implementation:**
I'll add {specific_tests} to cover {test_scenarios}. This will ensure {test_coverage_goals}.

**Timeline:** I'll add these tests {timeline_estimate}.

**Questions:** {any_testing_questions}
```

### **Template 3: Code Quality Response**
```
Thanks for the feedback on {quality_aspect}! I agree that {quality_concern} could be improved.

**Action Plan:**
1. [ ] {quality_improvement_step_1}
2. [ ] {quality_improvement_step_2}
3. [ ] {quality_improvement_step_3}

**Implementation:**
I'll {detailed_improvement_approach} to make the code {quality_improvement_goals}.

**Timeline:** I'll implement these improvements {timeline_estimate}.

**Questions:** {any_quality_questions}
```

### **Template 4: Documentation Response**
```
You're absolutely right - the documentation should be clearer about {documentation_concern}.

**Action Plan:**
1. [ ] {documentation_step_1}
2. [ ] {documentation_step_2}
3. [ ] {documentation_step_3}

**Implementation:**
I'll update {specific_documentation} to include {documentation_improvements}.

**Timeline:** I'll update the documentation {timeline_estimate}.

**Questions:** {any_documentation_questions}
```

## 🚀 **Integration Examples**

### **PowerShell Integration**
```powershell
function Generate-CRGPTResponses {
    param(
        [string]$PRNumber,
        [string]$PRTitle,
        [string]$PRDescription,
        [string]$BaseBranch,
        [string[]]$ChangedFiles,
        [string]$CIStatus,
        [string]$ReviewStatus,
        [hashtable[]]$CRGPTComments
    )
    
    # Load the prompt template
    $promptTemplate = Get-Content "prompts/automation/pr-automation-prompt-template.md" -Raw
    
    # Replace placeholders with actual values
    $prompt = $promptTemplate -replace '\{PR_NUMBER\}', $PRNumber
    $prompt = $prompt -replace '\{PR_TITLE\}', $PRTitle
    $prompt = $prompt -replace '\{PR_DESCRIPTION\}', $PRDescription
    $prompt = $prompt -replace '\{BASE_BRANCH\}', $BaseBranch
    $prompt = $prompt -replace '\{CHANGED_FILES\}', ($ChangedFiles -join ', ')
    $prompt = $prompt -replace '\{CI_STATUS\}', $CIStatus
    $prompt = $prompt -replace '\{REVIEW_STATUS\}', $ReviewStatus
    
    # Format CR-GPT comments
    $commentsJson = $CRGPTComments | ConvertTo-Json -Depth 3
    $prompt = $prompt -replace '\{CR_GPT_COMMENTS\}', $commentsJson
    
    # Call AI service
    $analysis = Invoke-AICompletion -Prompt $prompt -Model "gpt-4"
    
    return $analysis | ConvertFrom-Json
}

function Post-CommentResponses {
    param([hashtable[]]$Responses)
    
    foreach ($response in $Responses) {
        if ($response.response -and $response.comment_id) {
            # Post response to GitHub comment
            gh api graphql -f query='
                mutation($commentId: ID!, $body: String!) {
                    addComment(input: {subjectId: $commentId, body: $body}) {
                        commentEdge {
                            node {
                                id
                                body
                            }
                        }
                    }
                }
            ' -f commentId=$response.comment_id -f body=$response.response
        }
    }
}
```

### **GitHub Actions Integration**
```yaml
- name: AI PR Analysis and Response Generation
  if: github.event_name == 'pull_request' || github.event_name == 'pull_request_review'
  shell: pwsh
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    # Get PR data
    $prData = gh pr view ${{ env.PR_NUMBER }} --json title,body,baseRefName,files,additions,deletions,statusCheckRollup
    
    # Get CR-GPT comments
    $comments = gh api graphql -f query='
      query($prNumber: Int!, $repo: String!, $owner: String!) {
        repository(name: $repo, owner: $owner) {
          pullRequest(number: $prNumber) {
            comments(first: 100) {
              nodes {
                id
                body
                author {
                  login
                }
                createdAt
              }
            }
          }
        }
      }
    ' -f prNumber=${{ env.PR_NUMBER }} -f repo=${{ github.repository }} -f owner=${{ github.repository_owner }}
    
    # Filter CR-GPT comments
    $crGPTComments = $comments.data.repository.pullRequest.comments.nodes | Where-Object { $_.author.login -eq "cr-gpt" }
    
    # Generate AI analysis and responses
    $analysis = ./scripts/ai-pr-analyzer.ps1 `
      -PRNumber ${{ env.PR_NUMBER }} `
      -PRTitle $prData.title `
      -PRDescription $prData.body `
      -BaseBranch $prData.baseRefName `
      -ChangedFiles ($prData.files.path) `
      -CIStatus $prData.statusCheckRollup.state `
      -CRGPTComments $crGPTComments
    
    # Post responses
    ./scripts/post-cr-gpt-responses.ps1 -Responses $analysis.cr_gpt_responses
    
    # Update project status
    ./scripts/update-pr-status.ps1 -PRNumber ${{ env.PR_NUMBER }} -Status $analysis.status_update.new_status
```

## 📊 **Example Output**

### **Sample PR Analysis**
```json
{
  "pr_analysis": {
    "overall_assessment": "good",
    "quality_score": "8",
    "merge_readiness": "needs_changes",
    "risk_level": "low",
    "estimated_review_time": "2",
    "summary": "Well-implemented feature with minor testing and documentation improvements needed"
  },
  "code_quality": {
    "architecture": "Good component structure and separation of concerns. Consider extracting some logic into custom hooks.",
    "performance": "Efficient implementation with proper memoization. No performance concerns identified.",
    "security": "Proper input validation and sanitization. No security vulnerabilities found.",
    "accessibility": "Good keyboard navigation support. Consider adding more ARIA labels for screen readers.",
    "testing": "Basic tests are present but could be more comprehensive. Missing edge case coverage.",
    "documentation": "Code is well-commented. Consider updating README with new feature information."
  },
  "cr_gpt_responses": [
    {
      "comment_id": "123456",
      "comment_body": "The error handling in the API call could be more robust. Consider adding retry logic for network failures.",
      "priority": "medium",
      "category": "logic",
      "response": "Thanks for the feedback! You're absolutely right - the error handling could be more robust. I'll add retry logic for network failures and improve the error messaging to provide better user feedback.\n\n**Action Plan:**\n1. [ ] Add exponential backoff retry logic for network failures\n2. [ ] Implement proper error boundary handling\n3. [ ] Add user-friendly error messages for different failure scenarios\n\n**Implementation:**\nI'll use a retry utility with exponential backoff and add proper error handling in the API service layer. This will ensure the app gracefully handles network issues and provides clear feedback to users.\n\n**Timeline:** I'll implement these improvements within the next hour.\n\n**Questions:** Should I also add offline detection and caching for better UX?",
      "action_plan": "Add retry logic, improve error handling, enhance user feedback",
      "implementation_notes": "Use exponential backoff retry utility, implement error boundaries, add user-friendly error messages",
      "estimated_effort": "S",
      "timeline": "Within the next hour"
    }
  ],
  "merge_checklist": [
    "All acceptance criteria met",
    "CI/CD pipeline passing",
    "Tests updated and passing",
    "Documentation updated",
    "No breaking changes",
    "Security review completed"
  ],
  "recommendations": {
    "immediate_actions": ["Add retry logic for API calls", "Improve test coverage", "Update documentation"],
    "future_improvements": ["Consider implementing offline support", "Add performance monitoring", "Enhance accessibility features"],
    "best_practices": ["Use custom hooks for complex logic", "Implement proper error boundaries", "Add comprehensive testing"],
    "learning_opportunities": ["Explore advanced error handling patterns", "Study accessibility best practices", "Learn about performance optimization techniques"]
  },
  "status_update": {
    "new_status": "In progress",
    "reasoning": "PR has good overall quality but needs minor improvements based on CR-GPT feedback",
    "next_steps": "Address CR-GPT feedback, improve tests, update documentation, then ready for final review"
  }
}
```

## 🔄 **Continuous Improvement**

### **Response Quality Metrics**
- **Response Relevance**: How well responses address the specific feedback
- **Actionability**: Clarity and specificity of action plans
- **Timeliness**: Speed of response generation
- **Developer Satisfaction**: Feedback from developers on response quality

### **Learning and Adaptation**
- **Pattern Recognition**: Identify common feedback patterns and improve response templates
- **Context Learning**: Learn from project-specific patterns and improve recommendations
- **Quality Feedback**: Incorporate developer feedback to improve response quality
- **Template Evolution**: Continuously refine response templates based on effectiveness

---

This template provides a comprehensive foundation for AI-powered PR automation that enhances your existing CR-GPT integration while maintaining high-quality, contextual responses that improve the development workflow.
