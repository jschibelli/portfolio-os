import { Button } from '../../ui';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ModernHeroProps {
	title: string;
	subtitle: string;
	description: string;
	ctaText?: string;
	ctaLink?: string;
	imageUrl?: string;
}

export default function ModernHero({
	title,
	subtitle,
	description,
	ctaText,
	ctaLink,
	imageUrl = '/assets/hero/hero-image.webp',
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
		<div className="hero-container relative min-h-[400px] overflow-hidden py-12 md:py-16">
			{/* Background image */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: 'url(/assets/hero/hero-bg1.png)',
				}}
			/>
			{/* Dark overlay for better text readability */}
			<div className="absolute inset-0 bg-black/40" />

			<div className="container relative mx-auto px-4">
				<div className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
					{/* Content Section */}
					<div
						className={`space-y-6 transition-all duration-1000 ease-out ${
							isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
						}`}
					>
						<div className="space-y-3">
							<h2
								className={`text-xs font-medium uppercase tracking-wider text-stone-200 transition-all delay-200 duration-700 sm:text-sm ${
									isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
								}`}
							>
								{subtitle}
							</h2>
							<h1
								className={`hero-title duration-800 text-white transition-all delay-300 ${
									isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
								}`}
							>
								{title}
							</h1>
						</div>

						<p
							className={`hero-description delay-400 mx-auto max-w-[600px] px-4 text-stone-300 transition-all duration-700 ${
								isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
							}`}
						>
							{description}
						</p>

						{ctaText && ctaLink && (
							<div
								className={`flex flex-col items-center justify-center gap-4 transition-all delay-500 duration-700 sm:flex-row ${
									isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
								}`}
							>
								<Button
									size="lg"
									className="group w-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-fit sm:px-8 sm:text-base"
									asChild
								>
									<a href={ctaLink}>{ctaText}</a>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="group w-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-fit sm:px-8 sm:text-base"
									asChild
								>
									<Link href="/blog">
										Read the Blog
										<ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
									</Link>
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
