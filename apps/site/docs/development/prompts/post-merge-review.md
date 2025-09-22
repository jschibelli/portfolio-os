# Post-Merge Review

Comprehensive review of code after merging to ensure quality, identify potential issues, and maintain codebase standards. Focuses on integration testing, performance impact, and system-wide effects.

## Prompt

```markdown
Perform a comprehensive post-merge review for: **{{MERGE_TITLE}}**

**Merge Details**:
{{MERGE_DESCRIPTION}}

**Merged Changes**:
- **Source Branch**: {{SOURCE_BRANCH}}
- **Target Branch**: {{TARGET_BRANCH}}
- **Merge Commit**: {{MERGE_COMMIT_HASH}}
- **Files Changed**: {{FILES_CHANGED}}
- **Lines Added/Removed**: {{LINES_CHANGED}}

**Review Scope**:
- **Code Quality**: {{CODE_QUALITY_FOCUS}}
- **Integration**: {{INTEGRATION_FOCUS}}
- **Performance**: {{PERFORMANCE_FOCUS}}
- **Security**: {{SECURITY_FOCUS}}
- **Testing**: {{TESTING_FOCUS}}

**Post-Merge Review Framework**:

1. **Integration Analysis**:
   - **Build Status**: {{BUILD_STATUS}}
   - **Test Results**: {{TEST_RESULTS}}
   - **Deployment Status**: {{DEPLOYMENT_STATUS}}
   - **Environment Health**: {{ENVIRONMENT_HEALTH}}
   - **Dependency Conflicts**: {{DEPENDENCY_CONFLICTS}}

2. **Code Quality Assessment**:
   - **Code Review**: {{CODE_REVIEW_STATUS}}
   - **Standards Compliance**: {{STANDARDS_COMPLIANCE}}
   - **Documentation**: {{DOCUMENTATION_STATUS}}
   - **Type Safety**: {{TYPE_SAFETY_CHECK}}
   - **Error Handling**: {{ERROR_HANDLING_CHECK}}

3. **Performance Impact**:
   - **Build Time**: {{BUILD_TIME_IMPACT}}
   - **Runtime Performance**: {{RUNTIME_PERFORMANCE}}
   - **Bundle Size**: {{BUNDLE_SIZE_IMPACT}}
   - **Database Queries**: {{DATABASE_IMPACT}}
   - **API Response Times**: {{API_PERFORMANCE}}

4. **Security Review**:
   - **Vulnerability Scan**: {{VULNERABILITY_SCAN}}
   - **Authentication**: {{AUTHENTICATION_CHECK}}
   - **Authorization**: {{AUTHORIZATION_CHECK}}
   - **Data Validation**: {{DATA_VALIDATION_CHECK}}
   - **Input Sanitization**: {{INPUT_SANITIZATION_CHECK}}

5. **System Integration**:
   - **API Compatibility**: {{API_COMPATIBILITY}}
   - **Database Schema**: {{DATABASE_SCHEMA}}
   - **Third-party Services**: {{THIRD_PARTY_SERVICES}}
   - **Configuration Changes**: {{CONFIGURATION_CHANGES}}
   - **Environment Variables**: {{ENVIRONMENT_VARIABLES}}

**Monitoring Requirements**:
{{MONITORING_REQUIREMENTS}}

**Rollback Plan**:
{{ROLLBACK_PLAN}}

**Expected Output**:
1. Integration status report
2. Quality assessment
3. Performance analysis
4. Security review
5. Monitoring recommendations
6. Action items (if any)

Please provide a comprehensive review that ensures the merged code meets quality standards and doesn't introduce issues.
```

## Tips

### For Better Results
- Check integration tests thoroughly
- Monitor performance metrics
- Verify security implications
- Review configuration changes
- Test in staging environment

### Common Variables to Replace
- `{{MERGE_TITLE}}`: Title of the merge
- `{{MERGE_DESCRIPTION}}`: Description of what was merged
- `{{SOURCE_BRANCH}}`: Branch that was merged
- `{{TARGET_BRANCH}}`: Branch that received the merge
- `{{FILES_CHANGED}}`: List of files that were modified
- `{{BUILD_STATUS}}`: Current build status
- `{{TEST_RESULTS}}`: Test execution results
- `{{DEPLOYMENT_STATUS}}`: Deployment status

### Example Usage
```markdown
Perform a comprehensive post-merge review for: **Feature: User Dashboard Analytics**

**Merge Details**:
Added comprehensive analytics dashboard with real-time data visualization and export functionality.

**Merged Changes**:
- **Source Branch**: feature/user-dashboard-analytics
- **Target Branch**: main
- **Files Changed**: 15 files modified, 3 new files
- **Lines Added/Removed**: +1,234 -89

**Review Scope**:
- **Code Quality**: TypeScript compliance, error handling
- **Integration**: API integration, database queries
- **Performance**: Chart rendering, data processing
- **Security**: Data access controls, input validation
- **Testing**: Unit tests, integration tests
```

### Output Expectations
- Integration status report
- Quality assessment
- Performance analysis
- Security review
- Monitoring setup
- Action items (if needed)
