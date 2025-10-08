# Portfolio OS Housekeeping Scripts - Developer's Guide

## Overview

The housekeeping folder contains a comprehensive suite of PowerShell scripts designed to maintain and organize the Portfolio OS project structure. These scripts automate file organization, cleanup, and validation tasks to ensure the project remains well-structured and clean.

## Scripts Overview

### 1. `clean-house-basic.ps1` - Basic Development Branch Maintenance
**Purpose**: Simple housekeeping for basic development branch maintenance.

**What it does**:
- **File Organization**: Scans the root directory for misplaced files (`.ps1`, `.md`, `.json`, `.js`, `.ts`, `.sh`) that don't match standard project files (README, package, tsconfig, etc.). Moves PowerShell scripts to `scripts/utilities/`, markdown files to `docs/`, and other scripts to `scripts/utilities/`.
- **Temporary File Cleanup**: Recursively searches for and removes temporary files (`.log`, `.tmp`, `.temp`, `.DS_Store`, `Thumbs.db`) while avoiding `node_modules` directories.
- **Project Structure Validation**: Verifies the presence of required directories (`apps/site`, `apps/dashboard`, `packages/ui`, `packages/lib`, `scripts`, `docs`, `prompts`) and required files (`package.json`, `pnpm-workspace.yaml`, `turbo.json`, `README.md`).
- **Report Generation**: Creates timestamped reports in the `logs/` directory documenting all actions performed, files moved, and cleanup results.

**Features**:
- File organization (moves misplaced files to appropriate directories)
- Temporary file cleanup
- Project structure validation
- Report generation

**Usage**:
```powershell
.\clean-house-basic.ps1 -Mode full -DryRun
```

**Parameters**:
- `-Mode`: "full" (default)
- `-DryRun`: Preview changes without executing

### 2. `clean-house-main.ps1` - Comprehensive House Cleaning
**Purpose**: Full-featured housekeeping with multiple modes and advanced organization.

**What it does**:
- **Multi-Mode Execution**: Provides granular control over housekeeping operations through different execution modes, allowing developers to run specific tasks without full cleanup.
- **Advanced Documentation Organization**: Specifically organizes the `docs/` folder by creating subdirectories like `project-management/` and moving related files (e.g., `PROJECT_BOARD_AUDIT_REPORT.md`, `STALE_ISSUES_ANALYSIS.md`) to appropriate subdirectories.
- **Comprehensive File Structure Management**: Handles both root-level file organization and specialized documentation folder organization with predefined file mappings.
- **Detailed Validation**: Performs thorough validation of project structure, checking for both required directories and files, with specific attention to the monorepo structure.
- **Advanced Reporting**: Generates comprehensive reports that include mode-specific actions, file organization results, and detailed recommendations.

**Features**:
- Multiple execution modes (full, organization, cleanup, validation, docs)
- Advanced docs folder organization
- Comprehensive file structure validation
- Detailed reporting

**Usage**:
```powershell
.\clean-house-main.ps1 -Mode full -DryRun
```

**Modes**:
- `full`: Complete housekeeping (organization + cleanup + validation)
- `organization`: File organization only
- `cleanup`: Temporary file cleanup only
- `validation`: Project structure validation only
- `docs`: Documentation organization only

### 3. `clean-house-quick.ps1` - Quick Access Script
**Purpose**: Easy access to common housekeeping tasks with simplified interface.

**What it does**:
- **Simplified Interface**: Provides a user-friendly action-based interface that abstracts away the complexity of the main housekeeping script, making it easy for developers to perform common tasks.
- **Action Delegation**: Acts as a wrapper script that delegates to `clean-house-main.ps1` with appropriate parameters, ensuring consistent behavior across all housekeeping operations.
- **Quick Actions**: Offers three primary actions (clean, organize, validate) that map to the most commonly used housekeeping operations, reducing the need to remember complex parameter combinations.
- **Built-in Help System**: Includes comprehensive help documentation that explains available actions, usage examples, and parameter options directly within the script.

**Features**:
- Simplified action-based interface
- Delegates to main housekeeping script
- Help system

**Usage**:
```powershell
.\clean-house-quick.ps1 -Action clean
```

**Actions**:
- `clean`: Full house cleaning
- `organize`: File organization only
- `validate`: Project structure validation only
- `help`: Show help message

