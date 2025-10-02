# Debug script to examine project item field values
# Usage: .\scripts\debug-project-items.ps1

# Project configuration
$ProjectId = "PVT_kwHOAEnMVc4BCu-c"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Get-ProjectItems {
    Write-ColorOutput "Fetching project items..." "Yellow"
    
    try {
        $query = @"
query(`$projectId: ID!) {
  node(id: `$projectId) {
    ... on ProjectV2 {
      items(first: 10) {
        nodes {
          id
          content {
            ... on Issue {
              number
              title
            }
            ... on PullRequest {
              number
              title
            }
          }
          fieldValues(first: 20) {
            nodes {
              ... on ProjectV2ItemFieldSingleSelectValue {
                field {
                  ... on ProjectV2FieldCommon {
                    name
                  }
                }
                name
              }
            }
          }
        }
      }
    }
  }
}
"@

        $result = gh api graphql -f query=$query -f projectId=$ProjectId
        $jsonData = $result | ConvertFrom-Json
        return $jsonData.data.node.items.nodes
    }
    catch {
        Write-ColorOutput "Error fetching project items: $($_.Exception.Message)" "Red"
        return @()
    }
}

function Main {
    Write-ColorOutput "=== Project Items Debug ===" "Blue"
    Write-ColorOutput ""
    
    $items = Get-ProjectItems
    
    if ($items.Count -eq 0) {
        Write-ColorOutput "No project items found." "Red"
        return
    }
    
    Write-ColorOutput "Found $($items.Count) project items" "Green"
    Write-ColorOutput ""
    
    foreach ($item in $items) {
        $content = $item.content
        
        if ($content.__typename -eq "Issue") {
            Write-ColorOutput "Issue #$($content.number): $($content.title)" "White"
        } elseif ($content.__typename -eq "PullRequest") {
            Write-ColorOutput "PR #$($content.number): $($content.title)" "White"
        }
        
        Write-ColorOutput "  Field Values:" "Gray"
        foreach ($fieldValue in $item.fieldValues.nodes) {
            if ($fieldValue.field.name -eq "Status") {
                Write-ColorOutput "    Status: $($fieldValue.name)" "Yellow"
            } else {
                Write-ColorOutput "    $($fieldValue.field.name): $($fieldValue.name)" "Gray"
            }
        }
        
        Write-ColorOutput ""
    }
}

# Run the main function
Main
