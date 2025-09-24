import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getFreeSlots } from '@/lib/google/calendar';

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
      const availabilityResult = await getAvailability(parameters);
      return {
        type: 'ui_action',
        action: 'show_booking_modal',
        data: {
          availableSlots: availabilityResult.availableSlots,
          timezone: availabilityResult.timezone,
          businessHours: availabilityResult.businessHours,
          meetingDurations: availabilityResult.meetingDurations,
          message: parameters.message || 'Here are the available time slots for scheduling:',
        },
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


    // Build the conversation context
    const systemPrompt = `You are a helpful AI assistant for John Schibelli's professional blog/portfolio website. You have access to John's calendar and can help users schedule meetings.
    
    ${pageContext?.title ? `Current page context: ${pageContext.title}` : ''}
    ${pageContext?.description ? `Page description: ${pageContext.description}` : ''}
    
    ## About John Schibelli
    John Schibelli is a full-stack developer and technical consultant specializing in modern web technologies, AI integration, and SaaS development. He has extensive experience with Next.js, TypeScript, React, and building scalable applications.
    
    ## Calendar Access
    You have direct access to John's calendar and can:
    - Check his availability for meetings
    - Show available time slots for scheduling
    - Help users book meetings directly
    - Provide real-time calendar information
    
    When users ask about scheduling, meetings, or availability, use the show_calendar_modal tool to display available time slots.
    
    ## Key Projects & Case Studies
    
    ### Tendril Multi-Tenant Chatbot SaaS
    **Project Overview**: A comprehensive strategic analysis and implementation plan for a multi-tenant chatbot SaaS platform targeting SMB market gaps. This is a detailed case study showcasing market research, competitive analysis, and technical architecture planning.
    
    **Problem Statement**: Small and medium businesses (SMBs) face significant challenges with existing chatbot solutions:
    - **Pricing Transparency Crisis**: SMBs report bill increases of up to 120% with existing solutions due to hidden usage fees and confusing pricing models
    - **Setup Complexity Barrier**: Despite claims of being "no-code," existing solutions overwhelm small teams with enterprise-grade complexity
    - **Multi-Tenant Gap**: Agencies and developers managing chatbots for multiple clients face infrastructure gaps
    
    **Solution Design**: Tendril addresses these gaps through:
    - **Multi-Tenant Core Architecture**: One master account to manage multiple isolated chatbot workspaces
    - **Simplified Deployment Pipeline**: Rapid time-to-value through streamlined document ingestion and automated training
    - **Transparent Pricing Framework**: Flat-rate, usage-transparent pricing that eliminates surprise charges
    - **Modern AI Integration**: Built on current-generation LLM APIs with intelligent cost optimization
    
    **Technology Stack**: 
    - Frontend: React-based dashboard optimized for multi-tenant management
    - Backend: Node.js API with tenant isolation at the database level
    - AI Integration: OpenAI GPT-4 with custom RAG implementation
    - Database: PostgreSQL with row-level security for tenant data isolation
    - Infrastructure: Cloud-native deployment for scalability and cost efficiency
    
    **Implementation Plan**: 3-phase development strategy (12 weeks total):
    - Phase 1: Core Infrastructure Development (Weeks 1-4)
    - Phase 2: AI Integration and Document Processing (Weeks 5-8)
    - Phase 3: User Interface and Billing System (Weeks 9-12)
    
    **Projected Results**: 
    - Target: 200+ sign-ups in first quarter
    - Year 1 MRR target: $15,000-25,000
    - Target ARPU: $50-75/month
    - Setup time reduction: 90%+ faster deployment
    - Cost savings for agencies: 60-75% reduction compared to managing separate subscriptions
    
    **Key Differentiators**:
    - Transparent, predictable pricing (no hidden fees)
    - Multi-tenant architecture for agencies
    - Rapid deployment (under 30 minutes vs. 2-3 weeks for competitors)
    - Modern AI integration with better response quality
    - SMB-focused design (not enterprise complexity)
    
    ### Other Notable Projects
    - **Zeus E-Commerce Platform**: Scalable, mobile-first e-commerce experience with Next.js, Tailwind CSS, and Stripe integration
    - **Schibelli.dev Portfolio**: Modern, responsive portfolio website showcasing development skills and projects
    - **SynaplyAI**: Real-Time AI Collaboration Platform
    
    ## Services Offered
    - Full-stack web development (Next.js, React, TypeScript)
    - AI integration and chatbot development
    - SaaS architecture and multi-tenant systems
    - E-commerce solutions with Stripe integration
    - Technical consulting and strategic planning
    
    Be helpful, professional, and concise in your responses. When discussing the Tendril project specifically, provide accurate details about the market research, technical architecture, and strategic planning aspects. If asked about other projects or services, provide relevant information based on the portfolio data.`;

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
          description: 'Display a calendar modal with available time slots for scheduling meetings with John',
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
              },
              message: {
                type: 'string',
                description: 'Message to display with the calendar modal'
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
      for (const toolCall of completionMessage.tool_calls) {
        try {
          const toolResult = await executeTool(
            toolCall.function.name,
            JSON.parse(toolCall.function.arguments)
          );
          
          // If it's a UI action, add it to the response
          if (toolResult.type === 'ui_action') {
            uiActions.push(toolResult);
          }
        } catch (error) {
          console.error('🤖 Tool execution error:', error);
          response = 'I encountered an error while accessing the calendar. Please try again.';
        }
      }
      
      // Generate appropriate response based on tool results
      if (uiActions.length > 0) {
        const calendarAction = uiActions.find(action => action.action === 'show_booking_modal');
        if (calendarAction) {
          response = 'Perfect! I\'ve found available time slots for scheduling a meeting with John. Please select a time that works best for you from the calendar below.';
        } else {
          response = 'I\'ve processed your request. Please check the options below.';
        }
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
