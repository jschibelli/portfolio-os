#!/usr/bin/env pwsh
# Backfill Project Fields Script
# Standardizes all project fields across issues based on memory configuration

param(
    [string]$ProjectNumber = "20",
    [string]$Owner = "jschibelli"
)

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "      Project Fields Backfill System" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

# Get all project items
Write-Host "Fetching project items..." -ForegroundColor Yellow
$projectItems = gh project item-list $ProjectNumber --owner $Owner --format json | ConvertFrom-Json

Write-Host "Found $($projectItems.items.Count) items on project board" -ForegroundColor Green
Write-Host ""

# Define field mappings based on project field IDs
$fieldMappings = @{
    Status = @{
        fieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"
        defaultOption = "f75ad846" # Backlog
        backlogOption = "f75ad846"
        readyOption = "e18bf179"
        inProgressOption = "47fc9ee4"
        inReviewOption = "aba860b9"
        doneOption = "98236657"
    }
    Priority = @{
        fieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028qQ"
        defaultOption = "0a877460" # P1
        p0Option = "79628723"
        p1Option = "0a877460"
        p2Option = "da944a9c"
    }
    Size = @{
        fieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028qU"
        defaultOption = "86db8eb3" # M
        xsOption = "911790be"
        sOption = "b277fb01"
        mOption = "86db8eb3"
        lOption = "853c8207"
        xlOption = "2d0801e2"
    }
    App = @{
        fieldId = "PVTSSF_lAHOAEnMVc4BCu-czg156-s"
        defaultOption = "de5faa4a" # Portfolio Site
        portfolioSiteOption = "de5faa4a"
        dashboardOption = "d134f386"
        docsOption = "e504fedd"
        chatbotOption = "c95306ff"
    }
    Area = @{
        fieldId = "PVTSSF_lAHOAEnMVc4BCu-czg156_Y"
        defaultOption = "5618641d" # Frontend
        frontendOption = "5618641d"
        contentOption = "663d7084"
        infraOption = "5a298e61"
        dxToolingOption = "a67a98e5"
    }
    RiskLevel = @{
        fieldId = "PVTSSF_lAHOAEnMVc4BCu-czg2Ywbs"
        defaultOption = "efffd501" # Low
        lowOption = "efffd501"
        mediumOption = "ce3412e2"
        highOption = "e854f1c6"
        criticalOption = "e08a45aa"
    }
    Dependencies = @{
        fieldId = "PVTSSF_lAHOAEnMVc4BCu-czg2YwgE"
        defaultOption = "b9219285" # None
        noneOption = "b9219285"
        lowOption = "0a52397b"
        mediumOption = "2c3739c2"
        highOption = "d608a3c9"
    }
    Testing = @{
        fieldId = "PVTSSF_lAHOAEnMVc4BCu-czg2Ywhs"
        defaultOption = "daf54688" # Unit
        unitOption = "daf54688"
        integrationOption = "e8023120"
        e2eOption = "d4844e39"
        manualOption = "85607d0c"
    }
}

# Function to determine priority based on issue title and labels
function Get-PriorityFromIssue {
    param($issue)
    
    $title = $issue.content.title.ToLower()
    $body = $issue.content.body.ToLower()
    
    # Critical priority keywords
    if ($title -match "critical|urgent|security|bug|fix" -or $body -match "critical|urgent|security") {
        return $fieldMappings.Priority.p0Option
    }
    
    # High priority keywords
    if ($title -match "high|important|enhancement|feature" -or $body -match "high priority|important") {
        return $fieldMappings.Priority.p1Option
    }
    
    # Default to P1 as per memory
    return $fieldMappings.Priority.p1Option
}

# Function to determine size based on issue content
function Get-SizeFromIssue {
    param($issue)
    
    $title = $issue.content.title.ToLower()
    $body = $issue.content.body.ToLower()
    
    # Large tasks
    if ($title -match "epic|phase|system|comprehensive|complete" -or $body -match "epic|multiple|comprehensive") {
        return $fieldMappings.Size.lOption
    }
    
    # Small tasks
    if ($title -match "simple|quick|fix|typo|minor" -or $body -match "simple|quick fix|typo|minor") {
        return $fieldMappings.Size.sOption
    }
    
    # Default to Medium as per memory
    return $fieldMappings.Size.mOption
}

