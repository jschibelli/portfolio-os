import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { AppProvider } from '../../components/contexts/appContext';
import ModernHeader from '../../components/features/navigation/modern-header';
import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';
import { Button } from '../../components/ui';

interface Props {
	publication: any;
}

export default function MobileDevelopmentPage({ publication }: Props) {
	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>
						{publication.displayTitle || publication.title || 'John Schibelli'} - Mobile Development
					</title>
					<meta
						name="description"
						content="Native and cross-platform mobile application development for iOS and Android"
					/>
					<meta
						property="og:title"
						content={`${publication.displayTitle || publication.title || 'John Schibelli'} - Mobile Development`}
					/>
					<meta
						property="og:description"
						content="Native and cross-platform mobile application development for iOS and Android"
					/>
					<meta property="og:type" content="website" />
					<meta property="og:url" content={`${publication.url}/services/mobile-development`} />
					<meta
						name="twitter:title"
						content={`${publication.displayTitle || publication.title || 'John Schibelli'} - Mobile Development`}
					/>
					<meta
						name="twitter:description"
						content="Native and cross-platform mobile application development for iOS and Android"
					/>
				</Head>
				<ModernHeader publication={publication} />

				<Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
					{/* Hero Section */}
					<div className="py-16 text-center">
						<div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
							<svg
								className="h-10 w-10 text-green-600 dark:text-green-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<h1 className="text-foreground mb-6 text-5xl font-bold">Mobile Development</h1>
						<p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
							We create native and cross-platform mobile applications that deliver exceptional user
							experiences.
						</p>
						<div className="flex justify-center gap-4">
							<Button size="lg" className="bg-green-600 hover:bg-green-700">
								Start Your App
							</Button>
							<Button size="lg" variant="outline">
								View Portfolio
							</Button>
						</div>
					</div>

					{/* Services Overview */}
					<div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						<div className="bg-card border-border rounded-lg border p-6">
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
								<svg
									className="h-6 w-6 text-blue-600 dark:text-blue-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">React Native</h3>
							<p className="text-muted-foreground">
								Cross-platform development with React Native for iOS and Android from a single
								codebase.
							</p>
						</div>

						<div className="bg-card border-border rounded-lg border p-6">
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900/30">
								<svg
									className="h-6 w-6 text-gray-600 dark:text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">Native iOS/Android</h3>
							<p className="text-muted-foreground">
								Platform-specific development using Swift/Kotlin for optimal performance and native
								features.
							</p>
						</div>

						<div className="bg-card border-border rounded-lg border p-6">
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
								<svg
									className="h-6 w-6 text-purple-600 dark:text-purple-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">App Store Optimization</h3>
							<p className="text-muted-foreground">
								Optimize your app for better visibility and downloads in the App Store and Google
								Play.
							</p>
						</div>
					</div>

					{/* Platforms */}
					<div className="bg-card border-border mb-16 rounded-lg border p-8">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							Platforms We Support
						</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
									<svg
										className="h-10 w-10 text-blue-600 dark:text-blue-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-4 text-2xl font-bold">iOS Development</h3>
								<ul className="text-muted-foreground space-y-2">
									<li>• Swift & SwiftUI</li>
									<li>• iOS App Store</li>
									<li>• iPhone & iPad Apps</li>
									<li>• Apple Watch Apps</li>
								</ul>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
									<svg
										className="h-10 w-10 text-green-600 dark:text-green-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-4 text-2xl font-bold">Android Development</h3>
								<ul className="text-muted-foreground space-y-2">
									<li>• Kotlin & Java</li>
									<li>• Google Play Store</li>
									<li>• Material Design</li>
									<li>• Android TV Apps</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Features */}
					<div className="mb-16">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							App Features We Build
						</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{[
								{ title: 'User Authentication', icon: '🔐' },
								{ title: 'Push Notifications', icon: '📱' },
								{ title: 'Offline Support', icon: '📴' },
								{ title: 'Payment Integration', icon: '💳' },
								{ title: 'Social Media Login', icon: '📱' },
								{ title: 'Real-time Chat', icon: '💬' },
								{ title: 'Location Services', icon: '📍' },
								{ title: 'Camera & Media', icon: '📷' },
								{ title: 'Analytics & Tracking', icon: '📊' },
							].map((feature) => (
								<div
									key={feature.title}
									className="bg-card border-border rounded-lg border p-6 text-center transition-colors hover:border-green-500/50"
								>
									<div className="mb-3 text-3xl">{feature.icon}</div>
									<h3 className="text-foreground font-semibold">{feature.title}</h3>
								</div>
							))}
						</div>
					</div>

					{/* Process */}
					<div className="bg-card border-border mb-16 rounded-lg border p-8">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							Our Mobile Development Process
						</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-5">
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
									<span className="text-2xl font-bold text-green-600">1</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Discovery</h3>
								<p className="text-muted-foreground text-sm">
									Understanding your app requirements and target audience
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
									<span className="text-2xl font-bold text-green-600">2</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Design</h3>
								<p className="text-muted-foreground text-sm">
									Creating intuitive UI/UX designs for mobile interfaces
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
									<span className="text-2xl font-bold text-green-600">3</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Development</h3>
								<p className="text-muted-foreground text-sm">
									Building your app with regular testing and feedback
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
									<span className="text-2xl font-bold text-green-600">4</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Testing</h3>
								<p className="text-muted-foreground text-sm">
									Comprehensive testing across devices and platforms
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
									<span className="text-2xl font-bold text-green-600">5</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Launch</h3>
								<p className="text-muted-foreground text-sm">
									App store submission and post-launch support
								</p>
							</div>
						</div>
					</div>

					{/* CTA Section */}
					<div className="rounded-lg bg-gradient-to-r from-green-500/10 to-green-500/5 p-8 text-center">
						<h2 className="text-foreground mb-4 text-3xl font-bold">
							Ready to Build Your Mobile App?
						</h2>
						<p className="text-muted-foreground mb-8 text-xl">
							Let&apos;s create a mobile experience that your users will love.
						</p>
						<div className="flex justify-center gap-4">
							<Button size="lg" className="bg-green-600 hover:bg-green-700">
								Start Your App
							</Button>
							<Link href="/services">
								<Button size="lg" variant="outline">
									View All Services
								</Button>
							</Link>
						</div>
					</div>
				</Container>
			</Layout>
		</AppProvider>
	);
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const publication: any = {
		title: 'John Schibelli',
		displayTitle: 'John Schibelli',
		url: 'https://mindware.hashnode.dev',
		logo: null,
		author: { name: 'John Schibelli' },
		descriptionSEO: 'Professional mobile development services for iOS and Android',
		ogMetaData: {
			image: 'https://via.placeholder.com/1200x630',
		},
		preferences: {
			disableFooterBranding: false,
			logo: null,
			darkMode: false,
		},
		isTeam: false,
		imprint: null,
		features: {
			tableOfContents: { isEnabled: true },
			newsletter: { isEnabled: true },
			readMore: { isEnabled: true },
		},
	};

	return {
		props: {
			publication,
		},
		revalidate: 1,
	};
};
