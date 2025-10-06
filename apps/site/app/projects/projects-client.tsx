"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Container } from '../../components/shared/container';
import ProjectCard, { Project } from '../../components/features/portfolio/project-card';

import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowRight, Calendar, Code, Users, MapPin, CheckCircle, Search, Award, X } from 'lucide-react';

interface ProjectsPageClientProps {
  initialProjects: Project[];
  allTags: string[];
  projectCount: number;
}

export function ProjectsPageClient({ initialProjects, allTags, projectCount }: ProjectsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const projects: Project[] = useMemo(() => initialProjects, [initialProjects]);

  // Facets
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

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply search filter
    if (currentSearch) {
      filtered = enhancedSearch(currentSearch, filtered);
    }

    // Apply tag filter
    if (currentTags.length > 0) {
      filtered = filtered.filter(project => 
        currentTags.some(tag => project.tags?.includes(tag))
      );
    }

    // Apply category filter
    if (currentCategory) {
      filtered = filtered.filter(project => project.category === currentCategory);
    }

    // Apply status filter
    if (currentStatus) {
      filtered = filtered.filter(project => project.status === currentStatus);
    }

    // Apply technology filter
    if (currentTechnology) {
      filtered = filtered.filter(project => 
        project.technologies?.includes(currentTechnology)
      );
    }

    // Apply client filter
    if (currentClient) {
      filtered = filtered.filter(project => project.client === currentClient);
    }

    // Apply sorting
    switch (currentSort) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'date':
        filtered.sort((a, b) => {
          const dateA = new Date(a.endDate || a.startDate || 0);
          const dateB = new Date(b.endDate || b.startDate || 0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case 'status':
        filtered.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
        break;
      default:
        // Default: most recent first
        filtered.sort((a, b) => {
          const dateA = new Date(a.endDate || a.startDate || 0);
          const dateB = new Date(b.endDate || b.startDate || 0);
          return dateB.getTime() - dateA.getTime();
        });
    }

    return filtered;
  }, [projects, currentSearch, currentTags, currentCategory, currentStatus, currentTechnology, currentClient, currentSort, enhancedSearch]);

  // Get search suggestions
  const searchSuggestions = useMemo(() => {
    if (!currentSearch || currentSearch.length < 2) return [];
    
    const suggestions = new Set<string>();
    projects.forEach(project => {
      if (project.title.toLowerCase().includes(currentSearch.toLowerCase())) {
        suggestions.add(project.title);
      }
      if (project.client?.toLowerCase().includes(currentSearch.toLowerCase())) {
        suggestions.add(project.client);
      }
      project.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(currentSearch.toLowerCase())) {
          suggestions.add(tag);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [currentSearch, projects]);

  return (
    <>
      {/* Filters Section */}
      <section className="py-8 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700">
        <Container className="px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search projects, technologies, or clients..."
                  value={currentSearch}
                  onChange={(e) => {
                    handleSearchChange(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10 pr-4 py-3 text-base border-stone-300 dark:border-stone-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                
                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-md shadow-lg">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-stone-50 dark:hover:bg-stone-700 focus:outline-none focus:bg-stone-50 dark:focus:bg-stone-700"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Sort */}
                <div className="space-y-2">
                  <Label htmlFor="sort" className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Sort by
                  </Label>
                  <Select value={currentSort} onValueChange={handleSortChange}>
                    <SelectTrigger id="sort" className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Most Recent</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Category
                  </Label>
                  <Select value={currentCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {allCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Status
                  </Label>
                  <Select value={currentStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {allStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Technology */}
                <div className="space-y-2">
                  <Label htmlFor="technology" className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Technology
                  </Label>
                  <Select value={currentTechnology} onValueChange={handleTechnologyChange}>
                    <SelectTrigger id="technology" className="w-full">
                      <SelectValue placeholder="All Technologies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Technologies</SelectItem>
                      {allTechnologies.map((tech) => (
                        <SelectItem key={tech} value={tech}>
                          {tech}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Client */}
                <div className="space-y-2">
                  <Label htmlFor="client" className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Client
                  </Label>
                  <Select value={currentClient} onValueChange={handleClientChange}>
                    <SelectTrigger id="client" className="w-full">
                      <SelectValue placeholder="All Clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      {allClients.map((client) => (
                        <SelectItem key={client} value={client}>
                          {client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters */}
              {(currentTags.length > 0 || currentSearch || currentCategory || currentStatus || currentTechnology || currentClient) && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Active filters:</span>
                  
                  {currentSearch && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: {currentSearch}
                      <button
                        onClick={() => handleSearchChange('')}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  
                  {currentTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => handleTagToggle(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  
                  {currentCategory && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Category: {currentCategory}
                      <button
                        onClick={() => handleCategoryChange('all')}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  
                  {currentStatus && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Status: {currentStatus}
                      <button
                        onClick={() => handleStatusChange('all')}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  
                  {currentTechnology && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Tech: {currentTechnology}
                      <button
                        onClick={() => handleTechnologyChange('all')}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  
                  {currentClient && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Client: {currentClient}
                      <button
                        onClick={() => handleClientChange('all')}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateFilters({ search: null, tags: null, category: null, status: null, technology: null, client: null });
                    }}
                    className="text-xs"
                  >
                    Clear all
                  </Button>
                </div>
              )}

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Showing {filteredProjects.length} of {projectCount} projects
                </p>
                
                {/* Tag Cloud */}
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        currentTags.includes(tag)
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  {allTags.length > 10 && (
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      +{allTags.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Projects Grid */}
      <section className="py-12 sm:py-16 md:py-20">
        <Container className="px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                    No projects found
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 mb-4">
                    Try adjusting your search or filter criteria.
                  </p>
                  <Button
                    onClick={() => {
                      updateFilters({ search: null, tags: null, category: null, status: null, technology: null, client: null });
                    }}
                    variant="outline"
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
