import { motion } from 'framer-motion';
import { ArrowRightIcon, MailIcon, MessageSquareIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../../ui/button';

// Shared styles for better maintainability
const SHARED_BUTTON_STYLES = "group bg-white px-8 py-4 text-lg font-semibold text-stone-900 transition-all duration-300 hover:scale-105 hover:bg-stone-100 hover:shadow-xl";

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
						className="text-4xl font-bold tracking-tight text-white leading-tight md:text-6xl lg:text-7xl md:leading-tight lg:leading-tight"
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
						<p id="hero-name" className="text-xl font-semibold text-stone-200 md:text-2xl lg:text-3xl">
							John Schibelli
						</p>
						<p className="text-lg font-semibold text-stone-300 md:text-xl lg:text-2xl">
							Senior Front-End Developer
						</p>
						<p className="mx-auto max-w-3xl text-base font-medium leading-relaxed text-stone-300 md:text-lg lg:text-xl">
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
							className={`${SHARED_BUTTON_STYLES} min-w-[180px] justify-center bg-gradient-to-r from-stone-900 to-stone-700 text-white hover:from-stone-800 hover:to-stone-600`}
							asChild
						>
							<Link href="/contact" aria-label="Start a conversation about your project goals and business objectives">
								<span className="flex items-center">
									<MessageSquareIcon className="mr-2 h-5 w-5" />
									Discuss Your Goals
									<ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
								</span>
							</Link>
						</Button>

						{/* Secondary CTA: View proven results and case studies */}
						<Button
							size="lg"
							className={`${SHARED_BUTTON_STYLES} min-w-[160px] justify-center`}
							asChild
						>
							<Link href="/projects" aria-label="View proven results and case studies of successful web applications">
								<span className="flex items-center">
									See My Results
									<ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
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

			{/* Scroll indicator */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, delay: 1.2 }}
				className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform"
			>
				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
					className="flex h-10 w-6 justify-center rounded-full border-2 border-white"
				>
					<motion.div
						animate={{ y: [0, 12, 0] }}
						transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
						className="mt-2 h-3 w-1 rounded-full bg-white"
					/>
				</motion.div>
			</motion.div>
		</header>
	);
}
