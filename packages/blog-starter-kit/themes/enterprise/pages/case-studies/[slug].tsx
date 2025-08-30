import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Layout } from '../../components/shared/layout';
import ModernHeader from '../../components/features/navigation/modern-header';
import { Container } from '../../components/shared/container';
import { AppProvider } from '../../components/contexts/appContext';
import { CaseStudyMarkdown } from '../../components/features/case-studies/case-study-markdown';
import { Card, CardContent } from '../../components/ui/card';
import { ScrollArea } from '../../components/ui/scroll-area';
import { CASE_STUDY_SECTIONS, generateStandardizedTOC } from '../../lib/case-study-template';
import caseStudiesData from '../../data/case-studies.json';
import { siteConfig } from '../../config/site';
import Chatbot from '../../components/features/chatbot/Chatbot';
import { Avatar } from '../../components/shared/avatar';
import { Badge } from '../../components/ui/badge';
import { resizeImage } from '@starter-kit/utils/image';
import { DEFAULT_AVATAR } from '../../utils/const';

type CaseStudyMeta = typeof caseStudiesData[number];

interface Props {
  caseStudy: CaseStudyMeta & { content: string };
  publication: any;
}

export default function CaseStudyPage({ caseStudy, publication }: Props) {
  const [activeSection, setActiveSection] = useState<string>('');
  const tocItems = generateStandardizedTOC();

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>{caseStudy.title} – Case Study</title>
          <meta name="description" content={caseStudy.description} />
          <meta property="og:title" content={caseStudy.title} />
          <meta property="og:description" content={caseStudy.description} />
          {caseStudy.image && <meta property="og:image" content={caseStudy.image} />}
        </Head>

        <ModernHeader publication={publication} />

                 <main className="min-h-screen">
           <Container>
             <div className="py-8 lg:py-12">
               <div className="flex gap-6 lg:gap-8">
                 {/* Main content */}
                 <div className="flex-1 min-w-0">
                   {/* Header Section - Consistent with ModernPostHeader */}
                   <div className="mb-8 lg:mb-12">
                     <div className="space-y-6 text-center">
                       <div className="prose md:prose-xl dark:prose-invert prose-h1:text-center mx-auto max-w-screen-lg px-5">
                         <div className="flex items-center justify-center gap-2 mb-3 text-sm text-muted-foreground">
                           <span>Case Study</span>
                           <span>•</span>
                           <span>{new Date(caseStudy.publishedAt + 'T00:00:00').toLocaleDateString('en-US', { 
                             year: 'numeric', 
                             month: 'long', 
                             day: 'numeric' 
                           })}</span>
                         </div>
                         <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">{caseStudy.title}</h1>
                         <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">{caseStudy.description}</p>
                       </div>
                     </div>
                   </div>
                   
                                        {/* Content Section - Consistent with other pages */}
                     <div className="mx-auto w-full px-5 text-slate-600 dark:text-neutral-300 md:max-w-screen-md">
                       <div className="prose prose-base lg:prose-lg max-w-none dark:prose-invert">
                         <CaseStudyMarkdown contentMarkdown={caseStudy.content} />
                       </div>
                     </div>
                     
                     {/* Author Section */}
                     <div className="mx-auto w-full px-5 md:max-w-screen-md mb-5 mt-10">
                       <div className="flex-1">
                         <div className="flex flex-col items-start">
                           <h3 className="mb-6 w-full text-lg font-semibold text-foreground border-b border-border pb-2">
                             Written by
                           </h3>
                           <div className="flex w-full flex-col gap-8">
                             <div className="flex items-center gap-4">
                               <a
                                 href="https://hashnode.com/@mindware"
                                 className="block h-16 w-16 overflow-hidden rounded-full border dark:border-slate-800"
                                 target="_blank"
                                 rel="noopener noreferrer"
                               >
                                 <img
                                   src={resizeImage('https://cdn.hashnode.com/res/hashnode/image/upload/v1659089761812/fsOct5gl6.png', { w: 256, h: 256, c: 'face' })}
                                   alt={caseStudy.author}
                                   className="block w-full h-full object-cover"
                                 />
                               </a>
                               <div className="flex flex-col">
                                 <h4 className="text-lg font-semibold text-foreground">
                                   <a 
                                     href="https://hashnode.com/@mindware" 
                                     className="hover:text-primary transition-colors"
                                     target="_blank"
                                     rel="noopener noreferrer"
                                   >
                                     {caseStudy.author}
                                   </a>
                                 </h4>
                                 <p className="text-sm text-muted-foreground">
                                   Full-stack developer and technical consultant with expertise in SaaS platforms, AI integration, and scalable architectures.
                                 </p>
                                 <div className="flex flex-wrap gap-2 mt-2">
                                   {caseStudy.tags.map((tag) => (
                                     <Badge key={tag} variant="outline" className="text-xs">
                                       {tag}
                                     </Badge>
                                   ))}
                                 </div>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                 </div>
                {/* Sticky TOC */}
                <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
                  <div className="sticky top-20">
                    <Card className="border-border/50">
                      <CardContent className="p-4 lg:p-6">
                        <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">Table of Contents</h3>
                        <ScrollArea className="h-[calc(100vh-180px)]">
                          <nav className="space-y-1 lg:space-y-2">
                            {tocItems.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`w-full text-left px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors duration-200 text-sm lg:text-base ${
                                  activeSection === item.id
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                              >
                                {item.title}
                              </button>
                            ))}
                          </nav>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </aside>
              </div>
                         </div>
           </Container>
         </main>
         <Chatbot />
       </Layout>
     </AppProvider>
   );
 }

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = (caseStudiesData as CaseStudyMeta[]).map((cs) => ({ params: { slug: cs.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const meta = (caseStudiesData as CaseStudyMeta[]).find((cs) => cs.slug === slug);
  if (!meta) return { notFound: true };

  // Prefer content/case-studies, fallback to docs
  const primaryPath = path.join(process.cwd(), 'content', 'case-studies', `${slug}.md`);
  const fallbackPath = path.join(process.cwd(), 'docs', `${slug}.md`);

  let content = '';
  if (fs.existsSync(primaryPath)) {
    content = fs.readFileSync(primaryPath, 'utf8');
  } else if (fs.existsSync(fallbackPath)) {
    content = fs.readFileSync(fallbackPath, 'utf8');
  } else {
    return { notFound: true };
  }

  // Minimal publication stub for header (keeps existing layout happy)
  const publication = {
    title: 'Case Studies',
    displayTitle: 'Case Studies',
    logo: null,
    url: siteConfig.url,
    integrations: {},
  };

  return {
    props: {
      caseStudy: { ...meta, content },
      publication,
    },
  };
};
