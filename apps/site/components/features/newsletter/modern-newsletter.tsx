import { Button, Card, CardContent, CardHeader, CardTitle, Glow } from '@/components/ui';
import request from 'graphql-request';
import React, { useEffect, useState } from 'react';
import {
	SubscribeToNewsletterDocument,
	SubscribeToNewsletterMutation,
	SubscribeToNewsletterMutationVariables,
	SubscribeToNewsletterPayload,
} from '../generated/graphql';
import { useAppContext } from './contexts/appContext';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

interface ModernNewsletterProps {
	title?: string;
	description?: string;
	placeholder?: string;
	buttonText?: string;
}

export default function ModernNewsletter({
	title = 'Stay updated with our newsletter',
	description = 'Get the latest posts and updates delivered to your inbox.',
	placeholder = 'Enter your email',
	buttonText = 'Subscribe',
}: ModernNewsletterProps) {
	const [isVisible, setIsVisible] = useState(false);
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

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.1 },
		);

		const element = document.querySelector('.newsletter-container');
		if (element) {
			observer.observe(element);
		}

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	}, []);

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
		<div className="newsletter-container relative overflow-hidden transition-all duration-1000 ease-out">
			<Glow
				variant="center"
				className={`opacity-30 transition-all duration-1000 ${isVisible ? 'animate-appear-zoom' : 'scale-95 opacity-0'}`}
			/>

			<Card
				className={`border-border/50 from-background to-muted/20 relative bg-gradient-to-br backdrop-blur-sm transition-all duration-1000 ${
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
				}`}
			>
				<CardHeader className="pb-4 text-center">
					<CardTitle
						className={`text-2xl font-bold transition-all delay-200 duration-700 ${
							isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
						}`}
					>
						{title}
					</CardTitle>
					<p
						className={`text-muted-foreground transition-all delay-300 duration-700 ${
							isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
						}`}
					>
						{description}
					</p>
				</CardHeader>

				<CardContent className="space-y-6">
					{!status ? (
						<>
							<div
								className={`delay-400 flex flex-col gap-3 transition-all duration-700 sm:flex-row ${
									isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
								}`}
							>
								<input
									type="email"
									value={email}
									onChange={handleEmailChange}
									onKeyDown={handleKeyPress}
									placeholder={placeholder}
									className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring hover:border-primary/50 focus:border-primary flex-1 rounded-md border px-3 py-2 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
									disabled={requestInProgress}
									// Suppress hydration warnings for browser extension attributes
									suppressHydrationWarning
								/>
								<Button
									onClick={subscribe}
									disabled={requestInProgress || !email.trim()}
									className="group w-full transition-all duration-300 hover:scale-105 hover:shadow-lg sm:w-auto"
								>
									{requestInProgress ? (
										<div className="flex items-center gap-2">
											<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
											Subscribing...
										</div>
									) : (
										<span className="transition-all duration-300 group-hover:translate-x-1">
											{buttonText}
										</span>
									)}
								</Button>
							</div>

							{error && (
								<div
									className={`rounded-md bg-red-50 p-3 text-center text-sm text-red-600 transition-all delay-500 duration-700 dark:bg-red-900/20 ${
										isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
									}`}
								>
									{error}
								</div>
							)}

							<p
								className={`text-muted-foreground delay-600 text-center text-xs transition-all duration-700 ${
									isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
								}`}
							>
								No spam, unsubscribe at any time. We respect your privacy.
							</p>
						</>
					) : status === 'PENDING' ? (
						<div
							className={`delay-400 space-y-4 text-center transition-all duration-700 ${
								isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
							}`}
						>
							<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
								<svg
									className="h-8 w-8 text-green-600"
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
								<h3 className="mb-2 text-xl font-semibold text-green-600">Almost there!</h3>
								<p className="text-muted-foreground">
									We&apos;ve sent a confirmation email to your inbox. Please check your email and
									click the confirmation link to complete your subscription.
								</p>
							</div>
						</div>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
