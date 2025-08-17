import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import resumeData from '../../data/resume.json';

// Enhanced fallback articles with better categorization
const fallbackArticles = [
  {
    title: "Building Scalable React Applications with TypeScript",
    content: "Learn how to structure large React applications using TypeScript, proper state management, and performance optimization techniques. This article covers advanced patterns for building maintainable React codebases.",
    category: "React & TypeScript",
    updated: "2024-01-15",
    url: "https://example.com/fallback-1"
  },
  {
    title: "The Future of AI-Driven Development",
    content: "Exploring how AI tools are transforming the development workflow and what this means for developers in 2024. We'll look at practical applications and future trends in AI-assisted coding.",
    category: "AI & Development",
    updated: "2024-01-10",
    url: "https://example.com/fallback-2"
  },
  {
    title: "Optimizing Next.js Performance for Production",
    content: "Deep dive into Next.js performance optimization strategies, from image optimization to bundle analysis. Learn techniques to make your Next.js applications lightning fast.",
    category: "Next.js & Performance",
    updated: "2024-01-05",
    url: "https://example.com/fallback-3"
  }
];

// Response templates for common questions
const responseTemplates = {
  contact: {
    title: "Contact Information",
    content: "Here's how you can reach John:",
    actions: [
      { label: "Email", url: "mailto:jschibelli@gmail.com", icon: "📧" },
      { label: "LinkedIn", url: "https://linkedin.com/in/johnschibelli", icon: "💼" },
      { label: "GitHub", url: "https://github.com/jschibelli", icon: "🐙" },
      { label: "Website", url: "https://schibelli.dev", icon: "🌐" }
    ]
  },
  skills: {
    title: "Technical Skills",
    content: "John specializes in modern front-end development with expertise in:",
    categories: [
      "Frontend: React, Next.js, TypeScript, Tailwind CSS",
      "Backend: Node.js, WordPress, Shopify",
      "Tools: Git, Playwright, Veeva CRM",
      "AI: OpenAI integrations, AI-driven development"
    ]
  },
  experience: {
    title: "Professional Experience",
    content: "John has 15+ years of experience in web development:",
    highlights: [
      "Senior Front-End Developer at IntraWeb Technology (2020-Present)",
      "Full-Stack Developer at ColorStreet (2024)",
      "Senior Front-End Developer at Executive Five Star (2016-2020)",
      "Front-End Developer at Robert Half Technology (2013-2016)"
    ]
  }
};

// User intent detection patterns
const intentPatterns = {
  contact: /contact|email|reach|phone|linkedin|github|website/i,
  skills: /skills|technologies|tech stack|programming|coding|languages/i,
  experience: /experience|work|job|career|background|history/i,
  projects: /projects|portfolio|work|synaplyai|intraweb/i,
  blog: /blog|articles|writing|posts|content/i,
  hiring: /hire|job|position|opportunity|available|freelance/i,
  technical: /react|nextjs|typescript|javascript|frontend|development/i
};

// Function to detect user intent
function detectUserIntent(message: string): string {
  for (const [intent, pattern] of Object.entries(intentPatterns)) {
    if (pattern.test(message)) {
      return intent;
    }
  }
  return 'general';
}

// Function to categorize articles
function categorizeArticles(articles: any[]) {
  const categories: { [key: string]: any[] } = {
    'React & TypeScript': [],
    'Next.js & Performance': [],
    'AI & Development': [],
    'Career & Professional': [],
    'General Web Development': []
  };

  articles.forEach(article => {
    const title = article.title.toLowerCase();
    const content = article.content.toLowerCase();
    
    if (title.includes('react') || title.includes('typescript') || content.includes('react') || content.includes('typescript')) {
      categories['React & TypeScript'].push(article);
    } else if (title.includes('next') || title.includes('performance') || content.includes('next') || content.includes('performance')) {
      categories['Next.js & Performance'].push(article);
    } else if (title.includes('ai') || title.includes('artificial intelligence') || content.includes('ai')) {
      categories['AI & Development'].push(article);
    } else if (title.includes('career') || title.includes('professional') || content.includes('career')) {
      categories['Career & Professional'].push(article);
    } else {
      categories['General Web Development'].push(article);
    }
  });

  return categories;
}

