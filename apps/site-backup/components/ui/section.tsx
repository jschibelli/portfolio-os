import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionProps {
	children: ReactNode;
	className?: string;
	id?: string;
	'data-animate-section'?: boolean;
}

export function Section({
	children,
	className,
	id,
	'data-animate-section': dataAnimateSection,
	...props
}: SectionProps) {
	return (
		<section
			className={cn('relative', className)}
			id={id}
			data-animate-section={dataAnimateSection}
			{...props}
		>
			{children}
		</section>
	);
}