### 4. `clean-house-target.ps1` - Targeted Folder Cleaning
**Purpose**: Clean and organize specific project folders.

**What it does**:
- **Predefined Target Selection**: Provides a curated list of common project folders (`scripts`, `docs`, `prompts`, `apps`, `packages`, `automation`) with validation to ensure only valid targets are processed.
- **Targeted Operations**: Delegates to the generic `clean-folder.ps1` script with specific folder paths, ensuring consistent cleaning behavior across different project areas.
- **Smart Path Resolution**: Automatically resolves paths for different target types (e.g., `automation` maps to `docs/automation`) and handles folder-specific cleaning requirements.
- **Comprehensive Help System**: Includes detailed usage examples, target descriptions, and parameter explanations to guide developers in proper usage.

**Features**:
- Folder-specific cleaning
- Predefined target options
- Help system with usage examples

**Usage**:
```powershell
.\clean-house-target.ps1 -Target scripts -Mode full -DryRun
```

**Targets**:
- `scripts`: Clean and organize scripts folder
- `docs`: Clean and organize docs folder
- `prompts`: Clean and organize prompts folder
- `apps`: Clean and organize apps folder
- `packages`: Clean and organize packages folder
- `automation`: Clean and organize automation docs folder
- `help`: Show available targets

### 5. `clean-folder.ps1` - Generic Folder Cleaning
**Purpose**: Clean and organize any specified folder with advanced organization features.

**What it does**:
- **File Type-Based Organization**: Analyzes files within the target folder and groups them by extension, creating subdirectories for file types that have multiple instances (e.g., creating a `ps1/` subdirectory for multiple PowerShell scripts).
- **Advanced Cleanup Operations**: Removes temporary files (`.log`, `.tmp`, `.temp`), system files (`.DS_Store`, `Thumbs.db`), and build artifacts (`.next`, `dist`, `build`, `out`, `coverage`, `node_modules`) from the target folder and its subdirectories.
- **Folder Structure Validation**: Checks for recommended files (like `README.md`) within the target folder and reports missing documentation or organizational files.
- **Comprehensive Reporting**: Generates detailed reports specific to the target folder, including files organized, temporary files cleaned, and validation results.

**Features**:
- Generic folder targeting
- File type-based organization
- Build artifact cleanup
- Comprehensive validation

**Usage**:
```powershell
.\clean-folder.ps1 -TargetFolder "path/to/folder" -Mode full -DryRun
```

### 6. `clean-house-working.ps1` - Production-Ready Housekeeping
**Purpose**: Actually performs housekeeping work (not just dry runs).

**What it does**:
- **Real File Operations**: Performs actual file movements, deletions, and organizational tasks rather than just simulating them, making it the production-ready version of the housekeeping system.
- **Comprehensive Cleanup**: Executes thorough cleanup of temporary files, system files, and build artifacts with real file system operations, ensuring the project is actually cleaned rather than just analyzed.
- **Production-Grade Implementation**: Includes robust error handling, detailed logging, and comprehensive reporting that tracks actual changes made to the file system.
- **Detailed Reporting**: Generates timestamped reports in the `logs/` directory that document all actual operations performed, including files moved, cleaned, and validation results.

**Features**:
- Real file operations
- Comprehensive cleanup
- Detailed reporting
- Production-ready implementation

**Usage**:
```powershell
.\clean-house-working.ps1 -Mode full -DryRun
```

### 7. `clean-house-advanced.ps1` - Advanced House Cleaning with Security & Performance Analysis
**Purpose**: Comprehensive housekeeping with advanced security scanning, performance analysis, and dependency management.

**What it does**:
- **Advanced Security Scanning**: Scans for sensitive files (`.env`, `.key`, `.pem`, etc.) and hardcoded secrets in code files, providing security vulnerability assessment.
- **Performance Analysis**: Identifies large files, duplicate files, and unused assets, providing detailed performance optimization recommendations.
- **Dependency Analysis**: Checks for outdated packages, unused dependencies, and security vulnerabilities in project dependencies.
- **Git History Cleanup**: Analyzes Git history for large commits, merge patterns, old branches, and large files in history.
- **Deep Cleaning Operations**: Removes old backups, logs, and temporary directories with configurable age limits.
- **Comprehensive Reporting**: Generates detailed reports covering security findings, performance issues, dependency status, and Git history analysis.

