import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const repoOwner = process.env.GITHUB_REPO_OWNER || 'your-username';
    const repoName = process.env.GITHUB_REPO_NAME || 'your-articles-repo';
    const githubToken = process.env.GITHUB_TOKEN;
    
    const config = {
      repoOwner,
      repoName,
      hasToken: !!githubToken,
      tokenLength: githubToken?.length || 0,
      tokenPreview: githubToken ? `${githubToken.substring(0, 10)}...` : 'none'
    };
    
    return res.status(200).json({
      success: true,
      config,
      message: 'GitHub configuration loaded successfully'
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to load GitHub configuration'
    });
  }
}
