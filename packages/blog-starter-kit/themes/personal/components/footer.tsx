import Link from 'next/link';
import { useAppContext } from './contexts/appContext';
import { SocialLinks } from './social-links';

export const Footer = () => {
	const { publication } = useAppContext();
	const currentYear = new Date().getFullYear();

	return (
		<footer className="relative border-t bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
			{/* Decorative gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-neutral-100/50 to-transparent dark:from-neutral-800/50"></div>
			
			<div className="relative mx-auto max-w-4xl px-5 py-12">
				{/* Main footer content */}
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{/* Brand section */}
					<div className="md:col-span-2">
						<div className="mb-6">
							<h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
								{publication.title}
							</h3>
							<p className="mt-2 text-neutral-600 dark:text-neutral-400 max-w-md">
								{publication.descriptionSEO || "Sharing insights on technology, design, and innovation"}
							</p>
						</div>
						
						{/* Social links */}
						<div className="mb-6">
							<SocialLinks />
						</div>
					</div>

					{/* Quick links */}
					<div className="space-y-6">
						<div>
							<h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-50">
								Quick Links
							</h4>
							<ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
								<li>
									<a href="/about" className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-50">
										About
									</a>
								</li>
								<li>
									<a href="/blog" className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-50">
										Blog
									</a>
								</li>
								<li>
									<a href="/newsletter" className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-50">
										Newsletter
									</a>
								</li>
								<li>
									<a href="mailto:hello@example.com" className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-50">
										Contact
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Bottom section */}
				<div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-6">
					<div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
						<div className="text-sm text-neutral-600 dark:text-neutral-400">
							<p>&copy; {currentYear} {publication.title}. All rights reserved.</p>
						</div>
						
						<div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
							<a href="/privacy" className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-50">
								Privacy
							</a>
							<a href="/terms" className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-50">
								Terms
							</a>
						</div>
					</div>
					
					<div className="mt-4 text-center text-xs text-neutral-500 dark:text-neutral-500">
						<p>
							Exclusively Built by{' '}
							<a 
								href="https://schibelli.dev" 
								target="_blank" 
								rel="noopener noreferrer"
								className="underline transition-colors hover:text-neutral-700 dark:hover:text-neutral-300"
							>
								John Schibelli
							</a>
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};
