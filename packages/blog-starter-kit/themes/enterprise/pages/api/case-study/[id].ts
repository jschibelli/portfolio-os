import { NextApiRequest, NextApiResponse } from 'next';
// Conditional Prisma import
let prisma: any = null;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (error) {
  console.log('Prisma not available - using mock case study functionality');
}

// Types for case study data
interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  caseStudyId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  chapters: Chapter[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { chapterId } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid case study ID' });
    }

    if (!prisma) {
      // Return mock case study data when Prisma is not available
      const mockCaseStudy: CaseStudy = {
        id: id,
        title: 'Mock Case Study',
        description: 'This is a mock case study for testing purposes',
        slug: 'mock-case-study',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        chapters: [
          {
            id: chapterId || 'chapter-1',
            title: 'Mock Chapter',
            content: 'This is mock chapter content for testing purposes.',
            order: 1,
            caseStudyId: id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'chapter-2',
            title: 'Mock Chapter 2',
            content: 'This is mock chapter 2 content.',
            order: 2,
            caseStudyId: id,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ]
      };

      const chapter = chapterId 
        ? mockCaseStudy.chapters.find((c: Chapter) => c.id === chapterId)
        : mockCaseStudy.chapters[0];

      return res.status(200).json({
        caseStudy: mockCaseStudy,
        chapter: chapter,
        availableChapters: mockCaseStudy.chapters,
      });
    }

    // Fetch case study and chapter from database
    const caseStudy = await prisma.caseStudy.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    const chapter = chapterId 
      ? caseStudy.chapters.find((c: Chapter) => c.id === chapterId)
      : caseStudy.chapters[0];

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    return res.status(200).json({
      caseStudy,
      chapter,
      availableChapters: caseStudy.chapters,
    });
  } catch (error) {
    console.error('Error fetching case study:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch case study',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}
