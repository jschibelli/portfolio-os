'use client';

import { motion } from 'framer-motion';
import { MailIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../ui';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';
import { commonIcons, handleInvalidAudience, sharedStyles, validateAudience, type AudienceType } from './shared-cta-config';


interface EnhancedCTASectionProps {
	audience: AudienceType;
	className?: string;
}

// Shared configuration interface for better maintainability
interface AudienceConfig {
	title: string;
	subtitle: string;
	description: string;
	primaryCTA: {
		text: string;
		url: string;
		icon: React.ReactNode;
	};
	secondaryCTA: {
		text: string;
		url: string;
		icon: React.ReactNode;
	};
	valueProps: string[];
	availability: string;
	availabilityStatus: 'available' | 'busy';
}


const audienceConfig = {
	recruiters: {
		title: "Looking for a Senior Front-End Developer?",
		subtitle: "I'm actively seeking new opportunities",
		description: "With 15+ years of experience building scalable web applications, I bring proven expertise in React, Next.js, TypeScript, and modern development practices. Available for full-time positions and ready to make an immediate impact.",
		primaryCTA: {
			text: "View Resume",
			url: "/resume",
			icon: commonIcons.arrowRight
		},
		secondaryCTA: {
			text: "Schedule Interview",
			url: "mailto:john@johnschibelli.com?subject=Interview%20Opportunity",
			icon: commonIcons.calendar
		},
		valueProps: [
			"15+ years of front-end development experience",
			"Expert in React, Next.js, TypeScript, and modern frameworks",
			"Proven track record of delivering high-performance applications",
			"Strong collaboration and leadership skills"
		],
		availability: "Available for new opportunities",
		availabilityStatus: "available"
	},
	'startup-founders': {
		title: "Ready to Build Your MVP?",
		subtitle: "Let's turn your startup vision into reality",
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
		valueProps: [
			"Rapid MVP development and deployment",
			"Scalable architecture from day one",
			"Modern tech stack for competitive advantage",
			"Ongoing support and maintenance"
		],
		availability: "Taking on new startup projects",
		availabilityStatus: "available"
	},
	clients: {
		title: "Transform Your Digital Presence",
		subtitle: "Professional web development services",
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
		valueProps: [
			"Custom web applications and websites",
			"E-commerce and business platforms",
			"Performance optimization and SEO",
			"Ongoing maintenance and support"
		],
		availability: "Available for new projects",
		availabilityStatus: "available"
	},
	general: {
		title: "Ready to Start Your Project?",
		subtitle: "Let's discuss how I can help",
		description: "I'm passionate about creating exceptional digital experiences that drive results. Whether you're a recruiter, startup founder, or business owner, let's explore how we can work together.",
		primaryCTA: {
			text: "Get In Touch",
			url: "/contact",
			icon: commonIcons.message
		},
		secondaryCTA: {
			text: "View My Work",
			url: "/projects",
			icon: commonIcons.arrowRight
		},
		valueProps: [
			"15+ years of development experience",
			"Modern tech stack expertise",
			"Proven track record of success",
			"Collaborative and results-driven approach"
		],
		availability: "Available for new opportunities",
		availabilityStatus: "available"
	}
};

export default function EnhancedCTASection({ audience, className = '' }: EnhancedCTASectionProps) {
	// Validate audience and provide fallback
	const validAudience = validateAudience(audience, 'general');
	const config = audienceConfig[validAudience];
	
	// Error handling for invalid audience values
	if (!config) {
		handleInvalidAudience(audience, 'general');
		return <EnhancedCTASection audience="general" className={className} />;
	}
	

	return (
		<section className={`relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 py-20 dark:from-stone-800 dark:via-stone-900 dark:to-stone-950 ${className}`}>
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
			</div>

			<div className="container relative z-10 mx-auto px-4">
				<div className="mx-auto max-w-6xl">
					{/* Main CTA Content */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						viewport={{ once: true }}
						className="mb-16 text-center"
					>
						{/* Availability Badge */}
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
							viewport={{ once: true }}
							className="mb-6"
						>
							<Badge 
								variant="secondary" 
								className={`px-4 py-2 text-sm font-medium ${
									config.availabilityStatus === 'available' 
										? sharedStyles.availability.available
										: sharedStyles.availability.busy
								}`}
							>
								<div className="flex items-center gap-2">
									<div className={`h-2 w-2 rounded-full ${
										config.availabilityStatus === 'available' ? sharedStyles.statusIndicator.available : sharedStyles.statusIndicator.busy
									}`}></div>
									{config.availability}
								</div>
							</Badge>
						</motion.div>

						<h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
							{config.title}
						</h2>
						<p className="mb-6 text-xl text-stone-300 md:text-2xl">
							{config.subtitle}
						</p>
						<p className="mx-auto mb-8 max-w-3xl text-lg text-stone-400">
							{config.description}
						</p>

						{/* CTA Buttons */}
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
							viewport={{ once: true }}
							className="flex flex-col justify-center gap-4 sm:flex-row"
						>
							<Button
								size="lg"
								className={sharedStyles.button.enhanced}
								asChild
							>
								<Link href={config.primaryCTA.url}>
									{config.primaryCTA.icon}
									{config.primaryCTA.text}
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className={sharedStyles.button.enhancedOutline}
								asChild
							>
								<Link href={config.secondaryCTA.url}>
									{config.secondaryCTA.icon}
									{config.secondaryCTA.text}
								</Link>
							</Button>
						</motion.div>
					</motion.div>


				{/* Contact Information */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="text-center"
				>
						<div className="mx-auto max-w-2xl rounded-lg bg-stone-800/50 p-6 backdrop-blur-sm">
							<h4 className="mb-4 text-lg font-semibold text-white">
								Ready to Connect?
							</h4>
							<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
							<a
								href="mailto:john@schibelli.dev"
									className="flex items-center gap-2 text-stone-300 transition-colors hover:text-white"
								>
									<MailIcon className="h-4 w-4" />
								john@schibelli.dev
								</a>
							<a
								href="tel:+18627810519"
									className="flex items-center gap-2 text-stone-300 transition-colors hover:text-white"
								>
									<PhoneIcon className="h-4 w-4" />
								(862) 781-0519
								</a>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
