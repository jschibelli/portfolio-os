import request from 'graphql-request';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { AppProvider } from '../components/contexts/appContext';
import Chatbot from '../components/features/chatbot/Chatbot';
import ModernHeader from '../components/features/navigation/modern-header';
import { Container } from '../components/shared/container';
import { Layout } from '../components/shared/layout';
import { Button } from '../components/ui';
import { PublicationByHostDocument } from '../generated/graphql';

interface Props {
	publication: any;
}

export default function NewsletterPage({ publication }: Props) {
	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>{publication.displayTitle || publication.title} - Newsletter</title>
					<meta
						name="description"
						content="Subscribe to our newsletter for the latest insights and updates"
					/>
					<meta
						property="og:title"
						content={`${publication.displayTitle || publication.title} - Newsletter`}
					/>
					<meta
						property="og:description"
						content="Subscribe to our newsletter for the latest insights and updates"
					/>
					<meta property="og:type" content="website" />
					<meta property="og:url" content={`${publication.url}/newsletter`} />
					<meta
						name="twitter:title"
						content={`${publication.displayTitle || publication.title} - Newsletter`}
					/>
					<meta
						name="twitter:description"
						content="Subscribe to our newsletter for the latest insights and updates"
					/>
				</Head>
				<ModernHeader publication={publication} />

				<Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
					{/* Newsletter Hero Section */}
					<div
						id="newsletter-hero-section"
						data-animate-section
						className={`text-center transition-all duration-1000 ease-out ${
							true ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
						}`}
					>
						<h1 className="text-foreground mb-6 text-5xl font-bold">Stay Updated</h1>
						<p className="text-muted-foreground mx-auto max-w-3xl text-xl">
							Get the latest insights on technology trends, development tips, and industry updates
							delivered straight to your inbox.
						</p>
					</div>

					{/* Newsletter Form */}
					<div
						id="newsletter-form-section"
						data-animate-section
						className={`duration-1200 transition-all ease-out ${
							true ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
						}`}
					>
						<div className="bg-card border-border mx-auto max-w-2xl rounded-lg border p-8">
							<h2 className="text-foreground mb-6 text-center text-3xl font-bold">
								Subscribe to Our Newsletter
							</h2>
							<p className="text-muted-foreground mb-8 text-center">
								Join thousands of developers and tech enthusiasts who get our weekly insights.
							</p>

							<form className="space-y-6">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<label
											htmlFor="firstName"
											className="text-foreground mb-2 block text-sm font-medium"
										>
											First Name
										</label>
										<input
											type="text"
											id="firstName"
											name="firstName"
											className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2"
											placeholder="Enter your first name"
										/>
									</div>
									<div>
										<label
											htmlFor="lastName"
											className="text-foreground mb-2 block text-sm font-medium"
										>
											Last Name
										</label>
										<input
											type="text"
											id="lastName"
											name="lastName"
											className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2"
											placeholder="Enter your last name"
										/>
									</div>
								</div>

								<div>
									<label htmlFor="email" className="text-foreground mb-2 block text-sm font-medium">
										Email Address
									</label>
									<input
										type="email"
										id="email"
										name="email"
										required
										className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2"
										placeholder="Enter your email address"
									/>
								</div>

								<div>
									<label className="text-foreground mb-2 block text-sm font-medium">
										Topics of Interest
									</label>
									<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
										<label className="flex items-center space-x-3">
											<input
												type="checkbox"
												name="topics"
												value="web-development"
												className="text-primary border-border focus:ring-primary h-4 w-4 rounded focus:ring-2"
											/>
											<span className="text-foreground text-sm">Web Development</span>
										</label>
										<label className="flex items-center space-x-3">
											<input
												type="checkbox"
												name="topics"
												value="mobile-development"
												className="text-primary border-border focus:ring-primary h-4 w-4 rounded focus:ring-2"
											/>
											<span className="text-foreground text-sm">Mobile Development</span>
										</label>
										<label className="flex items-center space-x-3">
											<input
												type="checkbox"
												name="topics"
												value="cloud-computing"
												className="text-primary border-border focus:ring-primary h-4 w-4 rounded focus:ring-2"
											/>
											<span className="text-foreground text-sm">Cloud Computing</span>
										</label>
										<label className="flex items-center space-x-3">
											<input
												type="checkbox"
												name="topics"
												value="ai-ml"
												className="text-primary border-border focus:ring-primary h-4 w-4 rounded focus:ring-2"
											/>
											<span className="text-foreground text-sm">AI & Machine Learning</span>
										</label>
									</div>
								</div>

								<div className="flex items-start space-x-3">
									<input
										type="checkbox"
										id="privacy"
										name="privacy"
										required
										className="text-primary border-border focus:ring-primary mt-1 h-4 w-4 rounded focus:ring-2"
									/>
									<label htmlFor="privacy" className="text-muted-foreground text-sm">
										I agree to receive email communications and acknowledge the{' '}
										<Link href="/privacy-policy" className="text-primary hover:text-primary/80 underline">
											Privacy Policy
										</Link>
									</label>
								</div>

								<Button type="submit" size="lg" className="w-full">
									Subscribe to Newsletter
								</Button>
							</form>
						</div>
					</div>

					{/* Newsletter Benefits */}
					<div
						id="newsletter-benefits-section"
						data-animate-section
						className={`duration-1300 transition-all ease-out ${
							true ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
						}`}
					>
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							What You&apos;ll Get
						</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
							<div className="text-center">
								<div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
									<svg
										className="text-primary h-8 w-8"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-2 text-xl font-semibold">Weekly Insights</h3>
								<p className="text-muted-foreground">
									Curated articles and tutorials on the latest in web development, mobile apps, and
									cloud technologies.
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
									<svg
										className="h-8 w-8 text-green-600 dark:text-green-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-2 text-xl font-semibold">Exclusive Resources</h3>
								<p className="text-muted-foreground">
									Access to premium templates, code snippets, and development tools only available
									to subscribers.
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
									<svg
										className="h-8 w-8 text-purple-600 dark:text-purple-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-2 text-xl font-semibold">Community Access</h3>
								<p className="text-muted-foreground">
									Join our exclusive community of developers and get early access to new features
									and beta programs.
								</p>
							</div>
						</div>
					</div>

					{/* Newsletter Stats */}
					<div
						id="newsletter-stats-section"
						data-animate-section
						className={`duration-1400 transition-all ease-out ${
							true ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
						}`}
					>
						<div className="bg-card border-border rounded-lg border p-8">
							<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
								Join Our Growing Community
							</h2>
							<div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
								<div>
									<div className="text-primary mb-2 text-4xl font-bold">10K+</div>
									<div className="text-muted-foreground">Active Subscribers</div>
								</div>
								<div>
									<div className="text-primary mb-2 text-4xl font-bold">50+</div>
									<div className="text-muted-foreground">Weekly Articles</div>
								</div>
								<div>
									<div className="text-primary mb-2 text-4xl font-bold">95%</div>
									<div className="text-muted-foreground">Open Rate</div>
								</div>
							</div>
						</div>
					</div>
				</Container>
				<Chatbot />
			</Layout>
		</AppProvider>
	);
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT || 'https://gql.hashnode.com/';
	const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';

	try {
		const data = await request(GQL_ENDPOINT, PublicationByHostDocument, { host });
		const publication = data.publication;

		if (!publication) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				publication,
			},
			revalidate: 1,
		};
	} catch (error) {
		console.error('Error fetching publication data:', error);

		// Return a fallback response to prevent the build from failing
		return {
			props: {
				publication: {
					id: 'fallback',
					title: 'John Schibelli - Senior Front-End Developer',
					displayTitle: 'John Schibelli - Senior Front-End Developer',
					descriptionSEO: 'Senior Front-End Developer with 15+ years of experience',
					url: 'https://mindware.hashnode.dev',
					posts: {
						totalDocuments: 0,
					},
					preferences: {
						logo: null,
					},
					author: {
						name: 'John Schibelli',
						profilePicture: null,
					},
					followersCount: 0,
					isTeam: false,
					favicon: null,
					ogMetaData: {
						image: null,
					},
				} as any,
			},
			revalidate: 1,
		};
	}
};
