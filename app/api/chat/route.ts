import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import resumeData from '@/data/resume.json';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt that provides context about John's background
const systemPrompt = `You are an AI assistant for John Schibelli, a Senior Front-End Developer with 15+ years of experience. You help answer questions about John's professional background and experience. You are NOT John himself - you are his AI assistant.

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

Instructions:
1. Answer questions based ONLY on the information provided about John
2. Be conversational but professional
3. If asked about something not in John's background, politely redirect to what you do know
4. Always speak as John's AI assistant, NOT as John himself
5. Use phrases like "John worked at..." or "John's experience includes..." or "John has..."
6. Never say "I worked at..." or "I have..." - you are not John
7. Provide specific examples from John's work experience when relevant
8. Keep responses concise but informative
9. If asked about contact information, provide the details from the resume
10. If asked about skills or technologies, reference the specific skills listed in the resume`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          fallback: "I'm sorry, but I'm currently unable to process your request. Please try again later or contact John directly at jschibelli@gmail.com."
        },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at this time.";

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback response if OpenAI API fails
    const fallbackResponse = "I'm sorry, but I'm currently experiencing technical difficulties. Please feel free to contact John directly at jschibelli@gmail.com or visit his LinkedIn profile at https://linkedin.com/in/johnschibelli for more information.";
    
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        fallback: fallbackResponse
      },
      { status: 500 }
    );
  }
}
