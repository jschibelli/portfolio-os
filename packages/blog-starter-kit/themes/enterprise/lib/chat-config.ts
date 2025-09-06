/**
 * Chat Configuration
 * 
 * This module centralizes all chat-related configuration including URLs,
 * contact information, and system prompts for better maintainability.
 * 
 * Addresses code review feedback from PR #37 about externalizing common
 * configurations to separate files for easier maintenance and scalability.
 */

import { SITE_CONFIG } from '../config/constants';

// Domain and URL configuration
export const CHAT_CONFIG = {
  // Primary domain configuration
  DOMAIN: 'johnschibelli.dev',
  BASE_URL: 'https://johnschibelli.dev',
  
  // Contact information
  CONTACT: {
    EMAIL: 'jschibelli@gmail.com',
    LINKEDIN: 'https://linkedin.com/in/johnschibelli',
    GITHUB: 'https://github.com/jschibelli',
    WEBSITE: 'https://johnschibelli.dev'
  },
  
  // Professional information
  PROFESSIONAL: {
    NAME: 'John Schibelli',
    TITLE: 'Senior Front-End Developer',
    LOCATION: 'Towaco, NJ',
    COMPANY: 'IntraWeb Technology',
    COMPANY_SINCE: '2020'
  },
  
  // Chat system configuration
  SYSTEM: {
    MODEL: 'gpt-4o-mini',
    MAX_TOKENS: 600,
    TEMPERATURE: 0.7,
    PRESENCE_PENALTY: 0.1,
    FREQUENCY_PENALTY: 0.1,
    MAX_CONVERSATION_HISTORY: 10
  },
  
  // Fallback configuration
  FALLBACK: {
    MAX_ARTICLES: 3,
    MAX_SUGGESTED_ACTIONS: 5,
    RESPONSE_TIMEOUT: 30000 // 30 seconds
  },
  
  // Security configuration
  SECURITY: {
    ALLOWED_ORIGINS: [
      'https://johnschibelli.dev',
      'https://www.johnschibelli.dev',
      'http://localhost:3000',
      'http://localhost:3001'
    ],
    RATE_LIMIT: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 100 // per window
    }
  }
} as const;

// Response templates for common scenarios
export const RESPONSE_TEMPLATES = {
  GREETING: `Hello! I'm John's AI assistant. I can help you learn about his background, schedule a meeting, explore his case studies, or answer questions about his work. How can I assist you today?`,
  
  SCHEDULING_HELP: `I'd be happy to help you schedule a meeting with John! I can show you his available times and book a slot for you. What's your preferred timezone and when would you like to meet?`,
  
  CASE_STUDY_HELP: `I can walk you through John's case studies, including the Tendril Multi-Tenant Chatbot SaaS project. Which aspect would you like to explore - the problem statement, technical architecture, implementation, or results?`,
  
  CONTACT_INFO: `You can reach John directly at ${CHAT_CONFIG.CONTACT.EMAIL} or connect with him on LinkedIn at ${CHAT_CONFIG.CONTACT.LINKEDIN}. His website is ${CHAT_CONFIG.CONTACT.WEBSITE}.`,
  
  ERROR_FALLBACK: `I'm sorry, I'm having trouble processing your request right now. Please try again in a moment, or contact John directly at ${CHAT_CONFIG.CONTACT.EMAIL}.`,
  
  API_ERROR: `I'm sorry, I'm currently unable to process your request. Please try again later or contact John directly at ${CHAT_CONFIG.CONTACT.EMAIL}.`
} as const;

