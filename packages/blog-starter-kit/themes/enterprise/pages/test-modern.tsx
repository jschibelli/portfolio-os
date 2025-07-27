import React from 'react';
import { Container } from '../components/container';
import { ThemeProvider } from 'next-themes';
import ModernHeader from '../components/modern-header';
import ModernHero from '../components/modern-hero';
import ModernPostCard from '../components/modern-post-card';
import ModernNewsletter from '../components/modern-newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Glow from '@/components/ui/glow';
import { Mockup, MockupFrame } from '@/components/ui/mockup';
import Screenshot from '@/components/ui/screenshot';

export default function TestModern() {
  const mockPublication = {
    title: "Modern Blog",
    displayTitle: "Modern Blog",
    logo: null
  };

  const mockPost = {
    title: "Building Modern Web Applications",
    excerpt: "Learn how to build scalable and performant web applications using modern technologies and best practices.",
    coverImage: "/assets/blog/preview/cover.jpg",
    date: "2024-01-15",
    slug: "building-modern-web-applications",
    readTime: "8 min read",
    tags: ["Web Development", "React", "TypeScript"]
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <ModernHeader publication={mockPublication} />
        
        <Container className="space-y-16 py-8 px-4">
        {/* Hero Section */}
        <ModernHero
          title="Welcome to Our Modern Blog"
          subtitle="Built with Launch UI Components"
          description="Experience the future of web design with our modern blog built using cutting-edge Launch UI components and the latest web technologies."
          ctaText="Explore Posts"
          imageUrl="/assets/blog/preview/cover.jpg"
        />

        {/* Component Showcase */}
        <div className="space-y-12">
          <h2 className="text-3xl font-bold text-center">Component Showcase</h2>
          
          {/* Post Cards */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Modern Post Cards</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ModernPostCard {...mockPost} />
              <ModernPostCard 
                {...mockPost} 
                title="The Future of AI in Web Development"
                tags={["AI", "Machine Learning", "Future"]}
              />
              <ModernPostCard 
                {...mockPost} 
                title="Optimizing Performance in React Apps"
                tags={["Performance", "React", "Optimization"]}
              />
            </div>
          </div>

          {/* Mockup Components */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Mockup Components</h3>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Responsive Mockup</h4>
                <Mockup type="responsive" className="w-full">
                  <MockupFrame size="large">
                    <Screenshot
                      srcLight="/assets/blog/preview/cover.jpg"
                      alt="Responsive Design"
                      width={400}
                      height={300}
                      className="w-full h-auto"
                    />
                  </MockupFrame>
                </Mockup>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Mobile Mockup</h4>
                <Mockup type="mobile" className="w-full max-w-[200px] mx-auto">
                  <MockupFrame size="small">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-full h-48 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">Mobile App</span>
                    </div>
                  </MockupFrame>
                </Mockup>
              </div>
            </div>
          </div>

          {/* Glow Effects */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Glow Effects</h3>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="relative h-32 rounded-lg border border-border bg-card p-4">
                <Glow variant="top" />
                <div className="relative z-10 text-center">
                  <h4 className="font-medium">Top Glow</h4>
                  <p className="text-sm text-muted-foreground">Beautiful top glow effect</p>
                </div>
              </div>
              
              <div className="relative h-32 rounded-lg border border-border bg-card p-4">
                <Glow variant="center" />
                <div className="relative z-10 text-center">
                  <h4 className="font-medium">Center Glow</h4>
                  <p className="text-sm text-muted-foreground">Centered glow effect</p>
                </div>
              </div>
              
              <div className="relative h-32 rounded-lg border border-border bg-card p-4">
                <Glow variant="bottom" />
                <div className="relative z-10 text-center">
                  <h4 className="font-medium">Bottom Glow</h4>
                  <p className="text-sm text-muted-foreground">Bottom glow effect</p>
                </div>
              </div>
            </div>
          </div>

          {/* Button Variants */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Button Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Badge Variants */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Badge Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Newsletter Component</h3>
            <ModernNewsletter />
          </div>
        </div>
      </Container>
      </div>
    </ThemeProvider>
  );
} 