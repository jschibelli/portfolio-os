import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PortfolioItem } from '../../types/portfolio';

interface CaseStudyCardProps {
  item: PortfolioItem;
  index: number;
}

export default function CaseStudyCardSimple({ item, index }: CaseStudyCardProps) {

  return (
    <div className="group pointer-events-auto h-full">
      <Card className="h-full max-h-[600px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] border-border/50 bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm relative pointer-events-auto flex flex-col">
        <div className="relative overflow-hidden">
          <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
            {item.image && item.image.startsWith('/') ? (
              <img
                src={item.image}
                alt={`Screenshot of ${item.title}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`absolute inset-0 flex items-center justify-center ${item.image && item.image.startsWith('/') ? 'hidden' : ''}`}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground font-medium">{item.title}</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </div>

        <CardHeader className="pb-4">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors duration-300">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {item.description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-0 relative flex-1 flex flex-col">
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, tagIndex) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row gap-3 pt-2 w-full relative z-50 mt-auto sticky bottom-0 2xl:flex-col">
              {/* View Live Button */}
              {item.liveUrl && (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="flex-1 group/btn transition-all duration-300 hover:scale-105 hover:shadow-md lg:min-h-[44px] 2xl:min-h-[48px] 2xl:text-xs"
                >
                  <Link 
                    href={item.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Live
                  </Link>
                </Button>
              )}
              
              {/* Case Study Button - Always show */}
              <Button
                asChild
                size="sm"
                variant="default"
                className="flex-1 group/btn transition-all duration-300 hover:scale-105 hover:shadow-md lg:min-h-[44px] 2xl:min-h-[48px] 2xl:text-xs"
              >
                <Link 
                  href={item.caseStudyUrl || `/case-studies/${item.slug}`}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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