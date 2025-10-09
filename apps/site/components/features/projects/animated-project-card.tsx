'use client';

import { motion } from 'framer-motion';
import { ProjectMeta } from '../../../data/projects/types';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface AnimatedProjectCardProps {
  project: ProjectMeta;
  index: number;
  featured?: boolean;
}

export function AnimatedProjectCard({ project, index, featured = false }: AnimatedProjectCardProps) {
  // Featured layout for single projects (horizontal, side-by-side)
  if (featured) {
    return (
      <motion.article 
        key={project.id} 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: "easeOut"
        }}
        className="bg-white dark:bg-stone-800 rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image Section */}
          <motion.div 
            className="relative h-64 md:h-96 lg:h-full bg-stone-200 dark:bg-stone-700 overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <img 
              src={project.image} 
              alt={`${project.title} project screenshot`}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </motion.div>

          {/* Content Section */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <span className="inline-block px-3 py-1 text-xs font-semibold text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-700 rounded-full">
                Featured Project
              </span>
            </motion.div>

            <motion.h3 
              className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {project.title}
            </motion.h3>

            <motion.p 
              className="text-lg text-stone-600 dark:text-stone-400 mb-6 leading-relaxed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {project.description}
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-1.5 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {project.tags.slice(0, 6).map((tag, tagIndex) => (
                <motion.span 
                  key={tag} 
                  className="inline-block bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs px-2 py-1 rounded font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.6 + tagIndex * 0.05,
                    duration: 0.2
                  }}
                  whileHover={{ scale: 1.05, y: -1 }}
                >
                  {tag}
                </motion.span>
              ))}
              {project.tags.length > 6 && (
                <motion.span 
                  className="inline-block bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs px-2 py-1 rounded font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.6 + 6 * 0.05,
                    duration: 0.2
                  }}
                  whileHover={{ scale: 1.05, y: -1 }}
                >
                  +{project.tags.length - 6} more
                </motion.span>
              )}
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {project.caseStudyUrl && (
                <motion.a 
                  href={project.caseStudyUrl} 
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-medium rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Case Study <ArrowRight className="w-3.5 h-3.5" />
                </motion.a>
              )}
              <motion.a 
                href={`/projects/${project.slug}`} 
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 text-sm font-medium rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.article>
    );
  }

  // Standard grid layout for multiple projects
  return (
    <motion.article 
      key={project.id} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className="bg-white dark:bg-stone-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      <motion.div 
        className="aspect-video bg-stone-200 dark:bg-stone-700 overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <img 
          src={project.image} 
          alt={`${project.title} project screenshot`}
          className="w-full h-full object-cover"
          loading={index < 6 ? 'eager' : 'lazy'}
        />
      </motion.div>
      <div className="p-6">
        <motion.h3 
          className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          {project.title}
        </motion.h3>
        <motion.p 
          className="text-stone-600 dark:text-stone-400 mb-4 line-clamp-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          {project.description}
        </motion.p>
        <motion.div 
          className="flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          {project.tags.slice(0, 3).map((tag, tagIndex) => (
            <motion.span 
              key={tag} 
              className="inline-block bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs px-2 py-1 rounded"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.1 + 0.5 + tagIndex * 0.1,
                duration: 0.2
              }}
              whileHover={{ scale: 1.05 }}
            >
              {tag}
            </motion.span>
          ))}
          {project.tags.length > 3 && (
            <motion.span 
              className="inline-block bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs px-2 py-1 rounded"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.1 + 0.5 + 3 * 0.1,
                duration: 0.2
              }}
              whileHover={{ scale: 1.05 }}
            >
              +{project.tags.length - 3} more
            </motion.span>
          )}
        </motion.div>
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.6 }}
        >
          {project.liveUrl && (
            <motion.a 
              href={project.liveUrl} 
              className="inline-flex items-center px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded hover:bg-stone-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Live
            </motion.a>
          )}
          {project.caseStudyUrl && (
            <motion.a 
              href={project.caseStudyUrl} 
              className="inline-flex items-center px-4 py-2 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 text-sm font-medium rounded hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Case Study
            </motion.a>
          )}
          <motion.a 
            href={`/projects/${project.slug}`} 
            className="inline-flex items-center px-4 py-2 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 text-sm font-medium rounded hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Details
          </motion.a>
        </motion.div>
      </div>
    </motion.article>
  );
}
