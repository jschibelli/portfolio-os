# PowerShell script to set status to Ready for all blog issues using GitHub CLI

$blogIssues = @(196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208)

Write-Host "Setting status to Ready for all blog issues..."
Write-Host ""

foreach ($issueNumber in $blogIssues) {
    Write-Host "Setting Issue #$issueNumber status to Ready..."
    
    try {
        # First, add the issue to the project if not already added
        Write-Host "  Adding to project..."
        gh project item-add 20 --owner jschibelli --url "https://github.com/jschibelli/portfolio-os/issues/$issueNumber"
        
        # Wait for the item to be created
        Start-Sleep -Seconds 5
        
        # Get the issue ID
        $issueId = gh issue view $issueNumber --json id -q .id
        Write-Host "  Issue ID: $issueId"
        
        # Get project item ID using a different approach
        $projectItems = gh api graphql -f query='query($projectId: ID!) { node(id: $projectId) { ... on ProjectV2 { items(first: 100) { nodes { id content { ... on Issue { number } } } } } } }' -f projectId=PVT_kwHOAEnMVc4BCu-c --jq ".data.node.items.nodes[] | select(.content.number == $issueNumber) | .id"
        
        if ($projectItems) {
            $projectItemId = $projectItems
            Write-Host "  Project Item ID: $projectItemId"
            
            # Set Status to Ready
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

Write-Host "All blog issues status set to Ready!"
