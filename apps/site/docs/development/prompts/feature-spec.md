# Feature Specification Generator

Create detailed, actionable feature specifications for new functionality. This template helps break down complex features into implementable tasks with clear acceptance criteria.

## Prompt

```markdown
Create a comprehensive feature specification for: **{{FEATURE_NAME}}**

**Feature Overview**:
{{FEATURE_DESCRIPTION}}

**Business Context**:
- **Problem Statement**: {{PROBLEM_STATEMENT}}
- **Target Users**: {{TARGET_USERS}}
- **Success Metrics**: {{SUCCESS_METRICS}}
- **Priority Level**: {{PRIORITY_LEVEL}} (High/Medium/Low)

**Technical Requirements**:
- **Frontend Framework**: {{FRONTEND_FRAMEWORK}}
- **Backend Integration**: {{BACKEND_INTEGRATION}}
- **Database Changes**: {{DATABASE_CHANGES}}
- **API Endpoints**: {{API_ENDPOINTS}}
- **Third-party Dependencies**: {{THIRD_PARTY_DEPS}}

**User Stories**:
{{USER_STORIES}}

**Acceptance Criteria**:
{{ACCEPTANCE_CRITERIA}}

**Technical Implementation**:
- **Architecture**: {{ARCHITECTURE_APPROACH}}
- **Data Flow**: {{DATA_FLOW}}
- **State Management**: {{STATE_MANAGEMENT}}
- **Error Handling**: {{ERROR_HANDLING}}
- **Performance Considerations**: {{PERFORMANCE_CONSIDERATIONS}}

**UI/UX Requirements**:
- **Design System**: {{DESIGN_SYSTEM}}
- **Responsive Design**: {{RESPONSIVE_REQUIREMENTS}}
- **Accessibility**: {{ACCESSIBILITY_REQUIREMENTS}}
- **Loading States**: {{LOADING_STATES}}
- **Error States**: {{ERROR_STATES}}

**Testing Strategy**:
- **Unit Tests**: {{UNIT_TEST_REQUIREMENTS}}
- **Integration Tests**: {{INTEGRATION_TEST_REQUIREMENTS}}
- **E2E Tests**: {{E2E_TEST_REQUIREMENTS}}
- **Accessibility Tests**: {{A11Y_TEST_REQUIREMENTS}}

**Security Considerations**:
{{SECURITY_CONSIDERATIONS}}

**Deployment & Release**:
- **Environment Requirements**: {{ENVIRONMENT_REQUIREMENTS}}
- **Feature Flags**: {{FEATURE_FLAGS}}
- **Rollback Strategy**: {{ROLLBACK_STRATEGY}}
- **Monitoring**: {{MONITORING_REQUIREMENTS}}

**Dependencies & Blockers**:
{{DEPENDENCIES_AND_BLOCKERS}}

**Timeline & Effort Estimation**:
- **Development Time**: {{DEV_TIME_ESTIMATE}}
- **Testing Time**: {{TESTING_TIME_ESTIMATE}}
- **Total Effort**: {{TOTAL_EFFORT_ESTIMATE}}

Please provide a detailed, actionable specification that can be used by the development team to implement this feature successfully.
```

## Tips

### For Better Results
- Be specific about user personas and their needs
- Include actual code examples where relevant
- Provide mockups or wireframes if available
- Consider edge cases and error scenarios
- Include performance benchmarks and SLAs

### Common Variables to Replace
- `{{FEATURE_NAME}}`: Descriptive name of the feature
- `{{FEATURE_DESCRIPTION}}`: 2-3 sentence overview
- `{{PROBLEM_STATEMENT}}`: What problem does this solve?
- `{{TARGET_USERS}}`: Who will use this feature?
- `{{SUCCESS_METRICS}}`: How will we measure success?
- `{{USER_STORIES}}`: List of user stories in "As a... I want... So that..." format
- `{{ACCEPTANCE_CRITERIA}}`: Specific, testable criteria for each user story

### Example Usage
```markdown
Create a comprehensive feature specification for: **User Dashboard Analytics**

**Feature Overview**:
A comprehensive analytics dashboard that provides users with real-time insights into their data usage, performance metrics, and actionable recommendations.

**Business Context**:
- **Problem Statement**: Users lack visibility into their system performance and usage patterns
- **Target Users**: Enterprise customers, power users, system administrators
- **Success Metrics**: 40% increase in user engagement, 25% reduction in support tickets
- **Priority Level**: High
```

### Output Expectations
- Detailed technical requirements
- Clear acceptance criteria
- Implementation roadmap
- Risk assessment
- Resource requirements
- Timeline estimates
