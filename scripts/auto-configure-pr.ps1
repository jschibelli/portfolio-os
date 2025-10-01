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

# Ensure GitHub CLI availability and non-interactive token
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw "GitHub CLI 'gh' is required but not found on PATH."
}

if (-not $env:GH_TOKEN -and $env:GITHUB_TOKEN) {
    $env:GH_TOKEN = $env:GITHUB_TOKEN
}

if (-not $env:GH_TOKEN) {
    Write-Warning "GH_TOKEN/GITHUB_TOKEN not set. In CI, provide 'GITHUB_TOKEN'."
}

if (-not ($PRNumber -as [int])) {
    throw "PRNumber must be numeric. Provided: '$PRNumber'"
}

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
          __typename
          id
          name
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

# Stable option ID fallbacks (from prompts/github-issue-auto-configuration.md)
$OPTION_IDS = @{
    Status = @{ "Ready" = "e18bf179"; "In progress" = "47fc9ee4"; "In review" = "aba860b9"; "Done" = "98236657" }
    Priority = @{ "P0" = "79628723"; "P1" = "0a877460"; "P2" = "da944a9c" }
    Size = @{ "XS" = "911790be"; "S" = "b277fb01"; "M" = "86db8eb3"; "L" = "853c8207"; "XL" = "2d0801e2" }
    App = @{ "Docs" = "e504fedd"; "Portfolio Site" = "de5faa4a"; "Dashboard" = "d134f386"; "Chatbot" = "c95306ff" }
    Area = @{ "Frontend" = "5618641d"; "Content" = "663d7084"; "Infra" = "5a298e61"; "DX/Tooling" = "a67a98e5" }
}

$StatusOptionId   = (Get-OptionId -fieldName "Status"   -optionName $Status)   ; if (-not $StatusOptionId)   { $StatusOptionId   = $OPTION_IDS.Status[$Status] }
$PriorityOptionId = (Get-OptionId -fieldName "Priority" -optionName $Priority) ; if (-not $PriorityOptionId) { $PriorityOptionId = $OPTION_IDS.Priority[$Priority] }
$SizeOptionId     = (Get-OptionId -fieldName "Size"     -optionName $Size)     ; if (-not $SizeOptionId)     { $SizeOptionId     = $OPTION_IDS.Size[$Size] }
$AppOptionId      = (Get-OptionId -fieldName "App"      -optionName $App)      ; if (-not $AppOptionId)      { $AppOptionId      = $OPTION_IDS.App[$App] }
$AreaOptionId     = (Get-OptionId -fieldName "Area"     -optionName $Area)     ; if (-not $AreaOptionId)     { $AreaOptionId     = $OPTION_IDS.Area[$Area] }

if (-not $StatusOptionId -or -not $PriorityOptionId -or -not $SizeOptionId -or -not $AppOptionId -or -not $AreaOptionId) {
    throw "Missing one or more project option IDs. Verify project fields/options."
}

$pr = gh pr view $PRNumber --json id,url,number | ConvertFrom-Json
if (-not $pr) { throw "Failed to fetch PR $PRNumber. Ensure it exists and token has access." }
$prId = $pr.id
$prUrl = $pr.url

$addQ = @'
mutation($projectId: ID!, $contentId: ID!) {
  addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
    item { id }
  }
}
'@
$itemId = gh api graphql -f query=$addQ -f projectId=$PROJECT_ID -f contentId=$prId -q .data.addProjectV2ItemById.item.id 2>$null
if (-not $itemId) {
    # Fallback: locate existing item if already added
    $listQ = @'
query($projectId: ID!) {
  node(id: $projectId) {
    ... on ProjectV2 {
      items(first: 100) {
        nodes { id content { __typename ... on PullRequest { id number } } }
      }
    }
  }
}
'@
    $items = (gh api graphql -f query=$listQ -f projectId=$PROJECT_ID | ConvertFrom-Json).data.node.items.nodes
    $existing = $items | Where-Object { $_.content.__typename -eq 'PullRequest' -and $_.content.id -eq $prId }
    if ($existing) { $itemId = $existing.id }
}
if (-not $itemId) { throw "Failed to add or locate project item for PR. Verify project ID and token scopes." }

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