**Features**:
- Security vulnerability scanning
- Performance optimization analysis
- Dependency management
- Git history analysis
- Deep cleaning operations
- Advanced reporting

**Usage**:
```powershell
.\clean-house-advanced.ps1 -Mode full -DryRun -Verbose
```

**Modes**:
- `full`: Complete advanced housekeeping (security + performance + dependencies + git + deep clean)
- `deep-clean`: Deep cleaning operations only
- `security`: Security scanning only
- `performance`: Performance analysis only
- `dependencies`: Dependency analysis only
- `git-history`: Git history cleanup only

## Common Features

### File Organization
All scripts include file organization capabilities that automatically detect and relocate misplaced files:
- **PowerShell scripts** (`.ps1`) → `scripts/utilities/` (moves standalone PowerShell scripts from root to utilities folder)
- **Markdown files** (`.md`) → `docs/` (relocates documentation files to the docs directory)
- **Other scripts** (`.js`, `.ts`, `.sh`) → `scripts/utilities/` (organizes various script files into the utilities folder)

### Cleanup Operations
The scripts perform comprehensive cleanup of various file types:
- **Temporary files**: `*.log`, `*.tmp`, `*.temp` (removes log files and temporary data)
- **System files**: `.DS_Store`, `Thumbs.db` (cleans macOS and Windows system files)
- **Build artifacts**: `.next`, `dist`, `build`, `out`, `coverage` (removes generated build outputs and test coverage data)

### Validation Checks
Scripts validate the project structure by checking for:
- **Required directories**: `apps/site`, `apps/dashboard`, `packages/ui`, `packages/lib`, `scripts`, `docs`, `prompts` (ensures monorepo structure is intact)
- **Required files**: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `README.md` (verifies essential project configuration files exist)

### Reporting
All scripts generate detailed reports in the `logs/` directory that provide:
- **Timestamped report files**: Each report includes generation date/time for tracking
- **Action summaries**: Detailed breakdown of all operations performed
- **Recommendations**: Suggestions for maintaining project organization
- **Results tracking**: Counts of files moved, cleaned, and validated

## Usage Patterns

### Daily Development
**Purpose**: Quick maintenance during active development to keep the project clean and organized.

```powershell
# Quick cleanup - removes temp files and organizes misplaced files
.\clean-house-quick.ps1 -Action clean

# Validate structure - checks project integrity without making changes
.\clean-house-quick.ps1 -Action validate
```

**What this accomplishes**:
- Removes temporary files that accumulate during development
- Organizes any files that were accidentally placed in the root directory
- Validates that the project structure remains intact
- Provides quick feedback on project health

### Weekly Maintenance
**Purpose**: Comprehensive cleanup and organization to maintain long-term project health.

```powershell
# Full housekeeping - complete organization, cleanup, and validation
.\clean-house-main.ps1 -Mode full

# Organize specific folders - targeted cleanup of documentation and scripts
.\clean-house-target.ps1 -Target docs
.\clean-house-target.ps1 -Target scripts
```

**What this accomplishes**:
- Performs deep cleanup of all project areas
- Organizes documentation files into proper subdirectories
- Cleans and organizes script files
- Validates entire project structure
- Generates comprehensive reports for tracking

### Pre-commit Cleanup
**Purpose**: Ensure the project is clean and organized before committing changes.

```powershell
# Dry run first - preview all changes without executing them
.\clean-house-working.ps1 -Mode full -DryRun

# Execute if satisfied - perform actual cleanup operations
.\clean-house-working.ps1 -Mode full
```

**What this accomplishes**:
- Previews all cleanup operations before execution
- Ensures no important files will be accidentally moved or deleted
- Performs final cleanup before code is committed
- Maintains clean commit history

### Folder-Specific Maintenance
**Purpose**: Targeted cleanup of specific project areas that need attention.

```powershell
# Clean specific folder - comprehensive cleanup of a single directory
.\clean-folder.ps1 -TargetFolder "apps/site" -Mode full

# Clean with dry run - preview changes to a specific folder
.\clean-folder.ps1 -TargetFolder "packages" -Mode full -DryRun
```

**What this accomplishes**:
- Focuses cleanup efforts on specific areas that need attention
- Organizes files within a single directory by type
- Removes build artifacts and temporary files from specific locations
- Provides detailed reporting for targeted areas

## Safety Features

### Dry Run Mode
All scripts support `-DryRun` parameter to preview changes:
```powershell
.\clean-house-main.ps1 -Mode full -DryRun
```

