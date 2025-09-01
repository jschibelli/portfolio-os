/* eslint-disable @next/next/no-img-element */
import { Badge, Button, Card, CardContent, CardHeader } from '@/components/ui';
import Link from 'next/link';
import { PortfolioItem } from '../../types/portfolio';

interface CaseStudyCardProps {
	item: PortfolioItem;
	index: number;
}

export default function CaseStudyCardSimple({ item, index }: CaseStudyCardProps) {
	return (
		<div className="group pointer-events-auto h-full">
			<Card className="group overflow-hidden border border-border bg-card shadow-lg transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 hover:shadow-xl">
				<div className="relative overflow-hidden">
					<div className="relative aspect-video overflow-hidden">
						{item.image && item.image.startsWith('/') ? (
							<img
								src={item.image}
								alt={`Screenshot of ${item.title}`}
								className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.style.display = 'none';
									target.nextElementSibling?.classList.remove('hidden');
								}}
							/>
						) : null}
						<div
							className={`absolute inset-0 flex items-center justify-center ${item.image && item.image.startsWith('/') ? 'hidden' : ''}`}
						>
							<div className="text-center">
								<div className="bg-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg">
									<svg
										className="text-primary h-8 w-8"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<p className="text-muted-foreground text-sm font-medium">{item.title}</p>
							</div>
						</div>
						<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
						{item.tags && item.tags.length > 0 && (
							<div className="absolute left-4 top-4 transition-all duration-300 group-hover:scale-110">
								<Badge variant="secondary" className="bg-background/90 border border-border/50 shadow-lg backdrop-blur-sm">
									{item.tags[0]}
								</Badge>
							</div>
						)}
						<div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
							<div className="bg-primary/90 text-primary-foreground rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm">
								View Case Study
							</div>
						</div>
					</div>
				</div>

				<CardHeader className="pb-4">
					<div className="space-y-3">
						<h3 className="text-xl font-semibold leading-tight text-foreground transition-colors duration-300 group-hover:text-foreground">
							{item.title}
						</h3>
						<p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
							{item.description}
						</p>
					</div>
				</CardHeader>

				<CardContent className="relative flex flex-1 flex-col pt-0">
					<div className="flex flex-1 flex-col space-y-4">
						{/* Tags */}
						<div className="flex flex-wrap gap-2">
							{item.tags?.slice(1, 3).map((tag, tagIndex) => (
								<Badge key={tag} variant="outline" className="text-xs">
									{tag}
								</Badge>
							))}
						</div>

						{/* Action Buttons */}
						<div className="relative sticky bottom-0 z-50 mt-auto flex w-full flex-col gap-3 pt-2 lg:flex-row 2xl:flex-col">
							{/* View Live Button */}
							{item.liveUrl && (
								<Button
									asChild
									size="sm"
									variant="outline"
									className="group/btn flex-1 transition-all duration-300 hover:scale-105 hover:shadow-md lg:min-h-[44px] 2xl:min-h-[48px] 2xl:text-xs"
								>
									<Link
										href={item.liveUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2"
									>
										<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
											/>
										</svg>
										View Live
									</Link>
								</Button>
							)}

							{/* Case Study Button - Always show */}
							<Button
								asChild
								size="sm"
								className="group/btn flex-1 transition-all duration-300 hover:scale-105 hover:shadow-md lg:min-h-[44px] 2xl:min-h-[48px] 2xl:text-xs"
							>
								<Link
									href={item.caseStudyUrl || `/case-studies/${item.slug}`}
									className="flex items-center gap-2"
								>
									<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									Case Study
								</Link>
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
