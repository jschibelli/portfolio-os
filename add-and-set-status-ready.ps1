# PowerShell script to add blog issues to project and set status to Ready

$blogIssues = @(196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208)

Write-Host "Adding blog issues to project and setting status to Ready..."
Write-Host ""

foreach ($issueNumber in $blogIssues) {
    Write-Host "Processing Issue #$issueNumber..."
    
    try {
        # Step 1: Add issue to project
        Write-Host "  Adding to project..."
        gh project item-add 20 --owner jschibelli --url "https://github.com/jschibelli/portfolio-os/issues/$issueNumber"
        
        # Wait for the item to be created
        Start-Sleep -Seconds 3
        
        # Step 2: Get issue ID
        $issueId = gh issue view $issueNumber --json id -q .id
        Write-Host "  Issue ID: $issueId"
        
        # Step 3: Get project item ID
        $projectItems = gh api graphql -f query='query($issueId: ID!) { node(id: $issueId) { ... on Issue { projectItems(first: 10) { nodes { id project { id title } } } } } }' -f issueId="$issueId" --jq '.data.node.projectItems.nodes[] | select(.project.id == "PVT_kwHOAEnMVc4BCu-c") | .id'
        
        if ($projectItems) {
            $projectItemId = $projectItems
            Write-Host "  Project Item ID: $projectItemId"
            
            # Step 4: Set Status to Ready
            gh project item-edit --id $projectItemId --project-id PVT_kwHOAEnMVc4BCu-c --field-id PVTSSF_lAHOAEnMVc4BCu-czg028oM --single-select-option-id e18bf179
            Write-Host "  Status set to Ready"
            
        } else {
            Write-Host "  Could not find project item for issue #$issueNumber"
        }
        
    } catch {
        Write-Host "  Error processing issue #$issueNumber"
    }
    
    Write-Host ""
}

Write-Host "All blog issues processed!"
