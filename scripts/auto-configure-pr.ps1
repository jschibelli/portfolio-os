# Auto-configure PR in Portfolio Site project: set Status, Priority, Size, Estimate, Iteration, App, Area, and assign

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,

    [string]$Status = "In progress",
    [string]$Priority = "P1",
    [string]$Size = "M",
    [double]$Estimate = 3,
    [string]$App = "Portfolio Site",
    [string]$Area = "Frontend",
    [string]$Assign = "jschibelli"
)

$ErrorActionPreference = "Stop"

# Project configuration (Portfolio Site — johnschibelli.dev)
$PROJECT_ID = "PVT_kwHOAEnMVc4BCu-c"

# Known field IDs (stable), discover Estimate/Iteration dynamically if not set
$FIELD_IDS = @{
    Status   = "PVTSSF_lAHOAEnMVc4BCu-czg028oM"
    Priority = "PVTSSF_lAHOAEnMVc4BCu-czg028qQ"
    Size     = "PVTSSF_lAHOAEnMVc4BCu-czg028qU"
    App      = "PVTSSF_lAHOAEnMVc4BCu-czg156-s"
    Area     = "PVTSSF_lAHOAEnMVc4BCu-czg156_Y"
    Estimate = $null
    Iteration= $null
}

function Get-ProjectFields {
    $q = @'
query($projectId: ID!) {
  node(id: $projectId) {
    ... on ProjectV2 {
      fields(first: 100) {
        nodes {
          id
          name
          dataType
          ... on ProjectV2SingleSelectField { options { id name } }
        }
      }
    }
  }
}
'@
    return (gh api graphql -f query=$q -f projectId=$PROJECT_ID | ConvertFrom-Json).data.node.fields.nodes
}

$fields = Get-ProjectFields

foreach ($name in @("Estimate","Iteration")) {
    if (-not $FIELD_IDS[$name]) {
        $FIELD_IDS[$name] = ($fields | Where-Object { $_.name -eq $name }).id
    }
}

function Get-OptionId($fieldName, $optionName) {
    $node = $fields | Where-Object { $_.name -eq $fieldName }
    if ($null -eq $node -or $null -eq $node.options) { return $null }
    return ($node.options | Where-Object { $_.name -eq $optionName }).id
}

$StatusOptionId   = Get-OptionId -fieldName "Status"   -optionName $Status
$PriorityOptionId = Get-OptionId -fieldName "Priority" -optionName $Priority
$SizeOptionId     = Get-OptionId -fieldName "Size"     -optionName $Size
$AppOptionId      = Get-OptionId -fieldName "App"      -optionName $App
$AreaOptionId     = Get-OptionId -fieldName "Area"     -optionName $Area

if (-not $StatusOptionId -or -not $PriorityOptionId -or -not $SizeOptionId -or -not $AppOptionId -or -not $AreaOptionId) {
    throw "Missing one or more project option IDs. Verify project fields/options."
}

$pr = gh pr view $PRNumber --json id,url,number -q .
$prId = $pr.id
$prUrl = $pr.url

$addQ = @'
mutation($projectId: ID!, $contentId: ID!) {
  addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
    item { id }
  }
}
'@
$itemId = gh api graphql -f query=$addQ -f projectId=$PROJECT_ID -f contentId=$prId -q .data.addProjectV2ItemById.item.id

function Set-SingleSelect([string]$fieldId, [string]$optionId) {
    $q = "mutation(`$projectId: ID!, `$itemId: ID!, `$fieldId: ID!, `$value: String!) { updateProjectV2ItemFieldValue(input: {projectId: `$projectId, itemId: `$itemId, fieldId: `$fieldId, value: {singleSelectOptionId: `$value}}) { projectV2Item { id } } }"
    gh api graphql -f query=$q -f projectId=$PROJECT_ID -f itemId=$itemId -f fieldId=$fieldId -f value=$optionId | Out-Null
}

function Set-Number([string]$fieldId, [double]$num) {
    $q = "mutation(`$projectId: ID!, `$itemId: ID!, `$fieldId: ID!, `$value: Float!) { updateProjectV2ItemFieldValue(input: {projectId: `$projectId, itemId: `$itemId, fieldId: `$fieldId, value: {number: `$value}}) { projectV2Item { id } } }"
    gh api graphql -f query=$q -f projectId=$PROJECT_ID -f itemId=$itemId -f fieldId=$fieldId -f value=$num | Out-Null
}

Write-Host "Configuring PR #$PRNumber ($prUrl) in Portfolio Project..." -ForegroundColor Cyan

Set-SingleSelect -fieldId $FIELD_IDS.Status   -optionId $StatusOptionId
Set-SingleSelect -fieldId $FIELD_IDS.Priority -optionId $PriorityOptionId
Set-SingleSelect -fieldId $FIELD_IDS.Size     -optionId $SizeOptionId
Set-SingleSelect -fieldId $FIELD_IDS.App      -optionId $AppOptionId
Set-SingleSelect -fieldId $FIELD_IDS.Area     -optionId $AreaOptionId

if ($FIELD_IDS.Estimate) { Set-Number -fieldId $FIELD_IDS.Estimate -num $Estimate }
if ($FIELD_IDS.Iteration) { gh project item-edit --id $itemId --field-id $FIELD_IDS.Iteration --value "@current" | Out-Null }

gh pr edit $PRNumber --add-assignee $Assign | Out-Null

Write-Host "✅ PR #$PRNumber configured: Status=$Status, Priority=$Priority, Size=$Size, Estimate=$Estimate, Iteration=@current, App=$App, Area=$Area, Assignee=$Assign" -ForegroundColor Green


