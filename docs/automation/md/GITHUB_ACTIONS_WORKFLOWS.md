# GitHub Actions Workflows Documentation

## Overview

The Portfolio OS project uses a comprehensive set of GitHub Actions workflows to automate the entire development lifecycle. These workflows handle everything from issue creation to deployment, providing seamless automation with intelligent coordination.

## Workflow Architecture

### Event-Driven Automation

All workflows are triggered by specific GitHub events and designed to work together in a coordinated manner:

```
Issue Events → Issue Workflows → PR Events → PR Workflows → Merge Events → Deployment
```

## Core Workflows

### 1. Issue Orchestration (`orchestrate-issues-prs.yml`)

**File**: `.github/workflows/orchestrate-issues-prs.yml`

**Purpose**: Manages the complete issue-to-PR lifecycle with intelligent automation

**Triggers**:
```yaml
on:
  issues:
    types: [opened, edited, closed]
  pull_request:
    types: [opened, synchronize, closed, review_requested, review_request_removed]
  workflow_dispatch:
    inputs:
      issue_number:
        description: "Issue number to process"
        required: true
        type: string
```

**Key Features**:

#### Issue Processing
- **Automatic Configuration**: Issues are automatically configured with project fields
- **Intelligent Categorization**: Issues are categorized based on title and content analysis
- **Priority Assignment**: Automatic priority assignment based on issue characteristics
- **Label Management**: Intelligent label assignment and management

#### Branch Management
- **Automatic Branch Creation**: Creates branches from develop with proper naming
- **Branch Protection**: Ensures branches follow naming conventions
- **Conflict Prevention**: Prevents branch naming conflicts

#### PR Creation and Management
- **Draft PR Creation**: Creates draft PRs with proper metadata
- **Project Integration**: Automatically adds PRs to project board
- **Field Configuration**: Sets appropriate project fields
- **Assignment Management**: Assigns PRs to appropriate team members

#### CR-GPT Integration
- **Automatic Analysis**: Triggers CR-GPT analysis on PR creation
- **Response Generation**: Generates intelligent responses to CR-GPT feedback
- **Status Updates**: Updates project status based on review feedback

**Workflow Steps**:

1. **Issue Detection and Routing**
   ```yaml
   - name: Detect and route issue/PR
     id: detect-and-route
     run: |
       if [ "${{ github.event_name }}" = "issues" ]; then
         echo "issue_number=${{ github.event.issue.number }}" >> $GITHUB_OUTPUT
         echo "is_issue=true" >> $GITHUB_OUTPUT
       elif [ "${{ github.event_name }}" = "pull_request" ]; then
         echo "pr_number=${{ github.event.pull_request.number }}" >> $GITHUB_OUTPUT
         echo "is_pr=true" >> $GITHUB_OUTPUT
       fi
   ```

2. **Issue Configuration**
   ```yaml
   - name: Auto-configure issue
     if: steps.detect-and-route.outputs.is_issue == 'true'
     run: |
       pwsh -c "./scripts/auto-configure-issues.ps1 -IssueNumber ${{ steps.detect-and-route.outputs.issue_number }}"
   ```

3. **Branch Creation**
   ```yaml
   - name: Create branch from develop
     if: steps.detect-and-route.outputs.is_issue == 'true'
     run: |
       pwsh -c "./scripts/create-branch-from-develop.ps1 -IssueNumber ${{ steps.detect-and-route.outputs.issue_number }}"
   ```

4. **PR Creation**
   ```yaml
   - name: Create draft PR
     if: steps.detect-and-route.outputs.is_issue == 'true'
     run: |
       pwsh -c "./scripts/issue-implementation.ps1 -IssueNumber ${{ steps.detect-and-route.outputs.issue_number }}"
   ```

5. **CR-GPT Analysis**
   ```yaml
   - name: CR-GPT Analysis
     if: success()
     run: |
       pwsh -c "./scripts/universal-pr-automation-simple.ps1 -PRNumber ${{ steps.detect-and-route.outputs.pr_number }}"
   ```

