import Link from 'next/link';
import { BlueskySVG, FacebookSVG, GithubSVG, LinkedinSVG, RssSVG } from '../icons';
import { Container } from './container';
import { PersonalLogo } from './personal-logo';

interface FooterProps {
	publication?: {
		title: string;
		displayTitle?: string | null;
	};
}

export const Footer = ({ publication }: FooterProps) => {
	const currentYear = new Date().getFullYear();
	const siteTitle = publication?.title || 'John Schibelli';

	return (
		<footer className="border-t border-border bg-white dark:bg-stone-950" role="contentinfo">
			<Container className="px-5 py-12">
				<div className="flex flex-col items-center justify-between gap-6 text-center">
					{/* Logo */}
					<div className="mb-4">
						<PersonalLogo size="small" />
					</div>
					
					{/* Social Links */}
					<nav aria-label="Social media links">
						<div className="flex items-center gap-4" role="list">
							{/* Facebook */}
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Find us on Facebook, external website, opens in new tab"
								className="flex items-center justify-center rounded-full border border-border p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
							>
								<RssSVG className="h-5 w-5 stroke-current" />
							</Link>
						</div>
					</nav>

					{/* Copyright */}
					<div className="text-sm text-stone-600 dark:text-stone-400">
						<p>
							&copy; {currentYear} {siteTitle}. All rights reserved.
						</p>
					</div>
				</div>
			</Container>
		</footer>
	);
};
