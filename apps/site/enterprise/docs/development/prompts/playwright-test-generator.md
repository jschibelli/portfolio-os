# Playwright Test Generator

Generate comprehensive Playwright test suites for React components and pages. Includes accessibility testing, visual regression testing, and proper test organization.

## Prompt

```markdown
Create a comprehensive Playwright test suite for: **{{COMPONENT_OR_PAGE_NAME}}**

**Test Target**:
{{TEST_TARGET_DESCRIPTION}}

**Component/Page Details**:
- **Type**: {{COMPONENT_TYPE}} (Component/Page/Feature)
- **Framework**: {{FRAMEWORK}} (Next.js/React)
- **Styling**: {{STYLING}} (Tailwind CSS)
- **Key Functionality**: {{KEY_FUNCTIONALITY}}
- **Props/State**: {{PROPS_AND_STATE}}
- **User Interactions**: {{USER_INTERACTIONS}}

**Testing Requirements**:
- **Unit Tests**: {{UNIT_TEST_REQUIREMENTS}}
- **Integration Tests**: {{INTEGRATION_TEST_REQUIREMENTS}}
- **E2E Tests**: {{E2E_TEST_REQUIREMENTS}}
- **Accessibility Tests**: {{ACCESSIBILITY_TEST_REQUIREMENTS}}
- **Visual Regression Tests**: {{VISUAL_REGRESSION_REQUIREMENTS}}
- **Performance Tests**: {{PERFORMANCE_TEST_REQUIREMENTS}}

**Test Scenarios**:
{{TEST_SCENARIOS}}

**Edge Cases**:
{{EDGE_CASES}}

**Mock Data Requirements**:
{{MOCK_DATA_REQUIREMENTS}}

**Test Environment**:
- **Base URL**: {{BASE_URL}}
- **Viewports**: {{VIEWPORTS}}
- **Browsers**: {{BROWSERS}}
- **Authentication**: {{AUTHENTICATION_REQUIREMENTS}}

**Expected Output**:
1. Main test file (.spec.ts)
2. Test utilities and helpers
3. Mock data fixtures
4. Page object models (if applicable)
5. Test configuration updates
6. Accessibility test helpers

**Code Quality Requirements**:
- Use TypeScript for type safety
- Follow Playwright best practices
- Include proper error handling
- Add comprehensive comments
- Use descriptive test names
- Implement proper test isolation
- Include setup and teardown hooks

Please generate production-ready test code that follows Playwright conventions and provides comprehensive coverage.
```

## Tips

### For Better Results
- Provide specific user journey scenarios
- Include accessibility requirements (WCAG guidelines)
- Specify responsive breakpoints to test
- Mention any specific error states to test
- Include performance benchmarks if applicable

### Common Variables to Replace
- `{{COMPONENT_OR_PAGE_NAME}}`: Name of the component or page
- `{{TEST_TARGET_DESCRIPTION}}`: What this component/page does
- `{{COMPONENT_TYPE}}`: Component, Page, or Feature
- `{{KEY_FUNCTIONALITY}}`: Main features to test
- `{{USER_INTERACTIONS}}`: Click, type, hover, etc.
- `{{TEST_SCENARIOS}}`: Specific user flows to test
- `{{EDGE_CASES}}`: Error states, empty states, loading states
- `{{MOCK_DATA_REQUIREMENTS}}`: What data needs to be mocked

### Example Usage
```markdown
Create a comprehensive Playwright test suite for: **User Dashboard**

**Test Target**:
A dashboard page that displays user analytics, recent activity, and quick actions.

**Component/Page Details**:
- **Type**: Page
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Key Functionality**: Data visualization, user interactions, real-time updates
- **User Interactions**: Click buttons, filter data, navigate sections
```

### Output Expectations
- Comprehensive test coverage
- Accessibility testing
- Visual regression testing
- Performance testing
- Proper test organization
- Mock data management
- Error handling
- Cross-browser compatibility
