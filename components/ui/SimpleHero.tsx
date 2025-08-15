import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

export default function SimpleHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
              John Schibelli
              <span className="block text-stone-200 font-medium text-2xl md:text-3xl lg:text-4xl mt-4">
                Senior Front-End Developer
              </span>
            </h1>
          </div>

          {/* Subhead */}
          <p className="text-lg md:text-xl lg:text-2xl text-stone-300 font-medium">
            React · Next.js · TypeScript · AI-Driven Development
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/work"
              className="group bg-white text-stone-900 hover:bg-stone-100 font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-lg inline-flex items-center"
            >
              View My Work
              <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/blog"
              className="group bg-white text-stone-900 hover:bg-stone-100 font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-lg inline-flex items-center"
            >
              Read the Blog
              <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
