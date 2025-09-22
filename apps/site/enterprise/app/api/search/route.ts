import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects } from '../../../lib/project-utils';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'blog' | 'page';
  url: string;
  tags?: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search projects
    try {
      const projects = await getAllProjects();
      const projectResults = projects
        .filter(project => 
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
        )
        .map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          type: 'project' as const,
          url: `/projects/${project.slug}`,
          tags: project.tags,
        }))
        .slice(0, 5); // Limit to 5 results

      results.push(...projectResults);
    } catch (error) {
      console.error('Error searching projects:', error);
    }

    // Search blog posts (if you have blog functionality)
    // This would require integration with your blog data source
    // For now, we'll add a placeholder for future blog search
    try {
      // TODO: Implement blog post search when blog data is available
      // const blogResults = await searchBlogPosts(searchTerm);
      // results.push(...blogResults);
    } catch (error) {
      console.error('Error searching blog posts:', error);
    }

    // Search static pages
    const staticPages = [
      {
        id: 'about',
        title: 'About',
        description: 'Learn more about John Schibelli and his development expertise',
        type: 'page' as const,
        url: '/about',
        tags: ['about', 'developer', 'portfolio'],
      },
      {
        id: 'contact',
        title: 'Contact',
        description: 'Get in touch with John Schibelli for project inquiries',
        type: 'page' as const,
        url: '/contact',
        tags: ['contact', 'hire', 'inquiry'],
      },
      {
        id: 'projects',
        title: 'Projects',
        description: 'View all projects and case studies in the portfolio',
        type: 'page' as const,
        url: '/projects',
        tags: ['projects', 'portfolio', 'case studies'],
      },
      {
        id: 'blog',
        title: 'Blog',
        description: 'Read the latest articles and insights on web development',
        type: 'page' as const,
        url: '/blog',
        tags: ['blog', 'articles', 'development'],
      },
    ];

    const pageResults = staticPages
      .filter(page => 
        page.title.toLowerCase().includes(searchTerm) ||
        page.description.toLowerCase().includes(searchTerm) ||
        page.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .slice(0, 3); // Limit to 3 results

    results.push(...pageResults);

    // Sort results by relevance (exact title matches first, then description matches)
    results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(searchTerm);
      const bTitleMatch = b.title.toLowerCase().includes(searchTerm);
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      return 0;
    });

    return NextResponse.json({ 
      results: results.slice(0, 10), // Limit total results to 10
      query: searchTerm,
      total: results.length 
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed', results: [] },
      { status: 500 }
    );
  }
}
