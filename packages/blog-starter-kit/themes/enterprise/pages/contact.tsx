import { GetStaticProps } from 'next';
import Head from 'next/head';
import request from 'graphql-request';
import { motion } from 'framer-motion';
import { Container } from '../components/container';
import { AppProvider } from '../components/contexts/appContext';
import { Footer } from '../components/footer';
import { Layout } from '../components/layout';
import ModernHeader from '../components/modern-header';
import { PublicationByHostDocument } from '../generated/graphql';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  MailIcon, 
  MapPinIcon, 
  ClockIcon, 
  SendIcon
} from 'lucide-react';
import { FacebookSVG as FacebookIcon, GithubSVG as GithubIcon, LinkedinSVG as LinkedinIcon, BlueskySVG as BlueskyIcon, RssSVG as RssIcon } from '../components/icons';
import { useState } from 'react';

interface Props {
  publication: any;
}

export default function ContactPage({ publication }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        projectType: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 2000);
  };

  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>
            {publication.displayTitle || publication.title} - Contact
          </title>
          <meta name="description" content="Get in touch to discuss your next project. Based in Northern New Jersey, available for remote work and local projects." />
          <meta property="og:title" content={`${publication.displayTitle || publication.title} - Contact`} />
          <meta property="og:description" content="Get in touch to discuss your next project. Based in Northern New Jersey, available for remote work and local projects." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${publication.url}/contact`} />
          <meta name="twitter:title" content={`${publication.displayTitle || publication.title} - Contact`} />
          <meta name="twitter:description" content="Get in touch to discuss your next project. Based in Northern New Jersey, available for remote work and local projects." />
        </Head>
        <ModernHeader publication={publication} />
        
        <main className="min-h-screen bg-white dark:bg-stone-950">
          {/* Hero Section */}
          <section 
            className="py-12 md:py-16 relative bg-stone-50 dark:bg-stone-900 overflow-hidden min-h-[400px]"
            style={{
              backgroundImage: 'url(/assets/hero/hero-bg4.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-stone-50/70 dark:bg-stone-900/70 z-0"></div>
            {/* Content Overlay */}
            <div className="relative z-10">
            <Container className="px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center max-w-4xl mx-auto"
              >
                                 <h1 className="text-5xl md:text-6xl font-bold text-stone-900 dark:text-stone-100 mb-6">
                   Let&apos;s Work Together
                 </h1>
                <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 mb-8 leading-relaxed">
                                     Ready to bring your vision to life? I&apos;m here to help you create exceptional digital experiences.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500 dark:text-stone-400">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span>Northern New Jersey</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>Available for New Projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MailIcon className="w-4 h-4" />
                    <span>Remote & Local Work</span>
                  </div>
                </div>
              </motion.div>
            </Container>
            </div>
          </section>

          {/* Contact Form & Info Section */}
          <section className="py-20 bg-white dark:bg-stone-950">
            <Container className="px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                      Start Your Project
                    </h2>
                    <p className="text-lg text-stone-600 dark:text-stone-400">
                      Tell me about your project and I&apos;ll get back to you within 24 hours.
                    </p>
                  </div>

                  {submitStatus === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                          <SendIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                            Message Sent!
                          </h3>
                          <p className="text-green-700 dark:text-green-300">
                            Thank you for reaching out. I&apos;ll get back to you within 24 hours.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-colors"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-colors"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-colors"
                          placeholder="Your company (optional)"
                        />
                      </div>

                      <div>
                        <label htmlFor="projectType" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                          Project Type
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-colors"
                        >
                          <option value="">Select project type</option>
                          <option value="web-app">Web Application</option>
                          <option value="website">Website</option>
                          <option value="ecommerce">E-commerce</option>
                          <option value="consulting">Consulting</option>
                          <option value="maintenance">Maintenance & Support</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                          Project Details *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-colors resize-none"
                          placeholder="Tell me about your project, timeline, budget, and any specific requirements..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        size="lg"
                        className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Sending Message...
                          </div>
                        ) : (
                          <>
                            Send Message
                            <SendIcon className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                      Get In Touch
                    </h2>
                    <p className="text-lg text-stone-600 dark:text-stone-400">
                      Based in Northern New Jersey, serving clients worldwide with remote development services.
                    </p>
                  </div>

                  {/* Location & Availability */}
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPinIcon className="w-6 h-6 text-stone-600 dark:text-stone-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-1">
                          Location
                        </h3>
                        <p className="text-stone-600 dark:text-stone-400">
                          Northern New Jersey, USA
                        </p>
                        <p className="text-sm text-stone-500 dark:text-stone-500">
                          Available for remote work worldwide
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ClockIcon className="w-6 h-6 text-stone-600 dark:text-stone-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-1">
                          Availability
                        </h3>
                        <p className="text-stone-600 dark:text-stone-400">
                          Available for new projects
                        </p>
                        <p className="text-sm text-stone-500 dark:text-stone-500">
                          Response within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
                      Services I Offer
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        Web Development
                      </Badge>
                      <Badge variant="secondary" className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        React & Next.js
                      </Badge>
                      <Badge variant="secondary" className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        TypeScript
                      </Badge>
                      <Badge variant="secondary" className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        UI/UX Design
                      </Badge>
                      <Badge variant="secondary" className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        Consulting
                      </Badge>
                      <Badge variant="secondary" className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        Maintenance
                      </Badge>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
                      Connect With Me
                    </h3>
                    <div className="flex items-center gap-4">
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Find us on Facebook, external website, opens in new tab"
                        className="flex items-center justify-center rounded-full border border-stone-200 p-3 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        <FacebookIcon className="h-5 w-5" />
                      </a>
                      
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Find us on Github, external website, opens in new tab"
                        className="flex items-center justify-center rounded-full border border-stone-200 p-3 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        <GithubIcon className="h-5 w-5 stroke-current" />
                      </a>

                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Find us on Linkedin, external website, opens in new tab"
                        className="flex items-center justify-center rounded-full border border-stone-200 p-3 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        <LinkedinIcon className="h-5 w-5 stroke-current" />
                      </a>

                      <a
                        href="https://bsky.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Find us on Bluesky, external website, opens in new tab"
                        className="flex items-center justify-center rounded-full border border-stone-200 p-3 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        <BlueskyIcon className="h-5 w-5 stroke-current" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Container>
          </section>
        </main>
        <Footer />
      </Layout>
    </AppProvider>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await request(
    process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT,
    PublicationByHostDocument,
    {
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    },
  );

  const publication = data.publication;
  if (!publication) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      publication,
    },
    revalidate: 1,
  };
};
