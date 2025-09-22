// import { AnalyticsSafe } from './analytics-safe';
import ModernHeader from '../features/navigation/modern-header';
import { Footer } from './footer';
import { Integrations } from './integrations';
import { Meta } from './meta';
import { Scripts } from './scripts';
import { AppProvider } from '../contexts/appContext';

type Props = {
	children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
	// Default publication object for the footer
	const defaultPublication = {
		title: 'John Schibelli',
		displayTitle: 'John Schibelli',
		url: 'https://schibelli.dev',
		integrations: {},
		links: {
			github: '',
			linkedin: '',
			twitter: '',
			hashnode: '',
			bluesky: '',
		},
	};

	return (
		<AppProvider publication={defaultPublication as any}>
			<Meta />
			<Scripts />
			<ModernHeader publication={defaultPublication} />
			<div className="bg-background min-h-screen">
				<main role="main" id="main-content">
					{children}
				</main>
			</div>
			{/* Global Footer - automatically included for all pages using Layout component */}
			<Footer publication={defaultPublication} />
			<Integrations />
		</AppProvider>
	);
};
