import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
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
  ctaText,
  ctaLink,
  imageUrl = "/assets/hero/hero-image.webp"
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
    <div className="hero-container relative overflow-hidden py-12 md:py-16 min-h-[400px]">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/hero/hero-bg1.png)',
        }}
      />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
                    {/* Content Section */}
          <div className={`space-y-6 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
                        <div className="space-y-3">
               <h2 className={`text-xs sm:text-sm font-medium text-stone-200 uppercase tracking-wider transition-all duration-700 delay-200 ${
                 isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
               }`}>
                 {subtitle}
               </h2>
               <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white transition-all duration-800 delay-300 ${
                 isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
               }`}>
                 {title}
               </h1>
             </div>
             
                         <p className={`text-base sm:text-lg text-stone-300 max-w-[600px] mx-auto leading-relaxed px-4 transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {description}
            </p>
            
            {ctaText && ctaLink && (
              <div className={`flex flex-col gap-4 sm:flex-row justify-center items-center transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <Button 
                  size="lg" 
                  variant="glow" 
                  className="group w-full sm:w-fit font-semibold px-6 sm:px-8 py-3 text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-xl" 
                  asChild
                >
                  <a href={ctaLink}>
                    {ctaText}
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  className="group w-full sm:w-fit font-semibold px-6 sm:px-8 py-3 text-sm sm:text-base bg-white text-stone-900 hover:bg-stone-100 transition-all duration-300 hover:scale-105 hover:shadow-xl" 
                  asChild
                >
                  <Link href="/blog">
                    Read the Blog
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 