// Function to clean markdown content
function cleanMarkdownContent(content: string): string {
  return content
    // Remove markdown headers (# ## ### etc.)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markdown (**text** or *text*)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Remove code blocks (```code```)
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code (`code`)
    .replace(/`([^`]+)`/g, '$1')
    // Remove links [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove horizontal rules (---)
    .replace(/^---$/gm, '')
    // Remove list markers (- * +)
    .replace(/^[\s]*[-*+]\s+/gm, '')
    // Remove numbered list markers (1. 2. etc.)
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove blockquotes (>)
    .replace(/^>\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

// Function to extract clean title from markdown content
function extractCleanTitle(content: string, filename: string): string {
  // First try to extract from frontmatter
  const frontmatterTitleMatch = content.match(/title:\s*"([^"]+)"/);
  if (frontmatterTitleMatch) {
    return cleanMarkdownContent(frontmatterTitleMatch[1]);
  }
  
  // Try to extract from first heading
  const headingMatch = content.match(/^#{1,6}\s+(.+)$/m);
  if (headingMatch) {
    return cleanMarkdownContent(headingMatch[1]);
  }
  
  // Fallback to filename (cleaned)
  const cleanFilename = filename
    .replace(/\.(md|markdown)$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  return cleanFilename;
}

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
              let articleTitle = extractCleanTitle(content, file.name);
              
              // Clean the content for better processing
              const cleanContent = cleanMarkdownContent(content);
              
              articles.push({
                title: articleTitle,
                content: cleanContent,
                url: file.html_url,
                updated: articleDate,
                category: 'General Web Development' // Default category
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
    
    // Categorize articles
    const categorizedArticles = categorizeArticles(articles);
    articles.forEach(article => {
      // Assign category based on content analysis
      const title = article.title.toLowerCase();
      const content = article.content.toLowerCase();
      
      if (title.includes('react') || title.includes('typescript') || content.includes('react') || content.includes('typescript')) {
        article.category = 'React & TypeScript';
      } else if (title.includes('next') || title.includes('performance') || content.includes('next') || content.includes('performance')) {
        article.category = 'Next.js & Performance';
      } else if (title.includes('ai') || title.includes('artificial intelligence') || content.includes('ai')) {
        article.category = 'AI & Development';
      } else if (title.includes('career') || title.includes('professional') || content.includes('career')) {
        article.category = 'Career & Professional';
      } else {
        article.category = 'General Web Development';
      }
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

// Enhanced system prompt with better personality and context
const createSystemPrompt = (articles: any[], conversationHistory: any[] = []) => {
  const categorizedArticles = categorizeArticles(articles);
  const recentArticles = articles.slice(0, 5); // Get 5 most recent articles
  
  const articlesContext = articles.length > 0 
    ? `\n\nRECENT BLOG ARTICLES (${articles.length} total):\n${recentArticles.map(article => 
        `- "${article.title}" (${article.category}, ${article.updated}): ${article.content.substring(0, 200)}...`
      ).join('\n\n')}`
    : '';

  const conversationContext = conversationHistory.length > 0
    ? `\n\nCONVERSATION HISTORY (last ${Math.min(3, conversationHistory.length)} exchanges):\n${conversationHistory.slice(-3).map(exchange => 
        `User: ${exchange.user}\nAssistant: ${exchange.assistant}`
      ).join('\n\n')}`
    : '';

  return `You are John's AI assistant - a knowledgeable, friendly, and professional helper designed to provide information about John Schibelli's background, experience, and expertise. You have a warm, approachable personality while maintaining professionalism.

