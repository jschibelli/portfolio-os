import { Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../ui/sheet';

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
						<Link href="/" className="text-xl font-bold text-stone-900 dark:text-stone-100">
							{siteTitle}
						</Link>
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

					{/* Actions */}
					<div className="flex items-center space-x-4">
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
										<Link href="/" className="text-xl font-bold text-stone-900 dark:text-stone-100">
											{siteTitle}
										</Link>
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
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</header>
	);
}