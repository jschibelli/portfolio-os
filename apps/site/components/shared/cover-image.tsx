import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type Props = {
	title: string;
	src: string;
	slug?: string;
	priority?: boolean;
};

export const CoverImage = ({ title, src, slug, priority = false }: Props) => {
	const [imageError, setImageError] = useState(false);
	const [imageLoading, setImageLoading] = useState(true);
	
	const postURL = `/${slug}`;

	// Enhanced alt text for better accessibility
	const altText = `Cover image for the article "${title}"`;

	const handleImageError = () => {
		setImageError(true);
		setImageLoading(false);
	};

	const handleImageLoad = () => {
		setImageLoading(false);
	};

	const image = (
		<div className="relative pt-[52.5%]">
			{!imageError ? (
				<Image
					src={src}
					alt={altText}
					className="w-full rounded-md border object-cover hover:opacity-90 dark:border-neutral-800"
					fill
					priority={priority}
					loading={priority ? "eager" : "lazy"}
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
					quality={85}
					placeholder="blur"
					blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
					onError={handleImageError}
					onLoad={handleImageLoad}
				/>
			) : (
				<div className="flex h-full w-full items-center justify-center bg-stone-200 dark:bg-stone-800 rounded-md border dark:border-neutral-800">
					<div className="text-center">
						<div className="text-sm text-stone-500 dark:text-stone-400 mb-1">
							Image unavailable
						</div>
						<div className="text-xs text-stone-400 dark:text-stone-500">
							{title}
						</div>
					</div>
				</div>
			)}
			
			{/* Loading indicator */}
			{imageLoading && !imageError && (
				<div className="absolute inset-0 flex items-center justify-center bg-stone-100 dark:bg-stone-900 rounded-md">
					<div className="animate-pulse text-sm text-stone-500 dark:text-stone-400">
						Loading image...
					</div>
				</div>
			)}
		</div>
	);
	
	return (
		<div className="sm:mx-0">
			{slug ? (
				<Link 
					href={postURL} 
					aria-label={`Read article: ${title}`}
					className="focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 rounded-md"
				>
					{image}
				</Link>
			) : (
				image
			)}
		</div>
	);
};
