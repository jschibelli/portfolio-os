import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../../ui/button';

export default function Hero() {
	return (
		<section className="relative flex min-h-[400px] items-center justify-center overflow-hidden py-12 md:py-16">
			{/* Background Image */}
			<div className="absolute inset-0 z-0">
				<Image
					src="/assets/hero/hero-bg1.png"
					alt="Abstract stone palette background"
					fill
					className="object-cover"
					priority
				/>
				{/* Radial gradient overlay for readability */}
				<div className="bg-gradient-radial absolute inset-0 from-stone-900/80 via-stone-900/60 to-stone-900/40" />
			</div>

			{/* Content */}
			<div className="container relative z-10 mx-auto px-4 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					className="mx-auto max-w-4xl space-y-8"
				>
					{/* Headline */}
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
						className="text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl"
					>
						John Schibelli
						<span className="mt-4 block text-2xl font-medium text-stone-200 md:text-3xl lg:text-4xl">
							Senior Front-End Developer
						</span>
					</motion.h1>

					{/* Subhead */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
						className="text-lg font-medium text-stone-300 md:text-xl lg:text-2xl"
					>
						React · Next.js · TypeScript · Tailwind CSS · Towaco, NJ
					</motion.p>

					{/* CTA Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
						className="flex flex-col items-center justify-center gap-4 sm:flex-row"
					>
						<Button
							size="lg"
							className="group bg-white px-8 py-4 text-lg font-semibold text-stone-900 transition-all duration-300 hover:scale-105 hover:bg-stone-100 hover:shadow-xl"
							asChild
						>
							<Link href="/projects">
								View My Projects
								<ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
							</Link>
						</Button>
						<Button
							size="lg"
							className="group bg-white px-8 py-4 text-lg font-semibold text-stone-900 transition-all duration-300 hover:scale-105 hover:bg-stone-100 hover:shadow-xl"
							asChild
						>
							<Link href="/blog">
								Read the Blog
								<ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
							</Link>
						</Button>
					</motion.div>
				</motion.div>
			</div>

			{/* Scroll indicator */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, delay: 1.2 }}
				className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform"
			>
				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
					className="flex h-10 w-6 justify-center rounded-full border-2 border-white"
				>
					<motion.div
						animate={{ y: [0, 12, 0] }}
						transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
						className="mt-2 h-3 w-1 rounded-full bg-white"
					/>
				</motion.div>
			</motion.div>
		</section>
	);
}
