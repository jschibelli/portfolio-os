import { Button } from '../../ui';
import { useEffect, useState } from 'react';
import { PageInfo } from '../../../generated/graphql';

interface ModernPaginationProps {
	pageInfo: PageInfo;
	onLoadMore: () => void;
	isLoading?: boolean;
	hasMorePosts?: boolean;
}

export default function ModernPagination({
	pageInfo,
	onLoadMore,
	isLoading = false,
	hasMorePosts = true,
}: ModernPaginationProps) {
	const [isVisible, setIsVisible] = useState(false);

	// Intersection Observer for scroll animations
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.1 },
		);

		const element = document.querySelector('.modern-pagination-container');
		if (element) {
			observer.observe(element);
		}

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	}, []);

	if (!hasMorePosts || !pageInfo.hasNextPage) {
		return null;
	}

	return (
		<div
			className={`modern-pagination-container flex flex-col items-center gap-6 py-12 transition-all duration-1000 ease-out ${
				isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
			}`}
		>
			{/* Load More Button */}
			<Button
				onClick={onLoadMore}
				disabled={isLoading}
				className="animate-fade-in-up group relative overflow-hidden px-8 py-3 font-semibold transition-all duration-500 hover:scale-105 hover:shadow-xl border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
			>
				<div className="from-primary/10 to-primary/5 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				{isLoading ? (
					<div className="relative z-10 flex items-center gap-2">
						<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
						Loading...
					</div>
				) : (
					<div className="relative z-10 flex items-center gap-2">
						<span>Load More Posts</span>
						<ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
					</div>
				)}
			</Button>

			{/* Pagination Info */}
			<div className="text-muted-foreground animate-fade-in-up animation-delay-200 text-sm transition-all duration-300">
				{pageInfo.endCursor && <span>Showing posts up to {new Date().toLocaleDateString()}</span>}
			</div>

			{/* Progress Indicator */}
			<div className="animate-fade-in-up animation-delay-400 flex items-center gap-2">
				<div className="bg-muted h-1 w-24 overflow-hidden rounded-full">
					<div
						className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
						style={{
							width: isLoading ? '60%' : '100%',
							animation: isLoading ? 'pulse 2s infinite' : 'none',
						}}
					/>
				</div>
			</div>
		</div>
	);
}

// ChevronDown icon component
const ChevronDown = ({ className }: { className?: string }) => (
	<svg
		className={className}
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="m6 9 6 6 6-6" />
	</svg>
);
