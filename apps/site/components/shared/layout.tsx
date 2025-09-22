"use client";
import dynamic from 'next/dynamic';
const Footer = dynamic(() => import('./footer').then(m => m.Footer), { ssr: false });
const ModernHeader = dynamic(() => import('../features/navigation/modern-header'), { ssr: false });

type Props = {
	children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
	// Default publication object for the header and footer
	const defaultPublication = {
		title: 'John Schibelli',
		displayTitle: 'John Schibelli',
	};

	return (
		<>
			<div className="bg-background min-h-screen">
				<ModernHeader publication={defaultPublication} />
				{children}
			</div>
			{/* Global Footer - automatically included for all pages using Layout component */}
			<Footer publication={defaultPublication} />
		</>
	);
};