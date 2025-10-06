import { Metadata } from 'next';
import { ContactPageClient } from './contact-client';

export const metadata: Metadata = {
  title: 'Contact John Schibelli | Get In Touch',
  description: 'Ready to start your next project? Contact John Schibelli for expert front-end development services. Specializing in React, Next.js, TypeScript, and AI integration. Available for new opportunities.',
  keywords: ['contact', 'John Schibelli', 'hire', 'freelance', 'front-end developer', 'React', 'Next.js', 'TypeScript', 'web development'],
  authors: [{ name: 'John Schibelli' }],
  creator: 'John Schibelli',
  publisher: 'John Schibelli',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Contact John Schibelli | Get In Touch',
    description: 'Ready to start your next project? Contact John Schibelli for expert front-end development services. Specializing in React, Next.js, TypeScript, and AI integration.',
    url: 'https://johnschibelli.dev/contact',
    siteName: 'John Schibelli Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/assets/og.png',
        width: 1200,
        height: 630,
        alt: 'Contact John Schibelli - Senior Front-End Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact John Schibelli | Get In Touch',
    description: 'Ready to start your next project? Contact John Schibelli for expert front-end development services.',
    creator: '@johnschibelli',
    images: ['/assets/og.png'],
  },
  alternates: {
    canonical: 'https://johnschibelli.dev/contact',
  },
};

