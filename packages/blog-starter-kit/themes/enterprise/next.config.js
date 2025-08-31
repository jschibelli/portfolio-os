let request, gql;
try {
  const graphqlRequest = require('graphql-request');
  request = graphqlRequest.request;
  gql = graphqlRequest.gql;
} catch (error) {
  console.warn('graphql-request not available, skipping redirection rules');
  request = null;
  gql = null;
}

const ANALYTICS_BASE_URL = 'https://hn-ping2.hashnode.com';
const HASHNODE_ADVANCED_ANALYTICS_URL = 'https://user-analytics.hashnode.com';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT || 'https://gql.hashnode.com/';
const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST;

const getBasePath = () => {
	if (BASE_URL && BASE_URL.indexOf('/') !== -1) {
		return BASE_URL.substring(BASE_URL.indexOf('/'));
	}
	return undefined;
};

const getRedirectionRules = async () => {
	try {
		// Check if graphql-request is available
		if (!request || !gql) {
			console.warn('graphql-request not available, skipping redirection rules');
			return [];
		}

		// Check if required environment variables are available
		if (!GQL_ENDPOINT || !host) {
			console.warn('Missing required environment variables for redirection rules. Skipping...');
			return [];
		}

		const query = gql`
			query GetRedirectionRules {
				publication(host: "${host}") {
					id
					redirectionRules {
						source
						destination
						type
					}
				}
			}
		`;

		const data = await request(GQL_ENDPOINT, query);

		if (!data.publication) {
			console.warn('Publication not found. Skipping redirection rules...');
			return [];
		}

		const redirectionRules = data.publication.redirectionRules || [];

		// convert to next.js redirects format
		const redirects = redirectionRules
			.filter((rule) => {
				// Hashnode gives an option to set a wildcard redirect,
				// but it doesn't work properly with Next.js
				// the solution is to filter out all the rules with wildcard and use static redirects for now
				return rule.source.indexOf('*') === -1;
			})
			.map((rule) => {
				return {
					source: rule.source,
					destination: rule.destination,
					permanent: rule.type === 'PERMANENT',
				};
			});

		return redirects;
	} catch (error) {
		console.warn('Failed to fetch redirection rules:', error.message);
		return [];
	}
};

/**
 * @type {import('next').NextConfig}
 */
const config = {
	transpilePackages: ['@starter-kit/utils'],
	basePath: getBasePath(),
	experimental: {
		scrollRestoration: true,
	},
	webpack: (config, { isServer }) => {
		config.resolve.fallback = {
			...config.resolve.fallback,
			encoding: false,
			'cross-fetch': false,
			googleapis: false,
			fs: false,
			net: false,
			tls: false,
		};
		return config;
	},
	eslint: {
		ignoreDuringBuilds: false,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.hashnode.com',
			},
		],
	},
	async rewrites() {
		return [
			{
				source: '/ping/data-event',
				destination: `${ANALYTICS_BASE_URL}/api/data-event`,
			},
			{
				source: '/api/analytics',
				destination: `${HASHNODE_ADVANCED_ANALYTICS_URL}/api/analytics`,
			},
		];
	},
	async redirects() {
		return await getRedirectionRules();
	},
};

module.exports = config;
