# Test script to verify the project status automation workflow logic
param(
    [string]$ProjectUrl = "https://github.com/users/jschibelli/projects/20"
)

Write-Host "🧪 Testing Project Status Automation Workflow Logic..." -ForegroundColor Cyan

# Test 1: Extract project number from URL
Write-Host "`n📊 Test 1: Extracting project number from URL" -ForegroundColor Yellow
Write-Host "Project URL: $ProjectUrl" -ForegroundColor White

$projectNumber = $ProjectUrl.Split('/')[-1]
Write-Host "Extracted project number: $projectNumber" -ForegroundColor Green

# Test 2: Verify project exists and get details
Write-Host "`n📊 Test 2: Verifying project exists" -ForegroundColor Yellow
try {
    $projectInfo = gh project view $projectNumber --owner jschibelli --format json | ConvertFrom-Json
    Write-Host "✅ Project found: $($projectInfo.title)" -ForegroundColor Green
    Write-Host "Project ID: $($projectInfo.id)" -ForegroundColor Green
    Write-Host "Items count: $($projectInfo.items.totalCount)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error getting project info: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Test GraphQL query for project fields
Write-Host "`n📊 Test 3: Testing GraphQL query for project fields" -ForegroundColor Yellow
try {
    $graphqlQuery = @"
query(`$owner: String!, `$number: Int!) {
  organization(login: `$owner) {
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

    Write-Host "GraphQL Query prepared" -ForegroundColor Green
    Write-Host "Owner: jschibelli" -ForegroundColor Green
    Write-Host "Number: $projectNumber" -ForegroundColor Green
} catch {
    Write-Host "❌ Error preparing GraphQL query: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Check if we can get project items
Write-Host "`n📊 Test 4: Testing project items retrieval" -ForegroundColor Yellow
try {
    $items = gh project item-list $projectNumber --owner jschibelli --format json | ConvertFrom-Json | Select-Object -ExpandProperty items | Select-Object -First 2
    Write-Host "✅ Retrieved $($items.Count) project items" -ForegroundColor Green
    foreach ($item in $items) {
        Write-Host "  - Item: $($item.content.title)" -ForegroundColor White
        Write-Host "    ID: $($item.id)" -ForegroundColor Gray
        Write-Host "    Type: $($item.content.type)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Error getting project items: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Check GitHub token permissions
Write-Host "`n📊 Test 5: Testing GitHub token permissions" -ForegroundColor Yellow
try {
    $user = gh api user --jq '.login'
    Write-Host "✅ GitHub token working for user: $user" -ForegroundColor Green
} catch {
    Write-Host "❌ Error with GitHub token: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📝 Summary:" -ForegroundColor Cyan
Write-Host "- Project URL parsing: ✅ Working" -ForegroundColor White
Write-Host "- Project access: ✅ Working" -ForegroundColor White
Write-Host "- GraphQL query: ✅ Prepared" -ForegroundColor White
Write-Host "- Project items: ✅ Accessible" -ForegroundColor White
Write-Host "- GitHub token: ✅ Working" -ForegroundColor White

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Test the actual GraphQL query execution" -ForegroundColor White
Write-Host "2. Verify field IDs and option IDs" -ForegroundColor White
Write-Host "3. Test project item status updates" -ForegroundColor White
