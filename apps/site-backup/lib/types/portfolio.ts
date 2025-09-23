export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  caseStudyUrl?: string;
  metrics?: {
    performance: {
      loadTimeImprovement: string;
      responseTime: string;
      uptime: string;
    };
    business: {
      [key: string]: string | undefined;
    };
  };
  caseStudyPreview?: {
    problem: string;
    solution: string;
    results: string;
  };
}
