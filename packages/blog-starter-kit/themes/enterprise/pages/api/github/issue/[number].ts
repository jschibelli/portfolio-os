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
    
    // Enhanced input validation
    if (!number || typeof number !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Issue number is required and must be a string' 
      });
    }

    // Validate issue number format and range
    const issueNumber = parseInt(number, 10);
    if (isNaN(issueNumber) || issueNumber <= 0 || issueNumber > 999999) {
      return res.status(400).json({ 
        error: 'Invalid issue number', 
        message: 'Issue number must be a positive integer between 1 and 999999' 
      });
    }

    // Get repository information from environment variables with validation
    const repoOwner = process.env.GITHUB_REPO_OWNER;
    const repoName = process.env.GITHUB_REPO_NAME;
    const githubToken = process.env.GITHUB_TOKEN;

    // Validate environment variables
    if (!repoOwner || !repoName) {
      console.error('GitHub repository configuration missing:', { 
        repoOwner: !!repoOwner, 
        repoName: !!repoName 
      });
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'GitHub repository not configured. Please contact the administrator.'
      });
    }

    if (!githubToken) {
      console.error('GitHub token not configured');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'GitHub integration not available. Please contact the administrator.'
      });
    }

    // Validate repository owner and name format
    if (!/^[a-zA-Z0-9._-]+$/.test(repoOwner) || !/^[a-zA-Z0-9._-]+$/.test(repoName)) {
      return res.status(400).json({ 
        error: 'Invalid repository configuration',
        message: 'Repository owner and name must contain only alphanumeric characters, dots, underscores, and hyphens'
      });
    }

    // Fetch issue from GitHub API with enhanced error handling
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${githubToken}`,
      'User-Agent': 'mindware-blog',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issueNumber}`;
    
    // Add timeout and retry logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(apiUrl, { 
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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
    // Enhanced error logging with more context
    console.error('Error fetching GitHub issue:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString()
    });

    // Handle specific error types
    if (error.name === 'AbortError') {
      return res.status(408).json({ 
        error: 'Request timeout',
        message: 'GitHub API request timed out. Please try again.'
      });
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'Service unavailable',
        message: 'Unable to connect to GitHub API. Please try again later.'
      });
    }

    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred while fetching the issue. Please try again.'
    });
  }
}


