import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Constants
export const DEFAULT_AVATAR =
	'https://cdn.hashnode.com/res/hashnode/image/upload/v1659089761812/fsOct5gl6.png';

export const DEFAULT_COVER =
	'https://cdn.hashnode.com/res/hashnode/image/upload/v1683525272978/MB5H_kgOC.png?auto=format';