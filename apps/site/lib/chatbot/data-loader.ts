/**
 * Chatbot Data Loader
 * Dynamically loads data for chatbot system prompt from various sources
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface CaseStudy {
  slug: string;
  title: string;
  excerpt: string;
  status: string;
  visibility: string;
  technologies?: string[];
  client?: string;
  industry?: string;
  content?: string;
}

interface ResumeData {
  basics: {
    name: string;
    label: string;
    summary: string;
  };
  work: Array<{
    name: string;
    position: string;
    highlights: string[];
  }>;
  skills: Array<{
    name: string;
    keywords: string[];
  }>;
}

/**
 * Load all published case studies from content directory
 */
export async function loadPublishedCaseStudies(): Promise<CaseStudy[]> {
  const caseStudiesDir = path.join(process.cwd(), 'content', 'case-studies');
  
  try {
    const files = fs.readdirSync(caseStudiesDir);
    const caseStudies: CaseStudy[] = [];

    for (const file of files) {
      if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;

      const filePath = path.join(caseStudiesDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      // Only include published case studies
      if (data.status === 'PUBLISHED' && data.visibility === 'PUBLIC') {
        caseStudies.push({
          slug: data.slug || file.replace(/\.mdx?$/, ''),
          title: data.title || '',
          excerpt: data.excerpt || '',
          status: data.status,
          visibility: data.visibility,
          technologies: data.technologies || [],
          client: data.client,
          industry: data.industry,
          content: content.substring(0, 500), // First 500 chars for context
        });
      }
    }

    return caseStudies;
  } catch (error) {
    console.error('Error loading case studies:', error);
    return [];
  }
}

/**
 * Load resume data
 */
export async function loadResumeData(): Promise<ResumeData | null> {
  const resumePath = path.join(process.cwd(), '..', '..', 'data', 'resume.json');
  
  try {
    const resumeData = fs.readFileSync(resumePath, 'utf8');
    return JSON.parse(resumeData);
  } catch (error) {
    console.error('Error loading resume:', error);
    return null;
  }
}

/**
 * Build dynamic system prompt from loaded data
 */
export function buildSystemPrompt(
  caseStudies: CaseStudy[],
  resume: ResumeData | null,
  pageContext?: { title?: string; description?: string }
): string {
  const contextSection = pageContext?.title 
    ? `Current page context: ${pageContext.title}
    ${pageContext.description ? `Page description: ${pageContext.description}` : ''}`
    : '';

  const aboutSection = resume 
    ? `## About ${resume.basics.name}
    ${resume.basics.summary}
    
    ### Current Role
    ${resume.work[0]?.position} at ${resume.work[0]?.name}
    
    ### Key Achievements
    ${resume.work[0]?.highlights?.slice(0, 3).map(h => `- ${h}`).join('\n    ')}`
    : `## About John Schibelli
    John Schibelli is a full-stack developer and technical consultant specializing in modern web technologies, AI integration, and SaaS development.`;

  const caseStudiesSection = caseStudies.length > 0
    ? `## Published Case Studies & Projects
    
    ${caseStudies.map(cs => `### ${cs.title}
    **Client**: ${cs.client || 'N/A'}
    **Industry**: ${cs.industry || 'N/A'}
    **Technologies**: ${cs.technologies?.join(', ') || 'N/A'}
    **Overview**: ${cs.excerpt}
    
    `).join('\n')}`
    : `## Projects
    Multiple successful projects in web development, SaaS architecture, and AI integration. Ask for specific project details.`;

  const servicesSection = resume?.skills
    ? `## Services & Expertise
    ${resume.skills.map(s => `- ${s.name}: ${s.keywords.slice(0, 5).join(', ')}`).join('\n    ')}`
    : `## Services Offered
    - Full-stack web development (Next.js, React, TypeScript)
    - AI integration and chatbot development
    - SaaS architecture and multi-tenant systems
    - E-commerce solutions with Stripe integration
    - Technical consulting and strategic planning`;

  return `You are a helpful AI assistant for John Schibelli's professional blog/portfolio website. You have access to John's calendar and can help users schedule meetings.
    
    ${contextSection}
    
    ${aboutSection}
    
    ## Calendar Access
    You have direct access to John's calendar and can:
    - Check his availability for meetings
    - Show available time slots for scheduling
    - Help users book meetings directly
    - Provide real-time calendar information
    
    When users ask about scheduling, meetings, or availability, use the show_calendar_modal tool to display available time slots.
    
    ${caseStudiesSection}
    
    ${servicesSection}
    
    Be helpful, professional, and concise in your responses. Provide accurate details about the case studies and projects listed above. If asked about projects not listed, suggest the user browse the portfolio or contact John directly.`;
}

/**
 * Get complete chatbot context (call this from API route)
 */
export async function getChatbotContext(pageContext?: { title?: string; description?: string }) {
  const [caseStudies, resume] = await Promise.all([
    loadPublishedCaseStudies(),
    loadResumeData(),
  ]);

  const systemPrompt = buildSystemPrompt(caseStudies, resume, pageContext);

  return {
    systemPrompt,
    caseStudies,
    resume,
  };
}

