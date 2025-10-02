# Create Initial Files Script
# Usage: .\scripts\create-initial-files.ps1 [-IssueNumber 3]

param(
    [Parameter(Mandatory=$false)]
    [int]$IssueNumber = 3
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

function Create-DirectoryIfNotExists {
    param([string]$Path)
    
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-ColorOutput "  Created directory: $Path" "Green"
    }
}

function Main {
    Write-ColorOutput "=== Create Initial Files for Issue #$IssueNumber ===" "Blue"
    Write-ColorOutput ""
    
    # Get issue details
    $issueDetails = Get-IssueDetails $IssueNumber
    if (-not $issueDetails) {
        Write-ColorOutput "Could not fetch issue details for #$IssueNumber" "Red"
        return
    }
    
    $issueTitle = $issueDetails.title
    $issueBody = $issueDetails.body
    
    Write-ColorOutput "Issue: $issueTitle" "White"
    Write-ColorOutput "Description: $($issueBody.Substring(0, [Math]::Min(100, $issueBody.Length)))..." "White"
    Write-ColorOutput ""
    
    # Create directories if they don't exist
    Create-DirectoryIfNotExists "lib"
    Create-DirectoryIfNotExists "docs"
    Create-DirectoryIfNotExists "components"
    Create-DirectoryIfNotExists "scripts"
    
    # Create README for the issue
    $readmeContent = @"
# Issue #${IssueNumber}: $issueTitle

## Description
$issueBody

## Implementation Plan
- [ ] Analyze requirements
- [ ] Design solution  
- [ ] Implement core functionality
- [ ] Add tests
- [ ] Update documentation

## Files Created
- [ ] Initial implementation files
- [ ] Documentation
- [ ] Tests

## Next Steps
1. Review the generated files
2. Implement the actual functionality
3. Test the implementation
4. Create pull request

---
*This file was auto-generated for development work on Issue #${IssueNumber}*
"@
    
    $readmePath = "ISSUE-${IssueNumber}-README.md"
    $readmeContent | Out-File -FilePath $readmePath -Encoding UTF8
    Write-ColorOutput "✅ Created: $readmePath" "Green"
    
    # Create implementation file based on issue type
    if ($issueTitle -like "*Docs*" -or $issueTitle -like "*documentation*") {
        $implContent = @"
/**
 * Documentation implementation for Issue #$IssueNumber
 * $issueTitle
 */

export interface DocumentationConfig {
  title: string;
  description: string;
  sections: DocumentationSection[];
}

export interface DocumentationSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export const createDocumentation = (config: DocumentationConfig): DocumentationSection[] => {
  // TODO: Implement documentation creation logic
  return config.sections;
};

export const generateDocumentation = (sections: DocumentationSection[]): string => {
  // TODO: Implement documentation generation
  return sections.map(section => `# ${section.title}\n\n${section.content}`).join('\n\n');
};

// TODO: Add more documentation utilities
"@
        $implPath = "lib/issue-${IssueNumber}-documentation.ts"
        $implContent | Out-File -FilePath $implPath -Encoding UTF8
        Write-ColorOutput "✅ Created: $implPath" "Green"
    }
    elseif ($issueTitle -like "*API*" -or $issueTitle -like "*integration*") {
        $implContent = @"
/**
 * API implementation for Issue #$IssueNumber
 * $issueTitle
 */

export interface APIConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export class Issue${IssueNumber}API {
  private config: APIConfig;
  
  constructor(config: APIConfig) {
    this.config = config;
  }
  
  async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    // TODO: Implement API request logic
    const url = `${this.config.baseUrl}${endpoint}`;
    return fetch(url, {
      ...options,
      timeout: this.config.timeout,
    });
  }
  
  // TODO: Add specific API methods
}

export const createAPI = (config: APIConfig): Issue${IssueNumber}API => {
  return new Issue${IssueNumber}API(config);
};
"@
        $implPath = "lib/issue-${IssueNumber}-api.ts"
        $implContent | Out-File -FilePath $implPath -Encoding UTF8
        Write-ColorOutput "✅ Created: $implPath" "Green"
    }
    else {
        $implContent = @"
/**
 * Implementation for Issue #$IssueNumber
 * $issueTitle
 */

export interface Issue${IssueNumber}Config {
  title: string;
  description: string;
  enabled: boolean;
}

export class Issue${IssueNumber}Implementation {
  private config: Issue${IssueNumber}Config;
  
  constructor(config: Issue${IssueNumber}Config) {
    this.config = config;
  }
  
  async initialize(): Promise<void> {
    // TODO: Implement initialization logic
    console.log('Initializing Issue #$IssueNumber implementation');
  }
  
  async execute(): Promise<any> {
    // TODO: Implement core functionality
    return { success: true, message: 'Implementation ready' };
  }
  
  // TODO: Add more methods as needed
}

export const createImplementation = (config: Issue${IssueNumber}Config): Issue${IssueNumber}Implementation => {
  return new Issue${IssueNumber}Implementation(config);
};
"@
        $implPath = "lib/issue-${IssueNumber}-implementation.ts"
        $implContent | Out-File -FilePath $implPath -Encoding UTF8
        Write-ColorOutput "✅ Created: $implPath" "Green"
    }
    
    # Create a simple test file
    $testContent = @"
/**
 * Tests for Issue #$IssueNumber
 * $issueTitle
 */

import { describe, it, expect } from '@jest/globals';

describe('Issue #$IssueNumber Implementation', () => {
  it('should initialize correctly', () => {
    // TODO: Add tests
    expect(true).toBe(true);
  });
  
  it('should execute successfully', () => {
    // TODO: Add tests
    expect(true).toBe(true);
  });
});
"@
    $testPath = "__tests__/issue-${IssueNumber}.test.ts"
    Create-DirectoryIfNotExists "__tests__"
    $testContent | Out-File -FilePath $testPath -Encoding UTF8
    Write-ColorOutput "✅ Created: $testPath" "Green"
    
    Write-ColorOutput ""
    Write-ColorOutput "=== Files Created Successfully ===" "Blue"
    Write-ColorOutput "✅ README: $readmePath" "White"
    Write-ColorOutput "✅ Implementation: lib/issue-${IssueNumber}-*.ts" "White"
    Write-ColorOutput "✅ Tests: $testPath" "White"
    Write-ColorOutput ""
    Write-ColorOutput "Next steps:" "Yellow"
    Write-ColorOutput "1. Review the generated files" "White"
    Write-ColorOutput "2. Implement the actual functionality" "White"
    Write-ColorOutput "3. Use Copilot Chat for coding assistance" "White"
    Write-ColorOutput "4. Commit and push your changes" "White"
}

# Run the main function
Main
