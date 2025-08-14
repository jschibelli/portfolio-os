import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Screenshot from '@/components/ui/screenshot';
import { format } from 'date-fns';

interface FeaturedPostCardProps {
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  slug: string;
  readTime?: string;
  tags?: string[];
}

export default function FeaturedPostCard({
  title,
  excerpt,
  coverImage,
  date,
  slug,
  readTime = "5 min read",
  tags = []
}: FeaturedPostCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(`[data-featured-card-id="${slug}"]`);
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
      data-featured-card-id={slug}
      className={`transition-all duration-800 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <Link href={`/${slug}`} className="group block">
        <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 bg-white dark:bg-stone-900 shadow-xl">
          <div className="grid gap-0 lg:grid-cols-2">
            {/* Image Section */}
            <div className="relative overflow-hidden">
              <Screenshot
                srcLight={coverImage}
                alt={title}
                width={600}
                height={400}
                className="w-full h-64 lg:h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Enhanced Featured Badge */}
              <div className="absolute top-4 left-4 transition-all duration-300 group-hover:scale-110">
                <Badge className="bg-primary text-primary-foreground shadow-lg border border-primary/20 backdrop-blur-sm">
                  Featured
                </Badge>
              </div>

              {/* Hover overlay with read more indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-medium text-base backdrop-blur-sm">
                  Read Featured Article
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="flex flex-col justify-center p-8">
              <CardHeader className="p-0 pb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 transition-all duration-300 group-hover:text-stone-900 dark:group-hover:text-stone-100">
                    <time dateTime={date}>
                      {format(new Date(date), 'MMM dd, yyyy')}
                    </time>
                    <span>•</span>
                    <span>{readTime}</span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold leading-tight text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-all duration-300 group-hover:scale-[1.02]">
                    {title}
                  </h3>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <p className="text-stone-600 dark:text-stone-400 text-lg leading-relaxed mb-6 transition-all duration-300 group-hover:text-stone-800 dark:group-hover:text-stone-200">
                  {excerpt}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex gap-2 flex-wrap">
                    {tags.slice(0, 3).map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-sm border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 transition-all duration-300 group-hover:bg-stone-100 dark:group-hover:bg-stone-800 group-hover:border-stone-400 dark:group-hover:border-stone-500"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-sm font-semibold text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100 group-hover:translate-x-2 transition-all duration-300 flex items-center gap-1">
                    <span>Read full article</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
} 