// Suggested actions configuration
export const SUGGESTED_ACTIONS = {
  CONTACT: [
    { 
      label: 'Email John', 
      url: `mailto:${CHAT_CONFIG.CONTACT.EMAIL}`, 
      icon: '📧',
      ariaLabel: 'Send email to John Schibelli'
    },
    { 
      label: 'LinkedIn Profile', 
      url: CHAT_CONFIG.CONTACT.LINKEDIN, 
      icon: '💼',
      ariaLabel: 'View John Schibelli LinkedIn profile'
    },
    { 
      label: 'GitHub Profile', 
      url: CHAT_CONFIG.CONTACT.GITHUB, 
      icon: '🐙',
      ariaLabel: 'View John Schibelli GitHub profile'
    }
  ],
  
  SKILLS: [
    { 
      label: 'View Portfolio', 
      url: '/work', 
      icon: '🎨',
      ariaLabel: 'View John Schibelli portfolio'
    },
    { 
      label: 'Contact for Projects', 
      url: `mailto:${CHAT_CONFIG.CONTACT.EMAIL}`, 
      icon: '💬',
      ariaLabel: 'Contact John for project inquiries'
    }
  ],
  
  EXPERIENCE: [
    { 
      label: 'View Resume', 
      url: '/resume', 
      icon: '📄',
      ariaLabel: 'View John Schibelli resume'
    },
    { 
      label: 'Work History', 
      url: '/work', 
      icon: '💼',
      ariaLabel: 'View John Schibelli work history'
    },
    { 
      label: 'LinkedIn Profile', 
      url: CHAT_CONFIG.CONTACT.LINKEDIN, 
      icon: '🔗',
      ariaLabel: 'View John Schibelli LinkedIn profile'
    }
  ],
  
  PROJECTS: [
    { 
      label: 'View Portfolio', 
      url: '/work', 
      icon: '🎨',
      ariaLabel: 'View John Schibelli portfolio'
    },
    { 
      label: 'Contact for Collaboration', 
      url: `mailto:${CHAT_CONFIG.CONTACT.EMAIL}`, 
      icon: '🤝',
      ariaLabel: 'Contact John for collaboration'
    }
  ],
  
  HIRING: [
    { 
      label: 'Contact John', 
      url: `mailto:${CHAT_CONFIG.CONTACT.EMAIL}`, 
      icon: '💬',
      ariaLabel: 'Contact John for hiring inquiries'
    },
    { 
      label: 'View Portfolio', 
      url: '/work', 
      icon: '🎨',
      ariaLabel: 'View John Schibelli portfolio'
    },
    { 
      label: 'LinkedIn Profile', 
      url: CHAT_CONFIG.CONTACT.LINKEDIN, 
      icon: '💼',
      ariaLabel: 'View John Schibelli LinkedIn profile'
    }
  ],
  
  GENERAL: [
    { 
      label: 'Learn More', 
      url: '/about', 
      icon: 'ℹ️',
      ariaLabel: 'Learn more about John Schibelli'
    },
    { 
      label: 'View Portfolio', 
      url: '/work', 
      icon: '🎨',
      ariaLabel: 'View John Schibelli portfolio'
    },
    { 
      label: 'Contact John', 
      url: `mailto:${CHAT_CONFIG.CONTACT.EMAIL}`, 
      icon: '💬',
      ariaLabel: 'Contact John Schibelli'
    }
  ]
} as const;

// Fallback articles configuration
export const FALLBACK_ARTICLES = [
  {
    title: 'Building Scalable React Applications with TypeScript',
    content: 'Learn how to structure large React applications using TypeScript, proper state management, and performance optimization techniques. This article covers advanced patterns for building maintainable React codebases.',
    category: 'React & TypeScript',
    updated: '2024-01-15',
    url: `${CHAT_CONFIG.BASE_URL}/articles/react-typescript-scalability`,
    slug: 'react-typescript-scalability'
  },
  {
    title: 'The Future of AI-Driven Development',
    content: "Exploring how AI tools are transforming the development workflow and what this means for developers in 2024. We'll look at practical applications and future trends in AI-assisted coding.",
    category: 'AI & Development',
    updated: '2024-01-10',
    url: `${CHAT_CONFIG.BASE_URL}/articles/ai-driven-development`,
    slug: 'ai-driven-development'
  },
  {
    title: 'Optimizing Next.js Performance for Production',
    content: 'Deep dive into Next.js performance optimization strategies, from image optimization to bundle analysis. Learn techniques to make your Next.js applications lightning fast.',
    category: 'Next.js & Performance',
    updated: '2024-01-05',
    url: `${CHAT_CONFIG.BASE_URL}/articles/nextjs-performance-optimization`,
    slug: 'nextjs-performance-optimization'
  }
] as const;

