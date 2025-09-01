# Refactor Review

Analyze existing code and provide comprehensive refactoring recommendations to improve maintainability, performance, and code quality. Focus on architectural improvements and best practices.

## Prompt

```markdown
Perform a comprehensive refactor review for: **{{CODE_SECTION_NAME}}**

**Code Context**:
{{CODE_DESCRIPTION}}

**Current Implementation**:
{{CURRENT_CODE_OR_FILE_PATH}}

**Review Scope**:
- **Code Quality**: {{CODE_QUALITY_FOCUS}}
- **Performance**: {{PERFORMANCE_FOCUS}}
- **Architecture**: {{ARCHITECTURE_FOCUS}}
- **Maintainability**: {{MAINTAINABILITY_FOCUS}}
- **Security**: {{SECURITY_FOCUS}}

**Review Framework**:

1. **Code Analysis**:
   - Complexity assessment
   - Code smell identification
   - Anti-pattern detection
   - Performance bottlenecks
   - Security vulnerabilities

2. **Architecture Review**:
   - Separation of concerns
   - Dependency management
   - Design pattern usage
   - Scalability considerations
   - Testability assessment

3. **Best Practices Check**:
   - Coding standards compliance
   - Naming conventions
   - Error handling patterns
   - Documentation quality
   - Type safety (if applicable)

4. **Refactoring Recommendations**:
   - Specific code changes
   - Architectural improvements
   - Performance optimizations
   - Security enhancements
   - Testing improvements

5. **Implementation Plan**:
   - Priority order
   - Risk assessment
   - Timeline estimates
   - Rollback strategy
   - Testing requirements

**Technical Context**:
- **Framework**: {{FRAMEWORK}}
- **Language**: {{LANGUAGE}}
- **Dependencies**: {{DEPENDENCIES}}
- **Performance Requirements**: {{PERFORMANCE_REQUIREMENTS}}
- **Security Requirements**: {{SECURITY_REQUIREMENTS}}

**Quality Metrics**:
- **Cyclomatic Complexity**: Target < {{COMPLEXITY_TARGET}}
- **Code Coverage**: Target > {{COVERAGE_TARGET}}%
- **Performance Benchmarks**: {{PERFORMANCE_BENCHMARKS}}
- **Security Standards**: {{SECURITY_STANDARDS}}

**Expected Output**:
1. Detailed analysis report
2. Specific refactoring recommendations
3. Code examples for improvements
4. Implementation roadmap
5. Risk assessment
6. Testing strategy

Please provide actionable recommendations that will improve the code quality, maintainability, and performance while minimizing risk.
```

## Tips

### For Better Results
- Focus on high-impact, low-risk improvements first
- Provide specific code examples for recommendations
- Consider the broader system impact
- Include performance benchmarks where relevant
- Suggest incremental refactoring approach

### Common Variables to Replace
- `{{CODE_SECTION_NAME}}`: Name of the code section or component
- `{{CODE_DESCRIPTION}}`: Brief description of what the code does
- `{{CURRENT_CODE_OR_FILE_PATH}}`: Path to code or code snippet
- `{{FRAMEWORK}}`: React, Next.js, Node.js, etc.
- `{{LANGUAGE}}`: TypeScript, JavaScript, etc.
- `{{COMPLEXITY_TARGET}}`: Target cyclomatic complexity (e.g., 10)
- `{{COVERAGE_TARGET}}`: Target code coverage percentage (e.g., 80)

### Example Usage
```markdown
Perform a comprehensive refactor review for: **User Authentication Service**

**Code Context**:
A service that handles user authentication, including login, logout, and session management.

**Current Implementation**:
/services/auth.ts

**Review Scope**:
- **Code Quality**: Error handling, type safety, naming conventions
- **Performance**: Session management, database queries
- **Architecture**: Separation of concerns, dependency injection
- **Maintainability**: Code organization, documentation
- **Security**: Authentication flows, data validation
```

### Output Expectations
- Comprehensive code analysis
- Specific improvement recommendations
- Code examples and snippets
- Risk assessment
- Implementation timeline
- Testing requirements
- Performance benchmarks
