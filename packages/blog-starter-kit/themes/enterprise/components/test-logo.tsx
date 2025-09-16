'use client';

import { PersonalLogo } from './shared/personal-logo';

export function TestLogo() {
  return (
    <div className="p-8 bg-white dark:bg-stone-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Logo Test</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Small Logo</h2>
          <PersonalLogo size="small" />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Medium Logo</h2>
          <PersonalLogo size="medium" />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Large Logo</h2>
          <PersonalLogo size="large" />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">XLarge Logo</h2>
          <PersonalLogo size="xlarge" />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Without Link</h2>
          <PersonalLogo linkToHome={false} />
        </div>
      </div>
    </div>
  );
}
