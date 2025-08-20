import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check feature flag
  if (process.env.FEATURE_CLIENT_INTAKE !== 'true') {
    return res.status(503).json({ error: 'Client intake feature is disabled' });
  }

  try {
    const { leadId } = req.body;

    if (!leadId) {
      return res.status(400).json({ error: 'Lead ID is required' });
    }

    // Fetch lead from database
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return a basic summary if OpenAI is not configured
      const basicSummary = generateBasicSummary(lead);
      return res.status(200).json({ summary: basicSummary });
    }

    // Generate AI-powered summary
    const prompt = `
Generate a professional, concise summary of this lead for a follow-up email. Focus on the key details that would help in crafting a personalized response.

Lead Information:
- Name: ${lead.name}
- Email: ${lead.email}
- Company: ${lead.company || 'Not specified'}
- Role: ${lead.role || 'Not specified'}
- Project: ${lead.project}
- Budget: ${lead.budget || 'Not specified'}
- Timeline: ${lead.timeline || 'Not specified'}
- Links: ${(() => {
    try {
      const links = JSON.parse(lead.links);
      return Array.isArray(links) && links.length > 0 ? links.join(', ') : 'None provided';
    } catch {
      return 'None provided';
    }
  })()}
- Notes: ${lead.notes || 'None provided'}

Please provide a 2-3 sentence summary that highlights:
1. The type of project they're looking for
2. Their budget and timeline (if provided)
3. Any specific requirements or context from their notes
4. The overall opportunity assessment

Format the response as clean markdown without any headers or formatting.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional business development assistant. Generate concise, actionable summaries of lead information for follow-up emails."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    const summary = completion.choices[0]?.message?.content?.trim() || generateBasicSummary(lead);

    // Update lead with summary
    await prisma.lead.update({
      where: { id: leadId },
      data: { summary }
    });

    return res.status(200).json({ summary });

  } catch (error) {
    console.error('Error generating summary:', error);
    return res.status(500).json({ 
      error: 'Failed to generate summary',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}

function generateBasicSummary(lead: any): string {
  const parts = [];
  
  parts.push(`${lead.name} from ${lead.company || 'an unspecified company'} is interested in ${lead.project.toLowerCase()}.`);
  
  if (lead.budget || lead.timeline) {
    const details = [];
    if (lead.budget) details.push(`budget: ${lead.budget}`);
    if (lead.timeline) details.push(`timeline: ${lead.timeline}`);
    parts.push(`They have a ${details.join(' and ')}.`);
  }
  
  if (lead.notes) {
    parts.push(`Additional context: ${lead.notes.substring(0, 100)}${lead.notes.length > 100 ? '...' : ''}`);
  }
  
  return parts.join(' ');
}
