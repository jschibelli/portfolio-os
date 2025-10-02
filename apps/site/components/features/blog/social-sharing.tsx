'use client';

import { FacebookSVG, XSVG, LinkedinSVG } from '../../icons';

interface SocialSharingProps {
  title: string;
  url: string;
  description?: string;
}

export const SocialSharing = ({ title, url, description }: SocialSharingProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : '';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
        Share:
      </span>
      <div className="flex gap-2">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className="flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-700 p-2 text-stone-600 dark:text-stone-400 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100"
        >
          <FacebookSVG className="h-4 w-4" />
        </a>
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
          className="flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-700 p-2 text-stone-600 dark:text-stone-400 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100"
        >
          <XSVG className="h-4 w-4" />
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-700 p-2 text-stone-600 dark:text-stone-400 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100"
        >
          <LinkedinSVG className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};
