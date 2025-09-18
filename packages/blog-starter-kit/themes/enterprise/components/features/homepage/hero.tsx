import { motion } from 'framer-motion';
import { ArrowRightIcon, MailIcon, MessageSquareIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../../ui/button';
import { PRIMARY_BUTTON_STYLES, SECONDARY_BUTTON_STYLES, ICON_SPACING } from '../../../lib/button-styles';

// Animation variants for consistent motion
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

export default function Hero() {
	return (
		<header className="relative flex min-h-[400px] items-center justify-center overflow-hidden py-12 md:py-16">
			{/* Background Image with optimized loading */}
			<div className="absolute inset-0 z-0">
				<Image
					src="/assets/hero/hero-bg.png"
					alt="Professional background for John Schibelli's portfolio"
					fill
					className="object-cover"
					priority
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
					quality={85}
					placeholder="blur"
					blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
				/>
				{/* Radial gradient overlay for readability */}
				<div className="bg-gradient-radial absolute inset-0 from-stone-900/80 via-stone-900/60 to-stone-900/40" />
			</div>

			{/* Content */}
			<div className="container relative z-10 mx-auto px-4 text-center">
				<motion.div
					{...fadeInUp}
					className="mx-auto max-w-4xl space-y-6"
				>
					{/* Hero Tagline */}
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
						className="hero-title text-white"
					>
						Building Smarter, Faster<br />
						Web Applications
					</motion.h1>

					{/* Value Proposition */}
					<motion.section
						{...fadeInUpDelayed(0.4)}
						className="space-y-3"
						aria-labelledby="hero-name"
					>
						<p id="hero-name" className="hero-subtitle text-stone-200">
							John Schibelli
						</p>
						<p className="hero-subtitle text-stone-300">
							Senior Front-End Developer
						</p>
						<p className="hero-description mx-auto max-w-3xl text-stone-300">
							Transforming ideas into high-performance digital experiences that drive business growth. 
							Expert in React, Next.js, and TypeScript with 15+ years of proven results.
						</p>
					</motion.section>

					{/* Enhanced CTA Button Hierarchy */}
					<motion.nav
						{...fadeInUpDelayed(0.6)}
						className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
						aria-label="Primary navigation actions"
					>
						{/* Primary CTA: Start conversation about project goals */}
						<Button
							size="lg"
							className={`${PRIMARY_BUTTON_STYLES} min-w-[180px] justify-center`}
							asChild
						>
							<Link href="/contact" aria-label="Start a conversation about your project goals and business objectives">
								<span className="flex items-center">
									<MessageSquareIcon className={ICON_SPACING.left} />
									Discuss Your Goals
									<ArrowRightIcon className={`${ICON_SPACING.right} transition-transform group-hover:translate-x-1`} aria-hidden="true" />
								</span>
							</Link>
						</Button>

						{/* Secondary CTA: View proven results and case studies */}
						<Button
							size="lg"
							className={`${SECONDARY_BUTTON_STYLES} min-w-[160px] justify-center`}
							asChild
						>
							<Link href="/projects" aria-label="View proven results and case studies of successful web applications">
								<span className="flex items-center">
									See My Results
									<ArrowRightIcon className={`${ICON_SPACING.right} transition-transform group-hover:translate-x-1`} aria-hidden="true" />
								</span>
							</Link>
						</Button>
					</motion.nav>

					{/* Tertiary CTA: Direct email option */}
					<motion.div
						{...fadeInUpDelayed(0.8)}
						className="flex flex-col items-center justify-center gap-2"
					>
						<p className="text-sm text-stone-300">
							Prefer email? 
							<a 
								href="mailto:john@johnschibelli.com?subject=Project%20Discussion%20-%20Let's%20Talk" 
								className="ml-1 font-semibold text-white underline hover:text-stone-200 transition-colors"
								aria-label="Send email directly to discuss your project"
							>
								Email me directly
							</a>
						</p>
					</motion.div>
				</motion.div>
			</div>

		</header>
	);
}
