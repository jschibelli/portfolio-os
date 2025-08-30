import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import CustomScrollArea from '../../shared/scroll-area';
import { Container } from '../../shared/container';
import { ModernPostHeader } from '../blog/modern-post-header';
import { MarkdownToHtml } from '../blog/markdown-to-html';
import { CaseStudyMarkdown } from './case-study-markdown';
import { PostTOC } from '../blog/post-toc';
import AboutAuthor from '../blog/about-author';
import { Subscribe } from '../newsletter/subscribe';
import { PostComments } from '../blog/post-comments';
import { PostFullFragment, PublicationFragment } from '../../../generated/graphql';
import { CASE_STUDY_SECTIONS, generateStandardizedTOC } from '../../../lib/case-study-template';

interface CaseStudyLayoutProps {
  post: PostFullFragment;
  publication: PublicationFragment;
  children?: React.ReactNode;
}

interface TOCItem {
  id: string;
  title: string;
  level: number;
  slug: string;
}

// Helper function to generate consistent IDs (same as in CaseStudyMarkdown)
const generateHeadingId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const CaseStudyLayout: React.FC<CaseStudyLayoutProps> = ({ 
  post, 
  publication, 
  children 
}) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [isTocVisible, setIsTocVisible] = useState(false);

  // Extract TOC items from post content
  useEffect(() => {
    // For case studies, always use the standardized structure
    const standardizedTOC = generateStandardizedTOC();
    const items = standardizedTOC.map(item => ({
      id: generateHeadingId(item.title),
      title: item.title,
      level: item.level,
      slug: generateHeadingId(item.title)
    }));
    
    setTocItems(items);
    console.log('Using standardized case study TOC:', items);
  }, [post]);

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }
    };

    if (tocItems.length > 0) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [tocItems]);

  // Handle mobile TOC toggle
  useEffect(() => {
    const handleResize = () => {
      setIsTocVisible(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (id: string) => {
    console.log('Attempting to scroll to:', id);
    const element = document.getElementById(id);
    if (element) {
      console.log('Found element, scrolling to:', id);
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.log('Element not found:', id);
      // List all elements with IDs for debugging
      const allElementsWithIds = document.querySelectorAll('[id]');
      console.log('All elements with IDs:', Array.from(allElementsWithIds).map(el => el.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile TOC Toggle */}
      <div className="lg:hidden fixed top-20 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsTocVisible(!isTocVisible)}
          className="bg-background/80 backdrop-blur-sm border-border/50"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Table of Contents
        </Button>
      </div>

      {/* Mobile TOC Overlay */}
      <AnimatePresence>
        {isTocVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsTocVisible(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-80 bg-background border-l border-border/50 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Table of Contents</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsTocVisible(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
              <CustomScrollArea className="h-[calc(100vh-120px)]">
                <nav className="space-y-2">
                  {tocItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToSection(item.id);
                        setIsTocVisible(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                        activeSection === item.id
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      } ${item.level === 3 ? 'ml-4 text-sm' : ''}`}
                    >
                      {item.title}
                    </button>
                  ))}
                </nav>
              </CustomScrollArea>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Container className="pt-10">
        <div className="flex gap-8">
          {/* Main Content */}
          <article className="flex-1 max-w-none">
            {/* Post Header */}
            <ModernPostHeader
              title={post.title}
              coverImage={post.coverImage?.url}
              date={post.publishedAt}
              author={post.author}
              readTimeInMinutes={post.readTimeInMinutes}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    #{tag.slug}
                  </Link>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {children || <CaseStudyMarkdown contentMarkdown={post.content.markdown} />}
            </div>

            {/* Footer CTA Slot */}
            <div className="mt-12">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Ready to Build Something Similar?
                  </h3>
                                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Let&apos;s discuss how we can bring your vision to life with a custom solution tailored to your needs.
                </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                      <Link href="/contact">
                        Start a Project
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/case-studies">
                        View More Case Studies
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* About Author */}
            <AboutAuthor />

            {/* Comments */}
            {!post.preferences.disableComments && post.comments.totalDocuments > 0 && (
              <PostComments />
            )}

            {/* Subscribe */}
            <Subscribe />
          </article>

          {/* Desktop TOC Sidebar */}
          {tocItems.length > 0 && (
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
                    <CustomScrollArea className="h-[calc(100vh-200px)]">
                      <nav className="space-y-2">
                        {tocItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                              activeSection === item.id
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            } ${item.level === 3 ? 'ml-4 text-sm' : ''}`}
                          >
                            {item.title}
                          </button>
                        ))}
                      </nav>
                    </CustomScrollArea>
                  </CardContent>
                </Card>
              </div>
            </aside>
          )}
        </div>
      </Container>
    </div>
  );
};
