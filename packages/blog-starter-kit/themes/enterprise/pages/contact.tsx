import { motion } from 'framer-motion';
import request from 'graphql-request';
import { ClockIcon, MailIcon, MapPinIcon, SendIcon, StarIcon, CheckCircleIcon, ZapIcon, DollarSignIcon, ShieldIcon, AlertCircleIcon } from 'lucide-react';
import { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
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
		budget: '',
		message: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [formProgress, setFormProgress] = useState(0);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
		
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
		
		// Update form progress
		updateFormProgress();
	};

	// Calculate form progress based on filled fields
	const updateFormProgress = () => {
		const requiredFields = ['name', 'email', 'message'];
		const optionalFields = ['company', 'projectType', 'budget'];
		const totalFields = requiredFields.length + optionalFields.length;
		
		let filledFields = 0;
		requiredFields.forEach(field => {
			if (formData[field as keyof typeof formData]?.trim()) filledFields++;
		});
		optionalFields.forEach(field => {
			if (formData[field as keyof typeof formData]?.trim()) filledFields++;
		});
		
		setFormProgress((filledFields / totalFields) * 100);
	};

	// Real-time validation
	const validateField = (name: string, value: string) => {
		const newErrors = { ...errors };
		
		switch (name) {
			case 'name':
				if (!value.trim()) {
					newErrors.name = 'Name is required';
				} else if (value.trim().length < 2) {
					newErrors.name = 'Name must be at least 2 characters';
				} else {
					delete newErrors.name;
				}
				break;
			case 'email':
				if (!value.trim()) {
					newErrors.email = 'Email is required';
				} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
					newErrors.email = 'Please enter a valid email address';
				} else {
					delete newErrors.email;
				}
				break;
			case 'message':
				if (!value.trim()) {
					newErrors.message = 'Project details are required';
				} else if (value.trim().length < 10) {
					newErrors.message = 'Please provide more detailed project information (at least 10 characters)';
				} else {
					delete newErrors.message;
				}
				break;
		}
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		
		// Validate required fields
		if (!formData.name.trim()) {
			newErrors.name = 'Name is required';
		} else if (formData.name.trim().length < 2) {
			newErrors.name = 'Name must be at least 2 characters';
		}
		
		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = 'Please enter a valid email address';
		}
		
		if (!formData.message.trim()) {
			newErrors.message = 'Project details are required';
		} else if (formData.message.trim().length < 10) {
			newErrors.message = 'Please provide more detailed project information (at least 10 characters)';
		}
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitStatus('idle');
		
		// Validate form before submission
		const isValid = validateForm();
		if (!isValid) {
			setSubmitStatus('error');
			console.error('Form validation errors:', errors);
			// Reset error message after 5 seconds
			setTimeout(() => setSubmitStatus('idle'), 5000);
			return;
		}
		
		setIsSubmitting(true);

		try {
			// Submit to API endpoint
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (response.ok && result.success) {
				setIsSubmitting(false);
				setSubmitStatus('success');
				setFormData({
					name: '',
					email: '',
					company: '',
					projectType: '',
					budget: '',
					message: '',
				});
				setFormProgress(0);
				setErrors({});

				// Reset success message after 5 seconds
				setTimeout(() => setSubmitStatus('idle'), 5000);
			} else {
				throw new Error(result.error || 'Failed to submit form');
			}
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
					{/* Enhanced Hero Section */}
					<section
						className="relative min-h-[500px] overflow-hidden bg-stone-50 py-16 md:py-24 dark:bg-stone-900"
						style={{
							backgroundImage: 'url(/assets/hero/hero-bg4.png)',
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
					>
						{/* Background Overlay */}
						<div className="absolute inset-0 z-0 bg-stone-50/80 dark:bg-stone-900/80"></div>
						
						{/* Animated Background Elements */}
						<div className="absolute inset-0 z-0">
							<motion.div
								animate={{
									scale: [1, 1.1, 1],
									opacity: [0.1, 0.2, 0.1],
								}}
								transition={{
									duration: 8,
									repeat: Infinity,
									ease: "easeInOut"
								}}
								className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-stone-300/20 dark:bg-stone-600/20"
							/>
							<motion.div
								animate={{
									scale: [1.1, 1, 1.1],
									opacity: [0.15, 0.25, 0.15],
								}}
								transition={{
									duration: 6,
									repeat: Infinity,
									ease: "easeInOut",
									delay: 2
								}}
								className="absolute bottom-1/4 right-1/4 h-24 w-24 rounded-full bg-stone-400/20 dark:bg-stone-500/20"
							/>
						</div>

						{/* Content Overlay */}
						<div className="relative z-10">
							<Container className="px-4">
								<motion.div
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, ease: 'easeOut' }}
									className="mx-auto max-w-5xl text-center"
								>
									{/* Value Proposition Badge */}
									<motion.div
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.6, delay: 0.2 }}
										className="mb-6"
									>
										<Badge 
											variant="outline" 
											className="border-stone-300 bg-stone-100/80 px-4 py-2 text-sm font-medium text-stone-700 dark:border-stone-600 dark:bg-stone-800/80 dark:text-stone-300"
										>
											<StarIcon className="mr-2 h-4 w-4 text-amber-500" />
											15+ Years of Proven Results
										</Badge>
									</motion.div>

									{/* Main Headline */}
									<motion.h1 
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.8, delay: 0.3 }}
										className="mb-6 text-4xl font-bold leading-tight text-stone-900 md:text-6xl lg:text-7xl dark:text-stone-100"
									>
										Building Smarter, Faster
										<br />
										<span className="bg-gradient-to-r from-stone-600 to-stone-800 bg-clip-text text-transparent dark:from-stone-300 dark:to-stone-100">
											Web Applications
										</span>
									</motion.h1>

									{/* Value Proposition Tagline */}
									<motion.p 
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.8, delay: 0.4 }}
										className="mb-8 text-xl leading-relaxed text-stone-600 md:text-2xl dark:text-stone-400"
									>
										Transform your ideas into exceptional digital experiences with a senior developer who delivers results, not just code.
									</motion.p>

									{/* Key Metrics & Achievements */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.8, delay: 0.5 }}
										className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3"
									>
										<div className="flex items-center justify-center gap-3 rounded-lg bg-white/60 px-4 py-3 backdrop-blur-sm dark:bg-stone-800/60">
											<CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
											<div className="text-center">
												<div className="text-lg font-bold text-stone-900 dark:text-stone-100">100%</div>
												<div className="text-sm text-stone-600 dark:text-stone-400">Client Satisfaction</div>
											</div>
										</div>
										<div className="flex items-center justify-center gap-3 rounded-lg bg-white/60 px-4 py-3 backdrop-blur-sm dark:bg-stone-800/60">
											<ZapIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
											<div className="text-center">
												<div className="text-lg font-bold text-stone-900 dark:text-stone-100">24h</div>
												<div className="text-sm text-stone-600 dark:text-stone-400">Response Time</div>
											</div>
										</div>
										<div className="flex items-center justify-center gap-3 rounded-lg bg-white/60 px-4 py-3 backdrop-blur-sm dark:bg-stone-800/60">
											<StarIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
											<div className="text-center">
												<div className="text-lg font-bold text-stone-900 dark:text-stone-100">15+</div>
												<div className="text-sm text-stone-600 dark:text-stone-400">Years Experience</div>
											</div>
										</div>
									</motion.div>

									{/* Location & Availability Info */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.8, delay: 0.6 }}
										className="flex flex-wrap justify-center gap-6 text-sm text-stone-500 dark:text-stone-400"
									>
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
									</motion.div>
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
											Let's Discuss Your Project Goals
										</h2>
										<p className="text-lg text-stone-600 dark:text-stone-400">
											Get a free consultation and detailed project proposal within 24 hours. I&apos;ll help you transform your ideas into exceptional digital experiences.
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
													<CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
												</div>
												<div>
													<h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
														Project Consultation Requested!
													</h3>
													<p className="text-green-700 dark:text-green-300">
														Thank you for your interest! I&apos;ll review your project details and get back to you within 24 hours with a detailed proposal and next steps.
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
													<AlertCircleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
												</div>
												<div>
													<h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
														Please Fix the Following Issues
													</h3>
													<div className="text-red-700 dark:text-red-300">
														{Object.keys(errors).length > 0 ? (
															<ul className="list-disc list-inside space-y-1">
																{Object.values(errors).map((error, index) => (
																	<li key={index}>{error}</li>
																))}
															</ul>
														) : (
															<p>Please check your form inputs and try again.</p>
														)}
													</div>
												</div>
											</div>
										</motion.div>
									) : (
										<div className="space-y-6">
											{/* Form Progress Indicator */}
											<div className="space-y-2">
												<div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-400">
													<span>Form Progress</span>
													<span>{Math.round(formProgress)}% Complete</span>
												</div>
												<div className="h-2 w-full rounded-full bg-stone-200 dark:bg-stone-700">
													<motion.div
														className="h-2 rounded-full bg-gradient-to-r from-stone-500 to-stone-600 dark:from-stone-400 dark:to-stone-500"
														initial={{ width: 0 }}
														animate={{ width: `${formProgress}%` }}
														transition={{ duration: 0.3, ease: 'easeOut' }}
													/>
												</div>
											</div>

											<form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form">
												<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
												<div>
													<label
														htmlFor="name"
														className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
													>
														Full Name *
													</label>
													<input
														type="text"
														id="name"
														name="name"
														value={formData.name}
														onChange={handleInputChange}
														onBlur={(e) => validateField('name', e.target.value)}
														required
														aria-required="true"
														aria-describedby={errors.name ? "name-error" : undefined}
														aria-invalid={!!errors.name}
														className={`w-full rounded-lg border px-4 py-3 text-stone-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:text-stone-100 ${
															errors.name 
																? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
																: 'border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800'
														}`}
														placeholder="Enter your full name"
													/>
													{errors.name && (
														<p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
															{errors.name}
														</p>
													)}
												</div>
												<div>
													<label
														htmlFor="email"
														className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
													>
														Email Address *
													</label>
													<input
														type="email"
														id="email"
														name="email"
														value={formData.email}
														onChange={handleInputChange}
														onBlur={(e) => validateField('email', e.target.value)}
														required
														aria-required="true"
														aria-describedby={errors.email ? "email-error" : undefined}
														aria-invalid={!!errors.email}
														className={`w-full rounded-lg border px-4 py-3 text-stone-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:text-stone-100 ${
															errors.email 
																? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
																: 'border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800'
														}`}
														placeholder="your.email@example.com"
													/>
													{errors.email && (
														<p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
															{errors.email}
														</p>
													)}
												</div>
											</div>

											<div>
												<label
													htmlFor="company"
													className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
												>
													Company / Organization
												</label>
												<input
													type="text"
													id="company"
													name="company"
													value={formData.company}
													onChange={handleInputChange}
													className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
													placeholder="Your company or organization (optional)"
												/>
											</div>

											<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
														<option value="web-development">Web Development</option>
														<option value="website-redesign">Website Redesign</option>
														<option value="e-commerce">E-commerce Platform</option>
														<option value="ai-integration">AI Integration</option>
														<option value="consulting">Technical Consulting</option>
														<option value="maintenance">Maintenance & Support</option>
														<option value="mobile-app">Mobile Application</option>
														<option value="other">Other</option>
													</select>
												</div>
												<div>
													<label
														htmlFor="budget"
														className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
													>
														Budget Range
													</label>
													<select
														id="budget"
														name="budget"
														value={formData.budget}
														onChange={handleInputChange}
														className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
													>
														<option value="">Select budget range</option>
														<option value="under-5k">Under $5,000</option>
														<option value="5k-15k">$5,000 - $15,000</option>
														<option value="15k-30k">$15,000 - $30,000</option>
														<option value="30k-50k">$30,000 - $50,000</option>
														<option value="50k-plus">$50,000+</option>
														<option value="discuss">Let's discuss</option>
													</select>
												</div>
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
													onBlur={(e) => validateField('message', e.target.value)}
													required
													aria-required="true"
													aria-describedby={errors.message ? "message-error" : undefined}
													aria-invalid={!!errors.message}
													rows={6}
													className={`w-full resize-none rounded-lg border px-4 py-3 text-stone-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:text-stone-100 ${
														errors.message 
															? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
															: 'border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800'
													}`}
													placeholder="Tell me about your project goals, timeline, specific requirements, and any challenges you&apos;re facing..."
												/>
												{errors.message && (
													<p id="message-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
														{errors.message}
													</p>
												)}
											</div>

											{/* Privacy Assurance */}
											<div className="flex items-start gap-3 rounded-lg bg-stone-50 p-4 dark:bg-stone-800/50">
												<ShieldIcon className="h-5 w-5 text-stone-600 dark:text-stone-400 mt-0.5 flex-shrink-0" />
												<div className="text-sm text-stone-600 dark:text-stone-400">
													<p className="font-medium mb-1">Your information is secure</p>
													<p>I respect your privacy and will never share your contact information. Your project details are kept confidential and used solely for project consultation purposes.</p>
												</div>
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
														Submitting Request...
													</div>
												) : (
													<>
														Get Free Consultation
														<SendIcon className="ml-2 h-5 w-5" />
													</>
												)}
											</Button>
										</form>
									</div>
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

									{/* Location & Availability */}
									<div className="space-y-6">
										<div className="flex items-start gap-4">
											<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
												<MapPinIcon className="h-6 w-6 text-stone-600 dark:text-stone-400" />
											</div>
											<div>
												<h3 className="mb-1 text-lg font-semibold text-stone-900 dark:text-stone-100">
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
											<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
												<ClockIcon className="h-6 w-6 text-stone-600 dark:text-stone-400" />
											</div>
											<div>
												<h3 className="mb-1 text-lg font-semibold text-stone-900 dark:text-stone-100">
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

									{/* Social Media */}
									<div>
										<h3 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
											Connect With Me
										</h3>
										<div className="flex items-center gap-4">
											<a
												href="https://facebook.com"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Find us on Facebook, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
											>
												<FacebookIcon className="h-5 w-5" />
											</a>

											<a
												href="https://github.com"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Find us on Github, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
											>
												<GithubIcon className="h-5 w-5 stroke-current" />
											</a>

											<a
												href="https://linkedin.com"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Find us on Linkedin, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
											>
												<LinkedinIcon className="h-5 w-5 stroke-current" />
											</a>

											<a
												href="https://bsky.app"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Find us on Bluesky, external website, opens in new tab"
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