# Function to determine app based on issue content
function Get-AppFromIssue {
    param($issue)
    
    $title = $issue.content.title.ToLower()
    $body = $issue.content.body.ToLower()
    
    if ($title -match "dashboard|admin" -or $body -match "dashboard|admin") {
        return $fieldMappings.App.dashboardOption
    }
    
    if ($title -match "docs|documentation" -or $body -match "docs|documentation") {
        return $fieldMappings.App.docsOption
    }
    
    if ($title -match "chatbot" -or $body -match "chatbot") {
        return $fieldMappings.App.chatbotOption
    }
    
    # Default to Portfolio Site as per memory
    return $fieldMappings.App.portfolioSiteOption
}

# Function to determine area based on issue content
function Get-AreaFromIssue {
    param($issue)
    
    $title = $issue.content.title.ToLower()
    $body = $issue.content.body.ToLower()
    
    if ($title -match "content|blog|article|publishing" -or $body -match "content|blog|article") {
        return $fieldMappings.Area.contentOption
    }
    
    if ($title -match "infra|ci|cd|deployment|security" -or $body -match "infrastructure|deployment|security") {
        return $fieldMappings.Area.infraOption
    }
    
    if ($title -match "docs|documentation|tooling" -or $body -match "documentation|tooling") {
        return $fieldMappings.Area.dxToolingOption
    }
    
    # Default to Frontend as per memory
    return $fieldMappings.Area.frontendOption
}

# Function to determine risk level based on issue content
function Get-RiskLevelFromIssue {
    param($issue)
    
    $title = $issue.content.title.ToLower()
    $body = $issue.content.body.ToLower()
    
    # Critical risk keywords
    if ($title -match "critical|security|vulnerability|breach|data.*loss" -or $body -match "critical|security|vulnerability|breach") {
        return $fieldMappings.RiskLevel.criticalOption
    }
    
    # High risk keywords
    if ($title -match "high.*risk|breaking.*change|migration|refactor" -or $body -match "high risk|breaking change|migration") {
        return $fieldMappings.RiskLevel.highOption
    }
    
    # Medium risk keywords
    if ($title -match "medium|moderate|enhancement|feature" -or $body -match "medium risk|moderate|enhancement") {
        return $fieldMappings.RiskLevel.mediumOption
    }
    
    # Default to Low risk
    return $fieldMappings.RiskLevel.lowOption
}

# Function to determine dependencies based on issue content
function Get-DependenciesFromIssue {
    param($issue)
    
    $title = $issue.content.title.ToLower()
    $body = $issue.content.body.ToLower()
    
    # High dependency keywords
    if ($title -match "depends.*on|blocked.*by|requires.*merge" -or $body -match "depends on|blocked by|requires merge|waiting for") {
        return $fieldMappings.Dependencies.highOption
    }
    
    # Medium dependency keywords
    if ($title -match "integration|api.*change|database.*change" -or $body -match "integration|api change|database change") {
        return $fieldMappings.Dependencies.mediumOption
    }
    
    # Low dependency keywords
    if ($title -match "standalone|independent|isolated" -or $body -match "standalone|independent|isolated") {
        return $fieldMappings.Dependencies.lowOption
    }
    
    # Default to None dependencies
    return $fieldMappings.Dependencies.noneOption
}

# Function to determine testing requirements based on issue content
function Get-TestingFromIssue {
    param($issue)
    
    $title = $issue.content.title.ToLower()
    $body = $issue.content.body.ToLower()
    
    # Manual testing keywords
    if ($title -match "ui|ux|design|visual|user.*experience" -or $body -match "ui|ux|design|visual|user experience|manual testing") {
        return $fieldMappings.Testing.manualOption
    }
    
    # E2E testing keywords
    if ($title -match "e2e|end.*to.*end|workflow|user.*journey" -or $body -match "e2e|end to end|workflow|user journey") {
        return $fieldMappings.Testing.e2eOption
    }
    
    # Integration testing keywords
    if ($title -match "integration|api|service|component.*integration" -or $body -match "integration|api|service|component integration") {
        return $fieldMappings.Testing.integrationOption
    }
    
    # Default to Unit testing
    return $fieldMappings.Testing.unitOption
}

