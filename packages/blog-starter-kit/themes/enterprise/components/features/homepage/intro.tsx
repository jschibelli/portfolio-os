/* eslint-disable @next/next/no-img-element */
import { motion } from 'framer-motion';
import { Separator } from '../../ui/separator';

export default function Intro() {
	return (
		<section className="bg-stone-50 py-16 dark:bg-stone-900">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="mx-auto max-w-4xl"
				>
					<div className="flex flex-col items-start gap-8 md:flex-row">
						{/* Profile Image */}
						<div className="flex-shrink-0">
							<div className="h-20 w-20 overflow-hidden rounded-full shadow-lg md:h-24 md:w-24">
								<img
									src="/assets/hero/profile.png"
									alt="John Schibelli - Senior Frontend Developer"
									className="h-full w-full object-cover"
								/>
							</div>
						</div>

						{/* Introduction Text */}
						<div className="flex-1 space-y-4">
							<h2 className="text-2xl font-bold text-stone-900 md:text-3xl dark:text-stone-100">
								About Me
							</h2>
							<div className="prose prose-stone dark:prose-invert max-w-none">
								<p className="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
									I&apos;m a senior front-end developer with over 15 years of experience building
									scalable, high-performance web apps and company websites. I specialize in React,
									Next.js, TypeScript, and Tailwind CSS with a strong focus on accessibility, SEO,
									and client success. I&apos;m the technical lead behind IntraWeb Technologies&apos;
									digital presence and AI-driven content collaboration tooling (SynaplyAI).
								</p>
								<p className="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
									Based in Towaco, NJ, I&apos;ve delivered custom WordPress and Shopify builds,
									incubated AI-powered collaboration tools, and built enterprise UIs for financial
									platforms. My expertise spans from modern React applications to legacy system
									integrations.
								</p>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Light Divider */}
				<motion.div
					initial={{ opacity: 0, scaleX: 0 }}
					whileInView={{ opacity: 1, scaleX: 1 }}
					transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="mt-16"
				>
					<Separator className="bg-stone-200 dark:bg-stone-800" />
				</motion.div>
			</div>
		</section>
	);
}
