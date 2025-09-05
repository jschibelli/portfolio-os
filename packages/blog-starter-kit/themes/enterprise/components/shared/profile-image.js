import Image from 'next/legacy/image';
import React, { useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

import { resizeImage } from '@starter-kit/utils/image';
import { DEFAULT_AVATAR } from '../../lib/utils';

function ProfileImage({ user, blogURL, postUrlForAnonymous, className, width, height }) {
	const profileImageRef = useRef(null);

	useEffect(() => {
		if (!user) {
			return;
		}
		if (user.isDeactivated) {
			return;
		}
	}, [user]);

	return (
		<a
			href={
				blogURL
					? blogURL
					: user && !user.isDeactivated
						? `https://hashnode.com/@${user.username}`
						: postUrlForAnonymous
							? postUrlForAnonymous
							: '#'
			}
			ref={profileImageRef}
			className={`relative block h-full w-full`}
		>
			<Image
				className={twMerge(className, `relative z-20 block w-full rounded-full`)}
				src={
					user && user.profilePicture
						? resizeImage(user.profilePicture, {
								w: width || 70,
								h: height || 70,
								c: 'face',
							})
						: DEFAULT_AVATAR
				}
				width={width ? parseInt(width) : 70}
				height={height ? parseInt(height) : 70}
				// resize={{
				//   w: width ? parseInt(width) : 70,
				//   h: height ? parseInt(height) : 70,
				//   c: 'face',
				// }}
				alt={user ? user.name + "'s photo" : undefined}
			/>
		</a>
	);
}

export default ProfileImage;
