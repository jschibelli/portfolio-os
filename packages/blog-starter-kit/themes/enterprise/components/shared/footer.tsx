import Link from 'next/link';
import { useAppContext } from '../contexts/appContext';
import { BlueskySVG, FacebookSVG, GithubSVG, LinkedinSVG, RssSVG } from '../icons';
import { Container } from './container';

export const Footer = () => {
	const { publication } = useAppContext();
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t bg-white dark:bg-stone-950">
			<Container className="px-5 py-12">
				<div className="flex flex-col items-center justify-between gap-6 text-center">
					{/* Social Links */}
					<div className="flex items-center gap-4">
						{/* Facebook */}
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Find us on Facebook, external website, opens in new tab"
							className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
						>
							<FacebookSVG className="h-5 w-5" />
						</a>

						{/* GitHub */}
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Find us on Github, external website, opens in new tab"
							className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
						>
							<GithubSVG className="h-5 w-5 stroke-current" />
						</a>

						{/* LinkedIn */}
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Find us on Linkedin, external website, opens in new tab"
							className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
						>
							<LinkedinSVG className="h-5 w-5 stroke-current" />
						</a>

						{/* Bluesky */}
						<a
							href="https://bsky.app"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Find us on Bluesky, external website, opens in new tab"
							className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
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
							className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
						>
							<RssSVG className="h-5 w-5 stroke-current" />
						</Link>
					</div>

					{/* Copyright */}
					<div className="text-sm text-stone-600 dark:text-stone-400">
						<p>
							&copy; {currentYear} {publication.title}. All rights reserved.
						</p>
					</div>
				</div>
			</Container>
		</footer>
	);
};
