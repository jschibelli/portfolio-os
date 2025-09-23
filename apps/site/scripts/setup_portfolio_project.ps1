# Portfolio Project Setup Script for GitHub Projects v2
# PowerShell version for Windows

param(
    [switch]$SkipAuth
)

# Colors for output
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Reset = "`e[0m"

# Configuration
$OWNER = "jschibelli"
$PROJECT_TITLE = "Portfolio Site - schibelli.dev"
$PROJECT_DESCRIPTION = "Central board for the schibelli.dev portfolio (Next.js, TypeScript, Tailwind)"
$CACHE_FILE = ".project_cache.json"

# Helper functions
function Log-Info {
    param($Message)
    Write-Host "${Blue}ℹ️  $Message${Reset}"
}

function Log-Success {
    param($Message)
    Write-Host "${Green}✅ $Message${Reset}"
}

function Log-Warning {
    param($Message)
    Write-Host "${Yellow}⚠️  $Message${Reset}"
}

function Log-Error {
    param($Message)
    Write-Host "${Red}❌ $Message${Reset}"
}

# Check for required tools
function Test-Dependencies {
    Log-Info "Checking dependencies..."
    
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        Log-Error "GitHub CLI (gh) is not installed"
        Write-Host "Install with: winget install --id GitHub.cli"
        exit 1
    }
    
    if (-not (Get-Command jq -ErrorAction SilentlyContinue)) {
        Log-Error "jq is not installed"
        Write-Host "Install with: winget install --id jqlang.jq"
        exit 1
    }
    
    Log-Success "All dependencies found"
}

# Check GitHub CLI authentication and scopes
function Test-Auth {
    Log-Info "Checking GitHub CLI authentication..."
    
    try {
        $authStatus = gh auth status 2>&1
        if ($LASTEXITCODE -ne 0) {
            Log-Error "Not authenticated with GitHub CLI"
            Write-Host "Run: gh auth login"
            exit 1
        }
        
        # Check for required scopes
        if ($authStatus -notmatch "project") {
            Log-Warning "Missing required 'project' scope"
            Write-Host "Run: gh auth refresh -s read:org,project,repo"
            if (-not $SkipAuth) {
                Write-Host "Attempting to refresh authentication..."
                gh auth refresh -s read:org,project,repo
                if ($LASTEXITCODE -ne 0) {
                    Log-Error "Failed to refresh authentication"
                    exit 1
                }
            } else {
                exit 1
            }
        }
        
        Log-Success "Authentication verified with required scopes"
    }
    catch {
        Log-Error "Failed to check authentication: $_"
        exit 1
    }
}

# Get or create project
function Get-OrCreateProject {
    Log-Info "Getting or creating project..."
    
    try {
        # Check if project already exists
        $existingProjects = gh project list --owner $OWNER --format json 2>$null
        if ($LASTEXITCODE -eq 0 -and $existingProjects) {
            $projectNumber = ($existingProjects | ConvertFrom-Json | Where-Object { $_.title -eq $PROJECT_TITLE }).number
            if ($projectNumber) {
                Log-Success "Found existing project: #$projectNumber"
                return $projectNumber
            }
        }
        
        # Create new project
        Log-Info "Creating new project..."
        $projectData = gh project create --owner $OWNER --title $PROJECT_TITLE --format json
        if ($LASTEXITCODE -ne 0) {
            Log-Error "Failed to create project"
            exit 1
        }
        
        $project = $projectData | ConvertFrom-Json
        $projectNumber = $project.number
        $projectUrl = $project.url
        
        Log-Success "Created project #$projectNumber"
        
        # Cache project info
        $cacheData = @{
            number = $projectNumber
            url = $projectUrl
        } | ConvertTo-Json
        $cacheData | Out-File -FilePath $CACHE_FILE -Encoding UTF8
        
        return $projectNumber
    }
    catch {
        Log-Error "Failed to get or create project: $_"
        exit 1
    }
}

# Set project README
function Set-ProjectReadme {
    param($ProjectNumber)
    
    Log-Info "Setting project README..."
    
    # Create temporary README file
    $readmeContent = @"
# schibelli.dev — Portfolio Project

Central board for the schibelli.dev portfolio (Next.js, TypeScript, Tailwind).

## Status workflow

Backlog → Planned → In Progress → In Review → Done

## Fields

* Status (Backlog, Planned, In Progress, In Review, Done)
* Priority (P0, P1, P2, P3)
* Type (Feature, Bug, Chore, Docs)
* Area (Core, Blog, SEO, Accessibility, UI/Design, Infra)
* Size (XS, S, M, L, XL)
* Target (text)

## Views

* Board (grouped by Status)
* Table (open items, sorted by Priority then Size)
* Roadmap (optional: group by Target)

## Automation

* New items → Status = Backlog
* Closed issues / merged PRs → Status = Done
"@
    
    $readmeFile = [System.IO.Path]::GetTempFileName()
    $readmeContent | Out-File -FilePath $readmeFile -Encoding UTF8
    
    try {
        gh project edit $ProjectNumber --owner $OWNER --readme-file $readmeFile
        if ($LASTEXITCODE -eq 0) {
            Log-Success "Project README set"
        } else {
            Log-Warning "Failed to set README via CLI"
        }
    }
    finally {
        Remove-Item $readmeFile -ErrorAction SilentlyContinue
    }
}

