import { Button } from '../../ui';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ModernHeroProps, HeroContent, HeroCTA, HeroImage, HeroAnimation } from './types';
import { heroSpacingClasses } from '../../ui/spacing';
import { cn } from '../../../lib/utils';

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

// Default content for modern hero
const defaultContent: HeroContent = {
	title: "Building Smarter, Faster Web Applications",
	subtitle: "Welcome to the Future",
	description: "Transforming ideas into high-performance digital experiences that drive business growth."
};

// Default primary CTA
const defaultPrimaryCTA: HeroCTA = {
	text: "Get Started",
	href: "/contact",
	variant: "primary",
	size: "lg",
	'aria-label': "Start your project journey"
};

// Default secondary CTA
const defaultSecondaryCTA: HeroCTA = {
	text: "Read the Blog",
	href: "/blog",
	variant: "outline",
	size: "lg",
	'aria-label': "Read our latest insights and tutorials"
};

// Default background image
const defaultBackgroundImage: HeroImage = {
	src: '/assets/hero/hero-bg1.png',
	alt: 'Modern hero background',
	quality: 85,
	priority: true
};

// Default animation configuration
const defaultAnimation: HeroAnimation = {
	duration: 1.0,
	delay: 0.1,
	ease: 'easeOut',
	enabled: true
};

export default function ModernHero({
	content = defaultContent,
	primaryCTA = defaultPrimaryCTA,
	secondaryCTA = defaultSecondaryCTA,
	backgroundImage = defaultBackgroundImage,
	animation = defaultAnimation,
	enableIntersectionObserver = true,
	className = "",
	...props
}: ModernHeroProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.1 },
		);

		const element = document.querySelector('.hero-container');
		if (element) {
			observer.observe(element);
		}

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	}, []);

	return (
		<div 
			className={cn(
				"hero-container relative min-h-screen overflow-hidden",
				heroSpacingClasses.section.default,
				className
			)}
			{...props}
		>
			{/* Background image */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: `url(${backgroundImage.src})`,
				}}
			/>
			{/* Dark overlay for better text readability */}
			<div className="absolute inset-0 bg-black/40" />

			<div className={cn(heroSpacingClasses.container.default, "relative")}>
				<div className={cn("mx-auto flex flex-col items-center justify-center text-center", heroSpacingClasses.container.narrow)}>
					{/* Content Section */}
					<div
						className={cn(heroSpacingClasses.content.default, "transition-all duration-1000 ease-out", {
							'translate-y-0 opacity-100': isVisible,
							'translate-y-8 opacity-0': !isVisible
						})}
					>
						<div className="space-y-3">
							{content.subtitle && (
								<h2
									className={`text-xs font-medium uppercase tracking-wider text-stone-200 transition-all delay-200 duration-700 sm:text-sm ${
										isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
									}`}
								>
									{content.subtitle}
								</h2>
							)}
							<h1
								className={`duration-800 text-3xl font-bold tracking-tight text-white transition-all delay-300 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl ${
									isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
								}`}
							>
								{content.title}
							</h1>
						</div>

						{content.description && (
							<p
								className={`delay-400 mx-auto max-w-[600px] px-4 text-base leading-relaxed text-stone-300 transition-all duration-700 sm:text-lg ${
									isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
								}`}
							>
								{content.description}
							</p>
						)}

						{(primaryCTA || secondaryCTA) && (
							<div
								className={`flex flex-col items-center justify-center gap-4 transition-all delay-500 duration-700 sm:flex-row ${
									isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
								}`}
							>
								{primaryCTA && (
                                                                        <Button
                                                                                className="group w-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-fit sm:px-8 sm:text-base"
                                                                                asChild
									>
										<Link href={primaryCTA.href} aria-label={primaryCTA['aria-label']}>
											{primaryCTA.text}
											{primaryCTA.icon}
										</Link>
									</Button>
								)}
								{secondaryCTA && (
									<Button
										className="group w-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-fit sm:px-8 sm:text-base"
										asChild
									>
										<Link href={secondaryCTA.href} aria-label={secondaryCTA['aria-label']}>
											{secondaryCTA.text}
                                            {secondaryCTA.icon || <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
										</Link>
									</Button>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
