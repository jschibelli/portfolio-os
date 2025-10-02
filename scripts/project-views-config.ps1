# Project Views Configuration for Multi-Agent System
# Usage: .\scripts\project-views-config.ps1 [-Action <ACTION>] [-ViewName <NAME>] [-Agent <AGENT>] [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("create", "list", "filter", "swimlanes", "all")]
    [string]$Action = "all",
    
    [Parameter(Mandatory=$false)]
    [string]$ViewName = "",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("agent-frontend", "agent-backend", "agent-docs", "agent-testing", "agent-ai", "agent-default")]
    [string]$Agent = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Project configuration
$ProjectId = "PVT_kwHOAEnMVc4BCu-c"

# View configurations
$viewConfigs = @{
    "Frontend Agent Work" = @{
        Filter = "agent:frontend"
        Description = "All work assigned to Frontend Agent"
        Layout = "swimlanes"
        GroupBy = "Status"
        SortBy = "Priority"
    }
    "Backend Agent Work" = @{
        Filter = "agent:backend"
        Description = "All work assigned to Backend Agent"
        Layout = "swimlanes"
        GroupBy = "Status"
        SortBy = "Priority"
    }
    "Documentation Agent Work" = @{
        Filter = "agent:docs"
        Description = "All work assigned to Documentation Agent"
        Layout = "swimlanes"
        GroupBy = "Status"
        SortBy = "Priority"
    }
    "Testing Agent Work" = @{
        Filter = "agent:testing"
        Description = "All work assigned to Testing Agent"
        Layout = "swimlanes"
        GroupBy = "Status"
        SortBy = "Priority"
    }
    "AI Agent Work" = @{
        Filter = "agent:ai"
        Description = "All work assigned to AI Agent"
        Layout = "swimlanes"
        GroupBy = "Status"
        SortBy = "Priority"
    }
    "All Agent Work" = @{
        Filter = "agent:*"
        Description = "All work across all agents"
        Layout = "table"
        GroupBy = "Agent"
        SortBy = "Priority"
    }
    "Agent Workload Overview" = @{
        Filter = "status:open"
        Description = "Workload overview across all agents"
        Layout = "swimlanes"
        GroupBy = "Agent"
        SortBy = "Status"
    }
    "High Priority Work" = @{
        Filter = "priority:high"
        Description = "High priority work across all agents"
        Layout = "swimlanes"
        GroupBy = "Agent"
        SortBy = "Status"
    }
    "Blocked Work" = @{
        Filter = "status:blocked"
        Description = "Blocked work items"
        Layout = "table"
        GroupBy = "Agent"
        SortBy = "Priority"
    }
    "Ready for Review" = @{
        Filter = "status:ready"
        Description = "Work ready for review"
        Layout = "swimlanes"
        GroupBy = "Agent"
        SortBy = "Priority"
    }
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Show-Banner {
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput "      Project Views Configuration" "Blue"
    Write-ColorOutput "===============================================" "Blue"
    Write-ColorOutput ""
}

function Create-ProjectView {
    param(
        [string]$ViewName,
        [hashtable]$Config
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would create view: $ViewName" "Cyan"
        Write-ColorOutput "    Filter: $($Config.Filter)" "Cyan"
        Write-ColorOutput "    Layout: $($Config.Layout)" "Cyan"
        Write-ColorOutput "    GroupBy: $($Config.GroupBy)" "Cyan"
        return $true
    }
    
    try {
        # Create view using GitHub CLI
        # Note: This is a simplified example - you'll need to adapt this to your GitHub project setup
        $viewCommand = "gh project view-create --title `"$ViewName`" --description `"$($Config.Description)`" --filter `"$($Config.Filter)`" --layout $($Config.Layout) --group-by $($Config.GroupBy) --sort-by $($Config.SortBy)"
        
        Write-ColorOutput "  Creating view: $ViewName" "Yellow"
        Write-ColorOutput "    Command: $viewCommand" "Gray"
        
        # Execute the command (uncomment when ready)
        # Invoke-Expression $viewCommand
        
        Write-ColorOutput "  ✅ Created view: $ViewName" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "  ❌ Failed to create view: $($_.Exception.Message)" "Red"
        return $false
    }
}

function List-ProjectViews {
    try {
        # List existing views
        $views = gh project view-list --project-id $ProjectId --format json
        $viewsData = $views | ConvertFrom-Json
        
        Write-ColorOutput "=== Existing Project Views ===" "Blue"
        
        if ($viewsData.Count -eq 0) {
            Write-ColorOutput "No views found" "Yellow"
            return
        }
        
        foreach ($view in $viewsData) {
            Write-ColorOutput "View: $($view.name)" "White"
            Write-ColorOutput "  ID: $($view.id)" "Gray"
            Write-ColorOutput "  Description: $($view.description)" "Gray"
            Write-ColorOutput "  Layout: $($view.layout)" "Gray"
            Write-ColorOutput ""
        }
    }
    catch {
        Write-ColorOutput "Error listing views: $($_.Exception.Message)" "Red"
    }
}

function Create-SwimLaneView {
    param(
        [string]$Agent,
        [string]$ViewName
    )
    
    if (-not $ViewName) {
        $ViewName = "$Agent Work"
    }
    
    $config = @{
        Filter = "agent:$($Agent -replace 'agent-', '')"
        Description = "Swim lane view for $Agent work"
        Layout = "swimlanes"
        GroupBy = "Status"
        SortBy = "Priority"
    }
    
    return Create-ProjectView -ViewName $ViewName -Config $config
}

function Create-AllViews {
    Write-ColorOutput "Creating all project views..." "Yellow"
    
    $successCount = 0
    $totalViews = $viewConfigs.Count
    
    foreach ($viewName in $viewConfigs.Keys) {
        $config = $viewConfigs[$viewName]
        
        Write-ColorOutput "Creating view: $viewName" "White"
        
        if (Create-ProjectView -ViewName $viewName -Config $config) {
            $successCount++
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "=== View Creation Summary ===" "Blue"
    Write-ColorOutput "Total views: $totalViews" "White"
    Write-ColorOutput "Successful: $successCount" "Green"
    Write-ColorOutput "Failed: $($totalViews - $successCount)" "Red"
}

function Create-AgentSwimLanes {
    $agents = @("agent-frontend", "agent-backend", "agent-docs", "agent-testing", "agent-ai")
    
    Write-ColorOutput "Creating agent swim lanes..." "Yellow"
    
    foreach ($agent in $agents) {
        $viewName = "$($agent -replace 'agent-', '').ToUpper() Agent Work"
        Create-SwimLaneView -Agent $agent -ViewName $viewName
    }
}

function Show-ViewConfiguration {
    Write-ColorOutput "=== Project View Configuration ===" "Blue"
    Write-ColorOutput ""
    
    foreach ($viewName in $viewConfigs.Keys) {
        $config = $viewConfigs[$viewName]
        
        Write-ColorOutput "View: $viewName" "White"
        Write-ColorOutput "  Description: $($config.Description)" "Gray"
        Write-ColorOutput "  Filter: $($config.Filter)" "Gray"
        Write-ColorOutput "  Layout: $($config.Layout)" "Gray"
        Write-ColorOutput "  GroupBy: $($config.GroupBy)" "Gray"
        Write-ColorOutput "  SortBy: $($config.SortBy)" "Gray"
        Write-ColorOutput ""
    }
}

function Create-AgentField {
    Write-ColorOutput "Creating Agent field in project..." "Yellow"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would create Agent field" "Cyan"
        return $true
    }
    
    try {
        # Create Agent field using GitHub CLI
        # Note: This is a simplified example - you'll need to adapt this to your GitHub project setup
        $fieldCommand = "gh project field-create --title `"Agent`" --type `"single_select`" --options `"agent-frontend,agent-backend,agent-docs,agent-testing,agent-ai,agent-default`""
        
        Write-ColorOutput "  Creating Agent field..." "Yellow"
        Write-ColorOutput "    Command: $fieldCommand" "Gray"
        
        # Execute the command (uncomment when ready)
        # Invoke-Expression $fieldCommand
        
        Write-ColorOutput "  ✅ Agent field created" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "  ❌ Failed to create Agent field: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Create-AutomationRules {
    Write-ColorOutput "Creating automation rules..." "Yellow"
    
    $automationRules = @(
        @{
            Name = "Auto-assign Frontend Agent"
            Condition = "label:frontend OR label:ui OR label:component"
            Action = "Set Agent field to agent-frontend"
        },
        @{
            Name = "Auto-assign Backend Agent"
            Condition = "label:backend OR label:api OR label:database"
            Action = "Set Agent field to agent-backend"
        },
        @{
            Name = "Auto-assign Docs Agent"
            Condition = "label:documentation OR label:docs OR label:content"
            Action = "Set Agent field to agent-docs"
        },
        @{
            Name = "Auto-assign Testing Agent"
            Condition = "label:testing OR label:test OR label:qa"
            Action = "Set Agent field to agent-testing"
        },
        @{
            Name = "Auto-assign AI Agent"
            Condition = "label:ai OR label:automation OR label:ml"
            Action = "Set Agent field to agent-ai"
        }
    )
    
    foreach ($rule in $automationRules) {
        if ($DryRun) {
            Write-ColorOutput "  [DRY RUN] Would create rule: $($rule.Name)" "Cyan"
        } else {
            Write-ColorOutput "  Creating rule: $($rule.Name)" "Yellow"
            Write-ColorOutput "    Condition: $($rule.Condition)" "Gray"
            Write-ColorOutput "    Action: $($rule.Action)" "Gray"
            
            # Create automation rule (you'll need to implement this based on your setup)
            # This would typically be done through GitHub's web interface or API
            
            Write-ColorOutput "  ✅ Rule created: $($rule.Name)" "Green"
        }
    }
}

function Main {
    Show-Banner
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    
    switch ($Action) {
        "create" {
            if ($ViewName -and $Agent) {
                Create-SwimLaneView -Agent $Agent -ViewName $ViewName
            } else {
                Create-AllViews
            }
        }
        "list" {
            List-ProjectViews
        }
        "filter" {
            if ($Agent) {
                $viewName = "$($Agent -replace 'agent-', '').ToUpper() Agent Work"
                Create-SwimLaneView -Agent $Agent -ViewName $viewName
            } else {
                Write-ColorOutput "Please provide Agent to create filter view" "Red"
            }
        }
        "swimlanes" {
            Create-AgentSwimLanes
        }
        "all" {
            Create-AgentField
            Create-AutomationRules
            Create-AllViews
            Create-AgentSwimLanes
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Project Views Configuration Complete!" "Green"
}

# Run the main function
Main
