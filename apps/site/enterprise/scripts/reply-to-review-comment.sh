#!/bin/bash

# Script to help reply to GitHub review comments
# Usage: ./scripts/reply-to-review-comment.sh <PR_NUMBER> <COMMENT_ID> <RESPONSE_FILE>

set -e

PR_NUMBER=$1
COMMENT_ID=$2
RESPONSE_FILE=$3

if [ -z "$PR_NUMBER" ] || [ -z "$COMMENT_ID" ] || [ -z "$RESPONSE_FILE" ]; then
    echo "Usage: $0 <PR_NUMBER> <COMMENT_ID> <RESPONSE_FILE>"
    echo "Example: $0 72 2337309927 response.md"
    exit 1
fi

# Get repository info
REPO_OWNER=$(gh repo view --json owner -q .owner.login)
REPO_NAME=$(gh repo view --json name -q .name)

echo "Repository: $REPO_OWNER/$REPO_NAME"
echo "PR Number: $PR_NUMBER"
echo "Comment ID: $COMMENT_ID"
echo "Response File: $RESPONSE_FILE"
echo ""

# Get comment details
echo "Fetching comment details..."
COMMENT_URL=$(gh api repos/$REPO_OWNER/$REPO_NAME/pulls/comments/$COMMENT_ID -q .html_url)
COMMENT_BODY=$(gh api repos/$REPO_OWNER/$REPO_NAME/pulls/comments/$COMMENT_ID -q .body)

echo "Comment URL: $COMMENT_URL"
echo "Comment Preview:"
echo "$COMMENT_BODY" | head -5
echo "..."

# Check if response file exists
if [ ! -f "$RESPONSE_FILE" ]; then
    echo "Error: Response file '$RESPONSE_FILE' not found"
    exit 1
fi

# Read response content
RESPONSE_CONTENT=$(cat "$RESPONSE_FILE")

# Create the comment
echo "Creating response comment..."
gh pr comment $PR_NUMBER --body "$RESPONSE_CONTENT"

echo "Response posted successfully!"
echo "You can view it at: https://github.com/$REPO_OWNER/$REPO_NAME/pull/$PR_NUMBER"
