import { NextApiRequest, NextApiResponse } from 'next';

// Function to fetch articles from GitHub repository (same as in chat.ts)
async function fetchArticlesFromRepo() {
  try {
    const repoOwner = process.env.GITHUB_REPO_OWNER || 'your-username';
    const repoName = process.env.GITHUB_REPO_NAME || 'your-articles-repo';
    const githubToken = process.env.GITHUB_TOKEN;
    
    console.log('🔍 Debug - GitHub Config:', {
      repoOwner,
      repoName,
      hasToken: !!githubToken,
      tokenLength: githubToken?.length || 0
    });
    
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }
    
    // Try different possible paths for articles
    const possiblePaths = ['posts', 'articles', 'content', 'blog', 'docs', ''];
    let articles = [];
    let debugInfo = {
      config: { repoOwner, repoName, hasToken: !!githubToken },
      paths: [] as any[],
      totalArticles: 0
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
         articles: [] as any[],
         error: undefined as string | undefined
       };
      
      if (response.ok) {
        const files = await response.json();
        console.log('🔍 Debug - Found files in', path, ':', files.length);
        console.log('🔍 Debug - File names:', files.map((f: any) => f.name));
        pathInfo.files = files;
        
        // If it's a directory, look for markdown files
        if (Array.isArray(files)) {
          // Sort files by updated_at date (most recent first)
          const sortedFiles = files
            .filter((file: any) => file.name.endsWith('.md') || file.name.endsWith('.markdown'))
            .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
          
          console.log('🔍 Debug - Sorted markdown files:', sortedFiles.map((f: any) => `${f.name} (${f.updated_at})`));
          
          for (const file of sortedFiles) {
            console.log('🔍 Debug - Processing file:', file.name, 'updated:', file.updated_at);
            const contentResponse = await fetch(file.download_url, { headers });
            if (contentResponse.ok) {
              const content = await contentResponse.text();
              const article = {
                title: file.name.replace(/\.(md|markdown)$/, ''),
                content: content.substring(0, 200) + '...',
                url: file.html_url,
                updated: file.updated_at,
                size: content.length
              };
              articles.push(article);
              pathInfo.articles.push(article);
              console.log('✅ Added article:', file.name, 'size:', content.length);
            } else {
              console.error('❌ Failed to fetch content for:', file.name, 'status:', contentResponse.status);
              pathInfo.articles.push({
                title: file.name,
                error: `Failed to fetch content: ${contentResponse.status}`
              });
            }
          }
        }
        
        // Continue searching other paths to find more articles
        if (articles.length > 0) {
          console.log('✅ Found articles in path:', path, '- continuing to search other paths');
        }
      } else if (response.status === 404) {
        console.log('⚠️ Path not found:', path);
        pathInfo.error = 'Path not found';
      } else {
        const errorText = await response.text();
        console.error('❌ Error for path', path, ':', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        pathInfo.error = `${response.status}: ${errorText}`;
      }
      
      debugInfo.paths.push(pathInfo);
    }
    
    // Sort all articles by date (most recent first)
    articles.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
    
    debugInfo.totalArticles = articles.length;
    console.log('🔍 Debug - Total articles fetched:', articles.length);
    console.log('🔍 Debug - Articles by date:', articles.map(a => `${a.title} (${a.updated})`));
    return { articles, debugInfo };
  } catch (error) {
    console.error('❌ Error fetching articles:', error);
    return { articles: [], debugInfo: { error: error instanceof Error ? error.message : 'Unknown error' } };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await fetchArticlesFromRepo();
    
    return res.status(200).json({
      success: true,
      totalArticles: result.articles.length,
      articles: result.articles,
      debugInfo: result.debugInfo,
      environment: {
        hasGithubToken: !!process.env.GITHUB_TOKEN,
        githubRepoOwner: process.env.GITHUB_REPO_OWNER,
        githubRepoName: process.env.GITHUB_REPO_NAME,
        hasOpenAIKey: !!process.env.OPENAI_API_KEY
      }
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
        hasOpenAIKey: !!process.env.OPENAI_API_KEY
      }
    });
  }
}
