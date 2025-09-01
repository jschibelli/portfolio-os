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
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-stone-900/80 dark:supports-[backdrop-filter]:bg-stone-900/60">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<div className="flex-shrink-0">
						<Link href="/" className="flex items-center space-x-2">
							{publication.logo?.url && (
								<img
									src={publication.logo.url}
									alt={publication.displayTitle || publication.title}
									className="h-8 w-8 rounded-lg"
								/>
							)}
							<span className="text-xl font-bold text-foreground">
								{publication.displayTitle || publication.title}
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden items-center space-x-8 md:flex">
						<Link
							href="/"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							Home
						</Link>
						<Link
							href="/work"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							Work
						</Link>
						<Link
							href="/case-studies"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							Case Studies
						</Link>
						<Link
							href="/blog"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							Blog
						</Link>
						<Link
							href="/about"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							About
						</Link>
						<Link
							href="/contact"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
								>
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="w-[300px] sm:w-[400px]">
								<SheetHeader>
									<SheetTitle className="text-left">
										<Link href="/" className="flex items-center space-x-2">
											{publication.logo?.url && (
												<img
													src={publication.logo.url}
													alt={publication.displayTitle || publication.title}
													className="h-6 w-6 rounded"
												/>
											)}
																		<span className="text-lg font-bold text-foreground">
								{publication.displayTitle || publication.title}
							</span>
										</Link>
									</SheetTitle>
								</SheetHeader>

								<div className="mt-8">
									<nav className="flex flex-col space-y-4">
										<Link
											href="/"
											className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
										>
											Home
										</Link>
										<Link
											href="/work"
											className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
										>
											Work
										</Link>
										<Link
											href="/case-studies"
											className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
										>
											Case Studies
										</Link>
										<Link
											href="/blog"
											className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
										>
											Blog
										</Link>
										<Link
											href="/about"
											className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
										>
											About
										</Link>
										<Link
											href="/contact"
											className="rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
										>
											Contact
										</Link>
									</nav>

									<div className="mt-8 border-t border-border pt-6">
										<div className="flex items-center justify-center gap-4">
											{/* Facebook */}
											<a
												href="https://facebook.com"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Find us on Facebook, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
											>
												<FacebookSVG className="h-5 w-5" />
											</a>

											{/* GitHub */}
											<a
												href="https://github.com"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Find us on Github, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
											>
												<GithubSVG className="h-5 w-5 stroke-current" />
											</a>

											{/* LinkedIn */}
											<a
												href="https://linkedin.com"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Find us on Linkedin, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
											>
												<LinkedinSVG className="h-5 w-5 stroke-current" />
											</a>

											{/* Bluesky */}
											<a
												href="https://bsky.app"
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Find us on Bluesky, external website, opens in new tab"
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
												className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
