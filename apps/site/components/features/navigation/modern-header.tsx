'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { typeRole } from '../../../lib/typography';
import { BlueskySVG, FacebookSVG, GithubSVG, LinkedinSVG, RssSVG } from '../../icons';
import { PersonalLogo } from '../../shared/personal-logo';
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
		<>
			{/* Skip link for keyboard navigation */}
			<a href="#main-content" className="skip-link">
				Skip to main content
			</a>
			<header
				className="border-border bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
				role="banner"
			>
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						{/* Logo */}
						<div className="flex-shrink-0">
							<PersonalLogo size="small" />
						</div>

						{/* Desktop Navigation */}
						<nav
							className="hidden items-center space-x-8 md:flex"
							role="navigation"
							aria-label="Main navigation"
							aria-describedby="desktop-nav-description"
						>
							<div id="desktop-nav-description" className="sr-only">
								Main navigation menu. Use Tab to move between links, Enter to activate.
							</div>
							<Link
								href="/"
								className={`text-muted-foreground hover:text-foreground focus-visible:ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${typeRole.smallControl}`}
							>
								Home
							</Link>
							<Link
								href="/projects"
								className={`text-muted-foreground hover:text-foreground focus-visible:ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${typeRole.smallControl}`}
							>
								Projects
							</Link>
							<Link
								href="/blog"
								className={`text-muted-foreground hover:text-foreground focus-visible:ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${typeRole.smallControl}`}
							>
								Blog
							</Link>
							<Link
								href="/about"
								className={`text-muted-foreground hover:text-foreground focus-visible:ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${typeRole.smallControl}`}
							>
								About
							</Link>
							<Link
								href="/contact"
								className={`text-muted-foreground hover:text-foreground focus-visible:ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${typeRole.smallControl}`}
							>
								Contact
							</Link>
						</nav>

						{/* Actions */}
						<div className="flex items-center space-x-4">
							<ThemeToggle />
							<Button
								size="sm"
								className={`hidden sm:inline-flex ${typeRole.smallControl}`}
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
								<SheetContent
									side="right"
									className="w-[300px] sm:w-[400px]"
									id="mobile-menu"
									role="dialog"
									aria-modal="true"
									aria-label="Mobile navigation menu"
									aria-describedby="mobile-menu-description"
								>
									<SheetHeader>
										<SheetTitle className="text-left">
											<PersonalLogo size="small" />
										</SheetTitle>
									</SheetHeader>

									<div className="mt-8">
										<div id="mobile-menu-description" className="sr-only">
											Use arrow keys to navigate through the menu items. Press Enter or Space to
											activate a link.
										</div>
										<nav
											className="flex flex-col space-y-4"
											role="navigation"
											aria-label="Mobile navigation"
										>
											<Link
												href="/"
												className={`text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring rounded-md px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${typeRole.body}`}
											>
												Home
											</Link>
											<Link
												href="/projects"
												className={`text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring rounded-md px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${typeRole.body}`}
											>
												Projects
											</Link>
											<Link
												href="/blog"
												className={`text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring rounded-md px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${typeRole.body}`}
											>
												Blog
											</Link>
											<Link
												href="/about"
												className={`text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring rounded-md px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${typeRole.body}`}
											>
												About
											</Link>
											<Link
												href="/contact"
												className={`text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring rounded-md px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${typeRole.body}`}
											>
												Contact
											</Link>
										</nav>

										<div className="border-border mt-8 border-t pt-6">
											<h3 className="sr-only">Social media links</h3>
											<div
												className="flex items-center justify-center gap-4"
												role="list"
												aria-label="Social media links"
											>
												{/* Facebook */}
												<a
													href="https://facebook.com"
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Find us on Facebook, external website, opens in new tab"
													className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex items-center justify-center rounded-full border p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
												>
													<FacebookSVG className="h-5 w-5" />
												</a>

												{/* GitHub */}
												<a
													href="https://github.com"
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Find us on Github, external website, opens in new tab"
													className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex items-center justify-center rounded-full border p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
												>
													<GithubSVG className="h-5 w-5 stroke-current" />
												</a>

												{/* LinkedIn */}
												<a
													href="https://linkedin.com"
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Find us on Linkedin, external website, opens in new tab"
													className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex items-center justify-center rounded-full border p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
												>
													<LinkedinSVG className="h-5 w-5 stroke-current" />
												</a>

												{/* Bluesky */}
												<a
													href="https://bsky.app"
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Find us on Bluesky, external website, opens in new tab"
													className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex items-center justify-center rounded-full border p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
												>
													<BlueskySVG className="h-5 w-5 stroke-current" />
												</a>

												{/* RSS Feed */}
												<Link
													prefetch={false}
													href={`/blog/rss.xml`}
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Open blog XML Feed, opens in new tab"
													className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex items-center justify-center rounded-full border p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
		</>
	);
}
