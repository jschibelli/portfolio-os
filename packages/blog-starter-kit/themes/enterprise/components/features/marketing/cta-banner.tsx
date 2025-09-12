import { motion } from 'framer-motion';
import { ClockIcon, MailIcon, MessageSquareIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../ui/button';

export default function CTABanner() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-stone-600 via-stone-700 to-stone-800 py-20">
			{/* Subtle pattern overlay */}
			<div
				className="absolute inset-0 opacity-10"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
				}}
			/>

			<div className="container relative z-10 mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="mx-auto max-w-4xl space-y-8 text-center"
				>
					{/* Main CTA */}
					<div className="space-y-4">
						<h2 className="text-3xl font-bold text-white md:text-4xl">
							Let&apos;s Discuss Your Project Goals
						</h2>
						<p className="mx-auto max-w-2xl text-xl text-stone-200">
							Ready to transform your ideas into high-performance digital experiences? Let&apos;s explore how we can achieve your business objectives together.
						</p>
					</div>

					{/* Contact Button */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
						viewport={{ once: true }}
					>
						<Button
							size="lg"
							className="group bg-white px-8 py-4 text-lg font-semibold text-stone-900 transition-all duration-300 hover:scale-105 hover:bg-stone-100 hover:shadow-xl"
							asChild
						>
							<Link href="/contact">
								<MailIcon className="mr-2 h-5 w-5" />
								Contact Me
							</Link>
						</Button>
					</motion.div>

					{/* Subtext with icon */}
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
						viewport={{ once: true }}
						className="flex items-center justify-center gap-2 text-stone-300"
					>
						<ClockIcon className="h-4 w-4" />
						<span className="text-sm">
							Quick response time and code samples available on request
						</span>
					</motion.div>

					{/* Additional info */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
						viewport={{ once: true }}
						className="mt-12 grid grid-cols-1 gap-6 border-t border-stone-500/30 pt-8 md:grid-cols-3"
					>
						<div className="text-center">
							<div className="mb-2 text-2xl font-bold text-white">24h</div>
							<div className="text-sm text-stone-300">Response Time</div>
						</div>
						<div className="text-center">
							<div className="mb-2 text-2xl font-bold text-white">100%</div>
							<div className="text-sm text-stone-300">Client Satisfaction</div>
						</div>
						<div className="text-center">
							<div className="mb-2 text-2xl font-bold text-white">15+</div>
							<div className="text-sm text-stone-300">Years Experience</div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
