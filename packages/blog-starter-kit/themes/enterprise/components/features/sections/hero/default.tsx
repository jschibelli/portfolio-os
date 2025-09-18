import { ArrowRightIcon } from 'lucide-react';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import Github from '../../logos/github';
import { Badge } from '../../ui/badge';
import { Button, type ButtonProps } from '../../ui/button';
import { Mockup, MockupFrame } from '../../ui/mockup';
import Screenshot from '../../ui/screenshot';
import { Section } from '../../ui/section';

interface HeroButtonProps {
	href: string;
	text: string;
	variant?: ButtonProps['variant'];
	icon?: ReactNode;
	iconRight?: ReactNode;
}

interface HeroProps {
	title?: string;
	description?: string;
	mockup?: ReactNode | false;
	badge?: ReactNode | false;
	buttons?: HeroButtonProps[] | false;
	className?: string;
}

export default function Hero({
	title = 'Give your big idea the design it deserves',
	description = 'Professionally designed blocks and templates built with React, Shadcn/ui and Tailwind that will help your product stand out.',
	mockup = (
		<Screenshot
			srcLight="/app-light.png"
			srcDark="/app-dark.png"
			alt="Launch UI app screenshot"
			width={1248}
			height={765}
			className="w-full"
		/>
	),
	badge = (
		<Badge variant="outline" className="animate-appear">
			<span className="text-muted-foreground">New version of Launch UI is out!</span>
			<a href="https://www.launchuicomponents.com/" className="flex items-center gap-1">
				Get started
				<ArrowRightIcon className="size-3" />
			</a>
		</Badge>
	),
	buttons = [
		{
			href: 'https://www.launchuicomponents.com/',
			text: 'Get Started',
			variant: 'default',
		},
		{
			href: 'https://www.launchuicomponents.com/',
			text: 'Github',
			variant: 'glow',
			icon: <Github className="mr-2 size-4" />,
		},
	],
	className,
}: HeroProps) {
	return (
		<Section className={cn('fade-bottom relative overflow-hidden pb-0 sm:pb-0 md:pb-0', className)}>
			{/* Subtle background gradient for visual interest */}
			<div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-stone-100 opacity-60 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800" />
			<div className="max-w-container relative mx-auto flex flex-col gap-12 pt-16 sm:gap-24">
				<div className="flex flex-col items-center gap-6 text-center sm:gap-12">
					{badge !== false && badge}
					<h1 className="hero-title animate-appear from-foreground to-foreground dark:to-muted-foreground bg-linear-to-r relative z-10 inline-block text-balance bg-clip-text text-transparent drop-shadow-2xl">
						{title}
					</h1>
					<p className="hero-description animate-appear text-muted-foreground relative z-10 max-w-[740px] text-balance opacity-0 delay-100">
						{description}
					</p>
					{buttons !== false && buttons.length > 0 && (
						<div className="animate-appear relative z-10 flex justify-center gap-4 opacity-0 delay-300">
							{buttons.map((button, index) => (
								<Button key={index} variant={button.variant || 'default'} size="lg" asChild>
									<a href={button.href}>
										{button.icon}
										{button.text}
										{button.iconRight}
									</a>
								</Button>
							))}
						</div>
					)}
					{mockup !== false && (
						<div className="relative w-full pt-12">
							<MockupFrame className="animate-appear opacity-0 delay-700" size="small">
								<Mockup
									type="responsive"
									className="bg-background/90 w-full rounded-xl border border-stone-200 shadow-lg dark:border-stone-700"
								>
									{mockup}
								</Mockup>
							</MockupFrame>
						</div>
					)}
				</div>
			</div>
		</Section>
	);
}
