import { ArrowRightIcon, StarIcon, UsersIcon, TrophyIcon } from 'lucide-react';
import { BaseHero, HeroLarge, HeroMedium, HeroSmall } from '../index';
import { HeroAction, HeroBackground } from '../types';

// Example configurations for different hero variants
const exampleActions: HeroAction[] = [
  {
    href: '/contact',
    text: 'Get Started',
    variant: 'default',
    icon: <ArrowRightIcon className="mr-2 h-4 w-4" />
  },
  {
    href: '/projects',
    text: 'View Work',
    variant: 'outline'
  }
];

const exampleBackground: HeroBackground = {
  type: 'gradient',
  gradient: {
    from: 'stone-900',
    via: 'stone-800',
    to: 'stone-700',
    direction: 'to-br'
  },
  overlay: {
    color: 'rgba(0, 0, 0, 0.4)',
    opacity: 0.6
  }
};

const exampleStats = [
  { label: 'Projects', value: '50+' },
  { label: 'Clients', value: '25+' },
  { label: 'Years', value: '15+' },
  { label: 'Success', value: '100%' }
];

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Case Study' }
];

const metaItems = [
  { label: 'Duration', value: '3 months' },
  { label: 'Team', value: '5 members' },
  { label: 'Budget', value: '$50k' }
];

export function HeroShowcase() {
  return (
    <div className="space-y-16">
      {/* Hero Large Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Hero Large - Main Landing Pages
        </h2>
        <div className="rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
          <HeroLarge
            title="Building Smarter, Faster Web Applications"
            subtitle="John Schibelli"
            description="Transforming ideas into high-performance digital experiences that drive business growth. Expert in React, Next.js, and TypeScript with 15+ years of proven results."
            actions={exampleActions}
            background={exampleBackground}
            showBadge={true}
            badgeText="New project available"
            badgeLink="/projects"
            showStats={true}
            stats={exampleStats}
            ariaLabel="Main hero section"
          />
        </div>
      </section>

      {/* Hero Medium Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Hero Medium - Section Headers
        </h2>
        <div className="rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
          <HeroMedium
            title="Featured Projects"
            subtitle="Portfolio"
            description="Explore my latest work and case studies showcasing innovative solutions and proven results."
            actions={[
              {
                href: '/projects',
                text: 'View All Projects',
                variant: 'default'
              }
            ]}
            background={{
              type: 'solid',
              color: '#1f2937'
            }}
            showIcon={true}
            icon={<TrophyIcon className="h-8 w-8 text-white" />}
            showDivider={true}
            centered={true}
            ariaLabel="Featured projects section"
          />
        </div>
      </section>

      {/* Hero Small Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Hero Small - Blog Posts & Smaller Sections
        </h2>
        <div className="rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
          <HeroSmall
            title="Case Study: E-commerce Platform"
            subtitle="Project Overview"
            description="A comprehensive case study of building a scalable e-commerce platform with modern technologies."
            actions={[
              {
                href: '/case-studies/ecommerce',
                text: 'Read Case Study',
                variant: 'outline'
              }
            ]}
            background={{
              type: 'gradient',
              gradient: {
                from: 'stone-800',
                to: 'stone-600',
                direction: 'to-r'
              }
            }}
            showBreadcrumb={true}
            breadcrumbItems={breadcrumbItems}
            showMeta={true}
            metaItems={metaItems}
            compact={false}
            ariaLabel="Case study hero section"
          />
        </div>
      </section>

      {/* Base Hero Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Base Hero - Custom Implementation
        </h2>
        <div className="rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
          <BaseHero
            variant="medium"
            title="Custom Hero Implementation"
            subtitle="Flexible Base Component"
            description="The base hero component provides maximum flexibility for custom implementations while maintaining consistency."
            actions={[
              {
                href: '/docs',
                text: 'Learn More',
                variant: 'default',
                icon: <ArrowRightIcon className="mr-2 h-4 w-4" />
              }
            ]}
            background={{
              type: 'pattern',
              pattern: '/assets/patterns/dots.svg',
              overlay: {
                color: 'rgba(0, 0, 0, 0.5)',
                opacity: 0.7
              }
            }}
            animate={true}
            animationDelay={0.2}
            ariaLabel="Custom hero implementation example"
          >
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-4 text-sm text-stone-300">
                <div className="flex items-center gap-1">
                  <StarIcon className="h-4 w-4" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <UsersIcon className="h-4 w-4" />
                  <span>100+ Clients</span>
                </div>
              </div>
            </div>
          </BaseHero>
        </div>
      </section>
    </div>
  );
}

export default HeroShowcase;
