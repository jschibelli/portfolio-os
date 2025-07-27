import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Glow from '@/components/ui/glow';
import { Mockup, MockupFrame } from '@/components/ui/mockup';
import Screenshot from '@/components/ui/screenshot';

interface ModernHeroProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
}

export default function ModernHero({
  title,
  subtitle,
  description,
  ctaText = "Get Started",
  ctaLink = "#",
  imageUrl = "/assets/hero/hero-image.jpg"
}: ModernHeroProps) {
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

    const element = document.querySelector('.hero-container');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <div className="hero-container relative overflow-hidden bg-background py-12">
      <Glow variant="top" className={`opacity-50 transition-all duration-1000 ${isVisible ? 'animate-appear-zoom' : 'opacity-0 scale-95'}`} />
      
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-4 lg:grid-cols-2">
          {/* Content Section */}
          <div className={`space-y-6 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="space-y-3">
              <h2 className={`text-sm font-medium text-muted-foreground uppercase tracking-wider transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {subtitle}
              </h2>
              <h1 className={`text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl transition-all duration-800 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}>
                {title}
              </h1>
            </div>
            
            <p className={`text-lg text-muted-foreground max-w-[600px] leading-relaxed transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {description}
            </p>
            
            <div className={`flex flex-col gap-4 sm:flex-row transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <Button 
                size="lg" 
                variant="glow" 
                className="group w-fit font-semibold px-8 py-3 text-base transition-all duration-300 hover:scale-105 hover:shadow-xl" 
                asChild
              >
                <a href={ctaLink}>
                  {ctaText}
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="group w-fit font-medium px-8 py-3 text-base border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg" 
                asChild
              >
                <Link href="/blog">
                  View All Posts
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual Section */}
          <div className={`flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative group">
              <Mockup type="responsive" className="w-full max-w-2xl transition-all duration-500 group-hover:scale-105">
                <MockupFrame size="large" className="p-0">
                  <Screenshot
                    srcLight={imageUrl}
                    alt="Blog Preview"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-lg transition-all duration-500 group-hover:scale-105"
                  />
                </MockupFrame>
              </Mockup>
              
              {/* Enhanced floating accents */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary/20 rounded-full animate-pulse transition-all duration-300 group-hover:scale-125" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-accent/30 rounded-full animate-pulse transition-all duration-300 group-hover:scale-125" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 -right-4 w-2 h-2 bg-secondary/40 rounded-full animate-pulse transition-all duration-300 group-hover:scale-150" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 