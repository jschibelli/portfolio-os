import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getChatbotContext } from '@/lib/chatbot/data-loader';
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


    // Build the conversation context dynamically from published content
    const { systemPrompt } = await getChatbotContext(pageContext);

    // Prepare messages for OpenAI
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history (validate and filter entries)
    // Context window expanded to 15 exchanges (30 messages) for better conversation quality
    // Token optimization: Only include the most recent history to stay within optimal token limits
    if (conversationHistory && conversationHistory.length > 0) {
      // Limit to last 15 exchanges (30 messages) to optimize token usage
      // Each exchange is 2 messages (user + assistant), so slice to last 30 if needed
      const recentHistory = conversationHistory.length > 30 
        ? conversationHistory.slice(-30) 
        : conversationHistory;
      
      recentHistory.forEach(entry => {
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

    // Generate response using OpenAI with streaming
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: validMessages,
      tools: tools,
      tool_choice: 'auto',
      max_tokens: 1000,
      temperature: 0.7,
      stream: true, // Enable streaming
    });

    // Create a ReadableStream to handle SSE streaming
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';
          let uiActions: any[] = [];
          let toolCalls: any[] = [];
          let currentToolCall: any = null;

          for await (const chunk of completion) {
            const delta = chunk.choices[0]?.delta;

            // Handle content streaming
            if (delta?.content) {
              fullResponse += delta.content;
              
              // Send content chunk to client
              const data = JSON.stringify({
                type: 'content',
                content: delta.content,
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }

            // Handle tool calls
            if (delta?.tool_calls) {
              for (const toolCallDelta of delta.tool_calls) {
                if (toolCallDelta.index !== undefined) {
                  if (!toolCalls[toolCallDelta.index]) {
                    toolCalls[toolCallDelta.index] = {
                      id: toolCallDelta.id || '',
                      type: 'function',
                      function: {
                        name: toolCallDelta.function?.name || '',
                        arguments: toolCallDelta.function?.arguments || '',
                      },
                    };
                  } else {
                    // Add null check before accessing array index
                    if (toolCalls[toolCallDelta.index] && toolCallDelta.function?.arguments) {
                      toolCalls[toolCallDelta.index].function.arguments += toolCallDelta.function.arguments;
                    }
                  }
                }
              }
            }

            // Check if streaming is complete
            if (chunk.choices[0]?.finish_reason) {
              // Execute any tool calls
              if (toolCalls.length > 0) {
                for (const toolCall of toolCalls) {
                  try {
                    const toolResult = await executeTool(
                      toolCall.function.name,
                      JSON.parse(toolCall.function.arguments)
                    );
                    
                    if (toolResult.type === 'ui_action') {
                      uiActions.push(toolResult);
                    }
                  } catch (error) {
                    console.error('🤖 Tool execution error:', error);
                  }
                }
                
                // Send explanatory text after tool execution
                if (uiActions.length > 0) {
                  const calendarAction = uiActions.find(action => action.action === 'show_booking_modal');
                  let explanation = '';
                  
                  if (calendarAction) {
                    explanation = 'Perfect! I\'ve found available time slots for scheduling a meeting with John. Please select a time that works best for you from the calendar below.';
                  } else {
                    explanation = 'I\'ve processed your request. Please check the options below.';
                  }
                  
                  // Only send explanation if we have one and no response was streamed yet
                  if (explanation && fullResponse.length === 0) {
                    fullResponse = explanation;
                    const contentData = JSON.stringify({
                      type: 'content',
                      content: explanation,
                    });
                    controller.enqueue(encoder.encode(`data: ${contentData}\n\n`));
                  }
                }
              }

              // Send completion message with metadata
              const completionData = JSON.stringify({
                type: 'done',
                uiActions: uiActions,
                intent: 'general',
                suggestedActions: [],
              });
              controller.enqueue(encoder.encode(`data: ${completionData}\n\n`));
            }
          }

          controller.close();
        } catch (error) {
          console.error('🤖 Streaming error:', error);
          const errorData = JSON.stringify({
            type: 'error',
            error: 'Streaming error occurred',
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    // Return SSE response with proper headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('🤖 Chat API Error:', error);
    
    // Handle specific OpenAI API errors with user-friendly messages
    if (error instanceof Error) {
      // Authentication errors
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { 
            error: 'Configuration Error',
            userMessage: "I'm having trouble connecting to my AI service. This is a configuration issue on my end.",
            suggestion: 'Please try again in a few moments, or contact John directly at jschibelli@gmail.com if the issue persists.',
            retryable: false,
            errorCode: 'AUTH_ERROR'
          },
          { status: 401 }
        );
      }
      
      // Rate limiting errors
      if (error.message.includes('429') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { 
            error: 'Too Many Requests',
            userMessage: "I'm receiving a lot of requests right now and need a moment to catch up.",
            suggestion: 'Please wait a moment and try again. Your message will be processed shortly.',
            retryable: true,
            retryAfter: 5000, // 5 seconds
            errorCode: 'RATE_LIMIT'
          },
          { status: 429 }
        );
      }
      
      // Quota exceeded errors
      if (error.message.includes('insufficient_quota')) {
        return NextResponse.json(
          { 
            error: 'Service Limit Reached',
            userMessage: "I've reached my service capacity for now.",
            suggestion: 'Please contact John directly at jschibelli@gmail.com for assistance.',
            retryable: false,
            errorCode: 'QUOTA_EXCEEDED'
          },
          { status: 402 }
        );
      }
      
      // Timeout errors
      if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        return NextResponse.json(
          { 
            error: 'Request Timeout',
            userMessage: "I'm taking longer than usual to respond.",
            suggestion: 'Please try sending your message again. If this continues, try asking a simpler question.',
            retryable: true,
            retryAfter: 2000, // 2 seconds
            errorCode: 'TIMEOUT'
          },
          { status: 504 }
        );
      }
      
      // Network errors
      if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
        return NextResponse.json(
          { 
            error: 'Connection Error',
            userMessage: "I'm having trouble connecting to the AI service.",
            suggestion: 'Please check your internet connection and try again.',
            retryable: true,
            retryAfter: 3000, // 3 seconds
            errorCode: 'NETWORK_ERROR'
          },
          { status: 503 }
        );
      }
    }
    
    // Generic error with helpful message
    return NextResponse.json(
      { 
        error: 'Processing Error',
        userMessage: "I encountered an unexpected issue while processing your message.",
        suggestion: 'Please try rephrasing your question or contact John at jschibelli@gmail.com if this continues.',
        details: error instanceof Error ? error.message : 'Unknown error',
        retryable: true,
        retryAfter: 2000,
        errorCode: 'UNKNOWN_ERROR'
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
