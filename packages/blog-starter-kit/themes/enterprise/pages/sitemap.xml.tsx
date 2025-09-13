import request from 'graphql-request';
import { GetServerSideProps } from 'next';
import {
	MoreSitemapPostsDocument,
	MoreSitemapPostsQuery,
	MoreSitemapPostsQueryVariables,
	SitemapDocument,
	SitemapQuery,
	SitemapQueryVariables,
} from '../generated/graphql';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;
const MAX_POSTS = 1000;
const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { res } = ctx;

	const initialData = await request<SitemapQuery, SitemapQueryVariables>(
		GQL_ENDPOINT,
		SitemapDocument,
		{
			host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev',
			postsCount: 20,
			staticPagesCount: 50,
		},
	);

	const publication = initialData.publication;
	if (!publication) {
		return {
			notFound: true,
		};
	}
	const posts = publication.posts.edges.map((edge) => edge.node);

	// Get more posts by pagination if exists
	const initialPageInfo = publication.posts.pageInfo;
	const fetchPosts = async (after: string | null | undefined) => {
		const variables = {
			host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev',
			postsCount: 20,
			postsAfter: after,
		};

		const data = await request<MoreSitemapPostsQuery, MoreSitemapPostsQueryVariables>(
			GQL_ENDPOINT,
			MoreSitemapPostsDocument,
			variables,
		);
		const publication = data.publication;
		if (!publication) {
			return;
		}
		const pageInfo = publication.posts.pageInfo;

		posts.push(...publication.posts.edges.map((edge) => edge.node));

		if (pageInfo.hasNextPage && posts.length < MAX_POSTS) {
			await fetchPosts(pageInfo.endCursor);
		}
	};

	if (initialPageInfo.hasNextPage) {
		await fetchPosts(initialPageInfo.endCursor);
	}

	// Generate sitemap XML
	const baseUrl = 'https://johnschibelli.com';
	const currentDate = new Date().toISOString();
	
	const staticPages = [
		{ slug: '', priority: '1.0', changefreq: 'always' },
		{ slug: 'about', priority: '1.0', changefreq: 'always' },
		{ slug: 'contact', priority: '1.0', changefreq: 'always' },
		{ slug: 'services', priority: '0.9', changefreq: 'monthly' },
		{ slug: 'portfolio', priority: '0.9', changefreq: 'monthly' },
		{ slug: 'blog', priority: '0.9', changefreq: 'weekly' },
	];

	let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
	xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

	// Add static pages
	staticPages.forEach(page => {
		xml += '  <url>\n';
		xml += `    <loc>${baseUrl}/${page.slug}</loc>\n`;
		xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
		xml += `    <priority>${page.priority}</priority>\n`;
		xml += `    <lastmod>${currentDate}</lastmod>\n`;
		xml += '  </url>\n';
	});

	// Add blog posts
	posts.forEach(post => {
		xml += '  <url>\n';
		xml += `    <loc>${post.url}</loc>\n`;
		xml += '    <changefreq>daily</changefreq>\n';
		xml += '    <priority>0.8</priority>\n';
		xml += `    <lastmod>${post.updatedAt || post.publishedAt}</lastmod>\n`;
		xml += '  </url>\n';
	});

	// Add tag pages
	const uniqueTags = [...new Set(posts.flatMap(post => post.tags || []).map(tag => tag.slug))];
	uniqueTags.forEach(tagSlug => {
		xml += '  <url>\n';
		xml += `    <loc>${baseUrl}/tag/${tagSlug}</loc>\n`;
		xml += '    <changefreq>always</changefreq>\n';
		xml += '    <priority>1</priority>\n';
		xml += `    <lastmod>${currentDate}</lastmod>\n`;
		xml += '  </url>\n';
	});

	xml += '</urlset>';

	res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
	res.setHeader('content-type', 'application/xml; charset=utf-8');
	res.write(xml);
	res.end();

	return { props: {} };
};

export default Sitemap;
