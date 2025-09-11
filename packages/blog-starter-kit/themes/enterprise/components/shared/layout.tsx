// import { AnalyticsSafe } from './analytics-safe';
import { Footer } from './footer';
import { Integrations } from './integrations';
import { Meta } from './meta';
import { Scripts } from './scripts';

type Props = {
	children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
	// Default publication object for the footer
	const defaultPublication = {
		title: 'John Schibelli',
		displayTitle: 'John Schibelli',
	};

	return (
		<>
			<Meta />
			<Scripts />
			<div className="bg-background min-h-screen">
				<main role="main" id="main-content">
					{children}
				</main>
			</div>
			{/* Global Footer - automatically included for all pages using Layout component */}
			<Footer publication={defaultPublication} />
			{/* <AnalyticsSafe /> */}
			<Integrations />
		</>
	);
};
