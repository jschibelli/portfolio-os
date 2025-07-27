import React from 'react';
import { resizeImage } from '@starter-kit/utils/image';
import { PostFullFragment, User } from '../generated/graphql';
import { Avatar } from './avatar';
import { CoverImage } from './cover-image';
import { DateFormatter } from './date-formatter';
import CoAuthorsModal from './co-authors-modal';
import { ReadTimeInMinutes } from './post-read-time-in-minutes';
import { PostTitle } from './post-title';
import { useAppContext } from './contexts/appContext';
import { twJoin } from 'tailwind-merge';
import { useState } from 'react';
import ProfileImage from './profile-image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type Author = Pick<User, 'username' | 'name' | 'profilePicture'>;

type Props = {
	title: string;
	coverImage: string | null | undefined;
	date: string;
	author: Author;
	readTimeInMinutes: number;
};

export const ModernPostHeader = ({ title, coverImage, date, author, readTimeInMinutes }: Props) => {
	const { post: _post } = useAppContext();
  	const post = _post as unknown as PostFullFragment;
	const authorsArray = [post.author, ...(post.coAuthors || [])];
	const [isCoAuthorModalVisible, setIsCoAuthorModalVisible] = useState(false);
	
	const closeCoAuthorModal = () => {
		setIsCoAuthorModalVisible(false);
	};
	
	const openCoAuthorModal = () => {
		setIsCoAuthorModalVisible(true);
	};

	return (
		<div className="w-full space-y-8">
			{/* Title Section */}
			<div className="space-y-6 text-center">
				<div className="prose md:prose-xl dark:prose-invert prose-h1:text-center mx-auto max-w-screen-lg px-5">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">{title}</h1>
				</div>
				
				{/* Author and Meta Info */}
				<div className="flex flex-col items-center gap-4">
					{/* Author Section */}
					<div className="flex items-center gap-3">
						{authorsArray.map((coAuthor, index) => (
							<div
								key={coAuthor.id?.toString()}
								style={{ zIndex: index + 1 }}
								className={twJoin(
									'overflow-hidden rounded-full bg-slate-200 dark:bg-white/20',
									index > 0 ? 'hidden md:block' : '',
									authorsArray.length === 1
										? 'h-12 w-12 md:h-14 md:w-14'
										: 'h-10 w-10 border-2 border-slate-100 dark:border-slate-800 md:h-11 md:w-11 [&:not(:first-of-type)]:-ml-3 md:[&:not(:first-of-type)]:-ml-6',
								)}
							>
								<ProfileImage user={coAuthor} width="200" height="200" hoverDisabled={true} />
							</div>
						))}
						
						{post.coAuthors && post.coAuthors.length > 0 && (
							<button
								onClick={openCoAuthorModal}
								style={{ zIndex: post.coAuthors?.length }}
								className="relative -ml-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-slate-100 bg-slate-100 px-1 group-hover:border-slate-200 dark:border-slate-800 dark:bg-slate-600 dark:text-white group-hover:dark:border-slate-700 md:hidden"
							>
								<p className="truncate text-xs font-normal">+{post.coAuthors.length}</p>
							</button>
						)}
						
						<div className="flex flex-col items-start">
							{!post.coAuthors?.length && (
								<a
									href={`https://hashnode.com/@${post.author.username}`}
									className="font-semibold text-slate-600 dark:text-white hover:text-primary transition-colors"
								>
									<span>{post.author.name}</span>
								</a>
							)}
							{post.coAuthors && post.coAuthors.length > 0 && (
								<button
									onClick={openCoAuthorModal}
									className="text-left font-semibold text-slate-600 hover:text-primary transition-colors dark:text-white"
								>
									<span>{post.author.name}</span>
									{post.coAuthors && (
										<span className="font-normal">
											{' '}
											<br className="block sm:hidden" />
											with {post.coAuthors.length} co-author{post.coAuthors.length === 1 ? '' : 's'}
										</span>
									)}
								</button>
							)}
						</div>
					</div>
					
					{/* Meta Info */}
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<DateFormatter dateString={date} />
						{readTimeInMinutes && (
							<>
								<span className="text-muted-foreground">•</span>
								<ReadTimeInMinutes readTimeInMinutes={readTimeInMinutes} />
							</>
						)}
					</div>
				</div>
			</div>

			{/* Cover Image */}
			{coverImage && (
				<div className="w-full">
					<Card className="overflow-hidden border-0 shadow-lg">
						<CardContent className="p-0">
							<CoverImage
								title={title}
								src={resizeImage(coverImage, { w: 1600, h: 840, c: 'thumb' })}
								priority={true}
							/>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Tags */}
			{post.tags && post.tags.length > 0 && (
				<div className="flex flex-wrap gap-2 justify-center">
					{post.tags.map((tag) => (
						<Badge key={tag.id} variant="outline" className="text-sm">
							#{tag.slug}
						</Badge>
					))}
				</div>
			)}

			{isCoAuthorModalVisible && (
				<CoAuthorsModal closeModal={closeCoAuthorModal} />
			)}
		</div>
	);
}; 