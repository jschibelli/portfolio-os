'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ICON_SPACING, PRIMARY_BUTTON_STYLES } from '../../../lib/button-styles';
import { typeRole } from '../../../lib/typography';
import { Button } from '../../ui/button';
import { heroSpacingClasses } from '../../ui/spacing';

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.8, ease: 'easeOut' },
};

const fadeInUpDelayed = (delay: number) => ({
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.8, delay, ease: 'easeOut' },
});

export default function Hero() {
	return (
		<header
			className={cn(
				'relative flex min-h-[240px] items-center justify-center overflow-hidden',
				heroSpacingClasses.section.compact,
			)}
		>
			<div className="absolute inset-0 z-0">
				<Image
					src="/assets/hero/hero-bg.png"
					alt=""
					fill
					className="object-cover"
					priority
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
					quality={85}
					placeholder="blur"
					blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
				/>
				<div className="bg-gradient-radial absolute inset-0 from-stone-900/80 via-stone-900/60 to-stone-900/40" />
			</div>

			<div className={cn(heroSpacingClasses.container.default, 'relative z-10 text-center')}>
				<motion.div {...fadeInUp} className={cn('mx-auto', heroSpacingClasses.content.compact)}>
					<motion.p
						{...fadeInUpDelayed(0.1)}
						className={`${typeRole.eyebrow} text-stone-300`}
					>
						Senior Software Engineer
					</motion.p>

					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
						className={`mt-4 text-white ${typeRole.display}`}
					>
						Engineering software that holds up in production.
					</motion.h1>

					<motion.p
						{...fadeInUpDelayed(0.4)}
						className={`mx-auto mt-6 max-w-3xl text-stone-300 ${typeRole.heroSupport}`}
					>
						Front-end and full-stack systems, APIs, integrations, automation, and modernization.
					</motion.p>

					<motion.nav
						{...fadeInUpDelayed(0.6)}
						className="mt-8 flex flex-col items-center justify-center"
						aria-label="Primary navigation actions"
					>
						<Button
							size="lg"
							className={`${PRIMARY_BUTTON_STYLES} min-w-[180px] justify-center`}
							asChild
						>
							<Link href="/projects" aria-label="View selected projects and case studies">
								<span className="flex items-center">
									View Work
									<ArrowRight
										className={`${ICON_SPACING.right} transition-transform group-hover:translate-x-1`}
										aria-hidden="true"
									/>
								</span>
							</Link>
						</Button>
					</motion.nav>
				</motion.div>
			</div>
		</header>
	);
}
