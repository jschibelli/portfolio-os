import Link from 'next/link';
import { Container } from './container';
import { useAppContext } from './contexts/appContext';
import { SocialLinks } from './social-links';
import { Button } from './ui/button';
import { useState } from 'react';
import { ArrowRightIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';

export const Footer = () => {
	const { publication } = useAppContext();
	const PUBLICATION_LOGO = publication.preferences.logo;
	const currentYear = new Date().getFullYear();
	const [email, setEmail] = useState('');
	const [isSubscribed, setIsSubscribed] = useState(false);

	const handleNewsletterSignup = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Here you would typically handle the newsletter signup
		setIsSubscribed(true);
		setEmail('');
		// Reset after 3 seconds
		setTimeout(() => setIsSubscribed(false), 3000);
	};

	return (
		<footer className="relative border-t bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800">
			{/* Decorative gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-stone-100/50 to-transparent dark:from-stone-800/50"></div>
			
			<Container className="relative px-5 py-16">
				{/* Main footer content - Hidden on mobile and tablet */}
				<div className="hidden lg:grid grid-cols-1 gap-12 lg:grid-cols-12">
					{/* Brand section */}
					<div className="lg:col-span-4">
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
								<p className="mt-3 text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
									{publication.descriptionSEO || "Sharing insights on technology, design, and innovation. Building the future, one line of code at a time."}
								</p>
							</div>
						)}
						
						{/* Newsletter Signup */}
						<div className="mb-8">
							<h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-50">
								Stay Updated
							</h4>
							<form onSubmit={handleNewsletterSignup} className="space-y-3">
								<div className="flex gap-2">
									<input
										type="email"
										placeholder="Enter your email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										required
									/>
									<Button type="submit" size="sm" className="px-4">
										<ArrowRightIcon className="h-4 w-4" />
									</Button>
								</div>
								{isSubscribed && (
									<p className="text-sm text-green-600 dark:text-green-400">
										Thanks for subscribing! 🎉
									</p>
								)}
							</form>
						</div>

						{/* Social links */}
						<div className="mb-8">
							<h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-50">
								Follow Us
							</h4>
							<SocialLinks />
						</div>
					</div>

					{/* Quick links */}
					<div className="lg:col-span-2">
						<div>
							<h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-50">
								Connect
							</h4>
							<ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
								<li>
									<a href="mailto:hello@example.com" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50 flex items-center gap-2">
										<MailIcon className="h-4 w-4" />
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
								<li>
									<Link href="/services" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										Services
									</Link>
								</li>
							</ul>
						</div>
					</div>

					{/* Resources */}
					<div className="lg:col-span-2">
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
								<li>
									<Link href="/case-studies" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										Case Studies
									</Link>
								</li>
							</ul>
						</div>
					</div>

					{/* Services */}
					<div className="lg:col-span-2">
						<div>
							<h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-50">
								Services
							</h4>
							<ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
								<li>
									<Link href="/services/web-development" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										Web Development
									</Link>
								</li>
								<li>
									<Link href="/services/mobile-development" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										Mobile Development
									</Link>
								</li>
								<li>
									<Link href="/services/cloud-solutions" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										Cloud Solutions
									</Link>
								</li>
								<li>
									<Link href="/services/consulting" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										Consulting
									</Link>
								</li>
							</ul>
						</div>
					</div>

					{/* Contact Info */}
					<div className="lg:col-span-2">
						<div>
							<h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-50">
								Contact
							</h4>
							<div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
								<div className="flex items-start gap-2">
									<MailIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
									<a href="mailto:hello@example.com" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										hello@example.com
									</a>
								</div>
								<div className="flex items-start gap-2">
									<PhoneIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
									<a href="tel:+1234567890" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
										+1 (234) 567-890
									</a>
								</div>
								<div className="flex items-start gap-2">
									<MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
									<span>San Francisco, CA</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom section - Always visible */}
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
							<Link href="/sitemap" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
								Sitemap
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
