import React from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, Star, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

// Rose theme colors
const roseColors = {
  primary: 'hsl(346.8 77.2% 49.8%)',
  primaryForeground: 'hsl(355.7 100% 97.3%)',
  ring: 'hsl(346.8 77.2% 49.8%)',
  border: 'hsl(346.8 77.2% 49.8% / 0.2)',
};

export default function RoseSimpleDemo() {
  return (
    <>
      <Head>
        <title>Rose Theme Demo - Mindware Blog</title>
        <meta name="description" content="Preview of the Rose color theme for the Mindware blog" />
      </Head>
      
      <div className="min-h-screen bg-background" style={{
        '--primary': '346.8 77.2% 49.8%',
        '--primary-foreground': '355.7 100% 97.3%',
        '--ring': '346.8 77.2% 49.8%',
      } as React.CSSProperties}>
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-foreground">Mindware Blog</h1>
                <Badge variant="secondary" style={{ 
                  backgroundColor: roseColors.primary, 
                  color: roseColors.primaryForeground 
                }}>
                  Rose Theme
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="mb-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                Welcome to the <span style={{ color: roseColors.primary }}>Rose Theme</span> Demo
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                This is a preview of how your Mindware blog would look with the beautiful Rose color palette from shadcn/ui.
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg" style={{ 
                  backgroundColor: roseColors.primary, 
                  color: roseColors.primaryForeground,
                  borderColor: roseColors.primary
                }}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" style={{ 
                  borderColor: roseColors.primary,
                  color: roseColors.primary
                }}>
                  Learn More
                </Button>
              </div>
            </div>
          </section>

          {/* Color Palette Showcase */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Primary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-16 rounded-md mb-2" style={{ backgroundColor: roseColors.primary }}></div>
                  <p className="text-xs text-muted-foreground">Rose 500</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Secondary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-16 bg-secondary rounded-md mb-2"></div>
                  <p className="text-xs text-muted-foreground">Gray 100</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Accent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-16 bg-accent rounded-md mb-2"></div>
                  <p className="text-xs text-muted-foreground">Gray 100</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Destructive</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-16 bg-destructive rounded-md mb-2"></div>
                  <p className="text-xs text-muted-foreground">Red 500</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Component Showcase */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">UI Components</h3>
            
            {/* Buttons */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>All button variants with Rose theme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button style={{ 
                    backgroundColor: roseColors.primary, 
                    color: roseColors.primaryForeground,
                    borderColor: roseColors.primary
                  }}>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline" style={{ 
                    borderColor: roseColors.primary,
                    color: roseColors.primary
                  }}>Outline</Button>
                  <Button variant="ghost" style={{ color: roseColors.primary }}>Ghost</Button>
                  <Button variant="link" style={{ color: roseColors.primary }}>Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" style={{ 
                    backgroundColor: roseColors.primary, 
                    color: roseColors.primaryForeground 
                  }}>Small</Button>
                  <Button size="default" style={{ 
                    backgroundColor: roseColors.primary, 
                    color: roseColors.primaryForeground 
                  }}>Default</Button>
                  <Button size="lg" style={{ 
                    backgroundColor: roseColors.primary, 
                    color: roseColors.primaryForeground 
                  }}>Large</Button>
                  <Button size="icon" style={{ 
                    backgroundColor: roseColors.primary, 
                    color: roseColors.primaryForeground 
                  }}>
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Form Elements */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>Input fields and form controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Enter your name" style={{ 
                      '--ring': '346.8 77.2% 49.8%',
                      borderColor: roseColors.border
                    } as React.CSSProperties} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="Enter your email" style={{ 
                      '--ring': '346.8 77.2% 49.8%',
                      borderColor: roseColors.border
                    } as React.CSSProperties} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea 
                    placeholder="Enter your message" 
                    className="flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ 
                      '--ring': '346.8 77.2% 49.8%',
                      borderColor: roseColors.border
                    } as React.CSSProperties}
                  />
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

            {/* Cards and Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5" style={{ color: roseColors.primary }} />
                    Featured Post
                  </CardTitle>
                  <CardDescription>Latest insights and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Discover the latest trends in web development and design with our comprehensive guide.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Technology</Badge>
                    <Button variant="ghost" size="sm" style={{ color: roseColors.primary }}>
                      Read More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-5 w-5" style={{ color: roseColors.primary }} />
                    Newsletter
                  </CardTitle>
                  <CardDescription>Stay updated with our latest posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Input placeholder="Enter your email" style={{ 
                      '--ring': '346.8 77.2% 49.8%',
                      borderColor: roseColors.border
                    } as React.CSSProperties} />
                    <Button className="w-full" style={{ 
                      backgroundColor: roseColors.primary, 
                      color: roseColors.primaryForeground 
                    }}>Subscribe</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact Info */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Get in touch with us</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Mail className="mr-1 h-4 w-4" style={{ color: roseColors.primary }} />
                      <span>contact@mindware.com</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-1 h-4 w-4" style={{ color: roseColors.primary }} />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" style={{ color: roseColors.primary }} />
                      <span>San Francisco, CA</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: roseColors.primary }}>1,234</div>
                      <div className="text-sm text-muted-foreground">Total Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: roseColors.primary }}>56.7K</div>
                      <div className="text-sm text-muted-foreground">Readers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: roseColors.primary }}>98%</div>
                      <div className="text-sm text-muted-foreground">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <footer className="border-t bg-card mt-12">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Mindware Blog</h3>
                <p className="text-sm text-muted-foreground">
                  Built with Next.js, Tailwind CSS, and shadcn/ui Rose theme
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="ghost" size="sm" style={{ color: roseColors.primary }}>About</Button>
                  <Button variant="ghost" size="sm" style={{ color: roseColors.primary }}>Contact</Button>
                  <Button variant="ghost" size="sm" style={{ color: roseColors.primary }}>Privacy</Button>
                  <Button variant="ghost" size="sm" style={{ color: roseColors.primary }}>Terms</Button>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