# Process each item
$processedCount = 0
$errorCount = 0

foreach ($item in $projectItems.items) {
    $issueNumber = $item.content.number
    Write-Host "Processing issue #$issueNumber`: $($item.content.title)" -ForegroundColor Cyan
    
    try {
        # Determine field values
        $status = $fieldMappings.Status.backlogOption # Default to Backlog
        $priority = Get-PriorityFromIssue -issue $item
        $size = Get-SizeFromIssue -issue $item
        $app = Get-AppFromIssue -issue $item
        $area = Get-AreaFromIssue -issue $item
        $riskLevel = Get-RiskLevelFromIssue -issue $item
        $dependencies = Get-DependenciesFromIssue -issue $item
        $testing = Get-TestingFromIssue -issue $item
        
        # Update Status
        Write-Host "  Setting Status to Backlog..." -ForegroundColor Gray
        gh project item-edit --id $item.id --field-id $fieldMappings.Status.fieldId --single-select-option-id $status 2>$null
        
        # Update Priority
        Write-Host "  Setting Priority..." -ForegroundColor Gray
        gh project item-edit --id $item.id --field-id $fieldMappings.Priority.fieldId --single-select-option-id $priority 2>$null
        
        # Update Size
        Write-Host "  Setting Size..." -ForegroundColor Gray
        gh project item-edit --id $item.id --field-id $fieldMappings.Size.fieldId --single-select-option-id $size 2>$null
        
        # Update App
        Write-Host "  Setting App..." -ForegroundColor Gray
        gh project item-edit --id $item.id --field-id $fieldMappings.App.fieldId --single-select-option-id $app 2>$null
        
        # Update Area
        Write-Host "  Setting Area..." -ForegroundColor Gray
        gh project item-edit --id $item.id --field-id $fieldMappings.Area.fieldId --single-select-option-id $area 2>$null
        
        # Update Risk Level
        Write-Host "  Setting Risk Level..." -ForegroundColor Gray
        gh project item-edit --id $item.id --field-id $fieldMappings.RiskLevel.fieldId --single-select-option-id $riskLevel 2>$null
        
        # Update Dependencies
        Write-Host "  Setting Dependencies..." -ForegroundColor Gray
        gh project item-edit --id $item.id --field-id $fieldMappings.Dependencies.fieldId --single-select-option-id $dependencies 2>$null
        
        # Update Testing
        Write-Host "  Setting Testing..." -ForegroundColor Gray
        gh project item-edit --id $item.id --field-id $fieldMappings.Testing.fieldId --single-select-option-id $testing 2>$null
        
        # Set Estimate to 3 (default per memory)
        Write-Host "  Setting Estimate to 3..." -ForegroundColor Gray
        gh project item-edit --id $item.id --field-id "PVTF_lAHOAEnMVc4BCu-czg028qY" --text "3" 2>$null
        
        Write-Host "  ✅ Issue #$issueNumber configured successfully" -ForegroundColor Green
        $processedCount++
    }
    catch {
        Write-Host "  ❌ Error processing issue #$issueNumber`: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
    
    Write-Host ""
}

Write-Host "===============================================" -ForegroundColor Blue
Write-Host "      Backfill Complete!" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "Processed: $processedCount issues" -ForegroundColor Green
Write-Host "Errors: $errorCount issues" -ForegroundColor $(if ($errorCount -eq 0) { "Green" } else { "Red" })
Write-Host ""
Write-Host "All issues now have standardized project fields:" -ForegroundColor Yellow
Write-Host "- Status: Backlog (default)" -ForegroundColor Gray
Write-Host "- Priority: P1 (default)" -ForegroundColor Gray
Write-Host "- Size: M (default)" -ForegroundColor Gray
Write-Host "- App: Portfolio Site (default)" -ForegroundColor Gray
Write-Host "- Area: Frontend (default)" -ForegroundColor Gray
Write-Host "- Risk Level: Low (default)" -ForegroundColor Gray
Write-Host "- Dependencies: None (default)" -ForegroundColor Gray
Write-Host "- Testing: Unit (default)" -ForegroundColor Gray
Write-Host "- Estimate: 3 (default)" -ForegroundColor Gray
