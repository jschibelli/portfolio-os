import { motion } from 'framer-motion';
import { ArrowRightIcon, MailIcon, MessageSquareIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../../ui/button';
import { PRIMARY_BUTTON_STYLES, SECONDARY_BUTTON_STYLES, ICON_SPACING } from '../../../lib/button-styles';
import { ClassicHeroProps, HeroContent, HeroCTA, HeroImage, HeroAnimation } from './types';
import { heroSpacingClasses } from '../../ui/spacing';
import { cn } from '@/lib/utils';

// Helper function to map hero CTA size to Button size
const mapCTASizeToButtonSize = (size?: string): 'default' | 'sm' | 'lg' | 'icon' => {
	switch (size) {
		case 'sm':
			return 'sm';
		case 'md':
			return 'default';
		case 'lg':
			return 'lg';
		case 'icon':
			return 'icon';
		default:
			return 'lg';
	}
};

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

// Default hero content
const defaultHeroContent: HeroContent = {
	title: "Building Smarter, Faster\nWeb Applications",
	subtitle: "John Schibelli",
	description: "Transforming ideas into high-performance digital experiences that drive business growth. Expert in React, Next.js, and TypeScript with 15+ years of proven results.",
	authorName: "John Schibelli",
	professionalTitle: "Senior Front-End Developer"
};

// Default hero CTAs
const defaultHeroCTAs: HeroCTA[] = [
	{
		text: "Discuss Your Goals",
		href: "/contact",
		variant: "primary",
		size: "lg",
		'aria-label': "Start a conversation about your project goals and business objectives",
		icon: <MessageSquareIcon className={ICON_SPACING.left} />
	},
	{
		text: "See My Results",
		href: "/projects",
		variant: "secondary",
		size: "lg",
		'aria-label': "View proven results and case studies of successful web applications",
		icon: <ArrowRightIcon className={`${ICON_SPACING.right} transition-transform group-hover:translate-x-1`} />
	}
];

// Default background image
const defaultBackgroundImage: HeroImage = {
	src: "/assets/hero/hero-bg.png",
	alt: "Professional background for John Schibelli's portfolio",
	quality: 85,
	priority: true,
	blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==",
	sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
};

// Default animation configuration
const defaultAnimation: HeroAnimation = {
	duration: 0.8,
	delay: 0.2,
	ease: 'easeOut',
	enabled: true
};

function Hero({
	content = defaultHeroContent,
	ctas = defaultHeroCTAs,
	backgroundImage = defaultBackgroundImage,
	animation = defaultAnimation,
	enableGradientOverlay = true,
	className = "",
	...props
}: ClassicHeroProps) {
	return (
		<header 
			className={cn(
				"relative flex min-h-screen items-center justify-center overflow-hidden",
				heroSpacingClasses.section.default,
				className
			)}
			{...props}
		>
			{/* Background Image with optimized loading */}
			<div className="absolute inset-0 z-0">
				<Image
					src={backgroundImage.src}
					alt={backgroundImage.alt}
					fill
					className="object-cover"
					priority={backgroundImage.priority}
					sizes={backgroundImage.sizes}
					quality={backgroundImage.quality}
					placeholder={backgroundImage.blurDataURL ? "blur" : undefined}
					blurDataURL={backgroundImage.blurDataURL}
				/>
				{/* Radial gradient overlay for readability */}
				{enableGradientOverlay && (
					<div className="bg-gradient-radial absolute inset-0 from-stone-900/80 via-stone-900/60 to-stone-900/40" />
				)}
			</div>

			{/* Content */}
			<div className={cn(heroSpacingClasses.container.default, "relative z-10 text-center")}>
				<motion.div
					{...fadeInUp}
					className={cn("mx-auto", heroSpacingClasses.content.default)}
				>
					{/* Hero Tagline */}
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ 
							duration: animation.duration, 
							delay: animation.delay, 
							ease: animation.ease 
						}}
						className="text-4xl font-bold tracking-tight text-white leading-tight md:text-6xl lg:text-7xl md:leading-tight lg:leading-tight"
					>
						{content.title.split('\n').map((line, index) => (
							<span key={index}>
								{line}
								{index < content.title.split('\n').length - 1 && <br />}
							</span>
						))}
					</motion.h1>

					{/* Value Proposition */}
					<motion.section
						{...fadeInUpDelayed(0.4)}
						className="space-y-3"
						aria-labelledby="hero-name"
					>
						{content.authorName && (
							<p id="hero-name" className="text-xl font-semibold text-stone-200 md:text-2xl lg:text-3xl">
								{content.authorName}
							</p>
						)}
						{content.professionalTitle && (
							<p className="text-lg font-semibold text-stone-300 md:text-xl lg:text-2xl">
								{content.professionalTitle}
							</p>
						)}
						{content.description && (
							<p className="mx-auto max-w-3xl text-base font-medium leading-relaxed text-stone-300 md:text-lg lg:text-xl">
								{content.description}
							</p>
						)}
					</motion.section>

					{/* Enhanced CTA Button Hierarchy */}
					{ctas && ctas.length > 0 && (
						<motion.nav
							{...fadeInUpDelayed(0.6)}
							className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
							aria-label="Primary navigation actions"
						>
							{ctas.map((cta, index) => (
								<Button
									key={index}
									size={mapCTASizeToButtonSize(cta.size)}
									variant={cta.variant === "primary" ? "default" : cta.variant === "secondary" ? "outline" : cta.variant}
									className={`${
										cta.variant === "primary" ? PRIMARY_BUTTON_STYLES : 
										cta.variant === "secondary" ? SECONDARY_BUTTON_STYLES : ""
									} min-w-[180px] justify-center`}
									asChild
								>
									<Link href={cta.href} aria-label={cta['aria-label']}>
										<span className="flex items-center">
											{cta.icon}
											{cta.text}
											{cta.variant === "primary" && (
												<ArrowRightIcon className={`${ICON_SPACING.right} transition-transform group-hover:translate-x-1`} aria-hidden="true" />
											)}
										</span>
									</Link>
								</Button>
							))}
						</motion.nav>
					)}

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

export default Hero;
