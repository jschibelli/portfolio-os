import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	return res.status(200).json({
		environment: {
			hasGithubToken: !!process.env.GITHUB_TOKEN,
			githubRepoOwner: process.env.GITHUB_REPO_OWNER,
			githubRepoName: process.env.GITHUB_REPO_NAME,
			hasOpenAIKey: !!process.env.OPENAI_API_KEY,
			nodeEnv: process.env.NODE_ENV,
		},
		message: 'Environment variables check',
	});
}
