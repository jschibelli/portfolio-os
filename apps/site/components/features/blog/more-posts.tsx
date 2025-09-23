import { PostFragment } from '../../../generated/graphql';
import ModernPostCard from './modern-post-card';

type Props = {
	posts: PostFragment[];
	context: 'home' | 'series' | 'tag';
};

export const MorePosts = ({ posts, context }: Props) => {
	return (
		<section className="mb-10 flex flex-col items-start gap-10">
			{context === 'home' && (
				<h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 lg:text-3xl dark:text-neutral-50">
					More Posts
				</h2>
			)}
			<div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
				{posts.map((post) => (
					<ModernPostCard
						key={post.slug}
						title={post.title}
						coverImage={post.coverImage?.url || ''}
						date={post.publishedAt}
						slug={post.slug}
						excerpt={post.brief}
						readTime="3 min read"
						tags={['Technology', 'Development']}
					/>
				))}
			</div>
		</section>
	);
};
