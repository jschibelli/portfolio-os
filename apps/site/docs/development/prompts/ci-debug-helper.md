# CI/CD Debug Helper

Systematic approach to debugging CI/CD pipeline issues. Provides structured investigation steps, common solutions, and prevention strategies for continuous integration and deployment problems.

## Prompt

```markdown
Debug the following CI/CD pipeline issue: **{{ISSUE_TITLE}}**

**Issue Description**:
{{ISSUE_DESCRIPTION}}

**Pipeline Context**:
- **CI/CD Platform**: {{CI_CD_PLATFORM}} (GitHub Actions/Jenkins/GitLab CI/CircleCI)
- **Environment**: {{ENVIRONMENT}} (Development/Staging/Production)
- **Trigger**: {{TRIGGER_TYPE}} (Push/Pull Request/Scheduled/Manual)
- **Branch**: {{BRANCH_NAME}}
- **Commit**: {{COMMIT_HASH}}

**Error Details**:
- **Error Message**: {{ERROR_MESSAGE}}
- **Failed Step**: {{FAILED_STEP}}
- **Log Output**: {{LOG_OUTPUT}}
- **Exit Code**: {{EXIT_CODE}}

**Debug Framework**:

1. **Initial Assessment**:
   - **Severity**: {{SEVERITY_LEVEL}} (Critical/High/Medium/Low)
   - **Impact**: {{IMPACT_ANALYSIS}}
   - **Scope**: {{SCOPE_DETERMINATION}}
   - **Urgency**: {{URGENCY_ASSESSMENT}}

2. **Root Cause Investigation**:
   - **Code Changes**: {{RECENT_CODE_CHANGES}}
   - **Configuration Changes**: {{CONFIG_CHANGES}}
   - **Dependency Updates**: {{DEPENDENCY_UPDATES}}
   - **Environment Changes**: {{ENVIRONMENT_CHANGES}}
   - **Infrastructure Changes**: {{INFRASTRUCTURE_CHANGES}}

3. **Pipeline Analysis**:
   - **Build Process**: {{BUILD_PROCESS_CHECK}}
   - **Test Execution**: {{TEST_EXECUTION_CHECK}}
   - **Deployment Process**: {{DEPLOYMENT_PROCESS_CHECK}}
   - **Artifact Management**: {{ARTIFACT_MANAGEMENT_CHECK}}
   - **Environment Configuration**: {{ENV_CONFIG_CHECK}}

4. **Common Solutions**:
   - **Build Issues**: {{BUILD_ISSUE_SOLUTIONS}}
   - **Test Failures**: {{TEST_FAILURE_SOLUTIONS}}
   - **Deployment Issues**: {{DEPLOYMENT_ISSUE_SOLUTIONS}}
   - **Environment Issues**: {{ENVIRONMENT_ISSUE_SOLUTIONS}}
   - **Infrastructure Issues**: {{INFRASTRUCTURE_ISSUE_SOLUTIONS}}

5. **Prevention Strategies**:
   - **Monitoring**: {{MONITORING_SETUP}}
   - **Alerting**: {{ALERTING_SETUP}}
   - **Testing**: {{TESTING_IMPROVEMENTS}}
   - **Documentation**: {{DOCUMENTATION_UPDATES}}
   - **Process Improvements**: {{PROCESS_IMPROVEMENTS}}

**Technical Context**:
- **Application Type**: {{APPLICATION_TYPE}}
- **Framework**: {{FRAMEWORK}}
- **Language**: {{LANGUAGE}}
- **Database**: {{DATABASE}}
- **Infrastructure**: {{INFRASTRUCTURE}}
- **Dependencies**: {{DEPENDENCIES}}

**Troubleshooting Steps**:
{{TROUBLESHOOTING_STEPS}}

**Expected Output**:
1. Root cause analysis
2. Step-by-step resolution plan
3. Immediate fixes
4. Long-term prevention
5. Monitoring recommendations
6. Documentation updates

Please provide a systematic approach to resolve this CI/CD issue and prevent similar problems in the future.
```

## Tips

### For Better Results
- Start with the most recent changes
- Check environment-specific configurations
- Verify dependency versions and compatibility
- Review log files systematically
- Test fixes in lower environments first

### Common Variables to Replace
- `{{ISSUE_TITLE}}`: Brief description of the issue
- `{{ISSUE_DESCRIPTION}}`: Detailed problem description
- `{{CI_CD_PLATFORM}}`: GitHub Actions, Jenkins, GitLab CI, etc.
- `{{ENVIRONMENT}}`: Development, Staging, Production
- `{{ERROR_MESSAGE}}`: Specific error message
- `{{FAILED_STEP}}`: Which step in the pipeline failed
- `{{LOG_OUTPUT}}`: Relevant log output
- `{{RECENT_CODE_CHANGES}}`: Recent commits or changes

### Example Usage
```markdown
Debug the following CI/CD pipeline issue: **Build Failure on Production Deploy**

**Issue Description**:
The production deployment is failing during the build step with a dependency resolution error.

**Pipeline Context**:
- **CI/CD Platform**: GitHub Actions
- **Environment**: Production
- **Trigger**: Push to main branch
- **Failed Step**: npm install

**Error Details**:
- **Error Message**: "Cannot resolve dependency @types/react@^18.0.0"
- **Exit Code**: 1
```

### Output Expectations
- Clear root cause identification
- Step-by-step resolution plan
- Immediate action items
- Prevention strategies
- Monitoring setup
- Documentation updates
