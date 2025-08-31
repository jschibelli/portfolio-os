import { ThemeProvider } from 'next-themes';
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
		<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
			<Meta />
			<Scripts />
			<div className="bg-background min-h-screen">
				<main>{children}</main>
			</div>
			<Footer />
			{/* <AnalyticsSafe /> */}
			<Integrations />
		</ThemeProvider>
	);
};
