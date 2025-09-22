// GitHub Integration Adapter
// Docs: https://docs.github.com/rest
// Server-only - uses OAuth user token via Auth.js session

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth-config';

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  url: string;
  state: string;
  assignee?: {
    login: string;
  };
}

export interface GitHubPR {
  id: number;
  number: number;
  title: string;
  url: string;
  state: string;
  assignee?: {
    login: string;
  };
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  url: string;
  author?: {
    login: string;
  };
}

export interface GitHubListParams {
  owner: string;
  repo: string;
  state?: 'open' | 'closed' | 'all';
  branch?: string;
  limit?: number;
}

// Get OAuth client for GitHub API
async function getGitHubClient() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error('No valid session found');
  }

  return {
    accessToken: session.accessToken,
  };
}

export async function listAssignedIssues({ 
  owner, 
  repo, 
  state = 'open' 
}: GitHubListParams): Promise<GitHubIssue[]> {
  try {
    const client = await getGitHubClient();
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=${state}&assignee=@me`,
      {
        headers: {
          Authorization: `Bearer ${client.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data.map((issue: any) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state,
      assignee: issue.assignee ? { login: issue.assignee.login } : undefined,
    }));
  } catch (error) {
    console.error('Error listing assigned issues:', error);
    throw error;
  }
}

export async function listAssignedPRs({ 
  owner, 
  repo, 
  state = 'open' 
}: GitHubListParams): Promise<GitHubPR[]> {
  try {
    const client = await getGitHubClient();
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=${state}&assignee=@me`,
      {
        headers: {
          Authorization: `Bearer ${client.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data.map((pr: any) => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      url: pr.html_url,
      state: pr.state,
      assignee: pr.assignee ? { login: pr.assignee.login } : undefined,
    }));
  } catch (error) {
    console.error('Error listing assigned PRs:', error);
    throw error;
  }
}

export async function listRecentCommits({ 
  owner, 
  repo, 
  branch = 'main', 
  limit = 10 
}: GitHubListParams): Promise<GitHubCommit[]> {
  try {
    const client = await getGitHubClient();
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${client.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data.map((commit: any) => ({
      sha: commit.sha,
      commit: {
        message: commit.commit.message,
        author: {
          name: commit.commit.author.name,
          date: commit.commit.author.date,
        },
      },
      url: commit.html_url,
      author: commit.author ? { login: commit.author.login } : undefined,
    }));
  } catch (error) {
    console.error('Error listing recent commits:', error);
    throw error;
  }
}