PERSONALITY & COMMUNICATION STYLE:
- Friendly and welcoming, but professional
- Enthusiastic about John's work and achievements
- Helpful and informative without being pushy
- Use conversational language with technical accuracy
- Show genuine interest in helping visitors learn about John
- Be encouraging and supportive
- Use natural transitions and follow-up questions when appropriate

KEY INFORMATION ABOUT JOHN:
- Name: John Schibelli
- Title: Senior Front-End Developer
- Location: Towaco, NJ
- Email: jschibelli@gmail.com
- Website: https://schibelli.dev
- LinkedIn: https://linkedin.com/in/johnschibelli
- GitHub: https://github.com/jschibelli

PROFESSIONAL SUMMARY: ${resumeData.basics.summary}

CURRENT ROLE - Senior Front-End Developer at IntraWeb Technology (since 2020):
- Lead front-end development for company site and client projects
- Incubated SynaplyAI (AI-driven content collaboration tool)
- Built accessible, SEO-optimized websites with Next.js, React, TypeScript, and Tailwind CSS
- Technical lead behind IntraWeb Technologies' digital presence

KEY SKILLS & EXPERTISE: ${resumeData.skills.map(skill => `${skill.name}: ${skill.keywords.join(', ')}`).join('; ')}

WORK EXPERIENCE: ${resumeData.work.map(job => `${job.position} at ${job.name} (${job.startDate}${job.endDate ? ` - ${job.endDate}` : ' - Present'})`).join('; ')}

EDUCATION: ${resumeData.education.map(edu => `${edu.studyType} in ${edu.area} from ${edu.institution}`).join('; ')}

BLOG CONTENT & WRITING:
John regularly writes insightful blog articles about web development, technology trends, and his professional experiences. His blog covers:
- React and Next.js development best practices
- TypeScript implementation and optimization
- Front-end architecture and design patterns
- Performance optimization techniques
- Accessibility and SEO strategies
- Modern web development tools and workflows
- Professional development and career insights
- AI integration and modern development practices

CONVERSATION GUIDELINES:
1. Always speak as John's AI assistant, NOT as John himself
2. Use phrases like "John worked at...", "John's experience includes...", "John has...", "John writes about..."
3. Never say "I worked at...", "I have...", "I write..." - you are not John
4. Be conversational but professional and informative
5. Provide specific examples from John's work experience when relevant
6. Keep responses concise but comprehensive
7. If asked about something outside John's expertise, politely redirect to what you do know
8. Encourage visitors to check out John's blog for detailed insights
9. Be enthusiastic about John's achievements and expertise
10. Offer to help with specific questions about John's background or work
11. Use the conversation history to provide context-aware responses
12. Ask follow-up questions when appropriate to better understand user needs
13. CRITICAL: NEVER use markdown formatting in your responses - no asterisks (*), underscores (_), backticks (\`), or any other markdown symbols
14. When mentioning article titles, use plain text only - no formatting, no quotes, no special characters
15. Present all information in clean, natural language without any technical formatting
16. If you see markdown symbols in the article content provided to you, ignore them and present the information in plain text

SPECIAL CAPABILITIES:
- Answer questions about John's professional background and experience
- Provide insights about his technical skills and expertise
- Share information about his blog content and writing topics
- Offer contact information and professional links
- Discuss his work on SynaplyAI and other projects
- Provide career and technology insights based on John's experience
- Detect user intent and tailor responses accordingly
- Provide categorized information based on user interests${articlesContext}${conversationContext}`;
};

