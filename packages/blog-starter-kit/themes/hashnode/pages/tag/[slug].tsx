import Head from 'next/head';
import { twJoin } from 'tailwind-merge';
import { useState } from 'react';
import { useQuery } from 'urql';
import { initUrqlClient } from 'next-urql';

import { AppProvider } from '../../components/contexts/appContext';
import { Header } from '../../components/header';
import { Layout } from '../../components/layout';
import {
	PublicationFragment,
	TagInitialDocument,
	TagInitialQuery,
} from '../../generated/graphql';
import type { Post } from '../../generated/graphql';
import ExternalLinkSVG from '../../components/icons/svgs/ExternalLinkSVG';
import { createHeaders, createSSRExchange, getUrqlClientConfig } from '../../lib/api/client';
import PublicationPosts from '../../components/publication-posts';
import PublicationFooter from '../../components/publication-footer';

const INITIAL_LIMIT = 6;

type Props = {
	posts:  NonNullable<TagInitialQuery['publication']>['posts'];
	publication: PublicationFragment;
	tag: NonNullable<TagInitialQuery['tag']>;
	slug: string;
	currentMenuId: string;
};

export default function Post({ publication, posts, tag, slug, currentMenuId }: Props) {
	const title = `#${tag.name} - ${publication.title}`;
	const [after, setAfter] = useState<string | null>(null);
	const [{ data, fetching }] = useQuery({
		query: TagInitialDocument,
		variables: { host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST, slug, first: INITIAL_LIMIT, after },
		requestPolicy: 'cache-first',
	});
	const postData = data?.publication?.posts || posts;
	const fetchedOnce = postData.edges.length > INITIAL_LIMIT;

	const fetchMore = () => {
		if (postData.pageInfo.hasNextPage) {
		setAfter(postData.edges[postData.edges.length - 1].cursor);
		}
	};
	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>{title}</title>
				</Head>
				<Header currentMenuId={currentMenuId} isHome={false} />
				<div className={twJoin('blog-content-area feed-width', 'mx-auto md:w-2/3', !!publication.about?.html && 'mt-12')}>
					<div
						className={twJoin(
						'blog-series-card mt-12 mb-16',
						publication.preferences.layout === 'grid' ? 'px-4 lg:px-8' : 'px-4 lg:px-16',
						)}
					>
						<div className="flex w-full min-w-0 flex-col flex-wrap items-center md:flex-row xl:flex-nowrap">
						<div className="mb-5 w-full min-w-0 xl:mb-0 xl:flex-1 xl:pr-8">
							<span className="blog-series-label mb-2 font-semibold uppercase tracking-tight text-slate-600 dark:text-slate-400">
							Tag
							</span>
							<div className="truncate ">
							<h1 className="blog-series-title mb-2 pb-px font-heading text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
								{tag.name}
							</h1>
							<p className="text-lg text-slate-600 dark:text-slate-400">#{tag.slug}</p>
							</div>
						</div>
						{tag && (
						<div className="flex w-full flex-col items-start xl:w-auto xl:items-end xl:text-right">
							<a
								className="mb-2 flex flex-row items-center whitespace-nowrap rounded-lg border bg-white px-4 py-2 font-medium text-blue-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
								href={`https://hashnode.com/n/${tag.slug}`}
								aria-label="See more articles from tag on Hashnode"
								target="_Blank"
								rel="noopener"
							>
								<span>More content</span>
								<ExternalLinkSVG className="ml-1 h-4 w-4 fill-current" />
							</a>
							<p className="text-sm text-slate-700 dark:text-slate-400">Read more stories on Hashnode</p>
						</div>
						)}
						</div>
					</div>
					{posts.edges.length > 0 && (
						<div className="my-10 flex flex-col items-center justify-center">
						<hr className="w-full border-t dark:border-slate-800" />
						<p className="-mt-5 bg-white p-2 font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">
							Articles with this tag
						</p>
						</div>
					)}
					<PublicationPosts
						publication={publication}
						posts={postData}
						fetchMore={fetchMore}
						fetchedOnce={fetchedOnce}
						fetching={fetching}
					/>{' '}
				</div>
				<PublicationFooter
					authorName={publication.author.name}
					title={publication.title}
					imprint={publication.imprint}
					disableFooterBranding={publication.preferences.disableFooterBranding}
					isTeam={publication.isTeam}
					logo={publication.preferences.logo}
					darkMode={publication.preferences.darkMode}
				/>
			</Layout>
		</AppProvider>
	);
}

export const getServerSideProps: any = async (ctx: any) => { // TODO: type needs to be fixed
  // Temporarily disabled URQL to fix build issues
  // TODO: Re-enable URQL once version compatibility is resolved
  
  return {
    notFound: true, // Temporarily return 404 until URQL is fixed
  };
}

