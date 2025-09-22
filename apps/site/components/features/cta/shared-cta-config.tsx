// Shared configuration for CTA components to reduce duplication
import React from 'react';
import { ArrowRightIcon, BriefcaseIcon, BuildingIcon, CalendarIcon, MailIcon, MessageSquareIcon, StarIcon, UsersIcon, ZapIcon } from 'lucide-react';

// Common audience types
export type AudienceType = 'recruiters' | 'startup-founders' | 'clients' | 'general';

// Shared styling classes for consistency
export const sharedStyles = {
  availability: {
    available: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    busy: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
  },
  statusIndicator: {
    available: 'bg-green-500',
    busy: 'bg-yellow-500'
  },
  button: {
    primary: 'bg-stone-900 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200',
    secondary: 'px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105',
    enhanced: 'group bg-white px-8 py-4 text-lg font-semibold text-stone-900 transition-all duration-300 hover:scale-105 hover:bg-stone-100 hover:shadow-xl',
    enhancedOutline: 'px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-stone-900 border-white hover:border-white'
  }
};

// Common icons for reuse
export const commonIcons = {
  arrowRight: <ArrowRightIcon className="h-5 w-5" />,
  briefcase: <BriefcaseIcon className="h-8 w-8" />,
  building: <BuildingIcon className="h-8 w-8" />,
  calendar: <CalendarIcon className="h-5 w-5" />,
  mail: <MailIcon className="h-5 w-5" />,
  message: <MessageSquareIcon className="h-5 w-5" />,
  star: <StarIcon className="h-4 w-4" />,
  users: <UsersIcon className="h-5 w-5" />,
  zap: <ZapIcon className="h-8 w-8" />
};

// Validation function for audience types
export function validateAudience(audience: string, fallback: AudienceType = 'general'): AudienceType {
  const validAudiences: AudienceType[] = ['recruiters', 'startup-founders', 'clients', 'general'];
  return validAudiences.includes(audience as AudienceType) ? audience as AudienceType : fallback;
}

// Error handling utility
export function handleInvalidAudience(audience: string, fallback: AudienceType): void {
  console.warn(`Invalid audience type: ${audience}. Falling back to '${fallback}'.`);
}
