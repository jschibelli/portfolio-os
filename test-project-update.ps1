# Test script to manually update project board status
param(
    [string]$ProjectItemId = "PVTI_lAHOAEnMVc4BCu-czgfaB6M",
    [string]$NewStatus = "In Progress"
)

Write-Host "🧪 Testing Manual Project Board Status Update..." -ForegroundColor Cyan

# Get project details to find field and option IDs
Write-Host "`n📊 Getting project field information..." -ForegroundColor Yellow

try {
    # Get project fields using GraphQL
    $graphqlQuery = @"
query(`$owner: String!, `$number: Int!) {
  user(login: `$owner) {
    projectV2(number: `$number) {
      id
      fields(first: 20) {
        nodes {
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
    }
  }
}
"@

    Write-Host "Executing GraphQL query..." -ForegroundColor Green
    
    # Execute the query using GitHub CLI
    $result = gh api graphql -f query=$graphqlQuery -f owner=jschibelli -f number=20
    
    if ($result) {
        $projectData = $result | ConvertFrom-Json
        $project = $projectData.data.user.projectV2
        
        Write-Host "✅ Project found: $($project.id)" -ForegroundColor Green
        
        # Find Status field
        $statusField = $project.fields.nodes | Where-Object { $_.name -eq "Status" }
        
        if ($statusField) {
            Write-Host "✅ Status field found: $($statusField.id)" -ForegroundColor Green
            Write-Host "Available status options:" -ForegroundColor Cyan
            
            foreach ($option in $statusField.options) {
                Write-Host "  - $($option.name) (ID: $($option.id))" -ForegroundColor White
            }
            
            # Find the option for the new status
            $newStatusOption = $statusField.options | Where-Object { $_.name -eq $NewStatus }
            
            if ($newStatusOption) {
                Write-Host "`n🎯 Found target status option: $($newStatusOption.name) (ID: $($newStatusOption.id))" -ForegroundColor Green
                
                # Now test the update mutation
                $updateMutation = @"
mutation(`$projectId: ID!, `$itemId: ID!, `$fieldId: ID!, `$optionId: String!) {
  updateProjectV2ItemFieldValue(input: {
    projectId: `$projectId
    itemId: `$itemId
    fieldId: `$fieldId
    value: {
      singleSelectOptionId: `$optionId
    }
  }) {
    projectV2Item {
      id
    }
  }
}
"@
                
                Write-Host "`n🔄 Testing status update..." -ForegroundColor Yellow
                Write-Host "Project ID: $($project.id)" -ForegroundColor Gray
                Write-Host "Item ID: $ProjectItemId" -ForegroundColor Gray
                Write-Host "Field ID: $($statusField.id)" -ForegroundColor Gray
                Write-Host "Option ID: $($newStatusOption.id)" -ForegroundColor Gray
                
                # Execute the update
                $updateResult = gh api graphql -f query=$updateMutation -f projectId=$project.id -f itemId=$ProjectItemId -f fieldId=$statusField.id -f optionId=$newStatusOption.id
                
                if ($updateResult) {
                    $updateData = $updateResult | ConvertFrom-Json
                    Write-Host "✅ Status update successful!" -ForegroundColor Green
                    Write-Host "Updated item ID: $($updateData.data.updateProjectV2ItemFieldValue.projectV2Item.id)" -ForegroundColor Green
                } else {
                    Write-Host "❌ Status update failed" -ForegroundColor Red
                }
                
            } else {
                Write-Host "❌ Status option '$NewStatus' not found" -ForegroundColor Red
            }
            
        } else {
            Write-Host "❌ Status field not found in project" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ Failed to get project data" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📝 Test completed!" -ForegroundColor Cyan
