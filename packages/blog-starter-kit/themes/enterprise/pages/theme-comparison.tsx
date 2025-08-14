import React from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, Star, ArrowRight } from 'lucide-react';

// Rose theme colors
const roseColors = {
  primary: 'hsl(346.8 77.2% 49.8%)',
  primaryForeground: 'hsl(355.7 100% 97.3%)',
  ring: 'hsl(346.8 77.2% 49.8%)',
  border: 'hsl(346.8 77.2% 49.8% / 0.2)',
};

export default function ThemeComparison() {
  return (
    <>
      <Head>
        <title>Theme Comparison - Current vs Rose</title>
        <meta name="description" content="Compare the current theme with the Rose theme" />
      </Head>
      
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-foreground">Theme Comparison</h1>
            <p className="text-muted-foreground">Current Theme vs Rose Theme</p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Theme */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Current Theme (Zinc)</h2>
                <p className="text-muted-foreground">Using the default zinc color palette</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Primary Colors</CardTitle>
                  <CardDescription>Current theme color palette</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="h-12 bg-primary rounded-md mb-1"></div>
                      <p className="text-xs text-muted-foreground">Primary</p>
                    </div>
                    <div className="text-center">
                      <div className="h-12 bg-secondary rounded-md mb-1"></div>
                      <p className="text-xs text-muted-foreground">Secondary</p>
                    </div>
                    <div className="text-center">
                      <div className="h-12 bg-accent rounded-md mb-1"></div>
                      <p className="text-xs text-muted-foreground">Accent</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full">Primary Button</Button>
                    <Button variant="secondary" className="w-full">Secondary Button</Button>
                    <Button variant="outline" className="w-full">Outline Button</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Input placeholder="Enter your email" />
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Technology</Badge>
                      <Badge variant="outline">Design</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-primary" />
                    Featured Content
                  </CardTitle>
                  <CardDescription>Sample content with current theme</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    This is how your content would look with the current zinc-based theme.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Current</Badge>
                    <Button variant="ghost" size="sm">
                      Read More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rose Theme */}
            <div className="space-y-6" style={{ 
              '--primary': '346.8 77.2% 49.8%',
              '--primary-foreground': '355.7 100% 97.3%',
              '--ring': '346.8 77.2% 49.8%'
            } as React.CSSProperties}>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Rose Theme</h2>
                <p className="text-muted-foreground">Using the beautiful Rose color palette</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Primary Colors</CardTitle>
                  <CardDescription>Rose theme color palette</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="h-12 rounded-md mb-1" style={{ backgroundColor: roseColors.primary }}></div>
                      <p className="text-xs text-muted-foreground">Primary</p>
                    </div>
                    <div className="text-center">
                      <div className="h-12 bg-secondary rounded-md mb-1"></div>
                      <p className="text-xs text-muted-foreground">Secondary</p>
                    </div>
                    <div className="text-center">
                      <div className="h-12 bg-accent rounded-md mb-1"></div>
                      <p className="text-xs text-muted-foreground">Accent</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full" style={{ 
                      backgroundColor: roseColors.primary, 
                      color: roseColors.primaryForeground,
                      borderColor: roseColors.primary
                    }}>
                      Primary Button
                    </Button>
                    <Button variant="secondary" className="w-full">Secondary Button</Button>
                    <Button variant="outline" className="w-full" style={{ 
                      borderColor: roseColors.primary, 
                      color: roseColors.primary 
                    }}>
                      Outline Button
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Input placeholder="Enter your email" style={{ 
                      '--ring': '346.8 77.2% 49.8%',
                      borderColor: roseColors.border
                    } as React.CSSProperties} />
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Technology</Badge>
                      <Badge variant="outline">Design</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-5 w-5" style={{ color: roseColors.primary }} />
                    Featured Content
                  </CardTitle>
                  <CardDescription>Sample content with Rose theme</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    This is how your content would look with the beautiful Rose theme.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Rose</Badge>
                    <Button variant="ghost" size="sm" style={{ color: roseColors.primary }}>
                      Read More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Key Differences */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Key Differences</CardTitle>
                <CardDescription>What changes when switching to Rose theme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Color Changes</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Primary color changes from zinc gray to rose pink</li>
                      <li>• Buttons and interactive elements get a warm, inviting feel</li>
                      <li>• Links and accents become more vibrant</li>
                      <li>• Focus states use rose-colored rings</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Visual Impact</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• More modern and trendy appearance</li>
                      <li>• Better for creative and lifestyle content</li>
                      <li>• Creates a warmer, more approachable feel</li>
                      <li>• Stands out from typical gray/blue themes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Guide */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>How to Apply Rose Theme</CardTitle>
                <CardDescription>Steps to switch your blog to the Rose theme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">1. Update CSS Variables</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Replace the color variables in your <code className="bg-background px-1 rounded">styles/index.css</code> file:
                    </p>
                    <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
{`--primary: 346.8 77.2% 49.8%;
--primary-foreground: 355.7 100% 97.3%;
--ring: 346.8 77.2% 49.8%;`}
                    </pre>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">2. Update components.json</h4>
                    <p className="text-sm text-muted-foreground">
                      Change the <code className="bg-background px-1 rounded">baseColor</code> from &quot;zinc&quot; to &quot;rose&quot; in your components.json file.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">3. Regenerate Components</h4>
                    <p className="text-sm text-muted-foreground">
                      Run <code className="bg-background px-1 rounded">npx shadcn@latest add</code> to regenerate components with the new theme.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
