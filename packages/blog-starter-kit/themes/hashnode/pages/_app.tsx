import { AppProps } from 'next/app';
import { useEffect } from 'react';
import 'tailwindcss/tailwind.css';

import { GlobalFontVariables } from '../components/fonts';
import '../styles/index.css';

import { Fragment } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		(window as any).adjustIframeSize = (id: string, newHeight: string) => {
			const i = document.getElementById(id);
			if (!i) return;
			// eslint-disable-next-line radix
			i.style.height = `${parseInt(newHeight)}px`;
		};
	}, []);
	return (
		<Fragment>
			<GlobalFontVariables />
			<Component {...pageProps} />
		</Fragment>
	);
}

// Temporarily disabled URQL to fix build issues
// TODO: Re-enable URQL once version compatibility is resolved
export default MyApp;
