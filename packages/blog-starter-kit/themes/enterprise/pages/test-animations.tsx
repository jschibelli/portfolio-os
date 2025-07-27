import React from 'react';
import { ThemeProvider } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Glow from '@/components/ui/glow';
import { Mockup, MockupFrame } from '@/components/ui/mockup';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function TestAnimations() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Animation & Styling Test</h1>
            <ThemeToggle />
          </div>

          {/* Animation Test Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Animation Classes</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="animate-appear">
                <CardHeader>
                  <CardTitle>Appear Animation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This card uses the animate-appear class</p>
                </CardContent>
              </Card>

              <Card className="animate-appear-zoom">
                <CardHeader>
                  <CardTitle>Zoom Animation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This card uses the animate-appear-zoom class</p>
                </CardContent>
              </Card>

              <Card className="fade-bottom">
                <CardHeader>
                  <CardTitle>Fade Bottom</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This card uses the fade-bottom class</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Glow Effects */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Glow Effects</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
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
            <h2 className="text-2xl font-semibold">Button Variants</h2>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="glow">Glow</Button>
            </div>
          </div>

          {/* Badge Variants */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Badge Variants</h2>
            <div className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>

          {/* Mockup Components */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Mockup Components</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Responsive Mockup</h4>
                <Mockup type="responsive" className="w-full">
                  <MockupFrame size="large">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-full h-48 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">Responsive Design</span>
                    </div>
                  </MockupFrame>
                </Mockup>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Mobile Mockup</h4>
                <Mockup type="mobile" className="w-full max-w-[200px] mx-auto">
                  <MockupFrame size="small">
                    <div className="bg-gradient-to-br from-green-500 to-blue-600 w-full h-48 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">Mobile App</span>
                    </div>
                  </MockupFrame>
                </Mockup>
              </div>
            </div>
          </div>

          {/* Color Utilities */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Color Utilities</h2>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="bg-brand text-brand-foreground p-4 rounded-lg text-center">
                <p className="font-medium">Brand</p>
              </div>
              <div className="bg-primary text-primary-foreground p-4 rounded-lg text-center">
                <p className="font-medium">Primary</p>
              </div>
              <div className="bg-secondary text-secondary-foreground p-4 rounded-lg text-center">
                <p className="font-medium">Secondary</p>
              </div>
              <div className="bg-accent text-accent-foreground p-4 rounded-lg text-center">
                <p className="font-medium">Accent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
} 