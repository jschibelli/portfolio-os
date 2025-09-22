import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Search, ArrowLeft } from 'lucide-react';
import { AppProvider } from '../components/contexts/appContext';
import { Layout } from '../components/shared/layout';
import { Container } from '../components/shared/container';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { PublicationByHostDocument } from '../generated/graphql';
import request from 'graphql-request';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'blog' | 'page';
  url: string;
  tags?: string[];
}

interface Props {
  publication: any;
}

export default function SearchPage({ publication }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Get initial query from URL
  useEffect(() => {
    if (router.query.q && typeof router.query.q === 'string') {
      setQuery(router.query.q);
      performSearch(router.query.q);
    }
  }, [router.query.q]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    
    // Update URL
    router.push(`/search?q=${encodeURIComponent(query)}`, undefined, { shallow: true });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'blog':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'page':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>Search - {publication.displayTitle || publication.title}</title>
          <meta
            name="description"
            content="Search through projects, blog posts, and pages"
          />
        </Head>

        <main className="min-h-screen bg-white dark:bg-stone-950">
          <Container className="py-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                
                <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                  Search
                </h1>
                <p className="text-stone-600 dark:text-stone-400">
                  Find projects, blog posts, and pages across the site
                </p>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search projects, blog posts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg"
                  />
                </div>
              </form>

              {/* Results */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-stone-900 dark:border-stone-100"></div>
                    Searching...
                  </div>
                </div>
              )}

              {hasSearched && !isLoading && (
                <div className="space-y-6">
                  {results.length === 0 ? (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                        No results found
                      </h3>
                      <p className="text-stone-600 dark:text-stone-400">
                        Try different keywords or check your spelling
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        Found {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                      </div>
                      
                      <div className="space-y-4">
                        {results.map((result) => (
                          <div
                            key={result.id}
                            className="p-6 border border-stone-200 dark:border-stone-800 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <Badge 
                                variant="secondary" 
                                className={getTypeColor(result.type)}
                              >
                                {result.type}
                              </Badge>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                                  <a
                                    href={result.url}
                                    className="hover:text-stone-600 dark:hover:text-stone-400 transition-colors"
                                  >
                                    {result.title}
                                  </a>
                                </h3>
                                <p className="text-stone-600 dark:text-stone-400 mb-3">
                                  {result.description}
                                </p>
                                {result.tags && result.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {result.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="text-xs px-2 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {!hasSearched && !isLoading && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                    Start searching
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400">
                    Enter a search term above to find projects, blog posts, and pages
                  </p>
                </div>
              )}
            </div>
          </Container>
        </main>
      </Layout>
    </AppProvider>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT || 'https://gql.hashnode.com/';
  const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';

  try {
    const data = await request(GQL_ENDPOINT, PublicationByHostDocument, { host });
    
    return {
      props: {
        publication: data.publication,
      },
      revalidate: 1,
    };
  } catch (error) {
    console.error('Error fetching publication data:', error);
    return {
      props: {
        publication: {
          title: 'John Schibelli',
          displayTitle: 'John Schibelli',
        },
      },
      revalidate: 1,
    };
  }
};
