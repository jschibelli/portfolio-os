import { ArrowRightIcon } from 'lucide-react';
import { ReactNode } from 'react';

import Github from '../../logos/github';
import { Badge } from '../../ui/badge';
import { Mockup, MockupFrame } from '../../ui/mockup';
import Screenshot from '../../ui/screenshot';
import BaseHero, { type BaseHeroProps, type HeroButtonProps } from './base-hero';

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
		<BaseHero
			title={title}
			description={description}
			badge={badge}
			buttons={buttons}
			backgroundGradient="linear-gradient(to bottom right, rgb(250 250 249 / 0.6), rgb(255 255 255), rgb(245 245 244))"
			className={`fade-bottom pb-0 sm:pb-0 md:pb-0 ${className || ''}`}
			contentClassName="max-w-container gap-12 pt-16 sm:gap-24"
			titleClassName="text-4xl font-semibold leading-tight sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight"
			descriptionClassName="text-md font-medium sm:text-xl max-w-[740px]"
			customContent={
				mockup !== false && (
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
				)
			}
		/>
	);
}
