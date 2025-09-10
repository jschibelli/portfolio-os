import { motion } from 'framer-motion';
import { ExternalLinkIcon, MailIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface CallToActionProps {
	showLiveDemo?: boolean;
	showContact?: boolean;
	liveDemoUrl?: string;
	contactUrl?: string;
	className?: string;
	title?: string;
	description?: string;
	liveDemoText?: string;
	contactText?: string;
	additionalContext?: string;
}

export default function CallToAction({
	showLiveDemo = true,
	showContact = true,
	liveDemoUrl = '/work',
	contactUrl = '/contact',
	className = '',
	title = 'Ready to Get Started?',
	description = "Explore my work and let's discuss how I can help bring your project to life.",
	liveDemoText = 'View Live Demo',
	contactText = 'Get In Touch',
	additionalContext = 'Available for freelance projects and consulting opportunities',
}: CallToActionProps) {
	return (
		<section 
			className={`relative overflow-hidden bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 py-16 dark:from-stone-800 dark:via-stone-900 dark:to-stone-950 ${className}`}
			role="region"
			aria-label="Call to action section with project showcase and contact options"
			aria-describedby="cta-description"
		>
			{/* Subtle pattern overlay */}
			<div
				className="absolute inset-0 opacity-5 bg-dot-pattern"
				aria-hidden="true"
			/>

			<div className="container relative z-10 mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="mx-auto max-w-4xl space-y-8 text-center"
				>
					{/* Main CTA Content */}
					<div className="space-y-4">
						<h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 md:text-4xl">
							{title}
						</h2>
						<p 
							id="cta-description"
							className="mx-auto max-w-2xl text-lg text-stone-600 dark:text-stone-400"
						>
							{description}
						</p>
					</div>

					{/* CTA Buttons */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
						viewport={{ once: true }}
						className="flex flex-col justify-center gap-4 sm:flex-row"
					>
						{showLiveDemo && (
							<Button
								size="lg"
								variant="default"
								className="group bg-stone-900 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-stone-800 hover:shadow-xl dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
								asChild
							>
								<Link 
									href={liveDemoUrl}
									aria-label={`${liveDemoText} - Opens project showcase page`}
								>
									<ExternalLinkIcon className="mr-2 h-5 w-5" aria-hidden="true" />
									{liveDemoText}
								</Link>
							</Button>
						)}

						{showContact && (
							<Button
								size="lg"
								variant="outline"
								className="group border-2 border-stone-900 px-8 py-4 text-lg font-semibold text-stone-900 transition-all duration-300 hover:scale-105 hover:bg-stone-900 hover:text-white hover:shadow-xl dark:border-stone-100 dark:text-stone-100 dark:hover:bg-stone-100 dark:hover:text-stone-900"
								asChild
							>
								<Link 
									href={contactUrl}
									aria-label={`${contactText} - Opens contact form page`}
								>
									<MailIcon className="mr-2 h-5 w-5" aria-hidden="true" />
									{contactText}
								</Link>
							</Button>
						)}
					</motion.div>

					{/* Additional context */}
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
						viewport={{ once: true }}
						className="mt-8 text-sm text-stone-500 dark:text-stone-500"
					>
						<p>
							{additionalContext}
						</p>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
