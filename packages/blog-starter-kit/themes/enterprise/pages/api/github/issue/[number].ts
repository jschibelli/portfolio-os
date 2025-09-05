import { NextApiRequest, NextApiResponse } from 'next';

interface GitHubIssue {
  id: number;
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { number } = req.query;
    const issueNumber = parseInt(number as string);

    if (isNaN(issueNumber)) {
      return res.status(400).json({ error: 'Invalid issue number' });
    }

    // Get repository information from environment variables
    const repoOwner = process.env.GITHUB_REPO_OWNER;
    const repoName = process.env.GITHUB_REPO_NAME;
    const githubToken = process.env.GITHUB_TOKEN;

    if (!repoOwner || !repoName) {
      return res.status(400).json({ 
        error: 'GitHub repository not configured',
        message: 'Please set GITHUB_REPO_OWNER and GITHUB_REPO_NAME environment variables'
      });
    }

    if (!githubToken) {
      return res.status(400).json({ 
        error: 'GitHub token not configured',
        message: 'Please set GITHUB_TOKEN environment variable'
      });
    }

    // Fetch issue from GitHub API
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${githubToken}`,
      'User-Agent': 'mindware-blog'
    };

    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issueNumber}`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ 
          error: 'Issue not found',
          message: `Issue #${issueNumber} not found in repository ${repoOwner}/${repoName}`
        });
      }
      
      if (response.status === 401) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'Invalid GitHub token or insufficient permissions'
        });
      }

      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: 'GitHub API error',
        message: errorData.message || 'Failed to fetch issue from GitHub',
        status: response.status
      });
    }

    const issue: GitHubIssue = await response.json();

    // Return the issue data
    return res.status(200).json({
      success: true,
      issue: {
        number: issue.number,
        title: issue.title,
        body: issue.body,
        state: issue.state,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        author: {
          username: issue.user.login,
          avatar_url: issue.user.avatar_url
        },
        labels: issue.labels,
        assignees: issue.assignees,
        comments_count: issue.comments,
        html_url: issue.html_url
      },
      repository: {
        owner: repoOwner,
        name: repoName,
        full_name: `${repoOwner}/${repoName}`
      }
    });

  } catch (error: any) {
    console.error('Error fetching GitHub issue:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'Failed to fetch issue'
    });
  }
}

