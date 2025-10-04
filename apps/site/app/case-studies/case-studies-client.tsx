"use client";

import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';
import { Footer } from '../../components/shared/footer';
import Chatbot from '../../components/features/chatbot/Chatbot';
import { AppProvider } from '../../components/contexts/appContext';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';

export function CaseStudiesPageClient() {
  return (
    <Layout>
      <main className="min-h-screen bg-background">
        <Container className="px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-stone-900 dark:text-stone-100">
              Case Studies
            </h1>
            <p className="mb-8 text-lg text-stone-600 dark:text-stone-400">
              Detailed case studies of John Schibelli's front-end development projects
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
