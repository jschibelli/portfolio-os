import { resizeImage } from '@starter-kit/utils/image';
import Link from 'next/link';
import { DEFAULT_COVER } from '../../../utils/const';
import { CoverImage } from '../../shared/cover-image';
import { DateFormatter } from '../../shared/date-formatter';
import BaseHero from '../sections/hero/base-hero';
import { ErrorBoundary } from 'react-error-boundary';

// Error fallback component
function HeroErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
	return (
		<div className="flex min-h-[400px] w-full flex-col items-center justify-center bg-stone-50 dark:bg-stone-900">
			<div className="text-center">
				<h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
					Unable to load hero content
				</h2>
				<p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
					There was an error loading the hero section. Please try again.
				</p>
				<button
					onClick={resetErrorBoundary}
					className="mt-4 rounded-md bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
				>
					Try again
				</button>
			</div>
		</div>
	);
}

interface HeroPostProps {
	title: string;
	coverImage: string;
	date: string;
	excerpt: string;
	slug: string;
}

export const HeroPost = ({ title, coverImage, date, excerpt, slug }: HeroPostProps) => {
	const postURL = `/${slug}`;

	// Error handling for image processing
	const processedImage = (() => {
		try {
			return resizeImage(coverImage, { w: 1600, h: 840, c: 'thumb' }) || DEFAULT_COVER;
		} catch (error) {
			console.warn('Error processing cover image:', error);
			return DEFAULT_COVER;
		}
	})();

	return (
		<ErrorBoundary
			FallbackComponent={HeroErrorFallback}
			onError={(error, errorInfo) => {
				console.error('HeroPost Error:', error, errorInfo);
			}}
		>
			<BaseHero
				title={title}
				description={excerpt}
				layout="left"
				contentAlignment="left"
				className="py-8"
				contentClassName="grid grid-cols-1 gap-5"
				titleClassName="text-xl font-bold leading-snug text-slate-800 lg:text-3xl dark:text-neutral-50"
				descriptionClassName="text-md leading-snug text-slate-500 dark:text-neutral-400"
				customContent={
					<div className="col-span-1">
						<CoverImage
							title={title}
							src={processedImage}
							slug={slug}
							priority={true}
							alt={`Cover image for ${title}`}
						/>
					</div>
				}
				children={
					<div className="col-span-1 flex flex-col gap-2">
						<h1 className="text-xl font-bold leading-snug text-slate-800 lg:text-3xl dark:text-neutral-50">
							<Link
								href={postURL}
								className="hover:text-primary-600 dark:hover:text-primary-500 leading-tight tracking-tight hover:underline"
								aria-label={`Read more about ${title}`}
							>
								{title}
							</Link>
						</h1>
						<Link href={postURL} aria-label={`Read excerpt of ${title}`}>
							<p className="text-md leading-snug text-slate-500 dark:text-neutral-400">{excerpt}</p>
						</Link>
						<div className="text-sm font-semibold text-slate-500 dark:text-neutral-300">
							<Link href={postURL} aria-label={`View post published on ${date}`}>
								<DateFormatter dateString={date} />
							</Link>
						</div>
					</div>
				}
				animate={false}
			/>
		</ErrorBoundary>
	);
};
