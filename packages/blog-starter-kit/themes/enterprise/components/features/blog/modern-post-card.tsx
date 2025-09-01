import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Screenshot from '@/components/ui/screenshot';
import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ModernPostCardProps {
	title: string;
	excerpt: string;
	coverImage: string;
	date: string;
	slug: string;
	readTime?: string;
	tags?: string[];
}

export default function ModernPostCard({
	title,
	excerpt,
	coverImage,
	date,
	slug,
	readTime = '5 min read',
	tags = [],
}: ModernPostCardProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.1 },
		);

		const element = document.querySelector(`[data-card-id="${slug}"]`);
		if (element) {
			observer.observe(element);
		}

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	}, [slug]);

	return (
		<div
			data-card-id={slug}
			className={`transition-all duration-700 ease-out ${
				isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
			}`}
		>
			<Link href={`/${slug}`} className="group block">
				<Card className="group overflow-hidden border border-border bg-card shadow-lg transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 hover:shadow-xl">
					<div className="relative overflow-hidden">
						<Screenshot
							srcLight={coverImage}
							alt={title}
							width={400}
							height={250}
							className="h-48 w-full object-cover transition-all duration-500 group-hover:scale-110"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />

						{/* Enhanced floating badge */}
						{tags.length > 0 && (
							<div className="absolute left-4 top-4 transition-all duration-300 group-hover:scale-110">
								<Badge
									variant="secondary"
									className="bg-background/90 border-border/50 border shadow-lg backdrop-blur-sm"
								>
									{tags[0]}
								</Badge>
							</div>
						)}

						{/* Hover overlay with read more indicator */}
						<div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
							<div className="bg-primary/90 text-primary-foreground rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm">
								Read Article
							</div>
						</div>
					</div>

					<CardHeader className="p-6 pb-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 group-hover:text-foreground">
								<time dateTime={date}>{format(new Date(date), 'MMM dd, yyyy')}</time>
								<span>•</span>
								<span>{readTime}</span>
							</div>

							<h3 className="text-xl font-semibold leading-tight text-foreground transition-all duration-300 group-hover:scale-[1.02] group-hover:text-foreground">
								{title}
							</h3>
						</div>
					</CardHeader>

					<CardContent className="p-6 pt-0">
						<p className="line-clamp-3 leading-relaxed text-muted-foreground transition-all duration-300 group-hover:text-foreground">
							{excerpt}
						</p>

						<div className="mt-4 flex items-center justify-between">
							<div className="flex gap-2">
								{tags.slice(1, 3).map((tag, index) => (
									<Badge
										key={index}
										variant="outline"
										className="text-xs"
									>
										{tag}
									</Badge>
								))}
							</div>

							<div className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-all duration-300 group-hover:translate-x-2 group-hover:text-foreground">
								<span>Read more</span>
								<span className="transition-transform duration-300 group-hover:translate-x-1">
									→
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</Link>
		</div>
	);
}
