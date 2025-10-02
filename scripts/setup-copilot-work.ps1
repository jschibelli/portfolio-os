# Setup Copilot Work Script
# Usage: .\scripts\setup-copilot-work.ps1 [-IssueNumber 3] [-DryRun]

param(
    [Parameter(Mandatory=$false)]
    [int]$IssueNumber,
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Get-IssueDetails {
    param([int]$IssueNumber)
    
    try {
        $issue = gh issue view $IssueNumber --json number,title,body,labels,assignees,author
        return $issue | ConvertFrom-Json
    }
    catch {
        return $null
    }
}

function Create-InitialFiles {
    param(
        [string]$BranchName,
        [string]$IssueTitle,
        [string]$IssueBody
    )
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would create initial files for: $BranchName" "Cyan"
        return $true
    }
    
    try {
        # Create a basic README for the issue
        $readmeContent = @"
# $IssueTitle

## Description
$IssueBody

## Implementation Plan
- [ ] Analyze requirements
- [ ] Design solution
- [ ] Implement core functionality
- [ ] Add tests
- [ ] Update documentation

## Files to Create/Modify
- [ ] Add implementation files
- [ ] Update existing files
- [ ] Add tests

## Notes
This branch is set up for development work on Issue #$IssueNumber.
"@
        
        $readmePath = "ISSUE-${IssueNumber}-README.md"
        $readmeContent | Out-File -FilePath $readmePath -Encoding UTF8
        
        Write-ColorOutput "  Created: $readmePath" "Green"
        
        # Create a basic implementation file based on issue type
        if ($IssueTitle -like "*Docs*" -or $IssueTitle -like "*documentation*") {
            $implContent = @"
// Documentation implementation for Issue #$IssueNumber
// $IssueTitle

export const documentationConfig = {
  title: '$IssueTitle',
  description: '$IssueBody',
  // Add documentation structure here
};

// TODO: Implement documentation features
"@
            $implPath = "docs/issue-${IssueNumber}-implementation.ts"
            $implContent | Out-File -FilePath $implPath -Encoding UTF8
            Write-ColorOutput "  Created: $implPath" "Green"
        }
        elseif ($IssueTitle -like "*API*" -or $IssueTitle -like "*integration*") {
            $implContent = @"
// API implementation for Issue #$IssueNumber
// $IssueTitle

export class Issue${IssueNumber}API {
  constructor() {
    // Initialize API implementation
  }
  
  // TODO: Implement API methods
}

// TODO: Add API endpoints and integration logic
"@
            $implPath = "lib/issue-${IssueNumber}-api.ts"
            $implContent | Out-File -FilePath $implPath -Encoding UTF8
            Write-ColorOutput "  Created: $implPath" "Green"
        }
        else {
            $implContent = @"
// Implementation for Issue #$IssueNumber
// $IssueTitle

export const issue${IssueNumber}Config = {
  title: '$IssueTitle',
  description: '$IssueBody',
  // Add configuration here
};

// TODO: Implement core functionality
"@
            $implPath = "lib/issue-${IssueNumber}-implementation.ts"
            $implContent | Out-File -FilePath $implPath -Encoding UTF8
            Write-ColorOutput "  Created: $implPath" "Green"
        }
        
        return $true
    }
    catch {
        Write-ColorOutput "  Error: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Main {
    Write-ColorOutput "=== Setup Copilot Work ===" "Blue"
    
    if ($DryRun) {
        Write-ColorOutput "*** DRY RUN MODE - No files will be created ***" "Cyan"
    }
    
    Write-ColorOutput ""
    
    if ($IssueNumber) {
        # Setup work for specific issue
        Write-ColorOutput "Setting up work for Issue #$IssueNumber..." "Yellow"
        
        $issueDetails = Get-IssueDetails $IssueNumber
        if (-not $issueDetails) {
            Write-ColorOutput "Could not fetch issue details for #$IssueNumber" "Red"
            return
        }
        
        $branchName = "feature/issue-${IssueNumber}-$(($issueDetails.title -replace '[^a-zA-Z0-9]', '-').ToLower())"
        $issueTitle = $issueDetails.title
        $issueBody = $issueDetails.body
        
        Write-ColorOutput "Issue: $issueTitle" "White"
        Write-ColorOutput "Branch: $branchName" "White"
        Write-ColorOutput ""
        
        # Checkout branch
        try {
            git checkout $branchName
            Write-ColorOutput "Checked out branch: $branchName" "Green"
        }
        catch {
            Write-ColorOutput "Could not checkout branch: $branchName" "Red"
            Write-ColorOutput "Make sure the branch exists" "Yellow"
            return
        }
        
        # Create initial files
        Write-ColorOutput "Creating initial files..." "Yellow"
        if (Create-InitialFiles -BranchName $branchName -IssueTitle $issueTitle -IssueBody $issueBody) {
            Write-ColorOutput "Initial files created successfully!" "Green"
        } else {
            Write-ColorOutput "Failed to create initial files" "Red"
        }
        
    } else {
        # Setup work for all Copilot issues
        Write-ColorOutput "Setting up work for all Copilot issues..." "Yellow"
        
        $copilotBranches = @(
            "feature/issue-3-component-reference-sync",
            "feature/issue-5-information-architecture", 
            "feature/issue-19-integration-documentation",
            "feature/issue-40-api-implementations",
            "feature/issue-167-theming-guidelines",
            "feature/issue-181-dashboard-docs-link",
            "feature/issue-204-hashnode-publishing-api",
            "feature/issue-206-ai-writing-assistant",
            "feature/issue-208-realtime-autosave",
            "feature/issue-230-content-migration-sync"
        )
        
        $successCount = 0
        
        foreach ($branchName in $copilotBranches) {
            Write-ColorOutput "Setting up: $branchName" "White"
            
            try {
                git checkout $branchName
                Write-ColorOutput "  Checked out branch" "Green"
                
                # Extract issue number from branch name
                if ($branchName -match "issue-(\d+)") {
                    $issueNum = $matches[1]
                    $issueDetails = Get-IssueDetails $issueNum
                    
                    if ($issueDetails) {
                        if (Create-InitialFiles -BranchName $branchName -IssueTitle $issueDetails.title -IssueBody $issueDetails.body) {
                            $successCount++
                        }
                    }
                }
            }
            catch {
                Write-ColorOutput "  Failed to setup: $($_.Exception.Message)" "Red"
            }
            
            Write-ColorOutput ""
        }
        
        Write-ColorOutput "=== Summary ===" "Blue"
        Write-ColorOutput "Branches setup: $successCount/$($copilotBranches.Count)" "White"
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "Next steps:" "Yellow"
    Write-ColorOutput "1. Open the branch in your IDE" "White"
    Write-ColorOutput "2. Use Copilot Chat to ask for help with implementation" "White"
    Write-ColorOutput "3. Start coding with Copilot assistance" "White"
    Write-ColorOutput "4. Commit and push your changes" "White"
}

# Run the main function
Main