### 2. PR Automation (`pr-automation-optimized.yml`)

**File**: `.github/workflows/pr-automation-optimized.yml`

**Purpose**: Handles pull request processing, review automation, and merge management

**Triggers**:
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review, review_requested, review_request_removed]
  workflow_dispatch:
    inputs:
      pr_number:
        description: "PR number to process"
        required: true
        type: string
```

**Key Features**:

#### PR Configuration
- **Automatic Field Setting**: Configures project fields based on PR content
- **Assignment Management**: Assigns PRs to appropriate reviewers
- **Status Tracking**: Updates project status throughout PR lifecycle

#### Quality Assurance
- **Code Quality Checks**: Runs linting and formatting checks
- **Test Execution**: Executes relevant test suites
- **Security Scanning**: Performs security vulnerability scans
- **Dependency Analysis**: Checks for outdated dependencies

#### Review Automation
- **CR-GPT Integration**: Automatic code review analysis
- **Response Generation**: Intelligent responses to review feedback
- **Status Updates**: Automatic status updates based on review results

#### Merge Management
- **Merge Readiness**: Checks all merge requirements
- **Conflict Resolution**: Assists with merge conflict resolution
- **Deployment Preparation**: Prepares for deployment after merge

**Workflow Steps**:

1. **PR Analysis**
   ```yaml
   - name: Analyze PR
     id: analyze-pr
     run: |
       echo "pr_number=${{ github.event.pull_request.number }}" >> $GITHUB_OUTPUT
       echo "base_branch=${{ github.event.pull_request.base.ref }}" >> $GITHUB_OUTPUT
   ```

2. **Quality Checks**
   ```yaml
   - name: Run quality checks
     run: |
       pwsh -c "./scripts/code-quality-checker.ps1 -PRNumber ${{ steps.analyze-pr.outputs.pr_number }}"
   ```

3. **CR-GPT Analysis**
   ```yaml
   - name: CR-GPT Analysis
     run: |
       pwsh -c "./scripts/universal-pr-automation-simple.ps1 -PRNumber ${{ steps.analyze-pr.outputs.pr_number }}"
   ```

4. **Status Updates**
   ```yaml
   - name: Update project status
     run: |
       pwsh -c "./scripts/project-status-monitor.ps1 -PRNumber ${{ steps.analyze-pr.outputs.pr_number }}"
   ```

### 3. Issue Auto-Configuration (`auto-configure-issues-optimized.yml`)

**File**: `.github/workflows/auto-configure-issues-optimized.yml`

**Purpose**: Automatically configures new issues with appropriate metadata and project fields

**Triggers**:
```yaml
on:
  issues:
    types: [opened, edited]
  workflow_dispatch:
    inputs:
      issue_number:
        description: "Issue number to configure"
        required: true
        type: string
```

**Key Features**:

#### Intelligent Categorization
- **Title Analysis**: Analyzes issue titles for categorization
- **Content Analysis**: Examines issue body for additional context
- **Label Analysis**: Uses existing labels for classification
- **Historical Data**: Learns from previous issue patterns

#### Automatic Field Assignment
- **Priority Assignment**: Assigns priority based on issue characteristics
- **Size Estimation**: Estimates issue size based on complexity
- **App Assignment**: Determines which application the issue affects
- **Area Assignment**: Categorizes by functional area

#### Project Integration
- **Project Board Addition**: Automatically adds issues to project board
- **Field Configuration**: Sets all required project fields
- **Status Management**: Manages issue status throughout lifecycle

**Configuration Logic**:

```yaml
# Auto-detect configuration based on issue title/content
if echo "$ISSUE_TITLE" | grep -qi "blog\|article\|post"; then
  PRIORITY="P1"
  SIZE="M"
  APP="Portfolio Site"
  AREA="Frontend"
  LABELS="ready-to-implement,priority: high,area: functionality"
elif echo "$ISSUE_TITLE" | grep -qi "dashboard\|admin"; then
  PRIORITY="P1"
  SIZE="M"
  APP="Dashboard"
  AREA="Frontend"
  LABELS="ready-to-implement,priority: high,area: functionality"
