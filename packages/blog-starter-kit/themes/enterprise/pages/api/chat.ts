import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import resumeData from '../../data/resume.json';

// Fallback articles if GitHub is not available
const fallbackArticles = [
  {
    title: "Building Scalable React Applications with TypeScript",
    content: "Learn how to structure large React applications using TypeScript, proper state management, and performance optimization techniques. This article covers advanced patterns for building maintainable React codebases.",
    updated: "2024-01-15",
    url: "https://example.com/fallback-1"
  },
  {
    title: "The Future of AI-Driven Development",
    content: "Exploring how AI tools are transforming the development workflow and what this means for developers in 2024. We'll look at practical applications and future trends in AI-assisted coding.",
    updated: "2024-01-10",
    url: "https://example.com/fallback-2"
  },
  {
    title: "Optimizing Next.js Performance for Production",
    content: "Deep dive into Next.js performance optimization strategies, from image optimization to bundle analysis. Learn techniques to make your Next.js applications lightning fast.",
    updated: "2024-01-05",
    url: "https://example.com/fallback-3"
  }
];

// Function to fetch articles from GitHub repository
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
    
    for (const path of possiblePaths) {
      const apiUrl = path 
        ? `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`
        : `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;
      
      console.log('🔍 Debug - Trying path:', path, 'URL:', apiUrl);
      
      const response = await fetch(apiUrl, { headers });
      console.log('🔍 Debug - Response Status for', path, ':', response.status);
      
      if (response.ok) {
        const files = await response.json();
        console.log('🔍 Debug - Found files in', path, ':', files.length);
        console.log('🔍 Debug - File names:', files.map((f: any) => f.name));
        
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
               
               // Try to extract date from content if GitHub date is undefined
               let articleDate = file.updated_at;
               if (!articleDate) {
                 // Look for date in markdown frontmatter
                 const dateMatch = content.match(/datePublished:\s*(.+)/);
                 if (dateMatch) {
                   articleDate = new Date(dateMatch[1]).toISOString();
                 } else {
                   // Use current date as fallback
                   articleDate = new Date().toISOString();
                 }
               }
               
                               // Try to extract actual title from content
                let articleTitle = file.name.replace(/\.(md|markdown)$/, '');
                const titleMatch = content.match(/title:\s*"([^"]+)"/);
                if (titleMatch) {
                  articleTitle = titleMatch[1];
                }
                
                articles.push({
                  title: articleTitle,
                  content: content,
                  url: file.html_url,
                  updated: articleDate
                });
               console.log('✅ Added article:', file.name, 'size:', content.length, 'date:', articleDate);
             } else {
               console.error('❌ Failed to fetch content for:', file.name, 'status:', contentResponse.status);
             }
           }
        }
        
        // Continue searching other paths to find more articles
        if (articles.length > 0) {
          console.log('✅ Found articles in path:', path, '- continuing to search other paths');
        }
      } else if (response.status === 404) {
        console.log('⚠️ Path not found:', path);
        continue;
      } else {
        const errorText = await response.text();
        console.error('❌ Error for path', path, ':', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
      }
    }
    
    // Sort all articles by date (most recent first)
    articles.sort((a, b) => {
      const dateA = a.updated ? new Date(a.updated).getTime() : 0;
      const dateB = b.updated ? new Date(b.updated).getTime() : 0;
      return dateB - dateA;
    });
    
    console.log('🔍 Debug - Total articles fetched:', articles.length);
    console.log('🔍 Debug - Articles by date:', articles.map(a => `${a.title} (${a.updated || 'no date'})`));
    return articles;
  } catch (error) {
    console.error('❌ Error fetching articles:', error);
    return [];
  }
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt that provides context about John's background
const systemPrompt = `You are an AI assistant for John Schibelli, a Senior Front-End Developer with 15+ years of experience. You help answer questions about John's professional background, experience, and blog content. You are NOT John himself - you are his AI assistant.

Key Information about John:
- Name: John Schibelli
- Title: Senior Front-End Developer
- Location: Towaco, NJ
- Email: jschibelli@gmail.com
- Website: https://schibelli.dev
- LinkedIn: https://linkedin.com/in/johnschibelli
- GitHub: https://github.com/jschibelli

Professional Summary: ${resumeData.basics.summary}

Current Role: Senior Front-End Developer at IntraWeb Technology (since 2020)
- Lead front-end development for company site and client projects
- Incubated SynaplyAI (AI-driven content collaboration tool)
- Built accessible, SEO-optimized websites with Next.js, React, TypeScript, and Tailwind CSS

Key Skills: ${resumeData.skills.map(skill => `${skill.name}: ${skill.keywords.join(', ')}`).join('; ')}

Work Experience: ${resumeData.work.map(job => `${job.position} at ${job.name} (${job.startDate}${job.endDate ? ` - ${job.endDate}` : ' - Present'})`).join('; ')}

Education: ${resumeData.education.map(edu => `${edu.studyType} in ${edu.area} from ${edu.institution}`).join('; ')}

Blog Content and Writing:
John regularly writes blog articles about web development, technology trends, and his professional experiences. His blog covers topics like:
- React and Next.js development
- TypeScript best practices
- Front-end architecture and design patterns
- Performance optimization
- Accessibility and SEO
- Modern web development tools and workflows
- Professional development and career insights

Instructions:
1. Answer questions based on John's resume, work experience, and blog content
2. Be conversational but professional
3. If asked about something not in John's background or blog content, politely redirect to what you do know
4. Always speak as John's AI assistant, NOT as John himself
5. Use phrases like "John worked at..." or "John's experience includes..." or "John has..." or "John writes about..."
6. Never say "I worked at..." or "I have..." or "I write..." - you are not John
7. Provide specific examples from John's work experience and blog topics when relevant
8. Keep responses concise but informative
9. If asked about contact information, provide the details from the resume
10. If asked about skills or technologies, reference the specific skills listed in the resume
11. If asked about John's writing or blog topics, mention his expertise in web development, React, Next.js, TypeScript, and related technologies
12. Encourage visitors to check out John's blog for more detailed insights on specific topics`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OpenAI API key not configured',
        fallback: "I'm sorry, but I'm currently unable to process your request. Please try again later or contact John directly at jschibelli@gmail.com."
      });
    }

    // Fetch articles from GitHub repository
    let articles = await fetchArticlesFromRepo();
    
    console.log('🔍 Debug - Articles fetched from GitHub:', articles.length);
    console.log('🔍 Debug - Article titles:', articles.map(a => a.title));
    console.log('🔍 Debug - Article dates:', articles.map(a => a.updated));
    
    // Use fallback articles if GitHub fetch fails
    if (articles.length === 0) {
      console.log('🔍 Debug - No GitHub articles found, using fallback articles');
      articles = fallbackArticles;
    } else {
      console.log('🔍 Debug - Using GitHub articles, not fallbacks');
    }
    
    const articlesContext = articles.length > 0 
      ? `\n\nRecent Blog Articles (${articles.length} total):\n${articles.map(article => 
          `- "${article.title}" (${article.updated}): ${article.content.substring(0, 300)}...`
        ).join('\n\n')}`
      : '';

    console.log('🔍 Debug - Articles context length:', articlesContext.length);
    console.log('🔍 Debug - Number of articles in context:', articles.length);
    console.log('🔍 Debug - Articles context preview:', articlesContext.substring(0, 500));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt + articlesContext,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at this time.";

    return res.status(200).json({ response });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback response if OpenAI API fails
    const fallbackResponse = "I'm sorry, but I'm currently experiencing technical difficulties. Please feel free to contact John directly at jschibelli@gmail.com or visit his LinkedIn profile at https://linkedin.com/in/johnschibelli for more information.";
    
    return res.status(500).json({
      error: 'Failed to process request',
      fallback: fallbackResponse
    });
  }
}
