import { NextApiRequest, NextApiResponse } from 'next';

async function fetchAllFilesFromRepo() {
	try {
		const repoOwner = process.env.GITHUB_REPO_OWNER || 'your-username';
		const repoName = process.env.GITHUB_REPO_NAME || 'your-articles-repo';
		const githubToken = process.env.GITHUB_TOKEN;

		console.log('🔍 Debug - GitHub Config:', {
			repoOwner,
			repoName,
			hasToken: !!githubToken,
			tokenLength: githubToken?.length || 0,
		});

		const headers: Record<string, string> = {
			Accept: 'application/vnd.github.v3+json',
		};

		if (githubToken) {
			headers['Authorization'] = `token ${githubToken}`;
		}

		// Try different possible paths for articles
		const possiblePaths = ['posts', 'articles', 'content', 'blog', 'docs', ''];
		let allFiles = [];
		let debugInfo = {
			config: { repoOwner, repoName, hasToken: !!githubToken },
			paths: [] as any[],
			totalFiles: 0,
			markdownFiles: 0,
		};

		for (const path of possiblePaths) {
			const apiUrl = path
				? `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`
				: `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;

			console.log('🔍 Debug - Trying path:', path, 'URL:', apiUrl);

			const response = await fetch(apiUrl, { headers });
			console.log('🔍 Debug - Response Status for', path, ':', response.status);

			const pathInfo = {
				path,
				url: apiUrl,
				status: response.status,
				files: [] as any[],
				markdownFiles: [] as any[],
				otherFiles: [] as any[],
				error: undefined as string | undefined,
			};

			if (response.ok) {
				const files = await response.json();
				console.log('🔍 Debug - Found files in', path, ':', files.length);

				if (Array.isArray(files)) {
					// Separate markdown files from other files
					const markdownFiles = files.filter(
						(file: any) => file.name.endsWith('.md') || file.name.endsWith('.markdown'),
					);
					const otherFiles = files.filter(
						(file: any) => !file.name.endsWith('.md') && !file.name.endsWith('.markdown'),
					);

					pathInfo.files = files;
					pathInfo.markdownFiles = markdownFiles;
					pathInfo.otherFiles = otherFiles;

					console.log(
						'🔍 Debug - Markdown files in',
						path,
						':',
						markdownFiles.map((f: any) => `${f.name} (${f.updated_at})`),
					);
					console.log(
						'🔍 Debug - Other files in',
						path,
						':',
						otherFiles.map((f: any) => `${f.name} (${f.type})`),
					);

					allFiles.push(...files);
				}
			} else if (response.status === 404) {
				console.log('⚠️ Path not found:', path);
				pathInfo.error = 'Path not found';
			} else {
				const errorText = await response.text();
				console.error('❌ Error for path', path, ':', {
					status: response.status,
					statusText: response.statusText,
					error: errorText,
				});
				pathInfo.error = `${response.status}: ${errorText}`;
			}

			debugInfo.paths.push(pathInfo);
		}

		// Count totals
		debugInfo.totalFiles = allFiles.length;
		debugInfo.markdownFiles = allFiles.filter(
			(file: any) => file.name.endsWith('.md') || file.name.endsWith('.markdown'),
		).length;

		console.log('🔍 Debug - Total files found:', debugInfo.totalFiles);
		console.log('🔍 Debug - Total markdown files:', debugInfo.markdownFiles);

		return { allFiles, debugInfo };
	} catch (error) {
		console.error('❌ Error fetching files:', error);
		return {
			allFiles: [],
			debugInfo: { error: error instanceof Error ? error.message : 'Unknown error' },
		};
	}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const result = await fetchAllFilesFromRepo();

		return res.status(200).json({
			success: true,
			totalFiles: 'totalFiles' in result.debugInfo ? result.debugInfo.totalFiles : 0,
			markdownFiles: 'markdownFiles' in result.debugInfo ? result.debugInfo.markdownFiles : 0,
			allFiles: result.allFiles.map((file: any) => ({
				name: file.name,
				type: file.type,
				path: file.path,
				updated_at: file.updated_at,
				size: file.size,
				isMarkdown: file.name.endsWith('.md') || file.name.endsWith('.markdown'),
			})),
			debugInfo: result.debugInfo,
			environment: {
				hasGithubToken: !!process.env.GITHUB_TOKEN,
				githubRepoOwner: process.env.GITHUB_REPO_OWNER,
				githubRepoName: process.env.GITHUB_REPO_NAME,
				hasOpenAIKey: !!process.env.OPENAI_API_KEY,
			},
		});
	} catch (error) {
		console.error('Debug API error:', error);

		return res.status(500).json({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
			environment: {
				hasGithubToken: !!process.env.GITHUB_TOKEN,
				githubRepoOwner: process.env.GITHUB_REPO_OWNER,
				githubRepoName: process.env.GITHUB_REPO_NAME,
				hasOpenAIKey: !!process.env.OPENAI_API_KEY,
			},
		});
	}
}
