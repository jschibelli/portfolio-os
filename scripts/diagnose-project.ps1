# Diagnostic script to check project structure and status values
# Usage: .\scripts\diagnose-project.ps1

# Project configuration
$ProjectId = "PVT_kwHOAEnMVc4BCu-c"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Get-ProjectInfo {
    Write-ColorOutput "Fetching project information..." "Yellow"
    
    try {
        $query = @"
query(`$projectId: ID!) {
  node(id: `$projectId) {
    ... on ProjectV2 {
      title
      fields(first: 20) {
        nodes {
          ... on ProjectV2Field {
            id
            name
            dataType
          }
          ... on ProjectV2SingleSelectField {
            id
            name
            options {
              id
              name
            }
          }
        }
      }
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
        return $jsonData.data.node
    }
    catch {
        Write-ColorOutput "Error fetching project info: $($_.Exception.Message)" "Red"
        return $null
    }
}

function Main {
    Write-ColorOutput "=== Project Diagnostic ===" "Blue"
    Write-ColorOutput ""
    
    $projectInfo = Get-ProjectInfo
    
    if (-not $projectInfo) {
        Write-ColorOutput "Failed to fetch project information." "Red"
        return
    }
    
    Write-ColorOutput "Project: $($projectInfo.title)" "Green"
    Write-ColorOutput ""
    
    # Show available fields
    Write-ColorOutput "Available Fields:" "Yellow"
    foreach ($field in $projectInfo.fields.nodes) {
        Write-ColorOutput "  - $($field.name) (ID: $($field.id), Type: $($field.dataType))" "White"
        
        if ($field.options) {
            Write-ColorOutput "    Options:" "Gray"
            foreach ($option in $field.options) {
                Write-ColorOutput "      - $($option.name) (ID: $($option.id))" "Gray"
            }
        }
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Sample Items:" "Yellow"
    
    # Show first few items
    $itemCount = 0
    foreach ($item in $projectInfo.items.nodes) {
        if ($itemCount -ge 5) { break }
        
        $content = $item.content
        if ($content.__typename -eq "Issue") {
            Write-ColorOutput "Issue #$($content.number): $($content.title)" "White"
        } elseif ($content.__typename -eq "PullRequest") {
            Write-ColorOutput "PR #$($content.number): $($content.title)" "White"
        }
        
        Write-ColorOutput "  Field Values:" "Gray"
        foreach ($fieldValue in $item.fieldValues.nodes) {
            Write-ColorOutput "    - $($fieldValue.field.name): $($fieldValue.name)" "Gray"
        }
        
        $itemCount++
        Write-ColorOutput ""
    }
}

# Run the main function
Main
