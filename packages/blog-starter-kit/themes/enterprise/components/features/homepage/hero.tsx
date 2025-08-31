import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { ArrowRightIcon } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative py-12 md:py-16 flex items-center justify-center overflow-hidden min-h-[400px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero/hero-bg1.png"
          alt="Abstract stone palette background"
          fill
          className="object-cover"
          priority
        />
        {/* Radial gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-radial from-stone-900/80 via-stone-900/60 to-stone-900/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
          >
            John Schibelli
            <span className="block text-stone-200 font-medium text-2xl md:text-3xl lg:text-4xl mt-4">
              Senior Front-End Developer
            </span>
          </motion.h1>

          {/* Subhead */}
                     <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
             className="text-lg md:text-xl lg:text-2xl text-stone-300 font-medium"
           >
             React · Next.js · TypeScript · Tailwind CSS · Towaco, NJ
           </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="group bg-white text-stone-900 hover:bg-stone-100 font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              asChild
            >
              <Link href="/work">
                View My Work
                <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="group bg-white text-stone-900 hover:bg-stone-100 font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              asChild
            >
              <Link href="/blog">
                Read the Blog
                <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
