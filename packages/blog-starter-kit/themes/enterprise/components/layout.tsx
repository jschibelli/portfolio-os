import { ThemeProvider } from 'next-themes';
import { Analytics } from './analytics';
import { Integrations } from './integrations';
import { Meta } from './meta';
import { Scripts } from './scripts';

type Props = {
	children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<Meta />
			<Scripts />
			<div className="min-h-screen bg-background">
				<main>{children}</main>
			</div>
			<Analytics />
			<Integrations />
		</ThemeProvider>
	);
};
