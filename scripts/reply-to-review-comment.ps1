# PowerShell script to help reply to GitHub review comments
# Usage: .\scripts\reply-to-review-comment.ps1 -PRNumber <PR_NUMBER> -CommentId <COMMENT_ID> -ResponseFile <RESPONSE_FILE>

param(
    [Parameter(Mandatory=$true)]
    [string]$PRNumber,
    
    [Parameter(Mandatory=$true)]
    [string]$CommentId,
    
    [Parameter(Mandatory=$true)]
    [string]$ResponseFile
)

try {
    # Get repository info
    $repoOwner = gh repo view --json owner -q .owner.login
    $repoName = gh repo view --json name -q .name
    
    Write-Host "Repository: $repoOwner/$repoName" -ForegroundColor Green
    Write-Host "PR Number: $PRNumber" -ForegroundColor Green
    Write-Host "Comment ID: $CommentId" -ForegroundColor Green
    Write-Host "Response File: $ResponseFile" -ForegroundColor Green
    Write-Host ""
    
    # Get comment details
    Write-Host "Fetching comment details..." -ForegroundColor Yellow
    $commentUrl = gh api repos/$repoOwner/$repoName/pulls/comments/$CommentId -q .html_url
    $commentBody = gh api repos/$repoOwner/$repoName/pulls/comments/$CommentId -q .body
    
    Write-Host "Comment URL: $commentUrl" -ForegroundColor Cyan
    Write-Host "Comment Preview:" -ForegroundColor Cyan
    $commentBody | Select-Object -First 5 | ForEach-Object { Write-Host $_ }
    Write-Host "..."
    Write-Host ""
    
    # Check if response file exists
    if (-not (Test-Path $ResponseFile)) {
        Write-Error "Response file '$ResponseFile' not found"
        exit 1
    }
    
    # Read response content
    $responseContent = Get-Content $ResponseFile -Raw
    
    # Create a threaded reply to the specific review comment
    Write-Host "Creating threaded reply to the review comment..." -ForegroundColor Yellow
    gh api -X POST "repos/$repoOwner/$repoName/pulls/comments/$CommentId/replies" -f body="$responseContent"
    
    Write-Host "Threaded reply posted successfully!" -ForegroundColor Green
    Write-Host "Parent comment: $commentUrl" -ForegroundColor Cyan
    
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
}
