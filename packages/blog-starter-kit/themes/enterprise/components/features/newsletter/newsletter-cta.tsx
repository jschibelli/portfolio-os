import request from 'graphql-request';
import { ReactNode, useState } from 'react';
import { siteConfig } from '../../../config/site';
import {
	SubscribeToNewsletterDocument,
	SubscribeToNewsletterMutation,
	SubscribeToNewsletterMutationVariables,
	SubscribeToNewsletterPayload,
} from '../../../generated/graphql';
import { cn } from '../../../lib/utils';
import { useAppContext } from '../../contexts/appContext';
import { Button, type ButtonProps, Section } from '../../ui';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

interface CTAButtonProps {
	href: string;
	text: string;
	variant?: ButtonProps['variant'];
	icon?: ReactNode;
	iconRight?: ReactNode;
}

interface CTAProps {
	title?: string;
	buttons?: CTAButtonProps[] | false;
	className?: string;
	showNewsletterForm?: boolean;
}

export default function CTA({
	title = 'Start building',
	buttons = [
		{
			href: siteConfig.getStartedUrl,
			text: 'Get Started',
			variant: 'default',
		},
	],
	className,
	showNewsletterForm = false,
}: CTAProps) {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<SubscribeToNewsletterPayload['status']>();
	const [requestInProgress, setRequestInProgress] = useState(false);
	const [error, setError] = useState('');

	// Try to get publication from context, but handle case where it's not available
	let publication;
	try {
		const context = useAppContext();
		publication = context.publication;
	} catch (error) {
		// Component is being used outside of AppProvider context
		publication = null;
	}

	const subscribe = async () => {
		if (!email.trim()) {
			setError('Please enter a valid email address');
			return;
		}

		if (!publication) {
			// If no publication is available (e.g., in test page), show a demo message
			setStatus('Pending' as any);
			setEmail('');
			return;
		}

		setRequestInProgress(true);
		setError('');

		try {
			const data = await request<
				SubscribeToNewsletterMutation,
				SubscribeToNewsletterMutationVariables
			>(GQL_ENDPOINT, SubscribeToNewsletterDocument, {
				input: { publicationId: publication.id, email },
			});

			setStatus(data.subscribeToNewsletter.status);
			setEmail('');
		} catch (error: any) {
			const message =
				error.response?.errors?.[0]?.message || 'Something went wrong. Please try again.';
			setError(message);
		} finally {
			setRequestInProgress(false);
		}
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		if (error) setError('');
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			subscribe();
		}
	};

	return (
		<Section className={cn('group relative overflow-hidden', className)}>
			{/* Subtle background for newsletter section */}
			<div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-white opacity-40 dark:from-stone-800 dark:via-stone-900 dark:to-stone-950" />
			<div className="max-w-container relative z-10 mx-auto flex flex-col items-center gap-4 px-4 text-center sm:gap-6 sm:px-6 lg:gap-8 lg:px-8">
				<h2 className="max-w-[640px] text-2xl font-semibold leading-tight sm:text-3xl sm:leading-tight md:text-4xl lg:text-5xl">
					{title}
				</h2>

				{showNewsletterForm && !status ? (
					<div className="flex w-full max-w-md flex-col gap-4 sm:max-w-lg lg:max-w-xl">
						<div className="flex flex-col gap-3 sm:flex-row">
							<input
								type="email"
								value={email}
								onChange={handleEmailChange}
								onKeyPress={handleKeyPress}
								placeholder="Email address"
								className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring hover:border-primary/50 focus:border-primary flex-1 rounded-lg border px-3 py-2 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:px-4 sm:py-3 sm:text-base"
								disabled={requestInProgress}
							/>
							<Button
								onClick={subscribe}
								disabled={requestInProgress || !email.trim()}
								size="lg"
								className="group w-full px-6 py-2 text-sm font-medium shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg sm:w-fit sm:px-8 sm:py-3 sm:text-base"
							>
								{requestInProgress ? (
									<div className="flex items-center gap-2">
										<div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent sm:h-4 sm:w-4" />
										<span className="hidden sm:inline">Subscribing...</span>
										<span className="sm:hidden">...</span>
									</div>
								) : (
									<span className="transition-all duration-300 group-hover:translate-x-1">
										Subscribe
									</span>
								)}
							</Button>
						</div>

						{error && (
							<div className="rounded-md bg-red-50 p-2 text-center text-xs text-red-600 sm:p-3 sm:text-sm dark:bg-red-900/20">
								{error}
							</div>
						)}

						<p className="text-muted-foreground px-2 text-center text-xs sm:px-0">
							No spam, unsubscribe at any time. We respect your privacy.
						</p>
					</div>
				) : status === 'PENDING' ? (
					<div className="space-y-3 px-4 text-center sm:space-y-4 sm:px-0">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 sm:h-16 sm:w-16 dark:bg-green-900/20">
							<svg
								className="h-6 w-6 text-green-600 sm:h-8 sm:w-8"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<div>
							<h3 className="mb-2 text-lg font-semibold text-green-600 sm:text-xl">
								Almost there!
							</h3>
							<p className="text-muted-foreground text-sm sm:text-base">
								We&apos;ve sent a confirmation email to your inbox. Please check your email and
								click the confirmation link to complete your subscription.
							</p>
						</div>
					</div>
				) : buttons !== false && buttons.length > 0 ? (
					<div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
						{buttons.map((button, index) => (
							<Button
								key={index}
								variant={button.variant || 'default'}
								size="lg"
								className="w-full sm:w-auto"
								asChild
							>
								<a href={button.href}>
									{button.icon}
									{button.text}
									{button.iconRight}
								</a>
							</Button>
						))}
					</div>
				) : null}
			</div>
			<div className="absolute left-0 top-0 h-full w-full translate-y-[1rem] opacity-80 transition-all duration-500 ease-in-out group-hover:translate-y-[-2rem] group-hover:opacity-100">
				{/* Decorative glow removed per design feedback */}
			</div>
		</Section>
	);
}
