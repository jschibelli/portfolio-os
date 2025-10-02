# Fix Unassigned Items Script
# Usage: .\scripts\fix-unassigned-items.ps1 [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

# Project configuration
$ProjectId = "PVT_kwHOAEnMVc4BCu-c"
$StatusFieldId = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"

# Status option IDs
$StatusOptions = @{
    "Backlog" = "f75ad846"
    "Ready" = "e18bf179"
    "In progress" = "47fc9ee4"
    "In review" = "aba860b9"
    "Done" = "98236657"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Get-AllProjectItems {
    Write-ColorOutput "Fetching all project items..." "Yellow"
    
    try {
        $result = gh project item-list 20 --owner jschibelli --limit 200 --format json
        $items = $result | ConvertFrom-Json
        return $items.items
    }
    catch {
        Write-ColorOutput "Error fetching project items: $($_.Exception.Message)" "Red"
        return @()
    }
}

function Set-ItemStatus {
    param(
        [string]$ItemId,
        [string]$NewStatus
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would set status to: $NewStatus" "Cyan"
        return $true
    }
    
    try {
        $optionId = $StatusOptions[$NewStatus]
        if (-not $optionId) {
            Write-ColorOutput "  Error: Unknown status '$NewStatus'" "Red"
            return $false
        }
        
        gh project item-edit --id $ItemId --project-id $ProjectId --field-id $StatusFieldId --single-select-option-id $optionId
        Write-ColorOutput "  Success" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "  Error setting status: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Main {
    Write-ColorOutput "=== Fix Unassigned Items ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No changes will be made ***" "Cyan"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Setting all items without status to Backlog..." "Yellow"
    Write-ColorOutput ""
    
    # Get all project items
    $items = Get-AllProjectItems
    
    if ($items.Count -eq 0) {
        Write-ColorOutput "No project items found." "Red"
        return
    }
    
    Write-ColorOutput "Found $($items.Count) project items" "Green"
    Write-ColorOutput ""
    
    $unassignedItems = @()
    $statusCounts = @{
        "Backlog" = 0
        "Ready" = 0
        "In progress" = 0
        "Done" = 0
        "No Status" = 0
    }
    
    # Analyze each item
    foreach ($item in $items) {
        $content = $item.content
        $currentStatus = $item.status
        
        # Count statuses
        if ([string]::IsNullOrEmpty($currentStatus)) {
            $statusCounts["No Status"]++
        } else {
            if ($statusCounts.ContainsKey($currentStatus)) {
                $statusCounts[$currentStatus]++
            }
        }
        
        if ([string]::IsNullOrEmpty($currentStatus)) {
            if ($content.type -eq "Issue") {
                Write-ColorOutput "Issue #$($content.number) - No Status" "White"
                Write-ColorOutput "  Title: $($content.title)" "Gray"
                Write-ColorOutput "  -> Should move to Backlog" "Yellow"
                
                $unassignedItems += @{
                    ItemId = $item.id
                    IssueNumber = $content.number
                    Title = $content.title
                    Type = "Issue"
                }
            }
            elseif ($content.type -eq "PullRequest") {
                Write-ColorOutput "PR #$($content.number) - No Status" "White"
                Write-ColorOutput "  Title: $($content.title)" "Gray"
                Write-ColorOutput "  -> Should move to Backlog" "Yellow"
                
                $unassignedItems += @{
                    ItemId = $item.id
                    PRNumber = $content.number
                    Title = $content.title
                    Type = "PullRequest"
                }
            }
            
            Write-ColorOutput "" "White"
        }
    }
    
    Write-ColorOutput "=== Current Status Summary ===" "Blue"
    foreach ($status in $statusCounts.Keys) {
        if ($statusCounts[$status] -gt 0) {
            Write-ColorOutput "${status}: $($statusCounts[$status])" "White"
        }
    }
    Write-ColorOutput ""
    
    Write-ColorOutput "=== Items to Fix ===" "Blue"
    
    if ($unassignedItems.Count -gt 0) {
        Write-ColorOutput "Items without status to move to Backlog:" "Yellow"
        foreach ($item in $unassignedItems) {
            if ($item.Type -eq "Issue") {
                Write-ColorOutput "  - Issue #$($item.IssueNumber): $($item.Title)" "White"
            } else {
                Write-ColorOutput "  - PR #$($item.PRNumber): $($item.Title)" "White"
            }
        }
        Write-ColorOutput ""
    } else {
        Write-ColorOutput "All items have status assigned!" "Green"
        return
    }
    
    # Apply changes if not dry run
    if (-not $DryRun) {
        Write-ColorOutput "=== Applying Changes ===" "Blue"
        
        $successCount = 0
        $totalChanges = $unassignedItems.Count
        
        # Move unassigned items to Backlog
        foreach ($item in $unassignedItems) {
            if ($item.Type -eq "Issue") {
                Write-ColorOutput "Moving Issue #$($item.IssueNumber) to Backlog..." "Yellow"
            } else {
                Write-ColorOutput "Moving PR #$($item.PRNumber) to Backlog..." "Yellow"
            }
            
            if (Set-ItemStatus $item.ItemId "Backlog") {
                $successCount++
            }
        }
        
        Write-ColorOutput ""
        Write-ColorOutput "=== Final Summary ===" "Blue"
        Write-ColorOutput "Total changes: $totalChanges" "White"
        Write-ColorOutput "Successful: $successCount" "Green"
        Write-ColorOutput "Failed: $($totalChanges - $successCount)" "Red"
        
        if ($successCount -eq $totalChanges) {
            Write-ColorOutput "All unassigned items moved to Backlog!" "Green"
        } else {
            Write-ColorOutput "Some updates failed. Please check the output above." "Red"
        }
    } else {
        Write-ColorOutput "Dry run complete. Use without -DryRun to apply changes." "Cyan"
    }
}

# Run the main function
Main
