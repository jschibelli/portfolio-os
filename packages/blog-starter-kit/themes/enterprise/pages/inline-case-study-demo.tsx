import React from 'react';
import { GetStaticProps } from 'next';
import { InlineCaseStudyDemo } from '../components/projects/InlineCaseStudyDemo';
import { Layout } from '../components/shared/layout';
import { AppProvider } from '../components/contexts/appContext';

interface DemoPageProps {
	publication: any;
}

const InlineCaseStudyDemoPage: React.FC<DemoPageProps> = ({ publication }) => {
	return (
		<AppProvider publication={publication}>
			<Layout>
				<InlineCaseStudyDemo />
			</Layout>
		</AppProvider>
	);
};

export default InlineCaseStudyDemoPage;

export const getStaticProps: GetStaticProps<DemoPageProps> = async () => {
	// Mock publication data for the demo
	const mockPublication = {
		title: 'John Schibelli',
		displayTitle: 'John Schibelli',
		description: 'Senior Front-End Developer',
		url: 'https://jschibelli.com',
		logo: null,
		favicon: null,
		links: [],
		features: {
			tableOfContents: {
				isEnabled: true,
			},
		},
	};

	return {
		props: {
			publication: mockPublication,
		},
	};
};
