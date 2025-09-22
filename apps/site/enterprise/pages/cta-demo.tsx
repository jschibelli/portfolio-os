import { GetStaticProps } from 'next';
import Head from 'next/head';
import CallToAction from '../components/projects/CallToAction';

interface CtaDemoPageProps {
	// Add any props if needed
}

export default function CtaDemoPage({}: CtaDemoPageProps) {
	return (
		<>
			<Head>
				<title>Call to Action Demo - John Schibelli</title>
				<meta
					name="description"
					content="Demo page showcasing the Call to Action component with various configurations and use cases."
				/>
				<meta name="robots" content="noindex, nofollow" />
			</Head>

			<main className="min-h-screen bg-stone-50 dark:bg-stone-900">
				{/* Hero Section */}
				<section className="py-16">
					<div className="container mx-auto px-4 text-center">
						<h1 className="mb-4 text-4xl font-bold text-stone-900 dark:text-stone-100 md:text-5xl">
							Call to Action Component Demo
						</h1>
						<p className="mx-auto max-w-2xl text-lg text-stone-600 dark:text-stone-400">
							Explore different configurations and use cases of the Call to Action component.
						</p>
					</div>
				</section>

				{/* Default CTA */}
				<section className="py-8">
					<div className="container mx-auto px-4">
						<h2 className="mb-4 text-2xl font-semibold text-stone-900 dark:text-stone-100">
							Default Configuration
						</h2>
						<CallToAction />
					</div>
				</section>

				{/* Custom CTA with different text */}
				<section className="py-8">
					<div className="container mx-auto px-4">
						<h2 className="mb-4 text-2xl font-semibold text-stone-900 dark:text-stone-100">
							Custom Text Configuration
						</h2>
						<CallToAction
							title="Let's Build Something Amazing Together"
							description="I'm passionate about creating exceptional digital experiences that drive results. Let's discuss your next project."
							liveDemoText="View Portfolio"
							contactText="Start a Project"
							additionalContext="Specializing in React, Next.js, and modern web technologies"
						/>
					</div>
				</section>

				{/* CTA with only contact button */}
				<section className="py-8">
					<div className="container mx-auto px-4">
						<h2 className="mb-4 text-2xl font-semibold text-stone-900 dark:text-stone-100">
							Contact Only Configuration
						</h2>
						<CallToAction
							showLiveDemo={false}
							title="Ready to Get Started?"
							description="Let's discuss your project requirements and how I can help bring your vision to life."
							contactText="Schedule a Consultation"
							additionalContext="Free initial consultation available"
						/>
					</div>
				</section>

				{/* CTA with only live demo button */}
				<section className="py-8">
					<div className="container mx-auto px-4">
						<h2 className="mb-4 text-2xl font-semibold text-stone-900 dark:text-stone-100">
							Live Demo Only Configuration
						</h2>
						<CallToAction
							showContact={false}
							title="Explore My Work"
							description="Take a look at some of my recent projects and case studies."
							liveDemoText="Browse Portfolio"
							liveDemoUrl="/portfolio"
							additionalContext="Featured projects and detailed case studies"
						/>
					</div>
				</section>

				{/* CTA with custom URLs */}
				<section className="py-8">
					<div className="container mx-auto px-4">
						<h2 className="mb-4 text-2xl font-semibold text-stone-900 dark:text-stone-100">
							Custom URLs Configuration
						</h2>
						<CallToAction
							title="Connect With Me"
							description="Follow my journey and stay updated with my latest work and insights."
							liveDemoUrl="https://github.com/jschibelli"
							contactUrl="https://linkedin.com/in/johnschibelli"
							liveDemoText="View GitHub"
							contactText="Connect on LinkedIn"
							additionalContext="Always open to new opportunities and collaborations"
						/>
					</div>
				</section>

				{/* Documentation Section */}
				<section className="py-16">
					<div className="container mx-auto px-4">
						<div className="mx-auto max-w-4xl">
							<h2 className="mb-8 text-3xl font-bold text-stone-900 dark:text-stone-100">
								Component Documentation
							</h2>
							
							<div className="space-y-6 text-stone-600 dark:text-stone-400">
								<div>
									<h3 className="mb-2 text-xl font-semibold text-stone-900 dark:text-stone-100">
										Props
									</h3>
									<ul className="list-disc pl-6 space-y-1">
										<li><code className="bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">showLiveDemo</code> - Boolean to show/hide live demo button</li>
										<li><code className="bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">showContact</code> - Boolean to show/hide contact button</li>
										<li><code className="bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">liveDemoUrl</code> - URL for the live demo button</li>
										<li><code className="bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">contactUrl</code> - URL for the contact button</li>
										<li><code className="bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">title</code> - Main heading text</li>
										<li><code className="bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">description</code> - Description text</li>
										<li><code className="bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">liveDemoText</code> - Text for live demo button</li>
										<li><code className="bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">contactText</code> - Text for contact button</li>
										<li><code className="bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">additionalContext</code> - Additional context text</li>
										<li><code className="bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">className</code> - Additional CSS classes</li>
									</ul>
								</div>

								<div>
									<h3 className="mb-2 text-xl font-semibold text-stone-900 dark:text-stone-100">
										Features
									</h3>
									<ul className="list-disc pl-6 space-y-1">
										<li>Fully customizable text content</li>
										<li>Flexible button configuration</li>
										<li>Accessibility features (ARIA labels, semantic HTML)</li>
										<li>Responsive design with Tailwind CSS</li>
										<li>Smooth animations with Framer Motion</li>
										<li>Dark mode support</li>
										<li>Stone theme integration</li>
									</ul>
								</div>

								<div>
									<h3 className="mb-2 text-xl font-semibold text-stone-900 dark:text-stone-100">
										Usage Examples
									</h3>
									<pre className="bg-stone-100 dark:bg-stone-800 p-4 rounded-lg overflow-x-auto">
										<code className="text-sm">
{`// Default usage
<CallToAction />

// Custom configuration
<CallToAction
  title="Custom Title"
  description="Custom description"
  showLiveDemo={false}
  contactText="Get Started"
/>

// External links
<CallToAction
  liveDemoUrl="https://example.com"
  contactUrl="mailto:contact@example.com"
/>`}
										</code>
									</pre>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {},
	};
};