// Enhanced error handling with fallback responses
const getFallbackResponse = (intent: string, error: any) => {
  console.error('Chat API error:', error);
  
  const fallbackResponses = {
    contact: "I'd be happy to share John's contact information! You can reach him at jschibelli@gmail.com, connect on LinkedIn at https://linkedin.com/in/johnschibelli, or check out his GitHub at https://github.com/jschibelli.",
    skills: "John has extensive experience with React, Next.js, TypeScript, and Tailwind CSS. He's also skilled in WordPress, Shopify, and AI integrations. Would you like to know more about any specific technology?",
    experience: "John has over 15 years of experience in web development, currently working as Senior Front-End Developer at IntraWeb Technology. He's worked on projects ranging from e-commerce platforms to AI-driven tools like SynaplyAI.",
    general: "I'm experiencing some technical difficulties right now, but I'd be happy to help you learn about John's background! You can also contact him directly at jschibelli@gmail.com or visit his LinkedIn profile for more information."
  };
  
  return fallbackResponses[intent as keyof typeof fallbackResponses] || fallbackResponses.general;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory = [] } = req.body;

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

    // Detect user intent
    const userIntent = detectUserIntent(message);
    console.log('🎯 Detected user intent:', userIntent);

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

    // Create enhanced system prompt with conversation history
    const systemPrompt = createSystemPrompt(articles, conversationHistory);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 600, // Increased for more detailed responses
      temperature: 0.7,
      presence_penalty: 0.1, // Slightly encourage new topics
      frequency_penalty: 0.1, // Slightly reduce repetition
    });

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at this time.";

    // Enhanced response with metadata
    const enhancedResponse = {
      response,
      intent: userIntent,
      suggestedActions: getSuggestedActions(userIntent),
      conversationId: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(enhancedResponse);

  } catch (error) {
    const userIntent = detectUserIntent(req.body?.message || '');
    const fallbackResponse = getFallbackResponse(userIntent, error);
    
    return res.status(500).json({
      error: 'Failed to process request',
      fallback: fallbackResponse,
      intent: userIntent
    });
  }
}

// Function to get suggested actions based on user intent
function getSuggestedActions(intent: string) {
  const actions = {
    contact: [
      { label: "Email John", url: "mailto:jschibelli@gmail.com", icon: "📧" },
      { label: "LinkedIn Profile", url: "https://linkedin.com/in/johnschibelli", icon: "💼" },
      { label: "GitHub Profile", url: "https://github.com/jschibelli", icon: "🐙" }
    ],
    skills: [
      { label: "View Portfolio", url: "/work", icon: "🎨" },
      { label: "Read Blog", url: "/blog", icon: "📝" },
      { label: "Contact for Projects", url: "mailto:jschibelli@gmail.com", icon: "💬" }
    ],
    experience: [
      { label: "View Resume", url: "/resume", icon: "📄" },
      { label: "Work History", url: "/work", icon: "💼" },
      { label: "LinkedIn Profile", url: "https://linkedin.com/in/johnschibelli", icon: "🔗" }
    ],
    projects: [
      { label: "View Portfolio", url: "/work", icon: "🎨" },
      { label: "SynaplyAI Project", url: "/work/synaplyai", icon: "🤖" },
      { label: "Contact for Collaboration", url: "mailto:jschibelli@gmail.com", icon: "🤝" }
    ],
    blog: [
      { label: "Read Blog", url: "/blog", icon: "📝" },
      { label: "Latest Articles", url: "/blog", icon: "📰" },
      { label: "Subscribe to Updates", url: "/newsletter", icon: "📧" }
    ],
    hiring: [
      { label: "Contact John", url: "mailto:jschibelli@gmail.com", icon: "💬" },
      { label: "View Portfolio", url: "/work", icon: "🎨" },
      { label: "LinkedIn Profile", url: "https://linkedin.com/in/johnschibelli", icon: "💼" }
    ],
    general: [
      { label: "Learn More", url: "/about", icon: "ℹ️" },
      { label: "View Portfolio", url: "/work", icon: "🎨" },
      { label: "Contact John", url: "mailto:jschibelli@gmail.com", icon: "💬" }
    ]
  };

  return actions[intent as keyof typeof actions] || actions.general;
}
