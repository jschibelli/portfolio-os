import Link from 'next/link';
import { typeRole } from '../../lib/typography';
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
		<footer className="border-border border-t bg-white dark:bg-stone-950" role="contentinfo">
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
					</nav>

					{/* Copyright */}
					<div className={`text-stone-600 dark:text-stone-400 ${typeRole.metadata}`}>
						<p>
							&copy; {currentYear} {siteTitle}. All rights reserved.
						</p>
					</div>
				</div>
			</Container>
		</footer>
	);
};
