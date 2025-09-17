import { motion } from 'framer-motion';
import request from 'graphql-request';
import { ClockIcon, MailIcon, MapPinIcon, SendIcon, CheckCircleIcon, GlobeIcon } from 'lucide-react';
import { GetStaticProps } from 'next';
import { useState } from 'react';
import { AppProvider } from '../components/contexts/appContext';
import Chatbot from '../components/features/chatbot/Chatbot';
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
import { generateOrganizationStructuredData } from '../lib/structured-data';
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

	const validateForm = () => {
		const errors: string[] = [];
		
		if (!formData.name.trim()) {
			errors.push('Name is required');
		}
		
		if (!formData.email.trim()) {
			errors.push('Email is required');
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.push('Please enter a valid email address');
		}
		
		if (!formData.message.trim()) {
			errors.push('Project details are required');
		} else if (formData.message.trim().length < 10) {
			errors.push('Please provide more detailed project information (at least 10 characters)');
		}
		
		return errors;
	};

	const handleSubmit = async (e: React.FormEvent) => {
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
			// Simulate form submission (replace with actual form handling)
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			setIsSubmitting(false);
			setSubmitStatus('success');
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
					title={`Contact - ${publication.displayTitle || publication.title || 'John Schibelli'}`}
					description="Contact John Schibelli to discuss your next web development project. Get in touch for custom React, Next.js, and TypeScript solutions. Contact us for remote work and local projects."
					keywords={[
						'Contact',
						'Web Development',
						'Project Consultation',
						'Freelance Developer',
						'React Developer',
						'Next.js Developer',
						'TypeScript Developer',
						'Northern New Jersey',
						'Remote Work',
						'Project Quote',
					]}
					canonical="/contact"
					ogType="website"
					structuredData={generateOrganizationStructuredData({
						name: 'John Schibelli',
						description: 'Senior Front-End Developer providing web development services',
						url: 'https://johnschibelli.com',
						contactPoint: {
							telephone: '+1-555-0123',
							contactType: 'customer service',
							email: 'john@schibelli.dev',
						},
						address: {
							streetAddress: 'Northern New Jersey',
							addressLocality: 'New Jersey',
							addressRegion: 'NJ',
							postalCode: '07000',
							addressCountry: 'US',
						},
					})}
				/>
				<ModernHeader publication={publication} />

				<main className="min-h-screen bg-white dark:bg-stone-950">
					{/* Hero Section */}
					<section
						className="relative min-h-[400px] overflow-hidden bg-stone-50 py-12 md:py-16 dark:bg-stone-900"
						style={{
							backgroundImage: 'url(/assets/hero/hero-bg4.png)',
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
					>
						{/* Background Overlay */}
						<div className="absolute inset-0 z-0 bg-stone-50/70 dark:bg-stone-900/70"></div>
						{/* Content Overlay */}
						<div className="relative z-10">
							<Container className="px-4">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, ease: 'easeOut' }}
									className="mx-auto max-w-4xl text-center"
								>
									<h1 className="mb-6 text-5xl font-bold text-stone-900 md:text-6xl dark:text-stone-100">
										Let&apos;s Work Together
									</h1>
									<p className="mb-8 text-xl leading-relaxed text-stone-600 md:text-2xl dark:text-stone-400">
										Ready to bring your vision to life? I&apos;m here to help you create exceptional
										digital experiences.
									</p>
									<div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500 dark:text-stone-400">
										<div className="flex items-center gap-2">
											<MapPinIcon className="h-4 w-4" />
											<span>Northern New Jersey</span>
										</div>
										<div className="flex items-center gap-2">
											<ClockIcon className="h-4 w-4" />
											<span>Available for New Projects</span>
										</div>
										<div className="flex items-center gap-2">
											<MailIcon className="h-4 w-4" />
											<span>Remote & Local Work</span>
										</div>
									</div>
								</motion.div>
							</Container>
						</div>
					</section>

					{/* Contact Form & Info Section */}
					<section className="bg-white py-20 dark:bg-stone-950">
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
										<h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">
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
														Thank you for reaching out. I&apos;ll get back to you within 24 hours.
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
											Get In Touch
										</h2>
										<p className="text-lg text-stone-600 dark:text-stone-400">
											Based in Northern New Jersey, serving clients worldwide with remote
											development services.
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
												<p className="text-sm text-stone-500 dark:text-stone-500">
													Preferred contact method
												</p>
											</div>
										</div>

										{/* Response Time & Availability */}
										<div className="flex items-start gap-4">
											<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
												<CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
											</div>
											<div>
												<h3 className="mb-1 text-lg font-semibold text-stone-900 dark:text-stone-100">
													Response Time
												</h3>
												<p className="text-stone-600 dark:text-stone-400">
													24-hour response guarantee
												</p>
												<p className="text-sm text-stone-500 dark:text-stone-500">
													Currently accepting new projects
												</p>
											</div>
										</div>

										{/* Location & Timezone */}
										<div className="flex items-start gap-4">
											<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
												<MapPinIcon className="h-6 w-6 text-stone-600 dark:text-stone-400" />
											</div>
											<div>
												<h3 className="mb-1 text-lg font-semibold text-stone-900 dark:text-stone-100">
													Location & Timezone
												</h3>
												<p className="text-stone-600 dark:text-stone-400">
													Northern New Jersey, USA
												</p>
												<p className="text-sm text-stone-500 dark:text-stone-500">
													UTC-5 (Eastern Time) • Available for remote work worldwide
												</p>
											</div>
										</div>
									</div>

									{/* Services */}
									<div>
										<h3 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
											Services I Offer
										</h3>
										<div className="flex flex-wrap gap-2">
											<Badge
												variant="secondary"
											>
												Web Development
											</Badge>
											<Badge
												variant="secondary"
											>
												React & Next.js
											</Badge>
											<Badge
												variant="secondary"
											>
												TypeScript
											</Badge>
											<Badge
												variant="secondary"
											>
												UI/UX Design
											</Badge>
											<Badge
												variant="secondary"
											>
												Consulting
											</Badge>
											<Badge
												variant="secondary"
											>
												Maintenance
											</Badge>
										</div>
									</div>

									{/* Professional Social Media & Networking */}
									<div>
										<h3 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
											Professional Presence
										</h3>
										<div className="space-y-4">
											{/* LinkedIn - Professional Network */}
											<div className="flex items-center gap-4">
												<a
													href="https://linkedin.com/in/johnschibelli"
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Connect with John Schibelli on LinkedIn for professional networking, external website, opens in new tab"
													className="flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 p-3 text-blue-600 transition-all duration-200 hover:bg-blue-100 hover:scale-105 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
												>
													<LinkedinIcon className="h-5 w-5 stroke-current" />
												</a>
												<div>
													<p className="font-medium text-stone-900 dark:text-stone-100">LinkedIn</p>
													<p className="text-sm text-stone-600 dark:text-stone-400">Professional networking & career updates</p>
												</div>
											</div>

											{/* GitHub - Technical Portfolio */}
											<div className="flex items-center gap-4">
												<a
													href="https://github.com/jschibelli"
													target="_blank"
													rel="noopener noreferrer"
													aria-label="View John Schibelli's GitHub profile for technical projects and code samples, external website, opens in new tab"
													className="flex items-center justify-center rounded-full border border-stone-200 bg-stone-50 p-3 text-stone-700 transition-all duration-200 hover:bg-stone-100 hover:scale-105 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
												>
													<GithubIcon className="h-5 w-5 stroke-current" />
												</a>
												<div>
													<p className="font-medium text-stone-900 dark:text-stone-100">GitHub</p>
													<p className="text-sm text-stone-600 dark:text-stone-400">Open source projects & technical portfolio</p>
												</div>
											</div>

											{/* Twitter/X - Thought Leadership */}
											<div className="flex items-center gap-4">
												<a
													href="https://twitter.com/johnschibelli"
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Follow John Schibelli on Twitter for web development insights and thought leadership, external website, opens in new tab"
													className="flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 p-3 text-sky-600 transition-all duration-200 hover:bg-sky-100 hover:scale-105 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-400 dark:hover:bg-sky-900/30"
												>
													<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
														<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
													</svg>
												</a>
												<div>
													<p className="font-medium text-stone-900 dark:text-stone-100">Twitter/X</p>
													<p className="text-sm text-stone-600 dark:text-stone-400">Web development insights & industry thoughts</p>
												</div>
											</div>

											{/* Bluesky - Alternative Social */}
											<div className="flex items-center gap-4">
												<a
													href="https://bsky.app/profile/johnschibelli.bsky.social"
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Follow John Schibelli on Bluesky for tech discussions and updates, external website, opens in new tab"
													className="flex items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 p-3 text-cyan-600 transition-all duration-200 hover:bg-cyan-100 hover:scale-105 dark:border-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400 dark:hover:bg-cyan-900/30"
												>
													<BlueskyIcon className="h-5 w-5 stroke-current" />
												</a>
												<div>
													<p className="font-medium text-stone-900 dark:text-stone-100">Bluesky</p>
													<p className="text-sm text-stone-600 dark:text-stone-400">Tech discussions & community engagement</p>
												</div>
											</div>
										</div>
									</div>

									{/* Contact Preferences */}
									<div>
										<h3 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
											Contact Preferences
										</h3>
										<div className="space-y-3">
											<div className="flex items-center gap-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
													<MailIcon className="h-4 w-4 text-primary" />
												</div>
												<div>
													<p className="font-medium text-stone-900 dark:text-stone-100">Email Preferred</p>
													<p className="text-sm text-stone-600 dark:text-stone-400">Best for project discussions and detailed inquiries</p>
												</div>
											</div>
											<div className="flex items-center gap-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
													<GlobeIcon className="h-4 w-4 text-stone-600 dark:text-stone-400" />
												</div>
												<div>
													<p className="font-medium text-stone-900 dark:text-stone-100">Remote Collaboration</p>
													<p className="text-sm text-stone-600 dark:text-stone-400">Comfortable working across time zones and locations</p>
												</div>
											</div>
											<div className="flex items-center gap-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
													<CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
												</div>
												<div>
													<p className="font-medium text-stone-900 dark:text-stone-100">Quick Response</p>
													<p className="text-sm text-stone-600 dark:text-stone-400">24-hour response time for all inquiries</p>
												</div>
											</div>
										</div>
									</div>
								</motion.div>
							</div>
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
