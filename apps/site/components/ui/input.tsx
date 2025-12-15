import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	// Add accessibility-specific props
	'aria-describedby'?: string;
	'aria-invalid'?: boolean;
	'aria-required'?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					'border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
					className,
				)}
				ref={ref}
				// Suppress hydration warnings for browser extension attributes
				// (e.g., fdprocessedid, data-np-mark) that are added by form fillers/password managers
				suppressHydrationWarning
				// Ensure proper accessibility attributes
				aria-invalid={props['aria-invalid'] || props['aria-describedby'] ? undefined : false}
				{...props}
			/>
		);
	},
);
Input.displayName = 'Input';

export { Input };
