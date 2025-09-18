import { ReactNode } from 'react';
import { cn } from '../../../../lib/utils';
import { Section } from '../../../ui/section';

export interface HeroButtonProps {
	href: string;
	text: string;
	variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'glow';
	size?: 'sm' | 'md' | 'lg';
	icon?: ReactNode;
	iconRight?: ReactNode;
	className?: string;
}

export interface BaseHeroProps {
	// Content
	title?: string;
	subtitle?: string;
	description?: string;
	
	// Visual elements
	badge?: ReactNode | false;
	backgroundImage?: string;
	backgroundGradient?: string;
	overlay?: ReactNode | false;
	
	// Interactive elements
	buttons?: HeroButtonProps[] | false;
	
	// Layout
	layout?: 'centered' | 'left' | 'right' | 'split';
	contentAlignment?: 'left' | 'center' | 'right';
	
	// Styling
	className?: string;
	contentClassName?: string;
	titleClassName?: string;
	descriptionClassName?: string;
	
	// Animation
	animate?: boolean;
	animationDelay?: number;
	
	// Custom content
	children?: ReactNode;
	customContent?: ReactNode;
}

export default function BaseHero({
	title,
	subtitle,
	description,
	badge,
	backgroundImage,
	backgroundGradient,
	overlay,
	buttons,
	layout = 'centered',
	contentAlignment = 'center',
	className,
	contentClassName,
	titleClassName,
	descriptionClassName,
	animate = true,
	animationDelay = 0,
	children,
	customContent,
}: BaseHeroProps) {
	const getLayoutClasses = () => {
		switch (layout) {
			case 'left':
				return 'text-left items-start';
			case 'right':
				return 'text-right items-end';
			case 'split':
				return 'text-left items-start md:flex-row';
			default:
				return 'text-center items-center';
		}
	};

	const getContentAlignment = () => {
		switch (contentAlignment) {
			case 'left':
				return 'text-left items-start';
			case 'right':
				return 'text-right items-end';
			default:
				return 'text-center items-center';
		}
	};

	const getAnimationClasses = () => {
		if (!animate) return '';
		return 'animate-appear';
	};

	return (
		<Section className={cn('relative overflow-hidden', className)}>
			{/* Background */}
			{backgroundImage && (
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat"
					style={{ backgroundImage: `url(${backgroundImage})` }}
				/>
			)}
			
			{backgroundGradient && (
				<div
					className="absolute inset-0"
					style={{ background: backgroundGradient }}
				/>
			)}
			
			{/* Overlay */}
			{overlay !== false && overlay && (
				<div className="absolute inset-0 z-10">{overlay}</div>
			)}
			
			{/* Default overlay for readability if background image exists */}
			{backgroundImage && !overlay && (
				<div className="absolute inset-0 bg-black/40 z-10" />
			)}

			{/* Content */}
			<div className={cn(
				'relative z-20 mx-auto flex flex-col gap-6 py-16 sm:gap-8 md:py-24',
				getLayoutClasses(),
				contentClassName
			)}>
				<div className={cn(
					'flex flex-col gap-6 sm:gap-8',
					getContentAlignment()
				)}>
					{/* Badge */}
					{badge !== false && badge && (
						<div className={cn(getAnimationClasses(), 'opacity-0 delay-100')}>
							{badge}
						</div>
					)}

					{/* Subtitle */}
					{subtitle && (
						<p className={cn(
							'text-sm font-medium uppercase tracking-wider text-muted-foreground sm:text-base',
							getAnimationClasses(),
							'opacity-0 delay-200'
						)}>
							{subtitle}
						</p>
					)}

					{/* Title */}
					{title && (
						<h1 className={cn(
							'text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl',
							'bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent',
							getAnimationClasses(),
							'opacity-0 delay-300',
							titleClassName
						)}>
							{title}
						</h1>
					)}

					{/* Description */}
					{description && (
						<p className={cn(
							'text-lg leading-relaxed text-muted-foreground sm:text-xl md:text-2xl',
							'max-w-3xl',
							getAnimationClasses(),
							'opacity-0 delay-400',
							descriptionClassName
						)}>
							{description}
						</p>
					)}

					{/* Buttons */}
					{buttons !== false && buttons && buttons.length > 0 && (
						<div className={cn(
							'flex flex-col gap-4 sm:flex-row sm:gap-6',
							contentAlignment === 'center' ? 'justify-center' : 
							contentAlignment === 'right' ? 'justify-end' : 'justify-start',
							getAnimationClasses(),
							'opacity-0 delay-500'
						)}>
							{buttons.map((button, index) => (
								<a
									key={index}
									href={button.href}
									className={cn(
										'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300',
										'hover:scale-105 hover:shadow-lg',
										button.variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
										button.variant === 'outline' && 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
										button.variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
										button.variant === 'glow' && 'bg-primary text-primary-foreground shadow-lg hover:shadow-xl',
										!button.variant && 'bg-primary text-primary-foreground hover:bg-primary/90',
										button.size === 'sm' && 'px-4 py-2 text-xs',
										button.size === 'lg' && 'px-8 py-4 text-base',
										button.className
									)}
								>
									{button.icon}
									{button.text}
									{button.iconRight}
								</a>
							))}
						</div>
					)}

					{/* Custom content */}
					{customContent && (
						<div className={cn(
							getAnimationClasses(),
							'opacity-0 delay-600'
						)}>
							{customContent}
						</div>
					)}
				</div>

				{/* Children content */}
				{children && (
					<div className={cn(
						getAnimationClasses(),
						'opacity-0 delay-700'
					)}>
						{children}
					</div>
				)}
			</div>
		</Section>
	);
}
