// import { AnalyticsSafe } from './analytics-safe';
import { Footer } from './footer';
import { Integrations } from './integrations';
import { Meta } from './meta';
import { Scripts } from './scripts';

type Props = {
	children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
	return (
		<>
			<Meta />
			<Scripts />
			<div className="bg-background min-h-screen">
				<main role="main" id="main-content">
					{children}
				</main>
			</div>
			<Footer />
			{/* <AnalyticsSafe /> */}
			<Integrations />
		</>
	);
};
