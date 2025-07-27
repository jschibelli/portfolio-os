import React from 'react';
import Link from 'next/link';

export default function TestCaseStudy() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Test Case Study Page</h1>
        
        <div className="space-y-4">
          <p className="text-lg">This is a test page to verify routing is working.</p>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Test Links:</h2>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/case-studies/synaplyai" 
                  className="text-primary hover:underline"
                >
                  /case-studies/synaplyai
                </Link>
              </li>
              <li>
                <Link 
                  href="/case-studies/zeus-ecommerce-platform" 
                  className="text-primary hover:underline"
                >
                  /case-studies/zeus-ecommerce-platform
                </Link>
              </li>
              <li>
                <Link 
                  href="/case-studies/contenthub-cms-redesign" 
                  className="text-primary hover:underline"
                >
                  /case-studies/contenthub-cms-redesign
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="mt-8">
            <Link 
              href="/portfolio" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 