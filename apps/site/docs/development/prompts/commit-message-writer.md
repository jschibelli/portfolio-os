# Commit Message Writer

Generate clear, conventional commit messages that follow best practices and provide meaningful context for code changes. Supports conventional commits format and team collaboration.

## Prompt

```markdown
Generate a conventional commit message for the following changes: **{{CHANGE_SUMMARY}}**

**Change Details**:
{{CHANGE_DESCRIPTION}}

**Files Modified**:
{{MODIFIED_FILES}}

**Type of Change**:
{{CHANGE_TYPE}} (feat/fix/docs/style/refactor/test/chore/ci/build/perf/revert)

**Scope** (optional):
{{SCOPE}}

**Breaking Changes**:
{{BREAKING_CHANGES}}

**Related Issues**:
{{RELATED_ISSUES}}

**Commit Message Requirements**:
- **Format**: Conventional Commits specification
- **Language**: {{LANGUAGE}} (English/Technical)
- **Tone**: {{TONE}} (Professional/Concise/Descriptive)
- **Length**: {{LENGTH}} (Short/Medium/Detailed)
- **Include**: {{INCLUDE_ELEMENTS}}

**Conventional Commits Format**:
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Type Guidelines**:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes
- **build**: Build system changes
- **perf**: Performance improvements
- **revert**: Reverting previous commits

**Message Structure**:
1. **Subject Line**: {{SUBJECT_LINE_REQUIREMENTS}}
2. **Body**: {{BODY_REQUIREMENTS}}
3. **Footer**: {{FOOTER_REQUIREMENTS}}

**Context**:
- **Project**: {{PROJECT_NAME}}
- **Branch**: {{BRANCH_NAME}}
- **Previous Commits**: {{PREVIOUS_COMMITS}}
- **Team Standards**: {{TEAM_STANDARDS}}

**Expected Output**:
1. Conventional commit message
2. Alternative formats (if requested)
3. Explanation of the message structure
4. Best practices applied

Please generate a clear, descriptive commit message that follows conventional commits standards and provides meaningful context for the changes made.
```

## Tips

### For Better Results
- Use imperative mood ("add" not "added")
- Keep subject line under 50 characters
- Be specific about what changed
- Include context when helpful
- Reference related issues/tickets

### Common Variables to Replace
- `{{CHANGE_SUMMARY}}`: Brief summary of changes
- `{{CHANGE_DESCRIPTION}}`: Detailed description of changes
- `{{MODIFIED_FILES}}`: List of files that were changed
- `{{CHANGE_TYPE}}`: Type of change (feat, fix, docs, etc.)
- `{{SCOPE}}`: Scope of the change (optional)
- `{{BREAKING_CHANGES}}`: Any breaking changes
- `{{RELATED_ISSUES}}`: Related issue numbers or tickets

### Example Usage
```markdown
Generate a conventional commit message for the following changes: **Add user authentication feature**

**Change Details**:
Implemented user login/logout functionality with JWT tokens, added authentication middleware, and created login form component.

**Files Modified**:
- src/components/LoginForm.tsx
- src/services/auth.ts
- src/middleware/auth.ts
- src/types/user.ts

**Type of Change**:
feat

**Scope**:
auth

**Related Issues**:
Closes #123, Related to #124
```

### Output Expectations
- Conventional commit format
- Clear and descriptive message
- Proper type and scope
- Issue references (if applicable)
- Breaking change notes (if applicable)
