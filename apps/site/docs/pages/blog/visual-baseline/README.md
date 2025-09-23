# Visual Regression Testing - Baseline Images

This directory contains the baseline images for visual regression testing of the blog page. These images serve as the "golden standard" against which all future changes are compared.

## Directory Structure

```
visual-baseline/
├── README.md (this file)
├── blog-page-desktop.png
├── blog-page-tablet.png
├── blog-page-mobile.png
├── blog-page-desktop-dark.png
├── post-card-hover.png
├── newsletter-form-default.png
└── newsletter-form-filled.png
```

## How It Works

1. **Baseline Creation**: When visual regression tests are first run, they create baseline images in the `test-results/` directory
2. **Comparison**: Subsequent test runs compare new screenshots against these baseline images
3. **Threshold**: Visual differences are flagged if they exceed 0.1% (configurable)
4. **Updates**: Baseline images can be updated when intentional design changes are made

## Updating Baseline Images

### Local Development
```bash
# Update all visual regression baselines
pnpm test:visual:update

# Update specific test baselines
pnpm test:visual --update-snapshots
```

### CI/CD Integration
- Visual regression tests run automatically on PRs that modify blog-related files
- Failed tests block the build and post results as PR comments
- Baseline updates require intentional approval via the update command

## Test Coverage

The visual regression tests cover:

### Viewport Sizes
- **Desktop**: 1280x800px
- **Tablet**: 834x1112px  
- **Mobile**: 390x844px

### Theme States
- **Light Mode**: Default theme
- **Dark Mode**: Toggled dark theme

### Component States
- **Post Cards**: Default and hover states
- **Newsletter Form**: Default and filled states

### Page Sections
- **Full Page**: Complete blog page layout
- **Hero Section**: Top section with title and social links
- **Featured Post**: Large featured article display
- **Latest Posts**: Grid of recent articles
- **Newsletter CTA**: Subscription form section

## Configuration

### Threshold Settings
- **Default**: 0.1% pixel difference threshold
- **Animations**: Disabled for consistent screenshots
- **Full Page**: Screenshots capture entire page content

### File Naming Convention
- `blog-page-{viewport}-{theme}.png` - Full page screenshots
- `{component}-{state}.png` - Component-specific screenshots

## Troubleshooting

### Common Issues

1. **False Positives**: Minor rendering differences due to fonts, anti-aliasing
   - **Solution**: Review diffs and update baselines if changes are acceptable

2. **Animation Interference**: Moving elements causing test failures
   - **Solution**: Animations are disabled in test environment

3. **Timing Issues**: Elements not fully loaded before screenshot
   - **Solution**: Tests wait for `networkidle` state and additional timeouts

### Debugging Failed Tests

1. **Check Test Results**: Review the `test-results/` directory for diff images
2. **Compare Artifacts**: Download and compare actual vs expected images
3. **Local Testing**: Run tests locally to reproduce issues
4. **Update Baselines**: If changes are intentional, update the baseline images

## Best Practices

1. **Regular Updates**: Update baselines when making intentional design changes
2. **Review Diffs**: Always review visual differences before accepting changes
3. **Consistent Environment**: Run tests in consistent browser environments
4. **Documentation**: Document any baseline updates in commit messages

## Integration with CI/CD

The visual regression tests are integrated into the GitHub Actions workflow:

- **Trigger**: Runs on PRs that modify blog-related files
- **Failure Handling**: Blocks build if visual differences exceed threshold
- **Artifact Upload**: Uploads test results and screenshots for review
- **PR Comments**: Posts test results directly to PR for easy review

## Maintenance

### Regular Tasks
- Review and update baselines when design system changes
- Monitor test performance and adjust timeouts if needed
- Update test coverage when new components are added
- Clean up old test artifacts periodically

### Baseline Image Management
- Keep baseline images in version control
- Document any baseline updates in commit messages
- Consider baseline image compression for repository size
- Regular review of baseline accuracy and relevance

---

*This documentation is automatically updated when visual regression testing configuration changes.*