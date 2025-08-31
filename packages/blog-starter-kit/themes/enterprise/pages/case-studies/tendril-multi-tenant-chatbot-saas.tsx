import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';
import { AppProvider } from '../../components/contexts/appContext';
import ModernHeader from '../../components/features/navigation/modern-header';
import Chatbot from '../../components/features/chatbot/Chatbot';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  DollarSign, 
  Users, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Calendar,
  Target,
  Zap,
  Award
} from 'lucide-react';

// Mock publication data for the case study
const mockPublication = {
  id: 'tendril-case-study',
  title: 'Tendril Multi-Tenant Chatbot SaaS',
  description: 'From Market Research to MVP Strategy',
  domain: 'mindware.hashnode.dev',
  favicon: '/favicon.ico',
  isTeam: false,
  url: 'https://mindware.hashnode.dev',
  ogMetaData: {
    image: '/og-image.jpg',
    title: 'Tendril Multi-Tenant Chatbot SaaS',
    description: 'From Market Research to MVP Strategy'
  },
  preferences: {
    logo: '/logo.png',
    darkMode: {
      logo: '/logo-dark.png'
    },
    navbarItems: []
  },
  author: {
    id: 'john-schibelli',
    name: 'John Schibelli',
    username: 'jschibelli',
    image: '/profile.jpg',
    bio: 'Full-stack developer and SaaS entrepreneur',
    location: 'United States',
    website: 'https://schibelli.dev',
    twitter: '@jschibelli',
    github: 'jschibelli',
    linkedin: 'jschibelli',
    followersCount: 1250
  }
};

