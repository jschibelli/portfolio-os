"use client";

export const dynamic = 'force-dynamic';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Layout } from '../../components/shared/layout';
import { Container } from '../../components/shared/container';
import Chatbot from '../../components/features/chatbot/Chatbot';
import ProjectCard, { Project } from '../../components/features/portfolio/project-card';
import AudienceSpecificCTA from '../../components/features/cta/audience-specific-cta';
import EnhancedCTASection from '../../components/features/cta/enhanced-cta-section';

import { allProjects as projectMetaList } from '../../data/projects';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowRight, Calendar, Code, Users, MapPin, CheckCircle, Search, Award, X } from 'lucide-react';

// Transform data/projects ProjectMeta into ProjectCard Project shape
function toProjectCard(projectMeta: any): Project {
  return {
    id: projectMeta.id,
    title: projectMeta.title,
    description: projectMeta.description,
    image: projectMeta.image || '/assets/hero/hero-image.webp',
    tags: projectMeta.tags || [],
    caseStudyUrl: projectMeta.caseStudyUrl,
    slug: projectMeta.slug,
    liveUrl: projectMeta.liveUrl,
    category: projectMeta.category,
    status: projectMeta.status,
    technologies: projectMeta.technologies,
    client: projectMeta.client,
    industry: projectMeta.industry,
    startDate: projectMeta.startDate,
    endDate: projectMeta.endDate,
  };
}

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const projects: Project[] = useMemo(() => projectMetaList.map(toProjectCard), []);

  // Facets
  const allTags = useMemo(() => Array.from(new Set(projects.flatMap(p => p.tags))).sort(), [projects]);
  const allTechnologies = useMemo(() => Array.from(new Set(projects.flatMap(p => p.tags))).sort(), [projects]);
  const allCategories = useMemo(() => Array.from(new Set(projects.map(p => p.category || 'other'))).sort(), [projects]);
  const allStatuses = useMemo(() => Array.from(new Set(projects.map(p => p.status || 'completed'))).sort(), [projects]);
  const allClients = useMemo(() => Array.from(new Set(projects.map(p => p.client).filter(Boolean) as string[])).sort(), [projects]);

  // Read current filters from query
  const currentTags = useMemo(() => {
    const tagParam = searchParams.get('tags');
    return tagParam ? tagParam.split(',').filter(Boolean) : [];
  }, [searchParams]);
  const currentSearch = useMemo(() => searchParams.get('search') || '', [searchParams]);
  const currentSort = useMemo(() => searchParams.get('sort') || 'default', [searchParams]);
  const currentCategory = useMemo(() => searchParams.get('category') || '', [searchParams]);
  const currentStatus = useMemo(() => searchParams.get('status') || '', [searchParams]);
  const currentTechnology = useMemo(() => searchParams.get('technology') || '', [searchParams]);
  const currentClient = useMemo(() => searchParams.get('client') || '', [searchParams]);

  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Enhanced search
  const enhancedSearch = useCallback((query: string, list: Project[]) => {
    if (!query) return list;
    const q = query.toLowerCase();
    const terms = q.split(' ').filter(Boolean);
    return list.filter(p => {
      const text = [p.title, p.description, ...(p.tags || []), p.client || '', p.industry || ''].join(' ').toLowerCase();
      return terms.every(t => text.includes(t));
    });
  }, []);

  // Update URL
  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') params.delete(key);
      else params.set(key, value);
    });
    router.replace(`/projects?${params.toString()}`);
  }, [router, searchParams]);

  const handleTagToggle = useCallback((tag: string) => {
    const next = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    updateFilters({ tags: next.length ? next.join(',') : null });
  }, [currentTags, updateFilters]);

  const handleSearchChange = useCallback((value: string) => {
    updateFilters({ search: value || null });
  }, [updateFilters]);

  const handleSuggestionClick = useCallback((value: string) => {
    handleSearchChange(value);
    setShowSuggestions(false);
  }, [handleSearchChange]);

  const handleSortChange = useCallback((value: string) => {
    updateFilters({ sort: value === 'default' ? null : value });
  }, [updateFilters]);
  const handleCategoryChange = useCallback((value: string) => updateFilters({ category: value === 'all' ? null : value }), [updateFilters]);
  const handleStatusChange = useCallback((value: string) => updateFilters({ status: value === 'all' ? null : value }), [updateFilters]);
  const handleTechnologyChange = useCallback((value: string) => updateFilters({ technology: value === 'all' ? null : value }), [updateFilters]);
  const handleClientChange = useCallback((value: string) => updateFilters({ client: value === 'all' ? null : value }), [updateFilters]);
  const clearAllFilters = useCallback(() => router.replace('/projects'), [router]);

  const hasActiveFilters = currentTags.length > 0 || currentSearch || currentSort !== 'default' || currentCategory || currentStatus || currentTechnology || currentClient;

  // Suggestions
  useEffect(() => {
    if (currentSearch && currentSearch.length > 1) {
      const suggestions = [
        ...allTags.filter(t => t.toLowerCase().includes(currentSearch.toLowerCase())),
        ...allTechnologies.filter(t => t.toLowerCase().includes(currentSearch.toLowerCase())),
        ...allClients.filter(c => c.toLowerCase().includes(currentSearch.toLowerCase())),
        ...allCategories.filter(c => c.toLowerCase().includes(currentSearch.toLowerCase())),
      ].slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [currentSearch, allTags, allTechnologies, allClients, allCategories]);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...projects];

    if (currentSearch) list = enhancedSearch(currentSearch, list);
    if (currentTags.length) list = list.filter(p => currentTags.some(t => (p.tags || []).includes(t)));
    if (currentCategory) list = list.filter(p => (p.category || 'other') === currentCategory);
    if (currentStatus) list = list.filter(p => (p.status || 'completed') === currentStatus);
    if (currentTechnology) list = list.filter(p => (p.tags || []).includes(currentTechnology));
    if (currentClient) list = list.filter(p => p.client === currentClient);

    switch (currentSort) {
      case 'title-asc':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'date-newest':
        list.sort((a, b) => new Date(b.endDate || b.startDate || '').getTime() - new Date(a.endDate || a.startDate || '').getTime());
        break;
      case 'date-oldest':
        list.sort((a, b) => new Date(a.startDate || a.endDate || '').getTime() - new Date(b.startDate || b.endDate || '').getTime());
        break;
      case 'client-asc':
        list.sort((a, b) => (a.client || '').localeCompare(b.client || ''));
        break;
      case 'client-desc':
        list.sort((a, b) => (b.client || '').localeCompare(a.client || ''));
        break;
      case 'tags-asc':
        list.sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0));
        break;
      case 'tags-desc':
        list.sort((a, b) => (a.tags?.length || 0) - (b.tags?.length || 0));
        break;
      default:
        break;
    }

    return list;
  }, [projects, currentSearch, currentTags, currentCategory, currentStatus, currentTechnology, currentClient, currentSort, enhancedSearch]);

  return (
    <Layout>
      <main className="min-h-screen bg-white dark:bg-stone-950">
        {/* Hero */}
        <section
          className="relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px] overflow-hidden bg-stone-50 py-8 sm:py-12 md:py-16 lg:py-20 dark:bg-stone-900"
          style={{ backgroundImage: 'url(/assets/hero/hero-bg2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        >
          <div className="absolute inset-0 z-0 bg-stone-50/80 dark:bg-stone-900/80"></div>
          <div className="relative z-10">
            <Container className="px-4 sm:px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="mx-auto max-w-5xl text-center space-y-6 sm:space-y-8">
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
                  Building Smarter, Faster<br /> Web Applications
                </motion.h1>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }} className="space-y-3 sm:space-y-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-stone-800 dark:text-stone-200">John Schibelli</h2>
                  <p className="text-base sm:text-lg md:text-xl font-medium text-stone-700 dark:text-stone-300">15+ years of experience turning ideas into high-performance web apps</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }} className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                  <span className="inline-flex items-center justify-center gap-2"><MapPin className="h-3 w-3 sm:h-4 sm:w-4" /> Towaco, NJ</span>
                  <span className="inline-flex items-center justify-center gap-2"><Calendar className="h-3 w-3 sm:h-4 sm:w-4" /> {projects.length} Projects</span>
                  <span className="inline-flex items-center justify-center gap-2"><Users className="h-3 w-3 sm:h-4 sm:w-4" /> Client Success</span>
                  <span className="inline-flex items-center justify-center gap-2"><Code className="h-3 w-3 sm:h-4 sm:w-4" /> {allTags.length} Technologies</span>
                </motion.div>
              </motion.div>
            </Container>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-stone-200 bg-white py-6 sm:py-8 dark:border-stone-800 dark:bg-stone-950">
          <Container className="px-4 sm:px-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="w-full">
                  <Label htmlFor="search" className="sr-only">Search projects</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <Input id="search" type="text" placeholder="Search projects, technologies, clients..." value={currentSearch} onChange={(e) => handleSearchChange(e.target.value)} onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} className="w-full h-12 text-base pl-10" autoComplete="off" spellCheck={false} />
                  </div>
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-stone-200 bg-white shadow-lg dark:border-stone-700 dark:bg-stone-800">
                      {searchSuggestions.map((s, i) => (
                        <button key={i} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSuggestionClick(s)} className="w-full px-4 py-2 text-left text-sm hover:bg-stone-100 dark:hover:bg-stone-700">{s}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-center">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Label htmlFor="sort" className="text-sm font-medium">Sort:</Label>
                  <Select value={currentSort} onValueChange={handleSortChange}>
                    <SelectTrigger id="sort" className="w-full sm:w-40 h-12 text-base" aria-label="Sort projects">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="title-asc">Title A-Z</SelectItem>
                      <SelectItem value="title-desc">Title Z-A</SelectItem>
                      <SelectItem value="date-newest">Newest First</SelectItem>
                      <SelectItem value="date-oldest">Oldest First</SelectItem>
                      <SelectItem value="client-asc">Client A-Z</SelectItem>
                      <SelectItem value="client-desc">Client Z-A</SelectItem>
                      <SelectItem value="tags-asc">Most Tags</SelectItem>
                      <SelectItem value="tags-desc">Fewest Tags</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearAllFilters} className="flex items-center gap-2 h-12 px-4 w-full sm:w-auto">
                    <X className="h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>

              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 justify-center">
                  <span className="text-xs sm:text-sm font-medium">Active filters:</span>
                  {currentSearch && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs px-2 py-1">
                      <span className="truncate max-w-[120px] sm:max-w-none">Search: "{currentSearch}"</span>
                      <button onClick={() => handleSearchChange('')} className="ml-1 hover:text-red-600" aria-label="Remove search filter"><X className="h-3 w-3" /></button>
                    </Badge>
                  )}
                  {currentCategory && (
                    <Badge variant="secondary" className="flex items-center gap-1">Type: {currentCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}<button onClick={() => handleCategoryChange('all')} className="ml-1 hover:text-red-600" aria-label="Remove category filter"><X className="h-3 w-3" /></button></Badge>
                  )}
                  {currentStatus && (
                    <Badge variant="secondary" className="flex items-center gap-1">Status: {currentStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}<button onClick={() => handleStatusChange('all')} className="ml-1 hover:text-red-600" aria-label="Remove status filter"><X className="h-3 w-3" /></button></Badge>
                  )}
                  {currentTechnology && (
                    <Badge variant="secondary" className="flex items-center gap-1">Tech: {currentTechnology}<button onClick={() => handleTechnologyChange('all')} className="ml-1 hover:text-red-600" aria-label="Remove technology filter"><X className="h-3 w-3" /></button></Badge>
                  )}
                  {currentClient && (
                    <Badge variant="secondary" className="flex items-center gap-1">Client: {currentClient}<button onClick={() => handleClientChange('all')} className="ml-1 hover:text-red-600" aria-label="Remove client filter"><X className="h-3 w-3" /></button></Badge>
                  )}
                  {currentSort !== 'default' && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs px-2 py-1">Sort: {currentSort.replace('-', ' ')}<button onClick={() => handleSortChange('default')} className="ml-1 hover:text-red-600" aria-label="Remove sort filter"><X className="h-3 w-3" /></button></Badge>
                  )}
                  {currentTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-xs px-2 py-1">
                      <span className="truncate max-w-[80px] sm:max-w-none">{tag}</span>
                      <button onClick={() => handleTagToggle(tag)} className="ml-1 hover:text-red-600" aria-label={`Remove ${tag} filter`}><X className="h-3 w-3" /></button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="space-y-3 text-center text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                {hasActiveFilters ? (
                  <span>
                    Showing {filtered.length} of {projects.length} projects
                    {currentTags.length > 0 && (<span className="block sm:inline"> • for {currentTags.length} tech filter{currentTags.length > 1 ? 's' : ''}</span>)}
                    {currentSearch && (<span className="block sm:inline"> • matching "{currentSearch}"</span>)}
                  </span>
                ) : (
                  <span>Showing all {projects.length} projects</span>
                )}
              </div>
            </div>
          </Container>
        </section>

        {/* Technology Tags */}
        <section className="bg-background py-6">
          <Container className="px-4">
            <div className="space-y-3 text-center">
              <Label className="text-sm font-medium">Filter by Technology:</Label>
              <div className="flex flex-wrap gap-2 justify-center max-h-32 sm:max-h-none overflow-y-auto sm:overflow-visible">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`inline-flex items-center rounded-full px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 min-h-[36px] ${currentTags.includes(tag) ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'}`}
                    aria-pressed={currentTags.includes(tag)}
                    aria-label={`Filter by ${tag} technology`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Projects Grid */}
        <section className="bg-stone-50 py-12 sm:py-16 lg:py-20 dark:bg-stone-900">
          <Container className="px-4 sm:px-6">
            {filtered.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="mx-auto max-w-md px-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">No projects found</h3>
                  <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mb-6">Try adjusting your search criteria or clearing the filters to see all projects.</p>
                  <div className="space-y-2 text-xs sm:text-sm text-stone-500 dark:text-stone-500">
                    <p>• Check your search terms for typos</p>
                    <p>• Try different technology filters</p>
                    <p>• Clear all filters to see everything</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} viewport={{ once: true }} className="mb-12 sm:mb-16 text-center">
                  <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">Projects</h2>
                  <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-400 px-4">
                    {hasActiveFilters ? `Showing ${filtered.length} of ${projects.length} projects` : 'Explore our complete portfolio of projects and case studies.'}
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filtered.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
              </>
            )}
          </Container>
        </section>

        {/* Technologies & Skills */}
        <section className="bg-white py-12 sm:py-16 lg:py-20 dark:bg-stone-950">
          <Container className="px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} viewport={{ once: true }} className="mb-12 sm:mb-16 text-center">
              <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">Technologies & Skills</h2>
              <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-400 px-4">We work with modern technologies to deliver exceptional digital experiences.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { category: 'Frontend', technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
                { category: 'Backend', technologies: ['Node.js', 'Prisma', 'PostgreSQL', 'GraphQL', 'REST APIs'] },
                { category: 'Cloud & DevOps', technologies: ['AWS', 'Vercel', 'Docker', 'CI/CD', 'Monitoring'] },
                { category: 'Design & UX', technologies: ['Figma', 'Accessibility', 'Responsive Design', 'Performance', 'SEO'] },
              ].map((group, i) => (
                <motion.div key={group.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }} viewport={{ once: true }} className="rounded-lg bg-stone-50 p-4 sm:p-6 dark:bg-stone-900">
                  <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100">{group.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs px-2 py-1 border border-stone-200 bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">{tech}</Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Audience-specific CTAs */}
        <AudienceSpecificCTA audience="recruiters" className="bg-stone-50 dark:bg-stone-900" />
        <AudienceSpecificCTA audience="startup-founders" className="bg-white dark:bg-stone-950" />
        <AudienceSpecificCTA audience="clients" className="bg-stone-50 dark:bg-stone-900" />
        <EnhancedCTASection audience="general" />
      </main>
      <Chatbot />
    </Layout>
  );
}

