import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Screenshot from '@/components/ui/screenshot';
import { format } from 'date-fns';

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
  readTime = "5 min read",
  tags = []
}: ModernPostCardProps) {
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
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <Link href={`/${slug}`} className="group block">
        <Card className="group overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.02] border border-border/50 hover:border-primary/30 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 shadow-lg">
          <div className="relative overflow-hidden">
            <Screenshot
              srcLight={coverImage}
              alt={title}
              width={400}
              height={250}
              className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Enhanced floating badge */}
            {tags.length > 0 && (
              <div className="absolute top-4 left-4 transition-all duration-300 group-hover:scale-110">
                <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg">
                  {tags[0]}
                </Badge>
              </div>
            )}

            {/* Hover overlay with read more indicator */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-full font-medium text-sm backdrop-blur-sm">
                Read Article
              </div>
            </div>
          </div>
          
          <CardHeader className="p-6 pb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 group-hover:text-primary">
                <time dateTime={date}>
                  {format(new Date(date), 'MMM dd, yyyy')}
                </time>
                <span>•</span>
                <span>{readTime}</span>
              </div>
              
              <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-all duration-300 group-hover:scale-[1.02]">
                {title}
              </h3>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 pt-0">
            <p className="text-muted-foreground line-clamp-3 leading-relaxed transition-all duration-300 group-hover:text-foreground">
              {excerpt}
            </p>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                {tags.slice(1, 3).map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="text-sm font-medium text-primary group-hover:translate-x-2 transition-all duration-300 flex items-center gap-1">
                <span>Read more</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
} 