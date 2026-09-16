'use client';

import { motion } from 'framer-motion';
import { CheckCircle as CheckCircleIcon, Mail as MailIcon, Send as SendIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { AppProvider } from '../../components/contexts/appContext';
import ModernHeader from '../../components/features/navigation/modern-header';
import { GithubSVG as GithubIcon, LinkedinSVG as LinkedinIcon } from '../../components/icons';
import { Container } from '../../components/shared/container';
import { Footer } from '../../components/shared/footer';
import { Button } from '../../components/ui/button';
import { siteConfig } from '../../config/site';
import { typeRole } from '../../lib/typography';

const defaultPublication = {
	id: 'fallback-contact',
	title: 'John Schibelli',
	displayTitle: 'John Schibelli',
	descriptionSEO:
		'Senior Software Engineer. Open to engineering roles and contract engineering work.',
	url: 'https://schibelli.dev',
	posts: { totalDocuments: 0 },
	preferences: { logo: null },
	author: { name: 'John Schibelli', profilePicture: null },
	followersCount: 0,
	isTeam: false,
	favicon: null,
	ogMetaData: { image: null },
};

interface ErrorResponse {
	error: string;
	message: string;
	fallbackEmail?: string;
	retryable?: boolean;
	retryAfter?: number;
}

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		company: '',
		projectType: '',
		message: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
	const [errorDetails, setErrorDetails] = useState<ErrorResponse | null>(null);

	const onChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const validate = (): string[] => {
		const errors: string[] = [];
		if (!formData.name.trim()) errors.push('Name is required');
		if (!formData.email.trim()) errors.push('Email is required');
		if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
			errors.push('Valid email required');
		if (!formData.message.trim() || formData.message.trim().length < 10)
			errors.push('Provide a message (min 10 chars)');
		return errors;
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitStatus('idle');
		setErrorDetails(null);

		const errs = validate();
		if (errs.length) {
			setSubmitStatus('error');
			setErrorDetails({
				error: 'validation_error',
				message: 'Please provide a name, valid email, and at least 10 characters in the message.',
			});
			setTimeout(() => {
				setSubmitStatus('idle');
				setErrorDetails(null);
			}, 5000);
			return;
		}

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
				setErrorDetails(result as ErrorResponse);
				setIsSubmitting(false);
				setSubmitStatus('error');

				if (!result.retryable) {
					setTimeout(() => {
						setSubmitStatus('idle');
						setErrorDetails(null);
					}, 10000);
				}
				return;
			}

			setIsSubmitting(false);
			setSubmitStatus('success');
			setFormData({ name: '', email: '', company: '', projectType: '', message: '' });
			setTimeout(() => setSubmitStatus('idle'), 5000);
		} catch (error) {
			console.error('Contact form submission error:', error);
			setIsSubmitting(false);
			setSubmitStatus('error');
			setErrorDetails({
				error: 'network_error',
				message:
					'Unable to connect to the server. Please check your internet connection and try again.',
				retryable: true,
			});
		}
	};

	const handleRetry = () => {
		setSubmitStatus('idle');
		setErrorDetails(null);
	};

	return (
		<AppProvider publication={defaultPublication as any}>
			<ModernHeader publication={defaultPublication} />

			<main id="main-content" className="min-h-screen bg-white dark:bg-stone-950">
				<section className="relative overflow-hidden bg-stone-50 py-12 md:py-16 dark:bg-stone-900">
					<div className="absolute inset-0 z-0">
						<Image
							src="/assets/hero/hero-bg4.png"
							alt=""
							fill
							priority
							className="object-cover"
							sizes="100vw"
						/>
					</div>
					<div className="absolute inset-0 z-0 bg-stone-50/70 dark:bg-stone-900/70" />
					<div className="relative z-10">
						<Container className="px-4">
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8 }}
								className="mx-auto max-w-3xl text-center"
							>
								<h1 className={`mb-6 text-stone-900 dark:text-stone-100 ${typeRole.pageH1}`}>
									Get in Touch
								</h1>
								<p className={`text-stone-600 dark:text-stone-400 ${typeRole.heroSupport}`}>
									I&apos;m open to Senior Software Engineer opportunities and contract engineering
									work.
								</p>
							</motion.div>
						</Container>
					</div>
				</section>

				<section className="bg-white py-16 dark:bg-stone-950">
					<Container className="px-4">
						<div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-2">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6 }}
								viewport={{ once: true }}
								className="space-y-8"
							>
								<div>
									<h2 className={`mb-4 text-stone-900 dark:text-stone-100 ${typeRole.sectionH2}`}>
										Send me a message
									</h2>
									<p className={`text-stone-600 dark:text-stone-400 ${typeRole.body}`}>
										Tell me a little about the role, project, or engineering problem you&apos;re
										reaching out about.
									</p>
								</div>

								{submitStatus === 'success' ? (
									<div className="rounded-lg border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20">
										<div className="flex items-center gap-3">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
												<CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
											</div>
											<div>
												<h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
													Message Sent!
												</h3>
												<p className="text-green-700 dark:text-green-300">
													Thanks — I&apos;ll be in touch shortly.
												</p>
											</div>
										</div>
									</div>
								) : submitStatus === 'error' ? (
									<div className="rounded-lg border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
										<div className="space-y-3">
											<div className="flex items-start gap-3">
												<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-800">
													<SendIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
												</div>
												<div className="flex-1">
													<h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
														{errorDetails?.error === 'validation_error'
															? 'Check your inputs'
															: errorDetails?.error === 'email_config_error'
																? 'Technical Difficulties'
																: errorDetails?.error === 'rate_limit'
																	? 'Too Many Submissions'
																	: errorDetails?.error === 'network_error'
																		? 'Connection Issue'
																		: 'Unable to Send Message'}
													</h3>
													<p className="mt-1 text-red-700 dark:text-red-300">
														{errorDetails?.message ||
															'An unexpected error occurred. Please try again.'}
													</p>
													{errorDetails?.fallbackEmail && (
														<p className="mt-2 text-red-700 dark:text-red-300">
															You can also reach out at{' '}
															<a
																href={`mailto:${errorDetails.fallbackEmail}`}
																className="font-semibold underline hover:text-red-900 dark:hover:text-red-100"
															>
																{errorDetails.fallbackEmail}
															</a>
														</p>
													)}
													{errorDetails?.retryAfter && (
														<p className="mt-2 text-sm text-red-600 dark:text-red-400">
															Please wait {errorDetails.retryAfter} seconds before trying again.
														</p>
													)}
												</div>
											</div>
											{errorDetails?.retryable && (
												<div className="flex gap-2">
													<Button
														type="button"
														onClick={handleRetry}
														variant="outline"
														size="sm"
														className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
													>
														Try Again
													</Button>
												</div>
											)}
										</div>
									</div>
								) : null}

								<form
									onSubmit={onSubmit}
									className="space-y-6"
									role="form"
									aria-label="Contact form"
								>
									<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
										<div>
											<label
												htmlFor="name"
												className={`mb-2 block text-stone-700 dark:text-stone-300 ${typeRole.metadata}`}
											>
												Name *
											</label>
											<input
												id="name"
												name="name"
												value={formData.name}
												onChange={onChange}
												required
												className={`w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 ${typeRole.body}`}
												placeholder="Your name"
											/>
										</div>
										<div>
											<label
												htmlFor="email"
												className={`mb-2 block text-stone-700 dark:text-stone-300 ${typeRole.metadata}`}
											>
												Email *
											</label>
											<input
												id="email"
												name="email"
												type="email"
												value={formData.email}
												onChange={onChange}
												required
												className={`w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 ${typeRole.body}`}
												placeholder="your@email.com"
											/>
										</div>
									</div>
									<div>
										<label
											htmlFor="company"
											className={`mb-2 block text-stone-700 dark:text-stone-300 ${typeRole.metadata}`}
										>
											Company (optional)
										</label>
										<input
											id="company"
											name="company"
											value={formData.company}
											onChange={onChange}
											className={`w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 ${typeRole.body}`}
											placeholder="Optional"
										/>
									</div>
									<div>
										<label
											htmlFor="projectType"
											className={`mb-2 block text-stone-700 dark:text-stone-300 ${typeRole.metadata}`}
										>
											Reason for reaching out
										</label>
										<select
											id="projectType"
											name="projectType"
											value={formData.projectType}
											onChange={onChange}
											className={`w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 ${typeRole.body}`}
										>
											<option value="">Select</option>
											<option value="engineering-role">Engineering role</option>
											<option value="contract-engagement">Contract engagement</option>
											<option value="collaboration">Collaboration</option>
											<option value="other">Other</option>
										</select>
									</div>
									<div>
										<label
											htmlFor="message"
											className={`mb-2 block text-stone-700 dark:text-stone-300 ${typeRole.metadata}`}
										>
											Message *
										</label>
										<textarea
											id="message"
											name="message"
											rows={6}
											value={formData.message}
											onChange={onChange}
											required
											className={`w-full resize-none rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-transparent focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 ${typeRole.body}`}
											placeholder="Role, project, context, or anything else I should know..."
										/>
									</div>
									<Button
										type="submit"
										disabled={isSubmitting}
										size="lg"
										className={`w-full px-8 py-4 ${typeRole.button}`}
									>
										{isSubmitting ? (
											<span className="inline-flex items-center gap-2">
												<span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />{' '}
												Sending...
											</span>
										) : (
											<span className="inline-flex items-center gap-2">
												Send Message <SendIcon className="h-5 w-5" />
											</span>
										)}
									</Button>
								</form>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6 }}
								viewport={{ once: true }}
								className="space-y-8"
							>
								<div>
									<h3
										className={`mb-6 text-stone-900 dark:text-stone-100 ${typeRole.subsectionH3}`}
									>
										Other ways to connect
									</h3>
									<div className="space-y-6">
										<div className="flex items-start gap-4">
											<div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
												<MailIcon className="text-primary h-6 w-6" />
											</div>
											<div>
												<h4
													className={`mb-1 text-stone-900 dark:text-stone-100 ${typeRole.cardTitle}`}
												>
													Email
												</h4>
												<a
													href={`mailto:${siteConfig.links.email}`}
													className="text-primary hover:text-primary/80 text-lg font-medium transition-colors duration-200"
												>
													{siteConfig.links.email}
												</a>
											</div>
										</div>
										<div className="flex items-start gap-4">
											<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
												<LinkedinIcon className="h-6 w-6 stroke-current text-stone-600 dark:text-stone-400" />
											</div>
											<div>
												<h4
													className={`mb-1 text-stone-900 dark:text-stone-100 ${typeRole.cardTitle}`}
												>
													LinkedIn
												</h4>
												<a
													href={siteConfig.links.linkedin}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary hover:text-primary/80 text-lg font-medium transition-colors duration-200"
												>
													linkedin.com/in/johnschibelli
												</a>
											</div>
										</div>
										<div className="flex items-start gap-4">
											<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
												<GithubIcon className="h-6 w-6 stroke-current text-stone-600 dark:text-stone-400" />
											</div>
											<div>
												<h4
													className={`mb-1 text-stone-900 dark:text-stone-100 ${typeRole.cardTitle}`}
												>
													GitHub
												</h4>
												<a
													href={siteConfig.links.github}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary hover:text-primary/80 text-lg font-medium transition-colors duration-200"
												>
													github.com/johnschibelli
												</a>
											</div>
										</div>
									</div>
								</div>
							</motion.div>
						</div>
					</Container>
				</section>
			</main>
			<Footer publication={defaultPublication} />
		</AppProvider>
	);
}
