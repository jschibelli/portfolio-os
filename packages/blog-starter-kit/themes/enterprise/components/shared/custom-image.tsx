/* eslint-disable @next/next/no-img-element */
import { ImgHTMLAttributes } from 'react';

import Image, { ImageProps } from 'next/image';

type Props = {
	src: any; // can be string or StaticImport of next/image
	alt: string;
	originalSrc: string;
} & ImgHTMLAttributes<any> &
	ImageProps;

/**
 * Conditionally renders native img for gifs and next/image for other types
 * @param props
 * @returns <img /> or <Image/>
 */
function CustomImage(props: Props) {
	const { originalSrc, ...originalRestOfTheProps } = props;
	const {
		alt = '',
		loader,
		quality,
		priority,
		loading,
		unoptimized,
		src,
		width,
		height,
		placeholder,
		blurDataURL,
		...restOfTheProps
	} = originalRestOfTheProps; // Destructured next/image props on purpose, so that unwanted props don't end up in <img />

	if (!originalSrc) {
		return null;
	}

	const isGif = originalSrc.substr(-4) === '.gif';
	const isHashnodeCDNImage = src.indexOf('cdn.hashnode.com') > -1;

	if (isGif || !isHashnodeCDNImage) {
		// restOfTheProps will contain all props excluding the next/image props
		return <img {...restOfTheProps} alt={alt ?? ''} src={src || originalSrc} />;
	}

	// Notes we are passing whole props object here
	return <Image {...originalRestOfTheProps} alt={alt ?? ''} src={src || originalSrc} />;
}

export default CustomImage;
