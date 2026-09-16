'use client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ICON_SPACING, SECONDARY_BUTTON_STYLES } from '../../../lib/button-styles';
import { typeRole } from '../../../lib/typography';
import { Button } from '../../ui/button';

export default function CTABanner() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-stone-600 via-stone-700 to-stone-800 py-16 md:py-20">
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
					className="mx-auto max-w-3xl space-y-8 text-center"
				>
					<div className="space-y-4">
						<h2 className={`text-white ${typeRole.sectionH2}`}>
							Interested in working together?
						</h2>
						<p className={`mx-auto max-w-2xl text-stone-200 ${typeRole.heroSupport}`}>
							I&apos;m open to Senior Software Engineer opportunities and contract engineering work.
						</p>
					</div>

					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
						viewport={{ once: true }}
						className="flex flex-col items-center justify-center"
					>
						<Button size="lg" className={SECONDARY_BUTTON_STYLES} asChild>
							<Link href="/contact" aria-label="Get in touch">
								Get in Touch
								<ArrowRight className={ICON_SPACING.right} aria-hidden="true" />
							</Link>
						</Button>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
