import { resizeImage } from '@starter-kit/utils/image';
import request from 'graphql-request';
import Link from 'next/link';
import { KeyboardEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import {
	SearchPostsOfPublicationDocument,
	SearchPostsOfPublicationQuery,
	SearchPostsOfPublicationQueryVariables,
} from '../generated/graphql';
import { DEFAULT_COVER } from '../utils/const';
import { useAppContext } from './contexts/appContext';
import { CoverImage } from './cover-image';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;
const NO_OF_SEARCH_RESULTS = 5;

type Post = SearchPostsOfPublicationQuery['searchPostsOfPublication']['edges'][0]['node'];

export const Search = () => {
	const { publication } = useAppContext();

	const searchInputRef = useRef<HTMLInputElement>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const [query, setQuery] = useState('');
	const [searchResults, setSearchResults] = useState<Post[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	const resetInput = () => {
		if (!searchInputRef.current) return;
		searchInputRef.current.value = '';
		setQuery('');
	};

	const escapeSearchOnESC: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === 'Escape') {
			resetInput();
		}
	};

	const updateSearchQuery = () => {
		setQuery(searchInputRef.current?.value || '');
	};

	const search = useCallback(
		async (query: string) => {
			if (timerRef.current) clearTimeout(timerRef.current);

			if (!query) {
				setSearchResults([]);
				setIsSearching(false);
				return;
			}

			timerRef.current = setTimeout(async () => {
				setIsSearching(true);

				const data = await request<
					SearchPostsOfPublicationQuery,
					SearchPostsOfPublicationQueryVariables
				>(GQL_ENDPOINT, SearchPostsOfPublicationDocument, {
					first: NO_OF_SEARCH_RESULTS,
					filter: { query, publicationId: publication.id },
				});
				const posts = data.searchPostsOfPublication.edges.map((edge) => edge.node);
				setSearchResults(posts);
				setIsSearching(false);
			}, 500);
		},
		[publication.id],
	);

	useEffect(() => {
		search(query);
	}, [query, search]);

	const searchResultsList = searchResults.map((post) => {
		const postURL = `/${post.slug}`;
		return (
			<Link
				key={post.id}
				href={postURL}
				className="flex flex-row items-start gap-4 p-4 transition-colors duration-200 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
			>
				<div className="flex min-w-0 flex-1 flex-col gap-2">
					<strong className="text-lg font-semibold leading-tight text-slate-900 dark:text-neutral-100">
						{post.title}
					</strong>
					<span className="text-sm leading-relaxed text-slate-600 dark:text-neutral-300">
						{post.brief.length > 120 ? post.brief.substring(0, 120) + '…' : post.brief}
					</span>
				</div>
				<div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg">
					<div className="h-full w-full">
						<CoverImage
							title={post.title}
							src={resizeImage(
								post.coverImage?.url,
								{
									w: 96,
									h: 64,
									c: 'thumb',
								},
								DEFAULT_COVER,
							)}
						/>
					</div>
				</div>
			</Link>
		);
	});

	return (
		<div className="relative w-full">
			<input
				type="text"
				ref={searchInputRef}
				onKeyUp={escapeSearchOnESC}
				onChange={updateSearchQuery}
				placeholder="Search blog posts…"
				className="focus:ring-primary/20 w-full rounded-full border border-slate-200 bg-slate-50 px-6 py-4 text-lg focus:bg-transparent focus:outline-none focus:ring-2 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-50 dark:placeholder:text-neutral-400 dark:hover:bg-neutral-950"
			/>
			{query && (
				<>
					{isSearching && (
						<div className="absolute left-0 right-0 z-50 mt-2 flex max-h-[500px] min-h-[300px] w-full flex-col items-stretch overflow-hidden overflow-y-auto rounded-xl border bg-white p-2 text-left text-slate-900 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50">
							<div className="flex animate-pulse flex-col gap-3 p-4">
								<div className="h-6 w-full rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
								<div className="h-4 w-full rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
								<div className="h-4 w-2/3 rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
							</div>
							<div className="flex animate-pulse flex-col gap-3 p-4">
								<div className="h-6 w-full rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
								<div className="h-4 w-full rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
								<div className="h-4 w-2/3 rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
							</div>
							<div className="flex animate-pulse flex-col gap-3 p-4">
								<div className="h-6 w-full rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
								<div className="h-4 w-full rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
								<div className="h-4 w-2/3 rounded-lg bg-slate-100 dark:bg-neutral-800"></div>
							</div>
						</div>
					)}
					{searchResults.length > 0 && !isSearching && (
						<div className="absolute left-0 right-0 z-50 mt-2 flex max-h-[500px] min-h-[200px] w-full flex-col items-stretch overflow-hidden overflow-y-auto rounded-xl border bg-white p-2 text-left text-slate-900 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50">
							<h3 className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-700 dark:border-neutral-700 dark:text-neutral-300">
								Found {searchResults.length} results
							</h3>
							<div className="divide-y divide-slate-200 dark:divide-neutral-700">
								{searchResultsList}
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
};
