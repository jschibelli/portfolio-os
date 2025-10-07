# Project Management Scripts

This directory contains PowerShell scripts for comprehensive GitHub project management, automated field configuration, and project board optimization for the Portfolio OS project.

## 📁 Directory Structure

```
scripts/project-management/
├── manage-projects.ps1              # Main project management system
├── backfill-project-fields.ps1      # Enhanced field backfill automation
├── update-project-status-webhook.ps1 # Webhook integration for status updates
├── PROJECT_ANALYSIS.md              # Analysis and organization documentation
├── DEVELOPER_GUIDE.md               # Comprehensive developer guide
└── README.md                        # This file
```

## 🚀 Quick Start

### Basic Project Management
```powershell
# Add issues to project with preset configuration
.\manage-projects.ps1 -Operation add -Preset "blog" -Issues @(196, 197, 198)

# Configure project fields
.\manage-projects.ps1 -Operation configure -Preset "blog" -Priority P1 -Size M

# Update project status
.\manage-projects.ps1 -Operation status -Issues @(196, 197) -Status "In progress"
```

### Field Backfill and Standardization
```powershell
# Standardize all project fields
.\backfill-project-fields.ps1 -ProjectNumber "20" -Owner "jschibelli"
```

### Webhook Integration
```powershell
# Trigger status update webhooks
.\update-project-status-webhook.ps1 -IssueNumber 250 -Action "start" -AgentName "agent-1"
```

## 📋 Core Features

### 🔧 Project Management (`manage-projects.ps1`)
- **Operations**: Add, configure, status, labels, milestone, all
- **Presets**: blog, dashboard, docs, infra, custom
- **Field Management**: Priority, Size, App, Area, Status
- **Bulk Operations**: Process multiple issues efficiently

### 🔄 Field Backfill (`backfill-project-fields.ps1`)
- **Enhanced Field Mapping**: Status, Priority, Size, App, Area, RiskLevel, Dependencies, Testing
- **Intelligent Analysis**: AI-powered field determination based on issue content
- **Comprehensive Coverage**: All project fields standardized
- **Error Handling**: Robust error handling and progress tracking

### 🔗 Webhook Integration (`update-project-status-webhook.ps1`)
- **Actions**: start, complete, create-pr, merge-pr
- **Real-time Updates**: Instant project status synchronization
- **Agent Integration**: Multi-agent workflow support
- **GitHub Actions**: Seamless CI/CD integration

## 🎯 Available Presets

### Blog Preset
- **Issues**: 196-208 (content management, publishing, SEO)
- **Focus**: Content creation, blog optimization, publishing workflow
- **Fields**: Portfolio Site, Content/Frontend, P1 priority

### Dashboard Preset
- **Issues**: 150-160 (dashboard functionality, UI/UX)
- **Focus**: Dashboard features, user interface, analytics
- **Fields**: Dashboard, Frontend, P1 priority

### Docs Preset
- **Issues**: 180-190 (documentation, guides, tutorials)
- **Focus**: Documentation creation, maintenance, user guides
- **Fields**: Docs, Content, P2 priority

### Infra Preset
- **Issues**: 170-179 (infrastructure, deployment, security)
- **Focus**: System infrastructure, deployment, security
- **Fields**: Infra, Infrastructure, P1 priority

## 🔧 Field Configuration

### Enhanced Field Mapping
The consolidated system now includes advanced field analysis:

#### Risk Level Analysis
- **Critical**: Security, vulnerabilities, data loss
- **High**: Breaking changes, migrations, refactoring
- **Medium**: Enhancements, features, moderate changes
- **Low**: Default for standard tasks

#### Dependencies Analysis
- **High**: Depends on other issues, blocked by dependencies
- **Medium**: API changes, integration requirements
- **Low**: Standalone, independent tasks
- **None**: Default for independent work

#### Testing Requirements
- **Manual**: UI/UX, design, visual changes
- **E2E**: End-to-end workflows, user journeys
- **Integration**: API, service, component integration
- **Unit**: Default for standard development

## 📊 Usage Examples

### Complete Project Setup
```powershell
# Full project management workflow
.\manage-projects.ps1 -Operation all -Preset "blog" -Issues @(196, 197, 198, 199, 200)
```

### Custom Field Configuration
```powershell
# Configure with custom values
.\manage-projects.ps1 -Operation configure -Issues @(250, 251) -Priority P0 -Size XL -App "Dashboard" -Area "Backend"
```

### Bulk Operations
```powershell
# Process multiple issues
$issues = @(196, 197, 198, 199, 200, 201, 202, 203, 204, 205)
.\manage-projects.ps1 -Operation add -Issues $issues -Preset "blog"
.\manage-projects.ps1 -Operation configure -Issues $issues -Priority P1 -Size M
```

### Status Workflow
```powershell
# Update issue status
.\manage-projects.ps1 -Operation status -Issues @(250, 251) -Status "In progress"
.\update-project-status-webhook.ps1 -IssueNumber 250 -Action "complete" -AgentName "agent-1"
```

## 🛠️ Configuration

### Project Settings
- **Project ID**: `PVT_kwHOAEnMVc4BCu-c`
- **Default Owner**: `jschibelli`
- **Base Branch**: `develop`

### Field IDs
The system uses predefined field IDs for Portfolio OS project:
- **Status**: `PVTSSF_lAHOAEnMVc4BCu-czg028oM`
- **Priority**: `PVTSSF_lAHOAEnMVc4BCu-czg028qQ`
- **Size**: `PVTSSF_lAHOAEnMVc4BCu-czg028qU`
- **App**: `PVTSSF_lAHOAEnMVc4BCu-czg156-s`
- **Area**: `PVTSSF_lAHOAEnMVc4BCu-czg156_Y`
- **Risk Level**: `PVTSSF_lAHOAEnMVc4BCu-czg2Ywbs`
- **Dependencies**: `PVTSSF_lAHOAEnMVc4BCu-czg2YwgE`
- **Testing**: `PVTSSF_lAHOAEnMVc4BCu-czg2Ywhs`

## 📈 Recent Improvements

### Consolidated System
- ✅ **Merged duplicate files** from automation folder
- ✅ **Enhanced field mapping** with RiskLevel, Dependencies, Testing
- ✅ **Intelligent analysis** functions for all field types
- ✅ **Comprehensive documentation** and developer guide
- ✅ **Unified project management** system

### Enhanced Features
- **Advanced Field Analysis**: AI-powered field determination
- **Comprehensive Coverage**: All project fields included
- **Error Handling**: Robust error handling and recovery
- **Progress Tracking**: Detailed operation logging
- **Webhook Integration**: Real-time status updates

## 🔍 Dependencies

These scripts require:
- **GitHub CLI** (`gh`) - For project and issue management
- **PowerShell 7+** - For script execution
- **Portfolio OS Project** - Must be run from project root
- **Authentication** - GitHub CLI must be authenticated

## 📚 Documentation

- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Comprehensive enterprise developer guide
- **[PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md)** - Analysis and organization documentation
- **This README** - Quick start and usage guide

## 🚀 Future Enhancements

- Add project analytics and reporting
- Implement automated testing integration
- Create project template system
- Add performance metrics tracking
- Implement project dependency mapping

---

*Last Updated: 2025-10-06*
*Version: 2.0.0 (Consolidated)*
*Enhanced with advanced field mapping and intelligent analysis*
