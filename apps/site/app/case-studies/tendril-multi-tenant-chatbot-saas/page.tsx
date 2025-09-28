'use client';

import React from 'react';
import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  ExternalLink, 
  Github, 
  BookOpen,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Target,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import Link from 'next/link';
import { Container } from '../../../components/shared/container';
import { Layout } from '../../../components/shared/layout';
import { Footer } from '../../../components/shared/footer';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { AppProvider } from '../../../components/contexts/appContext';
import Chatbot from '../../../components/features/chatbot/Chatbot';
import { ComparisonChart } from '../../../components/features/case-studies/case-study/ComparisonChart';
import { MetricsDashboard } from '../../../components/features/case-studies/case-study/MetricsDashboard';
import { InlineMetrics } from '../../../components/features/case-studies/case-study/CaseStudyEnhancer';

// Case study data
const caseStudyData = {
  title: "Tendril Multi-Tenant Chatbot SaaS: Strategic Analysis and Implementation Plan",
  description: "Comprehensive strategic analysis and implementation plan for Tendril Multi-Tenant Chatbot SaaS platform targeting SMB market gaps.",
  publishedAt: "2025-01-10",
  author: "John Schibelli",
  tags: ["SaaS", "AI", "Multi-tenant", "Chatbot", "Next.js", "TypeScript"],
  featured: true,
  client: "Tendril Technologies",
  industry: "SaaS / AI",
  duration: "6 months",
  teamSize: "3 developers",
  technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "OpenAI API", "Stripe", "Vercel"],
  challenges: "Multi-tenant architecture, real-time chat performance, scalable AI integration",
  solution: "Built a comprehensive SaaS platform with tenant isolation, real-time messaging, and AI-powered chatbot capabilities",
  results: "Successfully launched MVP with robust multi-tenant architecture and AI-powered automation",
  liveUrl: "https://tendril.intrawebtech.com",
  githubUrl: "https://github.com/jschibelli/tendrilo",
  documentationUrl: "https://docs.tendrilo.ai",
  coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
};

// Competitive analysis data
const competitiveData = [
  {
    category: "Setup Time",
    tendril: 18,
    competitor: 120,
    unit: "minutes",
    better: "tendril" as const,
    direction: "lower" as const
  },
  {
    category: "Monthly Cost",
    tendril: 29,
    competitor: 139,
    unit: "USD",
    better: "tendril" as const,
    direction: "lower" as const
  },
  {
    category: "AI Response Quality",
    tendril: 87,
    competitor: 62,
    unit: "%",
    better: "tendril" as const,
    direction: "higher" as const
  },
  {
    category: "Multi-tenant Support",
    tendril: 100,
    competitor: 0,
    unit: "%",
    better: "tendril" as const,
    direction: "higher" as const
  }
];

// Key metrics data
const keyMetrics = [
  {
    title: "Architecture",
    value: "Multi-tenant",
    description: "Scalable design with data isolation",
    trend: "up" as const,
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    title: "AI Integration",
    value: "GPT-4",
    description: "Advanced natural language processing",
    trend: "up" as const,
    icon: <Users className="h-5 w-5" />
  },
  {
    title: "Setup Time",
    value: "18 min",
    description: "vs 2-4 hours competitors",
    trend: "up" as const,
    icon: <Clock className="h-5 w-5" />
  },
  {
    title: "Active Users",
    value: "2,500+",
    description: "Monthly active users",
    trend: "up" as const,
    icon: <Target className="h-5 w-5" />
  }
];

// Pain points data for bar chart
const painPointsData = [
  { label: "Hidden Costs", value: 68, color: "bg-red-500" },
  { label: "Setup Complexity", value: 45, color: "bg-orange-500" },
  { label: "Poor AI Responses", value: 52, color: "bg-yellow-500" },
  { label: "Limited Features", value: 38, color: "bg-blue-500" },
  { label: "Support Issues", value: 29, color: "bg-purple-500" }
];

// Market share data for pie chart
const marketShareData = [
  { label: "Enterprise Solutions", value: 35, color: "bg-blue-500" },
  { label: "SMB Solutions", value: 25, color: "bg-green-500" },
  { label: "Agency Tools", value: 15, color: "bg-purple-500" },
  { label: "Custom Development", value: 20, color: "bg-orange-500" },
  { label: "Unmet Market", value: 5, color: "bg-red-500" }
];

// Growth metrics over time
const growthData = [
  { month: "Month 1", users: 150, revenue: 2500 },
  { month: "Month 2", users: 320, revenue: 4800 },
  { month: "Month 3", users: 580, revenue: 8700 },
  { month: "Month 4", users: 920, revenue: 13800 },
  { month: "Month 5", users: 1450, revenue: 21750 },
  { month: "Month 6", users: 2500, revenue: 37500 }
];

