import React from 'react';
import { motion } from 'framer-motion';
import { skills } from '../../../data/skills';

export default function SkillsTicker() {
  // Duplicate skills for seamless infinite scroll
  const duplicatedSkills = [...skills, ...skills];

  return (
    <section className="py-16 bg-stone-100 dark:bg-stone-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Skills & Tools
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Technologies and tools I use to build modern, scalable applications
          </p>
        </motion.div>

        {/* Skills Ticker */}
        <div className="relative">
          <div className="flex overflow-hidden group">
            <div 
              className="flex gap-8 items-center animate-scroll"
              style={{
                animationPlayState: 'running',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.animationPlayState = 'paused';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animationPlayState = 'running';
              }}
            >
              {duplicatedSkills.map((skill, index) => (
                <motion.div
                  key={`${skill.name}-${index}`}
                  className="flex items-center gap-3 bg-white dark:bg-stone-900 px-6 py-3 rounded-full shadow-sm border border-stone-200 dark:border-stone-700 flex-shrink-0"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-2xl" role="img" aria-label={skill.name}>
                    {skill.icon}
                  </span>
                  <span className="font-medium text-stone-700 dark:text-stone-300 whitespace-nowrap">
                    {skill.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-stone-100 dark:from-stone-800 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-stone-100 dark:from-stone-800 to-transparent pointer-events-none" />
        </div>

        {/* Category indicators */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {Array.from(new Set(skills.map(skill => skill.category))).map((category) => (
            <span
              key={category}
              className="text-xs font-medium text-stone-500 dark:text-stone-400 bg-stone-200 dark:bg-stone-700 px-3 py-1 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
