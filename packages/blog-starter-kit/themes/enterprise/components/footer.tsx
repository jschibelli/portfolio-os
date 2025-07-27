import Link from 'next/link';
import { Container } from './container';
import { useAppContext } from './contexts/appContext';
import { SocialLinks } from './social-links';

export const Footer = () => {
	const { publication } = useAppContext();
	const PUBLICATION_LOGO = publication.preferences.logo;
	const currentYear = new Date().getFullYear();
	
	return (
		<footer className="relative border-t bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
			{/* Decorative gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 to-transparent dark:from-neutral-800/50"></div>
			
			<Container className="relative px-5 py-16">
				{/* Main footer content */}
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
					{/* Brand section */}
					<div className="lg:col-span-2">
						{PUBLICATION_LOGO ? (
							<div className="mb-6">
								<Link
									href={'/'}
									aria-label={`${publication.title} home page`}
									className="inline-block transition-transform hover:scale-105"
								>
									<img className="h-12 w-auto" src={PUBLICATION_LOGO} alt={publication.title} />
								</Link>
							</div>
						) : (
							<div className="mb-6">
								<h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
									{publication.title}
								</h3>
								<p className="mt-2 text-slate-600 dark:text-slate-400 max-w-md">
									{publication.descriptionSEO || "Sharing insights on technology, design, and innovation"}
								</p>
							</div>
						)}
						
						{/* Social links */}
						<div className="mb-8">
							<SocialLinks />
						</div>
					</div>

					{/* Quick links */}
					<div className="space-y-8">
						<div>
							<h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-50">
								Connect
							</h4>
							<ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
								<li>
									<a href="mailto:hello@example.com" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										Get in touch
									</a>
								</li>
								<li>
									<Link href="/newsletter" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										Newsletter
									</Link>
								</li>
								<li>
									<Link href="/about" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										About me
									</Link>
								</li>
								<li>
									<Link href="/portfolio" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										Portfolio
									</Link>
								</li>
							</ul>
						</div>
					</div>

					{/* Resources */}
					<div className="space-y-8">
						<div>
							<h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-50">
								Resources
							</h4>
							<ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
								<li>
									<Link href="/blog" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										All posts
									</Link>
								</li>
								<li>
									<Link href="/series" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										Series
									</Link>
								</li>
								<li>
									<Link href="/tags" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										Topics
									</Link>
								</li>
								<li>
									<a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										RSS Feed
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Bottom section */}
				<div className="mt-12 border-t border-slate-200 dark:border-neutral-800 pt-8">
					<div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
						<div className="text-sm text-slate-600 dark:text-slate-400">
							<p>&copy; {currentYear} {publication.title}. All rights reserved.</p>
						</div>
						
						<div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
							<Link href="/privacy" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
								Privacy
							</Link>
							<Link href="/terms" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
								Terms
							</Link>
							<Link href="/cookies" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
								Cookies
							</Link>
						</div>
					</div>
					
					<div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-500">
						<p>
							Exclusively Built by{' '}
							<a 
								href="https://schibelli.dev" 
								target="_blank" 
								rel="noopener noreferrer"
								className="underline transition-colors hover:text-slate-700 dark:hover:text-slate-300"
							>
								John Schibelli
							</a>
						</p>
					</div>
				</div>
			</Container>
		</footer>
	);
};
