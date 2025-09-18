/**
 * Typography Demo Component
 * 
 * This component demonstrates the hero typography system across all breakpoints
 * and provides a visual reference for developers.
 */

import { HeroTitle, HeroSubtitle, HeroDescription, SectionHeading, CardTitle } from '@/components/ui/typography';
import { typographyPresets } from '@/lib/design-tokens';

export default function TypographyDemo() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 py-12">
      <div className="container mx-auto px-4 space-y-16">
        
        {/* Hero Typography Demo */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Hero Typography System
            </h2>
            <p className="text-stone-600 dark:text-stone-400">
              Responsive typography scales for hero components
            </p>
          </div>
          
          <div className="bg-white dark:bg-stone-800 rounded-lg p-8 shadow-lg">
            <div className="space-y-6">
              <HeroTitle className="text-stone-900 dark:text-stone-100">
                Building Smarter, Faster Web Applications
              </HeroTitle>
              
              <HeroSubtitle className="text-stone-700 dark:text-stone-300">
                John Schibelli
              </HeroSubtitle>
              
              <HeroDescription className="text-stone-600 dark:text-stone-400">
                Transforming ideas into high-performance digital experiences that drive business growth. 
                Expert in React, Next.js, and TypeScript with 15+ years of proven results.
              </HeroDescription>
            </div>
          </div>
        </section>

        {/* Section Typography Demo */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Section Typography
            </h2>
            <p className="text-stone-600 dark:text-stone-400">
              Typography for section headings and content
            </p>
          </div>
          
          <div className="bg-white dark:bg-stone-800 rounded-lg p-8 shadow-lg">
            <div className="space-y-6">
              <SectionHeading className="text-stone-900 dark:text-stone-100">
                Featured Projects
              </SectionHeading>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 dark:bg-stone-700 rounded-lg p-6">
                  <CardTitle className="text-stone-900 dark:text-stone-100 mb-2">
                    E-commerce Platform
                  </CardTitle>
                  <p className="text-stone-600 dark:text-stone-400 text-sm">
                    A modern e-commerce solution built with Next.js and TypeScript.
                  </p>
                </div>
                
                <div className="bg-stone-50 dark:bg-stone-700 rounded-lg p-6">
                  <CardTitle className="text-stone-900 dark:text-stone-100 mb-2">
                    SaaS Dashboard
                  </CardTitle>
                  <p className="text-stone-600 dark:text-stone-400 text-sm">
                    A comprehensive dashboard for managing business operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Utility Classes Demo */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Utility Classes Demo
            </h2>
            <p className="text-stone-600 dark:text-stone-400">
              Using pre-built utility classes for typography
            </p>
          </div>
          
          <div className="bg-white dark:bg-stone-800 rounded-lg p-8 shadow-lg">
            <div className="space-y-6">
              <h1 className="hero-title text-stone-900 dark:text-stone-100">
                Hero Title with Utility Class
              </h1>
              
              <p className="hero-subtitle text-stone-700 dark:text-stone-300">
                Hero Subtitle with Utility Class
              </p>
              
              <p className="hero-description text-stone-600 dark:text-stone-400">
                Hero description using utility classes for consistent typography across all breakpoints.
              </p>
            </div>
          </div>
        </section>

        {/* Responsive Breakpoints Demo */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Responsive Breakpoints
            </h2>
            <p className="text-stone-600 dark:text-stone-400">
              Typography scales across different screen sizes
            </p>
          </div>
          
          <div className="bg-white dark:bg-stone-800 rounded-lg p-8 shadow-lg">
            <div className="space-y-4">
              <div className="text-sm text-stone-500 dark:text-stone-400">
                <strong>Mobile (0px - 639px):</strong> text-4xl (40px)
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                <strong>Tablet (640px - 767px):</strong> text-5xl (48px)
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                <strong>Desktop (768px - 1023px):</strong> text-6xl (60px)
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                <strong>Large (1024px - 1279px):</strong> text-7xl (72px)
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                <strong>XLarge (1280px+):</strong> text-8xl (96px)
              </div>
            </div>
          </div>
        </section>

        {/* Design Tokens Demo */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Design Tokens
            </h2>
            <p className="text-stone-600 dark:text-stone-400">
              Using design tokens for consistent typography
            </p>
          </div>
          
          <div className="bg-white dark:bg-stone-800 rounded-lg p-8 shadow-lg">
            <div className="space-y-6">
              <h1 className={typographyPresets.heroTitle + ' text-stone-900 dark:text-stone-100'}>
                Design Token Hero Title
              </h1>
              
              <p className={typographyPresets.heroSubtitle + ' text-stone-700 dark:text-stone-300'}>
                Design Token Hero Subtitle
              </p>
              
              <p className={typographyPresets.heroDescription + ' text-stone-600 dark:text-stone-400'}>
                Using design tokens ensures consistency across all components and makes it easy to maintain typography standards.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