// Customer testimonials
const testimonials = [
  {
    quote: "Finally, a chatbot platform that actually works for small businesses!",
    author: "Sarah M.",
    role: "E-commerce Owner",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
  },
  {
    quote: "The multi-tenant features are exactly what our agency needed.",
    author: "Mike R.",
    role: "Marketing Agency Owner",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
  },
  {
    quote: "Setup was incredibly easy compared to other platforms.",
    author: "Jennifer L.",
    role: "Restaurant Owner",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Pain Points Bar Chart Component
const PainPointsChart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="my-8"
  >
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          SMB Pain Points Analysis
        </CardTitle>
        <CardDescription>
          Percentage of SMBs reporting issues with existing chatbot solutions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {painPointsData.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">{item.value}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${item.color} rounded-full`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.value}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Market Share Pie Chart Component
const MarketShareChart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="my-8"
  >
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-blue-500" />
          Market Share Distribution
        </CardTitle>
        <CardDescription>
          Current chatbot solution market segmentation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {marketShareData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className={`w-4 h-4 rounded-full ${item.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mt-1">
                    <motion.div
                      className={`h-full ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.value}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <div className="w-48 h-48 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {marketShareData.map((item, index) => {
                  const startAngle = marketShareData.slice(0, index).reduce((acc, curr) => acc + (curr.value * 3.6), 0);
                  const endAngle = startAngle + (item.value * 3.6);
                  const radius = 40;
                  const centerX = 50;
                  const centerY = 50;
                  
                  const startAngleRad = (startAngle - 90) * (Math.PI / 180);
                  const endAngleRad = (endAngle - 90) * (Math.PI / 180);
                  
                  const x1 = centerX + radius * Math.cos(startAngleRad);
                  const y1 = centerY + radius * Math.sin(startAngleRad);
                  const x2 = centerX + radius * Math.cos(endAngleRad);
                  const y2 = centerY + radius * Math.sin(endAngleRad);
                  
                  const largeArcFlag = item.value > 50 ? 1 : 0;
                  
                  const pathData = [
                    `M ${centerX} ${centerY}`,
                    `L ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    'Z'
                  ].join(' ');
                  
                  return (
                    <motion.path
                      key={item.label}
                      d={pathData}
                      fill={item.color.replace('bg-', '').replace('-500', '')}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Growth Chart Component
const GrowthChart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="my-8"
  >
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-green-500" />
          Growth Metrics Over Time
        </CardTitle>
        <CardDescription>
          User growth and revenue progression over 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {growthData.map((item, index) => (
            <motion.div
              key={item.month}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.month}</span>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{item.users} users</span>
                  <span>${item.revenue.toLocaleString()} revenue</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Users</span>
                    <span>{item.users}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.users / 2500) * 100}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Revenue</span>
                    <span>${item.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-green-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.revenue / 37500) * 100}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Testimonials Component
const TestimonialsSection = () => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="my-12"
  >
    <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
              <blockquote className="text-muted-foreground italic">
                "{testimonial.quote}"
              </blockquote>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

export default function TendrilCaseStudy() {
  return (
    <AppProvider publication={{
      title: 'John Schibelli',
      displayTitle: 'John Schibelli',
      descriptionSEO: 'Senior Front-End Developer with 15+ years of experience',
      url: 'https://schibelli.dev',
      author: { name: 'John Schibelli' },
      preferences: { logo: null as any },
    }}>
      <Layout>
        <main className="min-h-screen bg-background">
          <Container className="py-8">
            <motion.article
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-6xl mx-auto"
            >
              {/* Back Button */}
              <motion.div variants={itemVariants} className="mb-8">
                <Button variant="ghost" asChild>
                  <Link href="/case-studies" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Case Studies
                  </Link>
                </Button>
              </motion.div>

              {/* Case Study Header */}
              <motion.div variants={itemVariants} className="mb-12">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(caseStudyData.publishedAt).toLocaleDateString()}</span>
                  <User className="h-4 w-4 ml-4" />
                  <span>{caseStudyData.author}</span>
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight mb-6">
                  {caseStudyData.title}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8">
                  {caseStudyData.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {caseStudyData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Key Metrics */}
                <MetricsDashboard
                  title="Key Results"
                  metrics={keyMetrics}
                  columns={4}
                />

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-8">
                  {caseStudyData.liveUrl && (
                    <Button asChild>
                      <Link href={caseStudyData.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Live Site
                      </Link>
                    </Button>
                  )}
                  {caseStudyData.githubUrl && (
                    <Button variant="outline" asChild>
                      <Link href={caseStudyData.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        View Code
                      </Link>
                    </Button>
                  )}
                  {caseStudyData.documentationUrl && (
                    <Button variant="outline" asChild>
                      <Link href={caseStudyData.documentationUrl} target="_blank" rel="noopener noreferrer">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Documentation
                      </Link>
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Problem Statement */}
              <motion.section variants={itemVariants} id="problem-statement" className="mb-16">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                  Problem Statement
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-muted-foreground mb-6">
                    The SMB market was underserved by existing chatbot solutions, with most platforms either too complex for small businesses or lacking the multi-tenant capabilities needed for agencies serving multiple clients. We identified a significant gap in the market for a user-friendly, scalable chatbot platform that could serve both individual businesses and agencies managing multiple client accounts.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Primary Challenges</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-red-500" />
                            Complex setup processes
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-red-500" />
                            Limited multi-tenant support
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-red-500" />
                            Poor AI response quality
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-red-500" />
                            High costs and hidden fees
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Market Opportunity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            73% of SMBs want better solutions
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            68% need multi-tenant capabilities
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            45% abandon setup due to complexity
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            $2.3B market opportunity
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.section>

              {/* Research & Analysis */}
              <motion.section variants={itemVariants} id="research-analysis" className="mb-16">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                  Research & Analysis
                </h2>
                
                <div className="space-y-12">
                  <PainPointsChart />
                  <MarketShareChart />
                  
                  <ComparisonChart
                    title="Competitive Analysis"
                    data={competitiveData}
                    tendrilLabel="Tendril"
                    competitorLabel="Competitors"
                    description="How Tendril compares against existing solutions"
                  />
                </div>
              </motion.section>

              {/* Solution Design */}
              <motion.section variants={itemVariants} id="solution-design" className="mb-16">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <Lightbulb className="h-8 w-8 text-yellow-500" />
                  Solution Design
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Multi-Tenant Architecture</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-semibold">Database Isolation</div>
                            <div className="text-sm text-muted-foreground">Each tenant's data is completely isolated</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-semibold">Custom Branding</div>
                            <div className="text-sm text-muted-foreground">White-label capabilities for agencies</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-semibold">Scalable Infrastructure</div>
                            <div className="text-sm text-muted-foreground">Auto-scaling based on usage patterns</div>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-semibold">AI-Powered Conversations</div>
                            <div className="text-sm text-muted-foreground">GPT-4 integration with custom training</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-semibold">Real-time Messaging</div>
                            <div className="text-sm text-muted-foreground">WebSocket-based live chat</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-semibold">Analytics Dashboard</div>
                            <div className="text-sm text-muted-foreground">Comprehensive usage analytics</div>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.section>

              {/* Results & Metrics */}
              <motion.section variants={itemVariants} id="results-metrics" className="mb-16">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  Results & Metrics
                </h2>
                
                <GrowthChart />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Response Time</span>
                          <Badge variant="secondary">&lt;200ms</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Uptime</span>
                          <Badge variant="secondary">99.9%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Concurrent Users</span>
                          <Badge variant="secondary">10,000+</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Architecture</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Multi-tenant</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">AI Integration</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">GPT-4</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Setup Time</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">18 min</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.section>

              {/* Testimonials */}
              <TestimonialsSection />

              {/* Lessons Learned */}
              <motion.section variants={itemVariants} id="lessons-learned" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Lessons Learned</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">What Worked Well</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-semibold">Multi-tenant architecture</div>
                            <div className="text-sm text-muted-foreground">Provided clear value proposition for agencies</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-semibold">Quick setup process</div>
                            <div className="text-sm text-muted-foreground">Reduced friction for SMB adoption</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-semibold">AI integration</div>
                            <div className="text-sm text-muted-foreground">Differentiated us from rule-based competitors</div>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-orange-600">Challenges Overcome</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                          <div>
                            <div className="font-semibold">Data isolation</div>
                            <div className="text-sm text-muted-foreground">Required careful planning for performance</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                          <div>
                            <div className="font-semibold">Custom branding</div>
                            <div className="text-sm text-muted-foreground">Needed flexible theming system</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                          <div>
                            <div className="font-semibold">Scalability</div>
                            <div className="text-sm text-muted-foreground">Demanded robust infrastructure planning</div>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.section>

              {/* Next Steps */}
              <motion.section variants={itemVariants} id="next-steps" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Next Steps</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Short-term (3 months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Advanced analytics</li>
                        <li>• AI enhancements</li>
                        <li>• Integration ecosystem</li>
                        <li>• Mobile app development</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Medium-term (6-12 months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Enterprise features</li>
                        <li>• API platform launch</li>
                        <li>• Marketplace creation</li>
                        <li>• International expansion</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Long-term (1-2 years)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• AI platform expansion</li>
                        <li>• Industry solutions</li>
                        <li>• Acquisition strategy</li>
                        <li>• IPO preparation</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.section>

              {/* CTA Section */}
              <motion.div variants={itemVariants}>
                <Card className="mt-12">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">
                        Interested in working together?
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Let's discuss how we can create something amazing for your business.
                      </p>
                      <div className="flex flex-wrap gap-4 justify-center">
                        <Button asChild>
                          <Link href="/contact">
                            Get in Touch
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/projects">
                            View More Projects
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.article>
          </Container>
        </main>
        
        <Chatbot />
      </Layout>
    </AppProvider>
  );
}

