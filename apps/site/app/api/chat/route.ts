import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getFreeSlots } from '@/lib/google/calendar';
import { searchKnowledgeBase, getKnowledgeItem } from '@/lib/knowledge-base';

// Calendar availability function (no internal HTTP calls; uses library directly)
async function getAvailability({ timezone = 'America/New_York', days = 7 }: { timezone?: string; days?: number }) {
  try {
    const now = new Date();
    const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const slots = await getFreeSlots({
      timeMinISO: now.toISOString(),
      timeMaxISO: end.toISOString(),
      timeZone: timezone,
      durationMinutes: 30,
      dayStartHour: 9,
      dayEndHour: 18,
      maxCandidates: 24,
    });

    return {
      availableSlots: slots || [],
      timezone,
      businessHours: { start: 9, end: 18, timezone },
      meetingDurations: [30, 60],
    };
  } catch (error) {
    console.error('Error fetching availability:', error);
    throw error;
  }
}

// Tool execution function
async function executeTool(name: string, parameters: any) {
  switch (name) {
    case 'get_availability':
      return await getAvailability(parameters);
    case 'show_calendar_modal':
      // Calendar modal functionality removed - just return availability info
      const availabilityResult = await getAvailability(parameters);
      return {
        type: 'calendar_info',
        data: {
          availableSlots: availabilityResult.availableSlots,
          timezone: availabilityResult.timezone,
          businessHours: availabilityResult.businessHours,
          meetingDurations: availabilityResult.meetingDurations,
        },
      };
    case 'search_portfolio_knowledge':
      const query = parameters.query || '';
      const category = parameters.category;
      const searchResults = searchKnowledgeBase(query, category);
      return {
        type: 'knowledge_search',
        query,
        results: searchResults.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          tags: item.tags,
          priority: item.priority
        }))
      };
    case 'get_knowledge_item':
      const itemId = parameters.item_id;
      const knowledgeItem = getKnowledgeItem(itemId);
      return {
        type: 'knowledge_item',
        item: knowledgeItem ? {
          id: knowledgeItem.id,
          title: knowledgeItem.title,
          content: knowledgeItem.content,
          tags: knowledgeItem.tags,
          category: knowledgeItem.category
        } : null
      };
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