export default function TendrilCaseStudy() {
  return (
    <AppProvider publication={mockPublication}>
      <Layout>
        <Head>
          <title>Tendril Multi-Tenant Chatbot SaaS: From Market Research to MVP Strategy – Case Study</title>
          <meta name="description" content="How we built a multi-tenant chatbot platform that achieved 47 first-month signups and $3.4k MRR by month 3. A complete case study covering market research, solution design, implementation, and results." />
          <meta name="keywords" content="chatbot, saas, multi-tenant, case study, startup, mvp, market research" />
        </Head>

        <ModernHeader publication={mockPublication} />

        <main className="min-h-screen bg-background">
          <Container>
            {/* Header Section */}
            <motion.div 
              className="mb-8 lg:mb-12 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="secondary" className="mb-4">
                  Case Study
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  Tendril Multi-Tenant Chatbot SaaS
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
                  From Market Research to MVP Strategy
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span>Published December 15, 2024</span>
                  <span>•</span>
                  <span>12 min read</span>
                  <span>•</span>
                  <span>SaaS, Chatbot, Startup</span>
                </div>
              </div>
            </motion.div>

            {/* Key Achievements Section */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Left Column - Text Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-100">A proven solution for good design</h3>
                    <p className="text-slate-300 leading-relaxed">
                      Our multi-tenant chatbot platform was engineered to directly address the critical pain points identified in the market. By focusing on transparent pricing, rapid deployment, and multi-client management, Tendril delivered tangible results that surpassed expectations.
                    </p>
                  </div>

                  {/* Right Column - Achievement Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/30 shadow-lg text-center">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">achieved</p>
                      <div className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">47</div>
                      <p className="text-slate-300 mt-2">First Month Sign-ups</p>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/30 shadow-lg text-center">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">reached</p>
                      <div className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">91%</div>
                      <p className="text-slate-300 mt-2">User Retention Rate</p>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/30 shadow-lg text-center">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">average</p>
                      <div className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">18 min</div>
                      <p className="text-slate-300 mt-2">Setup Time</p>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/30 shadow-lg text-center">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">generated</p>
                      <div className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">$3.4k</div>
                      <p className="text-slate-300 mt-2">MRR by Month 3</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Problem Statement Section */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-8">
                <h2 className="text-3xl font-bold text-slate-100 mb-6">The Problem</h2>
                <p className="text-slate-300 leading-relaxed">
                  The market for multi-tenant chatbot platforms was fragmented, with existing solutions offering limited features, complex pricing models, and steep learning curves. This made it difficult for businesses to scale their customer support operations efficiently and cost-effectively.
                </p>
              </div>
            </motion.div>

            {/* Solution Overview Section */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-8">
                <h2 className="text-3xl font-bold text-slate-100 mb-6">The Solution</h2>
                <p className="text-slate-300 leading-relaxed">
                  Tendril was designed to be a comprehensive, scalable, and user-friendly multi-tenant chatbot platform. Our approach involved:
                </p>
                <ul className="list-disc list-inside text-slate-300 mt-4 space-y-2">
                  <li>Market research to identify pain points and opportunities.</li>
                  <li>Solution design focusing on transparency, ease of use, and scalability.</li>
                  <li>Implementation of a robust, modular architecture.</li>
                  <li>Multi-client management and flexible deployment options.</li>
                  <li>Comprehensive analytics and reporting.</li>
                </ul>
              </div>
            </motion.div>

            {/* Implementation Details Section */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-8">
                <h2 className="text-3xl font-bold text-slate-100 mb-6">Implementation Details</h2>
                <p className="text-slate-300 leading-relaxed">
                  The Tendril platform was built using a modern tech stack including Next.js, TypeScript, Prisma, and PostgreSQL. We chose these technologies for their performance, scalability, and developer experience.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/30 shadow-lg text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Tech Stack</p>
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                      <DollarSign className="inline-block mr-2" />
                      <span>Next.js</span>
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                      <Users className="inline-block mr-2" />
                      <span>TypeScript</span>
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                      <Clock className="inline-block mr-2" />
                      <span>Prisma</span>
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                      <Zap className="inline-block mr-2" />
                      <span>PostgreSQL</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/30 shadow-lg text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Architecture</p>
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
                      <Target className="inline-block mr-2" />
                      <span>Microservices</span>
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
                      <ArrowRight className="inline-block mr-2" />
                      <span>Event-Driven</span>
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
                      <Calendar className="inline-block mr-2" />
                      <span>Scalable Infrastructure</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Results Section */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-8">
                <h2 className="text-3xl font-bold text-slate-100 mb-6">Results</h2>
                <p className="text-slate-300 leading-relaxed">
                  After launching Tendril, we achieved remarkable results in a short period.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/30 shadow-lg text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">achieved</p>
                    <div className="text-5xl font-bold bg-gradient-to-r from-green-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">47</div>
                    <p className="text-slate-300 mt-2">First Month Sign-ups</p>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/30 shadow-lg text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">reached</p>
                    <div className="text-5xl font-bold bg-gradient-to-r from-green-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">91%</div>
                    <p className="text-slate-300 mt-2">User Retention Rate</p>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/30 shadow-lg text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">average</p>
                    <div className="text-5xl font-bold bg-gradient-to-r from-green-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">18 min</div>
                    <p className="text-slate-300 mt-2">Setup Time</p>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/30 shadow-lg text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">generated</p>
                    <div className="text-5xl font-bold bg-gradient-to-r from-green-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">$3.4k</div>
                    <p className="text-slate-300 mt-2">MRR by Month 3</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Conclusion Section */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-8">
                <h2 className="text-3xl font-bold text-slate-100 mb-6">Conclusion</h2>
                <p className="text-slate-300 leading-relaxed">
                  Tendril's success demonstrates the power of a well-executed multi-tenant chatbot platform. By focusing on user experience, scalability, and transparency, we were able to deliver a product that not only met but exceeded the expectations of our users.
                </p>
                <p className="text-slate-300 leading-relaxed mt-4">
                  The platform's ability to handle multiple clients efficiently and its robust analytics capabilities have proven invaluable for our customers. We are proud of the results and look forward to continuing to innovate and improve Tendril.
                </p>
              </div>
            </motion.div>

            {/* Call-to-Action Section */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-8 text-center">
                <h2 className="text-3xl font-bold text-slate-100 mb-6">Ready to build your own multi-tenant chatbot platform?</h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Contact us today to learn more about Tendril and how we can help you transform your customer support operations.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                  Get in Touch
                </Button>
              </div>
                         </motion.div>
           </Container>
         </main>

         <Chatbot />
       </Layout>
     </AppProvider>
   );
 }
