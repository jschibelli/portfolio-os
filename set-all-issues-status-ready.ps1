# PowerShell script to set all blog issues status to Ready

$blogIssues = @(196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208)

Write-Host "Setting all blog issues status to Ready..."
Write-Host ""

foreach ($issueNumber in $blogIssues) {
    Write-Host "Setting Issue #$issueNumber status to Ready..."
    
    try {
        # Get issue ID
        $issueId = gh issue view $issueNumber --json id -q .id
        Write-Host "  Issue ID: $issueId"
        
        # Get project item ID using the issue ID
        $projectItems = gh api graphql -f query='query($issueId: ID!) { node(id: $issueId) { ... on Issue { projectItems(first: 10) { nodes { id project { id title } } } } } }' -f issueId="$issueId" --jq '.data.node.projectItems.nodes[] | select(.project.id == "PVT_kwHOAEnMVc4BCu-c") | .id'
        
        if ($projectItems) {
            $projectItemId = $projectItems
            Write-Host "  Project Item ID: $projectItemId"
            
            # Set Status to Ready
            gh project item-edit --id $projectItemId --project-id PVT_kwHOAEnMVc4BCu-c --field-id PVTSSF_lAHOAEnMVc4BCu-czg028oM --single-select-option-id e18bf179
            Write-Host "  Status set to Ready"
            
        } else {
            Write-Host "  No project item found for issue #$issueNumber"
        }
        
    } catch {
        Write-Host "  Error setting status for issue #$issueNumber"
    }
    
    Write-Host ""
}

Write-Host "All blog issues status set to Ready!"
