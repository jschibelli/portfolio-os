#!/usr/bin/env ts-node

/**
 * Script to fetch GitHub issue #21
 * Usage: npm run fetch-issue-21
 */

interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
  assignees: Array<{
    login: string;
    avatar_url: string;
  }>;
  comments: number;
  html_url: string;
}

async function fetchGitHubIssue(issueNumber: number) {
  try {
    // Get repository information from environment variables
    const repoOwner = process.env.GITHUB_REPO_OWNER;
    const repoName = process.env.GITHUB_REPO_NAME;
    const githubToken = process.env.GITHUB_TOKEN;

    console.log('🔍 GitHub Configuration:');
    console.log(`  Repository: ${repoOwner}/${repoName}`);
    console.log(`  Token: ${githubToken ? '✅ Set' : '❌ Missing'}`);
    console.log(`  Issue Number: #${issueNumber}`);
    console.log('');

    if (!repoOwner || !repoName) {
      throw new Error('GitHub repository not configured. Please set GITHUB_REPO_OWNER and GITHUB_REPO_NAME environment variables.');
    }

    if (!githubToken) {
      throw new Error('GitHub token not configured. Please set GITHUB_TOKEN environment variable.');
    }

    // Fetch issue from GitHub API
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${githubToken}`,
      'User-Agent': 'mindware-blog'
    };

    console.log('🌐 Fetching issue from GitHub API...');
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issueNumber}`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Issue #${issueNumber} not found in repository ${repoOwner}/${repoName}`);
      }
      
      if (response.status === 401) {
        throw new Error('Invalid GitHub token or insufficient permissions');
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(`GitHub API error: ${errorData.message || 'Failed to fetch issue'}`);
    }

    const issue: GitHubIssue = await response.json();

    console.log('✅ Issue fetched successfully!');
    console.log('');
    console.log('📋 Issue Details:');
    console.log(`  Title: ${issue.title}`);
    console.log(`  State: ${issue.state}`);
    console.log(`  Author: ${issue.user.login}`);
    console.log(`  Created: ${new Date(issue.created_at).toLocaleDateString()}`);
    console.log(`  Updated: ${new Date(issue.updated_at).toLocaleDateString()}`);
    console.log(`  Comments: ${issue.comments}`);
    console.log(`  Labels: ${issue.labels.map(l => l.name).join(', ') || 'None'}`);
    console.log(`  Assignees: ${issue.assignees.map(a => a.login).join(', ') || 'None'}`);
    console.log(`  URL: ${issue.html_url}`);
    console.log('');
    console.log('📝 Description:');
    console.log(issue.body || 'No description provided');
    console.log('');

    return issue;

  } catch (error: any) {
    console.error('❌ Error fetching GitHub issue:', error.message);
    console.log('');
    console.log('🔧 Setup Instructions:');
    console.log('1. Create a .env.local file in the enterprise theme directory');
    console.log('2. Add the following environment variables:');
    console.log('   GITHUB_REPO_OWNER=your-github-username');
    console.log('   GITHUB_REPO_NAME=your-repository-name');
    console.log('   GITHUB_TOKEN=your-github-personal-access-token');
    console.log('');
    console.log('3. Generate a GitHub Personal Access Token:');
    console.log('   - Go to https://github.com/settings/tokens');
    console.log('   - Click "Generate new token (classic)"');
    console.log('   - Select scopes: repo (for private repos) or public_repo (for public repos)');
    console.log('   - Copy the token and add it to your .env.local file');
    
    process.exit(1);
  }
}

// Main execution
async function main() {
  const issueNumber = 21;
  console.log('🚀 Fetching GitHub Issue #21...');
  console.log('');
  
  await fetchGitHubIssue(issueNumber);
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { fetchGitHubIssue };
