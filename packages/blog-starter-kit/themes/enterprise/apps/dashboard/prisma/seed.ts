import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create a sample user
  const user = await prisma.user.upsert({
    where: { email: 'john@mindware-blog.com' },
    update: {},
    create: {
      email: 'john@mindware-blog.com',
      name: 'John Schibelli',
      password: 'hashedpassword123', // In production, this should be properly hashed
      role: 'ADMIN',
    },
  });

  console.log('✅ User created:', user.email);

  // Create sample tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'Development' },
      update: {},
      create: { name: 'Development', slug: 'development' },
    }),
    prisma.tag.upsert({
      where: { name: 'Case Study' },
      update: {},
      create: { name: 'Case Study', slug: 'case-study' },
    }),
    prisma.tag.upsert({
      where: { name: 'Blogging' },
      update: {},
      create: { name: 'Blogging', slug: 'blogging' },
    }),
    prisma.tag.upsert({
      where: { name: 'Management' },
      update: {},
      create: { name: 'Management', slug: 'management' },
    }),
    prisma.tag.upsert({
      where: { name: 'SEO' },
      update: {},
      create: { name: 'SEO', slug: 'seo' },
    }),
  ]);

  console.log('✅ Tags created:', tags.length);

  // Create sample articles
  const articles = await Promise.all([
    prisma.article.upsert({
      where: { slug: 'getting-started-with-blog-management' },
      update: {},
      create: {
        title: 'Getting Started with Blog Management',
        subtitle: 'Learn how to manage your blog effectively',
        slug: 'getting-started-with-blog-management',
        status: 'PUBLISHED',
        excerpt: 'A comprehensive guide to managing your blog content, analytics, and growth.',
        contentMdx: '# Getting Started with Blog Management\n\nThis is a sample article content...',
        authorId: user.id,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        featured: true,
        views: 1250,
        readingMinutes: 8,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'advanced-seo-strategies-for-2025' },
      update: {},
      create: {
        title: 'Advanced SEO Strategies for 2025',
        subtitle: 'Stay ahead with the latest SEO techniques',
        slug: 'advanced-seo-strategies-for-2025',
        status: 'DRAFT',
        excerpt: 'Discover cutting-edge SEO strategies that will dominate search results in 2025.',
        contentMdx: '# Advanced SEO Strategies for 2025\n\nThis is a draft article...',
        authorId: user.id,
        views: 0,
        readingMinutes: 12,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'case-study-hybrid-development-approach' },
      update: {},
      create: {
        title: 'Case Study: Hybrid Development Approach',
        subtitle: 'Real-world implementation of hybrid development',
        slug: 'case-study-hybrid-development-approach',
        status: 'PUBLISHED',
        excerpt: 'A detailed case study exploring the benefits and challenges of hybrid development approaches.',
        contentMdx: '# Case Study: Hybrid Development Approach\n\nThis is a case study article...',
        authorId: user.id,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        featured: true,
        views: 890,
        readingMinutes: 15,
      },
    }),
  ]);

  console.log('✅ Articles created:', articles.length);

  // Link articles to tags
  await Promise.all([
    prisma.articleTag.createMany({
      data: [
        { articleId: articles[0].id, tagId: tags[3].id }, // Blogging + Management
        { articleId: articles[0].id, tagId: tags[2].id },
        { articleId: articles[1].id, tagId: tags[4].id }, // SEO
        { articleId: articles[2].id, tagId: tags[0].id }, // Development + Case Study
        { articleId: articles[2].id, tagId: tags[1].id },
      ],
      skipDuplicates: true,
    }),
  ]);

  console.log('✅ Article tags linked');

  // Create sample case studies
  const caseStudies = await Promise.all([
    prisma.caseStudy.upsert({
      where: { slug: 'tendrilo-multi-tenant-chatbot' },
      update: {},
      create: {
        title: 'Tendrilo Multi-Tenant Chatbot SaaS',
        slug: 'tendrilo-multi-tenant-chatbot',
        excerpt: 'Building a scalable multi-tenant chatbot platform for enterprise clients.',
        content: 'This case study explores the development of Tendrilo...',
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        featured: true,
        views: 2100,
        tags: ['SaaS', 'Chatbot', 'Multi-tenant'],
        category: 'Software Development',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
        client: 'Enterprise SaaS Company',
        industry: 'Technology',
        duration: '6 months',
        teamSize: '5 developers',
        challenges: 'Scalability, multi-tenancy, real-time communication',
        solution: 'Microservices architecture with tenant isolation',
        results: 'Successfully launched with 50+ enterprise clients',
        metrics: { users: 50000, uptime: '99.9%', responseTime: '200ms' },
        lessonsLearned: 'Importance of early architecture planning',
        nextSteps: 'Expand to mobile platforms and add AI features',
      },
    }),
    prisma.caseStudy.upsert({
      where: { slug: 'hybrid-development-approach' },
      update: {},
      create: {
        title: 'Hybrid Development Approach',
        slug: 'hybrid-development-approach',
        excerpt: 'Combining multiple development methodologies for optimal project delivery.',
        content: 'This case study examines the hybrid approach...',
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        featured: false,
        views: 1560,
        tags: ['Methodology', 'Agile', 'Waterfall'],
        category: 'Project Management',
        technologies: ['Jira', 'Confluence', 'Git'],
        client: 'Financial Services Company',
        industry: 'Finance',
        duration: '12 months',
        teamSize: '12 developers',
        challenges: 'Complex regulatory requirements, tight deadlines',
        solution: 'Hybrid agile-waterfall methodology',
        results: 'Delivered on time and under budget',
        metrics: { onTimeDelivery: '100%', budgetAdherence: '95%', qualityScore: '98%' },
        lessonsLearned: 'Flexibility in methodology is key',
        nextSteps: 'Document best practices and train other teams',
      },
    }),
  ]);

  console.log('✅ Case studies created:', caseStudies.length);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
