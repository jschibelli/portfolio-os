import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Badge } from '../../../ui/badge';
import { Card, CardContent } from '../../../ui/card';

interface TestimonialProps {
	quote: string;
	author: string;
	role?: string;
	company?: string;
	avatar?: string;
	rating?: number;
	category?: string;
}

export const Testimonial: React.FC<TestimonialProps> = ({
	quote,
	author,
	role,
	company,
	avatar,
	rating = 5,
	category,
}) => {
	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
				★
			</span>
		));
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="my-8"
		>
			<Card className="relative overflow-hidden">
				<CardContent className="p-8">
					{/* Quote icon */}
					<div className="text-muted-foreground/20 absolute right-4 top-4">
						<Quote className="h-12 w-12" />
					</div>

					{/* Category badge */}
					{category && (
						<div className="mb-4">
							<Badge variant="secondary" className="text-xs">
								{category}
							</Badge>
						</div>
					)}

					{/* Quote text */}
					<blockquote className="text-foreground mb-6 text-lg italic leading-relaxed">
						&quot;{quote}&quot;
					</blockquote>

					{/* Rating */}
					<div className="mb-4 flex items-center gap-1">{renderStars(rating)}</div>

					{/* Author info */}
					<div className="flex items-center gap-4">
						{avatar && (
							<Image
								src={avatar}
								alt={author}
								width={48}
								height={48}
								className="border-border h-12 w-12 rounded-full border-2 object-cover"
								loading="lazy"
							/>
						)}
						<div>
							<div className="text-foreground font-semibold">{author}</div>
							{(role || company) && (
								<div className="text-muted-foreground text-sm">
									{role && <span>{role}</span>}
									{role && company && <span> at </span>}
									{company && <span>{company}</span>}
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

interface TestimonialsGridProps {
	testimonials: TestimonialProps[];
	title?: string;
}

export const TestimonialsGrid: React.FC<TestimonialsGridProps> = ({
	testimonials,
	title = 'Customer Testimonials',
}) => {
	return (
		<div className="my-12">
			{title && <h2 className="mb-8 text-center text-2xl font-bold">{title}</h2>}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{testimonials.map((testimonial, index) => (
					<Testimonial key={index} {...testimonial} />
				))}
			</div>
		</div>
	);
};
