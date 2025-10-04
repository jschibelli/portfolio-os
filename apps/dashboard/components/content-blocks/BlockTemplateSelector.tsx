/**
 * Block Template Selector Component
 * Allows users to browse and select from pre-configured block templates
 */

import React, { useState } from 'react';
import { ContentBlock } from '@/lib/blocks/types';
import { BlockTemplate, allTemplates, getTemplatesByCategory, searchTemplates } from '@/lib/blocks/templates';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Grid, 
  List, 
  Star,
  Clock,
  Eye,
  Plus
} from 'lucide-react';

interface BlockTemplateSelectorProps {
  onSelectTemplate: (template: BlockTemplate) => void;
  onClose: () => void;
  className?: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'popular' | 'recent' | 'name';

export function BlockTemplateSelector({ 
  onSelectTemplate, 
  onClose, 
  className = '' 
}: BlockTemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('popular');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Templates', icon: '📦' },
    { id: 'layout', name: 'Layout', icon: '🏗️' },
    { id: 'content', name: 'Content', icon: '📝' },
    { id: 'marketing', name: 'Marketing', icon: '🎯' },
    { id: 'technical', name: 'Technical', icon: '💻' },
    { id: 'social', name: 'Social', icon: '📱' }
  ];

  // Filter and sort templates
  const getFilteredTemplates = (): BlockTemplate[] => {
    let templates = allTemplates;

    // Filter by category
    if (selectedCategory !== 'all') {
      templates = getTemplatesByCategory(selectedCategory as BlockTemplate['category']);
    }

    // Filter by search query
    if (searchQuery) {
      templates = searchTemplates(searchQuery);
    }

    // Sort templates
    switch (sortBy) {
      case 'popular':
        // Popular templates first, then by name
        const popularIds = ['hero-basic', 'article-intro', 'product-showcase', 'code-showcase', 'testimonial-section'];
        templates.sort((a, b) => {
          const aPopular = popularIds.includes(a.id);
          const bPopular = popularIds.includes(b.id);
          if (aPopular && !bPopular) return -1;
          if (!aPopular && bPopular) return 1;
          return a.name.localeCompare(b.name);
        });
        break;
      case 'recent':
        // Sort by creation order (reverse)
        templates.reverse();
        break;
      case 'name':
        templates.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return templates;
  };

  const filteredTemplates = getFilteredTemplates();

  const renderTemplateCard = (template: BlockTemplate) => (
    <Card 
      key={template.id} 
      className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${viewMode === 'list' ? 'flex items-center p-4' : 'p-4'}`}
      onClick={() => onSelectTemplate(template)}
    >
      {viewMode === 'grid' ? (
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{template.icon}</span>
              <div>
                <h3 className="font-semibold text-sm">{template.name}</h3>
                <p className="text-xs text-gray-600">{template.category}</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
          
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{template.blocks.length} blocks</span>
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>Preview</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4 flex-1">
          <span className="text-2xl">{template.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-gray-600 truncate">{template.description}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {template.category}
              </Badge>
              <span className="text-xs text-gray-500">{template.blocks.length} blocks</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Use
            </Button>
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <div className={`block-template-selector ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Choose a Template</h2>
          <p className="text-gray-600">Start with a pre-built layout</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-6">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                <span>{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Sort Options */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="flex items-center space-x-2">
            <Button
              variant={sortBy === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('popular')}
            >
              <Star className="h-4 w-4 mr-1" />
              Popular
            </Button>
            <Button
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
            >
              <Clock className="h-4 w-4 mr-1" />
              Recent
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              Name
            </Button>
          </div>
        </div>
      </div>

      {/* Templates Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'space-y-2'
      }>
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map(renderTemplateCard)
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-6 text-sm text-gray-600 text-center">
        {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}