// System prompt templates
export const SYSTEM_PROMPT_TEMPLATES = {
  BASE: `You are John's AI assistant - a knowledgeable, friendly, and professional helper designed to provide information about John Schibelli's background, experience, and expertise. You have a warm, approachable personality while maintaining professionalism.`,
  
  PERSONALITY: `PERSONALITY & COMMUNICATION STYLE:
- Friendly and welcoming, but professional
- Enthusiastic about John's work and achievements
- Helpful and informative without being pushy
- Use conversational language with technical accuracy
- Show genuine interest in helping visitors learn about John
- Be encouraging and supportive
- Use natural transitions and follow-up questions when appropriate`,
  
  CAPABILITIES: `SPECIAL CAPABILITIES:
You have access to several tools that allow you to help users with specific tasks:

1. SCHEDULING: You can help users book meetings with John
   - Use get_availability to find available time slots
   - Use book_meeting to schedule a meeting
   - Use show_calendar_modal to display a calendar interface with available times
   - Always ask for name, email, and preferred timezone when scheduling

2. CASE STUDIES: You are an expert in explaining John's case studies with deep technical knowledge
   - Use get_case_study_chapter to display case study content
   - Available case studies: tendril-multi-tenant-chatbot-saas
   - Sections include: problem-statement, research-analysis, solution-design, implementation, results-metrics, lessons-learned, next-steps
   - You can explain technical architecture, business decisions, implementation challenges, and results
   - Speak with authority about the technical details, as if you were part of the development team
   - Use phrases like "We built this using...", "The architecture we chose...", "One of the key challenges we faced..."
   - Explain complex technical concepts in accessible terms while maintaining technical accuracy
   - Connect technical decisions to business outcomes and user value

3. CLIENT INTAKE: You can help collect project inquiries
   - Use submit_client_intake to gather project details
   - Collect name, email, company, role, project description, budget, timeline
   - Be thorough but conversational in gathering information

When users express interest in these capabilities, offer to help them and use the appropriate tools. Keep responses concise and actionable.`,
  
  KEY_INFO: `KEY INFORMATION ABOUT JOHN:
- Name: ${CHAT_CONFIG.PROFESSIONAL.NAME}
- Title: ${CHAT_CONFIG.PROFESSIONAL.TITLE}
- Location: ${CHAT_CONFIG.PROFESSIONAL.LOCATION}
- Email: ${CHAT_CONFIG.CONTACT.EMAIL}
- Website: ${CHAT_CONFIG.CONTACT.WEBSITE}
- LinkedIn: ${CHAT_CONFIG.CONTACT.LINKEDIN}
- GitHub: ${CHAT_CONFIG.CONTACT.GITHUB}`
} as const;

// Utility functions for configuration
export const getSuggestedActions = (intent: string, articles: any[] = []) => {
  const baseActions = SUGGESTED_ACTIONS[intent as keyof typeof SUGGESTED_ACTIONS] || SUGGESTED_ACTIONS.GENERAL;
  
  // Add blog articles for blog-specific intents
  if (intent === 'blog' && articles.length > 0) {
    const recentArticles = articles.slice(0, 2);
    const articleActions = recentArticles.map((article) => ({
      label: `Read: ${article.title}`,
      url: article.url,
      icon: '📝',
      ariaLabel: `Read article: ${article.title}`
    }));
    return [...articleActions, ...baseActions];
  }
  
  return baseActions;
};

export const getFallbackResponse = (intent: string) => {
  const fallbackResponses = {
    scheduling: RESPONSE_TEMPLATES.SCHEDULING_HELP,
    case_study: RESPONSE_TEMPLATES.CASE_STUDY_HELP,
    contact: RESPONSE_TEMPLATES.CONTACT_INFO,
    general: RESPONSE_TEMPLATES.GREETING
  };
  
  return fallbackResponses[intent as keyof typeof fallbackResponses] || RESPONSE_TEMPLATES.GREETING;
};

export const validateOrigin = (origin: string): boolean => {
  return CHAT_CONFIG.SECURITY.ALLOWED_ORIGINS.includes(origin);
};

export const getRateLimitConfig = () => {
  return CHAT_CONFIG.SECURITY.RATE_LIMIT;
};

// Export default configuration
export default CHAT_CONFIG;
