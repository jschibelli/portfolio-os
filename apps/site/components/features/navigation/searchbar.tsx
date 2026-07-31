import Link from 'next/link';
import { KeyboardEventHandler, useCallback, useEffect, useRef, useState } from 'react';

const NO_OF_SEARCH_RESULTS = 5;

type SearchHit = {
	id: string;
	title: string;
	description: string;
	url: string;
	type: string;
};

export const Search = () => {
	const searchInputRef = useRef<HTMLInputElement>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const [query, setQuery] = useState('');
	const [searchResults, setSearchResults] = useState<SearchHit[]>([]);
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

	const search = useCallback(async (q: string) => {
		if (timerRef.current) clearTimeout(timerRef.current);

		if (!q) {
			setSearchResults([]);
			setIsSearching(false);
			return;
		}

		timerRef.current = setTimeout(async () => {
			setIsSearching(true);
			try {
				const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
				const data = await res.json();
				const hits = (data.results || []).slice(0, NO_OF_SEARCH_RESULTS) as SearchHit[];
				setSearchResults(hits);
			} catch {
				setSearchResults([]);
			} finally {
				setIsSearching(false);
			}
		}, 500);
	}, []);

	useEffect(() => {
		search(query);
	}, [query, search]);

	const searchResultsList = searchResults.map((item) => (
		<Link
			key={item.id}
			href={item.url}
			className="flex flex-row items-start gap-4 p-4 transition-colors duration-200 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
		>
			<div className="flex min-w-0 flex-1 flex-col gap-2">
				<strong className="text-lg font-semibold leading-tight text-slate-900 dark:text-neutral-100">
					{item.title}
				</strong>
				<span className="text-sm leading-relaxed text-slate-600 dark:text-neutral-300">
					{item.description.length > 120
						? item.description.substring(0, 120) + '…'
						: item.description}
				</span>
			</div>
		</Link>
	));

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
