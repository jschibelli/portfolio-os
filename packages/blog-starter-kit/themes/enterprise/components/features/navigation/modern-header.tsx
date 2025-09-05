/* eslint-disable @next/next/no-img-element */
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { BlueskySVG, FacebookSVG, GithubSVG, LinkedinSVG, RssSVG } from '../../icons';
import { Button } from '../../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../ui/sheet';
import { ThemeToggle } from '../../ui/theme-toggle';

interface ModernHeaderProps {
	publication: {
		title: string;
		displayTitle?: string | null;
		logo?: {
			url: string;
		} | null;
	};
}

export default function ModernHeader({ publication }: ModernHeaderProps) {
	const siteTitle = publication.displayTitle || publication.title;

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-stone-900/80 dark:supports-[backdrop-filter]:bg-stone-900/60" role="banner">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<div className="flex-shrink-0">
						<Link href="/" className="flex items-center space-x-2" aria-label={`${siteTitle} - Home`}>
							{publication.logo?.url && (
								<img
									src={publication.logo.url}
									alt={`${siteTitle} logo`}
									className="h-8 w-8 rounded-lg"
								/>
							)}
							<span className="text-xl font-bold text-foreground">
								{siteTitle}
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden items-center space-x-8 md:flex" role="navigation" aria-label="Main navigation">
						<Link
							href="/"
							className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							Home
						</Link>
						<Link
							href="/work"
							className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							Work
						</Link>
						<Link
							href="/case-studies"
							className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							Case Studies
						</Link>
						<Link
							href="/blog"
							className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							Blog
						</Link>
						<Link
							href="/about"
							className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							About
						</Link>
						<Link
							href="/contact"
							className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							Contact
						</Link>
					</nav>

					{/* Actions */}
					<div className="flex items-center space-x-4">
						<ThemeToggle />
						<Button
							size="sm"
							className="hidden sm:inline-flex"
							aria-label="Subscribe to newsletter"
						>
							Subscribe
						</Button>

						{/* Mobile Menu */}
						<Sheet>
							<SheetTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="md:hidden"
									aria-label="Toggle mobile menu"
									aria-expanded="false"
									aria-controls="mobile-menu"
								>
									<Menu className="h-5 w-5" />
									<span className="sr-only">Toggle mobile menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="w-[300px] sm:w-[400px]" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
								<SheetHeader>
									<SheetTitle className="text-left">
										<Link href="/" className="flex items-center space-x-2" aria-label={`${siteTitle} - Home`}>
											{publication.logo?.url && (
												<img
													src={publication.logo.url}
													alt={`${siteTitle} logo`}
													className="h-6 w-6 rounded"
												/>
											)}
											<span className="text-lg font-bold text-foreground">
												{siteTitle}
											</span>
										</Link>
									</SheetTitle>
								</SheetHeader>

								<div className="mt-8">
									<nav className="flex flex-col space-y-4" role="navigation" aria-label="Mobile navigation">
										<Link
											href="/"
											className="rounded-md px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										>
											Home
										</Link>
										<Link
											href="/work"
											className="rounded-md px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										>
											Work
										</Link>
										<Link
											href="/case-studies"
											className="rounded-md px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										>
											Case Studies
										</Link>
										<Link
											href="/blog"
											className="rounded-md px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										>
											Blog
										</Link>
										<Link
											href="/about"
											className="rounded-md px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										>
											About
										</Link>
										<Link
											href="/contact"
											className="rounded-md px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										>
											Contact
										</Link>
									</nav>

									<div className="mt-8 border-t border-border pt-6">
										<h3 className="sr-only">Social media links</h3>
										<ul className="flex items-center justify-center gap-4" aria-label="Social media links">
											{/* Facebook */}
											<li>
												<a
													href="https://facebook.com"
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Find us on Facebook, external website, opens in new tab"
													className="flex items-center justify-center rounded-full border border-border p-3 text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
												>
													<FacebookSVG className="h-5 w-5" />
												</a>
											</li>

											{/* GitHub */}
											<li>
												<a
													href="https://github.com"
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Find us on Github, external website, opens in new tab"
													className="flex items-center justify-center rounded-full border border-border p-3 text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
												>
													<GithubSVG className="h-5 w-5 stroke-current" />
												</a>
											</li>

											{/* LinkedIn */}
											<li>
												<a
													href="https://linkedin.com"
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Find us on Linkedin, external website, opens in new tab"
													className="flex items-center justify-center rounded-full border border-border p-3 text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
												>
													<LinkedinSVG className="h-5 w-5 stroke-current" />
												</a>
											</li>

											{/* Bluesky */}
											<li>
												<a
													href="https://bsky.app"
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Find us on Bluesky, external website, opens in new tab"
													className="flex items-center justify-center rounded-full border border-border p-3 text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
												>
													<BlueskySVG className="h-5 w-5 stroke-current" />
												</a>
											</li>

											{/* RSS Feed */}
											<li>
												<Link
													prefetch={false}
													href={`/rss.xml`}
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Open blog XML Feed, opens in new tab"
													className="flex items-center justify-center rounded-full border border-border p-3 text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
												>
													<RssSVG className="h-5 w-5 stroke-current" />
												</Link>
											</li>
										</ul>
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</header>
	);
}