export default function ContactPage() {
<<<<<<< HEAD
  const [formData, setFormData] = useState({ name: '', email: '', company: '', projectType: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = (): string[] => {
    const errors: string[] = [];
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push('Valid email required');
    if (!formData.message.trim() || formData.message.trim().length < 10) errors.push('Provide project details (min 10 chars)');
    return errors;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');
    const errs = validate();
    if (errs.length) { setSubmitStatus('error'); setTimeout(() => setSubmitStatus('idle'), 4000); return; }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', company: '', projectType: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 4000);
    } catch (error) {
      console.error('Contact form submission error:', error);
      setIsSubmitting(false);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 4000);
    }
  };

  return (
    <AppProvider publication={defaultPublication as any}>
      <ModernHeader publication={defaultPublication} />

      <main className="min-h-screen bg-white dark:bg-stone-950">
        {/* Hero */}
        <section className="relative min-h-[380px] overflow-hidden bg-stone-50 py-12 md:py-16 dark:bg-stone-900">
          <div className="absolute inset-0 z-0">
            <Image src="/assets/hero/hero-bg4.png" alt="Hero background" fill priority className="object-cover" sizes="100vw" />
          </div>
          <div className="absolute inset-0 z-0 bg-stone-50/70 dark:bg-stone-900/70" />
          <div className="relative z-10">
            <Container className="px-4">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mx-auto max-w-5xl text-center">
                <h1 className="mb-6 text-5xl font-bold text-stone-900 md:text-6xl dark:text-stone-100">Let's Work
                  <br />
                  <span className="bg-gradient-to-r from-stone-600 to-stone-800 bg-clip-text text-transparent dark:from-stone-300 dark:to-stone-100">Together</span>
                </h1>
                <p className="mb-8 text-xl leading-relaxed text-stone-600 md:text-2xl dark:text-stone-400">I work with teams to build digital experiences that help achieve business goals and bring ideas to life.</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500 dark:text-stone-400">
                  <span className="inline-flex items-center gap-2"><MapPinIcon className="h-4 w-4" /> Northern New Jersey, USA</span>
                  <span className="inline-flex items-center gap-2"><MailIcon className="h-4 w-4" /> Remote & Local Development</span>
                </div>
              </motion.div>
            </Container>
          </div>
        </section>

        {/* Form + Info */}
        <section className="bg-white py-16 dark:bg-stone-950">
          <Container className="px-4">
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-2">
              {/* Form */}
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="space-y-8">
                <div>
                  <h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">Ready to Transform Your Vision?</h2>
                  <p className="mb-6 text-lg text-stone-600 dark:text-stone-400">Whether you're launching a startup, scaling an enterprise, or need to modernize your existing platform – let's discuss how we can work together to build something that meets your goals and supports your business growth.</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <Badge variant="outline" className="flex items-center gap-1"><SendIcon className="h-3 w-3" /> Free Consultation</Badge>
                    <Badge variant="outline" className="flex items-center gap-1"><MailIcon className="h-3 w-3" /> No Commitment</Badge>
                    <Badge variant="outline" className="flex items-center gap-1"><CheckCircleIcon className="h-3 w-3" /> Quick Response</Badge>
                  </div>
                </div>

                {submitStatus === 'success' ? (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-800"><SendIcon className="h-4 w-4 text-green-600 dark:text-green-400" /></div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Message Sent!</h3>
                        <p className="text-green-700 dark:text-green-300">Thanks — I’ll be in touch shortly.</p>
                      </div>
                    </div>
                  </div>
                ) : submitStatus === 'error' ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-800"><SendIcon className="h-4 w-4 text-red-600 dark:text-red-400" /></div>
                      <div>
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Check your inputs</h3>
                        <p className="text-red-700 dark:text-red-300">Please provide a name, valid email, and at least 10 characters.</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <form onSubmit={onSubmit} className="space-y-6" role="form" aria-label="Contact form">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">Name *</label>
                      <input id="name" name="name" value={formData.name} onChange={onChange} required className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100" placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">Email *</label>
                      <input id="email" name="email" type="email" value={formData.email} onChange={onChange} required className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company" className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">Company</label>
                    <input id="company" name="company" value={formData.company} onChange={onChange} className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100" placeholder="Optional" />
                  </div>
                  <div>
                    <label htmlFor="projectType" className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">Project type</label>
                    <select id="projectType" name="projectType" value={formData.projectType} onChange={onChange} className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100">
                      <option value="">Select</option>
                      <option value="web-app">Web Application</option>
                      <option value="website">Website</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="consulting">Consulting</option>
                      <option value="maintenance">Maintenance & Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">Project details *</label>
                    <textarea id="message" name="message" rows={6} value={formData.message} onChange={onChange} required className="w-full resize-none rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100" placeholder="Goals, timeline, budget, requirements..." />
                  </div>
                  <Button type="submit" disabled={isSubmitting} size="lg" className="w-full px-8 py-4 text-lg font-semibold">
                    {isSubmitting ? <span className="inline-flex items-center gap-2"><span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" /> Sending...</span> : <span className="inline-flex items-center gap-2">Send Message <SendIcon className="h-5 w-5" /></span>}
                  </Button>
                </form>
              </motion.div>

              {/* Info & Social */}
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="space-y-8">
                <div>
                  <h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">Why Choose John Schibelli?</h2>
                  <p className="text-lg text-stone-600 dark:text-stone-400">I'm a developer who works collaboratively with clients to support their digital transformation goals. Based in Northern New Jersey, I combine technical skills with business understanding to help deliver solutions that support your objectives.</p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10"><MailIcon className="h-6 w-6 text-primary" /></div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-stone-900 dark:text-stone-100">Professional Email</h3>
                      <a href="mailto:john@schibelli.dev" className="text-lg font-medium text-primary hover:text-primary/80 transition-colors duration-200">john@schibelli.dev</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800"><MapPinIcon className="h-6 w-6 text-stone-600 dark:text-stone-400" /></div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-stone-900 dark:text-stone-100">Northern New Jersey Development Services</h3>
                      <p className="text-stone-600 dark:text-stone-400">Serving clients worldwide with remote React and Next.js development</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">Expert Front-End Development Services</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">React Development</Badge>
                    <Badge variant="secondary">Next.js Applications</Badge>
                    <Badge variant="secondary">TypeScript Development</Badge>
                    <Badge variant="secondary">AI Integration</Badge>
                    <Badge variant="secondary">UI/UX Design</Badge>
                    <Badge variant="secondary">Technical Consulting</Badge>
                    <Badge variant="secondary">Performance Optimization</Badge>
                    <Badge variant="secondary">SEO Implementation</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">Connect With John Schibelli</h3>
                  <div className="flex items-center gap-4">
                    <a href="https://linkedin.com/in/johnschibelli" target="_blank" rel="noopener noreferrer" aria-label="Connect with John Schibelli on LinkedIn, external website, opens in new tab" className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                      <LinkedinIcon className="h-5 w-5 stroke-current" />
                    </a>
                    <a href="https://github.com/johnschibelli" target="_blank" rel="noopener noreferrer" aria-label="View John Schibelli's GitHub profile, external website, opens in new tab" className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                      <GithubIcon className="h-5 w-5 stroke-current" />
                    </a>
                    <a href="https://twitter.com/johnschibelli" target="_blank" rel="noopener noreferrer" aria-label="Follow John Schibelli on Twitter, external website, opens in new tab" className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                      <FacebookIcon className="h-5 w-5" />
                    </a>
                    <a href="https://bsky.app/profile/johnschibelli" target="_blank" rel="noopener noreferrer" aria-label="Follow John Schibelli on Bluesky, external website, opens in new tab" className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                      <BlueskyIcon className="h-5 w-5 stroke-current" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Additional SEO Content Section */}
        <section className="bg-stone-50 py-16 dark:bg-stone-900">
          <Container className="px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">Working Together on Next.js & React Development</h2>
              <div className="grid gap-8 md:grid-cols-2 text-left">
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-stone-900 dark:text-stone-100">15+ Years of Front-End Development Experience</h3>
                  <p className="text-stone-600 dark:text-stone-400">With over 15 years of experience in web development, I work with React and Next.js to build high-performance applications. My experience includes TypeScript, modern CSS frameworks, and AI integration to support user experiences.</p>
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-stone-900 dark:text-stone-100">Northern New Jersey Based, Globally Available</h3>
                  <p className="text-stone-600 dark:text-stone-400">Located in Northern New Jersey, I serve clients both locally and remotely worldwide. Whether you need a complete web application rebuild or consultation on your existing React project, I'm here to help.</p>
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-stone-900 dark:text-stone-100">Professional Service & Quality Code</h3>
                  <p className="text-stone-600 dark:text-stone-400">My focus is on delivering clean, maintainable code with excellent performance and SEO optimization for your business success. Quick response times and professional communication throughout the project.</p>
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-stone-900 dark:text-stone-100">Full-Stack Front-End Solutions</h3>
                  <p className="text-stone-600 dark:text-stone-400">From initial design to deployment, I provide comprehensive front-end development services including UI/UX design, performance optimization, accessibility compliance, and ongoing maintenance support.</p>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>

        <Chatbot />
        <Footer publication={defaultPublication} />
      </main>
    </AppProvider>
  );
}
=======
  return <ContactPageClient />;
}
>>>>>>> origin/issue-247-contact-resend-integration
