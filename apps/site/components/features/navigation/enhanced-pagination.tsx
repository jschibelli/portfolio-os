import { Badge, Button, Card, CardContent } from '@/components/ui';
import { ChevronLeft, Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PageInfo } from '../generated/graphql';

interface EnhancedPaginationProps {
	pageInfo: PageInfo;
	onLoadMore: () => void;
	onRefresh?: () => void;
	onReturnToFirst?: () => void;
	isLoading?: boolean;
	hasMorePosts?: boolean;
	totalPosts?: number;
	currentPostsCount: number;
	postsPerPage?: number;
	onPostsPerPageChange?: (count: number) => void;
}

const POSTS_PER_PAGE_OPTIONS = [6, 12, 18, 24];

export default function EnhancedPagination({
	pageInfo,
	onLoadMore,
	onRefresh,
	onReturnToFirst,
	isLoading = false,
	hasMorePosts = true,
	totalPosts = 0,
	currentPostsCount,
	postsPerPage = 12,
	onPostsPerPageChange,
}: EnhancedPaginationProps) {
	const [isRefreshing, setIsRefreshing] = useState(false);
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

		const element = document.querySelector('.pagination-container');
		if (element) {
			observer.observe(element);
		}

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	}, []);

	const handleRefresh = async () => {
		if (onRefresh) {
			setIsRefreshing(true);
			try {
				await onRefresh();
			} finally {
				setIsRefreshing(false);
			}
		}
	};

	const estimatedTotalPages = totalPosts ? Math.ceil(totalPosts / postsPerPage) : 0;
	const currentPage = Math.ceil(currentPostsCount / postsPerPage);

	return (
		<div
			className={`pagination-container space-y-8 py-12 transition-all duration-1000 ease-out ${
				isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
			}`}
		>
			{/* Posts Count and Controls */}
			<div className="animate-fade-in-up flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
				<div className="flex items-center gap-4">
					<Badge
						variant="outline"
						className="text-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
					>
						{currentPostsCount} posts loaded
					</Badge>
					{totalPosts > 0 && (
						<Badge
							variant="secondary"
							className="text-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
						>
							{totalPosts} total posts
						</Badge>
					)}
					{estimatedTotalPages > 0 && (
						<Badge
							variant="outline"
							className="text-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
						>
							Page {currentPage} of ~{estimatedTotalPages}
						</Badge>
					)}
				</div>

				<div className="flex items-center gap-2">
					{onPostsPerPageChange && (
						<div className="animate-fade-in-up animation-delay-200 flex items-center gap-2">
							<span className="text-muted-foreground text-sm">Show:</span>
							<select
								value={postsPerPage}
								onChange={(e) => onPostsPerPageChange(Number(e.target.value))}
								className="border-border bg-background focus:ring-primary hover:border-primary rounded-md border px-3 py-1 text-sm transition-all duration-300 focus:outline-none focus:ring-2"
							>
								{POSTS_PER_PAGE_OPTIONS.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
						</div>
					)}

					{onReturnToFirst && currentPostsCount > postsPerPage && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onReturnToFirst}
							disabled={isLoading}
							className="animate-fade-in-up animation-delay-300 h-8 px-3 text-xs transition-all duration-300 hover:scale-105 hover:shadow-md"
						>
							<ChevronLeft className="mr-1 h-3 w-3 transition-transform group-hover:-translate-x-1" />
							First Page
						</Button>
					)}

					{onRefresh && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleRefresh}
							disabled={isRefreshing}
							className="animate-fade-in-up animation-delay-400 h-8 w-8 p-0 transition-all duration-300 hover:scale-105 hover:shadow-md"
						>
							<RefreshCw
								className={`h-4 w-4 transition-all duration-300 ${isRefreshing ? 'animate-spin' : 'hover:rotate-180'}`}
							/>
						</Button>
					)}
				</div>
			</div>

			{/* Load More Section */}
			{hasMorePosts && pageInfo.hasNextPage && (
				<Card className="hover:border-primary/50 animate-fade-in-up animation-delay-500 border-dashed transition-all duration-500 hover:shadow-lg">
					<CardContent className="p-8">
						<div className="flex flex-col items-center gap-6">
							{/* Progress Indicator */}
							<div className="animate-fade-in-up animation-delay-600 flex items-center gap-4">
								<div className="bg-muted h-2 w-32 overflow-hidden rounded-full">
									<div
										className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
										style={{
											width: isLoading ? '60%' : '100%',
											animation: isLoading ? 'pulse 2s infinite' : 'none',
										}}
									/>
								</div>
								<span className="text-muted-foreground text-sm transition-all duration-300">
									{isLoading ? 'Loading...' : 'Ready to load more'}
								</span>
							</div>

							{/* Load More Button */}
							<Button
								onClick={onLoadMore}
								disabled={isLoading}
								variant="outline"
								size="lg"
								className="animate-fade-in-up animation-delay-700 group relative overflow-hidden px-8 py-3 font-semibold transition-all duration-500 hover:scale-105 hover:shadow-xl"
							>
								<div className="from-primary/10 to-primary/5 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								{isLoading ? (
									<div className="relative z-10 flex items-center gap-2">
										<Loader2 className="h-4 w-4 animate-spin" />
										<span>Loading More Posts...</span>
									</div>
								) : (
									<div className="relative z-10 flex items-center gap-2">
										<span>Load More Posts</span>
										<ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
									</div>
								)}
							</Button>

							{/* Pagination Info */}
							<div className="animate-fade-in-up animation-delay-800 space-y-2 text-center">
								<p className="text-muted-foreground text-sm transition-all duration-300">
									{pageInfo.endCursor ? (
										<>Showing posts up to {new Date().toLocaleDateString()}</>
									) : (
										<>Ready to load the next batch of posts</>
									)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* End of Posts */}
			{!hasMorePosts && currentPostsCount > 0 && (
				<div className="animate-fade-in-up animation-delay-900 space-y-4 text-center">
					<div className="bg-muted mx-auto h-1 w-24 overflow-hidden rounded-full">
						<div className="bg-primary h-full w-full rounded-full transition-all duration-1000 ease-out" />
					</div>
					<p className="text-foreground text-lg font-semibold transition-all duration-300">
						You&apos;ve reached the end!
					</p>
					<p className="text-muted-foreground text-sm transition-all duration-300">
						All {currentPostsCount} posts have been loaded
					</p>
					{onRefresh && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleRefresh}
							disabled={isRefreshing}
							className="mt-4 transition-all duration-300 hover:scale-105 hover:shadow-md"
						>
							<RefreshCw
								className={`mr-2 h-4 w-4 transition-all duration-300 ${isRefreshing ? 'animate-spin' : 'hover:rotate-180'}`}
							/>
							Refresh Posts
						</Button>
					)}
				</div>
			)}

			{/* No Posts */}
			{currentPostsCount === 0 && !isLoading && (
				<div className="animate-fade-in-up animation-delay-1000 space-y-4 text-center">
					<p className="text-foreground text-lg font-semibold transition-all duration-300">
						No posts found
					</p>
					<p className="text-muted-foreground text-sm transition-all duration-300">
						There are no posts available at the moment
					</p>
					{onRefresh && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleRefresh}
							disabled={isRefreshing}
							className="mt-4 transition-all duration-300 hover:scale-105 hover:shadow-md"
						>
							<RefreshCw
								className={`mr-2 h-4 w-4 transition-all duration-300 ${isRefreshing ? 'animate-spin' : 'hover:rotate-180'}`}
							/>
							Try Again
						</Button>
					)}
				</div>
			)}
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
