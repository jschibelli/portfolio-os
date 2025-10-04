/**
 * Component Library Sidebar
 * Hashnode-style component library with categories, search, and drag-and-drop
 */

import React, { useState, useRef } from 'react';
import { Search, Plus, Grid, List, Filter, X, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { blockRegistry, getBlocksByCategory, BLOCK_CATEGORIES } from '@/lib/blocks/registry';

interface ComponentLibrarySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertBlock: (blockType: string) => void;
  onInsertTemplate: (templateId: string) => void;
}

export function ComponentLibrarySidebar({
  isOpen,
  onClose,
  onInsertBlock,
  onInsertTemplate
}: ComponentLibrarySidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Get all available categories
  const categories = ['all', ...Object.values(BLOCK_CATEGORIES)];

  // Filter blocks based on search and category
  const filteredBlocks = Object.entries(blockRegistry).filter(([key, block]) => {
    const matchesSearch = searchQuery === '' || 
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    setDraggedItem(blockType);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', blockType);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData('text/plain');
    if (blockType) {
      onInsertBlock(blockType);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 shadow-lg z-40">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Component Library</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className="pl-10"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8 p-0"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="h-full">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">All</TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-white">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="h-full mt-4">
            {/* Category Filter */}
            <div className="px-4 mb-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'All' : category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Components List */}
            <ScrollArea className="h-full px-4">
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-2 gap-3' 
                  : 'space-y-2'
              }>
                {filteredBlocks.map(([key, block]) => (
                  <div
                    key={key}
                    draggable
                    onDragStart={(e) => handleDragStart(e, key)}
                    onDragEnd={handleDragEnd}
                    className={`
                      ${viewMode === 'grid' 
                        ? 'p-3 border border-gray-200 rounded-lg cursor-grab hover:border-blue-300 hover:shadow-sm transition-all' 
                        : 'flex items-center gap-3 p-2 border border-gray-200 rounded cursor-grab hover:border-blue-300 hover:bg-blue-50 transition-all'
                      }
                      ${draggedItem === key ? 'opacity-50' : ''}
                    `}
                    onClick={() => onInsertBlock(key)}
                  >
                    {viewMode === 'grid' ? (
                      <div className="text-center">
                        <block.icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                        <div className="text-sm font-medium text-gray-900">{block.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{block.description}</div>
                      </div>
                    ) : (
                      <>
                        <block.icon className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{block.name}</div>
                          <div className="text-xs text-gray-500">{block.description}</div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="templates" className="h-full mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-3">
                {/* Hero CTA Template */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'hero-cta')}
                  onDragEnd={handleDragEnd}
                  className="p-3 border border-gray-200 rounded-lg cursor-grab hover:border-blue-300 hover:shadow-sm transition-all"
                  onClick={() => onInsertTemplate('hero-cta')}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                      <Plus className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Hero CTA</div>
                      <div className="text-xs text-gray-500">Complete hero section with call-to-action</div>
                    </div>
                  </div>
                </div>

                {/* Code Showcase Template */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'code-showcase')}
                  onDragEnd={handleDragEnd}
                  className="p-3 border border-gray-200 rounded-lg cursor-grab hover:border-blue-300 hover:shadow-sm transition-all"
                  onClick={() => onInsertTemplate('code-showcase')}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-800 rounded flex items-center justify-center">
                      <Code className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Code Showcase</div>
                      <div className="text-xs text-gray-500">Highlight code with explanation</div>
                    </div>
                  </div>
                </div>

                {/* Media Gallery Template */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'media-gallery')}
                  onDragEnd={handleDragEnd}
                  className="p-3 border border-gray-200 rounded-lg cursor-grab hover:border-blue-300 hover:shadow-sm transition-all"
                  onClick={() => onInsertTemplate('media-gallery')}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-green-500 rounded flex items-center justify-center">
                      <Grid className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Media Gallery</div>
                      <div className="text-xs text-gray-500">Showcase multiple images or videos</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          Drag components to editor or click to insert
        </div>
      </div>
    </div>
  );
}
