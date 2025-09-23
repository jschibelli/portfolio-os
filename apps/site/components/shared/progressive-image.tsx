/* eslint-disable @next/next/no-img-element */
import { resizeImage } from '../../lib/image-utils';
import React, { useRef, useEffect } from 'react';

import { twMerge } from 'tailwind-merge';
import { DEFAULT_AVATAR } from '../../utils/const';

/**
 * Progressive Image Component which loads low resolution version image before loading original
 * @param {string}    options.src         Image source
 * @param {string}    options.alt         Image alt text
 * @param {string}    options.className   Classname string
 * @param {...[type]} options.restOfProps Rest of the props passed to the child
 */
interface ProgressiveImageProps {
	resize: any;
	src: string;
	alt: string;
	className: string;
	css: string;
}

function ProgressiveImage({ resize, src, alt, className, ...restOfProps }: ProgressiveImageProps) {
	const imageRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		if (!(window as any).lazySizes && imageRef.current) {
			imageRef.current.setAttribute('src', imageRef.current.getAttribute('data-src') || '');
		}
	}, []);

	// TODO: Improve type
	const replaceBadImage = (e: any) => {
		if (resize && resize.c !== 'face') {
			return;
		}
		e.target.onerror = null;
		e.target.src = DEFAULT_AVATAR;
	};

	if (!src || src.trim().length === 0) return null;

	const resizedImage = resizeImage(src, resize);

	return (
		<img
			data-sizes="auto"
			loading="lazy"
			src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
			ref={imageRef}
			data-src={resizedImage}
			width={resize.w}
			height={resize.h}
			onError={replaceBadImage}
			alt={alt}
			className={twMerge('lazyload block w-full', className)}
			{...restOfProps}
		/>
	);
}

export default ProgressiveImage;

export { ProgressiveImage };
