import { resizeImage } from '@starter-kit/utils/image';
import Link from 'next/link';
import { DEFAULT_COVER } from '../../../utils/const';
import { CoverImage } from '../../shared/cover-image';
import { DateFormatter } from '../../shared/date-formatter';
import BaseHero from '../sections/hero/base-hero';

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
	);
};