elif echo "$ISSUE_TITLE" | grep -qi "doc\|readme\|guide"; then
  PRIORITY="P2"
  SIZE="S"
  APP="Docs"
  AREA="Content"
  LABELS="ready-to-implement,priority: medium,area: content"
elif echo "$ISSUE_TITLE" | grep -qi "infra\|deploy\|ci\|cd"; then
  PRIORITY="P1"
  SIZE="L"
  APP="Portfolio Site"
  AREA="Infra"
  LABELS="ready-to-implement,priority: high,area: infra"
```

### 4. CI/CD Pipeline (`ci-optimized.yml`)

**File**: `.github/workflows/ci-optimized.yml`

**Purpose**: Continuous integration and deployment with optimized performance

**Triggers**:
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
    paths:
      - "apps/**"
      - "packages/**"
      - ".github/workflows/**"
  push:
    branches: [ develop ]
    paths:
      - "apps/**"
      - "packages/**"
      - ".github/workflows/**"
```

**Key Features**:

#### Path-Based Execution
- **Smart Filtering**: Only runs jobs for changed components
- **Parallel Execution**: Runs independent jobs in parallel
- **Resource Optimization**: Optimizes resource usage based on changes

#### Build and Test Matrix
```yaml
strategy:
  fail-fast: false
  matrix:
    app: [ "site", "dashboard" ]
    include:
      - app: "site"
        changed: ${{ needs.paths.outputs.site }}
        workspace: "@mindware-blog/site"
        path: "apps/site"
      - app: "dashboard"
        changed: ${{ needs.paths.outputs.dashboard }}
        workspace: "@mindware-blog/dashboard"
        path: "apps/dashboard"
```

#### Caching Strategy
- **Dependency Caching**: Caches node_modules and dependencies
- **Build Artifact Caching**: Caches build outputs
- **Test Result Caching**: Caches test results for faster execution

#### Quality Gates
- **Linting**: Code quality checks
- **Type Checking**: TypeScript type validation
- **Testing**: Unit and integration tests
- **Security Scanning**: Vulnerability detection

### 5. PR Conflict Guard (`pr-conflict-guard.yml`)

**File**: `.github/workflows/pr-conflict-guard.yml`

**Purpose**: Prevents merge conflicts and ensures PR mergeability

**Triggers**:
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
```

**Key Features**:

#### Mergeability Checks
- **Conflict Detection**: Automatically detects merge conflicts
- **Auto-Rebase**: Attempts automatic rebase to resolve conflicts
- **Lockfile Management**: Handles lockfile conflicts intelligently

#### Conflict Resolution
```yaml
- name: Try auto-rebase onto base branch
  if: steps.pr.outputs.mergeable == 'CONFLICTING'
  run: |
    git config user.name "github-actions[bot]"
    git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
    
    BASE='${{ github.event.pull_request.base.ref }}'
    git fetch origin "$BASE"
    
    if ! git rebase "origin/$BASE"; then
      echo "Rebase had conflicts. Attempt safe fixes..."
      git rebase --abort || true
      
      if [ -f pnpm-lock.yaml ] || [ -f package-lock.json ] || [ -f yarn.lock ]; then
        # Handle lockfile conflicts
      fi
    fi
```

### 6. E2E Testing (`e2e-optimized.yml`)

**File**: `.github/workflows/e2e-optimized.yml`

**Purpose**: End-to-end testing with Playwright

**Triggers**:
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
    paths:
      - "apps/site/**"
      - "apps/dashboard/**"
  push:
    branches: [ develop ]
    paths:
      - "apps/site/**"
      - "apps/dashboard/**"
```

**Key Features**:

#### Playwright Integration
- **Cross-Browser Testing**: Tests on multiple browsers
- **Visual Regression**: Screenshot comparison testing
- **Performance Testing**: Load time and performance metrics
- **Accessibility Testing**: Automated accessibility checks

#### Test Configuration
```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: |
    npx playwright test --reporter=html
  env:
    PLAYWRIGHT_BASE_URL: ${{ steps.deploy.outputs.preview_url }}
```