# Create custom fields
function New-ProjectFields {
    param($ProjectNumber)
    
    Log-Info "Creating custom fields..."
    
    $fields = @(
        @{ Name = "Status"; Type = "SINGLE_SELECT"; Options = "Backlog,Planned,In Progress,In Review,Done" },
        @{ Name = "Priority"; Type = "SINGLE_SELECT"; Options = "P0,P1,P2,P3" },
        @{ Name = "Type"; Type = "SINGLE_SELECT"; Options = "Feature,Bug,Chore,Docs" },
        @{ Name = "Area"; Type = "SINGLE_SELECT"; Options = "Core,Blog,SEO,Accessibility,UI/Design,Infra" },
        @{ Name = "Size"; Type = "SINGLE_SELECT"; Options = "XS,S,M,L,XL" },
        @{ Name = "Target"; Type = "TEXT"; Options = $null }
    )
    
    foreach ($field in $fields) {
        try {
            if ($field.Type -eq "TEXT") {
                gh project field-create $ProjectNumber --owner $OWNER --name $field.Name --type TEXT
            } else {
                gh project field-create $ProjectNumber --owner $OWNER --name $field.Name --type SINGLE_SELECT --options $field.Options
            }
            
            if ($LASTEXITCODE -eq 0) {
                Log-Success "Created $($field.Name) field"
            } else {
                Log-Warning "Failed to create $($field.Name) field"
            }
        }
        catch {
            Log-Warning "Failed to create $($field.Name) field: $_"
        }
    }
}

# Setup GitHub secrets for workflow
function Set-GitHubSecrets {
    param($ProjectUrl)
    
    Log-Info "Setting up GitHub secrets for workflow..."
    
    # Get project URL from cache if not provided
    if (-not $ProjectUrl -and (Test-Path $CACHE_FILE)) {
        $cacheData = Get-Content $CACHE_FILE | ConvertFrom-Json
        $ProjectUrl = $cacheData.url
    }
    
    if (-not $ProjectUrl) {
        Log-Warning "Project URL not found. Please provide it manually."
        $ProjectUrl = Read-Host "Enter project URL"
    }
    
    try {
        # Set project URL secret
        gh secret set PORTFOLIO_PROJECT_URL --body $ProjectUrl
        if ($LASTEXITCODE -eq 0) {
            Log-Success "Set PORTFOLIO_PROJECT_URL secret"
        } else {
            Log-Warning "Failed to set PORTFOLIO_PROJECT_URL secret"
        }
        
        # Prompt for PAT
        $patToken = Read-Host "Enter GitHub Personal Access Token (with Projects: Write scope)" -AsSecureString
        $patTokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($patToken))
        
        if ($patTokenPlain) {
            gh secret set PORTFOLIO_PROJECT_TOKEN --body $patTokenPlain
            if ($LASTEXITCODE -eq 0) {
                Log-Success "Set PORTFOLIO_PROJECT_TOKEN secret"
            } else {
                Log-Warning "Failed to set PORTFOLIO_PROJECT_TOKEN secret"
            }
        } else {
            Log-Warning "No PAT provided. You'll need to set PORTFOLIO_PROJECT_TOKEN manually."
            Write-Host "Create a fine-grained PAT with 'Projects: Write' scope at:"
            Write-Host "https://github.com/settings/personal-access-tokens/fine-grained"
        }
    }
    catch {
        Log-Warning "Failed to set secrets: $_"
    }
}

# Print summary and next steps
function Show-Summary {
    param($ProjectNumber, $ProjectUrl)
    
    Write-Host ""
    Log-Success "Portfolio Project Setup Complete!"
    Write-Host ""
    Write-Host "Project Details:"
    Write-Host "   Number: #$ProjectNumber"
    Write-Host "   URL: $ProjectUrl"
    Write-Host ""
    Write-Host "Next Steps (if not done via CLI):"
    Write-Host "   1. Open the Project -> Settings -> Workflows"
    Write-Host "      -> Enable 'Auto-add to Backlog' and 'Item closed -> Status: Done'"
    Write-Host ""
    Write-Host "   2. Open the Project -> Views -> New view"
    Write-Host "      -> Board (group by Status)"
    Write-Host "      -> Table (filter is:open; sort Priority asc, Size asc)"
    Write-Host ""
    Write-Host "Files Created:"
    Write-Host "   - .github/ISSUE_TEMPLATE/feature_request.yml"
    Write-Host "   - .github/ISSUE_TEMPLATE/bug_report.yml"
    Write-Host "   - .github/ISSUE_TEMPLATE/config.yml"
    Write-Host "   - .github/workflows/add-to-project.yml"
    Write-Host "   - $CACHE_FILE"
    Write-Host ""
    Log-Info "Run 'gh project view $ProjectNumber --owner $OWNER' to open the project"
}

# Main execution
function Main {
    Write-Host "🚀 Setting up Portfolio Project for GitHub Projects v2"
    Write-Host "=================================================="
    Write-Host ""
    
    Test-Dependencies
    Test-Auth
    
    $projectNumber = Get-OrCreateProject
    $projectUrl = ""
    
    # Get project URL
    if (Test-Path $CACHE_FILE) {
        $cacheData = Get-Content $CACHE_FILE | ConvertFrom-Json
        $projectUrl = $cacheData.url
    } else {
        try {
            $projectData = gh project view $projectNumber --owner $OWNER --format json
            if ($LASTEXITCODE -eq 0) {
                $project = $projectData | ConvertFrom-Json
                $projectUrl = $project.url
                $cacheData = @{
                    number = $projectNumber
                    url = $projectUrl
                } | ConvertTo-Json
                $cacheData | Out-File -FilePath $CACHE_FILE -Encoding UTF8
            }
        }
        catch {
            Log-Warning "Could not retrieve project URL"
        }
    }
    
    Set-ProjectReadme $projectNumber
    New-ProjectFields $projectNumber
    
    # Setup secrets
    Log-Info "Setting up GitHub secrets..."
    Set-GitHubSecrets $projectUrl
    
    Show-Summary $projectNumber $projectUrl
}

# Run main function
Main
