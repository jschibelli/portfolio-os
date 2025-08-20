import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check feature flag
  if (process.env.FEATURE_CASE_STUDY !== 'true') {
    return res.status(503).json({ error: 'Case study feature is disabled' });
  }

  try {
    const { id } = req.query;
    const { chapterId = 'overview', visitorId } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Case study ID is required' });
    }

    // Load case study from JSON file
    const caseStudyPath = path.join(process.cwd(), 'content', 'case-studies', `${id}.json`);
    
    if (!fs.existsSync(caseStudyPath)) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    const caseStudyContent = JSON.parse(fs.readFileSync(caseStudyPath, 'utf8'));
    
    // Validate chapter exists
    if (!caseStudyContent.chapters || !caseStudyContent.chapters[chapterId]) {
      return res.status(404).json({ 
        error: 'Chapter not found',
        availableChapters: Object.keys(caseStudyContent.chapters || {})
      });
    }

    const chapter = caseStudyContent.chapters[chapterId];

    // Track view in database
    if (process.env.DATABASE_URL) {
      try {
        await prisma.caseStudyView.create({
          data: {
            caseStudyId: id,
            chapterId,
            visitorId: visitorId || null,
            viewedAt: new Date()
          }
        });
      } catch (dbError) {
        console.error('Failed to track case study view:', dbError);
        // Don't fail the request if tracking fails
      }
    }

    // Return chapter data
    return res.status(200).json({
      caseStudy: {
        id: caseStudyContent.id,
        title: caseStudyContent.title,
        description: caseStudyContent.description,
        client: caseStudyContent.client,
        duration: caseStudyContent.duration,
        team: caseStudyContent.team
      },
      chapter: {
        id: chapterId,
        title: chapter.title,
        blocks: chapter.blocks
      },
      availableChapters: Object.keys(caseStudyContent.chapters).map(chapterKey => ({
        id: chapterKey,
        title: caseStudyContent.chapters[chapterKey].title
      }))
    });

  } catch (error) {
    console.error('Error fetching case study:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch case study',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}