## Workflow Dependencies

### Execution Order

1. **Issue Creation** → `auto-configure-issues-optimized.yml`
2. **Issue Processing** → `orchestrate-issues-prs.yml`
3. **PR Creation** → `pr-automation-optimized.yml`
4. **Quality Checks** → `ci-optimized.yml`
5. **Testing** → `e2e-optimized.yml`
6. **Conflict Resolution** → `pr-conflict-guard.yml`
7. **Deployment** → Deployment workflows

### Inter-Workflow Communication

Workflows communicate through:
- **GitHub API**: Status updates and metadata
- **Project Board**: Field updates and status changes
- **Artifacts**: Test results and build outputs
- **Environment Variables**: Configuration and secrets

## Configuration Management

### Environment Variables

**Required Secrets**:
```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  PROJECT_ID: ${{ secrets.PROJECT_ID }}
```

**Optional Configuration**:
```yaml
env:
  NODE_VERSION: '20'
  PNPM_VERSION: 'latest'
  MAX_CONCURRENT_JOBS: 3
  CACHE_TIMEOUT: 3600
```

### Workflow Permissions

```yaml
permissions:
  contents: read
  issues: write
  pull-requests: write
  actions: read
  checks: write
```

## Monitoring and Observability

### Workflow Status Tracking

- **Success/Failure Rates**: Monitor workflow execution success
- **Execution Time**: Track workflow performance
- **Resource Usage**: Monitor resource consumption
- **Error Patterns**: Identify common failure points

### Logging and Debugging

```yaml
- name: Debug information
  if: failure()
  run: |
    echo "Workflow failed at step: ${{ github.step }}"
    echo "Error context: ${{ github.event }}"
    echo "Repository: ${{ github.repository }}"
    echo "Ref: ${{ github.ref }}"
```

### Notifications

- **Success Notifications**: Notify on successful deployments
- **Failure Alerts**: Alert on workflow failures
- **Status Updates**: Update project board with workflow status
- **Slack Integration**: Send notifications to team channels

## Best Practices

### Workflow Design

1. **Idempotency**: Workflows should be safe to run multiple times
2. **Failure Handling**: Graceful handling of failures and retries
3. **Resource Optimization**: Efficient use of GitHub Actions minutes
4. **Security**: Proper secret management and permissions

### Performance Optimization

1. **Caching**: Implement appropriate caching strategies
2. **Parallel Execution**: Run independent jobs in parallel
3. **Path Filtering**: Only run workflows for relevant changes
4. **Resource Limits**: Set appropriate resource limits

### Maintenance

1. **Regular Updates**: Keep actions and dependencies updated
2. **Monitoring**: Monitor workflow performance and success rates
3. **Documentation**: Maintain up-to-date workflow documentation
4. **Testing**: Test workflow changes in development environment

## Troubleshooting

### Common Issues

#### Workflow Failures
- **Permission Issues**: Check workflow permissions
- **Secret Problems**: Verify secret configuration
- **Resource Limits**: Check GitHub Actions limits
- **Dependency Issues**: Verify action versions and compatibility

#### Performance Problems
- **Slow Execution**: Optimize caching and parallel execution
- **Resource Usage**: Monitor and optimize resource consumption
- **Queue Delays**: Check GitHub Actions queue status

#### Integration Issues
- **API Rate Limits**: Implement rate limiting and retries
- **Authentication**: Verify token permissions and expiration
- **Data Consistency**: Ensure proper state management

### Debugging Techniques

1. **Enable Debug Logging**: Use `ACTIONS_STEP_DEBUG` and `ACTIONS_RUNNER_DEBUG`
2. **Check Workflow Runs**: Review workflow run logs and artifacts
3. **Test Locally**: Use `act` to test workflows locally
4. **Monitor Metrics**: Use GitHub Actions insights and metrics

This comprehensive GitHub Actions workflow system provides robust automation for the entire development lifecycle, from issue creation to deployment, with intelligent coordination and comprehensive error handling.
