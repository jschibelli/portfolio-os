"use client";

export const dynamic = 'force-dynamic';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Layout } from '../../components/shared/layout';
import { Container } from '../../components/shared/container';
import Chatbot from '../../components/features/chatbot/Chatbot';
import ProjectCard, { Project } from '../../components/features/portfolio/project-card';
import AudienceSpecificCTA from '../../components/features/cta/audience-specific-cta';
import EnhancedCTASection from '../../components/features/cta/enhanced-cta-section';

import { allProjects as projectMetaList } from '../../data/projects';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';

export function ProjectsPageClient() {
  // All the existing projects page logic would go here
  // For now, I'll create a simple placeholder
  return (
    <Layout>
      <main className="min-h-screen bg-background">
        <Container className="px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-stone-900 dark:text-stone-100">
              Projects
            </h1>
            <p className="mb-8 text-lg text-stone-600 dark:text-stone-400">
              Explore John Schibelli's portfolio of front-end development projects
            </p>
            <Button asChild>
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </Container>
      </main>
      <Chatbot />
    </Layout>
  );
}
