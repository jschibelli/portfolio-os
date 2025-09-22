"use client";
/* eslint-disable @next/next/no-img-element */
import { motion } from 'framer-motion';

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
									loading="lazy"
								/>
							</div>
						</div>

						{/* Introduction Text */}
						<article className="flex-1 space-y-4">
							<header>
								<h2 className="text-2xl font-bold text-stone-900 md:text-3xl dark:text-stone-100">
									About Me
								</h2>
							</header>
							<div className="prose prose-stone dark:prose-invert max-w-none">
								<p className="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
									My journey into development started in an unexpected place—teaching web development 
									at Anthem Institute, where I discovered my passion for turning complex problems into 
									elegant solutions. That experience shaped my philosophy: great code isn&apos;t just 
									functional, it&apos;s teachable, maintainable, and built with the end user in mind.
								</p>
								<p className="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
									Today, I&apos;m a senior front-end developer with over 15 years of experience, 
									but I still approach every project with that educator&apos;s mindset. Whether I&apos;m 
									building React applications, incubating AI-powered tools like SynaplyAI, or crafting 
									enterprise UIs for financial platforms, I believe in creating solutions that not only 
									work beautifully but can be understood and maintained by the next developer.
								</p>
								<p className="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
									Based in Towaco, NJ, I specialize in React, Next.js, TypeScript, and Tailwind CSS, 
									with a particular focus on accessibility and SEO. My unique approach combines technical 
									excellence with clear communication—because the best code is the kind that tells a story 
									anyone can follow.
								</p>
							</div>
						</article>
					</div>
				</motion.div>

			</div>
		</section>
	);
}