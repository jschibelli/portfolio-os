import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../../ui/button';
import { useState } from 'react';

// Shared styles for better maintainability and consistency
const SHARED_BUTTON_STYLES = "group bg-white px-8 py-4 text-lg font-semibold text-stone-900 transition-all duration-300 hover:scale-105 hover:bg-stone-100 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-900";

// Animation variants for consistent motion with reduced motion support
const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.8, ease: 'easeOut' }
};

const fadeInUpDelayed = (delay: number) => ({
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.8, delay, ease: 'easeOut' }
});

// Optimized animation variants for better performance
const optimizedFadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } // Custom easing for smoother performance
};

const optimizedFadeInUpDelayed = (delay: number) => ({
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }
});

export default function Hero() {
	const shouldReduceMotion = useReducedMotion();
	const [imageError, setImageError] = useState(false);

	const handleImageError = () => {
		setImageError(true);
	};

	return (
		<section 
			className="relative flex min-h-[400px] items-center justify-center overflow-hidden py-12 md:py-16"
			role="banner"
			aria-label="Hero section with main value proposition"
		>
			{/* Background Image */}
			<div className="absolute inset-0 z-0">
				{!imageError ? (
					<Image
						src="/assets/hero/hero-bg1.png"
						alt="Abstract stone palette background with gradient overlay"
						fill
						className="object-cover"
						priority
						sizes="100vw"
						onError={handleImageError}
					/>
				) : (
					<div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900" />
				)}
				{/* Radial gradient overlay for readability */}
				<div className="bg-gradient-radial absolute inset-0 from-stone-900/80 via-stone-900/60 to-stone-900/40" />
			</div>

			{/* Content */}
			<div className="container relative z-10 mx-auto px-4 text-center">
				<motion.div
					{...shouldReduceMotion ? optimizedFadeInUp : fadeInUp}
					className="mx-auto max-w-4xl space-y-8"
				>
					{/* Hero Tagline */}
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={shouldReduceMotion ? 
							{ duration: 0.3, delay: 0.1 } : 
							{ duration: 0.8, delay: 0.2, ease: 'easeOut' }
						}
						className="text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl"
					>
						Building Smarter, Faster Web Applications
					</motion.h1>

					{/* Value Proposition */}
					<motion.div
						{...shouldReduceMotion ? optimizedFadeInUpDelayed(0.2) : fadeInUpDelayed(0.4)}
						className="space-y-4"
					>
						<p className="text-xl font-semibold text-stone-200 md:text-2xl lg:text-3xl">
							John Schibelli
						</p>
						<p className="text-lg font-medium text-stone-300 md:text-xl lg:text-2xl">
							Senior Front-End Developer
						</p>
						<p className="mx-auto max-w-3xl text-base leading-relaxed text-stone-300 md:text-lg lg:text-xl">
							Transforming ideas into high-performance digital experiences that drive business growth. 
							Expert in React, Next.js, and TypeScript with 15+ years of proven results.
						</p>
					</motion.div>

					{/* CTA Buttons - Business-focused actions */}
					<motion.div
						{...shouldReduceMotion ? optimizedFadeInUpDelayed(0.3) : fadeInUpDelayed(0.6)}
						className="flex flex-col items-center justify-center gap-4 sm:flex-row"
						role="group"
						aria-label="Main call-to-action buttons"
					>
						{/* Primary CTA: View proven results and case studies */}
						<Button
							size="lg"
							className={SHARED_BUTTON_STYLES}
							asChild
						>
							<Link 
								href="/projects" 
								aria-label="View proven results and case studies of successful web applications"
								role="button"
							>
								See My Results
								<ArrowRightIcon 
									className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" 
									aria-hidden="true"
								/>
							</Link>
						</Button>
						{/* Secondary CTA: Start a conversation about your project */}
						<Button
							size="lg"
							className={SHARED_BUTTON_STYLES}
							asChild
						>
							<Link 
								href="/contact" 
								aria-label="Start a conversation about your web development project needs"
								role="button"
							>
								Start Your Project
								<ArrowRightIcon 
									className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" 
									aria-hidden="true"
								/>
							</Link>
						</Button>
					</motion.div>
				</motion.div>
			</div>

			{/* Scroll indicator */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={shouldReduceMotion ? 
					{ duration: 0.3, delay: 0.5 } : 
					{ duration: 1, delay: 1.2 }
				}
				className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform"
				aria-label="Scroll down indicator"
			>
				<motion.div
					animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
					transition={shouldReduceMotion ? {} : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
					className="flex h-10 w-6 justify-center rounded-full border-2 border-white"
					role="img"
					aria-label="Scroll down"
				>
					<motion.div
						animate={shouldReduceMotion ? {} : { y: [0, 12, 0] }}
						transition={shouldReduceMotion ? {} : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
						className="mt-2 h-3 w-1 rounded-full bg-white"
					/>
				</motion.div>
			</motion.div>
		</section>
	);
}
