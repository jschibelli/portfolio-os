import { motion } from 'framer-motion';
import request from 'graphql-request';
import { ClockIcon, MailIcon, MapPinIcon, SendIcon, StarIcon, CheckCircleIcon, GlobeIcon } from 'lucide-react';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import { AppProvider } from '../components/contexts/appContext';
import Chatbot from '../components/features/chatbot/Chatbot';
import { TrustSignals } from '../components/features/contact/TrustSignals';
import { CaseStudyHighlights } from '../components/features/contact/CaseStudyHighlights';
import { QuickStats } from '../components/features/contact/QuickStats';
import ModernHeader from '../components/features/navigation/modern-header';
import {
	BlueskySVG as BlueskyIcon,
	FacebookSVG as FacebookIcon,
	GithubSVG as GithubIcon,
	LinkedinSVG as LinkedinIcon,
} from '../components/icons';
import { Container } from '../components/shared/container';
import { Layout } from '../components/shared/layout';
import { SEOHead } from '../components/shared/seo-head';
import { Badge, Button } from '../components/ui';
import { generateLocalBusinessStructuredData } from '../lib/structured-data';
import { PublicationByHostDocument } from '../generated/graphql';

interface Props {
	publication: any;
}

export default function ContactPage({ publication }: Props) {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		company: '',
		projectType: '',
		message: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	/**
	 * Validates the contact form data and returns an array of error messages
	 * @returns Array of validation error messages
	 */
	const validateForm = (): string[] => {
		const errors: string[] = [];
		
		// Validate name field
		if (!formData.name.trim()) {
			errors.push('Name is required');
		}
		
		// Validate email field with regex pattern
		if (!formData.email.trim()) {
			errors.push('Email is required');
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.push('Please enter a valid email address');
		}
		
		// Validate message field with minimum length requirement
		if (!formData.message.trim()) {
			errors.push('Project details are required');
		} else if (formData.message.trim().length < 10) {
			errors.push('Please provide more detailed project information (at least 10 characters)');
		}
		
		return errors;
	};

	/**
	 * Handles form submission with validation and error handling
	 * @param e - Form submission event
	 */
	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();
		setSubmitStatus('idle');
		
		// Validate form before submission
		const validationErrors = validateForm();
		if (validationErrors.length > 0) {
			setSubmitStatus('error');
			console.error('Form validation errors:', validationErrors);
			// Reset error message after 5 seconds
			setTimeout(() => setSubmitStatus('idle'), 5000);
			return;
		}
		
		setIsSubmitting(true);

		try {
			// TODO: Replace with actual form submission endpoint
			// Simulate form submission for demo purposes
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			setIsSubmitting(false);
			setSubmitStatus('success');
			
			// Reset form data after successful submission
			setFormData({
				name: '',
				email: '',
				company: '',
				projectType: '',
				message: '',
			});

			// Reset success message after 5 seconds
			setTimeout(() => setSubmitStatus('idle'), 5000);
		} catch (error) {
			console.error('Form submission error:', error);
			setIsSubmitting(false);
			setSubmitStatus('error');
			// Reset error message after 5 seconds
			setTimeout(() => setSubmitStatus('idle'), 5000);
		}
	};

	return (
		<AppProvider publication={publication}>
			<Layout>
				<SEOHead
					title="Contact John Schibelli - Senior Front-End Developer | React & Next.js Expert"
					description="Get in touch with John Schibelli, a senior front-end developer with 15+ years experience. Specializing in React, Next.js, and AI integration. Quick response guaranteed."
					keywords={[
						'contact',
						'front-end developer',
						'React',
						'Next.js',
						'AI integration',
						'New Jersey',
						'freelance',
						'web development',
						'TypeScript',
						'UI/UX design',
						'consulting',
						'remote work',
						'project consultation',
						'senior developer',
					]}
					canonical="/contact"
					ogType="website"
					ogImage="/assets/hero/hero-bg4.png"
					twitterCard="summary_large_image"
					structuredData={generateLocalBusinessStructuredData({
						name: 'John Schibelli - Senior Front-End Developer',
						description: 'Senior Front-End Developer with 15+ years experience specializing in React, Next.js, and AI integration. Providing web development services and consulting.',
						url: 'https://johnschibelli.com',
						telephone: '+1-555-0123',
						email: 'john@schibelli.dev',
						address: {
							streetAddress: 'Northern New Jersey',
							addressLocality: 'New Jersey',
							addressRegion: 'NJ',
							postalCode: '07000',
							addressCountry: 'US',
						},
						openingHours: ['Mo-Fr 09:00-17:00'],
						priceRange: '$$',
						servedArea: ['New Jersey', 'New York', 'Remote'],
						sameAs: [
							'https://linkedin.com/in/johnschibelli',
							'https://github.com/johnschibelli',
							'https://twitter.com/johnschibelli',
						],
					})}
				/>
				<ModernHeader publication={publication} />

				<main className="min-h-screen bg-white dark:bg-stone-950">
					{/* Enhanced Hero Section */}
					<section
						className="relative min-h-[400px] overflow-hidden bg-stone-50 py-12 md:py-16 dark:bg-stone-900"
						aria-label="Contact page hero section"
					>
						{/* Background Image */}
						<div className="absolute inset-0 z-0">
							<Image
								src="/assets/hero/hero-bg4.png"
								alt="Professional web development workspace with modern technology setup"
								fill
								priority
								className="object-cover"
								sizes="100vw"
							/>
						</div>
						{/* Background Overlay */}
						<div className="absolute inset-0 z-0 bg-stone-50/70 dark:bg-stone-900/70" aria-hidden="true"></div>
						{/* Content Overlay */}
						<div className="relative z-10">
							<Container className="px-4">
								<motion.div
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, ease: 'easeOut' }}
									className="mx-auto max-w-5xl text-center"
								>
									<h1 className="mb-6 text-5xl font-bold text-stone-900 md:text-6xl dark:text-stone-100">
										Let's Build Something
										<br />
										<span className="bg-gradient-to-r from-stone-600 to-stone-800 bg-clip-text text-transparent dark:from-stone-300 dark:to-stone-100">
											Extraordinary
										</span>
									</h1>
									<p className="mb-8 text-xl leading-relaxed text-stone-600 md:text-2xl dark:text-stone-400">
										I craft digital experiences that turn visitors into customers and ideas into reality.
									</p>
									<div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500 dark:text-stone-400">
										<div className="flex items-center gap-2">
											<MapPinIcon className="h-4 w-4" aria-hidden="true" />
											<span>Northern New Jersey, USA</span>
										</div>
										<div className="flex items-center gap-2">
											<MailIcon className="h-4 w-4" aria-hidden="true" />
											<span>Remote & Local Development</span>
										</div>
									</div>
								</motion.div>
							</Container>
						</div>
					</section>

					{/* Contact Form & Info Section */}
					<section className="bg-white py-20 dark:bg-stone-950" aria-labelledby="contact-form-heading">
						<Container className="px-4">
							<div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2">
								{/* Contact Form */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.8, ease: 'easeOut' }}
									viewport={{ once: true }}
									className="space-y-8"
								>
									<div>
										<h2 id="contact-form-heading" className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">
											Ready to Transform Your Vision?
										</h2>
										<p className="mb-6 text-lg text-stone-600 dark:text-stone-400">
											Whether you're launching a startup, scaling an enterprise, or need to modernize your existing platform – let's discuss how we can build something that not only meets your goals but exceeds your expectations.
										</p>
										<div className="flex flex-wrap gap-3 text-sm">
											<Badge variant="outline" className="flex items-center gap-1">
												<SendIcon className="h-3 w-3" />
												Free Consultation
											</Badge>
											<Badge variant="outline" className="flex items-center gap-1">
												<MailIcon className="h-3 w-3" />
												No Commitment
											</Badge>
											<Badge variant="outline" className="flex items-center gap-1">
												<CheckCircleIcon className="h-3 w-3" />
												Quick Response
											</Badge>
										</div>
									</div>

									{submitStatus === 'success' ? (
										<motion.div
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20"
										>
											<div className="flex items-center gap-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
													<SendIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
												</div>
												<div>
													<h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
														Message Sent!
													</h3>
													<p className="text-green-700 dark:text-green-300">
														Thank you for reaching out. I&apos;ll get back to you soon.
													</p>
												</div>
											</div>
										</motion.div>
									) : submitStatus === 'error' ? (
										<motion.div
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20"
										>
											<div className="flex items-center gap-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-800">
													<SendIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
												</div>
												<div>
													<h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
														Validation Error
													</h3>
													<p className="text-red-700 dark:text-red-300">
														Please check your form inputs and try again.
													</p>
												</div>
											</div>
										</motion.div>
									) : (
										<form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Contact form">
											<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
												<div>
													<label
														htmlFor="name"
														className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
													>
														Name *
													</label>
													<input
														type="text"
														id="name"
														name="name"
														value={formData.name}
														onChange={handleInputChange}
														required
														aria-required="true"
														aria-describedby="name-error"
														className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
														placeholder="Your name"
													/>
												</div>
												<div>
													<label
														htmlFor="email"
														className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
													>
														Email *
													</label>
													<input
														type="email"
														id="email"
														name="email"
														value={formData.email}
														onChange={handleInputChange}
														required
														aria-required="true"
														aria-describedby="email-error"
														className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
														placeholder="your.email@example.com"
													/>
												</div>
											</div>

											<div>
												<label
													htmlFor="company"
													className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
												>
													Company
												</label>
												<input
													type="text"
													id="company"
													name="company"
													value={formData.company}
													onChange={handleInputChange}
													className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
													placeholder="Your company (optional)"
												/>
											</div>

											<div>
												<label
													htmlFor="projectType"
													className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
												>
													Project Type
												</label>
												<select
													id="projectType"
													name="projectType"
													value={formData.projectType}
													onChange={handleInputChange}
													className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
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
												<label
													htmlFor="message"
													className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
												>
													Project Details *
												</label>
												<textarea
													id="message"
													name="message"
													value={formData.message}
													onChange={handleInputChange}
													required
													aria-required="true"
													aria-describedby="message-error"
													rows={6}
													className="w-full resize-none rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
													placeholder="Tell me about your project, timeline, budget, and any specific requirements..."
												/>
											</div>

											<Button
												type="submit"
												disabled={isSubmitting}
												size="lg"
												aria-describedby="submit-status"
												className="w-full px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
											>
												{isSubmitting ? (
													<div className="flex items-center gap-2">
														<div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
									transition={{ duration: 0.8, ease: 'easeOut' }}
									viewport={{ once: true }}
									className="space-y-8"
								>
									<div>
										<h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">
											Why Choose John Schibelli?
										</h2>
										<p className="text-lg text-stone-600 dark:text-stone-400">
											I'm not just another developer – I'm your strategic partner in digital transformation. Based in Northern New Jersey, I combine technical excellence with business acumen to deliver solutions that drive real results.
										</p>
									</div>

									{/* Professional Contact Information */}
									<div className="space-y-6">
										{/* Primary Email Contact */}
										<div className="flex items-start gap-4">
											<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
												<MailIcon className="h-6 w-6 text-primary" />
											</div>
											<div>
												<h3 className="mb-1 text-lg font-semibold text-stone-900 dark:text-stone-100">
													Professional Email
												</h3>
												<a 
													href="mailto:john@schibelli.dev" 
													className="text-lg font-medium text-primary hover:text-primary/80 transition-colors duration-200"
												>
													john@schibelli.dev
												</a>
											</div>
										</div>


										{/* Location & Services */}
										<div className="flex items-start gap-4">
											<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
												<MapPinIcon className="h-6 w-6 text-stone-600 dark:text-stone-400" aria-hidden="true" />
											</div>
											<div>
												<h3 className="mb-1 text-lg font-semibold text-stone-900 dark:text-stone-100">
													Northern New Jersey Development Services
												</h3>
												<p className="text-stone-600 dark:text-stone-400">
													Serving clients worldwide with remote React and Next.js development
												</p>
											</div>
										</div>

									</div>

									{/* Services */}
									<div>
										<h3 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
											Expert Front-End Development Services
										</h3>
										<div className="flex flex-wrap gap-2">
											<Badge
												variant="secondary"
											>
												React Development
											</Badge>
											<Badge
												variant="secondary"
											>
												Next.js Applications
											</Badge>
											<Badge
												variant="secondary"
											>
												TypeScript Development
											</Badge>
											<Badge
												variant="secondary"
											>
												AI Integration
											</Badge>
											<Badge
												variant="secondary"
											>
												UI/UX Design
											</Badge>
											<Badge
												variant="secondary"
											>
												Technical Consulting
											</Badge>
											<Badge
												variant="secondary"
											>
												Performance Optimization
											</Badge>
											<Badge
												variant="secondary"
											>
												SEO Implementation
											</Badge>
										</div>
									</div>

									{/* Professional Social Media & Networking */}
									<div>
										<h3 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
											Connect With John Schibelli
										</h3>
										<div className="flex items-center gap-4">
											<a
												href="https://linkedin.com/in/johnschibelli"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Connect with John Schibelli on LinkedIn, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
											>
												<LinkedinIcon className="h-5 w-5 stroke-current" />
											</a>

											<a
												href="https://github.com/johnschibelli"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="View John Schibelli's GitHub profile, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
											>
												<GithubIcon className="h-5 w-5 stroke-current" />
											</a>

											<a
												href="https://twitter.com/johnschibelli"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Follow John Schibelli on Twitter, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
											>
												<FacebookIcon className="h-5 w-5" />
											</a>

											<a
												href="https://bsky.app/profile/johnschibelli"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Follow John Schibelli on Bluesky, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
											>
												<BlueskyIcon className="h-5 w-5 stroke-current" />
											</a>
										</div>
									</div>
								</motion.div>
							</div>
						</Container>
					</section>

					{/* Additional SEO Content Section */}
					<section className="bg-stone-50 py-16 dark:bg-stone-900" aria-labelledby="services-overview-heading">
						<Container className="px-4">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, ease: 'easeOut' }}
								viewport={{ once: true }}
								className="mx-auto max-w-4xl text-center"
							>
								<h2 id="services-overview-heading" className="mb-6 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">
									Why Choose John Schibelli for Your Next.js & React Development?
								</h2>
								<div className="grid gap-8 md:grid-cols-2">
									<div className="text-left">
										<h3 className="mb-3 text-xl font-semibold text-stone-900 dark:text-stone-100">
											15+ Years of Front-End Development Experience
										</h3>
										<p className="text-stone-600 dark:text-stone-400">
											With over 15 years of experience in web development, I specialize in creating high-performance React and Next.js applications. My expertise includes TypeScript, modern CSS frameworks, and AI integration for enhanced user experiences.
										</p>
									</div>
									<div className="text-left">
										<h3 className="mb-3 text-xl font-semibold text-stone-900 dark:text-stone-100">
											Northern New Jersey Based, Globally Available
										</h3>
										<p className="text-stone-600 dark:text-stone-400">
											Located in Northern New Jersey, I serve clients both locally and remotely worldwide. Whether you need a complete web application rebuild or consultation on your existing React project, I'm here to help.
										</p>
									</div>
									<div className="text-left">
										<h3 className="mb-3 text-xl font-semibold text-stone-900 dark:text-stone-100">
											Professional Service & Quality Code
										</h3>
										<p className="text-stone-600 dark:text-stone-400">
											My focus is on delivering clean, maintainable code with excellent performance and SEO optimization for your business success. Quick response times and professional communication throughout the project.
										</p>
									</div>
									<div className="text-left">
										<h3 className="mb-3 text-xl font-semibold text-stone-900 dark:text-stone-100">
											Full-Stack Front-End Solutions
										</h3>
										<p className="text-stone-600 dark:text-stone-400">
											From initial design to deployment, I provide comprehensive front-end development services including UI/UX design, performance optimization, accessibility compliance, and ongoing maintenance support.
										</p>
									</div>
								</div>
							</motion.div>
						</Container>
					</section>
				</main>
				<Chatbot />
			</Layout>
		</AppProvider>
	);
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT || 'https://gql.hashnode.com/';
	const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';

	try {
		const data = await request(GQL_ENDPOINT, PublicationByHostDocument, {
			host: host,
		});

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
	} catch (error) {
		console.error('Error fetching publication data:', error);
		// Return a fallback response to prevent the build from failing
		return {
			props: {
				publication: {
					id: 'fallback',
					title: 'John Schibelli - Senior Front-End Developer',
					displayTitle: 'John Schibelli - Senior Front-End Developer',
					descriptionSEO: 'Senior Front-End Developer with 15+ years of experience',
					url: 'https://mindware.hashnode.dev',
					posts: {
						totalDocuments: 0,
					},
					preferences: {
						logo: null,
					},
					author: {
						name: 'John Schibelli',
						profilePicture: null,
					},
					followersCount: 0,
					isTeam: false,
					favicon: null,
					ogMetaData: {
						image: null,
					},
				} as any,
			},
			revalidate: 1,
		};
	}
};