### Branch Validation
Scripts check for correct branch (`develop`) before execution:
```powershell
$currentBranch = git branch --show-current
if ($currentBranch -ne "develop") {
    Write-Host "WARNING: Not on develop branch" -ForegroundColor Yellow
    exit 1
}
```

### Error Handling
- Graceful error handling with try-catch blocks
- Detailed error messages
- Safe file operations

## Integration with Project Workflow

### Pre-commit Hooks
```powershell
# Add to pre-commit hook
.\scripts\housekeeping\clean-house-quick.ps1 -Action validate
```

### CI/CD Integration
```powershell
# Add to build pipeline
.\scripts\housekeeping\clean-house-working.ps1 -Mode full
```

### Scheduled Maintenance
```powershell
# Weekly cleanup task
.\scripts\housekeeping\clean-house-main.ps1 -Mode full
```

## Best Practices

### 1. Always Use Dry Run First
```powershell
# Preview changes
.\clean-house-main.ps1 -Mode full -DryRun

# Execute if satisfied
.\clean-house-main.ps1 -Mode full
```

### 2. Regular Maintenance Schedule
- **Daily**: Quick validation
- **Weekly**: Full housekeeping
- **Pre-commit**: Structure validation
- **Pre-release**: Comprehensive cleanup

### 3. Monitor Reports
Check generated reports in `logs/` directory for:
- Files moved
- Cleanup results
- Missing components
- Recommendations

### 4. Customize for Your Needs
- Modify file patterns in scripts
- Add new validation rules
- Extend cleanup patterns
- Customize report formats

## Troubleshooting

### Common Issues

#### Script Execution Policy
```powershell
# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Branch Validation Errors
```powershell
# Switch to develop branch
git checkout develop
```

#### Permission Errors
```powershell
# Run as administrator
Start-Process PowerShell -Verb RunAs
```

### Debug Mode
Add debug output to scripts:
```powershell
$VerbosePreference = "Continue"
.\clean-house-main.ps1 -Mode full -Verbose
```

## Contributing

### Adding New Scripts
1. Follow naming convention: `clean-house-[purpose].ps1`
2. Include parameter validation
3. Add help system
4. Include error handling
5. Generate reports

### Modifying Existing Scripts
1. Test with dry run first
2. Update documentation
3. Test on different branches
4. Validate error handling

## Dependencies

### Required Tools
- PowerShell 5.1 or later
- Git (for branch validation)
- File system access

### Optional Tools
- PowerShell Core (for cross-platform support)
- Git hooks (for automation)

## Security Considerations

### File Operations
- Scripts only move/organize files, never delete important content
- Dry run mode prevents accidental changes
- Branch validation prevents execution on wrong branches

### Permissions
- Scripts require read/write access to project directory
- No elevated privileges required for normal operation
- Safe file operations with error handling

## Performance

### Optimization
- Recursive file searches are limited to avoid node_modules
- Batch operations for efficiency
- Minimal file system operations

### Monitoring
- Reports include performance metrics
- File operation counts
- Execution time tracking

## Future Enhancements

### Planned Features
- Configuration file support
- Custom cleanup rules
- Integration with package managers
- Cross-platform compatibility
- Advanced reporting

### Extension Points
- Custom validation rules
- Additional cleanup patterns
- Integration with external tools
- Automated scheduling

---

## Quick Reference

### Most Common Commands
```powershell
# Quick cleanup
.\clean-house-quick.ps1 -Action clean

# Full housekeeping
.\clean-house-main.ps1 -Mode full

# Advanced housekeeping with security & performance analysis
.\clean-house-advanced.ps1 -Mode full -DryRun

# Target specific folder
.\clean-house-target.ps1 -Target scripts

# Clean any folder
.\clean-folder.ps1 -TargetFolder "path/to/folder"
```

### Emergency Commands
```powershell
# Dry run everything
.\clean-house-main.ps1 -Mode full -DryRun

# Advanced security scan
.\clean-house-advanced.ps1 -Mode security -DryRun

# Validate only
.\clean-house-quick.ps1 -Action validate

# Help
.\clean-house-quick.ps1 -Action help
.\clean-house-target.ps1 -Target help
```

This documentation provides comprehensive guidance for using the housekeeping scripts effectively in the Portfolio OS project development workflow.
