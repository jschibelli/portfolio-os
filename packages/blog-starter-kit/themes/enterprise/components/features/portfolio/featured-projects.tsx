import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { ArrowRightIcon } from 'lucide-react';
import ProjectCard, { Project } from './project-card';
import portfolioData from '../../../data/portfolio.json';

export default function FeaturedProjects() {
  // Convert portfolio data to Project interface
  const featuredProjects: Project[] = portfolioData.slice(0, 3).map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.image,
    tags: item.tags,
    caseStudyUrl: item.caseStudyUrl
  }));

  return (
    <section className="py-20 bg-white dark:bg-stone-950">
      <div className="container mx-auto px-4">
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
            A selection of recent projects showcasing modern web development and design solutions
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* View All Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            variant="outline"
            className="group border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
            asChild
          >
            <Link href="/work">
              View All Projects
              <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
