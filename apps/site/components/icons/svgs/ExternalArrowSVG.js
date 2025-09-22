import React from 'react';

export const ExternalArrowSVG = ({ className }) => {
	return (
		<svg className={className} fill="none" viewBox="0 0 24 24">
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="M21 12v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h6m4 0h5m0 0v5m0-5-8 8"
			/>
		</svg>
	);
}
