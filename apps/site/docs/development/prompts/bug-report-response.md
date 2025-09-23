# Bug Report Response

Generate structured, systematic responses to bug reports with investigation steps, root cause analysis, and resolution plans. Designed for efficient bug triage and resolution.

## Prompt

```markdown
Analyze and respond to the following bug report: **{{BUG_TITLE}}**

**Bug Report Details**:
{{BUG_DESCRIPTION}}

**Reported By**: {{REPORTER_NAME}}
**Priority Level**: {{PRIORITY_LEVEL}} (Critical/High/Medium/Low)
**Environment**: {{ENVIRONMENT_DETAILS}}
**Steps to Reproduce**: {{REPRODUCTION_STEPS}}
**Expected Behavior**: {{EXPECTED_BEHAVIOR}}
**Actual Behavior**: {{ACTUAL_BEHAVIOR}}
**Error Messages**: {{ERROR_MESSAGES}}
**Screenshots/Logs**: {{ATTACHMENTS}}

**Investigation Framework**:

1. **Initial Assessment**:
   - Severity evaluation
   - Impact analysis
   - Scope determination
   - Urgency assessment

2. **Root Cause Analysis**:
   - Code review points
   - Data flow analysis
   - Environment factors
   - External dependencies

3. **Reproduction Strategy**:
   - Local environment setup
   - Test case creation
   - Edge case identification
   - Regression testing

4. **Solution Development**:
   - Fix approach
   - Code changes required
   - Testing strategy
   - Rollback plan

5. **Communication Plan**:
   - Status updates
   - Timeline estimates
   - Stakeholder notifications
   - Documentation updates

**Technical Context**:
- **Affected Components**: {{AFFECTED_COMPONENTS}}
- **Related Features**: {{RELATED_FEATURES}}
- **Recent Changes**: {{RECENT_CHANGES}}
- **Known Issues**: {{KNOWN_ISSUES}}

**Response Requirements**:
- Professional and empathetic tone
- Clear action items
- Realistic timelines
- Risk assessment
- Prevention measures

Please provide a comprehensive response that addresses the bug systematically and provides clear next steps for resolution.
```

## Tips

### For Better Results
- Always acknowledge the reporter's effort
- Provide specific, actionable next steps
- Include realistic timeline estimates
- Consider the broader impact on users
- Suggest workarounds if immediate fix isn't possible

### Common Variables to Replace
- `{{BUG_TITLE}}`: Concise bug title
- `{{BUG_DESCRIPTION}}`: Detailed bug description
- `{{REPORTER_NAME}}`: Name of person reporting
- `{{PRIORITY_LEVEL}}`: Critical, High, Medium, or Low
- `{{ENVIRONMENT_DETAILS}}`: Browser, OS, version, etc.
- `{{REPRODUCTION_STEPS}}`: Step-by-step reproduction
- `{{EXPECTED_BEHAVIOR}}`: What should happen
- `{{ACTUAL_BEHAVIOR}}`: What actually happens

### Example Usage
```markdown
Analyze and respond to the following bug report: **User Dashboard Not Loading**

**Bug Report Details**:
The user dashboard fails to load after login, showing a blank screen with no error message.

**Reported By**: John Smith
**Priority Level**: High
**Environment**: Chrome 120, Windows 11, Production
**Steps to Reproduce**: 
1. Login to application
2. Navigate to dashboard
3. Observe blank screen
```

### Output Expectations
- Professional acknowledgment
- Clear investigation plan
- Specific action items
- Timeline estimates
- Risk assessment
- Prevention recommendations
- Follow-up communication plan
