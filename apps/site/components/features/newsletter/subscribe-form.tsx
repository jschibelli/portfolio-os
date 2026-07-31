import { useRef, useState } from 'react';
import { Button } from '../../ui/button';

/**
 * Newsletter signup — posts to the site contact API (Hashnode newsletter removed).
 */
export const SubscribeForm = () => {
	const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
	const [requestInProgress, setRequestInProgress] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const subscribe = async () => {
		const email = inputRef.current?.value?.trim();
		if (!email) return;

		setRequestInProgress(true);
		setStatus('idle');

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: 'Newsletter subscriber',
					email,
					message: 'Newsletter signup request',
					source: 'newsletter',
				}),
			});
			setStatus(res.ok ? 'success' : 'error');
		} catch {
			setStatus('error');
		} finally {
			setRequestInProgress(false);
		}
	};

	return (
		<>
			{status !== 'success' && (
				<div className="relative w-full rounded-full bg-white p-2 dark:bg-neutral-950">
					<input
						ref={inputRef}
						type="email"
						placeholder="john@doe.com"
						className="focus:outline-primary-600 dark:focus:outline-primary-500 left-3 top-3 w-full rounded-full p-3 text-base text-black outline-none dark:bg-neutral-950 dark:text-neutral-50"
					/>
					<Button
						disabled={requestInProgress}
						onClick={subscribe}
						size="sm"
						className="absolute right-3 top-3 rounded-full"
					>
						Subscribe
					</Button>
				</div>
			)}
			{status === 'success' && (
				<div className="relative w-full p-2 text-center">
					<p className="font-bold text-green-600 dark:text-green-500">Thanks for signing up!</p>
					<p className="font-medium text-slate-600 dark:text-neutral-300">
						We received your email and will be in touch.
					</p>
				</div>
			)}
			{status === 'error' && (
				<p className="mt-2 text-center text-sm text-red-600 dark:text-red-400">
					Something went wrong. Please try again or use the contact form.
				</p>
			)}
		</>
	);
};
