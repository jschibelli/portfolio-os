'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../../ui';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';
import { commonIcons, handleInvalidAudience, sharedStyles, validateAudience, type AudienceType } from './shared-cta-config';

interface AudienceSpecificCTAProps {
	audience: AudienceType;
	className?: string;
	onScheduleClick?: () => void;
}

// Shared configuration interface for better maintainability
interface AudienceConfig {
	icon: React.ReactNode;
	title: string;
	subtitle: string;
	description: string;
	primaryCTA: {
		text: string;
		url: string;
		icon: React.ReactNode;
		download?: boolean;
		downloadFilename?: string;
	};
	secondaryCTA: {
		text: string;
		url: string;
		icon: React.ReactNode;
	};
	highlights: string[];
	availability: string;
	availabilityColor: 'green' | 'yellow';
}

const audienceData = {
	recruiters: {
		icon: commonIcons.briefcase,
		title: "For Recruiters & Hiring Managers",
		subtitle: "Senior Front-End Developer Available",
		description: "I'm actively seeking new opportunities and ready to bring my 15+ years of experience to your team. Let's discuss how I can contribute to your organization's success.",
		primaryCTA: {
			text: "View Resume",
			url: "/assets/John-Schibelli-Resume-2025.pdf",
			icon: commonIcons.arrowRight,
			download: true,
			downloadFilename: "John-Schibelli-Resume-2025.pdf"
		},
		secondaryCTA: {
			text: "Schedule Interview",
			url: "mailto:john@johnschibelli.com?subject=Interview%20Opportunity",
			icon: commonIcons.calendar
		},
		highlights: [
			"15+ years of front-end development experience",
			"Expert in React, Next.js, TypeScript, and modern frameworks",
			"Proven track record of delivering high-performance applications",
			"Strong collaboration and leadership skills",
			"Available for immediate start"
		],
		availability: "Available for new opportunities",
		availabilityColor: "green"
	},
	'startup-founders': {
		icon: commonIcons.zap,
		title: "For Startup Founders",
		subtitle: "Build Your MVP & Scale Fast",
		description: "I specialize in helping startups build scalable, high-performance web applications from the ground up. From MVP development to full-scale platforms, I'll help you launch faster and scale smarter.",
		primaryCTA: {
			text: "Start Your Project",
			url: "/contact",
			icon: commonIcons.zap
		},
		secondaryCTA: {
			text: "Free Consultation",
			url: "mailto:john@johnschibelli.com?subject=Startup%20Consultation",
			icon: commonIcons.message
		},
		highlights: [
			"Rapid MVP development and deployment",
			"Scalable architecture from day one",
			"Modern tech stack for competitive advantage",
			"Ongoing support and maintenance",
			"Startup-friendly pricing and terms"
		],
		availability: "Taking on new startup projects",
		availabilityColor: "green"
	},
	clients: {
		icon: commonIcons.building,
		title: "For Business Owners",
		subtitle: "Transform Your Digital Presence",
		description: "Whether you need a complete website redesign, e-commerce platform, or custom web application, I deliver exceptional results that drive business growth and user engagement.",
		primaryCTA: {
			text: "Get Quote",
			url: "/contact",
			icon: commonIcons.arrowRight
		},
		secondaryCTA: {
			text: "View Portfolio",
			url: "/projects",
			icon: commonIcons.users
		},
		highlights: [
			"Custom web applications and websites",
			"E-commerce and business platforms",
			"Performance optimization and SEO",
			"Ongoing maintenance and support",
			"Proven ROI and business results"
		],
		availability: "Available for new projects",
		availabilityColor: "green"
	}
};

export default function AudienceSpecificCTA({ audience, className = '', onScheduleClick }: AudienceSpecificCTAProps) {
	// Validate audience and provide fallback
	const validAudience = validateAudience(audience, 'clients');
	const data = audienceData[validAudience];
	
	// Error handling for invalid audience values
	if (!data) {
		handleInvalidAudience(audience, 'clients');
		return <AudienceSpecificCTA audience="clients" className={className} onScheduleClick={onScheduleClick} />;
	}

	// Check if this is the recruiters or startup-founders audience with schedule button
	const isScheduleButton = (validAudience === 'recruiters' || validAudience === 'startup-founders') && onScheduleClick;
	
	return (
		<section className={`py-16 ${className}`}>
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="mx-auto max-w-4xl"
				>
					<Card className="overflow-hidden bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800">
						<CardContent className="p-8">
							{/* Header */}
							<div className="mb-8 text-center">
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									whileInView={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
									viewport={{ once: true }}
									className="mb-4 flex justify-center"
								>
									<div className="rounded-full bg-stone-900 p-3 text-white dark:bg-stone-100 dark:text-stone-900">
										{data.icon}
									</div>
								</motion.div>

								<Badge 
									variant="secondary" 
												className={`mb-4 px-4 py-2 text-sm font-medium ${
													data.availabilityColor === 'green' 
														? sharedStyles.availability.available
														: sharedStyles.availability.busy
												}`}
								>
									<div className="flex items-center gap-2">
														<div className={`h-2 w-2 rounded-full ${
															data.availabilityColor === 'green' ? sharedStyles.statusIndicator.available : sharedStyles.statusIndicator.busy
														}`}></div>
										{data.availability}
									</div>
								</Badge>

								<h2 className="mb-2 text-2xl font-bold text-stone-900 dark:text-stone-100 md:text-3xl">
									{data.title}
								</h2>
								<p className="mb-4 text-lg text-stone-600 dark:text-stone-400">
									{data.subtitle}
								</p>
								<p className="mx-auto max-w-2xl text-stone-700 dark:text-stone-300">
									{data.description}
								</p>
			</div>

						{/* Highlights */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
								viewport={{ once: true }}
								className="mb-8"
							>
								<h3 className="mb-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
									Why Choose Me:
								</h3>
								<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
									{data.highlights.map((highlight, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
											viewport={{ once: true }}
											className="flex items-start gap-3"
										>
											<div className="mt-1 h-2 w-2 rounded-full bg-stone-900 dark:bg-stone-100"></div>
											<p className="text-sm text-stone-700 dark:text-stone-300">
												{highlight}
											</p>
										</motion.div>
									))}
								</div>
							</motion.div>

							{/* CTA Buttons */}
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
								viewport={{ once: true }}
								className="flex flex-col justify-center gap-4 sm:flex-row"
							>
												<Button
													size="lg"
													className={sharedStyles.button.primary}
													asChild
												>
									<Link 
										href={data.primaryCTA.url}
										{...(data.primaryCTA.download && {
											download: data.primaryCTA.downloadFilename,
											target: "_blank",
											rel: "noopener noreferrer"
										})}
									>
										{data.primaryCTA.icon}
										{data.primaryCTA.text}
									</Link>
								</Button>
												{isScheduleButton ? (
													<Button
														size="lg"
														variant="outline"
														className={sharedStyles.button.secondary}
														onClick={onScheduleClick}
													>
														{data.secondaryCTA.icon}
														{data.secondaryCTA.text}
													</Button>
												) : (
													<Button
														size="lg"
														variant="outline"
														className={sharedStyles.button.secondary}
														asChild
													>
														<Link href={data.secondaryCTA.url}>
															{data.secondaryCTA.icon}
															{data.secondaryCTA.text}
														</Link>
													</Button>
												)}
							</motion.div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</section>
	);
}
