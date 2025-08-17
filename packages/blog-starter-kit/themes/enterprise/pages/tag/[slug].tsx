import request from 'graphql-request';
import Head from 'next/head';
import { Container } from '../../components/container';
import { AppProvider } from '../../components/contexts/appContext';
import { Footer } from '../../components/footer';
import ModernHeader from '../../components/modern-header';
import { Layout } from '../../components/layout';
import { MorePosts } from '../../components/more-posts';
import {
	Publication,
	TagPostsByPublicationDocument,
	TagPostsByPublicationQuery,
	TagPostsByPublicationQueryVariables,
} from '../../generated/graphql';
import type { Post } from '../../generated/graphql';

type Props = {
	posts: Post[];
	publication: Publication;
	tag: string;
};

export default function Post({ publication, posts, tag }: Props) {
	const title = `#${tag} - ${publication.title}`;
	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>{title}</title>
				</Head>
				<ModernHeader publication={publication} />
				<Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
					<div className="flex flex-col gap-1 pt-5">
						<p className="font-bold uppercase text-slate-500 dark:text-neutral-400">Tag</p>
						<h1 className="text-4xl font-bold text-slate-900 dark:text-neutral-50">#{tag}</h1>
					</div>
					<MorePosts context="tag" posts={posts} />
				</Container>
				<Footer />
			</Layout>
		</AppProvider>
	);
}

type Params = {
	params: {
		slug: string;
	};
};

export async function getStaticProps({ params }: Params) {
	const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT || 'https://gql.hashnode.com/';
	const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';
	
	try {
		const data = await request<TagPostsByPublicationQuery, TagPostsByPublicationQueryVariables>(
			GQL_ENDPOINT,
			TagPostsByPublicationDocument,
			{
				host: host,
				first: 20,
				tagSlug: params.slug,
			},
		);

		const publication = data.publication;
		if (!publication) {
			return {
				notFound: true,
			};
		}
		const posts = publication.posts.edges.map((edge) => edge.node);

		return {
			props: {
				posts,
				publication,
				tag: params.slug,
			},
			revalidate: 1,
		};
	} catch (error) {
		console.error('Error fetching tag data:', error);
		return {
			notFound: true,
			revalidate: 1,
		};
	}
}

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: 'blocking',
	};
}
