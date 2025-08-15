import { GetStaticProps } from 'next';
import Head from 'next/head';
import request from 'graphql-request';
import { motion } from 'framer-motion';
import { Container } from '../components/container';
import { AppProvider } from '../components/contexts/appContext';
import { Footer } from '../components/footer';
import { Layout } from '../components/layout';
import ModernHeader from '../components/modern-header';
import { PublicationByHostDocument } from '../generated/graphql';
import ProjectCard, { Project } from '../components/project-card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowRightIcon, ExternalLinkIcon, CalendarIcon, UsersIcon, CodeIcon } from 'lucide-react';
import portfolioData from '../data/portfolio.json';

interface Props {
  publication: any;
}

export default function WorkPage({ publication }: Props) {
  // Convert portfolio data to Project interface
  const allProjects: Project[] = portfolioData.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.image,
    tags: item.tags,
    caseStudyUrl: item.caseStudyUrl
  }));

  // Featured projects (first 3)
  const featuredProjects = allProjects.slice(0, 3);
  
  // Remaining projects
  const otherProjects = allProjects.slice(3);

  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>
            {publication.displayTitle || publication.title} - Work & Case Studies
          </title>
          <meta name="description" content="Explore our portfolio of case studies and projects showcasing modern web development solutions" />
          <meta property="og:title" content={`${publication.displayTitle || publication.title} - Work & Case Studies`} />
          <meta property="og:description" content="Explore our portfolio of case studies and projects showcasing modern web development solutions" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${publication.url}/work`} />
          <meta name="twitter:title" content={`${publication.displayTitle || publication.title} - Work & Case Studies`} />
          <meta name="twitter:description" content="Explore our portfolio of case studies and projects showcasing modern web development solutions" />
        </Head>
        <ModernHeader publication={publication} />
        
        <main className="min-h-screen bg-white dark:bg-stone-950">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800">
            <Container className="px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center max-w-4xl mx-auto"
              >
                <h1 className="text-5xl md:text-6xl font-bold text-stone-900 dark:text-stone-100 mb-6">
                  Work & Case Studies
                </h1>
                <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 mb-8 leading-relaxed">
                  A collection of projects that showcase modern web development, 
                  innovative design solutions, and impactful digital experiences.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500 dark:text-stone-400">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{allProjects.length} Projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4" />
                    <span>Client Success Stories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CodeIcon className="w-4 h-4" />
                    <span>Modern Tech Stack</span>
                  </div>
                </div>
              </motion.div>
            </Container>
          </section>

          {/* Featured Projects Section */}
          <section className="py-20 bg-white dark:bg-stone-950">
            <Container className="px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                  Featured Projects
                </h2>
                <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                  Our most recent and impactful projects that demonstrate our expertise 
                  in modern web development and design.
                </p>
              </motion.div>

              {/* Featured Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {featuredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </Container>
          </section>

          {/* All Projects Section */}
          {otherProjects.length > 0 && (
            <section className="py-20 bg-stone-50 dark:bg-stone-900">
              <Container className="px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                    All Projects
                  </h2>
                  <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                    Explore our complete portfolio of projects and case studies.
                  </p>
                </motion.div>

                {/* All Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherProjects.map((project, index) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      index={index + featuredProjects.length} 
                    />
                  ))}
                </div>
              </Container>
            </section>
          )}

          {/* Technologies & Skills Section */}
          <section className="py-20 bg-white dark:bg-stone-950">
            <Container className="px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                  Technologies & Skills
                </h2>
                <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                  We work with modern technologies to deliver exceptional digital experiences.
                </p>
              </motion.div>

              {/* Technology Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    category: "Frontend",
                    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"]
                  },
                  {
                    category: "Backend",
                    technologies: ["Node.js", "Prisma", "PostgreSQL", "GraphQL", "REST APIs"]
                  },
                  {
                    category: "Cloud & DevOps",
                    technologies: ["AWS", "Vercel", "Docker", "CI/CD", "Monitoring"]
                  },
                  {
                    category: "Design & UX",
                    technologies: ["Figma", "Accessibility", "Responsive Design", "Performance", "SEO"]
                  }
                ].map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="bg-stone-50 dark:bg-stone-900 rounded-lg p-6"
                  >
                    <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Container>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-stone-900 to-stone-800 dark:from-stone-800 dark:to-stone-900">
            <Container className="px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-center max-w-3xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Start Your Project?
                </h2>
                <p className="text-xl text-stone-300 mb-8">
                  Let's discuss how we can help bring your vision to life with cutting-edge technology solutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-stone-900 hover:bg-stone-100 font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
                    asChild
                  >
                    <a href="/about">
                      Get In Touch
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-stone-900 font-semibold px-8 py-4 text-lg transition-all duration-300"
                    asChild
                  >
                    <a href="/blog">
                      Read Our Blog
                      <ExternalLinkIcon className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            </Container>
          </section>
        </main>
        <Footer />
      </Layout>
    </AppProvider>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await request(
    process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT,
    PublicationByHostDocument,
    {
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    },
  );

  const publication = data.publication;
  if (!publication) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      publication,
    },
    revalidate: 1,
  };
};
