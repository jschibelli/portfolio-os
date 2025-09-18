import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import BaseHero, { type HeroButtonProps } from '../sections/hero/base-hero';

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
	const buttons: HeroButtonProps[] = [];
	
	if (ctaText && ctaLink) {
		buttons.push({
			href: ctaLink,
			text: ctaText,
			variant: 'default',
			size: 'lg',
			className: 'group w-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-fit sm:px-8 sm:text-base'
		});
	}
	
	buttons.push({
		href: '/blog',
		text: 'Read the Blog',
		variant: 'outline',
		size: 'lg',
		iconRight: <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />,
		className: 'group w-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-fit sm:px-8 sm:text-base'
	});

	return (
		<BaseHero
			title={title}
			subtitle={subtitle}
			description={description}
			backgroundImage="/assets/hero/hero-bg1.png"
			overlay={<div className="bg-black/40" />}
			buttons={buttons}
			className="min-h-[400px] py-12 md:py-16"
			contentClassName="container mx-auto px-4"
			titleClassName="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
			descriptionClassName="text-base leading-relaxed text-stone-300 sm:text-lg max-w-[600px] px-4"
			animate={true}
		/>
	);
}
