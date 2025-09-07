# GitHub Actions Context Access Fixes

This document outlines the fixes applied to resolve the CI/CD workflow context access errors identified in [PR #47](https://github.com/jschibelli/mindware-blog/pull/47).

## Issues Identified

The GitHub Actions workflow was experiencing context access errors due to:

1. **Missing Permissions**: No explicit permissions defined for GitHub API access
2. **Context Access Problems**: The `github-script` action lacked proper token access
3. **Missing Token Access**: Some actions required explicit token permissions
4. **Environment Configuration**: Invalid environment names

## Fixes Applied

### 1. Added Global Permissions

Added explicit permissions at the workflow level to ensure proper GitHub API access:

```yaml
permissions:
  contents: read
  issues: write
  pull-requests: write
  checks: write
  security-events: write
  actions: read
  packages: read
```

### 2. Enhanced github-script Action

Fixed the visual regression test comment posting by:

- Adding explicit `github-token` parameter
- Adding proper error handling for API calls
- Making the script async to handle API responses correctly

```yaml
- name: Comment PR with visual test results
  uses: actions/github-script@v6
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    script: |
      // ... script with proper error handling
```

### 3. Job-Specific Permissions

Added specific permissions to jobs that require them:

#### Security Scan Job
```yaml
permissions:
  contents: read
  security-events: write
  actions: read
```

#### Visual Regression Job
```yaml
permissions:
  contents: read
  issues: write
  pull-requests: write
  actions: read
```

#### Deployment Jobs
```yaml
permissions:
  contents: read
  actions: read
  packages: read
```

### 4. Environment Configuration Fix

Fixed the invalid environment name:
- Changed `preview-deployment` to `preview`

## Permission Breakdown

### Global Permissions
- `contents: read` - Read repository contents
- `issues: write` - Create/update issues and comments
- `pull-requests: write` - Create/update pull request comments
- `checks: write` - Create/update check runs
- `security-events: write` - Upload security scan results
- `actions: read` - Read workflow run information
- `packages: read` - Read package information

### Job-Specific Permissions
Each job only gets the permissions it actually needs, following the principle of least privilege.

## Security Considerations

1. **Least Privilege**: Each job only gets the minimum permissions required
2. **Explicit Tokens**: All GitHub API calls use explicit tokens
3. **Error Handling**: Proper error handling prevents sensitive data exposure
4. **Environment Isolation**: Different environments for production and preview deployments

## Testing the Fixes

To verify the fixes work correctly:

1. **Create a Pull Request**: The visual regression tests should now be able to post comments
2. **Check Security Tab**: Trivy scan results should upload successfully
3. **Monitor Deployments**: Both production and preview deployments should work
4. **Review Logs**: No more context access errors in the workflow logs

## Troubleshooting

If you still encounter context access errors:

1. **Check Repository Settings**: Ensure the repository allows GitHub Actions
2. **Verify Secrets**: Ensure all required secrets are properly configured
3. **Review Permissions**: Check if the repository has restricted permissions
4. **Update Actions**: Ensure all actions are using the latest versions

## Related Documentation

- [GitHub Actions Permissions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions)
- [GitHub Script Action](https://github.com/actions/github-script)
- [Vercel Action](https://github.com/amondnet/vercel-action)
- [Trivy Security Scanner](https://github.com/aquasecurity/trivy-action)

## Changelog

- **2025-01-07**: Added comprehensive permissions and context access fixes
- **2025-01-07**: Enhanced error handling in github-script actions
- **2025-01-07**: Fixed environment configuration issues
- **2025-01-07**: Added job-specific permissions for better security
