import React from 'react';

export default function ChevronDownSVG({ className }) {
	return (
		<svg className={className} fill="none" viewBox="0 0 24 24">
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="m6 10 6 6 6-6"
			/>
		</svg>
	);
}