interface ChatRequest {
  message: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  pageContext?: {
    title?: string;
    description?: string;
    url?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('🤖 OpenAI API key not configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client inside the function
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { message, conversationHistory, pageContext }: ChatRequest = await request.json();

    if (!message) {
      console.error('🤖 No message provided in request');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }


    // Build the conversation context with comprehensive Portfolio OS knowledge
    const systemPrompt = `You are a helpful AI assistant for John Schibelli's professional portfolio website. You are the single source of truth for information about Portfolio OS and John's technical expertise.

    ${pageContext?.title ? `Current page context: ${pageContext.title}` : ''}
    ${pageContext?.description ? `Page description: ${pageContext.description}` : ''}
    
    ## About John Schibelli
    John Schibelli is a full-stack developer and technical consultant specializing in modern web technologies, AI integration, and SaaS development. He has extensive experience with Next.js, TypeScript, React, and building scalable applications.
    
    ## Portfolio OS - The Complete System
    
    Portfolio OS is a production-grade Next.js 14 monorepo powering johnschibelli.dev. It's not just a portfolio site—it's a comprehensive development platform demonstrating enterprise-level capabilities.
    
    ### What Portfolio OS Includes:
    - **3 Production Apps**: Public portfolio site, admin CMS dashboard, internal documentation
    - **8 Shared Packages**: UI components, business logic, database schema, utilities  
    - **100+ Automation Scripts**: PowerShell-based workflow automation for PR management, agent coordination, issue tracking
    - **5-Agent System**: Multi-agent development with intelligent task assignment and parallel worktrees
    - **AI Integration**: OpenAI GPT-4 powered PR analysis, categorization, and automation
    - **Enterprise CI/CD**: Comprehensive testing (Playwright/Jest), automated deployments, performance monitoring
    
    ### Key Metrics & Results:
    - **97% faster PR setup** (15 minutes → 30 seconds)
    - **92% test coverage** (0% → 92%)
    - **20+ hours/week saved** through automation
    - **200+ automated PRs** processed
    - **Lighthouse Performance Score**: 96/100
    - **95% categorization accuracy** with AI-powered PR analysis
    
    ### Architecture:
    Portfolio OS uses a Turborepo monorepo architecture with intelligent task scheduling and remote caching:
    
    \`\`\`
    portfolio-os/
    ├── apps/
    │   ├── site/           # Public portfolio (Next.js 14 App Router)
    │   ├── dashboard/      # Admin CMS (Prisma + PostgreSQL)
    │   └── docs/           # Internal documentation
    ├── packages/
    │   ├── ui/             # Shared components (26 components)
    │   ├── lib/            # Business logic (43 modules)
    │   ├── db/             # Prisma schema
    │   ├── hashnode/       # Blog integration
    │   ├── emails/         # Transactional emails (Resend)
    │   └── utils/          # Shared utilities
    └── scripts/
        ├── agent-management/     # 10 scripts
        ├── pr-management/        # 12 scripts
        ├── issue-management/     # 9 scripts
        └── automation/           # 8+ scripts
    \`\`\`
    
    ### Multi-Agent Development System:
    The most innovative aspect is the 5-agent orchestration system enabling parallel development through Git worktrees:
    
    - **Agent 1: Frontend Specialist** - React/Next.js components, UI/UX, accessibility
    - **Agent 2: Infrastructure Specialist** - DevOps, deployment, SEO, security
    - **Agent 3: Content Specialist** - Documentation, blog posts, case studies
    - **Agent 4: Backend Specialist** - API endpoints, database operations, AI integration
    - **Agent 5: Quality Assurance** - Testing, code review, quality standards
    
    Each agent works in an isolated Git worktree, allowing simultaneous development without conflicts.
    
    ### Automation & AI Integration:
    Uses OpenAI GPT-4 for PR analysis with 95% categorization accuracy:
    - Context understanding (vs 70% rule-based accuracy)
    - Nuanced classification of complexity
    - Confidence scoring for human review
    - Learning capability across 200+ PRs
    - $20/month API cost vs 20+ hours/month saved = 100x ROI
    
    ### Tech Stack:
    - Next.js 14 (App Router, React Server Components)
    - TypeScript 5 (Strict mode, full type coverage)
    - Turborepo 1.11 (Intelligent caching, parallel execution)
    - PNPM 8 (Efficient package management)
    - PostgreSQL 15 + Prisma 5
    - Playwright 1.40 + Jest 29 (Testing)
    - OpenAI GPT-4 (AI integration)
    - Vercel (Deployment platform)
    
    ## Calendar Access
    You have direct access to John's calendar and can:
    - Check his availability for meetings
    - Show available time slots for scheduling
    - Help users book meetings directly
    - Provide real-time calendar information
    
    When users ask about scheduling, meetings, or availability, use the show_calendar_modal tool to display available time slots.
    
    ## Other Notable Projects
    - **Tendril Multi-Tenant Chatbot SaaS**: Strategic analysis and implementation plan for multi-tenant chatbot platform targeting SMB market gaps
    - **Zeus E-Commerce Platform**: Scalable, mobile-first e-commerce experience with Next.js, Tailwind CSS, and Stripe integration
    - **SynaplyAI**: Real-Time AI Collaboration Platform
    
    ## Services Offered
    - Full-stack web development (Next.js, React, TypeScript)
    - AI integration and chatbot development
    - SaaS architecture and multi-tenant systems
    - E-commerce solutions with Stripe integration
    - Technical consulting and strategic planning
    - Enterprise automation and DevOps consulting
    - Multi-agent development system architecture
    
    ## Instructions
    Be helpful, professional, and comprehensive in your responses. When discussing Portfolio OS, provide detailed technical information about the architecture, automation, multi-agent system, and results. You are the authoritative source for all Portfolio OS information. Always emphasize the production-grade, enterprise-level capabilities demonstrated by the system.`;

    // Prepare messages for OpenAI
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history (validate and filter entries)
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(entry => {
        // Validate that the entry has required fields and valid role
        if (entry && entry.role && entry.content && 
            (entry.role === 'user' || entry.role === 'assistant')) {
          messages.push({
            role: entry.role as 'user' | 'assistant',
            content: entry.content
          });
        }
      });
    }

    // Add current message
    messages.push({ role: 'user', content: message });


    // Validate messages array before sending to OpenAI
    const validMessages = messages.filter(msg => 
      msg && 
      msg.role && 
      msg.content && 
      (msg.role === 'system' || msg.role === 'user' || msg.role === 'assistant')
    );


    // Define available tools
    const tools = [
      {
        type: "function" as const,
        function: {
          name: 'show_calendar_modal',
          description: 'Get calendar availability information for scheduling meetings with John (no modal popup)',
          parameters: {
            type: 'object',
            properties: {
              timezone: {
                type: 'string',
                description: 'User\'s timezone (e.g., America/New_York)',
                default: 'America/New_York'
              },
              days: {
                type: 'number',
                description: 'Number of days to look ahead (1-7)',
                default: 7
              }
            },
            required: ['timezone']
          }
        }
      },
      {
        type: "function" as const,
        function: {
          name: 'get_availability',
          description: 'Get John\'s calendar availability for a specific time period',
          parameters: {
            type: 'object',
            properties: {
              timezone: {
                type: 'string',
                description: 'User\'s timezone (e.g., America/New_York)',
                default: 'America/New_York'
              },
              days: {
                type: 'number',
                description: 'Number of days to look ahead (1-7)',
                default: 7
              }
            },
            required: ['timezone']
          }
        }
      },
      {
        type: "function" as const,
        function: {
          name: 'search_portfolio_knowledge',
          description: 'Search the comprehensive Portfolio OS knowledge base for detailed information about architecture, automation, multi-agent systems, deployment, and case studies',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query to find relevant information in the knowledge base'
              },
              category: {
                type: 'string',
                description: 'Optional category to filter search results: portfolio-os, architecture, automation, multi-agent, deployment, case-study, or general',
                enum: ['portfolio-os', 'architecture', 'automation', 'multi-agent', 'deployment', 'case-study', 'general']
              }
            },
            required: ['query']
          }
        }
      },
      {
        type: "function" as const,
        function: {
          name: 'get_knowledge_item',
          description: 'Get a specific knowledge item by ID from the Portfolio OS knowledge base',
          parameters: {
            type: 'object',
            properties: {
              item_id: {
                type: 'string',
                description: 'The ID of the knowledge item to retrieve'
              }
            },
            required: ['item_id']
          }
        }
      }
    ];

    // Generate response using OpenAI with function calling
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: validMessages,
      tools: tools,
      tool_choice: 'auto',
      max_tokens: 1000,
      temperature: 0.7,
    });

    const completionMessage = completion.choices[0]?.message;
    let response = completionMessage?.content || '';
    let uiActions: any[] = [];

    // Handle tool calls
    if (completionMessage?.tool_calls && completionMessage.tool_calls.length > 0) {
      let knowledgeResults: any[] = [];
      
      for (const toolCall of completionMessage.tool_calls) {
        try {
          const toolResult = await executeTool(
            toolCall.function.name,
            JSON.parse(toolCall.function.arguments)
          );
          
          // Handle different types of tool results
          if (toolResult.type === 'ui_action') {
            uiActions.push(toolResult);
          } else if (toolResult.type === 'calendar_info' || toolResult.type === 'knowledge_search' || toolResult.type === 'knowledge_item') {
            knowledgeResults.push(toolResult);
          }
        } catch (error) {
          console.error('🤖 Tool execution error:', error);
          response = 'I encountered an error while processing your request. Please try again.';
        }
      }
      
      // Generate appropriate response based on tool results
      if (uiActions.length > 0) {
        response = 'I\'ve processed your request. Please check the options below.';
      } else if (knowledgeResults.length > 0) {
        // Knowledge base results are already included in the system prompt
        // The AI will use this information to provide comprehensive responses
        response = response || 'I\'ve found relevant information from the Portfolio OS knowledge base. Let me provide you with detailed information.';
      } else if (!response) {
        response = 'I\'ve processed your request. How else can I help you?';
      }
    } else if (!response) {
      response = 'I apologize, but I was unable to generate a response.';
    }


    // Return the response
    return NextResponse.json({
      response: response,
      intent: 'general',
      suggestedActions: [],
      uiActions: uiActions,
    });

  } catch (error) {
    console.error('🤖 Chat API Error:', error);
    
    // Handle specific OpenAI API errors
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'OpenAI API key is invalid or expired' },
          { status: 401 }
        );
      }
      if (error.message.includes('429') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'OpenAI API rate limit exceeded' },
          { status: 429 }
        );
      }
      if (error.message.includes('insufficient_quota')) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded' },
          { status: 402 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send chat messages.' },
    { status: 405 }
  );
}
