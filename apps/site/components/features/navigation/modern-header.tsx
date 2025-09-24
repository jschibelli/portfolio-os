"use client";

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { BlueskySVG, FacebookSVG, GithubSVG, LinkedinSVG, RssSVG } from '../../icons';
import { PersonalLogo } from '../../shared/personal-logo';
import { Button } from '../../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../ui/sheet';
import { ThemeToggle } from '../../ui/theme-toggle';
import { GlobalSearch } from '../search/global-search';

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
						<PersonalLogo size="small" />
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden items-center space-x-8 md:flex" role="navigation" aria-label="Main navigation">
						<Link
							href="/"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							Home
						</Link>
						<Link
							href="/projects"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							Projects
						</Link>
						<Link
							href="/blog"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							Blog
						</Link>
						<Link
							href="/about"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							About
						</Link>
						<Link
							href="/contact"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							Contact
						</Link>
					</nav>

					{/* Global Search */}
					<div className="hidden lg:block">
						<GlobalSearch placeholder="Search..." />
					</div>

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
										<PersonalLogo size="small" />
									</SheetTitle>
								</SheetHeader>

								<div className="mt-8">
									<nav className="flex flex-col space-y-4" role="navigation" aria-label="Mobile navigation">
										<Link
											href="/"
											className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										>
											Home
										</Link>
										<Link
											href="/projects"
											className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										>
											Projects
										</Link>
										<Link
											href="/blog"
											className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										>
											Blog
										</Link>
										<Link
											href="/about"
											className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										>
											About
										</Link>
										<Link
											href="/contact"
											className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										>
											Contact
										</Link>
									</nav>

									<div className="mt-8 border-t border-border pt-6">
										<h3 className="sr-only">Social media links</h3>
										<div className="flex items-center justify-center gap-4" role="list" aria-label="Social media links">
											{/* Facebook */}
											<a
												href="https://facebook.com"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Find us on Facebook, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
												role="listitem"
											>
												<FacebookSVG className="h-5 w-5" />
											</a>

											{/* GitHub */}
											<a
												href="https://github.com"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Find us on Github, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
												role="listitem"
											>
												<GithubSVG className="h-5 w-5 stroke-current" />
											</a>

											{/* LinkedIn */}
											<a
												href="https://linkedin.com"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Find us on Linkedin, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
												role="listitem"
											>
												<LinkedinSVG className="h-5 w-5 stroke-current" />
											</a>

											{/* Bluesky */}
											<a
												href="https://bsky.app"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Find us on Bluesky, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
												role="listitem"
											>
												<BlueskySVG className="h-5 w-5 stroke-current" />
											</a>

											{/* RSS Feed */}
											<Link
												prefetch={false}
												href={`/rss.xml`}
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Open blog XML Feed, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
												role="listitem"
											>
												<RssSVG className="h-5 w-5 stroke-current" />
											</Link>
										</div>
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
