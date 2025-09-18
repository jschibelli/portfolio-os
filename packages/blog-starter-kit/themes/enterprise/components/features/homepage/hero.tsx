import { ArrowRightIcon, MessageSquareIcon } from 'lucide-react';
import Link from 'next/link';
import BaseHero, { type HeroButtonProps } from '../sections/hero/base-hero';
import { PRIMARY_BUTTON_STYLES, SECONDARY_BUTTON_STYLES, ICON_SPACING } from '../../../lib/button-styles';

export default function Hero() {
	const buttons: HeroButtonProps[] = [
		{
			href: '/contact',
			text: 'Discuss Your Goals',
			variant: 'default',
			size: 'lg',
			icon: <MessageSquareIcon className={ICON_SPACING.left} />,
			iconRight: <ArrowRightIcon className={`${ICON_SPACING.right} transition-transform group-hover:translate-x-1`} />,
			className: `${PRIMARY_BUTTON_STYLES} min-w-[180px] justify-center`
		},
		{
			href: '/projects',
			text: 'See My Results',
			variant: 'secondary',
			size: 'lg',
			iconRight: <ArrowRightIcon className={`${ICON_SPACING.right} transition-transform group-hover:translate-x-1`} />,
			className: `${SECONDARY_BUTTON_STYLES} min-w-[160px] justify-center`
		}
	];

	return (
		<BaseHero
			title="Building Smarter, Faster Web Applications"
			subtitle="John Schibelli"
			description="Senior Front-End Developer"
			backgroundImage="/assets/hero/hero-bg.png"
			overlay={<div className="bg-gradient-radial from-stone-900/80 via-stone-900/60 to-stone-900/40" />}
			buttons={buttons}
			className="min-h-[400px] py-12 md:py-16"
			contentClassName="container mx-auto px-4"
			titleClassName="text-4xl font-bold tracking-tight text-white leading-tight md:text-6xl lg:text-7xl md:leading-tight lg:leading-tight"
			subtitleClassName="text-xl font-semibold text-stone-200 md:text-2xl lg:text-3xl"
			descriptionClassName="text-lg font-semibold text-stone-300 md:text-xl lg:text-2xl"
			customContent={
				<div className="mx-auto max-w-3xl text-base font-medium leading-relaxed text-stone-300 md:text-lg lg:text-xl">
					Transforming ideas into high-performance digital experiences that drive business growth. 
					Expert in React, Next.js, and TypeScript with 15+ years of proven results.
				</div>
			}
			children={
				<div className="flex flex-col items-center justify-center gap-2">
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
				</div>
			}
			animate={true}
		/>
	);
}
