// MobX Stuff
import Image from 'next/legacy/image';

import { HashnodeLogoIconV2 } from './icons/svgs';
import { resizeImage } from '../utils/image';
import Link from 'next/link';

// type PublicationFooterProps = Pick<Publication, 'title' | 'postsCount' | 'imprint' | 'isTeam'> &
//   Pick<Publication['preferences'], 'disableFooterBranding' | 'logo' | 'darkMode'> & {
//     authorName: string;
//   }; // TODO: types need to be fixed

function PublicationFooter(props: any) {
  const { isTeam, authorName, title, imprint, disableFooterBranding, logo } = props;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 to-transparent dark:from-slate-800/50"></div>
      
      <div className="relative mx-auto max-w-6xl px-5 py-16">
        {/* Impressum section */}
        {imprint && (
          <section className="mx-auto mb-12 rounded-lg border border-slate-200 bg-white px-6 py-8 text-left dark:border-slate-800 dark:bg-slate-900 lg:w-3/4 xl:w-2/3">
            <p className="mb-4 text-center text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Impressum
            </p>
            <div
              className="prose mx-auto w-full dark:prose-dark"
              dangerouslySetInnerHTML={{ __html: `${imprint}` }}
            ></div>
          </section>
        )}

        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand section */}
          <div className="lg:col-span-2">
            {logo ? (
              <div className="mb-6">
                <Link href="/" className="relative block h-12 w-auto">
                  <Image
                    layout="fill"
                    alt={title || `${authorName}'s ${isTeam ? 'team' : ''} blog`}
                    src={resizeImage(logo, { w: 1000, h: 250, c: 'thumb' })}
                    className="object-contain"
                  />
                </Link>
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {title || `${authorName}'s Blog`}
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-md">
                  Sharing insights on technology, design, and innovation
                </p>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="space-y-8">
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-50">
                Quick Links
              </h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a href="/blog" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
                    All posts
                  </a>
                </li>
                <li>
                  <a href="/series" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
                    Series
                  </a>
                </li>
                <li>
                  <a href="/tags" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
                    Topics
                  </a>
                </li>
                <li>
                  <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
                    RSS Feed
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-8">
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-50">
                Legal
              </h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a href="https://hashnode.com/privacy?source=blog-footer" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="https://hashnode.com/terms?source=blog-footer" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/about" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
                    About
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@example.com" className="transition-colors hover:text-slate-900 dark:hover:text-slate-50">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <p>&copy; {currentYear} {title || `${authorName}'s Blog`}. All rights reserved.</p>
            </div>
          </div>
          
          {!disableFooterBranding && (
            <div className="mt-6 flex flex-col items-center">
              <Link
                aria-label="Publish with Hashnode"
                className="mb-4 flex flex-row items-center rounded-lg border border-slate-300 bg-white p-3 font-heading font-bold tracking-wide text-slate-600 transition-colors duration-75 hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                href="https://hashnode.com/onboard?unlock-blog=true&source=blog-footer"
              >
                <span className="mr-2 block text-blue-600">
                  <HashnodeLogoIconV2 className="h-6 w-6 fill-current" />
                </span>
                <span>Publish with Hashnode</span>
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                Exclusively Built by{' '}
                <a aria-label="John Schibelli" href="https://schibelli.dev" className="underline transition-colors hover:text-slate-700 dark:hover:text-slate-300">
                  John Schibelli
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

export default PublicationFooter;
