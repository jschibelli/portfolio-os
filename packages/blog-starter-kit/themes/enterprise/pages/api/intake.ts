import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check feature flag
  if (process.env.FEATURE_CLIENT_INTAKE !== 'true') {
    return res.status(503).json({ error: 'Client intake feature is disabled' });
  }

  try {
    const { 
      name, 
      email, 
      company, 
      role, 
      project, 
      budget, 
      timeline, 
      links = [], 
      notes 
    } = req.body;

    // Validate required fields
    if (!name || !email || !project) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, project' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Sanitize inputs
    const sanitizedName = name.trim().substring(0, 100);
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedCompany = company?.trim().substring(0, 100) || null;
    const sanitizedRole = role?.trim().substring(0, 100) || null;
    const sanitizedProject = project.trim().substring(0, 500);
    const sanitizedBudget = budget?.trim().substring(0, 50) || null;
    const sanitizedTimeline = timeline?.trim().substring(0, 50) || null;
    const sanitizedNotes = notes?.trim().substring(0, 1000) || null;

    // Validate and sanitize links
    const sanitizedLinks = Array.isArray(links) 
      ? links
          .filter(link => typeof link === 'string' && link.trim().length > 0)
          .map(link => link.trim().substring(0, 500))
          .slice(0, 10) // Limit to 10 links
      : [];

    // Store lead in database
    const lead = await prisma.lead.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        company: sanitizedCompany,
        role: sanitizedRole,
        project: sanitizedProject,
        budget: sanitizedBudget,
        timeline: sanitizedTimeline,
        links: JSON.stringify(sanitizedLinks), // Convert array to JSON string for SQLite
        notes: sanitizedNotes,
        status: 'NEW'
      }
    });

    // Send Slack notification
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: `🎯 New lead submitted!\n\n*${sanitizedName}* (${sanitizedEmail})\n🏢 ${sanitizedCompany || 'N/A'}\n👤 ${sanitizedRole || 'N/A'}\n💼 ${sanitizedProject}\n💰 ${sanitizedBudget || 'N/A'}\n⏰ ${sanitizedTimeline || 'N/A'}\n${sanitizedNotes ? `📝 ${sanitizedNotes}` : ''}`
          })
        });
      } catch (slackError) {
        console.error('Failed to send Slack notification:', slackError);
        // Don't fail the intake if Slack notification fails
      }
    }

    return res.status(200).json({
      success: true,
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        project: lead.project
      },
      message: 'Thank you for your interest! We\'ll be in touch soon.'
    });

  } catch (error) {
    console.error('Error submitting lead:', error);
    return res.status(500).json({ 
      error: 'Failed to submit lead',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}
